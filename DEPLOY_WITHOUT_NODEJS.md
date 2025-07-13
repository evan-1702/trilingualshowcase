# Hébergement 100% PHP - SANS Node.js

## Situation actuelle vs Solution

### 🔴 Actuellement (problématique)
```
Utilisateur → Node.js (proxy) → PHP → Base de données
```
**Problème :** L'hébergeur doit supporter Node.js ET PHP

### ✅ Solution finale (optimale)
```
Utilisateur → PHP uniquement → Base de données
```
**Avantage :** N'importe quel hébergeur PHP standard

## Instructions de déploiement

### 1. Compilation du frontend
```bash
npm run build
```

### 2. Utilisation du fichier deploy/index.php
Ce fichier remplace complètement Node.js et fait tout :
- Sert l'API PHP
- Sert les fichiers statiques du frontend
- Gère le routing de l'application

### 3. Structure finale pour hébergeur
```
votre-domaine.com/
├── index.php              # Point d'entrée unique (remplace Node.js)
├── api/                   # Backend PHP 8.3
├── dist/                  # Frontend React compilé
├── .htaccess              # Configuration Apache
└── .env                   # Variables d'environnement
```

### 4. Hébergeurs compatibles
- **Hostinger** : PHP 8.3 + MySQL (5€/mois)
- **Infomaniak** : PHP 8.3 + MySQL (7€/mois)
- **OVH** : PHP 8.3 + MySQL (3€/mois)
- **Tout hébergeur mutualisé** avec PHP 8.3+

### 5. Configuration .env
```
DB_HOST=localhost
DB_NAME=petparadise
DB_USER=votre_utilisateur
DB_PASS=votre_mot_de_passe

SMTP_HOST=smtp.hostinger.com
SMTP_USER=contact@votredomaine.com
SMTP_PASS=votre_mot_de_passe_email
```

## Sécurité du login administrateur

- **URL** : `/paradise-management`
- **Utilisateur** : `admin`
- **Mot de passe** : `admin123` (changez-le en production)
- **Sécurité** : Hashage Argon2ID, sessions sécurisées, protection CSRF

## Fonctionnalités conservées

✅ Système de réservation complet
✅ Interface d'administration
✅ Multilingue (FR/EN/ES)
✅ Email automatique SMTP
✅ Blog et FAQ
✅ Toutes les pages publiques

**Résultat : Site professionnel hébergeable partout avec PHP uniquement**