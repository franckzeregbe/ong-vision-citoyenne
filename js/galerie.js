/* ================================================================
   GALERIE PHOTOS — MODE D'EMPLOI POUR LES ADMINISTRATEURS

   Pour ajouter une photo au site, suivez ces 3 étapes :

   1. Copiez le fichier photo dans le dossier :  assets/img/galerie/
   2. Ajoutez une ligne dans la liste GALERIE ci-dessous :
        [ "nom-du-fichier.jpg", "Légende de la photo", "catégorie" ]
   3. Enregistrez le fichier et rechargez la page. C'est tout !

   Catégories disponibles : "don", "sensibilisation", "terrain",
   "renovation", "ceremonie"
   ================================================================ */

const GALERIE = [
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
  ["suivi-projet.jpg", "Suivi et évaluation de projet dans un établissement scolaire", "terrain"],
  ["../projets/renovation-epp/avant-sanitaires.jpg", "EPP SICOGI 1 — État des sanitaires avant rénovation (Juillet 2026)", "renovation"],
  ["../projets/renovation-epp/apres-aire-jeux.jpg", "EPP SICOGI 1 — Aire de jeux rénovée avec fresque murale éducative", "renovation"],
  ["../projets/renovation-epp/apres-cour.jpg", "EPP SICOGI 1 — Cour de récréation et toboggan après rénovation", "renovation"],
  ["../projets/renovation-epp/apres-batiment.jpg", "EPP SICOGI 1 — Bâtiments et espaces rénovés", "renovation"],
  ["../projets/renovation-epp/ceremonie-equipe.jpg", "Cérémonie d'inauguration — Bénévoles avec le drapeau Verdis", "ceremonie"],
  ["../projets/renovation-epp/ceremonie-vc.jpg", "Membre de l'ONG devant la bannière Vision Citoyenne", "ceremonie"],
  ["../projets/renovation-epp/ceremonie-officiel.jpg", "Accueil des officiels lors de l'inauguration — 09 Septembre 2026", "ceremonie"],
  ["../projets/renovation-epp/ceremonie-ippdr.jpg", "Bannière IPPDR lors de la cérémonie d'inauguration de l'EPP SICOGI 1", "ceremonie"]
];
