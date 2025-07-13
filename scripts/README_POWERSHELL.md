# 🔐 Scripts PowerShell pour GitHub - Pet Paradise

## 📜 Scripts Disponibles

### 1. Sauvegarde Sécurisée Complète
```powershell
.\scripts\secure_github_backup.ps1
```

### 2. Sauvegarde Rapide
```powershell
.\scripts\quick_github_backup.ps1
```

## 🚀 Utilisation

### Sauvegarde Rapide (Recommandée)
```powershell
# Sauvegarde simple avec message automatique
.\scripts\quick_github_backup.ps1

# Avec message personnalisé
.\scripts\quick_github_backup.ps1 -Message "Fix admin login + add unit tests"
```

### Sauvegarde Sécurisée (Avancée)
```powershell
# Sauvegarde complète avec vérifications
.\scripts\secure_github_backup.ps1

# Avec création de branche de sauvegarde
.\scripts\secure_github_backup.ps1 -CreateBackup

# Forcer même si fichiers manquants
.\scripts\secure_github_backup.ps1 -Force

# Mode verbeux
.\scripts\secure_github_backup.ps1 -Verbose

# Toutes les options
.\scripts\secure_github_backup.ps1 -CreateBackup -Force -Verbose -CommitMessage "Complete backup with tests"
```

## 🎯 Fonctionnalités

### Script Rapide (`quick_github_backup.ps1`)
- ✅ Sauvegarde automatique de la BDD
- ✅ Commit et push automatique
- ✅ Vérification des changements
- ✅ Interface simple et rapide

### Script Sécurisé (`secure_github_backup.ps1`)
- ✅ Vérification des prérequis
- ✅ Contrôle des fichiers critiques
- ✅ Création de branches de sauvegarde
- ✅ Rapport détaillé des opérations
- ✅ Gestion d'erreurs avancée

## 📋 Prérequis

### Installation Git
```powershell
# Vérifier si Git est installé
git --version

# Si pas installé, télécharger depuis: https://git-scm.com/
```

### Configuration Git (première fois)
```powershell
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

### Authentification GitHub
```powershell
# Avec token d'accès personnel (recommandé)
git config --global credential.helper manager-core

# Ou avec SSH (plus sécurisé)
ssh-keygen -t ed25519 -C "votre@email.com"
```

## 🔧 Exécution des Scripts

### Première exécution
```powershell
# Autoriser l'exécution des scripts PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Naviguer vers le dossier du projet
cd "C:\chemin\vers\votre\projet"

# Exécuter le script
.\scripts\quick_github_backup.ps1
```

### Exécution quotidienne
```powershell
# Sauvegarde rapide quotidienne
.\scripts\quick_github_backup.ps1 -Message "Daily backup $(Get-Date -Format 'yyyy-MM-dd')"
```

## 🎨 Exemples d'Utilisation

### Sauvegarde après correction de bugs
```powershell
.\scripts\quick_github_backup.ps1 -Message "Fix admin login issues + add unit tests"
```

### Sauvegarde avant modification importante
```powershell
.\scripts\secure_github_backup.ps1 -CreateBackup -CommitMessage "Backup before major changes"
```

### Sauvegarde d'urgence
```powershell
.\scripts\secure_github_backup.ps1 -Force -CommitMessage "Emergency backup"
```

## 📊 Sortie Type

```
🚀 Pet Paradise - Sauvegarde Rapide GitHub
💾 Création sauvegarde BDD...
✅ Sauvegarde créée: petparadise_backup_2025-07-13_15-30-45.sql
📦 Ajout des fichiers...
💬 Création du commit...
🚀 Envoi vers GitHub...
✅ Sauvegarde terminée avec succès!
📂 Fichiers sauvegardés:
  - tests/AdminTest.php
  - scripts/quick_backup.php
  - scripts/petparadise_backup_2025-07-13_15-30-45.sql
  - README_BACKUP.md

🎉 Vos modifications sont maintenant sécurisées dans GitHub!
```

## 🛡️ Sécurité

### Fichiers Toujours Sauvegardés
- ✅ Tests unitaires (`tests/AdminTest.php`)
- ✅ Scripts de sauvegarde (`scripts/*.php`)
- ✅ Configuration base de données (`deploy/api/config/`)
- ✅ Sauvegarde SQL générée
- ✅ Documentation (`README_BACKUP.md`)

### Fichiers Sensibles Exclus
- ❌ Mots de passe en dur
- ❌ Clés API privées
- ❌ Données utilisateur personnelles
- ❌ Fichiers temporaires

## 🔄 Automatisation

### Tâche Planifiée Windows
```powershell
# Créer une tâche planifiée pour sauvegarde quotidienne
$action = New-ScheduledTaskAction -Execute "PowerShell" -Argument "-File C:\chemin\vers\scripts\quick_github_backup.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 18:00
Register-ScheduledTask -TaskName "PetParadise-Backup" -Action $action -Trigger $trigger
```

### Raccourci Bureau
```powershell
# Créer un raccourci sur le bureau
$shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Backup Pet Paradise.lnk")
$shortcut.TargetPath = "PowerShell"
$shortcut.Arguments = "-File C:\chemin\vers\scripts\quick_github_backup.ps1"
$shortcut.Save()
```

## 🆘 Dépannage

### Erreur "Execution Policy"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erreur "Git not found"
```powershell
# Ajouter Git au PATH ou réinstaller Git
$env:PATH += ";C:\Program Files\Git\bin"
```

### Erreur d'authentification GitHub
```powershell
# Réauthentifier avec token
git config --global credential.helper manager-core
```

## 🎯 Résultat Final

Après exécution, vous aurez :
- ✅ Toutes vos modifications sauvegardées dans GitHub
- ✅ Sauvegarde SQL de la base de données
- ✅ Historique des commits tracé
- ✅ Possibilité de restaurer à tout moment
- ✅ Déploiement prêt pour la production

**Votre code est maintenant sécurisé et prêt pour le déploiement !**