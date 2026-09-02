"""
FastAPI Entrypoint for the Legal Metrology (Packaged Commodities) Compliance System.

This backend serves:
- /api/auth: Authentication & User Profiles
- /api/products: Product OCR scanning, history, compliance checks, and violations
- /api/inspections: Inspection assignments, evidence management, submissions, reports, analytics
- /api/complaints: Consumer complaints filing, review, and assignment
- /api/rules & /api/amendments: Compliance rule engine & statutory amendments
- /api/v1/analyze & /health: Concept compliance checker endpoints
- /api/inspections/submit, /api/inspections, /api/analytics/overview: Persistent DB & Real-Time Sync
"""
from __future__ import annotations

import json
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from config import CORS_ORIGINS, CORS_ORIGIN_REGEX, UPLOAD_DIR
from database import engine, SessionLocal, Base, get_db, InspectionRecord, RuleRecord
from models.db_models import *  # Ensure all models are registered with Base
from routes import auth, products, inspections, complaints, rules, analysis
from services.seed_data import seed_database

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("legal_metrology_backend")


# Ensure tables exist immediately upon import as well as lifespan
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle handler."""
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    
    # Populate seed data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    logger.info("Legal Metrology Compliance Backend is ready!")
    yield
    logger.info("Shutting down backend...")


app = FastAPI(
    title="LM-Vision Backend API",
    description=(
        "Automated OCR-driven compliance checking, inspection tracking, rule management, "
        "and consumer grievance platform under the Legal Metrology (Packaged Commodities) Rules, 2011."
    ),
    version="2.0.0",
    lifespan=lifespan,
)

# Configure CORS for React frontend and ngrok remote tunnels
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "ngrok-skip-browser-warning"],
    expose_headers=["*", "Content-Disposition"],
)

# Mount uploads directory for static media & evidence files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


# =====================================================================
# 1. Persistent Database Endpoints (LM-Vision Real-Time Sync Protocol)
# =====================================================================

@app.post("/api/inspections/submit")
@app.post("/inspections/submit")
def submit_inspection(payload: dict, db: Session = Depends(get_db)):
    """Record an inspection and commit to SQLite database."""
    violations = payload.get("violations", [])
    results = payload.get("results", [])

    passed_count = sum(1 for r in results if r.get("status") == "PASS")
    total_count = len(results) if results else 1
    score = round((passed_count / total_count) * 100, 1)

    record = InspectionRecord(
        commodity_name=payload.get("commodityName", "Packaged Commodity"),
        dietary_type=payload.get("dietaryType", "VEG"),
        officer_name=payload.get("officerName", "Field Inspector"),
        district_zone=payload.get("districtZone", "General Zone"),
        compliance_score=score,
        status="VIOLATION" if len(violations) > 0 else "COMPLIANT",
        violations_count=len(violations),
        inspector_notes=payload.get("inspectorNotes", ""),
        raw_results_json=json.dumps(results),
        signature_url=payload.get("signatureUrl", None),
        image_url=payload.get("imageUrl", ""),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {"status": "success", "id": record.id, "score": score}


@app.get("/api/inspections")
@app.get("/inspections")
def get_saved_inspections(db: Session = Depends(get_db)):
    """Retrieve all saved inspection records from SQLite database."""
    records = db.query(InspectionRecord).order_by(InspectionRecord.timestamp.desc()).all()
    output = []
    for r in records:
        output.append({
            "id": r.id,
            "commodityName": r.commodity_name,
            "dietaryType": r.dietary_type,
            "officerName": r.officer_name,
            "districtZone": r.district_zone,
            "complianceScore": r.compliance_score,
            "status": r.status,
            "violationsCount": r.violations_count,
            "inspectorNotes": r.inspector_notes,
            "results": json.loads(r.raw_results_json) if r.raw_results_json else [],
            "timestamp": r.timestamp.isoformat() if r.timestamp else "",
        })
    return output


@app.get("/api/analytics/overview")
@app.get("/analytics/overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    """Dynamic aggregated analytics from SQLite database."""
    total = db.query(InspectionRecord).count()
    violations = db.query(InspectionRecord).filter(InspectionRecord.status == "VIOLATION").count()
    compliant = total - violations
    rate = round((compliant / total * 100), 1) if total > 0 else 100.0
    veg_count = db.query(InspectionRecord).filter(InspectionRecord.dietary_type == "VEG").count()
    non_veg_count = db.query(InspectionRecord).filter(InspectionRecord.dietary_type == "NON_VEG").count()

    return {
        "totalScans": total,
        "complianceRate": rate,
        "noticesIssued": violations,
        "dietaryBreakdown": {
            "veg": veg_count,
            "nonVeg": non_veg_count,
            "nonFood": total - (veg_count + non_veg_count),
        },
    }


# Mount API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(inspections.router, prefix="/api")
app.include_router(complaints.router, prefix="/api")
app.include_router(rules.rules_router, prefix="/api")
app.include_router(rules.amendments_router, prefix="/api")
app.include_router(analysis.router)


@app.get("/")
def root_status() -> dict[str, str]:
    """Root status probe."""
    return {
        "system": "Legal Metrology Compliance Checker API",
        "status": "online",
        "version": "2.0.0",
        "documentation": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
