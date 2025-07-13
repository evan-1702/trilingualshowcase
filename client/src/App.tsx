import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./lib/i18n";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Rooms from "@/pages/Rooms";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import Reservations from "@/pages/Reservations";
import FAQ from "@/pages/FAQ";
import Blog from "@/pages/Blog";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPricing from "@/pages/admin/PricingAdmin";
import AdminSchedule from "@/pages/admin/ScheduleAdmin";
import AdminMessages from "@/pages/admin/MessagesAdmin";
import AdminFaq from "@/pages/admin/FaqAdmin";
import AdminBlog from "@/pages/admin/BlogAdmin";
import AdminReservations from "@/pages/admin/ReservationsAdmin";
import AdminSettings from "@/pages/admin/SettingsAdmin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rooms" component={Rooms} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/contact" component={Contact} />
      <Route path="/reservations" component={Reservations} />
      <Route path="/faq" component={FAQ} />
      <Route path="/blog" component={Blog} />
      <Route path="/paradise-management" component={AdminLogin} />
      <Route path="/paradise-management/dashboard" component={AdminDashboard} />
      <Route path="/paradise-management/pricing" component={AdminPricing} />
      <Route path="/paradise-management/schedule" component={AdminSchedule} />
      <Route path="/paradise-management/messages" component={AdminMessages} />
      <Route path="/paradise-management/faq" component={AdminFaq} />
      <Route path="/paradise-management/blog" component={AdminBlog} />
      <Route path="/paradise-management/reservations" component={AdminReservations} />
      <Route path="/paradise-management/settings" component={AdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Router />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
