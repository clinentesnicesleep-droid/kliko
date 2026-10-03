# -*- coding: utf-8 -*-
"""
Script to add the 5-year duration bar chart:
1. Styles in css/styles.css
2. Action card bar chart in js/app.js
3. Eje global Gantt bar chart in js/app.js
"""

def patch_css():
    with open('css/styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    css_addition = '''

/* ============================================================================== */
/* GRÁFICA DE BARRAS DE DURACIÓN POR ACCIÓN (2027-2031) */
/* ============================================================================== */
.action-barchart-container {
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  margin: 10px 0 12px;
}

.action-barchart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.action-barchart-title {
  font-size: 0.73rem;
  font-weight: 700;
  color: var(--amurjo-cyan);
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-barchart-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}
.action-barchart-badge.badge-quinquenal {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.35);
}
.action-barchart-badge.badge-parcial {
  background: rgba(6, 182, 212, 0.2);
  color: var(--amurjo-cyan);
  border: 1px solid rgba(6, 182, 212, 0.35);
}

.action-barchart-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.barchart-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.barchart-year {
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--text-muted);
}
.barchart-col.col-active .barchart-year {
  color: #fff;
}
.barchart-col.col-current .barchart-year {
  color: var(--amurjo-cyan);
}

.barchart-bar-wrap {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.barchart-bar-fill {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  transition: all 0.3s ease;
}
.barchart-bar-fill.active {
  background: linear-gradient(90deg, #10b981, #06b6d4);
  box-shadow: 0 0 8px rgba(6, 182, 212, 0.4);
}
.barchart-col.col-current .barchart-bar-fill.active {
  background: linear-gradient(90deg, #22d3ee, #06b6d4);
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.6);
}

.barchart-dot {
  font-size: 0.72rem;
  color: var(--text-dim);
  line-height: 1;
}
.barchart-dot.active {
  color: #10b981;
}

/* ============================================================================== */
/* PANEL GENERAL DEL EJE: DIAGRAMA DE GANTT / GRÁFICA COMPARATIVA */
/* ============================================================================== */
.eje-gantt-barchart-card {
  background: linear-gradient(145deg, var(--segura-surface-elevated), rgba(6, 78, 59, 0.25));
  border: 1px solid rgba(6, 182, 212, 0.35);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}

.eje-gantt-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.eje-gantt-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(6, 182, 212, 0.2);
  color: var(--amurjo-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.eje-gantt-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.7rem;
  color: var(--text-muted);
}
.gantt-legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
.legend-color-box {
  width: 12px;
  height: 8px;
  border-radius: 2px;
}
.legend-color-box.active {
  background: linear-gradient(90deg, #10b981, #06b6d4);
}
.legend-color-box.inactive {
  background: rgba(255, 255, 255, 0.08);
}

.eje-gantt-matrix {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--segura-border);
}

.eje-gantt-matrix-header {
  display: grid;
  grid-template-columns: minmax(130px, 1.8fr) repeat(5, minmax(40px, 1fr)) minmax(65px, 0.8fr);
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid var(--segura-border);
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--amurjo-cyan);
  text-align: center;
}
.eje-gantt-matrix-header .gantt-cell-action {
  text-align: left;
}

.eje-gantt-matrix-row {
  display: grid;
  grid-template-columns: minmax(130px, 1.8fr) repeat(5, minmax(40px, 1fr)) minmax(65px, 0.8fr);
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  align-items: center;
  transition: background 0.15s ease;
}
.eje-gantt-matrix-row:hover {
  background: rgba(6, 182, 212, 0.06);
}
.eje-gantt-matrix-row:last-child {
  border-bottom: none;
}

.gantt-cell-action {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
  padding-right: 8px;
}
.gantt-cell-action strong {
  font-size: 0.72rem;
  color: var(--amurjo-cyan);
  font-family: var(--font-heading);
}
.gantt-cell-action span {
  font-size: 0.67rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gantt-cell-year {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 3px;
}

.gantt-bar-cell {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #10b981, #06b6d4);
  box-shadow: 0 0 6px rgba(6, 182, 212, 0.35);
}
.gantt-bar-cell.empty {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.gantt-cell-dur {
  text-align: center;
}
.dur-pill-mini {
  font-size: 0.64rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}
.dur-pill-mini.quinquenal {
  background: rgba(16, 185, 129, 0.18);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.dur-pill-mini.parcial {
  background: rgba(6, 182, 212, 0.18);
  color: var(--amurjo-cyan);
  border: 1px solid rgba(6, 182, 212, 0.3);
}
'''
    if '.action-barchart-container' not in css:
        with open('css/styles.css', 'w', encoding='utf-8') as f:
            f.write(css + css_addition)
        print('CSS: Bar chart styles added successfully')
    else:
        print('CSS: Bar chart styles already present')

def patch_app_js():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # 1. Update the Action Card to render the 5-year bar chart
    old_pills = '''                      <div class="action-badges-row">
                        <div class="action-anos-pills">
                          <small style="font-size:0.62rem; color:var(--text-dim); margin-right:2px;">Años de ejecución:</small>
                          ${[2027, 2028, 2029, 2030, 2031].map(y => `
                            <span class="mini-ano-pill ${roadmap.anos.includes(y) ? 'active-year' : ''} ${!isQuinquenal && selYear === y ? 'current-active-yr' : ''}">${y}</span>
                          `).join("")}
                        </div>
                      </div>'''

    new_barchart = '''                      <!-- GRÁFICA DE BARRAS DE DURACIÓN DE LA ACCIÓN (2027-2031) -->
                      <div class="action-barchart-container">
                        <div class="action-barchart-header">
                          <span class="action-barchart-title">
                            <span>📊</span> Duración Quinquenal (2027–2031)
                          </span>
                          <span class="action-barchart-badge ${roadmap.anos.length === 5 ? 'badge-quinquenal' : 'badge-parcial'}">
                            ${roadmap.anos.length === 5 ? '5 años (Quinquenal Completo)' : `${roadmap.anos.length} de 5 años`}
                          </span>
                        </div>
                        <div class="action-barchart-grid">
                          ${[2027, 2028, 2029, 2030, 2031].map(y => {
                            const active = roadmap.anos.includes(y);
                            const isCurrent = y === 2027;
                            return `
                              <div class="barchart-col ${active ? 'col-active' : 'col-inactive'} ${isCurrent ? 'col-current' : ''}">
                                <span class="barchart-year">${y}</span>
                                <div class="barchart-bar-wrap">
                                  <div class="barchart-bar-fill ${active ? 'active' : ''}"></div>
                                </div>
                                <span class="barchart-dot ${active ? 'active' : ''}">${active ? '●' : '○'}</span>
                              </div>
                            `;
                          }).join("")}
                        </div>
                      </div>'''

    if old_pills in js:
        js = js.replace(old_pills, new_barchart)
        print('JS: Action card bar chart replaced')
    else:
        old_crlf = old_pills.replace('\n', '\r\n')
        if old_crlf in js:
            js = js.replace(old_crlf, new_barchart.replace('\n', '\r\n'))
            print('JS: Action card bar chart replaced (CRLF)')
        else:
            print('ERROR: old_pills not found in app.js')

    # 2. Add the Global Eje Gantt Bar Chart Matrix above the actions loop
    target_pos = '''          <!-- LISTA DINÁMICA DE OBJETIVOS ESPECÍFICOS Y SUS 3 ACCIONES CADA UNO -->'''
    gantt_matrix_code = '''          <!-- PANEL: GRÁFICA COMPARATIVA DE BARRAS DE TODAS LAS ACCIONES DEL EJE (GANTT 2027-2031) -->
          <div class="eje-gantt-barchart-card">
            <div class="eje-gantt-header">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="eje-gantt-icon">📊</span>
                  <h4 style="margin:0; font-family:var(--font-heading); font-size:0.92rem; color:var(--text-main);">
                    Gráfica Comparativa de Duración: Acciones del Eje ${eje.numero} (2027–2031)
                  </h4>
                </div>
                <p style="font-size:0.72rem; color:var(--text-muted); margin:4px 0 0;">
                  Planificación visual horizontal de ejecución año a año para cada una de las medidas.
                </p>
              </div>
              <div class="eje-gantt-legend">
                <span class="gantt-legend-item"><span class="legend-color-box active"></span> En Ejecución</span>
                <span class="gantt-legend-item"><span class="legend-color-box inactive"></span> Inactiva</span>
              </div>
            </div>

            <div class="eje-gantt-matrix">
              <div class="eje-gantt-matrix-header">
                <div class="gantt-cell-action">Acción / Medida</div>
                <div class="gantt-cell-year">2027</div>
                <div class="gantt-cell-year">2028</div>
                <div class="gantt-cell-year">2029</div>
                <div class="gantt-cell-year">2030</div>
                <div class="gantt-cell-year">2031</div>
                <div class="gantt-cell-dur">Duración</div>
              </div>

              ${eje.acciones.map(a => {
                const rm = a.roadmap || { anos: [2027, 2028, 2029, 2030, 2031] };
                const dur = rm.anos ? rm.anos.length : 5;
                return `
                  <div class="eje-gantt-matrix-row">
                    <div class="gantt-cell-action" title="${a.titulo}">
                      <strong>${a.codigo}</strong>
                      <span>${a.titulo.substring(0, 32)}...</span>
                    </div>
                    ${[2027, 2028, 2029, 2030, 2031].map(y => {
                      const act = rm.anos && rm.anos.includes(y);
                      return `
                        <div class="gantt-cell-year">
                          ${act ? '<div class="gantt-bar-cell"></div>' : '<div class="gantt-bar-cell empty"></div>'}
                        </div>
                      `;
                    }).join("")}
                    <div class="gantt-cell-dur">
                      <span class="dur-pill-mini ${dur === 5 ? 'quinquenal' : 'parcial'}">${dur} ${dur === 1 ? 'año' : 'años'}</span>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- LISTA DINÁMICA DE OBJETIVOS ESPECÍFICOS Y SUS 3 ACCIONES CADA UNO -->'''

    if target_pos in js:
        js = js.replace(target_pos, gantt_matrix_code)
        print('JS: Global Gantt matrix added')
    else:
        target_crlf = target_pos.replace('\n', '\r\n')
        if target_crlf in js:
            js = js.replace(target_crlf, gantt_matrix_code.replace('\n', '\r\n'))
            print('JS: Global Gantt matrix added (CRLF)')
        else:
            print('ERROR: target_pos not found in app.js')

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('JS: patch completed')

if __name__ == '__main__':
    patch_css()
    patch_app_js()
