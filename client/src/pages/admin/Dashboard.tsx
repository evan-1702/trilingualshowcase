import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Calendar, Euro, MessageSquare, Users, Home, LogOut, HelpCircle, BookOpen, ArrowUpRight, ArrowDownLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n";
import type { Reservation, ContactMessage, Room } from "@shared/schema";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Check if user is authenticated
  useEffect(() => {
    const isAdmin = localStorage.getItem('pet-paradise-admin');
    if (!isAdmin) {
      setLocation("/paradise-management");
    }
  }, [setLocation]);

  const { data: reservations } = useQuery<Reservation[]>({
    queryKey: ['/api/admin/reservations'],
  });

  const { data: contactMessages } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/contact-messages'],
  });

  const { data: rooms } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  const handleLogout = () => {
    localStorage.removeItem('pet-paradise-admin');
    setLocation("/admin");
  };

  // Calculate arrivals and departures for selected date
  const calculateDayStats = () => {
    if (!reservations) return { arrivals: 0, departures: 0 };
    
    let arrivals = 0;
    let departures = 0;
    
    reservations.forEach(reservation => {
      if (reservation.startDate === selectedDate) {
        arrivals++;
      }
      if (reservation.endDate === selectedDate) {
        departures++;
      }
    });
    
    return { arrivals, departures };
  };

  const { arrivals, departures } = calculateDayStats();
  const today = new Date().toISOString().split('T')[0];
  const recentReservations = reservations?.slice(0, 5) || [];
  const recentMessages = contactMessages?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Home className="text-primary-bg" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl">Pet Paradise</h1>
                <p className="text-sm text-secondary">Administration</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={handleLogout} className="text-secondary">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">{t('admin.dashboard.title')}</h1>
          <p className="text-secondary">Vue d'ensemble de votre établissement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary">Réservations</p>
                  <p className="text-2xl font-bold">{reservations?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary">Messages</p>
                  <p className="text-2xl font-bold">{contactMessages?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-secondary font-medium">Mouvements du jour</CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Label htmlFor="date-selector" className="text-xs text-secondary">Date:</Label>
                <Input
                  id="date-selector"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <ArrowDownLeft className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary">Arrivées</p>
                    <p className="text-xl font-bold text-green-600">{arrivals}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <ArrowUpRight className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary">Départs</p>
                    <p className="text-xl font-bold text-orange-600">{departures}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary">Taux d'occupation</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Quick Actions */}
          <Card className="bg-white border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/paradise-management/reservations">
                <Button className="w-full justify-start bg-accent text-primary-bg hover:bg-accent/90">
                  <Calendar className="w-4 h-4 mr-2" />
                  Gestion des Réservations
                </Button>
              </Link>
              
              <Link href="/paradise-management/pricing">
                <Button className="w-full justify-start" variant="outline">
                  <Euro className="w-4 h-4 mr-2" />
                  {t('admin.pricing.title')}
                </Button>
              </Link>
              
              <Link href="/paradise-management/schedule">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('admin.schedule.title')}
                </Button>
              </Link>
              
              <Link href="/paradise-management/messages">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t('admin.messages.title')}
                </Button>
              </Link>
              
              <Link href="/paradise-management/faq">
                <Button className="w-full justify-start" variant="outline">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Gestion FAQ
                </Button>
              </Link>
              
              <Link href="/paradise-management/blog">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Gestion Blog
                </Button>
              </Link>
              
              <Link href="/paradise-management/settings">
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres du Site
                </Button>
              </Link>
              
              <Link href="/">
                <Button className="w-full justify-start" variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Voir le site public
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Activité récente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReservations.length > 0 ? (
                recentReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 bg-primary-bg/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        {reservation.customerFirstName} {reservation.customerName}
                      </p>
                      <p className="text-xs text-secondary">
                        {reservation.startDate} au {reservation.endDate}
                      </p>
                    </div>
                    <Badge variant="secondary">Réservation</Badge>
                  </div>
                ))
              ) : (
                <p className="text-secondary text-center py-4">Aucune activité récente</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Messages */}
        <Card className="bg-white border-none shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Messages récents</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="border-l-4 border-accent pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">
                        {message.firstName} {message.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {message.numberOfAnimals} animal{message.numberOfAnimals > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary mb-2">{message.email}</p>
                    <p className="text-sm">{message.message.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary text-center py-4">Aucun message récent</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
