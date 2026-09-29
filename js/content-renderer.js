/* ===================================================================
   ONG VISION CITOYENNE — content-renderer.js
   Applique dynamiquement le contenu géré par l'admin sur les pages
   publiques. Ordre de priorité :
     1. content.json (fichier serveur — production)
     2. localStorage vc_admin_content (aperçu depuis l'admin)
     3. HTML hardcodé (fallback si aucune source)
   =================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'vc_admin_content';

  const TAG_LABELS = {
    int: 'International', gov: 'Gouvernement', dip: 'Diplomatie',
    ngo: 'ONG Partenaire', env: 'Environnement', hum: 'Humanitaire'
  };
  const TAG_LABELS_EN = {
    int: 'International', gov: 'Government', dip: 'Diplomacy',
    ngo: 'Partner NGO', env: 'Environment', hum: 'Humanitarian'
  };

  function partnerLogoSrc(logo) {
    if (!logo) return '';
    if (logo.indexOf('data:') === 0) return logo;
    if (logo.indexOf('http') === 0) return logo;
    return 'assets/partenaires/' + logo;
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  /* ---- Chargement du contenu ---- */
  async function loadContent() {
    // 1. Essayer content.json à la racine (production)
    try {
      const res = await fetch('content.json', { cache: 'no-cache' });
      if (res.ok) {
        const json = await res.json();
        if (json.partners) return { source: 'file', data: json };
      }
    } catch (e) { /* pas de content.json — normal */ }

    // 2. Fallback localStorage (mode aperçu admin)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.partners) return { source: 'local', data: parsed };
      }
    } catch (e) { /* localStorage indisponible */ }

    return null;
  }

  /* ---- Rendu de la grille des partenaires (partenaires.html) ---- */
  function renderPartnersGrid(partners) {
    const grid = document.querySelector('#partenaires .partner-grid');
    if (!grid || !partners || !partners.length) return;

    grid.innerHTML = partners.map(function (p) {
      const tagLabel = TAG_LABELS[p.tag] || p.tag;
      const tagClass = p.tag === 'int' ? '' : ('partner-tag--' + p.tag);
      return (
        '<article class="partner-card">' +
          '<div class="partner-visual">' +
            '<div class="partner-logo-wrap">' +
              '<img class="partner-logo" src="' + escapeAttr(partnerLogoSrc(p.logo)) + '" alt="Logo ' + escapeAttr(p.name) + '" loading="lazy" />' +
            '</div>' +
            '<span class="partner-tag ' + tagClass + '">' + escapeHtml(tagLabel) + '</span>' +
          '</div>' +
          '<div class="partner-body">' +
            '<h3>' + escapeHtml(p.name) + '</h3>' +
            '<p>' + escapeHtml(p.desc) + '</p>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  /* ---- Rendu du bandeau logos défilant (index.html) ---- */
  function renderPartnersStrip(partners) {
    const track = document.querySelector('.trust-track');
    if (!track || !partners || !partners.length) return;

    function items(withAlt) {
      return partners.map(function (p) {
        const logo = String(p.logo || '');
        const cls = /onu/i.test(logo) ? ' class="is-inverse"' : (/hff/i.test(logo) ? ' class="is-round"' : '');
        return '<li><img src="' + escapeAttr(partnerLogoSrc(logo)) + '" alt="' + (withAlt ? escapeAttr(p.name) : '') + '" height="44"' + cls + ' /></li>';
      }).join('');
    }
    // Deux groupes identiques : l'animation CSS défile de -50 %
    track.innerHTML = '<ul class="trust-group">' + items(true) + '</ul>' +
      '<ul class="trust-group" aria-hidden="true">' + items(false) + '</ul>';
  }

  /* ---- Rendu des témoignages (partenaires.html) ---- */
  function renderTestimonials(testimonials) {
    const grid = document.querySelector('#temoignages .testi-grid');
    if (!grid || !testimonials || !testimonials.length) return;

    grid.innerHTML = testimonials.map(function (t) {
      const initials = t.name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
      return (
        '<article class="testi-card">' +
          '<p class="testi-quote">' + escapeHtml(t.quote) + '</p>' +
          '<div class="testi-who">' +
            '<div class="testi-avatar" aria-hidden="true">' + escapeHtml(initials) + '</div>' +
            '<div>' +
              '<div class="testi-name">' + escapeHtml(t.name) + '</div>' +
              '<div class="testi-role">' + escapeHtml(t.role) + '</div>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  /* ---- Galerie photos (actualites.html) ---- */
  function applyGallery(gallery) {
    if (!gallery || !gallery.length) return;
    // Fournit un override consulté par initGalerie()
    window.GALERIE_OVERRIDE = gallery.map(function (g) {
      return { image: g.image, caption: g.caption || '' };
    });
  }

  /* ---- Rendu des actualités Facebook (actualites.html) ---- */
  function renderNews(news) {
    const grid = document.querySelector('#fbGrid');
    if (!grid || !news || !news.length) return;

    grid.innerHTML = news.map(function (n) {
      const isVideo = n.type === 'video';
      const encodedUrl = encodeURIComponent(n.url);
      let src, w, h;
      if (isVideo) {
        src = 'https://www.facebook.com/plugins/video.php?height=476&href=' + encodedUrl + '&show_text=true&width=350&t=0';
        w = 320; h = 591;
      } else {
        src = 'https://www.facebook.com/plugins/post.php?href=' + encodedUrl + '&show_text=true&width=350';
        w = 350; h = 640;
      }
      return (
        '<div class="fb-embed' + (isVideo ? ' fb-video' : '') + '">' +
          '<iframe title="' + (isVideo ? 'Vidéo' : 'Publication') + ' Facebook" data-src="' + escapeAttr(src) + '" width="' + w + '" height="' + h + '" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen loading="lazy"></iframe>' +
        '</div>'
      );
    }).join('');
  }

  /* ---- Point d'entrée ---- */
  async function init() {
    const loaded = await loadContent();
    if (!loaded) return; // Rien à faire — la HTML statique s'affiche

    const c = loaded.data;
    renderPartnersGrid(c.partners);
    renderPartnersStrip(c.partners);
    renderTestimonials(c.testimonials);
    renderNews(c.news);
    applyGallery(c.gallery);

    // Notifie les autres scripts qu'ils peuvent se ré-initialiser
    if (window.initFacebookNews) window.initFacebookNews();
    if (window.initGalerie) window.initGalerie();
    // Traductions à ré-appliquer si contenu ajouté
    if (window._applyTranslations) window._applyTranslations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
