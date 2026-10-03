# -*- coding: utf-8 -*-
import subprocess
import os

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
OUT_IMG = os.path.abspath(r'img\pantallazo_movil_promocion.png')

# We can tell Chrome to open localhost:8000 and run a small JS snippet or open with a param.
# Let's check how index.html or app.js can open promo modal on load.
# Let's check if there is a param like ?openPromo=1 or we can add it to app.js.
