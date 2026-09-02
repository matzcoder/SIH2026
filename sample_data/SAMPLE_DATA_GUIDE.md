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

Sample images are located in the [`sample_data/`](file:///e:/GitHub/SIH2026/sample_data) directory.

### A. Compliant Samples (100% Pass)
1. **[`sample_data/food-safety-standards-authority-india-260nw-2323173005.webp`](file:///e:/GitHub/SIH2026/sample_data/food-safety-standards-authority-india-260nw-2323173005.webp)**
   - **Type**: Official FSSAI Graphic Logo & Declaration Badge
   - **Result**: `100% Compliant` (Valid FSSAI Logo, License No, Statutory Declarations)

2. **[`sample_data/sample_biscuit_label.jpg`](file:///e:/GitHub/SIH2026/sample_data/sample_biscuit_label.jpg)**
   - **Product**: NutriCrunch Wheat Biscuits
   - **Dietary Classification**: 🟢 **Vegetarian** (Green Dot emblem present)
   - **Result**: `100% Compliant` (MRP, Net Qty, Mfg Address, Date, Consumer Care, FSSAI Logo, **Veg Green Dot**)

3. **[`sample_data/sample_cooking_oil_label.jpg`](file:///e:/GitHub/SIH2026/sample_data/sample_cooking_oil_label.jpg)**
   - **Product**: Pure Gold Sunflower Oil
   - **Dietary Classification**: 🟢 **Vegetarian** (Green Dot emblem present)
   - **Result**: `100% Compliant` (Net Vol 1L, Valid USP Rs 0.18/ml, MRP, Mfg Address, FSSAI Logo, **Veg Green Dot**)

4. **[`sample_data/sample_chicken_noodles_label.jpg`](file:///e:/GitHub/SIH2026/sample_data/sample_chicken_noodles_label.jpg)**
   - **Product**: Maggi Chicken Masala Noodles *(new)*
   - **Dietary Classification**: 🔶 **Non-Vegetarian** (Brown Triangle emblem present)
   - **Result**: `100% Compliant` (MRP, Net Qty, Mfg Address, Date, FSSAI Logo, **Non-Veg Brown Triangle**)

5. **[`sample_data/sample_smartwatch_label.jpg`](file:///e:/GitHub/SIH2026/sample_data/sample_smartwatch_label.jpg)**
   - **Product**: FitPulse Pro Smartwatch
   - **Dietary Classification**: ⬜ **Non-Food / Exempt** (No dietary emblem required)
   - **Result**: `100% Compliant` (MRP, Net Qty, Country of Origin, Customer Care)

---

### B. Non-Compliant / Violation Samples (Triggers Errors)
1. **[`sample_data/sample_noncompliant_missing_mrp_date.jpg`](file:///e:/GitHub/SIH2026/sample_data/sample_noncompliant_missing_mrp_date.jpg)**
   - **Product**: FreshSnack Potato Chips
   - **Triggered Violations**:
     - ❌ **MRP Declaration** (Rule `LMR_RULE_01` / CRITICAL): Missing mandatory price statement.
     - ❌ **Manufacturing / Packing Date** (Rule `LMR_RULE_06` / MEDIUM): Missing date declaration.
     - ❌ **Veg/Non-Veg Statutory Logo** (Rule `FSSAI_VEG_RULE_01` / HIGH): Missing Green Dot / Brown Triangle.
   - **Result**: `Non-Compliant` (~38% score).

2. **[`sample_data/sample_noncompliant_wrong_usp.jpg`](file:///e:/GitHub/SIH2026/sample_data/sample_noncompliant_wrong_usp.jpg)**
   - **Product**: Premium Basmati Rice 2kg
   - **Triggered Violations**:
     - ❌ **Unit Sale Price Mismatch** (Rule `LMR_RULE_03` / HIGH): Declared USP (`Rs 0.85/g`) deviates significantly from calculated USP (`Rs 0.10/g`).
     - ❌ **Consumer Care Details** (Rule `LMR_RULE_04` / MEDIUM): Missing helpline phone/email.
   - **Result**: `Non-Compliant` (~70% score).

3. **[`sample_data/sample_noncompliant_no_mfg_address.jpg`](file:///e:/GitHub/SIH2026/sample_data/sample_noncompliant_no_mfg_address.jpg)**
   - **Product**: Wireless Earbuds
   - **Triggered Violations**:
     - ❌ **Manufacturer / Packer Details** (Rule `LMR_RULE_05` / HIGH): Missing "Mfg by" name & address.
   - **Result**: `Non-Compliant` (~80% score).

4. **[`sample_data/sample_noncompliant_missing_veg_logo.jpg`](file:///e:/GitHub/SIH2026/sample_data/sample_noncompliant_missing_veg_logo.jpg)** *(new)*
   - **Product**: TastyBites Crunchy Snack
   - **Triggered Violations**:
     - ❌ **Veg / Non-Veg Statutory Logo** (Rule `FSSAI_VEG_RULE_01` / HIGH): No FSSAI Green Dot or Brown Triangle on Principal Display Panel.
   - **Result**: `Non-Compliant` (~88% score — all other rules pass, only logo missing).

> **Testing Tip**: On the Frontend (**Scan** page at `http://localhost:3000`), upload any non-compliant image from `sample_data/` to test real-time statutory rule violation detection, scoring penalties, and error breakdown!

---

## 3. Pre-Seeded Database Products

The SQLite backend database is pre-populated with products across various compliance statuses.  
The `dietaryType` field accepts: `VEG` | `NON_VEG` | `NON_FOOD`.

| Product Name | Brand | Category | Barcode | Dietary Type | Compliance Status | Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Smart Security Camera | SecureTech | Electronic Device | `890100000001` | `NON_FOOD` | `Compliant` | 94.0 |
| Smart Door Lock | HomeGuard | Smart Home | `890100000002` | `NON_FOOD` | `Under Review` | 72.0 |
| Wireless Baby Monitor | SafeNest | Consumer Electronics | `890100000003` | `NON_FOOD` | `Violation` | 41.0 |
| Fitness Smartwatch | FitPulse | Wearable | `890100000004` | `NON_FOOD` | `Compliant` | 91.0 |
| Smart Air Purifier | AirPure | Home Appliance | `890100000005` | `NON_FOOD` | `Under Review` | 68.0 |
| GPS Tracking Device | TrackPro | Tracking Device | `890100000006` | `NON_FOOD` | `Violation` | 38.0 |
| Britannia Good Day Biscuits 200g | Britannia | Packaged Food | `8901234567890` | `VEG` | `Compliant` | 96.0 |
| Fortune Sunlite Sunflower Oil 1L | Fortune | Edible Oil | `8901234567891` | `VEG` | `Under Review` | 72.0 |
| Amul Taaza Homogenised Milk 500ml | Amul | Dairy | `8909876543210` | `VEG` | `Compliant` | 88.0 |
| Maggi Chicken Masala Noodles 70g | Nestlé | Packaged Food | `8901234567892` | `NON_VEG` | `Compliant` | 95.0 |
| Tata Tea Gold 250g | Tata Consumer | Beverages | `8901234567893` | `VEG` | `Compliant` | 92.0 |
| Surf Excel Washing Powder 500g | HUL | Household | `8901234567894` | `NON_FOOD` | `Compliant` | 89.0 |

---

## 4. Pre-Seeded Statutory Rules

The system includes pre-loaded Legal Metrology Rules (Packaged Commodities) 2011 plus FSSAI Food Safety Standards:

- **RULE-001**: MRP Declaration (Mandatory inclusive tax declaration)
- **RULE-002**: Net Quantity Declaration (Standard SI units)
- **RULE-003**: Manufacturer Details (Complete name & postal address)
- **RULE-004**: Consumer Care Details (Toll-free number / email contact)
- **RULE-005**: Country of Origin (Domestic & imported goods)
- **RULE-006**: *(LM)* Unit Sale Price Declaration (For packages > 1kg/1L)
- **RULE-007** *(NEW)*: **Veg / Non-Veg Statutory Logo** — FSSAI Food Safety & Standards (Labelling & Display) Regulations 2.2.2: Mandatory Green Dot (Vegetarian) or Brown/Maroon Triangle (Non-Vegetarian) symbol on the Principal Display Panel of all packaged food products.
  - Rule ID: `FSSAI_VEG_RULE_01`
  - Severity: **High**
  - Applies to: All packaged food items (Exempt: Non-food commodities)

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
  "product": "Britannia Good Day Biscuits 200g",
  "user": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "issue": "Missing Veg/Non-Veg Statutory Logo",
  "description": "The FSSAI mandatory Green Dot (vegetarian) emblem is absent from the Principal Display Panel of the biscuit package, violating FSSAI 2.2.2.",
  "severity": "High"
}
```

### C. Create Statutory Rule (`POST /api/rules`)
```json
{
  "name": "Veg / Non-Veg Statutory Logo Verification",
  "category": "Food Safety",
  "severity": "High",
  "description": "Mandatory FSSAI Green Dot (Vegetarian) or Brown Triangle (Non-Vegetarian) symbol must be displayed on the Principal Display Panel of all packaged food products per FSSAI Food Safety and Standards (Labelling and Display) Regulations 2.2.2.",
  "conditions": [
    "Green Dot (solid green circle) must be present for all vegetarian food products",
    "Brown/Maroon Triangle must be present for all non-vegetarian food products",
    "Symbol must be placed adjacent to the product name or brand name",
    "Symbol must be of prescribed size: minimum 3mm diameter for Green Dot",
    "Symbol must be printed on the Principal Display Panel (PDP)"
  ],
  "validationFields": [
    {"field": "veg_non_veg_logo", "required": true, "validation": "VEG|NON_VEG|NON_FOOD"},
    {"field": "logo_position", "required": false, "validation": "PDP_ADJACENT"}
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
    "countryOrigin": true,
    "vegNonVegLogo": true
  },
  "dietaryType": "VEG",
  "remarks": "Re-inspected package label after manufacturer correction. All statutory details including the FSSAI Green Dot (Veg) emblem are now clearly legible on the Principal Display Panel.",
  "status": "Completed"
}
```

### E. Scan Product Image (`POST /api/products/scan`) — expected response shape
```json
{
  "name": "Britannia Good Day Biscuits 200g",
  "brand": "Britannia",
  "category": "Packaged Food",
  "score": 96.0,
  "status": "compliant",
  "extracted_data": {
    "mrp": "Rs. 40.00",
    "net_weight": "200 g",
    "mfg_date": "08/2026",
    "manufacturer_address": "Britannia Industries Ltd, Old Madras Road, Bengaluru",
    "consumer_care": "1800-103-1903",
    "country_of_origin": "India",
    "fssai_logo": "Detected",
    "veg_non_veg_logo": "VEG"
  },
  "compliance_report": [
    {"rule_id": "LMR_RULE_01", "rule": "MRP Declaration",               "passed": true,  "message": "MRP Rs. 40.00 detected and valid."},
    {"rule_id": "LMR_RULE_02", "rule": "Net Quantity",                  "passed": true,  "message": "Net weight 200 g declared in SI units."},
    {"rule_id": "LMR_RULE_04", "rule": "Consumer Care Details",         "passed": true,  "message": "Helpline 1800-103-1903 detected."},
    {"rule_id": "LMR_RULE_05", "rule": "Manufacturer & Address",        "passed": true,  "message": "Manufacturer address extracted."},
    {"rule_id": "LMR_RULE_06", "rule": "Date of Manufacture",           "passed": true,  "message": "Pkg date 08/2026 detected."},
    {"rule_id": "LMR_RULE_07", "rule": "Country of Origin",             "passed": true,  "message": "Country of Origin: India declared."},
    {"rule_id": "FSSAI_RULE_01","rule": "FSSAI Graphic Logo",           "passed": true,  "message": "FSSAI graphic logo detected on label."},
    {"rule_id": "FSSAI_VEG_RULE_01","rule": "Veg/Non-Veg Statutory Logo","passed": true, "message": "FSSAI Green Dot (Vegetarian) emblem detected on PDP."}
  ]
}
```
