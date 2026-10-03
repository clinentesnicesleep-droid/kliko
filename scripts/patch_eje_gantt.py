# -*- coding: utf-8 -*-
"""
Script to insert the Eje Gantt bar chart matrix into js/app.js
"""

def main():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    target = '          <div class="oe-groups-container">'

    gantt_code = '''          <!-- GRÁFICA COMPARATIVA DE BARRAS DE TODAS LAS ACCIONES DEL EJE (GANTT 2027-2031) -->
          <div class="eje-gantt-barchart-card">
            <div class="eje-gantt-header">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="eje-gantt-icon">📊</span>
                  <h4 style="margin:0; font-family:var(--font-heading); font-size:0.92rem; color:var(--text-main);">
                    Gráfica de Duración de las ${eje.acciones.length} Acciones del Eje ${eje.numero} (2027–2031)
                  </h4>
                </div>
                <p style="font-size:0.72rem; color:var(--text-muted); margin:4px 0 0;">
                  Cronograma horizontal de barras año a año: visualiza qué medidas arrancan en 2027 y cuáles cubren el quinquenio completo.
                </p>
              </div>
              <div class="eje-gantt-legend">
                <span class="gantt-legend-item"><span class="legend-color-box active"></span> Activa</span>
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

          <div class="oe-groups-container">'''

    if target in js:
        js = js.replace(target, gantt_code)
        with open('js/app.js', 'w', encoding='utf-8') as f:
            f.write(js)
        print('SUCCESS: Eje Gantt bar chart matrix added')
    else:
        target_crlf = target.replace('\n', '\r\n')
        if target_crlf in js:
            js = js.replace(target_crlf, gantt_code.replace('\n', '\r\n'))
            with open('js/app.js', 'w', encoding='utf-8') as f:
                f.write(js)
            print('SUCCESS: Eje Gantt bar chart matrix added (CRLF)')
        else:
            print('ERROR: target not found')

if __name__ == '__main__':
    main()
