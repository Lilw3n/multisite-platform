'use client';

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, DollarSign, Eye, MousePointer, BarChart3, Zap, Globe, Users, Calendar } from 'lucide-react';

interface SEAManagerProps {
  campaignType?: 'google_ads' | 'facebook_ads' | 'linkedin_ads' | 'tiktok_ads';
  targetAudience?: string;
  budget?: number;
  onCampaignCreate?: (campaign: any) => void;
}

interface Campaign {
  id: string;
  name: string;
  platform: 'google' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube';
  type: 'search' | 'display' | 'video' | 'shopping' | 'social';
  status: 'active' | 'paused' | 'draft' | 'completed';
  budget: {
    daily: number;
    total: number;
    spent: number;
  };
  targeting: {
    keywords: string[];
    demographics: {
      age: string;
      gender: string;
      location: string[];
      interests: string[];
    };
    devices: string[];
    schedule: string;
  };
  performance: {
    impressions: number;
    clicks: number;
    ctr: number; // Click Through Rate
    cpc: number; // Cost Per Click
    conversions: number;
    conversionRate: number;
    roas: number; // Return On Ad Spend
    qualityScore: number;
  };
  creatives: {
    headlines: string[];
    descriptions: string[];
    images: string[];
    videos?: string[];
  };
  landingPage: string;
  startDate: string;
  endDate?: string;
}

interface KeywordSuggestion {
  keyword: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  suggestedBid: number;
  intent: 'informational' | 'commercial' | 'transactional';
  difficulty: number;
}

export default function SEAManager({ 
  campaignType = 'google_ads', 
  targetAudience = 'vtc-professionals',
  budget = 1000,
  onCampaignCreate 
}: SEAManagerProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState<KeywordSuggestion[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCampaignData();
    generateKeywordSuggestions();
  }, [targetAudience]);

  const loadCampaignData = async () => {
    setIsLoading(true);
    
    // Simulation de campagnes existantes
    const mockCampaigns: Campaign[] = [
      {
        id: 'camp_1',
        name: 'Assurance VTC - Recherche Google',
        platform: 'google',
        type: 'search',
        status: 'active',
        budget: {
          daily: 50,
          total: 1500,
          spent: 847.32
        },
        targeting: {
          keywords: ['assurance vtc', 'assurance chauffeur vtc', 'assurance professionnelle vtc'],
          demographics: {
            age: '25-55',
            gender: 'all',
            location: ['France', 'Paris', 'Lyon', 'Marseille'],
            interests: ['Transport', 'Entrepreneuriat', 'Assurance']
          },
          devices: ['desktop', 'mobile', 'tablet'],
          schedule: '24/7'
        },
        performance: {
          impressions: 45678,
          clicks: 1234,
          ctr: 2.7,
          cpc: 0.68,
          conversions: 89,
          conversionRate: 7.2,
          roas: 4.2,
          qualityScore: 8.5
        },
        creatives: {
          headlines: [
            'Assurance VTC Professionnelle',
            'Protégez Votre Activité VTC',
            'Devis Assurance VTC Gratuit'
          ],
          descriptions: [
            'Obtenez une protection complète pour votre activité VTC. Devis gratuit en 2 minutes.',
            'Assurance VTC adaptée aux professionnels. Tarifs compétitifs et service premium.'
          ],
          images: ['/ads/vtc-insurance-1.jpg', '/ads/vtc-insurance-2.jpg']
        },
        landingPage: '/external/Assurance/Professionnel/VTC-Taxi',
        startDate: '2024-01-15',
        endDate: '2024-02-15'
      },
      {
        id: 'camp_2',
        name: 'Communauté VTC - Facebook Social',
        platform: 'facebook',
        type: 'social',
        status: 'active',
        budget: {
          daily: 30,
          total: 900,
          spent: 456.78
        },
        targeting: {
          keywords: ['vtc', 'chauffeur', 'transport'],
          demographics: {
            age: '25-50',
            gender: 'all',
            location: ['France'],
            interests: ['VTC', 'Taxi', 'Entrepreneuriat', 'Business', 'Transport']
          },
          devices: ['mobile', 'desktop'],
          schedule: 'business_hours'
        },
        performance: {
          impressions: 78945,
          clicks: 2367,
          ctr: 3.0,
          cpc: 0.19,
          conversions: 156,
          conversionRate: 6.6,
          roas: 3.8,
          qualityScore: 7.8
        },
        creatives: {
          headlines: [
            'Rejoignez la Communauté VTC #1',
            'Échangez avec 12K+ Professionnels VTC',
            'Conseils, Astuces et Networking VTC'
          ],
          descriptions: [
            'La plus grande communauté de chauffeurs VTC. Partagez vos expériences et développez votre activité.',
            'Accédez aux conseils des meilleurs pros VTC. Gratuit et sans engagement.'
          ],
          images: ['/ads/community-1.jpg', '/ads/community-2.jpg'],
          videos: ['/ads/community-video.mp4']
        },
        landingPage: '/external/social/hub/groups/VTC-Taxi',
        startDate: '2024-01-10'
      }
    ];

    setCampaigns(mockCampaigns);
    setIsLoading(false);
  };

  const generateKeywordSuggestions = async () => {
    // Simulation de suggestions de mots-clés basées sur l'audience cible
    const vtcKeywords: KeywordSuggestion[] = [
      {
        keyword: 'assurance vtc pas cher',
        searchVolume: 2400,
        competition: 'high',
        suggestedBid: 1.25,
        intent: 'commercial',
        difficulty: 75
      },
      {
        keyword: 'formation chauffeur vtc',
        searchVolume: 1800,
        competition: 'medium',
        suggestedBid: 0.95,
        intent: 'commercial',
        difficulty: 60
      },
      {
        keyword: 'licence vtc prix',
        searchVolume: 3200,
        competition: 'high',
        suggestedBid: 1.45,
        intent: 'informational',
        difficulty: 80
      },
      {
        keyword: 'communauté chauffeur vtc',
        searchVolume: 890,
        competition: 'low',
        suggestedBid: 0.35,
        intent: 'informational',
        difficulty: 25
      },
      {
        keyword: 'conseils vtc débutant',
        searchVolume: 1200,
        competition: 'low',
        suggestedBid: 0.42,
        intent: 'informational',
        difficulty: 30
      },
      {
        keyword: 'optimisation tournée vtc',
        searchVolume: 650,
        competition: 'low',
        suggestedBid: 0.28,
        intent: 'commercial',
        difficulty: 35
      }
    ];

    setKeywordSuggestions(vtcKeywords);
  };

  const createCampaign = (campaignData: Partial<Campaign>) => {
    const newCampaign: Campaign = {
      id: `camp_${Date.now()}`,
      name: campaignData.name || 'Nouvelle Campagne',
      platform: campaignData.platform || 'google',
      type: campaignData.type || 'search',
      status: 'draft',
      budget: campaignData.budget || { daily: 20, total: 600, spent: 0 },
      targeting: campaignData.targeting || {
        keywords: [],
        demographics: {
          age: '25-55',
          gender: 'all',
          location: ['France'],
          interests: []
        },
        devices: ['desktop', 'mobile'],
        schedule: 'business_hours'
      },
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        conversions: 0,
        conversionRate: 0,
        roas: 0,
        qualityScore: 0
      },
      creatives: campaignData.creatives || {
        headlines: [],
        descriptions: [],
        images: []
      },
      landingPage: campaignData.landingPage || '/external',
      startDate: new Date().toISOString().split('T')[0]
    };

    setCampaigns(prev => [...prev, newCampaign]);
    onCampaignCreate?.(newCampaign);
    setShowCampaignBuilder(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'google': return '🔍';
      case 'facebook': return '📘';
      case 'linkedin': return '💼';
      case 'tiktok': return '🎵';
      case 'youtube': return '📺';
      default: return '📱';
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculateTotalBudget = () => {
    return campaigns.reduce((total, campaign) => total + campaign.budget.total, 0);
  };

  const calculateTotalSpent = () => {
    return campaigns.reduce((total, campaign) => total + campaign.budget.spent, 0);
  };

  const calculateAverageROAS = () => {
    const activeROAS = campaigns
      .filter(c => c.status === 'active' && c.performance.roas > 0)
      .map(c => c.performance.roas);
    
    return activeROAS.length > 0 
      ? activeROAS.reduce((sum, roas) => sum + roas, 0) / activeROAS.length 
      : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des campagnes publicitaires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-600">Budget Total</div>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{calculateTotalBudget().toLocaleString()}€</div>
          <div className="text-sm text-gray-500 mt-1">
            {calculateTotalSpent().toLocaleString()}€ dépensés
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-600">ROAS Moyen</div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{calculateAverageROAS().toFixed(1)}x</div>
          <div className="text-sm text-green-600 mt-1">+15% vs mois dernier</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-600">Campagnes Actives</div>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-gray-500 mt-1">sur {campaigns.length} total</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-600">Conversions</div>
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.reduce((total, c) => total + c.performance.conversions, 0)}
          </div>
          <div className="text-sm text-green-600 mt-1">+23% cette semaine</div>
        </div>
      </div>

      {/* Campaign Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Campagnes Publicitaires</h2>
                <button
                  onClick={() => setShowCampaignBuilder(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Nouvelle Campagne
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{getPlatformIcon(campaign.platform)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-gray-900">{campaign.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                            {campaign.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
                          <div>
                            <div className="font-medium">Budget</div>
                            <div>{campaign.budget.spent}€ / {campaign.budget.total}€</div>
                          </div>
                          <div>
                            <div className="font-medium">CTR</div>
                            <div className="text-blue-600">{campaign.performance.ctr}%</div>
                          </div>
                          <div>
                            <div className="font-medium">CPC</div>
                            <div>{campaign.performance.cpc}€</div>
                          </div>
                          <div>
                            <div className="font-medium">ROAS</div>
                            <div className="text-green-600">{campaign.performance.roas}x</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {campaign.performance.conversions}
                      </div>
                      <div className="text-sm text-gray-500">conversions</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keyword Suggestions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Suggestions de Mots-clés</h3>
          <div className="space-y-3">
            {keywordSuggestions.map((keyword, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{keyword.keyword}</span>
                  <span className={`text-sm ${getCompetitionColor(keyword.competition)}`}>
                    {keyword.competition}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Volume:</span> {keyword.searchVolume.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">CPC:</span> {keyword.suggestedBid}€
                  </div>
                  <div>
                    <span className="font-medium">Intent:</span> {keyword.intent}
                  </div>
                  <div>
                    <span className="font-medium">Difficulté:</span> {keyword.difficulty}/100
                  </div>
                </div>
                
                <button className="w-full mt-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-1 px-2 rounded text-xs font-medium transition-colors">
                  Ajouter à une campagne
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Builder Modal */}
      {showCampaignBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Créer une Nouvelle Campagne</h2>
                <button
                  onClick={() => setShowCampaignBuilder(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Campaign Templates */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Modèles de Campagne</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: 'Acquisition Assurance VTC',
                        platform: 'google' as const,
                        type: 'search' as const,
                        description: 'Campagne de recherche Google pour acquérir des clients assurance VTC',
                        budget: { daily: 50, total: 1500, spent: 0 },
                        landingPage: '/external/Assurance/Professionnel/VTC-Taxi'
                      },
                      {
                        name: 'Communauté VTC Social',
                        platform: 'facebook' as const,
                        type: 'social' as const,
                        description: 'Campagne Facebook pour développer la communauté VTC',
                        budget: { daily: 30, total: 900, spent: 0 },
                        landingPage: '/external/social/groups/VTC-Taxi'
                      },
                      {
                        name: 'Formation Professionnelle',
                        platform: 'linkedin' as const,
                        type: 'social' as const,
                        description: 'Campagne LinkedIn pour promouvoir les formations VTC',
                        budget: { daily: 40, total: 1200, spent: 0 },
                        landingPage: '/external/Formation/VTC-Taxi/Professionnel'
                      },
                      {
                        name: 'Retargeting Visiteurs',
                        platform: 'google' as const,
                        type: 'display' as const,
                        description: 'Campagne display pour recibler les visiteurs du site',
                        budget: { daily: 25, total: 750, spent: 0 },
                        landingPage: '/external'
                      }
                    ].map((template, index) => (
                      <button
                        key={index}
                        onClick={() => createCampaign(template)}
                        className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xl">{getPlatformIcon(template.platform)}</span>
                          <span className="font-bold text-gray-900">{template.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="text-xs text-blue-600">
                          Budget: {template.budget.daily}€/jour - {template.budget.total}€ total
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPlatformIcon(selectedCampaign.platform)}</span>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCampaign.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCampaign.status)}`}>
                    {selectedCampaign.status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Performance Metrics */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Performance</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-600">Impressions</span>
                        </div>
                        <div className="text-xl font-bold text-blue-900">
                          {selectedCampaign.performance.impressions.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <MousePointer className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Clics</span>
                        </div>
                        <div className="text-xl font-bold text-green-900">
                          {selectedCampaign.performance.clicks.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-purple-600">CTR</span>
                        </div>
                        <div className="text-xl font-bold text-purple-900">
                          {selectedCampaign.performance.ctr}%
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-orange-600">Conversions</span>
                        </div>
                        <div className="text-xl font-bold text-orange-900">
                          {selectedCampaign.performance.conversions}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Mots-clés Ciblés</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCampaign.targeting.keywords.map((keyword, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Créatifs Publicitaires</h3>
                    <div className="space-y-3">
                      {selectedCampaign.creatives.headlines.map((headline, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{headline}</div>
                          {selectedCampaign.creatives.descriptions[index] && (
                            <div className="text-sm text-gray-600 mt-1">
                              {selectedCampaign.creatives.descriptions[index]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Campaign Settings */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Budget & Calendrier</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Budget quotidien</div>
                        <div className="font-bold text-gray-900">{selectedCampaign.budget.daily}€</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Budget total</div>
                        <div className="font-bold text-gray-900">{selectedCampaign.budget.total}€</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Dépensé</div>
                        <div className="font-bold text-red-600">{selectedCampaign.budget.spent}€</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Ciblage</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Âge:</span> {selectedCampaign.targeting.demographics.age}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Localisation:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedCampaign.targeting.demographics.location.map((loc, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Appareils:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedCampaign.targeting.devices.map((device, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {device}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Modifier la campagne
                    </button>
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Dupliquer la campagne
                    </button>
                    <button className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Mettre en pause
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
