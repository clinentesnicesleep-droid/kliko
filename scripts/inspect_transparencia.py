with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('id="subtab-transparencia"')
print("Found at:", pos)
print(text[pos:pos+2500])
