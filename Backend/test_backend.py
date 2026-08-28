"""
Comprehensive automated tests for Legal Metrology Compliance Backend.
"""
from __future__ import annotations

import io
import sys
from fastapi.testclient import TestClient
from PIL import Image

from main import app
from database import SessionLocal, engine, Base
from services.seed_data import seed_database

Base.metadata.create_all(bind=engine)
db = SessionLocal()
seed_database(db)
db.close()

client = TestClient(app)


def create_test_image_bytes() -> bytes:
    """Create a minimal PNG image in-memory for upload testing."""
    img = Image.new("RGB", (200, 200), color=(255, 255, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def test_root_and_health():
    print("Testing Root & Health...")
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "online"

    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
    print("[PASS] Root & Health passed.")


def test_auth_flow():
    print("Testing Auth Flow...")
    import uuid
    test_email = f"testofficer_{uuid.uuid4().hex[:6]}@example.com"
    reg_data = {
        "name": "Test Officer",
        "email": test_email,
        "password": "Password@123",
        "role": "inspector",
    }
    r = client.post("/api/auth/register", json=reg_data)
    assert r.status_code == 200
    assert r.json()["success"] is True
    token = r.json()["token"]

    # Login
    login_data = {
        "email": "admin@example.com",
        "password": "Admin@123",
    }
    r = client.post("/api/auth/login", json=login_data)
    assert r.status_code == 200
    admin_token = r.json()["token"]
    assert admin_token is not None
    assert r.json()["user"]["role"] == "authority"

    # Get profile
    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == test_email
    print("[PASS] Auth flow passed.")


def test_products_flow():
    print("Testing Product Endpoints...")
    # History
    r = client.get("/api/products/history")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
    assert len(r.json()) > 0

    # Get Single
    r = client.get("/api/products/1")
    assert r.status_code == 200
    assert r.json()["id"] == 1

    # Compliance
    r = client.get("/api/products/1/compliance")
    assert r.status_code == 200
    assert "score" in r.json()

    # Search
    r = client.get("/api/products/search?query=Camera")
    assert r.status_code == 200
    assert len(r.json()) > 0

    # Compare
    r = client.post("/api/products/compare", json={"productIds": [1, 2]})
    assert r.status_code == 200
    assert len(r.json()) == 2

    # Barcode
    r = client.get("/api/products/barcode/8901234567890")
    assert r.status_code == 200
    assert "name" in r.json()

    # Scan Product with Image upload
    img_bytes = create_test_image_bytes()
    files = {"image": ("test_package.png", img_bytes, "image/png")}
    r = client.post("/api/products/scan", files=files)
    assert r.status_code == 200
    scan_res = r.json()
    assert "extracted_data" in scan_res
    assert "compliance_report" in scan_res
    assert "score" in scan_res
    print("[PASS] Product endpoints passed.")


def test_inspections_flow():
    print("Testing Inspection Endpoints...")
    # Assignments
    r = client.get("/api/inspections/my-assignments")
    assert r.status_code == 200
    assert len(r.json()) > 0

    # List
    r = client.get("/api/inspections")
    assert r.status_code == 200

    # Analytics
    r = client.get("/api/inspections/analytics")
    assert r.status_code == 200
    assert "stats" in r.json()
    assert "monthlyData" in r.json()

    # Single Inspection
    r = client.get("/api/inspections/INS-1029")
    assert r.status_code == 200
    assert r.json()["id"] == "INS-1029"

    # Create Inspection
    new_insp = {
        "product": "Test Organic Wheat Flour",
        "category": "Food Grains",
        "location": "Chennai",
        "priority": "High",
    }
    r = client.post("/api/inspections", json=new_insp)
    assert r.status_code == 200
    insp_id = r.json()["id"]

    # Upload Evidence
    img_bytes = create_test_image_bytes()
    files = {"file": ("evidence_label.png", img_bytes, "image/png")}
    data = {"evidenceType": "image", "description": "Clear front label shot"}
    r = client.post(f"/api/inspections/{insp_id}/evidence", files=files, data=data)
    assert r.status_code == 200
    assert r.json()["inspectionId"] == insp_id

    # Get Evidence
    r = client.get(f"/api/inspections/{insp_id}/evidence")
    assert r.status_code == 200
    assert len(r.json()) > 0

    # Submit Inspection
    submit_payload = {
        "inspectionId": insp_id,
        "checks": {
            "mrp": True,
            "quantity": True,
            "manufacturer": True,
            "packingDate": True,
            "consumerCare": True,
            "countryOrigin": True,
        },
        "observation": "All mandatory declarations present.",
    }
    r = client.post(f"/api/inspections/{insp_id}/submit", json=submit_payload)
    assert r.status_code == 200
    assert r.json()["status"] == "Completed"
    assert r.json()["numericScore"] == 100.0

    # Download Report
    r = client.get(f"/api/inspections/{insp_id}/report")
    assert r.status_code == 200
    assert "LEGAL METROLOGY" in r.text
    print("[PASS] Inspection endpoints passed.")


def test_complaints_flow():
    print("Testing Complaint Endpoints...")
    # Stats
    r = client.get("/api/complaints/stats")
    assert r.status_code == 200
    assert "total" in r.json()

    # List
    r = client.get("/api/complaints")
    assert r.status_code == 200
    assert len(r.json()) > 0

    # Create Complaint
    new_cmp = {
        "product": "Test Dairy Ghee",
        "issue": "Missing Expiry Date",
        "user": "Anand",
        "email": "anand@example.com",
    }
    r = client.post("/api/complaints", json=new_cmp)
    assert r.status_code == 200
    cmp_id = r.json()["id"]

    # Update Status
    r = client.patch(f"/api/complaints/{cmp_id}/status", json={"status": "In Review", "remarks": "Assigned officer"})
    assert r.status_code == 200
    assert r.json()["status"] == "In Review"

    # Assign
    r = client.patch(f"/api/complaints/{cmp_id}/assign", json={"inspectorId": "ASG-1029"})
    assert r.status_code == 200
    assert r.json()["inspectorId"] == "ASG-1029"
    print("[PASS] Complaint endpoints passed.")


def test_rules_and_amendments_flow():
    print("Testing Rules & Amendments...")
    # List rules
    r = client.get("/api/rules")
    assert r.status_code == 200
    assert len(r.json()) > 0

    # Active rules
    r = client.get("/api/rules/active")
    assert r.status_code == 200

    # Create Rule
    new_rule = {
        "ruleName": "QR Code Verification Rule",
        "category": "Product Packaging",
        "version": "v1.0",
        "severity": "High",
        "description": "Every electronic commodity must display QR code for e-labeling.",
    }
    r = client.post("/api/rules", json=new_rule)
    assert r.status_code == 200
    rule_id = r.json()["id"]

    # Activate Rule
    r = client.patch(f"/api/rules/{rule_id}/activate")
    assert r.status_code == 200
    assert r.json()["status"] == "Active"

    # Create Amendment
    amend_data = {
        "ruleId": rule_id,
        "oldVersion": "v1.0",
        "newVersion": "v1.1",
        "reason": "Updated dynamic QR standards",
    }
    r = client.post(f"/api/rules/{rule_id}/amendments", json=amend_data)
    assert r.status_code == 200
    amend_id = r.json()["id"]

    # Approve Amendment
    r = client.patch(f"/api/amendments/{amend_id}/approve")
    assert r.status_code == 200
    assert r.json()["status"] == "Approved"
    print("[PASS] Rules & Amendments passed.")


def test_concept_analyze_endpoint():
    print("Testing Concept /api/v1/analyze...")
    img_bytes = create_test_image_bytes()
    files = {"file": ("package.png", img_bytes, "image/png")}
    r = client.post("/api/v1/analyze", files=files)
    assert r.status_code == 200
    data = r.json()
    assert "status" in data
    assert "overall_score" in data
    assert "extracted_data" in data
    assert "bounding_boxes" in data
    assert "compliance_report" in data
    print("[PASS] Concept /api/v1/analyze passed.")


if __name__ == "__main__":
    test_root_and_health()
    test_auth_flow()
    test_products_flow()
    test_inspections_flow()
    test_complaints_flow()
    test_rules_and_amendments_flow()
    test_concept_analyze_endpoint()
    print("\n=======================================================")
    print("[SUCCESS] ALL TEST SUITES PASSED (100% COMPATIBLE)")
    print("=======================================================")
