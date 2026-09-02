"""
Pydantic v2 schemas for the Legal Metrology Compliance Checker API.

These models define the exact request/response contract consumed by the frontend.
Field names match frontend expectations and service specifications.
"""
from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# --------------------------------------------------------------------------
# Concept / Core Compliance Schemas
# --------------------------------------------------------------------------

class ComplianceStatus(str, Enum):
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"
    REVIEW = "review"
    VIOLATION = "violation"


class Severity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class ExtractedData(BaseModel):
    mrp: Optional[str] = Field(default=None, description="Maximum Retail Price as printed, e.g. 'Rs. 50.00'")
    net_weight: Optional[str] = Field(default=None, description="Declared net quantity, e.g. '250g'")
    unit_sale_price: Optional[str] = Field(default=None, description="Declared unit sale price, e.g. 'Rs. 0.20 per g'")
    calculated_unit_sale_price: Optional[str] = Field(default=None, description="USP computed from MRP / net quantity")
    mfg_date: Optional[str] = Field(default=None, description="Date of manufacture / packing")
    expiry_date: Optional[str] = Field(default=None, description="Expiry / best-before date")
    fssai_license: Optional[str] = Field(default=None, description="14-digit FSSAI license number, if present")
    fssai_logo: Optional[str] = Field(default=None, description="Visual FSSAI Graphic Logo marker ('Detected' / 'Not Detected')")
    consumer_care: Optional[str] = Field(default=None, description="Consumer care email / phone")
    manufacturer_address: Optional[str] = Field(default=None, description="'Found' / 'Not Found' marker")
    country_of_origin: Optional[str] = Field(default=None, description="Declared country of origin, e.g. 'India'")
    is_vegetarian: Optional[bool] = Field(
        default=None, description="True = veg mark detected, False = non-veg mark detected, None = undetermined"
    )
    veg_non_veg_logo: Optional[str] = Field(
        default=None, description="VEG / NON_VEG / NON_FOOD / None"
    )


class BoundingBox(BaseModel):
    field: str = Field(description="Name of the extracted field this box corresponds to, e.g. 'mrp'")
    text: str = Field(description="Raw OCR text of this detection")
    box: List[int] = Field(description="[ymin, xmin, ymax, xmax] in pixel coordinates")
    confidence: float = Field(ge=0.0, le=1.0)


class ComplianceRuleResult(BaseModel):
    rule: str
    rule_id: str
    passed: bool
    severity: Severity
    message: str


class AnalysisResponse(BaseModel):
    status: ComplianceStatus
    overall_score: float = Field(ge=0.0, le=100.0)
    extracted_data: ExtractedData
    bounding_boxes: List[BoundingBox] = Field(default_factory=list)
    compliance_report: List[ComplianceRuleResult] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str = "ok"
    ocr_engine_loaded: bool


# --------------------------------------------------------------------------
# Auth Schemas
# --------------------------------------------------------------------------

class UserLogin(BaseModel):
    email: str
    password: str


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "inspector"


class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: Optional[str] = "active"


class LoginResponse(BaseModel):
    token: str
    user: UserProfile


class RegisterResponse(BaseModel):
    success: bool = True
    message: str
    token: Optional[str] = None
    user: Optional[UserProfile] = None


# --------------------------------------------------------------------------
# Product Schemas
# --------------------------------------------------------------------------

class ProductCreate(BaseModel):
    name: str
    brand: Optional[str] = None
    category: Optional[str] = "Packaged Food"
    description: Optional[str] = None
    manufacturer: Optional[str] = None
    batchNumber: Optional[str] = None
    netQuantity: Optional[str] = None
    mrp: Optional[str] = None
    barcode: Optional[str] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    brand: Optional[str] = None
    category: str
    description: Optional[str] = None
    manufacturer: Optional[str] = None
    status: str
    score: float
    lastChecked: Optional[str] = None
    barcode: Optional[str] = None
    image_url: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None
    bounding_boxes: Optional[List[Dict[str, Any]]] = None
    compliance_report: Optional[List[Dict[str, Any]]] = None


class ProductCompareRequest(BaseModel):
    productIds: List[int]


# --------------------------------------------------------------------------
# Inspection Schemas
# --------------------------------------------------------------------------

class InspectionCreate(BaseModel):
    product: str
    inspector: Optional[str] = "Field Officer"
    date: Optional[str] = None
    deadline: Optional[str] = None
    location: Optional[str] = "Chennai"
    priority: Optional[str] = "Medium"
    category: Optional[str] = "Packaged Food"
    productId: Optional[int] = None


class InspectionUpdate(BaseModel):
    product: Optional[str] = None
    inspector: Optional[str] = None
    date: Optional[str] = None
    deadline: Optional[str] = None
    location: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    score: Optional[float] = None
    observation: Optional[str] = None
    checklist: Optional[Dict[str, bool]] = None
    remarks: Optional[str] = None


class InspectionStatusUpdate(BaseModel):
    status: str
    remarks: Optional[str] = ""


class InspectionSubmit(BaseModel):
    inspectionId: Optional[str] = None
    checks: Optional[Dict[str, bool]] = None
    checklist: Optional[Dict[str, bool]] = None
    observation: Optional[str] = ""
    score: Optional[float] = None
    remarks: Optional[str] = ""


# --------------------------------------------------------------------------
# Complaint Schemas
# --------------------------------------------------------------------------

class ComplaintCreate(BaseModel):
    product: str
    issue: str
    user: Optional[str] = "Consumer"
    email: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = "Medium"


class ComplaintStatusUpdate(BaseModel):
    status: str
    remarks: Optional[str] = ""


class ComplaintAssignRequest(BaseModel):
    inspectorId: str


# --------------------------------------------------------------------------
# Rule & Amendment Schemas
# --------------------------------------------------------------------------

class RuleConditionItem(BaseModel):
    field: Optional[str] = None
    required: Optional[bool] = True
    validation: Optional[str] = None


class RuleCreate(BaseModel):
    ruleName: str
    category: str
    version: str
    severity: Optional[str] = "Medium"
    description: Optional[str] = ""
    conditions: Optional[List[str]] = None
    validationFields: Optional[List[Dict[str, Any]]] = None


class RuleUpdate(BaseModel):
    name: Optional[str] = None
    ruleName: Optional[str] = None
    category: Optional[str] = None
    version: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    conditions: Optional[List[str]] = None
    validationFields: Optional[List[Dict[str, Any]]] = None


class AmendmentCreate(BaseModel):
    rule: Optional[str] = None
    ruleId: Optional[str] = None
    oldVersion: str
    newVersion: str
    reason: str


class AmendmentReject(BaseModel):
    reason: Optional[str] = ""
