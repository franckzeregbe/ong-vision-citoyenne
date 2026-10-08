/* ================================================================
   PARTENAIRES ET TÉMOIGNAGES
   Fichier mis à jour par l'espace admin : https://ongvici.org/admin/
   Affichés sur la page partenaires.html.
   ================================================================ */

const PARTNERS = [
    {
        "logo": "assets/partenaires/onu.jpg",
        "tag": "int",
        "fr": {
            "name": "Organisation des Nations Unies",
            "desc": "Institution internationale de référence, avec laquelle l'ONG est engagée pour les Objectifs de Développement Durable, notamment l'ODD 6."
        },
        "en": {
            "name": "United Nations Organization",
            "desc": "Leading international institution with which our NGO is engaged for the Sustainable Development Goals, notably SDG 6."
        }
    },
    {
        "logo": "assets/partenaires/minhas.png",
        "tag": "gov",
        "fr": {
            "name": "Ministère de l'Hydraulique, de l'Assainissement et de la Salubrité",
            "desc": "Ministère de Côte d'Ivoire chargé de la politique nationale en matière d'hydraulique, d'accès à l'eau potable, d'assainissement et de salubrité."
        },
        "en": {
            "name": "Ministry of Water, Sanitation and Cleanliness",
            "desc": "Ministry of Ivory Coast in charge of the national policy on hydraulics, safe water access, sanitation and cleanliness."
        }
    },
    {
        "logo": "assets/partenaires/ippdr.webp",
        "tag": "dip",
        "fr": {
            "name": "Institute of Public Policy & Diplomacy Research",
            "desc": "Institut international basé à New York, engagé pour la paix, la sécurité, les droits humains et le développement durable."
        },
        "en": {
            "name": "Institute of Public Policy & Diplomacy Research",
            "desc": "International institute based in New York, committed to peace, security, human rights and sustainable development."
        }
    },
    {
        "logo": "assets/partenaires/eicf.jpg",
        "tag": "ngo",
        "fr": {
            "name": "ONG EICF",
            "desc": "Organisation partenaire engagée dans le renforcement des capacités communautaires, l'éducation civique et la solidarité de proximité."
        },
        "en": {
            "name": "EICF NGO",
            "desc": "Partner organization committed to community empowerment, civic education and local solidarity initiatives."
        }
    },
    {
        "logo": "assets/partenaires/verdis.png",
        "tag": "gov",
        "fr": {
            "name": "Government of Verdis",
            "desc": "Partenaire institutionnel du Gouvernement de Verdis, engagé pour la coopération internationale, la solidarité entre les peuples et le développement durable."
        },
        "en": {
            "name": "Government of Verdis",
            "desc": "Institutional partner from the Government of Verdis, committed to international cooperation, solidarity between peoples and sustainable development."
        }
    },
    {
        "logo": "assets/partenaires/hff.jpeg",
        "tag": "hum",
        "fr": {
            "name": "Humanitarian Focus Foundation",
            "desc": "Organisation humanitaire internationale engagée dans l'aide aux populations vulnérables, la protection des droits humains et le développement durable à travers le monde."
        },
        "en": {
            "name": "Humanitarian Focus Foundation",
            "desc": "International humanitarian organization committed to supporting vulnerable populations, protecting human rights and advancing sustainable development worldwide."
        }
    },
    {
        "logo": "assets/partenaires/unicef.png",
        "tag": "int",
        "fr": {
            "name": "UNICEF",
            "desc": "Fonds des Nations Unies pour l'enfance, partenaire majeur pour la protection des droits des enfants, l'accès à l'éducation, à l'eau potable et à l'hygiène."
        },
        "en": {
            "name": "UNICEF",
            "desc": "United Nations Children's Fund, key partner for child rights, education access, safe drinking water and hygiene."
        }
    },
    {
        "logo": "assets/partenaires/ecosoc.jpg",
        "tag": "int",
        "fr": {
            "name": "ECOSOC — Conseil économique et social de l'ONU",
            "desc": "Organe central de coordination des activités économiques et sociales de l'ONU. L'ONG Vision Citoyenne y bénéficie d'un statut consultatif pour porter la voix des communautés."
        },
        "en": {
            "name": "ECOSOC — United Nations Economic and Social Council",
            "desc": "Central coordinating body for the economic and social work of the UN. ONG Vision Citoyenne holds consultative status there to voice community concerns."
        }
    },
    {
        "logo": "assets/partenaires/banque-mondiale.jpg",
        "tag": "int",
        "fr": {
            "name": "Banque Mondiale",
            "desc": "Institution financière internationale soutenant le développement économique et social, notamment via des programmes eau, assainissement et santé dans les pays en développement."
        },
        "en": {
            "name": "World Bank",
            "desc": "International financial institution supporting economic and social development, notably through water, sanitation and health programmes in developing countries."
        }
    },
    {
        "logo": "assets/partenaires/iom.jpg",
        "tag": "int",
        "fr": {
            "name": "OIM — Organisation Internationale pour les Migrations",
            "desc": "Agence des Nations Unies chargée des migrations. Partenaire pour l'accompagnement des populations déplacées et l'accès aux services essentiels dans les zones sensibles."
        },
        "en": {
            "name": "IOM — International Organization for Migration",
            "desc": "The UN agency for migration. Partner for supporting displaced populations and access to essential services in sensitive areas."
        }
    },
    {
        "logo": "assets/partenaires/usaid.svg",
        "tag": "coop",
        "fr": {
            "name": "USAID",
            "desc": "Agence des États-Unis pour le développement international, soutenant les programmes de santé, d'éducation et d'eau-assainissement en Afrique de l'Ouest."
        },
        "en": {
            "name": "USAID",
            "desc": "United States Agency for International Development, backing health, education and WASH programmes across West Africa."
        }
    },
    {
        "logo": "assets/partenaires/piducas.png",
        "tag": "gov",
        "fr": {
            "name": "PIDUCAS",
            "desc": "Projet d'Infrastructures pour le Développement Urbain et la Compétitivité des Agglomérations Économiques Secondaires. Partenaire opérationnel sur les projets d'infrastructures WASH."
        },
        "en": {
            "name": "PIDUCAS",
            "desc": "Urban Development and Competitiveness Infrastructure Project for Secondary Economic Agglomerations. Operational partner on WASH infrastructure projects."
        }
    }
];

const TESTIMONIALS = [
    {
        "initials": "AK",
        "fr": {
            "quote": "Depuis l'installation du point d'eau, les enfants ne manquent plus l'école pour aller chercher de l'eau.",
            "name": "M. Kouamé",
            "role": "Directeur d'école, Yopougon"
        },
        "en": {
            "quote": "Since the water point was built, children no longer miss school to fetch water miles away.",
            "name": "Mr Kouamé",
            "role": "School Principal, Yopougon"
        }
    },
    {
        "initials": "AM",
        "fr": {
            "quote": "Les latrines séparées ont redonné confiance aux filles, qui restent en classe toute la journée.",
            "name": "Mme Traoré",
            "role": "Enseignante, Abidjan"
        },
        "en": {
            "quote": "Separate latrines have restored girls’ confidence, allowing them to stay in class all day.",
            "name": "Mrs Traoré",
            "role": "Teacher, Abidjan"
        }
    },
    {
        "initials": "SD",
        "fr": {
            "quote": "Notre comité gère l'ouvrage ensemble : c'est notre santé, c'est notre fierté.",
            "name": "Mme Sidibé",
            "role": "Membre du comité de gestion"
        },
        "en": {
            "quote": "Our committee manages the water point together: it protects our health and gives us pride.",
            "name": "Mrs Sidibé",
            "role": "Water Management Committee Member"
        }
    }
];
