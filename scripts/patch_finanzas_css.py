import sys

def main():
    with open('css/styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    new_css = """
/* ==============================================================================
   ESTILOS OFICIALES PARA GESTIÓN ECONÓMICA ANUALIZADA, FACTURAS Y NÓMINAS
   ============================================================================== */
.finanzas-kpis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.finanza-kpi-card {
  background: var(--segura-surface-elevated);
  border: 1px solid var(--segura-border);
  border-radius: var(--radius-md);
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.finanza-kpi-card:hover {
  border-color: rgba(6, 182, 212, 0.4);
}

.finanza-kpi-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.finanza-kpi-val {
  font-size: 1.45rem;
  font-weight: 800;
  font-family: var(--font-heading);
  line-height: 1.1;
  margin-bottom: 8px;
}

.finanza-kpi-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
  line-height: 1.35;
}

.fuentes-mini-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
  font-size: 0.68rem;
}

.fuentes-mini-item {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
}
.fuentes-mini-item strong {
  color: var(--text-main);
}

/* TARJETAS DE PROYECTOS DESARROLLADOS EN LA ANUALIDAD */
.proyectos-finanzas-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.proyecto-finanza-card {
  background: var(--segura-surface-elevated);
  border: 1px solid var(--segura-border);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: border-color 0.2s ease;
}

.proyecto-finanza-card:hover {
  border-color: rgba(6, 182, 212, 0.35);
}

.proyecto-finanza-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.proyecto-finanza-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 4px 0 0;
  font-family: var(--font-heading);
  line-height: 1.35;
}

.proyecto-finanza-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px;
  background: rgba(0, 0, 0, 0.25);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
}

.pf-metric-item {
  display: flex;
  flex-direction: column;
}

.pf-metric-lbl {
  font-size: 0.64rem;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 600;
}

.pf-metric-val {
  font-size: 0.92rem;
  font-weight: 800;
  font-family: var(--font-heading);
  color: var(--text-main);
}

/* JUSTIFICANTES DENTRO DE LA ACCIÓN */
.proyecto-justificantes-wrap {
  margin-top: 10px;
}

.proyecto-just-caption {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--amurjo-cyan);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.justificantes-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 8px;
}

.justificante-item-box {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
}

.just-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.just-item-concept {
  font-size: 0.74rem;
  color: var(--text-main);
  line-height: 1.3;
}

.just-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.06);
}

.badge-tipo-doc {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
}

.badge-tipo-factura {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.35);
}

.badge-tipo-nomina {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.35);
}

.btn-ver-comprobante {
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: var(--amurjo-cyan);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ver-comprobante:hover {
  background: var(--amurjo-cyan);
  color: #041019;
}

/* TABLA MULTIANUAL DE INGRESOS Y GASTOS */
.tabla-multianual-container {
  overflow-x: auto;
  margin-top: 10px;
}

.multianual-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.76rem;
}

.multianual-table th {
  background: rgba(0, 0, 0, 0.35);
  color: var(--text-dim);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.66rem;
  padding: 8px 10px;
  border-bottom: 1px solid var(--segura-border);
  text-align: left;
}

.multianual-table td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-main);
}

.multianual-table tr:hover td {
  background: rgba(6, 182, 212, 0.05);
}

.multianual-table tr.active-row td {
  background: rgba(6, 182, 212, 0.12);
  font-weight: 700;
}

/* MODAL DE COMPROBANTE OFICIAL */
.volante-contable-box {
  background: #ffffff;
  color: #0f172a;
  border-radius: var(--radius-md);
  padding: 22px;
  max-width: 520px;
  width: 100%;
  text-align: left;
  position: relative;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.volante-header {
  border-bottom: 2px solid #0f172a;
  padding-bottom: 12px;
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.volante-header-text h3 {
  font-size: 0.95rem;
  font-weight: 800;
  margin: 0;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.volante-header-text p {
  font-size: 0.72rem;
  margin: 2px 0 0;
  color: #475569;
}

.volante-seal {
  border: 2px solid #0369a1;
  color: #0369a1;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 4px;
  transform: rotate(-4deg);
  text-align: center;
  line-height: 1.2;
}

.volante-body-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.74rem;
  padding: 4px 0;
  border-bottom: 1px dotted #cbd5e1;
}

.volante-body-row strong {
  color: #0f172a;
}

.volante-body-row span {
  color: #334155;
}

.volante-total-box {
  background: #f1f5f9;
  border-radius: 6px;
  padding: 10px 12px;
  margin: 14px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.volante-total-amount {
  font-size: 1.3rem;
  font-weight: 800;
  color: #059669;
}

.volante-footer-diligencia {
  font-size: 0.65rem;
  color: #64748b;
  font-style: italic;
  line-height: 1.35;
  border-top: 1px solid #e2e8f0;
  padding-top: 10px;
}
"""

    if '.finanza-kpi-card' not in css:
        with open('css/styles.css', 'a', encoding='utf-8') as f:
            f.write("\n" + new_css)
        print("Appended financial CSS styles successfully!")
    else:
        print("CSS already contains financial styles.")

if __name__ == '__main__':
    main()
