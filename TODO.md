# TODO — Améliorations du site ONG Vision Citoyenne

## Réalisé

- [x] **Structure & Nettoyage du code**
  - Nettoyage d'index.html (suppression de milliers de lignes vides superflues).
  - Normalisation sémantique et accessibilité (ARIA, skip-link, labels).
  - Création du .gitignore pour écarter les sauvegardes et fichiers temporaires.
  - Enregistrement relatif universel du Service Worker (sw.js & manifest.json).

- [x] **Partenaires & Institutionnels**
  - Intégration des logos et fiches de **5 partenaires** (ONU, MINHAS, IPPDR, ONG EICF, Verdis).
  - Fichiers d'images normalisés dans ssets/partenaires/.
  - Badges distinctifs (International, Gouvernement, Diplomatie, ONG Partenaire, Environnement).

- [x] **Module de Don Multi-Devises**
  - Sélecteur de devises (€ EUR / FCFA XOF / $ USD) avec montants adaptés.
  - Estimation et affichage dynamique de l'impact direct selon le montant choisi.
  - Possibilité de don direct via WhatsApp avec message pré-rempli.
  - Support de l'URL personnalisée (SITE_CONFIG.DONATION_URL) avec repli par e-mail.

- [x] **Actualités & Réseaux Sociaux**
  - Filtres des actualités (Toutes / Publications / Vidéos & Reels).
  - Affichage optimisé avec bouton « Afficher plus d'actualités » (évite la surcharge réseau).
  - Liens de secours Facebook stylisés si les iframes sont bloquées.
  - Boutons d'accès direct vers la page Facebook et le compte WhatsApp.

- [x] **Ergonomie, Mobile & Contact**
  - Barre d'action rapide sur mobile (Appel, WhatsApp, Don, Bénévolat).
  - Boutons « Copier » en 1 clic pour l'e-mail et les téléphones avec notifications toast animées.
  - Carte Google Maps intégrée sans clé API.
  - Support du swipe tactile (balayage gauche/droite) sur la visionneuse de photos.

- [x] **Bilinguisme & SEO**
  - Synchronisation complète 100% des clés FR et EN dans js/main.js.
  - Métadonnées Open Graph, Twitter Cards et données structurées Schema.org NGO.

## À faire (côté utilisateur)

- [ ] (Optionnel) Renseigner DONATION_URL (HelloAsso, Stripe, Donorbox) et NEWSLETTER_ENDPOINT dans js/main.js si vous disposez d'un service tiers.
- [ ] Remplacer l'URL placeholder dans 
obots.txt / sitemap.xml par le domaine définitif après mise en ligne.
