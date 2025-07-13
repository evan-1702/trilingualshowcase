#!/bin/bash
# Script de démarrage pour la version 100% PHP (SANS Node.js)

echo "🚀 Démarrage Pet Paradise - Version PHP Pure"
echo "=============================================="

# Vérification des variables d'environnement
if [ -z "$PGPASSWORD" ]; then
    echo "❌ Variable PGPASSWORD manquante"
    exit 1
fi

echo "✅ Variables d'environnement: OK"

# Démarrage du serveur PHP intégré
cd deploy
echo "🌐 Démarrage serveur PHP sur http://localhost:8080"
echo "📁 Dossier: $(pwd)"
echo "🔧 Version PHP: $(php -v | head -n 1)"

# Serveur PHP avec routage SPA
php -S 0.0.0.0:8080 index.php