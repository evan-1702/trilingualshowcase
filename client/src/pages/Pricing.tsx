import { useQuery } from "@tanstack/react-query";
import { Euro, Home, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/lib/i18n";
import type { Room, RoomPricing, ServicePricing } from "@shared/schema";

export default function PricingPage() {
  const { t } = useLanguage();

  const { data: rooms, isLoading: roomsLoading } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  const { data: servicePricing, isLoading: servicesLoading } = useQuery<ServicePricing[]>({
    queryKey: ['/api/service-pricing'],
  });

  const { data: roomsWithPricing, isLoading: pricingLoading } = useQuery<(Room & { pricing: RoomPricing[] })[]>({
    queryKey: ['/api/rooms-with-pricing'],
    queryFn: async () => {
      if (!rooms) return [];
      const roomsWithPricing = await Promise.all(
        rooms.map(async (room) => {
          const pricingResponse = await fetch(`/api/rooms/${room.id}/pricing`);
          const pricing = await pricingResponse.json();
          return { ...room, pricing };
        })
      );
      return roomsWithPricing;
    },
    enabled: !!rooms,
  });

  const isLoading = roomsLoading || servicesLoading || pricingLoading;

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
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">{t('pricing.title')}</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">{t('pricing.subtitle')}</p>
        </div>
      </section>

      {/* Pricing Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Room Pricing */}
          <Card className="bg-white shadow-lg border-none">
            <CardHeader>
              <CardTitle className="font-heading text-2xl flex items-center">
                <Home className="w-6 h-6 mr-3 text-accent" />
                {t('pricing.accommodation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {roomsWithPricing && roomsWithPricing.length > 0 ? (
                <div className="grid lg:grid-cols-2 gap-8">
                  {roomsWithPricing.map((room) => (
                    <div key={room.id} className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={room.images[0] || "https://images.unsplash.com/photo-1601758228041-f3b2795255f1"} 
                          alt={room.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-heading font-semibold text-lg">{room.name}</h3>
                          <p className="text-sm text-secondary">{room.surface}m²</p>
                        </div>
                      </div>
                      
                      {room.pricing && room.pricing.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Service</TableHead>
                              <TableHead className="text-right">Prix</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {room.pricing.map((pricing) => (
                              <TableRow key={pricing.id}>
                                <TableCell className="font-medium">{pricing.service_name}</TableCell>
                                <TableCell className="text-right font-semibold">{pricing.price}€</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-secondary text-sm">Tarifs non disponibles</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary">Aucun tarif d'hébergement disponible pour le moment.</p>
              )}
            </CardContent>
          </Card>

          {/* Service Pricing */}
          <Card className="bg-white shadow-lg border-none">
            <CardHeader>
              <CardTitle className="font-heading text-2xl flex items-center">
                <Wrench className="w-6 h-6 mr-3 text-accent" />
                {t('pricing.services')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {servicePricing && servicePricing.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Prix</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicePricing.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.serviceName}</TableCell>
                        <TableCell className="text-secondary">{service.description || "-"}</TableCell>
                        <TableCell className="text-right font-semibold">{service.price}€</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-secondary">Aucun service supplémentaire disponible pour le moment.</p>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-6">
              <div className="text-center">
                <Euro className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-xl mb-2">Informations importantes</h3>
                <div className="space-y-2 text-sm text-secondary">
                  <p>• Tous les prix sont indiqués en euros TTC</p>
                  <p>• Une seule famille par chambre garantie</p>
                  <p>• Tarifs dégressifs pour les séjours de plus de 7 jours</p>
                  <p>• Assurance responsabilité civile incluse</p>
                  <p>• Soins vétérinaires d'urgence non inclus</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
