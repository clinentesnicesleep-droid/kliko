
// ==============================================================================
// GESTOR GLOBAL DE INSTALACIÓN PWA (1-CLIC NATIVO)
// ==============================================================================
window._orceraDeferredPrompt = window._orceraDeferredPrompt || null;

const syncInstallUI = () => {
  const banner = document.getElementById("pwa-quick-install-banner");
  if (banner) banner.style.display = "flex";

  const btnInstall = document.getElementById("btn-install-app");
  if (btnInstall) btnInstall.classList.add("btn-install-highlight");
};

if (window._orceraDeferredPrompt) {
  syncInstallUI();
}

window.addEventListener("orcera-pwa-ready", syncInstallUI);

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window._orceraDeferredPrompt = e;
  syncInstallUI();
});

window.addEventListener("appinstalled", () => {
  window._orceraDeferredPrompt = null;
  const banner = document.getElementById("pwa-quick-install-banner");
  if (banner) banner.style.display = "none";
  const btnInstall = document.getElementById("btn-install-app");
  if (btnInstall) btnInstall.style.display = "none";
  if (typeof showToast === "function") {
    showToast("¡KLIKO Instalada!", "La aplicación ya está en tu pantalla de inicio.");
  }
});
/**
 * III PLAN MUNICIPAL DE JUVENTUD DE ORCERA (2027-2031)
 * APLICACIÓN INTERACTIVA Y PARTICIPATIVA
 * Lógica de cliente, estado reactivo, cálculo de presupuestos y gamificación.
 */

// 1. BASE DE DATOS LOCAL OFICIAL DE LOS 7 EJES
// Los 7 Ejes, 21 Objetivos Específicos, 63 Acciones Oficiales y 378 Indicadores Oficiales
// se cargan rigurosamente desde js/data-ejes.js
if (typeof EJES_DATA === 'undefined') {
  console.error("EJES_DATA no está cargado. Asegúrate de incluir js/data-ejes.js antes de js/app.js");
}

// 2. CATÁLOGO DE RECOMPENSAS CIVICAS
const RECOMPENSAS_DATA = [
  {
    id: 0,
    titulo: "Alta Oficial Gratuita · Asociación Juvenil de Orcera",
    descripcion: "Recompensa de bienvenida del III Plan: Carnet digital de socio/a, voz y voto en asambleas, y acceso preferente a actividades.",
    costePuntos: 0,
    icono: "🤝",
    categoria: "rw-amurjo",
    badge: "🎁 Gratis por Registro",
    esAltaAsociacion: true
  },
  {
    id: 1,
    titulo: "Pase de 1 Día · Piscina Municipal de Amurjo",
    descripcion: "Disfruta de la piscina natural más grande de Europa en plena Sierra de Segura.",
    costePuntos: 200,
    icono: "🏊‍♂️",
    categoria: "rw-amurjo",
    badge: "Más Popular"
  },
  {
    id: 2,
    titulo: "Abono 1 Mes Pistas de Pádel / Gimnasio Orcera",
    descripcion: "Acceso ilimitado a las pistas municipales reservando desde la app.",
    costePuntos: 450,
    icono: "🎾",
    categoria: "rw-gym",
    badge: "Deporte"
  },
  {
    id: 3,
    titulo: "Plaza Preferente en Curso DJ / Producción Musical",
    descripcion: "Reserva garantizada de plaza y uso del equipamiento del Espacio Joven.",
    costePuntos: 350,
    icono: "🎧",
    categoria: "rw-tech",
    badge: "Cultura"
  },
  {
    id: 4,
    titulo: "Pack Merchandising Oficial KLIKO (Sudadera + Botella)",
    descripcion: "Sudadera de algodón orgánico con el logo oficial KLIKO y botella térmica.",
    costePuntos: 300,
    icono: "🎒",
    categoria: "rw-gym",
    badge: "Eco"
  },
  {
    id: 5,
    titulo: "Bono Especial Auditor/a Joven · Evaluación 2027",
    descripcion: "Recompensa del Ayuntamiento de Orcera por evaluar las medidas del III Plan: Pase gratuito doble para la Piscina de Amurjo e Insignia Cívica Oficial.",
    costePuntos: 150,
    icono: "⭐",
    categoria: "rw-amurjo",
    badge: "🗳️ Misión Ciudadana",
    esEvaluacionPrevia: true
  }
];

// 3. PROPUESTAS INICIALES DEL BUZÓN COMUNITARIO
let propuestasComunitarias = [
  {
    id: 1,
    autor: "Alejandro M. (21 años)",
    ejeId: 2,
    ejeNombre: "Eje 2: Ocio y Cultura",
    titulo: "Torneo Nocturno de Vóley-Playa en Amurjo con DJ",
    descripcion: "Aprovechar la iluminación nocturna de la piscina de Amurjo en julio para hacer un torneo comarcal de vóley mixto amenizado por jóvenes DJs locales.",
    ubicacion: "Piscina Municipal de Amurjo",
    votos: 34,
    apoyadaPorUsuario: true,
    estado: "Admitida para Pleno Joven"
  },
  {
    id: 2,
    autor: "Lucía F. (19 años)",
    ejeId: 1,
    ejeNombre: "Eje 1: Entorno Sostenible",
    titulo: "Taller Práctico de Reparación de Bicis de Montaña (MTB)",
    descripcion: "Instalar un punto de herramientas comunitarias en el pueblo y enseñar a ajustar frenos y cambios para no tener que bajar a Jaén o Úbeda.",
    ubicacion: "Polideportivo Municipal",
    votos: 21,
    apoyadaPorUsuario: false,
    estado: "En Votación (Faltan 4 apoyos)"
  },
  {
    id: 3,
    autor: "Carlos N. (26 años)",
    ejeId: 3,
    ejeNombre: "Eje 3: Empleo y Vivienda",
    titulo: "Feria de Teletrabajo y Conexión para Nómadas Digitales",
    descripcion: "Organizar un fin de semana invitando a jóvenes profesionales a conocer las ventajas de vivir y teletrabajar desde Orcera.",
    ubicacion: "Espacio Digital Joven",
    votos: 28,
    apoyadaPorUsuario: false,
    estado: "Admitida para Pleno Joven"
  }
];

// 4. ESTADO DE LA APLICACIÓN
const AppState = {
  activeTab: "tab-plan",
  activeEjeId: 1,
  activeEjeSubtab: "subtab-acciones",
  selectedCronogramaYear: 2027,
  selectedActionYear: "quinquenal", // "quinquenal" o "2027", "2028", "2029", "2030", "2031"
  selectedActionDuration: "todas",
  selectedIndFilter: "todas", // "todas", "1_ano", "2_anos", "3_anos", "4_anos", "5_anos"
  selectedEvaluationYear: 2027, // 2027, 2028, 2029, 2030, 2031
  userPoints: 290,
  userLevel: "Nivel 2: Activista de la Sierra",
  currentUser: null,
  registeredUsers: [],
  isFreeMode: false,
  currentTheme: "dark"
};

// 5. INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  if (window.KlikoDB) {
    window.KlikoDB.init();
  }
  initUserSession();
  initAdminPanel();
  initClock();
  initTheme();
  initDeviceToggle();
  initNavigation();
  initStories();
  initAccordion();
  initEjesModule();
  initGamification();
  initBuzon();
  updateGlobalBentoKPIs();
  initEuPoliciesModal();
  initPWAInstallSystem();
  initEvaluacionPrevia();

  // Soporte para deep-linking / captura de vistas móviles
  const params = new URLSearchParams(window.location.search);
  const reqTab = params.get("tab");
  if (reqTab) {
    setTimeout(() => {
      const tabBtn = document.querySelector(`.tab-btn[data-tab="${reqTab}"]`);
      if (tabBtn) tabBtn.click();
    }, 100);
  }
  if (params.get("clean") === "1") {
    const tb = document.querySelector(".app-top-toolbar");
    if (tb) tb.style.display = "none";
    const fw = document.getElementById("frame-wrapper");
    if (fw) {
      fw.style.padding = "10px 0";
      fw.style.margin = "0";
    }
    document.body.style.background = "#0f172a";
  }
  if (params.get("modal") === "asociacion") {
    setTimeout(() => {
      const btnAsoc = document.getElementById("btn-open-asociacion-form");
      if (btnAsoc) btnAsoc.click();
    }, 300);
  }
  if (params.get("modal") === "promo") {
    setTimeout(() => {
      openPromoShareModal();
      if (params.get("qr") === "1") {
        const qrBox = document.getElementById("promo-qr-box");
        if (qrBox) qrBox.style.display = "block";
      }
    }, 300);
  }
  if (params.get("modal") === "poster") {
    setTimeout(() => {
      openPosterModal();
    }, 300);
  }
});

// Reloj dinámico en status bar
function initClock() {
  const clockEl = document.getElementById("status-clock");
  if (!clockEl) return;
  const update = () => {
    const d = new Date();
    clockEl.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  update();
  setInterval(update, 30000);
}

// Conmutador de tema claro/oscuro
function initTheme() {
  const toggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  
  toggleBtn.addEventListener("click", () => {
    AppState.currentTheme = AppState.currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", AppState.currentTheme);
    themeIcon.textContent = AppState.currentTheme === "dark" ? "🌙" : "☀️";
  });
}

// Conmutador de modo marco smartphone / pantalla libre
function initDeviceToggle() {
  const btn = document.getElementById("toggle-device-view");
  const wrapper = document.getElementById("frame-wrapper");
  if (!btn || !wrapper) return;
  btn.addEventListener("click", () => {
    AppState.isFreeMode = !AppState.isFreeMode;
    const txt = btn.querySelector(".btn-text") || btn.querySelector(".btn-action-label");
    if (AppState.isFreeMode) {
      wrapper.classList.add("free-mode");
      if (txt) txt.textContent = "Móvil";
      btn.title = "Volver a marco de smartphone";
      btn.classList.add("active");
    } else {
      wrapper.classList.remove("free-mode");
      if (txt) txt.textContent = "Libre";
      btn.title = "Alternar a pantalla completa libre";
      btn.classList.remove("active");
    }
  });
}

// Navegación entre pestañas superiores e inferiores
function initNavigation() {
  const topTabs = document.querySelectorAll(".tab-btn");
  const bottomNavItems = document.querySelectorAll(".bottom-tab-bar .nav-item");
  const panels = document.querySelectorAll(".tab-panel");

  function switchTab(tabId) {
    AppState.activeTab = tabId;
    
    // Actualizar botones
    topTabs.forEach(b => b.classList.toggle("active", b.getAttribute("data-tab") === tabId));
    bottomNavItems.forEach(b => b.classList.toggle("active", b.getAttribute("data-target") === tabId));

    // Mostrar panel correspondiente
    panels.forEach(p => p.classList.toggle("active", p.id === tabId));
    
    // Scroll arriba suave en el viewport móvil
    document.getElementById("mobile-viewport").scrollTo({ top: 0, behavior: "smooth" });
  }

  topTabs.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.getAttribute("data-tab")));
  });

  bottomNavItems.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.getAttribute("data-target")));
  });

  // Atajo al tocar píldora de puntos
  const pointsPill = document.getElementById("gamification-trigger");
  if (pointsPill) {
    pointsPill.addEventListener("click", () => switchTab("tab-gamificacion"));
  }
}

// BASE DE DATOS DE CONSULTAS EXPRÉS (STORIES FORMATO INSTAGRAM)
const STORIES_DATA = {
  "amurjo-fest": {
    icono: "🏊‍♂️",
    categoria: "CONSULTA VINCULANTE · AMURJO",
    titulo: "Fiesta Nocturna en Amurjo 2027",
    desc: "El Ayuntamiento programa una noche de baño y música en Amurjo. ¿Qué horario y ambiente prefieres?",
    opcionA: "🌅 Atardecer & Chill-out (20:30h)",
    votosA: 84,
    opcionB: "🎧 Sesión DJ & Fiesta Nocturna (23:00h)",
    votosB: 142
  },
  "talleres-dj": {
    icono: "🎧",
    categoria: "ESPACIO DIGITAL JOVEN",
    titulo: "Horario del Taller de DJ y Producción",
    desc: "Queremos que nadie se quede fuera por estudios o trabajo. ¿Qué turno se adapta mejor a ti?",
    opcionA: "Viernes Tarde (18:30h)",
    votosA: 78,
    opcionB: "Sábados Mediodía (12:00h)",
    votosB: 65
  },
  "presupuestos-expr": {
    icono: "🗳️",
    categoria: "PRESUPUESTO PARTICIPATIVO",
    titulo: "¿Dónde invertimos 1.000 € este año?",
    desc: "Tú decides directamente el destino de la partida participativa del III Plan en Orcera:",
    opcionA: "🧗 Rocódromo Portátil en Amurjo",
    votosA: 112,
    opcionB: "🎮 Zona Gaming en Espacio Joven",
    votosB: 94
  },
  "voluntariado": {
    icono: "🌲",
    categoria: "MEDIO AMBIENTE & PARQUE NATURAL",
    titulo: "Próxima Batida Verde Juvenil",
    desc: "¿Qué entorno de nuestro pueblo necesita una jornada prioritaria de limpieza y recuperación?",
    opcionA: "🌿 Senderos Históricos y Pinar",
    votosA: 95,
    opcionB: "💧 Ribera del Río y Área Recreativa",
    votosB: 62
  },
  "telecentro": {
    icono: "💻",
    categoria: "CONECTIVIDAD & TELETRABAJO",
    titulo: "Equipamiento del Telecentro 24h",
    desc: "Orcera habilitará puestos de trabajo remoto con 1 Gbps para jóvenes. ¿Qué equipamiento priorizamos?",
    opcionA: "🖥️ Pantallas 4K y Puestos Coworking",
    votosA: 88,
    opcionB: "🎙️ Estudio Podcast y Creación Multimedia",
    votosB: 71
  }
};

let votedStories = new Set();

// Historias interactivas (Consultas exprés tipo stories de Instagram)
function initStories() {
  const stories = document.querySelectorAll(".story-item");
  stories.forEach(story => {
    story.addEventListener("click", () => {
      const type = story.getAttribute("data-story");
      openStoryModal(type);
    });
  });

  const closeBtn = document.getElementById("close-story-modal");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeStoryModal);
  }
}

function openStoryModal(storyKey) {
  const data = STORIES_DATA[storyKey];
  if (!data) return;

  const modal = document.getElementById("story-modal");
  const iconEl = document.getElementById("story-icon");
  const catEl = document.getElementById("story-category");
  const titleEl = document.getElementById("story-modal-title");
  const descEl = document.getElementById("story-modal-desc");
  const optionsWrap = document.getElementById("story-options-container");
  const progressFill = document.getElementById("story-progress-fill");

  if (!modal) return;

  iconEl.textContent = data.icono;
  catEl.textContent = data.categoria;
  titleEl.textContent = data.titulo;
  descEl.textContent = data.desc;

  // Reiniciar barra de tiempo
  if (progressFill) {
    progressFill.style.animation = 'none';
    progressFill.offsetHeight; // trigger reflow
    progressFill.style.animation = 'storyTimer 10s linear forwards';
  }

  const alreadyVoted = votedStories.has(storyKey);
  const total = data.votosA + data.votosB;
  const pctA = Math.round((data.votosA / (total || 1)) * 100);
  const pctB = 100 - pctA;

  optionsWrap.innerHTML = `
    <button class="story-opt-btn ${alreadyVoted ? 'voted-btn' : ''}" data-choice="A" ${alreadyVoted ? 'disabled' : ''}>
      <div class="story-opt-bar" style="width: ${alreadyVoted ? pctA + '%' : '0%'};"></div>
      <span class="story-opt-text">${data.opcionA}</span>
      <span class="story-opt-pct" style="${alreadyVoted ? 'display:inline' : 'display:none'}">${pctA}%</span>
    </button>
    <button class="story-opt-btn ${alreadyVoted ? 'voted-btn' : ''}" data-choice="B" ${alreadyVoted ? 'disabled' : ''}>
      <div class="story-opt-bar" style="width: ${alreadyVoted ? pctB + '%' : '0%'};"></div>
      <span class="story-opt-text">${data.opcionB}</span>
      <span class="story-opt-pct" style="${alreadyVoted ? 'display:inline' : 'display:none'}">${pctB}%</span>
    </button>
  `;

  if (!alreadyVoted) {
    optionsWrap.querySelectorAll(".story-opt-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const choice = btn.getAttribute("data-choice");
        if (choice === "A") data.votosA++;
        else data.votosB++;

        votedStories.add(storyKey);

        const newTotal = data.votosA + data.votosB;
        const newPctA = Math.round((data.votosA / newTotal) * 100);
        const newPctB = 100 - newPctA;

        // Actualizar visualmente opciones
        const btns = optionsWrap.querySelectorAll(".story-opt-btn");
        btns[0].classList.add("voted-btn");
        btns[0].querySelector(".story-opt-bar").style.width = newPctA + "%";
        btns[0].querySelector(".story-opt-pct").style.display = "inline";
        btns[0].querySelector(".story-opt-pct").textContent = newPctA + "%";

        btns[1].classList.add("voted-btn");
        btns[1].querySelector(".story-opt-bar").style.width = newPctB + "%";
        btns[1].querySelector(".story-opt-pct").style.display = "inline";
        btns[1].querySelector(".story-opt-pct").textContent = newPctB + "%";

        btns.forEach(b => b.disabled = true);

        rewardPoints(20, `¡Voto registrado en: "${data.titulo}"!`);
      });
    });
  }

  modal.classList.add("active");
}

function closeStoryModal() {
  const modal = document.getElementById("story-modal");
  if (modal) modal.classList.remove("active");
}

// Acordeón interactivo del Módulo 1 "Descubre el Plan"
function initAccordion() {
  const items = document.querySelectorAll(".accordion-item");
  
  // Abrir el primer punto por defecto para facilitar el onboarding
  if (items.length > 0) {
    items[0].classList.add("open");
    items[0].querySelector(".accordion-header").setAttribute("aria-expanded", "true");
  }

  items.forEach(item => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      
      // Cerrar otros para que sea estilo acordeón limpio
      items.forEach(other => {
        other.classList.remove("open");
        other.querySelector(".accordion-header").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        header.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// ==============================================================================
// MÓDULO 2: GESTIÓN DE LOS 7 EJES EN ACCIÓN (CAMPOS TÉCNICOS INTERACTIVOS)
// ==============================================================================
function initEjesModule() {
  renderEjesSlider();
  renderEjeDetail(AppState.activeEjeId);
}

// Renderizar la barra deslizante de selección de ejes
function renderEjesSlider() {
  const container = document.getElementById("ejes-pill-slider");
  if (!container) return;

  container.innerHTML = EJES_DATA.map(eje => `
    <button class="eje-selector-chip ${eje.id === AppState.activeEjeId ? 'active' : ''}" data-eje-id="${eje.id}">
      <span>${eje.icono}</span>
      <span>Eje ${eje.numero}</span>
    </button>
  `).join("");

  container.querySelectorAll(".eje-selector-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-eje-id"));
      AppState.activeEjeId = id;
      
      container.querySelectorAll(".eje-selector-chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      renderEjeDetail(id);
    });
  });
}

// Renderizar el bloque de calendario trimestral para un año específico
function renderQuarterCalendar(eje, year) {
  const yr = parseInt(year) || 2027;
  const yearData = (eje.cronograma.porAno && eje.cronograma.porAno[yr]) || {
    enfoque: "Planificación anual estratégica",
    trimestres: eje.cronograma.trimestres || {}
  };

  return `
    <div class="calendar-year-header" style="margin: 14px 0 10px; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px;">
      <h5 style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); margin: 0;">
        Calendario Detallado Anual ${yr} (Trimestre a Trimestre)
      </h5>
      ${yearData.enfoque ? `
        <span class="year-enfoque-badge" style="font-size: 0.72rem; color: var(--amurjo-cyan); background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.25); padding: 3px 8px; border-radius: 4px; font-weight: 600;">
          🎯 ${yearData.enfoque}
        </span>
      ` : ''}
    </div>
    <div class="calendar-quarter-view">
      ${Object.entries(yearData.trimestres).map(([qKey, events]) => `
        <div class="quarter-card">
          <div class="quarter-title">${qKey} ${yr}</div>
          <ul class="quarter-events">
            ${events.map(ev => `<li>• ${ev}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    </div>
  `;
}

// ==============================================================================
// METADATOS TÉCNICOS: DURACIÓN REAL, AÑOS DE DESARROLLO E INDICADORES (63 ACCIONES)
// ==============================================================================
const ACTION_METADATA = {
  // EJE 1: Entorno Sostenible, Digital y Conectado
  "ACC-1.1.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-1.2" },
  "ACC-1.1.2": { duracion: "3 años (2027–2029)", duracionTipo: "3_anos", anos: [2027, 2028, 2029], indRef: "IND-1.2" },
  "ACC-1.1.3": { duracion: "2 años (2028–2029)", duracionTipo: "2_anos", anos: [2028, 2029], indRef: "IND-1.2" },
  "ACC-1.2.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-1.1" },
  "ACC-1.2.2": { duracion: "3 años (2027–2029)", duracionTipo: "3_anos", anos: [2027, 2028, 2029], indRef: "IND-1.1" },
  "ACC-1.2.3": { duracion: "4 años (2027–2030)", duracionTipo: "4_anos", anos: [2027, 2028, 2029, 2030], indRef: "IND-1.1" },
  "ACC-1.3.1": { duracion: "1 año (2027)", duracionTipo: "1_ano", anos: [2027], indRef: "IND-1.3" },
  "ACC-1.3.2": { duracion: "1 año (2027)", duracionTipo: "1_ano", anos: [2027], indRef: "IND-1.3" },
  "ACC-1.3.3": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-1.3" },

  // EJE 2: Ocio, Cultura, Deporte y Vida Saludable
  "ACC-2.1.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-2.1" },
  "ACC-2.1.2": { duracion: "3 años (2027–2029)", duracionTipo: "3_anos", anos: [2027, 2028, 2029], indRef: "IND-2.3" },
  "ACC-2.1.3": { duracion: "4 años (2028–2031)", duracionTipo: "4_anos", anos: [2028, 2029, 2030, 2031], indRef: "IND-2.1" },
  "ACC-2.2.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-2.2" },
  "ACC-2.2.2": { duracion: "4 años (2027–2030)", duracionTipo: "4_anos", anos: [2027, 2028, 2029, 2030], indRef: "IND-2.2" },
  "ACC-2.2.3": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-2.2" },
  "ACC-2.3.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-2.3" },
  "ACC-2.3.2": { duracion: "2 años (2028–2029)", duracionTipo: "2_anos", anos: [2028, 2029], indRef: "IND-2.3" },
  "ACC-2.3.3": { duracion: "2 años (2027–2028)", duracionTipo: "2_anos", anos: [2027, 2028], indRef: "IND-2.3" },

  // EJE 3: Emancipación, Empleo Joven y Retorno del Talento
  "ACC-3.1.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-3.1" },
  "ACC-3.1.2": { duracion: "4 años (2027–2030)", duracionTipo: "4_anos", anos: [2027, 2028, 2029, 2030], indRef: "IND-3.1" },
  "ACC-3.1.3": { duracion: "3 años (2028–2030)", duracionTipo: "3_anos", anos: [2028, 2029, 2030], indRef: "IND-3.1" },
  "ACC-3.2.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-3.2" },
  "ACC-3.2.2": { duracion: "4 años (2028–2031)", duracionTipo: "4_anos", anos: [2028, 2029, 2030, 2031], indRef: "IND-3.2" },
  "ACC-3.2.3": { duracion: "1 año (2027)", duracionTipo: "1_ano", anos: [2027], indRef: "IND-3.2" },
  "ACC-3.3.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-3.3" },
  "ACC-3.3.2": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-3.3" },
  "ACC-3.3.3": { duracion: "2 años (2027–2028)", duracionTipo: "2_anos", anos: [2027, 2028], indRef: "IND-3.3" },

  // EJE 4: Educación, Formación Continua y Liderazgo
  "ACC-4.1.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-4.1" },
  "ACC-4.1.2": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-4.1" },
  "ACC-4.1.3": { duracion: "3 años (2027–2029)", duracionTipo: "3_anos", anos: [2027, 2028, 2029], indRef: "IND-4.1" },
  "ACC-4.2.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-4.2" },
  "ACC-4.2.2": { duracion: "4 años (2028–2031)", duracionTipo: "4_anos", anos: [2028, 2029, 2030, 2031], indRef: "IND-4.2" },
  "ACC-4.2.3": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-4.2" },
  "ACC-4.3.1": { duracion: "3 años (2027–2029)", duracionTipo: "3_anos", anos: [2027, 2028, 2029], indRef: "IND-4.3" },
  "ACC-4.3.2": { duracion: "2 años (2028–2029)", duracionTipo: "2_anos", anos: [2028, 2029], indRef: "IND-4.3" },
  "ACC-4.3.3": { duracion: "2 años (2029–2030)", duracionTipo: "2_anos", anos: [2029, 2030], indRef: "IND-4.3" },

  // EJE 5: Igualdad, Diversidad, Inclusión y Bienestar Emocional
  "ACC-5.1.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-5.1" },
  "ACC-5.1.2": { duracion: "4 años (2027–2030)", duracionTipo: "4_anos", anos: [2027, 2028, 2029, 2030], indRef: "IND-5.1" },
  "ACC-5.1.3": { duracion: "2 años (2027–2028)", duracionTipo: "2_anos", anos: [2027, 2028], indRef: "IND-5.1" },
  "ACC-5.2.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-5.2" },
  "ACC-5.2.2": { duracion: "3 años (2027–2029)", duracionTipo: "3_anos", anos: [2027, 2028, 2029], indRef: "IND-5.2" },
  "ACC-5.2.3": { duracion: "1 año (2027)", duracionTipo: "1_ano", anos: [2027], indRef: "IND-5.2" },
  "ACC-5.3.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-5.3" },
  "ACC-5.3.2": { duracion: "1 año (2028)", duracionTipo: "1_ano", anos: [2028], indRef: "IND-5.3" },
  "ACC-5.3.3": { duracion: "2 años (2029–2030)", duracionTipo: "2_anos", anos: [2029, 2030], indRef: "IND-5.3" },

  // EJE 6: Participación Activa, Asociacionismo y Gobernanza Juvenil
  "ACC-6.1.1": { duracion: "1 año (2027)", duracionTipo: "1_ano", anos: [2027], indRef: "IND-6.2" },
  "ACC-6.1.2": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-6.2" },
  "ACC-6.1.3": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-6.2" },
  "ACC-6.2.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-6.1" },
  "ACC-6.2.2": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-6.1" },
  "ACC-6.2.3": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-6.1" },
  "ACC-6.3.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-6.3" },
  "ACC-6.3.2": { duracion: "3 años (2027–2029)", duracionTipo: "3_anos", anos: [2027, 2028, 2029], indRef: "IND-6.3" },
  "ACC-6.3.3": { duracion: "2 años (2028–2029)", duracionTipo: "2_anos", anos: [2028, 2029], indRef: "IND-6.3" },

  // EJE 7: Comunicación, Transparencia e Información Juvenil
  "ACC-7.1.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-7.1" },
  "ACC-7.1.2": { duracion: "4 años (2027–2030)", duracionTipo: "4_anos", anos: [2027, 2028, 2029, 2030], indRef: "IND-7.1" },
  "ACC-7.1.3": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-7.1" },
  "ACC-7.2.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-7.2" },
  "ACC-7.2.2": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-7.2" },
  "ACC-7.2.3": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-7.2" },
  "ACC-7.3.1": { duracion: "Quinquenal (Todo el Plan)", duracionTipo: "5_anos", anos: [2027, 2028, 2029, 2030, 2031], indRef: "IND-7.3" },
  "ACC-7.3.2": { duracion: "2 años (2027–2028)", duracionTipo: "2_anos", anos: [2027, 2028], indRef: "IND-7.3" },
  "ACC-7.3.3": { duracion: "4 años (2028–2031)", duracionTipo: "4_anos", anos: [2028, 2029, 2030, 2031], indRef: "IND-7.3" }
};

// ==============================================================================
// SISTEMA OFICIAL DE INDICADORES (METAS Y RESULTADOS POR AÑO)
// ==============================================================================
const EJES_INDICADORES_DATA = {
  1: [
    {
      codigo: "IND-1.1",
      nombre: "Participantes únicos en voluntariado y conservación verde",
      oeVinculado: "OE-1.2",
      unidad: "jóvenes",
      metaQuinquenal: 120,
      actualQuinquenal: 115,
      cumplimiento: 95.8,
      valoresPorAno: {
        2027: { meta: 24, conseguido: 26, pct: 108.3 },
        2028: { meta: 48, conseguido: 47, pct: 97.9 },
        2029: { meta: 72, conseguido: 71, pct: 98.6 },
        2030: { meta: 96, conseguido: 95, pct: 98.9 },
        2031: { meta: 120, conseguido: 115, pct: 95.8 }
      }
    },
    {
      codigo: "IND-1.2",
      nombre: "Jóvenes capacitados en competencias digitales e IA",
      oeVinculado: "OE-1.1",
      unidad: "certificados",
      metaQuinquenal: 80,
      actualQuinquenal: 84,
      cumplimiento: 105.0,
      valoresPorAno: {
        2027: { meta: 16, conseguido: 18, pct: 112.5 },
        2028: { meta: 32, conseguido: 35, pct: 109.3 },
        2029: { meta: 48, conseguido: 50, pct: 104.1 },
        2030: { meta: 64, conseguido: 68, pct: 106.2 },
        2031: { meta: 80, conseguido: 84, pct: 105.0 }
      }
    },
    {
      codigo: "IND-1.3",
      nombre: "Usuarios activos del Espacio Digital y Telecentro",
      oeVinculado: "OE-1.3",
      unidad: "usuarios únicos",
      metaQuinquenal: 150,
      actualQuinquenal: 146,
      cumplimiento: 97.3,
      valoresPorAno: {
        2027: { meta: 30, conseguido: 32, pct: 106.6 },
        2028: { meta: 60, conseguido: 58, pct: 96.6 },
        2029: { meta: 90, conseguido: 89, pct: 98.8 },
        2030: { meta: 120, conseguido: 118, pct: 98.3 },
        2031: { meta: 150, conseguido: 146, pct: 97.3 }
      }
    }
  ],
  2: [
    {
      codigo: "IND-2.1",
      nombre: "Asistentes a eventos de ocio nocturno alternativo",
      oeVinculado: "OE-2.1",
      unidad: "asistencias/año",
      metaQuinquenal: 250,
      actualQuinquenal: 265,
      cumplimiento: 106.0,
      valoresPorAno: {
        2027: { meta: 50, conseguido: 55, pct: 110.0 },
        2028: { meta: 100, conseguido: 108, pct: 108.0 },
        2029: { meta: 150, conseguido: 162, pct: 108.0 },
        2030: { meta: 200, conseguido: 215, pct: 107.5 },
        2031: { meta: 250, conseguido: 265, pct: 106.0 }
      }
    },
    {
      codigo: "IND-2.2",
      nombre: "Participantes en torneos de Amurjo y multiaventura",
      oeVinculado: "OE-2.2",
      unidad: "jóvenes",
      metaQuinquenal: 180,
      actualQuinquenal: 175,
      cumplimiento: 97.2,
      valoresPorAno: {
        2027: { meta: 36, conseguido: 38, pct: 105.5 },
        2028: { meta: 72, conseguido: 70, pct: 97.2 },
        2029: { meta: 108, conseguido: 106, pct: 98.1 },
        2030: { meta: 144, conseguido: 140, pct: 97.2 },
        2031: { meta: 180, conseguido: 175, pct: 97.2 }
      }
    },
    {
      codigo: "IND-2.3",
      nombre: "Jóvenes creadores apoyados en la convocatoria Talento",
      oeVinculado: "OE-2.3",
      unidad: "artistas",
      metaQuinquenal: 35,
      actualQuinquenal: 36,
      cumplimiento: 102.8,
      valoresPorAno: {
        2027: { meta: 7, conseguido: 8, pct: 114.2 },
        2028: { meta: 14, conseguido: 15, pct: 107.1 },
        2029: { meta: 21, conseguido: 22, pct: 104.7 },
        2030: { meta: 28, conseguido: 29, pct: 103.5 },
        2031: { meta: 35, conseguido: 36, pct: 102.8 }
      }
    }
  ],
  3: [
    {
      codigo: "IND-3.1",
      nombre: "Asesoramientos laborales personalizados y CV digital",
      oeVinculado: "OE-3.1",
      unidad: "jóvenes atendidos",
      metaQuinquenal: 120,
      actualQuinquenal: 118,
      cumplimiento: 98.3,
      valoresPorAno: {
        2027: { meta: 24, conseguido: 25, pct: 104.1 },
        2028: { meta: 48, conseguido: 49, pct: 102.0 },
        2029: { meta: 72, conseguido: 71, pct: 98.6 },
        2030: { meta: 96, conseguido: 95, pct: 98.9 },
        2031: { meta: 120, conseguido: 118, pct: 98.3 }
      }
    },
    {
      codigo: "IND-3.2",
      nombre: "Proyectos de autoempleo y retorno joven tutorizados",
      oeVinculado: "OE-3.2",
      unidad: "proyectos",
      metaQuinquenal: 25,
      actualQuinquenal: 26,
      cumplimiento: 104.0,
      valoresPorAno: {
        2027: { meta: 5, conseguido: 6, pct: 120.0 },
        2028: { meta: 10, conseguido: 11, pct: 110.0 },
        2029: { meta: 15, conseguido: 16, pct: 106.6 },
        2030: { meta: 20, conseguido: 21, pct: 105.0 },
        2031: { meta: 25, conseguido: 26, pct: 104.0 }
      }
    },
    {
      codigo: "IND-3.3",
      nombre: "Viviendas incorporadas a la Bolsa de Alquiler Joven",
      oeVinculado: "OE-3.3",
      unidad: "viviendas",
      metaQuinquenal: 20,
      actualQuinquenal: 19,
      cumplimiento: 95.0,
      valoresPorAno: {
        2027: { meta: 4, conseguido: 4, pct: 100.0 },
        2028: { meta: 8, conseguido: 8, pct: 100.0 },
        2029: { meta: 12, conseguido: 11, pct: 91.6 },
        2030: { meta: 16, conseguido: 15, pct: 93.7 },
        2031: { meta: 20, conseguido: 19, pct: 95.0 }
      }
    }
  ],
  4: [
    {
      codigo: "IND-4.1",
      nombre: "Usuarios de aula de estudio y becas de transporte",
      oeVinculado: "OE-4.1",
      unidad: "estudiantes",
      metaQuinquenal: 110,
      actualQuinquenal: 112,
      cumplimiento: 101.8,
      valoresPorAno: {
        2027: { meta: 22, conseguido: 24, pct: 109.0 },
        2028: { meta: 44, conseguido: 46, pct: 104.5 },
        2029: { meta: 66, conseguido: 67, pct: 101.5 },
        2030: { meta: 88, conseguido: 90, pct: 102.2 },
        2031: { meta: 110, conseguido: 112, pct: 101.8 }
      }
    },
    {
      codigo: "IND-4.2",
      nombre: "Jóvenes en programas Erasmus+, voluntariado e idiomas",
      oeVinculado: "OE-4.2",
      unidad: "jóvenes",
      metaQuinquenal: 65,
      actualQuinquenal: 63,
      cumplimiento: 96.9,
      valoresPorAno: {
        2027: { meta: 13, conseguido: 14, pct: 107.6 },
        2028: { meta: 26, conseguido: 27, pct: 103.8 },
        2029: { meta: 39, conseguido: 38, pct: 97.4 },
        2030: { meta: 52, conseguido: 50, pct: 96.1 },
        2031: { meta: 65, conseguido: 63, pct: 96.9 }
      }
    },
    {
      codigo: "IND-4.3",
      nombre: "Alumnos formados en Escuela de Liderazgo y Oratoria",
      oeVinculado: "OE-4.3",
      unidad: "graduados",
      metaQuinquenal: 45,
      actualQuinquenal: 47,
      cumplimiento: 104.4,
      valoresPorAno: {
        2027: { meta: 9, conseguido: 10, pct: 111.1 },
        2028: { meta: 18, conseguido: 19, pct: 105.5 },
        2029: { meta: 27, conseguido: 28, pct: 103.7 },
        2030: { meta: 36, conseguido: 38, pct: 105.5 },
        2031: { meta: 45, conseguido: 47, pct: 104.4 }
      }
    }
  ],
  5: [
    {
      codigo: "IND-5.1",
      nombre: "Atenciones en asesoría psicológica y salud emocional",
      oeVinculado: "OE-5.1",
      unidad: "consultas",
      metaQuinquenal: 140,
      actualQuinquenal: 138,
      cumplimiento: 98.5,
      valoresPorAno: {
        2027: { meta: 28, conseguido: 30, pct: 107.1 },
        2028: { meta: 56, conseguido: 57, pct: 101.7 },
        2029: { meta: 84, conseguido: 83, pct: 98.8 },
        2030: { meta: 112, conseguido: 110, pct: 98.2 },
        2031: { meta: 140, conseguido: 138, pct: 98.5 }
      }
    },
    {
      codigo: "IND-5.2",
      nombre: "Participantes en Puntos Violeta y prevención de violencia",
      oeVinculado: "OE-5.2",
      unidad: "jóvenes formados",
      metaQuinquenal: 220,
      actualQuinquenal: 232,
      cumplimiento: 105.4,
      valoresPorAno: {
        2027: { meta: 44, conseguido: 48, pct: 109.0 },
        2028: { meta: 88, conseguido: 94, pct: 106.8 },
        2029: { meta: 132, conseguido: 140, pct: 106.0 },
        2030: { meta: 176, conseguido: 186, pct: 105.6 },
        2031: { meta: 220, conseguido: 232, pct: 105.4 }
      }
    },
    {
      codigo: "IND-5.3",
      nombre: "Asistentes a la Semana de Diversidad y Accesibilidad",
      oeVinculado: "OE-5.3",
      unidad: "participantes",
      metaQuinquenal: 130,
      actualQuinquenal: 128,
      cumplimiento: 98.4,
      valoresPorAno: {
        2027: { meta: 26, conseguido: 28, pct: 107.6 },
        2028: { meta: 52, conseguido: 53, pct: 101.9 },
        2029: { meta: 78, conseguido: 77, pct: 98.7 },
        2030: { meta: 104, conseguido: 102, pct: 98.0 },
        2031: { meta: 130, conseguido: 128, pct: 98.4 }
      }
    }
  ],
  6: [
    {
      codigo: "IND-6.1",
      nombre: "Votos registrados en presupuestos participativos en app",
      oeVinculado: "OE-6.2",
      unidad: "votos anuales",
      metaQuinquenal: 280,
      actualQuinquenal: 295,
      cumplimiento: 105.3,
      valoresPorAno: {
        2027: { meta: 56, conseguido: 62, pct: 110.7 },
        2028: { meta: 112, conseguido: 120, pct: 107.1 },
        2029: { meta: 168, conseguido: 179, pct: 106.5 },
        2030: { meta: 224, conseguido: 238, pct: 106.2 },
        2031: { meta: 280, conseguido: 295, pct: 105.3 }
      }
    },
    {
      codigo: "IND-6.2",
      nombre: "Propuestas debatidas y aprobadas en Plenos Juveniles",
      oeVinculado: "OE-6.1",
      unidad: "mociones",
      metaQuinquenal: 18,
      actualQuinquenal: 19,
      cumplimiento: 105.5,
      valoresPorAno: {
        2027: { meta: 3, conseguido: 4, pct: 133.3 },
        2028: { meta: 7, conseguido: 8, pct: 114.2 },
        2029: { meta: 11, conseguido: 12, pct: 109.0 },
        2030: { meta: 15, conseguido: 16, pct: 106.6 },
        2031: { meta: 18, conseguido: 19, pct: 105.5 }
      }
    },
    {
      codigo: "IND-6.3",
      nombre: "Proyectos autogestionados financiados con ayudas",
      oeVinculado: "OE-6.3",
      unidad: "iniciativas",
      metaQuinquenal: 15,
      actualQuinquenal: 15,
      cumplimiento: 100.0,
      valoresPorAno: {
        2027: { meta: 3, conseguido: 3, pct: 100.0 },
        2028: { meta: 6, conseguido: 6, pct: 100.0 },
        2029: { meta: 9, conseguido: 9, pct: 100.0 },
        2030: { meta: 12, conseguido: 12, pct: 100.0 },
        2031: { meta: 15, conseguido: 15, pct: 100.0 }
      }
    }
  ],
  7: [
    {
      codigo: "IND-7.1",
      nombre: "Usuarios activos en la app móvil KLIKO",
      oeVinculado: "OE-7.1",
      unidad: "usuarios registrados",
      metaQuinquenal: 320,
      actualQuinquenal: 334,
      cumplimiento: 104.3,
      valoresPorAno: {
        2027: { meta: 64, conseguido: 72, pct: 112.5 },
        2028: { meta: 128, conseguido: 140, pct: 109.3 },
        2029: { meta: 192, conseguido: 206, pct: 107.2 },
        2030: { meta: 256, conseguido: 270, pct: 105.4 },
        2031: { meta: 320, conseguido: 334, pct: 104.3 }
      }
    },
    {
      codigo: "IND-7.2",
      nombre: "Facturas y gastos auditados publicados en plazo <72h",
      oeVinculado: "OE-7.2",
      unidad: "% facturas en abierto",
      metaQuinquenal: 100,
      actualQuinquenal: 99.2,
      cumplimiento: 99.2,
      valoresPorAno: {
        2027: { meta: 100, conseguido: 100, pct: 100.0 },
        2028: { meta: 100, conseguido: 100, pct: 100.0 },
        2029: { meta: 100, conseguido: 98.5, pct: 98.5 },
        2030: { meta: 100, conseguido: 99.0, pct: 99.0 },
        2031: { meta: 100, conseguido: 99.2, pct: 99.2 }
      }
    },
    {
      codigo: "IND-7.3",
      nombre: "Consultas atendidas en el Punto de Información Juvenil (PIJ)",
      oeVinculado: "OE-7.3",
      unidad: "consultas",
      metaQuinquenal: 190,
      actualQuinquenal: 195,
      cumplimiento: 102.6,
      valoresPorAno: {
        2027: { meta: 38, conseguido: 42, pct: 110.5 },
        2028: { meta: 76, conseguido: 82, pct: 107.8 },
        2029: { meta: 114, conseguido: 120, pct: 105.2 },
        2030: { meta: 152, conseguido: 158, pct: 103.9 },
        2031: { meta: 190, conseguido: 195, pct: 102.6 }
      }
    }
  ]
};

// ==============================================================================
// SISTEMA OFICIAL DE EVALUACIONES ANUALES Y FINAL DEL PLAN (2027-2031)
// ==============================================================================
const EJES_EVALUACIONES_DATA = {
  1: {
    2027: {
      tipo: "Evaluación Anual 2027",
      subtitulo: "Fase 1 · Arranque e Implantación Inicial",
      dictamen: "Cumplimiento altamente satisfactorio en el ejercicio inaugural con puesta en marcha de las medidas piloto y Espacio Digital.",
      gradoCumplimientoGlobal: 94.6,
      estadoAdmin: "Aprobada por la Comisión Técnica y Pleno Municipal (Diciembre 2027)",
      conclusiones: [
        "Inauguración y acondicionamiento del Espacio Joven y Telecentro completados al 100%.",
        "Alta afluencia en cursos digitales iniciales de IA y primera batida de voluntariado en el Parque Natural.",
        "Acuerdo de Pleno: Incrementar la difusión en aldeas de Orcera para 2028 y consolidar el horario de fin de semana."
      ]
    },
    2028: {
      tipo: "Evaluación Anual 2028",
      subtitulo: "Fase 2 · Consolidación y Escala",
      dictamen: "Crecimiento del 26% en participación juvenil y consolidación de la Red de Custodia Verde.",
      gradoCumplimientoGlobal: 97.2,
      estadoAdmin: "Aprobada en Pleno Municipal (Diciembre 2028)",
      conclusiones: [
        "Ampliación a 45 plazas formativas en ciberseguridad y productividad.",
        "Señalización física de senderos históricos completada en su segundo tramo.",
        "Acuerdo de Pleno: Preparar el salto comarcal en retos tecnológicos e intercambios para 2029."
      ]
    },
    2029: {
      tipo: "Evaluación Intermedia 2029 (Ecuador del Plan)",
      subtitulo: "Fase 3 · Evaluación Intermedia y Extensión Comarcal",
      dictamen: "Auditoría intermedia de medio término favorable. Reajuste presupuestario e incorporación de drones agrícolas.",
      gradoCumplimientoGlobal: 98.4,
      estadoAdmin: "Auditada y Aprobada por Pleno y Consejo Local (Noviembre 2029)",
      conclusiones: [
        "Culminación de las medidas trienales iniciadas en 2027.",
        "Extensión exitosa de convocatorias comarcales con municipios vecinos de la Sierra de Segura.",
        "Acuerdo de Pleno: Reasignación de remanentes presupuestarios hacia el fondo de bioeconomía y comunidades energéticas."
      ]
    },
    2030: {
      tipo: "Evaluación Anual 2030",
      subtitulo: "Fase 4 · Maduración y Autogestión",
      dictamen: "Superación de metas operativas y máxima autonomía de colectivos juveniles orcereños en proyectos ecológicos.",
      gradoCumplimientoGlobal: 101.2,
      estadoAdmin: "Aprobada en Pleno Municipal (Diciembre 2030)",
      conclusiones: [
        "Finalización de las acciones cuatrienales con objetivos plenamente cubiertos.",
        "Brigada Joven de Prevención de Incendios consolidada como referente provincial.",
        "Acuerdo de Pleno: Iniciar la redacción del Libro Blanco y bases para la evaluación final quinquenal."
      ]
    },
    2031: {
      tipo: "Evaluación Final Quinquenal (Cierre III Plan 2027–2031)",
      subtitulo: "Fase 5 · Balance de Impacto Histórico y Transferencia",
      dictamen: "Cumplimiento histórico global del Eje 1 con 102.8% de metas alcanzadas y legado ecológico consolidado.",
      gradoCumplimientoGlobal: 102.8,
      estadoAdmin: "Dictamen Final Institucional y Transferencia al IV Plan (Diciembre 2031)",
      conclusiones: [
        "Las 9 acciones del Eje 1 ejecutadas conforme a su cronograma plurianual con más de 146 usuarios del telecentro.",
        "Huella de carbono municipal reducida y mapa digital interactivo de senderos transferido a Turismo.",
        "Acuerdo de Pleno: Aprobación solemne de la Memoria Quinquenal e integración en el IV Plan de Juventud (2032-2036)."
      ]
    }
  },
  // Generador dinámico para los Ejes 2 a 7 asegurando coherencia al 100%
  2: {
    2027: { tipo: "Evaluación Anual 2027", subtitulo: "Fase 1 · Arranque e Implantación", dictamen: "Excelente respuesta en el arranque del Sunset Fest en Amurjo y torneos gamers.", gradoCumplimientoGlobal: 95.2, estadoAdmin: "Aprobada por Comisión y Pleno", conclusiones: ["Amurjo Sunset Fest congregó a 210 jóvenes.", "Muestra de artes escénicas completada en Q2.", "Acuerdo: Ampliar el torneo deportivo comarcal."] },
    2028: { tipo: "Evaluación Anual 2028", subtitulo: "Fase 2 · Consolidación y Escala", dictamen: "Consolidación de las ligas deportivas de fin de semana e incremento de la participación femenina.", gradoCumplimientoGlobal: 97.5, estadoAdmin: "Aprobada en Pleno", conclusiones: ["Cierre de las medidas bienales 2027-2028.", "Ligas de pádel y vóley con récord de equipos.", "Acuerdo: Consolidar el circuito multiaventura."] },
    2029: { tipo: "Evaluación Intermedia 2029", subtitulo: "Fase 3 · Evaluación Intermedia", dictamen: "Auditoría intermedia superada con un 98.6% de cumplimiento de metas culturales.", gradoCumplimientoGlobal: 98.6, estadoAdmin: "Aprobada en Pleno y Consejo", conclusiones: ["Evaluación intermedia favorable de las ayudas artísticas.", "Extensión comarcal de las actuaciones juveniles.", "Acuerdo: Potenciar la producción musical local."] },
    2030: { tipo: "Evaluación Anual 2030", subtitulo: "Fase 4 · Maduración y Autogestión", dictamen: "El 65% de las actividades de ocio nocturno son cogestionadas por asociaciones juveniles orcereñas.", gradoCumplimientoGlobal: 101.4, estadoAdmin: "Aprobada en Pleno", conclusiones: ["Finalización exitosa de las medidas cuatrienales.", "Gran repercusión del certamen audiovisual de Segura.", "Acuerdo: Diseñar la gala conmemorativa de clausura."] },
    2031: { tipo: "Evaluación Final Quinquenal", subtitulo: "Fase 5 · Impacto Final y Transferencia", dictamen: "Éxito rotundo del modelo de ocio alternativo de Orcera con 265 asistencias medias/año.", gradoCumplimientoGlobal: 103.1, estadoAdmin: "Dictamen Final Institucional", conclusiones: ["Quinquenio cerrado con 9 medidas ejecutadas.", "Amurjo consolidado como epicentro deportivo y de ocio serrano.", "Acuerdo: Transferencia de líneas al IV Plan."] }
  },
  3: {
    2027: { tipo: "Evaluación Anual 2027", subtitulo: "Fase 1 · Arranque e Implantación", dictamen: "Puesta en marcha del Punto de Orientación Laboral y publicación del diagnóstico comarcal.", gradoCumplimientoGlobal: 93.8, estadoAdmin: "Aprobada por Comisión y Pleno", conclusiones: ["25 jóvenes asesorados individualmente en empleo.", "Diagnóstico de vivienda deshabitada completado.", "Acuerdo: Reforzar incentivos al alquiler joven."] },
    2028: { tipo: "Evaluación Anual 2028", subtitulo: "Fase 2 · Consolidación y Escala", dictamen: "Cierre exitoso del plan piloto de vivienda y consolidación de la bolsa de empleo.", gradoCumplimientoGlobal: 96.4, estadoAdmin: "Aprobada en Pleno", conclusiones: ["8 viviendas incorporadas a la bolsa municipal.", "Primeras 11 tutorías de autoempleo aprobadas.", "Acuerdo: Lanzar la feria comarcal de empleo joven."] },
    2029: { tipo: "Evaluación Intermedia 2029", subtitulo: "Fase 3 · Evaluación Intermedia", dictamen: "Auditoría intermedia de emancipación con balance positivo de arraigo poblacional.", gradoCumplimientoGlobal: 98.1, estadoAdmin: "Aprobada en Pleno y Consejo", conclusiones: ["Medidas trienales finalizadas con alta inserción laboral.", "16 proyectos tutorizados en el vivero de empresas.", "Acuerdo: Elevar subvenciones para fianza de alquiler."] },
    2030: { tipo: "Evaluación Anual 2030", subtitulo: "Fase 4 · Maduración y Autogestión", dictamen: "Maduración del programa de retorno: 14 jóvenes empadronados de nuevo en Orcera.", gradoCumplimientoGlobal: 100.8, estadoAdmin: "Aprobada en Pleno", conclusiones: ["Lanzadera de empleo rural con 88% de contrataciones.", "Convenios estables con cooperativas del olivar.", "Acuerdo: Elaborar informe final de impacto demográfico."] },
    2031: { tipo: "Evaluación Final Quinquenal", subtitulo: "Fase 5 · Impacto Final y Transferencia", dictamen: "Balance histórico de emancipación: 118 asesorados y 26 nuevos proyectos de autoempleo.", gradoCumplimientoGlobal: 102.5, estadoAdmin: "Dictamen Final Institucional", conclusiones: ["Freno a la despoblación juvenil certificado en censo.", "Bolsa de alquiler convertida en servicio estructural municipal.", "Acuerdo: Transferir el modelo de empleo al IV Plan."] }
  },
  4: {
    2027: { tipo: "Evaluación Anual 2027", subtitulo: "Fase 1 · Arranque e Implantación", dictamen: "Apertura del Aula de Estudio 24/7 y concesión del 100% de becas de transporte solicitadas.", gradoCumplimientoGlobal: 95.0, estadoAdmin: "Aprobada por Comisión y Pleno", conclusiones: ["24 estudiantes usuarios regulares del aula de estudio.", "Primeros 14 participantes en asesoramiento Erasmus+.", "Acuerdo: Ampliar el club municipal de inglés."] },
    2028: { tipo: "Evaluación Anual 2028", subtitulo: "Fase 2 · Consolidación y Escala", dictamen: "Consolidación de las ayudas de idiomas B1/B2 y récord de alumnos en liderazgo.", gradoCumplimientoGlobal: 97.8, estadoAdmin: "Aprobada en Pleno", conclusiones: ["19 jóvenes formados en debate y oratoria.", "Club de conversación activo con voluntarios internacionales.", "Acuerdo: Extender jornadas de emprendimiento social."] },
    2029: { tipo: "Evaluación Intermedia 2029", subtitulo: "Fase 3 · Evaluación Intermedia", dictamen: "Auditoría intermedia educativa con un 99.1% de metas alcanzadas.", gradoCumplimientoGlobal: 99.1, estadoAdmin: "Aprobada en Pleno y Consejo", conclusiones: ["Finalización exitosa del ciclo trienal de técnicas de estudio.", "67 estudiantes apoyados con bonificaciones de transporte.", "Acuerdo: Impulsar el programa de mentoría intergeneracional."] },
    2030: { tipo: "Evaluación Anual 2030", subtitulo: "Fase 4 · Maduración y Autogestión", dictamen: "Alta tasa de aprobados en oposiciones y titulaciones superiores entre jóvenes del pueblo.", gradoCumplimientoGlobal: 101.5, estadoAdmin: "Aprobada en Pleno", conclusiones: ["50 jóvenes beneficiarios de becas y voluntariados europeos.", "Mentores orcereños liderando talleres formativos.", "Acuerdo: Preparar memoria quinquenal de talento."] },
    2031: { tipo: "Evaluación Final Quinquenal", subtitulo: "Fase 5 · Impacto Final y Transferencia", dictamen: "112 estudiantes becados y 47 graduados en liderazgo juvenil a lo largo del Plan.", gradoCumplimientoGlobal: 103.4, estadoAdmin: "Dictamen Final Institucional", conclusiones: ["Aula de estudio consolidada con 98% de satisfacción.", "Crecimiento del 40% en titulaciones B2 en Orcera.", "Acuerdo: Integrar programas en el IV Plan."] }
  },
  5: {
    2027: { tipo: "Evaluación Anual 2027", subtitulo: "Fase 1 · Arranque e Implantación", dictamen: "Excelente acogida del servicio confidencial de bienestar emocional y Puntos Violeta.", gradoCumplimientoGlobal: 94.8, estadoAdmin: "Aprobada por Comisión y Pleno", conclusiones: ["30 consultas individuales y talleres en el instituto.", "Puntos Violeta activos sin incidentes graves.", "Acuerdo: Programar auditoría de accesibilidad en 2028."] },
    2028: { tipo: "Evaluación Anual 2028", subtitulo: "Fase 2 · Consolidación y Escala", dictamen: "Auditoría de accesibilidad culminada y eliminación de barreras en edificios públicos.", gradoCumplimientoGlobal: 97.4, estadoAdmin: "Aprobada en Pleno", conclusiones: ["Auditoría de accesibilidad aprobada y ejecutada.", "94 jóvenes formados en relaciones afectivas sanas.", "Acuerdo: Consolidar la Semana de Diversidad Rural."] },
    2029: { tipo: "Evaluación Intermedia 2029", subtitulo: "Fase 3 · Evaluación Intermedia", dictamen: "Reducción significativa de estigmas en salud mental según barómetro participativo.", gradoCumplimientoGlobal: 98.7, estadoAdmin: "Aprobada en Pleno y Consejo", conclusiones: ["Ciclo trienal de nuevas masculinidades completado.", "I Encuentro 'Sierra Segura Sin Odio' en marcha.", "Acuerdo: Reforzar el acompañamiento psicológico en época de exámenes."] },
    2030: { tipo: "Evaluación Anual 2030", subtitulo: "Fase 4 · Maduración y Autogestión", dictamen: "Madurez comunitaria: Orcera reconocida como municipio referente en inclusión rural.", gradoCumplimientoGlobal: 101.6, estadoAdmin: "Aprobada en Pleno", conclusiones: ["Talleres de ansiedad y prevención del suicidio consolidados.", "Puntos Violeta autogestionados por voluntarias jóvenes.", "Acuerdo: Preparar memoria de bienestar social."] },
    2031: { tipo: "Evaluación Final Quinquenal", subtitulo: "Fase 5 · Impacto Final y Transferencia", dictamen: "Cumplimiento sobresaliente: 138 consultas y 232 participantes en prevención.", gradoCumplimientoGlobal: 102.9, estadoAdmin: "Dictamen Final Institucional", conclusiones: ["Atención psicológica establecida como servicio municipal permanente.", "Cero agresiones en fiestas durante el quinquenio.", "Acuerdo: Líneas prioritarias transferidas al IV Plan."] }
  },
  6: {
    2027: { tipo: "Evaluación Anual 2027", subtitulo: "Fase 1 · Arranque e Implantación", dictamen: "Constitución histórica del Consejo Local de la Juventud y 1ª votación en app.", gradoCumplimientoGlobal: 95.5, estadoAdmin: "Aprobada por Comisión y Pleno", conclusiones: ["Reglamento del Consejo aprobado por unanimidad en Pleno.", "62 votos registrados en la primera consulta de la app.", "Acuerdo: Dotar la bolsa de ayudas a asociaciones para 2028."] },
    2028: { tipo: "Evaluación Anual 2028", subtitulo: "Fase 2 · Consolidación y Escala", dictamen: "Crecimiento del asociacionismo: 3 nuevos colectivos juveniles fundados en el pueblo.", gradoCumplimientoGlobal: 98.0, estadoAdmin: "Aprobada en Pleno", conclusiones: ["120 votos en los presupuestos participativos jóvenes.", "I Jornadas de Convivencia Asociativa celebradas.", "Acuerdo: Mantener dos Plenos Juveniles al año."] },
    2029: { tipo: "Evaluación Intermedia 2029", subtitulo: "Fase 3 · Evaluación Intermedia", dictamen: "Alta participación democrática: el 65% del censo juvenil votó propuestas en la app.", gradoCumplimientoGlobal: 99.4, estadoAdmin: "Aprobada en Pleno y Consejo", conclusiones: ["9 proyectos autogestionados por jóvenes financiados.", "Barómetro anual de juventud presentado en Pleno.", "Acuerdo: Revalidar convenios de asesoría jurídica asociativa."] },
    2030: { tipo: "Evaluación Anual 2030", subtitulo: "Fase 4 · Maduración y Autogestión", dictamen: "Plena gobernanza juvenil: 16 mociones juveniles aprobadas e implementadas por el Ayuntamiento.", gradoCumplimientoGlobal: 102.0, estadoAdmin: "Aprobada en Pleno", conclusiones: ["Buzón ciudadano resolvió 24 propuestas vecinales.", "Consejo de la Juventud liderando la gestión de eventos.", "Acuerdo: Diseñar el proceso participativo del IV Plan."] },
    2031: { tipo: "Evaluación Final Quinquenal", subtitulo: "Fase 5 · Impacto Final y Transferencia", dictamen: "Récord histórico de participación ciudadana: 295 votos y 19 mociones plenarias.", gradoCumplimientoGlobal: 103.6, estadoAdmin: "Dictamen Final Institucional", conclusiones: ["Orcera convertida en modelo de democracia participativa rural.", "15 proyectos autogestionados ejecutados con éxito.", "Acuerdo: Aprobación formal del Libro Blanco de Juventud."] }
  },
  7: {
    2027: { tipo: "Evaluación Anual 2027", subtitulo: "Fase 1 · Arranque e Implantación", dictamen: "Lanzamiento con éxito de la app KLIKO (Orcera Joven) y portal de transparencia en vivo.", gradoCumplimientoGlobal: 96.0, estadoAdmin: "Aprobada por Comisión y Pleno", conclusiones: ["72 usuarios únicos registrados en el primer trimestre.", "100% de facturas del Plan publicadas en menos de 72h.", "Acuerdo: Expandir la red de corresponsales juveniles."] },
    2028: { tipo: "Evaluación Anual 2028", subtitulo: "Fase 2 · Consolidación y Escala", dictamen: "Cierre de la campaña bienal del Carné Joven con 18 comercios locales adheridos.", gradoCumplimientoGlobal: 98.2, estadoAdmin: "Aprobada en Pleno", conclusiones: ["140 usuarios activos en la app y canales oficiales.", "Primera edición de la Guía de Recursos Joven publicada.", "Acuerdo: Continuar la emisión de informes de evaluación."] },
    2029: { tipo: "Evaluación Intermedia 2029", subtitulo: "Fase 3 · Evaluación Intermedia", dictamen: "Transparencia institucional ejemplar: auditoría ciudadana sin incidencias.", gradoCumplimientoGlobal: 99.2, estadoAdmin: "Aprobada en Pleno y Consejo", conclusiones: ["206 usuarios registrados en la app municipal.", "120 consultas resueltas en el Punto de Información.", "Acuerdo: Mantener el compromiso de datos abiertos."] },
    2030: { tipo: "Evaluación Anual 2030", subtitulo: "Fase 4 · Maduración y Autogestión", dictamen: "La app KLIKO se consolida como el principal canal de información del municipio.", gradoCumplimientoGlobal: 101.8, estadoAdmin: "Aprobada en Pleno", conclusiones: ["Red de corresponsales presente en todas las aldeas.", "Más de 158 consultas anuales canalizadas.", "Acuerdo: Diseñar la memoria de transparencia quinquenal."] },
    2031: { tipo: "Evaluación Final Quinquenal", subtitulo: "Fase 5 · Impacto Final y Transferencia", dictamen: "Cumplimiento íntegro de compromisos de información pública y gobierno abierto.", gradoCumplimientoGlobal: 103.5, estadoAdmin: "Dictamen Final Institucional", conclusiones: ["334 usuarios únicos en la plataforma (85% de la juventud local).", "195 consultas resueltas y transparencia máxima certificada.", "Acuerdo: Traspaso de datos abiertos al IV Plan (2032-2036)."] }
  }
};

// Generador y resolutor de hoja de ruta quinquenal (2027-2031) para las 63 acciones
function getActionRoadmap(acc, eje) {
  const meta = ACTION_METADATA[acc.codigo] || {
    duracion: "Quinquenal (Todo el Plan)",
    duracionTipo: "5_anos",
    anos: [2027, 2028, 2029, 2030, 2031],
    indRef: "IND-" + eje.numero + ".1"
  };

  const fases = {
    "2027": { nombre: "Fase 1 · Arranque e Implantación", metaGen: "Lanzamiento formal, primera convocatoria pública y dotación de medios." },
    "2028": { nombre: "Fase 2 · Consolidación y Escala", metaGen: "Ampliación de cupos (+25%), optimización operativa y seguimiento de participantes." },
    "2029": { nombre: "Fase 3 · Expansión Comarcal e Innovación", metaGen: "Extensión a nivel comarcal e incorporación de nuevas herramientas técnicas." },
    "2030": { nombre: "Fase 4 · Maduración y Autogestión", metaGen: "Liderazgo compartido con colectivos juveniles orcereños y afianzamiento asociativo." },
    "2031": { nombre: "Fase 5 · Impacto Final y Transferencia", metaGen: "Evaluación quinquenal, balance de resultados e integración de propuestas al IV Plan." }
  };

  // Generación contextual de hitos anuales
  const hitos = {};
  [2027, 2028, 2029, 2030, 2031].forEach(yr => {
    if (meta.anos.includes(yr)) {
      if (yr === Math.min(...meta.anos) && meta.anos.length === 1) {
        hitos[yr] = `Ejecución puntual (${yr}): ${acc.titulo}. Convocatoria, realización de obras/servicios y liquidación en dicho ejercicio.`;
      } else if (yr === Math.min(...meta.anos)) {
        hitos[yr] = `Fase de lanzamiento inicial (${yr}): Convocatoria pública y diagnóstico operativo (${acc.trimestre || 'Q1-Q2'} ${yr}).`;
      } else if (yr === Math.max(...meta.anos) && meta.anos.length > 1 && yr < 2031) {
        hitos[yr] = `Fase de culminación del proyecto (${yr}): Edición final, evaluación de impacto específico y transferencia a servicios municipales.`;
      } else if (yr === 2031) {
        hitos[yr] = `Fase de evaluación quinquenal (${yr}): Balance global de resultados (2027-2031) y memoria para el IV Plan.`;
      } else {
        hitos[yr] = `Fase de desarrollo y consolidación (${yr}): Ampliación de plazas, optimización de recursos y seguimiento de participantes.`;
      }
    } else if (yr > Math.max(...meta.anos)) {
      hitos[yr] = `✓ Medida finalizada con éxito en ${Math.max(...meta.anos)}. Resultados consolidados e integrados en la gestión municipal permanente.`;
    } else {
      hitos[yr] = `⏳ Medida programada para iniciar en el ejercicio ${Math.min(...meta.anos)} conforme al calendario del Plan Quinquenal.`;
    }
  });

  return {
    vigencia: meta.duracion,
    duracionTipo: meta.duracionTipo,
    anos: meta.anos,
    indRef: meta.indRef,
    hitos,
    fases
  };
}

// Renderizar la ficha técnica completa del Eje seleccionado con los 7 campos
function renderEjeDetail(ejeId) {
  const container = document.getElementById("eje-detail-container");
  const eje = EJES_DATA.find(e => e.id === ejeId);
  if (!container || !eje) return;

  const selFinYear = AppState.selectedCronogramaYear || 2027;
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
  const percentExecution = finAno ? finAno.porcentajeEjecucion : ((eje.presupuestoReal2027 / eje.presupuestoAnual) * 100).toFixed(1);
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
          <span class="subtab-badge">${percentExecution}% Ejecutado</span>
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

          <!-- GRÁFICA COMPARATIVA DE BARRAS DE TODAS LAS ACCIONES DEL EJE (GANTT 2027-2031) -->
          <div class="eje-gantt-barchart-card">
            <div class="eje-gantt-header">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="eje-gantt-icon">📊</span>
                  <h4 style="margin:0; font-family:var(--font-heading); font-size:0.92rem; color:var(--text-main);">
                    Gráfica de Duración de las ${eje.acciones.length} Acciones del Eje ${eje.numero} (2027–2031)
                  </h4>
                </div>
                <p style="font-size:0.72rem; color:var(--text-muted); margin:4px 0 0;">
                  Cronograma horizontal de barras año a año: visualiza qué medidas arrancan en 2027 y cuáles cubren el quinquenio completo.
                </p>
              </div>
              <div class="eje-gantt-legend">
                <span class="gantt-legend-item"><span class="legend-color-box active"></span> Activa</span>
                <span class="gantt-legend-item"><span class="legend-color-box inactive"></span> Inactiva</span>
              </div>
            </div>

            <div class="eje-gantt-matrix">
              <div class="eje-gantt-matrix-header">
                <div class="gantt-cell-action">Acción / Medida</div>
                <div class="gantt-cell-year">2027</div>
                <div class="gantt-cell-year">2028</div>
                <div class="gantt-cell-year">2029</div>
                <div class="gantt-cell-year">2030</div>
                <div class="gantt-cell-year">2031</div>
                <div class="gantt-cell-dur">Duración</div>
              </div>

              ${eje.acciones.map(a => {
                const rm = a.roadmap || { anos: [2027, 2028, 2029, 2030, 2031] };
                const dur = rm.anos ? rm.anos.length : 5;
                return `
                  <div class="eje-gantt-matrix-row" data-action-code="${a.codigo}" data-eje-id="${eje.id}" role="button" tabindex="0" title="Haz clic para ver la ficha completa de ${a.codigo}">
                    <div class="gantt-cell-action" title="${a.titulo}">
                      <strong>${a.codigo} <span class="gantt-click-hint">🔍</span></strong>
                      <span>${a.titulo.substring(0, 32)}...</span>
                    </div>
                    ${[2027, 2028, 2029, 2030, 2031].map(y => {
                      const act = rm.anos && rm.anos.includes(y);
                      return `
                        <div class="gantt-cell-year">
                          ${act ? '<div class="gantt-bar-cell"></div>' : '<div class="gantt-bar-cell empty"></div>'}
                        </div>
                      `;
                    }).join("")}
                    <div class="gantt-cell-dur">
                      <span class="dur-pill-mini ${dur === 5 ? 'quinquenal' : 'parcial'}">${dur} ${dur === 1 ? 'año' : 'años'}</span>
                    </div>
                  </div>
                `;
              }).join("")}
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

                      <!-- GRÁFICA DE BARRAS DE DURACIÓN DE LA ACCIÓN (2027-2031) -->
                      <div class="action-barchart-container">
                        <div class="action-barchart-header">
                          <span class="action-barchart-title">
                            <span>📊</span> Duración Quinquenal (2027–2031)
                          </span>
                          <span class="action-barchart-badge ${roadmap.anos.length === 5 ? 'badge-quinquenal' : 'badge-parcial'}">
                            ${roadmap.anos.length === 5 ? '5 años (Quinquenal Completo)' : `${roadmap.anos.length} de 5 años`}
                          </span>
                        </div>
                        <div class="action-barchart-grid">
                          ${[2027, 2028, 2029, 2030, 2031].map(y => {
                            const active = roadmap.anos.includes(y);
                            const isCurrent = y === 2027;
                            return `
                              <div class="barchart-col ${active ? 'col-active' : 'col-inactive'} ${isCurrent ? 'col-current' : ''}">
                                <span class="barchart-year">${y}</span>
                                <div class="barchart-bar-wrap">
                                  <div class="barchart-bar-fill ${active ? 'active' : ''}"></div>
                                </div>
                                <span class="barchart-dot ${active ? 'active' : ''}">${active ? '●' : '○'}</span>
                              </div>
                            `;
                          }).join("")}
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
      renderEjeDetail(eje.id);
    });
  });

  // Asignar listeners a las filas del cronograma general para abrir ficha completa
  container.querySelectorAll(".eje-gantt-matrix-row[data-action-code]").forEach(row => {
    row.addEventListener("click", () => {
      const code = row.getAttribute("data-action-code");
      const eId = parseInt(row.getAttribute("data-eje-id")) || eje.id;
      openActionDetailModal(code, eId);
    });
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const code = row.getAttribute("data-action-code");
        const eId = parseInt(row.getAttribute("data-eje-id")) || eje.id;
        openActionDetailModal(code, eId);
      }
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

      if (!AppState.currentUser) {
        openUserModal();
        showToast("Identifícate", "Por favor, regístrate o inicia sesión para valorar los ejes del Plan.");
        return;
      }

      // Guardar valoración
      const nuevaVal = {
        usuario: AppState.currentUser.alias || AppState.currentUser.nombre,
        estrellas: selectedStars,
        comentario: text
      };
      eje.valoraciones.unshift(nuevaVal);

      if (window.KlikoDB) {
        window.KlikoDB.addValoracion(eje.id, selectedStars, text, AppState.currentUser);
      }

      rewardPoints(30, `¡Valoración registrada en Eje ${eje.numero}!`);
      renderEjeDetail(eje.id);
      updateGlobalBentoKPIs();
    });
  }
}

function formatStatusName(status) {
  switch (status) {
    case "en_curso": return "En Curso";
    case "finalizada": return "Finalizada";
    case "no_iniciada": return "No Iniciada";
    case "en_revision_participativa": return "En Revisión";
    default: return status;
  }
}

// ==============================================================================
// FICHA TÉCNICA DETALLADA DE LA ACCIÓN (CRONOGRAMA GENERAL)
// ==============================================================================
function getActionFullDetails(actionCode, optEjeId) {
  let foundAcc = null;
  let foundOe = null;
  let foundEje = null;

  for (const eje of EJES_DATA) {
    if (optEjeId && eje.id !== optEjeId && eje.numero !== optEjeId) continue;
    for (const oe of (eje.objetivosEspecificos || [])) {
      for (const acc of (oe.acciones || [])) {
        if (acc.codigo === actionCode) {
          foundAcc = acc;
          foundOe = oe;
          foundEje = eje;
          break;
        }
      }
      if (foundAcc) break;
    }
    if (foundAcc) break;
  }

  if (!foundAcc) {
    for (const eje of EJES_DATA) {
      if (optEjeId && eje.id !== optEjeId) continue;
      const acc = (eje.acciones || []).find(a => a.codigo === actionCode);
      if (acc) {
        foundAcc = acc;
        foundEje = eje;
        foundOe = (eje.objetivosEspecificos || []).find(oe => 
          (oe.acciones || []).some(a => a.codigo === actionCode)
        );
        break;
      }
    }
  }

  if (!foundAcc) return null;

  const roadmap = getActionRoadmap(foundAcc, foundEje);

  // Buscar datos presupuestarios y facturas en finanzas anualizadas (2027-2031)
  const financialRecords = [];
  const years = [2027, 2028, 2029, 2030, 2031];
  let totalPrevision = 0;
  let totalEjecutado = 0;
  const justificantes = [];

  years.forEach(yr => {
    const yrFin = foundEje.finanzas && foundEje.finanzas[yr];
    if (yrFin && yrFin.accionesDesarrolladas) {
      const match = yrFin.accionesDesarrolladas.find(ad => ad.codigo === actionCode);
      if (match) {
        totalPrevision += (match.previsionIngresos || 0);
        totalEjecutado += (match.gastoEjecutado || 0);
        financialRecords.push({
          ano: yr,
          prevision: match.previsionIngresos || 0,
          ejecutado: match.gastoEjecutado || 0,
          saldo: match.saldo || 0,
          pct: match.porcentajeEjecucion || 0
        });
        if (match.justificantes && match.justificantes.length) {
          justificantes.push(...match.justificantes);
        }
      }
    }
  });

  const indicadores = foundAcc.indicadores || [];

  return {
    action: foundAcc,
    oe: foundOe,
    eje: foundEje,
    roadmap: roadmap,
    finanzas: {
      anualidades: financialRecords,
      totalPrevision: totalPrevision,
      totalEjecutado: totalEjecutado,
      saldoTotal: totalPrevision - totalEjecutado,
      pctTotal: totalPrevision > 0 ? ((totalEjecutado / totalPrevision) * 100).toFixed(1) : 0,
      justificantes: justificantes
    },
    indicadores: indicadores,
    valoraciones: foundEje.valoraciones || []
  };
}

function openActionDetailModal(actionCode, optEjeId) {
  const details = getActionFullDetails(actionCode, optEjeId);
  const modal = document.getElementById("cronograma-action-modal");
  const contentEl = document.getElementById("cronograma-action-modal-content");
  if (!modal || !contentEl || !details) return;

  const { action, oe, eje, roadmap, finanzas, indicadores, valoraciones } = details;
  const evalData = getEvaluacionData();
  const userActVote = evalData.userActionVotes[action.codigo];
  const commScore = evalData.communityActionVotes[action.codigo] || { avg: 4.6, count: 24 };

  let statusClass = "status-" + (action.estado || "en_progreso");
  let statusName = formatStatusName(action.estado || "en_progreso");

  contentEl.innerHTML = `
    <!-- CABECERA DE LA FICHA DE ACCIÓN -->
    <div class="action-modal-header">
      <div class="action-modal-top-row">
        <button type="button" class="btn-action-back" onclick="closeActionDetailModal()" aria-label="Volver al cronograma">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Volver
        </button>
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span class="action-code-tag" style="font-size: 0.82rem; padding: 4px 8px;">${action.codigo}</span>
          <span class="action-status-badge ${statusClass}">${statusName}</span>
          <span class="badge-duracion dur-${roadmap.duracionTipo}">⏱️ ${roadmap.vigencia}</span>
        </div>
        <button type="button" onclick="closeActionDetailModal()" aria-label="Cerrar ficha" style="background: none; border: none; color: var(--text-muted); font-size: 1.6rem; line-height: 1; cursor: pointer; padding: 0 4px;">&times;</button>
      </div>
      <h3 style="margin: 4px 0 6px; font-family: var(--font-heading); font-size: 1.05rem; color: var(--text-main); line-height: 1.35;">
        ${action.titulo}
      </h3>
      <div style="display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: var(--text-muted); flex-wrap: wrap;">
        <span>🏛️ Eje ${eje.numero}: ${eje.titulo}</span>
        <span>•</span>
        <span style="color: var(--amurjo-cyan); font-weight: 700;">🎯 ${oe ? oe.codigo : 'Objetivo'}: ${oe ? (oe.titulo.length > 50 ? oe.titulo.substring(0, 50) + '...' : oe.titulo) : ''}</span>
      </div>
    </div>

    <!-- SUBPESTAÑAS RÁPIDAS FIJAS DE NAVEGACIÓN MÓVIL -->
    <nav class="action-quick-tabs" aria-label="Secciones de la ficha">
      <button type="button" class="action-tab-btn active" data-action-tab="tab-action-info" onclick="switchActionTab('tab-action-info')">
        📋 Ficha
      </button>
      <button type="button" class="action-tab-btn" data-action-tab="tab-action-presupuesto" onclick="switchActionTab('tab-action-presupuesto')">
        💶 Fondos
      </button>
      <button type="button" class="action-tab-btn" data-action-tab="tab-action-indicadores" onclick="switchActionTab('tab-action-indicadores')">
        📊 Metas
      </button>
      <button type="button" class="action-tab-btn" data-action-tab="tab-action-comentarios" onclick="switchActionTab('tab-action-comentarios')">
        💬 Opinión
      </button>
    </nav>

    <!-- CUERPO DETALLADO DE LA FICHA CON SCROLL 100% FLUIDO -->
    <div class="action-modal-body">

      <!-- PESTAÑA 1: FICHA Y CRONOGRAMA -->
      <div class="action-tab-pane" id="pane-tab-action-info" style="display: flex;">
        <!-- Objetivo Específico Vinculado -->
        <div class="action-detail-section">
          <div class="action-section-title">
            <span>🎯</span> Objetivo Específico Vinculado
          </div>
          <p style="font-size: 0.82rem; color: var(--text-main); margin-bottom: 6px; font-weight: 600;">
            ${oe ? `${oe.codigo}: ${oe.titulo}` : 'Objetivo Estratégico Municipal'}
          </p>
          <p style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
            Esta medida contribuye a las metas operativas del Eje ${eje.numero}, garantizando derechos, formación y ocio de calidad para la juventud de Orcera en el marco del III Plan Municipal.
          </p>
        </div>

        <!-- Descripción Completa -->
        <div class="action-detail-section">
          <div class="action-section-title">
            <span>📋</span> Descripción Completa y Alcance
          </div>
          <p style="font-size: 0.82rem; color: var(--text-main); line-height: 1.6; margin-bottom: 12px;">
            ${action.descripcion || action.titulo}
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; font-size: 0.76rem;">
            <div style="background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--segura-border);">
              <strong style="color: var(--emerald); display: block; font-size: 0.7rem; text-transform: uppercase;">Organismo Responsable:</strong>
              <span style="color: var(--text-main);">${action.responsable || 'Concejalía de Juventud · Ayto. de Orcera'}</span>
            </div>
            <div style="background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--segura-border);">
              <strong style="color: var(--amurjo-cyan); display: block; font-size: 0.7rem; text-transform: uppercase;">Recursos y Financiación:</strong>
              <span style="color: var(--text-main);">${action.recursos || 'Recursos propios del Ayuntamiento de Orcera'}</span>
            </div>
          </div>
        </div>

        <!-- Cronograma y Fases Quinquenales -->
        <div class="action-detail-section">
          <div class="action-section-title">
            <span>📅</span> Cronograma Quinquenal (2027–2031)
          </div>
          <div style="display: flex; gap: 6px; margin: 10px 0 14px; overflow-x: auto;">
            ${[2027, 2028, 2029, 2030, 2031].map(yr => {
              const isAct = roadmap.anos.includes(yr);
              return `
                <div style="flex: 1; min-width: 54px; text-align: center; padding: 6px 3px; border-radius: var(--radius-sm); background: ${isAct ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isAct ? 'var(--emerald)' : 'var(--segura-border)'};">
                  <span style="font-size: 0.75rem; font-weight: 800; color: ${isAct ? '#34d399' : 'var(--text-dim)'};">${yr}</span>
                  <span style="display: block; font-size: 0.62rem; color: ${isAct ? 'var(--text-main)' : 'var(--text-dim)'};">${isAct ? '● Activa' : '○ —'}</span>
                </div>
              `;
            }).join("")}
          </div>
          <div style="font-size: 0.76rem; color: var(--text-muted); line-height: 1.5;">
            <strong style="color: var(--text-main);">Hitos y Fases Programadas:</strong>
            <ul style="margin: 6px 0 0 16px; padding: 0;">
              ${roadmap.anos.map(yr => `
                <li style="margin-bottom: 5px;">
                  <strong style="color: var(--amurjo-cyan);">${yr}:</strong> ${roadmap.hitos[yr] || 'Ejecución y seguimiento de actividades correspondientes al ejercicio ' + yr + '.'}
                </li>
              `).join("")}
            </ul>
          </div>
        </div>
      </div>

      <!-- PESTAÑA 2: PRESUPUESTO Y FONDOS -->
      <div class="action-tab-pane" id="pane-tab-action-presupuesto" style="display: none;">
        <div class="action-detail-section">
          <div class="action-section-title">
            <span>💶</span> Presupuesto y Contabilidad Fiscalizada
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); padding: 8px 10px; border-radius: var(--radius-sm); text-align: center;">
              <span style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); display: block;">Previsión</span>
              <strong style="font-size: 0.92rem; color: #34d399;">${finanzas.totalPrevision > 0 ? finanzas.totalPrevision.toLocaleString('es-ES', {minimumFractionDigits: 2}) + ' €' : 'Ordinaria'}</strong>
            </div>
            <div style="background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3); padding: 8px 10px; border-radius: var(--radius-sm); text-align: center;">
              <span style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); display: block;">Fiscalizado</span>
              <strong style="font-size: 0.92rem; color: var(--amurjo-cyan);">${finanzas.totalEjecutado > 0 ? finanzas.totalEjecutado.toLocaleString('es-ES', {minimumFractionDigits: 2}) + ' €' : 'En trámite'}</strong>
            </div>
            <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); padding: 8px 10px; border-radius: var(--radius-sm); text-align: center;">
              <span style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); display: block;">Ejecución</span>
              <strong style="font-size: 0.92rem; color: var(--amber);">${finanzas.pctTotal > 0 ? finanzas.pctTotal + '%' : '100%'}</strong>
            </div>
          </div>

          ${finanzas.anualidades.length > 0 ? `
            <div style="overflow-x: auto; margin-bottom: 14px; -webkit-overflow-scrolling: touch;">
              <table class="financial-subtable" style="width: 100%; font-size: 0.72rem; min-width: 320px;">
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Previsión</th>
                    <th>Ejecutado</th>
                    <th>Remanente</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  ${finanzas.anualidades.map(an => `
                    <tr>
                      <td><strong>${an.ano}</strong></td>
                      <td>${an.prevision.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</td>
                      <td>${an.ejecutado.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</td>
                      <td>${an.saldo.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</td>
                      <td><span class="action-status-badge status-en_curso">${an.pct}%</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${finanzas.justificantes.length > 0 ? `
            <div style="margin-top: 10px;">
              <span style="font-size: 0.74rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 8px;">
                📄 Facturas y Nóminas Oficiales Fiscalizadas (${finanzas.justificantes.length}):
              </span>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${finanzas.justificantes.map(j => `
                  <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--segura-border); border-radius: var(--radius-sm); padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 0.72rem;">
                    <div>
                      <strong style="color: var(--amurjo-cyan);">${j.ref || j.id}</strong> · <span>${j.concepto}</span>
                      <div style="font-size: 0.65rem; color: var(--text-muted);">${j.proveedorBeneficiario} · Fecha: ${j.fecha} · Partida: <code>${j.partidaPresupuestaria || '337.226'}</code></div>
                    </div>
                    <strong style="color: #34d399; font-size: 0.8rem; white-space: nowrap;">${j.importe.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</strong>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- PESTAÑA 3: METAS E INDICADORES -->
      <div class="action-tab-pane" id="pane-tab-action-indicadores" style="display: none;">
        <div class="action-detail-section">
          <!-- EVALUACIÓN PREVIA Y DICTAMEN JUVENIL -->
          <div style="background: linear-gradient(135deg, rgba(234, 88, 12, 0.12), rgba(16, 185, 129, 0.08)); border: 1px solid rgba(234, 88, 12, 0.35); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 8px;">
              <div>
                <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--orcera-orange);">
                  🗳️ Dictamen y Respaldo Juvenil (Evaluación Previa)
                </span>
                <h4 style="margin: 3px 0 0 0; font-size: 0.88rem; color: var(--text-main); font-weight: 700;">
                  Validación Ex-Ante de la Medida
                </h4>
              </div>
              <div style="text-align: right; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid rgba(251, 191, 36, 0.25);">
                <span style="font-size: 0.82rem; font-weight: 800; color: #fbbf24;">⭐ ${commScore.avg.toFixed(1)} / 5</span>
                <div style="font-size: 0.64rem; color: var(--text-muted);">${commScore.count} jóvenes</div>
              </div>
            </div>
            <p style="font-size: 0.74rem; color: var(--text-muted); margin: 0 0 10px 0; line-height: 1.45;">
              ${userActVote ? `<span style="color:#34d399; font-weight:700;">✓ Ya has emitido tu dictamen para esta acción (${userActVote} / 5 estrellas).</span> Puedes modificar tu voto o evaluar cada indicador específico.` : 'Comprueba y califica si esta medida y sus metas son prioritarias para Orcera antes de su puesta en marcha en 2027. ¡Gana puntos para premios!'}
            </p>
            <button type="button" class="btn-primary" onclick="goToEvaluacionAction('${action.codigo}')" style="width: 100%; font-size: 0.74rem; padding: 8px 12px; display: inline-flex; justify-content: center; align-items: center; gap: 6px; font-weight: 700;">
              <span>⭐</span> ${userActVote ? 'Ver / Modificar mi Evaluación Previa' : 'Participar en la Evaluación Previa (+20 Pts)'}
            </button>
          </div>

          <div class="action-section-title">
            <span>📊</span> Indicadores de Logro y Seguimiento (${indicadores.length})
          </div>

          ${indicadores.length === 0 ? `
            <p style="font-size: 0.78rem; color: var(--text-muted);">
              Esta acción se evalúa mediante los indicadores generales del Eje ${eje.numero} (tasa de participación y grado de satisfacción ciudadana).
            </p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${indicadores.map(ind => {
                const pct = ind.cumplimiento || (ind.metaQuinquenal > 0 ? Math.round((ind.actualQuinquenal / ind.metaQuinquenal) * 100) : 100);
                const indVote = evalData.userIndicatorVotes[ind.id];
                const indComm = evalData.communityIndicatorVotes[ind.id] || { avg: 4.5, count: 20 };
                return `
                  <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--segura-border); border-radius: var(--radius-sm); padding: 10px 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 4px;">
                      <strong style="font-size: 0.76rem; color: var(--text-main);">${ind.codigo || ind.id}: ${ind.nombre}</strong>
                      <span style="font-size: 0.72rem; font-weight: 800; color: #34d399; white-space: nowrap;">${pct}%</span>
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 6px;">
                      Meta Quinquenal: <strong>${ind.metaQuinquenal} ${ind.unidad}</strong> · Conseguido: <strong>${ind.actualQuinquenal || 0} ${ind.unidad}</strong> (${ind.tipo})
                    </div>
                    <div class="progress-bar-track" style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
                      <div style="width: ${Math.min(pct, 100)}%; height: 100%; background: linear-gradient(90deg, var(--emerald), var(--amurjo-cyan));"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.68rem; color: var(--text-muted); border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 6px;">
                      <span>Dictamen de idoneidad: <strong style="color: #fbbf24;">⭐ ${indComm.avg.toFixed(1)}/5</strong> (${indComm.count} votos)</span>
                      ${indVote ? `<span style="color:#34d399; font-weight:700;">Tu voto: ⭐ ${indVote}</span>` : `<a href="javascript:void(0)" onclick="goToEvaluacionAction('${action.codigo}')" style="color: var(--orcera-orange); text-decoration: underline;">Evaluar (+10 Pts)</a>`}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          `}
        </div>
      </div>

      <!-- PESTAÑA 4: OPINIONES Y PARTICIPACIÓN CIUDADANA ACTIVA -->
      <div class="action-tab-pane" id="pane-tab-action-comentarios" style="display: none;">
        
        <!-- Tarjeta de estado de participación -->
        <div class="action-comments-header-box">
          <div class="action-comments-stats-row">
            <span class="action-status-open-badge">
              <span style="font-size: 0.65rem;">🟢</span>
              Canal de Participación Activo
            </span>
            <span class="action-rating-badge" id="action-rating-summary-${action.codigo}">
              ⭐ 5.0 / 5
            </span>
          </div>
          <p style="font-size: 0.74rem; color: var(--text-muted); margin: 0; line-height: 1.45;">
            Espacio oficial para que la juventud de Orcera opine, valore y aporte sugerencias sobre la medida <strong>${action.codigo}</strong>. Las propuestas son revisadas por la Concejalía de Juventud.
          </p>
        </div>

        <!-- Botón para activar/abrir el formulario de comentarios -->
        <button type="button" class="btn-toggle-comment-form" id="btn-toggle-form-${action.codigo}" onclick="toggleActionCommentForm('${action.codigo}')">
          <span>✍️</span>
          <span>Dar mi Opinión / Valorar esta Acción</span>
        </button>

        <!-- Formulario interactivo de comentarios -->
        <div class="action-comment-form-card" id="action-comment-form-${action.codigo}" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.8rem; color: var(--text-main);">Tu Valoración Ciudadana:</strong>
            <span id="star-rating-hint-${action.codigo}" style="font-size: 0.7rem; color: var(--emerald); font-weight: 700;">★★★★★ ¡Excelente!</span>
          </div>

          <!-- Selector interactivo de estrellas -->
          <div class="star-rating-selector" id="star-picker-${action.codigo}">
            <button type="button" class="star-btn active" data-star="1" onclick="setActionCommentRating('${action.codigo}', 1)" aria-label="1 estrella">★</button>
            <button type="button" class="star-btn active" data-star="2" onclick="setActionCommentRating('${action.codigo}', 2)" aria-label="2 estrellas">★</button>
            <button type="button" class="star-btn active" data-star="3" onclick="setActionCommentRating('${action.codigo}', 3)" aria-label="3 estrellas">★</button>
            <button type="button" class="star-btn active" data-star="4" onclick="setActionCommentRating('${action.codigo}', 4)" aria-label="4 estrellas">★</button>
            <button type="button" class="star-btn active" data-star="5" onclick="setActionCommentRating('${action.codigo}', 5)" aria-label="5 estrellas">★</button>
          </div>

          <!-- Selector de tipo / etiqueta -->
          <div>
            <span style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Tipo de aportación:</span>
            <div class="comment-tag-selector" id="tag-picker-${action.codigo}">
              <button type="button" class="comment-tag-opt active" onclick="setActionCommentTag('${action.codigo}', '💡 Sugerencia')">💡 Sugerencia</button>
              <button type="button" class="comment-tag-opt" onclick="setActionCommentTag('${action.codigo}', '👍 Apoyo total')">👍 Apoyo total</button>
              <button type="button" class="comment-tag-opt" onclick="setActionCommentTag('${action.codigo}', '❓ Pregunta')">❓ Pregunta</button>
              <button type="button" class="comment-tag-opt" onclick="setActionCommentTag('${action.codigo}', '⚠️ A mejorar')">⚠️ A mejorar</button>
            </div>
          </div>

          <!-- Nombre / Alias -->
          <div>
            <label style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Tu Nombre o Alias:</label>
            <input type="text" id="action-comment-author-${action.codigo}" class="action-comment-input" style="min-height: auto; padding: 7px 10px;" placeholder="Ej. Lucía / Joven de Orcera" value="${AppState.currentUser ? (AppState.currentUser.alias || AppState.currentUser.nombre) : ''}">
          </div>

          <!-- Texto de opinión -->
          <div>
            <label style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Tu comentario o sugerencia:</label>
            <textarea id="action-comment-text-${action.codigo}" class="action-comment-input" rows="3" placeholder="Escribe aquí tu opinión, propuesta o idea para esta medida..."></textarea>
          </div>

          <!-- Botón Enviar -->
          <div style="display: flex; gap: 8px; justify-content: flex-end; align-items: center;">
            <button type="button" class="btn-primary" onclick="submitActionComment('${action.codigo}')" style="padding: 8px 16px; font-weight: 800; font-size: 0.78rem;">
              🚀 Publicar Comentario (+15 Pts)
            </button>
          </div>
        </div>

        <!-- Feed de Comentarios Ciudadanos -->
        <div class="action-comments-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <span style="font-size: 0.76rem; font-weight: 800; color: var(--text-main);" id="action-comments-count-title-${action.codigo}">
              💬 Opiniones de la Juventud:
            </span>
            <span style="font-size: 0.68rem; color: var(--text-dim);">En vivo</span>
          </div>

          <div class="action-comments-list" id="action-comments-list-${action.codigo}">
            <!-- Renderizado dinámicamente -->
          </div>
        </div>

        <!-- DIFERENCIA CLARA: DEBATE RÁPIDO VS PROPUESTA AL PLENO -->
        <div style="margin-top: 12px; padding: 12px 14px; background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: var(--radius-md);">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="font-size: 0.95rem;">🗳️</span>
            <strong style="font-size: 0.78rem; color: var(--amurjo-cyan); text-transform: uppercase; letter-spacing: 0.03em;">
              Llevar una propuesta sobre esta acción al Pleno Municipal
            </strong>
          </div>
          <p style="font-size: 0.73rem; color: var(--text-muted); line-height: 1.45; margin: 0 0 10px;">
            Los comentarios de arriba son un debate público directo entre vecinos. Si lo que deseas es <strong>solicitar un cambio vinculante, proponer una ampliación o crear una nueva actividad para ${action.codigo}</strong>, puedes presentar una <em>Propuesta Joven Oficial</em>. Al reunir <strong>25 apoyos</strong> de otros jóvenes en el Buzón, pasará a debate en el Pleno del Ayuntamiento.
          </p>
          <button type="button" class="btn-primary" onclick="linkActionToBuzonProposal('${action.codigo}', '${encodeURIComponent(action.titulo)}', ${eje.numero})" style="width: 100%; justify-content: center; font-size: 0.76rem; padding: 9px 12px; font-weight: 800;">
            📝 Redactar Propuesta Oficial sobre ${action.codigo} (+50 Pts)
          </button>
        </div>

      </div>

    </div>

    <!-- PIE DEL MODAL CON BOTÓN VOLVER Y CERRAR -->
    <div class="action-modal-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 16px; background: var(--segura-surface-elevated); border-top: 1px solid var(--segura-border); flex-shrink: 0;">
      <button type="button" class="btn-action-back" onclick="closeActionDetailModal()" style="font-size: 0.75rem; padding: 6px 14px;">
        ← Volver al Cronograma
      </button>
      <button type="button" class="btn-primary" onclick="closeActionDetailModal()" style="padding: 7px 18px; font-weight: 800; font-size: 0.8rem;">
        Cerrar Ficha
      </button>
    </div>
  `;

  modal.classList.add("active");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const bodyEl = modal.querySelector(".action-modal-body");
  if (bodyEl) bodyEl.scrollTop = 0;

  // Inicializar comentarios de la acción
  initActionComments(action.codigo, valoraciones, action.titulo);
}

// Variables globales para el formulario activo
window._actionCommentRatings = window._actionCommentRatings || {};
window._actionCommentTags = window._actionCommentTags || {};

function initActionComments(actionCode, initialValoraciones, actionTitle) {
  window._actionCommentRatings[actionCode] = 5;
  window._actionCommentTags[actionCode] = "💡 Sugerencia";
  getActionComments(actionCode, initialValoraciones, actionTitle);
  renderActionComments(actionCode);
}

function getActionComments(actionCode, initialValoraciones, actionTitle) {
  const key = "kliko_action_comments_" + actionCode;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error(e);
    }
  }

  // Si no hay ninguno, creamos datos iniciales realistas de la juventud de Orcera
  const initialList = [];
  if (initialValoraciones && initialValoraciones.length > 0) {
    initialValoraciones.forEach((v, idx) => {
      initialList.push({
        id: "init-" + idx,
        usuario: v.usuario || "Joven de Orcera",
        rol: "Participación Vecinal",
        estrellas: v.estrellas || 5,
        tag: "👍 Apoyo total",
        comentario: v.comentario,
        fecha: "Dictamen Ciudadano III Plan",
        likes: 5 + idx * 2,
        liked: false
      });
    });
  } else {
    initialList.push({
      id: "init-1",
      usuario: "Álvaro M. Navarro",
      rol: "Asociación Juvenil Orcera",
      estrellas: 5,
      tag: "👍 Apoyo total",
      comentario: `Excelente propuesta para ${actionCode}. Consideramos prioritario que se empiece a ejecutar con participación activa de los jóvenes desde el primer ejercicio.`,
      fecha: "Hace 2 días",
      likes: 6,
      liked: false
    });
    initialList.push({
      id: "init-2",
      usuario: "Lucía Castillo",
      rol: "Estudiante de Orcera",
      estrellas: 4,
      tag: "💡 Sugerencia",
      comentario: `Muy buena iniciativa. Sería interesante vincularla con talleres prácticos y dinamización durante los fines de semana.`,
      fecha: "Ayer",
      likes: 3,
      liked: false
    });
  }

  localStorage.setItem(key, JSON.stringify(initialList));
  return initialList;
}

function renderActionComments(actionCode) {
  const listEl = document.getElementById("action-comments-list-" + actionCode);
  const summaryEl = document.getElementById("action-rating-summary-" + actionCode);
  const titleEl = document.getElementById("action-comments-count-title-" + actionCode);
  if (!listEl) return;

  const key = "kliko_action_comments_" + actionCode;
  let comments = [];
  try {
    comments = JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    comments = [];
  }

  // Calcular promedio de estrellas
  let avg = 5.0;
  if (comments.length > 0) {
    const sum = comments.reduce((acc, c) => acc + (Number(c.estrellas) || 5), 0);
    avg = (sum / comments.length).toFixed(1);
  }

  if (summaryEl) {
    summaryEl.innerHTML = `⭐ ${avg} / 5 <span style="font-size: 0.65rem; color: var(--text-dim); margin-left: 2px;">(${comments.length})</span>`;
  }
  if (titleEl) {
    titleEl.textContent = `💬 Opiniones de la Juventud (${comments.length}):`;
  }

  if (comments.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 16px; background: rgba(0,0,0,0.2); border-radius: var(--radius-sm); border: 1px dashed var(--segura-border);">
        <p style="font-size: 0.76rem; color: var(--text-muted); margin: 0 0 8px;">Aún no hay opiniones registradas para esta acción.</p>
        <button type="button" class="btn-primary" onclick="toggleActionCommentForm('${actionCode}')" style="font-size: 0.72rem; padding: 6px 14px;">
          ¡Sé el primero en opinar!
        </button>
      </div>
    `;
    return;
  }

  listEl.innerHTML = comments.map(c => {
    const initials = (c.usuario || "JO").substring(0, 2).toUpperCase();
    const starStr = "★".repeat(Math.max(1, Math.min(5, c.estrellas || 5)));
    return `
      <div class="action-comment-card" id="comment-card-${c.id}">
        <div class="action-comment-author-row">
          <div class="comment-author-info">
            <div class="comment-author-avatar">${initials}</div>
            <div>
              <strong style="font-size: 0.76rem; color: var(--text-main); display: block; line-height: 1.2;">
                ${c.usuario}
              </strong>
              <span style="font-size: 0.63rem; color: var(--text-dim);">${c.rol || 'Joven de Orcera'} · ${c.fecha || 'Reciente'}</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="color: #fbbf24; font-size: 0.72rem; letter-spacing: 1px;">${starStr}</div>
            <span class="comment-tag-opt" style="font-size: 0.6rem; padding: 2px 6px; cursor: default; display: inline-block; margin-top: 2px;">${c.tag || '💡 Opinión'}</span>
          </div>
        </div>
        <p style="font-size: 0.76rem; color: var(--text-main); line-height: 1.5; margin: 2px 0 4px;">
          "${c.comentario}"
        </p>
        <div style="display: flex; justify-content: flex-end;">
          <button type="button" class="btn-comment-like ${c.liked ? 'liked' : ''}" onclick="toggleActionCommentLike('${actionCode}', '${c.id}')">
            ${c.liked ? '❤️ Apoyado' : '👍 Apoyar'} (${c.likes || 0})
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function toggleActionCommentForm(actionCode) {
  const form = document.getElementById("action-comment-form-" + actionCode);
  const btn = document.getElementById("btn-toggle-form-" + actionCode);
  if (!form) return;
  const isHidden = form.style.display === "none";
  form.style.display = isHidden ? "flex" : "none";
  if (btn) {
    btn.innerHTML = isHidden ? `<span>✕</span><span>Cerrar Formulario</span>` : `<span>✍️</span><span>Dar mi Opinión / Valorar esta Acción</span>`;
  }
}

function setActionCommentRating(actionCode, rating) {
  window._actionCommentRatings[actionCode] = rating;
  const picker = document.getElementById("star-picker-" + actionCode);
  const hint = document.getElementById("star-rating-hint-" + actionCode);
  if (picker) {
    picker.querySelectorAll(".star-btn").forEach(btn => {
      const val = Number(btn.getAttribute("data-star"));
      if (val <= rating) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }
  const hints = {
    1: "★☆☆☆☆ Muy mejorable",
    2: "★★☆☆☆ Regular",
    3: "★★★☆☆ Aceptable",
    4: "★★★★☆ Buena medida",
    5: "★★★★★ ¡Excelente!"
  };
  if (hint) hint.textContent = hints[rating] || "★★★★★";
}

function setActionCommentTag(actionCode, tag) {
  window._actionCommentTags[actionCode] = tag;
  const picker = document.getElementById("tag-picker-" + actionCode);
  if (picker) {
    picker.querySelectorAll(".comment-tag-opt").forEach(btn => {
      if (btn.textContent.trim() === tag) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }
}

function submitActionComment(actionCode) {
  const txtEl = document.getElementById("action-comment-text-" + actionCode);
  if (!txtEl || !txtEl.value.trim()) {
    showToast("Comentario vacío", "Por favor, escribe tu opinión o sugerencia antes de publicar.");
    return;
  }
  const authorEl = document.getElementById("action-comment-author-" + actionCode);
  let author = (authorEl && authorEl.value.trim()) || "";
  if (!author) {
    author = AppState.currentUser ? (AppState.currentUser.alias || AppState.currentUser.nombre) : "Joven de Orcera";
  }

  const rating = window._actionCommentRatings[actionCode] || 5;
  const tag = window._actionCommentTags[actionCode] || "💡 Sugerencia";

  const newComment = {
    id: "c-" + Date.now(),
    usuario: author,
    rol: AppState.currentUser && AppState.currentUser.esSocioAJO ? "Socio/a AJO" : "Joven de Orcera",
    estrellas: rating,
    tag: tag,
    comentario: txtEl.value.trim(),
    fecha: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    likes: 1,
    liked: true
  };

  const key = "kliko_action_comments_" + actionCode;
  let comments = [];
  try {
    comments = JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    comments = [];
  }
  comments.unshift(newComment);
  localStorage.setItem(key, JSON.stringify(comments));

  txtEl.value = "";
  renderActionComments(actionCode);

  // Cerrar formulario tras publicar y dar feedback
  toggleActionCommentForm(actionCode);

  if (typeof rewardPoints === "function") {
    rewardPoints(15, `Opinión ciudadana publicada en la acción ${actionCode}`);
  } else if (typeof showToast === "function") {
    showToast("¡Opinión Publicada!", `Tu comentario sobre la medida ${actionCode} ha sido registrado.`);
  }
}

function toggleActionCommentLike(actionCode, commentId) {
  const key = "kliko_action_comments_" + actionCode;
  let comments = [];
  try {
    comments = JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    return;
  }
  const target = comments.find(c => c.id === commentId);
  if (!target) return;

  target.liked = !target.liked;
  target.likes = (target.likes || 0) + (target.liked ? 1 : -1);
  if (target.likes < 0) target.likes = 0;

  localStorage.setItem(key, JSON.stringify(comments));
  renderActionComments(actionCode);
}

function switchActionTab(tabId) {
  const modal = document.getElementById("cronograma-action-modal");
  if (!modal) return;
  modal.querySelectorAll(".action-tab-btn").forEach(btn => {
    if (btn.getAttribute("data-action-tab") === tabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  modal.querySelectorAll(".action-tab-pane").forEach(pane => {
    if (pane.id === "pane-" + tabId) {
      pane.style.display = "flex";
    } else {
      pane.style.display = "none";
    }
  });
  const bodyEl = modal.querySelector(".action-modal-body");
  if (bodyEl) bodyEl.scrollTop = 0;
}

function closeActionDetailModal() {
  const m = document.getElementById("cronograma-action-modal");
  if (!m) return;
  m.classList.remove("active");
  m.style.display = "none";
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function linkActionToBuzonProposal(actionCode, encodedTitle, ejeId) {
  const actionTitle = decodeURIComponent(encodedTitle || "");
  closeActionDetailModal();
  
  if (window.switchTab) {
    window.switchTab("tab-buzon");
  }

  setTimeout(() => {
    const titleInput = document.getElementById("prop-title");
    const ejeSelect = document.getElementById("prop-eje");
    const placeInput = document.getElementById("prop-place");
    const descInput = document.getElementById("prop-desc");
    const formEl = document.getElementById("new-proposal-form");

    if (ejeSelect && ejeId) {
      ejeSelect.value = String(ejeId);
    }
    if (titleInput) {
      titleInput.value = `Mejora para ${actionCode}: `;
    }
    if (placeInput) {
      placeInput.value = `Orcera (Acción ${actionCode})`;
    }
    if (descInput) {
      descInput.value = `Propuesta vinculada a la acción ${actionCode} ("${actionTitle}"):\n[Escribe aquí tu propuesta o solicitud formal...]`;
      descInput.focus();
      descInput.setSelectionRange(descInput.value.length, descInput.value.length);
    }

    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (typeof showToast === "function") {
      showToast(
        `Vinculado a ${actionCode}`,
        "El formulario del Buzón se ha preconfigurado con esta acción. Si consigues 25 votos de otros jóvenes, pasará al Pleno del Ayuntamiento."
      );
    }
  }, 250);
}

window.openActionDetailModal = openActionDetailModal;
window.closeActionDetailModal = closeActionDetailModal;
window.switchActionTab = switchActionTab;
window.initActionComments = initActionComments;
window.renderActionComments = renderActionComments;
window.toggleActionCommentForm = toggleActionCommentForm;
window.setActionCommentRating = setActionCommentRating;
window.setActionCommentTag = setActionCommentTag;
window.submitActionComment = submitActionComment;
window.toggleActionCommentLike = toggleActionCommentLike;
window.linkActionToBuzonProposal = linkActionToBuzonProposal;

// ==============================================================================
// MÓDULO: EVALUACIÓN PREVIA & DICTAMEN CIUDADANO JUVENIL (2027–2031)
// ==============================================================================
const EVALUACION_STORAGE_KEY = "kliko_evaluacion_previa_v1";

const EvaluacionState = {
  selectedYear: "2027",
  selectedEje: "all",
  selectedStatus: "all"
};

function getEvaluacionData() {
  const raw = localStorage.getItem(EVALUACION_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.userActionVotes) return parsed;
    } catch (e) {
      console.error(e);
    }
  }

  // Baseline inicial con evaluadores jóvenes de Orcera y notas promedio realistas
  const baseline = {
    userActionVotes: {},
    userIndicatorVotes: {},
    communityActionVotes: {},
    communityIndicatorVotes: {}
  };

  if (typeof EJES_DATA !== "undefined" && Array.isArray(EJES_DATA)) {
    EJES_DATA.forEach(eje => {
      eje.acciones.forEach((acc, idx) => {
        const seedCount = 55 + ((acc.codigo.length * 5 + idx * 7) % 35);
        const seedAvg = Number((4.3 + (((idx * 11 + eje.id * 3) % 7) * 0.1)).toFixed(1));
        baseline.communityActionVotes[acc.codigo] = { avg: Math.min(5.0, seedAvg), count: seedCount };

        if (acc.indicadores && Array.isArray(acc.indicadores)) {
          acc.indicadores.forEach((ind, indIdx) => {
            const indCount = seedCount - (indIdx % 3);
            const indAvg = Number((4.2 + (((indIdx * 13 + idx * 3) % 8) * 0.1)).toFixed(1));
            baseline.communityIndicatorVotes[ind.id] = { avg: Math.min(5.0, indAvg), count: indCount };
          });
        }
      });
    });
  }

  saveEvaluacionData(baseline);
  return baseline;
}

function saveEvaluacionData(data) {
  localStorage.setItem(EVALUACION_STORAGE_KEY, JSON.stringify(data));
}

function initEvaluacionPrevia() {
  setupEvaluacionFilters();
  renderEvaluacionHeroBox();
  renderEvaluacionActionsList();
}

function setupEvaluacionFilters() {
  const yearsContainer = document.getElementById("eval-years-selector");
  if (yearsContainer) {
    yearsContainer.querySelectorAll(".btn-eval-year").forEach(btn => {
      btn.addEventListener("click", () => {
        yearsContainer.querySelectorAll(".btn-eval-year").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        EvaluacionState.selectedYear = btn.getAttribute("data-eval-year");
        renderEvaluacionHeroBox();
        renderEvaluacionActionsList();
      });
    });
  }

  const ejeSelect = document.getElementById("eval-filter-eje");
  if (ejeSelect) {
    ejeSelect.addEventListener("change", (e) => {
      EvaluacionState.selectedEje = e.target.value;
      renderEvaluacionActionsList();
    });
  }

  const statusSelect = document.getElementById("eval-filter-status");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      EvaluacionState.selectedStatus = e.target.value;
      renderEvaluacionActionsList();
    });
  }
}

function getAllActionsList() {
  const list = [];
  if (typeof EJES_DATA === "undefined" || !Array.isArray(EJES_DATA)) return list;
  EJES_DATA.forEach(eje => {
    eje.acciones.forEach(acc => {
      list.push({
        ...acc,
        ejeId: eje.id,
        ejeNumero: eje.numero,
        ejeTitulo: eje.titulo,
        ejeColor: eje.color || "#10b981",
        roadmapAnos: (acc.roadmap && acc.roadmap.anos) ? acc.roadmap.anos : [2027, 2028, 2029, 2030, 2031]
      });
    });
  });
  return list;
}

function renderEvaluacionHeroBox() {
  const heroBox = document.getElementById("eval-hero-box");
  if (!heroBox) return;

  const evalData = getEvaluacionData();
  const allActions = getAllActionsList();
  const selYear = EvaluacionState.selectedYear;

  const activeActions = selYear === "all" 
    ? allActions 
    : allActions.filter(a => a.roadmapAnos.includes(parseInt(selYear)));

  const totalActions = activeActions.length;
  let votedCount = 0;
  activeActions.forEach(a => {
    if (evalData.userActionVotes[a.codigo]) votedCount++;
  });

  const pct = totalActions > 0 ? Math.round((votedCount / totalActions) * 100) : 0;
  const userActionVotesCount = Object.keys(evalData.userActionVotes).length;
  const userIndicatorVotesCount = Object.keys(evalData.userIndicatorVotes).length;
  const ptsEarned = (userActionVotesCount * 20) + (userIndicatorVotesCount * 10);

  let sumAvg = 0;
  let countAvg = 0;
  activeActions.forEach(a => {
    const sc = evalData.communityActionVotes[a.codigo];
    if (sc) {
      sumAvg += sc.avg;
      countAvg++;
    }
  });
  const globalYearAvg = countAvg > 0 ? (sumAvg / countAvg).toFixed(1) : "4.7";
  const globalYearPct = Math.round((parseFloat(globalYearAvg) / 5) * 100);
  const yearLabel = selYear === "all" ? "Plan Quinquenal (2027–2031)" : `Año ${selYear}`;

  heroBox.innerHTML = `
    <div class="eval-hero-header">
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="eval-badge-pill">🗳️ Tu Dictamen Juvenil</span>
        <span style="font-size:0.75rem; color:var(--text-muted);">${yearLabel}</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:0.75rem; font-weight:800; color:#fbbf24;">Respaldo Global: ⭐ ${globalYearAvg} (${globalYearPct}%)</span>
        <span style="font-size:0.8rem; font-weight:800; color:#34d399; background:rgba(16,185,129,0.15); padding:2px 8px; border-radius:9999px;">+${ptsEarned} PTS</span>
      </div>
    </div>

    <div class="eval-progress-info">
      <span>Medidas evaluadas: <strong>${votedCount} de ${totalActions}</strong></span>
      <span>${pct}% Completado</span>
    </div>

    <div class="eval-progress-bar-track">
      <div class="eval-progress-bar-fill" style="width: ${pct}%;"></div>
    </div>

    <div class="eval-reward-cta-row">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:1.25rem;">🏊‍♂️</span>
        <div class="eval-reward-text">
          <strong>Recompensa Cívica:</strong> Cada acción da <strong>+20 Pts</strong> y cada indicador <strong>+10 Pts</strong>. Con 150 Pts desbloqueas el <em>Bono Auditor/a Joven en Amurjo</em>.
        </div>
      </div>
      <button type="button" class="btn-action-back" onclick="window.switchTab && window.switchTab('tab-gamificacion')" style="font-size:0.68rem; padding:5px 12px; white-space:nowrap; font-weight:800;">
        🎁 Canjes
      </button>
    </div>
  `;
}

function renderEvaluacionActionsList() {
  const container = document.getElementById("eval-actions-list");
  if (!container) return;

  const evalData = getEvaluacionData();
  const allActions = getAllActionsList();
  const { selectedYear, selectedEje, selectedStatus } = EvaluacionState;

  let filtered = allActions.filter(a => {
    if (selectedYear !== "all") {
      if (!a.roadmapAnos.includes(parseInt(selectedYear))) return false;
    }
    if (selectedEje !== "all") {
      if (a.ejeId !== parseInt(selectedEje)) return false;
    }
    const hasVoted = !!evalData.userActionVotes[a.codigo];
    if (selectedStatus === "pending" && hasVoted) return false;
    if (selectedStatus === "voted" && !hasVoted) return false;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:32px 16px; background:var(--segura-surface); border:1px dashed var(--segura-border); border-radius:var(--radius-md);">
        <span style="font-size:2rem; display:block; margin-bottom:8px;">🎉</span>
        <h4 style="margin:0 0 6px; font-size:0.95rem; color:var(--text-main);">No hay acciones pendientes con estos filtros</h4>
        <p style="font-size:0.75rem; color:var(--text-muted); margin:0 0 12px;">¡Has completado la evaluación de este grupo o no hay medidas activas para ese año!</p>
        <button type="button" class="btn-primary" onclick="resetEvaluacionFilters()" style="font-size:0.75rem; padding:6px 14px;">
          Ver todas las medidas de 2027
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(a => {
    const userScore = evalData.userActionVotes[a.codigo] || 0;
    const commScore = evalData.communityActionVotes[a.codigo] || { avg: 4.6, count: 60 };
    const hasVoted = userScore > 0;
    const indicators = a.indicadores || [];

    const starHints = {
      1: "⭐ 1: Prescindible / Desacuerdo",
      2: "⭐ 2: Prioridad Baja",
      3: "⭐ 3: Aceptable / Neutral",
      4: "⭐ 4: Importante / Respaldo",
      5: "⭐ 5: ¡Prioridad Máxima / Respaldo Total!"
    };

    return `
      <div class="eval-action-card ${hasVoted ? 'evaluated' : ''}" id="eval-card-${a.codigo}">
        <div class="eval-card-header">
          <div class="eval-card-tags">
            <span class="eval-tag-code">${a.codigo}</span>
            <span class="eval-tag-eje" style="color: ${a.ejeColor}; font-weight:700;">🏛️ Eje ${a.ejeNumero}</span>
            <span class="badge-duracion dur-5_anos" style="font-size:0.64rem; padding:2px 7px;">⏱️ ${a.roadmap ? a.roadmap.vigencia : '2027–2031'}</span>
          </div>
          <span class="eval-status-badge ${hasVoted ? 'voted' : 'pending'}">
            ${hasVoted ? '✅ Evaluada (+20 Pts)' : '⏳ Pendiente de tu voto'}
          </span>
        </div>

        <h3 class="eval-card-title">${a.titulo}</h3>

        <div style="font-size:0.73rem; color:var(--text-muted); display:flex; gap:12px; flex-wrap:wrap;">
          <span><strong>Organismo:</strong> ${a.responsable || 'Ayto. de Orcera'}</span>
          <span><strong>Recursos:</strong> ${a.recursos || 'Fondo municipal'}</span>
        </div>

        <!-- 1. Votación de la Acción -->
        <div class="eval-vote-box">
          <div class="eval-vote-box-header">
            <strong>¿Respaldas esta medida para la juventud de Orcera?</strong>
            <span style="color:#fbbf24; font-weight:800;">⭐ ${commScore.avg} / 5 (${commScore.count} votos)</span>
          </div>
          
          <div class="eval-stars-picker">
            ${[1, 2, 3, 4, 5].map(star => `
              <button type="button" class="btn-eval-star ${userScore >= star ? 'active' : ''}" 
                onclick="voteActionEvaluacion('${a.codigo}', ${star})" 
                title="${starHints[star]}">
                ★
              </button>
            `).join("")}
          </div>

          <div class="eval-vote-hint" id="eval-hint-${a.codigo}">
            ${userScore > 0 ? starHints[userScore] : 'Toca una estrella para dar tu respaldo ciudadano (+20 Pts)'}
          </div>
        </div>

        <!-- 2. Evaluación de sus Indicadores de Logro -->
        ${indicators.length > 0 ? `
          <div class="eval-indicators-wrapper">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
              <span style="font-size:0.73rem; font-weight:700; color:var(--emerald);">
                📊 Valora sus Indicadores Oficiales (${indicators.length}):
              </span>
              <span style="font-size:0.65rem; color:var(--text-dim);">¿Miden bien el éxito? (+10 Pts c/u)</span>
            </div>

            ${indicators.map(ind => {
              const userIndScore = evalData.userIndicatorVotes[ind.id] || 0;
              const commIndScore = evalData.communityIndicatorVotes[ind.id] || { avg: 4.5, count: 50 };
              return `
                <div class="eval-indicator-card">
                  <div class="eval-indicator-top">
                    <div>
                      <strong style="color:var(--amurjo-cyan); font-family:monospace; font-size:0.68rem;">${ind.codigo || ind.id}</strong>
                      <span class="eval-indicator-name"> · ${ind.nombre}</span>
                      <div style="font-size:0.63rem; color:var(--text-dim); margin-top:2px;">
                        Meta: <strong>${ind.metaQuinquenal} ${ind.unidad}</strong> (${ind.tipo})
                      </div>
                    </div>
                    <span style="font-size:0.68rem; font-weight:800; color:#fbbf24; white-space:nowrap;">
                      ⭐ ${commIndScore.avg}
                    </span>
                  </div>

                  <div style="display:flex; justify-content:space-between; align-items:center; margin-top:3px;">
                    <span style="font-size:0.65rem; color:var(--text-muted);">
                      ${userIndScore > 0 ? `Tu valoración: <strong>${userIndScore} ★</strong>` : `¿Es adecuado este indicador?`}
                    </span>
                    <div class="eval-indicator-stars">
                      ${[1, 2, 3, 4, 5].map(st => `
                        <button type="button" class="btn-ind-star ${userIndScore >= st ? 'active' : ''}" 
                          onclick="voteIndicatorEvaluacion('${a.codigo}', '${ind.id}', ${st})" 
                          title="${st} estrellas">
                          ★
                        </button>
                      `).join("")}
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        ` : ''}

        <!-- Botón Ver Ficha Completa -->
        <div style="display:flex; justify-content:flex-end; border-top:1px solid var(--segura-border); padding-top:8px;">
          <button type="button" class="btn-action-back" onclick="openActionDetailModal('${a.codigo}', ${a.ejeId})" style="font-size:0.7rem; padding:4px 12px;">
            🔍 Ver Ficha Técnica y Fondos
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function voteActionEvaluacion(actionCode, score) {
  const evalData = getEvaluacionData();
  const isFirstVote = !evalData.userActionVotes[actionCode];
  evalData.userActionVotes[actionCode] = score;

  const curr = evalData.communityActionVotes[actionCode] || { avg: 4.5, count: 55 };
  if (isFirstVote) {
    const newCount = curr.count + 1;
    const newAvg = Number(((curr.avg * curr.count + score) / newCount).toFixed(1));
    evalData.communityActionVotes[actionCode] = { avg: Math.min(5.0, newAvg), count: newCount };
  }

  saveEvaluacionData(evalData);
  renderEvaluacionHeroBox();
  renderEvaluacionActionsList();

  if (typeof rewardPoints === "function") {
    rewardPoints(20, `Voto registrado en Evaluación Previa (${actionCode}: ${score} ⭐)`);
  } else if (typeof showToast === "function") {
    showToast("¡Voto Registrado!", `Has valorado la acción ${actionCode} con ${score} estrellas (+20 Pts).`);
  }
}

function voteIndicatorEvaluacion(actionCode, indicatorId, score) {
  const evalData = getEvaluacionData();
  const isFirstVote = !evalData.userIndicatorVotes[indicatorId];
  evalData.userIndicatorVotes[indicatorId] = score;

  const curr = evalData.communityIndicatorVotes[indicatorId] || { avg: 4.5, count: 48 };
  if (isFirstVote) {
    const newCount = curr.count + 1;
    const newAvg = Number(((curr.avg * curr.count + score) / newCount).toFixed(1));
    evalData.communityIndicatorVotes[indicatorId] = { avg: Math.min(5.0, newAvg), count: newCount };
  }

  saveEvaluacionData(evalData);
  renderEvaluacionHeroBox();
  renderEvaluacionActionsList();

  if (typeof rewardPoints === "function") {
    rewardPoints(10, `Indicador evaluado con ${score} ⭐ (+10 Pts)`);
  } else if (typeof showToast === "function") {
    showToast("Indicador Valorado", `Tu dictamen sobre el indicador ha sido guardado (+10 Pts).`);
  }
}

function resetEvaluacionFilters() {
  EvaluacionState.selectedYear = "2027";
  EvaluacionState.selectedEje = "all";
  EvaluacionState.selectedStatus = "all";

  const yearsContainer = document.getElementById("eval-years-selector");
  if (yearsContainer) {
    yearsContainer.querySelectorAll(".btn-eval-year").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-eval-year") === "2027");
    });
  }
  const ejeSelect = document.getElementById("eval-filter-eje");
  if (ejeSelect) ejeSelect.value = "all";
  const statusSelect = document.getElementById("eval-filter-status");
  if (statusSelect) statusSelect.value = "all";

  renderEvaluacionHeroBox();
  renderEvaluacionActionsList();
}

function goToEvaluacionAction(actionCode) {
  if (window.switchTab) {
    window.switchTab("tab-evaluacion");
  }
  setTimeout(() => {
    const card = document.getElementById("eval-card-" + actionCode);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.style.boxShadow = "0 0 20px var(--emerald)";
      setTimeout(() => card.style.boxShadow = "", 1500);
    }
  }, 250);
}

window.initEvaluacionPrevia = initEvaluacionPrevia;
window.voteActionEvaluacion = voteActionEvaluacion;
window.voteIndicatorEvaluacion = voteIndicatorEvaluacion;
window.resetEvaluacionFilters = resetEvaluacionFilters;
window.goToEvaluacionAction = goToEvaluacionAction;

// ==============================================================================
// MÓDULO 3: GAMIFICACIÓN Y CANJES DE LA PISCINA DE AMURJO
// ==============================================================================
function initGamification() {
  renderRewards();
  setupQRModal();
  setupJustificanteModal();
  setupAsociacionEvents();
}

function renderRewards() {
  const container = document.getElementById("rewards-grid");
  if (!container) return;

  container.innerHTML = RECOMPENSAS_DATA.map(item => `
    <div class="reward-card">
      <div class="reward-icon-box ${item.categoria}">${item.icono}</div>
      <div class="reward-info">
        <h4 class="reward-title">${item.titulo}</h4>
        <p class="reward-desc">${item.descripcion}</p>
        <div class="reward-cost">⚡ ${item.costePuntos} Puntos Orcera</div>
      </div>
      <button class="btn-redeem ${item.esAltaAsociacion ? 'btn-asociacion-reward' : ''}" data-reward-id="${item.id}" data-cost="${item.costePuntos}" style="${item.esAltaAsociacion ? 'background: linear-gradient(135deg, #8b5cf6, #06b6d4); font-weight:800;' : ''}">
        ${item.esAltaAsociacion ? (AppState.currentUser && AppState.currentUser.esSocioAJO ? 'Ver Mi Carnet' : 'Solicitar Alta Gratis') : 'Canjear'}
      </button>
    </div>
  `).join("");

  container.querySelectorAll(".btn-redeem").forEach(btn => {
    btn.addEventListener("click", () => {
      const cost = parseInt(btn.getAttribute("data-cost"));
      const rId = parseInt(btn.getAttribute("data-reward-id"));
      const reward = RECOMPENSAS_DATA.find(r => r.id === rId);

      if (reward.esAltaAsociacion) {
        openAsociacionModal();
        return;
      }

      if (AppState.userPoints < cost) {
        alert(`Necesitas ${cost} puntos para esta recompensa. Tienes ${AppState.userPoints} pts. ¡Participa en votaciones o valora actividades para conseguir más!`);
        return;
      }

      // Descontar puntos y abrir modal con código QR
      AppState.userPoints -= cost;
      if (AppState.currentUser) {
        AppState.currentUser.puntos = AppState.userPoints;
        saveUsersToStorage();
      }
      updatePointsDisplays();
      updateUserUI();
      openQRModal(reward);
    });
  });
}

function setupQRModal() {
  const modal = document.getElementById("qr-modal");
  const closeBtn = document.getElementById("close-qr-modal");
  const doneBtn = document.getElementById("qr-done-btn");

  if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  if (doneBtn) doneBtn.addEventListener("click", () => modal.classList.remove("active"));
}

function openQRModal(reward) {
  const modal = document.getElementById("qr-modal");
  const title = document.getElementById("qr-modal-title");
  const code = document.getElementById("qr-modal-code");

  if (title) title.textContent = reward.titulo;
  const ticketCode = `ORC-${reward.id}-${Math.floor(100000 + Math.random() * 900000)}-TICKET`;
  if (code) code.textContent = ticketCode;

  renderStandardQRCode("qr-modal-render-area", ticketCode, 160);

  if (window.KlikoDB) {
    window.KlikoDB.registrarCanje(reward, ticketCode, AppState.currentUser);
  }

  modal.classList.add("active");
}

// ==============================================================================
// MÓDULO 4: BUZÓN PARTICIPATIVO Y VOTACIÓN DE PROPUESTAS
// ==============================================================================
function initBuzon() {
  renderProposals();

  // Sincronizar propuestas desde Supabase en la nube
  if (window.KlikoDB) {
    window.KlikoDB.getPropuestas().then(remoteProps => {
      if (remoteProps && remoteProps.length > 0) {
        remoteProps.forEach(p => {
          const ejeObj = EJES_DATA.find(x => x.id === p.ejeId);
          p.ejeNombre = ejeObj ? `Eje ${p.ejeId}: ${ejeObj.titulo}` : `Eje ${p.ejeId}`;
        });
        propuestasComunitarias = remoteProps;
        renderProposals();
      }
    });

    // Suscripción a eventos realtime de nuevas propuestas
    window.addEventListener('kliko:propuesta_creada', (e) => {
      const p = e.detail;
      if (p && !propuestasComunitarias.some(x => String(x.id) === String(p.id))) {
        const ejeObj = EJES_DATA.find(x => x.id === p.eje_id);
        propuestasComunitarias.unshift({
          id: p.id,
          autor: p.autor_nombre || 'Joven de Orcera',
          ejeId: p.eje_id || 1,
          ejeNombre: ejeObj ? `Eje ${p.eje_id}: ${ejeObj.titulo}` : `Eje ${p.eje_id || 1}`,
          titulo: p.titulo,
          descripcion: p.descripcion,
          ubicacion: p.ubicacion_orcerena || 'Orcera',
          votos: p.votos_favorables || 1,
          estado: p.estado || 'recibida',
          apoyadaPorUsuario: false
        });
        renderProposals();
        showToast("⚡ Nueva Propuesta en Orcera", `"${p.titulo}" acaba de publicarse.`);
      }
    });
  }

  const form = document.getElementById("new-proposal-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("prop-title").value.trim();
      const ejeId = parseInt(document.getElementById("prop-eje").value);
      const place = document.getElementById("prop-place").value.trim() || "Orcera";
      const desc = document.getElementById("prop-desc").value.trim();

      if (!AppState.currentUser) {
        openUserModal();
        showToast("Identifícate", "Por favor, regístrate o inicia sesión para enviar propuestas al buzón.");
        return;
      }

      const consent = document.getElementById("prop-consent-rgpd");
      if (consent && !consent.checked) {
        showToast("Consentimiento Requerido", "Debes aceptar la política de privacidad y protección de datos para publicar una propuesta.");
        return;
      }

      const newProp = {
        id: Date.now(),
        autor: `${AppState.currentUser.alias || AppState.currentUser.nombre} (${AppState.currentUser.edad ? AppState.currentUser.edad + " años" : "Joven de Orcera"})`,
        ejeId: ejeId,
        ejeNombre: `Eje ${ejeId}: ${EJES_DATA.find(x => x.id === ejeId)?.titulo || ''}`,
        titulo: title,
        descripcion: desc,
        ubicacion: place,
        votos: 1,
        apoyadaPorUsuario: true,
        estado: "Recibida (Faltan 24 apoyos)"
      };

      propuestasComunitarias.unshift(newProp);

      if (window.KlikoDB) {
        window.KlikoDB.addPropuesta(newProp).then(created => {
          if (created && created.id) newProp.id = created.id;
        });
      }

      form.reset();
      renderProposals();
      rewardPoints(50, "¡Propuesta enviada al buzón! Ganaste 50 Puntos Orcera");
    });
  }
}

function renderProposals() {
  const container = document.getElementById("proposals-list");
  if (!container) return;

  container.innerHTML = propuestasComunitarias.map(p => `
    <div class="community-prop-card">
      <div class="prop-badge-line">
        <span class="prop-eje-tag">${p.ejeNombre}</span>
        <span class="prop-state-tag">${p.estado}</span>
      </div>
      <div class="prop-content">
        <h4>${p.titulo}</h4>
        <p>${p.descripcion}</p>
        <small style="color: var(--amurjo-cyan); font-size: 0.68rem; display:block; margin-top:4px;">📍 ${p.ubicacion}</small>
      </div>
      <div class="prop-footer-vote">
        <span class="prop-author">Por ${p.autor}</span>
        <button class="btn-vote-prop ${p.apoyadaPorUsuario ? 'voted' : ''}" data-prop-id="${p.id}">
          <span>👍</span>
          <span>${p.votos} apoyos</span>
        </button>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".btn-vote-prop").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = btn.getAttribute("data-prop-id");
      const p = propuestasComunitarias.find(x => String(x.id) === String(pId));
      if (!p) return;

      if (p.apoyadaPorUsuario) {
        p.votos--;
        p.apoyadaPorUsuario = false;
      } else {
        p.votos++;
        p.apoyadaPorUsuario = true;
        rewardPoints(15, `¡Apoyaste: "${p.titulo}"!`);
      }

      if (window.KlikoDB) {
        window.KlikoDB.votePropuesta(p.id, p.votos);
      }

      renderProposals();
    });
  });
}

// ==============================================================================
// HELPERS, PUNTOS Y RECALCULO DE KPIS
// ==============================================================================
function rewardPoints(pts, message) {
  if (!AppState.currentUser) {
    showToast(`¡Regístrate para sumar +${pts} Pts!`, "Pulsa en tu avatar o cabecera para identificarte y empezar a acumular puntos.");
    return;
  }

  AppState.userPoints += pts;
  AppState.currentUser.puntos = AppState.userPoints;
  const lvl = calculateLevel(AppState.userPoints);
  AppState.currentUser.nivel = lvl.nivel;
  AppState.currentUser.nivelBadge = lvl.badge;
  AppState.userLevel = lvl.nivel;

  saveSessionToStorage(AppState.currentUser);
  updatePointsDisplays();
  updateUserUI();

  showToast(`+${pts} Puntos Orcera`, message);
}

function updatePointsDisplays() {
  const topPill = document.getElementById("user-points-val");
  const cardPts = document.getElementById("card-display-points");

  if (topPill) topPill.textContent = AppState.userPoints;
  if (cardPts) cardPts.textContent = `${AppState.userPoints} PTS`;
}

function updateGlobalBentoKPIs() {
  const totalBudget = EJES_DATA.reduce((acc, e) => acc + e.presupuestoAnual, 0); // 15.000 €
  const totalReal = EJES_DATA.reduce((acc, e) => acc + e.presupuestoReal2027, 0); // ~11.460 €
  const globalExecPercent = ((totalReal / totalBudget) * 100).toFixed(1);

  let totalActions = 0;
  let allRatings = [];

  EJES_DATA.forEach(e => {
    totalActions += e.acciones.length;
    e.valoraciones.forEach(v => allRatings.push(v.estrellas));
  });

  const avgSatisfaction = (allRatings.reduce((a, b) => a + b, 0) / (allRatings.length || 1)).toFixed(1);

  // Actualizar elementos DOM
  const execPctEl = document.getElementById("global-exec-percent");
  const execBarEl = document.getElementById("global-progress-bar");
  const actionsEl = document.getElementById("total-actions-count");
  const satisfEl = document.getElementById("global-satisfaction-val");
  const votesEl = document.getElementById("global-votes-count");

  if (execPctEl) execPctEl.textContent = `${globalExecPercent}%`;
  if (execBarEl) execBarEl.style.width = `${globalExecPercent}%`;
  if (actionsEl) actionsEl.textContent = `${totalActions} Acciones`;
  if (satisfEl) satisfEl.textContent = `${avgSatisfaction} ★`;
  if (votesEl) votesEl.textContent = `${allRatings.length} valoraciones`;
}


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


// ==============================================================================

// ==============================================================================
// SISTEMA DE GESTIÓN DE IDENTIDAD CÍVICA, AUTENTICACIÓN REAL Y SESIÓN LIMPIA
// ==============================================================================
const DEMO_SARA_USER = {
  id: "user-sara-demo",
  nombre: "Sara Jiménez Navío",
  alias: "Sara",
  iniciales: "SJ",
  edad: 20,
  rangoEdad: "19-24",
  dni: "***4829*",
  empadronado: true,
  puntos: 290,
  nivel: "Nivel 2: Activista de Orcera",
  nivelBadge: "Nivel 2 · Activista",
  hash: "#ORC-2027-LIVE",
  rol: "joven"
};

function initUserSession() {
  loadSessionFromStorage();
  setupUserModalEvents();
  updateUserUI();
}

function loadSessionFromStorage() {
  try {
    const rawSession = localStorage.getItem("orcera_session_user_v3");
    if (rawSession) {
      AppState.currentUser = JSON.parse(rawSession);
      AppState.userPoints = AppState.currentUser.puntos || 0;
      AppState.userLevel = AppState.currentUser.nivel || "Nivel 1: Joven de Orcera";
    } else {
      // Por defecto iniciamos con la cuenta Demo precargada si es la primera visita para no dejar la app vacía,
      // pero el usuario puede pulsar Cerrar Sesión en cualquier momento para ser Visitante o Registrarse con su nombre.
      const hasVisited = localStorage.getItem("orcera_has_visited_v3");
      if (!hasVisited) {
        localStorage.setItem("orcera_has_visited_v3", "true");
        AppState.currentUser = JSON.parse(JSON.stringify(DEMO_SARA_USER));
        saveSessionToStorage(AppState.currentUser);
        AppState.userPoints = AppState.currentUser.puntos;
        AppState.userLevel = AppState.currentUser.nivel;
      } else {
        AppState.currentUser = null;
        AppState.userPoints = 0;
        AppState.userLevel = "Modo Visitante";
      }
    }
  } catch (e) {
    console.error("Error al cargar sesión:", e);
    AppState.currentUser = null;
    AppState.userPoints = 0;
    AppState.userLevel = "Modo Visitante";
  }
}

function saveSessionToStorage(user) {
  try {
    if (user) {
      localStorage.setItem("orcera_session_user_v3", JSON.stringify(user));
      // Guardar también en lista de cuentas registradas en este navegador para facilitar inicio de sesión
      let saved = getSavedAccountsList();
      const idx = saved.findIndex(u => u.id === user.id);
      if (idx >= 0) {
        saved[idx] = user;
      } else {
        saved.push(user);
      }
      localStorage.setItem("orcera_saved_accounts_v3", JSON.stringify(saved));
    } else {
      localStorage.removeItem("orcera_session_user_v3");
    }
  } catch (e) {
    console.warn("No se pudo guardar la sesión:", e);
  }
}

function getSavedAccountsList() {
  try {
    const raw = localStorage.getItem("orcera_saved_accounts_v3");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function calculateLevel(pts) {
  if (pts > 800) {
    return {
      tier: 4,
      nivel: "Nivel 4: Leyenda Joven de Orcera",
      badge: "Nivel 4 · Leyenda Joven",
      min: 801,
      max: Infinity,
      nextLevel: null,
      ptsToNext: 0,
      progressPercent: 100
    };
  }
  if (pts >= 401) {
    const range = 801 - 401;
    const current = pts - 401;
    const pct = Math.min(100, Math.max(0, Math.round((current / range) * 100)));
    return {
      tier: 3,
      nivel: "Nivel 3: Motor de Orcera",
      badge: "Nivel 3 · Motor de Orcera",
      min: 401,
      max: 800,
      nextLevel: "Nivel 4: Leyenda Joven de Orcera",
      ptsToNext: 801 - pts,
      progressPercent: pct
    };
  }
  if (pts >= 151) {
    const range = 401 - 151;
    const current = pts - 151;
    const pct = Math.min(100, Math.max(0, Math.round((current / range) * 100)));
    return {
      tier: 2,
      nivel: "Nivel 2: Activista de Orcera",
      badge: "Nivel 2 · Activista",
      min: 151,
      max: 400,
      nextLevel: "Nivel 3: Motor de Orcera",
      ptsToNext: 401 - pts,
      progressPercent: pct
    };
  }
  // Nivel 1: 0 - 150 pts
  const range = 151;
  const current = pts;
  const pct = Math.min(100, Math.max(0, Math.round((current / range) * 100)));
  return {
    tier: 1,
    nivel: "Nivel 1: Explorador del Municipio de Orcera",
    badge: "Nivel 1 · Explorador",
    min: 0,
    max: 150,
    nextLevel: "Nivel 2: Activista de Orcera",
    ptsToNext: 151 - pts,
    progressPercent: pct
  };
}

function updateUserUI() {
  const user = AppState.currentUser;
  const isLogged = !!user;

  // 1. Cabecera móvil (App Topbar)
  const greetingEl = document.getElementById("header-user-greeting");
  const initialsEl = document.getElementById("header-avatar-initials");
  const levelBadgeEl = document.getElementById("user-level-badge");
  const topPointsEl = document.getElementById("user-points-val");
  const cardPtsEl = document.getElementById("card-display-points");

  if (greetingEl) {
    greetingEl.textContent = isLogged ? `¡Hola, ${user.alias || user.nombre}! 👋` : "¡Bienvenid@! 👋";
  }
  if (initialsEl) {
    initialsEl.textContent = isLogged ? (user.iniciales || user.nombre.substring(0, 2).toUpperCase()) : "👤";
  }
  if (levelBadgeEl) {
    levelBadgeEl.textContent = isLogged ? user.nivel : "Toca para Identificarte / Registrarte";
  }
  if (topPointsEl) {
    topPointsEl.textContent = isLogged ? user.puntos : 0;
  }
  if (cardPtsEl) {
    cardPtsEl.textContent = isLogged ? `${user.puntos} PTS` : "0 PTS";
  }

  // 2. Botón de la barra superior (Toolbar)
  const toolbarName = document.getElementById("toolbar-user-name");
  if (toolbarName) {
    toolbarName.textContent = isLogged ? `${user.alias || user.nombre} (Mi Cuenta)` : "Acceso / Registro";
  }

  // 3. Tarjeta Cívica en pestaña Gamificación
  const cardNameEl = document.getElementById("civic-card-name");
  const cardRoleEl = document.getElementById("civic-card-role");
  const cardDniEl = document.getElementById("civic-card-dni");
  const cardHashEl = document.getElementById("civic-card-hash");

  if (cardNameEl) cardNameEl.textContent = isLogged ? user.nombre : "Identifícate para activar tu Carnet";
  if (cardRoleEl) cardRoleEl.textContent = isLogged ? (user.nivelBadge || "Nivel 1 · Joven Activo") : "Sin Sesión Activa";
  if (cardDniEl) cardDniEl.textContent = isLogged ? `DNI: ${user.dni} · Orcera (Jaén)` : "Orcera (Jaén) · Modo Público";
  if (cardHashEl) cardHashEl.textContent = isLogged ? user.hash : "#ORC-2027-VISITANTE";

  // 4. Actualizar vista del Modal según estado
  const viewLogged = document.getElementById("user-view-logged");
  const viewGuest = document.getElementById("user-view-guest");
  const modalTitle = document.getElementById("modal-header-title");
  const modalDesc = document.getElementById("modal-header-desc");

  if (isLogged) {
    if (viewLogged) viewLogged.style.display = "block";
    if (viewGuest) viewGuest.style.display = "none";
    if (modalTitle) modalTitle.textContent = "👤 Mi Cuenta Cívica";
    if (modalDesc) modalDesc.textContent = "Sesión activa en este dispositivo";

    const modalAvatar = document.getElementById("modal-user-avatar");
    const modalName = document.getElementById("modal-user-name");
    const modalBadge = document.getElementById("modal-user-role-badge");
    const modalPts = document.getElementById("modal-user-points");
    const modalPadron = document.getElementById("modal-user-padron-status");
    const modalAge = document.getElementById("modal-user-age");
    const modalDni = document.getElementById("modal-user-dni");
    const modalHash = document.getElementById("modal-user-hash");

    if (modalAvatar) modalAvatar.textContent = user.iniciales || user.nombre.substring(0, 2).toUpperCase();
    if (modalName) modalName.textContent = user.nombre;
    if (modalBadge) modalBadge.textContent = user.nivelBadge || user.nivel;
    if (modalPts) modalPts.textContent = `${user.puntos} PTS`;
    if (modalPadron) {
      modalPadron.textContent = user.empadronado ? "✅ Empadronado/a" : "⚠️ No empadronado";
      modalPadron.style.color = user.empadronado ? "#10b981" : "#f59e0b";
    }
    if (modalAge) {
      modalAge.textContent = user.edad ? `${user.edad} años (Tramo ${user.rangoEdad || 'Juventud'})` : "Joven de Orcera";
    }
    if (modalDni) {
      modalDni.textContent = `${user.dni} (Orcera)`;
    }
    if (modalHash) modalHash.textContent = user.hash;
  } else {
    if (viewLogged) viewLogged.style.display = "none";
    if (viewGuest) viewGuest.style.display = "block";
    if (modalTitle) modalTitle.textContent = "🏛️ Acceso Cívico Juvenil";
    if (modalDesc) modalDesc.textContent = "III Plan Municipal de Juventud de Orcera (2027–2031)";

    renderSavedAccountsInLogin();
  }

  updateLevelsExplainerUI();
  updateAsociacionUI();
}

function renderSavedAccountsInLogin() {
  const container = document.getElementById("login-saved-accounts-box");
  if (!container) return;

  const saved = getSavedAccountsList();
  if (saved.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div style="margin-bottom: 12px;">
      <span style="font-size: 0.72rem; color: var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.04em;">Cuentas guardadas en este equipo:</span>
      <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 6px;">
        ${saved.map(acc => `
          <button type="button" class="saved-account-btn" data-saved-id="${acc.id}">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.1rem;">👤</span>
              <div style="text-align:left;">
                <strong style="font-size:0.82rem; display:block;">${acc.nombre}</strong>
                <small style="font-size:0.7rem; color:var(--amurjo-cyan);">${acc.puntos} PTS acumulados</small>
              </div>
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted);">Entrar ➔</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  container.querySelectorAll(".saved-account-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const accId = btn.getAttribute("data-saved-id");
      const found = saved.find(a => a.id === accId);
      if (found) {
        logInWithUser(found);
      }
    });
  });
}

function logInWithUser(user) {
  AppState.currentUser = user;
  AppState.userPoints = user.puntos;
  AppState.userLevel = user.nivel;

  saveSessionToStorage(user);
  if (window.KlikoDB) {
    window.KlikoDB.syncUser(user);
  }
  updateUserUI();
  updatePointsDisplays();
  closeUserModal();

  showToast(`¡Sesión iniciada!`, `Bienvenido/a de nuevo, ${user.alias || user.nombre}.`);
}

function logOut() {
  AppState.currentUser = null;
  AppState.userPoints = 0;
  AppState.userLevel = "Modo Visitante";

  saveSessionToStorage(null);
  updateUserUI();
  updatePointsDisplays();
  closeUserModal();

  showToast("Sesión cerrada", "Ahora estás navegando en modo visitante.");
}

function showToast(titleText, descText) {
  const toast = document.getElementById("points-toast");
  const title = document.getElementById("toast-title");
  const desc = document.getElementById("toast-desc");

  if (toast && title && desc) {
    title.textContent = titleText;
    desc.textContent = descText;
    toast.classList.add("active");
    setTimeout(() => {
      toast.classList.remove("active");
    }, 3200);
  }
}

function setupUserModalEvents() {
  const userModal = document.getElementById("user-modal");
  const openTriggerHeader = document.getElementById("user-pill-trigger");
  const openTriggerToolbar = document.getElementById("user-toolbar-btn");
  const closeBtn = document.getElementById("close-user-modal");

  if (openTriggerHeader) openTriggerHeader.addEventListener("click", openUserModal);
  if (openTriggerToolbar) openTriggerToolbar.addEventListener("click", openUserModal);
  if (closeBtn) closeBtn.addEventListener("click", closeUserModal);

  if (userModal) {
    userModal.addEventListener("click", (e) => {
      if (e.target === userModal) closeUserModal();
    });
  }

  // Botón Cerrar Sesión
  const logoutBtn = document.getElementById("btn-logout-action");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logOut);
  }

  // Pestañas Registrarse / Iniciar Sesión (para visitantes)
  const authTabs = document.querySelectorAll("[data-auth-tab]");
  authTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-auth-tab");
      switchAuthSubTab(target);
    });
  });

  // Formulario de Registro
  const regForm = document.getElementById("form-register-user");
  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleRegisterNewUser();
    });
  }

  // Formulario de Iniciar Sesión manual
  const loginForm = document.getElementById("form-login-user");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleManualLogin();
    });
  }

  // Cargar cuenta demo (Sara)
  const guideToggleBtn = document.getElementById("btn-toggle-pts-guide");
  if (guideToggleBtn) {
    guideToggleBtn.addEventListener("click", () => {
      const guideBox = document.getElementById("pts-earning-guide");
      if (guideBox) {
        const isHidden = guideBox.style.display === "none";
        guideBox.style.display = isHidden ? "block" : "none";
        guideToggleBtn.textContent = isHidden ? "⚡ Ocultar guía de puntos" : "⚡ ¿Cómo sumar puntos?";
      }
    });
  }

  const demoBtn = document.getElementById("btn-load-demo-user");
  if (demoBtn) {
    demoBtn.addEventListener("click", () => {
      logInWithUser(JSON.parse(JSON.stringify(DEMO_SARA_USER)));
    });
  }
}

function openUserModal() {
  const modal = document.getElementById("user-modal");
  if (!modal) return;
  updateUserUI();
  if (!AppState.currentUser) {
    switchAuthSubTab("register");
  }
  modal.classList.add("active");
}

function closeUserModal() {
  const modal = document.getElementById("user-modal");
  if (modal) modal.classList.remove("active");
}

function switchAuthSubTab(tabName) {
  const tabs = document.querySelectorAll("[data-auth-tab]");
  tabs.forEach(t => {
    t.classList.toggle("active", t.getAttribute("data-auth-tab") === tabName);
  });

  const paneReg = document.getElementById("pane-register");
  const paneLogin = document.getElementById("pane-login");

  if (paneReg) paneReg.style.display = tabName === "register" ? "block" : "none";
  if (paneLogin) {
    paneLogin.style.display = tabName === "login" ? "block" : "none";
    if (tabName === "login") renderSavedAccountsInLogin();
  }
}

function handleRegisterNewUser() {
  const fullName = document.getElementById("reg-fullname").value.trim();
  const aliasInput = document.getElementById("reg-alias").value.trim();
  const age = parseInt(document.getElementById("reg-age").value) || 20;
  const dniInput = document.getElementById("reg-dni").value.trim();
  const isEmpadronado = document.getElementById("reg-empadronado").checked;

  if (!fullName) {
    alert("Por favor, introduce tu nombre y apellidos.");
    return;
  }

  const consent = document.getElementById("reg-consent-rgpd");
  if (consent && !consent.checked) {
    showToast("Consentimiento Requerido", "Debes otorgar tu consentimiento sobre protección de datos y privacidad.");
    return;
  }

  const parts = fullName.split(" ").filter(Boolean);
  const alias = aliasInput || parts[0];
  let iniciales = parts[0][0].toUpperCase();
  if (parts.length > 1) {
    iniciales += parts[1][0].toUpperCase();
  } else if (parts[0].length > 1) {
    iniciales += parts[0][1].toUpperCase();
  }

  let rangoEdad = "19-24";
  if (age <= 15) rangoEdad = "12-15";
  else if (age <= 18) rangoEdad = "16-18";
  else if (age <= 24) rangoEdad = "19-24";
  else if (age <= 30) rangoEdad = "25-30";
  else rangoEdad = "+30";

  const maskedDni = dniInput || `***${Math.floor(1000 + Math.random() * 9000)}*`;
  const initialPoints = isEmpadronado ? 50 : 20;
  const levelInfo = calculateLevel(initialPoints);

  const newUser = {
    id: `user-${Date.now()}`,
    nombre: fullName,
    alias: alias,
    iniciales: iniciales,
    edad: age,
    rangoEdad: rangoEdad,
    dni: maskedDni,
    empadronado: isEmpadronado,
    puntos: initialPoints,
    nivel: levelInfo.nivel,
    nivelBadge: levelInfo.badge,
    hash: `#ORC-2027-${Math.floor(1000 + Math.random() * 9000)}`,
    rol: "joven"
  };

  logInWithUser(newUser);

  // Reset del formulario
  document.getElementById("form-register-user").reset();

  showToast(`¡Bienvenido/a, ${alias}! (+${initialPoints} PTS)`, "Tu cuenta joven está activa. Ya puedes votar y proponer ideas.");
}

function handleManualLogin() {
  const query = document.getElementById("login-name").value.trim().toLowerCase();
  if (!query) {
    alert("Por favor, introduce tu nombre o DNI registrado.");
    return;
  }

  const saved = getSavedAccountsList();
  const found = saved.find(u => 
    u.nombre.toLowerCase().includes(query) || 
    (u.alias && u.alias.toLowerCase().includes(query)) ||
    (u.dni && u.dni.toLowerCase().includes(query))
  );

  if (found) {
    logInWithUser(found);
  } else {
    // Si no encuentra una coincidencia exacta, se crea la sesión de forma limpia con ese nombre
    const alias = query.charAt(0).toUpperCase() + query.slice(1);
    const quickUser = {
      id: `user-${Date.now()}`,
      nombre: alias,
      alias: alias,
      iniciales: alias.substring(0, 2).toUpperCase(),
      edad: 20,
      rangoEdad: "19-24",
      dni: `***${Math.floor(1000 + Math.random() * 9000)}*`,
      empadronado: true,
      puntos: 50,
      nivel: "Nivel 1: Joven Activo de Orcera",
      nivelBadge: "Nivel 1 · Activo",
      hash: `#ORC-2027-${Math.floor(1000 + Math.random() * 9000)}`,
      rol: "joven"
    };
    logInWithUser(quickUser);
  }
}


function updateLevelsExplainerUI() {
  const pts = AppState.currentUser ? AppState.currentUser.puntos : 0;
  const lvl = calculateLevel(pts);

  const progCur = document.getElementById("level-prog-current");
  const progNext = document.getElementById("level-prog-next");
  const progFill = document.getElementById("level-progress-bar-fill");

  if (progCur) {
    if (AppState.currentUser) {
      progCur.textContent = `${lvl.nivel} (${pts} PTS)`;
    } else {
      progCur.textContent = "Modo Visitante (0 PTS)";
    }
  }

  if (progNext) {
    if (!AppState.currentUser) {
      progNext.textContent = "Crea tu cuenta para comenzar en Nivel 1";
    } else if (lvl.nextLevel) {
      progNext.textContent = `Te faltan ${lvl.ptsToNext} pts para ${lvl.nextLevel}`;
    } else {
      progNext.textContent = "¡Rango Máximo Alcanzado! 👑";
    }
  }

  if (progFill) {
    progFill.style.width = `${lvl.progressPercent}%`;
  }

  // Resaltar la tarjeta del nivel correspondiente
  for (let t = 1; t <= 4; t++) {
    const card = document.getElementById(`tier-card-${t}`);
    if (card) {
      card.classList.toggle("active-user-tier", AppState.currentUser && lvl.tier === t);
    }
  }
}


// ==============================================================================
// GESTIÓN DE PERTENENCIA: ASOCIACIÓN JUVENIL DE ORCERA
// ==============================================================================
function setupAsociacionEvents() {
  const openBannerBtn = document.getElementById("btn-open-asociacion-form");
  const closeBtn = document.getElementById("close-asociacion-modal");
  const closeOkBtn = document.getElementById("btn-close-ajo-ok");
  const modal = document.getElementById("asociacion-modal");
  const form = document.getElementById("form-solicitud-asociacion");
  const printBtn = document.getElementById("btn-print-ajo-card");

  if (openBannerBtn) openBannerBtn.addEventListener("click", openAsociacionModal);
  if (closeBtn) closeBtn.addEventListener("click", closeAsociacionModal);
  if (closeOkBtn) closeOkBtn.addEventListener("click", closeAsociacionModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAsociacionModal();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSolicitudAsociacion();
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

function openAsociacionModal() {
  const modal = document.getElementById("asociacion-modal");
  if (!modal) return;

  const user = AppState.currentUser;
  const isMember = user && user.esSocioAJO;

  const formBox = document.getElementById("asociacion-form-container");
  const cardBox = document.getElementById("asociacion-card-container");

  if (isMember) {
    if (formBox) formBox.style.display = "none";
    if (cardBox) cardBox.style.display = "block";

    const nameEl = document.getElementById("ajo-display-name");
    const numEl = document.getElementById("ajo-display-num");
    const dniEl = document.getElementById("ajo-display-dni");

    if (nameEl) nameEl.textContent = user.nombre;
    if (numEl) numEl.textContent = `Nº Socio/a: ${user.numSocio || '#AJO-2027-042'}`;
    if (dniEl) dniEl.textContent = `DNI: ${user.dni}`;
  } else {
    if (formBox) formBox.style.display = "block";
    if (cardBox) cardBox.style.display = "none";

    // Pre-rellenar campos con datos del usuario activo si existen
    if (user) {
      const nameInput = document.getElementById("ajo-fullname");
      const dniInput = document.getElementById("ajo-dni");
      const ageInput = document.getElementById("ajo-edad");

      if (nameInput && !nameInput.value) nameInput.value = user.nombre;
      if (dniInput && !dniInput.value && user.dni && !user.dni.startsWith("***")) dniInput.value = user.dni;
      if (ageInput && user.edad) ageInput.value = user.edad;
    }
  }

  modal.classList.add("active");
}

function closeAsociacionModal() {
  const modal = document.getElementById("asociacion-modal");
  if (modal) modal.classList.remove("active");
}

function handleSolicitudAsociacion() {
  const fullName = document.getElementById("ajo-fullname").value.trim();
  const dni = document.getElementById("ajo-dni").value.trim();
  const age = parseInt(document.getElementById("ajo-edad").value) || 20;
  const phone = document.getElementById("ajo-phone").value.trim();
  const email = document.getElementById("ajo-email").value.trim();

  if (!fullName || !dni || !phone) {
    alert("Por favor, completa los campos requeridos para formalizar tu solicitud.");
    return;
  }

  const consent = document.getElementById("ajo-rgpd-consent");
  if (consent && !consent.checked) {
    showToast("Consentimiento Requerido", "Debes consentir el tratamiento de datos y protección de datos para cursar la solicitud.");
    return;
  }

  let user = AppState.currentUser;

  // Si no había sesión iniciada, creamos automáticamente la cuenta del joven con estos datos
  if (!user) {
    const parts = fullName.split(" ").filter(Boolean);
    const alias = parts[0];
    let iniciales = parts[0][0].toUpperCase();
    if (parts.length > 1) iniciales += parts[1][0].toUpperCase();

    user = {
      id: `user-${Date.now()}`,
      nombre: fullName,
      alias: alias,
      iniciales: iniciales,
      edad: age,
      rangoEdad: age <= 18 ? "16-18" : (age <= 24 ? "19-24" : "25-30"),
      dni: dni,
      empadronado: true,
      puntos: 50,
      nivel: "Nivel 1: Explorador del Municipio de Orcera",
      nivelBadge: "Nivel 1 · Explorador",
      hash: `#ORC-2027-${Math.floor(1000 + Math.random() * 9000)}`,
      rol: "joven"
    };

    AppState.currentUser = user;
    AppState.userPoints = user.puntos;
    AppState.userLevel = user.nivel;
  }

  // Marcar como socio y asignar número
  const numSocio = `#AJO-2027-${String(Math.floor(10 + Math.random() * 980)).padStart(3, '0')}`;
  user.esSocioAJO = true;
  user.numSocio = numSocio;
  user.telefonoAJO = phone;
  user.emailAJO = email;

  // Bonificación de +50 Pts por asociacionismo activo
  rewardPoints(50, `¡Alta completada en la Asociación Juvenil! Nº Socio: ${numSocio}`);

  saveSessionToStorage(user);
  updateUserUI();
  updateAsociacionUI();

  // Cambiar vista en el modal para mostrar su Carnet Oficial
  const formBox = document.getElementById("asociacion-form-container");
  const cardBox = document.getElementById("asociacion-card-container");
  if (formBox) formBox.style.display = "none";
  if (cardBox) cardBox.style.display = "block";

  const nameEl = document.getElementById("ajo-display-name");
  const numEl = document.getElementById("ajo-display-num");
  const dniEl = document.getElementById("ajo-display-dni");

  if (nameEl) nameEl.textContent = user.nombre;
  if (numEl) numEl.textContent = `Nº Socio/a: ${numSocio}`;
  if (dniEl) dniEl.textContent = `DNI: ${user.dni}`;
}

function updateAsociacionUI() {
  const user = AppState.currentUser;
  const isMember = user && user.esSocioAJO;

  const btnText = document.getElementById("asociacion-banner-btn-text");
  const bannerActions = document.getElementById("asociacion-banner-actions");

  if (btnText) {
    btnText.textContent = isMember ? `Ver Mi Carnet de Socio/a (${user.numSocio})` : "Solicitar Alta Gratuita de Socio/a";
  }

  if (bannerActions && isMember) {
    bannerActions.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span style="background:rgba(16, 185, 129, 0.2); color:#10b981; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:var(--radius-full); border:1px solid rgba(16, 185, 129, 0.4);">
          ✅ Socio/a Oficial ${user.numSocio}
        </span>
        <button type="button" class="btn-open-asociacion" id="btn-open-asociacion-form">
          <span>💳</span>
          <span>Ver Carnet Digital</span>
        </button>
      </div>
    `;
    const newBtn = document.getElementById("btn-open-asociacion-form");
    if (newBtn) newBtn.addEventListener("click", openAsociacionModal);
  }

  // Refrescar tarjetas de recompensas para actualizar botón de la asociación
  renderRewards();
}


// ==============================================================================
// PANEL DE GESTIÓN MUNICIPAL DEL III PLAN (ADMINISTRADORES Y TÉCNICO DE JUVENTUD)
// ==============================================================================
const MUNICIPAL_STAFF = {
  tecnico: {
    id: "tecnico-alberto",
    nombre: "D. Alberto Moreno",
    cargo: "Técnico Municipal de Juventud",
    rol: "tecnico",
    pin: "tecnico2027",
    permisos: ["acciones", "finanzas_operativa", "buzon", "stories", "asociacion"]
  },
  admin: {
    id: "admin-carmen",
    nombre: "Dña. Carmen Romero",
    cargo: "Concejala de Juventud (Administradora del Plan)",
    rol: "admin",
    pin: "admin2027",
    permisos: ["acciones", "finanzas_total", "buzon", "stories", "asociacion", "configuracion"]
  }
};

const AdminState = {
  activeStaff: null,
  activePane: "pane-acciones",
  selectedEjeId: 1,
  selectedFinYear: 2027
};

function initAdminPanel() {
  setupAdminGlobalEvents();
  setupActionEditorEvents();
  setupPromotionEvents();
}

function setupAdminGlobalEvents() {
  // Botón en toolbar principal
  const toolbarBtn = document.getElementById("btn-admin-access");
  if (toolbarBtn) {
    toolbarBtn.addEventListener("click", () => {
      if (AdminState.activeStaff) {
        openAdminDashboard();
      } else {
        openAdminLoginModal();
      }
    });
  }

  // Cierre de login modal
  const closeLoginBtn = document.getElementById("close-admin-login-modal");
  const loginModal = document.getElementById("admin-login-modal");
  if (closeLoginBtn) closeLoginBtn.addEventListener("click", closeAdminLoginModal);
  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) closeAdminLoginModal();
    });
  }

  // Botones de login rápido
  const btnTecnico = document.getElementById("btn-login-tecnico");
  const btnAdmin = document.getElementById("btn-login-admin");
  if (btnTecnico) btnTecnico.addEventListener("click", () => loginAsMunicipal("tecnico"));
  if (btnAdmin) btnAdmin.addEventListener("click", () => loginAsMunicipal("admin"));

  // Formulario PIN
  const pinForm = document.getElementById("form-admin-pin");
  if (pinForm) {
    pinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pin = document.getElementById("admin-pin-input").value.trim();
      if (pin === "admin2027") loginAsMunicipal("admin");
      else if (pin === "tecnico2027") loginAsMunicipal("tecnico");
      else alert("PIN incorrecto. Usa 'tecnico2027' o 'admin2027'.");
    });
  }

  // Topbar del dashboard
  const btnCloseDash = document.getElementById("btn-admin-view-mobile");
  const btnLogoutDash = document.getElementById("btn-admin-logout");
  const btnSwitchRole = document.getElementById("btn-admin-switch-role");

  if (btnCloseDash) btnCloseDash.addEventListener("click", closeAdminDashboard);
  if (btnLogoutDash) btnLogoutDash.addEventListener("click", logoutMunicipal);
  if (btnSwitchRole) {
    btnSwitchRole.addEventListener("click", () => {
      const nextRole = AdminState.activeStaff && AdminState.activeStaff.rol === "admin" ? "tecnico" : "admin";
      loginAsMunicipal(nextRole);
    });
  }

  // Navegación lateral del dashboard
  const navItems = document.querySelectorAll(".admin-nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const pane = item.getAttribute("data-admin-pane");
      switchAdminPane(pane);
    });
  });
}

function openAdminLoginModal() {
  const modal = document.getElementById("admin-login-modal");
  if (modal) modal.classList.add("active");
}

function closeAdminLoginModal() {
  const modal = document.getElementById("admin-login-modal");
  if (modal) modal.classList.remove("active");
}

function loginAsMunicipal(roleKey) {
  const staff = MUNICIPAL_STAFF[roleKey];
  if (!staff) return;

  AdminState.activeStaff = staff;
  closeAdminLoginModal();
  openAdminDashboard();

  showToast(`Acceso Municipal Concedido`, `Sesión iniciada como: ${staff.nombre} (${staff.cargo})`);
}

function logoutMunicipal() {
  AdminState.activeStaff = null;
  closeAdminDashboard();
  showToast("Sesión Municipal Finalizada", "Has salido del panel de control del Ayuntamiento.");
}

function openAdminDashboard() {
  const dash = document.getElementById("admin-dashboard-container");
  if (!dash) return;

  updateAdminHeaderUI();
  dash.style.display = "flex";
  switchAdminPane(AdminState.activePane || "pane-acciones");
}

function closeAdminDashboard() {
  const dash = document.getElementById("admin-dashboard-container");
  if (dash) dash.style.display = "none";

  // Re-renderizar app móvil para reflejar inmediatamente cualquier cambio efectuado
  renderEjeDetail(AppState.activeEjeId);
  updateGlobalBentoKPIs();
}

function updateAdminHeaderUI() {
  const staff = AdminState.activeStaff;
  if (!staff) return;

  const label = document.getElementById("admin-current-user-label");
  const switchBtnText = document.getElementById("btn-switch-role-text");
  const navLock = document.getElementById("nav-lock-config");
  const navSub = document.getElementById("nav-config-sub");

  if (label) {
    label.innerHTML = `<strong>${staff.cargo}:</strong> ${staff.nombre} · <span class="admin-badge-role ${staff.rol}">${staff.rol === 'admin' ? 'Acceso Total' : 'Gestión Diaria'}</span>`;
  }

  if (switchBtnText) {
    switchBtnText.textContent = staff.rol === "admin" ? "Cambiar a Técnico" : "Cambiar a Administradora";
  }

  const isTécnico = staff.rol === "tecnico";
  if (navLock) navLock.style.display = isTécnico ? "inline" : "none";
  if (navSub) navSub.textContent = isTécnico ? "🔒 Restringido" : "Configuración Global";
}

function switchAdminPane(paneId) {
  AdminState.activePane = paneId;

  document.querySelectorAll(".admin-nav-item").forEach(item => {
    item.classList.toggle("active", item.getAttribute("data-admin-pane") === paneId);
  });

  renderAdminPane(paneId);
}

function renderAdminPane(paneId) {
  const container = document.getElementById("admin-main-content");
  if (!container) return;

  const staff = AdminState.activeStaff;
  const isAdmin = staff && staff.rol === "admin";

  switch (paneId) {
    case "pane-acciones":
      renderPaneAcciones(container);
      break;
    case "pane-finanzas":
      renderPaneFinanzas(container, isAdmin);
      break;
    case "pane-buzon":
      renderPaneBuzon(container);
      break;
    case "pane-stories":
      renderPaneStories(container);
      break;
    case "pane-asociacion":
      renderPaneAsociacion(container);
      break;
    case "pane-config":
      renderPaneConfiguracion(container, isAdmin);
      break;
    case "pane-promocion":
      renderPanePromocion(container);
      break;
    case "pane-evaluacion-previa":
      renderPaneEvaluacionPrevia(container);
      break;
  }
}

// ------------------------------------------------------------------------------
// PANE 1: ACCIONES Y ESTADOS DEL PLAN (TÉCNICO + ADMIN)
// ------------------------------------------------------------------------------
function renderPaneAcciones(container) {
  const curEje = EJES_DATA.find(e => e.id === AdminState.selectedEjeId) || EJES_DATA[0];

  container.innerHTML = `
    <div class="admin-pane-card">
      <div class="admin-pane-header">
        <div>
          <span class="badge-tag-civic">Módulo 1 · Gestión Operativa Diaria</span>
          <h3 style="margin:2px 0 0; font-size:1.15rem; color:var(--text-main);">📋 Control de Acciones, Estados y Variantes Aceptadas</h3>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:4px 0 0;">
            Actualiza el estado de las acciones o edita en profundidad su redacción, plazos, responsables y variantes aprobadas en Pleno.
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" class="btn-primary" id="btn-create-new-action" style="padding:7px 12px; font-size:0.75rem;">
            ➕ Añadir Nueva Acción / Variante
          </button>
          <select id="admin-eje-select" class="form-group-orcera" style="margin:0; padding:7px 12px; width:auto; font-size:0.78rem;">
            ${EJES_DATA.map(e => `
              <option value="${e.id}" ${e.id === curEje.id ? 'selected' : ''}>
                Eje ${e.numero}: ${e.titulo.substring(0, 30)}...
              </option>
            `).join("")}
          </select>
        </div>
      </div>

      <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:12px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="color:var(--amurjo-cyan); font-size:0.85rem;">Eje ${curEje.numero}: ${curEje.titulo}</strong>
          <small style="display:block; color:var(--text-muted); font-size:0.72rem;">
            Total acciones: ${curEje.acciones.length} | Presupuesto anual: ${curEje.presupuestoAnual.toLocaleString()} €
          </small>
        </div>
        <span style="font-size:0.72rem; color:var(--text-muted);">
          ℹ️ Pulsa en <strong>Modificar</strong> en cualquier acción para editarla o registrar una enmienda/variante aprobada.
        </span>
      </div>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width: 85px;">Código</th>
              <th>Título de la Acción y Alcance</th>
              <th style="width: 140px;">Vigencia / Cronograma</th>
              <th style="width: 160px;">Concejalía / Responsable</th>
              <th style="width: 155px;">Estado Actual</th>
              <th style="width: 90px; text-align:center;">Acción</th>
            </tr>
          </thead>
          <tbody>
            ${curEje.acciones.map(acc => {
              const vigenciaText = acc.roadmap ? acc.roadmap.vigencia : (acc.periodo || acc.trimestre || 'Quinquenal (2027–2031)');
              const respText = acc.responsable || acc.concejaliasResponsables || 'Concejalía de Juventud';
              const recText = acc.recursos || acc.recursosAsignados || 'Recursos propios del Ayuntamiento';

              return `
              <tr>
                <td><strong style="color:var(--amurjo-cyan); font-size:0.76rem;">${acc.codigo}</strong></td>
                <td>
                  <strong style="display:block; font-size:0.8rem; margin-bottom:2px; line-height:1.35;">${acc.titulo}</strong>
                  ${acc.varianteAceptada ? `
                    <div style="margin: 3px 0;">
                      <span class="badge-variante">★ Variante Aprobada: ${acc.varianteDetalle || 'Acuerdo de Pleno'}</span>
                    </div>
                  ` : ''}
                  <small style="color:var(--text-muted); font-size:0.68rem; display:block;">📦 ${recText}</small>
                </td>
                <td>
                  <span style="font-size:0.72rem; font-weight:600; color:var(--text-main); display:block;">
                    ${vigenciaText}
                  </span>
                </td>
                <td>
                  <span style="font-size:0.72rem; color:var(--text-muted); display:block; line-height:1.3;">
                    ${respText}
                  </span>
                </td>
                <td>
                  <select class="admin-select-status" data-action-code="${acc.codigo}">
                    <option value="no_iniciada" ${acc.estado === 'no_iniciada' ? 'selected' : ''}>⏳ No Iniciada</option>
                    <option value="en_curso" ${acc.estado === 'en_curso' || acc.estado === 'en_progreso' ? 'selected' : ''}>🚀 En Curso</option>
                    <option value="finalizada" ${acc.estado === 'finalizada' ? 'selected' : ''}>✅ Finalizada</option>
                    <option value="en_revision_participativa" ${acc.estado === 'en_revision_participativa' ? 'selected' : ''}>🔍 En Revisión</option>
                  </select>
                </td>
                <td style="text-align:center;">
                  <button type="button" class="btn-edit-action" data-edit-code="${acc.codigo}" title="Editar campos de la acción">
                    <span>✏️</span>
                    <span>Modificar</span>
                  </button>
                </td>
              </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Listener para cambiar de Eje
  const selectEje = container.querySelector("#admin-eje-select");
  if (selectEje) {
    selectEje.addEventListener("change", (e) => {
      AdminState.selectedEjeId = parseInt(e.target.value);
      renderPaneAcciones(container);
    });
  }

  // Listener para añadir nueva acción / variante
  const btnCreate = container.querySelector("#btn-create-new-action");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => {
      openActionEditModal(null, true);
    });
  }

  // Listeners para modificar acción existente
  container.querySelectorAll(".btn-edit-action").forEach(btn => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-edit-code");
      openActionEditModal(code, false);
    });
  });

  // Listeners para cambiar estado rápido de acción
  container.querySelectorAll(".admin-select-status").forEach(sel => {
    sel.addEventListener("change", (e) => {
      const code = sel.getAttribute("data-action-code");
      const newStatus = e.target.value;
      const targetAcc = curEje.acciones.find(a => a.codigo === code);
      if (targetAcc) {
        targetAcc.estado = newStatus;
        showToast("Estado Actualizado", `${code} marcado como: ${formatStatusName(newStatus)}`);
        updateGlobalBentoKPIs();
      }
    });
  });
}

function setupActionEditorEvents() {
  const closeBtn = document.getElementById("close-admin-action-modal");
  const cancelBtn = document.getElementById("btn-cancel-edit-action");
  const modal = document.getElementById("admin-action-modal");
  const form = document.getElementById("form-edit-action");
  const chkVariante = document.getElementById("edit-action-has-variante");

  if (closeBtn) closeBtn.addEventListener("click", closeActionEditModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeActionEditModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeActionEditModal();
    });
  }

  if (chkVariante) {
    chkVariante.addEventListener("change", (e) => {
      const box = document.getElementById("box-variante-details");
      if (box) box.style.display = e.target.checked ? "block" : "none";
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSaveAction();
    });
  }
}

function openActionEditModal(actionCode, isNew) {
  const modal = document.getElementById("admin-action-modal");
  if (!modal) return;

  const curEje = EJES_DATA.find(e => e.id === AdminState.selectedEjeId) || EJES_DATA[0];

  const modalTitle = document.getElementById("admin-action-modal-title");
  const isNewHidden = document.getElementById("edit-action-is-new");
  const codeInput = document.getElementById("edit-action-code");
  const oeSelect = document.getElementById("edit-action-oe");
  const titleInput = document.getElementById("edit-action-title");
  const descInput = document.getElementById("edit-action-desc");
  const respInput = document.getElementById("edit-action-resp");
  const vigenciaInput = document.getElementById("edit-action-vigencia");
  const recursosInput = document.getElementById("edit-action-recursos");
  const estadoSelect = document.getElementById("edit-action-estado");
  const chkVariante = document.getElementById("edit-action-has-variante");
  const boxVariante = document.getElementById("box-variante-details");
  const textoVariante = document.getElementById("edit-action-variante-texto");

  // Rellenar OEs
  if (oeSelect) {
    oeSelect.innerHTML = curEje.objetivosEspecificos.map(oe => `
      <option value="${oe.codigo}">${oe.codigo}: ${oe.titulo.substring(0, 30)}...</option>
    `).join("");
  }

  if (isNew) {
    if (modalTitle) modalTitle.textContent = `Añadir Nueva Acción / Variante en Eje ${curEje.numero}`;
    if (isNewHidden) isNewHidden.value = "true";
    if (codeInput) {
      codeInput.value = `ACC-${curEje.numero}.1.${curEje.acciones.length + 1}`;
      codeInput.readOnly = false;
    }
    if (titleInput) titleInput.value = "";
    if (descInput) descInput.value = "";
    if (respInput) respInput.value = "Concejalía de Juventud del Ayuntamiento de Orcera";
    if (vigenciaInput) vigenciaInput.value = "Quinquenal (2027–2031)";
    if (recursosInput) recursosInput.value = "Recursos propios del Ayuntamiento de Orcera";
    if (estadoSelect) estadoSelect.value = "en_curso";
    if (chkVariante) chkVariante.checked = true;
    if (boxVariante) boxVariante.style.display = "block";
    if (textoVariante) textoVariante.value = "Variante aprobada tras consulta ciudadana / acuerdo de Pleno Joven";
  } else {
    const acc = curEje.acciones.find(a => a.codigo === actionCode);
    if (!acc) return;

    if (modalTitle) modalTitle.textContent = `Modificar Acción: ${acc.codigo}`;
    if (isNewHidden) isNewHidden.value = "false";
    if (codeInput) {
      codeInput.value = acc.codigo;
      codeInput.readOnly = true;
    }
    if (titleInput) titleInput.value = acc.titulo;
    if (descInput) descInput.value = acc.descripcion || acc.titulo;
    if (respInput) respInput.value = acc.responsable || acc.concejaliasResponsables || "Concejalía de Juventud";
    if (vigenciaInput) vigenciaInput.value = acc.roadmap ? acc.roadmap.vigencia : (acc.periodo || acc.trimestre || "Quinquenal (2027–2031)");
    if (recursosInput) recursosInput.value = acc.recursos || acc.recursosAsignados || "Recursos propios del Ayuntamiento de Orcera";
    if (estadoSelect) estadoSelect.value = acc.estado === "en_progreso" ? "en_curso" : acc.estado;

    const hasVar = !!acc.varianteAceptada;
    if (chkVariante) chkVariante.checked = hasVar;
    if (boxVariante) boxVariante.style.display = hasVar ? "block" : "none";
    if (textoVariante) textoVariante.value = acc.varianteDetalle || "";
  }

  modal.classList.add("active");
}

function closeActionEditModal() {
  const modal = document.getElementById("admin-action-modal");
  if (modal) modal.classList.remove("active");
}

function handleSaveAction() {
  const curEje = EJES_DATA.find(e => e.id === AdminState.selectedEjeId) || EJES_DATA[0];
  const isNew = document.getElementById("edit-action-is-new").value === "true";

  const code = document.getElementById("edit-action-code").value.trim();
  const oeCode = document.getElementById("edit-action-oe").value;
  const title = document.getElementById("edit-action-title").value.trim();
  const desc = document.getElementById("edit-action-desc").value.trim();
  const resp = document.getElementById("edit-action-resp").value.trim();
  const vigencia = document.getElementById("edit-action-vigencia").value.trim();
  const recursos = document.getElementById("edit-action-recursos").value.trim();
  const estado = document.getElementById("edit-action-estado").value;
  const hasVariante = document.getElementById("edit-action-has-variante").checked;
  const detalleVariante = document.getElementById("edit-action-variante-texto").value.trim();

  if (!code || !title) {
    alert("Por favor, introduce el código y el título de la acción.");
    return;
  }

  if (isNew) {
    const newAcc = {
      codigo: code,
      codigoSimple: code.replace("ACC-", ""),
      numero: curEje.acciones.length + 1,
      titulo: title,
      descripcion: desc || title,
      responsable: resp,
      concejalias: [resp],
      recursos: recursos,
      estado: estado,
      varianteAceptada: hasVariante,
      varianteDetalle: hasVariante ? detalleVariante : null,
      roadmap: {
        duracionTipo: "5_anos",
        vigencia: vigencia,
        anos: [2027, 2028, 2029, 2030, 2031],
        fase: "Continua anual",
        indRef: "Indicador oficial",
        hitos: {}
      }
    };

    curEje.acciones.push(newAcc);

    // Añadir al OE correspondiente
    const targetOE = curEje.objetivosEspecificos.find(oe => oe.codigo === oeCode) || curEje.objetivosEspecificos[0];
    if (targetOE) {
      if (!targetOE.acciones) targetOE.acciones = [];
      targetOE.acciones.push(newAcc);
    }

    showToast("Nueva Acción Creada", `Se ha incorporado ${code} al Eje ${curEje.numero}.`);
  } else {
    const acc = curEje.acciones.find(a => a.codigo === code);
    if (acc) {
      acc.titulo = title;
      acc.descripcion = desc || title;
      acc.responsable = resp;
      acc.concejalias = [resp];
      acc.recursos = recursos;
      acc.estado = estado;
      acc.varianteAceptada = hasVariante;
      acc.varianteDetalle = hasVariante ? detalleVariante : null;
      if (!acc.roadmap) acc.roadmap = { anos: [2027, 2028, 2029, 2030, 2031] };
      acc.roadmap.vigencia = vigencia;

      showToast("Acción Modificada", `Los cambios en ${code} han sido guardados.`);
    }
  }

  closeActionEditModal();

  // Refrescar panel de administración y app móvil
  const container = document.getElementById("admin-main-content");
  if (container) renderPaneAcciones(container);

  renderEjeDetail(curEje.id);
  updateGlobalBentoKPIs();
}

// PANE 2: FINANZAS Y JUSTIFICACIÓN CONTABLE (TÉCNICO + ADMIN)
// ------------------------------------------------------------------------------
function renderPaneFinanzas(container, isAdmin) {
  const curEje = EJES_DATA.find(e => e.id === AdminState.selectedEjeId) || EJES_DATA[0];
  const year = AdminState.selectedFinYear;
  const multianual = curEje.finanzasMultianuales ? curEje.finanzasMultianuales[year] : null;

  const previsto = multianual ? multianual.presupuestoPrevisto : curEje.presupuestoAnual;
  const real = multianual ? multianual.gastoRealEjecutado : curEje.presupuestoReal2027;
  const pct = ((real / previsto) * 100).toFixed(1);
  const facturas = multianual ? multianual.facturasJustificadas : (curEje.facturasJustificadas || []);

  container.innerHTML = `
    <div class="admin-pane-card">
      <div class="admin-pane-header">
        <div>
          <span class="badge-tag-civic">Módulo 2 · Transparencia Presupuestaria</span>
          <h3 style="margin:2px 0 0; font-size:1.15rem; color:var(--text-main);">💶 Ejecución Financiera y Facturación Justificada</h3>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:4px 0 0;">
            ${isAdmin ? '👑 Rol Administradora: Puedes modificar el Presupuesto Base y registrar justificantes contables.' : '🛠️ Rol Técnico: Puedes registrar nuevas facturas y gastos auditados.'}
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <select id="fin-eje-select" class="form-group-orcera" style="margin:0; padding:6px 10px; width:auto; font-size:0.76rem;">
            ${EJES_DATA.map(e => `<option value="${e.id}" ${e.id === curEje.id ? 'selected' : ''}>Eje ${e.numero}</option>`).join("")}
          </select>
          <select id="fin-year-select" class="form-group-orcera" style="margin:0; padding:6px 10px; width:auto; font-size:0.76rem;">
            ${[2027, 2028, 2029, 2030, 2031].map(y => `<option value="${y}" ${y === year ? 'selected' : ''}>Año ${y}</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- TARJETAS RESUMEN DE EJECUCIÓN -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:20px;">
        <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:14px;">
          <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Presupuesto Previsto</span>
          <div style="font-size:1.3rem; font-weight:800; color:var(--text-main); margin-top:2px;">
            ${previsto.toLocaleString()} €
          </div>
          ${isAdmin ? `
            <button type="button" class="btn-tool" id="btn-edit-budget" style="margin-top:8px; padding:3px 8px; font-size:0.68rem; color:var(--amurjo-cyan);">
              ✏️ Modificar Partida Anual
            </button>
          ` : `
            <small style="color:#f59e0b; font-size:0.65rem; display:block; margin-top:6px;">🔒 Modificación reservada a Admin</small>
          `}
        </div>

        <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:14px;">
          <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Gasto Real Justificado</span>
          <div style="font-size:1.3rem; font-weight:800; color:#10b981; margin-top:2px;">
            ${real.toLocaleString()} €
          </div>
          <small style="color:var(--text-muted); font-size:0.68rem; display:block; margin-top:6px;">${facturas.length} comprobantes fiscalizados</small>
        </div>

        <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:14px;">
          <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">% Nivel de Ejecución</span>
          <div style="font-size:1.3rem; font-weight:800; color:var(--amurjo-cyan); margin-top:2px;">
            ${pct}%
          </div>
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:4px; margin-top:8px; overflow:hidden;">
            <div style="width:${Math.min(100, pct)}%; height:100%; background:linear-gradient(90deg, #10b981, #06b6d4);"></div>
          </div>
        </div>
      </div>

      <!-- FORMULARIO: REGISTRAR NUEVA FACTURA O NÓMINA -->
      <div style="background:linear-gradient(135deg, rgba(6,78,59,0.25), rgba(6,182,212,0.1)); border:1px solid rgba(6,182,212,0.3); border-radius:var(--radius-md); padding:16px; margin-bottom:20px;">
        <h4 style="margin:0 0 10px; font-size:0.86rem; color:var(--text-main);">➕ Registrar Nuevo Justificante de Gasto Contable</h4>
        <form id="form-add-invoice">
          <div style="display:grid; grid-template-columns: 2fr 1.5fr 1fr; gap:10px;">
            <div class="form-group-orcera" style="margin:0;">
              <label style="font-size:0.72rem;">Concepto / Ítem de Gasto *</label>
              <input type="text" id="inv-item" placeholder="Ej: Adquisición kit robótica educativa" required>
            </div>
            <div class="form-group-orcera" style="margin:0;">
              <label style="font-size:0.72rem;">Proveedor / Beneficiario *</label>
              <input type="text" id="inv-prov" placeholder="Ej: Innova Sierra SL" required>
            </div>
            <div class="form-group-orcera" style="margin:0;">
              <label style="font-size:0.72rem;">Importe (€) *</label>
              <input type="number" id="inv-amount" placeholder="Ej: 350" step="0.01" required>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1.2fr; gap:10px; margin-top:10px;">
            <div class="form-group-orcera" style="margin:0;">
              <label style="font-size:0.72rem;">CIF / NIF</label>
              <input type="text" id="inv-cif" placeholder="***4921**">
            </div>
            <div class="form-group-orcera" style="margin:0;">
              <label style="font-size:0.72rem;">Tipo de Justificante</label>
              <select id="inv-tipo" class="form-group-orcera" style="margin:0; padding:9px;">
                <option value="factura">Factura Comercial</option>
                <option value="nomina">Nómina Técnica</option>
              </select>
            </div>
            <div class="form-group-orcera" style="margin:0;">
              <label style="font-size:0.72rem;">Trimestre</label>
              <select id="inv-trimestre" class="form-group-orcera" style="margin:0; padding:9px;">
                <option value="Q1">Q1 (Ene–Mar)</option>
                <option value="Q2">Q2 (Abr–Jun)</option>
                <option value="Q3">Q3 (Jul–Sep)</option>
                <option value="Q4">Q4 (Oct–Dic)</option>
              </select>
            </div>
            <div style="display:flex; align-items:flex-end;">
              <button type="submit" class="btn-primary" style="width:100%; justify-content:center; padding:10px;">
                💾 Registrar Gasto
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- LISTADO DE FACTURAS -->
      <h4 style="font-size:0.84rem; margin:0 0 10px; color:var(--text-main);">Facturas y Nóminas Registradas en Eje ${curEje.numero} (${year})</h4>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Proveedor</th>
              <th>CIF/NIF</th>
              <th>Tipo</th>
              <th>Trimestre</th>
              <th style="text-align:right;">Importe</th>
              <th style="text-align:center;">Acción</th>
            </tr>
          </thead>
          <tbody>
            ${facturas.map((f, i) => `
              <tr>
                <td><strong>${f.item}</strong></td>
                <td>${f.proveedorBeneficiario || f.nombre || 'Proveedor municipal'}</td>
                <td><code>${f.cif || '***1234**'}</code></td>
                <td><span style="font-size:0.68rem; text-transform:uppercase;">${f.tipo || 'factura'}</span></td>
                <td>${f.trimestre || 'Q2'}</td>
                <td style="text-align:right; font-weight:800; color:#10b981;">${(f.importe || 0).toLocaleString()} €</td>
                <td style="text-align:center;">
                  <button type="button" class="btn-tool" onclick="openJustificanteContableModal(EJES_DATA.find(x => x.id === ${curEje.id}), ${i})" style="padding:2px 8px; font-size:0.68rem;">
                    👁️ Volante
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Selectores
  container.querySelector("#fin-eje-select").addEventListener("change", (e) => {
    AdminState.selectedEjeId = parseInt(e.target.value);
    renderPaneFinanzas(container, isAdmin);
  });
  container.querySelector("#fin-year-select").addEventListener("change", (e) => {
    AdminState.selectedFinYear = parseInt(e.target.value);
    renderPaneFinanzas(container, isAdmin);
  });

  // Modificar presupuesto anual (Admin Only)
  if (isAdmin) {
    const editBtn = container.querySelector("#btn-edit-budget");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        const val = prompt(`Introduce nuevo Presupuesto Base Anual para Eje ${curEje.numero} (€):`, previsto);
        if (val && !isNaN(val)) {
          const newAmount = parseFloat(val);
          if (multianual) multianual.presupuestoPrevisto = newAmount;
          curEje.presupuestoAnual = newAmount;
          showToast("Presupuesto Actualizado", `Eje ${curEje.numero} ahora tiene asignados ${newAmount.toLocaleString()} €.`);
          renderPaneFinanzas(container, isAdmin);
          updateGlobalBentoKPIs();
        }
      });
    }
  }

  // Registrar nueva factura
  const invForm = container.querySelector("#form-add-invoice");
  if (invForm) {
    invForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const item = document.getElementById("inv-item").value.trim();
      const prov = document.getElementById("inv-prov").value.trim();
      const amount = parseFloat(document.getElementById("inv-amount").value);
      const cif = document.getElementById("inv-cif").value.trim() || `***${Math.floor(1000 + Math.random() * 9000)}**`;
      const tipo = document.getElementById("inv-tipo").value;
      const tri = document.getElementById("inv-trimestre").value;

      const newInv = {
        item: item,
        proveedorBeneficiario: prov,
        cif: cif,
        importe: amount,
        tipo: tipo,
        trimestre: tri,
        fecha: new Date().toLocaleDateString("es-ES")
      };

      if (multianual) {
        multianual.facturasJustificadas.unshift(newInv);
        multianual.gastoRealEjecutado += amount;
      }
      if (!curEje.facturasJustificadas) curEje.facturasJustificadas = [];
      curEje.facturasJustificadas.unshift(newInv);
      curEje.presupuestoReal2027 += amount;

      showToast("Gasto Registrado", `Añadida factura de ${amount} € para ${prov}.`);
      renderPaneFinanzas(container, isAdmin);
      updateGlobalBentoKPIs();
    });
  }
}

// ------------------------------------------------------------------------------
// PANE 3: MODERACIÓN DEL BUZÓN Y PLENO JOVEN (TÉCNICO + ADMIN)
// ------------------------------------------------------------------------------
function renderPaneBuzon(container) {
  container.innerHTML = `
    <div class="admin-pane-card">
      <div class="admin-pane-header">
        <div>
          <span class="badge-tag-civic">Módulo 3 · Participación Ciudadana</span>
          <h3 style="margin:2px 0 0; font-size:1.15rem; color:var(--text-main);">🗳️ Moderación del Buzón Juvenil y Admisiones a Pleno</h3>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:4px 0 0;">
            Revisa las propuestas registradas por los jóvenes de Orcera, valida si cumplen los requisitos y tramítalas al Pleno Municipal.
          </p>
        </div>
        <span class="badge-tag-civic">${propuestasComunitarias.length} Propuestas Registradas</span>
      </div>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Propuesta</th>
              <th>Autor / Edad</th>
              <th>Eje Vinculado</th>
              <th>Apoyos (👍)</th>
              <th>Estado Actual</th>
              <th style="text-align:right;">Acciones de Gestión</th>
            </tr>
          </thead>
          <tbody>
            ${propuestasComunitarias.map(p => `
              <tr>
                <td>
                  <strong style="font-size:0.82rem;">${p.titulo}</strong>
                  <p style="font-size:0.68rem; color:var(--text-muted); margin:2px 0 0; max-width:320px;">${p.descripcion}</p>
                  <small style="color:var(--amurjo-cyan); font-size:0.65rem;">📍 ${p.ubicacion}</small>
                </td>
                <td><span style="font-size:0.74rem;">${p.autor}</span></td>
                <td><span style="font-size:0.72rem; color:var(--text-muted);">${p.ejeNombre}</span></td>
                <td><strong style="color:#10b981; font-size:0.8rem;">${p.votos} apoyos</strong></td>
                <td>
                  <span style="font-size:0.68rem; font-weight:700; padding:2px 8px; border-radius:12px; background:rgba(6,182,212,0.15); color:var(--amurjo-cyan);">
                    ${p.estado}
                  </span>
                </td>
                <td style="text-align:right;">
                  <div style="display:flex; justify-content:flex-end; gap:6px;">
                    <button type="button" class="btn-tool btn-admit-pleno" data-prop-id="${p.id}" style="padding:4px 8px; font-size:0.68rem; color:#10b981;">
                      🏛️ Admitir a Pleno
                    </button>
                    <button type="button" class="btn-tool btn-reply-prop" data-prop-id="${p.id}" style="padding:4px 8px; font-size:0.68rem;">
                      💬 Respuesta
                    </button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.querySelectorAll(".btn-admit-pleno").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = parseInt(btn.getAttribute("data-prop-id"));
      const p = propuestasComunitarias.find(x => x.id === pId);
      if (p) {
        p.estado = "Admitida para Pleno Joven Municipal";
        showToast("Propuesta Admitida", `"${p.titulo}" pasa oficialmente a la orden del día del Pleno Joven.`);
        renderPaneBuzon(container);
        renderProposals();
      }
    });
  });

  container.querySelectorAll(".btn-reply-prop").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = parseInt(btn.getAttribute("data-prop-id"));
      const p = propuestasComunitarias.find(x => x.id === pId);
      if (p) {
        const resp = prompt(`Escribe la respuesta oficial municipal para "${p.titulo}":`, "La propuesta ha sido estudiada por la Comisión Técnica y se incluirá en el presupuesto del próximo trimestre.");
        if (resp) {
          p.estado = `Dictamen Oficial: ${resp.substring(0, 45)}...`;
          showToast("Respuesta Publicada", "Se ha notificado a la ciudadanía.");
          renderPaneBuzon(container);
          renderProposals();
        }
      }
    });
  });
}

// ------------------------------------------------------------------------------
// PANE 4: CONSULTAS EXPRÉS / STORIES (TÉCNICO + ADMIN)
// ------------------------------------------------------------------------------
function renderPaneStories(container) {
  container.innerHTML = `
    <div class="admin-pane-card">
      <div class="admin-pane-header">
        <div>
          <span class="badge-tag-civic">Módulo 4 · Consultas Rápidas</span>
          <h3 style="margin:2px 0 0; font-size:1.15rem; color:var(--text-main);">⚡ Lanzar Nueva Consulta Exprés (Stories en Cabecera)</h3>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:4px 0 0;">
            Lanza encuestas directas de voto en 1 clic tipo Instagram que aparecerán inmediatamente en la barra superior de la app móvil.
          </p>
        </div>
      </div>

      <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px; max-width:600px;">
        <form id="form-new-story">
          <div class="form-group-orcera">
            <label>Título / Pregunta de la Consulta *</label>
            <input type="text" id="story-title" placeholder="Ej: ¿Qué grupo musical traemos para las Fiestas de Agosto?" required>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div class="form-group-orcera">
              <label>Categoría</label>
              <input type="text" id="story-cat" placeholder="Ej: OCIO JOVEN" value="OCIO JOVEN" required>
            </div>
            <div class="form-group-orcera">
              <label>Icono (Emoji)</label>
              <input type="text" id="story-ico" value="🎪" style="text-align:center;">
            </div>
          </div>

          <div class="form-group-orcera">
            <label>Descripción / Contexto</label>
            <input type="text" id="story-desc" placeholder="Breve contexto para que la juventud decida">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div class="form-group-orcera">
              <label>Opción A (Verde) *</label>
              <input type="text" id="story-opt-a" placeholder="Ej: Festival Pop/Rock Local" required>
            </div>
            <div class="form-group-orcera">
              <label>Opción B (Cyan) *</label>
              <input type="text" id="story-opt-b" placeholder="Ej: Sesión Urban / Reggaeton DJ" required>
            </div>
          </div>

          <button type="submit" class="btn-primary" style="width:100%; justify-content:center; padding:12px; margin-top:8px;">
            🚀 Publicar Consulta en las Stories de la App
          </button>
        </form>
      </div>
    </div>
  `;

  const storyForm = container.querySelector("#form-new-story");
  if (storyForm) {
    storyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("story-title").value.trim();
      const cat = document.getElementById("story-cat").value.trim();
      const ico = document.getElementById("story-ico").value.trim() || "🗳️";
      const desc = document.getElementById("story-desc").value.trim() || title;
      const optA = document.getElementById("story-opt-a").value.trim();
      const optB = document.getElementById("story-opt-b").value.trim();

      const newId = `story-${Date.now()}`;
      STORIES_DATA[newId] = {
        icono: ico,
        categoria: cat,
        titulo: title,
        desc: desc,
        opcionA: optA,
        votosA: 0,
        opcionB: optB,
        votosB: 0
      };

      // Añadir botón en la tira de stories del móvil
      const strip = document.querySelector(".stories-strip");
      if (strip) {
        const btn = document.createElement("button");
        btn.className = "story-item";
        btn.setAttribute("data-story", newId);
        btn.setAttribute("title", title);
        btn.innerHTML = `
          <div class="story-ring">
            <div class="story-avatar amurjo-bg">${ico}</div>
          </div>
          <span class="story-label">${title.substring(0, 10)}...</span>
        `;
        strip.prepend(btn);
        btn.addEventListener("click", () => openStoryModal(newId));
      }

      showToast("¡Consulta Publicada!", `"${title}" ya está activa en las Stories de la app.`);
      storyForm.reset();
    });
  }
}

// ------------------------------------------------------------------------------
// PANE 5: CENSO DE LA ASOCIACIÓN JUVENIL (TÉCNICO + ADMIN)
// ------------------------------------------------------------------------------
function renderPaneAsociacion(container) {
  // Cargar cuentas que tengan solicitud
  const saved = getSavedAccountsList();
  const socios = saved.filter(u => u.esSocioAJO);

  // Si no hay ninguno, simulamos los socios para demostración
  const displaySocios = socios.length > 0 ? socios : [
    { nombre: "Sara Jiménez Navío", dni: "***4829*", edad: 20, numSocio: "#AJO-2027-042", telefonoAJO: "622 14 58 90", emailAJO: "sara.jimenez@orcera.es" },
    { nombre: "Marcos Ruiz Castillo", dni: "***6312*", edad: 17, numSocio: "#AJO-2027-043", telefonoAJO: "633 45 12 78", emailAJO: "marcos.ruiz@orcera.es" },
    { nombre: "Elena Navarro Teruel", dni: "***9914*", edad: 22, numSocio: "#AJO-2027-044", telefonoAJO: "677 89 23 11", emailAJO: "elena.navarro@orcera.es" }
  ];

  container.innerHTML = `
    <div class="admin-pane-card">
      <div class="admin-pane-header">
        <div>
          <span class="badge-tag-civic">Módulo 5 · Tejido Asociativo</span>
          <h3 style="margin:2px 0 0; font-size:1.15rem; color:var(--text-main);">🤝 Censo Oficial: Asociación Juvenil de Orcera</h3>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:4px 0 0;">
            Listado de jóvenes que han solicitado el alta gratuita en la Asociación Juvenil como recompensa del III Plan.
          </p>
        </div>
        <button type="button" class="btn-tool" id="btn-export-asociacion" style="color:var(--amurjo-cyan);">
          📥 Exportar Censo (CSV)
        </button>
      </div>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Nº Socio</th>
              <th>Nombre y Apellidos</th>
              <th>DNI</th>
              <th>Edad</th>
              <th>Teléfono / WhatsApp</th>
              <th>Correo Electrónico</th>
              <th style="text-align:center;">Estado Padrón</th>
            </tr>
          </thead>
          <tbody>
            ${displaySocios.map(s => `
              <tr>
                <td><strong style="color:var(--amurjo-cyan);">${s.numSocio || '#AJO-2027-000'}</strong></td>
                <td><strong>${s.nombre}</strong></td>
                <td><code>${s.dni}</code></td>
                <td>${s.edad ? s.edad + ' años' : 'Joven'}</td>
                <td><span style="font-size:0.72rem;">${s.telefonoAJO || '612 34 56 78'}</span></td>
                <td><span style="font-size:0.72rem; color:var(--text-muted);">${s.emailAJO || 'contacto@orcera.es'}</span></td>
                <td style="text-align:center;"><span style="color:#10b981; font-weight:700; font-size:0.7rem;">✓ Verificado</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const exportBtn = container.querySelector("#btn-export-asociacion");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      let csv = "N_Socio,Nombre,DNI,Edad,Telefono,Email\n";
      displaySocios.forEach(s => {
        csv += `${s.numSocio || ''},${s.nombre},${s.dni},${s.edad || ''},${s.telefonoAJO || ''},${s.emailAJO || ''}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `censo_asociacion_juvenil_orcera_${Date.now()}.csv`;
      a.click();
      showToast("Censo Exportado", "Fichero CSV descargado correctamente.");
    });
  }
}

// ------------------------------------------------------------------------------
// PANE 6: CONFIGURACIÓN Y AUDITORÍA (SOLO ADMINISTRADOR/A)
// ------------------------------------------------------------------------------
function renderPaneConfiguracion(container, isAdmin) {
  if (!isAdmin) {
    container.innerHTML = `
      <div class="admin-pane-card">
        <div class="admin-locked-box">
          <div style="font-size:2.2rem; margin-bottom:10px;">🔒</div>
          <h3 style="margin:0 0 6px; font-size:1.1rem; color:#fbbf24;">Sección Restringida a Administradores del Plan</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); max-width:480px; margin:0 auto 16px; line-height:1.4;">
            Como <strong>Técnico de Juventud</strong> tienes pleno control operativo sobre las acciones, facturas, buzón de propuestas y la asociación juvenil. Las altas de técnicos y reestructuración global del Plan están reservadas a la <strong>Concejalía de Juventud / Alcaldía</strong>.
          </p>
          <button type="button" class="btn-primary" onclick="loginAsMunicipal('admin')" style="margin:0 auto; padding:8px 16px; font-size:0.78rem;">
            👑 Entrar con Perfil de Administradora
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="admin-pane-card">
      <div class="admin-pane-header">
        <div>
          <span class="badge-tag-civic" style="color:#fbbf24;">Módulo 6 · Configuración Global & Auditoría</span>
          <h3 style="margin:2px 0 0; font-size:1.15rem; color:var(--text-main);">⚙️ Gestión de Permisos Municipales y Respaldo</h3>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:4px 0 0;">
            Exclusivo para la Concejalía y Dirección del Plan. Auditoría de accesos y salvaguarda de datos.
          </p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
        <!-- TÉCNICOS AUTORIZADOS -->
        <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px;">
          <h4 style="margin:0 0 10px; font-size:0.88rem; color:var(--text-main);">👥 Personal Técnico Autorizado</h4>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px; background:rgba(255,255,255,0.03); border-radius:6px;">
              <div>
                <strong style="display:block; font-size:0.8rem;">D. Alberto Moreno</strong>
                <small style="color:var(--text-muted); font-size:0.7rem;">Técnico de Juventud · Activo</small>
              </div>
              <span class="admin-badge-role tecnico">Gestor</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px; background:rgba(255,255,255,0.03); border-radius:6px;">
              <div>
                <strong style="display:block; font-size:0.8rem;">Dña. Carmen Romero</strong>
                <small style="color:var(--text-muted); font-size:0.7rem;">Concejala de Juventud · Alcaldía</small>
              </div>
              <span class="admin-badge-role admin">Superadmin</span>
            </div>
          </div>
        </div>

        <!-- COPIA DE SEGURIDAD Y RESPALDO -->
        <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px;">
          <h4 style="margin:0 0 10px; font-size:0.88rem; color:var(--text-main);">💾 Respaldo y Copia de Seguridad</h4>
          <p style="font-size:0.74rem; color:var(--text-muted); margin:0 0 12px; line-height:1.4;">
            Descarga una copia completa en JSON con todos los ejes, gastos contables justificados y propuestas comunitarias.
          </p>
          <button type="button" class="btn-tool" id="btn-export-full-plan" style="width:100%; justify-content:center; color:var(--amurjo-cyan); font-weight:700;">
            📥 Descargar Backup Completo (JSON)
          </button>
        </div>
      </div>
    </div>
  `;

  const backupBtn = container.querySelector("#btn-export-full-plan");
  if (backupBtn) {
    backupBtn.addEventListener("click", () => {
      const data = {
        fechaExport: new Date().toISOString(),
        ejes: EJES_DATA,
        propuestas: propuestasComunitarias,
        usuariosGuardados: getSavedAccountsList()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_completo_iii_plan_orcera_${Date.now()}.json`;
      a.click();
      showToast("Copia de Seguridad Generada", "Archivo JSON descargado correctamente.");
    });
  }
}

// ------------------------------------------------------------------------------
// PANE 8: DICTAMEN DE EVALUACIÓN PREVIA JUVENIL (TÉCNICO + ADMIN)
// ------------------------------------------------------------------------------
function renderPaneEvaluacionPrevia(container) {
  const evalData = getEvaluacionData();
  const allActions = getAllActionsList();
  const year2027Actions = allActions.filter(a => a.roadmapAnos.includes(2027));

  let totalScore = 0;
  let totalVotes = 0;
  let topRanked = [];

  year2027Actions.forEach(a => {
    const sc = evalData.communityActionVotes[a.codigo] || { avg: 4.6, count: 60 };
    totalScore += sc.avg;
    totalVotes += sc.count;
    topRanked.push({
      codigo: a.codigo,
      titulo: a.titulo,
      ejeId: a.ejeId,
      ejeNumero: a.ejeNumero,
      avg: sc.avg,
      votes: sc.count,
      indicators: a.indicadores || []
    });
  });

  const globalAvg = year2027Actions.length > 0 ? (totalScore / year2027Actions.length).toFixed(2) : "4.74";
  const globalPct = Math.round((parseFloat(globalAvg) / 5) * 100);

  topRanked.sort((a, b) => b.avg - a.avg);
  const bestActions = topRanked.slice(0, 5);
  const lowestActions = topRanked.slice(-3).reverse();

  container.innerHTML = `
    <div class="admin-pane-card">
      <div class="admin-pane-header">
        <div>
          <span class="badge-tag-civic">Módulo 8 · Validación Democrática Ex-Ante</span>
          <h3 style="margin:2px 0 0; font-size:1.15rem; color:var(--text-main);">⭐ Dictamen de Evaluación Previa Juvenil (2027–2031)</h3>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:4px 0 0;">
            Dictamen ciudadano de la juventud de Orcera antes de la ejecución presupuestaria. Mide si las medidas e indicadores cuentan con respaldo social mayoritario.
          </p>
        </div>
        <button type="button" class="btn-primary" onclick="window.print()" style="padding:7px 14px; font-size:0.75rem; font-weight:800;">
          📄 Imprimir Dictamen para el Pleno
        </button>
      </div>

      <!-- Resumen Métricas Clave -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:16px;">
        <div style="background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.35); padding:14px; border-radius:var(--radius-md); text-align:center;">
          <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; display:block;">Índice Respaldo 2027</span>
          <strong style="font-size:1.6rem; color:#34d399; font-family:var(--font-heading);">⭐ ${globalAvg} / 5</strong>
          <span style="display:block; font-size:0.68rem; color:#34d399; font-weight:700;">${globalPct}% de Aprobación Ciudadana</span>
        </div>

        <div style="background:rgba(6,182,212,0.12); border:1px solid rgba(6,182,212,0.35); padding:14px; border-radius:var(--radius-md); text-align:center;">
          <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; display:block;">Jóvenes Evaluadores</span>
          <strong style="font-size:1.6rem; color:var(--amurjo-cyan); font-family:var(--font-heading);">88</strong>
          <span style="display:block; font-size:0.68rem; color:var(--text-dim);">Censo activo de votantes</span>
        </div>

        <div style="background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.35); padding:14px; border-radius:var(--radius-md); text-align:center;">
          <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; display:block;">Votos Registrados</span>
          <strong style="font-size:1.6rem; color:var(--amber); font-family:var(--font-heading);">${totalVotes}</strong>
          <span style="display:block; font-size:0.68rem; color:var(--text-dim);">En medidas e indicadores</span>
        </div>
      </div>

      <!-- Top 5 Medidas con Mayor Respaldo -->
      <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:14px; margin-bottom:16px;">
        <h4 style="margin:0 0 10px; font-size:0.85rem; color:#34d399; display:flex; align-items:center; gap:6px;">
          <span>🟢</span> Top 5 Medidas con Mayor Respaldo Ciudadano (Prioridad Absoluta 2027)
        </h4>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${bestActions.map((a, i) => `
            <div style="background:rgba(0,0,0,0.25); border:1px solid var(--segura-border); border-radius:var(--radius-sm); padding:8px 12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
              <div>
                <strong style="color:var(--emerald); font-size:0.78rem;">#${i+1} · ${a.codigo}</strong>
                <span style="font-size:0.75rem; color:var(--text-main); margin-left:6px;">${a.titulo}</span>
                <span style="font-size:0.68rem; color:var(--text-muted); display:block;">Eje ${a.ejeNumero} · ${a.votes} votos registrados</span>
              </div>
              <strong style="font-size:0.95rem; color:#fbbf24; white-space:nowrap;">⭐ ${a.avg} / 5</strong>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Medidas que Requieren Atención o Revisión -->
      <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:14px;">
        <h4 style="margin:0 0 10px; font-size:0.85rem; color:var(--amber); display:flex; align-items:center; gap:6px;">
          <span>⚠️</span> Medidas con Respaldo Más Ajustado (Atención Técnica)
        </h4>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${lowestActions.map(a => `
            <div style="background:rgba(0,0,0,0.25); border:1px solid var(--segura-border); border-radius:var(--radius-sm); padding:8px 12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
              <div>
                <strong style="color:var(--amber); font-size:0.78rem;">${a.codigo}</strong>
                <span style="font-size:0.75rem; color:var(--text-main); margin-left:6px;">${a.titulo}</span>
                <span style="font-size:0.68rem; color:var(--text-muted); display:block;">Eje ${a.ejeNumero} · Valorada con ${a.avg} sobre 5</span>
              </div>
              <span style="font-size:0.7rem; color:var(--text-dim); background:rgba(255,255,255,0.05); padding:3px 8px; border-radius:4px;">
                Revisar en Comisión
              </span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}
// SISTEMA DE PROMOCIÓN, DIFUSIÓN VIRAL Y CARTEL OFICIAL IMPRIMIBLE
// ==============================================================================
function setupPromotionEvents() {
  const triggerStrip = document.getElementById("promo-strip-trigger");
  const triggerToolbar = document.getElementById("btn-promo-share-toolbar");
  const closeShareBtn = document.getElementById("close-promo-share-modal");
  const shareModal = document.getElementById("promo-share-modal");

  if (triggerStrip) triggerStrip.addEventListener("click", openPromoShareModal);
  if (triggerToolbar) triggerToolbar.addEventListener("click", openPromoShareModal);
  if (closeShareBtn) closeShareBtn.addEventListener("click", closePromoShareModal);
  if (shareModal) {
    shareModal.addEventListener("click", (e) => {
      if (e.target === shareModal) closePromoShareModal();
    });
  }

  // Copiar enlace
  const copyBtn = document.getElementById("btn-copy-promo-link");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const input = document.getElementById("promo-ref-link");
      if (input) {
        input.select();
        navigator.clipboard.writeText(input.value).then(() => {
          showToast("¡Enlace Copiado!", "Pégalo en tus chats de WhatsApp o en tus historias de Instagram.");
        }).catch(() => {
          document.execCommand("copy");
          showToast("¡Enlace Copiado!", "Pégalo donde prefieras.");
        });
      }
    });
  }

  // Compartir en WhatsApp
  const waBtn = document.getElementById("btn-share-whatsapp");
  if (waBtn) {
    waBtn.addEventListener("click", () => {
      const ref = AppState.currentUser ? (AppState.currentUser.alias || 'joven').toLowerCase() : 'orcera';
      const url = `${window.location.origin}${window.location.pathname}?ref=${ref}`;
      const msg = encodeURIComponent(`¡Ey! 👋 Échale un ojo a la app del III Plan Municipal de Juventud de Orcera. Te dan el alta gratis en la Asociación Juvenil y 50 Puntos de bienvenida para entradas a la piscina de Amurjo y pistas de pádel 👉 ${url}`);
      window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');

      if (AppState.currentUser) {
        rewardPoints(25, "¡Gracias por difundir el Plan entre tus colegas!");
      }
    });
  }

  // Ver QR en pantalla
  const qrToggleBtn = document.getElementById("btn-view-qr-screen");
  if (qrToggleBtn) {
    qrToggleBtn.addEventListener("click", () => {
      const box = document.getElementById("promo-qr-box");
      if (box) {
        const isShown = box.style.display === "block";
        box.style.display = isShown ? "none" : "block";
        qrToggleBtn.innerHTML = isShown ? "<span>📲</span><span>Mostrar Código QR de Móvil a Móvil</span>" : "<span>✕</span><span>Ocultar Código QR</span>";
        if (!isShown) {
          const refCode = AppState.currentUser ? (AppState.currentUser.alias || 'joven').toLowerCase() : 'orcera';
          const targetUrl = `${getAppPublicUrl()}?ref=${refCode}`;
          renderStandardQRCode("promo-qr-render-area", targetUrl, 160);
        }
      }
    });
  }

    // Cartel oficial imprimible
  const closePosterBtn = document.getElementById("close-promo-poster-modal");
  const posterModal = document.getElementById("promo-poster-modal");
  const printPosterBtn = document.getElementById("btn-print-poster-now");

  if (closePosterBtn) closePosterBtn.addEventListener("click", closePosterModal);
  if (printPosterBtn) printPosterBtn.addEventListener("click", () => window.print());
  if (posterModal) {
    posterModal.addEventListener("click", (e) => {
      if (e.target === posterModal) closePosterModal();
    });
  }
}

// ==============================================================================
// SISTEMA OFICIAL DE INSTALACIÓN RÁPIDA PWA (1-CLIC NATIVO / ASISTIDO)
// ==============================================================================
function initPWAInstallSystem() {
  const btnTopInstall = document.getElementById("btn-install-app");
  const banner = document.getElementById("pwa-quick-install-banner");
  const btnBannerInstall = document.getElementById("btn-pwa-banner-install");
  const btnBannerDismiss = document.getElementById("btn-pwa-banner-dismiss");
  const modal = document.getElementById("pwa-install-modal");
  const closeModal = document.getElementById("close-pwa-install-modal");
  const btnModalOk = document.getElementById("btn-pwa-modal-ok");
  const instructionsBox = document.getElementById("pwa-modal-instructions");

  // Si la app ya se ejecuta como app instalada (standalone)
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (isStandalone) {
    if (btnTopInstall) btnTopInstall.style.display = "none";
    if (banner) banner.style.display = "none";
    return;
  }

  // Cerrar banner flotante
  if (btnBannerDismiss && banner) {
    btnBannerDismiss.addEventListener("click", () => {
      banner.style.display = "none";
    });
  }

  // Control del modal asistido
  const hideModal = () => {
    if (modal) modal.classList.remove("active");
  };
  if (closeModal) closeModal.addEventListener("click", hideModal);
  if (btnModalOk) btnModalOk.addEventListener("click", hideModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) hideModal();
    });
  }

  // Lógica unificada de instalación simplificada (la más directa posible)
  const executeDirectInstall = async () => {
    // 1. Si tenemos el prompt nativo capturado (Android Chrome, Edge, Chrome Desktop)
    if (window._orceraDeferredPrompt) {
      try {
        await window._orceraDeferredPrompt.prompt();
        const choice = await window._orceraDeferredPrompt.userChoice;
        if (choice && choice.outcome === "accepted") {
          if (banner) banner.style.display = "none";
          if (btnTopInstall) btnTopInstall.style.display = "none";
          if (typeof showToast === "function") {
            showToast("¡App Instalada!", "KLIKO ya forma parte de tu pantalla de inicio.");
          }
        }
        window._orceraDeferredPrompt = null;
        return;
      } catch (err) {
        console.warn("Error ejecutando prompt:", err);
      }
    }

    // 2. Si la app ya está instalada en el sistema
    if ('getInstalledRelatedApps' in navigator) {
      try {
        const apps = await navigator.getInstalledRelatedApps();
        if (apps && apps.length > 0) {
          if (instructionsBox) {
            instructionsBox.innerHTML = `
              <div style="margin-bottom: 12px; color: var(--amurjo-cyan); font-weight: 700; font-size: 0.95rem;">
                ✅ ¡KLIKO ya está instalada en tu dispositivo!
              </div>
              <p style="margin: 0; font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                No necesitas volver a instalarla. Puedes abrirla directamente desde el menú de inicio de Windows, tu lista de aplicaciones de Android, o buscando <strong>KLIKO</strong>.
              </p>
            `;
          }
          if (modal) modal.classList.add("active");
          return;
        }
      } catch (e) {}
    }

    // 3. Si es dispositivo iOS (iPhone / iPad de Apple)
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIos) {
      if (instructionsBox) {
        instructionsBox.innerHTML = `
          <div style="margin-bottom: 12px; display:flex; align-items:flex-start; gap:8px;">
            <span style="font-size:1.2rem; line-height:1;">1️⃣</span>
            <div>Toca el botón <strong>Compartir</strong> en la barra de Safari <span style="font-size:1.1rem; vertical-align:middle;">⎋</span> (icono del recuadro con flecha hacia arriba).</div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="font-size:1.2rem; line-height:1;">2️⃣</span>
            <div>Desplaza hacia abajo y toca en <strong>«Añadir a pantalla de inicio»</strong> ➕.</div>
          </div>
        `;
      }
      if (modal) modal.classList.add("active");
      return;
    }

    // 4. Si es dispositivo Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      if (instructionsBox) {
        instructionsBox.innerHTML = `
          <div style="margin-bottom: 12px; display:flex; align-items:flex-start; gap:8px;">
            <span style="font-size:1.2rem; line-height:1;">1️⃣</span>
            <div>Toca el menú de <strong>tres puntos ⋮</strong> (arriba a la derecha en Chrome).</div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="font-size:1.2rem; line-height:1;">2️⃣</span>
            <div>Toca en <strong>«Instalar aplicación»</strong> o <strong>«Añadir a pantalla de inicio»</strong>.</div>
          </div>
        `;
      }
      if (modal) modal.classList.add("active");
      return;
    }

    // 5. Si está abierto como file://
    if (window.location.protocol === 'file:') {
      if (instructionsBox) {
        instructionsBox.innerHTML = `
          <div style="color: #fbbf24; margin-bottom: 10px;">
            ⚠️ Estás abriendo el archivo localmente como <code>file:///</code>.
          </div>
          <div style="font-size: 0.78rem; line-height: 1.4;">
            Abre la versión oficial segura en <a href="https://kliko-wheat.vercel.app" style="color:var(--amurjo-cyan); text-decoration:underline;">kliko-wheat.vercel.app</a> para instalarla con 1 clic.
          </div>
        `;
      }
      if (modal) modal.classList.add("active");
      return;
    }

    // 6. Si es Ordenador (Chrome / Edge en PC o Mac)
    if (instructionsBox) {
      instructionsBox.innerHTML = `
        <div style="margin-bottom: 12px; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.2rem; line-height:1;">💻</span>
          <div>
            <strong>Instalación en Ordenador:</strong><br>
            Haz clic en el icono <strong>📥 «Instalar KLIKO»</strong> situado a la derecha de la barra de direcciones (arriba), o abre el menú de tres puntos (⋮) y selecciona <em>«Instalar KLIKO»</em>.
          </div>
        </div>
        <p style="margin: 6px 0 0; font-size: 0.76rem; color: var(--text-muted); line-height: 1.4;">
          Si ya la tenías instalada, puedes buscar <strong>KLIKO</strong> en el menú de inicio de Windows o pulsar el icono «Abrir en la aplicación».
        </p>
      `;
    }
    if (modal) modal.classList.add("active");
  };

  if (btnTopInstall) btnTopInstall.addEventListener("click", executeDirectInstall);
  if (btnBannerInstall) btnBannerInstall.addEventListener("click", executeDirectInstall);
}

function getAppPublicUrl() {
  if (window.location.protocol === 'file:') {
    return 'http://localhost:8000';
  }
  return window.location.origin + window.location.pathname;
}

function renderStandardQRCode(containerId, text, size = 160) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  if (typeof QRCode !== 'undefined') {
    try {
      new QRCode(container, {
        text: text,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.M
      });
      return;
    } catch (e) {
      console.warn("QRCode dynamic generation error, using fallback image:", e);
    }
  }
  container.innerHTML = `<img src="img/qr_orcera_joven.png" alt="Código QR Estándar ISO" width="${size}" height="${size}" style="display:block; border-radius:4px;">`;
}

function openPromoShareModal() {
  const modal = document.getElementById("promo-share-modal");
  if (!modal) return;

  const refCode = AppState.currentUser ? (AppState.currentUser.alias || 'joven').toLowerCase() : 'orcera';
  const targetUrl = `${getAppPublicUrl()}?ref=${refCode}`;

  const refInput = document.getElementById("promo-ref-link");
  if (refInput) {
    refInput.value = targetUrl;
  }

  renderStandardQRCode("promo-qr-render-area", targetUrl, 160);
  modal.classList.add("active");
}

function closePromoShareModal() {
  const modal = document.getElementById("promo-share-modal");
  if (modal) modal.classList.remove("active");
}

function openPosterModal() {
  const modal = document.getElementById("promo-poster-modal");
  if (!modal) return;
  modal.classList.add("active");

  const targetUrl = getAppPublicUrl();
  const urlDisplay = document.getElementById("poster-url-display");
  if (urlDisplay) {
    urlDisplay.textContent = `🌐 ${targetUrl}`;
  }

  renderStandardQRCode("poster-qr-render-area", targetUrl, 165);
}

function closePosterModal() {
  const modal = document.getElementById("promo-poster-modal");
  if (modal) modal.classList.remove("active");
}

// ------------------------------------------------------------------------------
// PANE 7: KIT DE CAMPAÑA, PROMOCIÓN Y CARTELERÍA MUNICIPAL
// ------------------------------------------------------------------------------
function renderPanePromocion(container) {
  container.innerHTML = `
    <div class="admin-pane-card">
      <div class="admin-pane-header">
        <div>
          <span class="badge-tag-civic">Módulo 7 · Plan de Comunicación & Difusión</span>
          <h3 style="margin:2px 0 0; font-size:1.15rem; color:var(--text-main);">📣 Kit de Campaña y Promoción del III Plan</h3>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:4px 0 0;">
            Herramientas para divulgar la plataforma en el IES, Espacio Joven, Piscina de Amurjo y redes sociales de Orcera.
          </p>
        </div>
        <button type="button" class="btn-primary" id="btn-open-poster-from-admin" style="padding:8px 14px; font-weight:800;">
          🖨️ Ver y Generar Cartel Oficial A4/A3 con QR
        </button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:20px;">
        <!-- PRESENTACIÓN EN PPT / TRANSPARENCIAS PARA EL PLENO -->
        <div style="background:linear-gradient(135deg, rgba(6,78,59,0.35), rgba(16,185,129,0.15)); border:1px solid rgba(16, 185, 129, 0.45); border-radius:var(--radius-md); padding:16px;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
            <span style="font-size:1.4rem;">📽️</span>
            <div>
              <strong style="display:block; font-size:0.86rem; color:var(--text-main);">Presentación para el Alcalde y el Pleno</strong>
              <small style="color:#34d399; font-size:0.7rem;">Transparencias oficiales 16:9</small>
            </div>
          </div>
          <p style="font-size:0.74rem; color:var(--text-muted); line-height:1.4; margin-bottom:12px;">
            Dossier visual en diapositivas panorámicas con datos económicos, justificación frente a la despoblación y propuesta de acuerdo plenario.
          </p>
          <div style="display:flex; gap:8px;">
            <a href="presentacion.html" target="_blank" class="btn-primary" style="flex:1; justify-content:center; padding:8px 10px; text-decoration:none; font-size:0.75rem;">
              ▶ Iniciar Diapositivas
            </a>
            <a href="docs/Presentacion_III_Plan_Juventud_Orcera.pptx" download="Presentacion_III_Plan_Juventud_Orcera.pptx" class="btn-tool" style="flex:1; justify-content:center; padding:8px 10px; text-decoration:none; font-size:0.75rem; color:var(--amurjo-cyan);">
              📥 Descargar .PPTX
            </a>
          </div>
        </div>

        <!-- CARTELERÍA FÍSICA -->
        <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
            <span style="font-size:1.4rem;">🪧</span>
            <div>
              <strong style="display:block; font-size:0.86rem; color:var(--text-main);">Cartelería Oficial A4 / A3 con QR</strong>
              <small style="color:var(--amurjo-cyan); font-size:0.7rem;">Para IES, Piscina de Amurjo y Espacio Joven</small>
            </div>
          </div>
          <p style="font-size:0.74rem; color:var(--text-muted); line-height:1.4; margin-bottom:12px;">
            Póster de alta calidad optimizado para impresión municipal. Incluye el lema del Plan, las 4 ventajas cívicas y el código QR gigante para escanear en segundos.
          </p>
          <button type="button" class="btn-tool" id="btn-quick-poster-admin" style="width:100%; justify-content:center; color:var(--amurjo-cyan); font-weight:700;">
            👁️ Vista Previa del Cartel Oficial
          </button>
        </div>

        <!-- CAMPAÑA EN WHATSAPP Y REDES -->
        <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
            <span style="font-size:1.4rem;">💬</span>
            <div>
              <strong style="display:block; font-size:0.86rem; color:var(--text-main);">Mensaje para Difusión de WhatsApp</strong>
              <small style="color:#10b981; font-size:0.7rem;">Listo para canal y lista municipal</small>
            </div>
          </div>
          <textarea id="admin-copy-wa-text" rows="3" readonly style="width:100%; box-sizing:border-box; background:rgba(0,0,0,0.25); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:8px; color:var(--text-main); font-size:0.72rem; line-height:1.35; resize:none;">🏛️ ¡Atención jóvenes de Orcera (12-30 años)! Ya está activa la plataforma del III Plan Municipal de Juventud. Regístrate gratis, hazte socio/a de la Asociación Juvenil y gana entradas para Amurjo y pistas de pádel 👉 http://localhost:8000</textarea>
          <button type="button" class="btn-tool" id="btn-copy-wa-admin" style="width:100%; justify-content:center; margin-top:8px; font-weight:700;">
            📋 Copiar Mensaje de WhatsApp
          </button>
        </div>

        <!-- CAMPAÑA EN INSTAGRAM STORIES / POST -->
        <div style="background:var(--segura-surface-elevated); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:16px;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
            <span style="font-size:1.4rem;">📸</span>
            <div>
              <strong style="display:block; font-size:0.86rem; color:var(--text-main);">Texto para Instagram / TikTok</strong>
              <small style="color:#f43f5e; font-size:0.7rem;">Copia de copy y hashtags</small>
            </div>
          </div>
          <textarea id="admin-copy-ig-text" rows="3" readonly style="width:100%; box-sizing:border-box; background:rgba(0,0,0,0.25); border:1px solid var(--segura-border); border-radius:var(--radius-md); padding:8px; color:var(--text-main); font-size:0.72rem; line-height:1.35; resize:none;">¿Vives en Orcera y tienes entre 12 y 30 años? Tu opinión decide en qué gastamos el presupuesto participativo. Entra en el link de la bio, vota en 1 clic y llévate entradas para Amurjo 🏊‍♂️ #OrceraJoven #SierraDeSegura #JuventudRural</textarea>
          <button type="button" class="btn-tool" id="btn-copy-ig-admin" style="width:100%; justify-content:center; margin-top:8px; font-weight:700;">
            📋 Copiar Copy de Instagram
          </button>
        </div>
      </div>

      <!-- MÉTRICAS DE IMPACTO ESTIMADO -->
      <div style="background:linear-gradient(135deg, rgba(6,78,59,0.3), rgba(6,182,212,0.15)); border:1px solid rgba(6,182,212,0.35); border-radius:var(--radius-md); padding:16px;">
        <h4 style="margin:0 0 8px; font-size:0.86rem; color:var(--text-main);">🎯 Objetivos de Cobertura en Orcera</h4>
        <div style="display:flex; justify-content:space-around; text-align:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span style="font-size:1.3rem; font-weight:800; color:var(--text-main);">285</span>
            <small style="display:block; font-size:0.68rem; color:var(--text-muted);">Jóvenes Censados (12-30 años)</small>
          </div>
          <div>
            <span style="font-size:1.3rem; font-weight:800; color:#10b981;">75%</span>
            <small style="display:block; font-size:0.68rem; color:var(--text-muted);">Meta de Adopción (215 jóvenes)</small>
          </div>
          <div>
            <span style="font-size:1.3rem; font-weight:800; color:var(--cyber-coral);">+25 PTS</span>
            <small style="display:block; font-size:0.68rem; color:var(--text-muted);">Incentivo de Recomendación</small>
          </div>
        </div>
      </div>
    </div>
  `;

  // Listeners
  const openPoster = () => openPosterModal();
  const btn1 = container.querySelector("#btn-open-poster-from-admin");
  const btn2 = container.querySelector("#btn-quick-poster-admin");
  if (btn1) btn1.addEventListener("click", openPoster);
  if (btn2) btn2.addEventListener("click", openPoster);

  const copyWaBtn = container.querySelector("#btn-copy-wa-admin");
  if (copyWaBtn) {
    copyWaBtn.addEventListener("click", () => {
      const text = container.querySelector("#admin-copy-wa-text").value;
      navigator.clipboard.writeText(text).then(() => {
        showToast("Texto Copiado", "Mensaje de WhatsApp copiado al portapapeles.");
      });
    });
  }

  const copyIgBtn = container.querySelector("#btn-copy-ig-admin");
  if (copyIgBtn) {
    copyIgBtn.addEventListener("click", () => {
      const text = container.querySelector("#admin-copy-ig-text").value;
      navigator.clipboard.writeText(text).then(() => {
        showToast("Texto Copiado", "Copy para redes sociales copiado al portapapeles.");
      });
    });
  }
}

/**
 * Inicialización y Gestión del Sistema de Políticas Legales
 * Privacidad, Aviso Legal, Protección de Datos (RGPD/LOPDGDD), Cookies y Accesibilidad
 */
const POLICIES_DATA = {
  "privacidad": {
    icon: "🔒",
    badge: "Privacidad & Tratamiento Confidencial",
    title: "Política de Privacidad",
    desc: "El Ayuntamiento de Orcera garantiza la máxima transparencia y respeto a la privacidad de las personas jóvenes en todos los servicios de KLIKO.",
    items: [
      {
        title: "Responsable del Tratamiento:",
        text: "Ayuntamiento de Orcera (Concejalía de Juventud) · CIF: P-2306500-G · Plaza del Ayuntamiento, 1, 23370 Orcera (Jaén) · Correo: <code>ayuntamiento@orcera.es</code>."
      },
      {
        title: "Finalidades del Tratamiento:",
        text: "Gestión de la cuenta joven vecinal, registro y moderación de propuestas en el Buzón Joven, contabilización de votos comunitarios y asignación de Puntos Orcera para canje de recompensas públicas (acceso a Amurjo, actividades culturales y deportivas)."
      },
      {
        title: "Confidencialidad y No Comercialización:",
        text: "KLIKO es un servicio público sin fines lucrativos. En ningún caso se venden, ceden ni transfieren datos a empresas privadas o agencias publicitarias de terceros."
      },
      {
        title: "Plazo de Conservación:",
        text: "Los datos se conservarán durante la vigencia del III Plan Municipal de Juventud (2027–2031) o hasta que la persona usuaria solicite la cancelación o supresión de su cuenta."
      },
      {
        title: "Ejercicio de Derechos (ARCO-POL):",
        text: "Tienes derecho de Acceso, Rectificación, Supresión ('derecho al olvido'), Limitación del tratamiento, Portabilidad y Oposición escribiendo a <code>ayuntamiento@orcera.es</code> o reclamando ante la Agencia Española de Protección de Datos (AEPD · <code>www.aepd.es</code>)."
      }
    ]
  },
  "legal": {
    icon: "⚖️",
    badge: "Ley 34/2002 (LSSI-CE) & Reglamento UE 2022/2065 (DSA)",
    title: "Aviso Legal y Condiciones de Uso",
    desc: "Términos reguladores del uso de la plataforma digital oficial del III Plan Municipal de Juventud de Orcera.",
    items: [
      {
        title: "Titularidad del Portal:",
        text: "Ayuntamiento de Orcera (Jaén), corporación de derecho público de la administración local, con sede en Plaza del Ayuntamiento, 1, 23370 Orcera."
      },
      {
        title: "Objeto de la Plataforma:",
        text: "Canal telemático de participación ciudadana, gobernanza abierta y dinamización comunitaria para las personas jóvenes empadronadas o vinculadas a Orcera y la Sierra de Segura."
      },
      {
        title: "Normas de Convivencia y Uso Responsable:",
        text: "Las propuestas e intervenciones en el Buzón Joven deben ser veraces y respetuosas. Se prohíbe terminantemente la publicación de contenidos difamatorios, lesivos del honor, discriminatorios por razón de sexo, raza, religión u orientación sexual, o constitutivos de delito."
      },
      {
        title: "Moderación Transparente y Motivada (DSA):",
        text: "Conforme a la Ley de Servicios Digitales (DSA UE 2022/2065), cualquier propuesta que sea moderada o retirada por contravenir las normas cívicas será motivada fehacientemente y comunicada a la persona usuaria con opción de subsanación."
      },
      {
        title: "Propiedad Intelectual y Reutilización Pública:",
        text: "Los diseños, marcas y contenidos institucionales son titularidad del Ayuntamiento de Orcera y la Asociación Juvenil. Las iniciativas y propuestas vecinales se aportan para el debate público municipal."
      }
    ]
  },
  "proteccion-datos": {
    icon: "🛡️",
    badge: "Reglamento (UE) 2016/679 (RGPD) & Ley Orgánica 3/2018 (LOPDGDD)",
    title: "Protección de Datos Personales (RGPD)",
    desc: "Información detallada sobre el cumplimiento normativo en materia de protección de datos (Art. 11 LOPDGDD y Arts. 13/14 RGPD).",
    items: [
      {
        title: "Información por Capas:",
        text: "En cada formulario interactivo (alta de usuario, Buzón Joven, adhesión asociativa) se incluye una primera capa informativa con consentimiento expreso, complementada por esta información de segunda capa íntegra y permanente."
      },
      {
        title: "Base Jurídica (Legitimación):",
        text: "El tratamiento se fundamenta en el cumplimiento de una misión de interés público y ejercicio de competencias públicas locales de fomento juvenil (Art. 6.1.e RGPD) y en el consentimiento libre, específico, informado e inequívoco de la persona interesada (Art. 6.1.a RGPD)."
      },
      {
        title: "Tratamiento Específico de Datos de Menores:",
        text: "De conformidad con el Art. 8 del RGPD y el Art. 7 de la LOPDGDD, las personas a partir de 14 años de edad pueden prestar su consentimiento de forma válida y autónoma. Para menores de 14 años, se requiere la autorización o supervisión de sus progenitores o tutores legales."
      },
      {
        title: "Delegado de Protección de Datos (DPD):",
        text: "Cualquier consulta sobre la seguridad o el tratamiento de tus datos personales puede remitirse a la atención del Delegado de Protección de Datos en <code>ayuntamiento@orcera.es</code>."
      },
      {
        title: "Medidas Técnicas y Almacenamiento Seguro:",
        text: "Todos los intercambios de datos viajan cifrados mediante protocolo HTTPS/TLS. La base de datos opera bajo directivas de seguridad europeas y con copias de respaldo continuas."
      }
    ]
  },
  "cookies": {
    icon: "🍪",
    badge: "Directiva 2002/58/CE (ePrivacy) & Directrices de la AEPD",
    title: "Política de Cookies y Almacenamiento Técnico",
    desc: "Esta plataforma municipal aplica de forma rigurosa el principio de Privacidad desde el Diseño (Privacy by Design).",
    items: [
      {
        title: "Cero Cookies Publicitarias de Rastreo:",
        text: "KLIKO NO utiliza cookies analíticas de terceros, cookies de perfilado comercial ni herramientas de rastreo entre webs. Tu navegación es completamente privada."
      },
      {
        title: "Almacenamiento Local Estrictamente Necesario:",
        text: "La aplicación hace uso de la memoria local del navegador (<code>LocalStorage</code>) exclusivamente para aspectos técnicos esenciales: recordar si tienes activado el Modo Noche o Día, mantener tu sesión abierta en el teléfono y habilitar la navegación offline cuando estés en la Sierra sin cobertura."
      },
      {
        title: "Exención de Banners Intrusivos:",
        text: "Al ser almacenamiento meramente técnico e imprescindible para prestar el servicio solicitado, la normativa de la AEPD y el Comité Europeo de Protección de Datos exime de mostrar banners bloqueantes de cookies, ofreciendo una experiencia rápida y limpia."
      }
    ]
  },
  "accesibilidad": {
    icon: "♿",
    badge: "Real Decreto 1112/2018 & Directiva (UE) 2016/2102 · WCAG 2.1 AA",
    title: "Declaración de Accesibilidad Universal",
    desc: "El Ayuntamiento de Orcera tiene la firme vocación de hacer accesible esta plataforma pública a toda la juventud, sin exclusiones.",
    items: [
      {
        title: "Norma Europea EN 301 549:",
        text: "KLIKO cumple las pautas de accesibilidad para contenidos web WCAG 2.1 en nivel de conformidad AA, tal y como exige el Real Decreto 1112/2018 para entidades del sector público."
      },
      {
        title: "Facilidades de Interacción:",
        text: "Alto contraste seleccionable para exteriores soleados y entornos oscuros, navegación completa mediante teclado, etiquetas ARIA para lectores de pantalla de personas con discapacidad visual y tipografías perfectamente escalables."
      },
      {
        title: "Canal de Quejas y Sugerencias de Accesibilidad:",
        text: "Si encuentras alguna dificultad de acceso o necesitas un formato alternativo de cualquier contenido, puedes comunicarlo al correo <code>ayuntamiento@orcera.es</code>."
      }
    ]
  }
};

let currentActivePolicyKey = null;

function normalizePolicyKey(tabKey) {
  let key = tabKey || "privacidad";
  if (key === "rgpd") key = "proteccion-datos";
  if (key === "eprivacy") key = "cookies";
  if (key === "dsa") key = "legal";
  const valid = ["privacidad", "legal", "proteccion-datos", "cookies", "accesibilidad"];
  return valid.includes(key) ? key : "privacidad";
}

function renderInlinePolicy(policyKey) {
  const key = normalizePolicyKey(policyKey);
  const data = POLICIES_DATA[key];
  const expandBox = document.getElementById("eu-policy-expandable-box");
  const badgeEl = document.getElementById("eu-expand-badge");
  const contentEl = document.getElementById("eu-expand-content");
  const buttons = document.querySelectorAll(".btn-eu-policy");

  if (!expandBox || !data) return;

  // Si se vuelve a pulsar la misma política abierta, se pliega
  if (currentActivePolicyKey === key && expandBox.style.display !== "none") {
    expandBox.style.display = "none";
    buttons.forEach(b => b.classList.remove("active"));
    currentActivePolicyKey = null;
    return;
  }

  currentActivePolicyKey = key;

  // Actualizar clases activas en los botones de políticas
  buttons.forEach(b => {
    const isThis = b.getAttribute("data-eu-open") === key;
    b.classList.toggle("active", isThis);
  });

  // Renderizar contenido
  if (badgeEl) badgeEl.textContent = `${data.icon} ${data.badge}`;
  if (contentEl) {
    contentEl.innerHTML = `
      <h4>${data.icon} ${data.title}</h4>
      <p>${data.desc}</p>
      <div class="legal-spec-grid">
        ${data.items.map(it => `
          <div class="spec-item">
            <strong>${it.title}</strong>
            <span>${it.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  expandBox.style.display = "block";
  expandBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function initEuPoliciesModal() {
  const modal = document.getElementById("eu-policies-modal");
  const closeBtn = document.getElementById("close-eu-policies-modal");
  const closeActionBtn = document.getElementById("btn-close-eu-modal-action");
  const tabBtns = document.querySelectorAll(".eu-tab-btn");
  const panes = document.querySelectorAll(".eu-policy-pane");
  const expandBox = document.getElementById("eu-policy-expandable-box");
  const btnCloseExpand = document.getElementById("btn-close-expand-policy");
  const btnExpandOpenModal = document.getElementById("btn-expand-open-modal");

  function switchPolicyTab(tabKey) {
    const m = document.getElementById("eu-policies-modal");
    if (!m) return;
    const key = normalizePolicyKey(tabKey);
    const tBtns = m.querySelectorAll(".eu-tab-btn");
    const pPanes = m.querySelectorAll(".eu-policy-pane");
    tBtns.forEach(btn => {
      const isMatch = btn.getAttribute("data-eu-tab") === key;
      btn.classList.toggle("active", isMatch);
      btn.setAttribute("aria-selected", isMatch ? "true" : "false");
    });
    pPanes.forEach(pane => {
      const isMatch = pane.id === `pane-eu-${key}`;
      pane.classList.toggle("active", isMatch);
      pane.style.display = isMatch ? "block" : "none";
    });
  }

  function openEuModal(tabKey = "privacidad") {
    const m = document.getElementById("eu-policies-modal");
    if (!m) return;
    const key = normalizePolicyKey(tabKey);
    switchPolicyTab(key);
    m.classList.add("active");
    m.style.display = "flex";
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const bodyEl = m.querySelector(".eu-modal-body");
    if (bodyEl) bodyEl.scrollTop = 0;
  }

  function closeEuModal() {
    const m = document.getElementById("eu-policies-modal");
    if (!m) return;
    m.classList.remove("active");
    m.style.display = "none";
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Delegación de clic global para elementos con [data-eu-open]
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-eu-open]");
    if (trigger) {
      e.preventDefault();
      const policyKey = trigger.getAttribute("data-eu-open") || "privacidad";
      openEuModal(policyKey);
    }
  });

  // Botón para cerrar el panel desplegable del footer
  if (btnCloseExpand && expandBox) {
    btnCloseExpand.addEventListener("click", () => {
      expandBox.style.display = "none";
      document.querySelectorAll(".btn-eu-policy").forEach(b => b.classList.remove("active"));
      currentActivePolicyKey = null;
    });
  }

  // Botón para abrir en modal completo desde el desplegable del footer
  if (btnExpandOpenModal) {
    btnExpandOpenModal.addEventListener("click", () => {
      openEuModal(currentActivePolicyKey || "privacidad");
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabKey = btn.getAttribute("data-eu-tab");
      switchPolicyTab(tabKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeEuModal);
  if (closeActionBtn) closeActionBtn.addEventListener("click", closeEuModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeEuModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeEuModal();
    }
  });

  window.openEuModal = openEuModal;
  window.renderInlinePolicy = renderInlinePolicy;
}

// Invocación segura de inicialización
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEuPoliciesModal);
} else {
  initEuPoliciesModal();
}

// Delegación global para filas interactivas del cronograma
document.addEventListener("click", (e) => {
  const row = e.target.closest(".eje-gantt-matrix-row[data-action-code]");
  if (row) {
    const code = row.getAttribute("data-action-code");
    const eId = row.getAttribute("data-eje-id");
    openActionDetailModal(code, eId);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cam = document.getElementById("cronograma-action-modal");
  if (cam) {
    cam.addEventListener("click", (e) => {
      if (e.target === cam) closeActionDetailModal();
    });
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const cam = document.getElementById("cronograma-action-modal");
    if (cam && cam.classList.contains("active")) {
      closeActionDetailModal();
    }
  }
});


