# Legal Metrology (Packaged Commodities) Rules, 2011 — Compliance Backend API

FastAPI backend providing automated OCR extraction, barcode decoding, statutory entity parsing, deterministic compliance evaluation under the Legal Metrology (Packaged Commodities) Rules, 2011, and complete REST APIs for authentication, product management, inspection workflows, complaints, rules, amendments, reports, and analytics.

---

## 1. Project Structure

```
Backend/
├── main.py                     # FastAPI application entrypoint & router registry
├── config.py                   # App configuration (JWT, DB URL, paths, CORS)
├── database.py                 # SQLite / SQLAlchemy connection & session manager
├── requirements.txt            # Python dependencies
├── test_backend.py             # Automated test suite for all endpoints
├── models/
│   ├── db_models.py            # SQLAlchemy database models (Users, Products, Inspections, Evidences, etc.)
│   └── schemas.py              # Pydantic v2 request & response schemas
├── routes/
│   ├── auth.py                 # /api/auth (login, register, me, logout)
│   ├── products.py             # /api/products (scan, history, compare, search, barcode, violations)
│   ├── inspections.py          # /api/inspections (assignments, evidence, submit, reports, analytics)
│   ├── complaints.py           # /api/complaints (filing, withdrawal, status update, inspector assignment)
│   ├── rules.py                # /api/rules & /api/amendments (statutory rule CRUD & amendments)
│   └── analysis.py             # /api/v1/analyze & /health (concept endpoints)
├── services/
│   ├── auth_service.py         # Salted PBKDF2 password hashing & JWT token verification
│   ├── parser.py               # Statutory entity regex extraction
│   ├── report_generator.py     # Downloadable inspection report generator
│   ├── rules.py                # Legal Metrology deterministic rule engine + scoring
│   ├── seed_data.py            # Initial database seeder for instant frontend compatibility
│   └── vision.py               # Image preprocessing, OCR extraction, barcode decoding
└── uploads/                    # Local storage for product images and inspection evidence
```

---

## 2. Installation & Quickstart

### Prerequisites
- Python 3.10+
- (Optional) `libzbar0` for barcode decoding on Linux/macOS

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run the Backend Server
```bash
# Starts on port 5000 (matching frontend baseURL http://localhost:5000/api)
python -m uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

The API will be live at `http://localhost:5000`, with interactive Swagger UI documentation at `http://localhost:5000/docs`.

### Run Automated Tests
```bash
python test_backend.py
```

---

## 3. Seeded Demo Accounts

On initial boot, the SQLite database is automatically seeded with demo accounts:

| Email | Password | Role | Description |
| :--- | :--- | :--- | :--- |
| `admin@example.com` | `Admin@123` | `authority` | Regulatory Authority User |
| `inspector@example.com` | `Inspector@123` | `inspector` | Field Inspector User |

---

## 4. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/login`: Authenticate and receive JWT Bearer token + user profile.
- `POST /api/auth/register`: Create a new user account.
- `GET /api/auth/me`: Get current authenticated user profile.
- `POST /api/auth/logout`: Invalidate user session.

### Products & OCR Compliance (`/api/products`)
- `POST /api/products/scan`: Multipart upload (`image` or `file`). Runs OCR + barcode decoding + entity extraction + compliance rule evaluation and saves the product and violations.
- `GET /api/products/{id}`: Retrieve detailed product information.
- `GET /api/products/{id}/compliance`: Get compliance score, statutory report, and bounding boxes.
- `GET /api/products/history`: Get all scanned products history.
- `POST /api/products/compare`: Compare multiple products side-by-side.
- `GET /api/products/search?query=...`: Search products by name, brand, category, or barcode.
- `GET /api/products/barcode/{barcode}`: Lookup product by barcode.
- `GET /api/products/{id}/violations`: Get violations associated with a product.

### Inspections (`/api/inspections`)
- `GET /api/inspections/my-assignments`: Get assignments for the logged-in inspector.
- `GET /api/inspections`: Get all inspections (with filters).
- `GET /api/inspections/{id}`: Retrieve single inspection details.
- `POST /api/inspections`: Create a new inspection assignment.
- `PUT /api/inspections/{id}`: Update inspection details.
- `PATCH /api/inspections/{id}/status`: Update status and remarks.
- `POST /api/inspections/{id}/evidence`: Upload image or document evidence.
- `GET /api/inspections/{id}/evidence`: Retrieve attached evidence files.
- `POST /api/inspections/{id}/submit`: Submit completed inspection with checklist and observations.
- `GET /api/inspections/history`: Get historical inspection logs.
- `GET /api/inspections/analytics`: Aggregate statistics and compliance trends.
- `GET /api/inspections/{id}/report`: Download official compliance report.

### Complaints (`/api/complaints`)
- `POST /api/complaints`: File a consumer grievance.
- `GET /api/complaints/my`: Get current user's filed complaints.
- `GET /api/complaints/{id}`: Get complaint details.
- `PATCH /api/complaints/{id}/withdraw`: Withdraw a filed complaint.
- `GET /api/complaints`: Retrieve all complaints.
- `PATCH /api/complaints/{id}/status`: Update complaint resolution status.
- `PATCH /api/complaints/{id}/assign`: Assign complaint to an inspector.
- `GET /api/complaints/stats`: Get summary grievance statistics.

### Rules & Amendments (`/api/rules` & `/api/amendments`)
- `GET /api/rules`: Get compliance rules.
- `GET /api/rules/active`: Get active compliance rules.
- `GET /api/rules/{id}`: Get rule conditions and validation parameters.
- `POST /api/rules`: Create a new statutory rule.
- `PUT /api/rules/{id}`: Update an existing rule.
- `PATCH /api/rules/{id}/activate`: Activate rule.
- `PATCH /api/rules/{id}/deactivate`: Deactivate rule.
- `DELETE /api/rules/{id}`: Delete rule.
- `POST /api/rules/{id}/amendments`: Propose an amendment to a rule.
- `GET /api/rules/{id}/amendments`: Get amendments for a rule.
- `GET /api/amendments`: Get all statutory amendments.
- `PATCH /api/amendments/{id}/approve`: Approve an amendment.
- `PATCH /api/amendments/{id}/reject`: Reject an amendment.

### Core Concept Endpoints
- `GET /health`: Liveness probe and OCR engine status.
- `POST /api/v1/analyze`: Direct image upload for Legal Metrology analysis.
