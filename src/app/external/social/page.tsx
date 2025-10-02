'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Users, TrendingUp, Star, MessageCircle, Search, Filter, Plus, Zap, Globe, Shield, ArrowRight, Car } from 'lucide-react';
import SocialFeed from '@/components/social/SocialFeed';
import MarketplaceFeed from '@/components/social/MarketplaceFeed';
import MatchingSystem from '@/components/social/MatchingSystem';

interface SocialStats {
  totalUsers: number;
  activeToday: number;
  totalPosts: number;
  totalMatches: number;
  totalServices: number;
  averageRating: number;
}

export default function SocialExternalPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'marketplace' | 'matching' | 'network'>('feed');
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<SocialStats | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      const role = localStorage.getItem('user_role');
      
      if (token && email && name) {
        setUser({ email, name, role });
      }
    }

    // Charger les statistiques
    setStats({
      totalUsers: 12847,
      activeToday: 1456,
      totalPosts: 8934,
      totalMatches: 2341,
      totalServices: 567,
      averageRating: 4.7
    });
  }, []);

  const handleLeadGenerated = (leadData: any) => {
    console.log('Lead généré:', leadData);
    if (!user) {
      setShowAuthModal(true);
    } else {
      // Traiter le lead pour utilisateur connecté
      alert(`Lead généré: ${leadData.leadMagnet.title}`);
    }
  };

  const handleMatch = (profileId: string, action: 'like' | 'pass') => {
    console.log('Match action:', profileId, action);
    if (!user) {
      setShowAuthModal(true);
    }
  };

  const handleSuperLike = (profileId: string) => {
    console.log('Super like:', profileId);
    if (!user) {
      setShowAuthModal(true);
    }
  };

  const handleMessage = (profileId: string) => {
    console.log('Message to:', profileId);
    if (!user) {
      setShowAuthModal(true);
    }
  };

  const handleContactProvider = (providerId: string, itemId: string) => {
    console.log('Contact provider:', providerId, itemId);
    if (!user) {
      setShowAuthModal(true);
    }
  };

  const handleBookService = (itemId: string) => {
    console.log('Book service:', itemId);
    if (!user) {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/external" className="flex items-center space-x-2">
              <div className="text-2xl">🏠</div>
              <span className="text-xl font-bold text-gray-900">DiddyHome</span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Social</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'feed' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Feed</span>
              </button>
              
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'marketplace' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Marketplace</span>
              </button>
              
              <button
                onClick={() => setActiveTab('matching')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'matching' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Matching</span>
              </button>
              
              <button
                onClick={() => setActiveTab('network')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'network' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Réseau</span>
              </button>
            </nav>

            {/* User actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <MessageCircle className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/external/login"
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/external/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Rejoindre
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            La communauté professionnelle 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              qui vous ressemble
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Connectez-vous, partagez, apprenez et développez votre activité avec des milliers de professionnels comme vous
          </p>
          
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-300">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-blue-200">Membres</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-300">{stats.activeToday.toLocaleString()}</div>
                <div className="text-sm text-blue-200">Actifs aujourd'hui</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-pink-300">{stats.totalPosts.toLocaleString()}</div>
                <div className="text-sm text-blue-200">Publications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-300">{stats.totalMatches.toLocaleString()}</div>
                <div className="text-sm text-blue-200">Connexions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-300">{stats.totalServices.toLocaleString()}</div>
                <div className="text-sm text-blue-200">Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-300">{stats.averageRating}</div>
                <div className="text-sm text-blue-200">Note moyenne</div>
              </div>
            </div>
          )}

          {!user && (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/external/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                🚀 Rejoindre gratuitement
              </Link>
              <Link
                href="/external/login"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Communities Overview */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rejoignez nos Communautés</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez des groupes spécialisés où vous pouvez échanger, apprendre et développer votre activité avec des professionnels comme vous.
          </p>
        </div>

        {/* Featured Communities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              id: 'pro-community',
              name: 'Communauté Pro',
              description: 'La plus grande communauté de professionnels connectés',
              members: 12847,
              posts: 8934,
              category: 'Professionnel',
              image: '🚗',
              trending: true,
              tags: ['#Pro', '#Communauté', '#Professionnel', '#Réseau'],
              href: '/external/social/hub/groups/VTC-Taxi'
            },
            {
              id: 'assurance-pro',
              name: 'Assurance Pro',
              description: 'Tout sur l\'assurance professionnelle',
              members: 8456,
              posts: 5672,
              category: 'Assurance',
              image: '🛡️',
              trending: true,
              tags: ['#Assurance', '#CRM', '#Économies', '#Conseils'],
              href: '/external/social/hub/groups/Assurance-Pro'
            },
            {
              id: 'formation-business',
              name: 'Formation & Business',
              description: 'Développez vos compétences et votre business',
              members: 6234,
              posts: 4123,
              category: 'Formation',
              image: '🎓',
              trending: false,
              tags: ['#Formation', '#Business', '#Entrepreneur', '#Skills'],
              href: '/external/social/hub/groups/Formation-Business'
            },
            {
              id: 'marketplace-deals',
              name: 'Marketplace & Deals',
              description: 'Les meilleures offres et services pour pros',
              members: 9876,
              posts: 6789,
              category: 'Commerce',
              image: '🛍️',
              trending: true,
              tags: ['#Deals', '#Services', '#Équipement', '#Partenaires'],
              href: '/external/social/hub/groups/Marketplace-Deals'
            },
            {
              id: 'tech-innovation',
              name: 'Tech & Innovation',
              description: 'Les dernières innovations du secteur',
              members: 4567,
              posts: 3456,
              category: 'Technologie',
              image: '🚀',
              trending: false,
              tags: ['#Tech', '#Innovation', '#Apps', '#Digital'],
              href: '/external/social/hub/groups/Tech-Innovation'
            },
            {
              id: 'networking-events',
              name: 'Networking & Events',
              description: 'Événements, rencontres et networking pro',
              members: 7890,
              posts: 2345,
              category: 'Événements',
              image: '🤝',
              trending: false,
              tags: ['#Networking', '#Events', '#Rencontres', '#Pro'],
              href: '/external/social/hub/groups/Networking-Events'
            }
          ].map((community) => (
            <Link
              key={community.id}
              href={community.href}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
            >
              {community.trending && (
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1">
                  🔥 TENDANCE
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl">
                    {community.image}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {community.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {community.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {community.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{community.members.toLocaleString()} membres</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{community.posts.toLocaleString()} posts</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {community.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {community.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{community.tags.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Actif maintenant
                  </div>
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-blue-700 transition-colors">
                    Rejoindre →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">La communauté DiddyHome en chiffres</h3>
            <p className="text-blue-100">Une communauté active et engagée</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">50K+</div>
              <div className="text-sm text-blue-200">Membres actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">25K+</div>
              <div className="text-sm text-blue-200">Posts par mois</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-300">15+</div>
              <div className="text-sm text-blue-200">Communautés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-300">98%</div>
              <div className="text-sm text-blue-200">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Hub Social Highlight */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 mb-12">
          <div className="text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold mb-4">Découvrez le Hub Social Complet !</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Accédez à l'expérience sociale complète : feed communautaire, marketplace, matching, 
              live streaming et économie des créateurs. Tout en un seul endroit !
            </p>
            <Link
              href="/external/social/hub"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Accéder au Hub Social</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Prêt à rejoindre la communauté ?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Connectez-vous avec des milliers de professionnels, partagez vos expériences et développez votre activité.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/external/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
              >
                🚀 Créer mon compte gratuit
              </Link>
              <Link
                href="/external/login"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
              >
                Se connecter
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/external/social/hub"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg inline-flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Hub Social Complet</span>
              </Link>
              <Link
                href="/external/social/hub/groups/VTC-Taxi"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg inline-flex items-center space-x-2"
              >
                <Car className="w-5 h-5" />
                <span>Communauté Pro</span>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
            <p className="text-gray-600 mb-6">
              Rejoignez notre communauté pour accéder à toutes les fonctionnalités !
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <Link
                href="/external/register"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Rejoindre
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
