#!/bin/bash

# Pet Paradise - Sauvegarde Rapide GitHub
# Script bash simplifié pour Replit

COMMIT_MESSAGE="${1:-"Quick backup - $(date '+%Y-%m-%d %H:%M:%S')"}"

echo "🚀 Pet Paradise - Sauvegarde Rapide GitHub"

# Vérifications de base
if ! command -v git &> /dev/null; then
    echo "❌ Git non installé"
    exit 1
fi

if [ ! -d ".git" ]; then
    echo "❌ Pas un dépôt Git"
    exit 1
fi

# Créer sauvegarde BDD si le script existe
if [ -f "scripts/quick_backup.php" ]; then
    echo "💾 Création sauvegarde BDD..."
    php scripts/quick_backup.php
fi

# Ajouter tous les fichiers
echo "📦 Ajout des fichiers..."
git add .

# Vérifier s'il y a des changements
CHANGES=$(git diff --cached --name-only)
if [ -z "$CHANGES" ]; then
    echo "ℹ️  Aucun changement à sauvegarder"
    exit 0
fi

# Commit et push
echo "💬 Création du commit..."
git commit -m "$COMMIT_MESSAGE"

echo "🚀 Envoi vers GitHub..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push origin "$BRANCH"

echo "✅ Sauvegarde terminée avec succès!"
echo "📂 Fichiers sauvegardés:"
echo "$CHANGES" | while read -r file; do
    echo "  - $file"
done

echo ""
echo "🎉 Vos modifications sont maintenant sécurisées dans GitHub!"