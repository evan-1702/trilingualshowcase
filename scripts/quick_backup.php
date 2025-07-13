<?php
declare(strict_types=1);

/**
 * Script de sauvegarde rapide Pet Paradise
 * Génère un fichier SQL complet pour recréer la base de données
 */

// Configuration PostgreSQL
$host = $_ENV['PGHOST'] ?? 'localhost';
$port = $_ENV['PGPORT'] ?? '5432';
$dbname = $_ENV['PGDATABASE'] ?? 'petparadise';
$username = $_ENV['PGUSER'] ?? 'postgres';
$password = $_ENV['PGPASSWORD'] ?? '';

$backupFile = 'petparadise_backup_' . date('Y-m-d_H-i-s') . '.sql';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    $sql = [];
    
    // En-tête
    $sql[] = "-- Pet Paradise - Sauvegarde complète";
    $sql[] = "-- Générée le: " . date('Y-m-d H:i:s');
    $sql[] = "-- Usage: psql -d petparadise -f " . $backupFile;
    $sql[] = "";
    
    // Supprimer les tables existantes
    $sql[] = "DROP TABLE IF EXISTS reservations CASCADE;";
    $sql[] = "DROP TABLE IF EXISTS room_pricing CASCADE;";
    $sql[] = "DROP TABLE IF EXISTS service_pricing CASCADE;";
    $sql[] = "DROP TABLE IF EXISTS room_schedule CASCADE;";
    $sql[] = "DROP TABLE IF EXISTS custom_messages CASCADE;";
    $sql[] = "DROP TABLE IF EXISTS contact_messages CASCADE;";
    $sql[] = "DROP TABLE IF EXISTS faq_items CASCADE;";
    $sql[] = "DROP TABLE IF EXISTS blog_posts CASCADE;";
    $sql[] = "DROP TABLE IF EXISTS site_settings CASCADE;";
    $sql[] = "DROP TABLE IF EXISTS rooms CASCADE;";
    $sql[] = "DROP TABLE IF EXISTS users CASCADE;";
    $sql[] = "";
    
    // Créer les tables
    $sql[] = "-- Table: users";
    $sql[] = "CREATE TABLE users (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    username VARCHAR(100) NOT NULL UNIQUE,";
    $sql[] = "    password VARCHAR(255) NOT NULL,";
    $sql[] = "    last_login TIMESTAMP NULL,";
    $sql[] = "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
    $sql[] = ");";
    $sql[] = "";
    
    $sql[] = "-- Table: rooms";
    $sql[] = "CREATE TABLE rooms (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    name VARCHAR(255) NOT NULL,";
    $sql[] = "    description TEXT,";
    $sql[] = "    surface INTEGER NOT NULL,";
    $sql[] = "    images TEXT[] DEFAULT '{}',";
    $sql[] = "    philosophy TEXT";
    $sql[] = ");";
    $sql[] = "";
    
    $sql[] = "-- Table: room_pricing";
    $sql[] = "CREATE TABLE room_pricing (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    room_id INTEGER NOT NULL,";
    $sql[] = "    service_name VARCHAR(255) NOT NULL,";
    $sql[] = "    price DECIMAL(10,2) NOT NULL";
    $sql[] = ");";
    $sql[] = "";
    
    $sql[] = "-- Table: service_pricing";
    $sql[] = "CREATE TABLE service_pricing (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    service_name VARCHAR(255) NOT NULL,";
    $sql[] = "    description TEXT,";
    $sql[] = "    price DECIMAL(10,2) NOT NULL";
    $sql[] = ");";
    $sql[] = "";
    
    $sql[] = "-- Table: room_schedule";
    $sql[] = "CREATE TABLE room_schedule (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    room_id INTEGER NOT NULL,";
    $sql[] = "    start_date DATE NOT NULL,";
    $sql[] = "    end_date DATE NOT NULL,";
    $sql[] = "    status VARCHAR(50) NOT NULL,";
    $sql[] = "    guest_info TEXT";
    $sql[] = ");";
    $sql[] = "";
    
    $sql[] = "-- Table: custom_messages";
    $sql[] = "CREATE TABLE custom_messages (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    title VARCHAR(255) NOT NULL,";
    $sql[] = "    content TEXT NOT NULL,";
    $sql[] = "    start_date DATE NOT NULL,";
    $sql[] = "    end_date DATE NOT NULL,";
    $sql[] = "    is_active BOOLEAN NOT NULL DEFAULT true,";
    $sql[] = "    language VARCHAR(10) NOT NULL DEFAULT 'fr',";
    $sql[] = "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
    $sql[] = ");";
    $sql[] = "";
    
    $sql[] = "-- Table: reservations";
    $sql[] = "CREATE TABLE reservations (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    customer_name VARCHAR(255) NOT NULL,";
    $sql[] = "    customer_first_name VARCHAR(255) NOT NULL,";
    $sql[] = "    customer_email VARCHAR(255) NOT NULL,";
    $sql[] = "    customer_phone VARCHAR(50) NOT NULL,";
    $sql[] = "    customer_address TEXT NOT NULL,";
    $sql[] = "    start_date DATE NOT NULL,";
    $sql[] = "    end_date DATE NOT NULL,";
    $sql[] = "    room_preference INTEGER,";
    $sql[] = "    number_of_animals INTEGER NOT NULL DEFAULT 1,";
    $sql[] = "    animals TEXT NOT NULL,";
    $sql[] = "    status VARCHAR(20) NOT NULL DEFAULT 'pending',";
    $sql[] = "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
    $sql[] = ");";
    $sql[] = "";
    
    $sql[] = "-- Table: contact_messages";
    $sql[] = "CREATE TABLE contact_messages (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    name VARCHAR(255) NOT NULL,";
    $sql[] = "    email VARCHAR(255) NOT NULL,";
    $sql[] = "    subject VARCHAR(255) NOT NULL,";
    $sql[] = "    message TEXT NOT NULL,";
    $sql[] = "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
    $sql[] = ");";
    $sql[] = "";
    
    $sql[] = "-- Table: faq_items";
    $sql[] = "CREATE TABLE faq_items (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    question VARCHAR(500) NOT NULL,";
    $sql[] = "    answer TEXT NOT NULL,";
    $sql[] = "    language VARCHAR(10) NOT NULL DEFAULT 'fr',";
    $sql[] = "    display_order INTEGER DEFAULT 0,";
    $sql[] = "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
    $sql[] = ");";
    $sql[] = "";
    
    $sql[] = "-- Table: blog_posts";
    $sql[] = "CREATE TABLE blog_posts (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    title VARCHAR(255) NOT NULL,";
    $sql[] = "    slug VARCHAR(255) NOT NULL,";
    $sql[] = "    excerpt TEXT,";
    $sql[] = "    content TEXT NOT NULL,";
    $sql[] = "    language VARCHAR(10) NOT NULL DEFAULT 'fr',";
    $sql[] = "    status VARCHAR(20) NOT NULL DEFAULT 'draft',";
    $sql[] = "    featured_image VARCHAR(500),";
    $sql[] = "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,";
    $sql[] = "    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
    $sql[] = ");";
    $sql[] = "";
    
    $sql[] = "-- Table: site_settings";
    $sql[] = "CREATE TABLE site_settings (";
    $sql[] = "    id SERIAL PRIMARY KEY,";
    $sql[] = "    key VARCHAR(255) NOT NULL UNIQUE,";
    $sql[] = "    value TEXT NOT NULL,";
    $sql[] = "    description TEXT,";
    $sql[] = "    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
    $sql[] = ");";
    $sql[] = "";
    
    // Maintenant, extraire les données réelles
    echo "Extraction des données existantes...\n";
    
    // Utilisateurs
    $stmt = $pdo->query("SELECT * FROM users");
    $users = $stmt->fetchAll();
    if ($users) {
        $sql[] = "-- Données: users";
        foreach ($users as $user) {
            $sql[] = "INSERT INTO users (username, password, last_login, created_at) VALUES ('{$user['username']}', '{$user['password']}', " . 
                ($user['last_login'] ? "'{$user['last_login']}'" : "NULL") . ", " . 
                ($user['created_at'] ? "'{$user['created_at']}'" : "CURRENT_TIMESTAMP") . ");";
        }
        $sql[] = "";
    }
    
    // Chambres
    $stmt = $pdo->query("SELECT * FROM rooms");
    $rooms = $stmt->fetchAll();
    if ($rooms) {
        $sql[] = "-- Données: rooms";
        foreach ($rooms as $room) {
            $images = $room['images'] ? "'{" . implode(',', json_decode($room['images'], true)) . "}'" : "'{}'";
            $sql[] = "INSERT INTO rooms (name, description, surface, images, philosophy) VALUES ('{$room['name']}', '{$room['description']}', {$room['surface']}, $images, '{$room['philosophy']}');";
        }
        $sql[] = "";
    }
    
    // Messages personnalisés
    $stmt = $pdo->query("SELECT * FROM custom_messages");
    $messages = $stmt->fetchAll();
    if ($messages) {
        $sql[] = "-- Données: custom_messages";
        foreach ($messages as $msg) {
            $sql[] = "INSERT INTO custom_messages (title, content, start_date, end_date, is_active, language, created_at) VALUES ('{$msg['title']}', '{$msg['content']}', '{$msg['start_date']}', '{$msg['end_date']}', " . 
                ($msg['is_active'] ? 'true' : 'false') . ", '{$msg['language']}', " . 
                ($msg['created_at'] ? "'{$msg['created_at']}'" : "CURRENT_TIMESTAMP") . ");";
        }
        $sql[] = "";
    }
    
    // Réservations
    $stmt = $pdo->query("SELECT * FROM reservations");
    $reservations = $stmt->fetchAll();
    if ($reservations) {
        $sql[] = "-- Données: reservations";
        foreach ($reservations as $res) {
            $sql[] = "INSERT INTO reservations (customer_name, customer_first_name, customer_email, customer_phone, customer_address, start_date, end_date, room_preference, number_of_animals, animals, status, created_at) VALUES ('{$res['customer_name']}', '{$res['customer_first_name']}', '{$res['customer_email']}', '{$res['customer_phone']}', '{$res['customer_address']}', '{$res['start_date']}', '{$res['end_date']}', " . 
                ($res['room_preference'] ?: 'NULL') . ", {$res['number_of_animals']}, '{$res['animals']}', '{$res['status']}', " . 
                ($res['created_at'] ? "'{$res['created_at']}'" : "CURRENT_TIMESTAMP") . ");";
        }
        $sql[] = "";
    }
    
    // Créer l'utilisateur admin s'il n'existe pas
    $sql[] = "-- Utilisateur admin par défaut";
    $sql[] = "INSERT INTO users (username, password) VALUES ('admin', '" . password_hash('admin123', PASSWORD_BCRYPT) . "') ON CONFLICT (username) DO NOTHING;";
    $sql[] = "";
    
    // Données par défaut des chambres
    $sql[] = "-- Chambres par défaut";
    $sql[] = "INSERT INTO rooms (name, description, surface, philosophy) VALUES ";
    $sql[] = "('Chambre Confort', 'Chambre spacieuse et confortable pour petits et moyens chiens', 25, 'Confort et bien-être pour votre compagnon'),";
    $sql[] = "('Suite Prestige', 'Suite de luxe avec terrasse privée pour grands chiens', 35, 'Le luxe à la portée de votre animal'),";
    $sql[] = "('Chambre Féline', 'Environnement spécialement conçu pour les chats', 20, 'Un cocon douillet pour nos amis félins'),";
    $sql[] = "('Studio Familial', 'Grand espace pour plusieurs animaux de la même famille', 40, 'Ensemble, comme à la maison')";
    $sql[] = "ON CONFLICT DO NOTHING;";
    $sql[] = "";
    
    // Messages par défaut
    $sql[] = "-- Messages par défaut";
    $sql[] = "INSERT INTO custom_messages (title, content, start_date, end_date, language) VALUES ";
    $sql[] = "('Bienvenue chez Pet Paradise', 'Nous prenons soin de vos animaux avec amour et professionnalisme.', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 'fr'),";
    $sql[] = "('Welcome to Pet Paradise', 'We take care of your pets with love and professionalism.', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 'en'),";
    $sql[] = "('Bienvenido a Pet Paradise', 'Cuidamos a sus mascotas con amor y profesionalismo.', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 'es')";
    $sql[] = "ON CONFLICT DO NOTHING;";
    $sql[] = "";
    
    // Fin du script
    $sql[] = "-- Fin de la sauvegarde";
    $sql[] = "SELECT 'Database Pet Paradise restaurée avec succès!' AS message;";
    
    // Écrire le fichier
    file_put_contents($backupFile, implode("\n", $sql));
    
    echo "✅ Sauvegarde créée: $backupFile\n";
    echo "📄 Taille: " . round(filesize($backupFile) / 1024, 2) . " KB\n";
    echo "🚀 Pour restaurer: psql -d petparadise -f $backupFile\n";
    echo "\n🎯 Contenu de la sauvegarde:\n";
    echo "- Structure complète de la base de données\n";
    echo "- Données existantes préservées\n";
    echo "- Utilisateur admin (admin/admin123)\n";
    echo "- Chambres par défaut\n";
    echo "- Messages multilingues\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    exit(1);
}
?>