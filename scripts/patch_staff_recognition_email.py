# -*- coding: utf-8 -*-
"""
Script para añadir:
1. Reconocimiento de técnicos nombrados entre los usuarios registrados en KLIKO.
2. Sistema de vinculación de cuentas.
3. Notificación oficial por email (mailto), WhatsApp y credencial imprimible.
4. Login automático como Técnica de Juventud para Yolanda Samblás Díaz y demás técnicos.
"""
import re

APP_JS = r"c:\Users\RAMON\Desktop\KLIKO\js\app.js"
INDEX_HTML = r"c:\Users\RAMON\Desktop\KLIKO\index.html"
SW_JS = r"c:\Users\RAMON\Desktop\KLIKO\sw.js"

# 1. Modificar INDEX_HTML para añadir el Modal de Notificación y Nombramiento
with open(INDEX_HTML, "r", encoding="utf-8") as f:
    html = f.read()

staff_notify_modal_html = '''
    <!-- MODAL DE NOTIFICACIÓN Y CREDENCIALES DE NOMBRAMIENTO TÉCNICO -->
    <div class="modal-overlay" id="admin-staff-notify-modal" role="dialog" aria-hidden="true" style="z-index: 10060;">
      <div class="user-modal-box" style="max-width: 540px;">
        <button class="btn-close-modal" id="close-staff-notify-modal" aria-label="Cerrar modal">&times;</button>
        
        <div class="user-modal-header" style="border-bottom: 1px solid var(--segura-border); padding-bottom: 12px; margin-bottom: 16px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, var(--pine-green), var(--amurjo-cyan)); display:flex; align-items:center; justify-content:center; font-size:1.1rem;">✉️</div>
            <div>
              <span class="badge-tag-civic">Ayuntamiento de Orcera · Notificación Oficial</span>
              <h3 style="margin:2px 0 0; font-family:var(--font-heading); font-size:1.15rem; color:var(--text-main);">
                Notificar Nombramiento Técnico
              </h3>
            </div>
          </div>
        </div>

        <div style="margin-bottom:14px; background:rgba(6,182,212,0.08); border:1px solid rgba(6,182,212,0.25); border-radius:var(--radius-sm); padding:12px;">
          <strong id="notify-staff-name" style="display:block; font-size:0.9rem; color:var(--text-main);">Yolanda Samblás Díaz</strong>
          <small id="notify-staff-cargo" style="color:var(--amurjo-cyan); font-size:0.75rem; font-weight:600;">Técnica de Juventud de Orcera</small>
          <div style="margin-top:6px; font-size:0.75rem; color:var(--text-muted);">
            Clave / PIN asignado: <code id="notify-staff-pin" style="color:#fbbf24; background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px; font-weight:700;">YSD2026tjo</code>
          </div>
        </div>

        <form id="form-send-staff-notification">
          <div class="form-group-orcera" style="margin-bottom:12px;">
            <label for="notify-staff-email" style="font-size:0.74rem; font-weight:700;">Correo Electrónico de la Técnica/o:</label>
            <input type="email" id="notify-staff-email" placeholder="ejemplo@orcera.es o correo personal" required style="width:100%; box-sizing:border-box;">
            <small style="font-size:0.68rem; color:var(--text-muted); display:block; margin-top:3px;">
              Se enviará una comunicación institucional formal con sus credenciales de acceso.
            </small>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">
            <button type="submit" class="btn-primary" id="btn-submit-email-client" style="justify-content:center; padding:10px;">
              📧 Abrir Correo Oficial Pre-redactado (Email)
            </button>
            <button type="button" class="btn-tool" id="btn-copy-staff-msg" style="justify-content:center; padding:9px; color:var(--amurjo-cyan);">
              📋 Copiar Mensaje Oficial para WhatsApp / Telegram
            </button>
            <button type="button" class="btn-tool" id="btn-print-staff-acta" style="justify-content:center; padding:9px; color:#10b981;">
              🖨️ Ver / Imprimir Credencial Oficial de Nombramiento
            </button>
          </div>
        </form>

      </div>
    </div>
'''

if "admin-staff-notify-modal" not in html:
    html = html.replace('<!-- MODAL DE EDICIÓN Y CREACIÓN DE ACCIÓN', staff_notify_modal_html + '\n    <!-- MODAL DE EDICIÓN Y CREACIÓN DE ACCIÓN', 1)

with open(INDEX_HTML, "w", encoding="utf-8") as f:
    f.write(html)

print("Modal añadido a index.html.")

# 2. Modificar APP_JS
with open(APP_JS, "r", encoding="utf-8") as f:
    js = f.read()

# Añadir funciones de vinculación y notificación
staff_extension_code = '''
// ==============================================================================
// SISTEMA DE RECONOCIMIENTO Y NOTIFICACIÓN DE RESPONSABLES TÉCNICOS (YOLANDA, ETC.)
// ==============================================================================
function findLinkedUserForStaff(staff) {
  if (!staff) return null;
  const saved = getSavedAccountsList();
  const staffNameNorm = (staff.nombre || "").toLowerCase().trim();
  const staffFirst = staffNameNorm.split(" ")[0];

  // 1. Buscar coincidencia exacta por ID enlazado
  if (staff.linkedUserId) {
    const byId = saved.find(u => u.id === staff.linkedUserId);
    if (byId) return byId;
  }

  // 2. Buscar coincidencia por nombre o email
  return saved.find(u => {
    const uNom = (u.nombre || "").toLowerCase().trim();
    const uAlias = (u.alias || "").toLowerCase().trim();
    const uEmail = (u.email || "").toLowerCase().trim();
    if (staff.email && uEmail && staff.email.toLowerCase() === uEmail) return true;
    if (uNom === staffNameNorm) return true;
    if (uNom.includes(staffFirst) && staffNameNorm.includes(uNom)) return true;
    if (uAlias && staffNameNorm.includes(uAlias)) return true;
    return false;
  }) || null;
}

function syncStaffPrivilegesWithUser(staff, user) {
  if (!staff || !user) return;
  user.rol = "tecnico";
  user.cargoTecnico = staff.cargo;
  user.tecnicoPin = staff.pin;
  user.nivel = "Técnica Municipal de Juventud";
  user.nivelBadge = "🛠️ Técnica de Juventud";
  saveSessionToStorage(user);

  let saved = getSavedAccountsList();
  const idx = saved.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    saved[idx] = { ...saved[idx], ...user };
    try {
      localStorage.setItem("orcera_saved_accounts_v3", JSON.stringify(saved));
    } catch(e){}
  }
}

function openStaffNotificationModal(staff) {
  const modal = document.getElementById("admin-staff-notify-modal");
  if (!modal) return;

  const linkedUser = findLinkedUserForStaff(staff);
  const nameEl = document.getElementById("notify-staff-name");
  const cargoEl = document.getElementById("notify-staff-cargo");
  const pinEl = document.getElementById("notify-staff-pin");
  const emailInput = document.getElementById("notify-staff-email");

  if (nameEl) nameEl.textContent = staff.nombre;
  if (cargoEl) cargoEl.textContent = staff.cargo;
  if (pinEl) pinEl.textContent = staff.pin;
  if (emailInput) {
    emailInput.value = (linkedUser && linkedUser.email) || staff.email || "";
  }

  modal._currentStaff = staff;
  modal._linkedUser = linkedUser;
  modal.classList.add("active");
}

function closeStaffNotificationModal() {
  const modal = document.getElementById("admin-staff-notify-modal");
  if (modal) modal.classList.remove("active");
}

function generateStaffOfficialEmailBody(staff) {
  const appUrl = window.location.origin + window.location.pathname;
  return `Estimada Dña. ${staff.nombre},

Por la presente, la Coordinación del III Plan Municipal de Juventud y el Ayuntamiento de Orcera le notifican formalmente su nombramiento oficial como:

📋 CARGO: ${staff.cargo}
🏛️ ORGANISMO: Ayuntamiento de Orcera (Jaén) · Concejalía de Juventud
🔑 CLAVE / PIN MUNICIPAL: ${staff.pin}
🌐 PLATAFORMA KLIKO: ${appUrl}

RESPONSABILIDADES Y FACULTADES DELEGADAS:
- Gestión y actualización del estado de las acciones del Plan (Ejes 1 al 7).
- Registro y justificación de facturas y partidas de gasto por proveedor.
- Moderación y respuesta a propuestas ciudadanas del Buzón y Pleno Joven.
- Lanzamiento de Consultas Exprés (Stories) y censo de la Asociación Juvenil de Orcera (AJO).

INSTRUCCIONES DE ACCESO:
1. Entra en KLIKO (${appUrl}).
2. Pulsa en el botón superior "🏛️ Gestión Municipal".
3. Selecciona tu perfil "${staff.nombre}" o introduce tu PIN: ${staff.pin}.
4. Dispones del "Manual Operativo del Técnico" en el menú lateral para consultar todas las rutinas paso a paso.

Atentamente,
Ramón Muñoz · Superadministrador del III Plan
Ayuntamiento de Orcera`;
}

function setupStaffNotificationEvents() {
  const modal = document.getElementById("admin-staff-notify-modal");
  const closeBtn = document.getElementById("close-staff-notify-modal");
  const form = document.getElementById("form-send-staff-notification");
  const copyBtn = document.getElementById("btn-copy-staff-msg");
  const printBtn = document.getElementById("btn-print-staff-acta");

  if (closeBtn) closeBtn.addEventListener("click", closeStaffNotificationModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeStaffNotificationModal();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const staff = modal._currentStaff;
      if (!staff) return;

      const email = document.getElementById("notify-staff-email").value.trim();
      if (!email) {
        showToast("Email requerido", "Por favor, introduce el correo electrónico del destinatario.");
        return;
      }

      // Guardar el email en el técnico
      staff.email = email;
      const list = getAppointedStaffList();
      const sIdx = list.findIndex(x => x.id === staff.id);
      if (sIdx !== -1) {
        list[sIdx].email = email;
        saveAppointedStaffList(list);
      }

      // Construir mailto
      const subject = encodeURIComponent(`🏛️ Ayuntamiento de Orcera: Nombramiento Oficial como ${staff.cargo} en KLIKO`);
      const body = encodeURIComponent(generateStaffOfficialEmailBody(staff));
      const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;

      window.location.href = mailtoUrl;
      showToast("Gestor de Correo Abierto", `Se ha redactado la comunicación oficial para ${staff.nombre}.`);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const staff = modal._currentStaff;
      if (!staff) return;
      const text = generateStaffOfficialEmailBody(staff);
      navigator.clipboard.writeText(text).then(() => {
        showToast("Texto Copiado", "Mensaje oficial copiado al portapapeles para WhatsApp o correo.");
      });
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      const staff = modal._currentStaff;
      if (!staff) return;
      printStaffAppointmentCredential(staff);
    });
  }
}

function printStaffAppointmentCredential(staff) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Credencial Oficial de Nombramiento · ${staff.nombre}</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; max-width: 750px; margin: 0 auto; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 16px; margin-bottom: 24px; }
        .escudo { font-size: 3rem; margin-bottom: 8px; }
        h1 { font-size: 1.5rem; text-transform: uppercase; margin: 0; letter-spacing: 1px; }
        h2 { font-size: 1.1rem; color: #444; margin: 4px 0 0; }
        .content { margin: 24px 0; font-size: 1.05rem; text-align: justify; }
        .box { border: 2px solid #064e3b; background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0; }
        .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
        .sig-block { text-align: center; width: 45%; border-top: 1px solid #666; padding-top: 8px; }
        @media print { body { padding: 0; } button { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="escudo">🏛️</div>
        <h1>Ayuntamiento de Orcera</h1>
        <h2>Concejalía de Juventud · III Plan Municipal de Juventud (2027–2031)</h2>
      </div>

      <div class="content">
        <p><strong>DON RAMÓN MUÑOZ</strong>, en calidad de Superadministrador del III Plan Municipal de Juventud de Orcera y responsable de la plataforma cívica <strong>KLIKO</strong>,</p>
        
        <p><strong>HACE SABER:</strong></p>
        <p>Que en virtud de las facultades de delegación técnica municipal, se procede al nombramiento oficial de:</p>

        <div class="box">
          <p style="margin:0 0 6px;"><strong>NOMBRADA:</strong> Dña. ${staff.nombre}</p>
          <p style="margin:0 0 6px;"><strong>CARGO OFICIAL:</strong> ${staff.cargo}</p>
          <p style="margin:0 0 6px;"><strong>FECHA DE EFECTO:</strong> ${staff.fechaAlta || '06/10/2026'}</p>
          <p style="margin:0;"><strong>PIN DE ACCESO EN PLATAFORMA:</strong> <code>${staff.pin}</code></p>
        </div>

        <p>Con dicho nombramiento queda habilitada con facultades plenas para la actualización del cronograma de acciones, control y registro de facturas por proveedor, moderación del Buzón Joven vecinal y validación de socios de la Asociación Juvenil de Orcera.</p>

        <p>Y para que conste y surta los efectos oportunos, se expide la presente credencial en Orcera (Jaén).</p>
      </div>

      <div class="signatures">
        <div class="sig-block">
          <p style="margin:0 0 40px;">El Superadministrador del Plan:</p>
          <p style="margin:0; font-weight: bold;">Ramón Muñoz</p>
        </div>
        <div class="sig-block">
          <p style="margin:0 0 40px;">La Técnica Nombrada:</p>
          <p style="margin:0; font-weight: bold;">${staff.nombre}</p>
        </div>
      </div>

      <div style="text-align:center; margin-top: 30px;">
        <button onclick="window.print()" style="padding:10px 20px; font-size:1rem; cursor:pointer;">🖨️ Imprimir Credencial</button>
      </div>
    </body>
    </html>
  `);
  win.document.close();
}
'''

if "function findLinkedUserForStaff" not in js:
    js = js.replace("const STORAGE_KEY_TECNICOS =", staff_extension_code + "\nconst STORAGE_KEY_TECNICOS =", 1)

with open(APP_JS, "w", encoding="utf-8") as f:
    f.write(js)

print("Funciones de vinculación y notificación añadidas a app.js.")
