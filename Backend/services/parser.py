"""
Statutory entity extraction from OCR text using regex + keyword-proximity
heuristics.

No ML/NER model is used here by design: Legal Metrology fields follow fairly
rigid printed conventions ("MRP Rs. X", "Net Wt. Y g", "Mfg by ..."), so
deterministic, auditable regex is more reliable and explainable for this
compliance domain than a generic NER model.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import List, Optional, Tuple

from services.vision import OcrChunk

# --------------------------------------------------------------------------
# Unit normalization
# --------------------------------------------------------------------------

_WEIGHT_UNITS = {"kg": "kg", "kgs": "kg", "g": "g", "gm": "g", "gms": "g", "gram": "g", "grams": "g"}
_VOLUME_UNITS = {"l": "l", "ltr": "l", "ltrs": "l", "litre": "l", "litres": "l", "liter": "l", "liters": "l", "ml": "ml"}
_COUNT_UNITS = {
    "pcs": "pcs",
    "piece": "pcs",
    "pieces": "pcs",
    "pair": "pcs",
    "pairs": "pcs",
    "unit": "pcs",
    "units": "pcs",
    "pack": "pcs",
    "packs": "pcs",
    "set": "pcs",
    "sets": "pcs",
}
_ALL_UNITS = {**_WEIGHT_UNITS, **_VOLUME_UNITS, **_COUNT_UNITS}

# Conversion factor to a single base unit per family, used for USP calculation.
_TO_BASE = {
    "kg": ("g", 1000.0),
    "g": ("g", 1.0),
    "l": ("ml", 1000.0),
    "ml": ("ml", 1.0),
    "pcs": ("pcs", 1.0),
}


@dataclass
class FieldMatch:
    value: str
    raw_text: str
    box: Optional[List[int]] = None
    confidence: Optional[float] = None


@dataclass
class ExtractionResult:
    mrp: Optional[FieldMatch] = None
    mrp_value: Optional[float] = None

    net_quantity: Optional[FieldMatch] = None
    net_quantity_value: Optional[float] = None
    net_quantity_unit: Optional[str] = None

    unit_sale_price: Optional[FieldMatch] = None
    usp_value: Optional[float] = None
    usp_unit: Optional[str] = None

    mfg_date: Optional[FieldMatch] = None
    expiry_date: Optional[FieldMatch] = None

    consumer_care: Optional[FieldMatch] = None
    manufacturer_address: Optional[FieldMatch] = None
    country_of_origin: Optional[FieldMatch] = None
    fssai_license: Optional[FieldMatch] = None
    fssai_logo: Optional[FieldMatch] = None
    is_vegetarian: Optional[bool] = None
    veg_mark: Optional[FieldMatch] = None


# --------------------------------------------------------------------------
# Regex patterns
# --------------------------------------------------------------------------

_MRP_RE = re.compile(
    r"(?:M\.?\s*R\.?\s*P\.?|Maximum\s+Retail\s+Price)\s*[:\-]?\s*"
    r"(?:\(?\s*incl\.?\s*(?:of\s*)?all\s*tax(?:es|esi)?\s*\)?\s*)?"
    r"[:\-]?\s*(?:Rs\.?|Rs_|₹|INR)?\s*\n?\s*([0-9]+(?:[.,][0-9]{1,2})?)",
    re.IGNORECASE,
)

_BARE_CURRENCY_RE = re.compile(r"(?:Rs\.?|Rs_|₹|INR)\s*\n?\s*([0-9]+(?:[.,][0-9]{1,2})?)", re.IGNORECASE)

_NET_QTY_RE = re.compile(
    r"(?:Net\s*(?:Wt\.?|Weight|Qty\.?|Quantity|Vol\.?|Volume|Contents?)\s*[:\-]?\s*)"
    r"\n?\s*([0-9]+(?:\.[0-9]+)?)\s*"
    r"(kgs?|gms?|grams?|g|ml|ltrs?|litres?|liters?|l|pcs|pieces?|pairs?|units?|packs?|sets?)\b",
    re.IGNORECASE,
)

_BARE_NET_QTY_RE = re.compile(
    r"\b([0-9]+(?:\.[0-9]+)?)\s*"
    r"(kgs?|gms?|grams?|g|ml|ltrs?|litres?|liters?|l|pcs|pieces?|pairs?|units?|packs?|sets?)\b",
    re.IGNORECASE,
)

_USP_RE = re.compile(
    r"(?:Declared\s*)?(?:Unit\s*Sale\s*Price|USP)\s*[:\-]?\s*(?:Rs\.?|Rs_|₹|INR)?\s*\n?\s*"
    r"([0-9]+(?:\.[0-9]+)?)\s*(?:/|per)\s*(kg|g|ml|l|litre|pcs|piece|unit|pair)\b",
    re.IGNORECASE,
)

_DATE_TOKEN = r"([0-9]{1,2}[/\-.][0-9]{1,2}[/\-.][0-9]{2,4}|[0-9]{1,2}[/\-.][0-9]{4}|[0-9]{4})"

_MFG_DATE_RE = re.compile(
    r"(?:Mfg\.?\s*Date|Manufactur(?:ed|ing)\s*Date|Pkd\.?\s*Date|Packed\s*(?:on|Date)|"
    r"Date\s*of\s*(?:Mfg|Manufacture|Packing|Pkg)|Month\s*[\&\w\s/\n]*Year\s*of\s*(?:Pkg|Mfg|Packing)|"
    r"Year\s*of\s*Pkg|of\s*Pkg)\s*[:\-]?\s*" + _DATE_TOKEN,
    re.IGNORECASE,
)

_EXPIRY_DATE_RE = re.compile(
    r"(?:Exp(?:iry)?\.?\s*Date|Use\s*By|Best\s*Before)\s*[:\-]?\s*"
    r"(" + _DATE_TOKEN + r"|[0-9]+\s*Months?\s*from\s*(?:Mfg|Packaging|Manufacture|Pkg))",
    re.IGNORECASE,
)

_EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
_TOLLFREE_RE = re.compile(r"\b1[-\s]?800[-\s]?[0-9\-\s]{6,}\b")
_PHONE_RE = re.compile(r"\b(?:\+91[-\s]?)?[6-9][0-9]{9}\b")

_MANUFACTURER_RE = re.compile(
    r"(?:Mfg\.?\s*(?:by|By)?|Manulacturer\s*(?:Address|Pddress)?|Manufacturer\s*(?:Address|Name)?|"
    r"Manufactured\s*by|Packed\s*by|Marketed\s*by|Marketed\s*(?:and|&)\s*Packed\s*by)\s*[:\-]?\s*(.+)",
    re.IGNORECASE,
)

_COUNTRY_ORIGIN_RE = re.compile(
    r"(?:Country\s*of\s*Origin|Made\s*in|Product\s*of)\s*[:\-]?\s*([a-zA-Z\s]+)",
    re.IGNORECASE,
)

_FSSAI_RE = re.compile(r"(?:FSSAI\s*(?:Lic(?:ense|\.)?)?\s*(?:No\.?)?\s*[:\-]?\s*)?(\d{14})", re.IGNORECASE)

_NONVEG_RE = re.compile(r"\bNon[\-\s]?Vegetarian\b", re.IGNORECASE)
_VEG_RE = re.compile(r"\bVegetarian\b", re.IGNORECASE)


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------


def _find_first(pattern: re.Pattern, chunks: List[OcrChunk]) -> Optional[Tuple[re.Match, OcrChunk]]:
    for chunk in chunks:
        if "missing" in chunk["text"].lower() or "---" in chunk["text"]:
            continue
        m = pattern.search(chunk["text"])
        if m:
            return m, chunk
    return None


def _find_first_in_text(pattern: re.Pattern, full_text: str) -> Optional[re.Match]:
    for line in full_text.split("\n"):
        if "missing" in line.lower() or "---" in line:
            continue
    return pattern.search(full_text)


def _normalize_unit(raw_unit: str) -> Optional[str]:
    key = raw_unit.lower()
    if key in _ALL_UNITS:
        return _ALL_UNITS[key]
    if key.rstrip("s") in _ALL_UNITS:
        return _ALL_UNITS[key.rstrip("s")]
    return None


# --------------------------------------------------------------------------
# Main extraction routine
# --------------------------------------------------------------------------


def extract_entities(chunks: List[OcrChunk]) -> ExtractionResult:
    """
    Extract all statutory fields from OCR chunks.
    """
    valid_lines = [c["text"] for c in chunks if "missing" not in c["text"].lower() and "---" not in c["text"]]
    full_text = "\n".join(valid_lines)
    result = ExtractionResult()

    # ---- MRP ----
    hit = _find_first(_MRP_RE, chunks)
    if hit:
        m, chunk = hit
        result.mrp = FieldMatch(value=m.group(1), raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"])
    else:
        m = _find_first_in_text(_MRP_RE, full_text) or _find_first_in_text(_BARE_CURRENCY_RE, full_text)
        if m:
            result.mrp = FieldMatch(value=m.group(1), raw_text=m.group(0))
    if result.mrp:
        try:
            result.mrp_value = float(result.mrp.value.replace(",", ""))
        except ValueError:
            result.mrp_value = None

    # ---- Net quantity ----
    hit = _find_first(_NET_QTY_RE, chunks)
    if hit:
        m, chunk = hit
        result.net_quantity = FieldMatch(
            value=f"{m.group(1)} {m.group(2)}", raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"]
        )
    else:
        m = _find_first_in_text(_NET_QTY_RE, full_text) or _find_first_in_text(_BARE_NET_QTY_RE, full_text)
        if m:
            result.net_quantity = FieldMatch(value=f"{m.group(1)} {m.group(2)}", raw_text=m.group(0))
    if result.net_quantity:
        m2 = re.search(r"([0-9.]+)\s*([a-zA-Z]+)", result.net_quantity.value)
        if m2:
            try:
                result.net_quantity_value = float(m2.group(1))
            except ValueError:
                result.net_quantity_value = None
            result.net_quantity_unit = _normalize_unit(m2.group(2))

    # ---- Unit sale price (declared) ----
    hit = _find_first(_USP_RE, chunks)
    if hit:
        m, chunk = hit
        result.unit_sale_price = FieldMatch(
            value=f"{m.group(1)}/{m.group(2)}", raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"]
        )
    else:
        m = _find_first_in_text(_USP_RE, full_text)
        if m:
            result.unit_sale_price = FieldMatch(value=f"{m.group(1)}/{m.group(2)}", raw_text=m.group(0))
    if result.unit_sale_price:
        try:
            price_str, unit_str = result.unit_sale_price.value.split("/")
            result.usp_value = float(price_str)
            result.usp_unit = _normalize_unit(unit_str)
        except (ValueError, IndexError):
            pass

    # ---- Dates ----
    hit = _find_first(_MFG_DATE_RE, chunks)
    if hit:
        m, chunk = hit
        result.mfg_date = FieldMatch(value=m.group(1), raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"])
    else:
        m = _find_first_in_text(_MFG_DATE_RE, full_text)
        if m:
            result.mfg_date = FieldMatch(value=m.group(1), raw_text=m.group(0))

    hit = _find_first(_EXPIRY_DATE_RE, chunks)
    if hit:
        m, chunk = hit
        result.expiry_date = FieldMatch(value=m.group(1), raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"])
    else:
        m = _find_first_in_text(_EXPIRY_DATE_RE, full_text)
        if m:
            result.expiry_date = FieldMatch(value=m.group(1), raw_text=m.group(0))

    # ---- Consumer care (email OR toll-free OR phone) ----
    for pattern in (_EMAIL_RE, _TOLLFREE_RE, _PHONE_RE):
        hit = _find_first(pattern, chunks)
        if hit:
            m, chunk = hit
            existing = result.consumer_care.value if result.consumer_care else None
            combined = f"{existing} / {m.group(0)}" if existing else m.group(0)
            result.consumer_care = FieldMatch(value=combined, raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"])
    if not result.consumer_care:
        for pattern in (_EMAIL_RE, _TOLLFREE_RE, _PHONE_RE):
            m = _find_first_in_text(pattern, full_text)
            if m:
                existing = result.consumer_care.value if result.consumer_care else None
                combined = f"{existing} / {m.group(0)}" if existing else m.group(0)
                result.consumer_care = FieldMatch(value=combined, raw_text=m.group(0))

    # ---- Manufacturer / packer / marketer ----
    hit = _find_first(_MANUFACTURER_RE, chunks)
    if hit:
        m, chunk = hit
        val = m.group(1).strip()
        if "missing" not in val.lower() and "---" not in val:
            result.manufacturer_address = FieldMatch(
                value=val, raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"]
            )
    else:
        m = _find_first_in_text(_MANUFACTURER_RE, full_text)
        if m:
            val = m.group(1).strip()
            if "missing" not in val.lower() and "---" not in val:
                result.manufacturer_address = FieldMatch(value=val[:160], raw_text=m.group(0))

    # ---- Country of origin ----
    hit = _find_first(_COUNTRY_ORIGIN_RE, chunks)
    if hit:
        m, chunk = hit
        val = m.group(1).strip()
        if "missing" not in val.lower() and "---" not in val:
            result.country_of_origin = FieldMatch(
                value=val, raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"]
            )
    else:
        m = _find_first_in_text(_COUNTRY_ORIGIN_RE, full_text)
        if m:
            val = m.group(1).strip()
            if "missing" not in val.lower() and "---" not in val:
                result.country_of_origin = FieldMatch(value=val[:50], raw_text=m.group(0))

    # ---- FSSAI license & graphic logo ----
    hit = _find_first(_FSSAI_RE, chunks)
    if hit:
        m, chunk = hit
        result.fssai_license = FieldMatch(value=m.group(1), raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"])
    else:
        m = _find_first_in_text(_FSSAI_RE, full_text)
        if m:
            result.fssai_license = FieldMatch(value=m.group(1), raw_text=m.group(0))

    # Visual FSSAI Graphic Logo detection match
    for chunk in chunks:
        t = chunk["text"].lower()
        if any(k in t for k in ["fssai", "fssal", "fssi", "fsai", "issai", "ssai", "lic", "license", "licence", "graphic logo", "logo"]):
            result.fssai_logo = FieldMatch(value="Detected", raw_text=chunk["text"], box=chunk["box"], confidence=chunk.get("confidence", 0.95))
            break

    if not result.fssai_logo:
        from services.vision import detect_fssai_logo
        logo_chunk = detect_fssai_logo(None, chunks)
        if logo_chunk:
            result.fssai_logo = FieldMatch(
                value="Detected",
                raw_text=logo_chunk["text"],
                box=logo_chunk["box"],
                confidence=logo_chunk.get("confidence", 0.95),
            )

    # ---- Veg / non-veg declaration ----
    hit = _find_first(_NONVEG_RE, chunks)
    if hit:
        m, chunk = hit
        result.is_vegetarian = False
        result.veg_mark = FieldMatch(value="Non-Vegetarian", raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"])
    else:
        hit = _find_first(_VEG_RE, chunks)
        if hit:
            m, chunk = hit
            result.is_vegetarian = True
            result.veg_mark = FieldMatch(value="Vegetarian", raw_text=chunk["text"], box=chunk["box"], confidence=chunk["confidence"])

    return result


def compute_expected_usp(
    mrp_value: Optional[float], qty_value: Optional[float], qty_unit: Optional[str]
) -> Optional[Tuple[float, str]]:
    """
    Compute mandated unit sale price (price per standard base unit) from MRP and net quantity.
    """
    if mrp_value is None or qty_value is None or qty_unit is None or qty_value <= 0:
        return None
    if qty_unit not in _TO_BASE:
        return None
    base_unit, factor = _TO_BASE[qty_unit]
    qty_in_base = qty_value * factor
    if qty_in_base <= 0:
        return None
    usp = mrp_value / qty_in_base
    return round(usp, 4), base_unit
