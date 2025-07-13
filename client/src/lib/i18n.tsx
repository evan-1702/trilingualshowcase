import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'es';

export interface Translations {
  // Navigation
  'nav.home': string;
  'nav.rooms': string;
  'nav.pricing': string;
  'nav.contact': string;
  'nav.reserve': string;
  
  // Common
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.required': string;
  'common.optional': string;
  'common.send': string;
  'common.cancel': string;
  'common.save': string;
  'common.delete': string;
  'common.edit': string;
  'common.add': string;
  
  // Home page
  'home.hero.title': string;
  'home.hero.subtitle': string;
  'home.hero.cta.reserve': string;
  'home.hero.cta.discover': string;
  'home.services.title': string;
  'home.services.subtitle': string;
  'home.services.individual.title': string;
  'home.services.individual.description': string;
  'home.services.care.title': string;
  'home.services.care.description': string;
  'home.services.activities.title': string;
  'home.services.activities.description': string;
  'home.manager.title': string;
  'home.manager.description': string;
  'home.manager.quote': string;
  'home.instagram.title': string;
  'home.instagram.subtitle': string;
  'home.reviews.title': string;
  'home.social.title': string;
  'home.social.subtitle': string;
  
  // Contact page
  'contact.title': string;
  'contact.subtitle': string;
  'contact.form.email': string;
  'contact.form.name': string;
  'contact.form.firstName': string;
  'contact.form.phone': string;
  'contact.form.message': string;
  'contact.form.animals.count': string;
  'contact.form.animals.name': string;
  'contact.form.animals.type': string;
  'contact.form.animals.comment': string;
  'contact.success': string;
  
  // Reservations page
  'reservations.title': string;
  'reservations.subtitle': string;
  'reservations.form.startDate': string;
  'reservations.form.endDate': string;
  'reservations.form.roomPreference': string;
  'reservations.form.animals.sex.male': string;
  'reservations.form.animals.sex.maleNeutered': string;
  'reservations.form.animals.sex.female': string;
  'reservations.form.animals.sex.femaleNeutered': string;
  'reservations.success': string;
  'reservations.disclaimer': string;
  'reservations.unavailable': string;
  
  // Rooms page
  'rooms.title': string;
  'rooms.subtitle': string;
  'rooms.philosophy': string;
  'rooms.surface': string;
  'rooms.pricing': string;
  'rooms.availability': string;
  'rooms.reserve': string;
  
  // Pricing page
  'pricing.title': string;
  'pricing.subtitle': string;
  'pricing.accommodation': string;
  'pricing.services': string;
  
  // Navigation
  'nav.faq': string;
  'nav.blog': string;
  
  // FAQ page
  'faq.title': string;
  'faq.subtitle': string;
  'faq.category.general': string;
  'faq.category.reservation': string;
  'faq.category.services': string;
  'faq.category.pricing': string;

  // Blog page
  'blog.title': string;
  'blog.subtitle': string;
  'blog.readMore': string;
  'blog.publishedOn': string;
  'blog.category': string;
  'blog.tags': string;
  'blog.noArticles': string;

  // Admin
  'admin.login.title': string;
  'admin.login.username': string;
  'admin.login.password': string;
  'admin.login.submit': string;
  'admin.dashboard.title': string;
  'admin.pricing.title': string;
  'admin.schedule.title': string;
  'admin.messages.title': string;
  'admin.faq.title': string;
  'admin.blog.title': string;
}

const translations: Record<Language, Translations> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.rooms': 'Nos Suites',
    'nav.pricing': 'Tarifs',
    'nav.contact': 'Contact',
    'nav.reserve': 'Réserver',
    'nav.faq': 'FAQ',
    'nav.blog': 'Blog',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.required': 'Requis',
    'common.optional': 'Optionnel',
    'common.send': 'Envoyer',
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    
    // Home page
    'home.hero.title': 'Pet Paradise - Pension de Luxe pour Animaux',
    'home.hero.subtitle': 'Un hébergement premium dans un cadre exceptionnel pour le bien-être de vos compagnons.',
    'home.hero.cta.reserve': 'Réserver maintenant',
    'home.hero.cta.discover': 'Découvrir nos suites',
    'home.services.title': 'Nos Services',
    'home.services.subtitle': 'Un accompagnement personnalisé pour chaque animal',
    'home.services.individual.title': 'Suivi Individualisé',
    'home.services.individual.description': 'Chaque pensionnaire bénéficie d\'un accompagnement sur mesure adapté à ses besoins spécifiques.',
    'home.services.care.title': 'Soins Premium',
    'home.services.care.description': 'Alimentation personnalisée, soins vétérinaires et attention constante pour le bien-être optimal.',
    'home.services.activities.title': 'Activités & Détente',
    'home.services.activities.description': 'Espaces de jeu, promenades et moments de détente dans un environnement sécurisé.',
    'home.manager.title': 'Notre Directrice',
    'home.manager.description': 'Passionnée par le bien-être animal depuis plus de 15 ans, notre directrice veille personnellement au confort de chaque pensionnaire.',
    'home.manager.quote': '"Chaque animal mérite un séjour exceptionnel loin de chez lui."',
    'home.instagram.title': 'Suivez-nous sur Instagram',
    'home.instagram.subtitle': 'Découvrez le quotidien de nos pensionnaires',
    'home.reviews.title': 'Témoignages',
    'home.social.title': 'Restez Connectés',
    'home.social.subtitle': 'Suivez l\'actualité de Pet Paradise',
    
    // Contact page
    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Nous sommes là pour répondre à toutes vos questions',
    'contact.form.email': 'Email',
    'contact.form.name': 'Nom',
    'contact.form.firstName': 'Prénom',
    'contact.form.phone': 'Téléphone',
    'contact.form.message': 'Message',
    'contact.form.animals.count': 'Nombre d\'animaux',
    'contact.form.animals.name': 'Nom de l\'animal',
    'contact.form.animals.type': 'Type d\'animal',
    'contact.form.animals.comment': 'Commentaires spéciaux',
    'contact.success': 'Votre message a été envoyé avec succès !',
    
    // Reservations page
    'reservations.title': 'Réservation',
    'reservations.subtitle': 'Réservez le séjour idéal pour votre compagnon',
    'reservations.form.startDate': 'Date d\'arrivée',
    'reservations.form.endDate': 'Date de départ',
    'reservations.form.roomPreference': 'Préférence de suite',
    'reservations.form.animals.sex.male': 'Mâle',
    'reservations.form.animals.sex.maleNeutered': 'Mâle stérilisé',
    'reservations.form.animals.sex.female': 'Femelle',
    'reservations.form.animals.sex.femaleNeutered': 'Femelle stérilisée',
    'reservations.success': 'Votre demande de réservation a été envoyée !',
    'reservations.disclaimer': 'Toute réservation est sujette à confirmation de notre part.',
    'reservations.unavailable': 'Non disponible',
    
    // Rooms page
    'rooms.title': 'Nos Suites',
    'rooms.subtitle': 'Des espaces conçus pour le confort et le bien-être',
    'rooms.philosophy': 'Notre Philosophie',
    'rooms.surface': 'Surface',
    'rooms.pricing': 'Tarifs',
    'rooms.availability': 'Disponibilités',
    'rooms.reserve': 'Réserver cette suite',
    
    // Pricing page
    'pricing.title': 'Nos Tarifs',
    'pricing.subtitle': 'Transparence et simplicité pour tous nos services',
    'pricing.accommodation': 'Hébergement',
    'pricing.services': 'Services',
    
    // FAQ page
    'faq.title': 'Questions Fréquentes',
    'faq.subtitle': 'Trouvez rapidement les réponses à vos questions',
    'faq.category.general': 'Général',
    'faq.category.reservation': 'Réservation',
    'faq.category.services': 'Services',
    'faq.category.pricing': 'Tarifs',

    // Blog page
    'blog.title': 'Blog & Actualités',
    'blog.subtitle': 'Découvrez nos conseils et actualités',
    'blog.readMore': 'Lire la suite',
    'blog.publishedOn': 'Publié le',
    'blog.category': 'Catégorie',
    'blog.tags': 'Tags',
    'blog.noArticles': 'Aucun article disponible pour le moment',
    
    // Admin
    'admin.login.title': 'Connexion Administrateur',
    'admin.login.username': 'Nom d\'utilisateur',
    'admin.login.password': 'Mot de passe',
    'admin.login.submit': 'Se connecter',
    'admin.dashboard.title': 'Tableau de bord',
    'admin.pricing.title': 'Gestion des tarifs',
    'admin.schedule.title': 'Planning des réservations',
    'admin.messages.title': 'Messages personnalisés',
    'admin.faq.title': 'Gestion FAQ',
    'admin.blog.title': 'Gestion Blog',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.rooms': 'Our Suites',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.reserve': 'Book Now',
    'nav.faq': 'FAQ',
    'nav.blog': 'Blog',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.required': 'Required',
    'common.optional': 'Optional',
    'common.send': 'Send',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    
    // Home page
    'home.hero.title': 'Pet Paradise - Luxury Pet Boarding',
    'home.hero.subtitle': 'Premium accommodation in an exceptional setting for your companions\' well-being.',
    'home.hero.cta.reserve': 'Book now',
    'home.hero.cta.discover': 'Discover our suites',
    'home.services.title': 'Our Services',
    'home.services.subtitle': 'Personalized care for every animal',
    'home.services.individual.title': 'Individual Care',
    'home.services.individual.description': 'Each guest receives personalized attention tailored to their specific needs.',
    'home.services.care.title': 'Premium Care',
    'home.services.care.description': 'Personalized nutrition, veterinary care and constant attention for optimal well-being.',
    'home.services.activities.title': 'Activities & Relaxation',
    'home.services.activities.description': 'Play areas, walks and relaxation moments in a secure environment.',
    'home.manager.title': 'Our Director',
    'home.manager.description': 'Passionate about animal welfare for over 15 years, our director personally ensures the comfort of each guest.',
    'home.manager.quote': '"Every animal deserves an exceptional stay away from home."',
    'home.instagram.title': 'Follow us on Instagram',
    'home.instagram.subtitle': 'Discover our guests\' daily life',
    'home.reviews.title': 'Testimonials',
    'home.social.title': 'Stay Connected',
    'home.social.subtitle': 'Follow Pet Paradise news',
    
    // Contact page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We\'re here to answer all your questions',
    'contact.form.email': 'Email',
    'contact.form.name': 'Last Name',
    'contact.form.firstName': 'First Name',
    'contact.form.phone': 'Phone',
    'contact.form.message': 'Message',
    'contact.form.animals.count': 'Number of animals',
    'contact.form.animals.name': 'Animal name',
    'contact.form.animals.type': 'Animal type',
    'contact.form.animals.comment': 'Special comments',
    'contact.success': 'Your message has been sent successfully!',
    
    // Reservations page
    'reservations.title': 'Reservation',
    'reservations.subtitle': 'Book the perfect stay for your companion',
    'reservations.form.startDate': 'Arrival date',
    'reservations.form.endDate': 'Departure date',
    'reservations.form.roomPreference': 'Suite preference',
    'reservations.form.animals.sex.male': 'Male',
    'reservations.form.animals.sex.maleNeutered': 'Neutered male',
    'reservations.form.animals.sex.female': 'Female',
    'reservations.form.animals.sex.femaleNeutered': 'Spayed female',
    'reservations.success': 'Your reservation request has been sent!',
    'reservations.disclaimer': 'All reservations are subject to our confirmation.',
    'reservations.unavailable': 'Unavailable',
    
    // Rooms page
    'rooms.title': 'Our Suites',
    'rooms.subtitle': 'Spaces designed for comfort and well-being',
    'rooms.philosophy': 'Our Philosophy',
    'rooms.surface': 'Surface',
    'rooms.pricing': 'Pricing',
    'rooms.availability': 'Availability',
    'rooms.reserve': 'Book this suite',
    
    // Pricing page
    'pricing.title': 'Our Pricing',
    'pricing.subtitle': 'Transparency and simplicity for all our services',
    'pricing.accommodation': 'Accommodation',
    'pricing.services': 'Services',
    
    // FAQ page
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to your questions quickly',
    'faq.category.general': 'General',
    'faq.category.reservation': 'Reservation',
    'faq.category.services': 'Services',
    'faq.category.pricing': 'Pricing',

    // Blog page
    'blog.title': 'Blog & News',
    'blog.subtitle': 'Discover our tips and news',
    'blog.readMore': 'Read more',
    'blog.publishedOn': 'Published on',
    'blog.category': 'Category',
    'blog.tags': 'Tags',
    'blog.noArticles': 'No articles available at the moment',
    
    // Admin
    'admin.login.title': 'Administrator Login',
    'admin.login.username': 'Username',
    'admin.login.password': 'Password',
    'admin.login.submit': 'Login',
    'admin.dashboard.title': 'Dashboard',
    'admin.pricing.title': 'Pricing management',
    'admin.schedule.title': 'Reservation schedule',
    'admin.messages.title': 'Custom messages',
    'admin.faq.title': 'FAQ Management',
    'admin.blog.title': 'Blog Management',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.rooms': 'Nuestras Suites',
    'nav.pricing': 'Tarifas',
    'nav.contact': 'Contacto',
    'nav.reserve': 'Reservar',
    'nav.faq': 'FAQ',
    'nav.blog': 'Blog',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.required': 'Requerido',
    'common.optional': 'Opcional',
    'common.send': 'Enviar',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Añadir',
    
    // Home page
    'home.hero.title': 'Pet Paradise - Pensión de Lujo para Mascotas',
    'home.hero.subtitle': 'Alojamiento premium en un entorno excepcional para el bienestar de sus compañeros.',
    'home.hero.cta.reserve': 'Reservar ahora',
    'home.hero.cta.discover': 'Descubrir nuestras suites',
    'home.services.title': 'Nuestros Servicios',
    'home.services.subtitle': 'Atención personalizada para cada animal',
    'home.services.individual.title': 'Cuidado Individual',
    'home.services.individual.description': 'Cada huésped recibe atención personalizada adaptada a sus necesidades específicas.',
    'home.services.care.title': 'Cuidado Premium',
    'home.services.care.description': 'Alimentación personalizada, atención veterinaria y cuidado constante para un bienestar óptimo.',
    'home.services.activities.title': 'Actividades y Relajación',
    'home.services.activities.description': 'Áreas de juego, paseos y momentos de relajación en un ambiente seguro.',
    'home.manager.title': 'Nuestra Directora',
    'home.manager.description': 'Apasionada por el bienestar animal desde hace más de 15 años, nuestra directora vela personalmente por la comodidad de cada huésped.',
    'home.manager.quote': '"Cada animal merece una estancia excepcional lejos de casa."',
    'home.instagram.title': 'Síguenos en Instagram',
    'home.instagram.subtitle': 'Descubre la vida diaria de nuestros huéspedes',
    'home.reviews.title': 'Testimonios',
    'home.social.title': 'Mantente Conectado',
    'home.social.subtitle': 'Sigue las noticias de Pet Paradise',
    
    // Contact page
    'contact.title': 'Contáctanos',
    'contact.subtitle': 'Estamos aquí para responder todas tus preguntas',
    'contact.form.email': 'Email',
    'contact.form.name': 'Apellido',
    'contact.form.firstName': 'Nombre',
    'contact.form.phone': 'Teléfono',
    'contact.form.message': 'Mensaje',
    'contact.form.animals.count': 'Número de animales',
    'contact.form.animals.name': 'Nombre del animal',
    'contact.form.animals.type': 'Tipo de animal',
    'contact.form.animals.comment': 'Comentarios especiales',
    'contact.success': '¡Tu mensaje ha sido enviado exitosamente!',
    
    // Reservations page
    'reservations.title': 'Reserva',
    'reservations.subtitle': 'Reserva la estancia perfecta para tu compañero',
    'reservations.form.startDate': 'Fecha de llegada',
    'reservations.form.endDate': 'Fecha de salida',
    'reservations.form.roomPreference': 'Preferencia de suite',
    'reservations.form.animals.sex.male': 'Macho',
    'reservations.form.animals.sex.maleNeutered': 'Macho castrado',
    'reservations.form.animals.sex.female': 'Hembra',
    'reservations.form.animals.sex.femaleNeutered': 'Hembra esterilizada',
    'reservations.success': '¡Tu solicitud de reserva ha sido enviada!',
    'reservations.disclaimer': 'Todas las reservas están sujetas a nuestra confirmación.',
    'reservations.unavailable': 'No disponible',
    
    // Rooms page
    'rooms.title': 'Nuestras Suites',
    'rooms.subtitle': 'Espacios diseñados para la comodidad y el bienestar',
    'rooms.philosophy': 'Nuestra Filosofía',
    'rooms.surface': 'Superficie',
    'rooms.pricing': 'Tarifas',
    'rooms.availability': 'Disponibilidad',
    'rooms.reserve': 'Reservar esta suite',
    
    // Pricing page
    'pricing.title': 'Nuestras Tarifas',
    'pricing.subtitle': 'Transparencia y simplicidad para todos nuestros servicios',
    'pricing.accommodation': 'Alojamiento',
    'pricing.services': 'Servicios',
    
    // FAQ page
    'faq.title': 'Preguntas Frecuentes',
    'faq.subtitle': 'Encuentra respuestas a tus preguntas rápidamente',
    'faq.category.general': 'General',
    'faq.category.reservation': 'Reserva',
    'faq.category.services': 'Servicios',
    'faq.category.pricing': 'Tarifas',

    // Blog page
    'blog.title': 'Blog y Noticias',
    'blog.subtitle': 'Descubre nuestros consejos y noticias',
    'blog.readMore': 'Leer más',
    'blog.publishedOn': 'Publicado el',
    'blog.category': 'Categoría',
    'blog.tags': 'Etiquetas',
    'blog.noArticles': 'No hay artículos disponibles en este momento',
    
    // Admin
    'admin.login.title': 'Acceso Administrador',
    'admin.login.username': 'Usuario',
    'admin.login.password': 'Contraseña',
    'admin.login.submit': 'Iniciar sesión',
    'admin.dashboard.title': 'Panel de control',
    'admin.pricing.title': 'Gestión de tarifas',
    'admin.schedule.title': 'Horario de reservas',
    'admin.messages.title': 'Mensajes personalizados',
    'admin.faq.title': 'Gestión FAQ',
    'admin.blog.title': 'Gestión Blog',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('pet-paradise-language') as Language;
    if (savedLanguage && ['fr', 'en', 'es'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('pet-paradise-language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: keyof Translations): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}