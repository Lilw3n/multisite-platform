'use client';

import React, { useState, useEffect } from 'react';
import { Play, Users, Heart, MessageCircle, Gift, Star, Crown, Zap, Trophy, Fire, Eye, Share2, Volume2, VolumeX, Maximize, Settings, MoreHorizontal } from 'lucide-react';

interface LiveStream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  streamer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
    badges: string[];
    followers: number;
    agency?: {
      name: string;
      logo: string;
      tier: 'bronze' | 'silver' | 'gold' | 'diamond';
    };
  };
  category: 'vtc-tips' | 'formation' | 'q&a' | 'business' | 'entertainment' | 'news';
  viewers: number;
  likes: number;
  duration: number; // en minutes
  isLive: boolean;
  language: string;
  tags: string[];
  gifts: {
    total: number;
    recent: Array<{
      id: string;
      user: string;
      gift: string;
      value: number;
      timestamp: string;
    }>;
  };
  ranking: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
  battleMode?: {
    opponent: {
      id: string;
      name: string;
      avatar: string;
      score: number;
    };
    myScore: number;
    timeLeft: number;
  };
}

interface LiveStreamingSystemProps {
  userRole?: 'guest' | 'client' | 'pro' | 'streamer';
  onJoinStream?: (streamId: string) => void;
  onStartStream?: () => void;
  onSendGift?: (streamId: string, giftType: string) => void;
}

export default function LiveStreamingSystem({ 
  userRole = 'guest', 
  onJoinStream, 
  onStartStream, 
  onSendGift 
}: LiveStreamingSystemProps) {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'popular' | 'following'>('live');
  const [category, setCategory] = useState<string>('all');
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadStreams();
    // Simuler les messages de chat en temps réel
    const chatInterval = setInterval(() => {
      if (selectedStream) {
        addRandomChatMessage();
      }
    }, 3000);

    return () => clearInterval(chatInterval);
  }, [selectedStream]);

  const loadStreams = async () => {
    setIsLoading(true);
    
    // Données mockées pour les lives
    const mockStreams: LiveStream[] = [
      {
        id: 'live1',
        title: '🔥 LIVE: Comment j\'ai économisé 2000€ sur mon assurance VTC !',
        description: 'Je partage mes astuces pour négocier avec les assureurs et optimiser son CRM. Questions-réponses en direct !',
        thumbnail: '/live-thumb-1.jpg',
        streamer: {
          id: 'streamer1',
          name: 'Marie VTC Expert',
          avatar: '👩‍💼',
          verified: true,
          level: 47,
          badges: ['Expert Certifié', 'Top Streamer', 'Mentor VTC'],
          followers: 12847,
          agency: {
            name: 'DiddyHome Agency',
            logo: '🏠',
            tier: 'diamond'
          }
        },
        category: 'vtc-tips',
        viewers: 1247,
        likes: 8934,
        duration: 45,
        isLive: true,
        language: 'FR',
        tags: ['#AssuranceVTC', '#Économies', '#CRM', '#Négociation'],
        gifts: {
          total: 15670,
          recent: [
            { id: '1', user: 'Jean_VTC', gift: '🚗', value: 100, timestamp: '2024-01-16T10:30:00Z' },
            { id: '2', user: 'Sophie_Taxi', gift: '💎', value: 500, timestamp: '2024-01-16T10:29:00Z' },
            { id: '3', user: 'Thomas_Pro', gift: '🔥', value: 50, timestamp: '2024-01-16T10:28:00Z' }
          ]
        },
        ranking: {
          daily: 1,
          weekly: 3,
          monthly: 7,
          allTime: 15
        }
      },
      {
        id: 'live2',
        title: '⚡ BATTLE LIVE: VTC vs TAXI - Qui gagne le plus ?',
        description: 'Battle épique entre un chauffeur VTC et un chauffeur Taxi ! Débat en direct avec vos votes !',
        thumbnail: '/live-thumb-2.jpg',
        streamer: {
          id: 'streamer2',
          name: 'Battle Arena VTC',
          avatar: '⚔️',
          verified: true,
          level: 52,
          badges: ['Battle Master', 'Animateur Pro', 'Communauté'],
          followers: 8934,
          agency: {
            name: 'Stream Warriors',
            logo: '⚔️',
            tier: 'gold'
          }
        },
        category: 'entertainment',
        viewers: 2156,
        likes: 12456,
        duration: 67,
        isLive: true,
        language: 'FR',
        tags: ['#Battle', '#VTCvsTaxi', '#Débat', '#Communauté'],
        gifts: {
          total: 23450,
          recent: [
            { id: '4', user: 'VTC_King', gift: '👑', value: 1000, timestamp: '2024-01-16T10:25:00Z' },
            { id: '5', user: 'Taxi_Legend', gift: '🏆', value: 800, timestamp: '2024-01-16T10:24:00Z' }
          ]
        },
        ranking: {
          daily: 2,
          weekly: 1,
          monthly: 2,
          allTime: 5
        },
        battleMode: {
          opponent: {
            id: 'taxi_pro',
            name: 'Pierre Taxi Pro',
            avatar: '🚕',
            score: 12450
          },
          myScore: 15670,
          timeLeft: 23
        }
      },
      {
        id: 'live3',
        title: '📚 Formation VTC GRATUITE - Préparation Examen 2024',
        description: 'Session de formation gratuite pour préparer l\'examen VTC 2024. Support PDF offert !',
        thumbnail: '/live-thumb-3.jpg',
        streamer: {
          id: 'streamer3',
          name: 'Prof VTC Academy',
          avatar: '🎓',
          verified: true,
          level: 38,
          badges: ['Formateur Agréé', 'Expert Pédagogue', 'Taux Réussite 95%'],
          followers: 5678,
          agency: {
            name: 'Education Pro',
            logo: '📚',
            tier: 'silver'
          }
        },
        category: 'formation',
        viewers: 567,
        likes: 3456,
        duration: 120,
        isLive: true,
        language: 'FR',
        tags: ['#FormationVTC', '#ExamenVTC', '#Gratuit', '#PDF'],
        gifts: {
          total: 5670,
          recent: [
            { id: '6', user: 'Futur_VTC', gift: '📖', value: 25, timestamp: '2024-01-16T10:20:00Z' }
          ]
        },
        ranking: {
          daily: 8,
          weekly: 12,
          monthly: 18,
          allTime: 45
        }
      },
      {
        id: 'live4',
        title: '💰 LIVE Business: Créer sa flotte VTC en 6 mois',
        description: 'Retour d\'expérience : comment j\'ai créé une flotte de 15 véhicules en partant de zéro !',
        thumbnail: '/live-thumb-4.jpg',
        streamer: {
          id: 'streamer4',
          name: 'CEO VTC Empire',
          avatar: '👑',
          verified: true,
          level: 63,
          badges: ['Entrepreneur', 'Millionnaire VTC', 'Mentor Business'],
          followers: 23456,
          agency: {
            name: 'Business Elite',
            logo: '💼',
            tier: 'diamond'
          }
        },
        category: 'business',
        viewers: 3456,
        likes: 18934,
        duration: 89,
        isLive: true,
        language: 'FR',
        tags: ['#Business', '#Flotte', '#Entrepreneur', '#Success'],
        gifts: {
          total: 45670,
          recent: [
            { id: '7', user: 'Ambitious_VTC', gift: '💎', value: 500, timestamp: '2024-01-16T10:15:00Z' },
            { id: '8', user: 'Future_CEO', gift: '🚗', value: 100, timestamp: '2024-01-16T10:14:00Z' }
          ]
        },
        ranking: {
          daily: 3,
          weekly: 2,
          monthly: 1,
          allTime: 2
        }
      }
    ];

    setStreams(mockStreams);
    setIsLoading(false);
  };

  const addRandomChatMessage = () => {
    const randomMessages = [
      { user: 'Jean_VTC', message: 'Excellent conseil ! 👍', type: 'normal' },
      { user: 'Sophie_Pro', message: 'Question: ça marche aussi pour les taxis ?', type: 'question' },
      { user: 'Thomas_Expert', message: 'J\'ai économisé 800€ avec cette méthode !', type: 'testimonial' },
      { user: 'Marie_Débutante', message: 'Merci pour le partage ! 🙏', type: 'thanks' },
      { user: 'VTC_King', message: 'a envoyé un cadeau 🎁', type: 'gift' },
      { user: 'Pro_Driver', message: 'Quelqu\'un a le lien du PDF ?', type: 'question' }
    ];

    const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    setChatMessages(prev => [...prev.slice(-20), {
      id: Date.now(),
      ...randomMessage,
      timestamp: new Date().toISOString()
    }]);
  };

  const handleJoinStream = (stream: LiveStream) => {
    setSelectedStream(stream);
    setChatMessages([
      { id: 1, user: 'System', message: `Bienvenue dans le live de ${stream.streamer.name} !`, type: 'system', timestamp: new Date().toISOString() }
    ]);
    onJoinStream?.(stream.id);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedStream) return;
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      user: 'Vous',
      message: newMessage,
      type: 'own',
      timestamp: new Date().toISOString()
    }]);
    setNewMessage('');
  };

  const handleSendGift = (giftType: string, value: number) => {
    if (!selectedStream) return;
    
    onSendGift?.(selectedStream.id, giftType);
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      user: 'Vous',
      message: `a envoyé ${giftType} (${value}€)`,
      type: 'gift',
      timestamp: new Date().toISOString()
    }]);
  };

  const formatViewers = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  const getAgencyBadge = (tier: string) => {
    switch (tier) {
      case 'diamond': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'vtc-tips': return 'bg-blue-100 text-blue-800';
      case 'formation': return 'bg-green-100 text-green-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      case 'entertainment': return 'bg-pink-100 text-pink-800';
      case 'q&a': return 'bg-yellow-100 text-yellow-800';
      case 'news': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedStream) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div className="h-full flex">
          {/* Video Player */}
          <div className={`${showChat ? 'flex-1' : 'w-full'} relative bg-gray-900`}>
            {/* Video */}
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-8xl mb-4">{selectedStream.streamer.avatar}</div>
                <h2 className="text-2xl font-bold mb-2">{selectedStream.streamer.name}</h2>
                <p className="text-lg opacity-75">{selectedStream.title}</p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatViewers(selectedStream.viewers)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Battle Mode Overlay */}
            {selectedStream.battleMode && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 rounded-lg p-4 text-white">
                <div className="text-center mb-2">
                  <div className="text-red-500 font-bold">BATTLE MODE</div>
                  <div className="text-sm">Temps restant: {selectedStream.battleMode.timeLeft}min</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl">{selectedStream.streamer.avatar}</div>
                    <div className="text-sm">{selectedStream.streamer.name}</div>
                    <div className="text-lg font-bold text-green-400">{selectedStream.battleMode.myScore}</div>
                  </div>
                  <div className="text-2xl">⚔️</div>
                  <div className="text-center">
                    <div className="text-2xl">{selectedStream.battleMode.opponent.avatar}</div>
                    <div className="text-sm">{selectedStream.battleMode.opponent.name}</div>
                    <div className="text-lg font-bold text-red-400">{selectedStream.battleMode.opponent.score}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedStream(null)}
                  className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg hover:bg-opacity-70 transition-colors"
                >
                  ← Retour
                </button>
                
                <div className="flex items-center space-x-2 bg-black bg-opacity-50 rounded-lg px-3 py-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-white">{formatViewers(selectedStream.likes)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors">
                  <Volume2 className="w-5 h-5" />
                </button>
                <button className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="w-80 bg-gray-900 text-white flex flex-col">
              {/* Stream Info */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    {selectedStream.streamer.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{selectedStream.streamer.name}</span>
                      {selectedStream.streamer.verified && (
                        <Star className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Niveau {selectedStream.streamer.level} • {formatViewers(selectedStream.streamer.followers)} followers
                    </div>
                  </div>
                </div>

                {/* Agency Badge */}
                {selectedStream.streamer.agency && (
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm">{getAgencyBadge(selectedStream.streamer.agency.tier)}</span>
                    <span className="text-sm text-gray-300">{selectedStream.streamer.agency.name}</span>
                  </div>
                )}

                {/* Live Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-800 rounded p-2 text-center">
                    <div className="text-green-400 font-bold">{formatViewers(selectedStream.viewers)}</div>
                    <div className="text-gray-400">Viewers</div>
                  </div>
                  <div className="bg-gray-800 rounded p-2 text-center">
                    <div className="text-yellow-400 font-bold">{formatViewers(selectedStream.gifts.total)}</div>
                    <div className="text-gray-400">Cadeaux</div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`text-sm ${
                    msg.type === 'system' ? 'text-yellow-400 text-center' :
                    msg.type === 'own' ? 'text-blue-400' :
                    msg.type === 'gift' ? 'text-purple-400' :
                    msg.type === 'question' ? 'text-green-400' :
                    'text-white'
                  }`}>
                    <span className="font-semibold">{msg.user}:</span> {msg.message}
                  </div>
                ))}
              </div>

              {/* Gift Bar */}
              <div className="p-3 border-t border-gray-700">
                <div className="flex space-x-2 mb-3">
                  {[
                    { emoji: '👍', value: 1 },
                    { emoji: '❤️', value: 5 },
                    { emoji: '🔥', value: 10 },
                    { emoji: '🎁', value: 25 },
                    { emoji: '💎', value: 100 }
                  ].map((gift) => (
                    <button
                      key={gift.emoji}
                      onClick={() => handleSendGift(gift.emoji, gift.value)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 rounded p-2 text-center transition-colors"
                    >
                      <div className="text-lg">{gift.emoji}</div>
                      <div className="text-xs text-gray-400">{gift.value}€</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tapez votre message..."
                    className="flex-1 bg-gray-800 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🔴 Lives VTC/Taxi</h2>
          <p className="text-gray-600">Rejoignez les lives de la communauté et apprenez des experts !</p>
        </div>
        
        {userRole !== 'guest' && (
          <button
            onClick={onStartStream}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Démarrer un live</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        {['live', 'popular', 'following', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'live' && '🔴'} {f === 'popular' && '🔥'} {f === 'following' && '👥'} {f === 'all' && '📺'}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Live Streams Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <div
              key={stream.id}
              onClick={() => handleJoinStream(stream)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-400 via-blue-500 to-pink-500">
                <div className="absolute inset-0 flex items-center justify-center text-white text-4xl">
                  {stream.streamer.avatar}
                </div>
                
                {/* Live indicator */}
                {stream.isLive && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>
                )}
                
                {/* Viewers */}
                <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatViewers(stream.viewers)}</span>
                </div>
                
                {/* Duration */}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                  {stream.duration}min
                </div>
                
                {/* Battle Mode */}
                {stream.battleMode && (
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    ⚔️ BATTLE
                  </div>
                )}
                
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(stream.category)}`}>
                    {stream.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-1">
                    {stream.ranking.daily <= 3 && (
                      <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        #{stream.ranking.daily} du jour
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {stream.title}
                </h3>

                {/* Streamer */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                    {stream.streamer.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-sm text-gray-900">{stream.streamer.name}</span>
                      {stream.streamer.verified && (
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Niveau {stream.streamer.level}</span>
                      {stream.streamer.agency && (
                        <>
                          <span>•</span>
                          <span>{getAgencyBadge(stream.streamer.agency.tier)} {stream.streamer.agency.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>{formatViewers(stream.likes)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Gift className="w-4 h-4 text-purple-500" />
                      <span>{formatViewers(stream.gifts.total)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {stream.language}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {stream.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs text-blue-600 hover:text-blue-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
