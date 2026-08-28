"""
Database Seeder: Populates initial sample data matching frontend mockData and requirements.
"""
from __future__ import annotations

import json
import logging
from datetime import datetime
from sqlalchemy.orm import Session

from models.db_models import (
    User,
    Product,
    Inspection,
    Evidence,
    Complaint,
    Rule,
    Amendment,
    Violation,
    Activity,
)
from services.auth_service import hash_password

logger = logging.getLogger(__name__)


def seed_database(db: Session) -> None:
    """Populate database with initial records if empty."""
    try:
        # Check if already seeded
        if db.query(User).first():
            return

        logger.info("Seeding initial database data...")

        # 1. Users
        users = [
            User(
                name="Admin User",
                email="admin@example.com",
                password_hash=hash_password("Admin@123"),
                role="authority",
                status="active",
            ),
            User(
                name="Inspector User",
                email="inspector@example.com",
                password_hash=hash_password("Inspector@123"),
                role="inspector",
                status="active",
            ),
        ]
        db.add_all(users)
        db.commit()

        # 2. Products
        products = [
            Product(
                id=1,
                name="Smart Security Camera",
                brand="SecureTech",
                category="Electronic Device",
                description="AI-enabled indoor security camera with cloud storage.",
                manufacturer="SecureTech Electronics Pvt Ltd",
                status="compliant",
                score=94.0,
                last_checked="27 Aug 2026",
                barcode="890100000001",
            ),
            Product(
                id=2,
                name="Smart Door Lock",
                brand="HomeGuard",
                category="Smart Home",
                description="Connected door lock with biometric authentication.",
                manufacturer="HomeGuard Security Ltd",
                status="review",
                score=72.0,
                last_checked="26 Aug 2026",
                barcode="890100000002",
            ),
            Product(
                id=3,
                name="Wireless Baby Monitor",
                brand="SafeNest",
                category="Consumer Electronics",
                description="Wireless baby monitoring device with video streaming.",
                manufacturer="SafeNest Technologies",
                status="violation",
                score=41.0,
                last_checked="25 Aug 2026",
                barcode="890100000003",
            ),
            Product(
                id=4,
                name="Fitness Smartwatch",
                brand="FitPulse",
                category="Wearable",
                description="Wearable device that collects health and activity data.",
                manufacturer="FitPulse Wearables Ltd",
                status="compliant",
                score=91.0,
                last_checked="24 Aug 2026",
                barcode="890100000004",
            ),
            Product(
                id=5,
                name="Smart Air Purifier",
                brand="AirPure",
                category="Home Appliance",
                description="Connected air purifier with mobile application support.",
                manufacturer="AirPure Technologies",
                status="review",
                score=68.0,
                last_checked="23 Aug 2026",
                barcode="890100000005",
            ),
            Product(
                id=6,
                name="GPS Tracking Device",
                brand="TrackPro",
                category="Tracking Device",
                description="Portable GPS tracker with real-time location monitoring.",
                manufacturer="TrackPro Systems",
                status="violation",
                score=38.0,
                last_checked="22 Aug 2026",
                barcode="890100000006",
            ),
            Product(
                id=7,
                name="ABC Biscuits",
                brand="ABC Foods",
                category="Packaged Food",
                description="Fortified crispy tea biscuits with vitamins and minerals.",
                manufacturer="ABC Foods Pvt Ltd, Industrial Estate, Chennai",
                batch_number="ABX2026-08",
                net_quantity="100 g",
                mrp="₹ 50.00",
                status="compliant",
                score=96.0,
                last_checked="25 Aug 2026",
                barcode="8901234567890",
            ),
            Product(
                id=8,
                name="XYZ Cooking Oil",
                brand="XYZ Agro",
                category="Edible Oil",
                description="Refined sunflower cooking oil enriched with vitamins A & D.",
                manufacturer="XYZ Agro Foods Ltd, Coimbatore",
                batch_number="XYZ-882",
                net_quantity="1 L",
                mrp="₹ 180.00",
                status="review",
                score=72.0,
                last_checked="24 Aug 2026",
                barcode="8901234567891",
            ),
            Product(
                id=9,
                name="Fresh Milk",
                brand="Daily Dairy",
                category="Dairy",
                description="Pasteurized standardized milk with 4.5% fat.",
                manufacturer="Daily Dairy Cooperative, Madurai",
                batch_number="DD-901",
                net_quantity="500 ml",
                mrp="₹ 30.00",
                status="compliant",
                score=88.0,
                last_checked="23 Aug 2026",
                barcode="8909876543210",
            ),
        ]
        db.add_all(products)
        db.commit()

        # 3. Rules
        rules = [
            Rule(
                id="RULE-001",
                name="MRP Declaration",
                category="Price",
                version="v1.2",
                severity="High",
                status="Active",
                description="Every retail packaged commodity must clearly declare the Maximum Retail Price inclusive of all applicable taxes.",
                created_by="Legal Metrology Authority",
                conditions_json=json.dumps([
                    "MRP must be present",
                    "MRP must be clearly visible",
                    "Price must be in Indian Rupees",
                    "MRP must be inclusive of all taxes",
                ]),
                validation_fields_json=json.dumps([
                    {"field": "MRP", "required": True, "validation": "Text / Numeric"},
                    {"field": "Currency", "required": True, "validation": "INR"},
                    {"field": "Tax Declaration", "required": True, "validation": "Inclusive of all taxes"},
                ]),
                updated="20 Aug 2026",
            ),
            Rule(
                id="RULE-002",
                name="Net Quantity Declaration",
                category="Quantity",
                version="v2.1",
                severity="High",
                status="Active",
                description="Standard units of weight (g, kg), volume (ml, l), or count (pcs) must be clearly printed.",
                created_by="Legal Metrology Authority",
                conditions_json=json.dumps([
                    "Net quantity must be declared using standard SI units",
                    "Font size must comply with minimum area requirements",
                    "Quantity must not be misleading",
                ]),
                validation_fields_json=json.dumps([
                    {"field": "Net Quantity", "required": True, "validation": "Standard Units"},
                    {"field": "Unit Size", "required": True, "validation": "g, kg, ml, l, pcs"},
                ]),
                updated="18 Aug 2026",
            ),
            Rule(
                id="RULE-003",
                name="Manufacturer Details",
                category="Manufacturer",
                version="v1.3",
                severity="Medium",
                status="Active",
                description="Complete name and address of the manufacturer, packer, or importer must be provided.",
                created_by="Legal Metrology Authority",
                conditions_json=json.dumps([
                    "Manufacturer/Packer name must be present",
                    "Complete postal address must be declared",
                ]),
                validation_fields_json=json.dumps([
                    {"field": "Manufacturer Name", "required": True, "validation": "Text"},
                    {"field": "Postal Address", "required": True, "validation": "Text / Address"},
                ]),
                updated="15 Aug 2026",
            ),
            Rule(
                id="RULE-004",
                name="Consumer Care Details",
                category="Consumer",
                version="v1.0",
                severity="Medium",
                status="Draft",
                description="Toll-free telephone number, email, or postal contact for consumer grievances must be visible.",
                created_by="Legal Metrology Authority",
                conditions_json=json.dumps([
                    "Consumer helpline phone or email required",
                    "Contact person or grievance officer name where applicable",
                ]),
                validation_fields_json=json.dumps([
                    {"field": "Helpline / Phone", "required": True, "validation": "Phone / Toll-Free"},
                    {"field": "Email Address", "required": True, "validation": "Email format"},
                ]),
                updated="12 Aug 2026",
            ),
            Rule(
                id="RULE-005",
                name="Country of Origin",
                category="Product",
                version="v1.1",
                severity="High",
                status="Active",
                description="For all imported and domestic goods, country of origin must be stated prominently.",
                created_by="Legal Metrology Authority",
                conditions_json=json.dumps([
                    "Country of Origin must be explicitly declared",
                ]),
                validation_fields_json=json.dumps([
                    {"field": "Country", "required": True, "validation": "Country Name"},
                ]),
                updated="10 Aug 2026",
            ),
            Rule(
                id="RULE-006",
                name="Unit Sale Price Declaration",
                category="Price",
                version="v1.0",
                severity="High",
                status="Active",
                description="For packages above 1 kg or 1 L, Unit Sale Price (USP) per gram or per milliliter must be declared.",
                created_by="Legal Metrology Authority",
                conditions_json=json.dumps([
                    "Mandatory for packages > 1kg / 1L",
                    "Calculated price must match declared price within 5% tolerance",
                ]),
                validation_fields_json=json.dumps([
                    {"field": "Unit Sale Price", "required": False, "validation": "Rs. per unit"},
                ]),
                updated="08 Aug 2026",
            ),
        ]
        db.add_all(rules)
        db.commit()

        # 4. Amendments
        amendments = [
            Amendment(
                id="AMD-001",
                rule_id="RULE-001",
                rule="MRP Display Rule",
                old_version="v1.0",
                new_version="v1.1",
                reason="Updated font size requirements for e-commerce packages.",
                status="Approved",
            ),
            Amendment(
                id="AMD-002",
                rule_id="RULE-002",
                rule="Net Quantity Declaration",
                old_version="v2.0",
                new_version="v2.1",
                reason="Added clarification on multi-piece combo packs.",
                status="Pending",
            ),
            Amendment(
                id="AMD-003",
                rule_id="RULE-003",
                rule="Manufacturer Address Rule",
                old_version="v1.2",
                new_version="v1.3",
                reason="Mandated website URL along with postal address.",
                status="Approved",
            ),
        ]
        db.add_all(amendments)
        db.commit()

        # 5. Inspections
        inspections = [
            Inspection(
                id="INS-1029",
                product="ABC Biscuits",
                brand="ABC Foods",
                category="Packaged Food",
                product_id=7,
                inspector="Field Officer",
                location="Chennai",
                date="25 Aug 2026",
                assigned_date="22 Aug 2026",
                deadline="25 Aug 2026",
                priority="High",
                status="Pending",
                score=83.0,
                passed_count=5,
                failed_count=1,
                evidence_count=6,
                observation="The package was inspected against the applicable packaged commodity requirements. Most mandatory declarations were present and readable. The packing date declaration requires corrective action.",
                checklist_json=json.dumps({
                    "mrp": True,
                    "quantity": True,
                    "manufacturer": True,
                    "packingDate": False,
                    "consumerCare": True,
                    "countryOrigin": True,
                }),
                remarks="Date of packing was slightly blurred due to ink smudging.",
            ),
            Inspection(
                id="INS-1028",
                product="XYZ Cooking Oil",
                brand="XYZ Agro",
                category="Edible Oil",
                product_id=8,
                inspector="Field Officer",
                location="Coimbatore",
                date="24 Aug 2026",
                assigned_date="21 Aug 2026",
                deadline="26 Aug 2026",
                priority="Medium",
                status="In Progress",
                score=72.0,
                passed_count=4,
                failed_count=2,
                evidence_count=3,
            ),
            Inspection(
                id="INS-1027",
                product="Fresh Milk",
                brand="Daily Dairy",
                category="Dairy",
                product_id=9,
                inspector="Field Officer",
                location="Madurai",
                date="23 Aug 2026",
                assigned_date="20 Aug 2026",
                deadline="24 Aug 2026",
                priority="High",
                status="Completed",
                score=88.0,
                passed_count=5,
                failed_count=1,
                evidence_count=4,
            ),
            Inspection(
                id="INS-1026",
                product="Daily Rice",
                brand="Daily Foods",
                category="Food Grains",
                inspector="Field Officer",
                location="Salem",
                date="22 Aug 2026",
                assigned_date="19 Aug 2026",
                deadline="23 Aug 2026",
                priority="Low",
                status="Completed",
                score=96.0,
                passed_count=6,
                failed_count=0,
                evidence_count=2,
            ),
            Inspection(
                id="INS001",
                product="ABC Biscuits",
                brand="ABC Foods",
                category="Packaged Food",
                inspector="Ramesh",
                location="Chennai",
                date="12 Aug 2026",
                status="Completed",
                score=95.0,
            ),
            Inspection(
                id="INS002",
                product="XYZ Oil",
                brand="XYZ Agro",
                category="Edible Oil",
                inspector="Priya",
                location="Coimbatore",
                date="14 Aug 2026",
                status="Under Review",
                score=78.0,
            ),
            Inspection(
                id="INS003",
                product="Fresh Milk",
                brand="Daily Dairy",
                category="Dairy",
                inspector="Karthik",
                location="Madurai",
                date="15 Aug 2026",
                status="Violation Found",
                score=62.0,
            ),
        ]
        db.add_all(inspections)
        db.commit()

        # 6. Evidences
        evidences = [
            Evidence(
                id=1,
                inspection_id="INS-1029",
                product_id=1,
                name="Front_Panel_MRP.jpg",
                file_url="/uploads/evidence/sample_mrp.jpg",
                type="image/jpeg",
                size="1.4 MB",
                evidence_type="image",
                uploaded_by="Admin",
                uploaded_at="27 Aug 2026",
                status="verified",
                description="Clear shot of MRP and net quantity declaration panel.",
            ),
            Evidence(
                id=2,
                inspection_id="INS-1029",
                product_id=1,
                name="Manufacturer_Details.pdf",
                file_url="/uploads/evidence/sample_mfg.pdf",
                type="application/pdf",
                size="1.8 MB",
                evidence_type="PDF",
                uploaded_by="Admin",
                uploaded_at="27 Aug 2026",
                status="verified",
                description="Manufacturer certification and registration document.",
            ),
            Evidence(
                id=3,
                inspection_id="INS-1028",
                product_id=2,
                name="Product_Certification.pdf",
                file_url="/uploads/evidence/sample_cert.pdf",
                type="application/pdf",
                size="3.1 MB",
                evidence_type="PDF",
                uploaded_by="Inspector",
                uploaded_at="26 Aug 2026",
                status="pending",
                description="Product testing report for verification.",
            ),
            Evidence(
                id=4,
                inspection_id="INS-1027",
                product_id=3,
                name="Compliance_Document.pdf",
                file_url="/uploads/evidence/sample_doc.pdf",
                type="application/pdf",
                size="1.2 MB",
                evidence_type="PDF",
                uploaded_by="Inspector",
                uploaded_at="25 Aug 2026",
                status="rejected",
                description="Incomplete compliance filing submitted by marketer.",
            ),
        ]
        db.add_all(evidences)
        db.commit()

        # 7. Complaints
        complaints = [
            Complaint(
                id="CMP001",
                product="ABC Biscuits",
                user="Rahul",
                email="rahul@example.com",
                issue="Incorrect MRP Display",
                description="MRP printed on outer wrapper differs from invoice price.",
                severity="High",
                status="Pending",
                remarks="Assigned to Field Officer for on-site verification.",
            ),
            Complaint(
                id="CMP002",
                product="XYZ Oil",
                user="Priya",
                email="priya@example.com",
                issue="Missing Manufacturer Address",
                description="Only brand name is mentioned without complete address.",
                severity="Medium",
                status="In Review",
                remarks="Contacted manufacturer for response.",
            ),
            Complaint(
                id="CMP003",
                product="Fresh Milk",
                user="Arun",
                email="arun@example.com",
                issue="Net Quantity Mismatch",
                description="Pouch net volume appeared significantly lower than 500ml.",
                severity="Critical",
                status="Resolved",
                remarks="Sample lab tested; fine issued to packing unit.",
            ),
        ]
        db.add_all(complaints)
        db.commit()

        # 8. Violations
        violations = [
            Violation(
                id=1,
                title="Missing Privacy Policy",
                product="Wireless Baby Monitor",
                product_id=3,
                category="Data Privacy",
                description="Required privacy policy documentation was not found during compliance scan.",
                severity="high",
                date="27 Aug 2026",
                status="Open",
            ),
            Violation(
                id=2,
                title="Incomplete Certification",
                product="GPS Tracking Device",
                product_id=6,
                category="Certification",
                description="The uploaded product certification is incomplete or expired.",
                severity="critical",
                date="26 Aug 2026",
                status="Open",
            ),
            Violation(
                id=3,
                title="Consent Mechanism Missing",
                product="Smart Door Lock",
                product_id=2,
                category="User Consent",
                description="The product does not provide sufficient evidence of user consent.",
                severity="medium",
                date="25 Aug 2026",
                status="Open",
            ),
            Violation(
                id=4,
                title="Packing Date Declaration",
                product="ABC Biscuits",
                product_id=7,
                category="Packaging",
                description="Manufacturing/packing date was smudged or missing from the visible face.",
                severity="medium",
                date="25 Aug 2026",
                status="Open",
            ),
        ]
        db.add_all(violations)
        db.commit()

        # 9. Activities
        activities = [
            Activity(
                action="Compliance scan completed",
                product="Smart Security Camera",
                user="Admin User",
                time="10 minutes ago",
                type="success",
            ),
            Activity(
                action="Violation detected",
                product="Wireless Baby Monitor",
                user="Inspector User",
                time="35 minutes ago",
                type="error",
            ),
            Activity(
                action="Evidence uploaded",
                product="Smart Door Lock",
                user="Inspector User",
                time="1 hour ago",
                type="info",
            ),
            Activity(
                action="Compliance review started",
                product="Smart Air Purifier",
                user="Admin User",
                time="2 hours ago",
                type="warning",
            ),
        ]
        db.add_all(activities)
        db.commit()

        logger.info("Database seeding successfully completed.")
    except Exception as exc:
        logger.exception(f"Failed to seed database: {exc}")
        db.rollback()
