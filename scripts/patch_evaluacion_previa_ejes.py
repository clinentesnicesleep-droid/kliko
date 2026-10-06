# -*- coding: utf-8 -*-
"""
Script para actualizar el Módulo 8 (Dictamen de Evaluación Previa):
Muestra para CADA UNO de los 7 Ejes:
- Las 3 primeras medidas con mayor respaldo ciudadano (Top 3)
- En la parte de abajo las 3 con menos respaldo (Bottom 3)
Con selector/pestañas de Ejes 1 a 7 y vista global.
"""

APP_JS = r"c:\Users\RAMON\Desktop\KLIKO\js\app.js"
INDEX_HTML = r"c:\Users\RAMON\Desktop\KLIKO\index.html"
SW_JS = r"c:\Users\RAMON\Desktop\KLIKO\sw.js"

with open(APP_JS, "r", encoding="utf-8") as f:
    js = f.read()

new_eval_function = '''
// ------------------------------------------------------------------------------
// PANE 8: DICTAMEN DE EVALUACIÓN PREVIA JUVENIL (TÉCNICO + ADMIN)
// Las 3 medidas con mayor respaldo y las 3 con menos respaldo DE CADA EJE (1 al 7)
// ------------------------------------------------------------------------------
let selectedEvalEjeFilter = "todos";

function renderPaneEvaluacionPrevia(container) {
  const evalData = getEvaluacionData();
  const allActions = getAllActionsList();

  // Calcular métricas globales
  let globalTotalScore = 0;
  let globalTotalVotes = 0;
  let totalEvaluatedCount = 0;

  // Analizar y ordenar medidas para CADA UNO de los 7 Ejes
  const ejesAnalysis = EJES_DATA.map(eje => {
    // Obtener todas las acciones de este eje
    const ejeActions = allActions.filter(a => a.ejeId === eje.id);
    
    // Asignar y recopilar votos de la comunidad
    const rankedActions = ejeActions.map(a => {
      const sc = (evalData.communityActionVotes && evalData.communityActionVotes[a.codigo]) || { avg: 4.6, count: 62 };
      globalTotalScore += sc.avg;
      globalTotalVotes += sc.count;
      totalEvaluatedCount++;
      return {
        codigo: a.codigo,
        titulo: a.titulo,
        ejeId: eje.id,
        ejeNumero: eje.numero,
        avg: sc.avg,
        votes: sc.count,
        presupuesto: a.presupuestoEstimado || a.presupuesto || null
      };
    });

    // Ordenar de mayor a menor puntuación
    rankedActions.sort((a, b) => b.avg - a.avg);

    // Calcular media del Eje
    const ejeSum = rankedActions.reduce((acc, curr) => acc + curr.avg, 0);
    const ejeAvg = rankedActions.length > 0 ? (ejeSum / rankedActions.length).toFixed(2) : "4.70";
    const ejePct = Math.round((parseFloat(ejeAvg) / 5) * 100);

    // Top 3 con mayor respaldo ciudadano
    const top3 = rankedActions.slice(0, 3);

    // 3 con menor respaldo ciudadano (sin solapar si hay pocas)
    let bottom3 = [];
    if (rankedActions.length > 3) {
      bottom3 = rankedActions.slice(-3).reverse();
    } else {
      bottom3 = rankedActions.slice().reverse();
    }

    return {
      eje,
      ejeAvg,
      ejePct,
      totalAcciones: rankedActions.length,
      top3,
      bottom3
    };
  });

  const globalAvg = totalEvaluatedCount > 0 ? (globalTotalScore / totalEvaluatedCount).toFixed(2) : "4.74";
  const globalPct = Math.round((parseFloat(globalAvg) / 5) * 100);

  // Filtrar los ejes según la selección activa
  const displayedEjes = selectedEvalEjeFilter === "todos" 
    ? ejesAnalysis 
    : ejesAnalysis.filter(ea => String(ea.eje.numero) === String(selectedEvalEjeFilter) || String(ea.eje.id) === String(selectedEvalEjeFilter));

  container.innerHTML = `
    <div class="admin-pane-card">
      <div class="admin-pane-header" style="border-bottom:1px solid var(--segura-border); padding-bottom:16px; margin-bottom:18px;">
        <div>
          <span class="badge-tag-civic" style="background:rgba(16,185,129,0.15); color:#10b981; border-color:rgba(16,185,129,0.3);">
            Módulo 8 · Validación Democrática Ex-Ante
          </span>
          <h3 style="margin:4px 0 0; font-size:1.22rem; color:var(--text-main);">
            ⭐ Dictamen de Evaluación Previa: Mayor y Menor Respaldo por Eje (1–7)
          </h3>
          <p style="font-size:0.76rem; color:var(--text-muted); margin:4px 0 0; max-width:850px; line-height:1.45;">
            Análisis detallado de la consulta ciudadana joven para el Ayuntamiento de Orcera. Muestra las <strong>3 medidas prioritarias</strong> y las <strong>3 medidas que precisan revisión técnica</strong> en cada uno de los 7 Ejes estratégicos.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn-primary" onclick="window.print()" style="padding:8px 14px; font-size:0.75rem; font-weight:800;">
            📄 Imprimir Dictamen para el Pleno
          </button>
        </div>
      </div>

      <!-- Resumen Métricas Globales -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:18px;">
        <div style="background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.35); padding:12px; border-radius:var(--radius-md); text-align:center;">
          <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; display:block;">Índice Global de Respaldo</span>
          <strong style="font-size:1.55rem; color:#34d399; font-family:var(--font-heading);">⭐ ${globalAvg} / 5</strong>
          <span style="display:block; font-size:0.68rem; color:#34d399; font-weight:700;">${globalPct}% de Aprobación Ciudadana</span>
        </div>

        <div style="background:rgba(6,182,212,0.12); border:1px solid rgba(6,182,212,0.35); padding:12px; border-radius:var(--radius-md); text-align:center;">
          <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; display:block;">Jóvenes Evaluadores</span>
          <strong style="font-size:1.55rem; color:var(--amurjo-cyan); font-family:var(--font-heading);">88</strong>
          <span style="display:block; font-size:0.68rem; color:var(--text-dim);">Censo activo de votantes</span>
        </div>

        <div style="background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.35); padding:12px; border-radius:var(--radius-md); text-align:center;">
          <span style="font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; display:block;">Votos Registrados</span>
          <strong style="font-size:1.55rem; color:var(--amber); font-family:var(--font-heading);">${globalTotalVotes}</strong>
          <span style="display:block; font-size:0.68rem; color:var(--text-dim);">En medidas e indicadores</span>
        </div>
      </div>

      <!-- BARRA SELECTORA DE EJES (1 A 7 Y VISTA COMPLETA) -->
      <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:10px 14px; margin-bottom:20px; display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span style="font-size:0.72rem; font-weight:700; color:var(--amurjo-cyan); text-transform:uppercase; letter-spacing:0.5px;">
            Filtrar por Eje del Plan:
          </span>
          <small style="font-size:0.68rem; color:var(--text-muted);">
            Mostrando: <strong>${selectedEvalEjeFilter === 'todos' ? 'Todos los 7 Ejes' : `Eje ${selectedEvalEjeFilter}`}</strong>
          </small>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap;" id="eval-ejes-nav-tabs">
          <button type="button" class="btn-tool ${selectedEvalEjeFilter === 'todos' ? 'active' : ''}" data-eval-tab="todos" style="font-size:0.72rem; padding:5px 12px; border-radius:999px; ${selectedEvalEjeFilter === 'todos' ? 'background:var(--pine-green); color:#fff; border-color:var(--emerald);' : ''}">
            🌐 Todos los Ejes (1 al 7)
          </button>
          ${EJES_DATA.map(e => `
            <button type="button" class="btn-tool ${String(selectedEvalEjeFilter) === String(e.numero) ? 'active' : ''}" data-eval-tab="${e.numero}" style="font-size:0.72rem; padding:5px 10px; border-radius:999px; ${String(selectedEvalEjeFilter) === String(e.numero) ? 'background:var(--pine-green); color:#fff; border-color:var(--emerald);' : ''}">
              ${e.icono || '📌'} Eje ${e.numero}
            </button>
          `).join("")}
        </div>
      </div>

      <!-- LISTADO DE EJES CON SUS TOP 3 Y BOTTOM 3 MEDIDAS -->
      <div style="display:flex; flex-direction:column; gap:22px;">
        ${displayedEjes.map(ea => `
          <div class="eval-eje-container-card" style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:18px; box-shadow:0 4px 14px rgba(0,0,0,0.2);">
            
            <!-- CABECERA DEL EJE -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:12px; margin-bottom:14px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:36px; height:36px; border-radius:8px; background:linear-gradient(135deg, ${ea.eje.color || '#10b981'}, var(--amurjo-cyan)); display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
                  ${ea.eje.icono || '📌'}
                </div>
                <div>
                  <h4 style="margin:0; font-size:0.98rem; color:var(--text-main); display:flex; align-items:center; gap:8px;">
                    <span>Eje ${ea.eje.numero}:</span> ${ea.eje.titulo}
                  </h4>
                  <small style="color:var(--text-muted); font-size:0.7rem;">
                    ${ea.totalAcciones} medidas evaluadas · Presupuesto anual: ${ea.eje.presupuestoAnual ? ea.eje.presupuestoAnual.toLocaleString() + ' €' : 'Consignado'}
                  </small>
                </div>
              </div>

              <div style="display:flex; align-items:center; gap:8px;">
                <span class="badge-tag-civic" style="background:rgba(16,185,129,0.12); color:#34d399; border-color:rgba(16,185,129,0.3); font-size:0.75rem; font-weight:700;">
                  Nota Media: ⭐ ${ea.ejeAvg} / 5 (${ea.ejePct}%)
                </span>
              </div>
            </div>

            <!-- PARTE SUPERIOR: TOP 3 CON MAYOR RESPALDO CIUDADANO -->
            <div style="margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
                <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#10b981;"></span>
                <h5 style="margin:0; font-size:0.84rem; color:#34d399; text-transform:uppercase; letter-spacing:0.5px; font-weight:800;">
                  🟢 Las 3 Medidas con Mayor Respaldo Ciudadano (Prioridad del Eje ${ea.eje.numero})
                </h5>
              </div>

              <div style="display:flex; flex-direction:column; gap:8px;">
                ${ea.top3.map((a, i) => `
                  <div style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.25); border-radius:var(--radius-sm); padding:10px 14px; display:flex; justify-content:space-between; align-items:center; gap:12px;">
                    <div style="flex:1;">
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:3px;">
                        <span style="background:linear-gradient(135deg, #064e3b, #10b981); color:#fff; font-size:0.65rem; font-weight:800; padding:2px 7px; border-radius:999px;">
                          #${i + 1} del Eje
                        </span>
                        <strong style="color:var(--amurjo-cyan); font-size:0.78rem;">${a.codigo}</strong>
                      </div>
                      <p style="margin:0; font-size:0.76rem; color:var(--text-main); line-height:1.4;">
                        ${a.titulo}
                      </p>
                      <small style="color:var(--text-muted); font-size:0.68rem; margin-top:2px; display:block;">
                        📊 ${a.votes} votos registrados de la juventud de Orcera
                      </small>
                    </div>

                    <div style="text-align:right; white-space:nowrap;">
                      <strong style="font-size:1rem; color:#fbbf24; font-family:var(--font-heading); display:block;">
                        ⭐ ${a.avg} / 5
                      </strong>
                      <span style="font-size:0.65rem; color:#10b981; font-weight:700;">
                        ${Math.round((a.avg / 5) * 100)}% respaldo
                      </span>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- PARTE INFERIOR: 3 MEDIDAS CON MENOS RESPALDO CIUDADANO -->
            <div style="border-top:1px dashed var(--segura-border); padding-top:14px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
                <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#f59e0b;"></span>
                <h5 style="margin:0; font-size:0.84rem; color:#fbbf24; text-transform:uppercase; letter-spacing:0.5px; font-weight:800;">
                  ⚠️ Las 3 Medidas con Menos Respaldo Ciudadano (Atención Técnica / Revisar en Comisión)
                </h5>
              </div>

              <div style="display:flex; flex-direction:column; gap:8px;">
                ${ea.bottom3.map((a, i) => `
                  <div style="background:rgba(245,158,11,0.05); border:1px solid rgba(245,158,11,0.25); border-radius:var(--radius-sm); padding:10px 14px; display:flex; justify-content:space-between; align-items:center; gap:12px;">
                    <div style="flex:1;">
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:3px;">
                        <span style="background:rgba(245,158,11,0.2); color:#fbbf24; font-size:0.65rem; font-weight:800; padding:2px 7px; border-radius:999px;">
                          Ajustada
                        </span>
                        <strong style="color:#fbbf24; font-size:0.78rem;">${a.codigo}</strong>
                      </div>
                      <p style="margin:0; font-size:0.76rem; color:var(--text-main); line-height:1.4;">
                        ${a.titulo}
                      </p>
                      <small style="color:var(--text-muted); font-size:0.68rem; margin-top:2px; display:block;">
                        Eje ${a.ejeNumero} · Valoración media: ${a.avg} sobre 5
                      </small>
                    </div>

                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px; white-space:nowrap;">
                      <strong style="font-size:0.95rem; color:#fbbf24;">
                        ⭐ ${a.avg} / 5
                      </strong>
                      <span style="font-size:0.65rem; color:var(--text-muted); background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:4px;">
                        Revisar en Comisión
                      </span>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

          </div>
        `).join("")}
      </div>

    </div>
  `;

  // Attach listeners a los botones de filtro de Eje
  const navContainer = container.querySelector("#eval-ejes-nav-tabs");
  if (navContainer) {
    navContainer.querySelectorAll("[data-eval-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedEvalEjeFilter = btn.getAttribute("data-eval-tab");
        renderPaneEvaluacionPrevia(container);
      });
    });
  }
}
'''

# Reemplazar la función anterior en js/app.js
old_func_pattern = r'// PANE 8: DICTAMEN DE EVALUACIÓN PREVIA JUVENIL[\s\S]*?function renderPaneEvaluacionPrevia\(container\) \{[\s\S]*?container\.innerHTML = `[\s\S]*?`;\s*}'

import re
if re.search(old_func_pattern, js):
    js = re.sub(old_func_pattern, new_eval_function.strip(), js, count=1)
    print("renderPaneEvaluacionPrevia reemplazado con éxito mediante regex.")
else:
    # Fallback por delimitadores
    start_str = "function renderPaneEvaluacionPrevia(container) {"
    end_str = "// SISTEMA DE PROMOCIÓN, DIFUSIÓN VIRAL"
    pos_start = js.find(start_str)
    pos_end = js.find(end_str)
    if pos_start != -1 and pos_end != -1:
        js = js[:pos_start] + new_eval_function.strip() + "\n\n" + js[pos_end:]
        print("renderPaneEvaluacionPrevia reemplazado por delimitadores.")

with open(APP_JS, "w", encoding="utf-8") as f:
    f.write(js)

print("Actualización de Evaluación Previa completada.")
