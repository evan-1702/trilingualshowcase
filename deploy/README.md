# Pet Paradise - Déploiement 100% PHP (SANS Node.js)

## Réponse à votre question

**OUI, vous pouvez héberger ce site SANS Node.js !**

### Situation actuelle (problématique)
- Node.js agit comme "intermédiaire" entre votre site et PHP
- L'hébergeur doit supporter Node.js ET PHP = plus compliqué et cher

### Solution : Version 100% PHP
Le fichier `deploy/index.php` élimine complètement Node.js.

## Instructions de déploiement

### 1. Compilation du frontend
```bash
npm run build
```

### 2. Structure finale pour hébergeur
```
votre-site/
├── index.php              # Point d'entrée UNIQUE (remplace Node.js)
├── api/                   # API PHP 8.3
│   ├── config/
│   ├── models/
│   ├── controllers/
│   └── index.php
├── dist/                  # Frontend compilé
│   ├── index.html
│   ├── assets/
│   └── ...
└── .htaccess             # Configuration Apache
```

### 3. Configuration hébergeur
**Hostinger/Infomaniak/OVH :**
- Uploadez tout le contenu
- Pointez le domaine vers `index.php`
- Configurez la base de données MariaDB/MySQL
- Ajoutez les variables d'environnement

### 4. Variables d'environnement (.env)
```
DB_HOST=localhost
DB_NAME=petparadise
DB_USER=votre_user
DB_PASS=votre_password
SMTP_HOST=mail.hostinger.com
SMTP_USER=contact@votredomaine.com
SMTP_PASS=votre_mot_de_passe
```

## Avantages version 100% PHP

✅ **Hébergement simple** : N'importe quel hébergeur PHP
✅ **Moins cher** : Pas besoin de VPS ou serveur Node.js
✅ **Plus stable** : Un seul langage backend
✅ **Sécurité maximale** : Toutes les protections PHP intégrées
✅ **Performance** : Frontend statique + API PHP optimisée

## Test en local
```bash
php -S localhost:8000 deploy/index.php
```

**Votre site fonctionne maintenant avec uniquement PHP !**