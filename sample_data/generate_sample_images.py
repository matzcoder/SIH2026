import os
from PIL import Image, ImageDraw, ImageFont

SAMPLE_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_ROOT = os.path.dirname(SAMPLE_DIR)
FSSAI_LOGO_PATH = os.path.join(WORKSPACE_ROOT, "food-safety-standards-authority-india-260nw-2323173005.webp")

os.makedirs(SAMPLE_DIR, exist_ok=True)

try:
    title_font = ImageFont.truetype("arialbd.ttf", 26)
    text_font  = ImageFont.truetype("arial.ttf",   22)
    small_font = ImageFont.truetype("arial.ttf",   16)
    badge_font = ImageFont.truetype("arialbd.ttf", 14)
except Exception:
    try:
        title_font = ImageFont.load_default(size=26)
        text_font  = ImageFont.load_default(size=22)
        small_font = ImageFont.load_default(size=16)
        badge_font = ImageFont.load_default(size=14)
    except Exception:
        title_font = ImageFont.load_default()
        text_font  = ImageFont.load_default()
        small_font = ImageFont.load_default()
        badge_font = ImageFont.load_default()


def get_fssai_logo_image():
    """Load and prepare the authentic FSSAI logo image."""
    if os.path.exists(FSSAI_LOGO_PATH):
        try:
            im = Image.open(FSSAI_LOGO_PATH)
            # Crop off watermark at bottom ~12%
            clean_logo = im.crop((0, 0, im.width, int(im.height * 0.88)))
            return clean_logo
        except Exception:
            pass
    return None


def draw_veg_dot(draw, x, y, size=32):
    """Draw the FSSAI statutory Green Dot (Vegetarian) emblem.
    The emblem is a solid green filled circle inside a green square border,
    as per FSSAI Food Safety & Standards (Labelling & Display) Regulations 2.2.2.
    """
    # Outer green square border
    draw.rectangle([x, y, x + size, y + size], outline="#166534", width=2, fill="#FFFFFF")
    # Solid green circle inside
    margin = 5
    draw.ellipse(
        [x + margin, y + margin, x + size - margin, y + size - margin],
        fill="#16A34A",
        outline="#14532D",
        width=1,
    )


def draw_nonveg_triangle(draw, x, y, size=32):
    """Draw the FSSAI statutory Brown/Maroon Triangle (Non-Vegetarian) emblem.
    The emblem is a solid brown filled equilateral triangle inside a brown square border,
    as per FSSAI Food Safety & Standards (Labelling & Display) Regulations 2.2.2.
    """
    # Outer brown square border
    draw.rectangle([x, y, x + size, y + size], outline="#78350F", width=2, fill="#FFFFFF")
    # Solid brown equilateral triangle pointing up
    margin = 4
    top    = (x + size // 2, y + margin)
    bottom_left  = (x + margin,        y + size - margin)
    bottom_right = (x + size - margin, y + size - margin)
    draw.polygon([top, bottom_left, bottom_right], fill="#92400E", outline="#78350F")


def draw_dietary_badge(draw, img, x, y, dietary_type):
    """Draw the appropriate statutory dietary emblem + label text.

    Args:
        dietary_type: "VEG" | "NON_VEG" | "NON_FOOD" | None
    """
    size = 32
    if dietary_type == "VEG":
        draw_veg_dot(draw, x, y, size)
        draw.text((x + size + 6, y + 6), "VEGETARIAN", fill="#166534", font=badge_font)
        draw.text((x + size + 6, y + 20), "(Green Dot — FSSAI 2.2.2)", fill="#4B5563", font=small_font)
    elif dietary_type == "NON_VEG":
        draw_nonveg_triangle(draw, x, y, size)
        draw.text((x + size + 6, y + 6), "NON-VEGETARIAN", fill="#78350F", font=badge_font)
        draw.text((x + size + 6, y + 20), "(Brown Triangle — FSSAI 2.2.2)", fill="#4B5563", font=small_font)
    elif dietary_type == "NON_FOOD":
        draw.rectangle([x, y, x + size, y + size], outline="#6B7280", width=2, fill="#F3F4F6")
        draw.text((x + 4, y + 8), "N/A", fill="#6B7280", font=badge_font)
        draw.text((x + size + 6, y + 6), "NON-FOOD COMMODITY", fill="#6B7280", font=badge_font)
        draw.text((x + size + 6, y + 20), "(Dietary logo exempt)", fill="#9CA3AF", font=small_font)
    else:
        # Missing / unknown — show red warning
        draw.rectangle([x, y, x + size, y + size], outline="#DC2626", width=2, fill="#FEF2F2")
        draw.text((x + 4, y + 8), "?", fill="#DC2626", font=badge_font)
        draw.text((x + size + 6, y + 6), "--- MISSING VEG/NON-VEG LOGO ---", fill="#DC2626", font=badge_font)


def create_label(
    filename,
    title,
    brand,
    lines,
    bg_color="#FFFFFF",
    accent_color="#1E3A8A",
    has_fssai_logo=True,
    dietary_type="VEG",     # "VEG" | "NON_VEG" | "NON_FOOD" | None (missing)
):
    """Render a packaged commodity label image with all statutory declarations.

    The `dietary_type` argument controls which FSSAI statutory emblem is drawn:
      - "VEG"      → Green Dot (solid green circle in green border square)
      - "NON_VEG"  → Brown Triangle (equilateral triangle in brown border square)
      - "NON_FOOD" → N/A marker (grey box, dietary logo not required)
      - None       → Missing emblem warning (red dashed box) — triggers FSSAI_VEG_RULE_01 FAIL
    """
    img  = Image.new("RGB", (1000, 820), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Outer Border
    draw.rectangle([20, 20, 980, 800], outline=accent_color, width=4)
    draw.rectangle([30, 30, 970, 90],  fill=accent_color)

    # Header Title
    draw.text((50, 45), title.upper(), fill="#FFFFFF", font=title_font)

    # Render Custom Declaration Lines
    y = 115
    for line in lines:
        draw.text((50, y), line, fill="#1F2937", font=text_font)
        y += 52

    # ── FSSAI Graphic Logo Badge ───────────────────────────────────────────────
    logo_y = y + 10
    if has_fssai_logo:
        draw.rectangle([50, logo_y, 370, logo_y + 70], outline="#166534", width=3, fill="#FFFFFF")
        fssai_img = get_fssai_logo_image()
        if fssai_img:
            target_w = 260
            target_h = int(target_w * fssai_img.height / fssai_img.width)
            if target_h > 62:
                target_h = 62
                target_w = int(target_h * fssai_img.width / fssai_img.height)
            resized_logo = fssai_img.resize((target_w, target_h), Image.LANCZOS)
            paste_x = 50 + (320 - target_w) // 2
            paste_y = logo_y + (70 - target_h) // 2
            img.paste(resized_logo, (paste_x, paste_y))
        else:
            draw.text((70, logo_y + 22), "fssai Graphic Logo", fill="#166534", font=text_font)
    else:
        draw.rectangle([50, logo_y, 370, logo_y + 70], outline="#991B1B", width=2, fill="#FEF2F2")
        draw.text((60, logo_y + 22), "--- NO FSSAI GRAPHIC LOGO ---", fill="#991B1B", font=text_font)

    # ── Veg / Non-Veg Statutory Emblem (FSSAI 2.2.2) ─────────────────────────
    emblem_x = 400
    emblem_y = logo_y + 4
    draw_dietary_badge(draw, img, emblem_x, emblem_y, dietary_type)

    # ── Simulated Barcode ─────────────────────────────────────────────────────
    barcode_y = logo_y + 90
    draw.rectangle([50, barcode_y, 500, barcode_y + 60], fill="#000000")
    draw.text((70, barcode_y + 18), "||| |||| || ||||| ||| 890100009999", fill="#FFFFFF", font=text_font)

    filepath = os.path.join(SAMPLE_DIR, filename)
    img.save(filepath, quality=95)
    print(f"Saved: {filepath}")


# ==============================================================================
# COMPLIANT SAMPLE LABELS
# ==============================================================================

# 1. Compliant Biscuit Pack — VEG (Green Dot)
create_label(
    filename="sample_biscuit_label.jpg",
    title="NutriCrunch Wheat Biscuits",
    brand="ABC Foods",
    lines=[
        "Brand Name: ABC Foods",
        "Net Quantity: 200 g",
        "M.R.P. (Incl. of all taxes): Rs. 40.00",
        "Month & Year of Pkg: 08/2026",
        "Manufacturer Address: ABC Foods Pvt Ltd, Plot 42, Industrial Estate, Chennai - 600032",
        "Consumer Care Helpline: 1800-123-4567 / support@abcfoods.com",
        "Country of Origin: India",
        "Batch No: BATCH-2026-X89",
        "Barcode: 8901234567890",
    ],
    bg_color="#FEF3C7",
    accent_color="#B45309",
    has_fssai_logo=True,
    dietary_type="VEG",
)

# 2. Compliant Cooking Oil — VEG (Green Dot)
create_label(
    filename="sample_cooking_oil_label.jpg",
    title="Pure Gold Sunflower Oil",
    brand="XYZ Agro",
    lines=[
        "Brand Name: XYZ Agro",
        "Net Quantity: 1000 ml",
        "Declared Unit Sale Price: Rs. 0.18 per ml",
        "M.R.P. (Incl. of all taxes): Rs. 180.00",
        "Month & Year of Pkg: 07/2026",
        "Manufacturer Address: XYZ Agro Foods Ltd, Sector 5, Coimbatore - 641001",
        "Consumer Care Helpline: 1800-987-6543 / care@xyzagro.in",
        "Country of Origin: India",
        "Batch No: XYZ-882",
        "Barcode: 8901234567891",
    ],
    bg_color="#ECFDF5",
    accent_color="#047857",
    has_fssai_logo=True,
    dietary_type="VEG",
)

# 3. Compliant Non-Veg Noodles — NON_VEG (Brown Triangle) — NEW
create_label(
    filename="sample_chicken_noodles_label.jpg",
    title="Maggi Chicken Masala Noodles 70g",
    brand="Nestle India",
    lines=[
        "Brand Name: Maggi (Nestle India Ltd)",
        "Net Quantity: 70 g",
        "M.R.P. (Incl. of all taxes): Rs. 15.00",
        "Month & Year of Pkg: 09/2026",
        "Manufacturer Address: Nestle India Ltd, Industrial Area Phase-1, Moga - 142001",
        "Consumer Care Helpline: 1800-103-0626 / consumerservices@in.nestle.com",
        "Country of Origin: India",
        "Batch No: MG-CH-2026-09",
        "Barcode: 8901234567892",
    ],
    bg_color="#FFF7ED",
    accent_color="#C2410C",
    has_fssai_logo=True,
    dietary_type="NON_VEG",
)

# 4. Non-Food Electronics Label — NON_FOOD (Exempt)
create_label(
    filename="sample_smartwatch_label.jpg",
    title="FitPulse Pro Smartwatch",
    brand="FitPulse",
    lines=[
        "Brand Name: FitPulse",
        "Net Quantity: 100 g",
        "M.R.P. (Incl. of all taxes): Rs. 2999.00",
        "Month & Year of Pkg: 08/2026",
        "Manufacturer Address: FitPulse Electronics India Pvt Ltd, Tech Park, Bengaluru - 560100",
        "Consumer Care Helpline: +91 80 4567 8900 / customercare@fitpulse.in",
        "Country of Origin: India",
        "Barcode: 890100000004",
    ],
    bg_color="#EFF6FF",
    accent_color="#1D4ED8",
    has_fssai_logo=False,
    dietary_type="NON_FOOD",
)

# ==============================================================================
# NON-COMPLIANT SAMPLE LABELS (TRIGGER VIOLATIONS)
# ==============================================================================

# 5. Non-Compliant: Missing MRP + Date + Veg/Non-Veg Logo
create_label(
    filename="sample_noncompliant_missing_mrp_date.jpg",
    title="FreshSnack Potato Chips (NON-COMPLIANT)",
    brand="FreshSnack",
    lines=[
        "Brand Name: FreshSnack",
        "Net Quantity: 50 g",
        "--- MISSING MRP DECLARATION ---",
        "--- MISSING MANUFACTURING / PACKING DATE ---",
        "Manufacturer Address: FreshSnack Foods Ltd, Industrial Park, Hyderabad",
        "Consumer Care Helpline: 1800-444-5555 / care@freshsnack.com",
        "Country of Origin: India",
        "Batch No: FS-9901",
    ],
    bg_color="#FEF2F2",
    accent_color="#DC2626",
    has_fssai_logo=False,
    dietary_type=None,      # Missing veg/non-veg logo — triggers FSSAI_VEG_RULE_01 FAIL
)

# 6. Non-Compliant: Missing FSSAI Graphic Logo (but has veg logo)
create_label(
    filename="sample_noncompliant_missing_fssai_logo.jpg",
    title="Crunchy Munch Snack (MISSING FSSAI LOGO)",
    brand="TastyBites",
    lines=[
        "Brand Name: TastyBites",
        "Net Quantity: 150 g",
        "M.R.P. (Incl. of all taxes): Rs. 35.00",
        "Month & Year of Pkg: 08/2026",
        "Manufacturer Address: TastyBites India Ltd, Industrial Zone, Pune",
        "Consumer Care Helpline: 1800-222-3333 / care@tastybites.com",
        "Country of Origin: India",
        "--- MISSING MANDATORY FSSAI GRAPHIC LOGO ---",
    ],
    bg_color="#FEF2F2",
    accent_color="#991B1B",
    has_fssai_logo=False,
    dietary_type="VEG",     # Veg logo present, but FSSAI logo is missing
)

# 7. Non-Compliant: Wrong USP + Missing Consumer Care
create_label(
    filename="sample_noncompliant_wrong_usp.jpg",
    title="Premium Basmati Rice 2kg (NON-COMPLIANT)",
    brand="RoyalGrains",
    lines=[
        "Brand Name: RoyalGrains",
        "Net Quantity: 2 kg",
        "M.R.P. (Incl. of all taxes): Rs. 200.00",
        "Declared Unit Sale Price: Rs. 0.85 per g",
        "Month & Year of Pkg: 06/2026",
        "Manufacturer Address: RoyalGrains India Pvt Ltd, Karnal, Haryana",
        "--- MISSING CONSUMER HELPLINE / EMAIL ---",
        "Country of Origin: India",
    ],
    bg_color="#FFFBEB",
    accent_color="#D97706",
    has_fssai_logo=True,
    dietary_type="VEG",
)

# 8. Non-Compliant: Missing Manufacturer Address
create_label(
    filename="sample_noncompliant_no_mfg_address.jpg",
    title="Wireless Earbuds (NON-COMPLIANT)",
    brand="SoundBlast",
    lines=[
        "Brand Name: SoundBlast",
        "Net Quantity: 50 g",
        "M.R.P. (Incl. of all taxes): Rs. 1499.00",
        "Month & Year of Pkg: 08/2026",
        "--- MISSING MANUFACTURER / PACKER NAME & ADDRESS ---",
        "Consumer Care Helpline: support@soundblast.com",
        "Country of Origin: China",
    ],
    bg_color="#FDF2F8",
    accent_color="#DB2777",
    has_fssai_logo=False,
    dietary_type="NON_FOOD",
)

# 9. Non-Compliant: ALL other rules pass, ONLY veg/non-veg logo missing — NEW
create_label(
    filename="sample_noncompliant_missing_veg_logo.jpg",
    title="TastyBites Crunchy Snack (MISSING VEG LOGO)",
    brand="TastyBites",
    lines=[
        "Brand Name: TastyBites Premium",
        "Net Quantity: 100 g",
        "M.R.P. (Incl. of all taxes): Rs. 20.00",
        "Month & Year of Pkg: 09/2026",
        "Manufacturer Address: TastyBites India Ltd, Industrial Zone, Pune - 411017",
        "Consumer Care Helpline: 1800-222-3333 / care@tastybites.com",
        "Country of Origin: India",
        "Batch No: TB-100-SEP26",
        "Barcode: 8901234567895",
    ],
    bg_color="#FFFBEB",
    accent_color="#B45309",
    has_fssai_logo=True,
    dietary_type=None,      # Missing veg/non-veg logo — only violation (triggers FSSAI_VEG_RULE_01)
)

print("\nAll sample images generated successfully.")
print("New files:")
print("  sample_chicken_noodles_label.jpg    — Compliant, NON_VEG (Brown Triangle)")
print("  sample_noncompliant_missing_veg_logo.jpg — Non-Compliant (only Veg/Non-Veg logo missing)")
