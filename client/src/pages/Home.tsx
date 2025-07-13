import { useQuery } from "@tanstack/react-query";
import { Heart, Home, UserCheck, Gamepad2, Calendar, Instagram, Facebook, Mail, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/lib/i18n";
import type { CustomMessage } from "@shared/schema";

export default function HomePage() {
  const { t } = useLanguage();

  const { data: customMessages } = useQuery<CustomMessage[]>({
    queryKey: ['/api/custom-messages'],
  });

  return (
    <div className="min-h-screen bg-primary-bg">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Luxury pet hotel interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-tight">
            {t('home.hero.title').split(' ').map((word, index) => 
              word === 'Luxe' || word === 'Luxury' || word === 'Lujo' ? (
                <span key={index} className="text-accent">{word} </span>
              ) : (
                word + ' '
              )
            )}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-primary-text/90">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/reservations">
              <Button size="lg" className="bg-accent text-primary-bg hover:bg-accent/90 font-cta font-semibold text-lg rounded-full px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg">
                {t('home.hero.cta.reserve')}
              </Button>
            </Link>
            <Link href="/rooms">
              <Button variant="outline" size="lg" className="border-2 border-accent text-accent hover:bg-accent hover:text-primary-bg font-cta font-semibold text-lg rounded-full px-8 py-4 transition-all duration-300">
                {t('home.hero.cta.discover')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-6">{t('home.services.title')}</h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">{t('home.services.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="text-center hover-lift bg-primary-bg/50 border-none">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="text-primary-bg text-2xl" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-4">{t('home.services.individual.title')}</h3>
                <p className="text-secondary leading-relaxed">{t('home.services.individual.description')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-lift bg-primary-bg/50 border-none">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="text-primary-bg text-2xl" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-4">{t('home.services.care.title')}</h3>
                <p className="text-secondary leading-relaxed">{t('home.services.care.description')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-lift bg-primary-bg/50 border-none">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gamepad2 className="text-primary-bg text-2xl" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-4">{t('home.services.activities.title')}</h3>
                <p className="text-secondary leading-relaxed">{t('home.services.activities.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Manager Presentation */}
      <section className="py-16 lg:py-24 bg-primary-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-6">{t('home.manager.title')}</h2>
              <p className="text-lg mb-6 leading-relaxed">
                {t('home.manager.description')}
              </p>
              <p className="text-secondary mb-8 leading-relaxed italic">
                "{t('home.manager.quote')}"
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-accent rounded-full border-2 border-white flex items-center justify-center">
                    <UserCheck className="text-primary-bg text-xs" />
                  </div>
                  <div className="w-8 h-8 bg-secondary rounded-full border-2 border-white flex items-center justify-center">
                    <Heart className="text-primary-bg text-xs" fill="currentColor" />
                  </div>
                </div>
                <span className="text-sm text-secondary">Certifiée soins animaliers • Passionnée depuis l'enfance</span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1559190394-df5a28aab5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Marie, gérante de Pet Paradise avec des animaux" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-6">{t('home.instagram.title')}</h2>
            <p className="text-lg text-secondary mb-8">{t('home.instagram.subtitle')}</p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-cta font-medium hover:shadow-lg transition-all duration-300 rounded-full">
              <Instagram className="mr-2 h-4 w-4" />
              @petparadise
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
              "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
              "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
              "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
            ].map((src, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden hover-lift cursor-pointer">
                <img 
                  src={src} 
                  alt={`Pet Paradise Instagram post ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 lg:py-24 bg-primary-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-6">{t('home.reviews.title')}</h2>
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5" fill="currentColor" />
                ))}
              </div>
              <span className="text-secondary font-medium">4.9/5 • Plus de 200 avis</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Leblanc",
                pet: "Propriétaire de Max",
                review: "Exceptionnelle expérience ! Mon chien Max a été traité comme un roi. L'équipe est professionnelle et vraiment passionnée.",
                initials: "SL"
              },
              {
                name: "Jean Martin", 
                pet: "Propriétaire de Luna & Oscar",
                review: "Mes deux chats ont adoré leur séjour. Les chambres sont spacieuses et le personnel très attentionné. Je recommande vivement !",
                initials: "JM"
              },
              {
                name: "Anne Dubois",
                pet: "Propriétaire de Coco", 
                review: "Service impeccable ! Mon lapin Coco est revenu détendu et heureux. Le concept 'une famille par chambre' fait vraiment la différence.",
                initials: "AD"
              }
            ].map((review, index) => (
              <Card key={index} className="hover-lift border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-secondary mb-4 leading-relaxed">"{review.review}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-bg font-medium text-sm">{review.initials}</span>
                    </div>
                    <div>
                      <div className="font-medium text-primary-text">{review.name}</div>
                      <div className="text-sm text-secondary">{review.pet}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Messages */}
      {customMessages && customMessages.length > 0 && (
        <section className="py-12 bg-accent/10 border-t border-b border-accent/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {customMessages.map((message) => (
              <Card key={message.id} className="bg-white/70 backdrop-blur-sm border-none">
                <CardContent className="p-6 lg:p-8 text-center">
                  <Calendar className="text-accent text-3xl mb-4 mx-auto" />
                  <h3 className="font-heading font-semibold text-xl lg:text-2xl mb-4">{message.title}</h3>
                  <p className="text-secondary leading-relaxed mb-4">{message.content}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/reservations">
                      <Button className="bg-accent text-primary-bg hover:bg-accent/90 font-cta font-medium rounded-full">
                        Profiter de l'offre
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button variant="outline" className="text-accent border-accent hover:bg-accent hover:text-primary-bg font-cta font-medium rounded-full">
                        Voir les tarifs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Social Media Links */}
      <section className="py-16 bg-primary-text text-primary-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-2xl lg:text-3xl mb-8">{t('home.social.title')}</h2>
          <p className="text-primary-bg/80 mb-8 leading-relaxed">{t('home.social.subtitle')}</p>
          
          <div className="flex justify-center space-x-6 mb-8">
            <Button size="icon" className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full hover:scale-110 transition-transform duration-300">
              <Instagram className="text-white text-xl" />
            </Button>
            <Button size="icon" className="w-12 h-12 bg-blue-600 rounded-full hover:scale-110 transition-transform duration-300">
              <Facebook className="text-white text-xl" />
            </Button>
            <Button size="icon" className="w-12 h-12 bg-accent rounded-full hover:scale-110 transition-transform duration-300">
              <Mail className="text-white text-xl" />
            </Button>
          </div>
          
          <Card className="bg-primary-bg/10 backdrop-blur-sm border-none">
            <CardContent className="p-6">
              <p className="text-sm text-primary-bg/70 mb-2">Besoin d'informations ?</p>
              <p className="font-medium">📞 +33 1 23 45 67 89 • 📧 contact@petparadise.fr</p>
              <p className="text-sm text-primary-bg/70 mt-2">Ouvert 7j/7 • Urgences 24h/24</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-text/95 text-primary-bg/80 py-12 border-t border-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Heart className="text-primary-bg" fill="currentColor" />
                </div>
                <span className="font-heading font-bold text-xl">Pet Paradise</span>
              </div>
              <p className="text-sm leading-relaxed">
                Hébergement de luxe pour animaux domestiques. 
                Une expérience unique dans un cadre chaleureux et professionnel.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold mb-4">Navigation</h4>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block hover:text-accent transition-colors">Accueil</Link>
                <Link href="/rooms" className="block hover:text-accent transition-colors">Chambres & Services</Link>
                <Link href="/pricing" className="block hover:text-accent transition-colors">Tarifs</Link>
                <Link href="/contact" className="block hover:text-accent transition-colors">Contact</Link>
                <Link href="/reservations" className="block hover:text-accent transition-colors">Réserver</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <p>📍 123 Rue des Animaux, 75000 Paris</p>
                <p>📞 +33 1 23 45 67 89</p>
                <p>📧 contact@petparadise.fr</p>
                <p>🕒 Ouvert 7j/7, 8h-20h</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-bg/20 pt-6 text-center">
            <p className="text-sm">
              © 2024 Pet Paradise. Tous droits réservés. | 
              <a href="#" className="hover:text-accent transition-colors ml-1 mr-1">Mentions légales</a> | 
              <a href="#" className="hover:text-accent transition-colors mr-1">CGV</a> | 
              <a href="#" className="hover:text-accent transition-colors">Politique de confidentialité</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
