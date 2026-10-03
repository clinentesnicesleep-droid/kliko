import json

with open('scripts/ejes_extracted.json', encoding='utf-8') as f:
    ejes = json.load(f)

for e in ejes:
    print(f"\n--- EJE {e['numero']}: {e['titulo']} ---")
    for a in e['acciones']:
        print(f"[{a['codigo']}] {a['anos']} -> {a['titulo']}")
