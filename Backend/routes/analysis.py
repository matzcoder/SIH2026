"""
Concept / Core Analysis Router (POST /api/v1/analyze & GET /health)
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, File, HTTPException, UploadFile
from models.schemas import AnalysisResponse, HealthResponse
from services import parser, rules, vision

logger = logging.getLogger("legal_metrology_api")

router = APIRouter(tags=["Analysis"])

_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"}
_MAX_UPLOAD_BYTES = 15 * 1024 * 1024  # 15 MB


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Lightweight liveness probe and OCR engine status check."""
    return HealthResponse(status="ok", ocr_engine_loaded=vision.is_ocr_ready())


@router.post("/api/v1/analyze", response_model=AnalysisResponse)
async def analyze_package(file: UploadFile = File(...)) -> AnalysisResponse:
    """
    Direct statutory compliance analysis endpoint from the concept backend.
    Accepts an image of a packaged commodity and returns:
      - extracted_data: parsed statutory fields
      - bounding_boxes: OCR detections mapped to fields
      - compliance_report: pass/fail verdict per Legal Metrology rule
      - overall_score / status: aggregate compliance verdict
    """
    if file.content_type and file.content_type not in _ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported content type '{file.content_type}'. Allowed: {sorted(_ALLOWED_CONTENT_TYPES)}",
        )

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(image_bytes) > _MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Uploaded file exceeds the 15 MB limit.")

    try:
        preprocessed = vision.preprocess_image(image_bytes)
    except Exception as exc:
        logger.exception("Image preprocessing failed")
        raise HTTPException(status_code=400, detail=f"Could not decode/preprocess image: {exc}") from exc

    try:
        ocr_chunks = vision.run_ocr(preprocessed, filename=file.filename)
    except Exception as exc:
        logger.exception("OCR failed")
        raise HTTPException(status_code=500, detail=f"OCR engine error: {exc}") from exc

    try:
        barcodes = vision.decode_barcodes(preprocessed)
    except Exception:
        barcodes = []

    if not ocr_chunks:
        if not vision.is_ocr_ready():
            raise HTTPException(
                status_code=503,
                detail="OCR engine is still loading. Please wait a few seconds and try again.",
            )
        raise HTTPException(
            status_code=422,
            detail="No readable text detected in the image. Please retake in better lighting/focus.",
        )

    extraction = parser.extract_entities(ocr_chunks)

    if barcodes:
        logger.info("Decoded %d barcode(s): %s", len(barcodes), [b["data"] for b in barcodes])

    extracted_data = rules.build_extracted_data(extraction)
    bounding_boxes = rules.build_bounding_boxes(extraction)
    compliance_report = rules.run_compliance_checks(extraction)
    score, status = rules.compute_score_and_status(compliance_report)

    return AnalysisResponse(
        status=status,
        overall_score=score,
        extracted_data=extracted_data,
        bounding_boxes=bounding_boxes,
        compliance_report=compliance_report,
    )
