'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Clock, 
  Calendar,
  Filter,
  Search,
  Grid,
  List,
  TrendingUp,
  ExternalLink,
  Radio,
  Video,
  Image,
  FileText,
  Headphones
} from 'lucide-react';
import { SocialContent, ContentFilter, SocialPlatform, ContentType } from '@/types/socialNetworks';
import SocialNetworksService from '@/lib/socialNetworksService';

interface SocialContentAggregatorProps {
  profileId: string;
  showFilters?: boolean;
  maxItems?: number;
  viewMode?: 'grid' | 'list';
}

export default function SocialContentAggregator({ 
  profileId, 
  showFilters = true, 
  maxItems = 50,
  viewMode: initialViewMode = 'grid'
}: SocialContentAggregatorProps) {
  const [content, setContent] = useState<SocialContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<SocialContent[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filter, setFilter] = useState<ContentFilter>({
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const platforms = SocialNetworksService.getAvailablePlatforms();

  useEffect(() => {
    loadContent();
  }, [profileId]);

  useEffect(() => {
    applyFilters();
  }, [content, filter, searchQuery]);

  const loadContent = () => {
    const mockContent = SocialNetworksService.generateMockContent(profileId);
    setContent(mockContent);
  };

  const applyFilters = () => {
    let filtered = SocialNetworksService.filterContent(content, {
      ...filter,
      searchQuery: searchQuery || undefined
    });

    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    setFilteredContent(filtered);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'livestream': return <Radio className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'replay': return <Play className="w-4 h-4" />;
      case 'short': return <Video className="w-4 h-4" />;
      case 'clip': return <Video className="w-4 h-4" />;
      case 'photo': return <Image className="w-4 h-4" />;
      case 'post': return <FileText className="w-4 h-4" />;
      case 'story': return <Image className="w-4 h-4" />;
      case 'podcast': return <Headphones className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getContentTypeColor = (type: ContentType) => {
    switch (type) {
      case 'livestream': return 'bg-red-100 text-red-700';
      case 'video': return 'bg-blue-100 text-blue-700';
      case 'replay': return 'bg-purple-100 text-purple-700';
      case 'short': return 'bg-green-100 text-green-700';
      case 'clip': return 'bg-yellow-100 text-yellow-700';
      case 'photo': return 'bg-pink-100 text-pink-700';
      case 'post': return 'bg-gray-100 text-gray-700';
      case 'story': return 'bg-orange-100 text-orange-700';
      case 'podcast': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPlatformInfo = (platform: SocialPlatform) => {
    return platforms.find(p => p.id === platform) || platforms[platforms.length - 1];
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredContent.map((item) => {
        const platformInfo = getPlatformInfo(item.platform);
        
        return (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-200">
              {item.thumbnailUrl ? (
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {getContentTypeIcon(item.type)}
                </div>
              )}
              
              {/* Overlays */}
              <div className="absolute top-2 left-2 flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentTypeColor(item.type)} flex items-center space-x-1`}>
                  {getContentTypeIcon(item.type)}
                  <span className="capitalize">{item.type}</span>
                </span>
                
                {item.isLive && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Radio className="w-3 h-3" />
                    <span>LIVE</span>
                  </span>
                )}
              </div>
              
              <div className="absolute top-2 right-2">
                <span className={`w-8 h-8 ${platformInfo.color} rounded-full flex items-center justify-center text-white text-sm`}>
                  {platformInfo.icon}
                </span>
              </div>
              
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {formatDuration(item.duration)}
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              {item.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
              
              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-4">
                  {item.viewCount && (
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(item.viewCount)}</span>
                    </span>
                  )}
                  
                  {item.likeCount && (
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{formatNumber(item.likeCount)}</span>
                    </span>
                  )}
                  
                  {item.isLive && item.liveViewers && (
                    <span className="flex items-center space-x-1 text-red-500">
                      <Users className="w-4 h-4" />
                      <span>{formatNumber(item.liveViewers)}</span>
                    </span>
                  )}
                </div>
                
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              {/* Date */}
              <div className="text-xs text-gray-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(item.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              
              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-gray-400 text-xs">+{item.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredContent.map((item) => {
        const platformInfo = getPlatformInfo(item.platform);
        
        return (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              {/* Thumbnail */}
              <div className="relative w-32 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {item.thumbnailUrl ? (
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {getContentTypeIcon(item.type)}
                  </div>
                )}
                
                {item.duration && (
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white px-1 py-0.5 rounded text-xs">
                    {formatDuration(item.duration)}
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-6 h-6 ${platformInfo.color} rounded-full flex items-center justify-center text-white text-xs`}>
                      {platformInfo.icon}
                    </span>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentTypeColor(item.type)} flex items-center space-x-1`}>
                      {getContentTypeIcon(item.type)}
                      <span className="capitalize">{item.type}</span>
                    </span>
                    
                    {item.isLive && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <Radio className="w-3 h-3" />
                        <span>LIVE</span>
                      </span>
                    )}
                  </div>
                  
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {item.title}
                </h3>
                
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {item.viewCount && (
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(item.viewCount)}</span>
                      </span>
                    )}
                    
                    {item.likeCount && (
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{formatNumber(item.likeCount)}</span>
                      </span>
                    )}
                    
                    {item.isLive && item.liveViewers && (
                      <span className="flex items-center space-x-1 text-red-500">
                        <Users className="w-4 h-4" />
                        <span>{formatNumber(item.liveViewers)}</span>
                      </span>
                    )}
                    
                    <span className="flex items-center text-xs text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.publishedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-gray-400 text-xs">+{item.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Recherche */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher du contenu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Contrôles */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  showFilterPanel 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Panel de filtres */}
          {showFilterPanel && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Plateformes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plateformes
                  </label>
                  <select
                    multiple
                    value={filter.platforms || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value as SocialPlatform);
                      setFilter(prev => ({ ...prev, platforms: selected.length ? selected : undefined }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {platforms.slice(0, -1).map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.icon} {platform.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Types de contenu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Types de contenu
                  </label>
                  <select
                    multiple
                    value={filter.contentTypes || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value as ContentType);
                      setFilter(prev => ({ ...prev, contentTypes: selected.length ? selected : undefined }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="video">Vidéo</option>
                    <option value="livestream">Live</option>
                    <option value="replay">Rediffusion</option>
                    <option value="short">Short</option>
                    <option value="clip">Clip</option>
                    <option value="post">Post</option>
                    <option value="photo">Photo</option>
                    <option value="story">Story</option>
                  </select>
                </div>
                
                {/* Tri */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trier par
                  </label>
                  <select
                    value={filter.sortBy || 'date'}
                    onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Date</option>
                    <option value="views">Vues</option>
                    <option value="likes">Likes</option>
                    <option value="relevance">Pertinence</option>
                  </select>
                </div>
                
                {/* Ordre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre
                  </label>
                  <select
                    value={filter.sortOrder || 'desc'}
                    onChange={(e) => setFilter(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Décroissant</option>
                    <option value="asc">Croissant</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setFilter({ sortBy: 'date', sortOrder: 'desc' });
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Statistiques */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{filteredContent.length} contenu{filteredContent.length > 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{filteredContent.filter(c => c.isLive).length} live{filteredContent.filter(c => c.isLive).length > 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{filteredContent.reduce((sum, c) => sum + (c.viewCount || 0), 0).toLocaleString()} vues totales</span>
          </div>
          
          <button
            onClick={loadContent}
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>
      
      {/* Contenu */}
      {filteredContent.length > 0 ? (
        viewMode === 'grid' ? renderGridView() : renderListView()
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-2">Aucun contenu trouvé</p>
          <p className="text-sm text-gray-400">
            {searchQuery || filter.platforms?.length || filter.contentTypes?.length
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Ajoutez des réseaux sociaux pour voir le contenu agrégé'
            }
          </p>
        </div>
      )}
    </div>
  );
}
