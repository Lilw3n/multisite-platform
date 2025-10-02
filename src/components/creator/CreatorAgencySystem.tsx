'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  Heart, 
  Share2, 
  Award, 
  Crown, 
  Zap,
  Target,
  Calendar,
  BarChart3,
  Gift,
  Briefcase,
  Camera,
  Video,
  Mic,
  Image,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Trophy,
  Flame
} from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  followers: number;
  totalViews: number;
  totalEarnings: number;
  monthlyEarnings: number;
  engagementRate: number;
  specialties: string[];
  joinDate: string;
  isVerified: boolean;
  agencyTier: 'Starter' | 'Pro' | 'Elite' | 'Master';
  performance: {
    contentScore: number;
    consistencyScore: number;
    engagementScore: number;
    conversionScore: number;
  };
}

interface Campaign {
  id: string;
  title: string;
  brand: string;
  description: string;
  budget: number;
  duration: string;
  requirements: string[];
  targetAudience: string;
  deliverables: string[];
  commission: number;
  status: 'active' | 'pending' | 'completed' | 'paused';
  applicants: number;
  deadline: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
}

interface AgencyStats {
  totalCreators: number;
  activeCreators: number;
  totalCampaigns: number;
  totalRevenue: number;
  averageEarnings: number;
  topPerformers: Creator[];
}

export default function CreatorAgencySystem() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'creators' | 'analytics' | 'academy'>('dashboard');
  const [userProfile, setUserProfile] = useState<Creator | null>(null);
  const [agencyStats, setAgencyStats] = useState<AgencyStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    setAgencyStats({
      totalCreators: 15847,
      activeCreators: 8934,
      totalCampaigns: 2341,
      totalRevenue: 1250000,
      averageEarnings: 2850,
      topPerformers: []
    });

    setCampaigns([
      {
        id: '1',
        title: 'Campagne Assurance Jeunes Conducteurs',
        brand: 'DiddyHome Assurance',
        description: 'Créez du contenu engageant pour promouvoir notre nouvelle offre d\'assurance jeunes conducteurs',
        budget: 15000,
        duration: '30 jours',
        requirements: ['Minimum 1000 followers', 'Taux d\'engagement > 3%', 'Contenu authentique'],
        targetAudience: '18-25 ans, nouveaux conducteurs',
        deliverables: ['3 posts Instagram', '2 vidéos TikTok', '1 story série'],
        commission: 25,
        status: 'active',
        applicants: 47,
        deadline: '2025-02-15',
        category: 'Assurance',
        difficulty: 'Medium'
      },
      {
        id: '2',
        title: 'Challenge #MonPremierVéhicule',
        brand: 'DiddyHome Transport',
        description: 'Lancez un challenge viral autour de l\'achat du premier véhicule professionnel',
        budget: 25000,
        duration: '45 jours',
        requirements: ['Minimum 5000 followers', 'Expérience transport', 'Créativité'],
        targetAudience: 'Futurs professionnels du transport',
        deliverables: ['Vidéo challenge', 'Posts de suivi', 'Engagement communauté'],
        commission: 30,
        status: 'active',
        applicants: 23,
        deadline: '2025-02-28',
        category: 'Transport',
        difficulty: 'Hard'
      },
      {
        id: '3',
        title: 'Série Éducative: Les Bases de l\'Entrepreneuriat',
        brand: 'DiddyHome Academy',
        description: 'Créez une série éducative sur les fondamentaux de l\'entrepreneuriat',
        budget: 8000,
        duration: '60 jours',
        requirements: ['Expertise métier', 'Qualité pédagogique', 'Régularité'],
        targetAudience: 'Entrepreneurs débutants',
        deliverables: ['6 vidéos éducatives', 'Fiches récapitulatives', 'Q&A live'],
        commission: 20,
        status: 'active',
        applicants: 12,
        deadline: '2025-03-15',
        category: 'Éducation',
        difficulty: 'Expert'
      }
    ]);

    // Vérifier si l'utilisateur est créateur
    const creatorStatus = localStorage.getItem('is_creator');
    setIsCreator(creatorStatus === 'true');

    if (creatorStatus === 'true') {
      setUserProfile({
        id: 'user_1',
        name: 'Votre Profil',
        avatar: '👤',
        level: 'Silver',
        followers: 2847,
        totalViews: 125000,
        totalEarnings: 4250,
        monthlyEarnings: 850,
        engagementRate: 4.2,
        specialties: ['Assurance', 'Conseils Pro', 'Témoignages'],
        joinDate: '2024-06-15',
        isVerified: true,
        agencyTier: 'Pro',
        performance: {
          contentScore: 8.5,
          consistencyScore: 7.8,
          engagementScore: 9.2,
          conversionScore: 6.9
        }
      });
    }
  }, []);

  const handleJoinAgency = () => {
    setIsCreator(true);
    localStorage.setItem('is_creator', 'true');
    alert('🎉 Bienvenue dans l\'Agence DiddyHome ! Vous pouvez maintenant postuler aux campagnes.');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'text-amber-600 bg-amber-100';
      case 'Silver': return 'text-gray-600 bg-gray-100';
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      case 'Platinum': return 'text-purple-600 bg-purple-100';
      case 'Diamond': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-orange-600 bg-orange-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isCreator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Agence DiddyHome Creators
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez notre programme exclusif de créateurs de contenu et monétisez votre passion. 
              Gagnez jusqu'à 5000€/mois en créant du contenu authentique pour nos marques partenaires.
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">15,847</div>
              <div className="text-gray-600">Créateurs Actifs</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">€1.25M</div>
              <div className="text-gray-600">Revenus Distribués</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">2,341</div>
              <div className="text-gray-600">Campagnes Actives</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">€2,850</div>
              <div className="text-gray-600">Gain Moyen/Mois</div>
            </div>
          </div>

          {/* Avantages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Revenus Attractifs</h3>
              <p className="text-gray-600">
                Commissions de 15% à 40% selon votre niveau. Bonus de performance et primes exclusives.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Campagnes Premium</h3>
              <p className="text-gray-600">
                Accès exclusif aux meilleures marques. Campagnes sur-mesure adaptées à votre audience.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Support Dédié</h3>
              <p className="text-gray-600">
                Manager personnel, formation gratuite, outils professionnels et communauté VIP.
              </p>
            </div>
          </div>

          {/* Niveaux */}
          <div className="bg-white rounded-lg p-8 shadow-lg mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Niveaux de Créateurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { level: 'Bronze', followers: '500+', commission: '15%', color: 'amber' },
                { level: 'Silver', followers: '2K+', commission: '20%', color: 'gray' },
                { level: 'Gold', followers: '10K+', commission: '25%', color: 'yellow' },
                { level: 'Platinum', followers: '50K+', commission: '30%', color: 'purple' },
                { level: 'Diamond', followers: '100K+', commission: '40%', color: 'blue' }
              ].map((tier, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className={`w-12 h-12 bg-${tier.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Crown className={`w-6 h-6 text-${tier.color}-600`} />
                  </div>
                  <h3 className="font-semibold mb-2">{tier.level}</h3>
                  <p className="text-sm text-gray-600 mb-1">{tier.followers} followers</p>
                  <p className="text-sm font-semibold text-green-600">{tier.commission} commission</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={handleJoinAgency}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 Rejoindre l'Agence Maintenant
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Gratuit • Sans engagement • Revenus immédiats
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Agence Creators</h1>
                <p className="text-sm text-gray-500">Dashboard Créateur</p>
              </div>
            </div>
            
            {userProfile && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{userProfile.name}</p>
                  <p className={`text-sm px-2 py-1 rounded-full ${getLevelColor(userProfile.level)}`}>
                    {userProfile.level} • {userProfile.agencyTier}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                  {userProfile.avatar}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'campaigns', label: 'Campagnes', icon: Briefcase },
              { id: 'creators', label: 'Créateurs', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'academy', label: 'Academy', icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && userProfile && (
          <div className="space-y-8">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenus ce mois</p>
                    <p className="text-2xl font-bold text-green-600">€{userProfile.monthlyEarnings}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Followers</p>
                    <p className="text-2xl font-bold text-blue-600">{userProfile.followers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vues totales</p>
                    <p className="text-2xl font-bold text-purple-600">{userProfile.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Engagement</p>
                    <p className="text-2xl font-bold text-orange-600">{userProfile.engagementRate}%</p>
                  </div>
                  <Heart className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Performance Scores */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Scores de Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Qualité Contenu', score: userProfile.performance.contentScore, color: 'blue' },
                  { label: 'Régularité', score: userProfile.performance.consistencyScore, color: 'green' },
                  { label: 'Engagement', score: userProfile.performance.engagementScore, color: 'purple' },
                  { label: 'Conversion', score: userProfile.performance.conversionScore, color: 'orange' }
                ].map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-20 h-20 rounded-full bg-${metric.color}-100 flex items-center justify-center mx-auto mb-3`}>
                      <span className={`text-2xl font-bold text-${metric.color}-600`}>
                        {metric.score}/10
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">{metric.label}</p>
                    <div className={`w-full bg-gray-200 rounded-full h-2 mt-2`}>
                      <div 
                        className={`bg-${metric.color}-500 h-2 rounded-full`}
                        style={{ width: `${metric.score * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campagnes Recommandées */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Campagnes Recommandées</h2>
                <button 
                  onClick={() => setActiveTab('campaigns')}
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
                >
                  <span>Voir toutes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.slice(0, 2).map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
                        <p className="text-sm text-gray-600">{campaign.brand}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(campaign.difficulty)}`}>
                        {campaign.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>€{campaign.budget.toLocaleString()}</span>
                        <span>{campaign.commission}% commission</span>
                      </div>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Postuler
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Campagnes Disponibles</h2>
              <div className="flex items-center space-x-4">
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>Toutes les catégories</option>
                  <option>Assurance</option>
                  <option>Transport</option>
                  <option>Éducation</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>Toutes les difficultés</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(campaign.difficulty)}`}>
                          {campaign.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{campaign.brand}</p>
                      <p className="text-sm text-gray-500">{campaign.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">€{campaign.budget.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{campaign.commission}% commission</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{campaign.description}</p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Livrables</h4>
                      <div className="flex flex-wrap gap-2">
                        {campaign.deliverables.map((deliverable, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Prérequis</h4>
                      <div className="flex flex-wrap gap-2">
                        {campaign.requirements.map((req, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{campaign.applicants} candidats</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{campaign.duration}</span>
                      </span>
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Postuler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'creators' && agencyStats && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Top Créateurs</h2>
              <div className="text-sm text-gray-500">
                {agencyStats.activeCreators.toLocaleString()} créateurs actifs
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Marie Expert Pro', avatar: '👩‍💼', level: 'Diamond', followers: 125000, earnings: 8500, specialty: 'Assurance Pro' },
                { name: 'Thomas Transport', avatar: '👨‍🚗', level: 'Platinum', followers: 89000, earnings: 6200, specialty: 'Transport' },
                { name: 'Sophie Conseil', avatar: '👩‍💻', level: 'Gold', followers: 45000, earnings: 3800, specialty: 'Entrepreneuriat' },
                { name: 'Lucas Digital', avatar: '👨‍💻', level: 'Gold', followers: 38000, earnings: 3200, specialty: 'Marketing' },
                { name: 'Emma Finance', avatar: '👩‍💼', level: 'Silver', followers: 22000, earnings: 2100, specialty: 'Finance' },
                { name: 'Alex Innovation', avatar: '👨‍🔬', level: 'Silver', followers: 18000, earnings: 1900, specialty: 'Tech' }
              ].map((creator, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                      {creator.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                      <p className="text-sm text-gray-600">{creator.specialty}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(creator.level)}`}>
                      {creator.level}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Followers</span>
                      <span className="font-medium">{creator.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenus/mois</span>
                      <span className="font-medium text-green-600">€{creator.earnings}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rang</span>
                      <span className="font-medium">#{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Performance</h2>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Évolution des Revenus</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Graphique des revenus (à implémenter)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Top Campagnes</h3>
                <div className="space-y-3">
                  {campaigns.slice(0, 3).map((campaign, index) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{campaign.title}</p>
                        <p className="text-sm text-gray-600">{campaign.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">€{campaign.budget.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{campaign.commission}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Métriques Clés</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taux de conversion</span>
                    <span className="font-medium">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Campagnes complétées</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Note moyenne</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Temps de livraison moyen</span>
                    <span className="font-medium">2.3 jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'academy' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Creator Academy</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Créer du Contenu Viral', level: 'Débutant', duration: '2h', students: 1247, rating: 4.8 },
                { title: 'Stratégies d\'Engagement', level: 'Intermédiaire', duration: '3h', students: 892, rating: 4.9 },
                { title: 'Monétisation Avancée', level: 'Avancé', duration: '4h', students: 567, rating: 4.7 },
                { title: 'Analytics et Performance', level: 'Intermédiaire', duration: '2.5h', students: 734, rating: 4.6 },
                { title: 'Personal Branding', level: 'Débutant', duration: '3h', students: 1089, rating: 4.8 },
                { title: 'Négociation de Contrats', level: 'Avancé', duration: '2h', students: 345, rating: 4.9 }
              ].map((course, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {course.level}
                      </span>
                      <span className="text-sm text-gray-500">{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{course.students} étudiants</span>
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Commencer le cours
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
