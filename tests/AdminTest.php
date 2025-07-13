<?php
declare(strict_types=1);

require_once __DIR__ . '/../deploy/api/config/database.php';
require_once __DIR__ . '/../deploy/api/models/User.php';
require_once __DIR__ . '/../deploy/api/controllers/AuthController.php';

class AdminTest {
    private static $testResults = [];
    
    public static function runAllTests(): void {
        echo "=== TESTS ADMINISTRATEUR PET PARADISE ===\n";
        
        self::testDatabaseConnection();
        self::testAdminUserExists();
        self::testAdminLogin();
        self::testDatabaseInitialization();
        
        self::displayResults();
    }
    
    private static function testDatabaseConnection(): void {
        try {
            $db = Database::getConnection();
            self::$testResults[] = ['✅ Connexion base de données', 'OK'];
        } catch (Exception $e) {
            self::$testResults[] = ['❌ Connexion base de données', 'ERREUR: ' . $e->getMessage()];
        }
    }
    
    private static function testAdminUserExists(): void {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute(['admin']);
            $user = $stmt->fetch();
            
            if ($user) {
                self::$testResults[] = ['✅ Utilisateur admin existe', 'OK - ID: ' . $user['id']];
            } else {
                self::$testResults[] = ['❌ Utilisateur admin existe', 'ERREUR: Utilisateur non trouvé'];
            }
        } catch (Exception $e) {
            self::$testResults[] = ['❌ Utilisateur admin existe', 'ERREUR: ' . $e->getMessage()];
        }
    }
    
    private static function testAdminLogin(): void {
        try {
            $userModel = new User();
            $user = $userModel->authenticateUser('admin', 'admin123');
            
            if ($user) {
                self::$testResults[] = ['✅ Authentification admin', 'OK - Login fonctionnel'];
            } else {
                self::$testResults[] = ['❌ Authentification admin', 'ERREUR: Échec de l\'authentification'];
            }
        } catch (Exception $e) {
            self::$testResults[] = ['❌ Authentification admin', 'ERREUR: ' . $e->getMessage()];
        }
    }
    
    private static function testDatabaseInitialization(): void {
        try {
            Database::initializeSchema();
            
            $db = Database::getConnection();
            $tables = ['users', 'rooms', 'reservations', 'custom_messages', 'faq_items', 'blog_posts'];
            $allTablesExist = true;
            
            foreach ($tables as $table) {
                $stmt = $db->prepare("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?");
                $stmt->execute([$table]);
                if ($stmt->fetchColumn() == 0) {
                    $allTablesExist = false;
                    break;
                }
            }
            
            if ($allTablesExist) {
                self::$testResults[] = ['✅ Initialisation schéma', 'OK - Toutes les tables créées'];
            } else {
                self::$testResults[] = ['❌ Initialisation schéma', 'ERREUR: Tables manquantes'];
            }
        } catch (Exception $e) {
            self::$testResults[] = ['❌ Initialisation schéma', 'ERREUR: ' . $e->getMessage()];
        }
    }
    
    private static function displayResults(): void {
        echo "\n=== RÉSULTATS DES TESTS ===\n";
        foreach (self::$testResults as $result) {
            echo $result[0] . ': ' . $result[1] . "\n";
        }
        
        $failed = array_filter(self::$testResults, function($result) {
            return strpos($result[0], '❌') !== false;
        });
        
        if (empty($failed)) {
            echo "\n🎉 TOUS LES TESTS PASSENT - L'administration est fonctionnelle!\n";
            echo "Login: admin\nPassword: admin123\nURL: /paradise-management\n";
        } else {
            echo "\n⚠️  " . count($failed) . " test(s) échoué(s) - Correction nécessaire\n";
        }
    }
}

// Fonction pour réparer l'administration si nécessaire
function fixAdminAccess(): void {
    echo "=== RÉPARATION ACCÈS ADMINISTRATEUR ===\n";
    
    try {
        // Réinitialiser le schéma
        Database::initializeSchema();
        
        // Vérifier/créer l'utilisateur admin
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute(['admin']);
        $user = $stmt->fetch();
        
        if (!$user) {
            $hashedPassword = password_hash('admin123', PASSWORD_BCRYPT);
            $stmt = $db->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            $stmt->execute(['admin', $hashedPassword]);
            echo "✅ Utilisateur admin créé\n";
        } else {
            echo "✅ Utilisateur admin existe déjà\n";
        }
        
        echo "✅ Accès administrateur réparé!\n";
        echo "URL: /paradise-management\n";
        echo "Login: admin\n";
        echo "Password: admin123\n";
        
    } catch (Exception $e) {
        echo "❌ Erreur lors de la réparation: " . $e->getMessage() . "\n";
    }
}

// Exécution des tests
AdminTest::runAllTests();
?>