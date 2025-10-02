'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/profile';
import { ProfileService } from '@/lib/profileService';
import UserProfileCard from './UserProfileCard';
import UserProfileModal from './UserProfileModal';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Crown, 
  Award,
  MapPin,
  Star,
  Zap
} from 'lucide-react';

interface ProfileDirectoryProps {
  showSearch?: boolean;
  showFilters?: boolean;
  layout?: 'grid' | 'list';
  limit?: number;
}

export default function ProfileDirectory({ 
  showSearch = true,
  showFilters = true,
  layout = 'grid',
  limit 
}: ProfileDirectoryProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'creators' | 'verified' | 'online'>('all');
  const [sortBy, setSortBy] = useState<'followers' | 'level' | 'recent' | 'rating'>('followers');

  useEffect(() => {
    const loadedProfiles = ProfileService.loadProfiles();
    setProfiles(loadedProfiles);
    setFilteredProfiles(loadedProfiles);
  }, []);

  useEffect(() => {
    let filtered = [...profiles];

    // Recherche
    if (searchQuery.trim()) {
      filtered = ProfileService.searchProfiles(searchQuery);
    }

    // Filtres
    switch (activeFilter) {
      case 'trending':
        filtered = ProfileService.getTrendingProfiles(filtered.length);
        break;
      case 'creators':
        filtered = filtered.filter(p => p.business?.isCreator);
        break;
      case 'verified':
        filtered = filtered.filter(p => p.isVerified);
        break;
      case 'online':
        filtered = filtered.filter(p => p.isOnline);
        break;
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'followers':
          return b.stats.followers - a.stats.followers;
        case 'level':
          return b.level.level - a.level.level;
        case 'recent':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'rating':
          const ratingA = a.business?.rating || 0;
          const ratingB = b.business?.rating || 0;
          return ratingB - ratingA;
        default:
          return 0;
      }
    });

    // Limite
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    setFilteredProfiles(filtered);
  }, [profiles, searchQuery, activeFilter, sortBy, limit]);

  const handleProfileClick = (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      case 'creators': return <Crown className="h-4 w-4" />;
      case 'verified': return <Award className="h-4 w-4" />;
      case 'online': return <Zap className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec recherche et filtres */}
      {(showSearch || showFilters) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Recherche */}
            {showSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher des profils..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Filtres */}
            {showFilters && (
              <div className="flex flex-wrap items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                
                {/* Filtres par catégorie */}
                <div className="flex space-x-1">
                  {[
                    { key: 'all', label: 'Tous' },
                    { key: 'trending', label: 'Tendance' },
                    { key: 'creators', label: 'Créateurs' },
                    { key: 'verified', label: 'Vérifiés' },
                    { key: 'online', label: 'En ligne' }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key as any)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === filter.key
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {getFilterIcon(filter.key)}
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tri */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="followers">Plus de followers</option>
                  <option value="level">Niveau le plus élevé</option>
                  <option value="recent">Plus récents</option>
                  <option value="rating">Mieux notés</option>
                </select>
              </div>
            )}
          </div>

          {/* Stats rapides */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredProfiles.length}</div>
              <div className="text-sm text-gray-500">Profils trouvés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredProfiles.filter(p => p.isOnline).length}
              </div>
              <div className="text-sm text-gray-500">En ligne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredProfiles.filter(p => p.business?.isCreator).length}
              </div>
              <div className="text-sm text-gray-500">Créateurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredProfiles.filter(p => p.isVerified).length}
              </div>
              <div className="text-sm text-gray-500">Vérifiés</div>
            </div>
          </div>
        </div>
      )}

      {/* Résultats */}
      <div className="space-y-4">
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun profil trouvé</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `Aucun résultat pour "${searchQuery}"`
                : 'Essayez de modifier vos filtres de recherche'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Layout Grid */}
            {layout === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <UserProfileCard
                    key={profile.id}
                    profile={profile}
                    onClick={() => handleProfileClick(profile)}
                    showFullStats={true}
                  />
                ))}
              </div>
            )}

            {/* Layout List */}
            {layout === 'list' && (
              <div className="space-y-3">
                {filteredProfiles.map((profile) => (
                  <UserProfileCard
                    key={profile.id}
                    profile={profile}
                    onClick={() => handleProfileClick(profile)}
                    compact={true}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de profil */}
      {selectedProfile && (
        <UserProfileModal
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          currentUserId="current-user" // À remplacer par l'ID de l'utilisateur actuel
        />
      )}
    </div>
  );
}
