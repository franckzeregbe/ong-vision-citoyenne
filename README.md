# Site web — ONG Vision Citoyenne

Site vitrine bilingue (FR / EN) pour l'ONG **Vision Citoyenne**, spécialisée dans
l'**Eau, l'Hygiène et l'Assainissement (WASH) en milieu scolaire et communautaire**.

## Contenu

- `index.html` — structure et contenu du site (11 sections)
- `css/style.css` — design moderne, responsive (mobile / tablette / bureau)
- `js/main.js` — menu mobile + menus déroulants, langue FR/EN, animations, formulaires

> **Logos partenaires** — un logo image remplace automatiquement le badge texte
> lorsqu'un fichier `assets/partenaires/<code>.<png|jpg|webp>` (fond blanc,
> format paysage ~600×330) est lié par une balise `<img class="partner-logo" …>`
> dans la carte du partenaire (`onu.jpg`, `minhas.png`, `ippdr.webp`).

## Sections

1. Accueil (hero, stats animées, scroll)
2. À propos / Mission (valeurs, ODD 6)
3. Reconnaissances & partenaires institutionnels (ONG, PASEA)
4. Projets & réalisations (PASEA — Eau & Assainissement)
5. Partenaires (ONU, MINHAS, IPPDR)
6. Nos actions (Eau, Assainissement, Hygiène, WASH scolaire, hygiène menstruelle, mobilisation)
7. Actualités (fil Facebook embarqué)
8. Galerie photos
9. Témoignages
10. Faire un Don
11. Devenir bénévole
12. Contact

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
- **Statistiques du hero** : les 4 compteurs animés dans la section `#accueil`
  (`.hero-stats`). Pour modifier les chiffres, ajustez les attributs
  `data-count` et `data-suffix` dans `index.html` (ex : `data-count="2"`).
  Les libellés sont traduits via les clés `stat1` à `stat4` dans `js/main.js`.
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
