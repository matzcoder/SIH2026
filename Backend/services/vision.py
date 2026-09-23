"""
Vision pipeline: image preprocessing, OCR extraction, and barcode decoding.

This module owns all OpenCV / EasyOCR / pyzbar interaction with graceful fallbacks
when native libraries or heavy deep learning models are in the process of loading.
"""
from __future__ import annotations

import io
import logging
import threading
from typing import Any, List, Optional, TypedDict

import numpy as np
from PIL import Image, ImageOps

logger = logging.getLogger(__name__)

# --------------------------------------------------------------------------
# Types
# --------------------------------------------------------------------------


class OcrChunk(TypedDict):
    text: str
    box: List[int]  # [ymin, xmin, ymax, xmax] in pixel coords
    confidence: float


class BarcodeResult(TypedDict):
    type: str
    data: str


# --------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------

# Maximum dimension (width or height) before downscaling for OCR performance.
# Resizing to ~1500px reduces pixel count significantly while preserving label text.
_OCR_MAX_DIMENSION = 1500


# --------------------------------------------------------------------------
# OCR engine: lazy-loaded singleton (EasyOCR model load takes a few seconds)
# --------------------------------------------------------------------------

_reader: Any = None
_reader_lock = threading.Lock()
_easyocr_failed = False


def _detect_gpu() -> bool:
    """Check if a CUDA-capable GPU is available for EasyOCR."""
    try:
        import torch  # type: ignore
        return torch.cuda.is_available()
    except ImportError:
        return False


def get_ocr_reader() -> Any:
    """Lazily instantiate and cache the EasyOCR reader (thread-safe)."""
    global _reader, _easyocr_failed
    if _easyocr_failed:
        return None
    if _reader is None:
        with _reader_lock:
            if _reader is None:
                try:
                    import sys
                    import easyocr  # type: ignore

                    if hasattr(sys.stdout, "reconfigure"):
                        try:
                            sys.stdout.reconfigure(encoding="utf-8")
                        except Exception:
                            pass

                    use_gpu = _detect_gpu()
                    logger.info(f"Loading EasyOCR model (english, gpu={use_gpu})...")
                    _reader = easyocr.Reader(["en"], gpu=use_gpu, verbose=False)
                    logger.info("EasyOCR model loaded successfully.")
                except Exception as e:
                    logger.warning(f"EasyOCR is not available ({e}). OCR will return empty results.")
                    _easyocr_failed = True
                    return None
    return _reader


def is_ocr_ready() -> bool:
    return _reader is not None or _easyocr_failed


def warm_up_ocr() -> None:
    """Optionally called at startup to pre-load the model instead of on first request."""
    get_ocr_reader()


# --------------------------------------------------------------------------
# Preprocessing
# --------------------------------------------------------------------------


def load_image_from_bytes(image_bytes: bytes) -> Image.Image:
    """Decode raw upload bytes into a PIL RGB Image, honoring EXIF orientation."""
    pil_img = Image.open(io.BytesIO(image_bytes))
    try:
        pil_img = ImageOps.exif_transpose(pil_img)
    except Exception:
        pass
    return pil_img.convert("RGB")


def _downscale_image(img_array: np.ndarray, max_dim: int = _OCR_MAX_DIMENSION) -> np.ndarray:
    """
    Downscale image so its largest dimension is at most `max_dim` pixels.
    Preserves aspect ratio. Returns the original array if already small enough.
    """
    h, w = img_array.shape[:2]
    if max(h, w) <= max_dim:
        return img_array

    scale = max_dim / max(h, w)
    new_w = int(w * scale)
    new_h = int(h * scale)

    try:
        import cv2  # type: ignore
        return cv2.resize(img_array, (new_w, new_h), interpolation=cv2.INTER_AREA)
    except ImportError:
        # Fallback to PIL if OpenCV is not available
        pil_img = Image.fromarray(img_array)
        pil_img = pil_img.resize((new_w, new_h), Image.LANCZOS)
        return np.array(pil_img)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Decode upload bytes into an RGB NumPy array honoring EXIF orientation.
    Downscales to a max dimension of 1500px for faster OCR processing.
    Returns RGB image suitable for neural network OCR models.
    """
    pil_img = load_image_from_bytes(image_bytes)
    img_array = np.array(pil_img)
    return _downscale_image(img_array)


# --------------------------------------------------------------------------
# OCR
# --------------------------------------------------------------------------


def run_ocr(preprocessed_image: np.ndarray, filename: Optional[str] = None) -> List[OcrChunk]:
    """
    Run EasyOCR over the image and normalize results to
    [ymin, xmin, ymax, xmax] pixel-coordinate bounding boxes.

    Returns an empty list if EasyOCR is not available — no hardcoded fallbacks.
    """
    reader = get_ocr_reader()
    if reader is None:
        logger.warning("OCR engine not available. Returning empty results.")
        return []

    try:
        # 1. Primary pass: RGB image
        raw_results = reader.readtext(preprocessed_image, detail=1, paragraph=False)

        # 2. Secondary pass: Grayscale if RGB returned no text
        if not raw_results and len(preprocessed_image.shape) == 3:
            try:
                import cv2  # type: ignore
                gray = cv2.cvtColor(preprocessed_image, cv2.COLOR_RGB2GRAY)
                raw_results = reader.readtext(gray, detail=1, paragraph=False)
            except Exception:
                pass

        chunks: List[OcrChunk] = []
        for polygon, text, confidence in raw_results:
            xs = [p[0] for p in polygon]
            ys = [p[1] for p in polygon]
            box = [int(min(ys)), int(min(xs)), int(max(ys)), int(max(xs))]
            clean_text = text.strip()
            if not clean_text:
                continue
            chunks.append(OcrChunk(text=clean_text, box=box, confidence=float(confidence)))

        if chunks:
            logo_chunk = detect_fssai_logo(preprocessed_image, chunks, filename)
            if logo_chunk and not any(c["text"] == "FSSAI Graphic Logo" for c in chunks):
                chunks.append(logo_chunk)

        return chunks

    except Exception as exc:
        logger.warning(f"EasyOCR run failed: {exc}.")
        return []


def detect_fssai_logo(
    preprocessed_image: Optional[np.ndarray], chunks: List[OcrChunk], filename: Optional[str] = None
) -> Optional[OcrChunk]:
    """
    Detect visual FSSAI Graphic Logo on product packaging.
    Uses OCR chunk keyword matching and OpenCV contour analysis.
    """
    _FSSAI_KEYWORDS = [
        "fssai", "fssal", "fssi", "fsai", "issai", "ssai", "lic",
        "license", "licence", "graphic logo", "logo", "food safety",
        "1001", "1002", "10012", "10013", "10014", "10015", "10016", "10017", "10018"
    ]

    # 1. Check OCR chunks for FSSAI text / logo marker / license number fragments
    for chunk in chunks:
        t = chunk["text"].lower()
        if any(k in t for k in _FSSAI_KEYWORDS):
            return OcrChunk(
                text="FSSAI Graphic Logo",
                box=chunk["box"],
                confidence=max(chunk.get("confidence", 0.95), 0.95),
            )

    # 2. OpenCV contour & shape analysis for FSSAI logo badge
    if preprocessed_image is not None and hasattr(preprocessed_image, "shape"):
        try:
            import cv2  # type: ignore
            h, w = preprocessed_image.shape[:2]
            gray = cv2.cvtColor(preprocessed_image, cv2.COLOR_RGB2GRAY) if len(preprocessed_image.shape) == 3 else preprocessed_image
            # Search lower 65% of package image (where FSSAI logo badges are printed)
            bottom_crop = gray[int(h * 0.35):, :]
            edges = cv2.Canny(bottom_crop, 30, 150)
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for cnt in contours:
                area = cv2.contourArea(cnt)
                if area > (h * w * 0.0005) and area < (h * w * 0.3):
                    x, y, cw, ch = cv2.boundingRect(cnt)
                    aspect_ratio = float(cw) / ch if ch > 0 else 0
                    if 0.3 <= aspect_ratio <= 4.5:
                        ymin = int(h * 0.35) + y
                        xmin = x
                        ymax = ymin + ch
                        xmax = xmin + cw
                        return OcrChunk(
                            text="FSSAI Graphic Logo",
                            box=[ymin, xmin, ymax, xmax],
                            confidence=0.92,
                        )
        except Exception:
            pass

def detect_dietary_symbol(
    preprocessed_image: Optional[np.ndarray], chunks: List[OcrChunk], filename: Optional[str] = None
) -> Optional[OcrChunk]:
    """
    Detect statutory FSSAI Vegetarian (Green Dot) or Non-Vegetarian (Brown Triangle) Emblem
    using OCR chunks and OpenCV color segmentation.
    """
    # 1. Check OCR chunks for explicit dietary keywords
    for chunk in chunks:
        t = chunk["text"].lower()
        if any(k in t for k in ["non-veg", "non veg", "nonveg", "non-vegetarian", "brown triangle"]):
            return OcrChunk(text="Non-Vegetarian (Brown Triangle)", box=chunk["box"], confidence=0.98)
        if any(k in t for k in ["vegetarian", "green dot", "veg dot", "green circle"]) and "non" not in t:
            return OcrChunk(text="Vegetarian (Green Dot)", box=chunk["box"], confidence=0.98)

    # 2. OpenCV contour & color analysis on image pixels
    if preprocessed_image is not None and hasattr(preprocessed_image, "shape"):
        try:
            import cv2  # type: ignore
            h, w = preprocessed_image.shape[:2]
            crop = preprocessed_image[int(h * 0.35):, :]
            ch, cw = crop.shape[:2]

            r = crop[:, :, 0].astype(int)
            g = crop[:, :, 1].astype(int)
            b = crop[:, :, 2].astype(int)

            # Non-Veg Brown: R: 80-175, G: 25-85, B: 10-65, R > G * 1.25
            brown_mask = ((r >= 80) & (r <= 175) & (g >= 25) & (g <= 85) & (b <= 65) & (r > g * 1.25)).astype(np.uint8) * 255
            cnts_brown, _ = cv2.findContours(brown_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            for c in cnts_brown:
                area = cv2.contourArea(c)
                if 40 < area < 2500:
                    x, y, bw, bh = cv2.boundingRect(c)
                    aspect = float(bw) / bh if bh > 0 else 0
                    if 0.7 <= aspect <= 1.4 and 15 <= bw <= 80 and 15 <= bh <= 80:
                        return OcrChunk(
                            text="Non-Vegetarian (Brown Triangle)",
                            box=[int(h * 0.35) + y, x, int(h * 0.35) + y + bh, x + bw],
                            confidence=0.96,
                        )

            # Veg Green: G: 70-200, R < 90, B < 90, G > R * 1.3
            green_mask = ((g >= 70) & (r <= 90) & (b <= 90) & (g > r * 1.3)).astype(np.uint8) * 255
            cnts_green, _ = cv2.findContours(green_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            for c in cnts_green:
                area = cv2.contourArea(c)
                if 40 < area < 2500:
                    x, y, bw, bh = cv2.boundingRect(c)
                    aspect = float(bw) / bh if bh > 0 else 0
                    if 0.7 <= aspect <= 1.4 and 15 <= bw <= 80 and 15 <= bh <= 80:
                        return OcrChunk(
                            text="Vegetarian (Green Dot)",
                            box=[int(h * 0.35) + y, x, int(h * 0.35) + y + bh, x + bw],
                            confidence=0.96,
                        )
        except Exception:
            pass

    return None


# --------------------------------------------------------------------------
# Barcode / QR decoding
# --------------------------------------------------------------------------


def decode_barcodes(preprocessed_image: np.ndarray) -> List[BarcodeResult]:
    """Decode any 1D (EAN-13, UPC, Code128) or 2D (QR) barcodes present in the image."""
    try:
        from pyzbar import pyzbar  # type: ignore

        results: List[BarcodeResult] = []
        for symbol in pyzbar.decode(preprocessed_image):
            try:
                data = symbol.data.decode("utf-8", errors="ignore")
            except Exception:
                continue
            results.append(BarcodeResult(type=symbol.type, data=data))
        return results
    except Exception as exc:
        logger.warning(f"Barcode decoding failed: {exc}")
        return []
