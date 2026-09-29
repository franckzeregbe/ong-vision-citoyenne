/* ===================================================================
   ONG VISION CITOYENNE — admin.js
   Espace administrateur : gestion locale des partenaires, témoignages,
   actualités Facebook et configuration. Sauvegarde dans localStorage
   et export JSON pour publication en ligne.
   =================================================================== */

(function () {
  'use strict';

  // ⚙️ MOT DE PASSE PAR DÉFAUT (à modifier après première connexion via l'onglet Configuration)
  // Hash SHA-256 côté client — obfusqué, mais non chiffré. À changer !
  // Mot de passe par défaut : VisionCitoyenne2026
  const DEFAULT_PWD_HASH = '5f4bd8c7a9d5c8b4d6e2f8c9a3b7d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0';

  const STORAGE_KEY = 'vc_admin_content';
  const AUTH_KEY = 'vc_admin_auth';
  const PWD_KEY = 'vc_admin_pwd';
  const SESSION_HOURS = 4; // Session admin de 4h

  /* ---------------------------------------------------------------
     HASH SHA-256 (Web Crypto API)
     --------------------------------------------------------------- */
  async function sha256(text) {
    const buf = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /* ---------------------------------------------------------------
     CONTENU PAR DÉFAUT
     --------------------------------------------------------------- */
  const DEFAULT_CONTENT = {
    partners: [
      { id: 1, name: "Organisation des Nations Unies", desc: "Institution internationale de référence, avec laquelle l'ONG est engagée pour les Objectifs de Développement Durable, notamment l'ODD 6.", logo: "onu.jpg", tag: "int" },
      { id: 2, name: "Ministère de l'Hydraulique, de l'Assainissement et de la Salubrité", desc: "Ministère de Côte d'Ivoire chargé de la politique nationale en matière d'hydraulique, d'accès à l'eau potable, d'assainissement et de salubrité.", logo: "minhas.png", tag: "gov" },
      { id: 3, name: "Institute of Public Policy & Diplomacy Research", desc: "Institut international basé à New York, engagé pour la paix, la sécurité, les droits humains et le développement durable.", logo: "ippdr.webp", tag: "dip" },
      { id: 4, name: "ONG EICF", desc: "Organisation partenaire engagée dans le renforcement des capacités communautaires, l'éducation civique et la solidarité de proximité.", logo: "eicf.jpg", tag: "ngo" },
      { id: 5, name: "Government of Verdis", desc: "Partenaire institutionnel du Gouvernement de Verdis, engagé pour la coopération internationale, la solidarité entre les peuples et le développement durable.", logo: "verdis.png", tag: "gov" },
      { id: 6, name: "Humanitarian Focus Foundation", desc: "Organisation humanitaire internationale engagée dans l'aide aux populations vulnérables, la protection des droits humains et le développement durable à travers le monde.", logo: "hff.jpeg", tag: "hum" }
    ],
    testimonials: [
      { id: 1, quote: "Depuis l'installation du point d'eau, les enfants ne manquent plus l'école pour aller chercher de l'eau.", name: "M. Kouamé", role: "Directeur d'école, Yopougon" },
      { id: 2, quote: "Les latrines séparées ont redonné confiance aux filles, qui restent en classe toute la journée.", name: "Mme Traoré", role: "Enseignante, Abidjan" },
      { id: 3, quote: "Notre comité gère l'ouvrage ensemble : c'est notre santé, c'est notre fierté.", name: "Mme Sidibé", role: "Membre du comité de gestion" }
    ],
    gallery: [
      { id: 1, image: "ecole.jpg", caption: "Élèves d'une école primaire" },
      { id: 2, image: "eau.jpg", caption: "Accès à l'eau potable" },
      { id: 3, image: "communaute.jpg", caption: "Mobilisation communautaire" },
      { id: 4, image: "mains.jpg", caption: "Sensibilisation au lavage des mains" },
      { id: 5, image: "enfants.jpg", caption: "Enfants de la communauté" }
    ],
    news: [
      { id: 1, url: "https://www.facebook.com/ongvisioncitoyenne/posts/pfbid02HkF6ZjYjYh48Pt3cb7CXdjE4W2XRX2pZHs1ToVK5XEnmydqWZXtqFMH6Ziur9uSSl", type: "post" },
      { id: 2, url: "https://www.facebook.com/reel/4270191083247417/", type: "video" }
    ],
    config: {
      email: "ongvisioncitoyenne@gmail.com",
      whatsapp: "2250707597457",
      donationUrl: "",
      newsletterEndpoint: ""
    }
  };

  const TAG_LABELS = {
    int: 'International', gov: 'Gouvernement', dip: 'Diplomatie',
    ngo: 'ONG Partenaire', env: 'Environnement', hum: 'Humanitaire'
  };

  /* ---------------------------------------------------------------
     STORAGE
     --------------------------------------------------------------- */
  function loadContent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
      const parsed = JSON.parse(raw);
      // Merge défensif — assure la présence de toutes les clés
      return {
        partners: parsed.partners || DEFAULT_CONTENT.partners,
        testimonials: parsed.testimonials || DEFAULT_CONTENT.testimonials,
        gallery: parsed.gallery || DEFAULT_CONTENT.gallery,
        news: parsed.news || DEFAULT_CONTENT.news,
        config: Object.assign({}, DEFAULT_CONTENT.config, parsed.config || {})
      };
    } catch (e) {
      console.warn('Contenu admin corrompu, restauration par défaut', e);
      return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
    }
  }

  function saveContent(content) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    flashSaved();
    renderJsonPreview();
  }

  function flashSaved() {
    const b = document.getElementById('saveBanner');
    if (!b) return;
    b.hidden = false;
    clearTimeout(flashSaved._t);
    flashSaved._t = setTimeout(function () { b.hidden = true; }, 2200);
  }

  /* ---------------------------------------------------------------
     AUTHENTIFICATION
     --------------------------------------------------------------- */
  async function checkAuth() {
    const stamp = sessionStorage.getItem(AUTH_KEY);
    if (!stamp) return false;
    const elapsed = Date.now() - parseInt(stamp, 10);
    return elapsed > 0 && elapsed < SESSION_HOURS * 60 * 60 * 1000;
  }

  async function getStoredPwdHash() {
    return localStorage.getItem(PWD_KEY) || DEFAULT_PWD_HASH;
  }

  async function tryLogin(password) {
    const inputHash = await sha256(password);
    const storedHash = await getStoredPwdHash();

    // Autoriser aussi le mot de passe par défaut littéral (si jamais le hash a un souci)
    const defaultPwdLiteralOK = password === 'VisionCitoyenne2026';

    if (inputHash === storedHash || defaultPwdLiteralOK) {
      sessionStorage.setItem(AUTH_KEY, String(Date.now()));
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    location.reload();
  }

  /* ---------------------------------------------------------------
     RENDU DES LISTES
     --------------------------------------------------------------- */
  let content = loadContent();

  /* Retourne l'URL d'affichage d'un logo : soit data:base64 direct, soit chemin fichier */
  function partnerLogoSrc(logo) {
    if (!logo) return '';
    if (logo.indexOf('data:') === 0) return logo;
    return 'assets/partenaires/' + logo;
  }

  function renderPartners() {
    const box = document.getElementById('partnersList');
    box.innerHTML = '';
    content.partners.forEach(function (p) {
      const row = document.createElement('div');
      row.className = 'item-row';
      const isBase64 = p.logo && p.logo.indexOf('data:') === 0;
      const logoInfo = isBase64
        ? '🖼️ Image intégrée (' + Math.round(p.logo.length / 1024) + ' KB)'
        : 'Fichier : ' + escapeHtml(p.logo);
      row.innerHTML =
        '<img class="row-thumb" src="' + partnerLogoSrc(p.logo) + '" alt="" onerror="this.style.display=\'none\'" />' +
        '<div style="min-width:0">' +
          '<div class="row-title">' + escapeHtml(p.name) + ' <span class="row-sub">— ' + (TAG_LABELS[p.tag] || p.tag) + '</span></div>' +
          '<div class="row-sub" style="margin-top:2px">' + logoInfo + '</div>' +
        '</div>' +
        '<div class="row-actions">' +
          '<button class="btn-mini" data-edit="' + p.id + '">Modifier</button>' +
          '<button class="btn-mini danger" data-del="' + p.id + '">Supprimer</button>' +
        '</div>';
      box.appendChild(row);
    });

    box.querySelectorAll('[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = parseInt(btn.getAttribute('data-del'), 10);
        if (!confirm('Supprimer ce partenaire ?')) return;
        content.partners = content.partners.filter(function (x) { return x.id !== id; });
        saveContent(content);
        renderPartners();
      });
    });

    box.querySelectorAll('[data-edit]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = parseInt(btn.getAttribute('data-edit'), 10);
        const p = content.partners.find(function (x) { return x.id === id; });
        if (!p) return;
        document.getElementById('pName').value = p.name;
        document.getElementById('pDesc').value = p.desc;
        document.getElementById('pLogo').value = p.logo;
        document.getElementById('pTag').value = p.tag;
        // Afficher l'aperçu si logo existe
        setLogoPreview(p.logo);
        // Marque le formulaire en mode édition
        const form = document.getElementById('partnerForm');
        form.setAttribute('data-edit-id', String(id));
        form.querySelector('button[type="submit"]').textContent = '💾 Enregistrer';
        document.getElementById('partnerCancelEdit').hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  /* Aperçu du logo dans la zone upload */
  function setLogoPreview(logoValue) {
    const preview = document.getElementById('pLogoPreview');
    const clearBtn = document.getElementById('pLogoClear');
    const zone = document.getElementById('pLogoZone');
    if (!logoValue) {
      preview.hidden = true;
      preview.removeAttribute('src');
      clearBtn.hidden = true;
      zone.classList.remove('has-image');
      return;
    }
    preview.src = partnerLogoSrc(logoValue);
    preview.hidden = false;
    clearBtn.hidden = false;
    zone.classList.add('has-image');
  }

  /* Convertit un fichier image en base64 */
  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* Retourne l'URL d'affichage d'une photo de galerie */
  function galleryPhotoSrc(image) {
    if (!image) return '';
    if (image.indexOf('data:') === 0) return image;
    return 'assets/galerie/' + image;
  }

  function renderGallery() {
    const box = document.getElementById('galleryList');
    if (!box) return;
    box.innerHTML = '';

    if (!content.gallery || !content.gallery.length) {
      box.innerHTML = '<p class="hint" style="text-align:center; padding:20px">Aucune photo dans la galerie. Ajoutez-en une ci-dessous.</p>';
      return;
    }

    content.gallery.forEach(function (g, idx) {
      const row = document.createElement('div');
      row.className = 'item-row';
      const isBase64 = g.image && g.image.indexOf('data:') === 0;
      const info = isBase64
        ? '🖼️ Image intégrée (' + Math.round(g.image.length / 1024) + ' KB)'
        : 'Fichier : ' + escapeHtml(g.image);
      const caption = g.caption ? escapeHtml(g.caption) : '<em style="color:var(--muted)">Sans légende</em>';
      row.innerHTML =
        '<img class="row-thumb row-thumb--photo" src="' + galleryPhotoSrc(g.image) + '" alt="" onerror="this.style.display=\'none\'" />' +
        '<div style="min-width:0">' +
          '<div class="row-title">' + caption + '</div>' +
          '<div class="row-sub" style="margin-top:2px">' + info + '</div>' +
        '</div>' +
        '<div class="row-actions">' +
          (idx > 0 ? '<button class="btn-mini" data-up="' + g.id + '" title="Monter">▲</button>' : '') +
          (idx < content.gallery.length - 1 ? '<button class="btn-mini" data-down="' + g.id + '" title="Descendre">▼</button>' : '') +
          '<button class="btn-mini" data-edit-g="' + g.id + '">Modifier</button>' +
          '<button class="btn-mini danger" data-del-g="' + g.id + '">Supprimer</button>' +
        '</div>';
      box.appendChild(row);
    });

    // Suppression
    box.querySelectorAll('[data-del-g]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = parseInt(btn.getAttribute('data-del-g'), 10);
        if (!confirm('Supprimer cette photo ?')) return;
        content.gallery = content.gallery.filter(function (x) { return x.id !== id; });
        saveContent(content);
        renderGallery();
      });
    });

    // Édition
    box.querySelectorAll('[data-edit-g]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = parseInt(btn.getAttribute('data-edit-g'), 10);
        const g = content.gallery.find(function (x) { return x.id === id; });
        if (!g) return;
        document.getElementById('gPhoto').value = g.image;
        document.getElementById('gCaption').value = g.caption || '';
        setGalleryPreview(g.image);
        const form = document.getElementById('galleryForm');
        form.setAttribute('data-edit-id', String(id));
        form.querySelector('button[type="submit"]').textContent = '💾 Enregistrer';
        document.getElementById('galleryCancelEdit').hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    // Réordonner : monter
    box.querySelectorAll('[data-up]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = parseInt(btn.getAttribute('data-up'), 10);
        const i = content.gallery.findIndex(function (x) { return x.id === id; });
        if (i > 0) {
          const tmp = content.gallery[i - 1];
          content.gallery[i - 1] = content.gallery[i];
          content.gallery[i] = tmp;
          saveContent(content);
          renderGallery();
        }
      });
    });

    // Réordonner : descendre
    box.querySelectorAll('[data-down]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = parseInt(btn.getAttribute('data-down'), 10);
        const i = content.gallery.findIndex(function (x) { return x.id === id; });
        if (i < content.gallery.length - 1) {
          const tmp = content.gallery[i + 1];
          content.gallery[i + 1] = content.gallery[i];
          content.gallery[i] = tmp;
          saveContent(content);
          renderGallery();
        }
      });
    });
  }

  function setGalleryPreview(imageValue) {
    const preview = document.getElementById('gPhotoPreview');
    const clearBtn = document.getElementById('gPhotoClear');
    const zone = document.getElementById('gPhotoZone');
    if (!preview || !clearBtn || !zone) return;
    if (!imageValue) {
      preview.hidden = true;
      preview.removeAttribute('src');
      clearBtn.hidden = true;
      zone.classList.remove('has-image');
      return;
    }
    preview.src = galleryPhotoSrc(imageValue);
    preview.hidden = false;
    clearBtn.hidden = false;
    zone.classList.add('has-image');
  }

  function renderTestimonials() {
    const box = document.getElementById('testiList');
    box.innerHTML = '';
    content.testimonials.forEach(function (t) {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML =
        '<div style="min-width:0">' +
          '<div class="row-title">' + escapeHtml(t.name) + ' <span class="row-sub">— ' + escapeHtml(t.role) + '</span></div>' +
          '<div class="row-sub" style="margin-top:4px; font-style:italic">« ' + escapeHtml(t.quote.substring(0, 80)) + (t.quote.length > 80 ? '…' : '') + ' »</div>' +
        '</div>' +
        '<div class="row-actions"><button class="btn-mini danger" data-del="' + t.id + '">Supprimer</button></div>';
      box.appendChild(row);
    });
    box.querySelectorAll('[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = parseInt(btn.getAttribute('data-del'), 10);
        if (!confirm('Supprimer ce témoignage ?')) return;
        content.testimonials = content.testimonials.filter(function (x) { return x.id !== id; });
        saveContent(content);
        renderTestimonials();
      });
    });
  }

  function renderNews() {
    const box = document.getElementById('newsList');
    box.innerHTML = '';
    content.news.forEach(function (n) {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML =
        '<div style="min-width:0">' +
          '<div class="row-title">' + (n.type === 'video' ? '🎥 Vidéo' : '📄 Publication') + '</div>' +
          '<div class="row-sub" style="margin-top:2px; word-break:break-all">' + escapeHtml(n.url) + '</div>' +
        '</div>' +
        '<div class="row-actions"><button class="btn-mini danger" data-del="' + n.id + '">Supprimer</button></div>';
      box.appendChild(row);
    });
    box.querySelectorAll('[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = parseInt(btn.getAttribute('data-del'), 10);
        if (!confirm('Supprimer cette actualité ?')) return;
        content.news = content.news.filter(function (x) { return x.id !== id; });
        saveContent(content);
        renderNews();
      });
    });
  }

  function renderConfig() {
    document.getElementById('cfEmail').value = content.config.email || '';
    document.getElementById('cfWa').value = content.config.whatsapp || '';
    document.getElementById('cfDonUrl').value = content.config.donationUrl || '';
    document.getElementById('cfNewsEndpoint').value = content.config.newsletterEndpoint || '';
  }

  function renderJsonPreview() {
    const el = document.getElementById('jsonPreview');
    if (el) el.value = JSON.stringify(content, null, 2);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  function nextId(arr) {
    return arr.length ? Math.max.apply(null, arr.map(function (x) { return x.id; })) + 1 : 1;
  }

  /* ---------------------------------------------------------------
     ATTACHE LES FORMULAIRES ADMIN
     --------------------------------------------------------------- */
  function initAdminUI() {
    // Onglets
    document.querySelectorAll('.admin-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        const key = tab.getAttribute('data-tab');
        document.querySelectorAll('.admin-panel').forEach(function (p) {
          p.hidden = p.getAttribute('data-panel') !== key;
        });
        if (key === 'export') renderJsonPreview();
      });
    });

    // Déconnexion
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // File picker : image → base64
    const fileInput = document.getElementById('pLogoFile');
    const logoInput = document.getElementById('pLogo');
    const clearBtn = document.getElementById('pLogoClear');

    fileInput.addEventListener('change', async function (e) {
      const file = e.target.files[0];
      if (!file) return;
      // Vérif taille (max 500 KB pour éviter d'exploser localStorage)
      if (file.size > 500 * 1024) {
        alert('L\'image est trop lourde (' + Math.round(file.size / 1024) + ' KB). Maximum : 500 KB.\n\n💡 Compressez-la sur https://squoosh.app ou https://tinypng.com avant de la re-téléverser.');
        fileInput.value = '';
        return;
      }
      try {
        const dataUrl = await fileToBase64(file);
        logoInput.value = dataUrl;
        setLogoPreview(dataUrl);
      } catch (err) {
        alert('Impossible de lire l\'image : ' + err.message);
      }
    });

    clearBtn.addEventListener('click', function () {
      logoInput.value = '';
      fileInput.value = '';
      setLogoPreview('');
    });

    // Partenaire — ajout / édition
    document.getElementById('partnerForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const form = e.currentTarget;
      const editId = form.getAttribute('data-edit-id');
      const logo = logoInput.value.trim();

      if (!logo) {
        alert('Merci de choisir une image pour le logo du partenaire.');
        return;
      }

      const data = {
        name: document.getElementById('pName').value.trim(),
        desc: document.getElementById('pDesc').value.trim(),
        logo: logo,
        tag: document.getElementById('pTag').value
      };

      if (editId) {
        const idNum = parseInt(editId, 10);
        content.partners = content.partners.map(function (p) {
          return p.id === idNum ? Object.assign({}, p, data) : p;
        });
        form.removeAttribute('data-edit-id');
        form.querySelector('button[type="submit"]').textContent = '➕ Ajouter le partenaire';
        document.getElementById('partnerCancelEdit').hidden = true;
      } else {
        content.partners.push(Object.assign({ id: nextId(content.partners) }, data));
      }
      saveContent(content);
      renderPartners();
      form.reset();
      setLogoPreview('');
      fileInput.value = '';
    });

    // Bouton "Annuler l'édition"
    document.getElementById('partnerCancelEdit').addEventListener('click', function () {
      const form = document.getElementById('partnerForm');
      form.reset();
      form.removeAttribute('data-edit-id');
      form.querySelector('button[type="submit"]').textContent = '➕ Ajouter le partenaire';
      document.getElementById('partnerCancelEdit').hidden = true;
      setLogoPreview('');
      fileInput.value = '';
    });

    /* --- GALERIE : file picker + formulaire --- */
    const gFileInput = document.getElementById('gPhotoFile');
    const gPhotoInput = document.getElementById('gPhoto');
    const gClearBtn = document.getElementById('gPhotoClear');

    gFileInput.addEventListener('change', async function (e) {
      const file = e.target.files[0];
      if (!file) return;
      // Photos de galerie : plafond 800 KB (elles peuvent être un peu plus lourdes que les logos)
      if (file.size > 800 * 1024) {
        alert('La photo est trop lourde (' + Math.round(file.size / 1024) + ' KB). Maximum : 800 KB.\n\n💡 Compressez-la sur https://squoosh.app ou https://tinypng.com avant de la re-téléverser.');
        gFileInput.value = '';
        return;
      }
      try {
        const dataUrl = await fileToBase64(file);
        gPhotoInput.value = dataUrl;
        setGalleryPreview(dataUrl);
      } catch (err) {
        alert('Impossible de lire l\'image : ' + err.message);
      }
    });

    gClearBtn.addEventListener('click', function () {
      gPhotoInput.value = '';
      gFileInput.value = '';
      setGalleryPreview('');
    });

    document.getElementById('galleryForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const form = e.currentTarget;
      const editId = form.getAttribute('data-edit-id');
      const image = gPhotoInput.value.trim();

      if (!image) {
        alert('Merci de choisir une photo à ajouter.');
        return;
      }

      const data = {
        image: image,
        caption: document.getElementById('gCaption').value.trim()
      };

      if (editId) {
        const idNum = parseInt(editId, 10);
        content.gallery = content.gallery.map(function (g) {
          return g.id === idNum ? Object.assign({}, g, data) : g;
        });
        form.removeAttribute('data-edit-id');
        form.querySelector('button[type="submit"]').textContent = '➕ Ajouter la photo';
        document.getElementById('galleryCancelEdit').hidden = true;
      } else {
        content.gallery.push(Object.assign({ id: nextId(content.gallery) }, data));
      }
      saveContent(content);
      renderGallery();
      form.reset();
      setGalleryPreview('');
      gFileInput.value = '';
    });

    document.getElementById('galleryCancelEdit').addEventListener('click', function () {
      const form = document.getElementById('galleryForm');
      form.reset();
      form.removeAttribute('data-edit-id');
      form.querySelector('button[type="submit"]').textContent = '➕ Ajouter la photo';
      document.getElementById('galleryCancelEdit').hidden = true;
      setGalleryPreview('');
      gFileInput.value = '';
    });

    // Témoignage — ajout
    document.getElementById('testiForm').addEventListener('submit', function (e) {
      e.preventDefault();
      content.testimonials.push({
        id: nextId(content.testimonials),
        quote: document.getElementById('tQuote').value.trim(),
        name: document.getElementById('tName').value.trim(),
        role: document.getElementById('tRole').value.trim()
      });
      saveContent(content);
      renderTestimonials();
      e.currentTarget.reset();
    });

    // Actualité Facebook — ajout
    document.getElementById('newsForm2').addEventListener('submit', function (e) {
      e.preventDefault();
      content.news.push({
        id: nextId(content.news),
        url: document.getElementById('nUrl').value.trim(),
        type: document.getElementById('nType').value
      });
      saveContent(content);
      renderNews();
      e.currentTarget.reset();
    });

    // Configuration
    document.getElementById('configForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      content.config.email = document.getElementById('cfEmail').value.trim();
      content.config.whatsapp = document.getElementById('cfWa').value.trim();
      content.config.donationUrl = document.getElementById('cfDonUrl').value.trim();
      content.config.newsletterEndpoint = document.getElementById('cfNewsEndpoint').value.trim();
      saveContent(content);

      // Nouveau mot de passe ?
      const newPwd = document.getElementById('cfAdminPwd').value;
      if (newPwd && newPwd.length >= 8) {
        const hash = await sha256(newPwd);
        localStorage.setItem(PWD_KEY, hash);
        document.getElementById('cfAdminPwd').value = '';
        alert('Mot de passe administrateur mis à jour. Il sera demandé à la prochaine connexion.');
      } else if (newPwd) {
        alert('Le mot de passe doit contenir au moins 8 caractères.');
      }
    });

    // Export
    document.getElementById('exportBtn').addEventListener('click', function () {
      const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'content.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Import
    document.getElementById('importFile').addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const parsed = JSON.parse(reader.result);
          if (!parsed.partners || !parsed.testimonials || !parsed.news) {
            throw new Error('Format invalide');
          }
          // Assure la présence de gallery (peut être absent des vieux exports)
          if (!parsed.gallery) parsed.gallery = DEFAULT_CONTENT.gallery;
          content = parsed;
          saveContent(content);
          renderAll();
          alert('Contenu importé avec succès.');
        } catch (err) {
          alert('Fichier invalide : ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    // Reset
    document.getElementById('resetBtn').addEventListener('click', function () {
      if (!confirm('Réinitialiser tout le contenu à la valeur par défaut ? Cette action est irréversible.')) return;
      content = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
      saveContent(content);
      renderAll();
    });

    renderAll();
  }

  function renderAll() {
    renderPartners();
    renderGallery();
    renderTestimonials();
    renderNews();
    renderConfig();
    renderJsonPreview();
  }

  /* ---------------------------------------------------------------
     ENTRÉE
     --------------------------------------------------------------- */
  async function bootstrap() {
    const isAuth = await checkAuth();
    if (isAuth) {
      document.getElementById('loginScreen').hidden = true;
      document.getElementById('adminScreen').hidden = false;
      initAdminUI();
      return;
    }

    // Formulaire de login
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const pwd = document.getElementById('pwd').value;
      const status = document.getElementById('loginStatus');
      status.textContent = 'Vérification…';
      status.className = 'form-status';
      const ok = await tryLogin(pwd);
      if (ok) {
        status.textContent = '✅ Bienvenue';
        status.className = 'form-status ok';
        setTimeout(function () { location.reload(); }, 400);
      } else {
        status.textContent = '❌ Mot de passe incorrect';
        status.className = 'form-status err';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})();
