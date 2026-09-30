/* ===================================================================
   ONG VISION CITOYENNE — main.js
   JavaScript moderne et performant, sans dépendance.
   Gère : menu mobile, header sticky, langue FR/EN, devises de dons,
   actualités filtrables, galerie avec swipe tactile, formulaires,
   animations au scroll, compteurs, copie presse-papier et Service Worker.
   =================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     0. CONFIGURATION DU SITE
     --------------------------------------------------------------- */
  const SITE_CONFIG = {
    DONATION_URL: '',        // Ex: 'https://www.helloasso.com/...' (laisser vide pour mailto)
    NEWSLETTER_ENDPOINT: '', // Ex: 'https://formspree.io/f/...' (laisser vide pour mailto)
    WHATSAPP_NUMBER: '2250707597457',
    OFFICIAL_EMAIL: 'ongvisioncitoyenne@gmail.com'
  };

  const LANG_KEY = 'vc_lang';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------------------------------------------------------------
     1. TRADUCTIONS FR / EN
     --------------------------------------------------------------- */
  const translations = {
    fr: {
      skip: 'Aller au contenu',
      page_title: 'ONG Vision Citoyenne — Eau, Hygiène et Assainissement (WASH)',
      meta_desc: "ONG Vision Citoyenne - Eau, Hygiène et Assainissement en milieu scolaire et communautaire. Accès à l'eau potable, latrines dignes et promotion de l'hygiène en Côte d'Ivoire.",
      brand_sub: 'Organisation Non Gouvernementale',

      // Navigation
      nav_home: 'Accueil',
      nav_ong: "L'ONG",
      nav_about: 'À propos',
      nav_recog: 'Reconnaissances',
      nav_real: 'Projets',
      nav_partners: 'Partenaires',
      nav_actions: 'Nos actions',
      nav_news: 'Actualités',
      nav_gal: 'Galerie',
      nav_volunteer: 'Bénévolat',
      nav_testi: 'Témoignages',
      nav_contact: 'Contact',
      nav_donate: 'Faire un don',

      // Hero
      hero_eyebrow: 'Eau • Hygiène • Assainissement',
      hero_title_1: "L'eau change tout.",
      hero_title_2: 'Ensemble,',
      hero_title_3: 'bâtissons un avenir',
      hero_title_4: 'digne et durable',
      hero_lead: "Parce que l'accès à l'eau potable et à l'hygiène est un droit fondamental, l'ONG Vision Citoyenne agit chaque jour aux côtés des écoles et des communautés de Côte d'Ivoire.",
      hero_cta1: 'Soutenir nos actions',
      hero_cta2: 'Découvrir la mission',
      stat1: "Années d'engagement",
      stat2: 'Projets menés',
      stat3: 'Bénéficiaires touchés',
      stat4: 'Partenaires engagés',

      // À propos
      about_tag: 'À propos',
      about_title: 'Notre mission',
      about_sub: "Une vision claire : garantir l'eau, l'hygiène et l'assainissement pour tous, à l'école comme dans la communauté.",
      about_p1: "L'ONG Vision Citoyenne œuvre pour que chaque enfant et chaque famille dispose d'un accès sûr à l'eau potable, à des latrines dignes et aux bonnes pratiques d'hygiène.",
      about_p2: "Nous construisons des points d'eau et des latrines, formons les comités de gestion et menons des campagnes de sensibilisation à l'hygiène dans les écoles et les communautés, avec transparence et proximité.",
      about_caption1: "Éducation et eau, les piliers de l'avenir",
      impact_years: "Années d'engagement",
      impact_projects: "Projets menés",
      impact_benef: "Bénéficiaires touchés",
      impact_schools: "Écoles accompagnées",
      odd1: "ODD 6",
      odd2: "Eau propre et assainissement",
      value1_t: 'Vision',
      value1_d: "Un monde où chaque école et communauté dispose d'eau potable et d'assainissement digne.",
      value2_t: 'Mission',
      value2_d: "Améliorer durablement l'accès à l'eau, l'hygiène et l'assainissement au service de la santé et de l'éducation.",
      value3_t: 'Valeurs',
      value3_d: 'Dignité, durabilité, transparence et engagement communautaire.',

      // Valeurs
      values_tag: 'Nos valeurs',
      values_title: 'Les principes qui nous guident',
      values_sub: 'Cinq engagements fondamentaux au cœur de notre action, chaque jour et dans chaque projet.',
      value_p1_t: 'Transparence & Égalité',
      value_p1_d: 'Une gestion ouverte et responsable, avec un accès équitable aux services pour toutes et tous.',
      value_p2_t: 'Redevabilité',
      value_p2_d: 'Nous rendons des comptes à nos communautés, à nos partenaires et à nos bénéficiaires.',
      value_p3_t: 'Humanité',
      value_p3_d: 'La dignité de chaque personne est la boussole de nos interventions et de nos choix.',
      value_p4_t: 'Impartialité',
      value_p4_d: "Nous agissons selon les besoins, sans distinction d'origine, de croyance ou d'appartenance.",
      value_p5_t: 'Professionnalisme',
      value_p5_d: 'Compétence, rigueur et qualité — de la conception au suivi de chaque projet sur le terrain.',

      // Historique / Réalisations
      history_title: 'Sur le terrain depuis 2018',
      history_partner: 'Partenariat UNICEF',
      history_more: 'Voir la galerie complète →',

      president_caption: 'Wassia MADOU — Présidente',
      since_label: 'Depuis',
      years_engaged: "8+ années d'engagement",
      donate_teaser_sub: 'Chaque contribution finance directement nos ouvrages et nos formations sur le terrain. Ensemble, transformons des vies.',
      see_contact_page: 'Formulaire & carte',
      see_contact_page_sub: 'Voir la page contact complète →',
      partners_all_title: 'Tous nos partenaires',

      // Bandeau partenaires
      trust_label: 'Ils nous accompagnent',
      trust_link: 'Tous nos partenaires →',

      // Projet phare
      fp_tag: 'Projet phare 2026',
      fp_title: 'Une école transformée à Yopougon',
      fp_lead: "À l'École Primaire Publique SICOGI 1, nous avons réhabilité les sanitaires et redonné aux élèves un cadre digne, sûr et joyeux pour apprendre.",
      fp_li1: 'Sanitaires rénovés et assainis',
      fp_li2: 'Bâtiments entièrement repeints',
      fp_li3: 'Aire de jeux avec fresque éducative',
      fp_li4: 'Toboggans et mobilier pour enfants',
      fp_partners: "Inaugurée aux côtés de l'IPPDR, de la République Libre de Verdis et de la communauté locale.",
      fp_cta1: 'Découvrir le projet',
      fp_cta2: 'Voir les photos',
      fp_after: 'Après',
      fp_before: 'Avant',
      fp_date: 'Inaugurée le 9 septembre 2026',

      // Chronologie
      tl_tag: 'Notre parcours',
      tl_sub: "De la fondation de l'ONG à nos chantiers d'aujourd'hui : les étapes qui ont construit notre action.",
      tl_cta: 'Tous nos projets',
      tl1_tag: 'Fondation',
      tl1_t: 'Naissance de Vision Citoyenne',
      tl1_d: "L'ONG est fondée le 6 juin 2018 à Abidjan avec une mission claire : l'eau, l'hygiène et l'assainissement pour tous.",
      tl2_tag: 'WASH scolaire',
      tl2_d: "Points d'eau et latrines construits ou réhabilités dans les écoles, comités de gestion formés à l'hygiène.",
      tl3_tag: 'Genre & inclusion',
      tl3_d: 'Formation aux activités génératrices de revenus et accompagnement de coopératives agricoles féminines.',
      tl4_t: 'Don UNICEF à San Pedro',
      tl4_d: "Matériel d'hygiène remis au Lycée Moderne Inagohi, avec les enseignants et les élèves.",
      tl5_tag: 'Sensibilisation',
      tl5_t: 'Campagne « Engagement Citoyen »',
      tl5_d: "Sessions sur l'hygiène, le lavage des mains et la citoyenneté dans les écoles de San Pedro et du Nord.",
      tl6_t: 'Programme PASEA',
      tl6_d: "Participation au Programme d'Appui au Secteur de l'Eau et de l'Assainissement dans les écoles et communautés rurales.",
      tl7_d: 'École rénovée et inaugurée le 9 septembre 2026 : sanitaires, peinture, aire de jeux et fresque éducative.',

      // Champs élargis
      fields_ext_tag: 'Notre horizon',
      fields_ext_title: 'Au-delà du WASH, un engagement global',
      fields_ext_sub: 'Vision Citoyenne intervient aussi sur les enjeux transversaux qui touchent les mêmes communautés.',
      field_a: 'Genre & inclusion sociale',
      field_b: 'Autonomisation de la femme en milieu rural',
      field_c: 'Lutte contre les violences basées sur le genre',
      field_d: 'Lutte contre le changement climatique',
      field_e: 'Santé & nutrition',
      field_f: 'Paix & cohésion sociale',

      // Actions
      actions_tag: 'Nos actions',
      actions_title: "Nos domaines d'intervention",
      actions_sub: "Nous agissons pour l'eau, l'hygiène et l'assainissement là où les besoins sont les plus grands.",
      proj1_t: "Accès à l'eau potable",
      proj1_d: "Forages, puits, réseaux et points d'eau pour approvisionner écoles et communautés en eau saine.",
      proj2_t: "Assainissement & Latrines",
      proj2_d: "Construction de latrines dignes et séparées dans les écoles et gestion des eaux usées.",
      proj3_t: "Promotion de l'hygiène",
      proj3_d: "Sensibilisation au lavage des mains, dispositifs de lavage et éducation à l'hygiène.",
      proj4_t: "WASH en milieu scolaire",
      proj4_d: "Programmes eau-hygiène-assainissement dans les écoles pour la santé et la réussite des élèves.",
      proj5_t: "Hygiène menstruelle",
      proj5_d: "Accompagnement des filles : sensibilisation, kits et installations adaptées pour rester à l'école.",
      proj6_t: "Mobilisation communautaire",
      proj6_d: "Formation des comités de gestion de l'eau et pérennisation des ouvrages par les communautés.",

      // Projets & Réalisations
      real_tag: 'Projets',
      real_title: 'Projets & réalisations',
      real_sub: "Des engagements concrets, menés avec nos partenaires, au service de l'eau, de l'hygiène et de l'assainissement.",
      real1_year: '2024 – 2026',
      real1_status: 'En cours',
      real1_t: 'Projet PASEA — Eau & Assainissement',
      real1_d: "Participation au Programme d'Appui au Secteur de l'Eau et de l'Assainissement (PASEA). Ce projet renforce l'accès à l'eau potable et à l'assainissement dans les écoles et les communautés rurales, en renforçant la gouvernance du secteur et l'engagement communautaire.",
      real_reno_t: 'Rénovation EPP SICOGI 1 — Yopougon',
      real_reno_d: "Réhabilitation complète de l'École Primaire Publique SICOGI 1 à Yopougon : rénovation des sanitaires, peinture des bâtiments, création d'une aire de jeux avec fresque éducative, installation de toboggans et mobilier pour enfants. Inauguré le 09 septembre 2026.",
      real_reno_status: 'Terminé',
      real_don_t: 'Don UNICEF — Lycée Moderne Inagohi, San Pedro',
      real_don_d: "Distribution de matériel d'hygiène offert par l'UNICEF au Lycée Moderne Inagohi de San Pedro. Action menée avec le corps enseignant et les élèves pour promouvoir l'hygiène en milieu scolaire.",
      real_don_status: 'Terminé',
      real_ec_t: 'Sensibilisation « Engagement Citoyen »',
      real_ec_d: "Campagnes de sensibilisation dans les écoles primaires de San Pedro et du Nord de la Côte d'Ivoire. Sessions éducatives sur l'hygiène, le lavage des mains, l'assainissement et la citoyenneté responsable.",
      real_ec_status: 'Terminé',
      real_wash_t: 'Programme WASH Scolaire',
      real_wash_d: "Construction et réhabilitation de points d'eau et de latrines dans les écoles. Formation des comités de gestion scolaires aux bonnes pratiques d'hygiène.",
      real_wash_status: 'Terminé',
      real_auto_t: 'Autonomisation de la femme en milieu rural',
      real_auto_d: "Renforcement des capacités économiques des femmes rurales. Formation aux activités génératrices de revenus, accès au microcrédit et accompagnement dans la création de coopératives agricoles.",
      real_auto_status: 'Terminé',
      domains_tag: 'Domaines',
      domains_title: "Nos domaines d'intervention",
      dom_eha: 'Eau, Hygiène & Assainissement',
      dom_genre: 'Genre & Lutte contre les VBG',
      dom_auto: 'Autonomisation de la femme',
      dom_sante: 'Santé & Nutrition',
      dom_paix: 'Paix & Cohésion sociale',
      dom_incl: 'Inclusion sociale',
      see_news: 'Voir les actualités terrain',

      // Reconnaissances
      recog_tag: 'Reconnaissances',
      recog_title: 'Accréditations & partenariats institutionnels',
      recog_sub: "L'ONG Vision Citoyenne est officiellement reconnue par les Nations Unies et collabore avec des institutions nationales et internationales engagées pour l'eau, l'hygiène et l'assainissement.",
      recog_un_t: "Reconnaissance à l'ONU",
      recog_un_d: "L'ONG Vision Citoyenne est officiellement enregistrée auprès des Nations Unies et alignée sur les Objectifs de Développement Durable, notamment l'ODD 6 (Eau propre et assainissement).",
      recog_pasea_t: 'Partenaire du projet PASEA',
      recog_pasea_d: "Engagement au sein du Programme d'Appui au Secteur de l'Eau et de l'Assainissement (PASEA) pour améliorer l'accès à l'eau potable et à l'assainissement dans les écoles et les communautés.",

      // Partenaires
      partners_tag: 'Partenaires',
      partners_title: 'Nos partenaires & alliés',
      partners_sub: "L'ONG Vision Citoyenne agit aux côtés d'institutions nationales, internationales et d'organisations engagées pour l'eau, l'hygiène et l'environnement.",
      partner_tag_int: 'International',
      partner_tag_gov: 'Gouvernement',
      partner_tag_dip: 'Diplomatie',
      partner_tag_ngo: 'ONG Partenaire',
      partner_tag_env: 'Environnement',
      partner_tag_hum: 'Humanitaire',
      founded_since: 'Fondée le 6 juin 2018',
      footer_founded: 'Fondée le 6 juin 2018',
      partner1_t: 'Organisation des Nations Unies',
      partner1_d: "Institution internationale de référence, avec laquelle l'ONG est engagée pour les Objectifs de Développement Durable, notamment l'ODD 6.",
      partner2_t: "Ministère de l'Hydraulique, de l'Assainissement et de la Salubrité",
      partner2_d: "Ministère de Côte d'Ivoire chargé de la politique nationale en matière d'hydraulique, d'accès à l'eau potable, d'assainissement et de salubrité.",
      partner3_t: "ONG EICF",
      partner3_d: "Organisation partenaire engagée dans le renforcement des capacités communautaires, l'éducation civique et la solidarité de proximité.",
      partner4_t: "Institute of Public Policy & Diplomacy Research",
      partner4_d: "Institut international basé à New York, engagé pour la paix, la sécurité, les droits humains et le développement durable.",
      partner5_t: "Government of Verdis",
      partner5_d: "Partenaire institutionnel du Gouvernement de Verdis, engagé pour la coopération internationale, la solidarité entre les peuples et le développement durable.",
      partner6_t: "Humanitarian Focus Foundation",
      partner6_d: "Organisation humanitaire internationale engagée dans l'aide aux populations vulnérables, la protection des droits humains et le développement durable à travers le monde.",
      partner7_t: "UNICEF",
      partner7_d: "Fonds des Nations Unies pour l'enfance, partenaire majeur pour la protection des droits des enfants, l'accès à l'éducation, à l'eau potable et à l'hygiène.",
      partner8_t: "ECOSOC — Conseil économique et social de l'ONU",
      partner8_d: "Organe central de coordination des activités économiques et sociales de l'ONU. Vision Citoyenne y bénéficie d'un statut consultatif pour porter la voix des communautés.",
      partner9_t: "Banque Mondiale",
      partner9_d: "Institution financière internationale soutenant le développement économique et social, notamment via des programmes eau, assainissement et santé dans les pays en développement.",
      partner10_t: "OIM — Organisation Internationale pour les Migrations",
      partner10_d: "Agence des Nations Unies chargée des migrations. Partenaire pour l'accompagnement des populations déplacées et l'accès aux services essentiels dans les zones sensibles.",
      partner11_t: "USAID",
      partner11_d: "Agence des États-Unis pour le développement international, soutenant les programmes de santé, d'éducation et d'eau-assainissement en Afrique de l'Ouest.",
      partner12_t: "PIDUCAS",
      partner12_d: "Projet d'Infrastructures pour le Développement Urbain et la Compétitivité des Agglomérations Économiques Secondaires. Partenaire opérationnel sur les projets d'infrastructures WASH.",
      partner_tag_coop: 'Coopération',

      // Témoignages
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

      // Actualités Facebook
      news_tag: 'Actualités',
      news_title: 'Nos actualités sur le terrain',
      news_sub: 'Nos dernières actions, annonces et moments forts, nos publications Facebook et nos photos de terrain.',
      nh_tag: 'Actualités',
      nh_title: 'Les dernières nouvelles',
      nh_all: 'Toutes les actualités →',
      an_tag: 'À la une',
      an_title: 'Nos dernières nouvelles',
      fb_tag: 'Facebook',
      fb_title: 'Sur notre page Facebook',
      fb_sub: 'Publications et vidéos en direct de notre page officielle.',
      news_filter_all: 'Toutes',
      news_filter_posts: 'Publications',
      news_filter_videos: 'Vidéos & Reels',
      news_more: "Afficher plus d'actualités",
      news_less: 'Afficher moins',
      news_btn: 'Suivre notre page Facebook',
      news_fallback: 'Voir cette publication sur Facebook',

      // Galerie
      gal_tag: 'Galerie',
      gal_title: 'Nos photos de terrain',
      gal_sub: 'Images de nos réalisations, chantiers et sensibilisations. Cliquez sur une photo pour l\'agrandir.',
      gal_all: 'Toutes',
      gal_don: 'Dons',
      gal_sensib: 'Sensibilisation',
      gal_terrain: 'Terrain',
      gal_reno: 'Rénovation',
      gal_cere: 'Inauguration',
      gal_avant: 'Avant',
      gal_travaux: 'Travaux',
      gal_apres: 'Après',
      gal_full: 'Voir toute la galerie',

      // Comparateur & chantier EPP SICOGI 1
      ba_hint: 'Faites glisser pour comparer avant / après',
      chantier_tag: 'Rénovation EPP SICOGI 1',
      chantier_title: 'Le chantier en images',
      chantier_sub: "De juillet à septembre 2026 : l'état des lieux, les travaux, puis l'école transformée et inaugurée le 9 septembre.",
      st1_d: 'Juillet 2026', st1: 'État des lieux',
      st2_d: 'Juillet – août 2026', st2: 'Travaux',
      st3_d: 'Août 2026', st3: 'Finitions & fresques',
      st4_d: '9 septembre 2026', st4: 'Inauguration',
      ba_bloc_t: 'Le bloc sanitaire',
      ba_bloc_d: 'Façades repeintes, sol pavé et bordures neuves',
      ba_allee_t: "L'allée de la cour",
      ba_allee_d: 'Murs repeints et fresque au fond de la cour',
      ba_accueil_t: "Le mur d'accueil",
      ba_accueil_d: 'Nouvelle fresque « Bienvenue au Préscolaire SICOGI 1 »',
      chantier_gal: 'Toutes les photos du chantier',
      chantier_cta: 'Soutenir le prochain chantier',
      real_reno_more: 'Voir le chantier en images ↓',

      // Don
      donate_tag: 'Faire un don',
      donate_title: "Votre don donne accès à l'eau",
      donate_sub: 'Chaque contribution finance directement nos ouvrages et nos formations sur le terrain. Ensemble, transformons des vies.',
      donate_card_t: 'Soutenir notre mission',
      amount_custom: 'Autre montant',
      donate_btn: 'Faire un don maintenant',
      donate_wa_btn: 'Faire un don via WhatsApp',
      donate_note: 'Paiement sécurisé et transparent. Reçu délivré sur demande.',
      donate_impact_label: 'Impact direct estimé :',
      impact1: "offre un kit complet d'hygiène et de lavage des mains",
      impact2: "finance une campagne d'hygiène complète dans une école",
      impact3: "contribue à la réhabilitation d'un point d'eau communautaire",
      impact_xof1: "offre des kits de savons et de lavage pour 1 classe",
      impact_xof2: "finance la sensibilisation de 200 élèves",
      impact_xof3: "participe à l'aménagement et la sécurisation d'un forage",

      // Bénévolat
      vol_tag: 'Bénévolat',
      vol_title: 'Devenez bénévole',
      vol_sub: 'Donnez de votre temps et de vos compétences pour apporter l’eau et la santé.',
      vol1: "Participer aux campagnes de sensibilisation à l'hygiène",
      vol2: 'Partager vos compétences (eau, santé, communication, logistique...)',
      vol3: 'Appuyer nos projets WASH dans les écoles et villages',
      vol4: 'Contribuer à un impact réel et mesurable',
      vol_btn: "Je m'engage comme bénévole",

      // Formulaires
      form_name: 'Nom complet',
      form_email: 'Adresse e-mail',
      form_phone: 'Téléphone / WhatsApp',
      form_msg: 'Vos motivations ou compétences',
      form_msg_contact: 'Votre message',

      // Contact
      contact_tag: 'Contact',
      contact_title: 'Contactez notre équipe',
      contact_sub: 'Un projet, un partenariat ou une question ? Nous vous répondons sous 24h à 48h.',
      contact_addr: "Yopougon Niangon Sud à gauche, route de la centrale d'Azito – Rue première carrière de sable, Abidjan, Côte d'Ivoire",
      contact_rep: 'Représentée par Madame Kpagby épouse Madou Wassia Sidonie',
      contact_receipt: 'Récépissé N° 0373/MIS DGAT/SDVA',
      contact_btn: 'Envoyer le message',
      contact_wa_btn: 'Discuter sur WhatsApp',
      copy_hint: 'Cliquer pour copier',
      copied_toast: 'Copié dans le presse-papier !',

      // CTA Band & Footer
      cta_title: "Ensemble, portons l'eau à tous",
      cta_sub: 'Soutenez nos actions WASH ou rejoignez nos équipes de bénévoles sur le terrain.',
      cta_btn1: 'Faire un don',
      cta_btn2: 'Devenir bénévole',
      footer_nav: 'Navigation',
      footer_contact: 'Contact',
      footer_tag: 'Eau, Hygiène et Assainissement en milieu scolaire et communautaire.',
      footer_legal: "Récépissé N° 0373/MIS DGAT/SDVA — Yopougon Niangon Sud, Abidjan, Côte d'Ivoire",
      footer_news: 'Newsletter',
      news_btn2: "S'abonner",
      rights: 'Tous droits réservés.',

      // Mobile action bar
      mob_call: 'Appeler',
      mob_wa: 'WhatsApp',
      mob_donate: 'Donner',
      mob_volunteer: 'Bénévole'
    },

    en: {
      skip: 'Skip to content',
      page_title: 'Vision Citoyenne NGO — Water, Sanitation and Hygiene (WASH)',
      meta_desc: "Vision Citoyenne NGO - Water, Sanitation and Hygiene in schools and communities. Safe drinking water, dignified latrines and hygiene promotion in Ivory Coast.",
      brand_sub: 'Non-Governmental Organization',

      // Navigation
      nav_home: 'Home',
      nav_ong: 'The NGO',
      nav_about: 'About',
      nav_recog: 'Recognitions',
      nav_real: 'Projects',
      nav_partners: 'Partners',
      nav_actions: 'Our Actions',
      nav_news: 'News',
      nav_gal: 'Gallery',
      nav_volunteer: 'Volunteer',
      nav_testi: 'Testimonials',
      nav_contact: 'Contact',
      nav_donate: 'Donate',

      // Hero
      hero_eyebrow: 'Water • Hygiene • Sanitation',
      hero_title_1: 'Water changes everything.',
      hero_title_2: 'Together,',
      hero_title_3: "let's build a future that is",
      hero_title_4: 'dignified and lasting',
      hero_lead: 'Because access to safe water and hygiene is a fundamental right, Vision Citoyenne NGO works every day alongside schools and communities across Ivory Coast.',
      hero_cta1: 'Support our actions',
      hero_cta2: 'Discover the mission',
      stat1: 'Years of action',
      stat2: 'Projects completed',
      stat3: 'Beneficiaries reached',
      stat4: 'Committed partners',

      // About
      about_tag: 'About Us',
      about_title: 'Our Mission',
      about_sub: 'A clear vision: ensuring water, sanitation and hygiene for all, in schools and communities alike.',
      about_p1: 'Vision Citoyenne NGO works to ensure that every child and family has safe access to drinking water, dignified latrines and proper hygiene practices.',
      about_p2: 'We build water points and latrines, train local management committees and run school and community hygiene awareness campaigns with transparency and local proximity.',
      about_caption1: 'Education and water, pillars of the future',
      impact_years: 'Years of action',
      impact_projects: 'Projects carried out',
      impact_benef: 'Beneficiaries reached',
      impact_schools: 'Schools supported',
      odd1: 'SDG 6',
      odd2: 'Clean Water and Sanitation',
      value1_t: 'Vision',
      value1_d: 'A world where every school and community has access to clean water and dignified sanitation.',
      value2_t: 'Mission',
      value2_d: 'Sustainably improve access to water, hygiene and sanitation to support health and education.',
      value3_t: 'Values',
      value3_d: 'Dignity, sustainability, transparency and community empowerment.',

      // Values
      values_tag: 'Our Values',
      values_title: 'The principles that guide us',
      values_sub: 'Five core commitments at the heart of our work, every day and in every project.',
      value_p1_t: 'Transparency & Equality',
      value_p1_d: 'Open, accountable management with equitable access to services for everyone.',
      value_p2_t: 'Accountability',
      value_p2_d: 'We are answerable to our communities, partners and beneficiaries.',
      value_p3_t: 'Humanity',
      value_p3_d: 'Every person’s dignity is the compass for our interventions and our choices.',
      value_p4_t: 'Impartiality',
      value_p4_d: 'We act on the basis of need alone, without distinction of origin, belief or affiliation.',
      value_p5_t: 'Professionalism',
      value_p5_d: 'Competence, rigour and quality — from design to on-the-ground follow-up of every project.',

      // History / Achievements
      history_title: 'On the ground since 2018',
      history_partner: 'UNICEF Partnership',

      president_caption: 'Wassia MADOU — President',
      since_label: 'Since',
      years_engaged: '8+ years of commitment',
      donate_teaser_sub: 'Every contribution directly funds our facilities and field training. Together, let us transform lives.',
      see_contact_page: 'Form & map',
      see_contact_page_sub: 'See the full contact page →',
      partners_all_title: 'All our partners',

      // Partner strip
      trust_label: 'They support us',
      trust_link: 'All our partners →',

      // Flagship project
      fp_tag: 'Flagship project 2026',
      fp_title: 'A school transformed in Yopougon',
      fp_lead: 'At EPP SICOGI 1 primary school, we rehabilitated the sanitation facilities and gave pupils a dignified, safe and joyful place to learn.',
      fp_li1: 'Renovated, sanitised toilets',
      fp_li2: 'Buildings fully repainted',
      fp_li3: 'Playground with educational mural',
      fp_li4: "Slides and children's furniture",
      fp_partners: 'Inaugurated alongside IPPDR, the Free Republic of Verdis and the local community.',
      fp_cta1: 'Discover the project',
      fp_cta2: 'See the photos',
      fp_after: 'After',
      fp_before: 'Before',
      fp_date: 'Inaugurated on 9 September 2026',

      // Timeline
      tl_tag: 'Our journey',
      tl_sub: "From the NGO's founding to today's projects: the milestones that shaped our work.",
      tl_cta: 'All our projects',
      tl1_tag: 'Founding',
      tl1_t: 'Vision Citoyenne is born',
      tl1_d: 'The NGO was founded on 6 June 2018 in Abidjan with a clear mission: water, hygiene and sanitation for all.',
      tl2_tag: 'School WASH',
      tl2_d: 'Water points and latrines built or rehabilitated in schools, management committees trained in hygiene.',
      tl3_tag: 'Gender & inclusion',
      tl3_d: "Training in income-generating activities and support for women's farming cooperatives.",
      tl4_t: 'UNICEF donation in San Pedro',
      tl4_d: 'Hygiene supplies delivered to Lycée Moderne Inagohi, together with teachers and students.',
      tl5_tag: 'Awareness',
      tl5_t: '"Citizen Engagement" campaign',
      tl5_d: 'Sessions on hygiene, handwashing and citizenship in schools in San Pedro and the North.',
      tl6_t: 'PASEA Programme',
      tl6_d: 'Participation in the Water and Sanitation Sector Support Programme in rural schools and communities.',
      tl7_d: 'School renovated and inaugurated on 9 September 2026: toilets, painting, playground and educational mural.',
      history_more: 'See the full gallery →',

      // Extended fields
      fields_ext_tag: 'Our horizon',
      fields_ext_title: 'Beyond WASH, a global commitment',
      fields_ext_sub: 'Vision Citoyenne also engages with the cross-cutting issues affecting the same communities.',
      field_a: 'Gender & social inclusion',
      field_b: 'Empowerment of rural women',
      field_c: 'Fight against gender-based violence',
      field_d: 'Climate change action',
      field_e: 'Health & nutrition',
      field_f: 'Peace & social cohesion',

      // Actions
      actions_tag: 'Our Actions',
      actions_title: 'Our Areas of Intervention',
      actions_sub: 'We take action for water, hygiene and sanitation where needs are most urgent.',
      proj1_t: 'Access to Drinking Water',
      proj1_d: 'Boreholes, wells, distribution networks and water points to supply safe water to schools and communities.',
      proj2_t: 'Sanitation & Dignified Latrines',
      proj2_d: 'Construction of segregated, dignified school latrines and sustainable wastewater management.',
      proj3_t: 'Hygiene Promotion',
      proj3_d: 'Handwashing awareness campaigns, washing facilities installation and hygiene education.',
      proj4_t: 'School WASH Programs',
      proj4_d: 'Comprehensive water-sanitation-hygiene programs in schools for student health and success.',
      proj5_t: 'Menstrual Hygiene',
      proj5_d: 'Supporting girls: awareness, sanitary kits and adapted facilities so girls can stay in school.',
      proj6_t: 'Community Mobilization',
      proj6_d: 'Training local water management committees to ensure the long-term sustainability of infrastructure.',

      // Projects
      real_tag: 'Projects',
      real_title: 'Projects & Achievements',
      real_sub: 'Concrete initiatives conducted with our partners to advance water, hygiene and sanitation.',
      real1_year: '2024 – 2026',
      real1_status: 'Ongoing',
      real1_t: 'PASEA Project — Water & Sanitation',
      real1_d: 'Participation in the Water and Sanitation Sector Support Program (PASEA). This project strengthens access to safe water and sanitation in rural schools and communities through better sector governance and community engagement.',
      real_reno_t: 'EPP SICOGI 1 Renovation — Yopougon',
      real_reno_d: 'Complete rehabilitation of EPP SICOGI 1 primary school in Yopougon: bathroom renovation, building painting, creation of a playground with educational mural, installation of slides and children\'s furniture. Inaugurated on September 9, 2026.',
      real_reno_status: 'Completed',
      real_don_t: 'UNICEF Donation — Lycée Moderne Inagohi, San Pedro',
      real_don_d: 'Distribution of hygiene supplies donated by UNICEF to Lycée Moderne Inagohi in San Pedro. Action carried out with school staff and students to promote hygiene.',
      real_don_status: 'Completed',
      real_ec_t: '"Citizen Engagement" Awareness Campaign',
      real_ec_d: 'Awareness campaigns in primary schools of San Pedro and Northern Ivory Coast. Educational sessions on hygiene, handwashing, sanitation and responsible citizenship.',
      real_ec_status: 'Completed',
      real_wash_t: 'School WASH Program',
      real_wash_d: 'Construction and rehabilitation of water points and latrines in schools. Training school management committees in hygiene best practices.',
      real_wash_status: 'Completed',
      real_auto_t: 'Rural Women Empowerment',
      real_auto_d: 'Strengthening the economic capacities of rural women. Training in income-generating activities, microcredit access and support for creating agricultural cooperatives.',
      real_auto_status: 'Completed',
      domains_tag: 'Domains',
      domains_title: 'Our Areas of Intervention',
      dom_eha: 'Water, Hygiene & Sanitation',
      dom_genre: 'Gender & GBV Prevention',
      dom_auto: 'Women Empowerment',
      dom_sante: 'Health & Nutrition',
      dom_paix: 'Peace & Social Cohesion',
      dom_incl: 'Social Inclusion',
      see_news: 'View field updates',

      // Recognitions
      recog_tag: 'Recognitions',
      recog_title: 'Institutional Accreditations & Partnerships',
      recog_sub: 'Vision Citoyenne NGO is officially recognized by the United Nations and collaborates with national and international institutions.',
      recog_un_t: 'UN Recognition',
      recog_un_d: 'Vision Citoyenne NGO is officially registered with the United Nations and aligned with the Sustainable Development Goals, notably SDG 6 (Clean Water and Sanitation).',
      recog_pasea_t: 'PASEA Project Partner',
      recog_pasea_d: 'Engagement within the Water and Sanitation Sector Support Program (PASEA) to improve safe water and sanitation in schools and communities.',

      // Partners
      partners_tag: 'Partners',
      partners_title: 'Our Partners & Allies',
      partners_sub: 'Vision Citoyenne NGO works alongside national, international and civic institutions committed to water, hygiene and environmental care.',
      partner_tag_int: 'International',
      partner_tag_gov: 'Government',
      partner_tag_dip: 'Diplomacy',
      partner_tag_ngo: 'Partner NGO',
      partner_tag_env: 'Environment',
      partner_tag_hum: 'Humanitarian',
      founded_since: 'Founded on June 6, 2018',
      footer_founded: 'Founded on June 6, 2018',
      partner1_t: 'United Nations Organization',
      partner1_d: 'Leading international institution with which our NGO is engaged for the Sustainable Development Goals, notably SDG 6.',
      partner2_t: 'Ministry of Water, Sanitation and Cleanliness',
      partner2_d: 'Ministry of Ivory Coast in charge of the national policy on hydraulics, safe water access, sanitation and cleanliness.',
      partner3_t: 'EICF NGO',
      partner3_d: 'Partner organization committed to community empowerment, civic education and local solidarity initiatives.',
      partner4_t: 'Institute of Public Policy & Diplomacy Research',
      partner4_d: 'International institute based in New York, committed to peace, security, human rights and sustainable development.',
      partner5_t: 'Government of Verdis',
      partner5_d: 'Institutional partner from the Government of Verdis, committed to international cooperation, solidarity between peoples and sustainable development.',
      partner6_t: 'Humanitarian Focus Foundation',
      partner6_d: 'International humanitarian organization committed to supporting vulnerable populations, protecting human rights and advancing sustainable development worldwide.',
      partner7_t: 'UNICEF',
      partner7_d: "United Nations Children's Fund, key partner for child rights, education access, safe drinking water and hygiene.",
      partner8_t: 'ECOSOC — United Nations Economic and Social Council',
      partner8_d: "Central coordinating body for the economic and social work of the UN. Vision Citoyenne holds consultative status there to voice community concerns.",
      partner9_t: 'World Bank',
      partner9_d: 'International financial institution supporting economic and social development, notably through water, sanitation and health programmes in developing countries.',
      partner10_t: 'IOM — International Organization for Migration',
      partner10_d: 'The UN agency for migration. Partner for supporting displaced populations and access to essential services in sensitive areas.',
      partner11_t: 'USAID',
      partner11_d: 'United States Agency for International Development, backing health, education and WASH programmes across West Africa.',
      partner12_t: 'PIDUCAS',
      partner12_d: "Urban Development and Competitiveness Infrastructure Project for Secondary Economic Agglomerations. Operational partner on WASH infrastructure projects.",
      partner_tag_coop: 'Cooperation',

      // Testimonials
      testi_tag: 'Testimonials',
      testi_title: 'Voices From The Field',
      testi_sub: 'Communities, teachers and partners share the daily impact of clean water and hygiene.',
      testi1: 'Since the water point was built, children no longer miss school to fetch water miles away.',
      testi1_name: 'Mr Kouamé',
      testi1_role: 'School Principal, Yopougon',
      testi2: 'Separate latrines have restored girls’ confidence, allowing them to stay in class all day.',
      testi2_name: 'Mrs Traoré',
      testi2_role: 'Teacher, Abidjan',
      testi3: 'Our committee manages the water point together: it protects our health and gives us pride.',
      testi3_name: 'Mrs Sidibé',
      testi3_role: 'Water Management Committee Member',

      // News
      news_tag: 'News',
      news_title: 'Our Latest Field News',
      news_sub: 'Our latest actions, announcements and highlights, our Facebook posts and our field photos.',
      nh_tag: 'News',
      nh_title: 'Latest news',
      nh_all: 'All news →',
      an_tag: 'Featured',
      an_title: 'Our latest news',
      fb_tag: 'Facebook',
      fb_title: 'On our Facebook page',
      fb_sub: 'Posts and videos straight from our official page.',
      news_filter_all: 'All',
      news_filter_posts: 'Posts',
      news_filter_videos: 'Videos & Reels',
      news_more: 'Show more updates',
      news_less: 'Show less',
      news_btn: 'Follow our Facebook page',
      news_fallback: 'View this post on Facebook',

      // Gallery
      gal_tag: 'Gallery',
      gal_title: 'Field Photographs',
      gal_sub: 'Images of our achievements, construction works and community outreach. Click any image to enlarge.',
      gal_all: 'All',
      gal_don: 'Donations',
      gal_sensib: 'Awareness',
      gal_terrain: 'Field',
      gal_reno: 'Renovation',
      gal_cere: 'Inauguration',
      gal_avant: 'Before',
      gal_travaux: 'Works',
      gal_apres: 'After',
      gal_full: 'See the full gallery',

      // Before/after slider & EPP SICOGI 1 works
      ba_hint: 'Drag to compare before / after',
      chantier_tag: 'EPP SICOGI 1 renovation',
      chantier_title: 'The project in pictures',
      chantier_sub: 'From July to September 2026: the initial assessment, the works, then the transformed school, inaugurated on 9 September.',
      st1_d: 'July 2026', st1: 'Initial assessment',
      st2_d: 'July – August 2026', st2: 'Works',
      st3_d: 'August 2026', st3: 'Finishing & murals',
      st4_d: '9 September 2026', st4: 'Inauguration',
      ba_bloc_t: 'The toilet block',
      ba_bloc_d: 'Repainted walls, paved floor and new borders',
      ba_allee_t: 'The courtyard alley',
      ba_allee_d: 'Repainted walls and a mural at the end of the yard',
      ba_accueil_t: 'The welcome wall',
      ba_accueil_d: 'New "Welcome to SICOGI 1 Pre-school" mural',
      chantier_gal: 'All the project photos',
      chantier_cta: 'Support the next project',
      real_reno_more: 'See the project in pictures ↓',

      // Donate
      donate_tag: 'Donate',
      donate_title: 'Your Donation Brings Clean Water',
      donate_sub: 'Every contribution directly funds our water points, latrines and hygiene training in the field. Together, we save lives.',
      donate_card_t: 'Support Our Mission',
      amount_custom: 'Custom amount',
      donate_btn: 'Donate now',
      donate_wa_btn: 'Donate via WhatsApp',
      donate_note: 'Secure and transparent donation. Receipt available upon request.',
      donate_impact_label: 'Estimated direct impact:',
      impact1: 'provides a complete hygiene and handwashing kit',
      impact2: 'funds a full school hygiene education campaign',
      impact3: 'contributes to rehabilitating a community water borehole',
      impact_xof1: 'provides soap & handwashing kits for a classroom',
      impact_xof2: 'funds hygiene awareness for 200 schoolchildren',
      impact_xof3: 'contributes to securing and maintaining a clean water point',

      // Volunteer
      vol_tag: 'Volunteering',
      vol_title: 'Become a Volunteer',
      vol_sub: 'Dedicate your time and skills to bringing clean water and hygiene to those who need it most.',
      vol1: 'Join hygiene awareness and education campaigns',
      vol2: 'Share your skills (water engineering, health, communication, logistics...)',
      vol3: 'Support our WASH programs in schools and villages',
      vol4: 'Contribute to measurable and long-lasting community impact',
      vol_btn: 'Join as a volunteer',

      // Forms
      form_name: 'Full name',
      form_email: 'Email address',
      form_phone: 'Phone / WhatsApp',
      form_msg: 'Your motivations or skills',
      form_msg_contact: 'Your message',

      // Contact
      contact_tag: 'Contact Us',
      contact_title: 'Get In Touch',
      contact_sub: 'A project, a partnership or a question? Our team will get back to you within 24 to 48 hours.',
      contact_addr: "Yopougon Niangon Sud (left), Azito power plant road – Rue première carrière de sable, Abidjan, Ivory Coast",
      contact_rep: 'Represented by Mrs Kpagby, spouse Madou Wassia Sidonie',
      contact_receipt: 'Registration No. 0373/MIS DGAT/SDVA',
      contact_btn: 'Send message',
      contact_wa_btn: 'Chat on WhatsApp',
      copy_hint: 'Click to copy',
      copied_toast: 'Copied to clipboard!',

      // CTA Band & Footer
      cta_title: 'Together, let us bring water to all',
      cta_sub: 'Support our WASH actions or join our dedicated volunteer teams on the ground.',
      cta_btn1: 'Make a donation',
      cta_btn2: 'Become a volunteer',
      footer_nav: 'Navigation',
      footer_contact: 'Contact',
      footer_tag: 'Water, Sanitation and Hygiene in schools and communities.',
      footer_legal: "Registration No. 0373/MIS DGAT/SDVA — Yopougon Niangon Sud, Abidjan, Ivory Coast",
      footer_news: 'Newsletter',
      news_btn2: 'Subscribe',
      rights: 'All rights reserved.',

      // Mobile action bar
      mob_call: 'Call',
      mob_wa: 'WhatsApp',
      mob_donate: 'Donate',
      mob_volunteer: 'Volunteer'
    }
  };

  /* ---------------------------------------------------------------
     2. SYSTÈME DE TOASTS DE NOTIFICATION
     --------------------------------------------------------------- */
  function showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span class="toast-icon">✓</span> <span class="toast-msg">' + message + '</span>';
    container.appendChild(toast);

    setTimeout(function () { toast.classList.add('show'); }, 20);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, 2800);
  }

  /* ---------------------------------------------------------------
     3. MENU MOBILE & MENUS DÉROULANTS
     --------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      // Ferme aussi les dropdowns ouverts
      menu.querySelectorAll('.has-dropdown.open').forEach(function (li) {
        li.classList.remove('open');
        const t = li.querySelector('.drop-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (!isOpen) close();
    });

    // Un lien classique ferme le menu ; mais un bouton dropdown ne le ferme pas
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) close();
      });
    });

    // Fermer en cliquant à l'extérieur du menu (mobile)
    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 768 && menu.classList.contains('open')) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) close();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function initDropdowns() {
    const toggles = Array.from(document.querySelectorAll('.drop-toggle'));
    if (!toggles.length) return;

    function closeAll() {
      toggles.forEach(function (t) {
        const li = t.closest('.has-dropdown');
        if (li) li.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
      });
    }

    toggles.forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.stopPropagation();
        const li = t.closest('.has-dropdown');
        const willOpen = !li.classList.contains('open');
        closeAll();
        if (willOpen) {
          li.classList.add('open');
          t.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.has-dropdown')) closeAll();
    });
  }

  /* ---------------------------------------------------------------
     4. HEADER, SCROLLSPY, RETOUR HAUT ET WHATSAPP
     --------------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    const toTop = document.getElementById('toTop');
    const waFloat = document.getElementById('waFloat');
    const links = Array.from(document.querySelectorAll('.nav ul a'));
    const sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean)
      .sort(function (a, b) { return a.offsetTop - b.offsetTop; });

    function onScroll() {
      const y = window.scrollY;
      if (header) header.classList.toggle('scrolled', y > 15);
      if (toTop) toTop.classList.toggle('visible', y > 500);
      if (waFloat) waFloat.classList.toggle('visible', y > 300);

      let current = '';
      const offset = 140;
      sections.forEach(function (sec) {
        if (sec.offsetTop - offset <= y) current = sec.id;
      });
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
      document.querySelectorAll('.has-dropdown').forEach(function (li) {
        li.classList.toggle('active', Boolean(li.querySelector('a.active')));
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
     5. BARRE DE PROGRESSION & ANNÉE DYNAMIQUE
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

  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------------
     6. SÉLECTEUR DE LANGUE (FR / EN)
     --------------------------------------------------------------- */
  function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    const meta = document.querySelector('meta[data-i18n="meta_desc"]');
    if (meta) meta.setAttribute('content', dict.meta_desc);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (key === 'meta_desc') return;
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.documentElement.lang = lang;
    updateLangSwitch(lang);

    // Mettre à jour l'impact du don selon la langue
    if (window._updateDonationDisplay) window._updateDonationDisplay();
    document.dispatchEvent(new CustomEvent('vc:lang', { detail: lang }));
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
  }

  function initLanguage() {
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
     7. SÉLECTION DU DON MULTI-DEVISES (EUR / FCFA / USD)
     --------------------------------------------------------------- */
  function initDonationModule() {
    const currButtons = document.querySelectorAll('.currency-tab');
    const amountGrid = document.getElementById('amountGrid');
    const customWrap = document.getElementById('customAmountWrap');
    const customInput = document.getElementById('customAmount');
    const donateBtn = document.getElementById('donateBtn');
    const donateWaBtn = document.getElementById('donateWaBtn');
    const impactText = document.getElementById('donationImpactText');

    if (!amountGrid || !donateBtn) return;

    const CURRENCY_CONFIG = {
      EUR: {
        symbol: '€',
        presets: [15, 50, 100],
        impactKeys: ['impact1', 'impact2', 'impact3'],
        defaultIndex: 2
      },
      XOF: {
        symbol: ' FCFA',
        presets: [5000, 25000, 50000],
        impactKeys: ['impact_xof1', 'impact_xof2', 'impact_xof3'],
        defaultIndex: 2
      },
      USD: {
        symbol: '$',
        presets: [20, 50, 100],
        impactKeys: ['impact1', 'impact2', 'impact3'],
        defaultIndex: 2
      }
    };

    let currentCurrency = 'EUR';
    let selectedAmount = 100;
    let isCustom = false;

    function renderPresetButtons() {
      const conf = CURRENCY_CONFIG[currentCurrency];
      amountGrid.innerHTML = '';

      conf.presets.forEach(function (val, idx) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'amount' + (val === selectedAmount && !isCustom ? ' active' : '');
        btn.setAttribute('data-value', String(val));
        btn.textContent = currentCurrency === 'USD' ? '$' + val : val + (currentCurrency === 'EUR' ? '€' : ' FCFA');
        btn.addEventListener('click', function () {
          isCustom = false;
          selectedAmount = val;
          if (customWrap) customWrap.hidden = true;
          updateUI();
        });
        amountGrid.appendChild(btn);
      });

      const customBtn = document.createElement('button');
      customBtn.type = 'button';
      customBtn.className = 'amount' + (isCustom ? ' active' : '');
      customBtn.setAttribute('data-value', 'custom');
      const lang = localStorage.getItem(LANG_KEY) || 'fr';
      customBtn.textContent = translations[lang].amount_custom || 'Autre montant';
      customBtn.addEventListener('click', function () {
        isCustom = true;
        if (customWrap) customWrap.hidden = false;
        if (customInput) customInput.focus();
        updateUI();
      });
      amountGrid.appendChild(customBtn);
    }

    function updateUI() {
      const lang = localStorage.getItem(LANG_KEY) || 'fr';
      const conf = CURRENCY_CONFIG[currentCurrency];

      // Mise à jour des boutons actifs
      amountGrid.querySelectorAll('.amount').forEach(function (b) {
        const val = b.getAttribute('data-value');
        if (isCustom) {
          b.classList.toggle('active', val === 'custom');
        } else {
          b.classList.toggle('active', val === String(selectedAmount));
        }
      });

      const effectiveVal = isCustom ? (customInput ? parseFloat(customInput.value) || 0 : 0) : selectedAmount;
      const formattedAmount = currentCurrency === 'USD' ? '$' + effectiveVal : effectiveVal + conf.symbol;

      // Calcul impact descriptif
      let impactDesc = '';
      if (!isCustom) {
        const idx = conf.presets.indexOf(selectedAmount);
        if (idx >= 0 && conf.impactKeys[idx]) {
          impactDesc = translations[lang][conf.impactKeys[idx]] || '';
        }
      }
      if (impactText) {
        if (impactDesc) {
          impactText.innerHTML = (lang === 'fr'
            ? '<strong>' + formattedAmount + '</strong> ' + impactDesc
            : '<strong>' + formattedAmount + '</strong> ' + impactDesc);
          impactText.hidden = false;
        } else {
          impactText.hidden = true;
        }
      }

      // Lien e-mail
      if (SITE_CONFIG.DONATION_URL) {
        donateBtn.href = SITE_CONFIG.DONATION_URL;
        donateBtn.target = '_blank';
        donateBtn.rel = 'noopener';
      } else {
        const subject = lang === 'fr' ? 'Intention de Don — ONG Vision Citoyenne' : 'Donation Pledge — Vision Citoyenne NGO';
        const bodyText = lang === 'fr'
          ? 'Bonjour,\n\nJe souhaite soutenir les actions de l\'ONG Vision Citoyenne par un don de ' + formattedAmount + '.\n\nMerci de m\'indiquer les modalités de versement (Mobile Money, Virement bancaire, Carte).'
          : 'Hello,\n\nI would like to support Vision Citoyenne NGO with a donation of ' + formattedAmount + '.\n\nPlease provide payment details (Mobile Money, Wire transfer, Card).';
        donateBtn.href = 'mailto:' + SITE_CONFIG.OFFICIAL_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);
      }

      // Bouton WhatsApp direct
      if (donateWaBtn) {
        const waMsg = lang === 'fr'
          ? 'Bonjour ONG Vision Citoyenne, je souhaite faire un don de ' + formattedAmount + ' pour soutenir vos projets.'
          : 'Hello Vision Citoyenne NGO, I want to make a donation of ' + formattedAmount + ' to support your projects.';
        donateWaBtn.href = 'https://wa.me/' + SITE_CONFIG.WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waMsg);
      }
    }

    window._updateDonationDisplay = updateUI;

    currButtons.forEach(function (tab) {
      tab.addEventListener('click', function () {
        currButtons.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentCurrency = tab.getAttribute('data-currency');
        const conf = CURRENCY_CONFIG[currentCurrency];
        selectedAmount = conf.presets[conf.defaultIndex || 0];
        isCustom = false;
        if (customWrap) customWrap.hidden = true;
        renderPresetButtons();
        updateUI();
      });
    });

    if (customInput) {
      customInput.addEventListener('input', updateUI);
    }

    renderPresetButtons();
    updateUI();
  }

  /* ---------------------------------------------------------------
     8. GESTION DES FORMULAIRES & COPIE 1-CLIC
     --------------------------------------------------------------- */
  function setFormStatus(statusEl, message, type) {
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
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('has-error');
          errorKey = 'required';
        } else {
          field.classList.remove('has-error');
        }
      });

      const email = form.querySelector('input[type="email"]');
      if (valid && email && !EMAIL_RE.test(email.value.trim())) {
        valid = false;
        email.classList.add('has-error');
        errorKey = 'email';
      }

      if (!valid) {
        const msg = errorKey === 'email'
          ? (lang === 'fr' ? 'Veuillez saisir une adresse e-mail valide.' : 'Please enter a valid email address.')
          : (lang === 'fr' ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill in all required fields.');
        setFormStatus(statusEl, msg, 'err');
        return;
      }

      const nameVal = form.querySelector('input[name="name"]') ? form.querySelector('input[name="name"]').value.trim() : '';
      const emailVal = form.querySelector('input[type="email"]') ? form.querySelector('input[type="email"]').value.trim() : '';
      const phoneVal = form.querySelector('input[name="phone"]') ? form.querySelector('input[name="phone"]').value.trim() : '';
      const msgVal = form.querySelector('textarea[name="message"]') ? form.querySelector('textarea[name="message"]').value.trim() : '';

      const isVol = formId === 'volForm';
      const subject = isVol
        ? (lang === 'fr' ? 'Candidature Bénévole — ' + nameVal : 'Volunteer Application — ' + nameVal)
        : (lang === 'fr' ? 'Message Contact — ' + nameVal : 'Contact Message — ' + nameVal);

      const body = encodeURIComponent(
        (lang === 'fr' ? 'Nom' : 'Name') + ' : ' + nameVal + '\n' +
        'E-mail : ' + emailVal + '\n' +
        (phoneVal ? (lang === 'fr' ? 'Téléphone/WhatsApp' : 'Phone/WhatsApp') + ' : ' + phoneVal + '\n' : '') +
        '\n' + (lang === 'fr' ? 'Message' : 'Message') + ' :\n' + msgVal
      );

      const mailto = 'mailto:' + SITE_CONFIG.OFFICIAL_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + body;

      const info = lang === 'fr'
        ? 'Merci ! Cliquez ci-dessous pour finaliser l\'envoi par e-mail :'
        : 'Thank you! Click below to send via your email client:';
      setFormStatus(statusEl, info, 'ok');

      const oldLink = statusEl.querySelector('.form-mail-btn');
      if (oldLink) oldLink.remove();

      const sendLink = document.createElement('a');
      sendLink.className = 'form-mail-btn btn btn-primary';
      sendLink.href = mailto;
      sendLink.style.display = 'inline-flex';
      sendLink.style.marginTop = '10px';
      sendLink.style.fontSize = '0.9rem';
      sendLink.textContent = lang === 'fr' ? 'Ouvrir mon application e-mail →' : 'Open email application →';
      statusEl.appendChild(sendLink);

      form.reset();
    });
  }

  function initNewsletter() {
    const form = document.getElementById('newsForm');
    const statusEl = document.getElementById('newsStatus');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input ? input.value.trim() : '';
      const lang = localStorage.getItem(LANG_KEY) || 'fr';

      if (!email || !EMAIL_RE.test(email)) {
        setFormStatus(statusEl, lang === 'fr' ? 'Adresse e-mail invalide.' : 'Invalid email address.', 'err');
        return;
      }

      if (SITE_CONFIG.NEWSLETTER_ENDPOINT) {
        fetch(SITE_CONFIG.NEWSLETTER_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: email })
        })
          .then(function () {
            setFormStatus(statusEl, lang === 'fr' ? 'Merci ! Vous êtes bien inscrit(e).' : 'Thank you! You are subscribed.', 'ok');
            form.reset();
          })
          .catch(function () {
            setFormStatus(statusEl, lang === 'fr' ? 'Une erreur est survenue.' : 'An error occurred.', 'err');
          });
        return;
      }

      const subject = lang === 'fr' ? 'Inscription newsletter Vision Citoyenne' : 'Vision Citoyenne Newsletter Subscription';
      const mailto = 'mailto:' + SITE_CONFIG.OFFICIAL_EMAIL + '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent((lang === 'fr' ? 'Inscription e-mail' : 'Email subscription') + ' : ' + email);
      setFormStatus(statusEl, lang === 'fr' ? 'Merci ! Confirmez par e-mail ci-dessous :' : 'Click below to confirm by email:', 'ok');

      const old = statusEl.querySelector('a');
      if (old) old.remove();
      const link = document.createElement('a');
      link.href = mailto;
      link.className = 'btn btn-primary btn-sm';
      link.style.display = 'inline-block';
      link.style.marginTop = '8px';
      link.textContent = lang === 'fr' ? 'Confirmer par e-mail →' : 'Confirm via email →';
      statusEl.appendChild(link);
      form.reset();
    });
  }

  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(function () {
            const lang = localStorage.getItem(LANG_KEY) || 'fr';
            showToast(translations[lang].copied_toast || 'Copié dans le presse-papier !');
          });
        } else {
          // Repli
          const input = document.createElement('input');
          input.value = textToCopy;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          const lang = localStorage.getItem(LANG_KEY) || 'fr';
          showToast(translations[lang].copied_toast || 'Copié !');
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     9. COMPTEURS ANIMÉS
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
    }, { threshold: 0.4 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     10. BANDEAU DÉFILANT (MARQUEE)
     --------------------------------------------------------------- */
  function initMarquee() {
    document.querySelectorAll('#marqueeTrack, [data-marquee]').forEach(function (track) {
      const group = track.firstElementChild;
      if (!group) return;
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach(function (img) { img.alt = ''; });
      track.appendChild(clone);
    });
  }

  /* ---------------------------------------------------------------
     11. ACTUALITÉS FACEBOOK OPTIMISÉES (FILTRES + VOIR PLUS + LAZY)
     --------------------------------------------------------------- */
  function initFacebookNews() {
    const embeds = Array.from(document.querySelectorAll('.fb-embed'));
    const filterTabs = document.querySelectorAll('.news-tab');
    const moreBtn = document.getElementById('fbMoreBtn');
    if (!embeds.length) return;

    let currentFilter = 'all';
    let isExpanded = false;
    const INITIAL_COUNT = 6;

    function applyFilterAndVisibility() {
      let visibleCount = 0;
      embeds.forEach(function (item) {
        const isVideo = item.classList.contains('fb-video');
        let matchFilter = true;
        if (currentFilter === 'posts' && isVideo) matchFilter = false;
        if (currentFilter === 'videos' && !isVideo) matchFilter = false;

        if (!matchFilter) {
          item.style.display = 'none';
        } else {
          visibleCount++;
          if (isExpanded || visibleCount <= INITIAL_COUNT) {
            item.style.display = '';
            lazyLoadEmbed(item);
          } else {
            item.style.display = 'none';
          }
        }
      });

      if (moreBtn) {
        const totalMatches = embeds.filter(function (item) {
          const isVideo = item.classList.contains('fb-video');
          if (currentFilter === 'posts' && isVideo) return false;
          if (currentFilter === 'videos' && !isVideo) return false;
          return true;
        }).length;

        if (totalMatches <= INITIAL_COUNT) {
          moreBtn.style.display = 'none';
        } else {
          moreBtn.style.display = 'inline-flex';
          const lang = localStorage.getItem(LANG_KEY) || 'fr';
          moreBtn.textContent = isExpanded
            ? (translations[lang].news_less || 'Afficher moins')
            : (translations[lang].news_more || 'Afficher plus d\'actualités');
        }
      }
    }

    function lazyLoadEmbed(wrap) {
      const iframe = wrap.querySelector('iframe[data-src]');
      if (!iframe) return;

      const src = iframe.getAttribute('data-src');
      let directUrl = src;
      try {
        const u = new URL(src, location.href);
        const href = u.searchParams.get('href');
        if (href) directUrl = decodeURIComponent(href);
      } catch (e) {}

      if (!wrap.querySelector('.fb-fallback')) {
        const fallback = document.createElement('a');
        fallback.className = 'fb-fallback';
        fallback.href = directUrl;
        fallback.target = '_blank';
        fallback.rel = 'noopener';
        const lang = localStorage.getItem(LANG_KEY) || 'fr';
        fallback.innerHTML = '<span class="fb-icon">↗</span> <span>' + (translations[lang].news_fallback || 'Voir sur Facebook') + '</span>';
        wrap.appendChild(fallback);

        iframe.addEventListener('load', function () {
          wrap.classList.add('loaded');
        });
        iframe.addEventListener('error', function () {
          iframe.style.display = 'none';
          fallback.classList.add('visible');
        });
      }

      iframe.src = src;
      iframe.removeAttribute('data-src');
    }

    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentFilter = tab.getAttribute('data-filter');
        isExpanded = false;
        applyFilterAndVisibility();
      });
    });

    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        isExpanded = !isExpanded;
        applyFilterAndVisibility();
      });
    }

    applyFilterAndVisibility();
  }

  /* ---------------------------------------------------------------
     12. GALERIE PHOTOS & LIGHTBOX AVEC SWIPE TACTILE
     --------------------------------------------------------------- */
  function initGalerie() {
    // Récupère la liste : override dynamique (admin) OU array par défaut
    const source = (window.GALERIE_OVERRIDE && window.GALERIE_OVERRIDE.length)
      ? window.GALERIE_OVERRIDE
      : (typeof GALERIE !== 'undefined' ? GALERIE : null);
    if (!source) return;

    const grid = document.getElementById('galerieGrid');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCaption = document.getElementById('lbCaption');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    if (!grid || !lightbox || !lbImg || !lbCaption) return;

    // Reset : évite les doublons si init est appelée deux fois (override admin)
    grid.innerHTML = '';

    // data-cats="avant,travaux" limite la grille à certaines catégories (page Projets)
    const allowedCats = (grid.dataset.cats || '').split(',').filter(Boolean);
    const images = source.map(function (item) {
      var rawSrc = Array.isArray(item) ? item[0] : item.image;
      var caption = Array.isArray(item) ? (item[1] || '') : (item.caption || '');
      var cat = Array.isArray(item) ? (item[2] || '') : (item.category || '');
      var src = (rawSrc && (rawSrc.indexOf('data:') === 0 || rawSrc.indexOf('http') === 0))
        ? rawSrc
        : 'assets/img/galerie/' + rawSrc;
      return { src: src, caption: caption, cat: cat };
    }).filter(function (img) {
      return !allowedCats.length || allowedCats.indexOf(img.cat) !== -1;
    });

    var filtersWrap = document.getElementById('galFilters');
    var preset = filtersWrap && filtersWrap.querySelector('.gal-filter.active');
    var activeCat = (preset && preset.dataset.cat) || 'all';
    var visibleImages = images.slice();
    var current = -1;
    var trigger = null;

    function show(index) {
      current = (index + visibleImages.length) % visibleImages.length;
      lbImg.src = visibleImages[current].src;
      lbImg.alt = visibleImages[current].caption;
      lbCaption.textContent = visibleImages[current].caption;
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

    function renderGrid() {
      grid.innerHTML = '';
      visibleImages = activeCat === 'all'
        ? images.slice()
        : images.filter(function (img) { return img.cat === activeCat; });

      visibleImages.forEach(function (img, i) {
        var figure = document.createElement('figure');
        figure.className = 'gal-item reveal';
        figure.setAttribute('role', 'button');
        figure.tabIndex = 0;
        figure.setAttribute('aria-label', img.caption || 'Photo ' + (i + 1));

        var el = document.createElement('img');
        el.src = img.src;
        el.alt = img.caption;
        el.loading = 'lazy';
        figure.appendChild(el);

        var cap = document.createElement('figcaption');
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

      if (typeof initReveal === 'function') initReveal();
    }

    if (filtersWrap) {
      filtersWrap.addEventListener('click', function (e) {
        var btn = e.target.closest('.gal-filter');
        if (!btn) return;
        activeCat = btn.dataset.cat || 'all';
        filtersWrap.querySelectorAll('.gal-filter').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderGrid();
      });
    }

    renderGrid();

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

    // Support du geste de balayage tactile (swipe) sur mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff < 0) show(current + 1); // swipe gauche -> suivant
        else show(current - 1);          // swipe droite -> précédent
      }
    }
  }

  /* ---------------------------------------------------------------
     12b. COMPARATEUR AVANT / APRÈS (glisser à la souris, au doigt ou au clavier)
     --------------------------------------------------------------- */
  function initCompare() {
    document.querySelectorAll('.ba').forEach(function (fig) {
      const range = fig.querySelector('.ba-range');
      if (!range) return;
      let dragging = false;

      function setPos(value) {
        const v = Math.max(0, Math.min(100, value));
        fig.style.setProperty('--pos', v + '%');
        range.value = String(Math.round(v));
      }
      function fromPointer(e) {
        const rect = fig.getBoundingClientRect();
        setPos(((e.clientX - rect.left) / rect.width) * 100);
      }

      range.addEventListener('input', function () { setPos(parseFloat(range.value)); });

      fig.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        fromPointer(e);
        dragging = true;
        fig.classList.add('is-dragging');
        fig.setPointerCapture(e.pointerId);
      });
      fig.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
      function stop() { dragging = false; fig.classList.remove('is-dragging'); }
      fig.addEventListener('pointerup', stop);
      fig.addEventListener('pointercancel', stop);

      setPos(parseFloat(range.value) || 50);
    });
  }

  /* ---------------------------------------------------------------
     13. ANIMATIONS AU SCROLL (IntersectionObserver)
     --------------------------------------------------------------- */
  function initReveal() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.card, .section-head, .testi-card, .donate-card, .vol-form, .contact-form, .real-card, .recog-card, .partner-card, .about-value-card').forEach(function (el) {
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
          entry.target.style.transitionDelay = Math.min(idx, 5) * 50 + 'ms';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     14. INITIALISATION GLOBALE
     --------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initDropdowns();
    initHeaderScroll();
    initScrollProgress();
    initYear();
    initLanguage();
    initDonationModule();
    initForm('volForm', 'volStatus');
    initForm('contactForm', 'contactStatus');
    initNewsletter();
    initCopyButtons();
    initCounters();
    initMarquee();
    initFacebookNews();
    initGalerie();
    initCompare();
    initReveal();

    // Exposé pour permettre au content-renderer de relancer après changement dynamique
    window.initFacebookNews = initFacebookNews;
    window.initReveal = initReveal;
    window.initCopyButtons = initCopyButtons;
    window.initGalerie = initGalerie;
  });

  /* ---------------------------------------------------------------
     15. ENREGISTREMENT SERVICE WORKER (PWA)
     --------------------------------------------------------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('./sw.js')
        .then(function (reg) {
          console.log('[PWA] Service Worker actif (scope:', reg.scope, ')');
        })
        .catch(function (err) {
          console.warn('[PWA] Échec enregistrement SW:', err);
        });
    });
  }

})();
