import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { insertReservationSchema } from "@shared/schema";
import type { Room, ServicePricing } from "@shared/schema";

const reservationFormSchema = insertReservationSchema.extend({
  customerPhone: z.string()
    .min(1, "Numéro de téléphone requis")
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Format de téléphone invalide (ex: 06 12 34 56 78)"),
  endDate: z.string().min(1, "Date de fin requise"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions générales de garde"
  }),
  animals: z.array(z.object({
    name: z.string().min(1, "Nom de l'animal requis"),
    type: z.string().min(1, "Type d'animal requis"),
    sex: z.string().min(1, "Sexe requis"),
    services: z.array(z.string()).optional(),
    comment: z.string().optional(),
  })).min(1, "Au moins un animal requis"),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) > new Date(data.startDate);
  }
  return true;
}, {
  message: "La date de départ doit être postérieure à la date d'arrivée",
  path: ["endDate"]
});

type ReservationFormData = z.infer<typeof reservationFormSchema>;

export default function ReservationsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Get URL parameters for pre-filling form
  const urlParams = new URLSearchParams(window.location.search);
  const prefilledStartDate = urlParams.get('startDate');
  const prefilledEndDate = urlParams.get('endDate');
  const prefilledRoomId = urlParams.get('roomId');

  const { data: allRooms } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  const { data: servicePricing } = useQuery<ServicePricing[]>({
    queryKey: ['/api/service-pricing'],
  });

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      customerName: "",
      customerFirstName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      startDate: prefilledStartDate || "",
      endDate: prefilledEndDate || "",
      numberOfAnimals: 1,
      roomPreference: prefilledRoomId ? parseInt(prefilledRoomId) : undefined,
      termsAccepted: false,
      animals: [{ name: "", type: "", sex: "", services: [], comment: "" }],
    },
  });

  // Effect to set initial availability check if dates are pre-filled
  useEffect(() => {
    if (prefilledStartDate && prefilledEndDate && allRooms) {
      checkAvailability(prefilledStartDate, prefilledEndDate);
    }
  }, [prefilledStartDate, prefilledEndDate, allRooms]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "animals",
  });

  const numberOfAnimals = form.watch("numberOfAnimals");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  // Update animals array when numberOfAnimals changes
  const updateAnimalsArray = (count: number) => {
    const currentCount = fields.length;
    
    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        append({ name: "", type: "", sex: "", services: [], comment: "" });
      }
    } else if (count < currentCount) {
      for (let i = currentCount - 1; i >= count; i--) {
        remove(i);
      }
    }
  };

  // Check availability when dates change
  const checkAvailability = async (start: string, end: string) => {
    if (!start || !end) {
      setAvailableRooms([]);
      return;
    }

    setIsCheckingAvailability(true);
    try {
      const response = await fetch("/api/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: start, endDate: end }),
      });
      
      if (response.ok) {
        const available = await response.json();
        setAvailableRooms(available);
      } else {
        setAvailableRooms([]);
      }
    } catch (error) {
      setAvailableRooms([]);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const reservationMutation = useMutation({
    mutationFn: (data: ReservationFormData) => {
      const submitData = {
        ...data,
        animals: JSON.stringify(data.animals),
      };
      return apiRequest("POST", "/api/reservations", submitData);
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: t('common.success'),
        description: t('reservations.success'),
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || "Erreur lors de la réservation",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReservationFormData) => {
    if (availableRooms.length === 0) {
      toast({
        title: t('common.error'),
        description: t('reservations.unavailable'),
        variant: "destructive",
      });
      return;
    }
    reservationMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md mx-4 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-heading font-bold text-2xl mb-4">Demande envoyée !</h2>
              <p className="text-secondary mb-6">{t('reservations.success')}</p>
              <Button 
                onClick={() => setIsSuccess(false)}
                className="bg-accent text-primary-bg hover:bg-accent/90"
              >
                Nouvelle réservation
              </Button>
            </CardContent>
          </Card>
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
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">{t('reservations.title')}</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">{t('reservations.subtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Room Gallery */}
          {allRooms && allRooms.length > 0 && (
            <Card className="mb-8 bg-white shadow-lg border-none">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Nos Chambres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {allRooms.map((room) => (
                    <div key={room.id} className="text-center">
                      <img 
                        src={room.images[0] || "https://images.unsplash.com/photo-1601758228041-f3b2795255f1"} 
                        alt={room.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <h3 className="font-heading font-medium text-sm">{room.name}</h3>
                      <p className="text-xs text-secondary">{room.surface}m²</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reservation Form */}
          <Card className="bg-white shadow-lg border-none">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Formulaire de demande de réservation</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Dates Section */}
                  <div className="space-y-4">
                    <h3 className="font-heading font-semibold text-lg">Dates de séjour</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('reservations.form.startDate')} *</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(new Date(field.value), "dd/MM/yyyy") : "Sélectionner..."}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => {
                                      if (date) {
                                        const dateStr = format(date, "yyyy-MM-dd");
                                        field.onChange(dateStr);
                                        if (endDate) {
                                          checkAvailability(dateStr, endDate);
                                        }
                                      }
                                    }}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('reservations.form.endDate')} *</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(new Date(field.value), "dd/MM/yyyy") : "Sélectionner..."}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => {
                                      if (date) {
                                        const dateStr = format(date, "yyyy-MM-dd");
                                        field.onChange(dateStr);
                                        if (startDate) {
                                          checkAvailability(startDate, dateStr);
                                        }
                                      }
                                    }}
                                    disabled={(date) => {
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      return date < today || (startDate && date <= new Date(startDate));
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Availability Status */}
                    {startDate && endDate && (
                      <div className="mt-4">
                        {isCheckingAvailability ? (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>Vérification de la disponibilité...</AlertDescription>
                          </Alert>
                        ) : availableRooms.length === 0 ? (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{t('reservations.unavailable')}</AlertDescription>
                          </Alert>
                        ) : (
                          <Alert className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              {availableRooms.length} chambre(s) disponible(s) pour ces dates
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="font-heading font-semibold text-lg">Vos informations</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="customerAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse complète *</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="06 12 34 56 78" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Information importante :</strong> Ces informations sont indispensables pour que nous vous recontactions pour finaliser votre demande de réservation.
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Room Preference */}
                  {availableRooms.length > 0 && (
                    <FormField
                      control={form.control}
                      name="roomPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('reservations.form.roomPreference')}</FormLabel>
                          <FormControl>
                            <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une chambre..." />
                              </SelectTrigger>
                              <SelectContent>
                                {availableRooms.map((room) => (
                                  <SelectItem key={room.id} value={room.id.toString()}>
                                    {room.name} ({room.surface}m²)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Number of Animals */}
                  <FormField
                    control={form.control}
                    name="numberOfAnimals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre d'animaux *</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value.toString()}
                            onValueChange={(value) => {
                              const count = parseInt(value);
                              field.onChange(count);
                              updateAnimalsArray(count);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Animal Details */}
                  {fields.map((field, index) => (
                    <Card key={field.id} className="bg-primary-bg/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Animal {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`animals.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom de l'animal *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`animals.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type d'animal *</FormLabel>
                                <FormControl>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="chien">Chien</SelectItem>
                                      <SelectItem value="chat">Chat</SelectItem>
                                      <SelectItem value="lapin">Lapin</SelectItem>
                                      <SelectItem value="oiseau">Oiseau</SelectItem>
                                      <SelectItem value="rongeur">Rongeur</SelectItem>
                                      <SelectItem value="autre">Autre</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`animals.${index}.sex`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sexe *</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="male">{t('reservations.form.animals.sex.male')}</SelectItem>
                                    <SelectItem value="male_neutered">{t('reservations.form.animals.sex.maleNeutered')}</SelectItem>
                                    <SelectItem value="female">{t('reservations.form.animals.sex.female')}</SelectItem>
                                    <SelectItem value="female_spayed">{t('reservations.form.animals.sex.femaleNeutered')}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Services */}
                        {servicePricing && servicePricing.length > 0 && (
                          <FormField
                            control={form.control}
                            name={`animals.${index}.services`}
                            render={() => (
                              <FormItem>
                                <FormLabel>Services optionnels</FormLabel>
                                <div className="grid md:grid-cols-2 gap-2">
                                  {servicePricing.map((service) => (
                                    <FormField
                                      key={service.id}
                                      control={form.control}
                                      name={`animals.${index}.services`}
                                      render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(service.serviceName)}
                                              onCheckedChange={(checked) => {
                                                const currentServices = field.value || [];
                                                if (checked) {
                                                  field.onChange([...currentServices, service.serviceName]);
                                                } else {
                                                  field.onChange(currentServices.filter(s => s !== service.serviceName));
                                                }
                                              }}
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-normal">
                                              {service.serviceName} ({service.price}€)
                                            </FormLabel>
                                            {service.description && (
                                              <p className="text-xs text-secondary">{service.description}</p>
                                            )}
                                          </div>
                                        </FormItem>
                                      )}
                                    />
                                  ))}
                                </div>
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name={`animals.${index}.comment`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Informations utiles sur l'animal</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={2} placeholder="Allergies, comportement, habitudes..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}

                  {/* Disclaimer */}
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      {t('reservations.disclaimer')}
                    </AlertDescription>
                  </Alert>

                  {/* Terms and Conditions */}
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            J'accepte les{" "}
                            <a 
                              href="/conditions-generales-garde.pdf" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-accent underline hover:text-accent/80"
                            >
                              conditions générales de garde
                            </a>{" "}
                            *
                          </FormLabel>
                          <p className="text-xs text-secondary">
                            Veuillez lire et accepter nos conditions générales pour finaliser votre demande.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={reservationMutation.isPending || availableRooms.length === 0}
                    className="w-full bg-accent text-primary-bg hover:bg-accent/90 font-cta font-medium"
                  >
                    {reservationMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-bg mr-2"></div>
                        Envoi en cours...
                      </div>
                    ) : (
                      "Envoyer la demande de réservation"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
