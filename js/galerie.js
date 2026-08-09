/* ================================================================
   GALERIE PHOTOS — MODE D'EMPLOI POUR LES ADMINISTRATEURS

   Pour ajouter une photo au site, suivez ces 3 étapes :

   1. Copiez le fichier photo dans le dossier :  assets/galerie/
      Formats acceptés : jpg, jpeg, png, webp.
      Taille recommandée : ~300 à 500 Ko maximum, largeur 1200 px
      maximum (photos plus lourdes = site plus lent).
   2. Ajoutez une ligne dans la liste GALERIE ci-dessous :
        [ "nom-du-fichier.jpg", "Légende de la photo" ]
      (le nom du fichier doit correspondre EXACTEMENT au fichier
      copié à l'étape 1 ; la légende est facultative : laissez ""
      pour une photo sans légende)
   3. Enregistrez le fichier et rechargez la page. C'est tout !

   Ne modifiez que la liste ci-dessous : le reste du code JS de
   cette page ne doit pas être changé. L'ordre des lignes = l'ordre
   d'affichage des photos.
   ================================================================ */

const GALERIE = [
  ["ecole.jpg", "Élèves d'une école primaire"],
  ["eau.jpg", "Accès à l'eau potable"],
  ["communaute.jpg", "Mobilisation communautaire"],
  ["mains.jpg", "Sensibilisation au lavage des mains"],
  ["enfants.jpg", "Enfants de la communauté"]
];
