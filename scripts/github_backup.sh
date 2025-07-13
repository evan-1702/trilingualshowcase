#!/bin/bash

# Pet Paradise - Script de Sauvegarde GitHub pour Replit
# Automatise la sauvegarde complète des modifications vers GitHub

# Configuration
COMMIT_MESSAGE="${1:-"Automatic backup - $(date '+%Y-%m-%d %H:%M:%S')"}"
PROJECT_NAME="Pet Paradise"

echo "🔐 $PROJECT_NAME - Sauvegarde GitHub"
echo "=================================================="

# Fonction pour afficher les messages colorés
log_info() { echo -e "\e[34mℹ️  $1\e[0m"; }
log_success() { echo -e "\e[32m✅ $1\e[0m"; }
log_warning() { echo -e "\e[33m⚠️  $1\e[0m"; }
log_error() { echo -e "\e[31m❌ $1\e[0m"; }

# Vérification des prérequis
log_info "Vérification des prérequis..."

# Vérifier Git
if ! command -v git &> /dev/null; then
    log_error "Git n'est pas installé"
    exit 1
fi

# Vérifier si c'est un dépôt Git
if [ ! -d ".git" ]; then
    log_error "Répertoire .git non trouvé - Pas un dépôt Git"
    exit 1
fi

# Vérifier la connexion au dépôt distant
REMOTE_URL=$(git config --get remote.origin.url)
if [ -z "$REMOTE_URL" ]; then
    log_error "Aucun dépôt distant configuré"
    exit 1
fi

log_success "Dépôt distant: $REMOTE_URL"

# Vérifier les fichiers critiques
log_info "Vérification des fichiers critiques..."
CRITICAL_FILES=(
    "tests/AdminTest.php"
    "scripts/quick_backup.php"
    "scripts/backup_database.php"
    "scripts/restore_database.php"
    "deploy/api/config/database.php"
    "README_BACKUP.md"
)

MISSING_FILES=()
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    log_warning "Fichiers manquants:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
fi

# Créer une sauvegarde de la base de données
log_info "Création de la sauvegarde de la base de données..."
if [ -f "scripts/quick_backup.php" ]; then
    if php scripts/quick_backup.php; then
        log_success "Sauvegarde BDD créée avec succès"
    else
        log_warning "Erreur lors de la création de la sauvegarde BDD"
    fi
else
    log_warning "Script de sauvegarde non trouvé"
fi

# Afficher le statut Git
log_info "Statut Git actuel:"
git status --porcelain | while read -r line; do
    status="${line:0:2}"
    file="${line:3}"
    
    case "$status" in
        "A ") echo "  ➕ $file" ;;
        "M ") echo "  ✏️  $file" ;;
        "D ") echo "  🗑️  $file" ;;
        "??") echo "  ❓ $file" ;;
        *) echo "  📄 $file" ;;
    esac
done

# Ajouter tous les fichiers modifiés
log_info "Ajout des fichiers modifiés..."
git add .

# Vérifier les fichiers ajoutés
STAGED_FILES=$(git diff --cached --name-only)
if [ -z "$STAGED_FILES" ]; then
    log_info "Aucun fichier modifié à commiter"
    exit 0
fi

log_success "Fichiers ajoutés au commit:"
echo "$STAGED_FILES" | while read -r file; do
    echo "  - $file"
done

# Créer le commit
log_info "Création du commit..."
if git commit -m "$COMMIT_MESSAGE"; then
    log_success "Commit créé avec succès"
else
    log_error "Erreur lors du commit"
    exit 1
fi

# Push vers GitHub
log_info "Envoi vers GitHub..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📤 Push vers la branche: $CURRENT_BRANCH"

if git push origin "$CURRENT_BRANCH"; then
    log_success "Push vers GitHub réussi"
else
    log_error "Erreur lors du push"
    exit 1
fi

# Résumé final
echo ""
echo "🎉 SAUVEGARDE TERMINÉE AVEC SUCCÈS!"
echo "=================================================="
log_success "Toutes les modifications ont été sauvegardées dans GitHub"
echo "📅 Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo "💬 Message: $COMMIT_MESSAGE"
echo "🌐 Dépôt: $REMOTE_URL"
echo "🌿 Branche: $CURRENT_BRANCH"

# Afficher les fichiers de sauvegarde disponibles
echo ""
echo "💾 FICHIERS DE SAUVEGARDE DISPONIBLES:"
find scripts -name "*.sql" -type f 2>/dev/null | while read -r file; do
    size=$(du -h "$file" | cut -f1)
    echo "  - $(basename "$file") ($size)"
done

echo ""
echo "🔍 VÉRIFICATION RECOMMANDÉE:"
echo "1. Visitez votre dépôt GitHub pour vérifier les modifications"
echo "2. Testez le déploiement avec le fichier SQL généré"
echo "3. Vérifiez que l'accès admin fonctionne (admin/admin123)"
echo ""
log_success "Sauvegarde GitHub terminée avec succès!"