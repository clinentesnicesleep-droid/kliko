# -*- coding: utf-8 -*-
import subprocess
import os

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
OUT_PATH = os.path.abspath(r'img\preview_poster_qr.png')
URL = 'http://localhost:8000/?clean=1&modal=poster'

cmd = [
    CHROME,
    '--headless',
    '--disable-gpu',
    '--window-size=1200,1000',
    '--virtual-time-budget=2000',
    f'--screenshot={OUT_PATH}',
    URL
]

print(f"Capturing poster screenshot to {OUT_PATH}...")
subprocess.run(cmd, capture_output=True, text=True, timeout=20)
if os.path.exists(OUT_PATH):
    print(f"SUCCESS: {OUT_PATH} ({os.path.getsize(OUT_PATH)} bytes)")
else:
    print("FAILED")
