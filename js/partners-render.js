/* ===================================================================
   ONG VISION CITOYENNE — partners-render.js
   Affiche les partenaires et témoignages de js/partners.js dans :
   - [data-partners]     : grille de cartes partenaires
   - [data-testimonials] : grille de témoignages
   =================================================================== */

(function () {
  'use strict';

  // Étiquettes de partenaires (admin/admin.js garde la même liste)
  const TAGS = {
    int: { fr: 'International', en: 'International', style: '' },
    gov: { fr: 'Gouvernement', en: 'Government', style: 'gov' },
    dip: { fr: 'Diplomatie', en: 'Diplomacy', style: 'dip' },
    ngo: { fr: 'ONG Partenaire', en: 'Partner NGO', style: 'ngo' },
    env: { fr: 'Environnement', en: 'Environment', style: 'env' },
    hum: { fr: 'Humanitaire', en: 'Humanitarian', style: 'hum' },
    coop: { fr: 'Coopération', en: 'Cooperation', style: 'hum' }
  };

  let current = null;
  function lang() {
    if (current) return current;
    try { return localStorage.getItem('vc_lang') === 'en' ? 'en' : 'fr'; } catch (e) { return 'fr'; }
  }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  // Champ traduit, avec repli sur le français si la traduction est vide
  function tr(item, lng, key) {
    return (item[lng] && item[lng][key]) || (item.fr && item.fr[key]) || '';
  }

  function partnerCard(p, lng) {
    const tag = TAGS[p.tag] || TAGS.int;
    const name = tr(p, lng, 'name');
    const art = el('article', 'partner-card');

    const visual = el('div', 'partner-visual');
    const wrap = el('div', 'partner-logo-wrap');
    const img = el('img', 'partner-logo');
    img.src = p.logo;
    img.alt = 'Logo ' + name;
    img.loading = 'lazy';
    wrap.appendChild(img);
    visual.append(wrap, el('span', 'partner-tag' + (tag.style ? ' partner-tag--' + tag.style : ''), tag[lng]));

    const body = el('div', 'partner-body');
    body.append(el('h3', '', name), el('p', '', tr(p, lng, 'desc')));
    art.append(visual, body);
    return art;
  }

  function testiCard(t, lng) {
    const art = el('article', 'testi-card');
    const who = el('div', 'testi-who');
    const avatar = el('div', 'testi-avatar', t.initials);
    avatar.setAttribute('aria-hidden', 'true');
    const id = el('div');
    id.append(el('div', 'testi-name', tr(t, lng, 'name')), el('div', 'testi-role', tr(t, lng, 'role')));
    who.append(avatar, id);
    art.append(el('p', 'testi-quote', tr(t, lng, 'quote')), who);
    return art;
  }

  function render() {
    const lng = lang();
    if (typeof PARTNERS !== 'undefined') {
      document.querySelectorAll('[data-partners]').forEach(function (box) {
        box.replaceChildren.apply(box, PARTNERS.map(function (p) { return partnerCard(p, lng); }));
      });
    }
    if (typeof TESTIMONIALS !== 'undefined') {
      document.querySelectorAll('[data-testimonials]').forEach(function (box) {
        box.replaceChildren.apply(box, TESTIMONIALS.map(function (t) { return testiCard(t, lng); }));
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
  document.addEventListener('vc:lang', function (e) {
    current = e.detail === 'en' ? 'en' : 'fr';
    render();
  });
})();
