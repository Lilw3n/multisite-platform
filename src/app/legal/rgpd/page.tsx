'use client';

import React from 'react';
import Link from 'next/link';

export default function RGPDPage() {
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
            🔒 Politique de Protection des Données (RGPD)
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Responsable du traitement</h2>
              <p className="text-gray-700 mb-4">
                Le responsable du traitement des données personnelles est la société exploitant la plateforme multisite.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note :</strong> Les informations complètes du responsable seront mises à jour lors de la réception des documents Kbis.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Données collectées</h2>
              <p className="text-gray-700 mb-4">
                Nous collectons les données suivantes dans le cadre de l'utilisation de notre plateforme :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Données d'identification :</strong> nom, prénom, email, téléphone</li>
                <li><strong>Données de connexion :</strong> adresse IP, logs de connexion</li>
                <li><strong>Données professionnelles :</strong> informations relatives aux activités professionnelles</li>
                <li><strong>Données de navigation :</strong> cookies, pages visitées</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Finalités du traitement</h2>
              <p className="text-gray-700 mb-4">
                Les données sont collectées pour les finalités suivantes :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Gestion des comptes utilisateurs et authentification</li>
                <li>Fourniture des services de la plateforme</li>
                <li>Communication avec les utilisateurs</li>
                <li>Amélioration des services</li>
                <li>Respect des obligations légales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Base légale</h2>
              <p className="text-gray-700 mb-4">
                Le traitement des données repose sur :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Consentement :</strong> pour les cookies non essentiels</li>
                <li><strong>Exécution du contrat :</strong> pour la fourniture des services</li>
                <li><strong>Intérêt légitime :</strong> pour l'amélioration des services</li>
                <li><strong>Obligation légale :</strong> pour la conservation des données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Durée de conservation</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Données de compte :</strong> 3 ans après la dernière activité</li>
                  <li><strong>Données de connexion :</strong> 12 mois</li>
                  <li><strong>Données contractuelles :</strong> 10 ans (obligation légale)</li>
                  <li><strong>Cookies :</strong> 13 mois maximum</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Vos droits</h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Droit d'accès</h3>
                  <p className="text-sm text-green-800">Consulter vos données personnelles</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Droit de rectification</h3>
                  <p className="text-sm text-blue-800">Corriger vos données inexactes</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Droit d'effacement</h3>
                  <p className="text-sm text-yellow-800">Supprimer vos données</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Droit d'opposition</h3>
                  <p className="text-sm text-purple-800">Vous opposer au traitement</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Sécurité des données</h2>
              <p className="text-gray-700 mb-4">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Chiffrement des données sensibles</li>
                <li>Accès restreint aux données personnelles</li>
                <li>Surveillance des accès et des modifications</li>
                <li>Sauvegardes régulières et sécurisées</li>
                <li>Formation du personnel à la protection des données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact</h2>
              <p className="text-gray-700 mb-4">
                Pour exercer vos droits ou pour toute question relative à la protection de vos données :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email :</strong> contact@diddyhome.com<br/>
                  <strong>Objet :</strong> Protection des données personnelles
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Réclamations</h2>
              <p className="text-gray-700 mb-4">
                Vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente :
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>CNIL (Commission Nationale de l'Informatique et des Libertés)</strong><br/>
                  3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07<br/>
                  Téléphone : 01 53 73 22 22<br/>
                  Site web : <a href="https://www.cnil.fr" className="text-blue-600 hover:underline">www.cnil.fr</a>
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
                <li><Link href="/legal/privacy" className="text-gray-300 hover:text-white">Politique de confidentialité</Link></li>
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
