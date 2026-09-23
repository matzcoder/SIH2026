"""
Application configuration for the Legal Metrology Compliance Backend.
"""
from __future__ import annotations

import logging
import os
import sys
from pathlib import Path

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

EVIDENCE_DIR = UPLOAD_DIR / "evidence"
EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)

PRODUCT_DIR = UPLOAD_DIR / "products"
PRODUCT_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'compliance.db'}")

# ---------------------------------------------------------------------------
# Environment detection
# ---------------------------------------------------------------------------
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
IS_PRODUCTION = ENVIRONMENT in ("production", "prod")

# ---------------------------------------------------------------------------
# JWT Configuration — fail-fast if using insecure defaults in production
# ---------------------------------------------------------------------------
_INSECURE_DEFAULT_KEY = "legal-metrology-secret-key-2026-super-secure"
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", _INSECURE_DEFAULT_KEY)

if IS_PRODUCTION and JWT_SECRET_KEY == _INSECURE_DEFAULT_KEY:
    logger.critical(
        "FATAL: JWT_SECRET_KEY is set to the insecure default in production. "
        "Set the JWT_SECRET_KEY environment variable to a strong, unique secret."
    )
    sys.exit(1)

JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# ---------------------------------------------------------------------------
# Upload validation
# ---------------------------------------------------------------------------
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5173",
]

# Allow additional CORS origins via comma-separated env var
_extra_origins = os.getenv("CORS_EXTRA_ORIGINS", "")
if _extra_origins:
    CORS_ORIGINS.extend([o.strip() for o in _extra_origins.split(",") if o.strip()])

# In production, do NOT use a wildcard regex — only explicit origins are allowed.
# In development, allow ngrok tunnels via regex.
CORS_ORIGIN_REGEX = None if IS_PRODUCTION else r"https?://.*\.ngrok(-free)?\.app"
