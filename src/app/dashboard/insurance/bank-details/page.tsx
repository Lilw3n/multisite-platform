'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import DocumentAnalyzer from '@/components/DocumentAnalyzer';
import { DocumentAnalysisResult } from '@/lib/geminiDocumentService';

interface BankDetails {
  id: string;
  interlocutorId: string;
  accountHolder: string;
  iban: string;
  bic: string;
  bankName: string;
  accountType: 'Compte courant' | 'Compte épargne' | 'Compte professionnel';
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  documents: BankDocument[];
}

interface BankDocument {
  id: string;
  name: string;
  type: 'RIB' | 'Attestation bancaire' | 'Mandat SEPA' | 'Autorisation prélèvement';
  url: string;
  uploadDate: string;
  status: 'Valide' | 'En attente' | 'Expiré';
  expiryDate?: string;
}

export default function BankDetailsPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
  const [showBankForm, setShowBankForm] = useState(false);
  const [editingBank, setEditingBank] = useState<BankDetails | null>(null);
  const [showDocumentAnalyzer, setShowDocumentAnalyzer] = useState(false);
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

  useEffect(() => {
    // Données mockées pour les coordonnées bancaires
    const mockBankDetails: BankDetails[] = [
      {
        id: '1',
        interlocutorId: '1',
        accountHolder: 'Jean Dupont',
        iban: 'FR76 1234 5678 9012 3456 7890 123',
        bic: 'BNPAFRPPXXX',
        bankName: 'BNP Paribas',
        accountType: 'Compte courant',
        isActive: true,
        isDefault: true,
        createdAt: '2023-06-20',
        updatedAt: '2024-09-15',
        documents: [
          {
            id: '1',
            name: 'RIB Jean Dupont',
            type: 'RIB',
            url: '#',
            uploadDate: '2023-06-20',
            status: 'Valide'
          },
          {
            id: '2',
            name: 'Mandat SEPA Automobile',
            type: 'Mandat SEPA',
            url: '#',
            uploadDate: '2023-06-20',
            status: 'Valide'
          }
        ]
      },
      {
        id: '2',
        interlocutorId: '1',
        accountHolder: 'Jean Dupont',
        iban: 'FR14 2004 1010 0505 0001 3M02 606',
        bic: 'PSSTFRPPPAR',
        bankName: 'La Banque Postale',
        accountType: 'Compte professionnel',
        isActive: true,
        isDefault: false,
        createdAt: '2023-08-15',
        updatedAt: '2024-09-10',
        documents: [
          {
            id: '3',
            name: 'RIB Professionnel',
            type: 'RIB',
            url: '#',
            uploadDate: '2023-08-15',
            status: 'Valide'
          },
          {
            id: '4',
            name: 'Attestation bancaire 2024',
            type: 'Attestation bancaire',
            url: '#',
            uploadDate: '2024-01-15',
            status: 'Valide',
            expiryDate: '2025-01-15'
          }
        ]
      }
    ];
    setBankDetails(mockBankDetails);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
    }
    router.push('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Valide':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expiré':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Compte courant':
        return 'bg-blue-100 text-blue-800';
      case 'Compte professionnel':
        return 'bg-purple-100 text-purple-800';
      case 'Compte épargne':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-sm text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const breadcrumb = [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Assurance', href: '/dashboard/insurance' },
    { label: 'Coordonnées bancaires' }
  ];

  const handleDocumentAnalysis = (result: DocumentAnalysisResult) => {
    if (result.success && result.data) {
      // Créer une nouvelle coordonnée bancaire avec les données extraites
      const newBankDetail: BankDetails = {
        id: `bank_${Date.now()}`,
        interlocutorId: '1',
        accountHolder: result.data.extractedData.accountHolder || '',
        iban: result.data.extractedData.iban || '',
        bic: result.data.extractedData.bic || '',
        bankName: result.data.extractedData.bankName || '',
        accountType: result.data.extractedData.accountType || 'Compte courant',
        isActive: true,
        isDefault: false,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        documents: []
      };
      
      setBankDetails(prev => [newBankDetail, ...prev]);
      setShowDocumentAnalyzer(false);
      
      alert(`Document analysé avec succès ! Confiance: ${Math.round(result.data.confidence * 100)}%`);
    } else {
      alert(`Erreur lors de l'analyse: ${result.error}`);
    }
  };

  const actions = (
    <div className="flex space-x-2">
      <button
        onClick={() => setShowDocumentAnalyzer(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        🤖 Analyser document
      </button>
      <button
        onClick={() => setShowBankForm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        + Nouvelle coordonnée bancaire
      </button>
    </div>
  );

  return (
    <Layout
      title="Coordonnées Bancaires"
      subtitle="Gestion des informations bancaires des clients"
      breadcrumb={breadcrumb}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🏦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Comptes</p>
                <p className="text-2xl font-bold text-gray-900">{bankDetails.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {bankDetails.filter(b => b.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Par Défaut</p>
                <p className="text-2xl font-bold text-purple-600">
                  {bankDetails.filter(b => b.isDefault).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bankDetails.reduce((acc, b) => acc + b.documents.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Document Analyzer */}
        {showDocumentAnalyzer && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Analyse de document</h3>
              <button
                onClick={() => setShowDocumentAnalyzer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <DocumentAnalyzer
              onAnalysisComplete={handleDocumentAnalysis}
              documentType="bank_details"
            />
          </div>
        )}

        {/* Bank Details List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Liste des Coordonnées Bancaires
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titulaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IBAN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bankDetails.map((bank) => (
                  <tr key={bank.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {bank.accountHolder}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bank.bic}
                          </div>
                        </div>
                        {bank.isDefault && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Défaut
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bank.bankName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {bank.iban}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(bank.accountType)}`}>
                        {bank.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        bank.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bank.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {bank.documents.map((doc) => (
                          <span key={doc.id} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => setEditingBank(bank)}
                          className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded text-xs bg-indigo-50 hover:bg-indigo-100"
                        >
                          Voir
                        </button>
                        <button 
                          onClick={() => setEditingBank(bank)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100"
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={() => console.log('Télécharger documents pour', bank.id)}
                          className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs bg-green-50 hover:bg-green-100"
                        >
                          Documents
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Module Linking Section */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">🔗 Liaisons de Modules Bancaires</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">💳</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">LIÉ</span>
                </div>
                <h4 className="font-medium text-green-900">Bancaire ↔ Paiements</h4>
                <p className="text-xs text-green-700 mb-2">Gestion automatique des prélèvements</p>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => console.log('Délier bancaire-paiements')}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Délier
                  </button>
                  <button 
                    onClick={() => console.log('Configurer liaison bancaire-paiements')}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Configurer
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">📄</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">LIÉ</span>
                </div>
                <h4 className="font-medium text-blue-900">Bancaire ↔ Documents</h4>
                <p className="text-xs text-blue-700 mb-2">RIB, mandats SEPA automatiques</p>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => console.log('Délier bancaire-documents')}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Délier
                  </button>
                  <button 
                    onClick={() => console.log('Configurer liaison bancaire-documents')}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Configurer
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">🤖</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">EN ATTENTE</span>
                </div>
                <h4 className="font-medium text-yellow-900">Bancaire ↔ IA</h4>
                <p className="text-xs text-yellow-700 mb-2">Lecture automatique des documents</p>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => console.log('Lier bancaire-IA')}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                  >
                    Lier
                  </button>
                  <button 
                    onClick={() => console.log('Configurer liaison bancaire-IA')}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Configurer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
