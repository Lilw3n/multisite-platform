'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReceivableDetailProps {
  params: {
    id: string;
  };
}

export default function ReceivableDetailPage({ params }: ReceivableDetailProps) {
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

  // Données fictives pour la créance
  const receivable = {
    id: id,
    date: '2024-01-15',
    amount: 2500,
    remaining: 2500,
    description: 'Prime trimestrielle assurance véhicules',
    type: 'Prime d\'assurance',
    status: 'En attente',
    dueDate: '2024-02-15',
    client: {
      name: 'SARL Transport Express',
      contact: 'Jean Dupont',
      email: 'jean.dupont@transport-express.com',
      phone: '01 23 45 67 89',
      address: '123 Rue de la Logistique, 75000 Paris',
      siret: '12345678901234'
    },
    paymentTerms: {
      method: 'Virement bancaire',
      accountNumber: 'FR76 1234 5678 9012 3456 7890 123',
      bankName: 'Banque Nationale',
      iban: 'FR76 1234 5678 9012 3456 7890 123',
      bic: 'BNPAFRPP'
    },
    documents: [
      { name: 'Facture_2024_001.pdf', type: 'Facture', size: '245 KB' },
      { name: 'Devis_2024_001.pdf', type: 'Devis', size: '189 KB' },
      { name: 'Contrat_assurance_001.pdf', type: 'Contrat', size: '1.2 MB' }
    ],
    history: [
      { date: '2024-01-15 14:30', action: 'Créance créée', user: 'Système automatique' },
      { date: '2024-01-15 14:25', action: 'Facture envoyée', user: 'Marie Curie' },
      { date: '2024-01-15 09:15', action: 'Devis accepté', user: 'Jean Dupont' },
      { date: '2024-01-14 16:45', action: 'Devis généré', user: 'Système automatique' }
    ],
    linkedItems: [
      { type: 'Contrat', id: 'CONT-2024-001', name: 'Contrat Assurance Transport' },
      { type: 'Véhicule', id: 'VEH-2024-003', name: 'Renault Master 2023' },
      { type: 'Période', id: 'PER-2024-Q1', name: 'Q1 2024' }
    ],
    reminders: [
      { date: '2024-02-01', type: 'Rappel', status: 'Envoyé', method: 'Email' },
      { date: '2024-02-08', type: 'Relance', status: 'Planifié', method: 'Téléphone' }
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-sm text-gray-600">Chargement de la créance...</p>
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
                Détail de la Créance #{receivable.id}
              </h1>
              <p className="text-sm text-gray-600">
                {receivable.amount.toLocaleString()}€ - {receivable.client.name}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => console.log(`Modifier créance ${id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Modifier
              </button>
              <button
                onClick={() => console.log(`Lier créance ${id}`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Lier
              </button>
              <button
                onClick={() => console.log(`Délier créance ${id}`)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Délier
              </button>
              <button
                onClick={() => console.log(`Relancer créance ${id}`)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Relancer
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
            {/* Détails de la créance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations de la Créance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant total</label>
                  <p className="mt-1 text-2xl font-bold text-green-600">{receivable.amount.toLocaleString()}€</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant restant</label>
                  <p className="mt-1 text-xl font-bold text-orange-600">{receivable.remaining.toLocaleString()}€</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <span className={`mt-1 inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    receivable.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                    receivable.status === 'Payée' ? 'bg-green-100 text-green-800' :
                    receivable.status === 'En retard' ? 'bg-red-100 text-red-800' :
                    receivable.status === 'Partiellement payée' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {receivable.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <span className="mt-1 inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {receivable.type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de création</label>
                  <p className="mt-1 text-gray-900">{receivable.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date d'échéance</label>
                  <p className="mt-1 text-gray-900">{receivable.dueDate}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{receivable.description}</p>
                </div>
              </div>
            </div>

            {/* Informations client */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations Client</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                  <p className="mt-1 text-gray-900">{receivable.client.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <p className="mt-1 text-gray-900">{receivable.client.contact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{receivable.client.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <p className="mt-1 text-gray-900">{receivable.client.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SIRET</label>
                  <p className="mt-1 text-gray-900 font-mono">{receivable.client.siret}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <p className="mt-1 text-gray-900">{receivable.client.address}</p>
                </div>
              </div>
            </div>

            {/* Conditions de paiement */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Conditions de Paiement</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Méthode de paiement</label>
                  <p className="mt-1 text-gray-900">{receivable.paymentTerms.method}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Compte de destination</label>
                  <p className="mt-1 text-gray-900 font-mono">{receivable.paymentTerms.accountNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Banque</label>
                  <p className="mt-1 text-gray-900">{receivable.paymentTerms.bankName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IBAN</label>
                  <p className="mt-1 text-gray-900 font-mono">{receivable.paymentTerms.iban}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BIC</label>
                  <p className="mt-1 text-gray-900 font-mono">{receivable.paymentTerms.bic}</p>
                </div>
              </div>
            </div>

            {/* Éléments liés */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Éléments Liés</h2>
              <div className="space-y-3">
                {receivable.linkedItems.map((item, index) => (
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
                {receivable.documents.map((doc, index) => (
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

            {/* Relances */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Relances</h3>
              <div className="space-y-3">
                {receivable.reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{reminder.type}</p>
                      <p className="text-xs text-gray-500">{reminder.date} • {reminder.method}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reminder.status === 'Envoyé' ? 'bg-green-100 text-green-800' :
                      reminder.status === 'Planifié' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {reminder.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Historique */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Historique</h3>
              <div className="space-y-3">
                {receivable.history.map((entry, index) => (
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
                  onClick={() => console.log(`Marquer payée ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  ✅ Marquer comme payée
                </button>
                <button
                  onClick={() => console.log(`Envoyer facture ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  📧 Envoyer la facture
                </button>
                <button
                  onClick={() => console.log(`Planifier relance ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  📅 Planifier une relance
                </button>
                <button
                  onClick={() => console.log(`Exporter ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  📊 Exporter en PDF
                </button>
                <button
                  onClick={() => console.log(`Annuler ${id}`)}
                  className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md"
                >
                  ❌ Annuler la créance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
