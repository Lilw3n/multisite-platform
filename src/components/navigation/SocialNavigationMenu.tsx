'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Users, 
  MessageCircle, 
  Car, 
  Building, 
  Heart, 
  UtensilsCrossed,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Zap,
  Video,
  ShoppingBag,
  UserCheck,
  TrendingUp,
  Star,
  X
} from 'lucide-react';

interface SocialNavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialNavigationMenu({ isOpen, onClose }: SocialNavigationMenuProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['hub']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const menuSections = [
    {
      id: 'hub',
      title: 'Hub Social Principal',
      icon: <Globe className="w-5 h-5" />,
      description: 'Centre névralgique social',
      items: [
        {
          title: 'Hub Social Complet',
          href: '/external/social/hub',
          icon: <Zap className="w-4 h-4" />,
          description: 'Feed, marketplace, matching, live'
        },
        {
          title: 'Vue Communautés',
          href: '/external/social',
          icon: <Users className="w-4 h-4" />,
          description: 'Aperçu de toutes les communautés'
        }
      ]
    },
    {
      id: 'communities',
      title: 'Communautés Spécialisées',
      icon: <Users className="w-5 h-5" />,
      description: 'Groupes par secteur',
      items: [
        {
          title: 'Communauté Pro',
          href: '/external/social/hub/groups/VTC-Taxi',
          icon: <Car className="w-4 h-4" />,
          description: '12,847+ professionnels connectés',
          badge: 'Populaire'
        },
        {
          title: 'Assurance Pro',
          href: '/external/social/hub/groups/Assurance-Pro',
          icon: <UserCheck className="w-4 h-4" />,
          description: 'Professionnels de l\'assurance'
        },
        {
          title: 'Immobilier Pro',
          href: '/external/social/hub/groups/Immobilier-Pro',
          icon: <Building className="w-4 h-4" />,
          description: 'Réseau immobilier professionnel'
        },
        {
          title: 'Santé & Bien-être',
          href: '/external/social/hub/groups/Sante',
          icon: <Heart className="w-4 h-4" />,
          description: 'Professionnels de santé'
        },
        {
          title: 'Restauration',
          href: '/external/social/hub/groups/Restauration',
          icon: <UtensilsCrossed className="w-4 h-4" />,
          description: 'Métiers de la restauration'
        }
      ]
    },
    {
      id: 'features',
      title: 'Fonctionnalités Sociales',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Outils et services',
      items: [
        {
          title: 'Live Streaming',
          href: '/external/social/hub#live',
          icon: <Video className="w-4 h-4" />,
          description: 'Diffusions en direct',
          badge: 'Live'
        },
        {
          title: 'Marketplace',
          href: '/external/social/hub#marketplace',
          icon: <ShoppingBag className="w-4 h-4" />,
          description: 'Achats entre membres'
        },
        {
          title: 'Matching Pro',
          href: '/external/social/hub#matching',
          icon: <UserCheck className="w-4 h-4" />,
          description: 'Connexions professionnelles'
        },
        {
          title: 'Économie Créateurs',
          href: '/external/social/hub#creators',
          icon: <Zap className="w-4 h-4" />,
          description: 'Programme ambassadeurs'
        },
        {
          title: 'Agence Créateurs',
          href: '/external/social/hub#agency',
          icon: <Star className="w-4 h-4" />,
          description: 'Programme exclusif créateurs',
          badge: 'Nouveau'
        },
        {
          title: 'Groupes Privés',
          href: '/external/social/hub#groups',
          icon: <Users className="w-4 h-4" />,
          description: 'Communication sécurisée'
        },
        {
          title: 'Bons Plans',
          href: '/external/social/hub#deals',
          icon: <Zap className="w-4 h-4" />,
          description: 'Deals et économies',
          badge: 'Hot'
        }
      ]
    },
    {
      id: 'platforms',
      title: 'Plateformes Sectorielles',
      icon: <Building className="w-5 h-5" />,
      description: 'Services spécialisés',
      items: [
        {
          title: 'Assurance VTC/Taxi',
          href: '/external/Assurance/Professionnel/VTC-Taxi',
          icon: <Car className="w-4 h-4" />,
          description: 'Assurance transport professionnel'
        },
        {
          title: 'Assurance Immobilier',
          href: '/external/Assurance/Professionnel/Immobilier',
          icon: <Building className="w-4 h-4" />,
          description: 'Assurance immobilier pro'
        },
        {
          title: 'Formation Transport',
          href: '/external/Formation/VTC-Taxi',
          icon: <Car className="w-4 h-4" />,
          description: 'Formations VTC et Taxi'
        },
        {
          title: 'Marketplace Transport',
          href: '/external/Marketplace/Transport',
          icon: <ShoppingBag className="w-4 h-4" />,
          description: 'Équipements et services'
        }
      ]
    },
    {
      id: 'account',
      title: 'Mon Compte',
      icon: <UserCheck className="w-5 h-5" />,
      description: 'Profil et paramètres',
      items: [
        {
          title: 'Mon Profil',
          href: '/dashboard/external/profile',
          icon: <UserCheck className="w-4 h-4" />,
          description: 'Informations personnelles'
        },
        {
          title: 'Connexion',
          href: '/external/login',
          icon: <ExternalLink className="w-4 h-4" />,
          description: 'Se connecter'
        },
        {
          title: 'Inscription',
          href: '/external/register',
          icon: <Users className="w-4 h-4" />,
          description: 'Créer un compte'
        }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Globe className="w-6 h-6" />
                <span>Navigation Sociale</span>
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Accès rapide à l'écosystème DiddyHome
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Quick Access */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Accès Rapide</span>
            </h3>
            <div className="space-y-2">
              <Link
                href="/external/social/hub"
                className="block bg-white rounded-lg p-3 hover:bg-gray-50 transition-colors border border-gray-200"
                onClick={onClose}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Hub Social</p>
                    <p className="text-xs text-gray-500">Centre social complet</p>
                  </div>
                </div>
              </Link>
              <Link
                href="/external/social/hub/groups/VTC-Taxi"
                className="block bg-white rounded-lg p-3 hover:bg-gray-50 transition-colors border border-gray-200"
                onClick={onClose}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Car className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Communauté Pro</p>
                    <p className="text-xs text-gray-500">12,847+ membres</p>
                  </div>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Hot
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Menu Sections */}
          {menuSections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full bg-gray-50 hover:bg-gray-100 p-4 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gray-600">
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                {expandedSections.includes(section.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedSections.includes(section.id) && (
                <div className="bg-white">
                  {section.items.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
                      onClick={onClose}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            {item.badge && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.badge === 'Populaire' ? 'bg-orange-100 text-orange-800' :
                                item.badge === 'Live' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Footer Info */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              🌟 <strong>DiddyHome</strong> - Plateforme Multisite Connectée
            </p>
            <p className="text-xs text-gray-500">
              Consultez le <Link href="/SOCIAL_NAVIGATION_GUIDE.md" className="text-blue-600 hover:underline">guide complet</Link> pour plus d'informations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Bouton flottant pour ouvrir le menu social
 */
export function SocialNavigationButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      title="Navigation Sociale"
    >
      <Globe className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-xs text-white font-bold">!</span>
      </div>
    </button>
  );
}
