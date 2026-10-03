with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'id="subtab-transparencia"' in line:
        print(f"subtab-transparencia starts at line {i+1}")
        for j in range(i, min(i + 80, len(lines))):
            print(f"{j+1}: {lines[j].rstrip()}")
        break
