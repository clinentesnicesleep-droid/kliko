import json

with open('js/data-ejes.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'const EJES_DATA = '
start = text.find(prefix) + len(prefix)
end = text.rfind('; if (typeof window')
if end == -1: end = text.rfind(';\nif (typeof window')
if end == -1: end = text.rfind('];') + 1

data = json.loads(text[start:end].strip().rstrip(';'))

eje1 = data[0]
print("Eje 1:", eje1["titulo"])
print("Anos in finanzasPorAno:", list(eje1["finanzasPorAno"].keys()))
fin2027 = eje1["finanzasPorAno"]["2027"]
print("2027 Ingresos:", fin2027["ingresosPrevistosTotal"], "€")
print("2027 Gastos:", fin2027["gastosEjecutadosTotal"], "€")
print("2027 Fuentes:", fin2027["fuentesIngreso"])
print("2027 Acciones activas:", len(fin2027["accionesDesarrolladas"]))
print("2027 Facturas:", fin2027["totalFacturas"], "Nóminas:", fin2027["totalNominas"])

for p in fin2027["accionesDesarrolladas"][:2]:
    print(f"  -> [{p['codigo']}] {p['titulo'][:50]}...")
    print(f"     Previsión: {p['previsionIngresos']} € | Gasto: {p['gastoEjecutado']} € ({p['porcentajeEjecucion']}%)")
    for j in p["justificantes"]:
        print(f"       * [{j['tipo'].upper()}] {j['ref']} | {j['proveedorBeneficiario']} | {j['importe']} €")
