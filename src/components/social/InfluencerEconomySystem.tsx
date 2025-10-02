'use client';

import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, Gift, Crown, Zap, Target, Award, Coins, Share2, Eye, Heart, MessageCircle, ShoppingBag, Percent, Trophy, Fire, Gem } from 'lucide-react';

interface CreatorProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'legend';
  followers: number;
  totalEarnings: number;
  monthlyEarnings: number;
  conversionRate: number;
  specialties: string[];
  badges: string[];
  stats: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    totalSales: number;
    avgEngagement: number;
  };
  currentChallenges: Challenge[];
  achievements: Achievement[];
  referralCode: string;
  isVerified: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'engagement' | 'content' | 'referral';
  target: number;
  current: number;
  reward: {
    type: 'coins' | 'badge' | 'tier_boost' | 'cash' | 'product';
    value: number | string;
    description: string;
  };
  timeLeft: number; // en heures
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  participants: number;
  trending: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  reward: number; // en coins
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  commission: number; // pourcentage
  category: 'insurance' | 'training' | 'equipment' | 'service';
  image: string;
  rating: number;
  salesCount: number;
  trending: boolean;
  creatorBonus?: {
    type: 'extra_commission' | 'exclusive_access' | 'early_access';
    value: number;
    description: string;
  };
}

interface InfluencerEconomySystemProps {
  userId?: string;
  userRole?: 'guest' | 'creator' | 'customer';
  onBecomeCreator?: () => void;
  onPurchaseProduct?: (productId: string, creatorCode?: string) => void;
}

export default function InfluencerEconomySystem({ 
  userId, 
  userRole = 'guest', 
  onBecomeCreator, 
  onPurchaseProduct 
}: InfluencerEconomySystemProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'challenges' | 'shop' | 'leaderboard'>('dashboard');
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [leaderboard, setLeaderboard] = useState<CreatorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEarningsBreakdown, setShowEarningsBreakdown] = useState(false);

  useEffect(() => {
    loadCreatorData();
  }, [userId]);

  const loadCreatorData = async () => {
    setIsLoading(true);

    // Données mockées pour le système créateur
    if (userRole === 'creator') {
      const mockProfile: CreatorProfile = {
        id: 'creator1',
        name: 'Marie VTC Expert',
        avatar: '👩‍💼',
        level: 47,
        tier: 'gold',
        followers: 12847,
        totalEarnings: 15670,
        monthlyEarnings: 2340,
        conversionRate: 8.5,
        specialties: ['Assurance VTC', 'Conseils Pro', 'Formation'],
        badges: ['Top Seller', 'Engagement Master', 'Community Favorite', 'Trend Setter'],
        stats: {
          totalViews: 234567,
          totalLikes: 45678,
          totalShares: 8934,
          totalSales: 156,
          avgEngagement: 12.3
        },
        currentChallenges: [],
        achievements: [
          {
            id: '1',
            title: 'Premier Vente',
            description: 'Félicitations pour votre première vente !',
            icon: '🎉',
            rarity: 'common',
            unlockedAt: '2024-01-10',
            reward: 100
          },
          {
            id: '2',
            title: 'Influenceur Rising',
            description: 'Atteignez 1000 followers',
            icon: '🚀',
            rarity: 'rare',
            unlockedAt: '2024-01-12',
            reward: 500
          }
        ],
        referralCode: 'MARIE2024',
        isVerified: true
      };
      setCreatorProfile(mockProfile);
    }

    // Challenges mockés
    const mockChallenges: Challenge[] = [
      {
        id: 'challenge1',
        title: '🔥 MEGA CHALLENGE: Vendez 10 assurances cette semaine',
        description: 'Défi spécial avec bonus x2 ! Partagez vos conseils assurance et gagnez gros !',
        type: 'sales',
        target: 10,
        current: 6,
        reward: {
          type: 'cash',
          value: 500,
          description: '500€ + Badge Légendaire + Boost Tier'
        },
        timeLeft: 72,
        difficulty: 'hard',
        participants: 234,
        trending: true
      },
      {
        id: 'challenge2',
        title: '💎 Défi Engagement: 1000 likes en 24h',
        description: 'Créez du contenu viral ! Plus vous engagez, plus vous gagnez !',
        type: 'engagement',
        target: 1000,
        current: 456,
        reward: {
          type: 'coins',
          value: 1000,
          description: '1000 DiddyCoins + Badge Viral'
        },
        timeLeft: 18,
        difficulty: 'medium',
        participants: 567,
        trending: false
      },
      {
        id: 'challenge3',
        title: '🎯 Mission Parrainage: 5 nouveaux créateurs',
        description: 'Invitez vos amis à devenir créateurs et gagnez des récompenses folles !',
        type: 'referral',
        target: 5,
        current: 2,
        reward: {
          type: 'tier_boost',
          value: 'Montée de niveau garantie',
          description: 'Niveau supérieur + 200€ par filleul'
        },
        timeLeft: 168,
        difficulty: 'legendary',
        participants: 89,
        trending: true
      }
    ];
    setChallenges(mockChallenges);

    // Produits mockés avec commissions
    const mockProducts: Product[] = [
      {
        id: 'product1',
        name: 'Assurance VTC Premium',
        description: 'La meilleure assurance VTC du marché. Vos followers vont adorer !',
        price: 89,
        commission: 25, // 25% de commission = 22.25€
        category: 'insurance',
        image: '/product-insurance.jpg',
        rating: 4.8,
        salesCount: 1247,
        trending: true,
        creatorBonus: {
          type: 'extra_commission',
          value: 5,
          description: '+5% de commission pour les créateurs Gold+'
        }
      },
      {
        id: 'product2',
        name: 'Formation VTC Complète',
        description: 'Formation bestseller ! Vos abonnés vont réussir leur examen à coup sûr !',
        price: 299,
        commission: 30, // 30% = 89.70€
        category: 'training',
        image: '/product-training.jpg',
        rating: 4.9,
        salesCount: 567,
        trending: true,
        creatorBonus: {
          type: 'exclusive_access',
          value: 0,
          description: 'Accès exclusif aux nouvelles formations en avant-première'
        }
      },
      {
        id: 'product3',
        name: 'Kit Chauffeur Pro',
        description: 'Tout l\'équipement indispensable ! Parfait pour vos recommandations !',
        price: 149,
        commission: 20, // 20% = 29.80€
        category: 'equipment',
        image: '/product-kit.jpg',
        rating: 4.7,
        salesCount: 234,
        trending: false
      }
    ];
    setProducts(mockProducts);

    // Leaderboard mockés
    const mockLeaderboard: CreatorProfile[] = [
      {
        id: 'top1',
        name: 'VTC King 👑',
        avatar: '👑',
        level: 78,
        tier: 'legend',
        followers: 45678,
        totalEarnings: 67890,
        monthlyEarnings: 8900,
        conversionRate: 15.2,
        specialties: ['Business VTC', 'Investissement'],
        badges: ['Legend', 'Million Seller', 'Community Hero'],
        stats: { totalViews: 1000000, totalLikes: 200000, totalShares: 50000, totalSales: 890, avgEngagement: 18.5 },
        currentChallenges: [],
        achievements: [],
        referralCode: 'KING2024',
        isVerified: true
      },
      // ... autres créateurs
    ];
    setLeaderboard(mockLeaderboard);

    setIsLoading(false);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-orange-600 bg-orange-100';
      case 'silver': return 'text-gray-600 bg-gray-100';
      case 'gold': return 'text-yellow-600 bg-yellow-100';
      case 'diamond': return 'text-blue-600 bg-blue-100';
      case 'legend': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'diamond': return '💎';
      case 'legend': return '👑';
      default: return '⭐';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      case 'legendary': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEarnings = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (userRole === 'guest') {
    return (
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 text-white p-8 rounded-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold mb-4">Rejoignez l'Économie des Créateurs DiddyHome !</h2>
          <p className="text-xl mb-6 text-blue-100">
            Transformez votre passion VTC en revenus ! Partagez, recommandez, gagnez !
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold mb-1">Jusqu'à 30%</div>
              <div className="text-sm text-blue-100">de commission sur chaque vente</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold mb-1">Défis quotidiens</div>
              <div className="text-sm text-blue-100">avec récompenses en cash</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <div className="text-3xl mb-2">👑</div>
              <div className="text-2xl font-bold mb-1">Système de niveaux</div>
              <div className="text-sm text-blue-100">plus vous montez, plus vous gagnez</div>
            </div>
          </div>

          <button
            onClick={onBecomeCreator}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            🎬 Devenir Créateur Maintenant
          </button>
          
          <p className="text-sm text-blue-100 mt-4">
            Gratuit • Aucun engagement • Commencez à gagner dès aujourd'hui
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace créateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl">
              {creatorProfile?.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold">{creatorProfile?.name}</h2>
                {creatorProfile?.isVerified && (
                  <Star className="w-6 h-6 text-yellow-300 fill-current" />
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`px-3 py-1 rounded-full ${getTierColor(creatorProfile?.tier || 'bronze')}`}>
                  {getTierIcon(creatorProfile?.tier || 'bronze')} {creatorProfile?.tier?.toUpperCase()}
                </span>
                <span>Niveau {creatorProfile?.level}</span>
                <span>{formatNumber(creatorProfile?.followers || 0)} followers</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">{formatEarnings(creatorProfile?.monthlyEarnings || 0)}</div>
            <div className="text-sm text-blue-100">ce mois-ci</div>
            <button
              onClick={() => setShowEarningsBreakdown(true)}
              className="text-xs text-blue-200 hover:text-white mt-1"
            >
              Voir détails →
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
          { id: 'challenges', label: 'Défis', icon: Target },
          { id: 'shop', label: 'Boutique', icon: ShoppingBag },
          { id: 'leaderboard', label: 'Classement', icon: Trophy }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && creatorProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-600">Gains totaux</div>
                <Coins className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatEarnings(creatorProfile.totalEarnings)}</div>
              <div className="text-sm text-green-600 mt-1">+15% ce mois</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-600">Taux de conversion</div>
                <Percent className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{creatorProfile.conversionRate}%</div>
              <div className="text-sm text-green-600 mt-1">+2.3% vs mois dernier</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-600">Ventes totales</div>
                <ShoppingBag className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{creatorProfile.stats.totalSales}</div>
              <div className="text-sm text-green-600 mt-1">+12 cette semaine</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-600">Engagement moyen</div>
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{creatorProfile.stats.avgEngagement}%</div>
              <div className="text-sm text-green-600 mt-1">Excellent niveau !</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg text-left transition-colors">
                <div className="font-medium">📱 Partager mon code</div>
                <div className="text-sm text-blue-600">Code: {creatorProfile.referralCode}</div>
              </button>
              
              <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 p-3 rounded-lg text-left transition-colors">
                <div className="font-medium">🎯 Voir mes défis actifs</div>
                <div className="text-sm text-green-600">{challenges.length} défis disponibles</div>
              </button>
              
              <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-lg text-left transition-colors">
                <div className="font-medium">🏆 Monter de niveau</div>
                <div className="text-sm text-purple-600">87% vers niveau {creatorProfile.level + 1}</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Défis Créateurs</h2>
            <p className="text-gray-600">Relevez les défis et gagnez des récompenses incroyables !</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className={`bg-white rounded-xl border-2 p-6 ${
                challenge.trending ? 'border-red-200 bg-red-50' : 'border-gray-200'
              }`}>
                {challenge.trending && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Fire className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 text-sm font-medium">TENDANCE</span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty.toUpperCase()}
                      </span>
                      <span className="text-gray-500">{challenge.participants} participants</span>
                      <span className="text-gray-500">{challenge.timeLeft}h restantes</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progression</span>
                    <span className="text-sm font-medium">{challenge.current}/{challenge.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((challenge.current / challenge.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <Gift className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Récompense</span>
                  </div>
                  <div className="text-sm text-yellow-700">{challenge.reward.description}</div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Participer au défi
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'shop' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🛍️ Boutique Créateurs</h2>
            <p className="text-gray-600">Recommandez ces produits et gagnez des commissions attractives !</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {product.trending && (
                  <div className="bg-red-500 text-white text-xs font-bold px-3 py-1">
                    🔥 TENDANCE
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">{product.salesCount} ventes</span>
                      </div>
                    </div>
                  </div>

                  {/* Commission Highlight */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-green-700">Votre commission</div>
                        <div className="font-bold text-green-800">
                          {formatEarnings((product.price * product.commission) / 100)}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {product.commission}%
                      </div>
                    </div>
                  </div>

                  {/* Creator Bonus */}
                  {product.creatorBonus && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                      <div className="text-xs text-purple-600 font-medium mb-1">BONUS CRÉATEUR</div>
                      <div className="text-sm text-purple-700">{product.creatorBonus.description}</div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatEarnings(product.price)}
                    </div>
                    <button
                      onClick={() => onPurchaseProduct?.(product.id, creatorProfile?.referralCode)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Recommander
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🏆 Classement des Créateurs</h2>
            <p className="text-gray-600">Les meilleurs créateurs de la communauté DiddyHome</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Top Créateurs du Mois</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Trophy className="w-4 h-4" />
                  <span>Classement en temps réel</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {leaderboard.slice(0, 10).map((creator, index) => (
                <div key={creator.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                      {creator.avatar}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-gray-900">{creator.name}</span>
                        {creator.isVerified && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs ${getTierColor(creator.tier)}`}>
                          {getTierIcon(creator.tier)} {creator.tier.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Niveau {creator.level}</span>
                        <span>{formatNumber(creator.followers)} followers</span>
                        <span>{creator.conversionRate}% conversion</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatEarnings(creator.monthlyEarnings)}</div>
                      <div className="text-sm text-gray-600">ce mois</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Earnings Breakdown Modal */}
      {showEarningsBreakdown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">💰 Détail des gains</h3>
                <button
                  onClick={() => setShowEarningsBreakdown(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700">Commissions produits</span>
                  <span className="font-bold text-green-800">{formatEarnings(1890)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700">Bonus défis</span>
                  <span className="font-bold text-blue-800">{formatEarnings(350)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-700">Parrainages</span>
                  <span className="font-bold text-purple-800">{formatEarnings(100)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Total ce mois</span>
                    <span className="text-2xl font-bold text-gray-900">{formatEarnings(2340)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowEarningsBreakdown(false)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
