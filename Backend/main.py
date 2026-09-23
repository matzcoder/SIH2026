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
import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from config import CORS_ORIGINS, CORS_ORIGIN_REGEX, UPLOAD_DIR, IS_PRODUCTION
from database import engine, SessionLocal, Base, get_db, InspectionRecord, RuleRecord
from models.db_models import *  # Ensure all models are registered with Base
from routes import auth, products, inspections, complaints, rules, analysis
from services.seed_data import seed_database
from services.vision import warm_up_ocr

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

    logger.info("Seeding initial reference data...")
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    logger.info("Pre-warming OCR engine in background thread...")
    try:
        warm_up_ocr()
    except Exception as exc:
        logger.warning(f"OCR warm-up non-critical warning: {exc}")

    yield

    logger.info("Shutting down Legal Metrology API service.")


app = FastAPI(
    title="Legal Metrology Compliance API",
    version="2.0.0",
    description="High-performance backend for packaged commodities statutory declaration compliance.",
    lifespan=lifespan,
)

# Configure CORS for React frontend and ngrok remote tunnels
_cors_kwargs = dict(
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
if CORS_ORIGIN_REGEX:
    _cors_kwargs["allow_origin_regex"] = CORS_ORIGIN_REGEX

app.add_middleware(CORSMiddleware, **_cors_kwargs)


# Structured Request Logging with Correlation IDs
@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next):
    correlation_id = request.headers.get("X-Correlation-ID") or uuid.uuid4().hex[:10]
    start_time = time.time()

    response = await call_next(request)

    duration_ms = round((time.time() - start_time) * 1000, 2)
    response.headers["X-Correlation-ID"] = correlation_id

    # Suppress verbose log for health check
    if request.url.path not in ("/health", "/api/health"):
        logger.info(
            f"[{correlation_id}] {request.method} {request.url.path} -> {response.status_code} ({duration_ms}ms)"
        )
    return response


# Mount uploads directory for static media & evidence files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


# Mount API Routers (DRY & Consolidated)
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(inspections.router, prefix="/api")
app.include_router(inspections.router)  # Fallback for /inspections/submit and /inspections
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
