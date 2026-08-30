import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs(r"d:\SIH2026\sample_data", exist_ok=True)

try:
    title_font = ImageFont.truetype("arialbd.ttf", 26)
    text_font = ImageFont.truetype("arial.ttf", 22)
except Exception:
    try:
        title_font = ImageFont.load_default(size=26)
        text_font = ImageFont.load_default(size=22)
    except Exception:
        title_font = ImageFont.load_default()
        text_font = ImageFont.load_default()

def create_label(filename, title, brand, lines, bg_color="#FFFFFF", accent_color="#1E3A8A", has_fssai_logo=True):
    img = Image.new('RGB', (1000, 750), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # Outer Border
    draw.rectangle([20, 20, 980, 730], outline=accent_color, width=4)
    draw.rectangle([30, 30, 970, 90], fill=accent_color)
    
    # Header Title
    draw.text((50, 45), title.upper(), fill="#FFFFFF", font=title_font)
    
    # Render Custom Declaration Lines
    y = 115
    for line in lines:
        draw.text((50, y), line, fill="#1F2937", font=text_font)
        y += 52
        
    # Simulated Barcode Box
    draw.rectangle([50, y + 10, 500, y + 70], fill="#000000")
    draw.text((70, y + 25), "||| |||| || ||||| ||| 890100009999", fill="#FFFFFF", font=text_font)

    # Simulated FSSAI Graphic Logo Badge (Optional per sample)
    if has_fssai_logo:
        draw.rectangle([650, y + 10, 950, y + 70], outline="#166534", width=3, fill="#F0FDF4")
        draw.text((670, y + 25), "fssai Graphic Logo", fill="#166534", font=text_font)
    else:
        draw.rectangle([650, y + 10, 950, y + 70], outline="#991B1B", width=2, fill="#FEF2F2")
        draw.text((670, y + 25), "--- NO FSSAI LOGO ---", fill="#991B1B", font=text_font)

    filepath = os.path.join(r"d:\SIH2026\sample_data", filename)
    img.save(filepath, quality=95)
    print(f"Saved: {filepath}")

# ==============================================================================
# COMPLIANT SAMPLE LABELS (WITH FSSAI LOGO)
# ==============================================================================

# 1. Compliant Biscuit Pack (WITH FSSAI LOGO)
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
        "Barcode: 8901234567890"
    ],
    bg_color="#FEF3C7",
    accent_color="#B45309",
    has_fssai_logo=True
)

# 2. Compliant Cooking Oil Label (WITH FSSAI LOGO)
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
        "Barcode: 8901234567891"
    ],
    bg_color="#ECFDF5",
    accent_color="#047857",
    has_fssai_logo=True
)

# 3. Non-Food Electronics Label (WITHOUT FSSAI LOGO - NOT APPLICABLE)
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
        "Barcode: 890100000004"
    ],
    bg_color="#EFF6FF",
    accent_color="#1D4ED8",
    has_fssai_logo=False
)

# ==============================================================================
# NON-COMPLIANT SAMPLE LABELS (TRIGGER VIOLATIONS)
# ==============================================================================

# 4. Non-Compliant: Missing MRP, Date AND Missing FSSAI Logo
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
        "Batch No: FS-9901"
    ],
    bg_color="#FEF2F2",
    accent_color="#DC2626",
    has_fssai_logo=False
)

# 5. Non-Compliant: Missing FSSAI Logo explicitly
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
        "--- MISSING MANDATORY FSSAI GRAPHIC LOGO ---"
    ],
    bg_color="#FEF2F2",
    accent_color="#991B1B",
    has_fssai_logo=False
)

# 6. Non-Compliant: Inaccurate Unit Sale Price (USP) (WITH FSSAI LOGO)
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
        "Country of Origin: India"
    ],
    bg_color="#FFFBEB",
    accent_color="#D97706",
    has_fssai_logo=True
)

# 6. Non-Compliant: Missing Manufacturer Name & Address
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
        "Country of Origin: China"
    ],
    bg_color="#FDF2F8",
    accent_color="#DB2777"
)
