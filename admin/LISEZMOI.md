# Espace admin — installation sur Hostinger

L'espace admin (`https://ongvici.org/admin/`) permet de gérer les actualités,
la galerie photos, les partenaires, les témoignages, et de lire les messages
reçus par les formulaires du site.

## Fonctionnement

- **Contenu du site** (actualités, photos, partenaires, témoignages) : le bouton
  « Publier sur le site » enregistre les modifications sur **GitHub**, puis
  Hostinger met le site à jour tout seul (1 à 2 minutes). GitHub garde donc
  toujours une copie complète du site, et sa copie de secours reste en ligne sur
  `franckzeregbe.github.io/ong-vision-citoyenne`.
- **Messages des formulaires** (contact, bénévoles, newsletter) : enregistrés dans
  une **base de données MySQL chez Hostinger**. Ce sont des données personnelles :
  elles ne vont jamais sur GitHub, qui est public.

Les secrets (clé GitHub, mots de passe) ne sont **jamais** dans le dépôt. Ils sont
dans le fichier `admin-config.php`, placé **à côté** du dossier `public_html`,
donc inaccessible depuis le web.

## Installation (une seule fois)

### 1. Relier le site à GitHub

hPanel → **Sites web → ongvici.org → Avancé → GIT**

- Dépôt : `https://github.com/franckzeregbe/ong-vision-citoyenne.git`
- Branche : `main`
- Répertoire : laisser **vide** (le dossier `public_html` doit être vide avant)
- **Créer**, puis **Déployer**
- Activer le **déploiement automatique** et copier l'adresse du webhook
- Sur GitHub : dépôt → **Settings → Webhooks → Add webhook**, coller l'adresse
  dans « Payload URL », laisser le reste par défaut, **Add webhook**

### 2. Créer la base de données

hPanel → **Bases de données → Gestion** → créer une base MySQL.
Noter le **nom de la base**, le **nom d'utilisateur** et le **mot de passe**
(Hostinger ajoute un préfixe du type `u123456789_`). La table des messages se
crée toute seule à la première utilisation.

### 3. Créer la clé GitHub

github.com → photo de profil → **Settings → Developer settings →
Personal access tokens → Fine-grained tokens → Generate new token**

- Nom : `Admin ongvici.org`
- Expiration : 1 an (noter la date : il faudra la renouveler)
- Repository access : **Only select repositories** → `ong-vision-citoyenne`
- Permissions → Repository permissions → **Contents : Read and write**
- **Generate token**, puis copier la clé (elle commence par `github_pat_`)

### 4. Créer le fichier de configuration

hPanel → **Gestionnaire de fichiers** → ouvrir `public_html`, puis **remonter
d'un dossier** (le dossier `domains/ongvici.org/`). Créer à cet endroit un
nouveau fichier nommé **`admin-config.php`** et y coller :

```php
<?php
return [
    // Clé GitHub de l'étape 3
    'github_token' => 'COLLER_ICI_LA_CLE_GITHUB',
    'repo' => 'franckzeregbe/ong-vision-citoyenne',
    'branch' => 'main',

    // Mot de passe de première connexion (l'admin demandera de le changer)
    'admin_password' => 'CHOISIR_UN_MOT_DE_PASSE_PROVISOIRE',

    // Base de données de l'étape 2
    'db' => [
        'host' => 'localhost',
        'name' => 'NOM_DE_LA_BASE',
        'user' => 'NOM_UTILISATEUR',
        'pass' => 'MOT_DE_PASSE_DE_LA_BASE',
    ],

    // Recevoir un e-mail à chaque nouveau message (facultatif)
    'notify_email' => 'ongvisioncitoyenne@gmail.com',
];
```

Remplacer les valeurs en MAJUSCULES, en gardant les apostrophes `'…'`, puis
enregistrer. **Ne jamais envoyer ce fichier ni son contenu par message.**

### 5. Première connexion

Aller sur `https://ongvici.org/admin/`, se connecter avec le mot de passe
provisoire, puis choisir un vrai mot de passe dans l'onglet « Mot de passe ».

## En cas de problème

- **Mot de passe oublié** : dans le Gestionnaire de fichiers, supprimer le fichier
  `admin-password.php` (à côté de `admin-config.php`) : le mot de passe provisoire
  de `admin-config.php` redevient valable.
- **« La clé d'accès GitHub est refusée »** : la clé a expiré. En créer une
  nouvelle (étape 3) et la remplacer dans `admin-config.php`.
- **« Le site a été modifié entre-temps »** : quelqu'un a publié depuis un autre
  appareil. Recharger la page de l'admin et refaire la modification.
- **Trop de tentatives de connexion** : attendre 15 minutes.

## Sécurité en place

- Mot de passe vérifié par le serveur, stocké chiffré (bcrypt), blocage après
  5 essais ratés pendant 15 minutes, session fermée après 2 h d'inactivité.
- Protection contre les requêtes venant d'autres sites (CSRF) et cookie de
  session `HttpOnly`, `Secure`, `SameSite=Strict`.
- Tout le contenu envoyé est vérifié par le serveur (formats, longueurs, liens,
  vraies images uniquement) ; les photos sont réduites et débarrassées de leurs
  métadonnées (GPS) avant l'envoi.
- Formulaires du site : champ piège anti-robots, 5 envois par heure maximum par
  visiteur, adresses IP jamais stockées en clair, requêtes SQL préparées.
- Le dossier `admin/inc/`, ce guide et le dossier `.git` sont bloqués par
  `.htaccess` ; HTTPS forcé ; en-têtes de sécurité (HSTS, anti-iframe, etc.).
