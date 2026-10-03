import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'id=["\']([^"\']*modal[^"\']*)["\']', text, re.I):
    print("Found modal:", m.group(1))

for m in re.finditer(r'class=["\']([^"\']*modal[^"\']*)["\']', text, re.I):
    print("Found modal class:", m.group(1))
