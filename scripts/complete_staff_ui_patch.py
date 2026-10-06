# -*- coding: utf-8 -*-
with open(r"c:\Users\RAMON\Desktop\KLIKO\js\app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. En renderPaneConfiguracion, actualizar el renderizado de la tarjeta del técnico:
old_staff_card = r'''              <div style="display:flex; align-items:center; gap:8px;">
                <div style="background:rgba(0,0,0,0.3); border:1px dashed var(--segura-border); border-radius:6px; padding:4px 8px; font-family:monospace; font-size:0.75rem; color:var(--amurjo-cyan);" title="PIN de acceso asignado">
                  PIN: <strong>${t.pin}</strong>
                </div>
                <button type="button" class="btn-tool btn-remove-tecnico" data-id="${t.id}" data-nombre="${t.nombre}" style="color:#f87171; padding:6px 10px; font-size:0.72rem;" title="Dar de baja este responsable técnico">
                  🗑️ Revocar
                </button>
              </div>'''

new_staff_card = r'''              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <div style="background:rgba(0,0,0,0.3); border:1px dashed var(--segura-border); border-radius:6px; padding:4px 8px; font-family:monospace; font-size:0.75rem; color:var(--amurjo-cyan);" title="PIN de acceso asignado">
                  PIN: <strong>${t.pin}</strong>
                </div>
                <button type="button" class="btn-tool btn-notify-staff" data-id="${t.id}" style="color:var(--amurjo-cyan); padding:6px 10px; font-size:0.72rem;" title="Enviar notificación oficial por correo o WhatsApp">
                  ✉️ Notificar Nombramiento
                </button>
                <button type="button" class="btn-tool btn-remove-tecnico" data-id="${t.id}" data-nombre="${t.nombre}" style="color:#f87171; padding:6px 10px; font-size:0.72rem;" title="Dar de baja este responsable técnico">
                  🗑️ Revocar
                </button>
              </div>'''

if old_staff_card in js:
    js = js.replace(old_staff_card, new_staff_card, 1)

# En la info del técnico dentro de renderPaneConfiguracion, añadir badge de cuenta vinculada:
old_staff_info = r'''                  <small style="color:var(--text-muted); font-size:0.7rem; display:block;">${t.cargo} · Nombrado: ${t.fechaAlta || 'Vigente'}</small>'''

new_staff_info = r'''                  <small style="color:var(--text-muted); font-size:0.7rem; display:block;">${t.cargo} · Nombrado: ${t.fechaAlta || 'Vigente'}</small>
                  ${(() => {
                    const linked = findLinkedUserForStaff(t);
                    if (linked) {
                      return `<div style="margin-top:3px;"><span style="font-size:0.67rem; color:#10b981; background:rgba(16,185,129,0.12); padding:2px 6px; border-radius:4px; font-weight:600;">✔ Cuenta KLIKO vinculada: @${linked.alias || linked.nombre} (${linked.email || 'Email no indicado'})</span></div>`;
                    } else {
                      return `<div style="margin-top:3px;"><span style="font-size:0.67rem; color:var(--text-muted); background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px;">ℹ️ Sin cuenta vinculada aún en la app (se vinculará al registrarse o iniciar sesión)</span></div>`;
                    }
                  })()}'''

if old_staff_info in js:
    js = js.replace(old_staff_info, new_staff_info, 1)

# 2. Agregar los event listeners para btn-notify-staff en renderPaneConfiguracion:
old_revoke_listener = r'''  // Attach event to revoke buttons:
  container.querySelectorAll(".btn-remove-tecnico").forEach(btn => {'''

new_notify_listener = r'''  // Attach event to notify buttons:
  container.querySelectorAll(".btn-notify-staff").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const list = getAppointedStaffList();
      const staff = list.find(x => x.id === id);
      if (staff) openStaffNotificationModal(staff);
    });
  });

  // Attach event to revoke buttons:
  container.querySelectorAll(".btn-remove-tecnico").forEach(btn => {'''

if old_revoke_listener in js:
    js = js.replace(old_revoke_listener, new_notify_listener, 1)

# 3. En initAdminPanel, llamar a setupStaffNotificationEvents():
old_init_admin = r'''function initAdminPanel() {
  setupAdminGlobalEvents();
  setupActionEditorEvents();
  setupPromotionEvents();
}'''

new_init_admin = r'''function initAdminPanel() {
  setupAdminGlobalEvents();
  setupActionEditorEvents();
  setupPromotionEvents();
  setupStaffNotificationEvents();
}'''

if old_init_admin in js:
    js = js.replace(old_init_admin, new_init_admin, 1)

# 4. En handleManualLogin, reconocer a Yolanda o cualquier técnico que entre con su PIN en la app móvil:
old_login_step = r'''  // 1. Comprobar PRIMERO si se trata del Superadministrador (Ramón Muñoz)'''

new_login_step = r'''  // 0. Comprobar si se trata de un Responsable Técnico Nombrado (ej: Yolanda Samblás Díaz)
  const tecnicosList = getAppointedStaffList();
  const matchedTecnico = tecnicosList.find(t => {
    const tFirst = t.nombre.toLowerCase().split(" ")[0];
    const isQueryMatch = query.includes(tFirst) || t.nombre.toLowerCase().includes(query) || (t.pin && query === t.pin.toLowerCase());
    const isPinMatch = t.pin && t.pin.toLowerCase() === pass.trim().toLowerCase();
    return (isQueryMatch && isPinMatch) || (query.includes(tFirst) && isPinMatch);
  });

  if (matchedTecnico) {
    const tecnicoUser = {
      id: `user-${matchedTecnico.id}`,
      nombre: matchedTecnico.nombre,
      alias: matchedTecnico.nombre.split(" ")[0],
      iniciales: matchedTecnico.nombre.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(),
      edad: 28,
      rangoEdad: "18-30",
      dni: "***7506*",
      empadronado: true,
      puntos: 1500,
      puntosHistoricos: 1500,
      nivel: "Técnica Municipal de Juventud",
      nivelBadge: "🛠️ Técnica de Juventud",
      hash: `#ORC-${matchedTecnico.pin.toUpperCase()}`,
      rol: "tecnico",
      cargoTecnico: matchedTecnico.cargo,
      tecnicoPin: matchedTecnico.pin,
      passwordHash: inputHash
    };
    saveSessionToStorage(tecnicoUser);
    logInWithUser(tecnicoUser);
    if (passInput) passInput.value = "";
    showToast(`¡Bienvenida, ${matchedTecnico.nombre.split(" ")[0]}!`, `Sesión iniciada como ${matchedTecnico.cargo}.`);
    return;
  }

  // 1. Comprobar PRIMERO si se trata del Superadministrador (Ramón Muñoz)'''

if old_login_step in js:
    js = js.replace(old_login_step, new_login_step, 1)

with open(r"c:\Users\RAMON\Desktop\KLIKO\js\app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Actualización de técnicos y login en app.js completada.")
