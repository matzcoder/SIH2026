"""
SQLAlchemy Database Models for Legal Metrology Packaged Commodities System.
"""
from __future__ import annotations

import json
from datetime import datetime
from typing import Any, List, Optional
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    ForeignKey,
    Boolean,
)
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="inspector")  # 'inspector', 'authority', 'user'
    status = Column(String(50), nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    brand = Column(String(100), nullable=True)
    category = Column(String(100), nullable=False, default="Packaged Commodity")
    description = Column(Text, nullable=True)
    manufacturer = Column(String(255), nullable=True)
    batch_number = Column(String(100), nullable=True)
    net_quantity = Column(String(100), nullable=True)
    mrp = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False, default="compliant")  # 'compliant', 'review', 'violation', 'non_compliant'
    score = Column(Float, nullable=False, default=100.0)
    last_checked = Column(String(100), nullable=True)
    barcode = Column(String(100), nullable=True, index=True)
    image_url = Column(String(500), nullable=True)
    
    # Store raw structured analysis data as JSON text
    extracted_data_json = Column(Text, nullable=True)
    bounding_boxes_json = Column(Text, nullable=True)
    compliance_report_json = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        extracted_data = json.loads(self.extracted_data_json) if self.extracted_data_json else None
        bounding_boxes = json.loads(self.bounding_boxes_json) if self.bounding_boxes_json else []
        compliance_report = json.loads(self.compliance_report_json) if self.compliance_report_json else []

        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "category": self.category,
            "description": self.description,
            "manufacturer": self.manufacturer,
            "batchNumber": self.batch_number,
            "netQuantity": self.net_quantity,
            "mrp": self.mrp,
            "status": self.status,
            "score": self.score,
            "overall_score": self.score,
            "lastChecked": self.last_checked or (self.created_at.strftime("%d %b %Y") if self.created_at else "Today"),
            "barcode": self.barcode,
            "image_url": self.image_url,
            "extracted_data": extracted_data,
            "bounding_boxes": bounding_boxes,
            "compliance_report": compliance_report,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String(50), primary_key=True, index=True)  # e.g. "INS-1029", "INS001"
    product = Column(String(200), nullable=False)
    brand = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)
    product_id = Column(Integer, nullable=True)
    inspector = Column(String(100), nullable=True, default="Field Officer")
    inspector_id = Column(Integer, nullable=True)
    location = Column(String(100), nullable=False, default="Chennai")
    date = Column(String(100), nullable=True)
    assigned_date = Column(String(100), nullable=True)
    deadline = Column(String(100), nullable=True)
    priority = Column(String(50), nullable=False, default="Medium")  # 'High', 'Medium', 'Low'
    status = Column(String(50), nullable=False, default="Pending")  # 'Pending', 'In Progress', 'Completed', 'Under Review', 'Violation Found'
    score = Column(Float, nullable=True, default=0.0)
    passed_count = Column(Integer, default=0)
    failed_count = Column(Integer, default=0)
    evidence_count = Column(Integer, default=0)
    observation = Column(Text, nullable=True)
    checklist_json = Column(Text, nullable=True)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    evidences = relationship("Evidence", back_populates="inspection", cascade="all, delete-orphan")

    def to_dict(self) -> dict[str, Any]:
        checklist = json.loads(self.checklist_json) if self.checklist_json else {
            "mrp": True,
            "quantity": True,
            "manufacturer": True,
            "packingDate": False,
            "consumerCare": True,
            "countryOrigin": True,
        }
        score_display = f"{int(self.score)}%" if self.score is not None else "-"
        return {
            "id": self.id,
            "product": self.product,
            "productName": self.product,
            "brand": self.brand,
            "category": self.category or "Packaged Food",
            "productId": self.product_id,
            "inspector": self.inspector,
            "inspectorId": self.inspector_id,
            "location": self.location,
            "date": self.date or (self.created_at.strftime("%d %b %Y") if self.created_at else "25 Aug 2026"),
            "assignedDate": self.assigned_date or self.date,
            "deadline": self.deadline or self.date,
            "priority": self.priority,
            "status": self.status,
            "score": score_display,
            "numericScore": self.score,
            "compliance": score_display,
            "passed": self.passed_count,
            "failed": self.failed_count,
            "violations": self.failed_count,
            "evidence": len(self.evidences) if self.evidences else self.evidence_count,
            "observation": self.observation or "",
            "checklist": checklist,
            "remarks": self.remarks or "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    inspection_id = Column(String(50), ForeignKey("inspections.id"), nullable=False, index=True)
    product_id = Column(Integer, nullable=True)
    name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    type = Column(String(50), nullable=False, default="image/jpeg")  # MIME type or 'PDF', 'Image'
    size = Column(String(50), nullable=True, default="1.2 MB")
    evidence_type = Column(String(50), nullable=True, default="image")
    description = Column(Text, nullable=True)
    uploaded_by = Column(String(100), nullable=True, default="Inspector")
    uploaded_at = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False, default="verified")  # 'verified', 'pending', 'rejected'
    created_at = Column(DateTime, default=datetime.utcnow)

    inspection = relationship("Inspection", back_populates="evidences")

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "inspectionId": self.inspection_id,
            "productId": self.product_id,
            "name": self.name,
            "url": self.file_url,
            "fileUrl": self.file_url,
            "type": "PDF" if "pdf" in (self.type or "").lower() else "Image",
            "mimeType": self.type,
            "size": self.size,
            "uploadedBy": self.uploaded_by,
            "uploadedAt": self.uploaded_at or (self.created_at.strftime("%d %b %Y") if self.created_at else "Today"),
            "status": self.status,
            "description": self.description or "",
        }


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String(50), primary_key=True, index=True)  # e.g. "CMP001"
    product = Column(String(200), nullable=False)
    user_id = Column(Integer, nullable=True)
    user = Column(String(100), nullable=False, default="Consumer")
    email = Column(String(255), nullable=True)
    issue = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String(50), nullable=True, default="Medium")
    status = Column(String(50), nullable=False, default="Pending")  # 'Pending', 'In Review', 'Resolved', 'Withdrawn'
    remarks = Column(Text, nullable=True)
    inspector_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "product": self.product,
            "productName": self.product,
            "userId": self.user_id,
            "user": self.user,
            "email": self.email,
            "issue": self.issue,
            "description": self.description or "",
            "severity": self.severity,
            "status": self.status,
            "remarks": self.remarks or "",
            "inspectorId": self.inspector_id,
            "date": self.created_at.strftime("%d %b %Y") if self.created_at else "Today",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Rule(Base):
    __tablename__ = "rules"

    id = Column(String(50), primary_key=True, index=True)  # e.g. "RULE-001"
    name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False, default="Price")
    version = Column(String(50), nullable=False, default="v1.0")
    severity = Column(String(50), nullable=False, default="High")  # 'Critical', 'High', 'Medium', 'Low'
    status = Column(String(50), nullable=False, default="Active")  # 'Active', 'Draft', 'Inactive'
    description = Column(Text, nullable=True)
    created_by = Column(String(100), nullable=True, default="Legal Metrology Authority")
    conditions_json = Column(Text, nullable=True)
    validation_fields_json = Column(Text, nullable=True)
    updated = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        conditions = json.loads(self.conditions_json) if self.conditions_json else []
        validation_fields = json.loads(self.validation_fields_json) if self.validation_fields_json else []

        return {
            "id": self.id,
            "name": self.name,
            "ruleName": self.name,
            "category": self.category,
            "version": self.version,
            "severity": self.severity,
            "status": self.status,
            "description": self.description or "",
            "createdBy": self.created_by or "Legal Metrology Authority",
            "conditions": conditions,
            "validationFields": validation_fields,
            "updated": self.updated or (self.created_at.strftime("%d %b %Y") if self.created_at else "20 Aug 2026"),
            "lastUpdated": self.updated or (self.created_at.strftime("%d %b %Y") if self.created_at else "20 Aug 2026"),
        }


class Amendment(Base):
    __tablename__ = "amendments"

    id = Column(String(50), primary_key=True, index=True)  # e.g. "AMD-001"
    rule_id = Column(String(50), nullable=False, index=True)
    rule = Column(String(200), nullable=False)
    old_version = Column(String(50), nullable=False, default="v1.0")
    new_version = Column(String(50), nullable=False, default="v1.1")
    reason = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="Pending")  # 'Approved', 'Pending', 'Rejected'
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "ruleId": self.rule_id,
            "rule": self.rule,
            "oldVersion": self.old_version,
            "newVersion": self.new_version,
            "reason": self.reason or "",
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Violation(Base):
    __tablename__ = "violations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    product = Column(String(200), nullable=False)
    product_id = Column(Integer, nullable=True)
    category = Column(String(100), nullable=False, default="Compliance")
    description = Column(Text, nullable=True)
    severity = Column(String(50), nullable=False, default="medium")  # 'critical', 'high', 'medium', 'low'
    date = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False, default="Open")  # 'Open', 'Resolved'
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "product": self.product,
            "productId": self.product_id,
            "category": self.category,
            "description": self.description or "",
            "severity": self.severity,
            "date": self.date or (self.created_at.strftime("%d %b %Y") if self.created_at else "Today"),
            "status": self.status,
        }


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    action = Column(String(255), nullable=False)
    product = Column(String(200), nullable=True)
    user = Column(String(100), nullable=False, default="System")
    time = Column(String(100), nullable=True)
    type = Column(String(50), nullable=False, default="info")  # 'success', 'error', 'info', 'warning'
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "action": self.action,
            "product": self.product,
            "user": self.user,
            "time": self.time or "Just now",
            "type": self.type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
