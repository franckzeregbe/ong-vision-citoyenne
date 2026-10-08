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
SYNC="$HOME/.vc-content-sync"
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

  # Resynchronisation exceptionnelle du contenu admin depuis GitHub,
  # déclenchée en changeant tools/content-sync.txt. À n'utiliser que si le
  # contenu en ligne est identique à celui de GitHub (sinon il serait perdu).
  WANT=$(tar xzf "$TMP" -O --wildcards '*/tools/content-sync.txt' 2>/dev/null | head -1)
  if [ -n "$WANT" ] && [ "$WANT" != "$(cat "$SYNC" 2>/dev/null)" ]; then
    if tar xzf "$TMP" -C "$DIR" --strip-components=1 --wildcards \
        '*/js/news.js' '*/js/galerie.js' '*/js/partners.js'; then
      echo "$WANT" > "$SYNC"
      echo "Contenu admin resynchronise : $WANT"
    fi
  fi
fi

rm -f "$TMP"
