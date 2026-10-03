with open('css/styles.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('.modal-overlay')
print(text[pos:pos+1000])
