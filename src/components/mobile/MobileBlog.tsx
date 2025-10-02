'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogService } from '@/lib/blogService';
import { BlogPost } from '@/types/blog';
import { 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  ArrowLeft,
  User,
  Calendar,
  Tag,
  TrendingUp,
  Flame,
  Star,
  ChevronRight,
  Download,
  Play
} from 'lucide-react';

interface MobileBlogProps {
  selectedPost?: string;
  onPostSelect?: (postId: string) => void;
}

export default function MobileBlog({ selectedPost, onPostSelect }: MobileBlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState(BlogService.getCategories());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    loadPosts();
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (selectedPost) {
      const post = BlogService.getPostBySlug(selectedPost);
      setCurrentPost(post);
    }
  }, [selectedPost]);

  const loadPosts = () => {
    let loadedPosts = BlogService.loadPosts();
    
    if (activeCategory !== 'all') {
      loadedPosts = BlogService.getPostsByCategory(activeCategory);
    }
    
    if (searchQuery.trim()) {
      loadedPosts = BlogService.searchPosts(searchQuery);
    }
    
    setPosts(loadedPosts);
  };

  const formatReadTime = (minutes: number) => {
    return `${minutes} min de lecture`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '📝';
  };

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      'assurance': 'bg-blue-100 text-blue-700',
      'immobilier': 'bg-green-100 text-green-700',
      'finance': 'bg-yellow-100 text-yellow-700',
      'e-commerce': 'bg-purple-100 text-purple-700',
      'streaming': 'bg-red-100 text-red-700',
      'gaming': 'bg-indigo-100 text-indigo-700',
      'sport': 'bg-orange-100 text-orange-700'
    };
    return colors[categoryId as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  // Vue article complet
  if (currentPost) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header article */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentPost(null);
                onPostSelect?.('');
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bookmark className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenu article */}
        <div className="px-4 py-6">
          {/* Catégorie */}
          <div className="mb-4">
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(currentPost.category)}`}>
              <span>{getCategoryIcon(currentPost.category)}</span>
              <span>{categories.find(c => c.id === currentPost.category)?.name}</span>
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
            {currentPost.title}
          </h1>

          {/* Métadonnées */}
          <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{currentPost.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(currentPost.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatReadTime(currentPost.stats.readTime)}</span>
            </div>
          </div>

          {/* Image featured */}
          {currentPost.featuredImage && (
            <div className="mb-6 rounded-2xl overflow-hidden">
              <img
                src={currentPost.featuredImage}
                alt={currentPost.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Lead magnet */}
          {currentPost.leadMagnet && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{currentPost.leadMagnet.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{currentPost.leadMagnet.description}</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Télécharger gratuitement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contenu (version mobile optimisée) */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-4 text-base">
              {/* Rendu simplifié du markdown pour mobile */}
              {currentPost.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('#')) {
                  const level = paragraph.match(/^#+/)?.[0].length || 1;
                  const text = paragraph.replace(/^#+\s*/, '');
                  const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
                  
                  return (
                    <HeadingTag key={index} className="font-bold text-gray-900 mt-6 mb-3">
                      {text}
                    </HeadingTag>
                  );
                }
                
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                      <p className="font-semibold text-gray-900">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    </div>
                  );
                }
                
                return (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 mb-6">
            {currentPost.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Stats engagement */}
          <div className="flex items-center justify-between py-4 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1 text-gray-500">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{formatNumber(currentPost.stats.views)}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{formatNumber(currentPost.stats.likes)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm hover:bg-red-100 transition-colors">
                <Heart className="h-4 w-4" />
                <span>J'aime</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors">
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </button>
            </div>
          </div>

          {/* Auteur */}
          <div className="bg-gray-50 rounded-2xl p-4 mt-6">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {currentPost.author.avatar}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{currentPost.author.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{currentPost.author.title}</p>
                <p className="text-sm text-gray-700">{currentPost.author.bio}</p>
                
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <span>{currentPost.author.stats.articlesPublished} articles</span>
                  <span>{formatNumber(currentPost.author.stats.totalViews)} vues</span>
                  <span>⭐ {currentPost.author.stats.rating}/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Articles liés */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles similaires</h3>
            <div className="space-y-4">
              {BlogService.getRelatedPosts(currentPost.id, 3).map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  onClick={() => setCurrentPost(relatedPost)}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                      {relatedPost.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formatReadTime(relatedPost.stats.readTime)} • {formatNumber(relatedPost.stats.views)} vues
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue liste des articles
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Blog DiddyHome</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher des articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Catégories horizontales */}
          <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>Tous</span>
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtres étendus */}
        {showFilters && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {['Populaires', 'Récents', 'Tendances', 'Pour vous'].map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-1 bg-white text-gray-600 rounded-full text-sm whitespace-nowrap hover:bg-gray-100 transition-colors border"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Articles populaires (carrousel) */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">🔥 Populaires</h2>
          <Link href="/blog/popular" className="text-blue-600 text-sm font-medium">
            Voir tout
          </Link>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          {BlogService.getPopularPosts(5).map((post) => (
            <div
              key={post.id}
              onClick={() => {
                setCurrentPost(post);
                onPostSelect?.(post.slug);
              }}
              className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <span className="text-white text-4xl">{getCategoryIcon(post.category)}</span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {categories.find(c => c.id === post.category)?.name}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                  {formatReadTime(post.stats.readTime)}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-3 w-3" />
                    <span>{formatNumber(post.stats.views)}</span>
                  </div>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des articles */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeCategory === 'all' ? 'Tous les articles' : categories.find(c => c.id === activeCategory)?.name}
          </h2>
          <span className="text-sm text-gray-500">{posts.length} articles</span>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                setCurrentPost(post);
                onPostSelect?.(post.slug);
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all"
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">{getCategoryIcon(post.category)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                      {post.targetAudience.includes('professionnels') && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          Pro
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-xs line-clamp-2 mb-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatReadTime(post.stats.readTime)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{formatNumber(post.stats.views)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <span>{formatDate(post.publishedAt)}</span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `Aucun résultat pour "${searchQuery}"`
                : 'Aucun article dans cette catégorie'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
