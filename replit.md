# Pet Paradise - Hébergement de Luxe pour Animaux

## Overview

Pet Paradise is a multilingual luxury pet hotel website that provides a comprehensive booking system for pet accommodation services. The application serves as a showcase website with an integrated reservation system and administrative panel for managing bookings, content, and pricing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for client-side navigation
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query v5 for server state management
- **Internationalization**: Custom React Context for French, English, and Spanish

### Backend Architecture
- **Runtime**: Node.js Express server (development) / PHP 8.3 (production)
- **Database**: PostgreSQL with Drizzle ORM
- **API Design**: RESTful endpoints with proper HTTP methods
- **Authentication**: Session-based with secure password hashing
- **Email Service**: NodeMailer for automated notifications

### Deployment Strategy
The application is designed for flexible deployment:
- **Development**: Node.js proxy server directing API calls to PHP backend
- **Production**: Compiled static frontend with PHP-only backend for standard hosting

## Key Components

### Public Pages
1. **Home** (`/`) - Hero section, services overview, testimonials, and contact form
2. **Rooms** (`/rooms`) - Detailed room catalog with pricing and availability calendars
3. **Pricing** (`/pricing`) - Comprehensive pricing tables for all services
4. **Contact** (`/contact`) - Contact form with location information
5. **Reservations** (`/reservations`) - Interactive booking system with calendar
6. **FAQ** (`/faq`) - Frequently asked questions organized by category
7. **Blog** (`/blog`) - Content management system for articles

### Administrative Interface
- **Login** (`/paradise-management`) - Secure admin authentication
- **Dashboard** (`/paradise-management/dashboard`) - Overview of bookings and statistics
- **Reservations Management** - View and manage all bookings
- **Pricing Management** - Update room and service pricing
- **Schedule Management** - Manage room availability and occupancy
- **Content Management** - Edit FAQ items, blog posts, and custom messages
- **Settings** - Configure site-wide settings and SMTP configuration

### Room Types
The system supports four distinct accommodation types:
- **Chambre Confort** (25m²) - Standard accommodation for small to medium dogs
- **Suite Prestige** (35m²) - Premium suite with private terrace for large dogs
- **Chambre Féline** (20m²) - Specialized environment for cats with climbing structures
- **Studio Familial** (40m²) - Large space for multiple pets from the same family

## Data Flow

### User Registration and Booking Flow
1. User selects dates and room type on the reservations page
2. Interactive calendar shows availability based on existing bookings
3. User fills out detailed booking form with pet information
4. System validates dates, availability, and form data
5. Booking is created with "pending" status
6. Automated email confirmation sent to customer
7. Admin receives notification of new booking

### Content Management Flow
1. Admin logs in through secure authentication
2. Admin can create/edit/delete content in multiple languages
3. Changes are immediately reflected on the public website
4. All content changes are tracked with timestamps

### Payment and Pricing Flow
1. Pricing is dynamically calculated based on room type and duration
2. Multiple pricing tiers (daily, weekly, monthly rates)
3. Additional services can be added with individual pricing
4. Total cost calculation includes all selected services

## External Dependencies

### Development Dependencies
- **Node.js Packages**: Express, Vite, React ecosystem, TanStack Query
- **PHP Packages**: PHPMailer for email functionality
- **Database**: PostgreSQL for data persistence
- **UI Components**: Radix UI primitives via shadcn/ui

### Production Dependencies
- **PHP 8.3+**: Core backend runtime
- **PostgreSQL**: Database server
- **SMTP Service**: Email delivery (configurable provider)
- **Web Server**: Apache/Nginx for static file serving

### Font Dependencies
- **Google Fonts**: Quicksand (headings), Nunito (body text), Cabin (CTAs)
- **Font Strategy**: Preloaded for optimal performance

## Deployment Strategy

### Development Environment
```bash
npm run dev  # Starts Node.js proxy server on port 3000
# PHP server runs on port 8080
# Database connection via Drizzle ORM
```

### Production Deployment
1. **Build Process**: `npm run build` compiles React app to static files
2. **Server Setup**: Deploy PHP backend to any standard hosting provider
3. **Database Setup**: PostgreSQL database with schema migration
4. **File Structure**: Static files served directly, API requests routed to PHP
5. **Domain Configuration**: Single domain serves both frontend and API

### Hosting Compatibility
The application is designed to work with standard shared hosting providers:
- **Supported Hosts**: Hostinger, OVH, Infomaniak, and any PHP 8.3+ hosting
- **Requirements**: PHP 8.3+, PostgreSQL, SMTP access
- **No Special Requirements**: No Node.js needed in production

The architecture prioritizes simplicity and compatibility while maintaining modern development practices and security standards.

## Backup and Restoration System

### Database Backup Scripts
- **`scripts/quick_backup.php`** - Generates complete PostgreSQL backup with structure and data
- **`scripts/backup_database.php`** - Advanced backup with detailed analysis and constraints
- **`scripts/restore_database.php`** - Restores database from SQL backup files

### GitHub Automation Scripts
- **`scripts/quick_github.sh`** - Rapid Git commit and push for Linux/Mac/Replit
- **`scripts/github_backup.sh`** - Comprehensive Git backup with verification
- **`scripts/quick_github_backup.ps1`** - PowerShell script for Windows automation
- **`scripts/secure_github_backup.ps1`** - Advanced PowerShell with branch management

### Persistence Strategy
- PostgreSQL database expires after 6 days in Replit environment
- Complete restoration possible via SQL backup files
- Admin credentials preserved: admin/admin123
- Project synchronized with GitHub: https://github.com/evan-1702/trilingualshowcase

### Session Recovery
When returning to Replit after session termination:
1. Database will be recreated automatically if expired
2. Use `php scripts/restore_database.php [backup_file.sql]` to restore data
3. Admin panel access maintained at `/paradise-management`
4. All project files persist in GitHub repository