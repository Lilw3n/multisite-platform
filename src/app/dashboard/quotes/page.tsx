'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/MinimalAuthContext';
import InterlocutorSelector from '@/components/InterlocutorSelector';
import QuoteContractWizard from '@/components/QuoteContractWizard';
import IntelligentQuoteWizard from '@/components/quotes/IntelligentQuoteWizard';

// Types pour les devis
interface Quote {
  id: string;
  reference: string;
  clientName: string;
  clientEmail: string;
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
}

// Données mock pour les devis
const mockQuotes: Quote[] = [
  {
    id: '1',
    reference: 'DEV-2024-001',
    clientName: 'Jean Dupont',
    clientEmail: 'jean.dupont@company.com',
    product: 'Assurance Auto VTC',
    amount: 1200,
    status: 'En attente',
    createdAt: '2024-01-15',
    validUntil: '2024-02-15',
    broker: 'Marie Martin',
    priority: 'Moyenne',
    description: 'Devis pour assurance flotte de véhicules VTC',
    coverage: ['Responsabilité civile', 'Défense recours', 'Assistance'],
    documents: ['Carte grise', 'Permis de conduire', 'Justificatif d\'activité']
  },
  {
    id: '2',
    reference: 'DEV-2024-002',
    clientName: 'SARL Transport Express',
    clientEmail: 'contact@transport-express.com',
    product: 'Assurance Flotte Utilitaire',
    amount: 3500,
    status: 'Accepté',
    createdAt: '2024-01-10',
    validUntil: '2024-02-10',
    broker: 'Pierre Bernard',
    priority: 'Élevée',
    description: 'Devis pour assurance flotte de 5 véhicules utilitaires',
    coverage: ['Responsabilité civile', 'Défense recours', 'Assistance', 'Vol', 'Incendie'],
    documents: ['Carte grise', 'Permis de conduire', 'Justificatif d\'activité', 'Contrat de travail']
  },
  {
    id: '3',
    reference: 'DEV-2024-003',
    clientName: 'Restaurant Le Gourmet',
    clientEmail: 'contact@legourmet.fr',
    product: 'Assurance Responsabilité Civile Professionnelle',
    amount: 800,
    status: 'Refusé',
    createdAt: '2024-01-05',
    validUntil: '2024-02-05',
    broker: 'Sophie Dubois',
    priority: 'Faible',
    description: 'Devis pour assurance RC Pro restauration',
    coverage: ['Responsabilité civile professionnelle', 'Défense recours'],
    documents: ['Justificatif d\'activité', 'Statuts société']
  }
];

export default function QuotesPage() {
  const { user } = useAuth();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewQuoteForm, setShowNewQuoteForm] = useState(false);
  const [showQuoteWizard, setShowQuoteWizard] = useState(false);
  const [showIntelligentWizard, setShowIntelligentWizard] = useState(false);
  const [selectedInterlocutor, setSelectedInterlocutor] = useState<any>(null);

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

  const filteredQuotes = mockQuotes.filter(quote => {
    const matchesStatus = filterStatus === 'Tous' || quote.status === filterStatus;
    const matchesSearch = quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleEditQuote = (quote: Quote) => {
    // Rediriger vers la page de modification du devis
    window.location.href = `/dashboard/quotes/${quote.id}`;
  };

  const handleDeleteQuote = (quote: Quote) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le devis ${quote.reference} ?`)) {
      // Ici, vous pouvez ajouter la logique de suppression
      console.log('Suppression du devis:', quote.id);
      alert('Devis supprimé avec succès');
    }
  };

  const handleNewQuote = () => {
    setShowIntelligentWizard(true);
  };

  const handleNewQuoteClassic = () => {
    setShowQuoteWizard(true);
  };

  const handleNewQuoteSimple = () => {
    setShowNewQuoteForm(true);
    setSelectedInterlocutor(null); // Reset interlocutor selection
  };

  const handleSubmitNewQuote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInterlocutor) {
      alert('Veuillez sélectionner ou créer un interlocuteur');
      return;
    }

    // Ici vous pouvez traiter les données du formulaire
    console.log('Nouveau devis pour:', selectedInterlocutor);
    
    // Simuler la création du devis
    alert(`Devis créé avec succès pour ${selectedInterlocutor.name}`);
    setShowNewQuoteForm(false);
    setSelectedInterlocutor(null);
  };

  const handleWizardComplete = (wizardResult: any) => {
    console.log('Devis créé via assistant:', wizardResult);
    alert(`Devis créé avec succès pour ${wizardResult.data.interlocutor.name}`);
    setShowQuoteWizard(false);
  };

  const handleWizardCancel = () => {
    setShowQuoteWizard(false);
  };

  const handleIntelligentWizardComplete = (session: any) => {
    console.log('Devis intelligent créé:', session);
    alert('Devis intelligent créé avec succès !');
    setShowIntelligentWizard(false);
  };

  const handleIntelligentWizardCancel = () => {
    setShowIntelligentWizard(false);
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Devis</h1>
                <p className="text-gray-600">Gérez les devis d'assurance de vos clients</p>
              </div>

              {/* Filtres et recherche */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rechercher
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nom du client, référence, produit..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Tous">Tous les statuts</option>
                      <option value="En attente">En attente</option>
                      <option value="Accepté">Accepté</option>
                      <option value="Refusé">Refusé</option>
                      <option value="Expiré">Expiré</option>
                    </select>
                  </div>
                  <div className="flex items-end space-x-2">
                    <button 
                      onClick={handleNewQuote}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                    >
                      <span>🧠</span>
                      <span>Assistant IA</span>
                    </button>
                    <button 
                      onClick={handleNewQuoteClassic}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      🧙‍♂️ Assistant classique
                    </button>
                    <button 
                      onClick={handleNewQuoteSimple}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      + Devis simple
                    </button>
                  </div>
                </div>
              </div>

              {/* Liste des devis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Liste des devis ({filteredQuotes.length})
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Référence
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priorité
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Courtier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredQuotes.map((quote) => (
                        <tr key={quote.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{quote.reference}</div>
                            <div className="text-sm text-gray-500">Créé le {new Date(quote.createdAt).toLocaleDateString('fr-FR')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{quote.clientName}</div>
                            <div className="text-sm text-gray-500">{quote.clientEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{quote.product}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{quote.amount.toLocaleString('fr-FR')} €</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(quote.priority)}`}>
                              {quote.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {quote.broker}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewQuote(quote)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Voir
                              </button>
                              <button 
                                onClick={() => handleEditQuote(quote)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Modifier
                              </button>
                              <button 
                                onClick={() => handleDeleteQuote(quote)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal pour voir les détails d'un devis */}
              {selectedQuote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Détails du devis</h2>
                        <button
                          onClick={() => setSelectedQuote(null)}
                          className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                          ×
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Référence</label>
                            <p className="text-sm text-gray-900">{selectedQuote.reference}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Client</label>
                            <p className="text-sm text-gray-900">{selectedQuote.clientName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Produit</label>
                            <p className="text-sm text-gray-900">{selectedQuote.product}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Montant</label>
                            <p className="text-sm text-gray-900">{selectedQuote.amount.toLocaleString('fr-FR')} €</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Statut</label>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedQuote.status)}`}>
                              {selectedQuote.status}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Priorité</label>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedQuote.priority)}`}>
                              {selectedQuote.priority}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <p className="text-sm text-gray-900">{selectedQuote.description}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Garanties</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedQuote.coverage.map((item, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-6">
                        <button
                          onClick={() => setSelectedQuote(null)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                          Fermer
                        </button>
                        <button
                          onClick={() => handleEditQuote(selectedQuote)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                          Modifier
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal pour nouveau devis */}
              {showNewQuoteForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Nouveau devis</h2>
                        <button
                          onClick={() => setShowNewQuoteForm(false)}
                          className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                          ×
                        </button>
                      </div>
                      <form onSubmit={handleSubmitNewQuote} className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Client / Interlocuteur *
                            </label>
                            <InterlocutorSelector
                              selectedInterlocutor={selectedInterlocutor}
                              onSelect={setSelectedInterlocutor}
                              onClear={() => setSelectedInterlocutor(null)}
                              placeholder="Rechercher un client existant ou créer un nouveau..."
                              required={true}
                              userRole={user?.role || 'admin'}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Produit</label>
                            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>Assurance Auto VTC</option>
                              <option>Assurance Flotte Utilitaire</option>
                              <option>Assurance RC Pro</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Montant (€)</label>
                            <input
                              type="number"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Priorité</label>
                            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>Faible</option>
                              <option>Moyenne</option>
                              <option>Élevée</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Courtier</label>
                            <input
                              type="text"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Nom du courtier"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Description du devis"
                          />
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                          <button
                            type="button"
                            onClick={() => setShowNewQuoteForm(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                          >
                            Créer le devis
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Assistant intelligent de création de devis */}
              {showIntelligentWizard && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
                    <IntelligentQuoteWizard
                      onComplete={handleIntelligentWizardComplete}
                      onCancel={handleIntelligentWizardCancel}
                    />
                  </div>
                </div>
              )}

              {/* Assistant classique de création de devis */}
              {showQuoteWizard && (
                <QuoteContractWizard
                  type="quote"
                  onComplete={handleWizardComplete}
                  onCancel={handleWizardCancel}
                  userRole={user?.role || 'admin'}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
