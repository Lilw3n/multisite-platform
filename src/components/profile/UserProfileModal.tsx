'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/profile';
import { ProfileService } from '@/lib/profileService';
import { 
  X,
  MapPin,
  Globe,
  Calendar,
  Star,
  Users,
  Heart,
  MessageCircle,
  UserPlus,
  Crown,
  Award,
  TrendingUp,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  ExternalLink,
  Shield,
  Zap,
  Target,
  Gift,
  Camera,
  Edit3
} from 'lucide-react';

interface UserProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

export default function UserProfileModal({ 
  profile, 
  isOpen, 
  onClose, 
  currentUserId 
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'deals' | 'reviews'>('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  if (!isOpen) return null;

  const handleFollow = () => {
    if (currentUserId) {
      const newFollowState = ProfileService.toggleFollow(currentUserId, profile.id);
      setIsFollowing(newFollowState);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 bg-yellow-100 border-yellow-300';
      case 'epic': return 'text-purple-500 bg-purple-100 border-purple-300';
      case 'rare': return 'text-blue-500 bg-blue-100 border-blue-300';
      default: return 'text-gray-500 bg-gray-100 border-gray-300';
    }
  };

  const getLevelColor = (color: string) => {
    const colors = {
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      pink: 'from-pink-500 to-pink-600',
      blue: 'from-blue-500 to-blue-600',
      gold: 'from-yellow-500 to-yellow-600'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          {/* Cover photo */}
          <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Profile info overlay */}
          <div className="absolute -bottom-16 left-6 flex items-end space-x-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                {profile.avatar || profile.displayName.charAt(0)}
              </div>
              {profile.isOnline && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 pb-6">
          {/* Profile header */}
          <div className="px-6 pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{profile.displayName}</h1>
                  {profile.isVerified && (
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                      <Shield className="h-4 w-4" />
                      <span>Vérifié</span>
                    </div>
                  )}
                  {profile.business?.isCreator && (
                    <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-sm">
                      <Crown className="h-4 w-4" />
                      <span>Créateur</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 mb-2">@{profile.username}</p>
                
                {/* Niveau et XP */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getLevelColor(profile.level.color)} text-white font-medium`}>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Niveau {profile.level.level} - {profile.level.name}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {profile.level.xp.toLocaleString()} XP
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">{profile.bio}</p>
                )}

                {/* Informations */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  {profile.location && profile.preferences.showLocation && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Rejoint le {new Date(profile.joinDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  
                  {!profile.isOnline && profile.lastSeen && (
                    <div className="flex items-center space-x-1">
                      <span>Vu pour la dernière fois le {new Date(profile.lastSeen).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>

                {/* Liens sociaux */}
                {profile.socialLinks.length > 0 && (
                  <div className="flex space-x-3 mb-4">
                    {profile.socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {getSocialIcon(link.platform)}
                        {link.verified && <span className="text-green-500">✓</span>}
                      </a>
                    ))}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isFollowing ? 'Suivi' : 'Suivre'}</span>
                </button>
                
                <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Message</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            {profile.preferences.showStats && (
              <div className="grid grid-cols-4 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.posts.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.followers.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.following.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.likes.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Likes</div>
                </div>
              </div>
            )}
          </div>

          {/* Badges et achievements */}
          {profile.badges.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Badges et Achievements</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profile.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-lg border ${getBadgeColor(badge.rarity)} transition-all hover:scale-105`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{badge.icon}</span>
                      <span className="font-medium">{badge.name}</span>
                    </div>
                    <p className="text-xs opacity-80">{badge.description}</p>
                    <p className="text-xs opacity-60 mt-1">
                      Obtenu le {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business info */}
          {profile.business && (profile.business.isCreator || profile.business.isVendor) && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Profil Business</span>
              </h3>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg">{profile.business.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">{profile.business.reviewsCount} avis</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">{profile.stats.earnings}€</div>
                    <div className="text-sm text-gray-600">Ce mois</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-600">{profile.stats.deals}</div>
                    <div className="text-sm text-gray-600">Deals réussis</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-bold text-lg text-purple-600">{profile.business.creatorLevel}</div>
                    <div className="text-sm text-gray-600">Niveau créateur</div>
                  </div>
                </div>
                
                <div className="mt-3 text-center">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    {profile.business.category}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="px-6">
            <div className="flex space-x-6 border-b border-gray-200 mb-4">
              {['overview', 'posts', 'deals', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'overview' && 'Aperçu'}
                  {tab === 'posts' && 'Posts'}
                  {tab === 'deals' && 'Deals'}
                  {tab === 'reviews' && 'Avis'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="max-h-64 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="text-center text-gray-500 py-8">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Contenu du profil à venir...</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'posts' && (
                <div className="text-center text-gray-500 py-8">
                  <Edit3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Posts récents à venir...</p>
                </div>
              )}
              
              {activeTab === 'deals' && (
                <div className="text-center text-gray-500 py-8">
                  <Gift className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Deals partagés à venir...</p>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="text-center text-gray-500 py-8">
                  <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Avis et évaluations à venir...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
