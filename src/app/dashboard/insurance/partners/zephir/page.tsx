'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function ZephirPage() {
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);

  const breadcrumb = [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Assurance', href: '/dashboard/insurance' },
    { label: 'Partenaires', href: '/dashboard/insurance/partners' },
    { label: 'Zéphir VTC Taxi' }
  ];

  const requirements = {
    antecedents: '12 mois VTC, 0 mois pour Taxi',
    typeAntecedents: 'VTC (Taxi sans exigence)',
    bonus: '≤ 1.50',
    age: '25 à 65 ans',
    permis: '≥ 5 ans',
    sinistres: 'Max 4 sinistres dont : 1 corporel (resp. ou non), 3 matériels (resp. ou non), 1 stationnement, 2 bris de glace, 1 vol/incendie. Aucun cas aggravant 5 ans.',
    responsabilite: 'Accepté si responsable ou non, hors cas aggravants'
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
      title="Zéphir VTC Taxi"
      subtitle="Assurance VTC et Taxi avec conditions flexibles"
      breadcrumb={breadcrumb}
    >
      <div className="space-y-6">
        {/* En-tête du partenaire */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <span className="text-4xl mr-4">🌪️</span>
            <div>
              <h2 className="text-2xl font-bold text-blue-900">Zéphir VTC Taxi</h2>
              <p className="text-blue-700">Assurance VTC et Taxi avec conditions flexibles</p>
              <p className="text-sm text-blue-600 mt-2">
                Partenaire spécialisé dans l'assurance VTC et Taxi avec des conditions adaptées aux différents profils
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Avantages Zéphir</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <div>
                <h4 className="font-medium text-gray-900">Conditions flexibles</h4>
                <p className="text-sm text-gray-600">Accepte les sinistres responsables et non responsables</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <div>
                <h4 className="font-medium text-gray-900">Taxi sans exigence</h4>
                <p className="text-sm text-gray-600">0 mois d'antécédents requis pour les chauffeurs de taxi</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <div>
                <h4 className="font-medium text-gray-900">Bonus élevé accepté</h4>
                <p className="text-sm text-gray-600">Accepte jusqu'à 1.50 de bonus malus</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <div>
                <h4 className="font-medium text-gray-900">Tranche d'âge large</h4>
                <p className="text-sm text-gray-600">De 25 à 65 ans</p>
              </div>
            </div>
          </div>
        </div>

        {/* Templates de mails */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Templates de Mails</h3>
            <button
              onClick={() => setShowEmailTemplate(!showEmailTemplate)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {showEmailTemplate ? 'Masquer' : 'Voir'} le template
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Mail type - Demande de devis Zéphir</h4>
              <p className="text-sm text-gray-600 mb-2">
                Template spécialement adapté pour les demandes de devis Zéphir VTC/Taxi
              </p>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques Zéphir</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-gray-600">Taux d'acceptation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12 mois</div>
              <div className="text-sm text-gray-600">Antécédents VTC requis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1.50</div>
              <div className="text-sm text-gray-600">Bonus max accepté</div>
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium">
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
