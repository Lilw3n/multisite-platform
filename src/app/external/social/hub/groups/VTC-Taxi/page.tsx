'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, Users, MessageCircle, Heart, Share2, Plus, Search, Filter, 
  TrendingUp, Star, Fire, Crown, Zap, Target, Award, Eye, ThumbsUp,
  Car, Shield, DollarSign, MapPin, Clock, Phone, Mail, Globe,
  Camera, Video, Mic, Image, FileText, Calendar, Settings,
  ChevronDown, ChevronUp, MoreHorizontal, Flag, Bookmark
} from 'lucide-react';
import SocialFeed from '@/components/social/SocialFeed';
import LiveStreamingSystem from '@/components/social/LiveStreamingSystem';
import InfluencerEconomySystem from '@/components/social/InfluencerEconomySystem';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member' | 'vip';
  level: number;
  joinDate: string;
  posts: number;
  reputation: number;
  specialties: string[];
  isOnline: boolean;
  lastSeen?: string;
}

interface GroupPost {
  id: string;
  author: GroupMember;
  content: string;
  type: 'text' | 'image' | 'video' | 'poll' | 'event' | 'deal' | 'tip';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  isPinned?: boolean;
  isSponsored?: boolean;
  engagement: {
    liked: boolean;
    bookmarked: boolean;
    shared: boolean;
  };
}

interface GroupEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'meetup' | 'webinar' | 'training' | 'networking';
  attendees: number;
  maxAttendees?: number;
  price?: number;
  organizer: GroupMember;
}

export default function VTCTaxiGroupPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'events' | 'deals' | 'live' | 'economy'>('feed');
  const [isMember, setIsMember] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupStats, setGroupStats] = useState({
    members: 12847,
    posts: 8934,
    activeToday: 2456,
    onlineNow: 234
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est membre du groupe
    if (user) {
      setIsMember(true); // Pour la démo, on considère que l'utilisateur connecté est membre
    }
  }, [user]);

  const handleJoinGroup = () => {
    if (!user) {
      setShowJoinModal(true);
      return;
    }
    
    setIsMember(true);
    setGroupStats(prev => ({ ...prev, members: prev.members + 1 }));
    alert('🎉 Bienvenue dans la communauté professionnelle !');
  };

  const handleLeaveGroup = () => {
    if (confirm('Êtes-vous sûr de vouloir quitter ce groupe ?')) {
      setIsMember(false);
      setGroupStats(prev => ({ ...prev, members: prev.members - 1 }));
    }
  };

  const mockMembers: GroupMember[] = [
    {
      id: '1',
      name: 'Marie Expert VTC',
      avatar: '👩‍💼',
      role: 'admin',
      level: 78,
      joinDate: '2023-01-15',
      posts: 1247,
      reputation: 9.8,
      specialties: ['Assurance VTC', 'Formation', 'Business'],
      isOnline: true
    },
    {
      id: '2',
      name: 'Thomas Pro Taxi',
      avatar: '👨‍💼',
      role: 'moderator',
      level: 65,
      joinDate: '2023-03-20',
      posts: 892,
      reputation: 9.5,
      specialties: ['Réglementation', 'Optimisation', 'Tech'],
      isOnline: true
    },
    {
      id: '3',
      name: 'Sophie Business',
      avatar: '👩‍🚀',
      role: 'vip',
      level: 52,
      joinDate: '2023-06-10',
      posts: 634,
      reputation: 9.2,
      specialties: ['Entrepreneuriat', 'Marketing', 'Finance'],
      isOnline: false,
      lastSeen: '2h'
    }
  ];

  const mockEvents: GroupEvent[] = [
    {
      id: '1',
      title: 'Webinar: Nouvelles réglementations VTC 2024',
      description: 'Tout ce qu\'il faut savoir sur les changements réglementaires',
      date: '2024-02-15T19:00:00Z',
      location: 'En ligne',
      type: 'webinar',
      attendees: 156,
      maxAttendees: 500,
      price: 0,
      organizer: mockMembers[0]
    },
    {
      id: '2',
      title: 'Meetup VTC Paris - Networking & Conseils',
      description: 'Rencontre entre professionnels VTC parisiens',
      date: '2024-02-20T18:30:00Z',
      location: 'Paris 15ème',
      type: 'meetup',
      attendees: 23,
      maxAttendees: 50,
      price: 15,
      organizer: mockMembers[1]
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'moderator': return 'text-purple-600 bg-purple-100';
      case 'vip': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'moderator': return '🛡️';
      case 'vip': return '⭐';
      default: return '👤';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/external/social/hub"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour au Hub Social</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{groupStats.onlineNow} en ligne</span>
              </div>
              
              {isMember ? (
                <div className="flex items-center space-x-2">
                  <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleLeaveGroup}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Quitter le groupe
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleJoinGroup}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Rejoindre le groupe
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Group Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center text-4xl">
                🚗
              </div>
              
              <div>
                <h1 className="text-4xl font-bold mb-2">Communauté Professionnelle</h1>
                <p className="text-xl text-blue-100 mb-4 max-w-2xl">
                  La plus grande communauté de professionnels connectés. 
                  Échangez conseils, astuces et opportunités avec des milliers de pros !
                </p>
                
                <div className="flex items-center space-x-6 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>{groupStats.members.toLocaleString()} membres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>{groupStats.posts.toLocaleString()} posts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>{groupStats.activeToday.toLocaleString()} actifs aujourd'hui</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Group Tags */}
            <div className="hidden lg:block">
              <div className="flex flex-wrap gap-2">
                {['#VTC', '#Taxi', '#Chauffeur', '#Transport', '#Business', '#Conseils'].map((tag, index) => (
                  <span key={index} className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'feed', label: 'Feed', icon: MessageCircle, count: groupStats.posts },
              { id: 'members', label: 'Membres', icon: Users, count: groupStats.members },
              { id: 'events', label: 'Événements', icon: Calendar, count: 12 },
              { id: 'deals', label: 'Bons Plans', icon: DollarSign, count: 45 },
              { id: 'live', label: 'Live', icon: Video, count: 3 },
              { id: 'economy', label: 'Créateurs', icon: Crown, count: 156 }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count > 1000 ? `${(tab.count / 1000).toFixed(1)}k` : tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isMember && activeTab !== 'members' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">Rejoignez la communauté !</h3>
                <p className="text-yellow-800 text-sm mb-3">
                  Accédez à tous les contenus exclusifs, participez aux discussions et bénéficiez des conseils de la communauté.
                </p>
                <button
                  onClick={handleJoinGroup}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Rejoindre maintenant - Gratuit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3">
              {isMember && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                      {user?.name?.[0] || '👤'}
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Partagez vos conseils, expériences ou questions avec la communauté professionnelle..."
                        className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Image className="w-5 h-5" />
                            <span className="text-sm">Photo</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Video className="w-5 h-5" />
                            <span className="text-sm">Vidéo</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Calendar className="w-5 h-5" />
                            <span className="text-sm">Événement</span>
                          </button>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                          Publier
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <SocialFeed
                userRole={user ? (user.role || 'client') : 'guest'}
                groupContext="VTC-Taxi"
                onLeadGenerated={(lead) => console.log('Lead généré:', lead)}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Group Rules */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">📋 Règles du groupe</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>✅ Respectez les autres membres</div>
                    <div>✅ Partagez des conseils utiles</div>
                    <div>✅ Pas de spam ou pub non autorisée</div>
                    <div>✅ Restez dans le thème VTC/Taxi</div>
                    <div>✅ Aidez les nouveaux membres</div>
                  </div>
                </div>

                {/* Top Contributors */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">🏆 Top Contributeurs</h3>
                  <div className="space-y-4">
                    {mockMembers.slice(0, 3).map((member, index) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.posts} posts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">🔥 Sujets tendance</h3>
                  <div className="space-y-3">
                    {[
                      { tag: '#AssuranceVTC2024', posts: 234 },
                      { tag: '#FormationChauffeur', posts: 189 },
                      { tag: '#OptimisationTournées', posts: 156 },
                      { tag: '#NouvellesRègles', posts: 134 },
                      { tag: '#TipsRentabilité', posts: 98 }
                    ].map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-blue-600">{trend.tag}</div>
                          <div className="text-xs text-gray-500">{trend.posts} posts</div>
                        </div>
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Autres onglets... */}
        {activeTab === 'live' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Lives VTC & Taxi</h2>
              <p className="text-gray-600">Participez aux lives de la communauté</p>
            </div>
            <LiveStreamingSystem
              userRole={user ? (user.role || 'client') : 'guest'}
              groupContext="VTC-Taxi"
            />
          </div>
        )}

        {activeTab === 'economy' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Économie des Créateurs VTC & Taxi</h2>
              <p className="text-gray-600">Monétisez votre expertise et aidez la communauté</p>
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
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Rejoignez VTC & Taxi !</h3>
            <p className="text-gray-600 mb-6">
              Créez votre compte pour accéder à tous les contenus exclusifs de la communauté.
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
                onClick={() => setShowJoinModal(false)}
                className="text-gray-500 hover:text-gray-700 text-sm"
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
