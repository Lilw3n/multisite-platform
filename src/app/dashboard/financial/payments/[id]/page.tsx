'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PaymentDetailProps {
  params: {
    id: string;
  };
}

export default function PaymentDetailPage({ params }: PaymentDetailProps) {
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

  // Données fictives pour le paiement
  const payment = {
    id: id,
    date: '2024-01-15',
    amount: 2500,
    description: 'Prime d\'assurance véhicules',
    method: 'Virement bancaire',
    status: 'Confirmé',
    reference: 'REF-INS-001',
    client: {
      name: 'SARL Transport Express',
      contact: 'Jean Dupont',
      email: 'jean.dupont@transport-express.com',
      phone: '01 23 45 67 89',
      address: '123 Rue de la Logistique, 75000 Paris'
    },
    bankDetails: {
      accountNumber: 'FR76 1234 5678 9012 3456 7890 123',
      bankName: 'Banque Nationale',
      transactionId: 'TXN-2024-001-2500'
    },
    documents: [
      { name: 'Facture_2024_001.pdf', type: 'Facture', size: '245 KB' },
      { name: 'Reçu_paiement_001.pdf', type: 'Reçu', size: '156 KB' },
      { name: 'Contrat_assurance_001.pdf', type: 'Contrat', size: '1.2 MB' }
    ],
    history: [
      { date: '2024-01-15 14:30', action: 'Paiement confirmé', user: 'Système automatique' },
      { date: '2024-01-15 14:25', action: 'Virement reçu', user: 'Banque Nationale' },
      { date: '2024-01-15 09:15', action: 'Paiement initié', user: 'Jean Dupont' },
      { date: '2024-01-14 16:45', action: 'Facture générée', user: 'Marie Curie' }
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-sm text-gray-600">Chargement du paiement...</p>
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
                Détail du Paiement #{payment.id}
              </h1>
              <p className="text-sm text-gray-600">
                Paiement de {payment.amount.toLocaleString()}€ - {payment.client.name}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => console.log(`Modifier paiement ${id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Modifier
              </button>
              <button
                onClick={() => console.log(`Lier paiement ${id}`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Lier
              </button>
              <button
                onClick={() => console.log(`Délier paiement ${id}`)}
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
            {/* Détails du paiement */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du Paiement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant</label>
                  <p className="mt-1 text-2xl font-bold text-green-600">{payment.amount.toLocaleString()}€</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <span className="mt-1 inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {payment.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-gray-900">{payment.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Méthode</label>
                  <p className="mt-1 text-gray-900">{payment.method}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Référence</label>
                  <p className="mt-1 text-gray-900 font-mono">{payment.reference}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{payment.description}</p>
                </div>
              </div>
            </div>

            {/* Informations client */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations Client</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                  <p className="mt-1 text-gray-900">{payment.client.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <p className="mt-1 text-gray-900">{payment.client.contact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{payment.client.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <p className="mt-1 text-gray-900">{payment.client.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <p className="mt-1 text-gray-900">{payment.client.address}</p>
                </div>
              </div>
            </div>

            {/* Détails bancaires */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails Bancaires</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Compte de destination</label>
                  <p className="mt-1 text-gray-900 font-mono">{payment.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Banque</label>
                  <p className="mt-1 text-gray-900">{payment.bankDetails.bankName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Transaction</label>
                  <p className="mt-1 text-gray-900 font-mono">{payment.bankDetails.transactionId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
              <div className="space-y-3">
                {payment.documents.map((doc, index) => (
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
                {payment.history.map((entry, index) => (
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
                  onClick={() => console.log(`Envoyer reçu ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  📧 Envoyer le reçu
                </button>
                <button
                  onClick={() => console.log(`Exporter ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  📊 Exporter en PDF
                </button>
                <button
                  onClick={() => console.log(`Dupliquer ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  📋 Dupliquer le paiement
                </button>
                <button
                  onClick={() => console.log(`Rembourser ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md"
                >
                  💸 Initier un remboursement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
