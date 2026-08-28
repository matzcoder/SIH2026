"""
Application configuration for the Legal Metrology Compliance Backend.
"""
from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

EVIDENCE_DIR = UPLOAD_DIR / "evidence"
EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)

PRODUCT_DIR = UPLOAD_DIR / "products"
PRODUCT_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'compliance.db'}")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "legal-metrology-secret-key-2026-super-secure")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5173",
]
CORS_ORIGIN_REGEX = r"https?://.*"
