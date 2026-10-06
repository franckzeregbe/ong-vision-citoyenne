/* ===================================================================
   ONG VISION CITOYENNE — admin/admin-messages.js
   Onglet « Messages » : formulaires reçus (base de données Hostinger).
   =================================================================== */

(function () {
  'use strict';

  const KIND_LABELS = { contact: 'Contact', benevole: 'Bénévole', newsletter: 'Newsletter' };
  const list = document.getElementById('list-messages');
  let kind = '';
  let loaded = false;

  function api(action, body) { return window.VCAdmin.api(action, body); }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function button(text, onClick, danger) {
    const b = el('button', 'btn-mini' + (danger ? ' danger' : ''), text);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  }

  function formatDate(sql) {
    const d = new Date(sql.replace(' ', 'T'));
    return isNaN(d) ? sql : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(d);
  }

  function link(href, text) {
    const a = el('a', '', text);
    a.href = href;
    return a;
  }

  function row(m) {
    const box = el('article', 'msg-row' + (m.read_at ? '' : ' unread'));
    const head = el('div', 'msg-head');
    head.append(el('span', 'msg-kind ' + m.kind, KIND_LABELS[m.kind] || m.kind), el('span', 'msg-date', formatDate(m.created_at)));

    const who = el('p', 'msg-who');
    if (m.name) who.append(el('strong', '', m.name), document.createTextNode(' · '));
    who.appendChild(link('mailto:' + m.email, m.email));
    if (m.phone) who.append(document.createTextNode(' · '), link('tel:' + m.phone.replace(/[^0-9+]/g, ''), m.phone));

    box.append(head, who);
    if (m.message) box.appendChild(el('p', 'msg-text', m.message));

    const actions = el('div', 'row-actions');
    const subject = m.kind === 'benevole' ? 'Votre candidature bénévole — ONG Vision Citoyenne' : 'Votre message — ONG Vision Citoyenne';
    const reply = link('mailto:' + m.email + '?subject=' + encodeURIComponent(subject), 'Répondre');
    reply.className = 'btn-mini';
    actions.append(
      reply,
      button(m.read_at ? 'Marquer non lu' : 'Marquer lu', function () { update('message_read', { id: m.id, read: !m.read_at }); }),
      button('Supprimer', function () {
        if (confirm('Supprimer définitivement ce message ?')) update('message_delete', { id: m.id });
      }, true)
    );
    box.appendChild(actions);
    return box;
  }

  function updateBadges(counts) {
    const unread = Object.keys(counts).reduce(function (s, k) { return s + counts[k].unread; }, 0);
    const tab = document.querySelector('.admin-tab[data-tab="messages"]');
    const old = tab.querySelector('.badge');
    if (old) old.remove();
    if (unread) tab.appendChild(el('span', 'badge', String(unread)));
  }

  async function load() {
    list.replaceChildren(el('p', 'empty', 'Chargement…'));
    try {
      const d = await api('messages' + (kind ? '&kind=' + kind : ''));
      loaded = true;
      updateBadges(d.counts);
      if (!d.messages.length) {
        list.replaceChildren(el('p', 'empty', 'Aucun message pour le moment.'));
        return;
      }
      list.replaceChildren.apply(list, d.messages.map(row));
    } catch (e) {
      list.replaceChildren(el('p', 'empty', e.message));
    }
  }

  async function update(action, body) {
    try {
      await api(action, body);
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  document.querySelectorAll('.msg-filters [data-kind]').forEach(function (b) {
    b.addEventListener('click', function () {
      kind = b.dataset.kind;
      document.querySelectorAll('.msg-filters [data-kind]').forEach(function (x) { x.classList.toggle('active', x === b); });
      load();
    });
  });
  document.getElementById('msgRefresh').addEventListener('click', load);
  document.addEventListener('vcadmin:tab', function (e) {
    if (e.detail === 'messages') load();
  });
  // Pastille du nombre de messages non lus dès l'arrivée dans l'admin
  document.addEventListener('vcadmin:ready', function () { if (!loaded) load(); });
})();
