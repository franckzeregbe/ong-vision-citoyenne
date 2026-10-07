#!/bin/sh
# ===================================================================
# ONG VISION CITOYENNE — mise à jour automatique du site
#
# Lancé par une tâche Cron sur l'hébergement Hostinger :
#   curl -sfL https://raw.githubusercontent.com/franckzeregbe/ong-vision-citoyenne/main/tools/deploy.sh | sh
#
# Vérifie si une nouvelle version du code est publiée sur GitHub et,
# le cas échéant, l'installe dans public_html.
#
# Ne touche JAMAIS au contenu publié depuis l'espace admin
# (actualités, galerie, partenaires) : ces fichiers sont exclus.
# ===================================================================

REPO="franckzeregbe/ong-vision-citoyenne"
BRANCH="main"
STAMP="$HOME/.vc-deployed"
TMP="$HOME/.vc-site.tgz"

# Dossier public du site (détecté automatiquement)
DIR=$(ls -d "$HOME"/domains/*/public_html 2>/dev/null | head -1)
[ -n "$DIR" ] || DIR="$HOME/public_html"
[ -d "$DIR" ] || exit 0

# Dernière version publiée sur GitHub
SHA=$(curl -sfL -m 30 -H 'Accept: application/vnd.github.sha' \
  "https://api.github.com/repos/$REPO/commits/$BRANCH")
[ -n "$SHA" ] || exit 0

# Rien de neuf : on s'arrête sans rien télécharger
[ "$SHA" != "$(cat "$STAMP" 2>/dev/null)" ] || exit 0

# Téléchargement de la nouvelle version
curl -sfL -m 300 -o "$TMP" "https://codeload.github.com/$REPO/tar.gz/$SHA" || exit 0

# Installation (le contenu géré par l'espace admin est préservé)
if tar xzf "$TMP" -C "$DIR" --strip-components=1 \
    --exclude='*/js/news.js' \
    --exclude='*/js/galerie.js' \
    --exclude='*/js/partners.js'; then
  echo "$SHA" > "$STAMP"
  echo "Site mis a jour : $SHA"
fi

rm -f "$TMP"
