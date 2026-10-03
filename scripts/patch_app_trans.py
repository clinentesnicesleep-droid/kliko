import re
import sys

def main():
    if sys.stdout.encoding.lower() != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')

    with open('js/app.js', 'r', encoding='utf-8') as f:
        code = f.read()

    # Find renderEjeDetail and replace the subtab-transparencia block
    # Start: <div class="subtab-pane ${AppState.activeEjeSubtab === 'subtab-transparencia'
    # End: <div class="subtab-pane ${AppState.activeEjeSubtab === 'subtab-evaluacion'
    start_marker = '<div class="subtab-pane ${AppState.activeEjeSubtab === \'subtab-transparencia\''
    end_marker = '<!-- SUBPESTAÑA 4: OPINIÓN CIUDADANA Y PARTICIPACIÓN -->'
    if end_marker not in code:
        end_marker = '<!-- SUBPESTA'

    pos_start = code.find(start_marker)
    pos_end = code.find(end_marker, pos_start)

    if pos_start == -1 or pos_end == -1:
        print(f"Error finding subtab-transparencia: start={pos_start}, end={pos_end}")
        return

    new_subtab_content = """<div class="subtab-pane ${AppState.activeEjeSubtab === 'subtab-transparencia' ? 'active' : ''}" id="subtab-transparencia" style="${AppState.activeEjeSubtab === 'subtab-transparencia' ? 'display:block' : 'display:none'}">

          <!-- 6. GESTIÓN ECONÓMICA ANUALIZADA, INGRESOS Y GASTOS (SECCIÓN 14 DEL PLAN) -->
          <div style="margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="ind-code-tag">Sección 14 del Plan</span>
              <span class="action-vigencia-tag">Presupuesto y Financiación Anualizada</span>
            </div>
            <h4 style="font-family: var(--font-heading); font-size: 1.02rem; color: var(--text-main); margin: 0 0 4px;">
              6. Gestión Económica Anual: Ingresos, Gastos por Proyecto y Justificación Contable
            </h4>
            <p style="font-size: 0.76rem; color: var(--text-muted); margin: 0; line-height: 1.4;">
              Conforme a la planificación presupuestaria del Plan (75.000 € quinquenales a razón de 15.000 €/año), a continuación se desglosan las <strong>acciones desarrolladas en cada anualidad</strong>, la <strong>previsión de ingresos</strong>, el <strong>total de gastos ejecutados en cada proyecto</strong> y su debida <strong>justificación documental mediante factura o nómina</strong>:
            </p>
          </div>

          <!-- SELECTOR DE ANUALIDAD INTERACTIVO -->
          <div class="cronograma-year-selector" style="margin-bottom: 18px;">
            ${[2027, 2028, 2029, 2030, 2031].map(ano => `
              <button type="button" class="year-pill ${selFinYear === ano ? 'active' : ''}" data-year="${ano}">
                ${ano} ${ano === 2027 ? '(Arranque)' : (ano === 2028 ? '(Consolidación)' : (ano === 2029 ? '(Expansión)' : (ano === 2030 ? '(Madurez)' : '(Cierre)')))}
              </button>
            `).join("")}
          </div>

          <!-- PANEL DE KPIS DE LA ANUALIDAD SELECCIONADA -->
          <div class="finanzas-kpis-grid">
            <!-- KPI 1: Ingresos Previstos -->
            <div class="finanza-kpi-card">
              <span class="finanza-kpi-label">💰 Previsión Ingresos (${selFinYear})</span>
              <span class="finanza-kpi-val" style="color: #38bdf8;">${finAno.ingresosPrevistosTotal.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</span>
              <div class="fuentes-mini-list">
                <div class="fuentes-mini-item"><span>🏛️ Ayto. Orcera (60%):</span> <strong>${finAno.fuentesIngreso.recursosPropios.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</strong></div>
                <div class="fuentes-mini-item"><span>🏛️ Diputación Jaén (20%):</span> <strong>${finAno.fuentesIngreso.diputacionJaen.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</strong></div>
                <div class="fuentes-mini-item"><span>🏛️ Junta / IAJ (15%):</span> <strong>${finAno.fuentesIngreso.juntaAndaluciaIAJ.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</strong></div>
                <div class="fuentes-mini-item"><span>🇪🇺 Otras / Fondos (5%):</span> <strong>${finAno.fuentesIngreso.otrasAyudas.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</strong></div>
              </div>
            </div>

            <!-- KPI 2: Gastos Ejecutados -->
            <div class="finanza-kpi-card">
              <span class="finanza-kpi-label">📉 Gastos Ejecutados (${selFinYear})</span>
              <span class="finanza-kpi-val" style="color: #34d399;">${finAno.gastosEjecutadosTotal.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</span>
              <div class="fuentes-mini-list">
                <div class="fuentes-mini-item"><span>Tasa de Ejecución:</span> <strong style="color: #34d399;">${finAno.porcentajeEjecucion}%</strong></div>
                <div class="fuentes-mini-item"><span>Saldo Remanente:</span> <strong>${finAno.saldoRemanente.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</strong></div>
                <div class="fuentes-mini-item"><span>Acciones Desarrolladas:</span> <strong>${finAno.totalAccionesActivas} proyectos</strong></div>
                <div class="fuentes-mini-item"><span>Intervención Contable:</span> <strong style="color: #22d3ee;">Fiscalizado Favorable</strong></div>
              </div>
            </div>

            <!-- KPI 3: Justificantes Contables Auditados -->
            <div class="finanza-kpi-card">
              <span class="finanza-kpi-label">📑 Justificación Contable (${selFinYear})</span>
              <span class="finanza-kpi-val" style="color: var(--amurjo-cyan);">${finAno.justificantes.length} <small style="font-size: 0.8rem; font-weight: normal; color: var(--text-dim);">justificantes</small></span>
              <div class="fuentes-mini-list">
                <div class="fuentes-mini-item"><span>📄 Facturas comerciales:</span> <strong>${finAno.totalFacturas} facturas</strong></div>
                <div class="fuentes-mini-item"><span>💼 Nóminas de personal:</span> <strong>${finAno.totalNominas} nóminas</strong></div>
                <div class="fuentes-mini-item"><span>Control de Intervención:</span> <strong style="color: #34d399;">100% Auditado</strong></div>
                <div class="fuentes-mini-item"><span>Destino de gasto:</span> <strong>Políticas de Juventud</strong></div>
              </div>
            </div>
          </div>

          <!-- DESGLOSE PROYECTO POR PROYECTO: ACCIONES DESARROLLADAS EN LA ANUALIDAD -->
          <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
              <div>
                <h4 style="font-family: var(--font-heading); font-size: 0.95rem; color: var(--text-main); margin: 0;">
                  Proyectos y Acciones Desarrolladas en el Ejercicio ${selFinYear} (${finAno.accionesDesarrolladas.length} medidas activas)
                </h4>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin: 2px 0 0;">
                  Previsión de ingresos asignada, gasto ejecutado y justificantes contables (facturas y nóminas) de cada proyecto:
                </p>
              </div>
              <span class="action-vigencia-tag">Anualidad ${selFinYear}</span>
            </div>

            <div class="proyectos-finanzas-stack">
              ${finAno.accionesDesarrolladas.map(p => `
                <div class="proyecto-finanza-card">
                  <div class="proyecto-finanza-header">
                    <div>
                      <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        <span class="action-code-tag">${p.codigo}</span>
                        <span class="badge-duracion dur-5_anos">⏱️ ${p.duracion}</span>
                        <span class="badge-ind-link">🏛️ ${p.responsable}</span>
                      </div>
                      <h5 class="proyecto-finanza-title">${p.titulo}</h5>
                    </div>
                    <span class="action-status-badge status-en_curso">${p.porcentajeEjecucion}% Ejecutado</span>
                  </div>

                  <div class="proyecto-finanza-metrics">
                    <div class="pf-metric-item">
                      <span class="pf-metric-lbl">Previsión Ingresos:</span>
                      <span class="pf-metric-val" style="color: #38bdf8;">${p.previsionIngresos.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</span>
                    </div>
                    <div class="pf-metric-item">
                      <span class="pf-metric-lbl">Gasto Ejecutado:</span>
                      <span class="pf-metric-val" style="color: #34d399;">${p.gastoEjecutado.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</span>
                    </div>
                    <div class="pf-metric-item">
                      <span class="pf-metric-lbl">Saldo Remanente:</span>
                      <span class="pf-metric-val" style="color: ${p.saldo >= 0 ? '#38bdf8' : '#f87171'};">${p.saldo.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</span>
                    </div>
                    <div class="pf-metric-item">
                      <span class="pf-metric-lbl">Justificantes:</span>
                      <span class="pf-metric-val" style="color: var(--amurjo-cyan);">${p.justificantes.length} comprobantes</span>
                    </div>
                  </div>

                  <!-- Justificantes con Factura o Nómina de este proyecto -->
                  <div class="proyecto-justificantes-wrap">
                    <span class="proyecto-just-caption">
                      <span>🧾 Justificación del Gasto con Factura o Nómina (${p.justificantes.length} documentos):</span>
                    </span>
                    <div class="justificantes-mini-grid">
                      ${p.justificantes.map(j => `
                        <div class="justificante-item-box">
                          <div class="just-item-top">
                            <span class="badge-tipo-doc badge-tipo-${j.tipo}">
                              ${j.tipo === 'factura' ? '📄 Factura' : '💼 Nómina'}
                            </span>
                            <span style="font-family: monospace; font-size: 0.72rem; color: var(--amurjo-cyan); font-weight: 700;">${j.ref}</span>
                          </div>
                          <p class="just-item-concept">
                            <strong>${j.proveedorBeneficiario}</strong> (${j.cifNif}): ${j.concepto}
                          </p>
                          <div class="just-item-bottom">
                            <span style="font-size: 0.68rem; color: var(--text-dim);">${j.fecha}</span>
                            <span style="font-size: 0.85rem; font-weight: 800; color: #34d399;">${j.importe.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</span>
                            <button type="button" class="btn-ver-comprobante open-justificante-btn" data-just-id="${j.id}">
                              Ver Volante 🔍
                            </button>
                          </div>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- 7. DETERMINACIÓN DE INGRESOS Y GASTOS DEL EJE POR ANUALIDADES (2027–2031) -->
          <div style="border-top: 1px solid var(--segura-border); padding-top: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
              <div>
                <h4 style="font-family: var(--font-heading); font-size: 0.95rem; color: var(--text-main); margin: 0;">
                  7. Determinación de Ingresos y Gastos del Eje por Anualidades (2027–2031)
                </h4>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin: 2px 0 0;">
                  Consignación presupuestaria quinquenal y balance anual de ingresos y gastos del Eje ${eje.numero}:
                </p>
              </div>
              <span class="action-vigencia-tag">Horizonte Quinquenal</span>
            </div>

            <div class="tabla-multianual-container">
              <table class="multianual-table">
                <thead>
                  <tr>
                    <th>Ejercicio</th>
                    <th>Acciones Activas</th>
                    <th>Previsión Ingresos</th>
                    <th>Gastos Ejecutados</th>
                    <th>Saldo Remanente</th>
                    <th>Facturas</th>
                    <th>Nóminas</th>
                    <th>% Ejecución</th>
                  </tr>
                </thead>
                <tbody>
                  ${(eje.resumenQuinquenalFinanzas || []).map(r => `
                    <tr class="${selFinYear === r.ano ? 'active-row' : ''}">
                      <td><strong>${r.ano}</strong> ${selFinYear === r.ano ? '📍 (Activo)' : ''}</td>
                      <td>${r.acciones} proyectos</td>
                      <td style="color: #38bdf8; font-weight: 700;">${r.ingresos.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</td>
                      <td style="color: #34d399; font-weight: 700;">${r.gastos.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</td>
                      <td style="color: ${r.saldo >= 0 ? '#38bdf8' : '#f87171'};">${r.saldo.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</td>
                      <td>${r.facturas} 📄</td>
                      <td>${r.nominas} 💼</td>
                      <td><span class="action-status-badge status-en_curso">${r.porcentaje}%</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- 8. CALENDARIO OPERATIVO TRIMESTRAL DEL AÑO SELECCIONADO -->
          <div style="border-top: 1px solid var(--segura-border); padding-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
              <div>
                <h4 style="font-family: var(--font-heading); font-size: 0.95rem; color: var(--text-main); margin: 0;">
                  8. Calendario Operativo Anual ${selFinYear} (Trimestre a Trimestre)
                </h4>
                <p style="font-size: 0.74rem; color: var(--text-muted); margin: 2px 0 0;">
                  Hitos operativos vinculados a las partidas económicas del ejercicio ${selFinYear}:
                </p>
              </div>
              <span class="action-vigencia-tag">Sección 15 del Plan</span>
            </div>

            <div id="cronograma-calendar-wrapper">
              ${renderQuarterCalendar(eje, selFinYear)}
            </div>
          </div>
        </div>

        """

    code = code[:pos_start] + new_subtab_content + code[pos_end:]
    print("Replaced subtab-transparencia content successfully!")

    # Now make sure renderEjeDetail sets selFinYear and finAno at the beginning:
    # Look for: const percentExecution = ((eje.presupuestoReal2027 / eje.presupuestoAnual) * 100).toFixed(1);
    code = code.replace(
        "const percentExecution = ((eje.presupuestoReal2027 / eje.presupuestoAnual) * 100).toFixed(1);",
        """const selFinYear = AppState.selectedCronogramaYear || 2027;
  const finAno = eje.finanzasPorAno ? (eje.finanzasPorAno[selFinYear] || eje.finanzasPorAno['2027'] || eje.finanzasPorAno[2027]) : {
    ano: selFinYear,
    ingresosPrevistosTotal: eje.presupuestoAnual,
    fuentesIngreso: { recursosPropios: eje.presupuestoAnual * 0.6, diputacionJaen: eje.presupuestoAnual * 0.2, juntaAndaluciaIAJ: eje.presupuestoAnual * 0.15, otrasAyudas: eje.presupuestoAnual * 0.05 },
    gastosEjecutadosTotal: eje.presupuestoReal2027,
    saldoRemanente: eje.presupuestoAnual - eje.presupuestoReal2027,
    porcentajeEjecucion: ((eje.presupuestoReal2027 / eje.presupuestoAnual) * 100).toFixed(1),
    accionesDesarrolladas: [],
    totalAccionesActivas: 0,
    justificantes: [],
    totalFacturas: 0,
    totalNominas: 0
  };
  const percentExecution = finAno ? finAno.porcentajeEjecucion : ((eje.presupuestoReal2027 / eje.presupuestoAnual) * 100).toFixed(1);"""
    )

    # In subtab navigation, update the badge:
    code = code.replace(
        '<span class="subtab-badge">${percentExecution}%</span>',
        '<span class="subtab-badge">${percentExecution}% Ejecutado</span>'
    )

    # Update event listeners in renderEjeDetail:
    # 1. Update year-pill listener so it re-renders the whole tab:
    old_year_pill_listener = """  container.querySelectorAll(".year-pill").forEach(btn => {
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
  });"""

    new_year_pill_listener = """  container.querySelectorAll(".year-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const yr = parseInt(btn.getAttribute("data-year"));
      AppState.selectedCronogramaYear = yr;
      renderEjeDetail(eje.id);
    });
  });

  // Listeners para abrir el Volante de Justificante Contable (Factura o Nómina)
  container.querySelectorAll(".open-justificante-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const justId = btn.getAttribute("data-just-id");
      let foundJust = null;
      if (eje.finanzasPorAno) {
        for (const y in eje.finanzasPorAno) {
          const match = (eje.finanzasPorAno[y].justificantes || []).find(j => j.id === justId);
          if (match) { foundJust = match; break; }
        }
      }
      if (foundJust) {
        openJustificanteModal(foundJust, eje, selFinYear);
      }
    });
  });"""

    if old_year_pill_listener in code:
        code = code.replace(old_year_pill_listener, new_year_pill_listener)
        print("Updated year-pill listener and added open-justificante-btn listener!")
    else:
        # Replace the container.querySelectorAll(".year-pill") block
        code = re.sub(
            r'container\.querySelectorAll\("\.year-pill"\)\.forEach\(btn => \{[\s\S]*?calWrapper\.innerHTML = renderQuarterCalendar\(eje, yr\);\s*\}\s*\}\);\s*\}\);',
            new_year_pill_listener,
            code
        )
        print("Regex replaced year-pill listener!")

    # Add openJustificanteModal function and setupJustificanteModal if not present
    if 'function openJustificanteModal' not in code:
        modal_js = """
// ==============================================================================
// GESTIÓN DEL MODAL DE VOLANTE DE JUSTIFICANTE CONTABLE (FACTURA O NÓMINA)
// ==============================================================================
function openJustificanteModal(just, eje, ano) {
  const modal = document.getElementById("justificante-modal");
  const content = document.getElementById("justificante-modal-content");
  if (!modal || !content) return;

  const isFactura = just.tipo === "factura";

  content.innerHTML = `
    <div style="margin-bottom: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
        <span class="badge-tipo-doc badge-tipo-${just.tipo}" style="font-size:0.75rem;">
          ${isFactura ? '📄 FACTURA COMERCIAL' : '💼 NÓMINA DE PERSONAL'}
        </span>
        <strong style="font-family: monospace; font-size: 0.85rem; color: #0284c7;">REF: ${just.ref}</strong>
      </div>
      <div style="font-size: 0.72rem; color: #475569;">
        <strong>Expediente Contable:</strong> ${just.numExpediente} · <strong>Ejercicio:</strong> ${ano}
      </div>
    </div>

    <div class="volante-body-row">
      <strong>Beneficiario / Emisor:</strong>
      <span>${just.proveedorBeneficiario}</span>
    </div>
    <div class="volante-body-row">
      <strong>NIF / CIF:</strong>
      <span style="font-family: monospace;">${just.cifNif}</span>
    </div>
    <div class="volante-body-row">
      <strong>Acción Imputada:</strong>
      <span>${just.accionCodigo} - Eje ${eje.numero}</span>
    </div>
    <div class="volante-body-row">
      <strong>Proyecto del Plan:</strong>
      <span>${just.accionTitulo}</span>
    </div>
    <div class="volante-body-row">
      <strong>Partida Presupuestaria:</strong>
      <span style="font-family: monospace; font-size:0.7rem;">${just.partidaPresupuestaria}</span>
    </div>
    <div class="volante-body-row">
      <strong>Fecha de Devengo y Pago:</strong>
      <span>${just.fecha}</span>
    </div>

    <div style="margin-top: 10px; padding: 8px 10px; background: #f1f5f9; border-radius: 6px; font-size: 0.74rem;">
      <strong style="color: #0f172a; display:block; margin-bottom: 2px;">Concepto Detallado del Gasto:</strong>
      <span style="color: #334155; line-height: 1.35;">${just.concepto}</span>
    </div>

    <div class="volante-total-box">
      <div>
        <span style="font-size: 0.7rem; color: #64748b; display: block; text-transform: uppercase;">Importe Total Liquidado:</span>
        <small style="font-size: 0.68rem; color: #059669; font-weight: 700;">${just.estado}</small>
      </div>
      <span class="volante-total-amount">${just.importe.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</span>
    </div>

    <div class="volante-footer-diligencia">
      <strong>DILIGENCIA DE INTERVENCIÓN:</strong> El presente gasto ha sido debidamente fiscalizado, comprobado contra la consignación presupuestaria del Eje ${eje.numero} del III Plan Municipal de Juventud de Orcera 2027–2031, constando el correspondiente ${isFactura ? 'albarán de recepción de material o prestación de servicio' : 'boletín de cotización a la Seguridad Social y registro horario'}.
    </div>
  `;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function setupJustificanteModal() {
  const modal = document.getElementById("justificante-modal");
  const closeBtn1 = document.getElementById("close-justificante-modal");
  const closeBtn2 = document.getElementById("btn-close-justificante");
  const printBtn = document.getElementById("btn-print-justificante");

  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  };

  if (closeBtn1) closeBtn1.addEventListener("click", closeModal);
  if (closeBtn2) closeBtn2.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}
"""
        code += "\n" + modal_js
        print("Appended modal JS functions!")

    # Make sure setupJustificanteModal is called on DOMContentLoaded
    if 'setupJustificanteModal();' not in code:
        code = code.replace(
            'setupQRModal();',
            'setupQRModal();\n  setupJustificanteModal();'
        )
        print("Added setupJustificanteModal call!")

    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(code)

    print("Updated js/app.js successfully!")

if __name__ == '__main__':
    main()
