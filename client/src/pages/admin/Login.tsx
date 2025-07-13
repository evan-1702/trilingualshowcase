import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => apiRequest("POST", "/api/admin/login", data),
    onSuccess: () => {
      toast({
        title: t('common.success'),
        description: "Connexion réussie",
      });
      // In a real app, you'd store the auth token
      localStorage.setItem('pet-paradise-admin', 'true');
      setLocation("/paradise-management/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || "Identifiants incorrects",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary-bg text-2xl" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-primary-text">Pet Paradise</h1>
          <p className="text-secondary">Administration</p>
        </div>

        <Card className="bg-white shadow-lg border-none">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-center">{t('admin.login.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.login.username')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-secondary" />
                          <Input {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.login.password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-secondary" />
                          <Input {...field} type="password" className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-accent text-primary-bg hover:bg-accent/90 font-cta font-medium"
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-bg mr-2"></div>
                      Connexion...
                    </div>
                  ) : (
                    t('admin.login.submit')
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-secondary">
              <p>Compte de test :</p>
              <p>Utilisateur : <code className="bg-primary-bg px-1 rounded">admin</code></p>
              <p>Mot de passe : <code className="bg-primary-bg px-1 rounded">admin123</code></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
