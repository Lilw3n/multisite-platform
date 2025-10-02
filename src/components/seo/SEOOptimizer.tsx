'use client';

import React from 'react';
import Head from 'next/head';

interface SEOOptimizerProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  jsonLd?: any;
  noIndex?: boolean;
  locale?: string;
  alternateUrls?: { [key: string]: string };
}

export default function SEOOptimizer({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/og-default.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  jsonLd,
  noIndex = false,
  locale = 'fr_FR',
  alternateUrls = {}
}: SEOOptimizerProps) {
  
  const fullTitle = title.includes('DiddyHome') ? title : `${title} | DiddyHome - Plateforme Multisite Professionnelle`;
  const keywordsString = keywords.length > 0 ? keywords.join(', ') : 
    'DiddyHome, plateforme multisite, VTC, taxi, assurance professionnelle, communauté, formation, marketplace';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content="DiddyHome" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="fr" />
      <meta property="og:locale" content={locale} />
      
      {/* Alternate URLs for different languages/regions */}
      {Object.entries(alternateUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="DiddyHome" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@DiddyHome" />
      <meta name="twitter:creator" content="@DiddyHome" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="application-name" content="DiddyHome" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}

// Fonctions utilitaires pour générer du JSON-LD
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DiddyHome",
  "description": "Plateforme multisite connectée pour professionnels - Assurance, Communauté, Formation, Marketplace",
  "url": "https://diddyhome.fr",
  "logo": "https://diddyhome.fr/logo.png",
  "sameAs": [
    "https://www.facebook.com/DiddyHome",
    "https://www.linkedin.com/company/diddyhome",
    "https://twitter.com/DiddyHome"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+33-6-95-82-08-66",
    "contactType": "customer service",
    "availableLanguage": "French"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "15 Rue Pierre Curie",
    "addressLocality": "Varangéville",
    "postalCode": "54110",
    "addressCountry": "FR"
  }
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "DiddyHome",
  "url": "https://diddyhome.fr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://diddyhome.fr/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const generateServiceSchema = (service: {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
  serviceType: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": service.provider
  },
  "areaServed": service.areaServed,
  "serviceType": service.serviceType,
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services DiddyHome",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.name
        }
      }
    ]
  }
});

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "DiddyHome",
    "logo": {
      "@type": "ImageObject",
      "url": "https://diddyhome.fr/logo.png"
    }
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "image": article.image,
  "url": article.url
});

export const generateProductSchema = (product: {
  name: string;
  description: string;
  price: number;
  currency: string;
  availability: string;
  rating?: number;
  reviewCount?: number;
  brand?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "brand": {
    "@type": "Brand",
    "name": product.brand || "DiddyHome"
  },
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": product.currency,
    "availability": `https://schema.org/${product.availability}`,
    "seller": {
      "@type": "Organization",
      "name": "DiddyHome"
    }
  },
  ...(product.rating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 1
    }
  }),
  ...(product.image && { "image": product.image })
});

// Hook pour l'analytics et le tracking
export const useAnalytics = () => {
  const trackEvent = (eventName: string, properties: any = {}) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      });
    }
    
    // Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventName, properties);
    }
    
    // Custom analytics
    console.log('Analytics Event:', eventName, properties);
  };

  const trackPageView = (url: string, title: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: url
      });
    }
  };

  const trackConversion = (conversionType: string, value?: number) => {
    trackEvent('conversion', {
      conversion_type: conversionType,
      value: value,
      currency: 'EUR'
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackConversion
  };
};
