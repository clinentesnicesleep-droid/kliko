# 🐿️ KLIKO · III PLAN MUNICIPAL DE JUVENTUD DE ORCERA (2027-2031)
## Aplicación Interactiva, Gamificación Cívica y Plataforma Oficial de Juventud

Bienvenido al repositorio oficial de **KLIKO**, la aplicación y plataforma digital del **III Plan Municipal de Juventud de Orcera 2027-2031**. Diseñada bajo los más altos estándares de diseño de producto digital (UI/UX juvenil, estética Bento Rural-Tech, medallón de la ardilla segureña), arquitectura fullstack, transparencia presupuestaria en tiempo real y gamificación cívica para administraciones locales.

---

## 📁 Estructura del Proyecto

```text
KLIKO/
├── index.html                   # Prototipo interactivo web/mobile completo
├── presentacion.html            # Presentación oficial proyectable (16 slides) para el Alcalde y el Pleno
├── favicon.svg                  # Favicon vectorial de alta definición con el emblema de KLIKO
├── favicon.png                  # Favicon multiplataforma (32x32, 64x64, apple-touch-icon 180x180)
├── css/
│   └── styles.css               # Sistema de diseño Bento Rural-Tech & Paleta Sierra de Segura
├── js/
│   ├── app.js                   # Lógica reactiva de cliente, Puntos KLIKO, buzón y gamificación
│   └── data-ejes.js             # Datos oficiales de los 7 ejes, 63 acciones y 21 indicadores
├── img/
│   ├── kliko_logo_clean.png     # Logotipo oficial transparente KLIKO (ardilla + pino + agua)
│   ├── kliko_emblem.png         # Medallón circular aislado para avatares y favicons
│   ├── kliko_logo_original.png  # Master original del logo
│   └── ...                      # Recursos visuales del proyecto
├── database/
│   └── schema.sql               # Esquema relacional SQL completo (PostgreSQL / Supabase)
├── docs/
│   ├── PLANIFICACION_KLIKO.md   # Plan de despliegue de identidad de marca KLIKO
│   └── ARQUITECTURA_Y_DISENO_UXUI.md # Especificación técnica, User Flow y Wireframes
└── README.md                    # Documentación del proyecto y guía de inicio
```

---

## 🌟 Características Principales

### 1. Enfoque Visual & UI/UX Juvenil
- **Estética Bento Grid Rural-Tech:** Tarjetas interactivas con *glassmorphism*, bordes sutiles y micro-animaciones fluidas.
- **Paleta Sierra de Segura:** Verdes monte (*Segura Pine Green* `#064E3B`), *Amurjo Cyan* `#06B6D4`, *Cyber Coral* `#FF5722` y *Digital Violet* `#8B5CF6`.
- **Modo Oscuro / Claro Adaptativo:** Conmutable con 1 clic.
- **Simulador Smartphone Integrado:** Vista con marco de smartphone o modo pantalla completa responsive.
- **Tono Cercano ("De tú a tú"):** Sin jerga burocrática, centrado en el beneficio directo de las y los jóvenes de Orcera.

### 2. Módulo 1: "Descubre el Plan" (Acordeón Interactivo)
- **Punto 1:** *Orcera cree en ti* (Presentación y resumen: por qué este plan es para ti y cómo evitar la emigración).
- **Punto 2:** *Las reglas del juego* (Marco europeo Erasmus+, Plan Integral de Andalucía y ODS 2030).
- **Punto 3:** *Radiografía de Orcera* (1.712 habitantes, 285 jóvenes, retos del olivar y oportunidades de teletrabajo).
- **Punto 4:** *Lo que nos mueve* (Igualdad real, salud mental sin tabúes, sostenibilidad en el Parque Natural).
- **Punto 5:** *Participa y decide* (Votación en un clic, evaluación continua con estrellas y recompensas).

### 3. Módulo 2: "Ejes en Acción" (Gestión y Seguimiento en Vivo)
Ficha técnica viva para los **7 Ejes del Plan**:
1. **Entorno Sostenible, Digital y Conectado** (Presupuesto anual: 2.500 €).
2. **Ocio, Cultura, Deporte y Vida Saludable** (Presupuesto anual: 4.000 €).
3. **Emancipación, Empleo, Formación y Vivienda** (Presupuesto anual: 2.500 €).
4. **Participación Juvenil, Ciudadanía Activa y Voluntariado** (Presupuesto anual: 1.500 €).
5. **Salud, Bienestar Emocional e Inclusión Social** (Presupuesto anual: 2.000 €).
6. **Igualdad, Diversidad y Convivencia** (Presupuesto anual: 1.500 €).
7. **Gobernanza, Innovación y Evaluación de las Políticas** (Presupuesto anual: 1.000 €).

**Cada Eje incluye los 7 campos interactivos requeridos:**
- Identificación visual, lema e icono institucional.
- **Objetivo General y 3 Objetivos Específicos (21 OE en total).**
- **Catálogo de 9 Acciones detalladas por Eje (al menos 3 acciones por Objetivo Específico, 63 acciones en total en el Plan)** con concejalías responsables, recursos asignados, estado y trimestre.
- Indicadores de éxito con barras de meta.
- Cronograma quinquenal completo (2027-2031) y calendario trimestral interactivo (Q1-Q4).
- Panel de gestión presupuestaria en tiempo real (Previsto vs. Real + % Ejecución con facturas justificadas auditables).
- Espacio participativo con valoración de 1 a 5 estrellas y caja de feedback directo.

### 4. Gamificación: "Orcera Puntos & Piscina Municipal de Amurjo"
- Ganancia de puntos cívicos al evaluar actividades (+30 pts), publicar propuestas (+50 pts) o votar (+15 pts).
- Canje real de pases a la **Piscina Municipal de Amurjo**, pistas de pádel y plazas en talleres con generador de códigos QR dinámicos.

### 5. Backend Cloud: Supabase (PostgreSQL & Realtime)
- **Instancia Cloud:** Proyecto oficial `kliko-orcera` (`yguxomidjdbmrzfphjua.supabase.co`).
- **Tablas Desplegadas:** `users`, `ejes`, `objetivos`, `acciones`, `presupuestos`, `indicadores`, `valoraciones`, `propuestas`, `recompensas`, `canjes_recompensas`.
- **Seguridad:** Row Level Security (RLS) activo con políticas públicas para participación y auditoría ciudadana.
- **Cliente:** [js/supabase-client.js](file:///c:/Users/RAMON/Desktop/KLIKO/js/supabase-client.js) con suscripciones Realtime e indicador de conexión visual (`🟢 Supabase En Vivo`).
- **Resiliencia Offline:** En caso de corte de red, la aplicación conmuta automáticamente al almacenamiento local sin interrumpir la experiencia.

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere dependencias externas ni compiladores complejos. Simplemente abre `index.html` en cualquier navegador web moderno:

```bash
# Opción 1: Abrir directamente en el explorador
start index.html

# Opción 2: Usar un servidor local ligero (Node o Python)
python -m http.server 8080
# o bien: npx serve .
```
