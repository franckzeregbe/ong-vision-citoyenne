# Site web — ONG Vision Citoyenne

Site vitrine bilingue (FR / EN) pour l'ONG **Vision Citoyenne**, spécialisée dans
l'**Eau, l'Hygiène et l'Assainissement (WASH) en milieu scolaire et communautaire**.

## Contenu

- `index.html` — structure et contenu du site (6 sections)
- `css/style.css` — design moderne, responsive (mobile / tablette / bureau)
- `js/main.js` — menu mobile, langue FR/EN, animations, formulaires

## Sections

1. Accueil
2. À propos / Mission
3. Nos actions (Eau, Assainissement, Hygiène, WASH scolaire, hygiène menstruelle, mobilisation)
4. Faire un don
5. Devenir bénévole
6. Contact

## Galerie — ajouter des photos

La galerie du site (`#galerie` sur `index.html`) est alimentée par le tableau
`GALERIE` dans `js/galerie.js`. Les photos sont stockées dans `assets/galerie/`.

Pour ajouter une photo, 3 étapes :

1. **Copiez le fichier photo** dans le dossier `assets/galerie/`.
   Formats acceptés : `jpg`, `jpeg`, `png`, `webp`.
   Taille recommandée : ~300 à 500 Ko maximum, largeur 1200 px maximum
   (des photos plus lourdes ralentissent le site).
2. **Ajoutez une ligne** dans le tableau `GALERIE` de `js/galerie.js` :
   ```
   ["nom-du-fichier.jpg", "Légende de la photo"]
   ```
   Le nom du fichier doit correspondre exactement au fichier copié à
   l'étape 1. Une légende vide `""` est autorisée (photo sans légende).
   L'ordre des lignes = l'ordre d'affichage des photos.
3. **Rechargez la page** : la photo apparaît dans la galerie.

Ne modifiez que la liste `GALERIE` dans `js/galerie.js` — le reste du code JS
ne doit pas être changé.

## Lancer le site en local

Double-cliquez simplement sur `index.html`, ou pour un rendu optimal avec un
petit serveur :

```powershell
# Depuis le dossier SITE, si Python est installé :
python -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Personnalisation (à faire)

Remplacez les valeurs entre crochets et coordonnées :

- **Adresse / téléphone / e-mail** : dans `index.html`, section `#contact`
  (`ongvisioncitoyenne@gmail.com`, `(+225) 27 23 25 87 65`, Yopougon Niangon Sud, Abidjan).
- **Réseaux sociaux** : liens `Facebook / Instagram / LinkedIn` dans `#contact`.
- **Statistiques du hero** : chiffres dans la section `#accueil`.
- **Traductions** : si vous modifiez un texte dans `index.html`, mettez à jour
  la clé correspondante (`data-i18n`) dans `js/main.js` (objets `fr` et `en`).

### Activer les formulaires (envoi réel)

Les formulaires valident les champs mais n'envoient rien (site statique).
Pour recevoir les messages par e-mail sans backend, utilisez un service comme
[Formspree](https://formspree.io) :

1. Créez un formulaire sur Formspree et récupérez votre URL.
2. Dans `js/main.js`, fonction `initForm`, décommentez et adaptez le bloc
   `fetch('https://formspree.io/f/XXXX', ...)`.

### Activer les dons

Le bouton « Faire un don » ouvre un e-mail. Pour de vrais paiements, remplacez
le lien `mailto:` (section `#don` dans `index.html`) par un lien vers votre
plateforme (HelloAsso, Stripe, PayPal, etc.).

## Mise en ligne (hébergement gratuit)

- **Netlify** : glissez-déposez le dossier `SITE` sur https://app.netlify.com/drop
- **Vercel** : `vercel` depuis le dossier, ou import depuis GitHub
- **GitHub Pages** : poussez le dossier dans un dépôt, activez Pages sur la branche `main`

Aucune étape de build n'est nécessaire.
