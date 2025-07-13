-- Pet Paradise - Sauvegarde complète
-- Générée le: 2025-07-13 14:23:12
-- Usage: psql -d petparadise -f petparadise_backup_2025-07-13_14-23-05.sql

DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS room_pricing CASCADE;
DROP TABLE IF EXISTS service_pricing CASCADE;
DROP TABLE IF EXISTS room_schedule CASCADE;
DROP TABLE IF EXISTS custom_messages CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS faq_items CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: rooms
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    surface INTEGER NOT NULL,
    images TEXT[] DEFAULT '{}',
    philosophy TEXT
);

-- Table: room_pricing
CREATE TABLE room_pricing (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Table: service_pricing
CREATE TABLE service_pricing (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL
);

-- Table: room_schedule
CREATE TABLE room_schedule (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    guest_info TEXT
);

-- Table: custom_messages
CREATE TABLE custom_messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    language VARCHAR(10) NOT NULL DEFAULT 'fr',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: reservations
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_first_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    room_preference INTEGER,
    number_of_animals INTEGER NOT NULL DEFAULT 1,
    animals TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: contact_messages
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: faq_items
CREATE TABLE faq_items (
    id SERIAL PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'fr',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: blog_posts
CREATE TABLE blog_posts (
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
);

-- Table: site_settings
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Données: users
INSERT INTO users (username, password, last_login, created_at) VALUES ('admin', '$2y$10$i71fvJve2UHu3inKhEMIOe5oYHN3WLNUqvh5dZ3z0HILRWRso1Ysi', '2025-07-13 13:44:44', '2025-07-13 13:43:55.914267');

-- Données: rooms
INSERT INTO rooms (name, description, surface, images, philosophy) VALUES ('Chambre Confort', 'Chambre spacieuse et confortable pour petits et moyens chiens', 25, '{}', 'Confort et bien-être pour votre compagnon');
INSERT INTO rooms (name, description, surface, images, philosophy) VALUES ('Suite Prestige', 'Suite de luxe avec terrasse privée pour grands chiens', 35, '{}', 'Le luxe à la portée de votre animal');
INSERT INTO rooms (name, description, surface, images, philosophy) VALUES ('Chambre Féline', 'Environnement spécialement conçu pour les chats', 20, '{}', 'Un cocon douillet pour nos amis félins');
INSERT INTO rooms (name, description, surface, images, philosophy) VALUES ('Studio Familial', 'Grand espace pour plusieurs animaux de la même famille', 40, '{}', 'Ensemble, comme à la maison');

-- Données: custom_messages
INSERT INTO custom_messages (title, content, start_date, end_date, is_active, language, created_at) VALUES ('Bienvenue chez Pet Paradise', 'Nous prenons soin de vos animaux avec amour et professionnalisme.', '2025-07-13', '2026-07-13', true, 'fr', '2025-07-13 13:43:57.096281');
INSERT INTO custom_messages (title, content, start_date, end_date, is_active, language, created_at) VALUES ('Welcome to Pet Paradise', 'We take care of your pets with love and professionalism.', '2025-07-13', '2026-07-13', true, 'en', '2025-07-13 13:43:57.096281');
INSERT INTO custom_messages (title, content, start_date, end_date, is_active, language, created_at) VALUES ('Bienvenido a Pet Paradise', 'Cuidamos a sus mascotas con amor y profesionalismo.', '2025-07-13', '2026-07-13', true, 'es', '2025-07-13 13:43:57.096281');

-- Utilisateur admin par défaut
INSERT INTO users (username, password) VALUES ('admin', '$2y$10$StRxVMBTBmU/FP2NNW0iZu.DT6gXpY5rT8J97dEXM0jtUtfQQul9m') ON CONFLICT (username) DO NOTHING;

-- Chambres par défaut
INSERT INTO rooms (name, description, surface, philosophy) VALUES 
('Chambre Confort', 'Chambre spacieuse et confortable pour petits et moyens chiens', 25, 'Confort et bien-être pour votre compagnon'),
('Suite Prestige', 'Suite de luxe avec terrasse privée pour grands chiens', 35, 'Le luxe à la portée de votre animal'),
('Chambre Féline', 'Environnement spécialement conçu pour les chats', 20, 'Un cocon douillet pour nos amis félins'),
('Studio Familial', 'Grand espace pour plusieurs animaux de la même famille', 40, 'Ensemble, comme à la maison')
ON CONFLICT DO NOTHING;

-- Messages par défaut
INSERT INTO custom_messages (title, content, start_date, end_date, language) VALUES 
('Bienvenue chez Pet Paradise', 'Nous prenons soin de vos animaux avec amour et professionnalisme.', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 'fr'),
('Welcome to Pet Paradise', 'We take care of your pets with love and professionalism.', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 'en'),
('Bienvenido a Pet Paradise', 'Cuidamos a sus mascotas con amor y profesionalismo.', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', 'es')
ON CONFLICT DO NOTHING;

-- Fin de la sauvegarde
SELECT 'Database Pet Paradise restaurée avec succès!' AS message;