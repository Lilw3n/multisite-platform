'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DebitDetailProps {
  params: {
    id: string;
  };
}

export default function DebitDetailPage({ params }: DebitDetailProps) {
  const { id } = params;
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');

      if (token && email && name) {
        setUser({ email, name });
        setIsLoading(false);
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  // Données fictives pour le débit
  const debit = {
    id: id,
    date: '2024-01-20',
    amount: 1500,
    remaining: 1500,
    description: 'Commission trimestrielle AXA',
    type: 'Commission assurance',
    status: 'En attente',
    dueDate: '2024-02-20',
    supplier: {
      name: 'AXA Assurance',
      contact: 'Marie Dubois',
      email: 'marie.dubois@axa.fr',
      phone: '01 40 75 12 34',
      address: '25 Avenue Matignon, 75008 Paris',
      siret: '12345678901234'
    },
    paymentDetails: {
      accountNumber: 'FR76 9876 5432 1098 7654 3210 987',
      bankName: 'Crédit Agricole',
      iban: 'FR76 9876 5432 1098 7654 3210 987',
      bic: 'AGRIFRPP'
    },
    documents: [
      { name: 'Facture_AXA_2024_Q1.pdf', type: 'Facture', size: '312 KB' },
      { name: 'Contrat_commission_2024.pdf', type: 'Contrat', size: '890 KB' },
      { name: 'Rapport_ventes_Q1.pdf', type: 'Rapport', size: '1.5 MB' }
    ],
    history: [
      { date: '2024-01-20 10:30', action: 'Débit créé', user: 'Système automatique' },
      { date: '2024-01-20 10:25', action: 'Facture reçue', user: 'Marie Dubois' },
      { date: '2024-01-19 16:45', action: 'Période de commission calculée', user: 'Système automatique' }
    ],
    linkedItems: [
      { type: 'Contrat', id: 'CONT-2024-001', name: 'Contrat AXA Transport' },
      { type: 'Client', id: 'CLI-2024-003', name: 'SARL Transport Express' },
      { type: 'Période', id: 'PER-2024-Q1', name: 'Q1 2024' }
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-sm text-gray-600">Chargement du débit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Détail du Débit #{debit.id}
              </h1>
              <p className="text-sm text-gray-600">
                {debit.amount.toLocaleString()}€ - {debit.supplier.name}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => console.log(`Modifier débit ${id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Modifier
              </button>
              <button
                onClick={() => console.log(`Lier débit ${id}`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Lier
              </button>
              <button
                onClick={() => console.log(`Délier débit ${id}`)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Délier
              </button>
              <button
                onClick={() => router.back()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Détails du débit */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du Débit</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant total</label>
                  <p className="mt-1 text-2xl font-bold text-red-600">{debit.amount.toLocaleString()}€</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant restant</label>
                  <p className="mt-1 text-xl font-bold text-orange-600">{debit.remaining.toLocaleString()}€</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <span className={`mt-1 inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    debit.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                    debit.status === 'Payé' ? 'bg-green-100 text-green-800' :
                    debit.status === 'En retard' ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {debit.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <span className="mt-1 inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {debit.type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de création</label>
                  <p className="mt-1 text-gray-900">{debit.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date d'échéance</label>
                  <p className="mt-1 text-gray-900">{debit.dueDate}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{debit.description}</p>
                </div>
              </div>
            </div>

            {/* Informations fournisseur */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations Fournisseur</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                  <p className="mt-1 text-gray-900">{debit.supplier.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <p className="mt-1 text-gray-900">{debit.supplier.contact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{debit.supplier.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <p className="mt-1 text-gray-900">{debit.supplier.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SIRET</label>
                  <p className="mt-1 text-gray-900 font-mono">{debit.supplier.siret}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <p className="mt-1 text-gray-900">{debit.supplier.address}</p>
                </div>
              </div>
            </div>

            {/* Détails de paiement */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails de Paiement</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Compte à débiter</label>
                  <p className="mt-1 text-gray-900 font-mono">{debit.paymentDetails.accountNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Banque</label>
                  <p className="mt-1 text-gray-900">{debit.paymentDetails.bankName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IBAN</label>
                  <p className="mt-1 text-gray-900 font-mono">{debit.paymentDetails.iban}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BIC</label>
                  <p className="mt-1 text-gray-900 font-mono">{debit.paymentDetails.bic}</p>
                </div>
              </div>
            </div>

            {/* Éléments liés */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Éléments Liés</h2>
              <div className="space-y-3">
                {debit.linkedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.type} • {item.id}</p>
                    </div>
                    <button
                      onClick={() => console.log(`Voir ${item.type} ${item.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Voir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
              <div className="space-y-3">
                {debit.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                    </div>
                    <button
                      onClick={() => console.log(`Télécharger ${doc.name}`)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Télécharger
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Historique */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Historique</h3>
              <div className="space-y-3">
                {debit.history.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{entry.action}</p>
                      <p className="text-xs text-gray-500">{entry.date}</p>
                      <p className="text-xs text-gray-400">par {entry.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions Rapides</h3>
              <div className="space-y-2">
                <button
                  onClick={() => console.log(`Payer débit ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  💳 Marquer comme payé
                </button>
                <button
                  onClick={() => console.log(`Planifier paiement ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  📅 Planifier le paiement
                </button>
                <button
                  onClick={() => console.log(`Exporter ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  📊 Exporter en PDF
                </button>
                <button
                  onClick={() => console.log(`Relancer ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  📧 Relancer le fournisseur
                </button>
                <button
                  onClick={() => console.log(`Annuler ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md"
                >
                  ❌ Annuler le débit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
