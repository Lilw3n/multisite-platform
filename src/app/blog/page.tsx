'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MobileBlog from '@/components/mobile/MobileBlog';
import { BlogService } from '@/lib/blogService';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  User,
  Calendar,
  Tag,
  TrendingUp,
  Flame,
  Star,
  ArrowRight
} from 'lucide-react';

export default function BlogPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState(BlogService.getCategories());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<string>('');
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const postSlug = searchParams?.get('post');
    if (postSlug) {
      setSelectedPost(postSlug);
    }
  }, [searchParams]);

  useEffect(() => {
    loadPosts();
  }, [activeCategory, searchQuery]);

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
      month: 'long',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '📝';
  };

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      'assurance': 'bg-blue-100 text-blue-700 border-blue-200',
      'immobilier': 'bg-green-100 text-green-700 border-green-200',
      'finance': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'e-commerce': 'bg-purple-100 text-purple-700 border-purple-200',
      'streaming': 'bg-red-100 text-red-700 border-red-200',
      'gaming': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'sport': 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[categoryId as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Version mobile
  if (isMobile) {
    return (
      <MobileBlog 
        selectedPost={selectedPost}
        onPostSelect={setSelectedPost}
      />
    );
  }

  // Version desktop
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blog DiddyHome
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conseils d'expert en assurance, immobilier, finance et bien plus. 
              Découvrez les secrets d'un professionnel multi-casquettes pour réussir vos projets.
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher des articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Catégories */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>Tous les articles</span>
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors ${
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
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles principaux */}
          <div className="lg:col-span-2">
            {/* Article featured */}
            {posts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span>Article à la une</span>
                </h2>
                
                <Link href={`/blog/${posts[0].slug}`} className="group block">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <span className="text-white text-6xl">{getCategoryIcon(posts[0].category.id)}</span>
                      </div>
                      <div className="absolute top-6 left-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(posts[0].category.id)}`}>
                          {categories.find(c => c.id === posts[0].category.id)?.name}
                        </span>
                      </div>
                      <div className="absolute bottom-6 right-6 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {formatReadTime(posts[0].stats.readTime)}
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {posts[0].title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {posts[0].excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{posts[0].author.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(posts[0].publishedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{formatNumber(posts[0].stats.views)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-blue-600 font-medium group-hover:text-blue-700">
                          <span>Lire l'article</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Liste des autres articles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activeCategory === 'all' ? 'Derniers articles' : categories.find(c => c.id === activeCategory)?.name}
              </h2>
              
              <div className="space-y-6">
                {posts.slice(1).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                      <div className="p-6">
                        <div className="flex items-start space-x-6">
                          <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex-shrink-0 flex items-center justify-center">
                            <span className="text-3xl">{getCategoryIcon(post.category.id)}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(post.category.id)}`}>
                                {categories.find(c => c.id === post.category.id)?.name}
                              </span>
                              {post.targetAudience.includes('professionnels') && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-sm font-medium">
                                  Professionnel
                                </span>
                              )}
                              {post.targetAudience.includes('particuliers') && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-sm font-medium">
                                  Particulier
                                </span>
                              )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatReadTime(post.stats.readTime)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{formatNumber(post.stats.views)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{formatNumber(post.stats.likes)}</span>
                                </div>
                              </div>
                              
                              <span className="text-sm text-gray-500">
                                {formatDate(post.publishedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Articles populaires */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>Articles populaires</span>
              </h3>
              
              <div className="space-y-4">
                {BlogService.getPopularPosts(5).map((post, index) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <div className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatNumber(post.stats.views)} vues
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Catégories */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Catégories</h3>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {BlogService.getPostsByCategory(category.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Newsletter DiddyHome</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Recevez nos meilleurs conseils directement dans votre boîte mail
              </p>
              
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  S'abonner gratuitement
                </button>
              </div>
              
              <p className="text-xs text-blue-200 mt-3">
                Pas de spam, désinscription en 1 clic
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
