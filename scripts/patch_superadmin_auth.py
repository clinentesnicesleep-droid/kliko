# -*- coding: utf-8 -*-
"""
Script para solucionar la validación de la clave de Superadministrador (Ramón Muñoz)
en todo el sistema de KLIKO.
Permite tanto 75064320kliko@# (con 'k') como 75064320klico@# (con 'c'),
admin2027 y 75064320, con trim() automático y sin interferencias con usuarios antiguos.
"""
import re

APP_JS = r"c:\Users\RAMON\Desktop\KLIKO\js\app.js"
INDEX_HTML = r"c:\Users\RAMON\Desktop\KLIKO\index.html"
SW_JS = r"c:\Users\RAMON\Desktop\KLIKO\sw.js"

with open(APP_JS, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Definir helper universal isSuperAdminPass al inicio de autenticación
helper_code = '''
function isSuperAdminPass(rawPass) {
  if (!rawPass) return false;
  const p = String(rawPass).trim();
  const lower = p.toLowerCase();
  return (
    p === "75064320klico@#" ||
    p === "75064320kliko@#" ||
    lower === "75064320klico@#" ||
    lower === "75064320kliko@#" ||
    lower === "admin2027" ||
    p === "75064320"
  );
}
window.isSuperAdminPass = isSuperAdminPass;
'''

if "function isSuperAdminPass" not in content:
    content = content.replace("async function handleUserSearchLoginForm(e) {", helper_code + "\nasync function handleUserSearchLoginForm(e) {", 1)

# 2. Modificar handleUserSearchLoginForm para evaluar a Ramón al principio (antes de saved.find)
old_login_block = r'''  const inputHash = await hashPassword(pass);
  const saved = getSavedAccountsList();
  const cleanQuery = query.replace(/[*-\s]/g, '');

  const found = saved.find(u =>
    (u.nombre && u.nombre.toLowerCase() === query) ||
    (u.alias && u.alias.toLowerCase() === query) ||
    (u.email && u.email.toLowerCase() === query) ||
    (u.dni && u.dni.toLowerCase().replace(/[*-\s]/g, '') === cleanQuery) ||
    (u.nombre && u.nombre.toLowerCase().includes(query))
  );'''

new_login_block = r'''  const inputHash = await hashPassword(pass);
  const cleanQuery = query.replace(/[*-\s]/g, '');

  // 1. Comprobar PRIMERO si se trata del Superadministrador (Ramón Muñoz)
  const isRamonQuery = query.includes("ramon") || query.includes("ramón") || query === "superadmin" || cleanQuery === "7506" || cleanQuery.includes("7506");
  if (isRamonQuery || isSuperAdminPass(pass)) {
    if (isSuperAdminPass(pass)) {
      const superAdminUser = {
        id: "user-ramon-superadmin",
        nombre: "Ramón Muñoz",
        alias: "Ramón",
        iniciales: "RM",
        edad: 35,
        rangoEdad: "+30",
        dni: "***7506*",
        empadronado: true,
        puntos: 9999,
        puntosHistoricos: 9999,
        nivel: "Superadministrador del Plan",
        nivelBadge: "👑 Superadmin",
        hash: "#ORC-SUPERADMIN",
        rol: "admin",
        passwordHash: inputHash
      };
      saveSessionToStorage(superAdminUser);
      logInWithUser(superAdminUser);
      if (passInput) passInput.value = "";
      showToast("¡Bienvenido, Ramón!", "Sesión de Superadministrador iniciada con privilegios totales.");
      return;
    } else {
      showToast("Contraseña incorrecta", "La clave de Superadministrador no coincide.");
      if (passInput) {
        passInput.value = "";
        passInput.focus();
      }
      return;
    }
  }

  const saved = getSavedAccountsList();
  const found = saved.find(u =>
    (u.nombre && u.nombre.toLowerCase() === query) ||
    (u.alias && u.alias.toLowerCase() === query) ||
    (u.email && u.email.toLowerCase() === query) ||
    (u.dni && u.dni.toLowerCase().replace(/[*-\s]/g, '') === cleanQuery) ||
    (u.nombre && u.nombre.toLowerCase().includes(query))
  );'''

if old_login_block in content:
    content = content.replace(old_login_block, new_login_block, 1)

# Eliminar el bloque repetido de ramon que estaba más abajo
redundant_ramon = r'''  // Comprobar si se trata del Superadministrador (Ramón Muñoz)
  if (query.includes("ramon") || query.includes("ramón") || query === "superadmin") {
    if (pass === "75064320klico@#") {
      const superAdminUser = {
        id: "user-ramon-superadmin",
        nombre: "Ramón Muñoz",
        alias: "Ramón",
        iniciales: "RM",
        edad: 35,
        rangoEdad: "+30",
        dni: "***7506*",
        empadronado: true,
        puntos: 9999,
        puntosHistoricos: 9999,
        nivel: "Superadministrador del Plan",
        nivelBadge: "👑 Superadmin",
        hash: "#ORC-SUPERADMIN",
        rol: "admin",
        passwordHash: inputHash
      };
      logInWithUser(superAdminUser);
      if (passInput) passInput.value = "";
      showToast("¡Bienvenido, Ramón!", "Sesión de Superadministrador iniciada con privilegios totales.");
      return;
    } else {
      showToast("Contraseña incorrecta", "La clave de Superadministrador no coincide.");
      if (passInput) {
        passInput.value = "";
        passInput.focus();
      }
      return;
    }
  }'''

if redundant_ramon in content:
    content = content.replace(redundant_ramon, "// Superadministrador verificado al inicio de la función", 1)

# 3. En setupAdminGlobalEvents:
# Reemplazar comprobaciones de claves con isSuperAdminPass
old_admin_btn = r'''  // Botón de login Superadministrador
  const btnAdmin = document.getElementById("btn-login-admin");
  if (btnAdmin) {
    btnAdmin.addEventListener("click", () => {
      const pinInput = document.getElementById("admin-pin-input");
      const currentPin = pinInput ? pinInput.value.trim() : "";
      if (currentPin === "75064320klico@#" || currentPin === "admin2027") {
        loginAsMunicipal("admin");
        if (pinInput) pinInput.value = "";
      } else {
        const pass = prompt("Introduce tu clave de Superadministrador (Ramón Muñoz):");
        if (pass === "75064320klico@#" || pass === "admin2027") {
          loginAsMunicipal("admin");
          if (pinInput) pinInput.value = "";
        } else if (pass !== null) {
          showToast("Clave incorrecta", "La clave introducida no es válida para el Superadministrador.");
        }
      }
    });
  }'''

new_admin_btn = r'''  // Botón de login Superadministrador
  const btnAdmin = document.getElementById("btn-login-admin");
  if (btnAdmin) {
    btnAdmin.addEventListener("click", () => {
      const pinInput = document.getElementById("admin-pin-input");
      const currentPin = pinInput ? pinInput.value.trim() : "";
      if (isSuperAdminPass(currentPin)) {
        loginAsMunicipal("admin");
        if (pinInput) pinInput.value = "";
      } else {
        const pass = prompt("Introduce tu clave de Superadministrador (Ramón Muñoz):");
        if (isSuperAdminPass(pass)) {
          loginAsMunicipal("admin");
          if (pinInput) pinInput.value = "";
        } else if (pass !== null) {
          showToast("Clave incorrecta", "La clave introducida no es válida para el Superadministrador.");
        }
      }
    });
  }'''

if old_admin_btn in content:
    content = content.replace(old_admin_btn, new_admin_btn, 1)

old_form_pin = r'''  // Formulario PIN (valida Superadmin o cualquiera de los Técnicos Nombrados)
  const pinForm = document.getElementById("form-admin-pin");
  if (pinForm) {
    pinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pin = document.getElementById("admin-pin-input").value.trim();
      if (pin === "75064320klico@#" || pin === "admin2027") {
        loginAsMunicipal("admin");
        document.getElementById("admin-pin-input").value = "";
      } else {
        const tecnicos = getAppointedStaffList();
        const matchTecnico = tecnicos.find(t => t.pin === pin);
        if (matchTecnico) {
          loginAsMunicipal(matchTecnico);
          document.getElementById("admin-pin-input").value = "";
        } else {
          showToast("Clave incorrecta", "La clave o PIN introducido no coincide con el Superadministrador ni con ningún Responsable Técnico nombrado.");
        }
      }
    });
  }'''

new_form_pin = r'''  // Formulario PIN (valida Superadmin o cualquiera de los Técnicos Nombrados)
  const pinForm = document.getElementById("form-admin-pin");
  if (pinForm) {
    pinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pin = document.getElementById("admin-pin-input").value.trim();
      if (isSuperAdminPass(pin)) {
        loginAsMunicipal("admin");
        document.getElementById("admin-pin-input").value = "";
      } else {
        const tecnicos = getAppointedStaffList();
        const matchTecnico = tecnicos.find(t => t.pin === pin);
        if (matchTecnico) {
          loginAsMunicipal(matchTecnico);
          document.getElementById("admin-pin-input").value = "";
        } else {
          showToast("Clave incorrecta", "La clave o PIN introducido no coincide con el Superadministrador ni con ningún Responsable Técnico nombrado.");
        }
      }
    });
  }'''

if old_form_pin in content:
    content = content.replace(old_form_pin, new_form_pin, 1)

# 4. En promptLoginAsSuperadmin:
old_prompt_login = r'''function promptLoginAsSuperadmin() {
  const pass = prompt("Introduce tu clave de Superadministrador (Ramón Muñoz):");
  if (pass === "75064320klico@#" || pass === "admin2027") {
    loginAsMunicipal("admin");
  } else if (pass !== null) {
    showToast("Clave incorrecta", "La clave introducida no es válida para el Superadministrador.");
  }
}'''

new_prompt_login = r'''function promptLoginAsSuperadmin() {
  const pass = prompt("Introduce tu clave de Superadministrador (Ramón Muñoz):");
  if (isSuperAdminPass(pass)) {
    loginAsMunicipal("admin");
  } else if (pass !== null) {
    showToast("Clave incorrecta", "La clave introducida no es válida para el Superadministrador.");
  }
}'''

if old_prompt_login in content:
    content = content.replace(old_prompt_login, new_prompt_login, 1)

with open(APP_JS, "w", encoding="utf-8") as f:
    f.write(content)

print("Parche aplicado a app.js con éxito.")

# 5. Incrementar versión de cache en SW y app.js en index.html
with open(SW_JS, "r", encoding="utf-8") as f:
    sw_content = f.read()
sw_content = re.sub(r"const CACHE_NAME = 'kliko-cache-v\d+';", "const CACHE_NAME = 'kliko-cache-v18';", sw_content)
with open(SW_JS, "w", encoding="utf-8") as f:
    f.write(sw_content)

with open(INDEX_HTML, "r", encoding="utf-8") as f:
    html_content = f.read()
html_content = re.sub(r'src="js/app\.js\?v=[^"]+"', 'src="js/app.js?v=auth_fixed_v18"', html_content)
with open(INDEX_HTML, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Versiones de cache actualizadas a v18.")
