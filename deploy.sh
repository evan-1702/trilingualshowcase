#!/bin/bash
# Script de déploiement - Élimine Node.js pour hébergement 100% PHP

echo "🚀 Préparation du déploiement Pet Paradise 100% PHP"
echo "=================================================="

# 1. Compilation du frontend statique
echo "📦 Compilation du frontend React..."
npm run build

# 2. Copie des fichiers de déploiement
echo "📋 Préparation des fichiers de déploiement..."
cp -r api deploy/
cp -r dist deploy/

# 3. Création du .htaccess pour Apache
echo "⚙️  Configuration Apache..."
cat > deploy/.htaccess << 'EOF'
RewriteEngine On

# Sécurité - Bloquer l'accès aux fichiers sensibles
<Files ~ "^(\.env|\.git|config/)">
    Order Allow,Deny
    Deny from all
</Files>

# Headers de sécurité
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Redirection vers index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# Cache des assets statiques
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
</IfModule>
EOF

# 4. Création du fichier de configuration exemple
echo "📝 Création de la configuration..."
cat > deploy/.env.example << 'EOF'
# Configuration base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=petparadise
DB_USER=petparadise_user
DB_PASS=mot_de_passe_securise

# Configuration SMTP Hostinger
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=contact@votredomaine.com
SMTP_PASS=votre_mot_de_passe_email
SMTP_SECURE=false

# Configuration site
SITE_EMAIL=contact@votredomaine.com
BASE_URL=https://votredomaine.com
EOF

# 5. Instructions finales
echo ""
echo "✅ Déploiement préparé!"
echo ""
echo "📁 Dossier 'deploy/' contient tout le nécessaire"
echo ""
echo "🔧 Étapes suivantes:"
echo "1. Uploadez le contenu de 'deploy/' sur votre hébergeur"
echo "2. Renommez .env.example en .env et configurez vos paramètres"
echo "3. Créez la base de données MySQL/MariaDB"
echo "4. Pointez votre domaine vers index.php"
echo ""
echo "🌐 Hébergeurs compatibles:"
echo "   - Hostinger (PHP 8.3 + MySQL)"
echo "   - Infomaniak (PHP 8.3 + MySQL)"
echo "   - OVH (PHP 8.3 + MySQL)"
echo "   - Tout hébergeur avec PHP 8.3+"
echo ""
echo "🚫 Node.js N'EST PLUS REQUIS!"