# PROMPT PARFAIT POUR RÉCRÉATION COMPLÈTE DU SITE

## Instructions Principales

Crée un site web vitrine multilingue professionnel pour un service d'hébergement d'animaux avec les spécifications exactes suivantes :

### Architecture Technique Obligatoire
- **Frontend** : React 18 + TypeScript avec Vite
- **Backend** : PHP 8.3 avec architecture API RESTful
- **Base de données** : PostgreSQL
- **Proxy développement** : Node.js Express pour redirection vers PHP
- **Styling** : Tailwind CSS + shadcn/ui components
- **Routage** : Wouter pour navigation frontend
- **Authentification** : Sessions PHP avec bcrypt
- **Gestion d'état** : TanStack Query v5

### Langues Obligatoires
- Français (fr) - langue par défaut
- Anglais (en) 
- Espagnol (es)
- Sélecteur de langue persistant avec Context React

### Pages Frontend Requises

#### 1. Page d'Accueil (/)
- Hero section avec titre accrocheur
- Présentation des 4 types de chambres
- Section témoignages clients
- Galerie photos des installations
- Formulaire de contact rapide

#### 2. Chambres et Services (/rooms)
Implémenter exactement ces 4 chambres avec tarifs précis :

**Chambre Confort (25m²)**
- 45€/nuit, 280€/semaine, 1200€/mois
- Description : "Chambre spacieuse avec vue sur le jardin, parfaite pour les chiens de petite à moyenne taille"
- Philosophie : "Une seule famille par chambre"

**Suite Prestige (35m²)**
- 65€/nuit, 420€/semaine, 1800€/mois  
- Description : "Notre plus belle suite avec terrasse privée, idéale pour les grands chiens"
- Philosophie : "Espace exclusif pour le bien-être optimal"

**Chambre Féline (20m²)**
- 35€/nuit, 220€/semaine, 950€/mois
- Description : "Spécialement aménagée pour les chats avec structures d'escalade et cachettes"
- Philosophie : "Environnement adapté aux félins"

**Studio Familial (40m²)**
- 75€/nuit, 490€/semaine, 2100€/mois
- Description : "Parfait pour accueillir plusieurs animaux d'une même famille"
- Philosophie : "Espace généreux pour maintenir les liens familiaux"

**Services additionnels obligatoires :**
- Promenades quotidiennes : 15€
- Toilettage : 25€
- Soins vétérinaires : 10€
- Séances photo : 20€

**Système de réservation intégré :**
- Calendrier de disponibilité avec react-day-picker
- Sélection de plages de dates
- Formulaire complet : nom, email, téléphone, nom animal, type animal, dates, demandes spéciales
- Calcul automatique du prix total
- Validation en temps réel

#### 3. Page Tarifs (/pricing)
- Tableau détaillé des 4 chambres avec les 3 durées chacune
- Section services additionnels avec descriptions
- Design responsive avec cards élégantes

#### 4. Page Contact (/contact)
- Formulaire : nom, email, téléphone, sujet, message
- Informations de contact (adresse, téléphone, email, horaires)
- Liens réseaux sociaux
- Validation et envoi vers API backend

#### 5. Page FAQ (/faq)
- Questions/réponses organisées par catégories
- Contenu multilingue géré depuis l'admin
- Interface de recherche/filtrage

#### 6. Page Blog (/blog)
- Liste des articles avec aperçus
- Pages détail d'articles avec slugs URL
- Support multilingue
- Système de catégories

#### 7. Page Réservations (/reservations)
- Interface de réservation complète
- Récapitulatif et confirmation
- Intégration avec le système de planning

### Panel d'Administration Complet (/paradise-management)

#### Authentification Sécurisée
- URL : `/paradise-management`
- Identifiants par défaut : `admin` / `admin123`
- Hachage bcrypt, sessions PHP sécurisées
- Protection CSRF, timeout 24h

#### Sections Admin Obligatoires

**1. Gestion des Tarifs**
- Interface CRUD pour modifier prix des 4 chambres
- Gestion des 3 durées (1 nuit, 1 semaine, 1 mois)
- Modification des services additionnels

**2. Gestion des Plannings**
- Calendrier interactif pour chaque chambre
- Blocage/déblocage de dates
- Gestion des disponibilités
- Notes et commentaires

**3. Gestion des Réservations**
- Liste complète avec filtres (statut, date, chambre)
- Détail de chaque réservation
- Modification des statuts : en_attente, confirmé, en_cours, terminé, annulé
- Interface de recherche

**4. Gestion des Messages**
- Inbox des messages du formulaire contact
- Statuts : nouveau, lu, en_cours, traité, archivé
- Interface de réponse (à implémenter)

**5. Gestion du Blog**
- Éditeur WYSIWYG avec React Quill
- Gestion des slugs automatique
- Statuts : brouillon, publié, archivé
- Support multilingue complet

**6. Gestion FAQ**
- CRUD des questions/réponses
- Ordre d'affichage modifiable
- Activation/désactivation
- Gestion multilingue

**7. Gestion Services**
- CRUD des services additionnels
- Prix et descriptions
- Disponibilité

### Structure Base de Données PostgreSQL

Tables obligatoires avec ces colonnes exactes :

```sql
-- Table users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table rooms  
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    surface DECIMAL(10,2),
    images TEXT[],
    philosophy TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table room_pricing
CREATE TABLE room_pricing (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    service_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'EUR',
    language VARCHAR(5) DEFAULT 'fr',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table service_pricing
CREATE TABLE service_pricing (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    language VARCHAR(5) DEFAULT 'fr',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table room_schedule
CREATE TABLE room_schedule (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table reservations
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    pet_name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'en_attente',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table contact_messages
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(500),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'nouveau',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table blog_posts
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    author VARCHAR(255),
    language VARCHAR(5) DEFAULT 'fr',
    status VARCHAR(50) DEFAULT 'brouillon',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table faq_items
CREATE TABLE faq_items (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    language VARCHAR(5) DEFAULT 'fr',
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table custom_messages
CREATE TABLE custom_messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500),
    content TEXT,
    language VARCHAR(5) DEFAULT 'fr',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table site_settings
CREATE TABLE site_settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Données Initiales Obligatoires

Insérer exactement ces données lors de l'initialisation :

```sql
-- Admin user (password: admin123)
INSERT INTO users (username, password_hash, email) VALUES 
('admin', '$2y$12$hash_generated_by_bcrypt', 'admin@example.com');

-- 4 chambres exactes
INSERT INTO rooms (name, description, surface, images, philosophy) VALUES 
('Chambre Confort', 'Chambre spacieuse avec vue sur le jardin, parfaite pour les chiens de petite à moyenne taille.', 25.00, '["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400&fit=crop"]', 'Une seule famille par chambre'),
('Suite Prestige', 'Notre plus belle suite avec terrasse privée, idéale pour les grands chiens.', 35.00, '["https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop"]', 'Espace exclusif pour le bien-être optimal'),
('Chambre Féline', 'Spécialement aménagée pour les chats avec structures d\'escalade et cachettes.', 20.00, '["https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&h=400&fit=crop"]', 'Environnement adapté aux félins'),
('Studio Familial', 'Parfait pour accueillir plusieurs animaux d\'une même famille.', 40.00, '["https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=400&fit=crop"]', 'Espace généreux pour maintenir les liens familiaux');

-- Tarification exacte pour chaque chambre
INSERT INTO room_pricing (room_id, service_name, price, duration, currency, language) VALUES 
-- Chambre Confort
(1, 'Séjour 1 nuit', 45.00, '1 nuit', 'EUR', 'fr'),
(1, 'Séjour 1 semaine', 280.00, '7 nuits', 'EUR', 'fr'),
(1, 'Séjour 1 mois', 1200.00, '30 nuits', 'EUR', 'fr'),
-- Suite Prestige  
(2, 'Séjour 1 nuit', 65.00, '1 nuit', 'EUR', 'fr'),
(2, 'Séjour 1 semaine', 420.00, '7 nuits', 'EUR', 'fr'),
(2, 'Séjour 1 mois', 1800.00, '30 nuits', 'EUR', 'fr'),
-- Chambre Féline
(3, 'Séjour 1 nuit', 35.00, '1 nuit', 'EUR', 'fr'),
(3, 'Séjour 1 semaine', 220.00, '7 nuits', 'EUR', 'fr'),
(3, 'Séjour 1 mois', 950.00, '30 nuits', 'EUR', 'fr'),
-- Studio Familial
(4, 'Séjour 1 nuit', 75.00, '1 nuit', 'EUR', 'fr'),
(4, 'Séjour 1 semaine', 490.00, '7 nuits', 'EUR', 'fr'),
(4, 'Séjour 1 mois', 2100.00, '30 nuits', 'EUR', 'fr');

-- Services additionnels
INSERT INTO service_pricing (service_name, price, description, language) VALUES 
('Promenades quotidiennes', 15.00, 'Service de promenade personnalisé pour votre animal', 'fr'),
('Toilettage', 25.00, 'Soins esthétiques complets pour votre compagnon', 'fr'),
('Soins vétérinaires', 10.00, 'Surveillance médicale préventive assurée', 'fr'),
('Séances photo', 20.00, 'Immortalisez le séjour de votre animal', 'fr');
```

### Charte Graphique Exacte

```css
:root {
  /* Couleurs principales */
  --primary: 210 40% 20%;           /* Bleu marine profond #2c5282 */
  --primary-foreground: 210 40% 98%; /* Blanc cassé */
  --secondary: 210 40% 96%;         /* Gris bleu très clair */
  --secondary-foreground: 210 40% 10%;
  --accent: 142 76% 36%;            /* Vert nature #059669 */
  --accent-foreground: 210 40% 98%;
  
  /* Fond et texte */
  --background: 0 0% 100%;          /* Blanc pur */
  --foreground: 210 40% 5%;         /* Texte principal sombre */
  --primary-bg: 210 11% 98%;        /* Fond sections #F5F7FA */
  
  /* Utilitaires */
  --muted: 210 40% 96%;
  --muted-foreground: 210 40% 45%;
  --border: 210 40% 90%;
  --card: 0 0% 100%;
  --destructive: 0 84% 60%;
  --success: 142 76% 36%;
  
  /* Rayons */
  --radius: 0.5rem;
}

.dark {
  --background: 210 40% 5%;
  --foreground: 210 40% 95%;
  --primary: 210 40% 90%;
  --primary-foreground: 210 40% 10%;
}
```

### Structure de Fichiers PHP Backend

```
api/
├── index.php                      # Point d'entrée avec session et CORS
├── config/
│   ├── database.php              # Connexion PostgreSQL
│   ├── env.php                   # Variables environnement
│   └── security.php              # Configuration sécurité
├── controllers/
│   ├── AuthController.php        # Login/logout admin
│   ├── RoomController.php        # API chambres public
│   ├── ReservationController.php # API réservations
│   ├── ContactController.php     # Messages contact
│   ├── BlogController.php        # Gestion blog
│   ├── FAQController.php         # Gestion FAQ
│   ├── ScheduleController.php    # Planning chambres
│   └── ServiceController.php     # Services additionnels
├── middleware/
│   └── AuthMiddleware.php        # Authentification sessions
└── models/
    ├── BaseModel.php             # Modèle base PostgreSQL
    ├── Room.php                  # Modèle chambre
    ├── Reservation.php           # Modèle réservation
    ├── ContactMessage.php        # Messages contact
    ├── BlogPost.php              # Articles blog
    ├── FAQItem.php               # Questions FAQ
    ├── RoomSchedule.php          # Planning
    └── ServicePricing.php        # Services
```

### APIs REST Obligatoires

```php
// APIs publiques
GET /api/rooms                    # Liste chambres avec tarifs
GET /api/rooms/{id}/schedule      # Planning disponibilité
POST /api/reservations            # Nouvelle réservation
POST /api/contact                 # Message contact
GET /api/blog                     # Articles blog
GET /api/blog/{slug}              # Article détail
GET /api/faq                      # Questions FAQ
GET /api/services                 # Services additionnels
GET /api/custom-messages          # Messages personnalisés

// APIs admin (authentification requise)
POST /api/admin/login             # Connexion admin
POST /api/admin/logout            # Déconnexion admin
GET /api/admin/room-pricing       # Tarifs admin
POST /api/admin/room-pricing      # Nouveau tarif
PUT /api/admin/room-pricing/{id}  # Modifier tarif
DELETE /api/admin/room-pricing/{id} # Supprimer tarif
GET /api/admin/reservations       # Liste réservations
PUT /api/admin/reservations/{id}  # Modifier réservation
GET /api/admin/contact-messages   # Messages contact
PUT /api/admin/contact-messages/{id} # Modifier statut message
GET /api/admin/blog               # Articles admin
POST /api/admin/blog              # Nouveau article
PUT /api/admin/blog/{id}          # Modifier article
DELETE /api/admin/blog/{id}       # Supprimer article
GET /api/admin/faq                # Questions admin
POST /api/admin/faq               # Nouvelle question
PUT /api/admin/faq/{id}           # Modifier question
DELETE /api/admin/faq/{id}        # Supprimer question
GET /api/admin/room-schedule      # Planning admin
POST /api/admin/room-schedule     # Bloquer date
PUT /api/admin/room-schedule/{id} # Modifier planning
DELETE /api/admin/room-schedule/{id} # Débloquer date
GET /api/admin/service-pricing    # Services admin
POST /api/admin/service-pricing   # Nouveau service
PUT /api/admin/service-pricing/{id} # Modifier service
DELETE /api/admin/service-pricing/{id} # Supprimer service
```

### Configuration Node.js Proxy

Dans `server/index.ts`, implémenter proxy qui :
- Redirige toutes requêtes `/api/*` vers PHP sur port 8080
- Forward les cookies pour maintien des sessions
- Retourne Set-Cookie headers pour authentification
- Démarre serveur PHP automatiquement

### Librairies Frontend Obligatoires

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "latest",
    "wouter": "latest",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "latest",
    "@hookform/resolvers": "latest",
    "zod": "latest",
    "tailwindcss": "latest",
    "@tailwindcss/typography": "latest",
    "lucide-react": "latest",
    "react-day-picker": "latest",
    "date-fns": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "react-quill": "latest",
    "framer-motion": "latest"
  }
}
```

### shadcn/ui Components Requis

Installer et utiliser ces composants exactement :
- Button, Input, Textarea, Label
- Card, CardHeader, CardContent, CardFooter
- Dialog, DialogTrigger, DialogContent
- Tabs, TabsList, TabsTrigger, TabsContent
- Calendar (react-day-picker integration)
- Form, FormField, FormItem, FormControl
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem
- Badge, Avatar, Separator
- Table, TableHeader, TableBody, TableRow, TableCell
- Toast, useToast
- Navigation Menu

### Responsive Design Obligatoire

- Mobile First avec Tailwind breakpoints
- Navigation hamburger sur mobile
- Grilles adaptatives (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Images responsives avec aspect-ratio
- Formulaires optimisés mobile
- Admin panel adaptatif

### Performance et SEO

- Lazy loading des images
- Meta tags dynamiques par page
- Structure sémantique HTML5
- URLs propres et slugs SEO
- Sitemap automatique
- Rich snippets pour chambres
- Open Graph pour réseaux sociaux

### Sécurité Obligatoire

**PHP Backend :**
- Sessions sécurisées (httponly, secure, samesite)
- Protection CSRF avec tokens
- Validation stricte des entrées
- Prepared statements PostgreSQL
- Hachage bcrypt pour mots de passe
- Headers de sécurité (CORS, XSS protection)

**Frontend :**
- Validation côté client et serveur
- Sanitisation des données affichées
- Protection XSS dans éditeur blog
- Gestion sécurisée des tokens auth

### Tests de Validation

Après implémentation, vérifier que :

1. **Authentification fonctionne** : `/paradise-management` avec admin/admin123
2. **Toutes les pages publiques** s'affichent correctement
3. **Changement de langue** persiste et traduit tout
4. **Calendrier de réservation** bloque dates occupées
5. **Formulaires** valident et envoient données
6. **Panel admin** permet CRUD sur toutes entités
7. **Sessions PHP** maintenues entre requêtes
8. **API** retourne données JSON correctes
9. **Base de données** contient données initiales
10. **Responsive** fonctionne sur mobile/tablet/desktop

### Commandes de Démarrage

```bash
# Installation
npm install

# Démarrage développement
npm run dev

# Le site sera disponible sur http://localhost:5000
# Panel admin sur http://localhost:5000/paradise-management
```

### Déploiement Production

Le frontend doit être compilable statiquement avec `npm run build` pour sécurité maximale. Le backend PHP 8.3 doit fonctionner de manière autonome sans dépendance Node.js en production.

**IMPORTANT** : Respecter exactement cette spécification. Chaque élément (prix, noms, couleurs, structure) doit être implémenté tel que décrit. Le site final doit être 100% fonctionnel avec toutes les APIs, l'authentification, le multilingue, et le système de réservation opérationnels.