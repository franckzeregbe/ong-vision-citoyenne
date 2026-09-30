/* ===================================================================
   ONG VISION CITOYENNE — news-render.js
   Affiche les actualités de js/news.js dans les blocs [data-news] :
   - data-news="home" : une actualité à la une + une liste compacte
   - data-news="page" : une actualité à la une + une grille de cartes
   Chaque actualité s'ouvre dans une fenêtre de lecture (<dialog>).
   =================================================================== */

(function () {
  'use strict';

  const UI = {
    fr: { read: 'Lire la suite', close: 'Fermer' },
    en: { read: 'Read more', close: 'Close' }
  };

  let current = null;
  function lang() {
    if (current) return current;
    try { return localStorage.getItem('vc_lang') === 'en' ? 'en' : 'fr'; } catch (e) { return 'fr'; }
  }

  function formatDate(iso, lng) {
    const p = iso.split('-').map(Number);
    const opts = p[2] ? { day: 'numeric', month: 'long', year: 'numeric' } : { month: 'long', year: 'numeric' };
    const s = new Intl.DateTimeFormat(lng === 'en' ? 'en-GB' : 'fr-FR', opts).format(new Date(p[0], p[1] - 1, p[2] || 1));
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function meta(item, lng) {
    const p = el('p', 'news-meta');
    const time = el('time', '', formatDate(item.date, lng));
    time.dateTime = item.date;
    const cat = NEWS_CATS[item.cat];
    p.append(el('span', 'news-cat news-cat--' + item.cat, cat ? cat[lng] : item.cat), time);
    return p;
  }

  /* ---- Fenêtre de lecture ---- */
  let dialog = null;
  function buildDialog() {
    dialog = el('dialog', 'news-dialog');
    dialog.setAttribute('aria-labelledby', 'ndTitle');
    dialog.innerHTML =
      '<div class="nd-inner">' +
        '<button type="button" class="nd-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '<img class="nd-img" alt="" />' +
        '<div class="nd-body"><div class="nd-meta"></div><h3 id="ndTitle"></h3><div class="nd-text"></div><a class="btn btn-primary btn-sm nd-link" href="#"></a></div>' +
      '</div>';
    document.body.appendChild(dialog);
    dialog.querySelector('.nd-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () { document.body.style.overflow = ''; });
  }

  function openItem(item) {
    const lng = lang();
    const t = item[lng] || item.fr;
    if (!window.HTMLDialogElement) { location.href = item.link; return; }
    if (!dialog) buildDialog();
    const img = dialog.querySelector('.nd-img');
    img.src = item.image;
    img.alt = t.title;
    dialog.querySelector('.nd-meta').replaceChildren(meta(item, lng));
    dialog.querySelector('#ndTitle').textContent = t.title;
    dialog.querySelector('.nd-text').replaceChildren(
      el('p', 'nd-lead', t.excerpt),
      ...t.body.map(function (b) { return el('p', '', b); })
    );
    const link = dialog.querySelector('.nd-link');
    link.href = item.link;
    link.textContent = t.cta + ' →';
    dialog.querySelector('.nd-close').setAttribute('aria-label', UI[lng].close);
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }

  /* ---- Cartes ---- */
  function card(item, variant, lng) {
    const t = item[lng] || item.fr;
    const art = el('article', 'news-card news-card--' + variant);
    const fig = el('div', 'news-thumb');
    const img = el('img');
    img.src = item.image;
    img.alt = '';
    img.loading = 'lazy';
    fig.appendChild(img);

    const body = el('div', 'news-body');
    const h = el('h3', 'news-title');
    const btn = el('button', 'news-open', t.title);
    btn.type = 'button';
    btn.addEventListener('click', function () { openItem(item); });
    h.appendChild(btn);
    body.append(meta(item, lng), h);
    if (variant !== 'compact') {
      body.appendChild(el('p', 'news-excerpt', t.excerpt));
      body.appendChild(el('span', 'news-read', UI[lng].read + ' →'));
    }
    art.append(fig, body);
    return art;
  }

  function render() {
    if (typeof NEWS === 'undefined') return;
    const lng = lang();
    document.querySelectorAll('[data-news]').forEach(function (box) {
      const mode = box.dataset.news;
      const items = NEWS.slice(0, parseInt(box.dataset.limit, 10) || NEWS.length);
      if (!items.length) return;
      box.replaceChildren(card(items[0], 'featured', lng));
      const rest = el('div', mode === 'home' ? 'news-side' : 'news-grid');
      items.slice(1).forEach(function (item) {
        rest.appendChild(card(item, mode === 'home' ? 'compact' : 'card', lng));
      });
      if (rest.children.length) box.appendChild(rest);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
  document.addEventListener('vc:lang', function (e) {
    current = e.detail === 'en' ? 'en' : 'fr';
    render();
  });
})();
