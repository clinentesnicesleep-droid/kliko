# -*- coding: utf-8 -*-
import subprocess
import os
import time

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
IMG_DIR = os.path.abspath('img')
os.makedirs(IMG_DIR, exist_ok=True)

screens = [
    ('pantallazo_movil_inicio.png', 'http://localhost:8000/?clean=1&tab=tab-plan'),
    ('pantallazo_movil_ejes.png', 'http://localhost:8000/?clean=1&tab=tab-ejes'),
    ('pantallazo_movil_gamificacion.png', 'http://localhost:8000/?clean=1&tab=tab-gamificacion'),
    ('pantallazo_movil_buzon.png', 'http://localhost:8000/?clean=1&tab=tab-buzon'),
]

for filename, url in screens:
    out_path = os.path.join(IMG_DIR, filename)
    cmd = [
        CHROME,
        '--headless',
        '--disable-gpu',
        '--window-size=480,1000',
        '--virtual-time-budget=2000',
        f'--screenshot={out_path}',
        url
    ]
    print(f"Capturando {filename} desde {url}...")
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
    if os.path.exists(out_path):
        print(f"OK: {filename} ({os.path.getsize(out_path)} bytes)")
    else:
        print(f"ERROR: {filename} no generado")

print("Captura finalizada.")
