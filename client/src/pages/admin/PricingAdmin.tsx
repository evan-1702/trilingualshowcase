import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Home, ArrowLeft, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { insertRoomPricingSchema, insertServicePricingSchema } from "@shared/schema";
import type { Room, RoomPricing, ServicePricing } from "@shared/schema";

export default function AdminPricing() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [editingRoomPricing, setEditingRoomPricing] = useState<RoomPricing | null>(null);
  const [editingServicePricing, setEditingServicePricing] = useState<ServicePricing | null>(null);
  const [isRoomPricingOpen, setIsRoomPricingOpen] = useState(false);
  const [isServicePricingOpen, setIsServicePricingOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    const isAdmin = localStorage.getItem('pet-paradise-admin');
    if (!isAdmin) {
      setLocation("/paradise-management");
    }
  }, [setLocation]);

  const { data: rooms } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  const { data: roomsWithPricing } = useQuery<(Room & { pricing: RoomPricing[] })[]>({
    queryKey: ['/api/admin/room-pricing'],
  });

  const { data: servicePricing } = useQuery<ServicePricing[]>({
    queryKey: ['/api/admin/service-pricing'],
  });

  // Room Pricing Form
  const roomPricingForm = useForm({
    resolver: zodResolver(insertRoomPricingSchema),
    defaultValues: {
      roomId: 0,
      serviceName: "",
      price: "",
    },
  });

  // Service Pricing Form
  const servicePricingForm = useForm({
    resolver: zodResolver(insertServicePricingSchema),
    defaultValues: {
      serviceName: "",
      description: "",
      price: "",
    },
  });

  // Mutations
  const createRoomPricingMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/room-pricing", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/room-pricing'] });
      setIsRoomPricingOpen(false);
      roomPricingForm.reset();
      toast({ title: "Succès", description: "Tarif de chambre créé" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const updateRoomPricingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PUT", `/api/admin/room-pricing/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/room-pricing'] });
      setIsRoomPricingOpen(false);
      setEditingRoomPricing(null);
      roomPricingForm.reset();
      toast({ title: "Succès", description: "Tarif de chambre modifié" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteRoomPricingMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/room-pricing/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/room-pricing'] });
      toast({ title: "Succès", description: "Tarif de chambre supprimé" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const createServicePricingMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/service-pricing", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/service-pricing'] });
      setIsServicePricingOpen(false);
      servicePricingForm.reset();
      toast({ title: "Succès", description: "Service créé" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const updateServicePricingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PUT", `/api/admin/service-pricing/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/service-pricing'] });
      setIsServicePricingOpen(false);
      setEditingServicePricing(null);
      servicePricingForm.reset();
      toast({ title: "Succès", description: "Service modifié" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteServicePricingMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/service-pricing/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/service-pricing'] });
      toast({ title: "Succès", description: "Service supprimé" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const handleEditRoomPricing = (pricing: RoomPricing) => {
    setEditingRoomPricing(pricing);
    roomPricingForm.reset({
      roomId: pricing.roomId,
      serviceName: pricing.serviceName,
      price: pricing.price,
    });
    setIsRoomPricingOpen(true);
  };

  const handleEditServicePricing = (pricing: ServicePricing) => {
    setEditingServicePricing(pricing);
    servicePricingForm.reset({
      serviceName: pricing.serviceName,
      description: pricing.description || "",
      price: pricing.price,
    });
    setIsServicePricingOpen(true);
  };

  const onSubmitRoomPricing = (data: any) => {
    if (editingRoomPricing) {
      updateRoomPricingMutation.mutate({ id: editingRoomPricing.id, data });
    } else {
      createRoomPricingMutation.mutate(data);
    }
  };

  const onSubmitServicePricing = (data: any) => {
    if (editingServicePricing) {
      updateServicePricingMutation.mutate({ id: editingServicePricing.id, data });
    } else {
      createServicePricingMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/paradise-management/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="font-heading font-bold text-xl">{t('admin.pricing.title')}</h1>
              </div>
            </div>
            
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Site public
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rooms">Tarifs des chambres</TabsTrigger>
            <TabsTrigger value="services">Services optionnels</TabsTrigger>
          </TabsList>

          {/* Room Pricing Tab */}
          <TabsContent value="rooms">
            <Card className="bg-white border-none shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-heading text-xl">Tarifs des chambres</CardTitle>
                  <Dialog open={isRoomPricingOpen} onOpenChange={setIsRoomPricingOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-accent text-primary-bg hover:bg-accent/90"
                        onClick={() => {
                          setEditingRoomPricing(null);
                          roomPricingForm.reset();
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un tarif
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingRoomPricing ? "Modifier le tarif" : "Ajouter un tarif"}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...roomPricingForm}>
                        <form onSubmit={roomPricingForm.handleSubmit(onSubmitRoomPricing)} className="space-y-4">
                          <FormField
                            control={roomPricingForm.control}
                            name="roomId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Chambre</FormLabel>
                                <FormControl>
                                  <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner une chambre..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {rooms?.map((room) => (
                                        <SelectItem key={room.id} value={room.id.toString()}>
                                          {room.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={roomPricingForm.control}
                            name="serviceName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Service</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="ex: Nuit simple, Week-end..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={roomPricingForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prix (€)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" step="0.01" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-accent text-primary-bg hover:bg-accent/90"
                            disabled={createRoomPricingMutation.isPending || updateRoomPricingMutation.isPending}
                          >
                            {editingRoomPricing ? "Modifier" : "Ajouter"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {roomsWithPricing && roomsWithPricing.length > 0 ? (
                  <div className="space-y-6">
                    {roomsWithPricing.map((room) => (
                      <div key={room.id}>
                        <h3 className="font-heading font-semibold text-lg mb-3">{room.name}</h3>
                        {room.pricing && room.pricing.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead>Prix</TableHead>
                                <TableHead className="w-24">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {room.pricing.map((pricing) => (
                                <TableRow key={pricing.id}>
                                  <TableCell>{pricing.service_name || pricing.serviceName}</TableCell>
                                  <TableCell className="font-semibold">{pricing.price}€</TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEditRoomPricing(pricing)}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteRoomPricingMutation.mutate(pricing.id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p className="text-secondary text-sm">Aucun tarif défini pour cette chambre</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary text-center py-8">Aucun tarif de chambre configuré</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Pricing Tab */}
          <TabsContent value="services">
            <Card className="bg-white border-none shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-heading text-xl">Services optionnels</CardTitle>
                  <Dialog open={isServicePricingOpen} onOpenChange={setIsServicePricingOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-accent text-primary-bg hover:bg-accent/90"
                        onClick={() => {
                          setEditingServicePricing(null);
                          servicePricingForm.reset();
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingServicePricing ? "Modifier le service" : "Ajouter un service"}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...servicePricingForm}>
                        <form onSubmit={servicePricingForm.handleSubmit(onSubmitServicePricing)} className="space-y-4">
                          <FormField
                            control={servicePricingForm.control}
                            name="serviceName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom du service</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="ex: Promenade supplémentaire..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={servicePricingForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={3} placeholder="Description du service..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={servicePricingForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prix (€)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" step="0.01" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-accent text-primary-bg hover:bg-accent/90"
                            disabled={createServicePricingMutation.isPending || updateServicePricingMutation.isPending}
                          >
                            {editingServicePricing ? "Modifier" : "Ajouter"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {servicePricing && servicePricing.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {servicePricing.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.service_name || service.serviceName}</TableCell>
                          <TableCell className="text-secondary">{service.description || "-"}</TableCell>
                          <TableCell className="font-semibold">{service.price}€</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditServicePricing(service)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteServicePricingMutation.mutate(service.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-secondary text-center py-8">Aucun service optionnel configuré</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
