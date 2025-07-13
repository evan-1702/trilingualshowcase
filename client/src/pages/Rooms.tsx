import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Square, Euro, CalendarIcon, Users, Shield, Heart, Home, Clock, Gamepad2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/lib/i18n";
import { format, eachDayOfInterval, isSameDay, isValid } from "date-fns";
import { fr, es, enUS } from "date-fns/locale";
import type { Room, RoomSchedule, RoomPricing } from "@shared/schema";

const heroImages = [
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop", 
  "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=400&fit=crop"
];

export default function RoomsPage() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const { data: rooms, isLoading } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  const autoplayPlugin = Autoplay({ delay: 10000, stopOnInteraction: true });

  const handleReservation = (room: Room, startDate?: Date, endDate?: Date) => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', format(startDate, 'yyyy-MM-dd'));
    if (endDate) params.set('endDate', format(endDate, 'yyyy-MM-dd'));
    if (room) params.set('roomId', room.id.toString());
    
    setLocation(`/reservations?${params.toString()}`);
  };

  const getDatePickerLocale = () => {
    switch (language) {
      case 'fr': return fr;
      case 'es': return es;
      default: return enUS;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-lg text-secondary">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <Navigation />

      {/* Hero Section with Carousel */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6 text-primary">
              {t('rooms.title')}
            </h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed mb-8">
              {t('rooms.subtitle')}
            </p>
          </div>

          {/* Photo Carousel */}
          <div className="mb-16">
            <Carousel 
              className="w-full max-w-5xl mx-auto"
              plugins={[autoplayPlugin]}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {heroImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={image}
                        alt={`Suite ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          {/* Quality Service Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Une famille par chambre</h3>
              <p className="text-secondary">Intimité et tranquillité garanties pour votre compagnon</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Surveillance 24h/24</h3>
              <p className="text-secondary">Sécurité et attention constantes par notre équipe dédiée</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Comme à la maison</h3>
              <p className="text-secondary">Confort et bien-être dans un environnement familier</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Service premium</h3>
              <p className="text-secondary">Attention personnalisée et soins adaptés à chaque animal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Tabs Section */}
      <section className="py-16 bg-primary-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue={rooms?.[0]?.id.toString()} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12 bg-white rounded-xl p-2">
              {rooms?.map((room) => (
                <TabsTrigger 
                  key={room.id} 
                  value={room.id.toString()} 
                  className="text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-white rounded-lg py-3"
                >
                  {room.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {rooms?.map((room) => (
              <TabsContent key={room.id} value={room.id.toString()}>
                <RoomDetail 
                  room={room} 
                  onReserve={(startDate, endDate) => handleReservation(room, startDate, endDate)}
                  datePickerLocale={getDatePickerLocale()}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function RoomDetail({ 
  room, 
  onReserve, 
  datePickerLocale 
}: { 
  room: Room; 
  onReserve: (startDate?: Date, endDate?: Date) => void;
  datePickerLocale: any;
}) {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedDates, setSelectedDates] = useState<{ from?: Date; to?: Date } | undefined>(undefined);

  const { data: schedule } = useQuery<RoomSchedule[]>({
    queryKey: [`/api/rooms/${room.id}/schedule`],
  });

  const { data: pricing } = useQuery<RoomPricing[]>({
    queryKey: [`/api/rooms/${room.id}/pricing`],
  });

  // Get disabled dates (occupied or maintenance)
  const getDisabledDates = () => {
    const disabledDates: Date[] = [];
    if (!schedule) return disabledDates;

    schedule.forEach(booking => {
      if (booking.status === 'occupied' || booking.status === 'maintenance') {
        try {
          const startDate = new Date(booking.startDate);
          const endDate = new Date(booking.endDate);
          
          // Validate dates before using them
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            const days = eachDayOfInterval({
              start: startDate,
              end: endDate
            });
            disabledDates.push(...days);
          }
        } catch (error) {
          console.warn('Invalid date in booking:', booking);
        }
      }
    });
    
    return disabledDates;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    const disabledDates = getDisabledDates();
    return disabledDates.some(disabledDate => isSameDay(date, disabledDate));
  };

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    setSelectedDates(range as any);
  };

  const handleReserveClick = () => {
    onReserve(selectedDates?.from, selectedDates?.to);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Room Images and Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Room Images */}
        <div className="space-y-4">
          <img
            src={room.images?.[0] || "https://images.unsplash.com/photo-1601758228041-f3b2795255f1"}
            alt={room.name}
            className="w-full h-80 object-cover rounded-2xl shadow-lg"
          />
          {room.images && room.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {room.images.slice(1, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${room.name} ${index + 2}`}
                  className="w-full h-24 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
                />
              ))}
            </div>
          )}
        </div>

        {/* Room Info */}
        <Card className="bg-white border-none shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="font-heading font-bold text-3xl text-primary">
              {room.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-secondary leading-relaxed text-lg">
              {room.description}
            </p>

            {/* Philosophy */}
            <div className="bg-accent/10 rounded-xl p-6 border-l-4 border-accent">
              <h4 className="font-semibold text-primary mb-2">Notre philosophie</h4>
              <p className="text-secondary italic">
                "{room.philosophy}"
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Square className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{room.surface}m²</p>
                  <p className="text-sm text-secondary">Surface</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-lg">1 famille</p>
                  <p className="text-sm text-secondary">Maximum</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Jeux</p>
                  <p className="text-sm text-secondary">Espaces dédiés</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Soins</p>
                  <p className="text-sm text-secondary">Personnalisés</p>
                </div>
              </div>
            </div>

            {/* Pricing Info */}
            {pricing && pricing.length > 0 && (
              <div className="bg-white border border-accent/20 rounded-xl p-6">
                <h4 className="font-heading font-semibold text-xl mb-4 text-primary">Tarif principal</h4>
                <div className="space-y-3">
                  {pricing.slice(0, 1).map((price, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-secondary">{price.serviceName}</span>
                      <span className="font-bold text-lg text-accent">{price.price}€</span>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <p className="text-sm text-secondary">
                      Voir tous les tarifs sur la page "Tarifs"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calendar and Booking Section */}
      <div className="space-y-6">
        <Card className="bg-white border-none shadow-xl">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-xl text-primary">
              {t('rooms.availability')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="range"
              selected={selectedDates as any}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              locale={datePickerLocale}
              className="rounded-xl border-0"
              numberOfMonths={1}
            />
            
            {/* Legend */}
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-200 rounded border border-red-300"></div>
                <span>Indisponible</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-200 rounded border border-green-300"></div>
                <span>Disponible</span>
              </div>
              {selectedDates?.from && selectedDates?.to && (
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-accent rounded"></div>
                  <span className="font-semibold">
                    Sélection: {selectedDates.from instanceof Date && !isNaN(selectedDates.from.getTime()) ? format(selectedDates.from, 'dd/MM') : '--'} - {selectedDates.to instanceof Date && !isNaN(selectedDates.to.getTime()) ? format(selectedDates.to, 'dd/MM') : '--'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            className="w-full bg-accent text-white hover:bg-accent/90 h-14 text-lg font-semibold"
            onClick={handleReserveClick}
            disabled={!selectedDates?.from || !selectedDates?.to}
          >
            <CalendarIcon className="w-5 h-5 mr-3" />
            {selectedDates?.from && selectedDates?.to 
              ? `Réserver du ${format(selectedDates.from, 'dd/MM')} au ${format(selectedDates.to, 'dd/MM')}`
              : t('rooms.reserve')
            }
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 text-lg border-accent text-accent hover:bg-accent/10"
            onClick={() => setLocation('/pricing')}
          >
            <Euro className="w-5 h-5 mr-3" />
            Voir tous les tarifs
          </Button>
        </div>

        {/* Current Bookings */}
        {schedule && schedule.length > 0 && (
          <Card className="bg-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="font-heading font-bold text-lg text-primary">
                Réservations actuelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schedule.slice(0, 3).map((booking, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-primary-bg/50 rounded-xl">
                    <div>
                      <p className="font-semibold">
                        {format(new Date(booking.startDate), 'dd/MM')} - {format(new Date(booking.endDate), 'dd/MM')}
                      </p>
                      {booking.guestInfo && (
                        <p className="text-sm text-secondary mt-1">{booking.guestInfo}</p>
                      )}
                    </div>
                    <Badge 
                      variant={booking.status === 'occupied' ? 'destructive' : 'secondary'}
                      className="px-3 py-1"
                    >
                      {booking.status === 'occupied' ? 'Occupé' : 'Maintenance'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}