import re

with open('presentacion.html', encoding='utf-8') as f:
    text = f.read()

slides = re.findall(r'<div class="slide(?:\s+active)?"\s+id="([^"]+)"', text)
print(f"Total slides found: {len(slides)}")
for i, s in enumerate(slides, 1):
    print(f"  Slide {i:2d}: id='{s}'")
