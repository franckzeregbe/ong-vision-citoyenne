/* ===================================================================
   ONG VISION CITOYENNE — main.js
   JavaScript vanilla, sans dépendance.
   Gère : menu mobile, header scrolled, année, langue FR/EN,
   sélection de don, formulaires, animations au scroll, compteurs,
   marquee, barre de progression et bouton WhatsApp.
   =================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. TRADUCTIONS
     Le FR reprend le texte exact du HTML. L'EN est une traduction
     professionnelle fidèle, adaptée à la thématique WASH.
     --------------------------------------------------------------- */
  const translations = {
    fr: {
      skip: 'Aller au contenu',
      nav_testi: 'Témoignages',
      testi_tag: 'Témoignages',
      testi_title: 'Ils nous accompagnent',
      testi_sub: "Communautés, enseignants et partenaires racontent l'impact de l'eau et de l'hygiène au quotidien.",
      testi1: "Depuis l'installation du point d'eau, les enfants ne manquent plus l'école pour aller chercher de l'eau.",
      testi1_name: 'M. Kouamé',
      testi1_role: "Directeur d'école, Yopougon",
      testi2: "Les latrines séparées ont redonné confiance aux filles, qui restent en classe toute la journée.",
      testi2_name: 'Mme Traoré',
      testi2_role: 'Enseignante, Abidjan',
      testi3: "Notre comité gère l'ouvrage ensemble : c'est notre santé, c'est notre fierté.",
      testi3_name: 'Mme Sidibé',
      testi3_role: 'Membre du comité de gestion',
      cta_title: "Ensemble, portons l'eau à tous",
      cta_sub: "Soutenez nos actions WASH ou rejoignez nos équipes de bénévoles sur le terrain.",
      cta_btn1: 'Faire un don',
      cta_btn2: 'Devenir bénévole',
      meta_desc: "ONG Vision Citoyenne - Eau, Hygiène et Assainissement en milieu scolaire et communautaire. Accès à l'eau potable, latrines dignes et promotion de l'hygiène en Côte d'Ivoire.",
      brand_sub: 'Organisation Non Gouvernementale',
      nav_home: 'Accueil',
      nav_about: 'À propos',
      nav_real: 'Projets',
      nav_actions: 'Nos actions',
      nav_news: 'Actualités',
      nav_volunteer: 'Bénévolat',
      nav_contact: 'Contact',
      nav_donate: 'Faire un don',
      nav_gal: 'Galerie',
      gal_tag: 'Galerie',
      gal_title: 'Nos photos',
      gal_sub: 'Images de nos actions et de nos partenaires sur le terrain. Cliquez sur une photo pour l\'agrandir.',
      hero_eyebrow: 'Eau, Hygiène et Assainissement',
      hero_title_1: "L'eau, l'hygiène et l'assainissement en milieu",
      hero_title_2: 'scolaire',
      hero_title_3: 'et',
      hero_title_4: 'communautaire',
      hero_lead: "L'ONG Vision Citoyenne agit pour un accès durable à l'eau potable, à des latrines dignes et à de bonnes pratiques d'hygiène dans les écoles et les communautés de Côte d'Ivoire.",
      hero_cta1: 'Soutenir nos actions',
      hero_cta2: 'Découvrir la mission',
      about_tag: 'À propos',
      about_title: 'Notre mission',
      about_sub: "Une vision claire : garantir l'eau, l'hygiène et l'assainissement pour tous, à l'école comme dans la communauté.",
      about_p1: "L'ONG Vision Citoyenne œuvre pour que chaque enfant et chaque famille dispose d'un accès sûr à l'eau potable, à des latrines dignes et aux bonnes pratiques d'hygiène. Nous croyons que l'eau et l'assainissement sont la base de la santé, de la dignité et de la réussite scolaire.",
      about_p2: "Nous construisons des points d'eau et des latrines, formons les comités de gestion et menons des campagnes de sensibilisation à l'hygiène dans les écoles et les communautés, avec transparence et proximité.",
      real_tag: 'Projets',
      real_title: 'Les projets auxquels nous avons participé',
      real_sub: 'Des engagements concrets, menés avec nos partenaires, au service de l\'eau, de l\'hygiène et de l\'assainissement.',
      real1_t: 'Participation au projet PASEA',
      real1_d: "L'ONG Vision Citoyenne a participé au projet PASEA.",
      real2_t: "Reconnue à l'ONU",
      real2_d: "L'ONG Vision Citoyenne est reconnue à l'ONU.",
      nav_partners: 'Partenaires',
      partners_tag: 'Partenaires',
      partners_title: 'Nos partenaires',
      partners_sub: "L'ONG Vision Citoyenne agit aux côtés d'institutions nationales et internationales, engagées pour l'eau, l'hygiène et l'assainissement.",
      partner1_t: 'Organisation des Nations Unies',
      partner1_d: "Institution internationale de référence, avec laquelle l'ONG est engagée pour les Objectifs de Développement Durable, notamment l'ODD 6.",
      partner2_t: "Ministère de l'Hydraulique, de l'Assainissement et de la Salubrité",
      partner2_d: "Ministère de Côte d'Ivoire chargé de la politique nationale en matière d'hydraulique, d'accès à l'eau potable, d'assainissement et de salubrité.",
      partner3_t: "Direction de l'Assainissement en Milieu Rural",
      partner3_d: "Direction technique du MINHAS en charge de l'assainissement rural, notamment la certification des localités « Fin de défécation à l'air libre » (FDAL).",
      partner4_t: 'Institute of Public Policy & Diplomacy Research',
      partner4_d: "Institut international basé à New York, engagé pour la paix, la sécurité, les droits humains et le développement durable.",
      odd1: 'ODD 6',
      odd2: 'Eau propre et assainissement — alignés sur les Objectifs de Développement Durable des Nations Unies',
      value1_t: 'Vision',
      value1_d: "Un monde où chaque école et chaque communauté dispose d'eau potable et d'un assainissement digne.",
      value2_t: 'Mission',
      value2_d: "Améliorer durablement l'accès à l'eau, à l'hygiène et à l'assainissement (WASH) au service de la santé et de l'éducation.",
      value3_t: 'Valeurs',
      value3_d: 'Dignité, durabilité, transparence et engagement des communautés.',
      value4_t: 'Latrines scolaires',
      value4_d: "Construire des latrines dignes et séparées dans les écoles pour offrir aux élèves un cadre sain et sûr.",
      actions_tag: 'Nos actions',
      actions_title: "Nos domaines d'intervention",
      actions_sub: "Nous agissons pour l'eau, l'hygiène et l'assainissement là où les besoins sont les plus grands.",
      proj1_t: "Accès à l'eau potable",
      proj1_d: "Forages, puits, réseaux et points d'eau pour approvisionner écoles et communautés en eau saine.",
      proj2_t: 'Assainissement & Latrines',
      proj2_d: 'Construction de latrines dignes et séparées dans les écoles et gestion des eaux usées.',
      proj3_t: "Promotion de l'hygiène",
      proj3_d: "Sensibilisation au lavage des mains, dispositifs de lavage et éducation à l'hygiène.",
      proj4_t: 'WASH en milieu scolaire',
      proj4_d: "Programmes eau-hygiène-assainissement dans les écoles pour la santé et la réussite des élèves.",
      proj5_t: 'Hygiène menstruelle',
      proj5_d: "Accompagnement des filles : sensibilisation, kits et installations adaptées pour rester à l'école.",
      proj6_t: 'Mobilisation communautaire',
      proj6_d: "Formation des comités de gestion de l'eau et pérennisation des ouvrages par les communautés.",
      news_tag: 'Actualités',
      news_title: 'Nos actualités sur Facebook',
      news_sub: 'Retrouvez ici les activités et publications de notre ONG, publiées en direct sur notre page Facebook officielle.',
      news_btn: 'Suivre notre page Facebook',
      donate_tag: 'Faire un don',
      donate_title: "Votre don donne accès à l'eau",
      donate_sub: "Chaque contribution finance directement nos ouvrages d'eau et d'assainissement sur le terrain. Ensemble, allons plus loin.",
      impact1: "offrent un kit d'hygiène et de lavage des mains",
      impact2: "financent une campagne d'hygiène dans une école",
      impact3: "contribuent à un point d'eau communautaire",
      donate_card_t: 'Soutenir maintenant',
      amount_custom: 'Autre',
      donate_btn: 'Faire un don',
      donate_note: 'Paiement sécurisé. Reçu fiscal sur demande.',
      vol_tag: 'Bénévolat',
      vol_title: 'Devenez bénévole',
      vol_sub: "Donnez de votre temps et de vos compétences pour l'eau, l'hygiène et l'assainissement.",
      vol1: "Participer aux campagnes de sensibilisation à l'hygiène",
      vol2: 'Partager vos compétences (eau, génie civil, santé, communication...)',
      vol3: 'Appuyer nos projets WASH dans les écoles et les communautés',
      vol4: 'Contribuer à un impact réel et mesurable sur la santé',
      form_name: 'Nom complet',
      form_email: 'E-mail',
      form_msg: 'Vos motivations',
      form_msg_contact: 'Message',
      vol_btn: 'Je m\'engage',
      contact_tag: 'Contact',
      contact_title: 'Écrivez-nous',
      contact_sub: 'Une question, un partenariat ? Nous vous répondrons rapidement.',
      contact_addr: "Yopougon Niangon Sud à gauche, route de la centrale d'Azito – Rue première carrière de sable, Abidjan, Côte d'Ivoire",
      contact_rep: 'Représentée par Madame Kpagby épouse Madou Wassia Sidonie',
      contact_receipt: 'Récépissé N° 0373/MIS DGAT/SDVA',
      contact_btn: 'Envoyer',
      footer_nav: 'Navigation',
      footer_contact: 'Contact',
      footer_tag: 'Eau, Hygiène et Assainissement en milieu scolaire et communautaire.',
      footer_legal: "Récépissé N° 0373/MIS DGAT/SDVA — Yopougon Niangon Sud, Abidjan, Côte d'Ivoire",
      rights: 'Tous droits réservés.'
    },
    en: {
      skip: 'Skip to content',
      meta_desc: "Vision Citoyenne NGO - Water, Sanitation and Hygiene in schools and communities in Côte d'Ivoire. Access to safe drinking water, dignified latrines and hygiene promotion.",
      brand_sub: 'Non-Governmental Organization',
      nav_home: 'Home',
      nav_about: 'About',
      nav_actions: 'Our work',
      nav_news: 'News',
      nav_volunteer: 'Volunteer',
      nav_contact: 'Contact',
      nav_donate: 'Donate',
      nav_real: 'Projects',
      nav_gal: 'Gallery',
      gal_tag: 'Gallery',
      gal_title: 'Our photos',
      gal_sub: 'Pictures of our work and our partners in the field. Click on a photo to enlarge it.',
      cta_title: 'Together, let’s bring water to all',
      cta_sub: 'Support our WASH work or join our volunteer teams in the field.',
      cta_btn1: 'Donate',
      cta_btn2: 'Become a volunteer',
      nav_testi: 'Testimonials',
      testi_tag: 'Testimonials',
      testi_title: 'They stand with us',
      testi_sub: 'Communities, teachers and partners share the daily impact of water and hygiene.',
      testi1: 'Since the water point was installed, children no longer miss school to fetch water.',
      testi1_name: 'Mr Kouamé',
      testi1_role: 'School headteacher, Yopougon',
      testi2: 'Separate latrines restored girls’ confidence, who now stay in class all day.',
      testi2_name: 'Mrs Traoré',
      testi2_role: 'Teacher, Abidjan',
      testi3: 'Our committee manages the facility together: it is our health, our pride.',
      testi3_name: 'Mrs Sidibé',
      testi3_role: 'Water committee member',
      hero_eyebrow: 'Water, Sanitation and Hygiene',
      hero_title_1: 'Water, sanitation and hygiene in',
      hero_title_2: 'schools',
      hero_title_3: 'and',
      hero_title_4: 'communities',
      hero_lead: 'Vision Citoyenne NGO works for sustainable access to safe drinking water, dignified latrines and good hygiene practices in schools and communities in Côte d\'Ivoire.',
      hero_cta1: 'Support our work',
      hero_cta2: 'Discover our mission',
      about_tag: 'About',
      about_title: 'Our mission',
      about_sub: 'A clear vision: ensuring water, hygiene and sanitation for all, at school and in the community.',
      about_p1: 'Vision Citoyenne NGO works so that every child and every family has safe access to drinking water, dignified toilets and good hygiene practices. We believe water and sanitation are the foundation of health, dignity and educational success.',
      about_p2: 'We build water points and latrines, train management committees and run hygiene awareness campaigns in schools and communities, with transparency and proximity.',
      odd1: 'SDG 6',
      odd2: 'Clean water and sanitation — aligned with the United Nations Sustainable Development Goals',
      value1_t: 'Vision',
      value1_d: 'A world where every school and community has drinking water and dignified sanitation.',
      value2_t: 'Mission',
      value2_d: 'Sustainably improve access to water, hygiene and sanitation (WASH) in service of health and education.',
      value3_t: 'Values',
      value3_d: 'Dignity, sustainability, transparency and community engagement.',
      value4_t: 'School latrines',
      value4_d: 'Building dignified, separate latrines in schools to give pupils a clean and safe environment.',
      actions_tag: 'Our work',
      actions_title: 'Our areas of action',
      actions_sub: 'We act on water, hygiene and sanitation where needs are greatest.',
      proj1_t: 'Access to drinking water',
      proj1_d: 'Boreholes, wells, networks and water points to supply schools and communities with safe water.',
      proj2_t: 'Sanitation & Latrines',
      proj2_d: 'Building dignified, separate latrines in schools and managing wastewater.',
      proj3_t: 'Hygiene promotion',
      proj3_d: 'Handwashing awareness, washing facilities and hygiene education.',
      proj4_t: 'WASH in schools',
      proj4_d: 'Water, sanitation and hygiene programmes in schools for pupils’ health and success.',
      proj5_t: 'Menstrual hygiene',
      proj5_d: 'Supporting girls: awareness, kits and suitable facilities so they can stay in school.',
      proj6_t: 'Community mobilization',
      proj6_d: 'Training water management committees and sustaining facilities through communities.',
      real_tag: 'Projects',
      real_title: 'The projects we have taken part in',
      real_sub: 'Concrete commitments, carried out with our partners, for water, hygiene and sanitation.',
      real1_t: 'Participation in the PASEA project',
      real1_d: 'Vision Citoyenne NGO took part in the PASEA project.',
      real2_t: 'Recognized at the UN',
      real2_d: 'Vision Citoyenne NGO is recognized at the United Nations.',
      nav_partners: 'Partners',
      partners_tag: 'Partners',
      partners_title: 'Our partners',
      partners_sub: 'Vision Citoyenne NGO works alongside national and international institutions committed to water, hygiene and sanitation.',
      partner1_t: 'United Nations',
      partner1_d: 'International reference institution, with which the NGO is engaged for the Sustainable Development Goals, in particular SDG 6.',
      partner2_t: 'Ministry of Hydraulics, Sanitation and Salubrity',
      partner2_d: "Côte d'Ivoire ministry in charge of national policy on water, sanitation and salubrity.",
      partner3_t: 'Rural Sanitation Directorate (DAR)',
      partner3_d: 'Technical directorate of MINHAS in charge of rural sanitation, including the certification of communities achieving Open Defecation Free (ODF) status.',
      partner4_t: 'Institute of Public Policy & Diplomacy Research',
      partner4_d: 'International institute based in New York, committed to peace, security, human rights and sustainable development.',
      news_tag: 'News',
      news_title: 'Our Facebook news',
      news_sub: 'Here you will find our NGO’s activities and posts, published live on our official Facebook page.',
      news_btn: 'Follow our Facebook page',
      donate_tag: 'Donate',
      donate_title: 'Your donation brings water',
      donate_sub: 'Every contribution directly supports local micro-enterprises and sanitation facilities in the field. Together, let’s go further.',
      impact1: 'provide a hygiene and handwashing kit',
      impact2: 'fund a hygiene campaign in a school',
      impact3: 'contribute to a community water point',
      donate_card_t: 'Support us now',
      amount_custom: 'Other',
      donate_btn: 'Donate',
      donate_note: 'Secure payment. Tax receipt available on request.',
      vol_tag: 'Volunteer',
      vol_title: 'Become a volunteer',
      vol_sub: 'Give your time and skills for water, hygiene and sanitation.',
      vol1: 'Take part in hygiene awareness campaigns',
      vol2: 'Share your skills (water, civil engineering, health, communication...)',
      vol3: 'Support our WASH projects in schools and communities',
      vol4: 'Contribute to real, measurable impact on health',
      form_name: 'Full name',
      form_email: 'Email',
      form_msg: 'Your motivations',
      vol_btn: 'I commit',
      contact_tag: 'Contact',
      contact_title: 'Write to us',
      contact_sub: 'A question, a partnership? We will get back to you quickly.',
      contact_addr: "Yopougon Niangon Sud (left), Azito power plant road – Rue première carrière de sable, Abidjan, Côte d'Ivoire",
      contact_rep: 'Represented by Mrs Kpagby, spouse Madou Wassia Sidonie',
      contact_receipt: 'Registration No. 0373/MIS DGAT/SDVA',
      contact_btn: 'Send',
      footer_nav: 'Navigation',
      footer_contact: 'Contact',
      footer_tag: 'Water, Sanitation and Hygiene in schools and communities.',
      footer_legal: "Registration No. 0373/MIS DGAT/SDVA — Yopougon Niangon Sud, Abidjan, Côte d'Ivoire",
      rights: 'All rights reserved.'
    }
  };

  const LANG_KEY = 'vc_lang';

  /* ---------------------------------------------------------------
     2. MENU MOBILE
     --------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Ferme le menu au clic sur un lien de navigation
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });

    // Ferme le menu avec la touche Échap
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------------------------------------------------------------
     3. HEADER SCOLLED + SCROLLSPY + BOUTON RETOUR EN HAUT + WHATSAPP
     --------------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    const toTop = document.getElementById('toTop');
    const waFloat = document.getElementById('waFloat');
    const links = Array.from(document.querySelectorAll('.nav ul a'));
    const sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    function onScroll() {
      const y = window.scrollY;
      if (header) header.classList.toggle('scrolled', y > 10);
      if (toTop) toTop.classList.toggle('visible', y > 600);
      if (waFloat) waFloat.classList.toggle('visible', y > 300);

      // Scrollspy : section active dans la nav
      let current = '';
      const offset = 120;
      sections.forEach(function (sec) {
        if (sec.offsetTop - offset <= y) current = sec.id;
      });
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ---------------------------------------------------------------
     3 bis. BARRE DE PROGRESSION DE LECTURE
     --------------------------------------------------------------- */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      bar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + '%';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  /* ---------------------------------------------------------------
     4. ANNÉE DYNAMIQUE
     --------------------------------------------------------------- */
  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------------
     5. SÉLECTEUR DE LANGUE FR / EN
     --------------------------------------------------------------- */
  function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    // Meta description (attribut content)
    const meta = document.querySelector('meta[data-i18n="meta_desc"]');
    if (meta) meta.setAttribute('content', dict.meta_desc);

    // Tous les autres éléments data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (key === 'meta_desc') return; // déjà géré
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.documentElement.lang = lang;
    updateLangSwitch(lang);
  }

  function updateLangSwitch(lang) {
    const active = document.querySelector('#langSwitch .lang-active');
    const inactive = document.querySelector('#langSwitch .lang-inactive');
    if (!active || !inactive) return;
    if (lang === 'fr') {
      active.textContent = 'FR';
      inactive.textContent = 'EN';
    } else {
      active.textContent = 'EN';
      inactive.textContent = 'FR';
    }
  }  function initLanguage() {
    const switchBtn = document.getElementById('langSwitch');
    let current = localStorage.getItem(LANG_KEY) || 'fr';

    applyTranslations(current);

    if (switchBtn) {
      switchBtn.addEventListener('click', function () {
        current = current === 'fr' ? 'en' : 'fr';
        applyTranslations(current);
        localStorage.setItem(LANG_KEY, current);
      });
    }
  }

  /* ---------------------------------------------------------------
     6. SÉLECTION DU MONTANT DU DON
     --------------------------------------------------------------- */
  function initAmountSelection() {
    const amounts = document.querySelectorAll('.amount-grid .amount');
    amounts.forEach(function (btn) {
      btn.addEventListener('click', function () {
        amounts.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  }

  /* ---------------------------------------------------------------
     7. FORMULAIRES (validation + statut)
     --------------------------------------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setStatus(statusEl, message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('ok', 'err');
    statusEl.classList.add(type);
  }

  function initForm(formId, statusId) {
    const form = document.getElementById(formId);
    const statusEl = document.getElementById(statusId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const lang = localStorage.getItem(LANG_KEY) || 'fr';
      const required = form.querySelectorAll('[required]');
      let valid = true;
      let errorKey = null;

      required.forEach(function (field) {
        if (!field.value.trim()) { valid = false; errorKey = 'required'; }
      });

      const email = form.querySelector('input[type="email"]');
      if (valid && email && !EMAIL_RE.test(email.value.trim())) {
        valid = false;
        errorKey = 'email';
      }

      if (!valid) {
        const msg = errorKey === 'email'
          ? (lang === 'fr' ? 'Adresse e-mail invalide.' : 'Invalid email address.')
          : (lang === 'fr' ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill in all required fields.');
        setStatus(statusEl, msg, 'err');
        return;
      }

      const success = lang === 'fr'
        ? 'Merci ! Votre message a bien été envoyé.'
        : 'Thank you! Your message has been sent successfully.';
      setStatus(statusEl, success, 'ok');
      form.reset();

      // Pour brancher un vrai backend, remplacer le bloc ci-dessus par un
      // appel fetch vers un service (ex. Formspree) :
      // fetch('https://formspree.io/f/XXXX', { method:'POST', body: new FormData(form) })
    });
  }

  /* ---------------------------------------------------------------
     8. COMPTEURS ANIMÉS (chiffres clés du hero)
     --------------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('.count[data-count]');
    if (!counters.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fmt = new Intl.NumberFormat('fr-FR');

    function run(el) {
      const target = parseFloat(el.getAttribute('data-count'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = Math.round(target * eased);
        el.textContent = prefix + fmt.format(value) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + fmt.format(target) + suffix;
      }
      requestAnimationFrame(tick);
    }

    if (reduce || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        const target = parseFloat(el.getAttribute('data-count'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = prefix + fmt.format(target) + suffix;
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     9. MARQUEE (bandeau défilant, boucle sans fin)
     --------------------------------------------------------------- */
  function initMarquee() {
    const track = document.getElementById('marqueeTrack');
    if (!track) return;
    const group = track.querySelector('.marquee-group');
    if (!group) return;

    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  /* ---------------------------------------------------------------
     10. ANIMATIONS AU SCROLL (IntersectionObserver)
     --------------------------------------------------------------- */
  function initReveal() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.card, .values li, .section-head, .testi-card, .about-media figure, .donate-card, .vol-form, .contact-form, .fb-embed').forEach(function (el) {
      el.classList.add('reveal');
    });

    const items = document.querySelectorAll('.reveal');

    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const siblings = Array.prototype.slice.call(entry.target.parentElement.children).filter(function (c) { return c.classList.contains('reveal'); });
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = Math.min(idx, 6) * 60 + 'ms';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     11. GALERIE PHOTOS + LIGHTBOX
     --------------------------------------------------------------- */
  function initGalerie() {
    if (typeof GALERIE === 'undefined') return;
    const grid = document.getElementById('galerieGrid');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCaption = document.getElementById('lbCaption');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    if (!grid || !lightbox || !lbImg || !lbCaption) return;

    const images = GALERIE.map(function (item) {
      return { src: 'assets/galerie/' + item[0], caption: item[1] || '' };
    });

    let current = -1;
    let trigger = null;

    function show(index) {
      current = (index + images.length) % images.length;
      lbImg.src = images[current].src;
      lbImg.alt = images[current].caption;
      lbCaption.textContent = images[current].caption;
      lightbox.classList.add('open');
      lightbox.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    }

    function close() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
      if (trigger) trigger.focus();
    }

    images.forEach(function (img, i) {
      const figure = document.createElement('figure');
      figure.className = 'gal-item';
      figure.setAttribute('role', 'button');
      figure.tabIndex = 0;
      figure.setAttribute('aria-label', img.caption);

      const el = document.createElement('img');
      el.src = img.src;
      el.alt = img.caption;
      el.loading = 'lazy';
      figure.appendChild(el);

      const cap = document.createElement('figcaption');
      cap.textContent = img.caption;
      figure.appendChild(cap);

      figure.addEventListener('click', function () {
        trigger = figure;
        show(i);
      });
      figure.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger = figure;
          show(i);
        }
      });

      grid.appendChild(figure);
    });

    if (lbClose) lbClose.addEventListener('click', close);
    if (lbPrev) lbPrev.addEventListener('click', function () { show(current - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { show(current + 1); });

    lightbox.addEventListener('click', function (e) {
      const figure = lightbox.querySelector('.lb-figure');
      if (e.target === lightbox || (figure && e.target === figure)) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------------------------------------------------------------
     INITIALISATION GLOBALE
     --------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHeaderScroll();
    initScrollProgress();
    initYear();
    initLanguage();
    initAmountSelection();
    initForm('volForm', 'volStatus');
    initForm('contactForm', 'contactStatus');
    initCounters();
    initMarquee();
    initReveal();
    initGalerie();
  });

})();
