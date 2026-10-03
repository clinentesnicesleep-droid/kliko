import re
import sys

def main():
    if sys.stdout.encoding.lower() != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')

    # 1. Update index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Add data-ejes.js before app.js if not already added
    if 'data-ejes.js' not in html:
        old_tag = '<script src="js/app.js?v=evaluaciones_e_indicadores_v1"></script>'
        new_tags = '<script src="js/data-ejes.js?v=indicadores_oficiales_v2"></script>\n  <script src="js/app.js?v=indicadores_oficiales_v2"></script>'
        if old_tag in html:
            html = html.replace(old_tag, new_tags)
        else:
            # Replace any js/app.js script tag
            html = re.sub(
                r'<script\s+src="js/app\.js[^"]*"></script>',
                new_tags,
                html
            )
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Updated index.html with js/data-ejes.js script tag!")
    else:
        # Bump version query string
        html = re.sub(r'data-ejes\.js\?v=[^"]*', 'data-ejes.js?v=indicadores_oficiales_v2', html)
        html = re.sub(r'app\.js\?v=[^"]*', 'app.js?v=indicadores_oficiales_v2', html)
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Bumped version query string in index.html!")

    # 2. Add modern styles to css/styles.css
    with open('css/styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    new_css = """
/* ==============================================================================
   ESTILOS OFICIALES PARA INDICADORES Y EVALUACIÓN POR ACCIÓN (PLAN 2027-2031)
   ============================================================================== */
.action-card-indicators-preview {
  margin-top: 14px;
  padding: 10px 12px;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(6, 182, 212, 0.25);
  border-radius: var(--radius-sm);
}

.ind-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.ind-preview-title {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--amurjo-cyan);
  font-family: var(--font-heading);
  display: flex;
  align-items: center;
  gap: 5px;
}

.ind-preview-link {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--amurjo-cyan);
  background: rgba(6, 182, 212, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}
.ind-preview-link:hover {
  background: rgba(6, 182, 212, 0.25);
  color: #fff;
}

.ind-preview-tags-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;
}

.ind-preview-pill {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-size: 0.72rem;
  color: var(--text-main);
  background: rgba(0, 0, 0, 0.22);
  padding: 4px 8px;
  border-radius: 4px;
  border-left: 2px solid var(--amurjo-cyan);
}

.ind-preview-pill .pill-text {
  flex: 1;
  color: var(--text-main);
  font-weight: 500;
  white-space: normal;
  line-height: 1.3;
}

.ind-preview-pill .pill-val {
  font-weight: 700;
  color: #34d399;
  font-size: 0.68rem;
  white-space: nowrap;
}

/* RESUMEN EJECUTIVO DE INDICADORES DEL EJE */
.indicadores-eje-summary-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.75));
  border: 1px solid var(--segura-border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 20px;
}

.summary-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
}

.summary-badge-group {
  display: flex;
  gap: 10px;
}

.summary-stat-box {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(6, 182, 212, 0.25);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  text-align: center;
  min-width: 90px;
}

.summary-stat-box .stat-num {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--amurjo-cyan);
  font-family: var(--font-heading);
  display: block;
}

.summary-stat-box .stat-lbl {
  font-size: 0.65rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}

.ind-filter-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.ind-filter-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-right: 4px;
}

.ind-filter-chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s ease;
}

.ind-filter-chip:hover {
  background: rgba(6, 182, 212, 0.15);
  color: var(--text-main);
  border-color: rgba(6, 182, 212, 0.35);
}

.ind-filter-chip.active {
  background: var(--amurjo-cyan);
  color: #041019;
  border-color: var(--amurjo-cyan);
  font-weight: 700;
}

/* TARJETA DE EVALUACIÓN POR ACCIÓN */
.action-eval-card {
  background: var(--segura-surface-elevated);
  border: 1px solid var(--segura-border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 16px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.action-eval-card:hover {
  border-color: rgba(6, 182, 212, 0.4);
}

.action-eval-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.action-eval-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 6px 0 0;
  font-family: var(--font-heading);
  line-height: 1.35;
}

.action-eval-stat-badge {
  text-align: right;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.eval-stat-pct {
  font-size: 0.88rem;
  font-weight: 800;
  color: #34d399;
  display: block;
}

.eval-stat-lbl {
  font-size: 0.62rem;
  color: var(--text-dim);
  text-transform: uppercase;
}

.action-ind-sublist .sublist-caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--amurjo-cyan);
  margin-bottom: 10px;
}

.ind-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 10px;
}

.indicator-item-card {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ind-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.ind-mini-code {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--amurjo-cyan);
  background: rgba(6, 182, 212, 0.15);
  padding: 1px 4px;
  border-radius: 3px;
  margin-right: 4px;
  font-family: var(--font-heading);
}

.ind-item-title {
  font-size: 0.76rem;
  color: var(--text-main);
  font-weight: 600;
  line-height: 1.25;
}

.ind-compliance-mini {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.ind-item-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.ind-item-type {
  font-size: 0.62rem;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 600;
}

.ind-mini-years-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.mini-yr-cell {
  background: rgba(0, 0, 0, 0.3);
  padding: 3px 2px;
  border-radius: 3px;
  text-align: center;
}

.mini-yr-cell.selected-eval-yr {
  background: rgba(6, 182, 212, 0.18);
  border: 1px solid rgba(6, 182, 212, 0.4);
}

.mini-yr-lbl {
  font-size: 0.58rem;
  color: var(--text-dim);
  display: block;
  font-weight: 700;
}

.mini-yr-val {
  font-size: 0.64rem;
  font-weight: 700;
  color: var(--text-main);
  display: block;
}

.mini-yr-pct {
  font-size: 0.58rem;
  color: #34d399;
  display: block;
}
"""

    if '.action-card-indicators-preview' not in css:
        with open('css/styles.css', 'a', encoding='utf-8') as f:
            f.write("\n" + new_css)
        print("Appended indicator CSS styles to css/styles.css!")
    else:
        print("CSS already contains indicator styles.")

if __name__ == '__main__':
    main()
