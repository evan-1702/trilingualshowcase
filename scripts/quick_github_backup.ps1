# Pet Paradise - Sauvegarde Rapide GitHub
# Script PowerShell simplifié pour sauvegarder rapidement vers GitHub

param(
    [string]$Message = "Quick backup - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "🚀 Pet Paradise - Sauvegarde Rapide GitHub" -ForegroundColor Green

# Vérifications de base
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Git non installé"
    exit 1
}

if (-not (Test-Path ".git")) {
    Write-Error "❌ Pas un dépôt Git"
    exit 1
}

try {
    # Créer sauvegarde BDD si le script existe
    if (Test-Path "scripts/quick_backup.php") {
        Write-Host "💾 Création sauvegarde BDD..."
        php scripts/quick_backup.php
    }
    
    # Ajouter tous les fichiers
    Write-Host "📦 Ajout des fichiers..."
    git add .
    
    # Vérifier s'il y a des changements
    $changes = git diff --cached --name-only
    if (-not $changes) {
        Write-Host "ℹ️ Aucun changement à sauvegarder" -ForegroundColor Yellow
        exit 0
    }
    
    # Commit et push
    Write-Host "💬 Création du commit..."
    git commit -m "$Message"
    
    Write-Host "🚀 Envoi vers GitHub..."
    $branch = git rev-parse --abbrev-ref HEAD
    git push origin $branch
    
    Write-Host "✅ Sauvegarde terminée avec succès!" -ForegroundColor Green
    Write-Host "📂 Fichiers sauvegardés:" -ForegroundColor Cyan
    $changes | ForEach-Object { Write-Host "  - $_" -ForegroundColor Cyan }
    
} catch {
    Write-Error "❌ Erreur: $_"
    exit 1
}

Write-Host ""
Write-Host "🎉 Vos modifications sont maintenant sécurisées dans GitHub!" -ForegroundColor Green