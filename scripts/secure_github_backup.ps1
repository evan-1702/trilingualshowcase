# Pet Paradise - Script de Sauvegarde Sécurisée GitHub
# Automatise la sauvegarde complète des modifications vers GitHub

param(
    [string]$CommitMessage = "Automatic backup - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    [switch]$Force,
    [switch]$CreateBackup,
    [switch]$Verbose
)

# Configuration
$ProjectName = "Pet Paradise"
$BackupBranch = "backup-$(Get-Date -Format 'yyyy-MM-dd')"
$RequiredFiles = @(
    "tests/AdminTest.php",
    "scripts/quick_backup.php",
    "scripts/backup_database.php", 
    "scripts/restore_database.php",
    "deploy/api/config/database.php",
    "README_BACKUP.md"
)

Write-Host "🔐 $ProjectName - Sauvegarde Sécurisée GitHub" -ForegroundColor Green
Write-Host "=" * 50

# Vérification des prérequis
Write-Host "🔍 Vérification des prérequis..."

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Git n'est pas installé ou accessible"
    exit 1
}

if (-not (Test-Path ".git")) {
    Write-Error "❌ Répertoire .git non trouvé - Pas un dépôt Git"
    exit 1
}

# Vérifier la connexion GitHub
Write-Host "🌐 Vérification de la connexion GitHub..."
try {
    $remoteUrl = git config --get remote.origin.url
    if ($remoteUrl) {
        Write-Host "✅ Dépôt distant: $remoteUrl" -ForegroundColor Green
    } else {
        Write-Error "❌ Aucun dépôt distant configuré"
        exit 1
    }
} catch {
    Write-Error "❌ Erreur lors de la vérification du dépôt distant"
    exit 1
}

# Vérifier les fichiers critiques
Write-Host "📂 Vérification des fichiers critiques..."
$MissingFiles = @()
foreach ($file in $RequiredFiles) {
    if (-not (Test-Path $file)) {
        $MissingFiles += $file
    }
}

if ($MissingFiles.Count -gt 0) {
    Write-Warning "⚠️ Fichiers manquants:"
    $MissingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    if (-not $Force) {
        Write-Host "Utilisez -Force pour continuer malgré les fichiers manquants" -ForegroundColor Yellow
        exit 1
    }
}

# Créer une sauvegarde de la base de données
if ($CreateBackup) {
    Write-Host "💾 Création de la sauvegarde de la base de données..."
    try {
        if (Test-Path "scripts/quick_backup.php") {
            $backupResult = php scripts/quick_backup.php
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Sauvegarde BDD créée avec succès" -ForegroundColor Green
            } else {
                Write-Warning "⚠️ Erreur lors de la création de la sauvegarde BDD"
            }
        }
    } catch {
        Write-Warning "⚠️ Impossible de créer la sauvegarde BDD: $_"
    }
}

# Afficher le statut Git
Write-Host "📊 Statut Git actuel:"
git status --porcelain | ForEach-Object {
    $status = $_.Substring(0, 2)
    $file = $_.Substring(3)
    
    switch ($status.Trim()) {
        "A" { Write-Host "  ➕ $file" -ForegroundColor Green }
        "M" { Write-Host "  ✏️ $file" -ForegroundColor Yellow }
        "D" { Write-Host "  🗑️ $file" -ForegroundColor Red }
        "??" { Write-Host "  ❓ $file" -ForegroundColor Cyan }
        default { Write-Host "  📄 $file" -ForegroundColor White }
    }
}

# Créer une branche de sauvegarde si demandé
if ($CreateBackup) {
    Write-Host "🌿 Création de la branche de sauvegarde: $BackupBranch"
    try {
        git checkout -b $BackupBranch
        Write-Host "✅ Branche de sauvegarde créée" -ForegroundColor Green
    } catch {
        Write-Warning "⚠️ Impossible de créer la branche de sauvegarde"
    }
}

# Ajouter tous les fichiers modifiés
Write-Host "📦 Ajout des fichiers modifiés..."
try {
    git add .
    
    # Vérifier les fichiers ajoutés
    $stagedFiles = git diff --cached --name-only
    if ($stagedFiles) {
        Write-Host "✅ Fichiers ajoutés au commit:" -ForegroundColor Green
        $stagedFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Cyan }
    } else {
        Write-Host "ℹ️ Aucun fichier modifié à commiter" -ForegroundColor Yellow
        exit 0
    }
} catch {
    Write-Error "❌ Erreur lors de l'ajout des fichiers: $_"
    exit 1
}

# Créer le commit
Write-Host "💬 Création du commit..."
try {
    $commitOutput = git commit -m "$CommitMessage"
    Write-Host "✅ Commit créé avec succès" -ForegroundColor Green
    if ($Verbose) {
        Write-Host $commitOutput
    }
} catch {
    Write-Error "❌ Erreur lors du commit: $_"
    exit 1
}

# Push vers GitHub
Write-Host "🚀 Envoi vers GitHub..."
try {
    $currentBranch = git rev-parse --abbrev-ref HEAD
    Write-Host "📤 Push vers la branche: $currentBranch"
    
    $pushOutput = git push origin $currentBranch
    Write-Host "✅ Push vers GitHub réussi" -ForegroundColor Green
    
    if ($Verbose) {
        Write-Host $pushOutput
    }
} catch {
    Write-Error "❌ Erreur lors du push: $_"
    exit 1
}

# Revenir à la branche principale si on était sur une branche de sauvegarde
if ($CreateBackup) {
    Write-Host "🔄 Retour à la branche principale..."
    try {
        git checkout main
        Write-Host "✅ Retour à la branche main" -ForegroundColor Green
    } catch {
        Write-Warning "⚠️ Impossible de revenir à la branche main"
    }
}

# Résumé final
Write-Host ""
Write-Host "🎉 SAUVEGARDE SÉCURISÉE TERMINÉE" -ForegroundColor Green
Write-Host "=" * 50
Write-Host "✅ Toutes les modifications ont été sauvegardées dans GitHub" -ForegroundColor Green
Write-Host "📅 Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "💬 Message: $CommitMessage" -ForegroundColor Cyan
Write-Host "🌐 Dépôt: $remoteUrl" -ForegroundColor Cyan

# Afficher les instructions pour la vérification
Write-Host ""
Write-Host "🔍 VÉRIFICATION RECOMMANDÉE:" -ForegroundColor Yellow
Write-Host "1. Visitez votre dépôt GitHub pour vérifier les modifications"
Write-Host "2. Testez le déploiement avec le fichier SQL généré"
Write-Host "3. Vérifiez que l'accès admin fonctionne (admin/admin123)"
Write-Host ""

# Afficher les fichiers de sauvegarde disponibles
$backupFiles = Get-ChildItem "scripts/*.sql" -ErrorAction SilentlyContinue
if ($backupFiles) {
    Write-Host "💾 FICHIERS DE SAUVEGARDE DISPONIBLES:" -ForegroundColor Cyan
    $backupFiles | ForEach-Object { 
        Write-Host "  - $($_.Name) ($('{0:N2}' -f ($_.Length/1KB)) KB)" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "🔐 Sauvegarde sécurisée terminée avec succès!" -ForegroundColor Green