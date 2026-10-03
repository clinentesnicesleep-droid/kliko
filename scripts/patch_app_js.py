import re
import sys

def main():
    if sys.stdout.encoding.lower() != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')

    with open('js/app.js', 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Replace the old EJES_DATA block (lines 7 to right before RECOMPENSAS_DATA)
    pos_start = code.find('// 1. BASE DE DATOS LOCAL OFICIAL DE LOS 7 EJES')
    pos_end = code.find('// 2. CATÁLOGO DE RECOMPENSAS')
    if pos_end == -1:
        pos_end = code.find('// 2. CAT')

    if pos_start != -1 and pos_end != -1:
        replacement = """// 1. BASE DE DATOS LOCAL OFICIAL DE LOS 7 EJES
// Los 7 Ejes, 21 Objetivos Específicos, 63 Acciones Oficiales y 378 Indicadores Oficiales
// se cargan rigurosamente desde js/data-ejes.js
if (typeof EJES_DATA === 'undefined') {
  console.error("EJES_DATA no está cargado. Asegúrate de incluir js/data-ejes.js antes de js/app.js");
}

"""
        code = code[:pos_start] + replacement + code[pos_end:]
        print("Replaced EJES_DATA block with lightweight reference!")
    else:
        print(f"Warning: EJES_DATA positions: start={pos_start}, end={pos_end}")

    # 2. Add selectedIndFilter: "todas" to AppState if not present
    if 'selectedIndFilter:' not in code:
        code = code.replace(
            'selectedActionDuration: "todas",',
            'selectedActionDuration: "todas",\n  selectedIndFilter: "todas",'
        )
        print("Added selectedIndFilter to AppState!")

    # 3. Update renderEjeDetail implementation
    # Let's find function renderEjeDetail(ejeId) { ... function formatStatusName
    render_start = code.find('function renderEjeDetail(ejeId) {')
    render_end = code.find('function formatStatusName(status) {')

    if render_start == -1 or render_end == -1:
        print("Error: Could not locate renderEjeDetail bounds")
        return

    new_render = """function renderEjeDetail(ejeId) {
  const container = document.getElementById("eje-detail-container");
  const eje = EJES_DATA.find(e => e.id === ejeId);
  if (!container || !eje) return;

  const percentExecution = ((eje.presupuestoReal2027 / eje.presupuestoAnual) * 100).toFixed(1);
  const avgStars = (eje.valoraciones.reduce((acc, v) => acc + v.estrellas, 0) / (eje.valoraciones.length || 1)).toFixed(1);

  // Asegurar lista plana de acciones del eje
  if (!eje.acciones || eje.acciones.length === 0) {
    eje.acciones = eje.objetivosEspecificos.flatMap(oe => oe.acciones);
  }

  // Todos los indicadores oficiales de este eje (54 en total: 6 por cada una de las 9 acciones)
  const allIndicadoresOficiales = eje.acciones.flatMap(acc => acc.indicadores || []);
  const ejeAvgCumplimiento = Math.round(allIndicadoresOficiales.reduce((sum, ind) => sum + ind.cumplimiento, 0) / (allIndicadoresOficiales.length || 1));

  // Obtener la evaluación oficial del año seleccionado
  const currentEval = eje.evaluacionesOficiales ? (eje.evaluacionesOficiales['evaluacion' + AppState.selectedEvaluationYear] || eje.evaluacionesOficiales.evaluacion2027) : {
    tipo: `Evaluación Anual ${AppState.selectedEvaluationYear}`,
    fecha: `Diciembre ${AppState.selectedEvaluationYear}`,
    calificacion: "9.0/10",
    porcentajeEjecucion: "90%",
    accionesEvaluadas: 9,
    indicadoresCumplidos: "88%",
    resumen: "Seguimiento oficial de cumplimiento.",
    hitos: ["Ejecución normalizada de las acciones e indicadores oficiales."],
    dificultades: ["Ajuste logístico de calendarios."],
    propuestasMejora: ["Continuar con el monitoreo trimestral."]
  };

  // Filtrado de acciones para la pestaña de indicadores según el objetivo específico seleccionado
  const displayedAccionesForInd = AppState.selectedIndFilter === "todas"
    ? eje.acciones
    : eje.acciones.filter(acc => acc.codigo.startsWith(AppState.selectedIndFilter.replace("OE-", "ACC-")));

  container.innerHTML = `
    <div class="eje-sheet">
      <!-- 1. IDENTIFICACIÓN DEL EJE -->
      <div class="eje-header-banner" style="background: linear-gradient(135deg, ${eje.color}dd, ${eje.colorSecundario}aa);">
        <div class="eje-top-meta">
          <span class="eje-number-badge">EJE ESTRATÉGICO ${eje.numero} DE 7</span>
        </div>
        <div class="eje-title-row">
          <span class="eje-giant-icon">${eje.icono}</span>
          <div>
            <h3 class="eje-main-title">${eje.titulo}</h3>
            <p class="eje-lema">"${eje.lema}"</p>
          </div>
        </div>
      </div>

      <!-- PESTAÑAS INTERNAS DE LA FICHA TÉCNICA -->
      <nav class="eje-subtabs" role="tablist">
        <button class="subtab-btn ${AppState.activeEjeSubtab === 'subtab-acciones' ? 'active' : ''}" data-subtab="subtab-acciones">
          <span>Acciones</span>
          <span class="subtab-badge">${eje.acciones.length} medidas</span>
        </button>
        <button class="subtab-btn ${AppState.activeEjeSubtab === 'subtab-indicadores' ? 'active' : ''}" data-subtab="subtab-indicadores">
          <span>Indicadores y Evaluación</span>
          <span class="subtab-badge">54 Indicadores Oficiales</span>
        </button>
        <button class="subtab-btn ${AppState.activeEjeSubtab === 'subtab-transparencia' ? 'active' : ''}" data-subtab="subtab-transparencia">
          <span>Finanzas</span>
          <span class="subtab-badge">${percentExecution}%</span>
        </button>
        <button class="subtab-btn ${AppState.activeEjeSubtab === 'subtab-evaluacion' ? 'active' : ''}" data-subtab="subtab-evaluacion">
          <span>Opinión</span>
          <span class="subtab-badge">${avgStars}★</span>
        </button>
      </nav>

      <!-- CONTENIDOS DE LAS SUBPESTAÑAS -->
      <div class="eje-subtab-contents">

        <!-- SUBPESTAÑA 1: OBJETIVOS Y ACCIONES QUINQUENALES (9 MEDIDAS) -->
        <div class="subtab-pane ${AppState.activeEjeSubtab === 'subtab-acciones' ? 'active' : ''}" id="subtab-acciones" style="${AppState.activeEjeSubtab === 'subtab-acciones' ? 'display:block' : 'display:none'}">

          <div style="margin-bottom: 16px;">
            <h4 style="font-family: var(--font-heading); font-size: 0.88rem; color: var(--amurjo-cyan); text-transform: uppercase; margin-bottom: 4px;">
              2. Objetivo General (Horizonte Quinquenal 2027–2031)
            </h4>
            <p style="font-size: 0.84rem; color: var(--text-main); font-weight: 500; line-height: 1.45;">${eje.objetivoGeneral}</p>
          </div>

          <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px;">
            <h4 style="font-family: var(--font-heading); font-size: 0.88rem; color: var(--text-main); margin: 0;">
              3. Objetivos Específicos y Acciones (${eje.acciones.length} Medidas)
            </h4>
            <span style="font-size: 0.72rem; color: var(--text-muted);">
              3 Objetivos Específicos · 3 Acciones por objetivo · 6 Indicadores de Evaluación por acción
            </span>
          </div>

          <!-- SELECTOR TEMPORAL Y DE DURACIÓN -->
          <div class="actions-temporal-selector">
            <div class="temporal-selector-header">
              <div>
                <span class="temporal-title">📅 Horizonte Temporal:</span>
                <span class="temporal-subtitle">Explora qué medidas se ejecutan en cada año del Plan:</span>
              </div>
              <span class="action-vigencia-tag">Plan 2027–2031</span>
            </div>
            <div class="temporal-chips-wrap">
              <button type="button" class="action-year-chip ${AppState.selectedActionYear === 'quinquenal' ? 'active' : ''}" data-action-year="quinquenal">
                🌟 Todo el Plan (2027–2031)
              </button>
              <button type="button" class="action-year-chip ${AppState.selectedActionYear === '2027' ? 'active' : ''}" data-action-year="2027">
                2027 (Arranque)
              </button>
              <button type="button" class="action-year-chip ${AppState.selectedActionYear === '2028' ? 'active' : ''}" data-action-year="2028">
                2028 (Consolidación)
              </button>
              <button type="button" class="action-year-chip ${AppState.selectedActionYear === '2029' ? 'active' : ''}" data-action-year="2029">
                2029 (Expansión)
              </button>
              <button type="button" class="action-year-chip ${AppState.selectedActionYear === '2030' ? 'active' : ''}" data-action-year="2030">
                2030 (Madurez)
              </button>
              <button type="button" class="action-year-chip ${AppState.selectedActionYear === '2031' ? 'active' : ''}" data-action-year="2031">
                2031 (Impacto y Cierre)
              </button>
            </div>

            <!-- FILTRO POR DURACIÓN DE LA MEDIDA (1, 2, 3, 4 o 5 años) -->
            <div class="filter-duracion-wrap">
              <span class="duracion-label">⏱️ Filtrar por Duración:</span>
              <button type="button" class="duracion-filter-btn ${AppState.selectedActionDuration === 'todas' ? 'active' : ''}" data-duracion="todas">
                Todas las Medidas
              </button>
              <button type="button" class="duracion-filter-btn ${AppState.selectedActionDuration === '1_ano' ? 'active' : ''}" data-duracion="1_ano">
                1 año
              </button>
              <button type="button" class="duracion-filter-btn ${AppState.selectedActionDuration === '2_anos' ? 'active' : ''}" data-duracion="2_anos">
                2 años
              </button>
              <button type="button" class="duracion-filter-btn ${AppState.selectedActionDuration === '3_anos' ? 'active' : ''}" data-duracion="3_anos">
                3 años
              </button>
              <button type="button" class="duracion-filter-btn ${AppState.selectedActionDuration === '4_anos' ? 'active' : ''}" data-duracion="4_anos">
                4 años
              </button>
              <button type="button" class="duracion-filter-btn ${AppState.selectedActionDuration === '5_anos' ? 'active' : ''}" data-duracion="5_anos">
                Todo el Plan (5 años)
              </button>
            </div>
          </div>

          <div class="oe-groups-container">
            ${eje.objetivosEspecificos.map(oe => {
              // Filtrar acciones del objetivo según filtro de duración si aplica
              const filteredAcciones = oe.acciones.filter(acc => {
                const roadmap = getActionRoadmap(acc, eje);
                if (AppState.selectedActionDuration !== "todas" && roadmap.duracionTipo !== AppState.selectedActionDuration) {
                  return false;
                }
                return true;
              });

              if (filteredAcciones.length === 0) return '';

              return `
              <div class="oe-group-block">
                <div class="oe-header-banner">
                  <div>
                    <span class="oe-code-tag">${oe.codigo}</span>
                    <h5 class="oe-title">${oe.titulo}</h5>
                  </div>
                  <span class="oe-count-badge">${filteredAcciones.length} de ${oe.acciones.length} acciones</span>
                </div>

                <div class="actions-cards-stack">
                  ${filteredAcciones.map(acc => {
                    const roadmap = getActionRoadmap(acc, eje);
                    const isQuinquenal = AppState.selectedActionYear === "quinquenal";
                    const selYear = parseInt(AppState.selectedActionYear) || 2027;

                    const isActiveThisYear = roadmap.anos.includes(selYear);
                    const isCompleted = selYear > Math.max(...roadmap.anos);
                    const isUpcoming = selYear < Math.min(...roadmap.anos);

                    let statusClass = "status-en_curso";
                    let statusLabel = "En curso";
                    if (isQuinquenal) {
                      statusClass = "status-" + acc.estado;
                      statusLabel = formatStatusName(acc.estado);
                    } else if (isActiveThisYear) {
                      statusClass = "status-en_curso";
                      statusLabel = `● En ejecución en ${selYear}`;
                    } else if (isCompleted) {
                      statusClass = "status-finalizada";
                      statusLabel = `✓ Finalizada (año ${Math.max(...roadmap.anos)})`;
                    } else if (isUpcoming) {
                      statusClass = "status-no_iniciada";
                      statusLabel = `⏳ Prevista (año ${Math.min(...roadmap.anos)})`;
                    }

                    return `
                    <div class="action-card ${!isQuinquenal && !isActiveThisYear ? 'action-card-muted' : ''}">
                      <div class="action-header-row">
                        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                          <span class="action-code-tag">${acc.codigo}</span>
                          <span class="badge-duracion dur-${roadmap.duracionTipo}">⏱️ ${roadmap.vigencia}</span>
                          <span class="badge-ind-link">📊 ${acc.indicadores ? acc.indicadores.length : 6} Indicadores Oficiales</span>
                        </div>
                        <span class="action-status-badge ${statusClass}">${statusLabel}</span>
                      </div>

                      <div class="action-badges-row">
                        <div class="action-anos-pills">
                          <small style="font-size:0.62rem; color:var(--text-dim); margin-right:2px;">Años de ejecución:</small>
                          ${[2027, 2028, 2029, 2030, 2031].map(y => `
                            <span class="mini-ano-pill ${roadmap.anos.includes(y) ? 'active-year' : ''} ${!isQuinquenal && selYear === y ? 'current-active-yr' : ''}">${y}</span>
                          `).join("")}
                        </div>
                      </div>

                      <h5 class="action-title">${acc.titulo}</h5>
                      <p class="action-desc">${acc.descripcion}</p>

                      <!-- DESPLIEGUE QUINQUENAL O ANUALIZADO -->
                      ${isQuinquenal ? `
                        <div class="action-quinquenal-block">
                          <div class="quinquenal-block-title">
                            <span>🗺️ Cronograma Quinquenal de Desarrollo (2027–2031)</span>
                            <span style="font-size: 0.68rem; color: var(--text-dim); font-weight: normal;">Duración: ${roadmap.vigencia}</span>
                          </div>
                          <div class="quinquenal-years-grid">
                            ${[2027, 2028, 2029, 2030, 2031].map(yr => {
                              const inAnos = roadmap.anos.includes(yr);
                              return `
                              <div class="quinquenal-year-row ${inAnos ? 'current-highlight' : ''}" style="${!inAnos ? 'opacity: 0.65;' : ''}">
                                <span class="quinquenal-year-label">${yr}:</span>
                                <span class="quinquenal-year-text">${roadmap.hitos ? roadmap.hitos[yr] : 'Ejecución normalizada.'}</span>
                              </div>
                            `;
                            }).join("")}
                          </div>
                        </div>
                      ` : `
                        <div class="action-annual-focus-card" style="${!isActiveThisYear ? 'border-color: rgba(148, 163, 184, 0.2); background: rgba(0,0,0,0.15);' : ''}">
                          <div class="focus-card-header">
                            <span class="focus-card-title">🎯 Estado y Plan en el Ejercicio ${selYear}</span>
                            <span class="focus-card-phase">${(roadmap.fases && roadmap.fases[selYear]) ? roadmap.fases[selYear].nombre : ('Anualidad ' + selYear)}</span>
                          </div>
                          <div class="focus-card-milestone">
                            <strong>${isActiveThisYear ? 'Hito programado:' : 'Situación:'}</strong> ${(roadmap.hitos && roadmap.hitos[selYear]) ? roadmap.hitos[selYear] : 'Seguimiento oficial de la medida.'}
                          </div>
                        </div>
                      `}

                      <!-- PREVIEW DE INDICADORES OFICIALES DE ESTA ACCIÓN -->
                      ${(acc.indicadores && acc.indicadores.length > 0) ? `
                        <div class="action-card-indicators-preview">
                          <div class="ind-preview-header">
                            <span class="ind-preview-title">📊 Indicadores de Evaluación de esta Acción (${acc.indicadores.length} oficiales):</span>
                            <button type="button" class="ind-preview-link jump-to-eval-btn" data-action-code="${acc.codigo}">
                              Ver en Evaluación Oficial →
                            </button>
                          </div>
                          <div class="ind-preview-tags-list">
                            ${acc.indicadores.map((ind, i) => `
                              <div class="ind-preview-pill" title="${ind.nombre}">
                                <span class="pill-dot">🎯</span>
                                <span class="pill-text">${ind.nombre}</span>
                                <span class="pill-val">${ind.actualQuinquenal}/${ind.metaQuinquenal} ${ind.unidad} (${ind.cumplimiento}%)</span>
                              </div>
                            `).join("")}
                          </div>
                        </div>
                      ` : ''}

                      <div class="action-meta-footer">
                        <div class="action-meta-col">
                          <span class="meta-label">Responsable:</span>
                          <span class="meta-val">${acc.responsable || (acc.concejalias ? acc.concejalias.join(", ") : 'Ayuntamiento de Orcera')}</span>
                        </div>
                        <div class="action-meta-col">
                          <span class="meta-label">Recursos:</span>
                          <span class="meta-val">${acc.recursos || 'Recursos propios municipales'}</span>
                        </div>
                      </div>
                    </div>
                  `;
                  }).join("")}
                </div>
              </div>
            `;
            }).join("")}
          </div>
        </div>

        <!-- SUBPESTAÑA 2: INDICADORES Y EVALUACIÓN POR ACCIÓN (SECCIONES 11 Y 12 DEL PLAN) -->
        <div class="subtab-pane ${AppState.activeEjeSubtab === 'subtab-indicadores' ? 'active' : ''}" id="subtab-indicadores" style="${AppState.activeEjeSubtab === 'subtab-indicadores' ? 'display:block' : 'display:none'}">

          <!-- RESUMEN EJECUTIVO: 9 ACCIONES Y 54 INDICADORES OFICIALES -->
          <div class="indicadores-eje-summary-card">
            <div class="summary-top-row">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span class="ind-code-tag">EJE ESTRATÉGICO ${eje.numero}</span>
                  <span class="action-vigencia-tag">Secciones 11 y 12 del Plan</span>
                </div>
                <h4 style="font-family: var(--font-heading); font-size: 1rem; color: var(--text-main); margin: 0 0 4px;">
                  4. Sistema Oficial de Indicadores y Evaluación por Acciones
                </h4>
                <p style="font-size: 0.76rem; color: var(--text-muted); margin: 0; line-height: 1.4;">
                  Conforme al Plan Municipal de Juventud (2027–2031), <strong>cada una de las 9 acciones contempla sus propios indicadores oficiales de evaluación</strong>. A continuación se desglosan las medidas y sus 54 indicadores de seguimiento anual y final:
                </p>
              </div>
              <div class="summary-badge-group">
                <div class="summary-stat-box">
                  <span class="stat-num">${allIndicadoresOficiales.length}</span>
                  <span class="stat-lbl">Indicadores Oficiales</span>
                </div>
                <div class="summary-stat-box">
                  <span class="stat-num">${ejeAvgCumplimiento}%</span>
                  <span class="stat-lbl">Cumplimiento Global</span>
                </div>
              </div>
            </div>

            <!-- BARRA DE FILTRO POR OBJETIVO ESPECÍFICO -->
            <div class="ind-filter-bar">
              <span class="ind-filter-label">🎯 Filtrar Acciones:</span>
              <button type="button" class="ind-filter-chip ${AppState.selectedIndFilter === 'todas' ? 'active' : ''}" data-ind-filter="todas">
                Todas las Acciones (${eje.acciones.length} medidas · 54 ind.)
              </button>
              ${eje.objetivosEspecificos.map(oe => `
                <button type="button" class="ind-filter-chip ${AppState.selectedIndFilter === oe.codigo ? 'active' : ''}" data-ind-filter="${oe.codigo}">
                  ${oe.codigo}: Obj. ${oe.numero} (${oe.acciones.length} acciones)
                </button>
              `).join("")}
            </div>
          </div>

          <!-- LISTADO DE ACCIONES CON SUS 6 INDICADORES OFICIALES CADA UNA -->
          <div class="actions-evaluations-container" style="margin-bottom: 24px;">
            ${displayedAccionesForInd.map(acc => {
              const accCumplimiento = Math.round(acc.indicadores.reduce((sum, ind) => sum + ind.cumplimiento, 0) / (acc.indicadores.length || 1));
              const compClass = accCumplimiento >= 100 ? 'comp-superado' : (accCumplimiento >= 90 ? 'comp-optimo' : 'comp-progreso');

              return `
                <div class="action-eval-card" id="eval-card-${acc.codigo}">
                  <div class="action-eval-header">
                    <div class="action-eval-title-wrap">
                      <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                        <span class="action-code-tag">${acc.codigo}</span>
                        <span class="badge-duracion dur-${acc.roadmap.duracionTipo}">⏱️ ${acc.roadmap.vigencia}</span>
                        <span class="badge-ind-link">🏛️ ${acc.responsable}</span>
                      </div>
                      <h5 class="action-eval-title">${acc.titulo}</h5>
                    </div>
                    <div class="action-eval-stat-badge">
                      <span class="eval-stat-pct ${compClass}">${accCumplimiento}%</span>
                      <span class="eval-stat-lbl">Cumplimiento Acción</span>
                    </div>
                  </div>

                  <!-- DESGLOSE DE LOS 6 INDICADORES OFICIALES DE ESTA ACCIÓN -->
                  <div class="action-ind-sublist">
                    <div class="sublist-caption">
                      <span>📊 Indicadores Oficiales de Evaluación (${acc.indicadores.length} métricas):</span>
                      <small style="color:var(--text-dim); font-size:0.7rem;">Fuente: Ficha Oficial Sección 11</small>
                    </div>

                    <div class="ind-cards-grid">
                      ${acc.indicadores.map(ind => {
                        const indCompClass = ind.cumplimiento >= 100 ? 'comp-superado' : (ind.cumplimiento >= 90 ? 'comp-optimo' : 'comp-progreso');
                        return `
                          <div class="indicator-item-card">
                            <div>
                              <div class="ind-item-header">
                                <div>
                                  <span class="ind-mini-code">${ind.codigo}</span>
                                  <span class="ind-item-title">${ind.nombre}</span>
                                </div>
                                <span class="ind-compliance-mini ${indCompClass}">
                                  ${ind.cumplimiento}%
                                </span>
                              </div>

                              <div class="ind-item-meta-row">
                                <span class="ind-item-metric">
                                  Logrado: <strong style="color:var(--text-main);">${ind.actualQuinquenal} ${ind.unidad}</strong> / Meta: <strong>${ind.metaQuinquenal} ${ind.unidad}</strong>
                                </span>
                                <span class="ind-item-type">${ind.tipo}</span>
                              </div>

                              <div class="progress-bar-bg" style="height: 5px; margin: 6px 0 8px;">
                                <div class="progress-bar-fill" style="width: ${Math.min(100, ind.cumplimiento)}%;"></div>
                              </div>
                            </div>

                            <!-- Desglose por Años (2027 a 2031) -->
                            <div class="ind-mini-years-row">
                              ${[2027, 2028, 2029, 2030, 2031].map(yr => {
                                const yrData = ind.valoresPorAno[yr] || { conseguido: 0, meta: 0, pct: 100 };
                                const isCurYr = AppState.selectedEvaluationYear === yr;
                                return `
                                  <div class="mini-yr-cell ${isCurYr ? 'selected-eval-yr' : ''}">
                                    <span class="mini-yr-lbl">${yr}</span>
                                    <span class="mini-yr-val">${yrData.conseguido}</span>
                                    <span class="mini-yr-pct">${yrData.pct}%</span>
                                  </div>
                                `;
                              }).join("")}
                            </div>
                          </div>
                        `;
                      }).join("")}
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <!-- SECCIÓN 5: RESULTADOS DE LAS EVALUACIONES OFICIALES (ANUALES Y FINAL) -->
          <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--segura-border);">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
              <div>
                <h4 style="font-family: var(--font-heading); font-size: 0.92rem; color: var(--text-main); margin: 0;">
                  5. Evaluaciones Anuales y Evaluación Final Quinquenal (Sección 12 del Plan)
                </h4>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin: 2px 0 0;">
                  Dictámenes e informes oficiales elaborados por la Comisión Técnica de Seguimiento evaluando los 54 indicadores:
                </p>
              </div>
              <span class="action-vigencia-tag">Comisión Técnica Municipal</span>
            </div>

            <!-- Selector de Evaluaciones -->
            <div class="evaluation-strip-nav">
              <button type="button" class="eval-btn-pill ${AppState.selectedEvaluationYear === 2027 ? 'active' : ''}" data-eval-year="2027">
                Evaluación Anual 2027 (Arranque)
              </button>
              <button type="button" class="eval-btn-pill ${AppState.selectedEvaluationYear === 2028 ? 'active' : ''}" data-eval-year="2028">
                Evaluación Anual 2028 (Consolidación)
              </button>
              <button type="button" class="eval-btn-pill ${AppState.selectedEvaluationYear === 2029 ? 'active' : ''}" data-eval-year="2029">
                Evaluación Intermedia 2029 (Ecuador)
              </button>
              <button type="button" class="eval-btn-pill ${AppState.selectedEvaluationYear === 2030 ? 'active' : ''}" data-eval-year="2030">
                Evaluación Anual 2030 (Madurez)
              </button>
              <button type="button" class="eval-btn-pill ${AppState.selectedEvaluationYear === 2031 ? 'active' : ''}" data-eval-year="2031">
                Evaluación Final Quinquenal (2031)
              </button>
            </div>

            <!-- Ficha Oficial de Resultados de la Evaluación Seleccionada -->
            <div class="eval-detail-sheet" style="margin-top: 14px;">
              <div class="eval-sheet-header">
                <div>
                  <span class="eval-sheet-tag">${currentEval.tipo || 'Evaluación Oficial'}</span>
                  <h5 style="margin: 4px 0; color: var(--text-main); font-size: 0.95rem;">
                    Informe de Resultados y Cumplimiento: Año ${AppState.selectedEvaluationYear}
                  </h5>
                  <span style="font-size: 0.7rem; color: var(--text-dim);">Fecha de dictamen: ${currentEval.fecha}</span>
                </div>
                <div style="text-align: right;">
                  <span class="eval-score-badge">${currentEval.calificacion || currentEval.calificacionEsperada}</span>
                  <small style="display:block; color:var(--text-dim); font-size:0.65rem;">Dictamen Global</small>
                </div>
              </div>

              <div class="eval-sheet-kpis">
                <div class="eval-kpi-item">
                  <span class="kpi-num">${currentEval.accionesEvaluadas || 9}</span>
                  <span class="kpi-lbl">Acciones Evaluadas</span>
                </div>
                <div class="eval-kpi-item">
                  <span class="kpi-num">${currentEval.indicadoresCumplidos || '89%'}</span>
                  <span class="kpi-lbl">Cumplimiento Indicadores</span>
                </div>
                <div class="eval-kpi-item">
                  <span class="kpi-num">${currentEval.porcentajeEjecucion || '92%'}</span>
                  <span class="kpi-lbl">Ejecución Presupuestaria</span>
                </div>
              </div>

              <p class="eval-summary-text">${currentEval.resumen}</p>

              <div class="eval-subsections-grid">
                <div class="eval-block hitos-block">
                  <h6>✨ Principales Logros e Hitos Alcanzados:</h6>
                  <ul>
                    ${(currentEval.hitos || []).map(h => `<li>${h}</li>`).join("")}
                  </ul>
                </div>
                <div class="eval-block diff-block">
                  <h6>⚠️ Dificultades Detectadas en el Ejercicio:</h6>
                  <ul>
                    ${(currentEval.dificultades || []).map(d => `<li>${d}</li>`).join("")}
                  </ul>
                </div>
              </div>

              <div class="eval-block mejora-block" style="margin-top: 10px;">
                <h6>💡 Propuestas de Mejora y Reajustes de Planificación:</h6>
                <ul>
                  ${(currentEval.propuestasMejora || []).map(p => `<li>${p}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- SUBPESTAÑA 3: CRONOGRAMA Y GASTO JUSTIFICADO -->
        <div class="subtab-pane ${AppState.activeEjeSubtab === 'subtab-transparencia' ? 'active' : ''}" id="subtab-transparencia" style="${AppState.activeEjeSubtab === 'subtab-transparencia' ? 'display:block' : 'display:none'}">

          <!-- CRONOGRAMA QUINQUENAL Y TRIMESTRAL -->
          <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
              <div>
                <h4 style="font-family: var(--font-heading); font-size: 0.92rem; color: var(--text-main); margin: 0;">
                  6. Cronograma de Actuación Quinquenal (2027–2031)
                </h4>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin: 2px 0 0;">
                  Selecciona una anualidad para consultar el enfoque estratégico y las acciones por trimestre:
                </p>
              </div>
              <span class="action-vigencia-tag">Sección 15 del Plan</span>
            </div>

            <!-- Selector de Año Quinquenal -->
            <div class="cronograma-year-selector">
              ${[2027, 2028, 2029, 2030, 2031].map(ano => `
                <button type="button" class="year-pill ${AppState.selectedCronogramaYear === ano ? 'active' : ''}" data-year="${ano}">
                  ${ano}
                </button>
              `).join("")}
            </div>

            <!-- Contenedor del Calendario Trimestral Dinámico -->
            <div id="cronograma-calendar-wrapper">
              ${renderQuarterCalendar(eje, AppState.selectedCronogramaYear)}
            </div>
          </div>

          <!-- FINANZAS Y GASTO REAL JUSTIFICADO -->
          <div style="border-top: 1px solid var(--segura-border); padding-top: 20px;">
            <h4 style="font-family: var(--font-heading); font-size: 0.92rem; color: var(--text-main); margin-bottom: 8px;">
              7. Financiación y Rendición de Cuentas (Año 2027)
            </h4>
            <div class="transparency-summary">
              <div class="transparency-card">
                <span class="trans-label">Presupuesto Anual Estimado:</span>
                <span class="trans-val">${eje.presupuestoAnual.toLocaleString('es-ES')} €</span>
                <small style="color:var(--text-dim); font-size:0.68rem;">(Total Quinquenal: ${eje.presupuestoQuinquenal.toLocaleString('es-ES')} €)</small>
              </div>
              <div class="transparency-card">
                <span class="trans-label">Gasto Ejecutado y Justificado:</span>
                <span class="trans-val" style="color: var(--amurjo-cyan);">${eje.presupuestoReal2027.toLocaleString('es-ES')} €</span>
                <small style="color:var(--text-dim); font-size:0.68rem;">Tasa de ejecución: ${percentExecution}%</small>
              </div>
            </div>

            <div class="facturas-table-wrapper" style="margin-top: 14px;">
              <h5 style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px;">
                Desglose de Justificaciones Contables 2027
              </h5>
              <table class="facturas-table">
                <thead>
                  <tr>
                    <th>Ref. Factura</th>
                    <th>Concepto Justificado</th>
                    <th style="text-align: right;">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  ${eje.facturasJustificadas.map(f => `
                    <tr>
                      <td style="font-family: monospace; font-size: 0.75rem; color: var(--amurjo-cyan);">${f.ref}</td>
                      <td style="font-size: 0.8rem; color: var(--text-main);">${f.concepto}</td>
                      <td style="text-align: right; font-weight: 700; color: #34d399; font-size: 0.82rem;">${f.importe.toLocaleString('es-ES')} €</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- SUBPESTAÑA 4: OPINIÓN CIUDADANA Y PARTICIPACIÓN -->
        <div class="subtab-pane ${AppState.activeEjeSubtab === 'subtab-evaluacion' ? 'active' : ''}" id="subtab-evaluacion" style="${AppState.activeEjeSubtab === 'subtab-evaluacion' ? 'display:block' : 'display:none'}">
          <div style="margin-bottom: 16px;">
            <h4 style="font-family: var(--font-heading); font-size: 0.92rem; color: var(--text-main); margin-bottom: 4px;">
              8. Valoración Juvenil y Evaluación Abierta
            </h4>
            <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
              Las personas jóvenes de Orcera son parte activa del seguimiento. Deja tu valoración y propuestas para este eje estratégico:
            </p>
          </div>

          <!-- Formulario de Evaluación Rápida -->
          <div class="feedback-form-card">
            <h5 style="font-size: 0.82rem; color: var(--text-main); margin-bottom: 8px;">
              ¿Cómo valoras el desarrollo de este Eje en el municipio?
            </h5>
            <div class="star-rating-widget" id="eje-star-widget">
              ${[1, 2, 3, 4, 5].map(num => `
                <button type="button" class="star-btn active" data-rating="${num}">★</button>
              `).join("")}
            </div>

            <textarea id="feedback-text" class="feedback-textarea" placeholder="Escribe aquí tu opinión, sugerencia de actividad o necesidad detectada..."></textarea>

            <button type="button" id="submit-eje-eval" class="btn btn-primary" style="margin-top: 10px; width: 100%;">
              Enviar Valoración Pública (+30 Puntos Sierra)
            </button>
          </div>

          <!-- Muro de Comentarios de Jóvenes -->
          <div class="feedback-wall" style="margin-top: 20px;">
            <h5 style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 10px;">
              Opiniones recientes de jóvenes de Orcera:
            </h5>
            <div class="comments-list">
              ${eje.valoraciones.map(v => `
                <div class="comment-item">
                  <div class="comment-header">
                    <span class="comment-user">${v.usuario}</span>
                    <span class="comment-stars">${"★".repeat(v.estrellas)}${"☆".repeat(5 - v.estrellas)}</span>
                  </div>
                  <p class="comment-body">"${v.comentario}"</p>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Asignar listeners a las subpestañas
  container.querySelectorAll(".subtab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const subtab = btn.getAttribute("data-subtab");
      AppState.activeEjeSubtab = subtab;
      renderEjeDetail(eje.id);
    });
  });

  // Asignar listeners al selector de años de las acciones
  container.querySelectorAll(".action-year-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const yr = chip.getAttribute("data-action-year");
      AppState.selectedActionYear = yr;
      renderEjeDetail(eje.id);
    });
  });

  // Asignar listeners a los filtros de duración de las acciones
  container.querySelectorAll(".duracion-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const dur = btn.getAttribute("data-duracion");
      AppState.selectedActionDuration = dur;
      renderEjeDetail(eje.id);
    });
  });

  // Asignar listeners al filtro de indicadores por objetivo específico
  container.querySelectorAll(".ind-filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const indFilter = btn.getAttribute("data-ind-filter");
      AppState.selectedIndFilter = indFilter;
      renderEjeDetail(eje.id);
    });
  });

  // Listener para botón "Ver en Evaluación Oficial →" de cada acción
  container.querySelectorAll(".jump-to-eval-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const actionCode = btn.getAttribute("data-action-code");
      AppState.activeEjeSubtab = "subtab-indicadores";
      AppState.selectedIndFilter = "todas";
      renderEjeDetail(eje.id);

      setTimeout(() => {
        const targetCard = document.getElementById("eval-card-" + actionCode);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
          targetCard.style.outline = "2px solid var(--amurjo-cyan)";
          setTimeout(() => { targetCard.style.outline = ""; }, 2500);
        }
      }, 100);
    });
  });

  // Asignar listeners a los botones de selector de evaluación oficial
  container.querySelectorAll(".eval-btn-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const yr = parseInt(btn.getAttribute("data-eval-year"));
      AppState.selectedEvaluationYear = yr;
      renderEjeDetail(eje.id);
    });
  });

  // Asignar listeners a los botones de años del cronograma quinquenal
  container.querySelectorAll(".year-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const yr = parseInt(btn.getAttribute("data-year"));
      AppState.selectedCronogramaYear = yr;

      container.querySelectorAll(".year-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const calWrapper = container.querySelector("#cronograma-calendar-wrapper");
      if (calWrapper) {
        calWrapper.innerHTML = renderQuarterCalendar(eje, yr);
      }
    });
  });

  // Listener para el selector de estrellas
  let selectedStars = 5;
  const starBtns = container.querySelectorAll(".star-btn");
  starBtns.forEach(sb => {
    sb.addEventListener("click", () => {
      selectedStars = parseInt(sb.getAttribute("data-rating"));
      starBtns.forEach(b => {
        const r = parseInt(b.getAttribute("data-rating"));
        b.classList.toggle("active", r <= selectedStars);
      });
    });
  });

  // Listener para el envío de evaluación
  const submitEvalBtn = container.querySelector("#submit-eje-eval");
  if (submitEvalBtn) {
    submitEvalBtn.addEventListener("click", () => {
      const text = container.querySelector("#feedback-text").value.trim();
      if (!text) {
        alert("Por favor, escribe un breve comentario o sugerencia para enviar tu valoración.");
        return;
      }

      // Guardar valoración
      eje.valoraciones.unshift({
        usuario: "Sara J.",
        estrellas: selectedStars,
        comentario: text
      });

      rewardPoints(30, `¡Valoración registrada en Eje ${eje.numero}!`);
      renderEjeDetail(eje.id);
      updateGlobalBentoKPIs();
    });
  }
}

"""

    code = code[:render_start] + new_render + code[render_end:]
    print("Replaced renderEjeDetail successfully!")

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(code)

    print("Successfully patched js/app.js!")

if __name__ == '__main__':
    main()
