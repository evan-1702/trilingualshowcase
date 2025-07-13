# Documentation Technique Complète - Site Web Vitrine Multilingue

## Vue d'ensemble du Projet

### Description
Plateforme web multilingue avancée pour l'hébergement d'animaux, offrant une expérience de réservation sophistiquée et interactive avec des intégrations technologiques de pointe.

### Langues Supportées
- Français (fr) - Langue par défaut
- Anglais (en)
- Espagnol (es)

### Technologies Utilisées
- **Frontend**: React 18 avec TypeScript
- **Backend**: PHP 8.3 avec architecture API RESTful robuste
- **Base de données**: PostgreSQL pour la gestion fiable des données
- **Proxy**: Node.js Express pour le développement
- **Styling**: Tailwind CSS + shadcn/ui
- **Gestion d'état**: TanStack Query v5
- **Routage**: Wouter
- **Authentification**: Sessions PHP avec bcrypt

## Architecture du Système

### Structure Frontend (React + TypeScript)
```
client/
├── src/
│   ├── components/
│   │   └── ui/          # Composants shadcn/ui
│   ├── pages/
│   │   ├── admin/       # Panel d'administration
│   │   ├── Home.tsx     # Page d'accueil
│   │   ├── Rooms.tsx    # Chambres et services
│   │   ├── Pricing.tsx  # Tarifs
│   │   ├── Contact.tsx  # Contact
│   │   ├── FAQ.tsx      # Questions fréquentes
│   │   ├── Blog.tsx     # Blog
│   │   └── Reservations.tsx # Réservations
│   ├── lib/
│   │   ├── i18n.tsx     # Gestion multilingue
│   │   └── utils.ts     # Utilitaires
│   ├── App.tsx          # Routeur principal
│   └── main.tsx         # Point d'entrée
└── index.html
```

### Structure Backend (PHP 8.3)
```
api/
├── controllers/
│   ├── AuthController.php      # Authentification admin
│   ├── RoomController.php      # Gestion des chambres
│   ├── ReservationController.php # Réservations
│   ├── ContactController.php   # Messages de contact
│   ├── BlogController.php      # Articles de blog
│   ├── FAQController.php       # Questions fréquentes
│   ├── ScheduleController.php  # Planification
│   └── ServiceController.php   # Services additionnels
├── models/
│   ├── BaseModel.php          # Modèle de base
│   ├── Room.php               # Modèle chambre
│   ├── Reservation.php        # Modèle réservation
│   ├── ContactMessage.php     # Messages de contact
│   ├── BlogPost.php           # Articles de blog
│   ├── FAQItem.php            # Questions FAQ
│   ├── RoomSchedule.php       # Planification
│   └── ServicePricing.php     # Tarification services
├── middleware/
│   └── AuthMiddleware.php     # Middleware d'authentification
├── config/
│   ├── database.php           # Configuration base de données
│   ├── env.php                # Variables d'environnement
│   └── security.php           # Configuration sécurité
└── index.php                  # Point d'entrée API
```

### Structure Base de Données (PostgreSQL)

#### Tables Principales

**users**
- id (SERIAL PRIMARY KEY)
- username (VARCHAR(255) UNIQUE)
- password_hash (VARCHAR(255))
- email (VARCHAR(255))
- created_at (TIMESTAMP)

**rooms**
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(255))
- description (TEXT)
- surface (DECIMAL(10,2))
- images (TEXT[])
- philosophy (TEXT)
- created_at (TIMESTAMP)

**room_pricing**
- id (SERIAL PRIMARY KEY)
- room_id (INTEGER REFERENCES rooms(id))
- service_name (VARCHAR(255))
- price (DECIMAL(10,2))
- duration (VARCHAR(100))
- currency (VARCHAR(10))
- language (VARCHAR(5))
- created_at (TIMESTAMP)

**service_pricing**
- id (SERIAL PRIMARY KEY)
- service_name (VARCHAR(255))
- price (DECIMAL(10,2))
- description (TEXT)
- language (VARCHAR(5))
- created_at (TIMESTAMP)

**room_schedule**
- id (SERIAL PRIMARY KEY)
- room_id (INTEGER REFERENCES rooms(id))
- date (DATE)
- is_available (BOOLEAN)
- notes (TEXT)
- created_at (TIMESTAMP)

**reservations**
- id (SERIAL PRIMARY KEY)
- room_id (INTEGER REFERENCES rooms(id))
- customer_name (VARCHAR(255))
- customer_email (VARCHAR(255))
- customer_phone (VARCHAR(50))
- pet_name (VARCHAR(255))
- pet_type (VARCHAR(100))
- start_date (DATE)
- end_date (DATE)
- total_price (DECIMAL(10,2))
- status (VARCHAR(50))
- special_requests (TEXT)
- created_at (TIMESTAMP)

**contact_messages**
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(255))
- email (VARCHAR(255))
- phone (VARCHAR(50))
- subject (VARCHAR(500))
- message (TEXT)
- status (VARCHAR(50))
- created_at (TIMESTAMP)

**blog_posts**
- id (SERIAL PRIMARY KEY)
- title (VARCHAR(500))
- slug (VARCHAR(500))
- content (TEXT)
- excerpt (TEXT)
- author (VARCHAR(255))
- language (VARCHAR(5))
- status (VARCHAR(50))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**faq_items**
- id (SERIAL PRIMARY KEY)
- question (TEXT)
- answer (TEXT)
- language (VARCHAR(5))
- order_index (INTEGER)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)

**custom_messages**
- id (SERIAL PRIMARY KEY)
- title (VARCHAR(500))
- content (TEXT)
- language (VARCHAR(5))
- is_active (BOOLEAN)
- created_at (TIMESTAMP)

**site_settings**
- key (VARCHAR(255) PRIMARY KEY)
- value (TEXT)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Configuration et Sécurité

### Authentification Admin
- **URL d'accès**: `/paradise-management`
- **Identifiants par défaut**: 
  - Username: `admin`
  - Password: `admin123`
- **Sécurité**: Hachage bcrypt, sessions PHP, CSRF protection
- **Timeout**: 24 heures d'inactivité

### Sessions PHP
- Configuration sécurisée avec `httponly` et `strict_mode`
- Gestion des cookies cross-origin
- Proxy Node.js avec forwarding des cookies

### Variables d'Environnement
```php
// Base de données
DATABASE_URL=postgresql://user:pass@host:port/db
PGHOST=localhost
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=database_name

// Sécurité
PHP_SESSION_SECURE=0  // 1 pour HTTPS
BCRYPT_COST=12
```

## Fonctionnalités Principales

### 1. Pages Publiques

#### Page d'Accueil
- Hero section avec animation
- Présentation des services
- Témoignages clients
- Galerie photos
- Formulaire de contact rapide

#### Chambres et Services
- 4 types de chambres:
  - Chambre Confort (25m²) - 45€/nuit
  - Suite Prestige (35m²) - 65€/nuit
  - Chambre Féline (20m²) - 35€/nuit
  - Studio Familial (40m²) - 75€/nuit
- Calendrier de disponibilité
- Système de réservation intégré
- Services additionnels optionnels

#### Tarifs
- Tarification détaillée par chambre
- Durées: 1 nuit, 1 semaine, 1 mois
- Services supplémentaires:
  - Promenades quotidiennes: 15€
  - Toilettage: 25€
  - Soins vétérinaires: 10€
  - Séances photo: 20€

#### Contact
- Formulaire de contact multilingue
- Informations de contact
- Carte interactive (à implémenter)
- Réseaux sociaux

#### FAQ
- Questions fréquentes par langue
- Système de recherche
- Gestion admin des questions

#### Blog
- Articles multilingues
- Système de slug URL
- Gestion des statuts (brouillon/publié)
- Interface d'édition riche

### 2. Panel d'Administration

#### Gestion des Tarifs
- CRUD complet des tarifs par chambre
- Modification des prix par durée
- Gestion multilingue des services

#### Gestion des Plannings
- Calendrier de disponibilité
- Blocage/déblocage de dates
- Notes et commentaires

#### Gestion des Réservations
- Liste des réservations
- Filtrage par statut et date
- Modification des statuts
- Détails complets des réservations

#### Gestion des Messages
- Inbox des messages de contact
- Système de statuts (nouveau/lu/traité)
- Réponses (à implémenter)

#### Gestion du Blog
- Éditeur WYSIWYG
- Gestion des slugs automatique
- Publication/dépublication
- Gestion multilingue

#### Gestion FAQ
- Ajout/modification des questions
- Réorganisation par ordre
- Activation/désactivation
- Gestion multilingue

#### Services Additionnels
- Création/modification des services
- Gestion des prix
- Descriptions multilingues

## Système Multilingue

### Implémentation
- Context React pour la gestion des langues
- Fichiers de traduction JSON
- Sélecteur de langue persistent
- Formatage des dates localisé

### Structure des Traductions
```typescript
interface Translations {
  nav: {
    home: string;
    rooms: string;
    pricing: string;
    contact: string;
    faq: string;
    blog: string;
    reservations: string;
  };
  // ... autres sections
}
```

## Charte Graphique

### Palette de Couleurs
```css
:root {
  /* Couleurs principales */
  --primary: 210 40% 20%;      /* Bleu marine profond */
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;    /* Gris bleu très clair */
  --secondary-foreground: 210 40% 10%;
  --accent: 142 76% 36%;       /* Vert nature */
  --accent-foreground: 210 40% 98%;
  
  /* Couleurs de fond */
  --background: 0 0% 100%;     /* Blanc pur */
  --foreground: 210 40% 5%;    /* Texte principal */
  --primary-bg: 210 11% 98%;   /* Fond primaire */
  
  /* Couleurs utilitaires */
  --muted: 210 40% 96%;
  --muted-foreground: 210 40% 45%;
  --border: 210 40% 90%;
  --card: 0 0% 100%;
  --card-foreground: 210 40% 5%;
  
  /* États */
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 210 40% 50%;
}

.dark {
  --background: 210 40% 5%;
  --foreground: 210 40% 95%;
  --primary: 210 40% 90%;
  --primary-foreground: 210 40% 10%;
  /* ... autres couleurs sombres */
}
```

### Typographie
```css
/* Polices */
font-family: 'Inter', system-ui, sans-serif;

/* Tailles */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Poids */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Espacement
```css
/* Espacements standardisés */
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

### Rayons de Bordure
```css
--radius-sm: 0.25rem;   /* 4px */
--radius: 0.5rem;       /* 8px */
--radius-md: 0.75rem;   /* 12px */
--radius-lg: 1rem;      /* 16px */
--radius-xl: 1.5rem;    /* 24px */
```

### Ombres
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

## Composants UI Principaux

### Navigation
- Menu responsive avec hamburger mobile
- Sélecteur de langue intégré
- Transitions fluides
- États actifs visuels

### Cartes de Chambre
- Images haute qualité avec lazy loading
- Informations détaillées (surface, philosophie)
- Boutons d'action (réserver, voir détails)
- Animations au survol

### Formulaires
- Validation en temps réel
- Messages d'erreur contextuels
- Design cohérent avec la charte
- États de chargement

### Calendriers
- Interface intuitive pour les dates
- Visualisation des disponibilités
- Sélection de plages de dates
- Légende des états

### Modales et Dialogues
- Confirmations d'actions
- Formulaires de réservation
- Affichage des détails
- Animations d'ouverture/fermeture

## API REST Endpoints

### Authentification
```
POST /api/admin/login
POST /api/admin/logout
```

### Gestion des Chambres
```
GET /api/rooms
GET /api/rooms/{id}
GET /api/admin/room-pricing
POST /api/admin/room-pricing
PUT /api/admin/room-pricing/{id}
DELETE /api/admin/room-pricing/{id}
```

### Gestion des Réservations
```
GET /api/reservations
POST /api/reservations
GET /api/admin/reservations
PUT /api/admin/reservations/{id}
```

### Gestion des Messages
```
POST /api/contact
GET /api/admin/contact-messages
PUT /api/admin/contact-messages/{id}
```

### Gestion du Blog
```
GET /api/blog
GET /api/blog/{slug}
GET /api/admin/blog
POST /api/admin/blog
PUT /api/admin/blog/{id}
DELETE /api/admin/blog/{id}
```

### Gestion FAQ
```
GET /api/faq
GET /api/admin/faq
POST /api/admin/faq
PUT /api/admin/faq/{id}
DELETE /api/admin/faq/{id}
```

### Gestion des Services
```
GET /api/services
GET /api/admin/service-pricing
POST /api/admin/service-pricing
PUT /api/admin/service-pricing/{id}
DELETE /api/admin/service-pricing/{id}
```

### Gestion des Plannings
```
GET /api/rooms/{id}/schedule
GET /api/admin/room-schedule
POST /api/admin/room-schedule
PUT /api/admin/room-schedule/{id}
DELETE /api/admin/room-schedule/{id}
```

## Déploiement

### Prérequis
- PHP 8.3+
- PostgreSQL 13+
- Node.js 18+ (pour le développement)
- Serveur web (Apache/Nginx)

### Configuration Production
1. Compilation du frontend statique
2. Configuration PHP pour la production
3. Sécurisation des variables d'environnement
4. Configuration HTTPS
5. Optimisation des performances

### Sécurité Production
- Désactivation des erreurs PHP en production
- Configuration des headers de sécurité
- Validation stricte des entrées
- Protection CSRF
- Limitation du taux de requête
- Backup automatique de la base de données

## Tests et Qualité

### Tests Frontend
- Tests unitaires avec Vitest
- Tests d'intégration avec React Testing Library
- Tests E2E avec Playwright

### Tests Backend
- Tests unitaires PHP avec PHPUnit
- Tests d'API avec Postman/Insomnia
- Tests de sécurité

### Outils de Qualité
- ESLint/Prettier pour JavaScript/TypeScript
- PHP CS Fixer pour PHP
- SonarQube pour l'analyse de code
- Lighthouse pour les performances

## Maintenance et Monitoring

### Logs
- Logs PHP centralisés
- Logs d'erreurs frontend
- Logs de sécurité
- Monitoring des performances

### Backup
- Backup quotidien automatique de la base de données
- Sauvegarde des fichiers uploadés
- Plan de récupération d'urgence

### Mise à jour
- Procédure de mise à jour sécurisée
- Tests de régression
- Rollback automatique en cas d'échec

Cette documentation technique complète couvre tous les aspects du système développé, de l'architecture à la maintenance, en passant par la sécurité et le déploiement.