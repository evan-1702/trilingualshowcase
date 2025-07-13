import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus, Edit, Trash2, Home, ArrowLeft, Calendar as CalendarIcon, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { insertCustomMessageSchema } from "@shared/schema";
import type { CustomMessage } from "@shared/schema";

export default function AdminMessages() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [editingMessage, setEditingMessage] = useState<CustomMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    const isAdmin = localStorage.getItem('pet-paradise-admin');
    if (!isAdmin) {
      setLocation("/paradise-management");
    }
  }, [setLocation]);

  const { data: messages } = useQuery<CustomMessage[]>({
    queryKey: ['/api/admin/custom-messages'],
  });

  const form = useForm({
    resolver: zodResolver(insertCustomMessageSchema),
    defaultValues: {
      title: "",
      content: "",
      startDate: "",
      endDate: "",
      isActive: true,
    },
  });

  // Mutations
  const createMessageMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/custom-messages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/custom-messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/custom-messages'] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Succès", description: "Message créé" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const updateMessageMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest("PUT", `/api/admin/custom-messages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/custom-messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/custom-messages'] });
      setIsDialogOpen(false);
      setEditingMessage(null);
      form.reset();
      toast({ title: "Succès", description: "Message modifié" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/custom-messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/custom-messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/custom-messages'] });
      toast({ title: "Succès", description: "Message supprimé" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const handleEditMessage = (message: CustomMessage) => {
    setEditingMessage(message);
    form.reset({
      title: message.title,
      content: message.content,
      startDate: message.startDate,
      endDate: message.endDate,
      isActive: message.isActive,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingMessage) {
      updateMessageMutation.mutate({ id: editingMessage.id, data });
    } else {
      createMessageMutation.mutate(data);
    }
  };

  const isMessageActive = (message: CustomMessage) => {
    if (!message.isActive) return false;
    
    const now = new Date().toISOString().split('T')[0];
    return message.startDate <= now && message.endDate >= now;
  };

  const isMessageScheduled = (message: CustomMessage) => {
    const now = new Date().toISOString().split('T')[0];
    return message.isActive && message.startDate > now;
  };

  const isMessageExpired = (message: CustomMessage) => {
    const now = new Date().toISOString().split('T')[0];
    return message.endDate < now;
  };

  const getMessageStatus = (message: CustomMessage) => {
    if (!message.isActive) return { label: "Inactif", variant: "secondary" as const };
    if (isMessageActive(message)) return { label: "Actif", variant: "default" as const };
    if (isMessageScheduled(message)) return { label: "Programmé", variant: "outline" as const };
    if (isMessageExpired(message)) return { label: "Expiré", variant: "destructive" as const };
    return { label: "Inconnu", variant: "secondary" as const };
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
                <h1 className="font-heading font-bold text-xl">{t('admin.messages.title')}</h1>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-2">Messages personnalisés</h2>
            <p className="text-secondary">Gérez les messages affichés sur la page d'accueil</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-accent text-primary-bg hover:bg-accent/90"
                onClick={() => {
                  setEditingMessage(null);
                  form.reset();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMessage ? "Modifier le message" : "Créer un message"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre du message</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="🌟 Réservations d'été ouvertes !" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenu du message</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4}
                            placeholder="Anticipez vos vacances d'été ! Réservez dès maintenant..."
                          />
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
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Message actif</FormLabel>
                          <div className="text-sm text-secondary">
                            Le message sera visible sur le site selon la période définie
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-primary-bg hover:bg-accent/90"
                    disabled={createMessageMutation.isPending || updateMessageMutation.isPending}
                  >
                    {editingMessage ? "Modifier le message" : "Créer le message"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <MessageSquare className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Les messages actifs apparaissent automatiquement sur la page d'accueil pendant leur période de validité.
            Vous pouvez créer des messages à l'avance qui s'activeront automatiquement.
          </AlertDescription>
        </Alert>

        {/* Messages List */}
        <div className="space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((message) => {
              const status = getMessageStatus(message);
              
              return (
                <Card key={message.id} className="bg-white border-none shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="font-heading text-lg">{message.title}</CardTitle>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <p className="text-secondary text-sm mb-3">{message.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-secondary">
                          <span>Du {format(new Date(message.startDate), "dd/MM/yyyy")}</span>
                          <span>au {format(new Date(message.endDate), "dd/MM/yyyy")}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditMessage(message)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMessageMutation.mutate(message.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })
          ) : (
            <Card className="bg-white border-none shadow-lg">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">Aucun message personnalisé</h3>
                <p className="text-secondary mb-4">
                  Créez votre premier message pour informer vos clients des offres spéciales,
                  des nouveautés ou des informations importantes.
                </p>
                <Button 
                  className="bg-accent text-primary-bg hover:bg-accent/90"
                  onClick={() => {
                    setEditingMessage(null);
                    form.reset();
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un message
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
