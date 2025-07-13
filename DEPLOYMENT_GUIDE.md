# Pet Paradise - Guide de Déploiement
## Architecture PHP 8.3 + MariaDB 10.4 + Frontend Statique

### Configuration Serveur

#### 1. Configuration MariaDB 10.4
```sql
-- Créer la base de données
mysql -u root -p < api/database/schema.sql

-- Configurer un utilisateur applicatif
CREATE USER 'petparadise_app'@'localhost' IDENTIFIED BY 'mot_de_passe_securise';
GRANT SELECT, INSERT, UPDATE, DELETE ON petparadise.* TO 'petparadise_app'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. Configuration Apache/Nginx

**Apache (.htaccess déjà configuré):**
```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html/petparadise/dist/public
    ServerName votre-domaine.com
    
    # Redirection API vers PHP
    Alias /api /var/www/html/petparadise/api
    
    <Directory "/var/www/html/petparadise/api">
        AllowOverride All
        Require all granted
    </Directory>
    
    # Configuration SPA
    <Directory "/var/www/html/petparadise/dist/public">
        AllowOverride All
        Require all granted
        
        # Redirection SPA
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/html/petparadise/dist/public;
    index index.html;
    
    # Configuration sécurité
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    
    # Frontend statique
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API PHP
    location /api {
        alias /var/www/html/petparadise/api;
        try_files $uri $uri/ /api/index.php?$query_string;
        
        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $request_filename;
        }
    }
}
```

### Déploiement

#### 1. Compilation Frontend
```bash
# Dans le répertoire du projet
npm install
npm run build
```

#### 2. Installation API PHP
```bash
# Copier les fichiers API
cp -r api/ /var/www/html/petparadise/

# Installer les dépendances PHP
cd /var/www/html/petparadise/api
php composer.phar install --no-dev --optimize-autoloader

# Configurer les permissions
chmod 755 -R /var/www/html/petparadise/api
chown www-data:www-data -R /var/www/html/petparadise/api
```

#### 3. Configuration Environnement
```bash
# Créer le fichier .env
cp .env.example .env

# Éditer les variables d'environnement
nano .env
```

#### 4. Configuration Variables d'Environnement

**Pour Hostinger:**
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u123456_petparadise
DB_USER=u123456_petparadise
DB_PASS=votre_mot_de_passe_db

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=contact@votre-domaine.com
SMTP_PASS=votre_mot_de_passe_email
SMTP_SECURE=false

SITE_EMAIL=contact@votre-domaine.com
BASE_URL=https://votre-domaine.com
```

**Pour Infomaniak:**
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=votre_base_de_donnees
DB_USER=votre_utilisateur_db
DB_PASS=votre_mot_de_passe_db

SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USER=contact@votre-domaine.com
SMTP_PASS=votre_mot_de_passe_email
SMTP_SECURE=false

SITE_EMAIL=contact@votre-domaine.com
BASE_URL=https://votre-domaine.com
```

### Sécurité

#### 1. Configuration PHP 8.3
```ini
; Configuration sécurisée php.ini
expose_php = Off
display_errors = Off
log_errors = On
error_log = /var/log/php_errors.log
max_execution_time = 30
memory_limit = 128M
post_max_size = 8M
upload_max_filesize = 2M
session.cookie_httponly = 1
session.cookie_secure = 1
session.use_strict_mode = 1
```

#### 2. Configuration MariaDB
```sql
-- Configuration sécurisée
SET GLOBAL max_connections = 100;
SET GLOBAL query_cache_size = 64M;
SET GLOBAL innodb_buffer_pool_size = 256M;
```

### Fonctionnalités Disponibles

#### Frontend Statique
- ✅ Compilation statique optimisée
- ✅ Déployable sur tout hébergement web
- ✅ Sécurité maximale (fichiers statiques)
- ✅ Support PWA ready
- ✅ Optimisation SEO intégrée

#### Backend PHP 8.3
- ✅ API REST sécurisée
- ✅ Authentification par sessions
- ✅ Protection CSRF
- ✅ Rate limiting
- ✅ Validation stricte des entrées
- ✅ Hashage sécurisé des mots de passe (Argon2ID)

#### Base de Données MariaDB 10.4
- ✅ Schéma optimisé avec contraintes
- ✅ Index de performance
- ✅ Support JSON natif
- ✅ Transactions ACID

### Administration

**URL d'administration:** `https://votre-domaine.com/paradise-management`
**Identifiants par défaut:** 
- Utilisateur: `admin`
- Mot de passe: `admin123` (à changer en production!)

### Support Email

Le système d'envoi d'emails automatiques est configuré pour fonctionner avec:
- ✅ Hostinger SMTP
- ✅ Infomaniak SMTP 
- ✅ Tout autre serveur SMTP

### Maintenance

#### Sauvegarde Base de Données
```bash
mysqldump -u petparadise_app -p petparadise > backup_$(date +%Y%m%d).sql
```

#### Mise à jour Application
```bash
# Frontend
npm run build

# Backend - aucune action nécessaire, juste copier les nouveaux fichiers
```

Cette architecture garantit une sécurité maximale et une facilité de déploiement sur tout hébergement web standard.