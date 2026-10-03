# -*- coding: utf-8 -*-
"""
Script to update both create_powerpoint_presentation.py and presentacion.html
with the 5-Year Action Timeline Bar Chart slide.
"""

def update_pptx_script():
    with open('scripts/create_powerpoint_presentation.py', 'r', encoding='utf-8') as f:
        code = f.read()

    new_slide_code = '''    # =========================================================================
    # DIAPOSITIVA 4: GRÁFICA DE BARRAS DE DURACIÓN DE LAS ACCIONES (2027-2031)
    # =========================================================================
    slide_gantt = prs.slides.add_slide(blank_layout)
    set_slide_background(slide_gantt, DARK_BG)
    add_slide_header(slide_gantt, "3. Planificación Temporal", "Gráfica de Barras: Duración de las Acciones a lo Largo de los 5 Años")

    # Tabla / Diagrama de Gantt Quinquenal
    rows, cols = 8, 7
    left, top, width, height = Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.1)
    table_shape = slide_gantt.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table

    # Anchos de columna
    table.columns[0].width = Inches(3.7) # Acción
    table.columns[1].width = Inches(1.3) # 2027
    table.columns[2].width = Inches(1.3) # 2028
    table.columns[3].width = Inches(1.3) # 2029
    table.columns[4].width = Inches(1.3) # 2030
    table.columns[5].width = Inches(1.3) # 2031
    table.columns[6].width = Inches(1.5) # Duración

    headers = ["Medida / Acción Clave", "2027 (Arranque)", "2028 (Consolida)", "2029 (Expansión)", "2030 (Madurez)", "2031 (Cierre)", "Vigencia Total"]
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.fill.solid()
        cell.fill.fore_color.rgb = PINE_GREEN
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER if i > 0 else PP_ALIGN.LEFT

    gantt_rows = [
        ("Sensibilización y voluntariado en Parque Natural", [1,1,1,1,1], "5 Años (Quinquenal)"),
        ("Formación digital, IA y empleo joven en Telecentro", [1,1,1,1,1], "5 Años (Quinquenal)"),
        ("Ocio en Amurjo, festivales y torneos de pádel", [1,1,1,1,1], "5 Años (Quinquenal)"),
        ("Apoyo emocional y salud mental preventiva", [1,1,1,1,1], "5 Años (Quinquenal)"),
        ("Reactivación Asociación Juvenil y Espacio Joven", [1,1,1,1,1], "5 Años (Quinquenal)"),
        ("Bolsa de alquiler y ayudas de emancipación rural", [0,1,1,1,1], "4 Años (2028-2031)"),
        ("Evaluación final, balance de impacto y IV Plan", [0,0,0,0,1], "1 Año (2031 Cierre)")
    ]

    for row_idx, (medida, active_years, dur_text) in enumerate(gantt_rows, start=1):
        cell_m = table.cell(row_idx, 0)
        cell_m.fill.solid()
        cell_m.fill.fore_color.rgb = CARD_BG
        p = cell_m.text_frame.paragraphs[0]
        p.text = medida
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = WHITE

        for y_idx, act in enumerate(active_years):
            c_year = table.cell(row_idx, y_idx + 1)
            c_year.fill.solid()
            if act:
                c_year.fill.fore_color.rgb = RGBColor(6, 78, 59)
                p_y = c_year.text_frame.paragraphs[0]
                p_y.text = "██████"
                p_y.font.size = Pt(8)
                p_y.font.color.rgb = EMERALD
                p_y.alignment = PP_ALIGN.CENTER
            else:
                c_year.fill.fore_color.rgb = RGBColor(20, 28, 44)
                p_y = c_year.text_frame.paragraphs[0]
                p_y.text = "—"
                p_y.font.size = Pt(8)
                p_y.font.color.rgb = TEXT_MUTED
                p_y.alignment = PP_ALIGN.CENTER

        cell_d = table.cell(row_idx, 6)
        cell_d.fill.solid()
        cell_d.fill.fore_color.rgb = CARD_BG
        p_d = cell_d.text_frame.paragraphs[0]
        p_d.text = dur_text
        p_d.font.size = Pt(8.5)
        p_d.font.bold = True
        p_d.font.color.rgb = AMURJO_CYAN
        p_d.alignment = PP_ALIGN.CENTER

'''

    target = '    # =========================================================================\n    # DIAPOSITIVA 4: LOS 7 EJES Y RIGOR PRESUPUESTARIO'
    if target in code and 'DIAPOSITIVA 4: GRÁFICA DE BARRAS' not in code:
        code = code.replace(target, new_slide_code + '\n' + target)
        with open('scripts/create_powerpoint_presentation.py', 'w', encoding='utf-8') as f:
            f.write(code)
        print('PPTX script updated with Gantt bar chart slide')
    else:
        print('Target not found or already updated in PPTX script')

def update_web_presentation():
    with open('presentacion.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Update slide count from 10 to 11
    html = html.replace('1 / 10', '1 / 11')

    gantt_slide_html = '''    <!-- SLIDE: GRÁFICA DE BARRAS QUINQUENAL DE LAS ACCIONES -->
    <div class="slide" id="slide-gantt-chart">
      <div class="slide-tag">3. Planificación Temporal</div>
      <h2 class="slide-title">Gráfica de Barras: Duración de las Acciones en los 5 Años (2027–2031)</h2>
      
      <div class="slide-card" style="padding: 20px; border-color: var(--amurjo-cyan); background: rgba(15, 23, 42, 0.7);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px;">
          <div>
            <strong style="color: var(--text-white); font-size: 1.05rem;">Cronograma Quinquenal de Ejecución</strong>
            <span style="display:block; font-size: 0.78rem; color: var(--text-muted);">
              Distribución temporal continua: las medidas estructurales abarcan el 100% del periodo con hitos anuales.
            </span>
          </div>
          <div style="display:flex; gap: 14px; font-size: 0.78rem;">
            <span style="display:flex; align-items:center; gap:5px;"><span style="display:inline-block; width:12px; height:8px; border-radius:2px; background:linear-gradient(90deg, #10b981, #06b6d4);"></span> Acción en Ejecución</span>
            <span style="display:flex; align-items:center; gap:5px;"><span style="display:inline-block; width:12px; height:8px; border-radius:2px; background:rgba(255,255,255,0.1);"></span> No Activa</span>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
          <thead>
            <tr style="background: rgba(6, 78, 59, 0.6); color: var(--amurjo-cyan); text-align: center; border-bottom: 2px solid var(--amurjo-cyan);">
              <th style="padding: 10px 12px; text-align: left; width: 35%;">Medida / Acción Clave</th>
              <th style="padding: 10px 6px;">2027 (Arranque)</th>
              <th style="padding: 10px 6px;">2028 (Consolida)</th>
              <th style="padding: 10px 6px;">2029 (Expansión)</th>
              <th style="padding: 10px 6px;">2030 (Madurez)</th>
              <th style="padding: 10px 6px;">2031 (Cierre)</th>
              <th style="padding: 10px 12px; text-align: right;">Duración Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);">
              <td style="padding: 10px 12px;"><strong>Sensibilización ambiental y rutas por la Sierra</strong></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 10px 12px; text-align: right;"><span style="background:rgba(16,185,129,0.2); color:#34d399; padding:2px 8px; border-radius:9999px; font-weight:700; font-size:0.75rem;">5 Años (100%)</span></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 10px 12px;"><strong>Cursos DJ, robótica y empleo en Telecentro</strong></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 10px 12px; text-align: right;"><span style="background:rgba(16,185,129,0.2); color:#34d399; padding:2px 8px; border-radius:9999px; font-weight:700; font-size:0.75rem;">5 Años (100%)</span></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);">
              <td style="padding: 10px 12px;"><strong>Ocio en Amurjo, festivales y torneos de pádel</strong></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 10px 12px; text-align: right;"><span style="background:rgba(16,185,129,0.2); color:#34d399; padding:2px 8px; border-radius:9999px; font-weight:700; font-size:0.75rem;">5 Años (100%)</span></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 10px 12px;"><strong>Apoyo emocional y asesoría psicológica joven</strong></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 10px 12px; text-align: right;"><span style="background:rgba(16,185,129,0.2); color:#34d399; padding:2px 8px; border-radius:9999px; font-weight:700; font-size:0.75rem;">5 Años (100%)</span></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);">
              <td style="padding: 10px 12px;"><strong>Asociación Juvenil de Orcera y Espacio Joven</strong></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 10px 12px; text-align: right;"><span style="background:rgba(16,185,129,0.2); color:#34d399; padding:2px 8px; border-radius:9999px; font-weight:700; font-size:0.75rem;">5 Años (100%)</span></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 10px 12px;"><strong>Bolsa de alquiler y ayudas a la emancipación</strong></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:rgba(255,255,255,0.06);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #10b981, #06b6d4);"></div></td>
              <td style="padding: 10px 12px; text-align: right;"><span style="background:rgba(6,182,212,0.2); color:var(--amurjo-cyan); padding:2px 8px; border-radius:9999px; font-weight:700; font-size:0.75rem;">4 Años (80%)</span></td>
            </tr>
            <tr style="background: rgba(255,255,255,0.02);">
              <td style="padding: 10px 12px;"><strong>Evaluación final, balance de impacto y IV Plan</strong></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:rgba(255,255,255,0.06);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:rgba(255,255,255,0.06);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:rgba(255,255,255,0.06);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:rgba(255,255,255,0.06);"></div></td>
              <td style="padding: 6px;"><div style="height:10px; border-radius:5px; background:linear-gradient(90deg, #ff5722, #f59e0b);"></div></td>
              <td style="padding: 10px 12px; text-align: right;"><span style="background:rgba(255,87,34,0.2); color:#fb923c; padding:2px 8px; border-radius:9999px; font-weight:700; font-size:0.75rem;">1 Año (2031)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
'''

    target = '    <!-- SLIDE 4: PRESUPUESTO & 7 EJES CON MÓVIL LATERAL -->'
    if target in html and 'slide-gantt-chart' not in html:
        html = html.replace(target, gantt_slide_html + '\n' + target)
        with open('presentacion.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Web presentation updated with Gantt bar chart slide')
    else:
        print('Target not found or already present in web presentation')

if __name__ == '__main__':
    update_pptx_script()
    update_web_presentation()
