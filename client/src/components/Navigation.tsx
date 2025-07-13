import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t('nav.home') },
    { href: "/rooms", label: t('nav.rooms') },
    { href: "/pricing", label: t('nav.pricing') },
    { href: "/faq", label: t('nav.faq') },
    { href: "/blog", label: t('nav.blog') },
    { href: "/contact", label: t('nav.contact') },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="glass-effect border-b border-secondary/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
              <Heart className="text-primary-bg text-lg" fill="currentColor" />
            </div>
            <span className="font-heading font-bold text-xl lg:text-2xl text-primary-text">Pet Paradise</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  isActiveLink(item.href) 
                    ? "text-accent" 
                    : "text-foreground hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/reservations">
              <Button className="bg-accent text-primary-bg hover:bg-accent/90 font-cta font-medium rounded-full px-6">
                {t('nav.reserve')}
              </Button>
            </Link>
          </div>
          
          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-primary-bg">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 font-medium transition-colors rounded-lg ${
                        isActiveLink(item.href)
                          ? "bg-accent/10 text-accent"
                          : "hover:bg-accent/10 hover:text-accent"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/reservations" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-accent text-primary-bg hover:bg-accent/90 font-cta font-medium rounded-lg">
                      {t('nav.reserve')}
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
