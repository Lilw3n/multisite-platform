'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function PartnersPage() {
  const breadcrumb = [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Assurance', href: '/dashboard/insurance' },
    { label: 'Partenaires' }
  ];

  const partners = [
    {
      id: 'zephir',
      name: 'Zéphir VTC Taxi',
      logo: '🌪️',
      description: 'Assurance VTC et Taxi avec conditions flexibles',
      color: 'blue',
      requirements: {
        antecedents: '12 mois VTC, 0 mois pour Taxi',
        bonus: '≤ 1.50',
        age: '25 à 65 ans',
        permis: '≥ 5 ans',
        sinistres: 'Max 4 sinistres dont 1 corporel, 3 matériels'
      }
    },
    {
      id: 'solly-azar',
      name: 'Solly Azar VTC',
      logo: '☀️',
      description: 'Assurance VTC avec antécédents particuliers acceptés',
      color: 'orange',
      requirements: {
        antecedents: '33 mois sur les 36 derniers mois',
        bonus: '0.85 à 0.50',
        age: '27 à 65 ans',
        permis: '≥ 5 ans',
        sinistres: 'Max 4 sinistres, aucun corporel responsable'
      }
    },
    {
      id: '2m2a',
      name: '2M2A VTC Taxi',
      logo: '🏢',
      description: 'Assurance VTC et Taxi avec conditions strictes',
      color: 'green',
      requirements: {
        antecedents: '12 mois sans interruption en VTC',
        bonus: '0.50 à 1.00',
        age: 'Non précisé',
        permis: '≥ 3 ans (2 ans conduite accompagnée)',
        sinistres: 'Aucun corporel responsable, aucun sinistre 12 mois'
      }
    },
    {
      id: 'axece',
      name: 'Axece Assurance VTC',
      logo: '🛡️',
      description: 'Assurance VTC pour débutants et expérimentés',
      color: 'purple',
      requirements: {
        antecedents: '36 mois perso ou 12 mois pro',
        bonus: '0.85+ à 1.50',
        age: '≥ 25 ans',
        permis: '≥ 5 ans',
        sinistres: 'Max 4 sinistres dont 3 matériels'
      }
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Layout
      title="Partenaires Assurance"
      subtitle="Tableau comparatif des partenaires assureurs VTC/Taxi"
      breadcrumb={breadcrumb}
    >
      <div className="space-y-6">
        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Partenaires Assurance VTC/Taxi</h3>
          <p className="text-blue-700">
            Découvrez nos partenaires assureurs spécialisés dans l'assurance VTC et Taxi. 
            Chaque partenaire propose des conditions spécifiques adaptées à différents profils de chauffeurs.
          </p>
        </div>

        {/* Tableau comparatif */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Les solutions avec les partenaires Taxi / VTC</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Antécédents requis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus requis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge requis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permis ancienneté</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sinistralité max (36 mois)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🌪️</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Zéphir VTC Taxi</div>
                        <div className="text-sm text-gray-500">VTC (Taxi sans exigence)</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">12 mois VTC, 0 mois pour Taxi</td>
                  <td className="px-6 py-4 text-sm text-gray-900">≤ 1.50</td>
                  <td className="px-6 py-4 text-sm text-gray-900">25 à 65 ans</td>
                  <td className="px-6 py-4 text-sm text-gray-900">≥ 5 ans</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                      <strong>Max 4 sinistres</strong> dont : 1 corporel (resp. ou non), 3 matériels (resp. ou non), 1 stationnement, 2 bris de glace, 1 vol/incendie. Aucun cas aggravant 5 ans.
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href="/dashboard/insurance/partners/zephir"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Voir détails
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">☀️</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Solly Azar VTC</div>
                        <div className="text-sm text-gray-500">Particuliers acceptés</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">33 mois sur les 36 derniers mois</td>
                  <td className="px-6 py-4 text-sm text-gray-900">0.85 à 0.50</td>
                  <td className="px-6 py-4 text-sm text-gray-900">27 à 65 ans</td>
                  <td className="px-6 py-4 text-sm text-gray-900">≥ 5 ans</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                      <strong>Max 4 sinistres</strong> dont : aucun corporel responsable. 1 corporel non responsable, 2 matériels responsables, 3 matériels non resp., 2 BDG, 1 vol/inc.
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href="/dashboard/insurance/partners/solly-azar"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Voir détails
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏢</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">2M2A VTC Taxi</div>
                        <div className="text-sm text-gray-500">VTC et plus récemment Taxi</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">12 mois sans interruption en VTC</td>
                  <td className="px-6 py-4 text-sm text-gray-900">0.50 à 1.00</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Non précisé</td>
                  <td className="px-6 py-4 text-sm text-gray-900">≥ 3 ans (2 ans conduite accompagnée)</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                      <strong>Aucun sinistre corporel responsable</strong> en 36 mois, <strong>aucun sinistre tout court sur 12 derniers mois</strong>, max 3 mois sans assurance.
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href="/dashboard/insurance/partners/2m2a"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Voir détails
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🛡️</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Axece Assurance VTC</div>
                        <div className="text-sm text-gray-500">Débutants et expérimentés</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">36 mois perso ou 12 mois pro</td>
                  <td className="px-6 py-4 text-sm text-gray-900">0.85+ à 1.50</td>
                  <td className="px-6 py-4 text-sm text-gray-900">≥ 25 ans</td>
                  <td className="px-6 py-4 text-sm text-gray-900">≥ 5 ans</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                      <strong>Max 4 sinistres</strong> dont 3 matériels, et max 2 sinistres 100% responsables
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href="/dashboard/insurance/partners/axece"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Voir détails
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cartes des partenaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-4xl mb-4">{partner.logo}</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{partner.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{partner.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div><strong>Antécédents:</strong> {partner.requirements.antecedents}</div>
                  <div><strong>Bonus:</strong> {partner.requirements.bonus}</div>
                  <div><strong>Âge:</strong> {partner.requirements.age}</div>
                </div>

                <Link
                  href={`/dashboard/insurance/partners/${partner.id}`}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getColorClasses(partner.color)}`}
                >
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Templates de mails */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Templates de Mails</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Mail type - Demande de devis</h4>
              <p className="text-sm text-gray-600 mb-2">
                Template pour demander les informations nécessaires à un devis
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Voir le template complet →
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Mail type - Contrat Kelips</h4>
              <p className="text-sm text-gray-600 mb-2">
                Template pour les clients ayant déjà un contrat Kelips
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Voir le template complet →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
