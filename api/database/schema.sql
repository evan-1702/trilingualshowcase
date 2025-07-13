-- Pet Paradise Database Schema for MariaDB 10.4
-- Created with maximum security settings

CREATE DATABASE IF NOT EXISTS petparadise CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE petparadise;

-- Users table for admin authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB;

-- Rooms table
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INT NOT NULL DEFAULT 1,
    size DECIMAL(10,2) DEFAULT 0.00,
    amenities JSON,
    images JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_capacity (capacity)
) ENGINE=InnoDB;

-- Room pricing table
CREATE TABLE room_pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    season VARCHAR(50) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_room_season (room_id, season)
) ENGINE=InnoDB;

-- Service pricing table
CREATE TABLE service_pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'fr',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_language (language)
) ENGINE=InnoDB;

-- Room schedule table
CREATE TABLE room_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('available', 'occupied', 'maintenance') NOT NULL DEFAULT 'available',
    guest_info VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_room_dates (room_id, start_date, end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Reservations table
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_first_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    room_preference INT NULL,
    number_of_animals INT NOT NULL DEFAULT 1,
    animals JSON NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_preference) REFERENCES rooms(id) ON DELETE SET NULL,
    INDEX idx_email (customer_email),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Contact messages table
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'responded') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Custom messages table
CREATE TABLE custom_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('info', 'warning', 'promotion') NOT NULL DEFAULT 'info',
    language VARCHAR(10) NOT NULL DEFAULT 'fr',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_language (is_active, language),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB;

-- FAQ items table
CREATE TABLE faq_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'fr',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_language_active (language, is_active),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB;

-- Blog posts table
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'fr',
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    featured_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_slug_language (slug, language),
    INDEX idx_status_language (status, language),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Site settings table
CREATE TABLE site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key)
) ENGINE=InnoDB;

-- Insert default admin user (password: admin123 - change in production!)
INSERT INTO users (username, password) VALUES 
('admin', '$argon2id$v=19$m=65536,t=4,p=3$cGV0cGFyYWRpc2U$7YwHzbmStjhU9qWQvJUwBqGvO1qCgP8nF4TKPOj8bFY');

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, description) VALUES 
('site_email', 'contact@petparadise.com', 'Email principal du site pour recevoir les notifications'),
('site_name', 'Pet Paradise', 'Nom du site'),
('site_description', 'Hébergement de qualité pour vos animaux de compagnie', 'Description du site');

-- Insert sample rooms
INSERT INTO rooms (name, description, capacity, size, amenities, images) VALUES 
('Chambre Standard', 'Chambre confortable pour petits animaux', 2, 15.50, '["Climatisation", "Litière", "Jouets"]', '["room1.jpg"]'),
('Suite Deluxe', 'Suite spacieuse avec terrasse privée', 4, 25.00, '["Climatisation", "Terrasse", "Litière premium", "Jouets", "Caméra"]', '["room2.jpg", "room2-terrace.jpg"]'),
('Appartement Familial', 'Grand espace pour familles d\'animaux', 6, 40.00, '["Climatisation", "Deux terrasses", "Litière premium", "Jouets variés", "Caméra", "Coin repos"]', '["room3.jpg"]);

-- Insert sample pricing
INSERT INTO room_pricing (room_id, season, price_per_night) VALUES 
(1, 'high', 35.00),
(1, 'low', 25.00),
(2, 'high', 55.00),
(2, 'low', 40.00),
(3, 'high', 75.00),
(3, 'low', 60.00);

-- Insert sample service pricing
INSERT INTO service_pricing (service_name, description, price, language) VALUES 
('Promenade quotidienne', 'Promenade de 30 minutes par jour', 15.00, 'fr'),
('Soins vétérinaires', 'Consultation et soins de base', 45.00, 'fr'),
('Transport', 'Service de transport aller-retour', 25.00, 'fr'),
('Daily walk', '30-minute daily walk', 15.00, 'en'),
('Veterinary care', 'Basic consultation and care', 45.00, 'en'),
('Transport', 'Round-trip transport service', 25.00, 'en'),
('Paseo diario', 'Paseo de 30 minutos por día', 15.00, 'es'),
('Atención veterinaria', 'Consulta y cuidados básicos', 45.00, 'es'),
('Transporte', 'Servicio de transporte ida y vuelta', 25.00, 'es');

-- Insert sample FAQ
INSERT INTO faq_items (question, answer, language, display_order) VALUES 
('Quels animaux acceptez-vous ?', 'Nous accueillons chats, chiens, lapins, oiseaux et autres petits animaux domestiques.', 'fr', 1),
('Quels sont vos horaires ?', 'Nous sommes ouverts 7j/7 de 8h à 20h. Les urgences sont prises en charge 24h/24.', 'fr', 2),
('Faut-il apporter la nourriture ?', 'Vous pouvez apporter la nourriture habituelle de votre animal ou utiliser notre service de restauration premium.', 'fr', 3);

-- Create security constraints
ALTER TABLE users ADD CONSTRAINT chk_username_length CHECK (CHAR_LENGTH(username) >= 3);
ALTER TABLE reservations ADD CONSTRAINT chk_valid_dates CHECK (end_date > start_date);
ALTER TABLE reservations ADD CONSTRAINT chk_animals_count CHECK (number_of_animals > 0);
ALTER TABLE room_pricing ADD CONSTRAINT chk_positive_price CHECK (price_per_night > 0);
ALTER TABLE service_pricing ADD CONSTRAINT chk_positive_service_price CHECK (price > 0);

-- Create database user for application (replace with secure credentials in production)
-- CREATE USER 'petparadise_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON petparadise.* TO 'petparadise_app'@'localhost';
-- FLUSH PRIVILEGES;