'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, Users, MessageCircle, Heart, Share2, Plus, Search, Filter, 
  TrendingUp, Star, Fire, Crown, Zap, Target, Award, Eye, ThumbsUp,
  Car, Shield, DollarSign, MapPin, Clock, Phone, Mail, Globe,
  Camera, Video, Mic, Image, FileText, Calendar, Settings
} from 'lucide-react';
import SocialFeed from '@/components/social/SocialFeed';
import MarketplaceFeed from '@/components/social/MarketplaceFeed';
import MatchingSystem from '@/components/social/MatchingSystem';
import LiveStreamingSystem from '@/components/social/LiveStreamingSystem';
import InfluencerEconomySystem from '@/components/social/InfluencerEconomySystem';
import CreatorAgencySystem from '@/components/creator/CreatorAgencySystem';
import PrivateGroupsSystem from '@/components/social/PrivateGroupsSystem';
import ECommerceMarketplace from '@/components/commerce/ECommerceMarketplace';
import DealsFinderSystem from '@/components/deals/DealsFinderSystem';
import MobileSocialHub from '@/components/mobile/MobileSocialHub';

export default function SocialHubPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'marketplace' | 'matching' | 'live' | 'creators' | 'agency' | 'groups' | 'deals'>('feed');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLeadGenerated = (lead: any) => {
    console.log('Lead généré:', lead);
    // Ici on pourrait envoyer le lead vers le CRM
  };

  const handleContactProvider = (providerId: string) => {
    console.log('Contact provider:', providerId);
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Logique de contact
  };

  const handleBookService = (serviceId: string) => {
    console.log('Book service:', serviceId);
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Logique de réservation
  };

  const handleMatch = (profileId: string) => {
    console.log('Match avec:', profileId);
    if (!user) {
      setShowAuthModal(true);
      return;
    }
  };

  const handleSuperLike = (profileId: string) => {
    console.log('Super like:', profileId);
    if (!user) {
      setShowAuthModal(true);
      return;
    }
  };

  const handleMessage = (profileId: string) => {
    console.log('Message à:', profileId);
    if (!user) {
      setShowAuthModal(true);
      return;
    }
  };

  // Version mobile
  if (isMobile) {
    return <MobileSocialHub activeTab={activeTab} onTabChange={setActiveTab} />;
  }

  // Version desktop
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/external/social"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour aux communautés</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">Bonjour, {user.name}</span>
                  </div>
                  <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/external/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/external/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Users className="w-12 h-12 text-white" />
              <Heart className="w-10 h-10 text-pink-200" />
              <Zap className="w-8 h-8 text-yellow-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hub Social DiddyHome
            </h1>
            <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
              L'écosystème social complet pour professionnels : feed communautaire, marketplace, matching, 
              live streaming et économie des créateurs. Tout en un !
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/external/register"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  🚀 Rejoindre la communauté
                </Link>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Découvrir en invité
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'feed', label: 'Feed Social', icon: MessageCircle, description: 'Actualités et discussions' },
              { id: 'marketplace', label: 'Marketplace', icon: Globe, description: 'Services et produits' },
              { id: 'matching', label: 'Matching', icon: Heart, description: 'Découvrir des profils' },
              { id: 'live', label: 'Live', icon: Video, description: 'Streaming en direct' },
              { id: 'creators', label: 'Créateurs', icon: Crown, description: 'Économie des créateurs' },
              { id: 'agency', label: 'Agence', icon: Star, description: 'Programme créateurs' },
              { id: 'groups', label: 'Groupes', icon: Users, description: 'Groupes privés sécurisés' },
              { id: 'deals', label: 'Bons Plans', icon: Zap, description: 'Deals et économies' }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center py-4 px-3 border-b-2 font-medium text-sm transition-colors min-w-0 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mb-1" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{tab.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Actions rapides</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => !user && setShowAuthModal(true)}
                      className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-700 font-medium">Créer un post</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('matching')}
                      className="w-full flex items-center space-x-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                    >
                      <Heart className="w-5 h-5 text-pink-600" />
                      <span className="text-pink-700 font-medium">Découvrir</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('marketplace')}
                      className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <Globe className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">Services</span>
                    </button>
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Tendances</h3>
                  <div className="space-y-3">
                    {[
                      { tag: '#AssuranceVTC2024', posts: '1.2K posts' },
                      { tag: '#FormationVTC', posts: '856 posts' },
                      { tag: '#TipsVTC', posts: '634 posts' },
                      { tag: '#PartenariatVTC', posts: '423 posts' },
                      { tag: '#EntretienVéhicule', posts: '312 posts' }
                    ].map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-blue-600">{trend.tag}</div>
                          <div className="text-xs text-gray-500">{trend.posts}</div>
                        </div>
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Professionals */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Pros recommandés</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Marie Expert', role: 'Courtier Assurance', rating: 4.9, avatar: '👩‍💼' },
                      { name: 'Thomas Mécano', role: 'Mécanicien Mobile', rating: 4.8, avatar: '🔧' },
                      { name: 'Sophie Formation', role: 'Formatrice VTC', rating: 4.9, avatar: '🎓' }
                    ].map((pro, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                          {pro.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{pro.name}</div>
                          <div className="text-xs text-gray-500">{pro.role}</div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{pro.rating}</span>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Suivre
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Feed Communauté</h2>
                <p className="text-gray-600">Découvrez les dernières actualités, conseils et témoignages de la communauté VTC/Taxi</p>
              </div>
              <SocialFeed
                userRole={user ? (user.role || 'client') : 'guest'}
                onLeadGenerated={handleLeadGenerated}
              />
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Marketplace Pro</h2>
              <p className="text-gray-600">Trouvez les meilleurs services, partenaires et opportunités pour votre activité</p>
            </div>
            <MarketplaceFeed
              userRole={user ? (user.role || 'client') : 'guest'}
              onContactProvider={handleContactProvider}
              onBookService={handleBookService}
            />
          </div>
        )}

        {activeTab === 'matching' && (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Découvrir & Matcher</h2>
              <p className="text-gray-600">Trouvez les {user?.role === 'professional' ? 'clients' : 'professionnels'} qui vous correspondent</p>
            </div>
            <MatchingSystem
              userType={user?.role === 'professional' ? 'professional' : 'client'}
              onMatch={handleMatch}
              onSuperLike={handleSuperLike}
              onMessage={handleMessage}
            />
          </div>
        )}

        {activeTab === 'live' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Streaming</h2>
              <p className="text-gray-600">Participez aux lives de la communauté ou lancez votre propre stream</p>
            </div>
            <LiveStreamingSystem
              userRole={user ? (user.role || 'client') : 'guest'}
            />
          </div>
        )}

        {activeTab === 'creators' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Économie des Créateurs</h2>
              <p className="text-gray-600">Monétisez votre expertise et rejoignez l'économie des créateurs DiddyHome</p>
            </div>
            <InfluencerEconomySystem
              userId={user?.id}
              userRole={user ? (user.role === 'professional' ? 'creator' : 'customer') : 'guest'}
              onBecomeCreator={() => alert('Redirection vers inscription créateur')}
              onPurchaseProduct={(productId, creatorCode) => 
                alert(`Achat produit ${productId} avec code ${creatorCode}`)
              }
            />
          </div>
        )}

        {activeTab === 'agency' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Agence Créateurs DiddyHome</h2>
              <p className="text-gray-600">Rejoignez notre programme exclusif et monétisez votre expertise</p>
            </div>
            <CreatorAgencySystem />
          </div>
        )}

        {activeTab === 'groups' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Groupes Privés</h2>
              <p className="text-gray-600">Communiquez en toute sécurité avec vos équipes et partenaires</p>
            </div>
            <PrivateGroupsSystem />
          </div>
        )}

        {activeTab === 'deals' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bons Plans DiddyHome</h2>
              <p className="text-gray-600">Trouvez et partagez les meilleurs deals. Gagnez de l'argent en aidant les autres !</p>
            </div>
            <DealsFinderSystem />
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Rejoignez DiddyHome !</h3>
            <p className="text-gray-600 mb-6">
              Créez votre compte pour accéder à toutes les fonctionnalités de notre écosystème social.
            </p>
            <div className="space-y-3">
              <Link
                href="/external/register"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Créer mon compte gratuit
              </Link>
              <Link
                href="/external/login"
                className="block w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors"
              >
                J'ai déjà un compte
              </Link>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Continuer en invité
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
