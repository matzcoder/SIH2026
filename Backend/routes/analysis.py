"""
Analysis Router (/api/v1/analyze, /health, and /analytics/overview)
"""
from __future__ import annotations

import asyncio
import logging
from typing import Any, Optional
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database import get_db, InspectionRecord
from models.schemas import AnalysisResponse, HealthResponse, AnalyticsOverviewResponse, DietaryBreakdown
from services import parser, rules, vision
from services.cache import vision_cache

logger = logging.getLogger("legal_metrology_api")

router = APIRouter(tags=["Analysis"])

_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"}
_MAX_UPLOAD_BYTES = 15 * 1024 * 1024  # 15 MB


def _sync_analyze_image(raw_bytes: bytes, filename: Optional[str]):
    """Sync image analysis executed in worker thread pool."""
    image_hash = vision_cache.compute_hash(raw_bytes)
    cached = vision_cache.get(image_hash)
    if cached is not None:
        logger.info("Serving analysis from cache (hash=%s)", image_hash[:12])
        return cached.get("ocr_chunks", []), cached.get("barcodes", [])

    preprocessed = vision.preprocess_image(raw_bytes)
    ocr_chunks = vision.run_ocr(preprocessed, filename=filename) if preprocessed is not None else []
    try:
        barcodes = vision.decode_barcodes(preprocessed) if preprocessed is not None else []
    except Exception:
        barcodes = []

    vision_cache.put(image_hash, {"ocr_chunks": ocr_chunks, "barcodes": barcodes})
    return ocr_chunks, barcodes


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Lightweight liveness probe and OCR engine status check."""
    return HealthResponse(status="ok", ocr_engine_loaded=vision.is_ocr_ready())


@router.post("/api/v1/analyze", response_model=AnalysisResponse)
async def analyze_package(file: UploadFile = File(...)) -> AnalysisResponse:
    """
    Direct statutory compliance analysis endpoint.
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
        ocr_chunks, barcodes = await asyncio.to_thread(
            _sync_analyze_image, image_bytes, file.filename
        )
    except Exception as exc:
        logger.exception("Image analysis failed")
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {exc}") from exc

    if not ocr_chunks:
        if not vision.is_ocr_ready():
            raise HTTPException(
                status_code=503,
                detail="OCR engine is still loading. Please wait a few seconds and try again.",
            )
        # No text detected on package surface — evaluate statutory rules against empty extraction
        extraction = parser.extract_entities([])
        extracted_data = rules.build_extracted_data(extraction)
        compliance_report = rules.run_compliance_checks(extraction)
        score, comp_status = rules.compute_score_and_status(compliance_report)
        return AnalysisResponse(
            status=comp_status,
            overall_score=score,
            extracted_data=extracted_data,
            bounding_boxes=[],
            compliance_report=compliance_report,
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


@router.get("/api/analytics/overview", response_model=AnalyticsOverviewResponse)
@router.get("/analytics/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(db: Session = Depends(get_db)) -> AnalyticsOverviewResponse:
    """Dynamic aggregated analytics from SQLite/PostgreSQL database."""
    total = db.query(InspectionRecord).count()
    violations = db.query(InspectionRecord).filter(InspectionRecord.status == "VIOLATION").count()
    compliant = total - violations
    rate = round((compliant / total * 100), 1) if total > 0 else 100.0
    veg_count = db.query(InspectionRecord).filter(InspectionRecord.dietary_type == "VEG").count()
    non_veg_count = db.query(InspectionRecord).filter(InspectionRecord.dietary_type == "NON_VEG").count()
    non_food_count = max(0, total - (veg_count + non_veg_count))

    return AnalyticsOverviewResponse(
        totalScans=total,
        complianceRate=rate,
        noticesIssued=violations,
        dietaryBreakdown=DietaryBreakdown(
            veg=veg_count,
            nonVeg=non_veg_count,
            nonFood=non_food_count,
        ),
    )
