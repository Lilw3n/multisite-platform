'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_DATA_CONFIG, logMockDataWarning } from '@/lib/mockDataManager';
import { 
  Truck, 
  Shield, 
  GraduationCap, 
  ShoppingBag, 
  Rocket, 
  Calendar,
  Users,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  Search,
  Filter,
  Star
} from 'lucide-react';

interface Community {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  members: number;
  posts: number;
  trending: boolean;
  tags: string[];
  href: string;
  status: 'Actif maintenant' | 'Modérément actif' | 'Nouveau';
}

/* === DONNÉES FICTIVES - DÉBUT === */
// ⚠️ ATTENTION : Données de démonstration à supprimer en production !
// Ces communautés sont fictives et servent uniquement pour la démonstration
const communities: Community[] = [
  {
    id: 'pro',
    name: 'Communauté Pro',
    description: 'La plus grande communauté de professionnels connectés',
    icon: Truck,
    category: 'Professionnel',
    members: 12847,
    posts: 8934,
    trending: true,
    tags: ['#Pro', '#Communauté', '#Professionnel'],
    href: '/external/social/communities/pro',
    status: 'Actif maintenant'
  },
  {
    id: 'assurance',
    name: 'Assurance Pro',
    description: 'Tout sur l\'assurance professionnelle',
    icon: Shield,
    category: 'Assurance',
    members: 8456,
    posts: 5672,
    trending: true,
    tags: ['#Assurance', '#CRM', '#Économies'],
    href: '/external/social/communities/assurance',
    status: 'Actif maintenant'
  },
  {
    id: 'formation',
    name: 'Formation & Business',
    description: 'Développez vos compétences et votre business',
    icon: GraduationCap,
    category: 'Formation',
    members: 6234,
    posts: 4123,
    trending: false,
    tags: ['#Formation', '#Business', '#Entrepreneur'],
    href: '/external/social/communities/formation',
    status: 'Actif maintenant'
  },
  {
    id: 'marketplace',
    name: 'Marketplace & Deals',
    description: 'Les meilleures offres et services pour pros',
    icon: ShoppingBag,
    category: 'Commerce',
    members: 9876,
    posts: 6789,
    trending: true,
    tags: ['#Deals', '#Services', '#Équipement'],
    href: '/external/social/communities/marketplace',
    status: 'Actif maintenant'
  },
  {
    id: 'tech',
    name: 'Tech & Innovation',
    description: 'Les dernières innovations du secteur',
    icon: Rocket,
    category: 'Technologie',
    members: 4567,
    posts: 3456,
    trending: false,
    tags: ['#Tech', '#Innovation', '#Apps'],
    href: '/external/social/communities/tech',
    status: 'Actif maintenant'
  },
  {
    id: 'networking',
    name: 'Networking & Events',
    description: 'Événements, rencontres et networking pro',
    icon: Calendar,
    category: 'Événements',
    members: 7890,
    posts: 2345,
    trending: false,
    tags: ['#Networking', '#Events', '#Rencontres'],
    href: '/external/social/communities/networking',
    status: 'Actif maintenant'
  }
];
/* === DONNÉES FICTIVES - FIN === */

export default function CommunitiesPage() {
  // Log d'avertissement pour les données fictives
  logMockDataWarning('Communities Page - Utilisation de communautés de démonstration');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);

  const categories = ['Tous', ...Array.from(new Set(communities.map(c => c.category)))];

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Tous' || community.category === selectedCategory;
    const matchesTrending = !showTrendingOnly || community.trending;
    
    return matchesSearch && matchesCategory && matchesTrending;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🌐 Communautés</h1>
              <p className="mt-2 text-gray-600">Rejoignez des communautés professionnelles actives</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/external/social/hub"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Hub Principal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une communauté..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <button
                onClick={() => setShowTrendingOnly(!showTrendingOnly)}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center ${
                  showTrendingOnly 
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Tendance
              </button>
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <div key={community.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Trending Badge */}
              {community.trending && (
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-t-lg">
                  🔥 TENDANCE
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <community.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {community.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{community.name}</h3>
                <p className="text-gray-600 mb-4">{community.description}</p>

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{formatNumber(community.members)} membres</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{formatNumber(community.posts)} posts</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {community.tags.map((tag, index) => (
                    <span key={index} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium">{community.status}</span>
                  <Link
                    href={community.href}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                  >
                    Rejoindre
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune communauté trouvée</h3>
            <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Tous');
                setShowTrendingOnly(false);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Créez votre propre communauté</h2>
          <p className="text-xl mb-8 opacity-90">Rassemblez des professionnels autour de votre expertise</p>
          <Link
            href="/external/social/hub#create-community"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <Star className="w-5 h-5 mr-2" />
            Créer une communauté
          </Link>
        </div>
      </div>
    </div>
  );
}