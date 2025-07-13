# Pet Paradise - Documentation Complète pour Réplication Identique

## Prompt pour Recréer le Site à l'Identique

```
Créez un site web multilingue complet pour hébergement d'animaux de compagnie avec les spécifications exactes suivantes :

ARCHITECTURE TECHNIQUE OBLIGATOIRE :
- Frontend : React + TypeScript compilé en fichiers statiques (déployable sur tout hébergement)
- Backend : PHP 8.3 avec sécurité maximale (API REST)
- Base de données : MariaDB 10.4
- Sécurité : Niveau maximum avec protection CSRF, rate limiting, validation stricte

FONCTIONNALITÉS EXACTES À IMPLÉMENTER :
1. Site multilingue (français, anglais, espagnol) avec sélecteur de langue
2. 5 pages publiques : Accueil, Tarifs, Contact, Chambres & Services, Réservations
3. Système de réservation avec calendrier interactif et validation
4. Interface d'administration sécurisée (URL : /paradise-management)
5. Tableau de bord admin avec suivi arrivées/départs quotidiens
6. Gestion complète des réservations (statuts : pending/confirmed/cancelled)
7. Blog multilingue avec éditeur riche
8. FAQ multilingue avec interface d'administration
9. Messages personnalisables par langue
10. Système d'email automatique (SMTP hébergeur, pas SendGrid)
11. Design responsive avec thème brun/beige élégant
12. Validation avancée des formulaires (dates, emails, téléphone français)

CONTRAINTES DE SÉCURITÉ :
- Frontend statique uniquement (aucun serveur Node.js en production)
- Backend PHP avec protection contre XSS, CSRF, injection SQL
- Sessions sécurisées, hashage Argon2ID
- Headers de sécurité configurés
- Rate limiting implémenté

SPÉCIFICATIONS UI/UX :
- Design moderne avec couleurs : primary: #8B6F5B (brun), secondary: #F5F0E8 (beige)
- Navigation sticky avec logo Pet Paradise
- Cartes élégantes avec ombres subtiles
- Formulaires avec validation en temps réel
- Calendrier de réservation avec blocage des dates occupées
- Interface admin avec sidebar de navigation

Implémentez exactement cette architecture avec tous les fichiers de configuration, scripts de déploiement et documentation technique complète.
```

## Architecture Technique Détaillée

### Structure des Fichiers
```
pet-paradise/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Composants Shadcn/ui
│   │   │   ├── Navigation.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Rooms.tsx
│   │   │   ├── Reservations.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── ReservationsAdmin.tsx
│   │   │       ├── BlogAdmin.tsx
│   │   │       └── SettingsAdmin.tsx
│   │   ├── lib/
│   │   │   ├── i18n.tsx            # Gestion multilingue
│   │   │   ├── queryClient.ts      # Configuration React Query
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── api/                             # Backend PHP 8.3
│   ├── config/
│   │   ├── database.php            # Connexion MariaDB
│   │   ├── security.php            # Fonctions sécurité
│   │   └── env.php                 # Variables environnement
│   ├── models/
│   │   ├── BaseModel.php
│   │   ├── Room.php
│   │   ├── Reservation.php
│   │   ├── User.php
│   │   ├── BlogPost.php
│   │   └── FaqItem.php
│   ├── controllers/
│   │   ├── ReservationController.php
│   │   ├── AuthController.php
│   │   ├── RoomController.php
│   │   └── BlogController.php
│   ├── middleware/
│   │   └── AuthMiddleware.php
│   ├── utils/
│   │   └── EmailService.php
│   ├── database/
│   │   └── schema.sql
│   ├── index.php                   # Point d'entrée API
│   ├── .htaccess                   # Sécurité Apache
│   └── composer.json
├── dist/                           # Frontend compilé
├── .env.example
├── package.json
├── vite.config.ts
└── DEPLOYMENT_GUIDE.md
```

### Configuration Base de Données MariaDB 10.4

#### Schéma Principal
```sql
-- Tables principales avec contraintes de sécurité
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB;

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INT NOT NULL DEFAULT 1,
    size DECIMAL(10,2) DEFAULT 0.00,
    amenities JSON,
    images JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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
    FOREIGN KEY (room_preference) REFERENCES rooms(id) ON DELETE SET NULL,
    CONSTRAINT chk_valid_dates CHECK (end_date > start_date)
) ENGINE=InnoDB;
```

### Architecture API PHP 8.3

#### Configuration Sécurité Maximale
```php
<?php
declare(strict_types=1);

class SecurityConfig {
    public static function init(): void {
        // Headers de sécurité
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Content-Security-Policy: default-src \'self\';');
        
        // CORS sécurisé
        $allowedOrigins = [
            $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000'
        ];
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: $origin");
        }
    }
    
    public static function validateInput(string $input): string {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
    
    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_ARGON2ID);
    }
    
    public static function rateLimitCheck(string $ip, int $maxRequests = 100): bool {
        // Implémentation rate limiting avec APCu
        $key = "rate_limit_$ip";
        $requests = apcu_fetch($key) ?: 0;
        
        if ($requests >= $maxRequests) {
            return false;
        }
        
        apcu_store($key, $requests + 1, 3600);
        return true;
    }
}
```

#### Modèle de Base Sécurisé
```php
<?php
abstract class BaseModel {
    protected PDO $db;
    protected string $table;
    
    public function __construct() {
        $this->db = Database::getConnection();
    }
    
    protected function create(array $data): int {
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        
        $stmt = $this->db->prepare("INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})");
        $stmt->execute($data);
        
        return (int)$this->db->lastInsertId();
    }
    
    protected function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
```

### Frontend React Statique

#### Configuration Vite pour Compilation Statique
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-button'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('/api')
  }
});
```

#### Client API Optimisé
```typescript
// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        const fullUrl = `${API_BASE_URL}${url}`;
        
        const response = await fetch(fullUrl, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },
    },
  },
});
```

## Spécifications Fonctionnelles Précises

### 1. Système de Réservation

#### Validation Frontend
```typescript
const reservationSchema = z.object({
  customerName: z.string().min(2, "Nom requis"),
  customerFirstName: z.string().min(2, "Prénom requis"),
  customerEmail: z.string().email("Email invalide"),
  customerPhone: z.string().regex(/^0[1-9](?:[0-9]{8})$/, "Format : 0123456789"),
  startDate: z.string().refine(date => new Date(date) > new Date(), "Date future requise"),
  endDate: z.string(),
  numberOfAnimals: z.number().min(1).max(10),
  animals: z.array(z.object({
    name: z.string().min(1),
    type: z.enum(['chat', 'chien', 'lapin', 'oiseau', 'autre'])
  }))
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: "Date de fin après date de début",
  path: ["endDate"]
});
```

#### Contrôleur PHP Réservations
```php
<?php
class ReservationController {
    public function createReservation(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validation des champs requis
        $requiredFields = ['customer_name', 'customer_email', 'start_date', 'end_date'];
        foreach ($requiredFields as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Field {$field} is required"]);
                return;
            }
        }
        
        // Validation email
        if (!SecurityConfig::validateEmail($input['customer_email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email format']);
            return;
        }
        
        // Vérification disponibilité chambre
        if (!empty($input['room_preference'])) {
            $roomId = (int)$input['room_preference'];
            if (!$this->roomModel->getRoomAvailability($roomId, $input['start_date'], $input['end_date'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Room not available']);
                return;
            }
        }
        
        // Création réservation
        $reservationId = $this->reservationModel->createReservation($input);
        
        // Envoi email automatique
        $this->emailService->sendReservationConfirmation($reservation);
        
        echo json_encode(['success' => true, 'id' => $reservationId]);
    }
}
```

### 2. Interface d'Administration

#### Dashboard avec Statistiques
```typescript
// pages/admin/Dashboard.tsx
export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { data: dailyStats } = useQuery({
    queryKey: ['/admin/daily-stats', format(selectedDate, 'yyyy-MM-dd')],
  });
  
  const arrivals = dailyStats?.arrivals || 0;
  const departures = dailyStats?.departures || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-3xl">Tableau de Bord</h1>
        <div className="flex items-center space-x-4">
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <StatsCard
          title="Arrivées du jour"
          value={arrivals}
          icon={<ArrowDownRight className="w-5 h-5" />}
          color="green"
        />
        <StatsCard
          title="Départs du jour"
          value={departures}
          icon={<ArrowUpRight className="w-5 h-5" />}
          color="orange"
        />
      </div>
    </div>
  );
}
```

### 3. Système Multilingue

#### Configuration i18n
```typescript
// lib/i18n.tsx
const translations = {
  fr: {
    'nav.home': 'Accueil',
    'nav.pricing': 'Tarifs',
    'nav.contact': 'Contact',
    'nav.rooms': 'Chambres & Services',
    'nav.reservations': 'Réservations',
    'reservation.form.title': 'Formulaire de Réservation'
  },
  en: {
    'nav.home': 'Home',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.rooms': 'Rooms & Services',
    'nav.reservations': 'Reservations',
    'reservation.form.title': 'Reservation Form'
  },
  es: {
    'nav.home': 'Inicio',
    'nav.pricing': 'Tarifas',
    'nav.contact': 'Contacto',
    'nav.rooms': 'Habitaciones y Servicios',
    'nav.reservations': 'Reservas',
    'reservation.form.title': 'Formulario de Reserva'
  }
};
```

### 4. Service Email SMTP

#### Configuration PHPMailer
```php
<?php
class EmailService {
    private PHPMailer $mailer;
    
    public function __construct() {
        $this->mailer = new PHPMailer(true);
        $this->configureSMTP();
    }
    
    private function configureSMTP(): void {
        $this->mailer->isSMTP();
        $this->mailer->Host = $_ENV['SMTP_HOST'];
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = $_ENV['SMTP_USER'];
        $this->mailer->Password = $_ENV['SMTP_PASS'];
        $this->mailer->SMTPSecure = $_ENV['SMTP_SECURE'] === 'true' 
            ? PHPMailer::ENCRYPTION_SMTPS 
            : PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port = (int)$_ENV['SMTP_PORT'];
    }
    
    public function sendReservationConfirmation(array $reservation): bool {
        // Email client
        $this->mailer->setFrom($_ENV['SMTP_USER'], 'Pet Paradise');
        $this->mailer->addAddress($reservation['customer_email']);
        $this->mailer->Subject = 'Confirmation de réservation';
        $this->mailer->Body = $this->getCustomerEmailTemplate($reservation);
        $this->mailer->send();
        
        // Email admin
        $this->mailer->clearAddresses();
        $this->mailer->addAddress($_ENV['SITE_EMAIL']);
        $this->mailer->Subject = 'Nouvelle réservation';
        $this->mailer->Body = $this->getAdminEmailTemplate($reservation);
        $this->mailer->send();
        
        return true;
    }
}
```

## Configuration de Déploiement

### Variables d'Environnement (.env)
```bash
# Base de données MariaDB
DB_HOST=localhost
DB_PORT=3306
DB_NAME=petparadise
DB_USER=petparadise_app
DB_PASS=mot_de_passe_securise

# Configuration SMTP Hostinger
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=contact@votredomaine.com
SMTP_PASS=votre_mot_de_passe_email
SMTP_SECURE=false

# Configuration SMTP Infomaniak
# SMTP_HOST=mail.infomaniak.com
# SMTP_PORT=587

# Site
SITE_EMAIL=contact@votredomaine.com
BASE_URL=https://votredomaine.com
```

### Configuration Apache (.htaccess)
```apache
# api/.htaccess
RewriteEngine On

# Sécurité
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Routing API
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# Blocage fichiers sensibles
<Files ~ "^(\.env|composer\.json|config/)">
    Order Allow,Deny
    Deny from all
</Files>
```

### Configuration Frontend Statique (.htaccess)
```apache
# dist/public/.htaccess
RewriteEngine On

# SPA Routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Optimisation cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
</IfModule>
```

## Scripts de Déploiement

### Script de Build Complet
```bash
#!/bin/bash
# build.sh

echo "🚀 Compilation Pet Paradise..."

# 1. Installation dépendances
npm install

# 2. Build frontend statique
npm run build

# 3. Installation dépendances PHP
cd api
php composer.phar install --no-dev --optimize-autoloader
cd ..

# 4. Création base de données
mysql -u root -p < api/database/schema.sql

echo "✅ Build terminé!"
echo "Frontend statique: dist/public/"
echo "API PHP: api/"
```

### Test d'Intégration
```bash
#!/bin/bash
# test.sh

echo "🧪 Tests Pet Paradise..."

# Test API PHP
php api/test_api.php

# Test build frontend
npm run build

# Test serveur dev
php -S localhost:8000 -t api/ api/server.php &
SERVER_PID=$!

# Test endpoints
curl -f http://localhost:8000/rooms || echo "❌ Endpoint /rooms failed"
curl -f http://localhost:8000/custom-messages || echo "❌ Endpoint /custom-messages failed"

kill $SERVER_PID
echo "✅ Tests terminés!"
```

## Checklist de Validation

### Fonctionnalités Obligatoires
- [ ] Site multilingue (FR/EN/ES) fonctionnel
- [ ] Système de réservation avec validation
- [ ] Email automatique (SMTP hébergeur)
- [ ] Interface admin sécurisée (/paradise-management)
- [ ] Dashboard avec statistiques quotidiennes
- [ ] Gestion des statuts de réservation
- [ ] Blog multilingue avec éditeur
- [ ] FAQ administrable
- [ ] Messages personnalisables
- [ ] Design responsive brun/beige

### Sécurité Obligatoire
- [ ] Frontend compilé en statique uniquement
- [ ] Backend PHP 8.3 avec protection XSS/CSRF
- [ ] Validation stricte tous les inputs
- [ ] Sessions sécurisées avec Argon2ID
- [ ] Rate limiting implémenté
- [ ] Headers de sécurité configurés

### Performance et Déploiement
- [ ] Build optimisé avec code splitting
- [ ] Images optimisées et compressées
- [ ] Base de données avec index appropriés
- [ ] Configuration cache navigateur
- [ ] Guide de déploiement complet
- [ ] Scripts de test et validation

Cette documentation garantit la reproduction exacte du site Pet Paradise avec l'architecture PHP 8.3 + MariaDB + frontend statique et toutes les fonctionnalités requises.