with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('setupQRModal()')
print("setupQRModal called at:", pos)
print(text[pos-100:pos+300])
