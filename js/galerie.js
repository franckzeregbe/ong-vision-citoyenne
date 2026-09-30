/* ================================================================
   GALERIE PHOTOS — MODE D'EMPLOI POUR LES ADMINISTRATEURS

   Pour ajouter une photo au site, suivez ces 3 étapes :

   1. Copiez le fichier photo dans le dossier :  assets/img/galerie/
   2. Ajoutez une ligne dans la liste GALERIE ci-dessous :
        [ "nom-du-fichier.jpg", "Légende de la photo", "catégorie" ]
   3. Enregistrez le fichier et rechargez la page. C'est tout !

   Catégories disponibles : "avant", "travaux", "apres", "ceremonie",
   "don", "sensibilisation", "terrain",
   "pasea-mob", "pasea-form", "pasea-chantier", "pasea-remise"
   (les catégories EPP et PASEA alimentent aussi la page Projets)
   ================================================================ */

const EPP = "../projets/renovation-epp/";
const PASEA = "../projets/pasea/";

const GALERIE = [
  // EPP SICOGI 1 — Inauguration (9 septembre 2026)
  [EPP + "inauguration-ruban.jpg", "EPP SICOGI 1 — Coupure du ruban devant le bloc sanitaire rénové, 9 septembre 2026", "ceremonie"],
  [EPP + "inauguration-groupe.jpg", "EPP SICOGI 1 — Élèves, enseignants et partenaires devant les nouvelles toilettes", "ceremonie"],
  [EPP + "inauguration-discours.jpg", "EPP SICOGI 1 — Discours de la Présidente Wassia MADOU lors de l'inauguration", "ceremonie"],
  [EPP + "inauguration-visite.jpg", "EPP SICOGI 1 — Les invités visitent les sanitaires rénovés", "ceremonie"],
  [EPP + "inauguration-eleves.jpg", "EPP SICOGI 1 — Les élèves réunis sous le chapiteau pour la cérémonie", "ceremonie"],
  [EPP + "inauguration-officiels.jpg", "EPP SICOGI 1 — Photo officielle avec les élèves et les autorités", "ceremonie"],
  [EPP + "inauguration-animation.jpg", "EPP SICOGI 1 — Animation présentée par les élèves pendant la cérémonie", "ceremonie"],
  [EPP + "ceremonie-officiel.jpg", "Accueil des officiels lors de l'inauguration — 9 septembre 2026", "ceremonie"],
  [EPP + "ceremonie-equipe.jpg", "Cérémonie d'inauguration — Bénévoles avec le drapeau de Verdis", "ceremonie"],
  [EPP + "ceremonie-vc.jpg", "Membre de l'ONG devant la bannière Vision Citoyenne", "ceremonie"],
  [EPP + "ceremonie-ippdr.jpg", "Bannière IPPDR lors de la cérémonie d'inauguration de l'EPP SICOGI 1", "ceremonie"],
  [EPP + "don-kits-hygiene.jpg", "EPP SICOGI 1 — Kits d'hygiène offerts à l'école : seaux, balais et savon liquide", "don"],
  [EPP + "don-kits-scolaires.jpg", "EPP SICOGI 1 — Remise de kits scolaires aux élèves", "don"],

  // EPP SICOGI 1 — Après rénovation (août – septembre 2026)
  [EPP + "apres-toilettes.jpg", "EPP SICOGI 1 — Le bloc « Toilettes » repeint, sol pavé et regards neufs", "apres"],
  [EPP + "apres-mur-accueil.jpg", "EPP SICOGI 1 — Nouveau mur d'accueil « Bienvenue au Préscolaire SICOGI 1 »", "apres"],
  [EPP + "apres-aire-jeux-vue.jpg", "EPP SICOGI 1 — L'aire de jeux terminée : balançoires, toboggan et fresque des chiffres", "apres"],
  [EPP + "apres-bloc-toilettes.jpg", "EPP SICOGI 1 — Bloc sanitaire rénové et bordures en pneus recyclés", "apres"],
  [EPP + "apres-manege.jpg", "EPP SICOGI 1 — Manège et balançoires installés pour les plus petits", "apres"],
  [EPP + "apres-toboggan.jpg", "EPP SICOGI 1 — Toboggan neuf devant la fresque éducative", "apres"],
  [EPP + "apres-fresque-alphabet.jpg", "EPP SICOGI 1 — Fresque éducative « abcd 1234 » terminée", "apres"],
  [EPP + "apres-cour-ensemble.jpg", "EPP SICOGI 1 — Vue d'ensemble de la cour rénovée", "apres"],
  [EPP + "apres-cour-regards.jpg", "EPP SICOGI 1 — Cour assainie : regards neufs et espaces délimités", "apres"],
  [EPP + "apres-aire-jeux.jpg", "EPP SICOGI 1 — Mobilier de jeux neuf pour les enfants", "apres"],
  [EPP + "apres-cour.jpg", "EPP SICOGI 1 — Aire de jeux avec fresque murale éducative", "apres"],
  [EPP + "apres-batiment.jpg", "EPP SICOGI 1 — Bâtiments et espaces rénovés", "apres"],

  // EPP SICOGI 1 — Pendant les travaux (juillet – août 2026)
  [EPP + "travaux-fosse.jpg", "EPP SICOGI 1 — Construction d'une nouvelle fosse : pose des parpaings", "travaux"],
  [EPP + "travaux-fosse-maconnerie.jpg", "EPP SICOGI 1 — Maçonnerie de la fosse septique", "travaux"],
  [EPP + "travaux-regard.jpg", "EPP SICOGI 1 — Regard de filtration rempli de gravier", "travaux"],
  [EPP + "travaux-bloc.jpg", "EPP SICOGI 1 — Terrassement autour du bloc sanitaire", "travaux"],
  [EPP + "travaux-bordures.jpg", "EPP SICOGI 1 — Pose des bordures de la cour", "travaux"],
  [EPP + "travaux-cabines-carrelees.jpg", "EPP SICOGI 1 — Cabines de toilettes entièrement carrelées", "travaux"],
  [EPP + "travaux-carrelage.jpg", "EPP SICOGI 1 — Carrelage neuf dans les sanitaires", "travaux"],
  [EPP + "travaux-peinture-bloc.jpg", "EPP SICOGI 1 — Mise en peinture du bloc « Toilettes »", "travaux"],
  [EPP + "travaux-mur-accueil.jpg", "EPP SICOGI 1 — Préparation du nouveau mur d'accueil", "travaux"],
  [EPP + "travaux-fresque-debut.jpg", "EPP SICOGI 1 — Début de la fresque : le ciel et le soleil", "travaux"],
  [EPP + "travaux-fresque.jpg", "EPP SICOGI 1 — La fresque prend forme", "travaux"],
  [EPP + "travaux-fresque-alphabet.jpg", "EPP SICOGI 1 — Finitions de la fresque éducative", "travaux"],

  // EPP SICOGI 1 — Avant les travaux (juillet 2026)
  [EPP + "avant-sanitaires.jpg", "EPP SICOGI 1 — État des sanitaires avant rénovation, juillet 2026", "avant"],
  [EPP + "avant-cabine.jpg", "EPP SICOGI 1 — Cabine de toilettes vétuste avant les travaux", "avant"],
  [EPP + "avant-ecole.jpg", "EPP SICOGI 1 — Salle d'eau dégradée : murs tachés, carrelage abîmé", "avant"],
  [EPP + "avant-cabine-2.jpg", "EPP SICOGI 1 — Toilettes sans porte ni revêtement", "avant"],
  [EPP + "avant-evacuation.jpg", "EPP SICOGI 1 — Évacuation dégradée et sol souillé", "avant"],
  [EPP + "avant-cabine-exterieur.jpg", "EPP SICOGI 1 — Ancienne cabine extérieure, peinture écaillée", "avant"],
  [EPP + "avant-mur-bloc.jpg", "EPP SICOGI 1 — L'ancien mur « Bienvenue » et le bloc sanitaire", "avant"],
  [EPP + "avant-cour.jpg", "EPP SICOGI 1 — Sol de terre et déchets au pied du mur d'accueil", "avant"],
  [EPP + "avant-dechets.jpg", "EPP SICOGI 1 — Déchets évacués lors du nettoyage du site", "avant"],

  // Projet pilote PASEA Hambol (2026)
  [PASEA + "mobilisation-village.jpg", "PASEA Hambol — Réunion de mobilisation communautaire dans un village", "pasea-mob"],
  [PASEA + "reunion-communautaire.jpg", "PASEA Hambol — Présentation du projet aux habitants", "pasea-mob"],
  [PASEA + "sensibilisation-menages.jpg", "PASEA Hambol — Échanges avec les ménages sur l'assainissement familial", "pasea-mob"],
  [PASEA + "formation-artisans.jpg", "PASEA Hambol — Formation des artisans aux techniques de construction", "pasea-form"],
  [PASEA + "formation-salle.jpg", "PASEA Hambol — Session de formation des membres des TPE", "pasea-form"],
  [PASEA + "formation-echanges.jpg", "PASEA Hambol — Temps d'échange pendant la formation", "pasea-form"],
  [PASEA + "formation-securite.jpg", "PASEA Hambol — Formation en tenue de sécurité", "pasea-form"],
  [PASEA + "tpe-formees.jpg", "PASEA Hambol — Les artisans des TPE réunis après la formation", "pasea-form"],
  [PASEA + "equipe-tpe.jpg", "PASEA Hambol — Équipe d'une TPE avec ses équipements de protection", "pasea-chantier"],
  [PASEA + "tpe-chantier.jpg", "PASEA Hambol — Artisans des TPE réunis sur un chantier", "pasea-chantier"],
  [PASEA + "implantation-latrine.jpg", "PASEA Hambol — Implantation d'une latrine chez un ménage", "pasea-chantier"],
  [PASEA + "ferraillage-dalle.jpg", "PASEA Hambol — Ferraillage d'une dalle", "pasea-chantier"],
  [PASEA + "moulage-fosse.jpg", "PASEA Hambol — Mise en place du moule d'une fosse", "pasea-chantier"],
  [PASEA + "fosses-cuvette-sato.jpg", "PASEA Hambol — Double fosse et cuvette SaTo avant la pose de la cabine", "pasea-chantier"],
  [PASEA + "construction-cabine.jpg", "PASEA Hambol — Construction de la cabine en parpaings", "pasea-chantier"],
  [PASEA + "construction-superstructure.jpg", "PASEA Hambol — Élévation de la superstructure", "pasea-chantier"],
  [PASEA + "finitions-latrine.jpg", "PASEA Hambol — Finitions et pose de la tuyauterie", "pasea-chantier"],
  [PASEA + "latrine-livree.jpg", "PASEA Hambol — Une latrine familiale terminée", "pasea-remise"],
  [PASEA + "remise-latrine-menage.jpg", "PASEA Hambol — Remise de la latrine au ménage bénéficiaire", "pasea-remise"],
  [PASEA + "remise-kits-tpe.jpg", "PASEA Hambol — Remise officielle de kits de matériel aux TPE", "pasea-remise"],
  [PASEA + "ceremonie-remise-kits.jpg", "PASEA Hambol — Cérémonie de remise des équipements", "pasea-remise"],

  // Actions 2022
  ["don-unicef-materiel.jpg", "Don UNICEF : matériel d'hygiène remis au Lycée Moderne Inagohi — San Pedro", "don"],
  ["don-unicef-remise.jpg", "Remise officielle du don UNICEF aux élèves et au personnel du lycée", "don"],
  ["don-unicef-groupe.jpg", "Photo de groupe lors de la remise du don UNICEF — Mars 2022", "don"],
  ["engagement-citoyen-ecole.jpg", "Sensibilisation scolaire « Engagement Citoyen » auprès des élèves", "sensibilisation"],
  ["sensibilisation-classe.jpg", "Intervention en classe : hygiène et lavage des mains", "sensibilisation"],
  ["mobilisation-scolaire.jpg", "Mobilisation dans la cour de l'école — Engagement Citoyen, Mai 2022", "sensibilisation"],
  ["sensibilisation-eleves.jpg", "Les élèves participent activement à la sensibilisation", "sensibilisation"],
  ["distribution-hygiene.jpg", "Distribution de kits d'hygiène et de produits d'entretien", "terrain"],
  ["distribution-nord.jpg", "Remise de matériel dans une école du Nord — Mai 2022", "terrain"],
  ["equipe-terrain.jpg", "L'équipe Vision Citoyenne sur le terrain", "terrain"],
  ["action-terrain-ecole.jpg", "Action de terrain dans une école partenaire", "terrain"],
  ["suivi-projet.jpg", "Suivi et évaluation de projet dans un établissement scolaire", "terrain"]
];
