'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Settings, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  Calendar,
  Globe,
  Plus,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { Interlocutor } from '@/types/interlocutor';
import { SocialProfile, SocialAnalytics } from '@/types/socialNetworks';
import { InterlocutorService } from '@/lib/interlocutors';
import SocialNetworksService from '@/lib/socialNetworksService';
import SocialNetworksManager from '@/components/social/SocialNetworksManager';
import SocialContentAggregator from '@/components/social/SocialContentAggregator';

export default function InterlocutorSocialPage() {
  const params = useParams();
  const interlocutorId = params.id as string;
  
  const [interlocutor, setInterlocutor] = useState<Interlocutor | null>(null);
  const [socialProfile, setSocialProfile] = useState<SocialProfile | null>(null);
  const [analytics, setAnalytics] = useState<SocialAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'networks' | 'analytics'>('content');
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [interlocutorId]);

  const loadData = async () => {
    setIsLoading(true);
    
    // Charger l'interlocuteur
    const interlocutorData = await InterlocutorService.getInterlocutorById(interlocutorId);
    setInterlocutor(interlocutorData);
    
    // Charger le profil social
    let profile = SocialNetworksService.getProfileByInterlocutor(interlocutorId);
    
    // Si pas de profil et que c'est Lilwen, créer le profil par défaut
    if (!profile && (interlocutorData?.firstName?.toLowerCase() === 'lilwen' || interlocutorData?.lastName?.toLowerCase() === 'lilwen')) {
      const defaultProfiles = SocialNetworksService.getDefaultProfiles();
      const lilwenProfile = defaultProfiles.find(p => p.pseudonym === 'Lilwen');
      if (lilwenProfile) {
        profile = await SocialNetworksService.createProfile({
          ...lilwenProfile,
          interlocutorId: interlocutorId
        });
      }
    }
    
    setSocialProfile(profile);
    
    // Charger les analytics si profil existe
    if (profile) {
      const analyticsData = SocialNetworksService.getAnalytics(profile.id);
      setAnalytics(analyticsData);
    }
    
    setIsLoading(false);
  };

  const handleCreateProfile = async () => {
    if (!interlocutor) return;
    
    const newProfile = await SocialNetworksService.createProfile({
      interlocutorId: interlocutorId,
      pseudonym: interlocutor.firstName || 'Utilisateur',
      isAnonymous: false,
      isPublic: true,
      socialNetworks: [],
      contentAggregation: {
        autoSync: true,
        syncInterval: 60,
        enabledContentTypes: ['video', 'livestream', 'replay', 'short'],
        enabledPlatforms: ['twitch', 'youtube', 'tiktok'],
        maxContentAge: 30,
        sortBy: 'date',
        sortOrder: 'desc'
      }
    });
    
    setSocialProfile(newProfile);
    setShowCreateProfile(false);
    
    // Charger les analytics
    const analyticsData = SocialNetworksService.getAnalytics(newProfile.id);
    setAnalytics(analyticsData);
  };

  const handleNetworkChange = () => {
    // Recharger les données quand un réseau est modifié
    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du hub social...</p>
        </div>
      </div>
    );
  }

  if (!interlocutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Interlocuteur non trouvé</p>
          <Link href="/dashboard/interlocutors" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href={`/dashboard/interlocutors/${interlocutorId}`}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-blue-500" />
                  Hub Social - {interlocutor.firstName} {interlocutor.lastName}
                </h1>
                <p className="text-gray-600">
                  {socialProfile ? (
                    <>Pseudonyme: <span className="font-medium">{socialProfile.pseudonym}</span></>
                  ) : (
                    'Aucun profil social configuré'
                  )}
                </p>
              </div>
            </div>
            
            {socialProfile && (
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  socialProfile.isPublic 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {socialProfile.isPublic ? 'Public' : 'Privé'}
                </span>
                
                {socialProfile.isAnonymous && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    Anonyme
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!socialProfile ? (
          /* Création de profil */
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Créer un Hub Social
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Créez un profil social pour {interlocutor.firstName} {interlocutor.lastName} et commencez à 
              agréger du contenu depuis ses différents réseaux sociaux. Vous pourrez visualiser 
              ses vidéos, lives, posts et bien plus encore en un seul endroit.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ajouter des Réseaux</h3>
                <p className="text-sm text-gray-600">
                  Connectez Twitch, YouTube, TikTok, Instagram et plus encore
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Agrégation Intelligente</h3>
                <p className="text-sm text-gray-600">
                  Contenu automatiquement synchronisé et organisé
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analytics Avancées</h3>
                <p className="text-sm text-gray-600">
                  Statistiques détaillées et insights de performance
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCreateProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Créer le Hub Social</span>
            </button>
          </div>
        ) : (
          /* Hub social existant */
          <>
            {/* Analytics rapides */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Followers Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.totalFollowers.toLocaleString()}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Vues Totales</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.totalViews.toLocaleString()}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Likes Totaux</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.totalLikes.toLocaleString()}
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Engagement Moyen</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.averageEngagement.toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation des onglets */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'content'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4" />
                      <span>Contenu Agrégé</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('networks')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'networks'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Réseaux Sociaux ({socialProfile.socialNetworks.length})</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'analytics'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </div>
                  </button>
                </nav>
              </div>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'content' && (
              <SocialContentAggregator 
                profileId={socialProfile.id}
                showFilters={true}
                maxItems={50}
                viewMode="grid"
              />
            )}

            {activeTab === 'networks' && (
              <SocialNetworksManager
                profileId={socialProfile.id}
                onNetworkAdded={handleNetworkChange}
                onNetworkUpdated={handleNetworkChange}
                onNetworkRemoved={handleNetworkChange}
              />
            )}

            {activeTab === 'analytics' && analytics && (
              <div className="space-y-8">
                {/* Top Plateformes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                    Top Plateformes
                  </h3>
                  
                  <div className="space-y-4">
                    {analytics.topPlatforms.map((platform, index) => {
                      const platformInfo = SocialNetworksService.getAvailablePlatforms()
                        .find(p => p.id === platform.platform);
                      
                      return (
                        <div key={platform.platform} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{platformInfo?.icon || '🌐'}</span>
                            <div>
                              <p className="font-medium text-gray-900">{platformInfo?.name || platform.platform}</p>
                              <p className="text-sm text-gray-600">{platform.followers.toLocaleString()} followers</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {platform.engagement.toFixed(1)}% engagement
                            </p>
                            <p className="text-xs text-gray-500">#{index + 1}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats par type de contenu */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                    Statistiques par Type de Contenu
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analytics.contentStats.map((stat) => (
                      <div key={stat.type} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {stat.type}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {stat.count}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {stat.totalViews.toLocaleString()} vues
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Croissance récente */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                    Croissance des 7 Derniers Jours
                  </h3>
                  
                  <div className="space-y-3">
                    {analytics.recentGrowth.map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(day.date).toLocaleDateString('fr-FR', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span>{day.followers.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-green-500" />
                            <span>{day.views.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
