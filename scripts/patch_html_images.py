# -*- coding: utf-8 -*-
import sys

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update version query param for fresh cache
    html = html.replace('css/styles.css?v=promo_v8', 'css/styles.css?v=images_v1')
    html = html.replace('js/app.js?v=promo_v8', 'js/app.js?v=images_v1')

    # 2. Hero Bento Cover
    old_hero = '''            <!-- BENTO HERO CARD: IMPACTO Y DATOS ECONÓMICOS/ESTADÍSTICOS (SOLO EN INICIO) -->
            <section class="hero-bento-card">
              <div class="hero-header-badge">
                <span class="live-dot"></span> Presupuesto y Datos Oficiales 2027–2031
              </div>
              <h1 class="hero-title">III Plan Municipal de Juventud</h1>'''

    new_hero = '''            <!-- BENTO HERO CARD: IMPACTO Y DATOS ECONÓMICOS/ESTADÍSTICOS (SOLO EN INICIO) -->
            <section class="hero-bento-card">
              <div class="hero-bento-cover">
                <img src="img/hero-orcera-youth.jpg" alt="Jóvenes de Orcera participando en el III Plan Municipal de Juventud" class="hero-bento-img" loading="eager" />
                <div class="hero-bento-cover-gradient"></div>
                <div class="hero-bento-cover-tags">
                  <span class="hero-cover-tag">🏔️ Orcera · Sierra de Segura</span>
                  <span class="hero-header-badge" style="margin-bottom:0;">
                    <span class="live-dot"></span> Presupuesto y Datos Oficiales 2027–2031
                  </span>
                </div>
              </div>
              <h1 class="hero-title">III Plan Municipal de Juventud</h1>'''

    if old_hero in html:
        html = html.replace(old_hero, new_hero)
        print('1. Hero bento cover replaced')
    else:
        old_hero_crlf = old_hero.replace('\n', '\r\n')
        if old_hero_crlf in html:
            html = html.replace(old_hero_crlf, new_hero.replace('\n', '\r\n'))
            print('1. Hero bento cover replaced (CRLF)')
        else:
            print('ERROR: Hero bento not found')

    # 3. Asociación Promo Banner Thumbnail
    old_asoc_banner = '''            <!-- BANNER OFICIAL: ALTA EN LA ASOCIACIÓN JUVENIL DE ORCERA -->
            <div class="asociacion-promo-banner" id="asociacion-promo-banner">
              <div class="asociacion-banner-icon">🤝</div>
              <div class="asociacion-banner-text">'''

    new_asoc_banner = '''            <!-- BANNER OFICIAL: ALTA EN LA ASOCIACIÓN JUVENIL DE ORCERA -->
            <div class="asociacion-promo-banner" id="asociacion-promo-banner">
              <div class="asociacion-banner-thumb">
                <img src="img/asociacion-juvenil.jpg" alt="Asociación Juvenil de Orcera" loading="lazy" />
              </div>
              <div class="asociacion-banner-text">'''

    if old_asoc_banner in html:
        html = html.replace(old_asoc_banner, new_asoc_banner)
        print('2. Asociación banner thumbnail replaced')
    else:
        old_asoc_crlf = old_asoc_banner.replace('\n', '\r\n')
        if old_asoc_crlf in html:
            html = html.replace(old_asoc_crlf, new_asoc_banner.replace('\n', '\r\n'))
            print('2. Asociación banner thumbnail replaced (CRLF)')
        else:
            print('ERROR: Asociación banner not found')

    # 4. Piscina Fluvial de Amurjo Spotlight
    old_amurjo_target = '''            <!-- CATÁLOGO DE RECOMPENSAS -->
            <h3 class="sub-heading">Recompensas Disponibles</h3>'''

    new_amurjo_spotlight = '''            <!-- SPOTLIGHT VISUAL: PISCINA FLUVIAL DE AMURJO -->
            <div class="amurjo-spotlight-card">
              <div class="amurjo-spotlight-media">
                <img src="img/amurjo-pool.jpg" alt="Piscina Fluvial de Amurjo en Orcera" class="amurjo-spotlight-img" loading="lazy" />
                <div class="amurjo-spotlight-overlay">
                  <span class="amurjo-spotlight-chip">🏊‍♂️ Piscina Fluvial de Amurjo</span>
                  <span class="amurjo-spotlight-caption">El corazón del verano serrano en plena Sierra de Segura</span>
                </div>
              </div>
              <div class="amurjo-spotlight-info">
                <div class="amurjo-info-header">
                  <span class="badge-tag-civic">🎁 Canje de Recompensas</span>
                  <h4 style="margin: 4px 0 6px;">¡Consigue tus pases gratis y entradas para el verano!</h4>
                </div>
                <p>Participando activamente en el III Plan de Juventud acumulas Puntos Cívicos que puedes canjear de inmediato por pases individuales, abonos de temporada y acceso a eventos en el pinar de Amurjo.</p>
                <div class="amurjo-features-list">
                  <span class="amurjo-feat-pill">🌲 Aguas cristalinas en plena naturaleza</span>
                  <span class="amurjo-feat-pill">🎟️ Pases individuales y familiares</span>
                  <span class="amurjo-feat-pill">⚡ Canje directo con tu móvil</span>
                </div>
              </div>
            </div>

            <!-- CATÁLOGO DE RECOMPENSAS -->
            <h3 class="sub-heading">Recompensas Disponibles</h3>'''

    if old_amurjo_target in html:
        html = html.replace(old_amurjo_target, new_amurjo_spotlight)
        print('3. Amurjo spotlight added')
    else:
        old_amurjo_crlf = old_amurjo_target.replace('\n', '\r\n')
        if old_amurjo_crlf in html:
            html = html.replace(old_amurjo_crlf, new_amurjo_spotlight.replace('\n', '\r\n'))
            print('3. Amurjo spotlight added (CRLF)')
        else:
            print('ERROR: Amurjo target not found')

    # 5. Asociación Modal Banner Image
    old_modal_header = '''      <div class="asociacion-modal-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="asociacion-logo-circle">🤝</div>
          <div>
            <span class="badge-tag-civic">Entidad Juvenil Oficial · Orcera</span>
            <h3 style="margin:2px 0 0; font-family:var(--font-heading); font-size:1.15rem; color:var(--text-main);">
              Asociación Juvenil de Orcera
            </h3>
          </div>
        </div>
        <p style="font-size:0.75rem; color:var(--text-muted); margin:8px 0 0;">
          Solicitud formal de pertenencia y emisión de carnet de socio/a. Recompensa de bienvenida del III Plan Municipal (Cuota 0 € gratuita).
        </p>
      </div>'''

    new_modal_header = old_modal_header + '''

      <!-- FOTOGRAFÍA DINÁMICA DE LA ASOCIACIÓN JUVENIL -->
      <div class="asociacion-modal-banner-img">
        <img src="img/asociacion-juvenil.jpg" alt="Equipo de la Asociación Juvenil de Orcera" loading="lazy" />
        <div class="asociacion-banner-img-overlay">
          <span>🤝 Espacio Joven Orcera · Convivencia, viajes, cultura y ocio serrano</span>
        </div>
      </div>'''

    if old_modal_header in html:
        html = html.replace(old_modal_header, new_modal_header)
        print('4. Asociación modal banner added')
    else:
        old_modal_crlf = old_modal_header.replace('\n', '\r\n')
        if old_modal_crlf in html:
            html = html.replace(old_modal_crlf, new_modal_header.replace('\n', '\r\n'))
            print('4. Asociación modal banner added (CRLF)')
        else:
            print('ERROR: Asociación modal header not found')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('COMPLETED index.html updates successfully')

if __name__ == '__main__':
    main()
