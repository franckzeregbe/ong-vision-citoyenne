/* ===================================================================
   ONG VISION CITOYENNE — admin/admin.js
   Espace admin : connexion, listes, édition et publication.
   Les modifications restent en attente dans la page jusqu'au clic sur
   « Publier sur le site » : api.php les enregistre alors sur GitHub,
   puis Hostinger met le site à jour.
   =================================================================== */

(function () {
  'use strict';

  const $ = function (id) { return document.getElementById(id); };

  const NEWS_CATS = [['annonce', 'Annonce'], ['evenement', 'Événement'], ['don', 'Don'],
    ['chantier', 'Chantier'], ['projet', 'Projet'], ['sensibilisation', 'Sensibilisation']];
  const GALLERY_CATS = [['ceremonie', 'EPP SICOGI 1 — Inauguration'], ['apres', 'EPP SICOGI 1 — Après travaux'],
    ['travaux', 'EPP SICOGI 1 — Pendant les travaux'], ['avant', 'EPP SICOGI 1 — Avant travaux'],
    ['pasea-lancement', 'PASEA — Lancement'], ['pasea-form', 'PASEA — Formation'],
    ['pasea-mob', 'PASEA — Mobilisation'], ['pasea-chantier', 'PASEA — Chantiers'],
    ['don', 'Dons'], ['sensibilisation', 'Sensibilisation'], ['terrain', 'Terrain']];
  const PARTNER_TAGS = [['int', 'International'], ['gov', 'Gouvernement'], ['dip', 'Diplomatie'],
    ['ngo', 'ONG Partenaire'], ['env', 'Environnement'], ['hum', 'Humanitaire'], ['coop', 'Coopération']];
  const PAGE_LINKS = [['projets.html#chantier', 'Projets — Rénovation EPP SICOGI 1'], ['projets.html#pasea', 'Projets — PASEA Hambol'],
    ['actualites.html#galerie', 'Actualités — Galerie photos'], ['index.html', 'Accueil'], ['partenaires.html', 'Partenaires'],
    ['don.html', 'Faire un don'], ['contact.html', 'Contact']];
  const SECTION_NAMES = { news: 'actualités', gallery: 'galerie', partners: 'partenaires', testimonials: 'témoignages' };

  const state = {
    base: null,
    data: { news: [], gallery: [], partners: [], testimonials: [] },
    dirty: new Set(),
    images: new Map(), // chemin -> { data, dataUrl } (photos pas encore publiées)
    isNew: new WeakSet()
  };

  /* ---------------------------------------------------------------
     Appels au serveur
     --------------------------------------------------------------- */
  async function api(action, body) {
    let res;
    try {
      res = await fetch('api.php?action=' + action, {
        method: body === undefined ? 'GET' : 'POST',
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'vc-admin', 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body)
      });
    } catch (e) {
      throw new Error('Pas de connexion internet. Vérifiez le réseau puis réessayez.');
    }
    let json = null;
    try { json = await res.json(); } catch (e) { /* réponse non JSON : traitée ci-dessous */ }
    if (!json) {
      throw new Error(res.status === 200 ? "Le serveur n'exécute pas PHP (copie de secours GitHub ?)." : 'Erreur du serveur (' + res.status + ').');
    }
    if (res.status === 401 && action !== 'login') showLogin('Session expirée : reconnectez-vous.');
    if (!json.ok) throw new Error(json.error || 'Erreur inconnue.');
    return json.data || {};
  }

  /* ---------------------------------------------------------------
     Écrans
     --------------------------------------------------------------- */
  function show(id) {
    ['bootScreen', 'setupScreen', 'loginScreen', 'adminScreen'].forEach(function (s) { $(s).hidden = s !== id; });
  }

  function showLogin(message) {
    show('loginScreen');
    $('loginMsg').textContent = message || '';
    $('pwd').value = '';
    $('pwd').focus();
  }

  function banner(text, kind) {
    const b = $('banner');
    b.textContent = text;
    b.className = 'banner ' + (kind || 'ok');
    b.hidden = !text;
    if (text) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  async function boot() {
    try {
      const s = await api('status');
      if (!s.configured) { show('setupScreen'); return; }
      if (s.logged) await enterAdmin(false);
      else showLogin();
    } catch (e) {
      show('setupScreen');
      $('setupMirror').hidden = !/github\.io$/.test(location.hostname);
    }
  }

  async function enterAdmin(mustChange) {
    show('adminScreen');
    banner('Chargement du contenu…', 'warn');
    const d = await api('load');
    state.base = d.base;
    state.data = { news: d.news, gallery: d.gallery, partners: d.partners, testimonials: d.testimonials };
    state.dirty.clear();
    state.images.clear();
    renderAll();
    document.dispatchEvent(new CustomEvent('vcadmin:ready'));
    if (mustChange) {
      selectTab('settings');
      banner('Bienvenue ! Pour la sécurité, choisissez maintenant votre propre mot de passe.', 'warn');
    } else {
      banner('');
    }
  }

  /* ---------------------------------------------------------------
     Description des rubriques : liste et formulaire
     --------------------------------------------------------------- */
  function previewSrc(f, value) {
    const path = f.store === 'filename' ? 'assets/img/galerie/' + value : value;
    const pending = state.images.get(path);
    return pending ? pending.dataUrl : '../' + path;
  }

  function translations(fields) {
    return [
      { type: 'group', legend: 'Français (obligatoire)', fields: fields('fr', true) },
      { type: 'group', legend: 'English (facultatif — le français est affiché si vide)', fields: fields('en', false) }
    ];
  }

  function formatDate(iso) {
    const p = iso.split('-').map(Number);
    const opts = p[2] ? { day: 'numeric', month: 'long', year: 'numeric' } : { month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', opts).format(new Date(p[0], p[1] - 1, p[2] || 1));
  }

  function label(list, value) {
    const found = list.find(function (o) { return o[0] === value; });
    return found ? found[1] : value;
  }

  const SECTIONS = {
    news: {
      name: 'actualité',
      blank: function () {
        const today = new Date().toISOString().slice(0, 10);
        return { date: today, cat: 'annonce', image: '', link: 'actualites.html#galerie', fr: { title: '', excerpt: '', body: [], cta: 'Voir les photos' } };
      },
      thumb: function (n) { return { src: previewSrc({}, n.image) }; },
      title: function (n) { return n.fr.title; },
      sub: function (n) { return label(NEWS_CATS, n.cat) + ' · ' + formatDate(n.date); },
      fields: function () {
        return [
          { type: 'row', fields: [
            { key: 'date', label: 'Date', type: 'text', required: true, pattern: '\\d{4}-\\d{2}(-\\d{2})?', placeholder: 'AAAA-MM-JJ', help: 'AAAA-MM-JJ, ou AAAA-MM si seul le mois est connu.' },
            { key: 'cat', label: 'Catégorie', type: 'select', options: NEWS_CATS, required: true }
          ] },
          { key: 'image', label: 'Photo', type: 'image', kind: 'photo', folder: 'assets/img/actualites/', required: true },
          { key: 'link', label: 'Bouton : vers quelle page ?', type: 'select', options: PAGE_LINKS, required: true }
        ].concat(translations(function (l, req) {
          return [
            { key: l + '.title', label: l === 'fr' ? 'Titre' : 'Title', type: 'text', max: 160, required: req },
            { key: l + '.excerpt', label: l === 'fr' ? 'Résumé (affiché sur la carte)' : 'Summary', type: 'textarea', max: 500, required: req },
            { key: l + '.body', label: l === 'fr' ? 'Texte complet' : 'Full text', type: 'paras', help: l === 'fr' ? 'Laissez une ligne vide entre deux paragraphes.' : '' },
            { key: l + '.cta', label: l === 'fr' ? 'Texte du bouton' : 'Button text', type: 'text', max: 80, required: req }
          ];
        }));
      }
    },
    gallery: {
      name: 'photo',
      toForm: function (g) { return { src: g[0], caption: g[1], cat: g[2] }; },
      fromForm: function (o) { return [o.src, o.caption, o.cat]; },
      blank: function () { return ['', '', 'terrain']; },
      thumb: function (g) { return { src: previewSrc({ store: 'filename' }, g[0]) }; },
      title: function (g) { return g[1]; },
      sub: function (g) { return label(GALLERY_CATS, g[2]); },
      fields: function () {
        return [
          { key: 'src', label: 'Photo', type: 'image', kind: 'photo', folder: 'assets/img/galerie/', store: 'filename', required: true },
          { key: 'caption', label: 'Légende', type: 'text', max: 300, required: true, placeholder: 'Ex. : Remise de kits d\'hygiène — Mai 2026' },
          { key: 'cat', label: 'Catégorie', type: 'select', options: GALLERY_CATS, required: true }
        ];
      }
    },
    partners: {
      name: 'partenaire',
      blank: function () { return { logo: '', tag: 'int', fr: { name: '', desc: '' } }; },
      thumb: function (p) { return { src: previewSrc({}, p.logo), cls: 'logo' }; },
      title: function (p) { return p.fr.name; },
      sub: function (p) { return label(PARTNER_TAGS, p.tag); },
      fields: function () {
        return [
          { key: 'logo', label: 'Logo', type: 'image', kind: 'logo', folder: 'assets/partenaires/', required: true },
          { key: 'tag', label: 'Type', type: 'select', options: PARTNER_TAGS, required: true }
        ].concat(translations(function (l, req) {
          return [
            { key: l + '.name', label: l === 'fr' ? 'Nom' : 'Name', type: 'text', max: 160, required: req },
            { key: l + '.desc', label: 'Description', type: 'textarea', max: 600, required: req }
          ];
        }));
      }
    },
    testimonials: {
      name: 'témoignage',
      blank: function () { return { initials: '', fr: { quote: '', name: '', role: '' } }; },
      thumb: function (t) { return { text: t.initials }; },
      title: function (t) { return '« ' + t.fr.quote + ' »'; },
      sub: function (t) { return t.fr.name + (t.fr.role ? ' — ' + t.fr.role : ''); },
      fields: function () {
        return [
          { key: 'initials', label: 'Initiales (rond affiché)', type: 'text', max: 3, required: true, placeholder: 'AK' }
        ].concat(translations(function (l, req) {
          return [
            { key: l + '.quote', label: l === 'fr' ? 'Témoignage' : 'Quote', type: 'textarea', max: 500, required: req },
            { type: 'row', fields: [
              { key: l + '.name', label: l === 'fr' ? 'Nom' : 'Name', type: 'text', max: 80, required: req },
              { key: l + '.role', label: l === 'fr' ? 'Fonction, lieu' : 'Role, place', type: 'text', max: 120 }
            ] }
          ];
        }));
      }
    }
  };

  /* ---------------------------------------------------------------
     Listes
     --------------------------------------------------------------- */
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function miniBtn(text, title, onClick, opts) {
    const b = el('button', 'btn-mini' + (opts && opts.danger ? ' danger' : ''), text);
    b.type = 'button';
    b.title = title;
    b.setAttribute('aria-label', title);
    b.disabled = !!(opts && opts.disabled);
    b.addEventListener('click', onClick);
    return b;
  }

  function renderList(key) {
    const sec = SECTIONS[key];
    const items = state.data[key];
    const box = $('list-' + key);
    if (!items.length) {
      box.replaceChildren(el('p', 'empty', 'Aucun élément pour le moment.'));
      return;
    }
    box.replaceChildren.apply(box, items.map(function (item, i) {
      const row = el('div', 'item-row' + (state.isNew.has(item) ? ' is-new' : ''));
      const t = sec.thumb(item);
      let thumb;
      if (t.text !== undefined) {
        thumb = el('div', 'row-thumb avatar', t.text);
      } else {
        thumb = el('img', 'row-thumb' + (t.cls ? ' ' + t.cls : ''));
        thumb.src = t.src;
        thumb.alt = '';
        thumb.loading = 'lazy';
      }
      const text = el('div', 'row-text');
      text.append(el('div', 'row-title', sec.title(item)), el('div', 'row-sub', sec.sub(item)));
      const actions = el('div', 'row-actions');
      actions.append(
        miniBtn('↑', 'Monter', function () { move(key, i, -1); }, { disabled: i === 0 }),
        miniBtn('↓', 'Descendre', function () { move(key, i, 1); }, { disabled: i === items.length - 1 }),
        miniBtn('Modifier', 'Modifier', function () { edit(key, i); }),
        miniBtn('Supprimer', 'Supprimer', function () { remove(key, i); }, { danger: true })
      );
      row.append(thumb, text, actions);
      return row;
    }));
  }

  function renderAll() {
    Object.keys(SECTIONS).forEach(renderList);
    updatePublishBar();
  }

  function updatePublishBar() {
    const n = state.dirty.size;
    $('publishBar').hidden = n === 0;
    $('pendingCount').textContent = n === 0 ? '' : 'Modifications en attente (' +
      Array.from(state.dirty).map(function (k) { return SECTION_NAMES[k]; }).join(', ') + ').';
    document.querySelectorAll('.admin-tab').forEach(function (tab) {
      const old = tab.querySelector('.dot');
      if (old) old.remove();
      if (state.dirty.has(tab.dataset.tab)) tab.appendChild(el('span', 'dot'));
    });
  }

  function commit(key, next) {
    state.data = Object.assign({}, state.data, { [key]: next });
    state.dirty.add(key);
    banner('');
    renderList(key);
    updatePublishBar();
  }

  function move(key, i, delta) {
    const next = state.data[key].slice();
    const tmp = next[i];
    next[i] = next[i + delta];
    next[i + delta] = tmp;
    commit(key, next);
  }

  function remove(key, i) {
    const sec = SECTIONS[key];
    if (!confirm('Supprimer ce ' + sec.name + ' ? (Vous pourrez encore annuler en rechargeant la page tant que rien n\'est publié.)')) return;
    commit(key, state.data[key].filter(function (_, j) { return j !== i; }));
  }

  async function edit(key, index) {
    const sec = SECTIONS[key];
    const isNew = index === null;
    const original = isNew ? sec.blank() : state.data[key][index];
    const formItem = sec.toForm ? sec.toForm(original) : original;
    const title = (isNew ? 'Nouveau ' : 'Modifier : ') + sec.name;
    const result = await window.VCForms.open({ title: title, fields: sec.fields() }, formItem, {
      previewSrc: previewSrc,
      onImage: function (path, img) { state.images.set(path, { data: img.data, dataUrl: img.dataUrl }); }
    });
    if (!result) return;
    const item = sec.fromForm ? sec.fromForm(result) : result;
    // Une traduction anglaise vide n'est pas gardée : le site affiche alors le français
    if (item.en && !Object.keys(item.en).some(function (k) { return item.en[k] && item.en[k].length; })) delete item.en;
    state.isNew.add(item);
    const list = state.data[key];
    commit(key, isNew ? [item].concat(list) : list.map(function (x, j) { return j === index ? item : x; }));
  }

  /* ---------------------------------------------------------------
     Publication
     --------------------------------------------------------------- */
  function referencedImages() {
    const used = new Set();
    state.data.news.forEach(function (n) { used.add(n.image); });
    state.data.gallery.forEach(function (g) { used.add('assets/img/galerie/' + g[0]); });
    state.data.partners.forEach(function (p) { used.add(p.logo); });
    return Array.from(state.images.keys()).filter(function (p) { return used.has(p); })
      .map(function (p) { return { path: p, data: state.images.get(p).data }; });
  }

  async function publish() {
    const btn = $('publishBtn');
    const payload = { base: state.base, images: referencedImages(), summary: Array.from(state.dirty).map(function (k) { return SECTION_NAMES[k]; }).join(', ') };
    state.dirty.forEach(function (k) {
      if (k === 'partners' || k === 'testimonials') {
        payload.partners = state.data.partners;
        payload.testimonials = state.data.testimonials;
      } else {
        payload[k] = state.data[k];
      }
    });
    btn.disabled = true;
    btn.textContent = 'Publication…';
    try {
      const res = await api('publish', payload);
      state.base = res.base;
      state.dirty.clear();
      state.images.clear();
      state.isNew = new WeakSet();
      renderAll();
      banner('Publié ! Les changements apparaissent sur ongvici.org d\'ici 1 à 2 minutes (pensez à actualiser la page). Ils sont aussi sauvegardés sur GitHub.', 'ok');
    } catch (e) {
      banner('La publication a échoué : ' + e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Publier sur le site';
    }
  }

  /* ---------------------------------------------------------------
     Onglets, connexion, mot de passe
     --------------------------------------------------------------- */
  function selectTab(name) {
    document.querySelectorAll('.admin-tab').forEach(function (t) {
      const on = t.dataset.tab === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== name; });
    document.dispatchEvent(new CustomEvent('vcadmin:tab', { detail: name }));
  }

  document.querySelectorAll('.admin-tab').forEach(function (t) {
    t.addEventListener('click', function () { selectTab(t.dataset.tab); });
  });
  document.querySelectorAll('[data-add]').forEach(function (b) {
    b.addEventListener('click', function () { edit(b.dataset.add, null); });
  });
  $('publishBtn').addEventListener('click', publish);

  $('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    $('loginMsg').textContent = '';
    try {
      const res = await api('login', { password: $('pwd').value });
      await enterAdmin(res.mustChange);
    } catch (err) {
      $('loginMsg').textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });

  $('logoutBtn').addEventListener('click', async function () {
    if (state.dirty.size && !confirm('Des modifications ne sont pas publiées et seront perdues. Se déconnecter quand même ?')) return;
    try { await api('logout', {}); } catch (e) { /* session déjà fermée côté serveur */ }
    state.dirty.clear();
    showLogin('Vous êtes déconnecté.');
  });

  $('pwdForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msg = $('pwdMsg');
    msg.className = 'form-msg';
    if ($('pwdNext').value !== $('pwdConfirm').value) {
      msg.textContent = 'Les deux nouveaux mots de passe ne sont pas identiques.';
      return;
    }
    try {
      await api('password', { current: $('pwdCurrent').value, next: $('pwdNext').value });
      e.target.reset();
      msg.className = 'form-msg ok';
      msg.textContent = 'Mot de passe enregistré. Utilisez-le à votre prochaine connexion.';
      banner('');
    } catch (err) {
      msg.textContent = err.message;
    }
  });

  window.addEventListener('beforeunload', function (e) {
    if (state.dirty.size) { e.preventDefault(); e.returnValue = ''; }
  });

  // Partagé avec admin-messages.js
  window.VCAdmin = { api: api };

  boot();
})();
