'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { GeminiDocumentService, PendingUpdate } from '@/lib/geminiDocumentService';

export default function AISuggestionsPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUpdates, setPendingUpdates] = useState<PendingUpdate[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<PendingUpdate | null>(null);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [newDocumentUrl, setNewDocumentUrl] = useState('');
  const [newDocumentType, setNewDocumentType] = useState('bank_details');
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
    loadPendingUpdates();
  }, []);

  const loadPendingUpdates = async () => {
    try {
      const updates = await GeminiDocumentService.getPendingUpdates();
      setPendingUpdates(updates);
    } catch (error) {
      console.error('Erreur lors du chargement des suggestions:', error);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
    }
    router.push('/login');
  };

  const handleAnalyzeDocument = async () => {
    if (!newDocumentUrl || !newDocumentType) return;

    try {
      const update = await GeminiDocumentService.createPendingUpdate(
        '1', // ID de l'interlocuteur par défaut
        newDocumentUrl,
        newDocumentType,
        user?.name || 'Utilisateur'
      );
      
      setPendingUpdates(prev => [update, ...prev]);
      setShowDocumentForm(false);
      setNewDocumentUrl('');
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      alert('Erreur lors de l\'analyse du document');
    }
  };

  const handleApproveUpdate = async (updateId: string) => {
    try {
      await GeminiDocumentService.approveUpdate(updateId);
      setPendingUpdates(prev => 
        prev.map(update => 
          update.id === updateId 
            ? { ...update, status: 'approved' as const }
            : update
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const handleRejectUpdate = async (updateId: string) => {
    try {
      await GeminiDocumentService.rejectUpdate(updateId);
      setPendingUpdates(prev => 
        prev.map(update => 
          update.id === updateId 
            ? { ...update, status: 'rejected' as const }
            : update
        )
      );
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      bank_details: 'Coordonnées bancaires',
      vehicle_info: 'Informations véhicule',
      driver_info: 'Informations conducteur',
      contract_info: 'Informations contrat',
      claim_info: 'Informations sinistre'
    };
    return types[type] || type;
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
    { label: 'Suggestions IA' }
  ];

  const actions = (
    <button
      onClick={() => setShowDocumentForm(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      + Analyser un document
    </button>
  );

  return (
    <Layout
      title="Suggestions IA"
      subtitle="Mises à jour automatiques suggérées par Gemini"
      breadcrumb={breadcrumb}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Suggestions</p>
                <p className="text-2xl font-bold text-gray-900">{pendingUpdates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingUpdates.filter(u => u.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold text-green-600">
                  {pendingUpdates.filter(u => u.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejetées</p>
                <p className="text-2xl font-bold text-red-600">
                  {pendingUpdates.filter(u => u.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Document Analysis Form */}
        {showDocumentForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyser un document Google Drive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL du document Google Drive
                </label>
                <input
                  type="url"
                  value={newDocumentUrl}
                  onChange={(e) => setNewDocumentUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de document
                </label>
                <select
                  value={newDocumentType}
                  onChange={(e) => setNewDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bank_details">Coordonnées bancaires</option>
                  <option value="vehicle_info">Informations véhicule</option>
                  <option value="driver_info">Informations conducteur</option>
                  <option value="contract_info">Informations contrat</option>
                  <option value="claim_info">Informations sinistre</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowDocumentForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleAnalyzeDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Analyser
              </button>
            </div>
          </div>
        )}

        {/* Pending Updates List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Suggestions en Attente
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Données Extraites
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confiance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé par
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUpdates.map((update) => (
                  <tr key={update.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getDocumentTypeLabel(update.documentType)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {Object.entries(update.extractedData).map(([key, value]) => (
                          <div key={key} className="flex">
                            <span className="font-medium">{key}:</span>
                            <span className="ml-2">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${update.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {Math.round(update.confidence * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(update.status)}`}>
                        {update.status === 'pending' ? 'En attente' : 
                         update.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {update.suggestedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {update.status === 'pending' && (
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleApproveUpdate(update.id)}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs bg-green-50 hover:bg-green-100"
                          >
                            Approuver
                          </button>
                          <button 
                            onClick={() => handleRejectUpdate(update.id)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded text-xs bg-red-50 hover:bg-red-100"
                          >
                            Rejeter
                          </button>
                          <button 
                            onClick={() => setSelectedUpdate(update)}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100"
                          >
                            Voir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedUpdate && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Détails de la suggestion
                  </h3>
                  <button
                    onClick={() => setSelectedUpdate(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Données extraites:</h4>
                    <pre className="mt-2 p-3 bg-gray-100 rounded-md text-sm overflow-auto">
                      {JSON.stringify(selectedUpdate.extractedData, null, 2)}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">URL du document:</h4>
                    <a 
                      href={selectedUpdate.documentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {selectedUpdate.documentUrl}
                    </a>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setSelectedUpdate(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
