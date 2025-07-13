<?php
// Script de test pour vérifier que l'API PHP fonctionne correctement
declare(strict_types=1);

echo "🧪 Test de l'API Pet Paradise PHP 8.3\n";
echo "=====================================\n\n";

// Test 1: Configuration de base
echo "1. Test configuration de base...\n";
require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/config/security.php';
require_once __DIR__ . '/config/database.php';

try {
    $db = Database::getConnection();
    echo "✅ Connexion base de données: OK\n";
} catch (Exception $e) {
    echo "❌ Connexion base de données: ERREUR - " . $e->getMessage() . "\n";
}

// Test 2: Modèles
echo "\n2. Test des modèles...\n";
try {
    require_once __DIR__ . '/models/Room.php';
    $roomModel = new Room();
    echo "✅ Modèle Room: OK\n";
    
    require_once __DIR__ . '/models/Reservation.php';
    $reservationModel = new Reservation();
    echo "✅ Modèle Reservation: OK\n";
    
    require_once __DIR__ . '/models/User.php';
    $userModel = new User();
    echo "✅ Modèle User: OK\n";
} catch (Exception $e) {
    echo "❌ Modèles: ERREUR - " . $e->getMessage() . "\n";
}

// Test 3: Sécurité
echo "\n3. Test des fonctions de sécurité...\n";
try {
    $testInput = "<script>alert('test')</script>";
    $cleanInput = SecurityConfig::validateInput($testInput);
    echo "✅ Validation input: OK (nettoyé: " . $cleanInput . ")\n";
    
    $testEmail = "test@example.com";
    $isValid = SecurityConfig::validateEmail($testEmail);
    echo "✅ Validation email: " . ($isValid ? "OK" : "ERREUR") . "\n";
    
    $password = "testpassword123";
    $hash = SecurityConfig::hashPassword($password);
    $verify = SecurityConfig::verifyPassword($password, $hash);
    echo "✅ Hashage/vérification mot de passe: " . ($verify ? "OK" : "ERREUR") . "\n";
} catch (Exception $e) {
    echo "❌ Sécurité: ERREUR - " . $e->getMessage() . "\n";
}

// Test 4: Email (si configuré)
echo "\n4. Test configuration email...\n";
if (!empty($_ENV['SMTP_USER']) && !empty($_ENV['SMTP_PASS'])) {
    echo "✅ Configuration SMTP: Trouvée\n";
    echo "   - Host: " . ($_ENV['SMTP_HOST'] ?? 'non défini') . "\n";
    echo "   - Port: " . ($_ENV['SMTP_PORT'] ?? 'non défini') . "\n";
    echo "   - User: " . ($_ENV['SMTP_USER'] ?? 'non défini') . "\n";
} else {
    echo "⚠️  Configuration SMTP: Non configurée (optionnelle)\n";
}

echo "\n5. Structure des fichiers...\n";
$requiredFiles = [
    'index.php',
    'config/database.php',
    'config/security.php',
    'models/BaseModel.php',
    'controllers/ReservationController.php',
    'middleware/AuthMiddleware.php'
];

foreach ($requiredFiles as $file) {
    if (file_exists(__DIR__ . '/' . $file)) {
        echo "✅ $file: Présent\n";
    } else {
        echo "❌ $file: Manquant\n";
    }
}

echo "\n🎉 Tests terminés!\n";
echo "\nPour démarrer le serveur de développement:\n";
echo "php -S localhost:8000 -t api/ api/server.php\n\n";
echo "L'API sera disponible sur: http://localhost:8000\n";
echo "Test d'endpoint: http://localhost:8000/rooms\n";
?>