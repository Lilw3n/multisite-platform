'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/MinimalAuthContext';

// Types pour les devis
interface Quote {
  id: string;
  reference: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  product: string;
  amount: number;
  status: 'En attente' | 'Accepté' | 'Refusé' | 'Expiré';
  createdAt: string;
  validUntil: string;
  broker: string;
  priority: 'Faible' | 'Moyenne' | 'Élevée';
  description: string;
  coverage: string[];
  documents: string[];
  conditions: {
    franchise: number;
    plafond: number;
    exclusions: string[];
  };
  history: {
    date: string;
    action: string;
    user: string;
  }[];
}

// Données mock pour un devis détaillé
const mockQuote: Quote = {
  id: '1',
  reference: 'DEV-2024-001',
  clientName: 'Jean Dupont',
  clientEmail: 'jean.dupont@company.com',
  clientPhone: '01 23 45 67 89',
  clientAddress: '123 Rue de la Paix, 75001 Paris',
  product: 'Assurance Auto VTC',
  amount: 1200,
  status: 'En attente',
  createdAt: '2024-01-15',
  validUntil: '2024-02-15',
  broker: 'Marie Martin',
  priority: 'Moyenne',
  description: 'Devis pour assurance flotte de véhicules VTC',
  coverage: ['Responsabilité civile', 'Défense recours', 'Assistance', 'Vol', 'Incendie'],
  documents: ['Carte grise', 'Permis de conduire', 'Justificatif d\'activité'],
  conditions: {
    franchise: 500,
    plafond: 1000000,
    exclusions: ['Conduite en état d\'ivresse', 'Usage non autorisé']
  },
  history: [
    {
      date: '2024-01-15',
      action: 'Devis créé',
      user: 'Marie Martin'
    },
    {
      date: '2024-01-16',
      action: 'Devis envoyé au client',
      user: 'Marie Martin'
    },
    {
      date: '2024-01-18',
      action: 'Relance envoyée',
      user: 'Marie Martin'
    }
  ]
};

export default function QuoteDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'coverage' | 'documents' | 'history'>('overview');

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepté':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      case 'Expiré':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Quote['priority']) => {
    switch (priority) {
      case 'Faible':
        return 'bg-green-100 text-green-800';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800';
      case 'Élevée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentification requise</h1>
            <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* En-tête */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockQuote.reference}</h1>
                    <p className="text-gray-600">{mockQuote.product} - {mockQuote.clientName}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(mockQuote.status)}`}>
                      {mockQuote.status}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(mockQuote.priority)}`}>
                      {mockQuote.priority}
                    </span>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Modifier
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Envoyer
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Imprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Onglets */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Vue d\'ensemble' },
                      { id: 'coverage', label: 'Garanties' },
                      { id: 'documents', label: 'Documents' },
                      { id: 'history', label: 'Historique' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Informations client */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations client</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <p className="text-sm text-gray-900">{mockQuote.clientName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="text-sm text-gray-900">{mockQuote.clientEmail}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <p className="text-sm text-gray-900">{mockQuote.clientPhone}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Adresse</label>
                            <p className="text-sm text-gray-900">{mockQuote.clientAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Informations devis */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations devis</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Produit</label>
                            <p className="text-sm text-gray-900">{mockQuote.product}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Montant</label>
                            <p className="text-lg font-semibold text-gray-900">{mockQuote.amount.toLocaleString('fr-FR')} €</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Courtier</label>
                            <p className="text-sm text-gray-900">{mockQuote.broker}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Valide jusqu'au</label>
                            <p className="text-sm text-gray-900">{new Date(mockQuote.validUntil).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                        <p className="text-sm text-gray-900">{mockQuote.description}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'coverage' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Garanties incluses</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mockQuote.coverage.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                              <span className="text-green-600">✓</span>
                              <span className="text-sm text-gray-900">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conditions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700">Franchise</label>
                            <p className="text-lg font-semibold text-gray-900">{mockQuote.conditions.franchise} €</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700">Plafond</label>
                            <p className="text-lg font-semibold text-gray-900">{mockQuote.conditions.plafond.toLocaleString('fr-FR')} €</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700">Exclusions</label>
                            <p className="text-sm text-gray-900">{mockQuote.conditions.exclusions.length} exclusions</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exclusions</h3>
                        <div className="space-y-2">
                          {mockQuote.conditions.exclusions.map((exclusion, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                              <span className="text-red-600">✗</span>
                              <span className="text-sm text-gray-900">{exclusion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'documents' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents requis</h3>
                      <div className="space-y-3">
                        {mockQuote.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-blue-600">📄</span>
                              <span className="text-sm font-medium text-gray-900">{doc}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Reçu</span>
                              <span className="text-green-600">✓</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des actions</h3>
                      <div className="space-y-4">
                        {mockQuote.history.map((item, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.action}</p>
                              <p className="text-sm text-gray-500">Par {item.user}</p>
                              <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
