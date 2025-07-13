import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, Send, Plus, Trash2, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { insertContactMessageSchema } from "@shared/schema";

const contactFormSchema = insertContactMessageSchema.extend({
  animals: z.array(z.object({
    name: z.string().min(1, "Nom de l'animal requis"),
    type: z.string().min(1, "Type d'animal requis"),
    comment: z.string().optional(),
  })).min(0),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      name: "",
      firstName: "",
      phone: "",
      message: "",
      numberOfAnimals: 0,
      animals: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "animals",
  });

  const numberOfAnimals = form.watch("numberOfAnimals");

  // Update animals array when numberOfAnimals changes
  const updateAnimalsArray = (count: number) => {
    const currentCount = fields.length;
    
    if (count > currentCount) {
      // Add new animal fields
      for (let i = currentCount; i < count; i++) {
        append({ name: "", type: "", comment: "" });
      }
    } else if (count < currentCount) {
      // Remove excess animal fields
      for (let i = currentCount - 1; i >= count; i--) {
        remove(i);
      }
    }
  };

  // Watch for changes in numberOfAnimals
  useState(() => {
    updateAnimalsArray(numberOfAnimals);
  }, [numberOfAnimals]);

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => {
      const submitData = {
        ...data,
        animals: JSON.stringify(data.animals),
      };
      return apiRequest("POST", "/api/contact", submitData);
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: t('common.success'),
        description: t('contact.success'),
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || "Erreur lors de l'envoi du message",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md mx-4 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-heading font-bold text-2xl mb-4">Message envoyé !</h2>
              <p className="text-secondary mb-6">{t('contact.success')}</p>
              <Button 
                onClick={() => setIsSuccess(false)}
                className="bg-accent text-primary-bg hover:bg-accent/90"
              >
                Envoyer un autre message
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
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">{t('contact.title')}</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              
              {/* Manager Presentation */}
              <Card className="bg-white shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Rencontrez Marie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <img 
                      src="https://images.unsplash.com/photo-1559190394-df5a28aab5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                      alt="Marie, gérante de Pet Paradise"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-heading font-semibold mb-2">Marie Dubois</h3>
                      <p className="text-sm text-secondary mb-2">Gérante & Fondatrice</p>
                      <p className="text-sm text-secondary leading-relaxed">
                        Passionnée d'animaux depuis l'enfance, Marie vous accueille personnellement 
                        et veille au bien-être de chaque pensionnaire.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card className="bg-white shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Nos Coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-sm text-secondary">123 Rue des Animaux<br />75000 Paris, France</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-secondary">+33 1 23 45 67 89</p>
                      <p className="text-xs text-secondary">Ouvert 7j/7 • Urgences 24h/24</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-secondary">contact@petparadise.fr</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="bg-white shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Suivez-nous</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button size="icon" className="bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-110 transition-transform">
                      <Instagram className="w-5 h-5 text-white" />
                    </Button>
                    <Button size="icon" className="bg-blue-600 hover:scale-110 transition-transform">
                      <Facebook className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                  <p className="text-sm text-secondary mt-3">
                    Découvrez le quotidien de nos pensionnaires sur nos réseaux sociaux !
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="bg-white shadow-lg border-none">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Envoyez-nous un message</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.form.firstName')} *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.form.name')} *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.form.email')} *</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.form.phone')} *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.form.message')} *</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Number of Animals */}
                    <FormField
                      control={form.control}
                      name="numberOfAnimals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.form.animals.count')} *</FormLabel>
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
                                {[0, 1, 2, 3, 4, 5].map((num) => (
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
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Animal {index + 1}</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                remove(index);
                                form.setValue("numberOfAnimals", numberOfAnimals - 1);
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`animals.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('contact.form.animals.name')} *</FormLabel>
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
                                  <FormLabel>{t('contact.form.animals.type')} *</FormLabel>
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
                            name={`animals.${index}.comment`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('contact.form.animals.comment')}</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={2} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-accent text-primary-bg hover:bg-accent/90 font-cta font-medium"
                    >
                      {contactMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-bg mr-2"></div>
                          Envoi en cours...
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t('common.send')}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
