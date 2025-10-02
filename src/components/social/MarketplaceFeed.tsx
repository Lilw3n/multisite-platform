'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, Shield, Verified, Heart, MessageCircle, Phone, Mail, Calendar, Car, Users, TrendingUp, Filter, Search, ChevronDown } from 'lucide-react';

interface MarketplaceItem {
  id: string;
  type: 'service' | 'partnership' | 'equipment' | 'training' | 'opportunity' | 'event';
  category: 'vtc' | 'taxi' | 'insurance' | 'maintenance' | 'legal' | 'finance' | 'equipment' | 'training';
  title: string;
  description: string;
  images: string[];
  price?: {
    amount: number;
    type: 'fixed' | 'hourly' | 'daily' | 'monthly' | 'negotiable';
    currency: string;
  };
  provider: {
    id: string;
    name: string;
    avatar: string;
    type: 'individual' | 'company' | 'partner';
    verified: boolean;
    rating: number;
    reviewCount: number;
    responseTime: string;
    badges: string[];
    location: string;
    memberSince: string;
  };
  availability: {
    immediate: boolean;
    schedule?: string;
    timeSlots?: Array<{
      date: string;
      slots: string[];
    }>;
  };
  location: {
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number };
    radius?: number;
  };
  tags: string[];
  features: string[];
  requirements?: string[];
  engagement: {
    views: number;
    likes: number;
    messages: number;
    bookings?: number;
  };
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isFavorite: boolean;
  urgency?: 'low' | 'medium' | 'high';
  matchScore?: number; // Score de compatibilité avec l'utilisateur
}

interface MarketplaceFeedProps {
  userRole?: 'guest' | 'client' | 'pro' | 'internal';
  userLocation?: string;
  onItemSelect?: (item: MarketplaceItem) => void;
  onContactProvider?: (providerId: string, itemId: string) => void;
  onBookService?: (itemId: string) => void;
}

export default function MarketplaceFeed({ 
  userRole = 'guest', 
  userLocation,
  onItemSelect,
  onContactProvider,
  onBookService 
}: MarketplaceFeedProps) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    location: 'all',
    priceRange: 'all',
    rating: 'all',
    availability: 'all'
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'rating' | 'distance' | 'recent'>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadMarketplaceItems();
  }, [filters, sortBy]);

  const loadMarketplaceItems = async () => {
    setIsLoading(true);
    
    // Données mockées pour la marketplace
    const mockItems: MarketplaceItem[] = [
      {
        id: '1',
        type: 'service',
        category: 'insurance',
        title: 'Assurance VTC Premium - Économisez jusqu\'à 40%',
        description: 'Assurance spécialisée VTC avec couverture complète. Devis en 5 minutes, souscription en ligne. Assistance 24h/7j incluse.',
        images: ['/insurance-service-1.jpg', '/insurance-service-2.jpg'],
        price: {
          amount: 89,
          type: 'monthly',
          currency: 'EUR'
        },
        provider: {
          id: 'provider1',
          name: 'DiddyHome Assurance',
          avatar: '🏠',
          type: 'company',
          verified: true,
          rating: 4.8,
          reviewCount: 1247,
          responseTime: '< 2h',
          badges: ['Partenaire Officiel', 'Expert VTC', 'Service Premium'],
          location: 'Paris, France',
          memberSince: '2020'
        },
        availability: {
          immediate: true,
          schedule: 'Lun-Ven 8h-20h, Sam 9h-17h'
        },
        location: {
          city: 'Paris',
          region: 'Île-de-France',
          radius: 50
        },
        tags: ['#AssuranceVTC', '#ÉconomieGarantie', '#ServiceRapide'],
        features: [
          'Devis instantané',
          'Souscription 100% en ligne',
          'Assistance 24h/7j',
          'Espace client dédié',
          'Attestations immédiates'
        ],
        engagement: {
          views: 2340,
          likes: 189,
          messages: 45,
          bookings: 23
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        isLiked: false,
        isFavorite: true,
        urgency: 'medium',
        matchScore: 95
      },
      {
        id: '2',
        type: 'service',
        category: 'maintenance',
        title: 'Entretien véhicule VTC à domicile',
        description: 'Mécanicien mobile spécialisé VTC. Révision, vidange, pneus, diagnostic. Intervention à votre domicile ou lieu de travail.',
        images: ['/mechanic-service-1.jpg'],
        price: {
          amount: 120,
          type: 'fixed',
          currency: 'EUR'
        },
        provider: {
          id: 'provider2',
          name: 'Marc Mécanicien Mobile',
          avatar: '🔧',
          type: 'individual',
          verified: true,
          rating: 4.9,
          reviewCount: 456,
          responseTime: '< 1h',
          badges: ['Expert VTC', 'Service Mobile', 'Disponible Weekend'],
          location: 'Lyon, France',
          memberSince: '2021'
        },
        availability: {
          immediate: false,
          timeSlots: [
            {
              date: '2024-01-20',
              slots: ['09:00', '14:00', '16:30']
            },
            {
              date: '2024-01-21',
              slots: ['08:00', '10:30', '15:00']
            }
          ]
        },
        location: {
          city: 'Lyon',
          region: 'Auvergne-Rhône-Alpes',
          radius: 30
        },
        tags: ['#EntretienVTC', '#ServiceMobile', '#MécanicienExpert'],
        features: [
          'Intervention à domicile',
          'Diagnostic gratuit',
          'Pièces d\'origine',
          'Garantie 6 mois',
          'Devis transparent'
        ],
        requirements: [
          'Véhicule accessible',
          'Point d\'eau à proximité'
        ],
        engagement: {
          views: 890,
          likes: 67,
          messages: 23,
          bookings: 12
        },
        createdAt: '2024-01-14T15:30:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
        isLiked: true,
        isFavorite: false,
        urgency: 'low',
        matchScore: 87
      },
      {
        id: '3',
        type: 'partnership',
        category: 'vtc',
        title: 'Recherche partenaire VTC pour courses longues',
        description: 'Chauffeur VTC expérimenté cherche partenaire pour partager les courses longue distance Paris-Province. Partage équitable des bénéfices.',
        images: ['/partnership-1.jpg'],
        provider: {
          id: 'provider3',
          name: 'Thomas VTC Pro',
          avatar: '👨‍💼',
          type: 'individual',
          verified: true,
          rating: 4.7,
          reviewCount: 234,
          responseTime: '< 30min',
          badges: ['VTC Expérimenté', 'Longue Distance', 'Partenariat'],
          location: 'Paris, France',
          memberSince: '2019'
        },
        availability: {
          immediate: true,
          schedule: 'Flexible selon demandes'
        },
        location: {
          city: 'Paris',
          region: 'Île-de-France',
          radius: 100
        },
        tags: ['#PartenariatVTC', '#CoursesLongues', '#PartageRevenu'],
        features: [
          'Expérience 5+ ans',
          'Véhicule premium',
          'Clientèle fidèle',
          'Disponibilité flexible'
        ],
        requirements: [
          'Licence VTC valide',
          'Véhicule récent',
          'Expérience minimum 2 ans'
        ],
        engagement: {
          views: 567,
          likes: 34,
          messages: 18
        },
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:15:00Z',
        isLiked: false,
        isFavorite: false,
        urgency: 'medium',
        matchScore: 78
      },
      {
        id: '4',
        type: 'training',
        category: 'training',
        title: 'Formation VTC - Préparation examen + Business',
        description: 'Formation complète VTC : préparation examen, création d\'entreprise, optimisation fiscale, marketing digital. Taux de réussite 95%.',
        images: ['/training-1.jpg', '/training-2.jpg'],
        price: {
          amount: 890,
          type: 'fixed',
          currency: 'EUR'
        },
        provider: {
          id: 'provider4',
          name: 'VTC Academy Pro',
          avatar: '🎓',
          type: 'company',
          verified: true,
          rating: 4.9,
          reviewCount: 789,
          responseTime: '< 4h',
          badges: ['Centre Agréé', 'Taux Réussite 95%', 'Suivi Personnalisé'],
          location: 'Marseille, France',
          memberSince: '2018'
        },
        availability: {
          immediate: false,
          timeSlots: [
            {
              date: '2024-02-01',
              slots: ['Formation Intensive 5 jours']
            },
            {
              date: '2024-02-15',
              slots: ['Formation Weekend']
            }
          ]
        },
        location: {
          city: 'Marseille',
          region: 'PACA',
          radius: 0
        },
        tags: ['#FormationVTC', '#ExamenVTC', '#BusinessVTC'],
        features: [
          'Préparation examen théorique',
          'Formation pratique',
          'Module création entreprise',
          'Suivi post-formation',
          'Garantie réussite'
        ],
        engagement: {
          views: 1234,
          likes: 98,
          messages: 67,
          bookings: 34
        },
        createdAt: '2024-01-12T14:20:00Z',
        updatedAt: '2024-01-12T14:20:00Z',
        isLiked: false,
        isFavorite: true,
        urgency: 'low',
        matchScore: 92
      },
      {
        id: '5',
        type: 'opportunity',
        category: 'vtc',
        title: '🔥 URGENT - Remplaçant VTC weekend',
        description: 'Cherche chauffeur VTC pour remplacements weekends. Véhicule fourni, clientèle établie, rémunération attractive. Démarrage immédiat possible.',
        images: ['/opportunity-1.jpg'],
        price: {
          amount: 200,
          type: 'daily',
          currency: 'EUR'
        },
        provider: {
          id: 'provider5',
          name: 'Luxury VTC Services',
          avatar: '🚗',
          type: 'company',
          verified: true,
          rating: 4.6,
          reviewCount: 345,
          responseTime: 'Immédiat',
          badges: ['Recrutement Actif', 'Véhicule Fourni', 'Formation Incluse'],
          location: 'Nice, France',
          memberSince: '2020'
        },
        availability: {
          immediate: true,
          schedule: 'Weekends + jours fériés'
        },
        location: {
          city: 'Nice',
          region: 'PACA',
          radius: 20
        },
        tags: ['#OpportunityVTC', '#RemplacementWeekend', '#VéhiculeFourni'],
        features: [
          'Véhicule premium fourni',
          'Clientèle haut de gamme',
          'Formation rapide',
          'Paiement hebdomadaire',
          'Évolution possible'
        ],
        requirements: [
          'Licence VTC valide',
          'Expérience minimum 1 an',
          'Présentation soignée',
          'Disponibilité weekends'
        ],
        engagement: {
          views: 1890,
          likes: 156,
          messages: 89
        },
        createdAt: '2024-01-16T08:00:00Z',
        updatedAt: '2024-01-16T08:00:00Z',
        isLiked: false,
        isFavorite: false,
        urgency: 'high',
        matchScore: 85
      }
    ];

    setItems(mockItems);
    setIsLoading(false);
  };

  const handleLike = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            isLiked: !item.isLiked,
            engagement: {
              ...item.engagement,
              likes: item.isLiked ? item.engagement.likes - 1 : item.engagement.likes + 1
            }
          }
        : item
    ));
  };

  const handleFavorite = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, isFavorite: !item.isFavorite }
        : item
    ));
  };

  const formatPrice = (price: MarketplaceItem['price']) => {
    if (!price) return 'Prix sur demande';
    
    const typeLabels = {
      fixed: '',
      hourly: '/h',
      daily: '/jour',
      monthly: '/mois',
      negotiable: ' (négociable)'
    };
    
    return `${price.amount}€${typeLabels[price.type]}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service': return '🛠️';
      case 'partnership': return '🤝';
      case 'equipment': return '📦';
      case 'training': return '🎓';
      case 'opportunity': return '💼';
      case 'event': return '📅';
      default: return '📋';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vtc': return 'bg-blue-100 text-blue-800';
      case 'taxi': return 'bg-yellow-100 text-yellow-800';
      case 'insurance': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-green-100 text-green-800';
      case 'legal': return 'bg-red-100 text-red-800';
      case 'finance': return 'bg-indigo-100 text-indigo-800';
      case 'equipment': return 'bg-gray-100 text-gray-800';
      case 'training': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Marketplace Professionnelle</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filtres</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="vtc">VTC</option>
              <option value="taxi">Taxi</option>
              <option value="insurance">Assurance</option>
              <option value="maintenance">Entretien</option>
              <option value="training">Formation</option>
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous types</option>
              <option value="service">Services</option>
              <option value="partnership">Partenariats</option>
              <option value="opportunity">Opportunités</option>
              <option value="training">Formations</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Pertinence</option>
              <option value="recent">Plus récent</option>
              <option value="rating">Mieux notés</option>
              <option value="price">Prix</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        )}
      </div>

      {/* Items */}
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl">
                  {getTypeIcon(item.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category.toUpperCase()}
                    </span>
                    {item.urgency && (
                      <span className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(item.urgency)}`}>
                        {item.urgency === 'high' ? '🔥 URGENT' : item.urgency === 'medium' ? '⚡ PRIORITÉ' : '✅ NORMAL'}
                      </span>
                    )}
                    {item.matchScore && item.matchScore > 80 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full border border-green-200">
                        🎯 {item.matchScore}% compatible
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  
                  {/* Provider info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm">
                      {item.provider.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-sm text-gray-900">{item.provider.name}</span>
                        {item.provider.verified && (
                          <Verified className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{item.provider.rating}</span>
                          <span>({formatNumber(item.provider.reviewCount)})</span>
                        </div>
                        <span>•</span>
                        <span>Répond en {item.provider.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Price */}
              {item.price && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(item.price)}
                  </div>
                  {item.price.type === 'negotiable' && (
                    <div className="text-xs text-gray-500">Prix négociable</div>
                  )}
                </div>
              )}
            </div>

            {/* Features */}
            {item.features.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {item.features.slice(0, 4).map((feature, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      ✓ {feature}
                    </span>
                  ))}
                  {item.features.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{item.features.length - 4} autres
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Location & Availability */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location.city}</span>
                  {item.location.radius && item.location.radius > 0 && (
                    <span className="text-xs">({item.location.radius}km)</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className={item.availability.immediate ? 'text-green-600' : 'text-orange-600'}>
                    {item.availability.immediate ? 'Disponible maintenant' : 'Sur rendez-vous'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span>{formatNumber(item.engagement.views)} vues</span>
                {item.engagement.bookings && (
                  <span>{item.engagement.bookings} réservations</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center space-x-1 transition-colors ${
                    item.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{formatNumber(item.engagement.likes)}</span>
                </button>
                
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{formatNumber(item.engagement.messages)}</span>
                </button>
                
                <button
                  onClick={() => handleFavorite(item.id)}
                  className={`transition-colors ${
                    item.isFavorite ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                  }`}
                >
                  <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                {userRole !== 'guest' && (
                  <>
                    <button
                      onClick={() => onContactProvider?.(item.provider.id, item.id)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contacter</span>
                    </button>
                    
                    {(item.type === 'service' || item.type === 'training') && (
                      <button
                        onClick={() => onBookService?.(item.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        {item.type === 'service' ? 'Réserver' : 'S\'inscrire'}
                      </button>
                    )}
                  </>
                )}
                
                {userRole === 'guest' && (
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Se connecter pour contacter
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
