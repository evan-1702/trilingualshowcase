import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Home, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { insertRoomScheduleSchema } from "@shared/schema";
import type { Room, RoomSchedule } from "@shared/schema";

export default function AdminSchedule() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingSchedule, setEditingSchedule] = useState<RoomSchedule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const { data: schedules } = useQuery<RoomSchedule[]>({
    queryKey: ['/api/admin/schedule'],
  });

  const form = useForm({
    resolver: zodResolver(insertRoomScheduleSchema),
    defaultValues: {
      roomId: 0,
      startDate: "",
      endDate: "",
      status: "occupied" as const,
      guestInfo: "",
    },
  });

  // Mutations
  const createScheduleMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/schedule", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/schedule'] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Succès", description: "Période ajoutée au planning" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PUT", `/api/admin/schedule/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/schedule'] });
      setIsDialogOpen(false);
      setEditingSchedule(null);
      form.reset();
      toast({ title: "Succès", description: "Planning modifié" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/schedule/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/schedule'] });
      toast({ title: "Succès", description: "Période supprimée du planning" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const handleEditSchedule = (schedule: RoomSchedule) => {
    setEditingSchedule(schedule);
    form.reset({
      roomId: schedule.roomId,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      status: schedule.status as "occupied" | "available" | "maintenance",
      guestInfo: schedule.guestInfo || "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingSchedule) {
      updateScheduleMutation.mutate({ id: editingSchedule.id, data });
    } else {
      createScheduleMutation.mutate(data);
    }
  };

  // Calendar navigation
  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Generate calendar data
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get schedule for a specific room and date
  const getScheduleForDay = (roomId: number, date: Date) => {
    return schedules?.find(schedule => 
      schedule.roomId === roomId &&
      date >= new Date(schedule.startDate) &&
      date <= new Date(schedule.endDate)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'Occupé';
      case 'maintenance':
        return 'Maintenance';
      case 'available':
        return 'Disponible';
      default:
        return status;
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
                <h1 className="font-heading font-bold text-xl">{t('admin.schedule.title')}</h1>
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
        
        {/* Calendar Header */}
        <Card className="mb-6 bg-white border-none shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="font-heading font-bold text-xl">
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </h2>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-accent text-primary-bg hover:bg-accent/90"
                    onClick={() => {
                      setEditingSchedule(null);
                      form.reset();
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter au planning
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSchedule ? "Modifier le planning" : "Ajouter au planning"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
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
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date de début</FormLabel>
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
                                          field.onChange(format(date, "yyyy-MM-dd"));
                                        }
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
                        
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date de fin</FormLabel>
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
                                          field.onChange(format(date, "yyyy-MM-dd"));
                                        }
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
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Statut</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="occupied">Occupé</SelectItem>
                                  <SelectItem value="maintenance">Maintenance</SelectItem>
                                  <SelectItem value="available">Disponible</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="guestInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Informations</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nom du client, notes..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-accent text-primary-bg hover:bg-accent/90"
                        disabled={createScheduleMutation.isPending || updateScheduleMutation.isPending}
                      >
                        {editingSchedule ? "Modifier" : "Ajouter"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar Grid */}
        <div className="grid gap-6">
          {rooms?.map((room) => (
            <Card key={room.id} className="bg-white border-none shadow-lg">
              <CardHeader>
                <CardTitle className="font-heading text-lg">{room.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {/* Calendar days */}
                  {calendarDays.map((day) => {
                    const schedule = getScheduleForDay(room.id, day);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <div
                        key={day.toString()}
                        className={`
                          aspect-square p-2 border rounded-lg text-center text-sm cursor-pointer transition-colors
                          ${isToday ? 'border-accent border-2' : 'border-gray-200'}
                          ${!isSameMonth(day, currentDate) ? 'text-gray-400 bg-gray-50' : ''}
                          ${schedule ? getStatusColor(schedule.status) : 'hover:bg-gray-50'}
                        `}
                        onClick={() => {
                          if (schedule) {
                            handleEditSchedule(schedule);
                          }
                        }}
                      >
                        <div className="font-medium">{format(day, 'd')}</div>
                        {schedule && (
                          <div className="mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(schedule.status)}`}
                            >
                              {getStatusLabel(schedule.status).slice(0, 3)}
                            </Badge>
                            {schedule.guestInfo && (
                              <div className="text-xs mt-1 truncate">
                                {schedule.guestInfo}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <Card className="mt-6 bg-white border-none shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Légende</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-100 text-red-800 border-red-200">Occupé</Badge>
                <span className="text-sm text-secondary">Chambre réservée</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Maintenance</Badge>
                <span className="text-sm text-secondary">Entretien/Réparation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">Disponible</Badge>
                <span className="text-sm text-secondary">Libre à la réservation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
