'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Users, 
  Star, 
  Clock, 
  MapPin, 
  Plane, 
  Car, 
  Home, 
  ShoppingBag, 
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Info,
  Crown,
  Award,
  Target,
  Handshake,
  Calculator,
  PiggyBank,
  TrendingDown,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Edit3,
  Send,
  Phone,
  Mail,
  ExternalLink,
  Copy,
  Sparkles,
  Gift,
  Tag,
  Flame
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  category: 'voyage' | 'transport' | 'immobilier' | 'shopping' | 'services' | 'autre';
  originalPrice: number;
  dealPrice: number;
  savings: number;
  savingsPercent: number;
  finderFee: number;
  finderFeeType: 'fixed' | 'percentage';
  platformCommission: number; // Commission DiddyHome (toujours en %)
  
  finder: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    totalDeals: number;
    successRate: number;
    isVerified: boolean;
    specialties: string[];
  };
  
  client?: {
    id: string;
    name: string;
    avatar: string;
  };
  
  status: 'pending' | 'active' | 'negotiating' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  location?: string;
  requirements: string[];
  tags: string[];
  
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  // Métriques
  views: number;
  interests: number;
  shares: number;
  
  // Communication
  isNegotiable: boolean;
  allowCounterOffers: boolean;
  responseTime: string;
  
  // Preuves et validation
  proofRequired: boolean;
  proofSubmitted?: string[];
  isValidated: boolean;
}

interface DealRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  maxFinderFee: number;
  feeType: 'fixed' | 'percentage';
  deadline: string;
  location?: string;
  requirements: string[];
  
  requester: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  
  offers: DealOffer[];
  createdAt: string;
}

interface DealOffer {
  id: string;
  dealRequestId: string;
  finderId: string;
  finderName: string;
  finderAvatar: string;
  finderRating: number;
  
  proposedPrice: number;
  proposedFee: number;
  feeType: 'fixed' | 'percentage';
  estimatedSavings: number;
  
  message: string;
  deliveryTime: string;
  guarantees: string[];
  
  status: 'pending' | 'accepted' | 'rejected' | 'counter';
  createdAt: string;
}

export default function DealsFinderSystem() {
  const [activeView, setActiveView] = useState<'deals' | 'requests' | 'create-deal' | 'create-request' | 'my-deals'>('deals');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [requests, setRequests] = useState<DealRequest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('savings');
  const [showFilters, setShowFilters] = useState(false);
  const [userRole, setUserRole] = useState<'finder' | 'client' | 'both'>('both');

  useEffect(() => {
    // Deals mockés
    setDeals([
      {
        id: '1',
        title: 'Vol Paris-New York - Économisez 400€',
        description: 'Vol direct Air France Paris-New York, dates flexibles en mars. J\'ai trouvé un tarif exceptionnel avec mes contacts dans l\'aérien.',
        category: 'voyage',
        originalPrice: 1000,
        dealPrice: 600,
        savings: 400,
        savingsPercent: 40,
        finderFee: 50,
        finderFeeType: 'fixed',
        platformCommission: 10, // 10% de la finder fee
        
        finder: {
          id: 'finder1',
          name: 'Marc Expert Voyage',
          avatar: '✈️',
          rating: 4.9,
          totalDeals: 247,
          successRate: 96,
          isVerified: true,
          specialties: ['Voyages', 'Aérien', 'Hôtels']
        },
        
        status: 'active',
        urgency: 'medium',
        deadline: '2025-01-15',
        location: 'Paris → New York',
        requirements: ['Dates flexibles mars 2025', 'Vol direct uniquement', 'Bagage inclus'],
        tags: ['Vol', 'International', 'Affaires', 'Économies'],
        
        createdAt: '2025-01-02 10:30',
        updatedAt: '2025-01-02 10:30',
        
        views: 156,
        interests: 23,
        shares: 8,
        
        isNegotiable: true,
        allowCounterOffers: true,
        responseTime: '< 2h',
        
        proofRequired: true,
        isValidated: false
      },
      {
        id: '2',
        title: 'Assurance Auto Premium -60%',
        description: 'Assurance tous risques avec garanties premium. Grâce à mon réseau d\'assureurs partenaires, je peux vous faire économiser jusqu\'à 60%.',
        category: 'services',
        originalPrice: 1200,
        dealPrice: 480,
        savings: 720,
        savingsPercent: 60,
        finderFee: 15, // 15% des économies
        finderFeeType: 'percentage',
        platformCommission: 8,
        
        finder: {
          id: 'finder2',
          name: 'Sophie Assurance Pro',
          avatar: '🛡️',
          rating: 4.8,
          totalDeals: 189,
          successRate: 94,
          isVerified: true,
          specialties: ['Assurance', 'Auto', 'Habitation']
        },
        
        client: {
          id: 'client1',
          name: 'Jean D.',
          avatar: '👨‍💼'
        },
        
        status: 'negotiating',
        urgency: 'low',
        location: 'France entière',
        requirements: ['Véhicule récent', 'Bonus 50 minimum', 'Conducteur principal +25 ans'],
        tags: ['Assurance', 'Auto', 'Premium', 'Économies'],
        
        createdAt: '2025-01-01 14:20',
        updatedAt: '2025-01-02 09:15',
        
        views: 89,
        interests: 12,
        shares: 3,
        
        isNegotiable: true,
        allowCounterOffers: false,
        responseTime: '< 1h',
        
        proofRequired: true,
        isValidated: true
      },
      {
        id: '3',
        title: 'MacBook Pro M3 - Économisez 350€',
        description: 'MacBook Pro 14" M3 neuf sous garantie Apple. Prix négocié directement avec revendeur agréé.',
        category: 'shopping',
        originalPrice: 2499,
        dealPrice: 2149,
        savings: 350,
        savingsPercent: 14,
        finderFee: 8, // 8% des économies
        finderFeeType: 'percentage',
        platformCommission: 12,
        
        finder: {
          id: 'finder3',
          name: 'Tech Deals Pro',
          avatar: '💻',
          rating: 4.7,
          totalDeals: 156,
          successRate: 92,
          isVerified: true,
          specialties: ['Tech', 'Apple', 'Électronique']
        },
        
        status: 'active',
        urgency: 'high',
        deadline: '2025-01-05',
        location: 'Livraison France',
        requirements: ['Neuf sous garantie', 'Facture officielle', 'Livraison rapide'],
        tags: ['Tech', 'Apple', 'MacBook', 'Neuf'],
        
        createdAt: '2025-01-02 16:45',
        updatedAt: '2025-01-02 16:45',
        
        views: 234,
        interests: 45,
        shares: 15,
        
        isNegotiable: false,
        allowCounterOffers: false,
        responseTime: '< 30min',
        
        proofRequired: true,
        isValidated: true
      }
    ]);

    // Demandes mockées
    setRequests([
      {
        id: '1',
        title: 'Recherche vol Paris-Tokyo pas cher',
        description: 'Je cherche un vol Paris-Tokyo pour avril 2025, dates flexibles. Budget max 800€.',
        category: 'voyage',
        budget: 800,
        maxFinderFee: 60,
        feeType: 'fixed',
        deadline: '2025-01-20',
        location: 'Paris → Tokyo',
        requirements: ['Avril 2025', 'Dates flexibles ±3 jours', 'Max 1 escale'],
        
        requester: {
          id: 'client2',
          name: 'Marie L.',
          avatar: '👩‍💼',
          rating: 4.6
        },
        
        status: 'open',
        urgency: 'medium',
        offers: [],
        createdAt: '2025-01-02 11:30'
      }
    ]);
  }, []);

  const handleCreateDeal = () => {
    setActiveView('create-deal');
  };

  const handleCreateRequest = () => {
    setActiveView('create-request');
  };

  const calculatePlatformEarnings = (deal: Deal): number => {
    const finderEarnings = deal.finderFeeType === 'fixed' 
      ? deal.finderFee 
      : (deal.savings * deal.finderFee / 100);
    
    return finderEarnings * (deal.platformCommission / 100);
  };

  const calculateFinderNetEarnings = (deal: Deal): number => {
    const grossEarnings = deal.finderFeeType === 'fixed' 
      ? deal.finderFee 
      : (deal.savings * deal.finderFee / 100);
    
    const platformFee = grossEarnings * (deal.platformCommission / 100);
    return grossEarnings - platformFee;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'negotiating': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'voyage': return <Plane className="w-5 h-5" />;
      case 'transport': return <Car className="w-5 h-5" />;
      case 'immobilier': return <Home className="w-5 h-5" />;
      case 'shopping': return <ShoppingBag className="w-5 h-5" />;
      case 'services': return <Briefcase className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />;
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (activeView === 'create-deal') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer un Bon Plan</h1>
          <button
            onClick={() => setActiveView('deals')}
            className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du bon plan
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Vol Paris-New York -40%"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="voyage">Voyage</option>
                  <option value="transport">Transport</option>
                  <option value="immobilier">Immobilier</option>
                  <option value="shopping">Shopping</option>
                  <option value="services">Services</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Décrivez votre bon plan en détail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix original (€)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix avec bon plan (€)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Économies (calculées auto)
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                  value="400€ (40%)"
                  disabled
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Votre Rémunération</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Type de rémunération
                  </label>
                  <select className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="fixed">Montant fixe (€)</option>
                    <option value="percentage">Pourcentage des économies (%)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Montant / Pourcentage
                  </label>
                  <input
                    type="number"
                    className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50 ou 10"
                  />
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-white rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Vos gains bruts:</span>
                  <span className="font-semibold text-green-600">50€</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Commission DiddyHome (10%):</span>
                  <span className="text-red-600">-5€</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Vos gains nets:</span>
                  <span className="font-bold text-green-600">45€</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgence
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date limite (optionnel)
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prérequis et conditions
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Ex: Dates flexibles, paiement immédiat requis..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">Négociable</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">Accepter les contre-offres</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">Preuves requises</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setActiveView('deals')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Publier le bon plan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bons Plans DiddyHome</h1>
          <p className="text-gray-600">Trouvez et partagez les meilleurs deals. Gagnez de l'argent en aidant les autres !</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCreateRequest}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span>Chercher un deal</span>
          </button>
          <button
            onClick={handleCreateDeal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Proposer un deal</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deals actifs</p>
              <p className="text-2xl font-bold text-blue-600">247</p>
            </div>
            <Zap className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Économies totales</p>
              <p className="text-2xl font-bold text-green-600">€156K</p>
            </div>
            <PiggyBank className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Finders actifs</p>
              <p className="text-2xl font-bold text-purple-600">89</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de succès</p>
              <p className="text-2xl font-bold text-orange-600">94%</p>
            </div>
            <Target className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="flex items-center space-x-8 px-6">
          {[
            { id: 'deals', label: 'Deals Disponibles', count: deals.length },
            { id: 'requests', label: 'Demandes', count: requests.length },
            { id: 'my-deals', label: 'Mes Deals', count: 5 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`py-4 border-b-2 transition-colors ${
                activeView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="font-medium">{tab.label}</span>
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher des bons plans..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes catégories</option>
            <option value="voyage">Voyage</option>
            <option value="transport">Transport</option>
            <option value="immobilier">Immobilier</option>
            <option value="shopping">Shopping</option>
            <option value="services">Services</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="savings">Plus d'économies</option>
            <option value="recent">Plus récents</option>
            <option value="deadline">Fin bientôt</option>
            <option value="rating">Mieux notés</option>
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDeals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(deal.category)}
                  <span className="text-sm font-medium text-gray-600 capitalize">{deal.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(deal.urgency)}`}>
                    {deal.urgency}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {deal.title}
              </h3>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {deal.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="px-6 pb-4">
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Prix original</span>
                  <span className="text-lg text-gray-500 line-through">€{deal.originalPrice}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Prix avec deal</span>
                  <span className="text-xl font-bold text-green-600">€{deal.dealPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Économies</span>
                  <span className="text-lg font-bold text-green-800">
                    €{deal.savings} ({deal.savingsPercent}%)
                  </span>
                </div>
              </div>

              {/* Finder Fee */}
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">Frais finder</span>
                  <span className="font-medium text-blue-800">
                    {deal.finderFeeType === 'fixed' 
                      ? `€${deal.finderFee}` 
                      : `${deal.finderFee}% (€${Math.round(deal.savings * deal.finderFee / 100)})`
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-blue-600">Commission DiddyHome</span>
                  <span className="text-blue-600">€{calculatePlatformEarnings(deal).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Finder Info */}
            <div className="px-6 pb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg">
                  {deal.finder.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{deal.finder.name}</h4>
                    {deal.finder.isVerified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>⭐ {deal.finder.rating}</span>
                    <span>{deal.finder.totalDeals} deals</span>
                    <span>{deal.finder.successRate}% succès</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {deal.finder.specialties.slice(0, 3).map((specialty, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6">
              <div className="flex items-center space-x-2 mb-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Contacter
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{deal.views} vues</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{deal.interests} intéressés</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Réponse {deal.responseTime}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun deal trouvé</h3>
          <p className="text-gray-500 mb-6">Soyez le premier à proposer un bon plan !</p>
          <button
            onClick={handleCreateDeal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Créer un deal
          </button>
        </div>
      )}
    </div>
  );
}
