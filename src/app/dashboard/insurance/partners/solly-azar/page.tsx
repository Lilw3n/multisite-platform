'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function SollyAzarPage() {
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);

  const breadcrumb = [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Assurance', href: '/dashboard/insurance' },
    { label: 'Partenaires', href: '/dashboard/insurance/partners' },
    { label: 'Solly Azar VTC' }
  ];

  const requirements = {
    antecedents: '33 mois sur les 36 derniers mois',
    typeAntecedents: 'Particuliers acceptés',
    bonus: '0.85 à 0.50',
    age: '27 à 65 ans',
    permis: '≥ 5 ans',
    sinistres: 'Max 4 sinistres dont : aucun corporel responsable. 1 corporel non responsable, 2 matériels responsables, 3 matériels non resp., 2 BDG, 1 vol/inc.',
    responsabilite: 'Aucun corporel responsable accepté'
  };

  const emailTemplate = `Bonjour Mme/Mr,

Suite à votre demande de devis.

Pouvez vous m'indiquer :

- Votre bonus malus
- si vous avez au moins été assuré 33 mois en tant que particulier
et/ou
- si vous avez au moins été assuré 1 an dans les 12 derniers mois en tant que chauffeur VTC

*Selon la compagnie il nous est demandé entre 12 à 33 mois minimums (parfois assuré en tant que VTC)*

Ancienneté Permis B :
3 ans *(ou 2 ans en cas de conduite accompagnée) parfois 5 ans selon la compagnie*

- Age minimum : au cas par cas *( parfois 25 ou 27 ans selon la compagnie)*

Merci de nous dire/envoyer :

- Statut Matrimonial
- Ville de naissance + Code Postal de naissance ( si non indiqué sur la pièce d'identité en + du Pays de Naissance)
- Lieu de Stationnement du véhicule ( Garage clos, Voie publique, Parking Privée)
- KBIS ( récent, édité il y a moins de 3 mois ) avec adresse de l'entreprise
- **Permis** recto Verso (en cours de validité)
- Carte d'identité recto verso (autre que permis )
- **Carte pro** recto verso (en cours de validité)
**Relevé d'information (perso/pro) sur les 36 derniers mois** (récent, édité il y a moins de 3 mois)
- **Carte grise** Française ou Bon de commande . (Avec la **plaque d'immatriculation** définitive si possible + **date de première immatriculation**)
- Code SRA si vous le connaissez
- Véhicule en leasing ou location ? Si oui contrat de leasing nécessaire

Pièces / infos facultatives mais utiles :

- *Photo compteur kilométrique (**kilométrage du véhicule**)*
- ***Valeur d'achat du véhicule***
- *Version ou finition du véhicule ( Ex : Peugeot 508 hybrid Edition Business 2.0 Hdi)*
- *Capture de votre note UBER (si supérieur à 4)*

**PS : Les éléments en gras au minimum me permettront de vous sortir un tarif,**

Mon mail : contact@diddyhome.com

Cdlt`;

  return (
    <Layout
      title="Solly Azar VTC"
      subtitle="Assurance VTC avec antécédents particuliers acceptés"
      breadcrumb={breadcrumb}
    >
      <div className="space-y-6">
        {/* En-tête du partenaire */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center">
            <span className="text-4xl mr-4">☀️</span>
            <div>
              <h2 className="text-2xl font-bold text-orange-900">Solly Azar VTC</h2>
              <p className="text-orange-700">Assurance VTC avec antécédents particuliers acceptés</p>
              <p className="text-sm text-orange-600 mt-2">
                Partenaire idéal pour les chauffeurs VTC ayant des antécédents en assurance particulière
              </p>
            </div>
          </div>
        </div>

        {/* Conditions détaillées */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conditions d'éligibilité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Antécédents requis</label>
                <p className="mt-1 text-sm text-gray-900">{requirements.antecedents}</p>
                <p className="text-xs text-gray-500">{requirements.typeAntecedents}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bonus requis</label>
                <p className="mt-1 text-sm text-gray-900">{requirements.bonus}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Âge requis</label>
                <p className="mt-1 text-sm text-gray-900">{requirements.age}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ancienneté permis</label>
                <p className="mt-1 text-sm text-gray-900">{requirements.permis}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sinistralité max (36 mois)</label>
                <p className="mt-1 text-sm text-gray-900">{requirements.sinistres}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Responsabilité</label>
                <p className="mt-1 text-sm text-gray-900">{requirements.responsabilite}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Avantages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Avantages Solly Azar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <div>
                <h4 className="font-medium text-gray-900">Antécédents particuliers</h4>
                <p className="text-sm text-gray-600">Accepte les chauffeurs ayant été assurés en particulier</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <div>
                <h4 className="font-medium text-gray-900">Bonus favorable</h4>
                <p className="text-sm text-gray-600">Bonus entre 0.85 et 0.50 requis</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <div>
                <h4 className="font-medium text-gray-900">Matériels non responsables</h4>
                <p className="text-sm text-gray-600">Accepte jusqu'à 3 sinistres matériels non responsables</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <div>
                <h4 className="font-medium text-gray-900">Corporel non responsable</h4>
                <p className="text-sm text-gray-600">Accepte 1 sinistre corporel non responsable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Restrictions importantes */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-900 mb-4">⚠️ Restrictions importantes</h3>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              <p className="text-sm text-red-700">Aucun sinistre corporel responsable accepté</p>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              <p className="text-sm text-red-700">Maximum 2 sinistres matériels responsables</p>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              <p className="text-sm text-red-700">Maximum 2 bris de glace</p>
            </div>
          </div>
        </div>

        {/* Templates de mails */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Templates de Mails</h3>
            <button
              onClick={() => setShowEmailTemplate(!showEmailTemplate)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {showEmailTemplate ? 'Masquer' : 'Voir'} le template
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Mail type - Demande de devis Solly Azar</h4>
              <p className="text-sm text-gray-600 mb-2">
                Template spécialement adapté pour les demandes de devis Solly Azar VTC
              </p>
              <div className="flex space-x-2">
                <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                  Copier le template
                </button>
                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                  Envoyer un mail
                </button>
              </div>
            </div>

            {showEmailTemplate && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Template complet :</h4>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                  {emailTemplate}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques Solly Azar</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">78%</div>
              <div className="text-sm text-gray-600">Taux d'acceptation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">33 mois</div>
              <div className="text-sm text-gray-600">Antécédents requis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0.50</div>
              <div className="text-sm text-gray-600">Bonus min requis</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Link
            href="/dashboard/insurance/partners"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium"
          >
            ← Retour aux partenaires
          </Link>
          <div className="space-x-3">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-medium">
              📧 Envoyer un devis
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium">
              📋 Nouveau contrat
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
