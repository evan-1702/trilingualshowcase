# 🔧 Instructions Git pour Replit

## 📍 Localisation de l'interface Git dans Replit

### **Méthode 1 : Barre latérale gauche**
Dans la barre latérale gauche de Replit, cherchez :
- Icône en forme de **branche** (Y inversé)
- Texte **"Git"** ou **"Version Control"**
- Icône avec **deux cercles reliés**

### **Méthode 2 : Menu déroulant**
1. Cliquez sur les **trois points** (...) en haut à droite
2. Cherchez **"Git"** ou **"Version Control"** dans le menu

### **Méthode 3 : Raccourci clavier**
- **Ctrl+Shift+G** (Windows/Linux)
- **Cmd+Shift+G** (Mac)

## 📋 **Fichiers à sauvegarder**

Voici les fichiers importants créés qui doivent être sauvegardés :

### Scripts de sauvegarde
- `scripts/quick_backup.php` - Sauvegarde rapide BDD
- `scripts/backup_database.php` - Sauvegarde complète
- `scripts/restore_database.php` - Restauration BDD
- `scripts/github_backup.sh` - Script Git Linux/Mac
- `scripts/quick_github.sh` - Script Git rapide

### Scripts PowerShell (Windows)
- `scripts/secure_github_backup.ps1` - Sauvegarde sécurisée
- `scripts/quick_github_backup.ps1` - Sauvegarde rapide

### Tests et configuration
- `tests/AdminTest.php` - Tests unitaires admin
- `deploy/api/config/database.php` - Configuration BDD

### Documentation
- `README_BACKUP.md` - Guide sauvegarde
- `scripts/README_POWERSHELL.md` - Guide PowerShell
- `GITHUB_INSTRUCTIONS.md` - Ce fichier

### Sauvegardes SQL
- `scripts/petparadise_backup_2025-07-13_14-23-05.sql` - Sauvegarde complète BDD

## 🎯 **Étapes pour sauvegarder**

### **Si vous trouvez l'interface Git :**
1. Ouvrez l'onglet Git/Version Control
2. Cliquez sur "Stage all" ou "+" à côté des fichiers
3. Écrivez le message : `Complete backup with admin tests and database scripts`
4. Cliquez sur "Commit & Push"

### **Si vous ne trouvez pas l'interface Git :**
1. Ouvrez le **Shell** en bas de l'écran
2. Tapez ces commandes une par une :
   ```bash
   git add .
   git commit -m "Complete backup with admin tests and database scripts"
   git push
   ```

## 📦 **Contenu de la sauvegarde**

Une fois sauvegardé, votre GitHub contiendra :
- ✅ Structure complète de la base de données
- ✅ Scripts de sauvegarde automatique
- ✅ Scripts PowerShell pour Windows
- ✅ Tests unitaires pour l'admin
- ✅ Documentation complète
- ✅ Fichier SQL prêt pour déploiement

## 🚀 **Déploiement futur**

Avec ces fichiers, vous pourrez :
- Restaurer votre BDD sur n'importe quel hébergeur
- Utiliser les scripts d'automatisation
- Maintenir l'accès admin (admin/admin123)
- Déployer en mode PHP pur (sans Node.js)

## 💡 **Conseils**

- Sauvegardez régulièrement avec ces scripts
- Gardez plusieurs versions de sauvegarde SQL
- Testez la restauration périodiquement
- Utilisez les scripts PowerShell sur Windows pour l'automatisation

## 🎯 **Prochaines étapes**

1. **Trouvez l'interface Git** dans Replit
2. **Sauvegardez tous les fichiers** dans GitHub
3. **Testez le déploiement** avec le fichier SQL
4. **Configurez l'automatisation** avec les scripts créés