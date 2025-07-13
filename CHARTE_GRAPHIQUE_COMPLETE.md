# Charte Graphique Complète - Site Web Vitrine Multilingue

## Identité Visuelle

### Concept et Philosophy Design
Le design reflète la confiance, la sérénité et le professionnalisme d'un service d'hébergement animalier haut de gamme. L'approche visuelle privilégie :
- **Élégance moderne** : Design épuré et contemporain
- **Chaleur humaine** : Couleurs apaisantes et naturelles
- **Professionnalisme** : Interface structurée et intuitive
- **Accessibilité** : Contraste optimal et lisibilité maximale

## Palette de Couleurs

### Couleurs Principales

#### Bleu Marine Profond (Primary)
```css
--primary: 210 40% 20%;           /* #2c5282 */
--primary-foreground: 210 40% 98%; /* #fafbfc */
```
- **Usage** : Navigation, boutons principaux, titres importants
- **Symbolique** : Confiance, professionnalisme, stabilité
- **Applications** : Header, CTA primaires, liens actifs

#### Vert Nature (Accent)
```css
--accent: 142 76% 36%;            /* #059669 */
--accent-foreground: 210 40% 98%; /* #fafbfc */
```
- **Usage** : Boutons d'action, éléments de validation, prix
- **Symbolique** : Nature, bien-être animal, croissance
- **Applications** : Boutons "Réserver", confirmations, badges prix

#### Gris Bleu Clair (Secondary)
```css
--secondary: 210 40% 96%;         /* #f1f5f9 */
--secondary-foreground: 210 40% 10%; /* #1e293b */
```
- **Usage** : Arrière-plans alternatifs, zones de contenu
- **Symbolique** : Douceur, neutralité, élégance
- **Applications** : Sections alternées, cartes, formulaires

### Couleurs de Support

#### Fond Principal
```css
--background: 0 0% 100%;          /* #ffffff */
--foreground: 210 40% 5%;         /* #0f172a */
--primary-bg: 210 11% 98%;        /* #f5f7fa */
```

#### Couleurs Utilitaires
```css
--muted: 210 40% 96%;            /* #f1f5f9 */
--muted-foreground: 210 40% 45%; /* #64748b */
--border: 210 40% 90%;           /* #cbd5e1 */
--card: 0 0% 100%;               /* #ffffff */
--card-foreground: 210 40% 5%;   /* #0f172a */
```

#### États et Notifications
```css
--destructive: 0 84% 60%;        /* #ef4444 - Erreurs */
--destructive-foreground: 210 40% 98%;
--success: 142 76% 36%;          /* #059669 - Succès */
--warning: 38 92% 50%;           /* #f59e0b - Avertissements */
--info: 210 40% 50%;             /* #3b82f6 - Informations */
```

### Mode Sombre (Dark Theme)
```css
.dark {
  --background: 210 40% 5%;       /* #0f172a */
  --foreground: 210 40% 95%;      /* #f1f5f9 */
  --primary: 210 40% 90%;         /* #e2e8f0 */
  --primary-foreground: 210 40% 10%; /* #1e293b */
  --secondary: 210 40% 15%;       /* #334155 */
  --secondary-foreground: 210 40% 90%; /* #e2e8f0 */
  --muted: 210 40% 15%;           /* #334155 */
  --muted-foreground: 210 40% 65%; /* #94a3b8 */
  --border: 210 40% 25%;          /* #475569 */
  --card: 210 40% 10%;            /* #1e293b */
  --card-foreground: 210 40% 95%; /* #f1f5f9 */
}
```

## Typographie

### Police Principale
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

#### Caractéristiques Inter
- **Lisibilité optimale** : Conçue pour les interfaces numériques
- **Variabilité** : Support complet des graisses 100-900
- **Multilingue** : Excellent support des caractères latins étendus
- **Accessibilité** : Haute lisibilité à toutes les tailles

### Hiérarchie Typographique

#### Titres Principaux (H1)
```css
font-size: 2.25rem;    /* 36px */
font-weight: 700;      /* Bold */
line-height: 1.2;      /* 43.2px */
letter-spacing: -0.025em;
color: var(--primary);
```
- **Usage** : Titres de pages, hero sections
- **Responsive** : 1.875rem (30px) sur mobile

#### Titres Secondaires (H2)
```css
font-size: 1.875rem;   /* 30px */
font-weight: 600;      /* Semibold */
line-height: 1.3;      /* 39px */
color: var(--foreground);
```
- **Usage** : Sections principales, titre de cartes importantes
- **Responsive** : 1.5rem (24px) sur mobile

#### Titres Tertiaires (H3)
```css
font-size: 1.5rem;     /* 24px */
font-weight: 600;      /* Semibold */
line-height: 1.4;      /* 33.6px */
color: var(--foreground);
```
- **Usage** : Sous-sections, titres de cartes
- **Responsive** : 1.25rem (20px) sur mobile

#### Titres Quaternaires (H4)
```css
font-size: 1.25rem;    /* 20px */
font-weight: 600;      /* Semibold */
line-height: 1.4;      /* 28px */
color: var(--primary);
```
- **Usage** : Éléments de liste, sous-titres

#### Corps de Texte
```css
font-size: 1rem;       /* 16px */
font-weight: 400;      /* Normal */
line-height: 1.6;      /* 25.6px */
color: var(--foreground);
```
- **Usage** : Paragraphes, descriptions, contenu principal

#### Texte Secondaire
```css
font-size: 0.875rem;   /* 14px */
font-weight: 400;      /* Normal */
line-height: 1.5;      /* 21px */
color: var(--muted-foreground);
```
- **Usage** : Informations complémentaires, légendes

#### Texte Petit
```css
font-size: 0.75rem;    /* 12px */
font-weight: 500;      /* Medium */
line-height: 1.4;      /* 16.8px */
color: var(--muted-foreground);
```
- **Usage** : Labels, badges, métadonnées

### Graisses de Police
```css
--font-thin: 100;
--font-light: 300;
--font-normal: 400;     /* Texte standard */
--font-medium: 500;     /* Emphasis légère */
--font-semibold: 600;   /* Titres, boutons */
--font-bold: 700;       /* Titres principaux */
--font-extrabold: 800;  /* Éléments très importants */
--font-black: 900;      /* Usage exceptionnel */
```

## Espacement et Mise en Page

### Système d'Espacement (basé sur 0.25rem = 4px)
```css
--spacing-0: 0;         /* 0px */
--spacing-px: 1px;      /* 1px - Bordures fines */
--spacing-0-5: 0.125rem; /* 2px */
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px - Unité de base */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
--spacing-32: 8rem;     /* 128px */
```

### Grille et Conteneurs

#### Container Principal
```css
.container {
  max-width: 1280px;    /* Desktop large */
  margin: 0 auto;
  padding: 0 1rem;      /* 16px de marge */
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; } /* 24px */
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }   /* 32px */
}
```

#### Breakpoints Responsive
```css
/* Mobile First */
@media (min-width: 640px)  { /* sm - Tablette portrait */ }
@media (min-width: 768px)  { /* md - Tablette paysage */ }
@media (min-width: 1024px) { /* lg - Desktop */ }
@media (min-width: 1280px) { /* xl - Desktop large */ }
@media (min-width: 1536px) { /* 2xl - Écrans très larges */ }
```

## Éléments Graphiques

### Rayons de Bordure
```css
--radius-none: 0;
--radius-sm: 0.25rem;   /* 4px - Petits éléments */
--radius: 0.5rem;       /* 8px - Standard */
--radius-md: 0.75rem;   /* 12px - Cartes */
--radius-lg: 1rem;      /* 16px - Modales */
--radius-xl: 1.5rem;    /* 24px - Sections */
--radius-2xl: 2rem;     /* 32px - Grands éléments */
--radius-full: 9999px;  /* Rond complet */
```

### Ombres
```css
/* Ombre subtile */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Ombre standard */
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Ombre médium */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Ombre large */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Ombre extra-large */
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Ombre 2xl */
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Ombre intérieure */
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
```

### Bordures
```css
--border-width: 1px;    /* Standard */
--border-width-2: 2px;  /* Emphasis */
--border-width-4: 4px;  /* Forte emphasis */
--border-width-8: 8px;  /* Décoratif */

/* Couleurs de bordure */
--border-color: var(--border);
--border-color-muted: var(--muted);
--border-color-primary: var(--primary);
--border-color-accent: var(--accent);
```

## Composants UI

### Boutons

#### Bouton Principal
```css
.btn-primary {
  background: var(--accent);
  color: var(--accent-foreground);
  padding: 0.75rem 2rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: hsl(142 76% 32%);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Bouton Secondaire
```css
.btn-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
  /* Autres propriétés identiques au primaire */
}

.btn-secondary:hover {
  background: var(--muted);
  border-color: var(--primary);
}
```

#### Bouton Fantôme
```css
.btn-ghost {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.btn-ghost:hover {
  background: var(--primary);
  color: var(--primary-foreground);
}
```

### Cartes

#### Carte Standard
```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.card-content {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  background: var(--muted);
  border-top: 1px solid var(--border);
}
```

### Formulaires

#### Champs de Saisie
```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--background);
  color: var(--foreground);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
}

.input:invalid {
  border-color: var(--destructive);
}
```

#### Labels
```css
.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 0.5rem;
}
```

### Navigation

#### Menu Principal
```css
.nav-main {
  background: var(--background);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.nav-link {
  color: var(--foreground);
  text-decoration: none;
  padding: 1rem 1.5rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary);
}

.nav-link.active {
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
}
```

## Iconographie

### Système d'Icônes
- **Bibliothèque** : Lucide React pour cohérence et qualité
- **Taille standard** : 24px (1.5rem)
- **Tailles alternatives** : 16px (petites), 32px (grandes), 48px (hero)
- **Style** : Outline avec épaisseur 2px
- **Couleur** : Hérite du texte parent ou var(--muted-foreground)

### Icônes Spécifiques
```tsx
// Navigation
<Home size={24} />
<Calendar size={24} />
<DollarSign size={24} />
<MessageCircle size={24} />
<HelpCircle size={24} />
<FileText size={24} />

// Actions
<Plus size={20} />
<Edit size={20} />
<Trash size={20} />
<Save size={20} />
<X size={20} />
<Check size={20} />

// États
<AlertCircle size={20} color="var(--destructive)" />
<CheckCircle size={20} color="var(--success)" />
<Info size={20} color="var(--info)" />
<AlertTriangle size={20} color="var(--warning)" />
```

## Images et Médias

### Dimensions Standards
```css
/* Images de chambres */
.room-image {
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: var(--radius-lg);
}

/* Avatars */
.avatar {
  aspect-ratio: 1/1;
  border-radius: var(--radius-full);
  object-fit: cover;
}

/* Images héro */
.hero-image {
  aspect-ratio: 21/9;
  object-fit: cover;
}
```

### Lazy Loading
```tsx
<img 
  src="image.jpg" 
  alt="Description"
  loading="lazy"
  className="transition-opacity duration-300"
/>
```

## Animations et Transitions

### Durées Standards
```css
--duration-fast: 150ms;    /* Micro-interactions */
--duration-normal: 200ms;  /* Standard */
--duration-slow: 300ms;    /* Animations complexes */
--duration-slower: 500ms;  /* Transitions de page */
```

### Courbes d'Animation
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Animations Communes
```css
/* Hover lift */
.hover-lift {
  transition: transform var(--duration-normal) var(--ease-out);
}
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn var(--duration-slow) var(--ease-out);
}

/* Scale hover */
.scale-hover {
  transition: transform var(--duration-normal) var(--ease-out);
}
.scale-hover:hover {
  transform: scale(1.02);
}
```

## États et Feedback

### Loading States
```css
.loading {
  opacity: 0.6;
  pointer-events: none;
  position: relative;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  border: 2px solid var(--muted);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

### Messages de Validation
```css
.error-message {
  color: var(--destructive);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.success-message {
  color: var(--success);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.warning-message {
  color: var(--warning);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

## Accessibilité

### Contraste
- **Texte normal** : Ratio minimum 4.5:1
- **Texte large** : Ratio minimum 3:1
- **Éléments graphiques** : Ratio minimum 3:1

### Focus
```css
.focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Reset outline par défaut */
*:focus {
  outline: none;
}

/* Application du focus visible */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Tailles de Clic
- **Minimum** : 44px × 44px pour tous éléments interactifs
- **Recommandé** : 48px × 48px pour confort optimal

## Responsivité

### Approche Mobile First
```css
/* Base (mobile) */
.responsive-element {
  font-size: 1rem;
  padding: 0.5rem;
}

/* Tablette */
@media (min-width: 768px) {
  .responsive-element {
    font-size: 1.125rem;
    padding: 0.75rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .responsive-element {
    font-size: 1.25rem;
    padding: 1rem;
  }
}
```

### Grilles Adaptatives
```css
.grid-responsive {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

Cette charte graphique complète assure une cohérence visuelle parfaite sur l'ensemble du site, garantissant une expérience utilisateur professionnelle et accessible.