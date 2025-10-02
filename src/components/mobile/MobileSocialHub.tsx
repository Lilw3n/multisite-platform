'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  User,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Fire,
  Users,
  Video,
  Camera,
  Zap,
  Gift,
  ShoppingBag,
  Crown
} from 'lucide-react';

interface MobileSocialHubProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileSocialHub({ activeTab, onTabChange }: MobileSocialHubProps) {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Tabs mobiles optimisés
  const mobileTabs = [
    { id: 'feed', label: 'Pour toi', icon: Heart, color: 'text-pink-500' },
    { id: 'live', label: 'Live', icon: Video, color: 'text-red-500' },
    { id: 'marketplace', label: 'Shop', icon: ShoppingBag, color: 'text-green-500' },
    { id: 'deals', label: 'Deals', icon: Gift, color: 'text-yellow-500' },
    { id: 'creators', label: 'Créateurs', icon: Crown, color: 'text-purple-500' }
  ];

  // Posts mobiles style TikTok/Instagram
  const mobilePosts = [
    {
      id: '1',
      type: 'video',
      author: {
        name: 'Marie Expert VTC',
        username: '@marie_vtc',
        avatar: '👩‍💼',
        verified: true,
        followers: '12.8K'
      },
      content: {
        text: '🔥 ASTUCE VTC : Comment j\'ai économisé 2000€ sur mon assurance ! Thread 👇',
        video: '/videos/astuce-vtc.mp4',
        thumbnail: '/thumbnails/astuce-vtc.jpg',
        duration: 45
      },
      engagement: {
        likes: 1247,
        comments: 89,
        shares: 234,
        saves: 156
      },
      tags: ['#VTC', '#Assurance', '#Économies', '#Astuce'],
      isLiked: false,
      isSaved: false,
      createdAt: '2h'
    },
    {
      id: '2',
      type: 'carousel',
      author: {
        name: 'Alex Deals Master',
        username: '@alex_deals',
        avatar: '🧑‍💻',
        verified: false,
        followers: '8.9K'
      },
      content: {
        text: '💰 BON PLAN : Vol Paris-Tokyo à 299€ au lieu de 899€ ! Lien en bio',
        images: ['/deals/vol-tokyo-1.jpg', '/deals/vol-tokyo-2.jpg'],
        dealInfo: {
          originalPrice: 899,
          dealPrice: 299,
          savings: 600,
          commission: 45
        }
      },
      engagement: {
        likes: 2156,
        comments: 145,
        shares: 567,
        saves: 289
      },
      tags: ['#BonPlan', '#Voyage', '#Tokyo', '#Deal'],
      isLiked: true,
      isSaved: true,
      createdAt: '4h'
    },
    {
      id: '3',
      type: 'live',
      author: {
        name: 'Sophie Immobilier',
        username: '@sophie_immo',
        avatar: '🏠',
        verified: true,
        followers: '15.2K'
      },
      content: {
        text: '🔴 LIVE : Visite appartement 3 pièces Paris 11ème - 350K€',
        liveInfo: {
          viewers: 234,
          duration: '12:34',
          isLive: true
        }
      },
      engagement: {
        likes: 567,
        comments: 234,
        shares: 89,
        saves: 45
      },
      tags: ['#Live', '#Immobilier', '#Paris', '#Visite'],
      isLiked: false,
      isSaved: false,
      createdAt: 'En direct'
    }
  ];

  const handleLike = (postId: string) => {
    // Logique de like
    console.log('Like post:', postId);
  };

  const handleShare = (postId: string) => {
    // Partage mobile natif
    if (navigator.share) {
      navigator.share({
        title: 'DiddyHome - Découvrez ce contenu',
        text: 'Regardez ce contenu sur DiddyHome',
        url: `${window.location.origin}/post/${postId}`
      });
    }
  };

  const handleSave = (postId: string) => {
    // Logique de sauvegarde
    console.log('Save post:', postId);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header avec tabs */}
      <div className="sticky top-0 z-40 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-lg">DiddyHome</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs horizontaux */}
        <div className="flex overflow-x-auto scrollbar-hide px-4 pb-3">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap mr-3 transition-all ${
                  isActive 
                    ? 'bg-white text-black' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-black' : tab.color}`} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtres rapides */}
      {showFilters && (
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {['Tendances', 'Suivis', 'Populaires', 'Récents', 'Près de moi'].map((filter) => (
              <button
                key={filter}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm whitespace-nowrap hover:bg-gray-700 transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feed principal */}
      <div className="pb-20">
        {mobilePosts.map((post) => (
          <div key={post.id} className="relative border-b border-gray-800">
            {/* Contenu du post */}
            <div className="relative">
              {/* Vidéo/Image */}
              {post.type === 'video' && (
                <div className="relative aspect-[9/16] bg-gray-900">
                  <video
                    className="w-full h-full object-cover"
                    poster={post.content.thumbnail}
                    loop
                    muted={isMuted}
                    onClick={() => {
                      if (isPlaying === post.id) {
                        setIsPlaying(null);
                      } else {
                        setIsPlaying(post.id);
                      }
                    }}
                  >
                    <source src={post.content.video} type="video/mp4" />
                  </video>
                  
                  {/* Play/Pause overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isPlaying !== post.id && (
                      <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    )}
                  </div>

                  {/* Durée */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {post.content.duration}s
                  </div>
                </div>
              )}

              {/* Carousel d'images */}
              {post.type === 'carousel' && (
                <div className="relative aspect-square bg-gray-900">
                  <img
                    src={post.content.images?.[0]}
                    alt="Post content"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                    1/{post.content.images?.length}
                  </div>
                  
                  {/* Deal badge */}
                  {post.content.dealInfo && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{Math.round((post.content.dealInfo.savings / post.content.dealInfo.originalPrice) * 100)}%
                    </div>
                  )}
                </div>
              )}

              {/* Live stream */}
              {post.type === 'live' && (
                <div className="relative aspect-[9/16] bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{post.author.avatar}</div>
                      <div className="text-xl font-bold mb-2">{post.author.name}</div>
                      <div className="text-sm opacity-75">En direct</div>
                    </div>
                  </div>
                  
                  {/* Live indicator */}
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>
                  
                  {/* Viewers */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{formatNumber(post.content.liveInfo?.viewers || 0)}</span>
                  </div>
                </div>
              )}

              {/* Overlay d'informations */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
                {/* Auteur */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                    {post.author.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{post.author.name}</span>
                      {post.author.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="text-gray-300 text-sm">{post.author.followers} • {post.createdAt}</div>
                  </div>
                  <button className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium">
                    Suivre
                  </button>
                </div>

                {/* Contenu texte */}
                <p className="text-white mb-3 leading-relaxed">{post.content.text}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="text-blue-400 text-sm hover:underline">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Deal info */}
                {post.content.dealInfo && (
                  <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-green-400 text-sm">Économisez</div>
                        <div className="text-white font-bold text-lg">{post.content.dealInfo.savings}€</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 text-sm line-through">{post.content.dealInfo.originalPrice}€</div>
                        <div className="text-green-400 font-bold text-lg">{post.content.dealInfo.dealPrice}€</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions verticales (style TikTok) */}
              <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    post.isLiked ? 'bg-red-500' : 'bg-black bg-opacity-50'
                  }`}>
                    <Heart className={`h-6 w-6 ${post.isLiked ? 'text-white fill-current' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-xs font-medium">{formatNumber(post.engagement.likes)}</span>
                </button>

                <button
                  onClick={() => {/* Ouvrir commentaires */}}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">{formatNumber(post.engagement.comments)}</span>
                </button>

                <button
                  onClick={() => handleShare(post.id)}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">{formatNumber(post.engagement.shares)}</span>
                </button>

                <button
                  onClick={() => handleSave(post.id)}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    post.isSaved ? 'bg-yellow-500' : 'bg-black bg-opacity-50'
                  }`}>
                    <Bookmark className={`h-6 w-6 ${post.isSaved ? 'text-white fill-current' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-xs font-medium">{formatNumber(post.engagement.saves)}</span>
                </button>

                <button className="flex flex-col items-center space-y-1">
                  <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <MoreHorizontal className="h-6 w-6 text-white" />
                  </div>
                </button>
              </div>

              {/* Contrôles audio (pour vidéos) */}
              {post.type === 'video' && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-4 left-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-white" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <button className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
          <Plus className="h-7 w-7 text-white" />
        </button>
      </div>
    </div>
  );
}
