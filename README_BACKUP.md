# 🗄️ Sauvegarde et Restauration de la Base de Données Pet Paradise

## 📋 Scripts Disponibles

### 1. Sauvegarde Rapide
```bash
php scripts/quick_backup.php
```
- Génère un fichier SQL complet avec structure + données
- Nom: `petparadise_backup_YYYY-MM-DD_HH-MM-SS.sql`
- Inclut tout le nécessaire pour recréer la base

### 2. Sauvegarde Complète (Avancée)
```bash
php scripts/backup_database.php
```
- Analyse détaillée de la structure
- Sauvegarde avec contraintes et index
- Plus complet mais plus lent

### 3. Restauration
```bash
php scripts/restore_database.php fichier.sql
```
- Restaure depuis un fichier de sauvegarde
- Vérifie l'intégrité des données
- Recrée l'utilisateur admin si nécessaire

## 🚀 Utilisation

### Sauvegarder la base actuelle
```bash
cd scripts
php quick_backup.php
```

### Restaurer une sauvegarde
```bash
cd scripts
php restore_database.php petparadise_backup_2025-07-13_14-15-55.sql
```

## 📄 Contenu de la Sauvegarde

Le fichier SQL généré contient :

### Structure Complète
- ✅ Toutes les tables (users, rooms, reservations, etc.)
- ✅ Types de données PostgreSQL corrects
- ✅ Contraintes et index
- ✅ Séquences SERIAL

### Données Préservées
- ✅ Utilisateurs existants
- ✅ Chambres configurées
- ✅ Réservations en cours
- ✅ Messages personnalisés
- ✅ Paramètres du site

### Données Par Défaut
- ✅ Utilisateur admin (admin/admin123)
- ✅ 4 chambres types
- ✅ Messages multilingues (FR/EN/ES)

## 🔧 Déploiement Production

### Pour un hébergeur classique (Hostinger, OVH, etc.)
```bash
# 1. Créer la sauvegarde
php scripts/quick_backup.php

# 2. Télécharger le fichier .sql généré
# 3. Sur l'hébergeur, créer une base PostgreSQL
# 4. Importer le fichier SQL via phpPgAdmin ou CLI
```

### Via psql (CLI)
```bash
psql -h hostname -U username -d database_name -f petparadise_backup.sql
```

### Via interface web
1. Ouvrir phpPgAdmin ou interface hébergeur
2. Sélectionner la base de données
3. Importer le fichier SQL
4. Vérifier que toutes les tables sont créées

## 🎯 Avantages

### Portabilité Totale
- ✅ Fonctionne sur n'importe quelle base PostgreSQL
- ✅ Compatible avec tous les hébergeurs
- ✅ Pas de dépendances externes

### Sécurité
- ✅ Utilisateur admin toujours créé
- ✅ Mots de passe hashés (bcrypt)
- ✅ Données sensibles préservées

### Fiabilité
- ✅ Structure validée
- ✅ Données cohérentes
- ✅ Récupération automatique

## 📝 Exemple d'Utilisation

```bash
# Sauvegarder avant une modification importante
php scripts/quick_backup.php

# Résultat
✅ Sauvegarde créée: petparadise_backup_2025-07-13_14-15-55.sql
📄 Taille: 6.92 KB
🚀 Pour restaurer: psql -d petparadise -f petparadise_backup_2025-07-13_14-15-55.sql

# En cas de problème, restaurer
php scripts/restore_database.php petparadise_backup_2025-07-13_14-15-55.sql
```

## 🛡️ Bonnes Pratiques

1. **Sauvegarde régulière** : Lancez le script avant chaque modification importante
2. **Versioning** : Gardez plusieurs sauvegardes (dates différentes)
3. **Test de restauration** : Testez périodiquement la restauration
4. **Stockage sécurisé** : Sauvegardez les fichiers .sql dans un endroit sûr

## 🔍 Vérifications Post-Restauration

Après restauration, vérifiez :
- ✅ Connexion admin fonctionne (/paradise-management)
- ✅ Chambres disponibles
- ✅ Messages affichés correctement
- ✅ Réservations préservées

**Login Admin par défaut :**
- Username: `admin`
- Password: `admin123`
- URL: `/paradise-management`