# -*- coding: utf-8 -*-
import qrcode
import os

IMG_DIR = os.path.abspath('img')
os.makedirs(IMG_DIR, exist_ok=True)

# Generate standard ISO QR Code
# URL pointing to local network IP so phone can actually open it on WiFi:
target_url = "http://192.168.1.20:8000"

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=10,
    border=4,
)
qr.add_data(target_url)
qr.make(fit=True)

# 1. Dark Pine on White (Institutional Orcera)
img_pine = qr.make_image(fill_color="#064E3B", back_color="#FFFFFF")
out_png = os.path.join(IMG_DIR, "qr_orcera_joven.png")
img_pine.save(out_png)
print(f"Saved PNG to {out_png}")

# 2. Black on White (Absolute maximum standard contrast)
img_black = qr.make_image(fill_color="#000000", back_color="#FFFFFF")
out_black_png = os.path.join(IMG_DIR, "qr_orcera_standard.png")
img_black.save(out_black_png)
print(f"Saved black PNG to {out_black_png}")

# 3. SVG format (standard vector QR)
import qrcode.image.svg
svg_factory = qrcode.image.svg.SvgPathImage
qr_svg = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=10,
    border=4,
    image_factory=svg_factory
)
qr_svg.add_data(target_url)
qr_svg.make(fit=True)
svg_img = qr_svg.make_image(fill_color="#064E3B")
out_svg = os.path.join(IMG_DIR, "qr_orcera_joven.svg")
svg_img.save(out_svg)
print(f"Saved SVG to {out_svg}")
