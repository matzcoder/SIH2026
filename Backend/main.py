"""
FastAPI Entrypoint for the Legal Metrology (Packaged Commodities) Compliance System.

This backend serves:
- /api/auth: Authentication & User Profiles
- /api/products: Product OCR scanning, history, compliance checks, and violations
- /api/inspections: Inspection assignments, evidence management, submissions, reports, analytics
- /api/complaints: Consumer complaints filing, review, and assignment
- /api/rules & /api/amendments: Compliance rule engine & statutory amendments
- /api/v1/analyze & /health: Concept compliance checker endpoints
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import CORS_ORIGINS, CORS_ORIGIN_REGEX, UPLOAD_DIR
from database import engine, SessionLocal, Base
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
    title="Legal Metrology Compliance Checker & Enforcement API",
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
    allow_origin_regex=CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "ngrok-skip-browser-warning"],
    expose_headers=["*", "Content-Disposition"],
)

# Mount uploads directory for static media & evidence files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

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
