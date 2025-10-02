'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Users, 
  Settings,
  Check,
  X,
  Globe,
  Lock
} from 'lucide-react';
import { SocialNetwork, SocialPlatform } from '@/types/socialNetworks';
import SocialNetworksService from '@/lib/socialNetworksService';

interface SocialNetworksManagerProps {
  profileId: string;
  onNetworkAdded?: (network: SocialNetwork) => void;
  onNetworkUpdated?: (network: SocialNetwork) => void;
  onNetworkRemoved?: (networkId: string) => void;
}

export default function SocialNetworksManager({ 
  profileId, 
  onNetworkAdded, 
  onNetworkUpdated, 
  onNetworkRemoved 
}: SocialNetworksManagerProps) {
  const [networks, setNetworks] = useState<SocialNetwork[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<SocialNetwork | null>(null);
  const [formData, setFormData] = useState({
    platform: 'twitch' as SocialPlatform,
    username: '',
    url: '',
    displayName: '',
    isActive: true,
    isPublic: true
  });

  const platforms = SocialNetworksService.getAvailablePlatforms();

  useEffect(() => {
    loadNetworks();
  }, [profileId]);

  const loadNetworks = () => {
    const profile = SocialNetworksService.getProfile(profileId);
    if (profile) {
      setNetworks(profile.socialNetworks);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNetwork) {
        // Mise à jour
        const profile = SocialNetworksService.getProfile(profileId);
        if (profile) {
          const networkIndex = profile.socialNetworks.findIndex(n => n.id === editingNetwork.id);
          if (networkIndex !== -1) {
            profile.socialNetworks[networkIndex] = {
              ...profile.socialNetworks[networkIndex],
              ...formData,
              updatedAt: new Date().toISOString()
            };
            
            await SocialNetworksService.updateProfile(profileId, { socialNetworks: profile.socialNetworks });
            onNetworkUpdated?.(profile.socialNetworks[networkIndex]);
          }
        }
      } else {
        // Création
        const newNetwork = await SocialNetworksService.addSocialNetwork(profileId, formData);
        if (newNetwork) {
          onNetworkAdded?.(newNetwork);
        }
      }
      
      loadNetworks();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (networkId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce réseau social ?')) {
      const success = await SocialNetworksService.removeSocialNetwork(profileId, networkId);
      if (success) {
        loadNetworks();
        onNetworkRemoved?.(networkId);
      }
    }
  };

  const handleEdit = (network: SocialNetwork) => {
    setEditingNetwork(network);
    setFormData({
      platform: network.platform,
      username: network.username,
      url: network.url || '',
      displayName: network.displayName || '',
      isActive: network.isActive,
      isPublic: network.isPublic
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      platform: 'twitch',
      username: '',
      url: '',
      displayName: '',
      isActive: true,
      isPublic: true
    });
    setEditingNetwork(null);
    setShowAddForm(false);
  };

  const generateUrl = (platform: SocialPlatform, username: string): string => {
    const urlPatterns: Record<SocialPlatform, string> = {
      twitch: `https://twitch.tv/${username}`,
      youtube: `https://youtube.com/@${username}`,
      tiktok: `https://tiktok.com/@${username}`,
      instagram: `https://instagram.com/${username}`,
      twitter: `https://twitter.com/${username}`,
      facebook: `https://facebook.com/${username}`,
      linkedin: `https://linkedin.com/in/${username}`,
      discord: `https://discord.gg/${username}`,
      snapchat: `https://snapchat.com/add/${username}`,
      pinterest: `https://pinterest.com/${username}`,
      reddit: `https://reddit.com/u/${username}`,
      github: `https://github.com/${username}`,
      steam: `https://steamcommunity.com/id/${username}`,
      kick: `https://kick.com/${username}`,
      rumble: `https://rumble.com/c/${username}`,
      dailymotion: `https://dailymotion.com/${username}`,
      vimeo: `https://vimeo.com/${username}`,
      other: ''
    };
    
    return urlPatterns[platform] || '';
  };

  const handleUsernameChange = (username: string) => {
    setFormData(prev => ({
      ...prev,
      username,
      url: prev.url || generateUrl(prev.platform, username)
    }));
  };

  const handlePlatformChange = (platform: SocialPlatform) => {
    setFormData(prev => ({
      ...prev,
      platform,
      url: prev.username ? generateUrl(platform, prev.username) : ''
    }));
  };

  const getPlatformInfo = (platform: SocialPlatform) => {
    return platforms.find(p => p.id === platform) || platforms[platforms.length - 1];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-blue-500" />
          Réseaux Sociaux
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </div>

      {/* Liste des réseaux */}
      <div className="space-y-4 mb-6">
        {networks.map((network) => {
          const platformInfo = getPlatformInfo(network.platform);
          
          return (
            <div key={network.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${platformInfo.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {platformInfo.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {network.displayName || network.username}
                      </h4>
                      <span className="text-sm text-gray-500">@{network.username}</span>
                      
                      {network.isActive ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center">
                          <Check className="w-3 h-3 mr-1" />
                          Actif
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center">
                          <X className="w-3 h-3 mr-1" />
                          Inactif
                        </span>
                      )}
                      
                      {network.isPublic ? (
                        <Eye className="w-4 h-4 text-green-500" title="Public" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" title="Privé" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="font-medium">{platformInfo.name}</span>
                      {network.followerCount && (
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {network.followerCount.toLocaleString()} followers
                        </span>
                      )}
                      {network.verifiedAccount && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          ✓ Vérifié
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {network.url && (
                    <a
                      href={network.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="Ouvrir le profil"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  
                  <button
                    onClick={() => handleEdit(network)}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(network.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {networks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun réseau social configuré</p>
            <p className="text-sm">Ajoutez vos profils pour commencer l'agrégation de contenu</p>
          </div>
        )}
      </div>

      {/* Formulaire d'ajout/modification */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingNetwork ? 'Modifier le réseau social' : 'Ajouter un réseau social'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Plateforme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plateforme *
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => handlePlatformChange(e.target.value as SocialPlatform)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {platforms.map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.icon} {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nom d'utilisateur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="votre_pseudo"
                    required
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL du profil
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour générer automatiquement
                  </p>
                </div>

                {/* Nom d'affichage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'affichage
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom affiché publiquement"
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Compte actif</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Profil public</span>
                    </label>
                    {formData.isPublic ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingNetwork ? 'Enregistrer' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
