# -*- coding: utf-8 -*-
"""
Script para incorporar el Manual Operativo del Técnico de Juventud
en el Panel de Gestión Municipal de KLIKO (visible únicamente para técnicos y superadmin).
"""
import re

APP_JS = r"c:\Users\RAMON\Desktop\KLIKO\js\app.js"

with open(APP_JS, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Conectar botón de cabecera 'btn-admin-open-manual'
target_topbar = 'if (btnSwitchRole) {'
replacement_topbar = '''  const btnOpenManual = document.getElementById("btn-admin-open-manual");
  if (btnOpenManual) {
    btnOpenManual.addEventListener("click", () => {
      switchAdminPane("pane-manual-tecnico");
    });
  }

  if (btnSwitchRole) {'''

if "btn-admin-open-manual" not in content:
    content = content.replace(target_topbar, replacement_topbar, 1)

# 2. Agregar caso en switch de renderAdminPane
target_switch = 'case "pane-evaluacion-previa":\n      renderPaneEvaluacionPrevia(container);\n      break;'
replacement_switch = '''case "pane-evaluacion-previa":
      renderPaneEvaluacionPrevia(container);
      break;
    case "pane-manual-tecnico":
      renderPaneManualTecnico(container);
      break;'''

if 'case "pane-manual-tecnico":' not in content:
    content = content.replace(target_switch, replacement_switch, 1)

# 3. Función renderPaneManualTecnico
manual_func = r'''
// ------------------------------------------------------------------------------
// PANE 9: MANUAL OPERATIVO DEL TÉCNICO DE JUVENTUD (TÉCNICO + SUPERADMIN)
// ------------------------------------------------------------------------------
const STORAGE_KEY_TECNICO_CHECKLIST = "orcera_tecnico_checklist_v1";

function getTecnicoChecklistState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TECNICO_CHECKLIST);
    if (raw) return JSON.parse(raw);
  } catch(e){}
  return {};
}

function saveTecnicoChecklistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY_TECNICO_CHECKLIST, JSON.stringify(state));
  } catch(e){}
}

function renderPaneManualTecnico(container) {
  const staff = AdminState.activeStaff;
  const isSuperadmin = staff && staff.rol === "admin";
  const checklistState = getTecnicoChecklistState();

  container.innerHTML = `
    <div class="admin-pane-card" id="pane-manual-tecnico-root">
      
      <!-- CABECERA DEL MANUAL -->
      <div class="admin-pane-header" style="border-bottom: 1px solid var(--segura-border); padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span class="badge-tag-civic" style="background:rgba(6,182,212,0.15); color:var(--amurjo-cyan); border-color:rgba(6,182,212,0.3);">
              🔒 Documento Interno · Ayuntamiento de Orcera
            </span>
            <span style="font-size:0.7rem; color:var(--text-muted); background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:999px;">
              Edición Oficial 2027–2031
            </span>
          </div>
          <h2 style="margin:2px 0 0; font-family:var(--font-heading); font-size:1.35rem; color:var(--text-main); display:flex; align-items:center; gap:10px;">
            <span>📖</span> Manual Operativo: Responsables Técnicos de Juventud
          </h2>
          <p style="font-size:0.78rem; color:var(--text-muted); margin:4px 0 0; max-width:850px; line-height:1.45;">
            Guía de procedimientos, protocolos y operativas paso a paso para la gestión técnica del <strong>III Plan Municipal de Juventud de Orcera</strong> en la plataforma KLIKO.
          </p>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <button type="button" class="btn-primary" id="btn-print-manual-tecnico" style="padding:8px 14px; font-size:0.76rem; font-weight:700;">
            🖨️ Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      <!-- BUSCADOR INTERACTIVO Y BARRA DE PERFIL ACTIVO -->
      <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:12px 16px; margin-bottom:20px; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg, var(--pine-green), var(--amurjo-cyan)); display:flex; align-items:center; justify-content:center; font-size:1.05rem;">
            ${isSuperadmin ? '👑' : '🛠️'}
          </div>
          <div>
            <span style="font-size:0.78rem; font-weight:700; color:var(--text-main); display:block;">
              Usuario Actual: ${staff ? staff.nombre : 'Técnico Autorizado'}
            </span>
            <small style="font-size:0.69rem; color:var(--amurjo-cyan);">
              Rol: ${isSuperadmin ? 'Superadministrador (Privilegios Totales)' : 'Técnico de Juventud (Gestión Operativa sin Borrado)'}
            </small>
          </div>
        </div>

        <div style="flex:1; max-width:380px; min-width:240px;">
          <input type="text" id="manual-search-box" placeholder="🔍 Buscar en el manual (ej: factura, estado, buzón, story, censo)..." 
            style="width:100%; box-sizing:border-box; background:rgba(0,0,0,0.3); border:1px solid var(--segura-border); border-radius:var(--radius-sm); padding:7px 12px; color:var(--text-main); font-size:0.75rem;">
        </div>
      </div>

      <!-- MATRIZ DE COMPETENCIAS Y PERMISOS: TÉCNICO vs SUPERADMINISTRADOR -->
      <section class="manual-section-card" data-manual-keywords="permisos limites competencias superadmin borrado alberto ramon" style="background:linear-gradient(135deg, rgba(6,78,59,0.35), rgba(22,33,54,0.7)); border:1px solid rgba(6,182,212,0.3); border-radius:var(--radius-md); padding:16px; margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
          <span style="font-size:1.3rem;">⚖️</span>
          <div>
            <h3 style="margin:0; font-size:0.96rem; color:var(--text-main);">1. Marco de Competencias y Límites Operativos</h3>
            <small style="color:var(--amurjo-cyan); font-size:0.7rem;">Seguridad jurídica y segregación de funciones en el Ayuntamiento de Orcera</small>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(290px, 1fr)); gap:14px;">
          <!-- COLUMNA TÉCNICO -->
          <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(16,185,129,0.35); border-radius:var(--radius-sm); padding:12px;">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
              <span style="color:#10b981; font-weight:800;">✔</span>
              <strong style="color:#34d399; font-size:0.82rem;">LO QUE SÍ GESTIONA EL TÉCNICO (Día a Día)</strong>
            </div>
            <ul style="margin:0; padding-left:18px; font-size:0.73rem; color:var(--text-main); line-height:1.55;">
              <li><strong>Actualización de Estados:</strong> Pasar acciones de <em>No iniciada</em> a <em>En curso</em> o <em>Finalizada</em> según la marcha real de los proyectos.</li>
              <li><strong>Imputación de Gastos:</strong> Registrar justificantes y facturas con CIF/Proveedor e importe en cada acción del Plan.</li>
              <li><strong>Buzón y Pleno Joven:</strong> Admitir a trámite o emitir dictamen técnico motivado sobre iniciativas juveniles.</li>
              <li><strong>Consultas Exprés:</strong> Lanzar y cerrar Stories interactivas con votación comunitaria en la pantalla de inicio.</li>
              <li><strong>Censo Asociación (AJO):</strong> Validar solicitudes de alta de nuevos socios y emisión del Carnet Joven de Orcera.</li>
            </ul>
          </div>

          <!-- COLUMNA SUPERADMIN -->
          <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(245,158,11,0.35); border-radius:var(--radius-sm); padding:12px;">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
              <span style="color:#fbbf24; font-weight:800;">👑</span>
              <strong style="color:#fbbf24; font-size:0.82rem;">RESERVADO A RAMÓN MUÑOZ (Superadministrador)</strong>
            </div>
            <ul style="margin:0; padding-left:18px; font-size:0.73rem; color:var(--text-muted); line-height:1.55;">
              <li><strong>Eliminación Estructural:</strong> Borrar acciones maestras o ejes del Plan (bloqueado para técnicos para evitar pérdidas accidentales).</li>
              <li><strong>Modificación de Techos Presupuestarios:</strong> Alterar las partidas anuales de 100.000 €/año o suplementos de crédito.</li>
              <li><strong>Nombramiento y Revocación de Personal:</strong> Asignar o dar de baja a nuevos técnicos municipales y definir sus PINs.</li>
              <li><strong>Copias de Seguridad Maestras:</strong> Descarga y restauración de backups globales del sistema.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- CHECKLIST DIARIO INTERACTIVO -->
      <section class="manual-section-card" data-manual-keywords="checklist rutina tareas diario semanal control alberto" style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px; margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:1.3rem;">📋</span>
            <div>
              <h3 style="margin:0; font-size:0.96rem; color:var(--text-main);">2. Checklist de Rutina Operativa Diaria y Semanal</h3>
              <small style="color:var(--amurjo-cyan); font-size:0.7rem;">Haz clic en cada tarea conforme la completes (se guarda en tu navegador)</small>
            </div>
          </div>
          <button type="button" class="btn-tool" id="btn-reset-checklist-tecnico" style="font-size:0.68rem; padding:4px 8px;">
            🔄 Reiniciar Checklist
          </button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:10px;" id="tecnico-checklist-container">
          <label class="manual-check-item" style="display:flex; align-items:flex-start; gap:10px; background:rgba(0,0,0,0.2); border:1px solid var(--segura-border); padding:10px; border-radius:var(--radius-sm); cursor:pointer;">
            <input type="checkbox" data-check-id="chk-buzon" ${checklistState['chk-buzon'] ? 'checked' : ''} style="margin-top:3px; accent-color:var(--amurjo-cyan);">
            <div style="font-size:0.74rem;">
              <strong style="color:var(--text-main); display:block;">1. Revisar Buzón Joven</strong>
              <span style="color:var(--text-muted);">Comprobar si hay nuevas propuestas ciudadanas y responder las pendientes.</span>
            </div>
          </label>

          <label class="manual-check-item" style="display:flex; align-items:flex-start; gap:10px; background:rgba(0,0,0,0.2); border:1px solid var(--segura-border); padding:10px; border-radius:var(--radius-sm); cursor:pointer;">
            <input type="checkbox" data-check-id="chk-acciones" ${checklistState['chk-acciones'] ? 'checked' : ''} style="margin-top:3px; accent-color:var(--amurjo-cyan);">
            <div style="font-size:0.74rem;">
              <strong style="color:var(--text-main); display:block;">2. Actualizar Estados de Acciones</strong>
              <span style="color:var(--text-muted);">Marcar el avance de los talleres o contrataciones que hayan comenzado o concluido.</span>
            </div>
          </label>

          <label class="manual-check-item" style="display:flex; align-items:flex-start; gap:10px; background:rgba(0,0,0,0.2); border:1px solid var(--segura-border); padding:10px; border-radius:var(--radius-sm); cursor:pointer;">
            <input type="checkbox" data-check-id="chk-facturas" ${checklistState['chk-facturas'] ? 'checked' : ''} style="margin-top:3px; accent-color:var(--amurjo-cyan);">
            <div style="font-size:0.74rem;">
              <strong style="color:var(--text-main); display:block;">3. Imputar Facturas del Día</strong>
              <span style="color:var(--text-muted);">Registrar facturas de proveedores contra la acción presupuestaria correspondiente.</span>
            </div>
          </label>

          <label class="manual-check-item" style="display:flex; align-items:flex-start; gap:10px; background:rgba(0,0,0,0.2); border:1px solid var(--segura-border); padding:10px; border-radius:var(--radius-sm); cursor:pointer;">
            <input type="checkbox" data-check-id="chk-censo" ${checklistState['chk-censo'] ? 'checked' : ''} style="margin-top:3px; accent-color:var(--amurjo-cyan);">
            <div style="font-size:0.74rem;">
              <strong style="color:var(--text-main); display:block;">4. Validar Nuevos Socios AJO</strong>
              <span style="color:var(--text-muted);">Confirmar solicitudes de adhesión a la Asociación Juvenil de Orcera.</span>
            </div>
          </label>

          <label class="manual-check-item" style="display:flex; align-items:flex-start; gap:10px; background:rgba(0,0,0,0.2); border:1px solid var(--segura-border); padding:10px; border-radius:var(--radius-sm); cursor:pointer;">
            <input type="checkbox" data-check-id="chk-stories" ${checklistState['chk-stories'] ? 'checked' : ''} style="margin-top:3px; accent-color:var(--amurjo-cyan);">
            <div style="font-size:0.74rem;">
              <strong style="color:var(--text-main); display:block;">5. Dinamizar Consultas Exprés</strong>
              <span style="color:var(--text-muted);">Lanzar micro-encuestas sobre actividades del fin de semana o talleres.</span>
            </div>
          </label>

          <label class="manual-check-item" style="display:flex; align-items:flex-start; gap:10px; background:rgba(0,0,0,0.2); border:1px solid var(--segura-border); padding:10px; border-radius:var(--radius-sm); cursor:pointer;">
            <input type="checkbox" data-check-id="chk-carteleria" ${checklistState['chk-carteleria'] ? 'checked' : ''} style="margin-top:3px; accent-color:var(--amurjo-cyan);">
            <div style="font-size:0.74rem;">
              <strong style="color:var(--text-main); display:block;">6. Difusión en el IES y Centros</strong>
              <span style="color:var(--text-muted);">Revisar carteles con QR en IES Gandgía, Guadalinfo y Espacio Joven.</span>
            </div>
          </label>
        </div>
      </section>

      <!-- GUÍA DETALLADA PASO A PASO POR MÓDULOS DEL PANEL -->
      <div style="margin-bottom:20px;">
        <h3 style="margin:0 0 14px; font-size:1.05rem; color:var(--text-main); display:flex; align-items:center; gap:8px;">
          <span>🛠️</span> 3. Guía Detallada Paso a Paso por Módulo Operativo
        </h3>

        <!-- PASO 1: ACCIONES Y ESTADOS -->
        <article class="manual-section-card" data-manual-keywords="acciones estados modulo 1 plan cronograma en curso finalizada no iniciada variantes pleno" style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="badge-tag-civic" style="background:rgba(16,185,129,0.15); color:#10b981;">MÓDULO 1</span>
              <strong style="font-size:0.92rem; color:var(--text-main);">Gestión de Acciones y Estados de Ejecución (Ejes 1–7)</strong>
            </div>
            <button type="button" class="btn-tool" onclick="switchAdminPane('pane-acciones')" style="font-size:0.72rem; padding:4px 10px; color:var(--amurjo-cyan);">
              Ir a Módulo 1 ➔
            </button>
          </div>
          
          <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.55;">
            <p style="margin-bottom:8px;">
              El III Plan Municipal se divide en <strong>7 Ejes estratégicos</strong> (Juventud Activa, Emancipación, Cultura, Amurjo Verde, Convivencia, Formación y Gobernanza). Como técnico, debes mantener al día el estado de cada medida para que la juventud y la corporación municipal vean el avance en tiempo real:
            </p>
            <div style="background:rgba(0,0,0,0.25); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:10px;">
              <strong style="color:var(--amurjo-cyan); display:block; margin-bottom:4px;">Los 4 Estados Oficiales y Cuándo Aplicarlos:</strong>
              <ul style="margin:0; padding-left:18px;">
                <li><strong style="color:#94a3b8;">⏳ No Iniciada:</strong> La acción está programada en el cronograma pero aún no se han iniciado contrataciones, compras ni talleres.</li>
                <li><strong style="color:#06b6d4;">🚀 En Curso:</strong> La acción está adjudicada, con expediente abierto, taller convocado o actividad en marcha.</li>
                <li><strong style="color:#10b981;">✅ Finalizada:</strong> El taller concluyó o el equipamiento está entregado y justificado técnicamente.</li>
                <li><strong style="color:#fbbf24;">🔍 En Revisión:</strong> Se está evaluando la satisfacción de los asistentes o elaborando la memoria técnica para el Pleno.</li>
              </ul>
            </div>
            <p style="margin:0;">
              <strong>Cómo cambiar el estado:</strong> En la tabla de acciones, usa el menú desplegable en la columna <em>Estado</em> de cada fila. Se guarda automáticamente al instante. Para editar la redacción, plazos o variantes aprobadas en Pleno, pulsa en el botón <strong>✏️ Modificar</strong>.
            </p>
          </div>
        </article>

        <!-- PASO 2: FINANZAS Y FACTURAS -->
        <article class="manual-section-card" data-manual-keywords="finanzas facturas modulo 2 presupuesto justificacion proveedor gasto partida cif" style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="badge-tag-civic" style="background:rgba(6,182,212,0.15); color:var(--amurjo-cyan);">MÓDULO 2</span>
              <strong style="font-size:0.92rem; color:var(--text-main);">Finanzas y Justificación de Facturas por Acción</strong>
            </div>
            <button type="button" class="btn-tool" onclick="switchAdminPane('pane-finanzas')" style="font-size:0.72rem; padding:4px 10px; color:var(--amurjo-cyan);">
              Ir a Módulo 2 ➔
            </button>
          </div>
          
          <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.55;">
            <p style="margin-bottom:8px;">
              Cada euro invertido en los jóvenes de Orcera debe tener su justificante contable. El plan cuenta con <strong>100.000 € anuales</strong> distribuidos entre los 7 ejes:
            </p>
            <ol style="margin:0 0 10px; padding-left:18px;">
              <li>Ve al <strong>Módulo 2 (Finanzas y Facturas)</strong>.</li>
              <li>En el panel superior, haz clic en el botón <strong>➕ Registrar Factura / Justificante</strong>.</li>
              <li>Selecciona la <strong>Acción del Plan</strong> a la que se imputa el gasto (ej: <em>E1-A1 Bono Bus Universitario</em> o <em>E4-A2 Noches de Verano en Amurjo</em>).</li>
              <li>Indica el <strong>CIF y Nombre del Proveedor</strong>, número de factura oficial, fecha de emisión y el importe total con IVA.</li>
              <li>Haz clic en <strong>Guardar Justificante</strong>. El sistema recalcula automáticamente el grado de ejecución presupuestaria del Eje y la barra de cumplimiento global en la pantalla de inicio ciudadana.</li>
            </ol>
            <div style="background:rgba(245,158,11,0.1); border-left:3px solid var(--amber); padding:8px 12px; border-radius:4px; font-size:0.72rem; color:var(--text-main);">
              <strong>⚠️ Alerta presupuestaria:</strong> Si el importe de las facturas supera el presupuesto asignado a la acción, el sistema mostrará un aviso en color ámbar. En tal caso, informa a Ramón Muñoz para evaluar si procede una compensación de partidas entre medidas del mismo Eje.
            </div>
          </div>
        </article>

        <!-- PASO 3: BUZÓN Y PLENO JOVEN -->
        <article class="manual-section-card" data-manual-keywords="buzon pleno joven modulo 3 propuestas vecinos votos ciudadania admision" style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="badge-tag-civic" style="background:rgba(239,68,68,0.15); color:#f87171;">MÓDULO 3</span>
              <strong style="font-size:0.92rem; color:var(--text-main);">Buzón Ciudadano, Respuestas Institucionales y Pleno Joven</strong>
            </div>
            <button type="button" class="btn-tool" onclick="switchAdminPane('pane-buzon')" style="font-size:0.72rem; padding:4px 10px; color:var(--amurjo-cyan);">
              Ir a Módulo 3 ➔
            </button>
          </div>
          
          <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.55;">
            <p style="margin-bottom:8px;">
              Los jóvenes envían sugerencias, demandas de instalaciones o mejoras para el pueblo desde la app. El técnico es el primer filtro institucional y canalizador:
            </p>
            <ul style="margin:0 0 10px; padding-left:18px;">
              <li><strong>Lectura y Moderación:</strong> Revisa que la propuesta respete las normas de convivencia cívica.</li>
              <li><strong>Admitir a Trámite:</strong> Al admitirla, se publica en el listado comunitario y otros jóvenes pueden votarla y apoyarla con sus carnets.</li>
              <li><strong>Respuesta Municipal Oficial:</strong> Redacta una respuesta motivada desde el área de Juventud (ej: <em>"Aceptada: se incluirá en el ciclo cultural de primavera"</em>).</li>
              <li><strong>Umbral de Pleno Joven:</strong> Las iniciativas que alcancen <strong>50 votos de apoyo</strong> se catalogan automáticamente para ser elevadas a la Comisión Informativa y al Pleno del Ayuntamiento de Orcera.</li>
            </ul>
          </div>
        </article>

        <!-- PASO 4: CONSULTAS EXPRÉS / STORIES -->
        <article class="manual-section-card" data-manual-keywords="stories consultas encuestas modulo 4 votacion exprés historias instagram" style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="badge-tag-civic" style="background:rgba(245,158,11,0.15); color:#fbbf24;">MÓDULO 4</span>
              <strong style="font-size:0.92rem; color:var(--text-main);">Consultas Exprés (Stories de Votación Rápida)</strong>
            </div>
            <button type="button" class="btn-tool" onclick="switchAdminPane('pane-stories')" style="font-size:0.72rem; padding:4px 10px; color:var(--amurjo-cyan);">
              Ir a Módulo 4 ➔
            </button>
          </div>
          
          <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.55;">
            <p style="margin-bottom:8px;">
              Las Stories aparecen en la cabecera de la aplicación y permiten consultar a la juventud de manera muy ágil (formato encuesta con 2 opciones):
            </p>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:10px; margin-bottom:10px;">
              <div style="background:rgba(0,0,0,0.25); border-radius:var(--radius-sm); padding:10px;">
                <strong style="color:var(--text-main); font-size:0.76rem;">Cómo publicar una nueva Story:</strong>
                <ol style="margin:4px 0 0; padding-left:16px; font-size:0.72rem;">
                  <li>Ve al <strong>Módulo 4</strong>.</li>
                  <li>Completa el formulario: Título, Categoría (Cultura, Deporte, Ocio), Opción A y Opción B.</li>
                  <li>Pulsa en <strong>Publicar Story</strong>. Estará visible al instante para todos los vecinos.</li>
                </ol>
              </div>
              <div style="background:rgba(0,0,0,0.25); border-radius:var(--radius-sm); padding:10px;">
                <strong style="color:var(--text-main); font-size:0.76rem;">Buenas prácticas de consulta:</strong>
                <ul style="margin:4px 0 0; padding-left:16px; font-size:0.72rem;">
                  <li>Plantea preguntas concretas: <em>"¿Horario piscina nocturna: Viernes o Sábado?"</em></li>
                  <li>Mantén la consulta activa entre 7 y 15 días.</li>
                  <li>Cierra la consulta cuando se alcance una muestra representativa.</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        <!-- PASO 5: CENSO ASOCIACIÓN (AJO) -->
        <article class="manual-section-card" data-manual-keywords="censo asociacion ajo modulo 5 socios carnet altas bajas miembros" style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="badge-tag-civic" style="background:rgba(139,92,246,0.15); color:#a78bfa;">MÓDULO 5</span>
              <strong style="font-size:0.92rem; color:var(--text-main);">Censo Oficial de la Asociación Juvenil de Orcera (AJO)</strong>
            </div>
            <button type="button" class="btn-tool" onclick="switchAdminPane('pane-asociacion')" style="font-size:0.72rem; padding:4px 10px; color:var(--amurjo-cyan);">
              Ir a Módulo 5 ➔
            </button>
          </div>
          
          <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.55;">
            <p style="margin-bottom:8px;">
              Los jóvenes que acumulan puntos en la app pueden solicitar el alta gratuita en la Asociación Juvenil de Orcera (AJO) para participar en asambleas, viajes y actividades con descuento:
            </p>
            <ul style="margin:0 0 10px; padding-left:18px;">
              <li>Revisa las solicitudes pendientes en el <strong>Módulo 5</strong>.</li>
              <li>Verifica que el solicitante tenga entre <strong>12 y 35 años</strong> y resida o tenga vinculación con Orcera.</li>
              <li>Para menores de 14 años, recuerda que la normativa RGPD/LOPDGDD requiere autorización firmada de sus progenitores o tutores legales.</li>
              <li>Haz clic en <strong>📥 Exportar Censo (CSV)</strong> para sincronizar la lista de socios con la secretaría de la asociación o para trámites de subvenciones ante la Diputación de Jaén o la Junta de Andalucía.</li>
            </ul>
          </div>
        </article>

        <!-- PASO 6: PROMOCIÓN Y CARTELERÍA -->
        <article class="manual-section-card" data-manual-keywords="carteleria qr promocion modulo 7 poster difusion whatsapp instagram ies orcera" style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="badge-tag-civic" style="background:rgba(6,182,212,0.15); color:var(--amurjo-cyan);">MÓDULO 7</span>
              <strong style="font-size:0.92rem; color:var(--text-main);">Kit de Promoción, Difusión y Cartelería Física</strong>
            </div>
            <button type="button" class="btn-tool" onclick="switchAdminPane('pane-promocion')" style="font-size:0.72rem; padding:4px 10px; color:var(--amurjo-cyan);">
              Ir a Módulo 7 ➔
            </button>
          </div>
          
          <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.55;">
            <p style="margin-bottom:8px;">
              El éxito del Plan radica en que la juventud conozca y use KLIKO. El Módulo 7 proporciona todos los materiales de difusión ya maquetados:
            </p>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:10px;">
              <div style="background:rgba(0,0,0,0.25); border-radius:var(--radius-sm); padding:10px;">
                <strong style="color:var(--text-main); font-size:0.76rem;">🪧 Cartel Oficial A4/A3 con Código QR:</strong>
                <p style="margin:4px 0 0; font-size:0.72rem;">
                  Pulsa en <strong>👁️ Vista Previa del Cartel Oficial</strong> e imprímelo para colocar en tablones del <strong>IES Gandgía</strong>, <strong>Centro Guadalinfo</strong>, <strong>Piscina de Amurjo</strong> y <strong>Pabellón Deportivo</strong>.
                </p>
              </div>
              <div style="background:rgba(0,0,0,0.25); border-radius:var(--radius-sm); padding:10px;">
                <strong style="color:var(--text-main); font-size:0.76rem;">💬 Difusión Digital (WhatsApp y Redes):</strong>
                <p style="margin:4px 0 0; font-size:0.72rem;">
                  Usa los botones de copia en un clic de los textos oficiales para compartir en el canal de WhatsApp municipal y en las historias de Instagram del Ayuntamiento.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- PROTOCOLOS DE INCIDENCIAS Y PREGUNTAS FRECUENTES (FAQ) -->
      <section class="manual-section-card" data-manual-keywords="faq incidencias dudas problemas soporte presupuesto ramon contacto" style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px; margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
          <span style="font-size:1.3rem;">❓</span>
          <div>
            <h3 style="margin:0; font-size:0.96rem; color:var(--text-main);">4. Protocolos de Incidencias y Preguntas Frecuentes</h3>
            <small style="color:var(--amurjo-cyan); font-size:0.7rem;">Respuestas rápidas para resolver dudas del día a día</small>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <details style="background:rgba(0,0,0,0.25); border:1px solid var(--segura-border); border-radius:var(--radius-sm); padding:10px 14px;">
            <summary style="font-size:0.78rem; font-weight:700; color:var(--text-main); cursor:pointer;">
              ¿Qué hago si una acción necesita eliminar o modificar su presupuesto de raíz?
            </summary>
            <p style="font-size:0.74rem; color:var(--text-muted); margin:8px 0 0; line-height:1.45;">
              Por seguridad técnica e institucional, el borrado de acciones y la modificación estructural de partidas está reservado a <strong>Ramón Muñoz (Superadministrador)</strong>. Debes notificarle la propuesta de cambio o acuerdo plenario para que ejecute el ajuste desde su perfil con clave maestra.
            </p>
          </details>

          <details style="background:rgba(0,0,0,0.25); border:1px solid var(--segura-border); border-radius:var(--radius-sm); padding:10px 14px;">
            <summary style="font-size:0.78rem; font-weight:700; color:var(--text-main); cursor:pointer;">
              ¿Cómo cambiar mi PIN de acceso técnico?
            </summary>
            <p style="font-size:0.74rem; color:var(--text-muted); margin:8px 0 0; line-height:1.45;">
              Los nombramientos y claves PIN de los técnicos son gestionados por el Superadministrador en el <strong>Módulo 6 (Configuración & Auditoría)</strong>. Solicita a Ramón la actualización de tu PIN si deseas renovarlo por confidencialidad.
            </p>
          </details>

          <details style="background:rgba(0,0,0,0.25); border:1px solid var(--segura-border); border-radius:var(--radius-sm); padding:10px 14px;">
            <summary style="font-size:0.78rem; font-weight:700; color:var(--text-main); cursor:pointer;">
              ¿Qué ocurre si un joven pierde o olvida el PIN de su Carnet Joven?
            </summary>
            <p style="font-size:0.74rem; color:var(--text-muted); margin:8px 0 0; line-height:1.45;">
              En el modal de búsqueda de usuarios de la app, el técnico puede localizar la cuenta del joven por nombre o DNI. Al acceder o registrar la cuenta, se le puede reimprimir el carnet digital con el botón <em>🖨️ Imprimir Carnet</em>.
            </p>
          </details>

          <details style="background:rgba(0,0,0,0.25); border:1px solid var(--segura-border); border-radius:var(--radius-sm); padding:10px 14px;">
            <summary style="font-size:0.78rem; font-weight:700; color:var(--text-main); cursor:pointer;">
              ¿Dónde se guardan las copias de seguridad de las facturas y propuestas?
            </summary>
            <p style="font-size:0.74rem; color:var(--text-muted); margin:8px 0 0; line-height:1.45;">
              La plataforma almacena los datos de forma persistente. El Superadministrador dispone en el Módulo 6 de la herramienta <em>📥 Descargar Backup Completo (JSON)</em> para generar copias periódicas de seguridad de todo el histórico municipal.
            </p>
          </details>
        </div>
      </section>

      <!-- PIE Y CONTACTO INTERNO -->
      <div style="background:rgba(6,78,59,0.25); border:1px solid rgba(6,182,212,0.25); border-radius:var(--radius-md); padding:14px; text-align:center;">
        <span style="font-size:0.76rem; color:var(--text-main); font-weight:600; display:block;">
          Ayuntamiento de Orcera · Concejalía de Juventud & Coordinación del III Plan (2027–2031)
        </span>
        <small style="font-size:0.69rem; color:var(--text-muted); display:block; margin-top:4px;">
          Para incidencias técnicas o soporte de plataforma: Contactar con <strong>Ramón Muñoz</strong> (Superadministrador) · Plaza del Ayuntamiento, 1, Orcera.
        </small>
      </div>

    </div>
  `;

  // Attach search listener
  const searchBox = container.querySelector("#manual-search-box");
  if (searchBox) {
    searchBox.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const sections = container.querySelectorAll(".manual-section-card");
      sections.forEach(sec => {
        const keywords = (sec.getAttribute("data-manual-keywords") || "").toLowerCase();
        const text = sec.textContent.toLowerCase();
        if (!q || keywords.includes(q) || text.includes(q)) {
          sec.style.display = "block";
        } else {
          sec.style.display = "none";
        }
      });
    });
  }

  // Attach checklist listeners
  container.querySelectorAll("#tecnico-checklist-container input[type='checkbox']").forEach(chk => {
    chk.addEventListener("change", () => {
      const id = chk.getAttribute("data-check-id");
      const state = getTecnicoChecklistState();
      state[id] = chk.checked;
      saveTecnicoChecklistState(state);
    });
  });

  const resetChkBtn = container.querySelector("#btn-reset-checklist-tecnico");
  if (resetChkBtn) {
    resetChkBtn.addEventListener("click", () => {
      if (confirm("¿Reiniciar el checklist de tareas del técnico?")) {
        saveTecnicoChecklistState({});
        renderPaneManualTecnico(container);
        showToast("Checklist Reiniciado", "Las tareas diarias se han desmarcado.");
      }
    });
  }

  // Attach print button
  const printBtn = container.querySelector("#btn-print-manual-tecnico");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}
'''

if "function renderPaneManualTecnico" not in content:
    # Insertar antes de POLICIES_DATA
    marker = "/**\n * Inicialización y Gestión del Sistema de Políticas Legales"
    if marker in content:
        content = content.replace(marker, manual_func + "\n" + marker, 1)
    else:
        # Fallback al final de renderPanePromocion
        content = content.replace("function renderPanePromocion(container) {", manual_func + "\nfunction renderPanePromocion(container) {", 1)

with open(APP_JS, "w", encoding="utf-8") as f:
    f.write(content)

print("Manual Técnico añadido a app.js exitosamente.")
