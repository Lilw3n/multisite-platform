'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, Settings, Shield, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

export default function CookiesPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
    functional: false
  });

  const handleToggle = (type: keyof typeof cookiePreferences) => {
    if (type === 'necessary') return; // Les cookies nécessaires ne peuvent pas être désactivés
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    // Sauvegarder les préférences dans le localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Vos préférences ont été sauvegardées !');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/external"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Cookie className="w-8 h-8 mr-3 text-orange-600" />
                Politique des Cookies
              </h1>
              <p className="text-gray-600 mt-1">Gestion et information sur l'utilisation des cookies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Qu'est-ce qu'un cookie ?</h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) 
                lors de la visite d'un site internet. Il permet au site de reconnaître votre terminal et de 
                stocker certaines informations sur vos préférences ou actions passées.
              </p>
              <p className="text-gray-700">
                DiddyHome utilise des cookies pour améliorer votre expérience utilisateur, analyser l'utilisation 
                du site et personnaliser le contenu et les publicités.
              </p>
            </div>
          </section>

          {/* Types de cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Types de cookies utilisés</h2>
            
            <div className="space-y-6">
              {/* Cookies nécessaires */}
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Shield className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Cookies nécessaires</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Toujours activé</span>
                    <ToggleRight className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-700 mb-3">
                  Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés. 
                  Ils permettent notamment la navigation, l'authentification et la sécurité.
                </p>
                <div className="text-sm text-gray-600">
                  <strong>Exemples :</strong> Session utilisateur, panier d'achat, préférences de langue, sécurité CSRF
                </div>
              </div>

              {/* Cookies analytiques */}
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Eye className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Cookies analytiques</h3>
                  </div>
                  <button 
                    onClick={() => handleToggle('analytics')}
                    className="flex items-center"
                  >
                    <span className="text-sm text-gray-600 mr-2">
                      {cookiePreferences.analytics ? 'Activé' : 'Désactivé'}
                    </span>
                    {cookiePreferences.analytics ? (
                      <ToggleRight className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-gray-700 mb-3">
                  Ces cookies nous permettent d'analyser l'utilisation du site pour améliorer ses performances 
                  et votre expérience utilisateur. Les données sont anonymisées.
                </p>
                <div className="text-sm text-gray-600">
                  <strong>Exemples :</strong> Google Analytics, statistiques de visite, pages les plus consultées
                </div>
              </div>

              {/* Cookies fonctionnels */}
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Settings className="w-6 h-6 text-purple-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Cookies fonctionnels</h3>
                  </div>
                  <button 
                    onClick={() => handleToggle('functional')}
                    className="flex items-center"
                  >
                    <span className="text-sm text-gray-600 mr-2">
                      {cookiePreferences.functional ? 'Activé' : 'Désactivé'}
                    </span>
                    {cookiePreferences.functional ? (
                      <ToggleRight className="w-6 h-6 text-purple-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-gray-700 mb-3">
                  Ces cookies permettent d'améliorer les fonctionnalités du site et de personnaliser votre expérience 
                  en mémorisant vos choix et préférences.
                </p>
                <div className="text-sm text-gray-600">
                  <strong>Exemples :</strong> Préférences d'affichage, thème sombre/clair, taille de police
                </div>
              </div>

              {/* Cookies marketing */}
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Cookie className="w-6 h-6 text-orange-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Cookies marketing</h3>
                  </div>
                  <button 
                    onClick={() => handleToggle('marketing')}
                    className="flex items-center"
                  >
                    <span className="text-sm text-gray-600 mr-2">
                      {cookiePreferences.marketing ? 'Activé' : 'Désactivé'}
                    </span>
                    {cookiePreferences.marketing ? (
                      <ToggleRight className="w-6 h-6 text-orange-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-gray-700 mb-3">
                  Ces cookies sont utilisés pour afficher des publicités pertinentes et mesurer l'efficacité 
                  de nos campagnes publicitaires. Ils peuvent être partagés avec nos partenaires.
                </p>
                <div className="text-sm text-gray-600">
                  <strong>Exemples :</strong> Google Ads, Facebook Pixel, publicités ciblées
                </div>
              </div>
            </div>
          </section>

          {/* Gestion des cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Gérer vos préférences</h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Vous pouvez à tout moment modifier vos préférences de cookies en utilisant les boutons ci-dessus 
                ou en configurant votre navigateur.
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={savePreferences}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Sauvegarder mes préférences
                </button>
              </div>
            </div>
          </section>

          {/* Configuration navigateur */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Configuration dans votre navigateur</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Vous pouvez également configurer votre navigateur pour refuser tous les cookies ou pour être averti 
                lorsqu'un cookie est envoyé :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
                  <p className="text-gray-600">Paramètres → Confidentialité et sécurité → Cookies</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
                  <p className="text-gray-600">Options → Vie privée et sécurité → Cookies</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                  <p className="text-gray-600">Préférences → Confidentialité → Cookies</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Edge</h4>
                  <p className="text-gray-600">Paramètres → Cookies et autorisations de site</p>
                </div>
              </div>
            </div>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Durée de conservation</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies de session</h4>
                  <p className="text-gray-700 text-sm">
                    Supprimés automatiquement à la fermeture du navigateur
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies persistants</h4>
                  <p className="text-gray-700 text-sm">
                    Conservés jusqu'à 13 mois maximum selon leur finalité
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies analytiques</h4>
                  <p className="text-gray-700 text-sm">
                    Conservés 25 mois (Google Analytics)
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies publicitaires</h4>
                  <p className="text-gray-700 text-sm">
                    Conservés 13 mois maximum
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                Pour toute question concernant notre politique des cookies, vous pouvez nous contacter à :
              </p>
              <p className="text-blue-600 hover:text-blue-700 mt-2">
                <a href="mailto:contact@diddyhome.com">contact@diddyhome.com</a>
              </p>
            </div>
          </section>

          {/* Date de mise à jour */}
          <section className="border-t pt-6">
            <p className="text-gray-500 text-sm">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>
          </section>

          {/* Navigation */}
          <div className="flex justify-center space-x-6 pt-6 border-t">
            <Link 
              href="/legal/mentions-legales" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Mentions légales
            </Link>
            <Link 
              href="/legal/privacy" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Politique de confidentialité
            </Link>
            <Link 
              href="/legal/rgpd" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              RGPD
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
