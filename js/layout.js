/* ===================================================================
   ONG VISION CITOYENNE — layout.js
   Injecte l'en-tête, le pied de page et la barre d'action mobile
   dans TOUTES les pages du site. Source unique de la navigation.
   =================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     TEMPLATE : EN-TÊTE (header + navigation)
     --------------------------------------------------------------- */
  const HEADER_HTML = `
    <a class="skip-link" href="#main" data-i18n="skip">Aller au contenu</a>
    <div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>

    <header class="site-header" id="header">
      <div class="container header-inner">
        <a href="index.html" class="brand" aria-label="ONG Vision Citoyenne - Accueil">
          <img class="brand-logo" src="assets/logo.jpeg" alt="Logo ONG Vision Citoyenne" width="40" height="40" />
          <span class="brand-text">
            <strong>Vision Citoyenne</strong>
            <small data-i18n="brand_sub">Organisation Non Gouvernementale</small>
          </span>
        </a>

        <button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="navMenu">
          <span></span><span></span><span></span>
        </button>

        <nav class="nav" id="navMenu" aria-label="Navigation principale">
          <ul>
            <li><a href="index.html" data-nav="home" data-i18n="nav_home">Accueil</a></li>

            <li class="has-dropdown">
              <button class="drop-toggle" type="button" aria-expanded="false" data-i18n="nav_ong">L'ONG</button>
              <ul class="dropdown">
                <li><a href="index.html#apropos" data-i18n="nav_about">À propos</a></li>
                <li><a href="index.html#valeurs" data-i18n="nav_values">Nos valeurs</a></li>
                <li><a href="projets.html" data-nav="projets" data-i18n="nav_real">Projets & Réalisations</a></li>
                <li><a href="partenaires.html#reconnaissances" data-nav="partenaires" data-i18n="nav_recog">Reconnaissances</a></li>
                <li><a href="partenaires.html" data-nav="partenaires" data-i18n="nav_partners">Partenaires</a></li>
                <li><a href="partenaires.html#temoignages" data-nav="partenaires" data-i18n="nav_testi">Témoignages</a></li>
              </ul>
            </li>

            <li class="has-dropdown">
              <button class="drop-toggle" type="button" aria-expanded="false" data-i18n="nav_actions">Nos actions</button>
              <ul class="dropdown">
                <li><a href="index.html#actions" data-i18n="actions_title">Domaines d'intervention</a></li>
                <li><a href="actualites.html" data-nav="actualites" data-i18n="nav_news">Actualités</a></li>
                <li><a href="actualites.html#galerie" data-nav="actualites" data-i18n="nav_gal">Galerie</a></li>
                <li><a href="contact.html#benevole" data-nav="contact" data-i18n="nav_volunteer">Bénévolat</a></li>
              </ul>
            </li>

            <li><a href="contact.html" data-nav="contact" data-i18n="nav_contact">Contact</a></li>
          </ul>

          <div class="nav-cta">
            <button class="lang-switch" id="langSwitch" aria-label="Changer de langue">
              <span class="lang-chip lang-active">FR</span><span class="lang-sep" aria-hidden="true">/</span><span class="lang-chip lang-inactive">EN</span>
            </button>
            <a href="don.html" class="btn btn-primary btn-sm" data-i18n="nav_donate">Faire un don</a>
          </div>
        </nav>
      </div>
    </header>
  `;

  /* ---------------------------------------------------------------
     TEMPLATE : PIED DE PAGE
     --------------------------------------------------------------- */
  const FOOTER_HTML = `
    <!-- Bandeau CTA -->
    <section class="section cta-band">
      <div class="container">
        <h2 data-i18n="cta_title">Ensemble, portons l'eau à tous</h2>
        <p data-i18n="cta_sub">Soutenez nos actions WASH ou rejoignez nos équipes de bénévoles sur le terrain.</p>
        <div class="hero-actions" style="justify-content:center; margin-bottom:0">
          <a href="don.html" class="btn btn-primary btn-lg" data-i18n="cta_btn1">Faire un don</a>
          <a href="contact.html#benevole" class="btn btn-ghost btn-lg" data-i18n="cta_btn2">Devenir bénévole</a>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div style="display:flex; align-items:center; gap:12px;">
            <img class="footer-logo" src="assets/logo.jpeg" alt="Logo ONG Vision Citoyenne" width="52" height="52" />
            <strong>ONG Vision Citoyenne</strong>
          </div>
          <p data-i18n="footer_tag">Eau, Hygiène et Assainissement en milieu scolaire et communautaire.</p>
          <div class="social-row">
            <a class="social-btn" href="https://www.facebook.com/ongvisioncitoyenne" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.93.26-1.56 1.6-1.56h1.66V4.3c-.29-.04-1.27-.12-2.42-.12-2.4 0-4.04 1.46-4.04 4.15v2.32H7.6V14h2.69v8h3.21z"/></svg></a>
            <a class="social-btn" href="https://wa.me/2250584844614" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"/></svg></a>
            <a class="social-btn" href="mailto:ongvisioncitoyenne@gmail.com" aria-label="E-mail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v16H4z M4 4l8 6 8-6"/></svg></a>
            <a class="social-btn" href="tel:+2252723297299" aria-label="Téléphone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></a>
          </div>

          <p class="footer-news-label" data-i18n="footer_news" style="margin-top:14px; font-weight:600">Newsletter</p>
          <form class="news-form" id="newsForm" novalidate>
            <div class="hp-field" aria-hidden="true"><label>Site web<input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>
            <label for="newsEmail" class="sr-only">Votre e-mail pour la newsletter</label>
            <div class="news-row">
              <input id="newsEmail" type="email" name="email" placeholder="votre@email.com" required maxlength="254" autocomplete="email" />
              <button type="submit" class="btn btn-primary" data-i18n="news_btn2">S'abonner</button>
            </div>
            <p class="form-status" id="newsStatus" role="status"></p>
          </form>
        </div>

        <nav class="footer-col" aria-label="Liens de navigation pied de page">
          <h4 class="footer-title" data-i18n="footer_nav">Navigation</h4>
          <ul>
            <li><a href="index.html" data-i18n="nav_home">Accueil</a></li>
            <li><a href="index.html#apropos" data-i18n="nav_about">À propos</a></li>
            <li><a href="projets.html" data-i18n="nav_real">Projets</a></li>
            <li><a href="partenaires.html" data-i18n="nav_partners">Partenaires</a></li>
            <li><a href="actualites.html" data-i18n="nav_news">Actualités</a></li>
            <li><a href="actualites.html#galerie" data-i18n="nav_gal">Galerie</a></li>
            <li><a href="don.html" data-i18n="nav_donate">Faire un don</a></li>
            <li><a href="contact.html#benevole" data-i18n="nav_volunteer">Bénévolat</a></li>
            <li><a href="contact.html" data-i18n="nav_contact">Contact</a></li>
          </ul>
        </nav>

        <div class="footer-col">
          <h4 class="footer-title" data-i18n="footer_contact">Contact</h4>
          <ul style="gap:14px">
            <li><a href="mailto:ongvisioncitoyenne@gmail.com">ongvisioncitoyenne@gmail.com</a></li>
            <li><a href="tel:+2252723297299">(+225) 27 23 29 72 99</a></li>
            <li><span data-i18n="contact_addr">Yopougon Niangon Sud à gauche, route de la centrale d'Azito, Abidjan, Côte d'Ivoire</span></li>
            <li><span>31 BP 001146 Abidjan 31</span></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <p><span data-i18n="footer_legal">Récépissé N° 0373/MIS DGAT/SDVA — Yopougon Niangon Sud, Abidjan, Côte d'Ivoire</span></p>
          <p><span data-i18n="footer_founded">Fondée le 6 juin 2018</span> · &copy; <span id="year"></span> ONG Vision Citoyenne. <span data-i18n="rights">Tous droits réservés.</span><a href="admin/" rel="nofollow" aria-label="Espace administrateur" title="Espace administrateur" style="opacity:.28;text-decoration:none;padding:0 10px">&bull;</a></p>
        </div>
      </div>
    </footer>
  `;

  /* ---------------------------------------------------------------
     TEMPLATE : BOUTONS FLOTTANTS + BARRE MOBILE
     --------------------------------------------------------------- */
  const FLOATING_HTML = `
    <a class="wa-float" id="waFloat" href="https://wa.me/2250584844614" target="_blank" rel="noopener" aria-label="Nous écrire sur WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"/></svg></a>
    <button class="to-top" id="toTop" aria-label="Retour en haut" title="Retour en haut"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>

    <aside class="mobile-action-bar" aria-label="Actions rapides">
      <div class="mobile-action-inner">
        <a href="tel:+2252723297299" class="mob-btn" aria-label="Appeler l'ONG">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span data-i18n="mob_call">Appeler</span>
        </a>
        <a href="https://wa.me/2250584844614" target="_blank" rel="noopener" class="mob-btn" aria-label="Écrire sur WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"/></svg>
          <span data-i18n="mob_wa">WhatsApp</span>
        </a>
        <a href="don.html" class="mob-btn mob-btn--donate" aria-label="Faire un don">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span data-i18n="mob_donate">Donner</span>
        </a>
        <a href="contact.html#benevole" class="mob-btn" aria-label="Devenir bénévole">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span data-i18n="mob_volunteer">Bénévole</span>
        </a>
      </div>
    </aside>
  `;

  /* ---------------------------------------------------------------
     INJECTION DANS LE DOM
     --------------------------------------------------------------- */
  function inject() {
    const headerSlot = document.getElementById('site-header');
    const footerSlot = document.getElementById('site-footer');
    const floatSlot = document.getElementById('site-floating');

    if (headerSlot) headerSlot.innerHTML = HEADER_HTML;
    if (footerSlot) footerSlot.innerHTML = FOOTER_HTML;
    if (floatSlot) floatSlot.innerHTML = FLOATING_HTML;

    // Marquer la page active dans la navigation
    const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const pageKey = currentPage.replace('.html', '') || 'home';
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.getAttribute('data-nav') === pageKey ||
          (pageKey === 'index' && link.getAttribute('data-nav') === 'home')) {
        link.classList.add('active');
      }
    });
  }

  // Exécution immédiate — layout.js est chargé après le DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
