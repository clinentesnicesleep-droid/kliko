import os
import math
from PIL import Image, ImageDraw, ImageFilter

def make_transparent_logo(input_path, output_path):
    im = Image.open(input_path).convert('RGBA')
    w, h = im.size
    
    # Background color is around (198, 183, 164)
    # We want a smooth alpha falloff based on color distance from the sand background
    bg_r, bg_g, bg_b = 198, 183, 164
    
    # Crop to content bounds first with a margin
    # Content is roughly x in [215, 940], y in [215, 805]
    bbox = (215, 215, 940, 805)
    cropped = im.crop(bbox)
    cw, ch = cropped.size
    
    out = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    
    # Process pixels
    pixels = cropped.load()
    out_pixels = out.load()
    
    for y in range(ch):
        for x in range(cw):
            r, g, b, a = pixels[x, y]
            # Color distance from background
            diff = math.sqrt((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)
            
            # Thresholding with soft feather
            if diff < 14:
                out_pixels[x, y] = (0, 0, 0, 0)
            elif diff < 28:
                alpha = int(255 * (diff - 14) / 14)
                out_pixels[x, y] = (r, g, b, min(a, alpha))
            else:
                out_pixels[x, y] = (r, g, b, a)
                
    out.save(output_path, 'PNG')
    print(f"Saved transparent logo to {output_path} ({cw}x{ch})")
    return out

def make_circular_emblem(input_path, output_emblem_path):
    im = Image.open(input_path).convert('RGBA')
    
    # Circle center and radius in original coords
    # Center: (538, 431), Radius: ~206
    cx, cy, r = 538, 431, 206
    padding = 6
    box = (cx - r - padding, cy - r - padding, cx + r + padding, cy + r + padding)
    
    emblem_crop = im.crop(box)
    ew, eh = emblem_crop.size
    
    # Circular mask
    mask = Image.new('L', (ew, eh), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((padding, padding, ew - padding, eh - padding), fill=255)
    
    # Slight antialiasing on mask
    mask = mask.filter(ImageFilter.SMOOTH)
    
    emblem = Image.new('RGBA', (ew, eh), (0, 0, 0, 0))
    emblem.paste(emblem_crop, (0, 0), mask)
    
    emblem.save(output_emblem_path, 'PNG')
    print(f"Saved circular emblem to {output_emblem_path} ({ew}x{eh})")
    return emblem

def make_favicons(emblem, base_dir):
    # Standard sizes
    sizes = {
        'favicon-16x16.png': (16, 16),
        'favicon-32x32.png': (32, 32),
        'favicon.png': (64, 64),
        'apple-touch-icon.png': (180, 180),
        'android-chrome-192x192.png': (192, 192),
        'android-chrome-512x512.png': (512, 512)
    }
    
    for filename, size in sizes.items():
        resized = emblem.resize(size, Image.Resampling.LANCZOS)
        path = os.path.join(base_dir, filename)
        resized.save(path, 'PNG')
        print(f"Saved {filename} ({size[0]}x{size[1]})")
        
    # Also save to img/
    emblem.resize((64, 64), Image.Resampling.LANCZOS).save(os.path.join(base_dir, 'img', 'favicon.png'), 'PNG')
    emblem.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(base_dir, 'img', 'apple-touch-icon.png'), 'PNG')
    emblem.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(base_dir, 'img', 'kliko_emblem_512.png'), 'PNG')

def make_svg_favicon(emblem_path, output_svg_path):
    import base64
    with open(emblem_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
        
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <clipPath id="circleClip">
      <circle cx="50" cy="50" r="48" />
    </clipPath>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#94A3B8" />
      <stop offset="50%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
  </defs>
  <!-- Outer metallic accent ring -->
  <circle cx="50" cy="50" r="49" fill="none" stroke="url(#ringGrad)" stroke-width="2" />
  <!-- Embedded High-Resolution Emblem -->
  <image href="data:image/png;base64,{b64}" x="2" y="2" width="96" height="96" clip-path="url(#circleClip)" />
</svg>
'''
    with open(output_svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"Saved high-res SVG favicon to {output_svg_path}")

def make_horizontal_brand(emblem, output_path):
    # A horizontal lockup with circular emblem on the left and stylized text on the right
    # Size: e.g. 600 x 140
    hw, hh = 640, 150
    out = Image.new('RGBA', (hw, hh), (0, 0, 0, 0))
    
    # Resize emblem to 130x130
    emb_resized = emblem.resize((130, 130), Image.Resampling.LANCZOS)
    out.paste(emb_resized, (10, 10), emb_resized)
    
    # We can use Pillow to draw text if default font, but even better:
    # let's save the emblem and full logo so the web UI uses pure vector HTML/CSS typography
    # and crisp image assets.
    out.save(output_path, 'PNG')
    print(f"Saved horizontal brand base to {output_path}")

if __name__ == '__main__':
    base_dir = r"c:\Users\RAMON\Desktop\KLIKO"
    original = os.path.join(base_dir, 'img', 'kliko_logo_original.png')
    
    clean_logo = os.path.join(base_dir, 'img', 'kliko_logo_clean.png')
    emblem_path = os.path.join(base_dir, 'img', 'kliko_emblem.png')
    horiz_path = os.path.join(base_dir, 'img', 'kliko_horizontal_base.png')
    svg_favicon = os.path.join(base_dir, 'favicon.svg')
    
    make_transparent_logo(original, clean_logo)
    emblem = make_circular_emblem(original, emblem_path)
    make_favicons(emblem, base_dir)
    make_svg_favicon(emblem_path, svg_favicon)
    make_horizontal_brand(emblem, horiz_path)
    print("All KLIKO brand assets processed successfully!")
