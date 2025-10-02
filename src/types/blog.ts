export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  
  // Métadonnées SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl?: string;
    ogImage?: string;
    schema?: any; // JSON-LD structured data
  };
  
  // Catégorisation
  category: BlogCategory;
  subcategory?: string;
  tags: string[];
  
  // Auteur et publication
  author: BlogAuthor;
  publishedAt: string;
  updatedAt?: string;
  status: 'draft' | 'published' | 'archived';
  
  // Engagement
  stats: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    readTime: number; // en minutes
  };
  
  // Contenu enrichi
  featuredImage?: string;
  gallery?: string[];
  video?: {
    url: string;
    thumbnail: string;
    duration: number;
  };
  
  // Lead generation
  leadMagnet?: {
    type: 'pdf' | 'calculator' | 'consultation' | 'quote';
    title: string;
    description: string;
    downloadUrl?: string;
  };
  
  // Ciblage professionnel
  targetAudience: ('particuliers' | 'professionnels' | 'entreprises' | 'startups')[];
  difficulty: 'débutant' | 'intermédiaire' | 'expert';
  
  // Monétisation
  isPremium: boolean;
  affiliateLinks?: Array<{
    text: string;
    url: string;
    commission: number;
  }>;
}

export type BlogCategoryType = 
  | 'assurance'
  | 'immobilier' 
  | 'finance'
  | 'e-commerce'
  | 'streaming'
  | 'gaming'
  | 'sport'
  | 'business'
  | 'tech'
  | 'lifestyle';

export interface BlogAuthor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  
  // Expertise multi-casquettes
  expertise: Array<{
    domain: string;
    level: 'débutant' | 'intermédiaire' | 'expert' | 'autorité';
    certifications?: string[];
    experience: string; // "5 ans", "10+ ans"
  }>;
  
  // Réseaux sociaux
  social: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    twitch?: string;
    instagram?: string;
    tiktok?: string;
  };
  
  // Crédibilité
  credentials: {
    licenses: string[]; // "Courtier agréé ORIAS", etc.
    certifications: string[];
    awards?: string[];
    publications?: string[];
  };
  
  // Stats auteur
  stats: {
    articlesPublished: number;
    totalViews: number;
    followers: number;
    rating: number;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  
  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  
  // Sous-catégories
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    keywords: string[];
  }>;
  
  // Ciblage
  targetKeywords: string[];
  competitorAnalysis?: Array<{
    competitor: string;
    strengths: string[];
    opportunities: string[];
  }>;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
    isVerified: boolean;
  };
  content: string;
  createdAt: string;
  likes: number;
  replies?: BlogComment[];
  isApproved: boolean;
}

export interface BlogNewsletter {
  id: string;
  email: string;
  name?: string;
  interests: BlogCategory[];
  subscribedAt: string;
  isActive: boolean;
  source: 'blog' | 'leadMagnet' | 'social' | 'referral';
}
