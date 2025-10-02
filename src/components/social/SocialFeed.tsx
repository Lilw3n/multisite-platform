'use client';

import React, { useState, useEffect } from 'react';
import UserProfileCard from '../profile/UserProfileCard';
import UserProfileModal from '../profile/UserProfileModal';
import { ProfileService } from '@/lib/profileService';
import { UserProfile } from '@/types/profile';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Pause, Volume2, VolumeX, User, Verified, TrendingUp, Star, Users, Eye } from 'lucide-react';

interface SocialPost {
  id: string;
  type: 'video' | 'image' | 'text' | 'poll' | 'tip' | 'testimonial';
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    role: 'client' | 'expert' | 'team' | 'partner';
    badge?: string;
  };
  content: {
    text?: string;
    media?: string;
    thumbnail?: string;
    duration?: number;
    poll?: {
      question: string;
      options: Array<{ id: string; text: string; votes: number }>;
      totalVotes: number;
    };
    tip?: {
      title: string;
      category: 'assurance' | 'conduite' | 'business' | 'legal';
      difficulty: 'débutant' | 'intermédiaire' | 'expert';
    };
    testimonial?: {
      rating: number;
      service: string;
      beforeAfter?: { before: string; after: string };
    };
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    views?: number;
  };
  tags: string[];
  location?: string;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  leadMagnet?: {
    type: 'quote' | 'guide' | 'consultation' | 'calculator';
    title: string;
    description: string;
    ctaText: string;
  };
}

interface SocialFeedProps {
  userRole?: 'guest' | 'client' | 'internal';
  onLeadGenerated?: (leadData: any) => void;
}

export default function SocialFeed({ userRole = 'guest', onLeadGenerated }: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showProfiles, setShowProfiles] = useState(false);

  useEffect(() => {
    loadPosts();
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const loadedProfiles = ProfileService.loadProfiles();
    setProfiles(loadedProfiles.slice(0, 6)); // Afficher les 6 premiers profils
  };

  const loadPosts = async () => {
    setIsLoading(true);
    
    // Données mockées pour le feed social
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        type: 'tip',
        author: {
          id: 'expert1',
          name: 'Marie Expert VTC',
          avatar: '👩‍💼',
          verified: true,
          role: 'expert',
          badge: 'Expert Assurance'
        },
        content: {
          text: '🚗 ASTUCE VTC : Saviez-vous que votre coefficient de réduction-majoration (CRM) peut faire économiser jusqu\'à 50% sur votre prime d\'assurance ? Voici comment l\'optimiser...',
          media: '/tip-video-1.mp4',
          thumbnail: '/tip-thumb-1.jpg',
          duration: 45,
          tip: {
            title: 'Optimiser son CRM pour économiser',
            category: 'assurance',
            difficulty: 'intermédiaire'
          }
        },
        engagement: {
          likes: 234,
          comments: 18,
          shares: 45,
          saves: 67,
          views: 1250
        },
        tags: ['#VTC', '#Assurance', '#Économies', '#CRM'],
        createdAt: '2024-01-15T10:30:00Z',
        isLiked: false,
        isSaved: false,
        isFollowing: true,
        leadMagnet: {
          type: 'calculator',
          title: 'Calculateur CRM',
          description: 'Calculez vos économies potentielles',
          ctaText: 'Calculer mes économies'
        }
      },
      {
        id: '2',
        type: 'testimonial',
        author: {
          id: 'client1',
          name: 'Jean Dupont',
          avatar: '👨',
          verified: false,
          role: 'client'
        },
        content: {
          text: 'Incroyable ! Grâce à DiddyHome, j\'ai économisé 400€ sur mon assurance VTC cette année. Le service client est exceptionnel ! 🙏',
          testimonial: {
            rating: 5,
            service: 'Assurance VTC Premium',
            beforeAfter: {
              before: '1200€/an',
              after: '800€/an'
            }
          }
        },
        engagement: {
          likes: 89,
          comments: 12,
          shares: 23,
          saves: 34
        },
        tags: ['#Témoignage', '#Économies', '#ServiceClient'],
        location: 'Paris, France',
        createdAt: '2024-01-14T15:45:00Z',
        isLiked: true,
        isSaved: false,
        isFollowing: false,
        leadMagnet: {
          type: 'quote',
          title: 'Devis gratuit',
          description: 'Obtenez votre devis personnalisé',
          ctaText: 'Mon devis gratuit'
        }
      },
      {
        id: '3',
        type: 'poll',
        author: {
          id: 'team1',
          name: 'DiddyHome Team',
          avatar: '🏠',
          verified: true,
          role: 'team',
          badge: 'Équipe Officielle'
        },
        content: {
          text: 'Quel est votre plus grand défi en tant que chauffeur VTC ? Aidez-nous à mieux vous accompagner ! 🤔',
          poll: {
            question: 'Votre plus grand défi VTC ?',
            options: [
              { id: '1', text: 'Trouver une assurance abordable', votes: 156 },
              { id: '2', text: 'Gérer la paperasse administrative', votes: 89 },
              { id: '3', text: 'Optimiser mes revenus', votes: 234 },
              { id: '4', text: 'Maintenir mon véhicule', votes: 67 }
            ],
            totalVotes: 546
          }
        },
        engagement: {
          likes: 78,
          comments: 45,
          shares: 12,
          saves: 23
        },
        tags: ['#Sondage', '#VTC', '#Communauté'],
        createdAt: '2024-01-13T09:15:00Z',
        isLiked: false,
        isSaved: true,
        isFollowing: true,
        leadMagnet: {
          type: 'guide',
          title: 'Guide VTC 2024',
          description: 'Tout savoir pour réussir en VTC',
          ctaText: 'Télécharger le guide'
        }
      },
      {
        id: '4',
        type: 'video',
        author: {
          id: 'expert2',
          name: 'Thomas Assurance Pro',
          avatar: '👨‍💼',
          verified: true,
          role: 'expert',
          badge: 'Courtier Certifié'
        },
        content: {
          text: '⚡ BREAKING : Nouvelles réglementations 2024 pour les VTC ! Ce qui change pour votre assurance...',
          media: '/news-video-1.mp4',
          thumbnail: '/news-thumb-1.jpg',
          duration: 120
        },
        engagement: {
          likes: 445,
          comments: 67,
          shares: 89,
          saves: 123,
          views: 2340
        },
        tags: ['#Actualités', '#Réglementation', '#VTC2024'],
        createdAt: '2024-01-12T14:20:00Z',
        isLiked: false,
        isSaved: false,
        isFollowing: false,
        leadMagnet: {
          type: 'consultation',
          title: 'Consultation gratuite',
          description: 'Analysons votre situation',
          ctaText: 'Réserver ma consultation'
        }
      }
    ];

    setPosts(mockPosts);
    setIsLoading(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            engagement: {
              ...post.engagement,
              likes: post.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1
            }
          }
        : post
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isSaved: !post.isSaved,
            engagement: {
              ...post.engagement,
              saves: post.isSaved ? post.engagement.saves - 1 : post.engagement.saves + 1
            }
          }
        : post
    ));
  };

  const handleFollow = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isFollowing: !post.isFollowing }
        : post
    ));
  };

  const handleLeadMagnet = (post: SocialPost) => {
    if (onLeadGenerated && post.leadMagnet) {
      onLeadGenerated({
        type: post.leadMagnet.type,
        postId: post.id,
        authorId: post.author.id,
        leadMagnet: post.leadMagnet,
        userRole
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'expert': return 'text-blue-600';
      case 'team': return 'text-purple-600';
      case 'partner': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'expert': return '🎓';
      case 'team': return '🏠';
      case 'partner': return '🤝';
      case 'client': return '👤';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="p-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                    {post.author.avatar}
                  </div>
                  {post.author.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Verified className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-semibold ${getRoleColor(post.author.role)}`}>
                      {post.author.name}
                    </h3>
                    <span className="text-sm">{getRoleBadge(post.author.role)}</span>
                    {post.author.badge && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {post.author.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{formatTimeAgo(post.createdAt)}</span>
                    {post.location && (
                      <>
                        <span>•</span>
                        <span>{post.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!post.isFollowing && userRole !== 'guest' && (
                  <button
                    onClick={() => handleFollow(post.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Suivre
                  </button>
                )}
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            {post.content.text && (
              <p className="text-gray-900 mb-3 leading-relaxed">
                {post.content.text}
              </p>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Type-specific content */}
            {post.type === 'tip' && post.content.tip && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-yellow-800">{post.content.tip.title}</span>
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                    {post.content.tip.difficulty}
                  </span>
                </div>
              </div>
            )}

            {post.type === 'testimonial' && post.content.testimonial && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < post.content.testimonial!.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-green-700 font-medium">
                    {post.content.testimonial.service}
                  </span>
                </div>
                {post.content.testimonial.beforeAfter && (
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-red-600">Avant: {post.content.testimonial.beforeAfter.before}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600 font-semibold">Après: {post.content.testimonial.beforeAfter.after}</span>
                  </div>
                )}
              </div>
            )}

            {post.type === 'poll' && post.content.poll && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                <h4 className="font-semibold text-gray-900 mb-3">{post.content.poll.question}</h4>
                <div className="space-y-2">
                  {post.content.poll.options.map((option) => {
                    const percentage = Math.round((option.votes / post.content.poll!.totalVotes) * 100);
                    return (
                      <div key={option.id} className="relative">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                          <span className="text-sm font-medium">{option.text}</span>
                          <span className="text-sm text-gray-500">{percentage}%</span>
                        </div>
                        <div
                          className="absolute left-0 top-0 h-full bg-blue-100 rounded-lg transition-all"
                          style={{ width: `${percentage}%`, zIndex: 0 }}
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {formatNumber(post.content.poll.totalVotes)} votes
                </p>
              </div>
            )}
          </div>

          {/* Media */}
          {post.content.media && (
            <div className="relative">
              {post.type === 'video' ? (
                <div className="relative bg-black">
                  <img
                    src={post.content.thumbnail || '/default-video-thumb.jpg'}
                    alt="Video thumbnail"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    </button>
                  </div>
                  {post.content.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(post.content.duration / 60)}:{(post.content.duration % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                  {post.engagement.views && (
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{formatNumber(post.engagement.views)} vues</span>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={post.content.media}
                  alt="Post media"
                  className="w-full h-64 object-cover"
                />
              )}
            </div>
          )}

          {/* Lead Magnet */}
          {post.leadMagnet && (
            <div className="mx-4 mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">{post.leadMagnet.title}</h4>
                  <p className="text-sm text-blue-700">{post.leadMagnet.description}</p>
                </div>
                <button
                  onClick={() => handleLeadMagnet(post)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {post.leadMagnet.ctaText}
                </button>
              </div>
            </div>
          )}

          {/* Engagement */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{formatNumber(post.engagement.likes)}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{formatNumber(post.engagement.comments)}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">{formatNumber(post.engagement.shares)}</span>
                </button>
              </div>
              
              <button
                onClick={() => handleSave(post.id)}
                className={`transition-colors ${
                  post.isSaved ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Section profils recommandés */}
      {profiles.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Membres à découvrir</span>
            </h3>
            <button
              onClick={() => setShowProfiles(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir tous →
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <UserProfileCard
                key={profile.id}
                profile={profile}
                onClick={() => setSelectedProfile(profile)}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Modal de profil */}
    {selectedProfile && (
      <UserProfileModal
        profile={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        currentUserId="current-user"
      />
    )}
    </div>
  );
}
