"""
Deterministic Legal Metrology (Packaged Commodities) Rules, 2011 compliance engine.
"""
from __future__ import annotations

from typing import List, Optional, Tuple

from models.schemas import BoundingBox, ComplianceRuleResult, ExtractedData, Severity
from services.parser import ExtractionResult, compute_expected_usp

_USP_MANDATORY_THRESHOLD_G_ML = 1000.0
_USP_TOLERANCE_PCT = 5.0

_SEVERITY_WEIGHTS = {
    Severity.CRITICAL: 30,
    Severity.HIGH: 20,
    Severity.MEDIUM: 10,
    Severity.LOW: 5,
}


def _fmt_currency(value: Optional[float]) -> Optional[str]:
    if value is None:
        return None
    return f"Rs. {value:.2f}"


def _fmt_usp(value: Optional[float], unit: Optional[str]) -> Optional[str]:
    if value is None or unit is None:
        return None
    return f"Rs. {value:.2f} per {unit}"


def build_extracted_data(extraction: ExtractionResult) -> ExtractedData:
    calc = compute_expected_usp(extraction.mrp_value, extraction.net_quantity_value, extraction.net_quantity_unit)
    calc_str = _fmt_usp(calc[0], calc[1]) if calc else None

    declared_usp_str = None
    if extraction.usp_value is not None and extraction.usp_unit is not None:
        declared_usp_str = _fmt_usp(extraction.usp_value, extraction.usp_unit)
    elif extraction.unit_sale_price is not None:
        declared_usp_str = extraction.unit_sale_price.value

    mrp_str = _fmt_currency(extraction.mrp_value) if extraction.mrp_value is not None else (
        extraction.mrp.value if extraction.mrp else None
    )

    return ExtractedData(
        mrp=mrp_str,
        net_weight=extraction.net_quantity.value if extraction.net_quantity else None,
        unit_sale_price=declared_usp_str,
        calculated_unit_sale_price=calc_str,
        mfg_date=extraction.mfg_date.value if extraction.mfg_date else None,
        expiry_date=extraction.expiry_date.value if extraction.expiry_date else None,
        fssai_license=extraction.fssai_license.value if extraction.fssai_license else None,
        fssai_logo="Detected" if extraction.fssai_logo else "Not Found",
        consumer_care=extraction.consumer_care.value if extraction.consumer_care else None,
        manufacturer_address="Found" if extraction.manufacturer_address else "Not Found",
        country_of_origin=extraction.country_of_origin.value if extraction.country_of_origin else None,
        is_vegetarian=extraction.is_vegetarian,
    )


def build_bounding_boxes(extraction: ExtractionResult) -> List[BoundingBox]:
    boxes: List[BoundingBox] = []
    field_map = {
        "mrp": extraction.mrp,
        "net_weight": extraction.net_quantity,
        "unit_sale_price": extraction.unit_sale_price,
        "mfg_date": extraction.mfg_date,
        "expiry_date": extraction.expiry_date,
        "fssai_license": extraction.fssai_license,
        "fssai_logo": extraction.fssai_logo,
        "consumer_care": extraction.consumer_care,
        "manufacturer_address": extraction.manufacturer_address,
        "country_of_origin": extraction.country_of_origin,
        "veg_mark": extraction.veg_mark,
    }
    for field_name, match in field_map.items():
        if match and match.box:
            boxes.append(
                BoundingBox(
                    field=field_name,
                    text=match.raw_text,
                    box=match.box,
                    confidence=match.confidence,
                )
            )
    return boxes


# --------------------------------------------------------------------------
# Individual Statutory Rules (LMR 2011)
# --------------------------------------------------------------------------

def _rule_mrp_presence(extraction: ExtractionResult) -> ComplianceRuleResult:
    passed = extraction.mrp is not None or extraction.mrp_value is not None
    return ComplianceRuleResult(
        rule="MRP Declaration",
        rule_id="LMR_RULE_01",
        passed=passed,
        severity=Severity.CRITICAL,
        message=(
            "MRP is clearly printed on the package."
            if passed
            else "MRP (Maximum Retail Price) could not be detected. Rule 6(1)(f) requires it to be declared inclusive of all taxes."
        ),
    )


def _rule_net_quantity_presence(extraction: ExtractionResult) -> ComplianceRuleResult:
    passed = extraction.net_quantity is not None
    return ComplianceRuleResult(
        rule="Net Quantity Declaration",
        rule_id="LMR_RULE_02",
        passed=passed,
        severity=Severity.CRITICAL,
        message=(
            "Net quantity (weight/volume/count) is declared."
            if passed
            else "Net quantity could not be detected. Rule 6(1)(c) mandates a standard-unit declaration of weight, volume, or number."
        ),
    )


def _rule_usp_accuracy(extraction: ExtractionResult) -> ComplianceRuleResult:
    calc = compute_expected_usp(extraction.mrp_value, extraction.net_quantity_value, extraction.net_quantity_unit)

    if calc is None:
        return ComplianceRuleResult(
            rule="Unit Sale Price (USP)",
            rule_id="LMR_RULE_03",
            passed=True,
            severity=Severity.HIGH,
            message="Unable to calculate expected USP because MRP and/or net quantity is missing or unparseable.",
        )

    calc_value, calc_unit = calc

    if extraction.net_quantity_value is not None:
        unit_lower = (extraction.net_quantity_unit or "").lower()
        if unit_lower in ("g", "ml", "pcs") and extraction.net_quantity_value < _USP_MANDATORY_THRESHOLD_G_ML:
            if extraction.usp_value is None and extraction.unit_sale_price is None:
                return ComplianceRuleResult(
                    rule="Unit Sale Price (USP)",
                    rule_id="LMR_RULE_03",
                    passed=True,
                    severity=Severity.HIGH,
                    message=f"No declared USP found, but it is not mandatory below 1 kg/1 L. Calculated reference: Rs. {calc_value:.2f}/{calc_unit}.",
                )

    if extraction.usp_value is None:
        return ComplianceRuleResult(
            rule="Unit Sale Price (USP)",
            rule_id="LMR_RULE_03",
            passed=False,
            severity=Severity.HIGH,
            message=f"No declared USP found on the package; it is mandatory for packages above 1 kg/1 L (Rule 6(1)(e)).",
        )

    declared_value = extraction.usp_value
    diff_pct = abs(declared_value - calc_value) / calc_value * 100.0 if calc_value > 0 else 0.0
    passed = diff_pct <= _USP_TOLERANCE_PCT

    return ComplianceRuleResult(
        rule="Unit Sale Price (USP)",
        rule_id="LMR_RULE_03",
        passed=passed,
        severity=Severity.HIGH,
        message=(
            f"Calculated USP matches declared USP within tolerance."
            if passed
            else f"Declared USP deviates from calculated USP."
        ),
    )


def _rule_consumer_care(extraction: ExtractionResult) -> ComplianceRuleResult:
    passed = extraction.consumer_care is not None
    return ComplianceRuleResult(
        rule="Consumer Care Details",
        rule_id="LMR_RULE_04",
        passed=passed,
        severity=Severity.MEDIUM,
        message=(
            "Consumer care email/phone found on the package."
            if passed
            else "No toll-free number or email helpline found on the visible panel. Rule 6(1)(a) requires consumer grievance redressal contact details."
        ),
    )


def _rule_manufacturer(extraction: ExtractionResult) -> ComplianceRuleResult:
    passed = extraction.manufacturer_address is not None
    return ComplianceRuleResult(
        rule="Manufacturer / Packer / Marketer Details",
        rule_id="LMR_RULE_05",
        passed=passed,
        severity=Severity.HIGH,
        message=(
            "Manufacturer/packer/marketer name and address found."
            if passed
            else "No 'Mfg by' / 'Packed by' / 'Marketed by' declaration found. Rule 6(1)(a) requires this identification."
        ),
    )


def _rule_dates(extraction: ExtractionResult) -> ComplianceRuleResult:
    passed = extraction.mfg_date is not None or extraction.expiry_date is not None
    return ComplianceRuleResult(
        rule="Manufacture / Expiry Date Declaration",
        rule_id="LMR_RULE_06",
        passed=passed,
        severity=Severity.MEDIUM,
        message=(
            "Manufacturing or best-before/expiry date is declared."
            if passed
            else "Neither a manufacturing date nor a best-before/expiry date could be detected. Rule 6(1)(d) requires this for most commodities."
        ),
    )


def _rule_country_origin(extraction: ExtractionResult) -> ComplianceRuleResult:
    passed = extraction.country_of_origin is not None
    return ComplianceRuleResult(
        rule="Country of Origin Declaration",
        rule_id="LMR_RULE_07",
        passed=passed,
        severity=Severity.HIGH,
        message=(
            f"Country of origin declared ({extraction.country_of_origin.value if extraction.country_of_origin else 'Found'})."
            if passed
            else "Country of origin declaration could not be detected on the package wrapper. Rule 6(1)(n) requires country of origin."
        ),
    )


def _rule_fssai_logo(extraction: ExtractionResult) -> ComplianceRuleResult:
    passed = extraction.fssai_logo is not None
    return ComplianceRuleResult(
        rule="FSSAI Graphic Logo Presence",
        rule_id="FSSAI_RULE_01",
        passed=passed,
        severity=Severity.HIGH,
        message=(
            "FSSAI Graphic Logo is clearly visible on the package wrapper."
            if passed
            else "FSSAI Graphic Logo could not be detected on the packaging. FSSAI regulations require the visual logo badge on packaged food."
        ),
    )


def run_compliance_checks(extraction: ExtractionResult) -> List[ComplianceRuleResult]:
    return [
        _rule_mrp_presence(extraction),
        _rule_net_quantity_presence(extraction),
        _rule_usp_accuracy(extraction),
        _rule_consumer_care(extraction),
        _rule_manufacturer(extraction),
        _rule_dates(extraction),
        _rule_country_origin(extraction),
        _rule_fssai_logo(extraction),
    ]


def compute_score_and_status(rules_result: List[ComplianceRuleResult]) -> Tuple[float, str]:
    """
    Weighted scoring: each failed rule deducts its severity weight from 100,
    floored at 0. Status is 'compliant' only if no CRITICAL rules fail,
    at most 1 non-critical rule fails, and score >= 80.0.
    """
    score = 100.0
    critical_failed = False
    failed_count = 0
    for r in rules_result:
        if not r.passed:
            failed_count += 1
            score -= _SEVERITY_WEIGHTS.get(r.severity, 10)
            if r.severity == Severity.CRITICAL:
                critical_failed = True
    score = max(0.0, score)

    status = "compliant" if (not critical_failed and failed_count <= 1 and score >= 80.0) else "non_compliant"
    return round(score, 1), status
