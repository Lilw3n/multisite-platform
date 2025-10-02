'use client';

import React, { useState } from 'react';
import { Chrome, Facebook, Twitter, Instagram, MessageCircle, Youtube, Linkedin, Github, Apple, Microsoft } from 'lucide-react';

interface SocialProvider {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  hoverColor: string;
  description: string;
  popular: boolean;
}

interface SocialAuthSystemProps {
  onSocialLogin: (provider: string) => void;
  onClose: () => void;
  mode: 'login' | 'register';
}

const socialProviders: SocialProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: Chrome,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100',
    description: 'Connexion rapide avec votre compte Google',
    popular: true
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    description: 'Importez vos contacts Facebook',
    popular: true
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: Twitter,
    color: 'text-black',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100',
    description: 'Connectez-vous avec X',
    popular: true
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    hoverColor: 'hover:bg-pink-100',
    description: 'Partagez vos photos Instagram',
    popular: true
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: () => <div className="text-lg font-bold">🎵</div>,
    color: 'text-black',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100',
    description: 'Synchronisez avec TikTok',
    popular: true
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    description: 'Connexion via WhatsApp Business',
    popular: true
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: () => <div className="text-lg">✈️</div>,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    description: 'Rejoignez nos groupes Telegram',
    popular: true
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100',
    description: 'Connectez votre chaîne YouTube',
    popular: false
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    description: 'Réseau professionnel LinkedIn',
    popular: false
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: () => <div className="text-lg font-bold text-purple-600">⚡</div>,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
    description: 'Streamez sur Twitch',
    popular: false
  },
  {
    id: 'kick',
    name: 'Kick',
    icon: () => <div className="text-lg font-bold text-green-600">🦶</div>,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    description: 'Nouvelle plateforme Kick',
    popular: false
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: () => <div className="text-lg">🎮</div>,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    hoverColor: 'hover:bg-indigo-100',
    description: 'Rejoignez notre Discord',
    popular: false
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: Apple,
    color: 'text-gray-800',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100',
    description: 'Connexion avec Apple ID',
    popular: false
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: Microsoft,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    description: 'Compte Microsoft/Outlook',
    popular: false
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    color: 'text-gray-800',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100',
    description: 'Pour les développeurs',
    popular: false
  }
];

export default function SocialAuthSystem({ onSocialLogin, onClose, mode }: SocialAuthSystemProps) {
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLogin = async (providerId: string) => {
    setIsLoading(providerId);
    
    // Simuler la connexion
    setTimeout(() => {
      onSocialLogin(providerId);
      setIsLoading(null);
    }, 2000);
  };

  const popularProviders = socialProviders.filter(p => p.popular);
  const otherProviders = socialProviders.filter(p => !p.popular);
  const displayedProviders = showAll ? socialProviders : popularProviders;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
              </h2>
              <p className="text-gray-600 mt-1">
                Choisissez votre méthode de connexion préférée
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Popular Providers */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              🔥 Connexions populaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularProviders.map((provider) => {
                const IconComponent = provider.icon;
                return (
                  <button
                    key={provider.id}
                    onClick={() => handleSocialLogin(provider.id)}
                    disabled={isLoading !== null}
                    className={`flex items-center space-x-3 p-4 border border-gray-200 rounded-xl ${provider.bgColor} ${provider.hoverColor} transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group`}
                  >
                    <div className={`${provider.color} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">{provider.name}</div>
                      <div className="text-sm text-gray-600">{provider.description}</div>
                    </div>
                    {isLoading === provider.id && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Show More Button */}
          {!showAll && (
            <div className="text-center mb-6">
              <button
                onClick={() => setShowAll(true)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-2 mx-auto"
              >
                <span>Voir toutes les options de connexion</span>
                <span className="text-lg">⬇️</span>
              </button>
            </div>
          )}

          {/* All Other Providers */}
          {showAll && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                🌐 Toutes les plateformes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {otherProviders.map((provider) => {
                  const IconComponent = provider.icon;
                  return (
                    <button
                      key={provider.id}
                      onClick={() => handleSocialLogin(provider.id)}
                      disabled={isLoading !== null}
                      className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg ${provider.bgColor} ${provider.hoverColor} transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group`}
                    >
                      <div className={`${provider.color} group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 text-sm">{provider.name}</div>
                        <div className="text-xs text-gray-600">{provider.description}</div>
                      </div>
                      {isLoading === provider.id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              ✨ Pourquoi se connecter avec vos réseaux sociaux ?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <div className="text-green-500 mt-0.5">✅</div>
                <div>
                  <div className="font-medium text-gray-900">Connexion instantanée</div>
                  <div className="text-gray-600">Pas besoin de créer un nouveau mot de passe</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="text-green-500 mt-0.5">✅</div>
                <div>
                  <div className="font-medium text-gray-900">Profil automatique</div>
                  <div className="text-gray-600">Vos informations sont pré-remplies</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="text-green-500 mt-0.5">✅</div>
                <div>
                  <div className="font-medium text-gray-900">Synchronisation</div>
                  <div className="text-gray-600">Partagez facilement sur vos réseaux</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="text-green-500 mt-0.5">✅</div>
                <div>
                  <div className="font-medium text-gray-900">Sécurité renforcée</div>
                  <div className="text-gray-600">Authentification à deux facteurs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 mt-0.5">🔒</div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Sécurité et confidentialité</div>
                <div className="text-gray-600">
                  Nous ne stockons jamais vos mots de passe. Vos données sont protégées selon les standards RGPD. 
                  Nous utilisons uniquement les informations nécessaires à la création de votre profil.
                </div>
              </div>
            </div>
          </div>

          {/* Identity Verification Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-600 mt-0.5">📋</div>
              <div className="text-sm">
                <div className="font-medium text-yellow-800 mb-1">Vérification d'identité requise</div>
                <div className="text-yellow-700">
                  Pour devenir un utilisateur vérifié et accéder à toutes les fonctionnalités, 
                  vous devrez fournir une pièce d'identité officielle après votre inscription. 
                  Cela garantit la sécurité de notre communauté.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center text-sm text-gray-600">
            En vous connectant, vous acceptez nos{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Conditions d'utilisation</a>
            {' '}et notre{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </div>
  );
}
