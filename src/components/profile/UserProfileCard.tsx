'use client';

import React from 'react';
import { UserProfile } from '@/types/profile';
import { 
  User, 
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
  Eye
} from 'lucide-react';

interface UserProfileCardProps {
  profile: UserProfile;
  onClick?: () => void;
  showFullStats?: boolean;
  compact?: boolean;
}

export default function UserProfileCard({ 
  profile, 
  onClick, 
  showFullStats = false,
  compact = false 
}: UserProfileCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 bg-yellow-100';
      case 'epic': return 'text-purple-500 bg-purple-100';
      case 'rare': return 'text-blue-500 bg-blue-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getLevelColor = (color: string) => {
    const colors = {
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      blue: 'bg-blue-500',
      gold: 'bg-yellow-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  if (compact) {
    return (
      <div 
        onClick={handleClick}
        className="flex items-center space-x-3 p-3 bg-white rounded-lg border hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
            {profile.avatar || profile.displayName.charAt(0)}
          </div>
          {profile.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {profile.displayName}
            </h3>
            {profile.isVerified && (
              <span className="text-blue-500">✅</span>
            )}
            {profile.business?.isCreator && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">@{profile.username}</p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>{profile.stats.followers}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header avec avatar et statut */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {profile.avatar || profile.displayName.charAt(0)}
            </div>
            {profile.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {profile.displayName}
              </h3>
              {profile.isVerified && (
                <span className="text-blue-500 text-lg">✅</span>
              )}
            </div>
            <p className="text-gray-600">@{profile.username}</p>
            
            {/* Niveau */}
            <div className="flex items-center space-x-2 mt-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getLevelColor(profile.level.color)}`}>
                Niv. {profile.level.level}
              </div>
              <span className="text-sm font-medium text-gray-700">{profile.level.name}</span>
            </div>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          {profile.badges.slice(0, 2).map((badge) => (
            <div
              key={badge.id}
              className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge.rarity)}`}
              title={badge.description}
            >
              {badge.icon}
            </div>
          ))}
          {profile.business?.isCreator && (
            <div className="px-2 py-1 rounded-full text-xs font-medium text-yellow-600 bg-yellow-100">
              <Crown className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-gray-700 mb-4 line-clamp-2">{profile.bio}</p>
      )}

      {/* Informations */}
      <div className="space-y-2 mb-4">
        {profile.location && profile.preferences.showLocation && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>
        )}
        
        {profile.website && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Globe className="h-4 w-4" />
            <a 
              href={profile.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {profile.website.replace('https://', '')}
            </a>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Rejoint le {new Date(profile.joinDate).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Stats */}
      {profile.preferences.showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">{profile.stats.posts}</div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">{profile.stats.followers}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">{profile.stats.following}</div>
            <div className="text-xs text-gray-500">Following</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">{profile.stats.likes}</div>
            <div className="text-xs text-gray-500">Likes</div>
          </div>
        </div>
      )}

      {/* Stats business si créateur/vendeur */}
      {profile.business && (profile.business.isCreator || profile.business.isVendor) && showFullStats && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-gray-900">Profil Business</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-bold">{profile.business.rating}</span>
                <span className="text-sm text-gray-600">({profile.business.reviewsCount} avis)</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-bold">{profile.stats.earnings}€</span>
                <span className="text-sm text-gray-600">ce mois</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              {profile.business.creatorLevel} Creator
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          onClick={(e) => {
            e.stopPropagation();
            // Logique de suivi
          }}
        >
          <UserPlus className="h-4 w-4" />
          <span>Suivre</span>
        </button>
        
        <button 
          className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            // Logique de message
          }}
        >
          <MessageCircle className="h-4 w-4" />
        </button>
        
        <button 
          className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            // Voir le profil complet
            if (onClick) onClick();
          }}
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
