'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                🚀 Plateforme Multisite
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">
                Accueil
              </Link>
              <Link href="/legal" className="text-gray-500 hover:text-gray-900">
                Mentions légales
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔐 Politique de Confidentialité
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme multisite.
              </p>
              <p className="text-gray-700 mb-4">
                En utilisant notre service, vous acceptez les pratiques décrites dans cette politique.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Informations que nous collectons</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Informations que vous nous fournissez</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Numéro de téléphone</li>
                <li>Informations professionnelles</li>
                <li>Données de facturation</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Informations collectées automatiquement</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Pages visitées et durée de visite</li>
                <li>Données de géolocalisation (si autorisées)</li>
                <li>Cookies et technologies similaires</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Utilisation des informations</h2>
              <p className="text-gray-700 mb-4">
                Nous utilisons vos informations pour :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Services</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Fournir nos services</li>
                    <li>• Gérer votre compte</li>
                    <li>• Traiter les paiements</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Communication</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Vous contacter</li>
                    <li>• Envoyer des notifications</li>
                    <li>• Support client</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Amélioration</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Analyser l'utilisation</li>
                    <li>• Améliorer nos services</li>
                    <li>• Développer de nouvelles fonctionnalités</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Légal</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Respecter les obligations légales</li>
                    <li>• Prévenir la fraude</li>
                    <li>• Protéger nos droits</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Partage des informations</h2>
              <p className="text-gray-700 mb-4">
                Nous ne vendons, ne louons ni ne partageons vos informations personnelles avec des tiers, sauf dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Avec votre consentement :</strong> Lorsque vous nous donnez explicitement votre accord</li>
                <li><strong>Prestataires de services :</strong> Pour nous aider à fournir nos services (hébergement, paiement, etc.)</li>
                <li><strong>Obligations légales :</strong> Lorsque la loi l'exige</li>
                <li><strong>Protection des droits :</strong> Pour protéger nos droits, votre sécurité ou celle d'autrui</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies et technologies similaires</h2>
              <p className="text-gray-700 mb-4">
                Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Types de cookies utilisés :</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                  <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
                  <li><strong>Cookies de performance :</strong> Pour analyser l'utilisation du site</li>
                  <li><strong>Cookies de fonctionnalité :</strong> Pour mémoriser vos préférences</li>
                  <li><strong>Cookies de ciblage :</strong> Pour personnaliser le contenu</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Sécurité des données</h2>
              <p className="text-gray-700 mb-4">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Chiffrement SSL/TLS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Accès restreint aux données</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Surveillance des accès</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Sauvegardes régulières</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Formation du personnel</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Audits de sécurité</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Vos droits</h2>
              <p className="text-gray-700 mb-4">
                Vous avez le droit de :
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Accéder</strong> à vos données personnelles</li>
                  <li><strong>Rectifier</strong> les informations inexactes</li>
                  <li><strong>Supprimer</strong> vos données personnelles</li>
                  <li><strong>Limiter</strong> le traitement de vos données</li>
                  <li><strong>Vous opposer</strong> au traitement</li>
                  <li><strong>Portabilité</strong> de vos données</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4">
                Pour exercer ces droits, contactez-nous à : <strong>contact@diddyhome.com</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Conservation des données</h2>
              <p className="text-gray-700 mb-4">
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Fournir nos services</li>
                <li>Respecter nos obligations légales</li>
                <li>Résoudre les litiges</li>
                <li>Faire respecter nos accords</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modifications de cette politique</h2>
              <p className="text-gray-700 mb-4">
                Nous pouvons modifier cette politique de confidentialité de temps à autre. 
                Nous vous informerons de tout changement important par e-mail ou par un avis sur notre site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Pour toute question concernant cette politique de confidentialité :
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Email :</strong> contact@diddyhome.com<br/>
                  <strong>Objet :</strong> Politique de confidentialité
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Plateforme Multisite</h3>
              <p className="text-gray-300 text-sm">
                Solution complète de gestion multisite avec système de rôles hiérarchique.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal" className="text-gray-300 hover:text-white">Mentions légales</Link></li>
                <li><Link href="/legal/rgpd" className="text-gray-300 hover:text-white">RGPD</Link></li>
                <li><Link href="/legal/cookies" className="text-gray-300 hover:text-white">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300 text-sm">
                Email : contact@diddyhome.com
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
