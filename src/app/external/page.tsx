'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Users, Shield, TrendingUp, Star, ArrowRight, 
  Zap, Target, Award, Crown, Sparkles, Network, 
  Building, Car, Briefcase, GraduationCap, Heart,
  MessageCircle, Video, ShoppingBag, MapPin, Clock
} from 'lucide-react';
import HydrationSafe from '@/components/ui/HydrationSafe';

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'assurance' | 'social' | 'formation' | 'marketplace' | 'services';
  href: string;
  features: string[];
  userCount: number;
  trending: boolean;
  comingSoon?: boolean;
}

interface Sector {
  id: string;
  name: string;
  description: string;
  icon: string;
  platforms: Platform[];
  color: string;
}

export default function ExternalHomePage() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Configuration des secteurs et plateformes
  const sectors: Sector[] = [
    {
      id: 'transport',
      name: 'Transport & Mobilité',
      description: 'VTC, Taxi, Livraison, Transport de marchandises',
      icon: '🚗',
      color: 'from-blue-500 to-cyan-500',
      platforms: [
        {
          id: 'vtc-taxi-assurance',
          name: 'Assurance VTC & Taxi',
          description: 'Solutions d\'assurance spécialisées pour professionnels du transport',
          icon: '🛡️',
          category: 'assurance',
          href: '/external/Assurance/Professionnel/VTC-Taxi',
          features: ['Devis instantané', 'Couverture complète', 'Tarifs négociés', 'Support 24/7'],
          userCount: 15420,
          trending: true
        },
        {
          id: 'vtc-taxi-social',
          name: 'Communauté VTC & Taxi',
          description: 'Réseau social professionnel pour chauffeurs',
          icon: '👥',
          category: 'social',
          href: '/external/social/hub/groups/VTC-Taxi',
          features: ['Conseils pros', 'Networking', 'Bons plans', 'Entraide'],
          userCount: 12847,
          trending: true
        },
        {
          id: 'formation-vtc',
          name: 'Formation VTC Pro',
          description: 'Formations certifiantes et perfectionnement',
          icon: '🎓',
          category: 'formation',
          href: '/external/Formation/VTC-Taxi/Professionnel',
          features: ['Certification', 'E-learning', 'Suivi personnalisé', 'Mise à jour réglementaire'],
          userCount: 8934,
          trending: false
        }
      ]
    },
    {
      id: 'immobilier',
      name: 'Immobilier & Habitat',
      description: 'Gestion locative, syndic, transactions immobilières',
      icon: '🏠',
      color: 'from-green-500 to-emerald-500',
      platforms: [
        {
          id: 'assurance-immobilier',
          name: 'Assurance Immobilier',
          description: 'Protection complète pour propriétaires et gestionnaires',
          icon: '🏢',
          category: 'assurance',
          href: '/external/Assurance/Professionnel/Immobilier',
          features: ['Multirisque', 'Responsabilité civile', 'Protection locative', 'Garanties étendues'],
          userCount: 9876,
          trending: false,
          comingSoon: true
        },
        {
          id: 'marketplace-immobilier',
          name: 'Marketplace Immobilier',
          description: 'Services et produits pour professionnels de l\'immobilier',
          icon: '🛍️',
          category: 'marketplace',
          href: '/external/Marketplace/Immobilier',
          features: ['Fournisseurs vérifiés', 'Tarifs négociés', 'Livraison rapide', 'Support technique'],
          userCount: 5432,
          trending: false,
          comingSoon: true
        }
      ]
    },
    {
      id: 'sante',
      name: 'Santé & Bien-être',
      description: 'Professionnels de santé, cliniques, pharmacies',
      icon: '🏥',
      color: 'from-red-500 to-pink-500',
      platforms: [
        {
          id: 'assurance-sante-pro',
          name: 'Assurance Santé Pro',
          description: 'Solutions d\'assurance pour professionnels de santé',
          icon: '⚕️',
          category: 'assurance',
          href: '/external/Assurance/Professionnel/Sante',
          features: ['Responsabilité médicale', 'Protection cabinet', 'Cyber-sécurité', 'Assistance juridique'],
          userCount: 7654,
          trending: false,
          comingSoon: true
        }
      ]
    },
    {
      id: 'restauration',
      name: 'Restauration & CHR',
      description: 'Restaurants, hôtels, cafés, traiteurs',
      icon: '🍽️',
      color: 'from-orange-500 to-yellow-500',
      platforms: [
        {
          id: 'assurance-restaurant',
          name: 'Assurance Restaurant',
          description: 'Protection complète pour établissements CHR',
          icon: '🍴',
          category: 'assurance',
          href: '/external/Assurance/Professionnel/Restauration',
          features: ['Multirisque CHR', 'Perte d\'exploitation', 'Responsabilité produits', 'Équipements'],
          userCount: 4321,
          trending: false,
          comingSoon: true
        }
      ]
    }
  ];

  const globalStats = {
    totalUsers: sectors.reduce((sum, sector) => 
      sum + sector.platforms.reduce((platformSum, platform) => platformSum + platform.userCount, 0), 0
    ),
    totalPlatforms: sectors.reduce((sum, sector) => sum + sector.platforms.length, 0),
    activeSectors: sectors.length,
    satisfaction: 98
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assurance': return Shield;
      case 'social': return Users;
      case 'formation': return GraduationCap;
      case 'marketplace': return ShoppingBag;
      case 'services': return Briefcase;
      default: return Globe;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'assurance': return 'bg-blue-100 text-blue-700';
      case 'social': return 'bg-purple-100 text-purple-700';
      case 'formation': return 'bg-green-100 text-green-700';
      case 'marketplace': return 'bg-orange-100 text-orange-700';
      case 'services': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Network className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">DiddyHome</h1>
              </div>
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                Plateforme Multisite
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/external/social"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <Users className="w-4 h-4" />
                <span>Communauté</span>
              </Link>
              <Link
                href="/external/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Connexion
              </Link>
              <Link
                href="/external/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Network className="w-12 h-12 text-white" />
              <Globe className="w-10 h-10 text-blue-200" />
              <Sparkles className="w-8 h-8 text-pink-200" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenue sur DiddyHome
            </h1>
            <h2 className="text-xl md:text-2xl mb-6 text-blue-100">
              La première plateforme multisite connectée pour professionnels
            </h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Découvrez un écosystème complet de plateformes spécialisées par secteur d'activité. 
              Assurance, communauté, formation, marketplace... Tout est connecté pour simplifier votre vie professionnelle.
            </p>
            
            {/* Quick Stats */}
            <HydrationSafe fallback={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-blue-200">Utilisateurs</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold">6</div>
                  <div className="text-sm text-blue-200">Plateformes</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-sm text-blue-200">Secteurs</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm text-blue-200">Satisfaction</div>
                </div>
              </div>
            }>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold">{globalStats.totalUsers.toLocaleString()}</div>
                  <div className="text-sm text-blue-200">Utilisateurs</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold">{globalStats.totalPlatforms}</div>
                  <div className="text-sm text-blue-200">Plateformes</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold">{globalStats.activeSectors}</div>
                  <div className="text-sm text-blue-200">Secteurs</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold">{globalStats.satisfaction}%</div>
                  <div className="text-sm text-blue-200">Satisfaction</div>
                </div>
              </div>
            </HydrationSafe>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/external/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                🚀 Rejoindre l'écosystème
              </Link>
              <Link
                href="/external/social"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                👥 Découvrir la communauté
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Concept Explanation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Une plateforme, plusieurs univers connectés
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              DiddyHome révolutionne l'expérience professionnelle en créant des plateformes spécialisées 
              par secteur, toutes interconnectées pour une expérience utilisateur fluide et complète.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Network className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interconnexion totale</h3>
              <p className="text-gray-600">
                Un seul compte pour accéder à toutes les plateformes spécialisées de votre secteur et des secteurs connexes.
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Spécialisation sectorielle</h3>
              <p className="text-gray-600">
                Chaque plateforme est conçue spécifiquement pour répondre aux besoins uniques de votre secteur d'activité.
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Écosystème complet</h3>
              <p className="text-gray-600">
                Assurance, communauté, formation, marketplace... Tous vos besoins professionnels en un seul endroit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explorez nos secteurs d'activité
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque secteur dispose de ses propres plateformes spécialisées, toutes connectées entre elles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sectors.map((sector) => (
              <div key={sector.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${sector.color} p-6 text-white`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">{sector.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold">{sector.name}</h3>
                      <p className="text-white text-opacity-90">{sector.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-white text-opacity-75">
                    {sector.platforms.length} plateforme{sector.platforms.length > 1 ? 's' : ''} disponible{sector.platforms.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {sector.platforms.map((platform) => {
                      const CategoryIcon = getCategoryIcon(platform.category);
                      return (
                        <div key={platform.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3">
                              <div className="text-2xl">{platform.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-bold text-gray-900">{platform.name}</h4>
                                  {platform.trending && (
                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                      🔥 Tendance
                                    </span>
                                  )}
                                  {platform.comingSoon && (
                                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
                                      Bientôt
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{platform.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-3 h-3" />
                                    <span>{platform.userCount.toLocaleString()} utilisateurs</span>
                                  </div>
                                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getCategoryColor(platform.category)}`}>
                                    <CategoryIcon className="w-3 h-3" />
                                    <span className="capitalize">{platform.category}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {platform.features.slice(0, 4).map((feature, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              {platform.comingSoon ? 'Disponible prochainement' : 'Disponible maintenant'}
                            </div>
                            {platform.comingSoon ? (
                              <button className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                                Bientôt disponible
                              </button>
                            ) : (
                              <Link
                                href={platform.href}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                              >
                                <span>Accéder</span>
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Highlight */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Users className="w-16 h-16 mx-auto mb-4 text-white" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Rejoignez notre communauté connectée
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Plus qu'une plateforme, DiddyHome c'est une communauté de professionnels qui s'entraident, 
              partagent leurs expériences et développent ensemble leurs activités.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <MessageCircle className="w-8 h-8 mx-auto mb-3 text-white" />
              <h3 className="font-bold mb-2">Échanges authentiques</h3>
              <p className="text-blue-100 text-sm">Discussions entre professionnels, conseils pratiques et retours d'expérience</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <Video className="w-8 h-8 mx-auto mb-3 text-white" />
              <h3 className="font-bold mb-2">Lives & Webinars</h3>
              <p className="text-blue-100 text-sm">Formations en direct, conférences et événements exclusifs</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <Award className="w-8 h-8 mx-auto mb-3 text-white" />
              <h3 className="font-bold mb-2">Reconnaissance</h3>
              <p className="text-blue-100 text-sm">Système de réputation, badges et récompenses pour les contributeurs</p>
            </div>
          </div>

          <Link
            href="/external/social"
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Découvrir la communauté</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Prêt à rejoindre l'écosystème DiddyHome ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Créez votre compte unique et accédez immédiatement à toutes les plateformes de votre secteur. 
              C'est gratuit et ça prend moins de 2 minutes !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/external/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Créer mon compte gratuit</span>
              </Link>
              <Link
                href="/external/login"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>J'ai déjà un compte</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              ✅ Gratuit • ✅ Sans engagement • ✅ Accès immédiat à toutes les plateformes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Network className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">DiddyHome</span>
              </div>
              <p className="text-gray-400 text-sm">
                La première plateforme multisite connectée pour professionnels.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Plateformes</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/external/social" className="hover:text-white transition-colors">Communauté</Link></li>
                <li><Link href="/external/Assurance/Professionnel/VTC-Taxi" className="hover:text-white transition-colors">Assurance VTC</Link></li>
                <li><span className="text-gray-500">Formation Pro (bientôt)</span></li>
                <li><span className="text-gray-500">Marketplace (bientôt)</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Secteurs</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-blue-400">🚗 Transport & Mobilité</span></li>
                <li><span className="text-gray-500">🏠 Immobilier (bientôt)</span></li>
                <li><span className="text-gray-500">🏥 Santé (bientôt)</span></li>
                <li><span className="text-gray-500">🍽️ Restauration (bientôt)</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/external/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/external/help" className="hover:text-white transition-colors">Aide</Link></li>
                <li><Link href="/external/legal" className="hover:text-white transition-colors">Mentions légales</Link></li>
                <li><Link href="/external/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; 2025 DiddyHome. Tous droits réservés. Plateforme multisite connectée.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
