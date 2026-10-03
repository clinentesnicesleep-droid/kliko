# -*- coding: utf-8 -*-
import subprocess
import os

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
OUT_DIR = os.path.abspath('img')

# Capture Slide 4 (Eje 1), Slide 5 (Eje 2), and Slide 6 (Eje 3)
slides_to_test = [
    ('preview_slide_eje1.png', 'http://localhost:8000/presentacion.html?slide=4'),
    ('preview_slide_eje2.png', 'http://localhost:8000/presentacion.html?slide=5'),
    ('preview_slide_eje3.png', 'http://localhost:8000/presentacion.html?slide=6'),
]

for filename, url in slides_to_test:
    out_path = os.path.join(OUT_DIR, filename)
    cmd = [
        CHROME,
        '--headless',
        '--disable-gpu',
        '--window-size=1600,900',
        '--virtual-time-budget=2000',
        f'--screenshot={out_path}',
        url
    ]
    print(f"Testing {filename}...")
    subprocess.run(cmd, capture_output=True, text=True, timeout=25)
    if os.path.exists(out_path):
        print(f"OK: {filename} ({os.path.getsize(out_path)} bytes)")
    else:
        print(f"FAILED: {filename}")
