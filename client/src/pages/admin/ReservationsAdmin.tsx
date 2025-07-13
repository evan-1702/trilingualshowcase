import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Home, Calendar, MapPin, Phone, Mail, User, Heart, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Reservation, Room } from "@shared/schema";

export default function ReservationsAdmin() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: reservations = [], isLoading } = useQuery<Reservation[]>({
    queryKey: ['/api/admin/reservations'],
  });

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/admin/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reservations'] });
      toast({ 
        title: "Succès", 
        description: "Statut de la réservation mis à jour avec succès" 
      });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ 
        title: "Erreur", 
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          En attente
        </Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmée
        </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Annulée
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoomName = (roomId: number | null) => {
    if (!roomId) return "Aucune préférence";
    const room = rooms.find(r => r.id === roomId);
    return room?.name || `Chambre ${roomId}`;
  };

  const parseAnimals = (animalsString: string) => {
    try {
      return JSON.parse(animalsString);
    } catch {
      return [];
    }
  };

  const filteredReservations = useMemo(() => {
    return reservations.sort((a, b) => {
      // Sort by status (pending first) then by creation date
      const statusOrder = { pending: 0, confirmed: 1, cancelled: 2 };
      const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
      const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
      
      if (aOrder !== bOrder) return aOrder - bOrder;
      
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [reservations]);

  const handleStatusChange = (status: string) => {
    if (selectedReservation) {
      updateStatusMutation.mutate({ id: selectedReservation.id, status });
    }
  };

  const openReservationDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/paradise-management">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="font-heading font-bold text-xl">Gestion des Réservations</h1>
                <p className="text-sm text-secondary">Administration Pet Paradise</p>
              </div>
            </div>
            
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Voir le site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">Réservations</h1>
          <p className="text-secondary">Gérez les demandes et confirmations de séjour</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredReservations.length === 0 ? (
              <Card className="bg-white border-none shadow-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
                  <h3 className="font-heading text-lg mb-2">Aucune réservation</h3>
                  <p className="text-secondary">Les nouvelles demandes de réservation apparaîtront ici.</p>
                </CardContent>
              </Card>
            ) : (
              filteredReservations.map((reservation) => {
                const animals = parseAnimals(reservation.animals);
                return (
                  <Card 
                    key={reservation.id} 
                    className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => openReservationDialog(reservation)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-lg">
                              {reservation.customerFirstName} {reservation.customerName}
                            </h3>
                            <p className="text-sm text-secondary">
                              Réservation #{reservation.id}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(reservation.status)}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-secondary" />
                          <span className="text-sm">
                            {format(new Date(reservation.startDate), "dd/MM/yyyy")} - {format(new Date(reservation.endDate), "dd/MM/yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-secondary" />
                          <span className="text-sm">{getRoomName(reservation.roomPreference)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-secondary" />
                          <span className="text-sm">
                            {reservation.numberOfAnimals} animal{reservation.numberOfAnimals > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {animals.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {animals.slice(0, 3).map((animal: any, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {animal.name} ({animal.type})
                            </Badge>
                          ))}
                          {animals.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{animals.length - 3} autre{animals.length - 3 > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-secondary">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            Créée le {reservation.createdAt ? format(new Date(reservation.createdAt), "dd/MM/yyyy à HH:mm", { locale: fr }) : 'N/A'}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          openReservationDialog(reservation);
                        }}>
                          Voir détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Reservation Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedReservation && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-heading text-xl">
                    Détails de la réservation #{selectedReservation.id}
                  </DialogTitle>
                  <DialogDescription>
                    Consultez et modifiez les informations de cette demande de séjour
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Status Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Statut de la réservation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-secondary mb-2">Statut actuel:</p>
                          {getStatusBadge(selectedReservation.status)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={selectedReservation.status}
                            onValueChange={handleStatusChange}
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="confirmed">Confirmée</SelectItem>
                              <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                          </Select>
                          {updateStatusMutation.isPending && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informations client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-secondary" />
                          <span className="font-medium">{selectedReservation.customerFirstName} {selectedReservation.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-secondary" />
                          <span>{selectedReservation.customerEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-secondary" />
                          <span>{selectedReservation.customerPhone || 'Non renseigné'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-secondary" />
                          <span>{selectedReservation.customerAddress || 'Adresse non renseignée'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Booking Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Détails du séjour</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-secondary">Dates de séjour</p>
                          <p className="font-medium">
                            Du {format(new Date(selectedReservation.startDate), "dd/MM/yyyy")} au {format(new Date(selectedReservation.endDate), "dd/MM/yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary">Préférence de chambre</p>
                          <p className="font-medium">{getRoomName(selectedReservation.roomPreference)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary">Nombre d'animaux</p>
                          <p className="font-medium">{selectedReservation.numberOfAnimals}</p>
                        </div>
                        <div>
                          <p className="text-sm text-secondary">Date de création</p>
                          <p className="font-medium">
                            {selectedReservation.createdAt ? format(new Date(selectedReservation.createdAt), "dd/MM/yyyy à HH:mm", { locale: fr }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Animals Information */}
                  {(() => {
                    const animals = parseAnimals(selectedReservation.animals);
                    return animals.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Informations des animaux</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {animals.map((animal: any, index: number) => (
                              <div key={index}>
                                {index > 0 && <Separator />}
                                <div className="grid md:grid-cols-3 gap-4 py-3">
                                  <div>
                                    <p className="text-sm text-secondary">Nom</p>
                                    <p className="font-medium">{animal.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-secondary">Type et sexe</p>
                                    <p className="font-medium">{animal.type} - {animal.sex}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-secondary">Services</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {animal.services?.length > 0 ? (
                                        animal.services.map((service: string, serviceIndex: number) => (
                                          <Badge key={serviceIndex} variant="outline" className="text-xs">
                                            {service}
                                          </Badge>
                                        ))
                                      ) : (
                                        <span className="text-xs text-secondary">Aucun service</span>
                                      )}
                                    </div>
                                  </div>
                                  {animal.comment && (
                                    <div className="md:col-span-3">
                                      <p className="text-sm text-secondary">Commentaire</p>
                                      <p className="text-sm">{animal.comment}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}