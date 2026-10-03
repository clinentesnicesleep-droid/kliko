# -*- coding: utf-8 -*-
"""
Script to patch the PWA installation guide with clear, step-by-step visual instructions,
platform tabs (Android vs iPhone), location cues, and native 1-click install support.
"""

def patch_css():
    with open('css/styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    css_addition = '''

/* ============================================================================== */
/* GUÍA VISUAL DETALLADA DE INSTALACIÓN EN MÓVIL (PWA) */
/* ============================================================================== */
.pwa-guide-box {
  background: linear-gradient(145deg, rgba(6, 78, 59, 0.45), rgba(6, 182, 212, 0.15));
  border: 1px solid rgba(6, 182, 212, 0.4);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-top: 14px;
}

.pwa-guide-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.pwa-header-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--amurjo-cyan), var(--pine-green));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(6, 182, 212, 0.3);
}

.pwa-guide-title {
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--text-main);
  display: block;
  line-height: 1.3;
}

.pwa-guide-subtitle {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 3px 0 0;
  line-height: 1.35;
}

.pwa-notice-pill {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  font-size: 0.71rem;
  color: #fbbf24;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.35;
  margin-bottom: 14px;
}

.btn-pwa-direct-install {
  width: 100%;
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
  transition: all 0.2s ease;
}
.btn-pwa-direct-install:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.55);
}

.pwa-tabs-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.pwa-tab-btn {
  flex: 1;
  background: var(--segura-surface);
  border: 1px solid var(--segura-border);
  color: var(--text-muted);
  font-size: 0.74rem;
  font-weight: 700;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.pwa-tab-btn.active {
  background: rgba(6, 182, 212, 0.2);
  border-color: var(--amurjo-cyan);
  color: var(--amurjo-cyan);
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.2);
}

.pwa-platform-card {
  background: var(--segura-surface-elevated);
  border: 1px solid var(--segura-border);
  border-radius: var(--radius-md);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pwa-step-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.pwa-step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--amurjo-cyan);
  color: #0f172a;
  font-size: 0.72rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.pwa-step-text {
  flex: 1;
  font-size: 0.73rem;
  line-height: 1.4;
  color: var(--text-main);
}
.pwa-step-text strong {
  display: block;
  color: #fff;
  margin-bottom: 2px;
}
.pwa-step-text span {
  color: var(--text-muted);
}

.pwa-visual-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  margin-top: 6px;
}

.pwa-browser-badge {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
}

.pwa-key-symbol {
  font-size: 0.95rem;
  font-weight: 900;
  color: var(--amurjo-cyan);
  background: rgba(6, 182, 212, 0.2);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid rgba(6, 182, 212, 0.4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pwa-badge-hint {
  font-size: 0.68rem;
  color: #e2e8f0;
  font-weight: 600;
}

.pwa-action-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  margin-top: 6px;
  color: #34d399;
}
.pwa-action-badge strong {
  color: #34d399 !important;
  margin: 0 !important;
  display: inline !important;
}
.pwa-action-badge small {
  color: var(--text-muted);
  font-size: 0.68rem;
}

.pwa-step-result {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  border: 1px dashed rgba(56, 189, 248, 0.35);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  margin-top: 2px;
}
'''
    if '.pwa-guide-box' not in css:
        with open('css/styles.css', 'w', encoding='utf-8') as f:
            f.write(css + css_addition)
        print('CSS: PWA styles appended successfully')
    else:
        print('CSS: PWA styles already present')

def patch_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Update cachebuster
    html = html.replace('css/styles.css?v=images_v1', 'css/styles.css?v=pwa_guide_v2')
    html = html.replace('js/app.js?v=images_v1', 'js/app.js?v=pwa_guide_v2')

    old_snippet = '''      <!-- GUÍA PARA INSTALAR EN PANTALLA DE INICIO (PWA) -->
      <div style="background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.3); border-radius:var(--radius-md); padding:12px;">
        <strong style="font-size:0.76rem; color:var(--amurjo-cyan); display:block; margin-bottom:4px;">
          📲 Instala la App en tu móvil (Acceso Directo):
        </strong>
        <div style="font-size:0.72rem; color:var(--text-main); line-height:1.4;">
          • <strong>iPhone (Safari):</strong> Pulsa el botón de compartir <span style="font-size:0.85rem;">⎋</span> abajo y selecciona <em>«Añadir a pantalla de inicio»</em>.<br>
          • <strong>Android (Chrome):</strong> Pulsa los 3 puntos arriba <span style="font-size:0.85rem;">⋮</span> y selecciona <em>«Instalar aplicación»</em>.
        </div>
      </div>'''

    new_snippet = '''      <!-- GUÍA PARA INSTALAR EN PANTALLA DE INICIO (PWA) -->
      <div class="pwa-guide-box">
        <div class="pwa-guide-header">
          <div class="pwa-header-icon">📲</div>
          <div>
            <strong class="pwa-guide-title">¿Cómo tener la App en tu móvil como una app de verdad?</strong>
            <p class="pwa-guide-subtitle">
              Se instala directamente desde el <strong>navegador de tu teléfono</strong> (sin necesidad de buscarla en Play Store ni App Store).
            </p>
          </div>
        </div>

        <!-- NOTA ACLARATORIA DE UBICACIÓN -->
        <div class="pwa-notice-pill">
          <span>📍</span>
          <div>
            <strong>¿Dónde se hace?</strong> En la <strong>barra de tu navegador móvil</strong> (en los menús de Chrome o Safari), <em>no dentro de esta página</em>. Sigue los pasos según tu teléfono:
          </div>
        </div>

        <!-- BOTÓN DE INSTALACIÓN NATIVA AUTOMÁTICA (SI EL NAVEGADOR LO SOPORTA) -->
        <div id="pwa-auto-install-row" style="display:none; margin-bottom:12px;">
          <button type="button" class="btn-pwa-direct-install" id="btn-pwa-direct-install">
            <span>⚡</span>
            <span>Instalar App en este Dispositivo Ahora (1 Clic)</span>
          </button>
        </div>

        <!-- SELECTOR DE PLATAFORMA (ANDROID VS IPHONE) -->
        <div class="pwa-tabs-row" role="tablist">
          <button type="button" class="pwa-tab-btn active" id="pwa-tab-android" role="tab" aria-selected="true">
            <span>🤖</span>
            <span>En Móviles Android (Chrome)</span>
          </button>
          <button type="button" class="pwa-tab-btn" id="pwa-tab-ios" role="tab" aria-selected="false">
            <span>🍏</span>
            <span>En iPhone (Safari)</span>
          </button>
        </div>

        <!-- CONTENIDO PASO A PASO: ANDROID -->
        <div class="pwa-platform-card" id="pwa-card-android">
          <div class="pwa-step-item">
            <div class="pwa-step-num">1</div>
            <div class="pwa-step-text">
              <strong>Abre Google Chrome en tu móvil:</strong>
              <span>Entra a esta misma dirección web desde el navegador de tu móvil.</span>
            </div>
          </div>

          <div class="pwa-step-item">
            <div class="pwa-step-num">2</div>
            <div class="pwa-step-text">
              <strong>Toca el menú del navegador:</strong>
              <span>Mira la <strong>esquina superior derecha</strong> de tu pantalla (arriba del todo, en la barra gris del navegador Chrome) y pulsa en los <strong>tres puntos verticales</strong>:</span>
              <div class="pwa-visual-badge">
                <span class="pwa-browser-badge">Barra superior derecha</span>
                <span class="pwa-key-symbol">⋮</span>
                <span class="pwa-badge-hint">Menú de Chrome</span>
              </div>
            </div>
          </div>

          <div class="pwa-step-item">
            <div class="pwa-step-num">3</div>
            <div class="pwa-step-text">
              <strong>Elige Instalar:</strong>
              <span>En el menú desplegable que aparece, pulsa sobre:</span>
              <div class="pwa-action-badge">
                <span>📲</span>
                <strong>«Instalar aplicación»</strong>
                <small>(o «Añadir a pantalla de inicio»)</small>
              </div>
            </div>
          </div>

          <div class="pwa-step-result">
            <span>✨</span>
            <span>¡Listo! Se creará el acceso directo con el icono oficial del III Plan en tu móvil.</span>
          </div>
        </div>

        <!-- CONTENIDO PASO A PASO: IPHONE (SAFARI) -->
        <div class="pwa-platform-card" id="pwa-card-ios" style="display:none;">
          <div class="pwa-step-item">
            <div class="pwa-step-num">1</div>
            <div class="pwa-step-text">
              <strong>Abre Safari en tu iPhone:</strong>
              <span>Entra a esta web usando el navegador oficial <strong>Safari</strong> de Apple.</span>
            </div>
          </div>

          <div class="pwa-step-item">
            <div class="pwa-step-num">2</div>
            <div class="pwa-step-text">
              <strong>Toca el botón Compartir:</strong>
              <span>Mira la <strong>barra inferior</strong> de la pantalla de tu iPhone (abajo del todo de la ventana de Safari) y toca el botón del <strong>cuadrado con flecha hacia arriba</strong>:</span>
              <div class="pwa-visual-badge">
                <span class="pwa-browser-badge">Barra inferior de Safari</span>
                <span class="pwa-key-symbol">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </span>
                <span class="pwa-badge-hint">Compartir</span>
              </div>
            </div>
          </div>

          <div class="pwa-step-item">
            <div class="pwa-step-num">3</div>
            <div class="pwa-step-text">
              <strong>Selecciona Añadir a pantalla de inicio:</strong>
              <span>En la lista de opciones que se abre desde abajo, desliza y toca en:</span>
              <div class="pwa-action-badge">
                <span>➕</span>
                <strong>«Añadir a pantalla de inicio»</strong>
              </div>
            </div>
          </div>

          <div class="pwa-step-result">
            <span>✨</span>
            <span>¡Listo! La App se abrirá a pantalla completa y sin marcos de navegador.</span>
          </div>
        </div>

      </div>'''

    if old_snippet in html:
        html = html.replace(old_snippet, new_snippet)
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('HTML: PWA guide section replaced successfully')
    else:
        old_crlf = old_snippet.replace('\n', '\r\n')
        if old_crlf in html:
            html = html.replace(old_crlf, new_snippet.replace('\n', '\r\n'))
            with open('index.html', 'w', encoding='utf-8') as f:
                f.write(html)
            print('HTML: PWA guide section replaced successfully (CRLF)')
        else:
            print('ERROR: old_snippet not found in index.html')

def patch_js():
    with open('js/app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    js_target = '  // Cartel oficial imprimible'
    js_addition = '''  // PWA Tabs y Evento de Instalación
  const pwaTabAndroid = document.getElementById("pwa-tab-android");
  const pwaTabIos = document.getElementById("pwa-tab-ios");
  const pwaCardAndroid = document.getElementById("pwa-card-android");
  const pwaCardIos = document.getElementById("pwa-card-ios");

  if (pwaTabAndroid && pwaTabIos) {
    pwaTabAndroid.addEventListener("click", () => {
      pwaTabAndroid.classList.add("active");
      pwaTabIos.classList.remove("active");
      pwaTabAndroid.setAttribute("aria-selected", "true");
      pwaTabIos.setAttribute("aria-selected", "false");
      if (pwaCardAndroid) pwaCardAndroid.style.display = "flex";
      if (pwaCardIos) pwaCardIos.style.display = "none";
    });

    pwaTabIos.addEventListener("click", () => {
      pwaTabIos.classList.add("active");
      pwaTabAndroid.classList.remove("active");
      pwaTabIos.setAttribute("aria-selected", "true");
      pwaTabAndroid.setAttribute("aria-selected", "false");
      if (pwaCardIos) pwaCardIos.style.display = "flex";
      if (pwaCardAndroid) pwaCardAndroid.style.display = "none";
    });

    // Autodetectar dispositivo del usuario al abrir
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIos) {
      pwaTabIos.click();
    }
  }

  // Soporte de instalación nativa 1-clic si el navegador lo permite
  const btnDirectInstall = document.getElementById("btn-pwa-direct-install");
  if (btnDirectInstall) {
    btnDirectInstall.addEventListener("click", () => {
      if (window._orceraDeferredPrompt) {
        window._orceraDeferredPrompt.prompt();
        window._orceraDeferredPrompt.userChoice.then((choice) => {
          if (choice.outcome === "accepted") {
            showToast("¡App Instalada!", "El III Plan ya está en tu pantalla de inicio.");
          }
          window._orceraDeferredPrompt = null;
          const row = document.getElementById("pwa-auto-install-row");
          if (row) row.style.display = "none";
        });
      } else {
        showToast("Instalación Asistida", "Sigue los sencillos pasos indicados abajo según tu tipo de móvil.");
      }
    });
  }

  '''

    if js_target in js and 'pwaTabAndroid' not in js:
        js = js.replace(js_target, js_addition + js_target)
        # Also register window beforeinstallprompt at top or in js
        pwa_listener = '''
// Escuchar evento de instalación nativa en dispositivos compatibles
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window._orceraDeferredPrompt = e;
  const row = document.getElementById("pwa-auto-install-row");
  if (row) row.style.display = "block";
});
'''
        js = pwa_listener + js
        with open('js/app.js', 'w', encoding='utf-8') as f:
            f.write(js)
        print('JS: PWA logic added successfully')
    else:
        print('JS: target found or already patched')

if __name__ == '__main__':
    patch_css()
    patch_html()
    patch_js()
