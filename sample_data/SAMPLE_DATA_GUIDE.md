# Legal Metrology Compliance System — Sample Data & Testing Guide

This guide provides test credentials, pre-seeded database records, sample product label images for OCR scanning, and API request payloads to test the application.

---

## 1. Demo User Accounts

Use these pre-configured user credentials to log in to the Frontend UI (`http://localhost:3000`) or send requests via API (`http://localhost:5000/api/auth/login`).

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Regulatory Authority** | `admin@example.com` | `Admin@123` | Full dashboard, Rule management, Amendment approval, Complaints resolution, System analytics |
| **Field Inspector** | `inspector@example.com` | `Inspector@123` | Inspection assignments, On-site evidence upload, Inspection submissions, Scanned history |

---

## 2. Sample Product Label Images

Sample images are located in the [`sample_data/`](file:///d:/SIH2026/sample_data) directory.

### A. Compliant Samples (100% Pass)
1. **[`sample_data/sample_biscuit_label.jpg`](file:///d:/SIH2026/sample_data/sample_biscuit_label.jpg)**
   - **Product**: NutriCrunch Wheat Biscuits
   - **Result**: `100% Compliant` (MRP, Net Qty, Mfg Address, Date, Consumer Care, Barcode)
2. **[`sample_data/sample_cooking_oil_label.jpg`](file:///d:/SIH2026/sample_data/sample_cooking_oil_label.jpg)**
   - **Product**: Pure Gold Sunflower Oil
   - **Result**: `100% Compliant` (Net Vol 1L, Valid USP Rs 0.18/ml, MRP, Mfg Address)
3. **[`sample_data/sample_smartwatch_label.jpg`](file:///d:/SIH2026/sample_data/sample_smartwatch_label.jpg)**
   - **Product**: FitPulse Pro Smartwatch
   - **Result**: `100% Compliant` (MRP, Net Qty, Country of Origin, Customer Care)

---

### B. Non-Compliant / Violation Samples (Triggers Errors)
1. **[`sample_data/sample_noncompliant_missing_mrp_date.jpg`](file:///d:/SIH2026/sample_data/sample_noncompliant_missing_mrp_date.jpg)**
   - **Product**: FreshSnack Potato Chips
   - **Triggered Violations**:
     - ❌ **MRP Declaration** (Rule `LMR_RULE_01` / CRITICAL): Missing mandatory price statement.
     - ❌ **Manufacturing / Packing Date** (Rule `LMR_RULE_06` / MEDIUM): Missing date declaration.
   - **Result**: `Non-Compliant` (~50% score).

2. **[`sample_data/sample_noncompliant_wrong_usp.jpg`](file:///d:/SIH2026/sample_data/sample_noncompliant_wrong_usp.jpg)**
   - **Product**: Premium Basmati Rice 2kg
   - **Triggered Violations**:
     - ❌ **Unit Sale Price Mismatch** (Rule `LMR_RULE_03` / HIGH): Declared USP (`Rs 0.85/g`) deviates significantly from calculated USP (`Rs 0.10/g`).
     - ❌ **Consumer Care Details** (Rule `LMR_RULE_04` / MEDIUM): Missing helpline phone/email.
   - **Result**: `Non-Compliant` (~70% score).

3. **[`sample_data/sample_noncompliant_no_mfg_address.jpg`](file:///d:/SIH2026/sample_data/sample_noncompliant_no_mfg_address.jpg)**
   - **Product**: Wireless Earbuds
   - **Triggered Violations**:
     - ❌ **Manufacturer / Packer Details** (Rule `LMR_RULE_05` / HIGH): Missing "Mfg by" name & address.
   - **Result**: `Non-Compliant` (~80% score).

> **Testing Tip**: On the Frontend (**Scan** page at `http://localhost:3000`), upload any non-compliant image from `sample_data/` to test real-time statutory rule violation detection, scoring penalties, and error breakdown!

---

## 3. Pre-Seeded Database Products

The SQLite backend database is pre-populated with products across various compliance statuses:

| Product Name | Brand | Category | Barcode | Compliance Status | Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Smart Security Camera | SecureTech | Electronic Device | `890100000001` | `Compliant` | 94.0 |
| Smart Door Lock | HomeGuard | Smart Home | `890100000002` | `Under Review` | 72.0 |
| Wireless Baby Monitor | SafeNest | Consumer Electronics | `890100000003` | `Violation` | 41.0 |
| Fitness Smartwatch | FitPulse | Wearable | `890100000004` | `Compliant` | 91.0 |
| Smart Air Purifier | AirPure | Home Appliance | `890100000005` | `Under Review` | 68.0 |
| GPS Tracking Device | TrackPro | Tracking Device | `890100000006` | `Violation` | 38.0 |
| ABC Biscuits | ABC Foods | Packaged Food | `8901234567890` | `Compliant` | 96.0 |
| XYZ Cooking Oil | XYZ Agro | Edible Oil | `8901234567891` | `Under Review` | 72.0 |
| Fresh Milk | Daily Dairy | Dairy | `8909876543210` | `Compliant` | 88.0 |

---

## 4. Pre-Seeded Statutory Rules

The system includes pre-loaded Legal Metrology Rules (Packaged Commodities) 2011:

- **RULE-001**: MRP Declaration (Mandatory inclusive tax declaration)
- **RULE-002**: Net Quantity Declaration (Standard SI units)
- **RULE-003**: Manufacturer Details (Complete name & postal address)
- **RULE-004**: Consumer Care Details (Toll-free number / email contact)
- **RULE-005**: Country of Origin (Domestic & imported goods)
- **RULE-006**: Unit Sale Price Declaration (For packages > 1kg/1L)

---

## 5. Sample API Request Payloads (CURL / Postman / Swagger)

### A. User Login (`POST /api/auth/login`)
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

### B. File Consumer Complaint (`POST /api/complaints`)
```json
{
  "product": "ABC Biscuits",
  "user": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "issue": "MRP Misleading Declaration",
  "description": "The printed MRP on the package wrapper differs from the billed invoice price at retail store.",
  "severity": "High"
}
```

### C. Create Statutory Rule (`POST /api/rules`)
```json
{
  "name": "E-Commerce Digital Declaration",
  "category": "Digital Commerce",
  "severity": "High",
  "description": "Mandatory display of digital product declarations on e-commerce product pages prior to checkout.",
  "conditions": [
    "Digital label must display MRP",
    "Net quantity must be visible on product detail page",
    "Country of origin must be stated before cart addition"
  ],
  "validationFields": [
    {"field": "Digital MRP", "required": true, "validation": "INR"},
    {"field": "Country of Origin", "required": true, "validation": "Text"}
  ]
}
```

### D. Submit Inspection Results (`POST /api/inspections/INS-1029/submit`)
```json
{
  "checklist": {
    "mrp": true,
    "quantity": true,
    "manufacturer": true,
    "packingDate": true,
    "consumerCare": true,
    "countryOrigin": true
  },
  "remarks": "Re-inspected package label after manufacturer correction. All statutory details are now clearly legible.",
  "status": "Completed"
}
```
