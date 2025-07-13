import { useLanguage, type Language } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
  ];

  return (
    <div className="flex bg-white/50 rounded-full p-1">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          size="sm"
          variant={language === lang.code ? "default" : "ghost"}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            language === lang.code
              ? "bg-accent text-primary-bg"
              : "text-secondary hover:text-accent"
          }`}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
