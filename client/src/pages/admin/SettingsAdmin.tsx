import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Home, Mail, Settings, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SiteSetting } from "@shared/schema";

export default function SettingsAdmin() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [siteEmail, setSiteEmail] = useState("");

  const { data: settings = [], isLoading } = useQuery<SiteSetting[]>({
    queryKey: ['/api/admin/settings'],
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await fetch(`/api/admin/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      if (!response.ok) throw new Error('Failed to update setting');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({ 
        title: "Succès", 
        description: "Paramètre mis à jour avec succès" 
      });
    },
    onError: () => {
      toast({ 
        title: "Erreur", 
        description: "Impossible de mettre à jour le paramètre",
        variant: "destructive"
      });
    }
  });

  // Find current site email setting
  const currentSiteEmail = settings.find(s => s.key === 'site_email')?.value || '';

  const handleUpdateSiteEmail = () => {
    if (!siteEmail.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une adresse email valide",
        variant: "destructive"
      });
      return;
    }

    updateSettingMutation.mutate({ key: 'site_email', value: siteEmail });
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
                <h1 className="font-heading font-bold text-xl">Paramètres du Site</h1>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">Configuration</h1>
          <p className="text-secondary">Gérez les paramètres globaux du site</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Email Configuration */}
            <Card className="bg-white border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-accent" />
                  <span>Configuration Email</span>
                </CardTitle>
                <CardDescription>
                  Configurez l'adresse email principale du site pour recevoir les notifications de réservations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="site-email">Adresse email du site</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        id="site-email"
                        type="email"
                        value={siteEmail || currentSiteEmail}
                        onChange={(e) => setSiteEmail(e.target.value)}
                        placeholder="contact@petparadise.com"
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleUpdateSiteEmail}
                        disabled={updateSettingMutation.isPending}
                      >
                        {updateSettingMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Sauvegarder"
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-secondary mt-1">
                      Cette adresse recevra une copie de toutes les demandes de réservation
                    </p>
                  </div>

                  {currentSiteEmail && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Email configuré :</strong> {currentSiteEmail}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-heading font-semibold text-lg">Configuration SMTP</h3>
                  
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Configuration SMTP requise :</strong> Pour que les emails fonctionnent, vous devez configurer vos identifiants SMTP d'Hostinger ou Infomaniak dans les variables d'environnement.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-medium text-amber-800 mb-2">Variables d'environnement à configurer :</h4>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-amber-700">SMTP_HOST:</span>
                        <span className="text-amber-600">smtp.hostinger.com ou mail.infomaniak.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">SMTP_PORT:</span>
                        <span className="text-amber-600">587 (TLS) ou 465 (SSL)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">SMTP_USER:</span>
                        <span className="text-amber-600">votre-email@domaine.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">SMTP_PASS:</span>
                        <span className="text-amber-600">votre-mot-de-passe-email</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">SMTP_SECURE:</span>
                        <span className="text-amber-600">true (pour port 465) ou false (pour port 587)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Fonctionnalités email activées :</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Confirmation automatique envoyée au client</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Notification admin pour chaque nouvelle demande</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Templates HTML responsives</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Settings */}
            <Card className="bg-white border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-accent" />
                  <span>Paramètres Généraux</span>
                </CardTitle>
                <CardDescription>
                  Autres paramètres de configuration du site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.length > 0 ? (
                    <div className="space-y-3">
                      {settings.map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{setting.key}</p>
                            <p className="text-sm text-secondary">{setting.description || 'Aucune description'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-mono bg-white px-2 py-1 rounded border">
                              {setting.value}
                            </p>
                            <p className="text-xs text-secondary mt-1">
                              Mis à jour : {setting.updatedAt ? new Date(setting.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary text-center py-4">Aucun paramètre configuré</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}