/* ===================================================================
   ONG VISION CITOYENNE — admin/admin-forms.js
   Fenêtre d'édition générique et préparation des photos.
   Expose window.VCForms = { open, processImage }.
   =================================================================== */

(function () {
  'use strict';

  const PHOTO_MAX_SIDE = 1600;
  const LOGO_MAX_SIDE = 600;
  const MAX_OUTPUT_BYTES = 3.5 * 1024 * 1024;

  /* ---- Accès par chemin « fr.title » (sans modifier l'objet d'origine) ---- */
  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }

  function setPath(obj, path, value) {
    const keys = path.split('.');
    const head = keys[0];
    const copy = Object.assign({}, obj);
    copy[head] = keys.length === 1 ? value : setPath(obj && typeof obj[head] === 'object' ? obj[head] : {}, keys.slice(1).join('.'), value);
    return copy;
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'text') node.textContent = attrs[k];
      else if (attrs[k] !== undefined && attrs[k] !== false) node.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  /* ---- Préparation d'une photo : rotation, redimensionnement, sans EXIF ---- */
  function slugify(name) {
    return name.replace(/\.[^.]+$/, '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'photo';
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (b) { b ? resolve(b) : reject(new Error('encode')); }, type, quality);
    });
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve, reject) {
      const r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  // Le ré-encodage par <canvas> supprime les métadonnées (EXIF, GPS)
  async function processImage(file, kind) {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      throw new Error('Format non pris en charge : envoyez une photo JPG, PNG ou WebP.');
    }
    let bitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch (e) {
      throw new Error('Cette photo ne peut pas être lue. Essayez une autre photo (JPG ou PNG).');
    }
    const max = kind === 'logo' ? LOGO_MAX_SIDE : PHOTO_MAX_SIDE;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const keepAlpha = kind === 'logo' && file.type !== 'image/jpeg';
    const type = keepAlpha ? 'image/png' : 'image/jpeg';
    let quality = 0.85;
    let blob = await canvasToBlob(canvas, type, quality);
    while (!keepAlpha && blob.size > MAX_OUTPUT_BYTES && quality > 0.5) {
      quality -= 0.1;
      blob = await canvasToBlob(canvas, type, quality);
    }
    if (blob.size > MAX_OUTPUT_BYTES) throw new Error('Image trop lourde, même après réduction.');

    const dataUrl = await blobToDataUrl(blob);
    return {
      name: slugify(file.name) + '-' + Date.now().toString(36) + (keepAlpha ? '.png' : '.jpg'),
      data: dataUrl.split(',')[1],
      dataUrl: dataUrl
    };
  }

  /* ---- Construction des champs ---- */
  let fieldSeq = 0;

  function buildField(f, value, ctx) {
    const id = 'f' + (++fieldSeq);
    const help = f.help ? el('span', { class: 'field-help', text: f.help }) : null;
    const label = el('label', { for: id, text: f.label + (f.required ? ' *' : '') });
    let input;

    if (f.type === 'select') {
      input = el('select', { id: id, required: !!f.required });
      // Une valeur existante absente de la liste est gardée telle quelle
      const known = f.options.some(function (o) { return o[0] === value; });
      const options = value && !known ? [[value, value]].concat(f.options) : f.options;
      options.forEach(function (o) {
        const opt = el('option', { value: o[0], text: o[1] });
        if (o[0] === value) opt.selected = true;
        input.appendChild(opt);
      });
    } else if (f.type === 'textarea' || f.type === 'paras') {
      input = el('textarea', { id: id, required: !!f.required, maxlength: f.max });
      input.value = f.type === 'paras' ? (value || []).join('\n\n') : (value || '');
    } else if (f.type === 'image') {
      return buildImageField(f, value, ctx, id, label, help);
    } else {
      input = el('input', { id: id, type: 'text', required: !!f.required, maxlength: f.max, placeholder: f.placeholder, pattern: f.pattern });
      input.value = value || '';
    }

    ctx.readers.push(function (item) {
      let v = input.value.trim();
      if (f.type === 'paras') v = v.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
      return setPath(item, f.key, v);
    });
    return el('div', { class: 'field' }, [label, input, help]);
  }

  function buildImageField(f, value, ctx, id, label, help) {
    let current = value || '';
    const preview = el('img', { class: 'image-preview' + (f.kind === 'logo' ? ' logo' : ''), alt: '' });
    preview.src = current ? ctx.previewSrc(f, current) : '';
    preview.hidden = !current;
    const input = el('input', { id: id, type: 'file', accept: 'image/jpeg,image/png,image/webp' });
    const pick = el('label', { class: 'btn btn-outline btn-sm image-pick', for: id }, [
      document.createTextNode(current ? 'Changer la photo' : 'Choisir une photo'), input
    ]);
    const status = el('span', { class: 'field-help' });

    input.addEventListener('change', async function () {
      const file = input.files && input.files[0];
      if (!file) return;
      status.textContent = 'Préparation de la photo…';
      try {
        const img = await processImage(file, f.kind);
        const path = f.folder + img.name;
        ctx.onImage(path, img);
        current = f.store === 'filename' ? img.name : path;
        preview.src = img.dataUrl;
        preview.hidden = false;
        status.textContent = 'Photo prête (' + Math.round(img.data.length * 0.75 / 1024) + ' Ko).';
      } catch (e) {
        status.textContent = e.message;
      }
      input.value = '';
    });

    ctx.readers.push(function (item) {
      if (f.required && !current) throw new Error('Ajoutez une photo.');
      return setPath(item, f.key, current);
    });
    ctx.focusables.push(input);
    const warn = f.kind === 'logo' ? null : el('p', { class: 'child-warning', text: "Avant d'envoyer : floutez les visages d'enfants reconnaissables et n'utilisez pas de photos avec filigrane." });
    return el('div', { class: 'field' }, [label, el('div', { class: 'image-field' }, [preview, pick]), status, help, warn]);
  }

  function buildFields(fields, item, ctx) {
    return fields.map(function (f) {
      if (f.type === 'group') {
        return el('fieldset', { class: 'lang-block' }, [el('legend', { text: f.legend })].concat(buildFields(f.fields, item, ctx)));
      }
      if (f.type === 'row') return el('div', { class: 'field-row' }, buildFields(f.fields, item, ctx));
      return buildField(f, getPath(item, f.key), ctx);
    });
  }

  /* ---- Ouverture de la fenêtre : renvoie l'élément modifié, ou null ---- */
  function open(spec, item, hooks) {
    const dialog = document.getElementById('editDialog');
    const form = document.getElementById('editForm');
    const box = document.getElementById('editFields');
    const msg = document.getElementById('editMsg');
    const ctx = { readers: [], focusables: [], previewSrc: hooks.previewSrc, onImage: hooks.onImage };

    document.getElementById('editTitle').textContent = spec.title;
    msg.textContent = '';
    box.replaceChildren.apply(box, buildFields(spec.fields, item, ctx));

    return new Promise(function (resolve) {
      function close(result) {
        form.removeEventListener('submit', onSubmit);
        cancel.removeEventListener('click', onCancel);
        dialog.removeEventListener('cancel', onCancel);
        dialog.close();
        resolve(result);
      }
      function onSubmit(e) {
        e.preventDefault();
        try {
          const result = ctx.readers.reduce(function (acc, read) { return read(acc); }, item);
          close(result);
        } catch (err) {
          msg.textContent = err.message;
        }
      }
      function onCancel(e) {
        if (e) e.preventDefault();
        close(null);
      }
      const cancel = document.getElementById('editCancel');
      form.addEventListener('submit', onSubmit);
      cancel.addEventListener('click', onCancel);
      dialog.addEventListener('cancel', onCancel);
      dialog.showModal();
    });
  }

  window.VCForms = { open: open, processImage: processImage };
})();
