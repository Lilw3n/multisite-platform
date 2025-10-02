'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/MinimalAuthContext';

// Types pour les contrats
interface Contract {
  id: string;
  reference: string;
  clientName: string;
  product: string;
  platform: string;
  status: 'Actif' | 'Suspendu' | 'Résilié';
  subscriptionDate: string;
  effectiveDate: string;
  amount: number;
  paymentFrequency: 'Mensuel' | 'Trimestriel' | 'Annuel';
  formula: string;
  paymentMethod: string;
  brokerDelegation: boolean;
  dueDate: string;
  bankDetails: {
    accountHolder: string;
    iban: string;
    bic: string;
  };
  vehicle: {
    registration: string;
    brand: string;
    model: string;
    year: number;
  };
  driver: {
    name: string;
    licenseNumber: string;
    licenseDate: string;
  };
  payments: Payment[];
  documents: Document[];
  claims: Claim[];
  questionnaire: QuestionAnswer[];
}

interface Payment {
  id: string;
  date: string;
  receiptDate: string;
  amount: number;
  status: 'Payé' | 'En attente' | 'Échec';
  attempts?: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  status?: string;
  optional?: boolean;
  createdDate?: string;
  modifiedDate?: string;
  effectiveDate?: string;
  tariffSentDate?: string;
}

interface Claim {
  id: string;
  reference: string;
  date: string;
  nature: string;
  status: 'Ouvert' | 'Clôturé' | 'En cours';
}

interface QuestionAnswer {
  id: string;
  question: string;
  answer: string;
}

// Données mock pour un contrat détaillé
const mockContract: Contract = {
  id: '1',
  reference: 'LP-VTC/04796',
  clientName: 'Jean Dupont',
  product: 'Assurance automobile',
  platform: 'Plussimples',
  status: 'Actif',
  subscriptionDate: '20 juin 2023',
  effectiveDate: '11 juillet 2023',
  amount: 406.01,
  paymentFrequency: 'Mensuel',
  formula: '+Complet',
  paymentMethod: 'Prélèvement SEPA',
  brokerDelegation: false,
  dueDate: '10/07',
  bankDetails: {
    accountHolder: 'Jean Dupont',
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'BNPAFRPPXXX'
  },
  vehicle: {
    registration: 'AB-123-CD',
    brand: 'Renault',
    model: 'Trafic',
    year: 2020
  },
  driver: {
    name: 'Jean Dupont',
    licenseNumber: '1234567890',
    licenseDate: '15/05/2018'
  },
  payments: [
    {
      id: '1',
      date: '10/07/2024',
      receiptDate: '10/07/2024',
      amount: 406.01,
      status: 'Payé'
    },
    {
      id: '2',
      date: '10/06/2024',
      receiptDate: '10/06/2024',
      amount: 301.04,
      status: 'Payé'
    },
    {
      id: '3',
      date: '20/06/2024',
      receiptDate: '20/06/2024',
      amount: 321.04,
      status: 'Échec',
      attempts: 8
    }
  ],
  documents: [
    // Contrat
    {
      id: '1',
      name: 'Convention Assistance',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-20'
    },
    {
      id: '2',
      name: 'Conditions générales',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-20'
    },
    {
      id: '3',
      name: 'Document d\'information assurance',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-20'
    },
    {
      id: '4',
      name: 'Votre contrat',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-20'
    },
    {
      id: '5',
      name: 'Rappel d\'échéance 09/2023',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-09-01'
    },
    // Attestations
    {
      id: '6',
      name: 'Carte verte provisoire',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-07-11'
    },
    {
      id: '7',
      name: 'Attestation Responsabilité Civile Automobile',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-07-11'
    },
    {
      id: '8',
      name: 'Attestation Responsabilité Civile Professionnelle',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-07-11'
    },
    {
      id: '9',
      name: 'Attestation Responsabilité Civile Automobile 2023 - 2024',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-07-11'
    },
    {
      id: '10',
      name: 'Attestation Responsabilité Civile Professionnelle 2023 - 2024',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-07-11'
    },
    {
      id: '11',
      name: 'Attestation d\'assurance - FZ-597-PX',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-07-11'
    },
    {
      id: '12',
      name: 'Attestation Responsabilité Civile Automobile 2024 - 2025',
      type: 'PDF',
      url: '#',
      uploadDate: '2024-07-11'
    },
    {
      id: '13',
      name: 'Attestation Responsabilité Civile Professionnelle 2024 - 2025',
      type: 'PDF',
      url: '#',
      uploadDate: '2024-07-11'
    },
    {
      id: '14',
      name: 'Carte internationale d\'assurance - FZ-597-PX du 27-05-2025',
      type: 'PDF',
      url: '#',
      uploadDate: '2025-05-27'
    },
    {
      id: '15',
      name: 'Attestation Responsabilité Civile Automobile 2025 - 2026',
      type: 'PDF',
      url: '#',
      uploadDate: '2025-07-11'
    },
    {
      id: '16',
      name: 'Attestation Responsabilité Civile Professionnelle 2025 - 2026',
      type: 'PDF',
      url: '#',
      uploadDate: '2025-07-11'
    },
    // Justificatifs
    {
      id: '17',
      name: 'Carte grise du véhicule',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-15',
      status: 'Valide'
    },
    {
      id: '18',
      name: 'Recto du permis de conduire du conducteur principal',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-15',
      status: 'Valide'
    },
    {
      id: '19',
      name: 'Verso du permis de conduire du conducteur principal',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-15',
      status: 'Valide'
    },
    {
      id: '20',
      name: 'Relevé d\'information',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-15',
      status: 'Valide'
    },
    {
      id: '21',
      name: 'KBIS de l\'entreprise',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-15',
      status: 'Valide'
    },
    {
      id: '22',
      name: 'Contrat de location',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-15',
      status: 'Valide'
    },
    {
      id: '23',
      name: 'Verso de la carte Professionnelle',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-15',
      status: 'Valide'
    },
    {
      id: '24',
      name: 'Recto de la carte Professionnelle',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-15',
      status: 'Valide'
    },
    {
      id: '25',
      name: 'Relevé d\'information additionnel n°2',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-15',
      status: 'Valide',
      optional: true
    },
    {
      id: '26',
      name: 'Relevé d\'information additionnel n°1',
      type: 'PDF',
      url: '#',
      uploadDate: '2023-06-15',
      status: 'Valide',
      optional: true
    },
    // Avenants
    {
      id: '27',
      name: 'Avenant modification véhicule',
      type: 'PDF',
      url: '#',
      uploadDate: '2025-08-01',
      status: 'Terminé',
      createdDate: '2025-08-01',
      modifiedDate: '2025-09-19',
      effectiveDate: '2025-07-11',
      tariffSentDate: '2025-08-01'
    },
    {
      id: '28',
      name: 'Avenant changement conducteur',
      type: 'PDF',
      url: '#',
      uploadDate: '2025-08-01',
      status: 'Terminé',
      createdDate: '2025-08-01',
      modifiedDate: '2025-09-19',
      effectiveDate: '2025-07-11',
      tariffSentDate: '2025-08-01'
    },
    {
      id: '29',
      name: 'Avenant modification adresse',
      type: 'PDF',
      url: '#',
      uploadDate: '2025-09-19',
      status: 'Créé',
      createdDate: '2025-09-19',
      modifiedDate: '2025-09-19',
      effectiveDate: '2025-09-19',
      tariffSentDate: '2025-09-19'
    }
  ],
  claims: [
    {
      id: '1',
      reference: 'PSCLM20253800483800',
      date: '9 juin 2025',
      nature: 'Collision',
      status: 'Ouvert'
    },
    {
      id: '2',
      reference: 'PSCLM20243800483801',
      date: '15 mars 2024',
      nature: 'Vol',
      status: 'Clôturé'
    }
  ],
  questionnaire: [
    {
      id: '1',
      question: 'Nom du conducteur principal',
      answer: 'Jean Dupont'
    },
    {
      id: '2',
      question: 'Immatriculation du véhicule',
      answer: 'AB-123-CD'
    },
    {
      id: '3',
      question: 'Modèle du véhicule',
      answer: 'Renault Trafic 2020'
    },
    {
      id: '4',
      question: 'Véhicule en leasing',
      answer: 'Non'
    },
    {
      id: '5',
      question: 'Antécédents d\'assurance',
      answer: 'Aucun sinistre responsable'
    }
  ]
};

export default function ContractDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'documents' | 'claims' | 'questionnaire'>('overview');
  const [activeDocTab, setActiveDocTab] = useState<'contract' | 'certificates' | 'supporting' | 'forms' | 'endorsements'>('contract');

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Suspendu':
        return 'bg-yellow-100 text-yellow-800';
      case 'Résilié':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'Payé':
        return 'text-green-600';
      case 'En attente':
        return 'text-yellow-600';
      case 'Échec':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getClaimStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'Ouvert':
        return 'bg-red-100 text-red-800';
      case 'Clôturé':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockContract.reference}</h1>
                    <p className="text-gray-600">{mockContract.product} - {mockContract.clientName}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(mockContract.status)}`}>
                      Statut: {mockContract.status}
                    </span>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Débuter un avenant
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Modifier
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
                      { id: 'payments', label: 'Paiements' },
                      { id: 'documents', label: 'Documents' },
                      { id: 'claims', label: 'Sinistres' },
                      { id: 'questionnaire', label: 'Questionnaire' }
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
                    <div className="space-y-6">
                      {/* Informations générales */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Plateforme</label>
                              <p className="text-sm text-gray-900">{mockContract.platform} <span className="text-red-500">es</span></p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Souscrit le</label>
                              <p className="text-sm text-gray-900">{mockContract.subscriptionDate}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Date d'effet</label>
                              <p className="text-sm text-gray-900">{mockContract.effectiveDate}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cotisation</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Montant</label>
                              <p className="text-lg font-semibold text-gray-900">{mockContract.amount}€/mois</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Paiement</label>
                              <p className="text-sm text-gray-900">{mockContract.paymentFrequency}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Formule</label>
                              <p className="text-sm text-gray-900">{mockContract.formula}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Moyen de paiement</label>
                              <p className="text-sm text-gray-900">{mockContract.paymentMethod}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Paiement délégué au courtier</label>
                              <p className="text-sm text-gray-900">{mockContract.brokerDelegation ? 'Oui' : 'Non'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Échéance</label>
                              <p className="text-sm text-gray-900">{mockContract.dueDate}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Détails expandables */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <span className="text-sm font-medium text-gray-700">Coordonnées bancaires</span>
                            <span className="text-gray-400">></span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <span className="text-sm font-medium text-gray-700">Véhicule</span>
                            <span className="text-gray-400">></span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <span className="text-sm font-medium text-gray-700">Profil conducteur</span>
                            <span className="text-gray-400">></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'payments' && (
                    <div>
                      <div className="flex space-x-1 mb-4">
                        {['Paiements', 'Factures', 'Échéanciers'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase() as any)}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                              activeTab === tab.toLowerCase()
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quittance</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {mockContract.payments.map((payment) => (
                              <tr key={payment.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.receiptDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.amount.toFixed(2)} €</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`text-sm font-medium ${getPaymentStatusColor(payment.status)}`}>
                                    {payment.status}
                                    {payment.attempts && ` (${payment.attempts} tentatives)`}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-700">1 sur 2</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-700">Afficher</span>
                          <select className="text-sm border border-gray-300 rounded px-2 py-1">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                          </select>
                          <span className="text-sm text-gray-700">éléments</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'documents' && (
                    <div>
                      <div className="flex space-x-1 mb-4">
                        {['Contrat', 'Attestations', 'Justificatifs', 'Formulaires', 'Avenants'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveDocTab(tab.toLowerCase() as any)}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                              activeDocTab === tab.toLowerCase()
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {mockContract.documents
                          .filter((doc) => {
                            switch (activeDocTab) {
                              case 'contract':
                                return doc.id <= '5'; // Documents de contrat
                              case 'certificates':
                                return doc.id >= '6' && doc.id <= '16'; // Attestations
                              case 'supporting':
                                return doc.id >= '17' && doc.id <= '26'; // Justificatifs
                              case 'forms':
                                return false; // Pas de formulaires pour l'instant
                              case 'endorsements':
                                return doc.id >= '27'; // Avenants
                              default:
                                return true;
                            }
                          })
                          .map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-blue-600">📄</span>
                                <div>
                                  <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                  {doc.optional && (
                                    <span className="text-xs text-gray-500 ml-2">* non-obligatoire</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {doc.status && (
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    doc.status === 'Valide' 
                                      ? 'bg-green-100 text-green-800'
                                      : doc.status === 'Terminé'
                                      ? 'bg-green-100 text-green-800'
                                      : doc.status === 'Créé'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {doc.status}
                                  </span>
                                )}
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                  Télécharger
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'claims' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Sinistres</h3>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                          Nouveau sinistre
                        </button>
                      </div>
                      <div className="space-y-3">
                        {mockContract.claims.map((claim) => (
                          <div key={claim.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{claim.reference}</p>
                                <p className="text-xs text-gray-600">{claim.date}</p>
                                <p className="text-xs text-gray-600">{claim.nature}</p>
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClaimStatusColor(claim.status)}`}>
                                {claim.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'questionnaire' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Questionnaire</h3>
                      <p className="text-sm text-gray-600 mb-4">laparisienne-autocontainer</p>
                      <div className="space-y-3">
                        {mockContract.questionnaire.map((qa, index) => (
                          <div key={qa.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {index + 1}. {qa.question}
                            </p>
                            <p className="text-sm text-gray-600">{qa.answer}</p>
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
