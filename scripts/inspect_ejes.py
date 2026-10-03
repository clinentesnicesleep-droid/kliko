import json

with open('scripts/ejes_extracted.json', encoding='utf-8') as f:
    ejes = json.load(f)

for e in ejes:
    print(f"=== EJE {e['numero']}: {e['titulo']} ({len(e['acciones'])} acciones) ===")
    for a in e['acciones']:
        print(f"  {a['codigo']}: {a['titulo'][:75]}... | Años: {a['anos']} | {a['vigencia']}")
