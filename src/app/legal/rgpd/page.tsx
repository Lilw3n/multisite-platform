'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Trash2, Download, UserCheck, AlertTriangle } from 'lucide-react';

export default function RGPDPage() {
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
                <Shield className="w-8 h-8 mr-3 text-blue-600" />
                RGPD - Protection des Données
              </h1>
              <p className="text-gray-600 mt-1">Règlement Général sur la Protection des Données</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                Votre vie privée est notre priorité
              </h2>
              <p className="text-gray-700">
                DiddyHome s'engage à protéger et respecter votre vie privée conformément au Règlement Général 
                sur la Protection des Données (RGPD) et à la loi française « Informatique et Libertés ».
              </p>
            </div>
          </section>

          {/* Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Responsable du traitement</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Identité</h3>
                  <p className="text-gray-700">DiddyHome</p>
                  <p className="text-gray-700">SIREN : 810571513</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-700">
                    Email : <a href="mailto:dpo@diddyhome.com" className="text-blue-600 hover:text-blue-700">dpo@diddyhome.com</a>
                  </p>
                  <p className="text-gray-700">Adresse : 15 & 17 Rue Pierre Curie, 54110 Varangéville</p>
                </div>
              </div>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Données personnelles collectées</h2>
            
            <div className="space-y-6">
              {/* Données d'identification */}
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                  Données d'identification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Collectées directement :</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Nom et prénom</li>
                      <li>• Adresse email</li>
                      <li>• Numéro de téléphone</li>
                      <li>• Adresse postale</li>
                      <li>• Date de naissance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Finalités :</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Création et gestion de compte</li>
                      <li>• Fourniture des services</li>
                      <li>• Communication client</li>
                      <li>• Obligations légales</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Données d'assurance */}
              <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-orange-600" />
                  Données d'assurance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Informations collectées :</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Historique des sinistres</li>
                      <li>• Informations véhicules</li>
                      <li>• Données de conduite</li>
                      <li>• Situation familiale</li>
                      <li>• Revenus (si nécessaire)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Finalités :</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Établissement des devis</li>
                      <li>• Gestion des contrats</li>
                      <li>• Évaluation des risques</li>
                      <li>• Prévention de la fraude</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Données techniques */}
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-600" />
                  Données techniques
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Collectées automatiquement :</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Adresse IP</li>
                      <li>• Type de navigateur</li>
                      <li>• Pages visitées</li>
                      <li>• Durée de visite</li>
                      <li>• Cookies</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Finalités :</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Amélioration du site</li>
                      <li>• Statistiques d'usage</li>
                      <li>• Sécurité</li>
                      <li>• Personnalisation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Base légale des traitements</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Exécution du contrat</h3>
                  <p className="text-gray-700 text-sm">
                    Traitement nécessaire à l'exécution des services d'assurance et de courtage
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Obligation légale</h3>
                  <p className="text-gray-700 text-sm">
                    Respect des obligations du Code des assurances et de la réglementation ORIAS
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Intérêt légitime</h3>
                  <p className="text-gray-700 text-sm">
                    Amélioration des services, prévention de la fraude, prospection commerciale
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Consentement</h3>
                  <p className="text-gray-700 text-sm">
                    Cookies non essentiels, communications marketing, données sensibles
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Vos droits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vos droits RGPD</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  Droit d'accès
                </h3>
                <p className="text-gray-700 text-sm">
                  Vous pouvez demander l'accès à toutes vos données personnelles que nous détenons
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                  Droit de rectification
                </h3>
                <p className="text-gray-700 text-sm">
                  Vous pouvez demander la correction de données inexactes ou incomplètes
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                  Droit à l'effacement
                </h3>
                <p className="text-gray-700 text-sm">
                  Vous pouvez demander la suppression de vos données dans certaines conditions
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-purple-600" />
                  Droit à la limitation
                </h3>
                <p className="text-gray-700 text-sm">
                  Vous pouvez demander la limitation du traitement de vos données
                </p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-orange-600" />
                  Droit à la portabilité
                </h3>
                <p className="text-gray-700 text-sm">
                  Vous pouvez récupérer vos données dans un format structuré et lisible
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  Droit d'opposition
                </h3>
                <p className="text-gray-700 text-sm">
                  Vous pouvez vous opposer au traitement de vos données pour des raisons légitimes
                </p>
              </div>
            </div>
          </section>

          {/* Exercer vos droits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Comment exercer vos droits ?</h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Pour exercer vos droits, contactez-nous par email à :
              </p>
              <div className="text-center">
                <a 
                  href="mailto:dpo@diddyhome.com" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                >
                  dpo@diddyhome.com
                </a>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                Nous vous répondrons dans un délai maximum de 30 jours. Une pièce d'identité pourra être demandée 
                pour vérifier votre identité.
              </p>
            </div>
          </section>

          {/* Conservation des données */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Durée de conservation</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Données clients actifs</h3>
                  <p className="text-gray-700 text-sm">
                    Conservées pendant toute la durée de la relation contractuelle + 5 ans
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Données prospects</h3>
                  <p className="text-gray-700 text-sm">
                    Conservées 3 ans à compter du dernier contact
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Données de navigation</h3>
                  <p className="text-gray-700 text-sm">
                    Conservées 13 mois maximum (cookies)
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Archives légales</h3>
                  <p className="text-gray-700 text-sm">
                    Conservées selon les obligations légales (jusqu'à 30 ans pour l'assurance)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sécurité des données</h2>
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Chiffrement des données sensibles</li>
                  <li>• Accès restreint et authentification forte</li>
                  <li>• Sauvegarde régulière des données</li>
                  <li>• Surveillance et détection d'intrusion</li>
                </ul>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Formation du personnel à la sécurité</li>
                  <li>• Audits de sécurité réguliers</li>
                  <li>• Procédures de gestion des incidents</li>
                  <li>• Mise à jour des systèmes de sécurité</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Transferts de données */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Transferts de données</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Vos données peuvent être partagées avec :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Partenaires assureurs</h3>
                  <p className="text-gray-700 text-sm">
                    Pour l'établissement des devis et la gestion des contrats
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Prestataires techniques</h3>
                  <p className="text-gray-700 text-sm">
                    Hébergement, maintenance, support client (sous contrat de sous-traitance)
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Autorités compétentes</h3>
                  <p className="text-gray-700 text-sm">
                    En cas d'obligation légale ou de réquisition judiciaire
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Transferts hors UE</h3>
                  <p className="text-gray-700 text-sm">
                    Uniquement vers des pays avec décision d'adéquation ou clauses contractuelles types
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Réclamation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Droit de réclamation</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, 
                vous avez le droit d'introduire une réclamation auprès de la CNIL :
              </p>
              <div className="text-center">
                <a 
                  href="https://www.cnil.fr/fr/plaintes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                >
                  Déposer une plainte à la CNIL
                </a>
              </div>
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
              href="/legal/cookies" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Politique des cookies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}