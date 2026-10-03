import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('const ACTION_METADATA =')
end_pos = text.find('};', pos)
metadata_block = text[pos:end_pos+2]

keys = re.findall(r'"ACC-\d\.\d\.\d"', metadata_block)
print(f"Total keys in ACTION_METADATA: {len(keys)}")
print("First 5:", keys[:5])
print("Last 5:", keys[-5:])
