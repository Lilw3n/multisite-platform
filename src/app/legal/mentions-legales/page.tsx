'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Building, Phone, Mail, Globe } from 'lucide-react';

export default function MentionsLegalesPage() {
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
                Mentions Légales
              </h1>
              <p className="text-gray-600 mt-1">Informations légales et réglementaires</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Éditeur du site */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-6 h-6 mr-2 text-blue-600" />
              Éditeur du site
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Raison sociale</h3>
                  <p className="text-gray-700">DiddyHome</p>
                  <p className="text-gray-700">Plateforme multisite connectée</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Forme juridique</h3>
                  <p className="text-gray-700">Entreprise individuelle</p>
                  <p className="text-gray-700">SIREN : 810571513</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Adresse du siège</h3>
                  <p className="text-gray-700">15 & 17 Rue Pierre Curie</p>
                  <p className="text-gray-700">54110 Varangéville</p>
                  <p className="text-gray-700">France</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                  <div className="flex items-center text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href="mailto:contact@diddyhome.com" className="text-blue-600 hover:text-blue-700">
                      contact@diddyhome.com
                    </a>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>www.diddyhome.com</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Directeur de publication */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Directeur de publication</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>Diddy</strong> - Fondateur et directeur de publication
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Contact via : <a href="mailto:contact@diddyhome.com" className="text-blue-600 hover:text-blue-700">contact@diddyhome.com</a>
              </p>
            </div>
          </section>

          {/* Activité d'intermédiation en assurance */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-green-600" />
              Activité d'intermédiation en assurance
            </h2>
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Immatriculation ORIAS</h3>
                  <p className="text-gray-700">
                    <strong>N° ORIAS : 15005935</strong>
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Organisme pour le registre des intermédiaires en assurance
                  </p>
                  <a 
                    href="https://www.orias.fr/search?numero=15005935" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Vérifier sur ORIAS.fr →
                  </a>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Catégories d'intermédiation</h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Courtier en assurances</li>
                    <li>• Assurance de biens et responsabilités</li>
                    <li>• Assurance de personnes</li>
                    <li>• Assurance vie et capitalisation</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Garantie financière</h3>
                  <p className="text-gray-700 text-sm">
                    Garantie financière souscrite auprès d'un établissement de crédit agréé
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Assurance RCP</h3>
                  <p className="text-gray-700 text-sm">
                    Assurance de responsabilité civile professionnelle souscrite
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hébergement</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Hébergeur :</strong> À définir en production
              </p>
              <p className="text-gray-600 text-sm">
                Les informations d'hébergement seront mises à jour lors du déploiement en production.
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p className="text-gray-700">
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite 
                sauf autorisation expresse du directeur de publication.
              </p>
            </div>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation de responsabilité</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, 
                mais peut toutefois contenir des inexactitudes ou des omissions.
              </p>
              <p className="text-gray-700 mb-4">
                Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, 
                merci de bien vouloir le signaler par email à <a href="mailto:contact@diddyhome.com" className="text-blue-600 hover:text-blue-700">contact@diddyhome.com</a> 
                en décrivant le problème de la manière la plus précise possible.
              </p>
              <p className="text-gray-700">
                DiddyHome ne pourra en aucun cas être tenu responsable de dommages directs ou indirects, 
                matériels ou immatériels résultant de l'utilisation de son site.
              </p>
            </div>
          </section>

          {/* Liens vers d'autres sites */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Liens vers d'autres sites</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                DiddyHome propose des liens vers d'autres sites internet. Ces liens externes n'engagent pas la responsabilité de DiddyHome 
                quant au contenu de ces sites. La responsabilité de DiddyHome ne saurait être engagée en cas de dysfonctionnement ou 
                d'indisponibilité d'accès à ces sites externes.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Droit applicable</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                Tout litige en relation avec l'utilisation du site DiddyHome est soumis au droit français. 
                Il est fait attribution exclusive de juridiction aux tribunaux compétents de Nancy.
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
