<?php
declare(strict_types=1);

class Database {
    private static ?PDO $connection = null;
    
    public static function getConnection(): PDO {
        if (self::$connection === null) {
            self::$connection = self::createConnection();
        }
        return self::$connection;
    }
    
    private static function createConnection(): PDO {
        // Use PostgreSQL since MariaDB is not available
        $host = $_ENV['PGHOST'] ?? 'localhost';
        $port = $_ENV['PGPORT'] ?? '5432';
        $dbname = $_ENV['PGDATABASE'] ?? 'petparadise';
        $username = $_ENV['PGUSER'] ?? 'postgres';
        $password = $_ENV['PGPASSWORD'] ?? '';
        
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
        
        try {
            $pdo = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            
            return $pdo;
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }
    
    public static function initializeSchema(): void {
        $db = self::getConnection();
        
        // Create tables
        $db->exec("
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                last_login TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        $db->exec("
            CREATE TABLE IF NOT EXISTS rooms (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                surface DECIMAL(10,2) DEFAULT 0.00,
                images JSON,
                philosophy TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        $db->exec("
            CREATE TABLE IF NOT EXISTS reservations (
                id SERIAL PRIMARY KEY,
                customer_name VARCHAR(255) NOT NULL,
                customer_first_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255) NOT NULL,
                customer_phone VARCHAR(50) NOT NULL,
                customer_address TEXT NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                room_preference INTEGER REFERENCES rooms(id),
                number_of_animals INTEGER NOT NULL DEFAULT 1,
                animals JSON NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT chk_valid_dates CHECK (end_date > start_date)
            )
        ");
        
        $db->exec("
            CREATE TABLE IF NOT EXISTS custom_messages (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                language VARCHAR(10) NOT NULL DEFAULT 'fr',
                is_active BOOLEAN NOT NULL DEFAULT true,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        $db->exec("
            CREATE TABLE IF NOT EXISTS faq_items (
                id SERIAL PRIMARY KEY,
                question VARCHAR(500) NOT NULL,
                answer TEXT NOT NULL,
                language VARCHAR(10) NOT NULL DEFAULT 'fr',
                display_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        $db->exec("
            CREATE TABLE IF NOT EXISTS blog_posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL,
                excerpt TEXT,
                content TEXT NOT NULL,
                language VARCHAR(10) NOT NULL DEFAULT 'fr',
                status VARCHAR(20) NOT NULL DEFAULT 'draft',
                featured_image VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        // Insert default data
        $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
        $stmt->execute(['admin']);
        if ($stmt->fetchColumn() == 0) {
            $hashedPassword = password_hash('admin123', PASSWORD_ARGON2ID);
            $stmt = $db->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            $stmt->execute(['admin', $hashedPassword]);
        }
        
        // Insert sample rooms
        $stmt = $db->prepare("SELECT COUNT(*) FROM rooms");
        $stmt->execute();
        if ($stmt->fetchColumn() == 0) {
            $rooms = [
                ['name' => 'Chambre Confort', 'description' => 'Chambre spacieuse avec vue sur le jardin', 'surface' => 25.0, 'philosophy' => 'Une seule famille par chambre'],
                ['name' => 'Suite Prestige', 'description' => 'Notre plus belle suite avec terrasse privée', 'surface' => 35.0, 'philosophy' => 'Espace exclusif pour le bien-être optimal'],
                ['name' => 'Chambre Féline', 'description' => 'Spécialement aménagée pour les chats', 'surface' => 20.0, 'philosophy' => 'Environnement adapté aux félins'],
                ['name' => 'Studio Familial', 'description' => 'Parfait pour plusieurs animaux d\'une même famille', 'surface' => 40.0, 'philosophy' => 'Espace généreux pour maintenir les liens familiaux']
            ];
            
            $stmt = $db->prepare("INSERT INTO rooms (name, description, surface, philosophy, images) VALUES (?, ?, ?, ?, ?)");
            foreach ($rooms as $room) {
                $images = json_encode(['https://images.unsplash.com/photo-1601758228041-f3b2795255f1']);
                $stmt->execute([$room['name'], $room['description'], $room['surface'], $room['philosophy'], $images]);
            }
        }
        
        // Insert sample messages
        $stmt = $db->prepare("SELECT COUNT(*) FROM custom_messages");
        $stmt->execute();
        if ($stmt->fetchColumn() == 0) {
            $messages = [
                ['title' => 'Bienvenue chez Pet Paradise', 'content' => 'Nous prenons soin de vos animaux avec amour et professionnalisme.', 'language' => 'fr'],
                ['title' => 'Welcome to Pet Paradise', 'content' => 'We take care of your pets with love and professionalism.', 'language' => 'en'],
                ['title' => 'Bienvenido a Pet Paradise', 'content' => 'Cuidamos a sus mascotas con amor y profesionalismo.', 'language' => 'es']
            ];
            
            $today = date('Y-m-d');
            $future = date('Y-m-d', strtotime('+1 year'));
            $stmt = $db->prepare("INSERT INTO custom_messages (title, content, language, start_date, end_date) VALUES (?, ?, ?, ?, ?)");
            foreach ($messages as $msg) {
                $stmt->execute([$msg['title'], $msg['content'], $msg['language'], $today, $future]);
            }
        }
    }
}
?>