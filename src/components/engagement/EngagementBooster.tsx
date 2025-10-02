'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Gift, Star, Zap, Target, Trophy, Fire, Heart, MessageCircle, Share2, Bookmark, ThumbsUp } from 'lucide-react';
import { useClientSide } from '@/hooks/useClientSide';
import HydrationSafe from '@/components/ui/HydrationSafe';

interface EngagementBoosterProps {
  userId?: string;
  userRole?: string;
  currentPage?: string;
  onEngagement?: (type: string, data: any) => void;
}

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'achievement' | 'reward' | 'trending' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  icon: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  target: number;
  reward: {
    type: 'points' | 'badge' | 'unlock' | 'discount';
    value: string | number;
  };
  unlocked: boolean;
}

interface EngagementMetrics {
  dailyStreak: number;
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  engagementRate: number;
  socialScore: number;
  achievements: Achievement[];
  notifications: Notification[];
}

export default function EngagementBooster({ 
  userId, 
  userRole = 'guest', 
  currentPage = 'home',
  onEngagement 
}: EngagementBoosterProps) {
  const isClient = useClientSide();
  const [stableTimestamp] = useState(() => Date.now());
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEngagementData();
    
    // Vérifier les récompenses quotidiennes
    checkDailyReward();
    
    // Notifications en temps réel (simulation)
    const interval = setInterval(() => {
      checkForNewNotifications();
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, [userId]);

  const loadEngagementData = async () => {
    setIsLoading(true);
    
    // Simulation de données d'engagement
    const mockMetrics: EngagementMetrics = {
      dailyStreak: 7,
      totalPoints: 2450,
      level: 12,
      nextLevelPoints: 2800,
      engagementRate: 85.5,
      socialScore: 9.2,
      achievements: [
        {
          id: 'first_post',
          title: 'Premier Post',
          description: 'Publiez votre premier contenu',
          icon: '🎉',
          rarity: 'common',
          progress: 1,
          target: 1,
          reward: { type: 'points', value: 100 },
          unlocked: true
        },
        {
          id: 'social_butterfly',
          title: 'Papillon Social',
          description: 'Recevez 50 likes sur vos posts',
          icon: '🦋',
          rarity: 'rare',
          progress: 32,
          target: 50,
          reward: { type: 'badge', value: 'Influenceur' },
          unlocked: false
        },
        {
          id: 'streak_master',
          title: 'Maître de la Régularité',
          description: 'Connectez-vous 30 jours consécutifs',
          icon: '🔥',
          rarity: 'epic',
          progress: 7,
          target: 30,
          reward: { type: 'unlock', value: 'Fonctionnalités Premium' },
          unlocked: false
        },
        {
          id: 'community_hero',
          title: 'Héros de la Communauté',
          description: 'Aidez 100 membres avec vos conseils',
          icon: '🦸‍♂️',
          rarity: 'legendary',
          progress: 23,
          target: 100,
          reward: { type: 'discount', value: '50% sur tous les services' },
          unlocked: false
        }
      ],
      notifications: [
        {
          id: '1',
          type: 'like',
          title: 'Nouveau like !',
          message: 'Marie Expert a aimé votre post sur les assurances VTC',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          read: false,
          actionUrl: '/external/social/hub',
          priority: 'medium',
          icon: '❤️'
        },
        {
          id: '2',
          type: 'achievement',
          title: 'Succès débloqué !',
          message: 'Vous avez atteint le niveau 12 ! Continuez comme ça !',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          read: false,
          priority: 'high',
          icon: '🏆'
        },
        {
          id: '3',
          type: 'trending',
          title: 'Votre post est tendance !',
          message: 'Votre conseil sur l\'optimisation des tournées fait le buzz !',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          read: true,
          actionUrl: '/external/social/hub',
          priority: 'high',
          icon: '🔥'
        }
      ]
    };

    setMetrics(mockMetrics);
    setIsLoading(false);
  };

  const checkDailyReward = () => {
    if (!isClient) return;
    
    const lastRewardDate = localStorage.getItem('lastDailyReward');
    const today = new Date().toDateString();
    
    if (lastRewardDate !== today && userId) {
      setShowDailyReward(true);
    }
  };

  const claimDailyReward = () => {
    if (!isClient) return;
    
    const today = new Date().toDateString();
    localStorage.setItem('lastDailyReward', today);
    
    // Ajouter des points
    if (metrics) {
      setMetrics(prev => prev ? {
        ...prev,
        totalPoints: prev.totalPoints + 50,
        dailyStreak: prev.dailyStreak + 1
      } : null);
    }
    
    setShowDailyReward(false);
    onEngagement?.('daily_reward_claimed', { points: 50 });
  };

  const checkForNewNotifications = () => {
    // Simulation de nouvelles notifications
    const randomNotifications = [
      {
        type: 'comment' as const,
        title: 'Nouveau commentaire',
        message: 'Thomas Pro a commenté votre post',
        icon: '💬'
      },
      {
        type: 'follow' as const,
        title: 'Nouveau follower',
        message: 'Sophie Business vous suit maintenant',
        icon: '👥'
      },
      {
        type: 'reminder' as const,
        title: 'N\'oubliez pas !',
        message: 'Partagez vos conseils du jour avec la communauté',
        icon: '⏰'
      }
    ];

    if (Math.random() < 0.3 && metrics) { // 30% de chance
      const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      const newNotification: Notification =         {
          id: `${stableTimestamp}-${Math.floor(Math.random() * 1000)}`,
          type: randomNotif.type,
          title: randomNotif.title,
          message: randomNotif.message,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium',
          icon: randomNotif.icon
        };

      setMetrics(prev => prev ? {
        ...prev,
        notifications: [newNotification, ...prev.notifications.slice(0, 9)]
      } : null);
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setMetrics(prev => prev ? {
      ...prev,
      notifications: prev.notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    } : null);
  };

  const handleEngagementAction = (action: string, data: any = {}) => {
    // Tracking des actions d'engagement
    onEngagement?.(action, {
      ...data,
      timestamp: new Date().toISOString(),
      page: currentPage,
      userRole
    });

    // Ajouter des points pour certaines actions
    const pointsMap: { [key: string]: number } = {
      'like': 5,
      'comment': 10,
      'share': 15,
      'post_create': 25,
      'profile_complete': 50
    };

    const points = pointsMap[action] || 0;
    if (points > 0 && metrics) {
      setMetrics(prev => prev ? {
        ...prev,
        totalPoints: prev.totalPoints + points
      } : null);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'low': return 'bg-gray-100 border-gray-300 text-gray-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  if (!isClient || isLoading || !metrics) {
    return null;
  }

  const unreadCount = metrics.notifications.filter(n => !n.read).length;
  const levelProgress = ((metrics.totalPoints % 1000) / 1000) * 100;

  return (
    <HydrationSafe fallback={null}>
      <div className="fixed top-4 right-4 z-50 space-y-4">
      {/* Engagement Stats Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 min-w-[300px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {metrics.level}
            </div>
            <div>
              <div className="font-bold text-gray-900">Niveau {metrics.level}</div>
              <div className="text-xs text-gray-500">{metrics.totalPoints} points</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Achievements */}
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            >
              <Trophy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progression niveau {metrics.level + 1}</span>
            <span>{metrics.nextLevelPoints - metrics.totalPoints} points restants</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-600">{metrics.dailyStreak}</div>
            <div className="text-xs text-blue-600">Jours consécutifs</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-lg font-bold text-green-600">{metrics.engagementRate}%</div>
            <div className="text-xs text-green-600">Engagement</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-2">
            <div className="text-lg font-bold text-purple-600">{metrics.socialScore}</div>
            <div className="text-xs text-purple-600">Score social</div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {metrics.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : getPriorityColor(notification.priority)
                }`}
                onClick={() => {
                  markNotificationAsRead(notification.id);
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg">{notification.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{notification.message}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Panel */}
      {showAchievements && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-md max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Succès</h3>
            <button
              onClick={() => setShowAchievements(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {metrics.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{achievement.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{achievement.description}</div>
                    
                    {!achievement.unlocked && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progression</span>
                          <span>{achievement.progress}/{achievement.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all"
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-blue-600 font-medium">
                      Récompense: {achievement.reward.value} {achievement.reward.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Reward Modal */}
      {showDailyReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Récompense quotidienne !</h3>
            <p className="text-gray-600 mb-6">
              Félicitations ! Vous avez gagné 50 points pour votre connexion quotidienne.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="text-2xl font-bold text-blue-600">+50 Points</div>
              <div className="text-sm text-blue-600">Série: {metrics.dailyStreak} jours</div>
            </div>
            <button
              onClick={claimDailyReward}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Récupérer ma récompense
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => handleEngagementAction('like')}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Like rapide"
        >
          <Heart className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleEngagementAction('share')}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Partage rapide"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleEngagementAction('bookmark')}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Sauvegarder"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
      </div>
    </HydrationSafe>
  );
}
