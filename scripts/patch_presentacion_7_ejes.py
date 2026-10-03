import json
import re

# Load data
with open('scripts/ejes_extracted.json', encoding='utf-8') as f:
    ejes = json.load(f)

from check_curated_titles import curated_titles, eje_meta

# Generate the 7 slide HTML blocks
slides_html = []

for eje in ejes:
    num = eje['numero']
    meta = eje_meta[num]
    color = meta['color']
    color2 = meta['color2']
    icono = meta['icono']
    presupuesto = meta['presupuesto']
    subtitulo = meta['subtitulo']
    
    # Calculate counts
    total_acc = len(eje['acciones'])
    quinquenales = sum(1 for a in eje['acciones'] if len(a['anos']) == 5)
    plurianuales = sum(1 for a in eje['acciones'] if 1 < len(a['anos']) < 5)
    anuales = sum(1 for a in eje['acciones'] if len(a['anos']) == 1)
    
    rows_html = []
    for idx, a in enumerate(eje['acciones']):
        code = a['codigo']
        title = curated_titles.get(code, a['titulo'])
        years = a['anos']
        dur_len = len(years)
        
        # Badge duration
        if dur_len == 5:
            dur_badge = '<span style="background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4); padding: 2px 7px; border-radius: 9999px; font-weight: 700; font-size: 0.72rem; white-space: nowrap;">5 Años (100%)</span>'
        elif dur_len == 4:
            dur_badge = '<span style="background: rgba(6,182,212,0.2); color: #22d3ee; border: 1px solid rgba(6,182,212,0.4); padding: 2px 7px; border-radius: 9999px; font-weight: 700; font-size: 0.72rem; white-space: nowrap;">4 Años (80%)</span>'
        elif dur_len == 3:
            dur_badge = '<span style="background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.4); padding: 2px 7px; border-radius: 9999px; font-weight: 700; font-size: 0.72rem; white-space: nowrap;">3 Años (60%)</span>'
        elif dur_len == 2:
            dur_badge = '<span style="background: rgba(168,85,247,0.2); color: #c084fc; border: 1px solid rgba(168,85,247,0.4); padding: 2px 7px; border-radius: 9999px; font-weight: 700; font-size: 0.72rem; white-space: nowrap;">2 Años (40%)</span>'
        else:
            y_active = years[0] if years else 2027
            dur_badge = f'<span style="background: rgba(245,158,11,0.2); color: #fbbf24; border: 1px solid rgba(245,158,11,0.4); padding: 2px 7px; border-radius: 9999px; font-weight: 700; font-size: 0.72rem; white-space: nowrap;">1 Año ({y_active})</span>'
            
        bg_row = 'rgba(255,255,255,0.02)' if idx % 2 == 0 else 'transparent'
        
        # 5 year cells
        year_cells = []
        for y in [2027, 2028, 2029, 2030, 2031]:
            if y in years:
                bar = f'<div style="height: 11px; border-radius: 5px; background: linear-gradient(90deg, {color}, {color2}); box-shadow: 0 1px 6px {color}55; margin: 0 2px;" title="{y}: En Ejecución"></div>'
            else:
                bar = '<div style="height: 7px; border-radius: 3px; background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.12); margin: 2px 4px;" title="Sin actividad"></div>'
            year_cells.append(f'<td style="padding: 5px 4px; text-align: center;">{bar}</td>')
            
        row_str = f'''            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); background: {bg_row};">
              <td style="padding: 6px 10px; text-align: left;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="background: {color}20; color: {color}; border: 1px solid {color}50; padding: 1px 6px; border-radius: 4px; font-weight: 800; font-size: 0.7rem; font-family: monospace; white-space: nowrap;">{code}</span>
                  <span style="font-weight: 600; color: #f1f5f9; font-size: 0.8rem; line-height: 1.25;">{title}</span>
                </div>
              </td>
              {''.join(year_cells)}
              <td style="padding: 5px 8px; text-align: center;">{dur_badge}</td>
            </tr>'''
        rows_html.append(row_str)
        
    table_rows_joined = '\n'.join(rows_html)
    
    slide_block = f'''    <!-- SLIDE EJE {num}: CRONOGRAMA QUINQUENAL DE ACCIONES -->
    <div class="slide" id="slide-eje-{num}">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px;">
        <div>
          <div class="slide-tag" style="color: {color};">3.{num}. Planificación Temporal · Eje {num} de 7</div>
          <h2 class="slide-title" style="margin-bottom: 4px; font-size: 1.85rem;">{icono} Eje {num}: {eje['titulo']}</h2>
          <div style="font-size: 0.85rem; color: var(--text-muted);">{subtitulo}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="background: {color}15; border: 1px solid {color}40; border-radius: 8px; padding: 6px 12px; text-align: right;">
            <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Presupuesto Eje</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: {color};">{presupuesto}</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 6px 12px; text-align: right;">
            <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Distribución 9 Acciones</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #fff;">{quinquenales} Quinquenales · {plurianuales} Plurianuales · {anuales} Anual</div>
          </div>
        </div>
      </div>

      <div class="slide-card" style="padding: 14px 18px; border-color: {color}55; background: rgba(15, 23, 42, 0.78); box-shadow: 0 10px 25px rgba(0,0,0,0.35);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size: 0.92rem; font-weight: 700; color: #fff;">Cronograma Quinquenal de Ejecución (2027–2031)</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">(Vista simultánea de todas las medidas del Eje y su vigencia)</span>
          </div>
          <div style="display:flex; gap: 14px; font-size: 0.74rem;">
            <span style="display:flex; align-items:center; gap:5px;"><span style="display:inline-block; width:12px; height:8px; border-radius:2px; background:linear-gradient(90deg, {color}, {color2});"></span> Acción en Ejecución</span>
            <span style="display:flex; align-items:center; gap:5px;"><span style="display:inline-block; width:12px; height:8px; border-radius:2px; background:rgba(255,255,255,0.08); border:1px dashed rgba(255,255,255,0.2);"></span> No Activa</span>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
          <thead>
            <tr style="background: rgba(6, 78, 59, 0.45); color: {color}; text-align: center; border-bottom: 2px solid {color}66;">
              <th style="padding: 7px 10px; text-align: left; width: 44%;">Medida / Proyecto Oficial</th>
              <th style="padding: 7px 4px; width: 9%;">2027 (Año 1)</th>
              <th style="padding: 7px 4px; width: 9%;">2028 (Año 2)</th>
              <th style="padding: 7px 4px; width: 9%;">2029 (Año 3)</th>
              <th style="padding: 7px 4px; width: 9%;">2030 (Año 4)</th>
              <th style="padding: 7px 4px; width: 9%;">2031 (Año 5)</th>
              <th style="padding: 7px 8px; text-align: center; width: 11%;">Duración Total</th>
            </tr>
          </thead>
          <tbody>
{table_rows_joined}
          </tbody>
        </table>
      </div>
    </div>'''
    slides_html.append(slide_block)

all_7_slides_content = '\n\n'.join(slides_html)

# Read current presentacion.html
with open('presentacion.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the single slide-gantt-chart with all_7_slides_content
# Locate slide-gantt-chart
pattern = r'    <!-- SLIDE: GRÁFICA DE BARRAS QUINQUENAL DE LAS ACCIONES -->.*?(?=    <!-- SLIDE 4: PRESUPUESTO)'
match = re.search(pattern, html, flags=re.DOTALL)
if not match:
    print("ERROR: Could not find target pattern in presentacion.html")
else:
    new_html = html[:match.start()] + all_7_slides_content + '\n\n' + html[match.end():]
    # Update slide counter initial text if needed: 1 / 16
    new_html = new_html.replace('<span class="slide-counter" id="slide-num">1 / 11</span>', '<span class="slide-counter" id="slide-num">1 / 16</span>')
    new_html = new_html.replace('<span class="slide-counter" id="slide-num">1 / 10</span>', '<span class="slide-counter" id="slide-num">1 / 16</span>')
    
    # Update following slide tags numbers:
    # SLIDE 4 (Presupuesto) -> 4. Rigor Presupuestario
    new_html = re.sub(r'<div class="slide-tag">3\. Rigor Presupuestario</div>', '<div class="slide-tag">4. Rigor Presupuestario</div>', new_html)
    new_html = re.sub(r'<div class="slide-tag">4\. Gamificación Cívica</div>', '<div class="slide-tag">5. Gamificación Cívica</div>', new_html)
    new_html = re.sub(r'<div class="slide-tag">5\. Tejido Asociativo y Escucha</div>', '<div class="slide-tag">6. Tejido Asociativo y Escucha</div>', new_html)
    new_html = re.sub(r'<div class="slide-tag">6\. Cero Fricción y Difusión</div>', '<div class="slide-tag">7. Cero Fricción y Difusión</div>', new_html)
    new_html = re.sub(r'<div class="slide-tag">7\. Retorno Político y Social</div>', '<div class="slide-tag">8. Retorno Político y Social</div>', new_html)
    new_html = re.sub(r'<div class="slide-tag">8\. Votación y Aprobación</div>', '<div class="slide-tag">9. Votación y Aprobación</div>', new_html)
    
    with open('presentacion.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("SUCCESS: presentacion.html updated with 7 Eje slides!")
