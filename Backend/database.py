"""
Database connection and session management using SQLAlchemy for Legal Metrology System.
"""
from __future__ import annotations

import datetime
from typing import Generator
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    Text,
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from config import DATABASE_URL

# SQLite requires check_same_thread=False for multithreaded FastAPI requests
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class InspectionRecord(Base):
    __tablename__ = "inspection_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    commodity_name = Column(String, default="Packaged Commodity")
    dietary_type = Column(String, default="VEG")  # VEG, NON_VEG, NON_FOOD
    officer_name = Column(String, default="Field Inspector")
    district_zone = Column(String, default="Chennai South")
    compliance_score = Column(Float, default=0.0)
    status = Column(String, default="COMPLIANT")  # COMPLIANT or VIOLATION
    violations_count = Column(Integer, default=0)
    inspector_notes = Column(Text, nullable=True)
    raw_results_json = Column(Text, nullable=True)  # Serialized JSON array of rules & OCR text
    signature_url = Column(Text, nullable=True)  # Base64 digital signature
    image_url = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class RuleRecord(Base):
    __tablename__ = "statutory_rules"

    id = Column(String, primary_key=True)
    code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    mandatory = Column(Boolean, default=True)
    category = Column(String, default="ALL")  # ALL, FOOD_ONLY
    regex_pattern = Column(Text, nullable=True)
    description = Column(Text, nullable=True)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a SQLAlchemy database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Auto-create tables on import
Base.metadata.create_all(bind=engine)
