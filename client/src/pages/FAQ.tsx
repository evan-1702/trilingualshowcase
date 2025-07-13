import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n";
import Navigation from "@/components/Navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, HelpCircle } from "lucide-react";
import type { FaqItem } from "@shared/schema";

export default function FAQPage() {
  const { language, t } = useLanguage();

  const { data: faqItems = [], isLoading } = useQuery({
    queryKey: ['/api/faq', { language }],
    queryFn: async () => {
      const response = await fetch(`/api/faq?language=${language}`);
      if (!response.ok) throw new Error('Failed to fetch FAQ items');
      return response.json() as Promise<FaqItem[]>;
    },
  });

  // Group FAQ items by category
  const groupedFaqItems = faqItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  const categories = Object.keys(groupedFaqItems);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-lg text-secondary">{t('common.loading')}</p>
          </div>
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
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">{t('faq.title')}</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">{t('faq.subtitle')}</p>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FAQ Content */}
          {categories.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <HelpCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-4">Aucune question disponible</h3>
                <p className="text-secondary">
                  Aucune question fréquente n'est disponible pour le moment dans cette langue.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue={categories[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="text-sm font-medium"
                    >
                      {t(`faq.category.${category}` as keyof typeof t)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {categories.map((category) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-primary mb-2">
                        {t(`faq.category.${category}` as keyof typeof t)}
                      </h3>
                    </div>
                    
                    <Accordion type="single" collapsible className="space-y-4">
                      {groupedFaqItems[category]
                        ?.filter(item => item.isActive)
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                          <AccordionItem 
                            key={item.id} 
                            value={`item-${item.id}`}
                            className="border border-gray-200 rounded-lg px-6 py-2 bg-white shadow-sm hover:shadow-md transition-shadow"
                          >
                            <AccordionTrigger className="text-left font-semibold text-primary hover:text-accent">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 text-secondary">
                              <div 
                                className="prose prose-sm max-w-none text-secondary" 
                                dangerouslySetInnerHTML={{ __html: item.answer }} 
                              />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}