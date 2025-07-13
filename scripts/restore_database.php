<?php
declare(strict_types=1);

/**
 * Script de restauration de la base de données Pet Paradise
 * Restaure la structure et les données depuis un fichier SQL
 */

if ($argc < 2) {
    echo "Usage: php restore_database.php <fichier_sql>\n";
    echo "Exemple: php restore_database.php database_backup_2025-07-13_14-30-00.sql\n";
    exit(1);
}

$sqlFile = $argv[1];

if (!file_exists($sqlFile)) {
    echo "❌ Fichier SQL introuvable: $sqlFile\n";
    exit(1);
}

// Configuration de la base de données
$host = $_ENV['PGHOST'] ?? 'localhost';
$port = $_ENV['PGPORT'] ?? '5432';
$dbname = $_ENV['PGDATABASE'] ?? 'petparadise';
$username = $_ENV['PGUSER'] ?? 'postgres';
$password = $_ENV['PGPASSWORD'] ?? '';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    echo "🔄 Restauration de la base de données...\n";
    echo "Fichier: $sqlFile\n";
    echo "Taille: " . formatBytes(filesize($sqlFile)) . "\n\n";
    
    // Lire le fichier SQL
    $sqlContent = file_get_contents($sqlFile);
    
    // Diviser en requêtes individuelles
    $queries = explode(';', $sqlContent);
    
    $executedQueries = 0;
    $errors = 0;
    
    foreach ($queries as $query) {
        $query = trim($query);
        
        // Ignorer les commentaires et les lignes vides
        if (empty($query) || substr($query, 0, 2) === '--' || substr($query, 0, 3) === 'SET') {
            continue;
        }
        
        try {
            $pdo->exec($query);
            $executedQueries++;
            
            // Afficher le progrès pour les requêtes importantes
            if (stripos($query, 'CREATE TABLE') !== false) {
                preg_match('/CREATE TABLE (\w+)/', $query, $matches);
                $table = $matches[1] ?? 'inconnue';
                echo "✅ Table créée: $table\n";
            } elseif (stripos($query, 'INSERT INTO') !== false) {
                preg_match('/INSERT INTO (\w+)/', $query, $matches);
                $table = $matches[1] ?? 'inconnue';
                echo "📥 Données insérées: $table\n";
            }
            
        } catch (PDOException $e) {
            $errors++;
            echo "⚠️  Erreur dans la requête: " . substr($query, 0, 50) . "...\n";
            echo "   Message: " . $e->getMessage() . "\n";
        }
    }
    
    echo "\n=== RÉSULTATS DE LA RESTAURATION ===\n";
    echo "✅ Requêtes exécutées: $executedQueries\n";
    echo "❌ Erreurs: $errors\n";
    
    // Vérifier les tables restaurées
    $stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "\n=== TABLES RESTAURÉES ===\n";
    foreach ($tables as $table) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM $table");
        $stmt->execute();
        $count = $stmt->fetchColumn();
        echo "- $table: $count lignes\n";
    }
    
    // Vérifier l'utilisateur admin
    if (in_array('users', $tables)) {
        $stmt = $pdo->prepare("SELECT username FROM users WHERE username = 'admin'");
        $stmt->execute();
        $admin = $stmt->fetch();
        
        if ($admin) {
            echo "\n✅ Utilisateur admin restauré avec succès\n";
            echo "Login: admin\n";
            echo "Password: admin123\n";
        } else {
            echo "\n⚠️  Utilisateur admin non trouvé, création...\n";
            createAdminUser($pdo);
        }
    }
    
    echo "\n🎉 Restauration terminée avec succès!\n";
    
} catch (PDOException $e) {
    echo "❌ Erreur de base de données: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    exit(1);
}

/**
 * Créer l'utilisateur admin si manquant
 */
function createAdminUser(PDO $pdo): void {
    try {
        $hashedPassword = password_hash('admin123', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->execute(['admin', $hashedPassword]);
        echo "✅ Utilisateur admin créé\n";
    } catch (PDOException $e) {
        echo "❌ Erreur lors de la création de l'admin: " . $e->getMessage() . "\n";
    }
}

/**
 * Formater la taille des fichiers
 */
function formatBytes(int $bytes): string {
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, 2) . ' ' . $units[$pow];
}
?>