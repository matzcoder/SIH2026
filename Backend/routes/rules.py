"""
Rules and Amendments Router (/api/rules and /api/amendments)
"""
from __future__ import annotations

import json
import logging
from datetime import datetime
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models.db_models import Rule, Amendment, Activity, User
from models.schemas import (
    RuleCreate,
    RuleUpdate,
    AmendmentCreate,
    AmendmentReject,
)
from services.auth_service import get_current_user_optional

logger = logging.getLogger(__name__)

rules_router = APIRouter(prefix="/rules", tags=["Rules"])
amendments_router = APIRouter(prefix="/amendments", tags=["Amendments"])


# --------------------------------------------------------------------------
# RULES ENDPOINTS
# --------------------------------------------------------------------------

@rules_router.get("/active")
def get_active_rules(db: Session = Depends(get_db)) -> List[dict[str, Any]]:
    """Get only currently active compliance rules."""
    rules = db.query(Rule).filter(Rule.status.ilike("Active")).all()
    return [r.to_dict() for r in rules]


@rules_router.get("/categories")
def get_rule_categories() -> List[str]:
    """Get list of standard rule categories."""
    return [
        "Price Declaration",
        "Net Quantity",
        "Manufacturer & Packer",
        "Consumer Care",
        "Product Packaging",
        "Statutory Dates",
    ]


@rules_router.get("/search")
def search_rules(
    query: str = Query("", description="Keyword to search in rule name, category, or description"),
    db: Session = Depends(get_db),
) -> List[dict[str, Any]]:
    """Search compliance rules by keyword."""
    q = query.strip()
    if not q:
        return [r.to_dict() for r in db.query(Rule).all()]

    results = (
        db.query(Rule)
        .filter(
            (Rule.name.ilike(f"%{q}%"))
            | (Rule.category.ilike(f"%{q}%"))
            | (Rule.description.ilike(f"%{q}%"))
            | (Rule.id.ilike(f"%{q}%"))
        )
        .all()
    )
    return [r.to_dict() for r in results]


@rules_router.get("", include_in_schema=False)
@rules_router.get("/")
def get_rules(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
) -> List[dict[str, Any]]:
    """Get all compliance rules with optional category, status, or search filters."""
    query = db.query(Rule)
    if category and category != "All Categories":
        query = query.filter(Rule.category.ilike(f"%{category}%"))
    if status and status != "All Status":
        query = query.filter(Rule.status.ilike(status))
    if search:
        query = query.filter(
            (Rule.name.ilike(f"%{search}%"))
            | (Rule.id.ilike(f"%{search}%"))
            | (Rule.category.ilike(f"%{search}%"))
        )
    rules = query.all()
    return [r.to_dict() for r in rules]


@rules_router.post("", include_in_schema=False)
@rules_router.post("/")
def create_rule(
    data: RuleCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
) -> dict[str, Any]:
    """Create a new compliance rule."""
    count = db.query(Rule).count()
    new_id = f"RULE-{count + 1:03d}"

    conditions = data.conditions or [
        f"{data.ruleName} requirement must be verified",
        "Must be printed clearly on package",
    ]
    validation_fields = data.validationFields or [
        {"field": data.ruleName, "required": True, "validation": "Text / Visual"}
    ]

    rule = Rule(
        id=new_id,
        name=data.ruleName,
        category=data.category,
        version=data.version or "v1.0",
        severity=data.severity or "Medium",
        status="Draft",
        description=data.description or "",
        created_by=current_user.name if current_user else "Legal Metrology Authority",
        conditions_json=json.dumps(conditions),
        validation_fields_json=json.dumps(validation_fields),
        updated=datetime.utcnow().strftime("%d %b %Y"),
    )
    db.add(rule)

    # Activity
    activity = Activity(
        action=f"New rule {new_id} created ({rule.name})",
        product=rule.name,
        user=current_user.name if current_user else "Authority User",
        time="Just now",
        type="info",
    )
    db.add(activity)
    db.commit()
    db.refresh(rule)

    return rule.to_dict()


@rules_router.get("/{id}")
def get_rule_by_id(id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    """Get single rule by ID."""
    rule = db.query(Rule).filter(Rule.id == id).first()
    if not rule:
        # Fallback details for simulated rule ID
        return {
            "id": id,
            "name": f"Compliance Rule {id}",
            "ruleName": f"Compliance Rule {id}",
            "category": "Price Declaration",
            "version": "v1.2",
            "status": "Active",
            "severity": "High",
            "createdBy": "Legal Metrology Authority",
            "lastUpdated": datetime.utcnow().strftime("%d %b %Y"),
            "description": "Every retail packaged commodity must clearly declare statutory declarations.",
            "conditions": [
                "Declaration must be present",
                "Declaration must be clearly visible",
                "Declaration must be in standard format",
            ],
            "validationFields": [
                {"field": "Declaration", "required": True, "validation": "Text / Numeric"},
            ],
        }
    return rule.to_dict()


@rules_router.put("/{id}")
def update_rule(id: str, data: RuleUpdate, db: Session = Depends(get_db)) -> dict[str, Any]:
    """Update rule specifications."""
    rule = db.query(Rule).filter(Rule.id == id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found.")

    if data.name or data.ruleName:
        rule.name = data.name or data.ruleName
    if data.category:
        rule.category = data.category
    if data.version:
        rule.version = data.version
    if data.severity:
        rule.severity = data.severity
    if data.description is not None:
        rule.description = data.description
    if data.status:
        rule.status = data.status
    if data.conditions:
        rule.conditions_json = json.dumps(data.conditions)
    if data.validationFields:
        rule.validation_fields_json = json.dumps(data.validationFields)

    rule.updated = datetime.utcnow().strftime("%d %b %Y")
    db.commit()
    db.refresh(rule)
    return rule.to_dict()


@rules_router.patch("/{id}/activate")
def activate_rule(id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    """Activate compliance rule."""
    rule = db.query(Rule).filter(Rule.id == id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found.")
    rule.status = "Active"
    rule.updated = datetime.utcnow().strftime("%d %b %Y")
    db.commit()
    db.refresh(rule)
    return rule.to_dict()


@rules_router.patch("/{id}/deactivate")
def deactivate_rule(id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    """Deactivate compliance rule."""
    rule = db.query(Rule).filter(Rule.id == id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found.")
    rule.status = "Draft"
    rule.updated = datetime.utcnow().strftime("%d %b %Y")
    db.commit()
    db.refresh(rule)
    return rule.to_dict()


@rules_router.delete("/{id}")
def delete_rule(id: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    """Delete a rule."""
    rule = db.query(Rule).filter(Rule.id == id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found.")
    db.delete(rule)
    db.commit()
    return {"status": "ok", "message": f"Rule {id} deleted successfully."}


@rules_router.post("/{ruleId}/amendments")
def create_amendment_for_rule(
    ruleId: str,
    data: AmendmentCreate,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """Create an amendment for a specific rule."""
    rule = db.query(Rule).filter(Rule.id == ruleId).first()
    rule_name = rule.name if rule else (data.rule or ruleId)
    count = db.query(Amendment).count()
    new_id = f"AMD-{count + 1:03d}"

    amendment = Amendment(
        id=new_id,
        rule_id=ruleId,
        rule=rule_name,
        old_version=data.oldVersion,
        new_version=data.newVersion,
        reason=data.reason,
        status="Pending",
    )
    db.add(amendment)
    db.commit()
    db.refresh(amendment)
    return amendment.to_dict()


@rules_router.get("/{ruleId}/amendments")
def get_amendments_for_rule(ruleId: str, db: Session = Depends(get_db)) -> List[dict[str, Any]]:
    """Get all amendments for a specific rule."""
    amendments = db.query(Amendment).filter(Amendment.rule_id == ruleId).all()
    return [a.to_dict() for a in amendments]


# --------------------------------------------------------------------------
# AMENDMENTS ENDPOINTS
# --------------------------------------------------------------------------

@amendments_router.get("", include_in_schema=False)
@amendments_router.get("/")
def get_all_amendments(db: Session = Depends(get_db)) -> List[dict[str, Any]]:
    """Get all rule amendments."""
    amendments = db.query(Amendment).order_by(Amendment.created_at.desc()).all()
    return [a.to_dict() for a in amendments]


@amendments_router.patch("/{amendmentId}/approve")
def approve_amendment(amendmentId: str, db: Session = Depends(get_db)) -> dict[str, Any]:
    """Approve a rule amendment."""
    amendment = db.query(Amendment).filter(Amendment.id == amendmentId).first()
    if not amendment:
        raise HTTPException(status_code=404, detail="Amendment not found.")

    amendment.status = "Approved"

    # Update corresponding rule version if rule exists
    rule = db.query(Rule).filter(Rule.id == amendment.rule_id).first()
    if rule:
        rule.version = amendment.new_version
        rule.updated = datetime.utcnow().strftime("%d %b %Y")

    # Activity log
    activity = Activity(
        action=f"Amendment {amendmentId} approved for {amendment.rule}",
        product=amendment.rule,
        user="Authority",
        time="Just now",
        type="success",
    )
    db.add(activity)
    db.commit()
    db.refresh(amendment)
    return amendment.to_dict()


@amendments_router.patch("/{amendmentId}/reject")
def reject_amendment(
    amendmentId: str, data: AmendmentReject, db: Session = Depends(get_db)
) -> dict[str, Any]:
    """Reject a rule amendment."""
    amendment = db.query(Amendment).filter(Amendment.id == amendmentId).first()
    if not amendment:
        raise HTTPException(status_code=404, detail="Amendment not found.")

    amendment.status = "Rejected"
    if data.reason:
        amendment.reason = f"{amendment.reason} [Rejected: {data.reason}]"

    db.commit()
    db.refresh(amendment)
    return amendment.to_dict()
