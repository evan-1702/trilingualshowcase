import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n";
import Navigation from "@/components/Navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Calendar, Tag, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";
import type { BlogPost } from "@shared/schema";

const locales = { fr, en: enUS, es };

export default function BlogPage() {
  const { language, t } = useLanguage();

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['/api/blog', { language }],
    queryFn: async () => {
      const response = await fetch(`/api/blog?language=${language}`);
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json() as Promise<BlogPost[]>;
    },
  });

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd MMMM yyyy', { locale: locales[language] });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength ? textContent.slice(0, maxLength) + '...' : textContent;
  };

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
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">{t('blog.title')}</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">{t('blog.subtitle')}</p>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Blog Posts Content */}
          {blogPosts.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-16 w-16 text-secondary mx-auto mb-4" />
                <p className="text-lg text-secondary">
                  {t('blog.noArticles')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  formatDate={formatDate}
                  truncateContent={truncateContent}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface BlogPostCardProps {
  post: BlogPost;
  formatDate: (date: string | Date) => string;
  truncateContent: (content: string, maxLength?: number) => string;
  t: (key: keyof import("@/lib/i18n").Translations) => string;
}

function BlogPostCard({ post, formatDate, truncateContent, t }: BlogPostCardProps) {
  const tags = post.tags ? post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 text-sm text-secondary mb-2">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(post.publishedAt || post.createdAt || new Date())}</span>
          {post.category && (
            <>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
            </>
          )}
        </div>
        <CardTitle className="text-xl font-bold text-primary line-clamp-2 font-quicksand">
          {post.title}
        </CardTitle>
        {post.excerpt && (
          <CardDescription className="text-secondary font-nunito">
            {truncateContent(post.excerpt, 120)}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <p className="text-secondary leading-relaxed font-nunito">
            {truncateContent(post.content, 150)}
          </p>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <Tag className="h-3 w-3 text-secondary mr-1 mt-1" />
              {tags.slice(0, 3).map((tag: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-2 py-1 text-secondary border-secondary/30"
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-secondary">+{tags.length - 3}</span>
              )}
            </div>
          )}
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full mt-4">
                {t('blog.readMore')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary mb-2">
                  {post.title}
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.publishedAt || post.createdAt || new Date())}</span>
                      {post.category && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                        </>
                      )}
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-lg text-secondary font-medium border-l-4 border-accent pl-4 italic">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="prose prose-lg max-w-none text-secondary">
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="pt-4 border-t">
                        <div className="flex flex-wrap gap-2">
                          <Tag className="h-4 w-4 text-secondary mr-2 mt-1" />
                          {tags.map((tag: string, index: number) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-sm px-3 py-1 text-secondary border-secondary/30"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}