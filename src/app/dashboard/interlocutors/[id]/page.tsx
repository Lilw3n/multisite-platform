'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/MinimalAuthContext';
import { Interlocutor } from '@/types/interlocutor';
import { InterlocutorService } from '@/lib/interlocutors';
import ModuleLinkManager from '@/components/ModuleLinkManager';
import ModuleUnlinkManager from '@/components/ModuleUnlinkManager';
import EventForm from '@/components/EventForm';
import ModuleAddForm from '@/components/ModuleAddForm';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import EligibilityChecker from '@/components/EligibilityChecker';
import CompanyForm from '@/components/CompanyForm';
import FamilyForm from '@/components/FamilyForm';
import InterlocutorEditForm from '@/components/InterlocutorEditForm';
import { useClientSide } from '@/hooks/useClientSide';
import { Company, Family } from '@/types';

export default function InterlocutorDetailPage() {
  const isClient = useClientSide();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [interlocutor, setInterlocutor] = useState<Interlocutor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLinkManager, setShowLinkManager] = useState(false);
  const [showUnlinkManager, setShowUnlinkManager] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventsSidebar, setShowEventsSidebar] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormType, setAddFormType] = useState<'claims' | 'vehicles' | 'drivers' | 'contracts' | 'insuranceRequests' | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ type: string; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedModule, setSelectedModule] = useState<{
    type: 'claims' | 'vehicles' | 'drivers' | 'contracts' | 'insuranceRequests' | 'events';
    id: string;
  } | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulatedInterlocutor, setSimulatedInterlocutor] = useState<Interlocutor | null>(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [family, setFamily] = useState<Family | null>(null);

  useEffect(() => {
    // Vérifier le mode simulation
    if (isClient) {
      const simulationMode = localStorage.getItem('simulation_mode') === 'true';
      const simulatedData = localStorage.getItem('simulated_interlocutor');
      
      setIsSimulationMode(simulationMode);
      if (simulatedData) {
        try {
          setSimulatedInterlocutor(JSON.parse(simulatedData));
        } catch (error) {
          console.error('Erreur lors du parsing des données de simulation:', error);
        }
      }
    }

    if (params.id) {
      loadInterlocutor();
    }
  }, [params.id, isClient]);

  const loadInterlocutor = async () => {
    try {
      setIsLoading(true);
      const interlocutorData = await InterlocutorService.getInterlocutorById(params.id as string);
      
      if (interlocutorData) {
        setInterlocutor(interlocutorData);
        setError('');
      } else {
        setError(`Interlocuteur avec l'ID ${params.id} non trouvé`);
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Erreur lors du chargement de l\'interlocuteur: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModuleTransferred = () => {
    loadInterlocutor(); // Recharger les données après un transfert
  };

  const handleLinkModule = (moduleType: 'claims' | 'vehicles' | 'drivers' | 'contracts' | 'insuranceRequests' | 'events', moduleId: string) => {
    setSelectedModule({ type: moduleType, id: moduleId });
    setShowLinkManager(true);
  };

  const handleUnlinkModule = (moduleType: 'claims' | 'vehicles' | 'drivers' | 'contracts' | 'insuranceRequests' | 'events', moduleId: string) => {
    setSelectedModule({ type: moduleType, id: moduleId });
    setShowUnlinkManager(true);
  };

  const handleLinkSuccess = () => {
    setShowLinkManager(false);
    setSelectedModule(null);
    handleModuleTransferred();
  };

  const handleUnlinkSuccess = () => {
    setShowUnlinkManager(false);
    setSelectedModule(null);
    handleModuleTransferred();
  };

  const handleLinkCancel = () => {
    setShowLinkManager(false);
    setShowUnlinkManager(false);
    setShowEventForm(false);
    setSelectedModule(null);
  };

  const handleEventCreated = () => {
    setShowEventForm(false);
    handleModuleTransferred(); // Recharger les données
  };

  const handleAddModule = (moduleType: 'claims' | 'vehicles' | 'drivers' | 'contracts' | 'insuranceRequests') => {
    setAddFormType(moduleType);
    setShowAddForm(true);
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    setAddFormType(null);
    handleModuleTransferred(); // Recharger les données
  };

  const handleAddCancel = () => {
    setShowAddForm(false);
    setAddFormType(null);
  };

  const handleDeleteModule = (type: string, id: string, name: string) => {
    setDeleteItem({ type, id, name });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem || !interlocutor) return;

    setIsDeleting(true);
    try {
      let result;
      switch (deleteItem.type) {
        case 'claims':
          result = await InterlocutorService.deleteClaim(interlocutor.id, deleteItem.id);
          break;
        case 'vehicles':
          result = await InterlocutorService.deleteVehicle(interlocutor.id, deleteItem.id);
          break;
        case 'drivers':
          result = await InterlocutorService.deleteDriver(interlocutor.id, deleteItem.id);
          break;
        case 'contracts':
          result = await InterlocutorService.deleteContract(interlocutor.id, deleteItem.id);
          break;
        case 'insuranceRequests':
          result = await InterlocutorService.deleteInsuranceRequest(interlocutor.id, deleteItem.id);
          break;
        case 'events':
          result = await InterlocutorService.deleteEvent(interlocutor.id, deleteItem.id);
          break;
        default:
          throw new Error('Type de module non supporté');
      }

      if (result.success) {
        handleModuleTransferred(); // Recharger les données
        setShowDeleteModal(false);
        setDeleteItem(null);
      } else {
        alert('Erreur lors de la suppression: ' + result.error);
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteItem(null);
  };

  const handleModifyModule = (type: string, id: string) => {
    // Pour l'instant, on affiche une alerte. Plus tard, on pourra implémenter un formulaire de modification
    alert(`Modification de ${type} ${id} - Fonctionnalité à implémenter`);
  };

  const handleCompanySuccess = (companyData: Company) => {
    setCompany(companyData);
    setShowCompanyForm(false);
    // Ici vous pourriez sauvegarder en base de données
    console.log('Entreprise ajoutée:', companyData);
  };

  const handleFamilySuccess = (familyData: Family) => {
    setFamily(familyData);
    setShowFamilyForm(false);
    // Ici vous pourriez sauvegarder en base de données
    console.log('Famille ajoutée:', familyData);
  };

  const handleInterlocutorEditSuccess = (updatedInterlocutor: Interlocutor) => {
    setInterlocutor(updatedInterlocutor);
    setShowEditForm(false);
    // Ici vous pourriez sauvegarder en base de données
    console.log('Interlocuteur modifié:', updatedInterlocutor);
  };

  // Afficher le chargement pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chargement...</h1>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentification requise</h1>
            <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-sm font-medium"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <DashboardHeader />
          <div className="flex">
            <DashboardSidebar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                  <div className="bg-white rounded-lg shadow p-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <DashboardHeader />
          <div className="flex">
            <DashboardSidebar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-red-500 text-2xl">❌</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-red-800">Erreur</h3>
                      <p className="text-red-700">{error}</p>
                      <div className="mt-4 space-x-3">
                        <button
                          onClick={() => router.push('/dashboard/interlocutors')}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Retour à la liste
                        </button>
                        <button
                          onClick={loadInterlocutor}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Réessayer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!interlocutor) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <DashboardHeader />
          <div className="flex">
            <DashboardSidebar />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-500 text-2xl">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-yellow-800">Aucune donnée</h3>
                      <p className="text-yellow-700">Aucun interlocuteur trouvé pour cet ID.</p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '📧';
      case 'meeting': return '🤝';
      case 'task': return '✅';
      case 'note': return '📝';
      case 'document': return '📄';
      default: return '📅';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        
        {/* Indicateur de mode simulation */}
        {isSimulationMode && simulatedInterlocutor && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">🎭</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Mode Simulation Actif</strong> - Vous visualisez l'interface comme : 
                  <span className="font-semibold"> {simulatedInterlocutor.firstName} {simulatedInterlocutor.lastName}</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('simulation_mode');
                      localStorage.removeItem('simulated_interlocutor');
                      window.location.href = '/dashboard/external/simulate';
                    }}
                    className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs font-medium"
                  >
                    Quitter la simulation
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-4">
            <div className="max-w-full mx-auto">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Fiche Interlocuteur</h1>
                    <p className="text-gray-600 mt-1">
                      {interlocutor.firstName} {interlocutor.lastName}
                      {interlocutor.company && ` - ${interlocutor.company}`}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => router.push('/dashboard/interlocutors')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      ← Retour au Dashboard
                    </button>
                  </div>
                </div>
              </div>

              {/* Informations de l'interlocuteur */}
              <div className="bg-white rounded-lg shadow mb-4">
                <div className="p-6">
                  <div className="flex items-start space-x-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {interlocutor.firstName.charAt(0)}{interlocutor.lastName.charAt(0)}
                      </div>
        </div>

                    {/* Informations principales */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {interlocutor.firstName} {interlocutor.lastName}
              </h2>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          interlocutor.status === 'Actif' ? 'bg-green-100 text-green-800' :
                          interlocutor.status === 'Inactif' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                  {interlocutor.status}
                </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          interlocutor.role === 'client' ? 'bg-blue-100 text-blue-800' :
                          interlocutor.role === 'prospect' ? 'bg-purple-100 text-purple-800' :
                          interlocutor.role === 'partenaire' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {interlocutor.role}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          interlocutor.type === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {interlocutor.type === 'user' ? '👤 Interne' : '🌐 Externe'}
                  </span>
                      </div>

                      {/* Contact */}
                      <div className="space-y-2 text-gray-600">
                        <p className="flex items-center">
                          <span className="w-5 h-5 mr-2">📧</span>
                          {interlocutor.email}
                        </p>
                        <p className="flex items-center">
                          <span className="w-5 h-5 mr-2">📞</span>
                          {interlocutor.phone}
                        </p>
                        {interlocutor.company && (
                          <p className="flex items-center">
                            <span className="w-5 h-5 mr-2">🏢</span>
                            {interlocutor.company}
                          </p>
                        )}
                        {interlocutor.address && (
                          <p className="flex items-center">
                            <span className="w-5 h-5 mr-2">📍</span>
                            {interlocutor.address.street}, {interlocutor.address.postalCode} {interlocutor.address.city}, {interlocutor.address.country}
                          </p>
                )}
              </div>

                      {/* Statistiques */}
                      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{interlocutor.contracts.length}</div>
                          <div className="text-sm text-gray-500">Contrats</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{interlocutor.vehicles.length}</div>
                          <div className="text-sm text-gray-500">Véhicules</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{interlocutor.drivers.length}</div>
                          <div className="text-sm text-gray-500">Conducteurs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{interlocutor.claims.length}</div>
                          <div className="text-sm text-gray-500">Sinistres</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{interlocutor.events.length}</div>
                          <div className="text-sm text-gray-500">Événements</div>
                        </div>
              </div>
            </div>
            </div>
          </div>
        </div>

              {/* Modules Entreprise et Famille - Dans le bloc du haut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Module Entreprise */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg border border-orange-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center">
                        <span className="mr-2 text-xl">🏢</span>
                        Entreprise
                      </h3>
                <button
                        onClick={() => setShowCompanyForm(true)}
                        className="bg-white text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        + Ajouter
                </button>
                    </div>
          </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {company ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Nom:</span>
                              <p className="text-gray-900">{company.name}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">SIRET:</span>
                              <p className="text-gray-900">{company.siret}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Forme juridique:</span>
                              <p className="text-gray-900">{company.legalForm}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Capital:</span>
                              <p className="text-gray-900">{company.capital.toLocaleString()}€</p>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium text-gray-700">Adresse:</span>
                              <p className="text-gray-900">{company.address}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Téléphone:</span>
                              <p className="text-gray-900">{company.phone}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Email:</span>
                              <p className="text-gray-900">{company.email}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Activité:</span>
                              <p className="text-gray-900">{company.activity}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Employés:</span>
                              <p className="text-gray-900">{company.employees}</p>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 pt-2">
                            <button
                              onClick={() => setShowCompanyForm(true)}
                              className="text-orange-600 hover:text-orange-800 text-sm"
                            >
                              Modifier
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-base">
                          Aucune information d'entreprise disponible
                        </div>
                      )}
                    </div>
                  </div>
                  </div>

                {/* Module Famille */}
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-lg border border-pink-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center">
                        <span className="mr-2 text-xl">👨‍👩‍👧‍👦</span>
                        Famille
                      </h3>
                      <button 
                        onClick={() => setShowFamilyForm(true)}
                        className="bg-white text-pink-600 hover:bg-pink-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        + Ajouter
                      </button>
                      </div>
                      </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {family ? (
                        <div className="space-y-4">
                          {/* Conjoint(e) */}
                          {family.spouse && (
                            <div className="bg-white p-3 rounded-lg border">
                              <h4 className="font-medium text-gray-900 mb-2">Conjoint(e)</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Nom:</span>
                                  <p className="text-gray-900">{family.spouse.firstName} {family.spouse.lastName}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Profession:</span>
                                  <p className="text-gray-900">{family.spouse.profession || 'Non renseignée'}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Téléphone:</span>
                                  <p className="text-gray-900">{family.spouse.phone || 'Non renseigné'}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Email:</span>
                                  <p className="text-gray-900">{family.spouse.email || 'Non renseigné'}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Enfants */}
                          {family.children.length > 0 && (
                            <div className="bg-white p-3 rounded-lg border">
                              <h4 className="font-medium text-gray-900 mb-2">Enfants ({family.children.length})</h4>
                              <div className="space-y-2">
                                {family.children.map((child, index) => (
                                  <div key={index} className="text-sm">
                                    <span className="font-medium text-gray-700">
                                      {child.firstName} {child.lastName}
                                    </span>
                                    <span className="text-gray-500 ml-2">
                                      ({child.relationship === 'child' ? 'Enfant' : 
                                        child.relationship === 'stepchild' ? 'Beau-enfant' : 'Adopté'})
                                    </span>
                                    <span className="text-gray-500 ml-2">
                                      - {new Date(child.birthDate).toLocaleDateString('fr-FR')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Contact d'urgence */}
                          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                            <h4 className="font-medium text-red-900 mb-2">Contact d'urgence</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Nom:</span>
                                <p className="text-gray-900">{family.emergencyContact.firstName} {family.emergencyContact.lastName}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Lien:</span>
                                <p className="text-gray-900">{family.emergencyContact.relationship}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Téléphone:</span>
                                <p className="text-gray-900">{family.emergencyContact.phone}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Email:</span>
                                <p className="text-gray-900">{family.emergencyContact.email || 'Non renseigné'}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2 pt-2">
                            <button
                              onClick={() => setShowFamilyForm(true)}
                              className="text-pink-600 hover:text-pink-800 text-sm"
                            >
                              Modifier
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-base">
                          Aucune information de famille disponible
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>

              {/* Vérificateur d'éligibilité */}
              <div className="mb-4">
                <EligibilityChecker
                  interlocutor={interlocutor}
                  drivers={interlocutor.drivers}
                  vehicles={interlocutor.vehicles}
                  claims={interlocutor.claims}
                />
              </div>

              {/* Bouton toggle pour la sidebar des événements */}
              {interlocutor.events.length > 0 && (
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setShowEventsSidebar(!showEventsSidebar)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                  >
                    <span>{showEventsSidebar ? '📅' : '📋'}</span>
                    <span>{showEventsSidebar ? 'Masquer les événements' : 'Afficher les événements'}</span>
                  </button>
                </div>
              )}

                     {/* Layout principal avec sidebar pour les événements */}
                     <div className={`grid grid-cols-1 gap-4 ${interlocutor.events.length > 0 && showEventsSidebar ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
                       {/* Sidebar des événements - seulement si il y a des événements et si elle est visible */}
                       {interlocutor.events.length > 0 && showEventsSidebar && (
                         <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
                      <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900 flex items-center">
                          <span className="mr-2">📅</span>
                          Événements ({interlocutor.events.length})
                        </h3>
                <button
                          onClick={() => setShowEventForm(true)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-medium"
                        >
                          + Ajouter
                        </button>
                      </div>
                      <div className="p-2 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-2">
                          {interlocutor.events.map((event) => (
                            <div key={event.id} className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white">
                              <div className="flex items-start space-x-2">
                                <span className="text-lg flex-shrink-0">
                                  {event.type === 'call' && '📞'}
                                  {event.type === 'email' && '📧'}
                                  {event.type === 'meeting' && '🤝'}
                                  {event.type === 'task' && '✅'}
                                  {event.type === 'note' && '📝'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{event.title}</h4>
                                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{event.description}</p>
                                  
                                  {/* Participants */}
                                  <div className="mb-3">
                                    <div className="flex flex-wrap gap-2">
                                      {event.participants.map((participant, index) => (
                                        <span
                                          key={index}
                                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            participant.role === 'recipient' 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-blue-100 text-blue-800'
                                          }`}
                                        >
                                          {participant.name} ({participant.role === 'recipient' ? 'Destinataire' : 'Expéditeur'})
                    </span>
              ))}
                                    </div>
          </div>

                                  {/* Dates */}
                                  <div className="mb-3 space-y-1">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <span className="mr-2">📅</span>
                                      <span className="font-medium">Date de l'événement :</span>
                                      <span className="ml-2">{event.date} à {event.time}</span>
                      </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <span className="mr-2">✏️</span>
                                      <span className="font-medium">Créé le :</span>
                                      <span className="ml-2">{new Date(event.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <span className="mr-2">👤</span>
                                      <span className="font-medium">Créé par :</span>
                                      <span className="ml-2">{event.createdBy}</span>
                    </div>
                  </div>

                                  {/* Statut et priorité */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                        {event.status === 'completed' ? '✓ Terminé' : 
                                         event.status === 'pending' ? '⏸ En attente' : '✗ Annulé'}
                                      </span>
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                        event.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {event.priority === 'high' ? '🔴 Élevée' : 
                                         event.priority === 'medium' ? '🟡 Moyenne' : '🟢 Faible'}
                                      </span>
                      </div>
                                    <div className="flex space-x-1">
                                      <button 
                                        onClick={() => handleLinkModule('events', event.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                                        title="Lier"
                                      >
                                        Lier
                                      </button>
                                      <button 
                                        onClick={() => handleUnlinkModule('events', event.id)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium"
                                        title="Délier"
                                      >
                                        Délier
                                      </button>
                      </div>
                      </div>
                    </div>
                  </div>
                      </div>
                          ))}
                      </div>
                      </div>
                    </div>
                  </div>
                )}

                       {/* Contenu principal - Modules */}
                       <div className={`space-y-3 ${interlocutor.events.length > 0 && showEventsSidebar ? 'lg:col-span-1' : 'lg:col-span-1'}`}>

            {/* Section Sinistres */}
            {interlocutor.claims && interlocutor.claims.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border border-red-200 overflow-hidden">
                <div className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold flex items-center">
                      <span className="mr-2 text-lg">🚨</span>
                      Sinistres ({interlocutor.claims.length})
                    </h3>
                    <button 
                      onClick={() => handleAddModule('claims')}
                      className="bg-white text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs font-medium transition-colors"
                    >
                      + Ajouter
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <div className="space-y-2">
                    {interlocutor.claims.map((claim) => (
                      <div key={claim.id} className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-red-500 text-lg">🚨</span>
                              <h4 className="text-lg font-medium text-gray-900">{claim.type}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                claim.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                                claim.status === 'Résolu' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {claim.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{claim.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>📅 {claim.date}</span>
                              <span>💰 {claim.amount}€</span>
                              <span>🏢 {claim.insurer}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                claim.responsible ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {claim.responsible ? 'Responsable' : 'Non responsable'}
                              </span>
                              <span className="text-xs text-gray-600">
                                {claim.percentage}% de responsabilité
                              </span>
                      </div>
                      </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleLinkModule('claims', claim.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Lier
                            </button>
                            <button 
                              onClick={() => handleUnlinkModule('claims', claim.id)}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Délier
                            </button>
                            <button 
                              onClick={() => handleModifyModule('sinistre', claim.id)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteModule('claims', claim.id, claim.type)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Supprimer
                            </button>
                      </div>
                      </div>
                      </div>
                    ))}
                      </div>
                    </div>
                  </div>
                )}

            {/* Section Véhicules */}
            {interlocutor.vehicles && interlocutor.vehicles.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 overflow-hidden">
                <div className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold flex items-center">
                      <span className="mr-2 text-lg">🚗</span>
                      Véhicules ({interlocutor.vehicles.length})
                    </h3>
                    <button 
                      onClick={() => handleAddModule('vehicles')}
                      className="bg-white text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs font-medium transition-colors"
                    >
                      + Ajouter
                    </button>
              </div>
                        </div>
                <div className="p-2">
                  <div className="space-y-2">
                    {interlocutor.vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-blue-500 text-lg">🚗</span>
                              <h4 className="text-lg font-medium text-gray-900">{vehicle.brand} {vehicle.model}</h4>
                              <span className="text-gray-500">({vehicle.year})</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                vehicle.status === 'Assuré' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {vehicle.status}
                        </span>
                        </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>🔢 {vehicle.registration}</span>
                              <span>🏷️ {vehicle.type}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleLinkModule('vehicles', vehicle.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Lier
                            </button>
                            <button 
                              onClick={() => handleUnlinkModule('vehicles', vehicle.id)}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Délier
                            </button>
                            <button 
                              onClick={() => handleModifyModule('véhicule', vehicle.id)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteModule('vehicles', vehicle.id, `${vehicle.brand} ${vehicle.model}`)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Supprimer
                            </button>
                          </div>
                      </div>
                      </div>
                    ))}
                      </div>
                    </div>
              </div>
            )}

            {/* Section Conducteurs */}
            {interlocutor.drivers && interlocutor.drivers.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 overflow-hidden">
                <div className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold flex items-center">
                      <span className="mr-2 text-lg">👤</span>
                      Conducteurs ({interlocutor.drivers.length})
                    </h3>
                    <button 
                      onClick={() => handleAddModule('drivers')}
                      className="bg-white text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs font-medium transition-colors"
                    >
                      + Ajouter
                    </button>
                  </div>
                        </div>
                <div className="p-2">
              <div className="space-y-2">
                    {interlocutor.drivers.map((driver) => (
                      <div key={driver.id} className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-green-500 text-lg">👤</span>
                              <h4 className="text-lg font-medium text-gray-900">{driver.firstName} {driver.lastName}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                driver.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {driver.status}
                          </span>
                        </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>🆔 {driver.licenseNumber}</span>
                              <span>📋 {driver.licenseType}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleLinkModule('drivers', driver.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Lier
                            </button>
                            <button 
                              onClick={() => handleUnlinkModule('drivers', driver.id)}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Délier
                            </button>
                            <button 
                              onClick={() => handleModifyModule('conducteur', driver.id)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteModule('drivers', driver.id, `${driver.firstName} ${driver.lastName}`)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                      </div>
                    </div>
              </div>
            )}

            {/* Section Contrats */}
            {interlocutor.contracts && interlocutor.contracts.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg border border-purple-200 overflow-hidden">
                <div className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold flex items-center">
                      <span className="mr-2 text-lg">📄</span>
                      Contrats ({interlocutor.contracts.length})
                    </h3>
                    <button 
                      onClick={() => handleAddModule('contracts')}
                      className="bg-white text-purple-600 hover:bg-purple-50 px-2 py-1 rounded text-xs font-medium transition-colors"
                    >
                      + Ajouter
                    </button>
                  </div>
                        </div>
                <div className="p-2">
              <div className="space-y-2">
                    {interlocutor.contracts.map((contract) => (
                      <div key={contract.id} className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-purple-500 text-lg">📄</span>
                              <h4 className="text-lg font-medium text-gray-900">{contract.type}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                contract.status === 'En cours' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                          {contract.status}
                        </span>
                      </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>🏢 {contract.insurer}</span>
                              <span>💰 {contract.premium}€</span>
                              <span>📅 {contract.startDate} - {contract.endDate}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span className="font-medium">📄 N°: {contract.policyNumber || 'N/A'}</span>
                              <span className="font-medium">👤 Chargé: {contract.assignedTo || 'Non assigné'}</span>
                            </div>
              </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleLinkModule('contracts', contract.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Lier
                            </button>
                            <button 
                              onClick={() => handleUnlinkModule('contracts', contract.id)}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Délier
                            </button>
                            <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                              Modifier
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                              Supprimer
                            </button>
                        </div>
                      </div>
                    </div>
                    ))}
                      </div>
                    </div>
              </div>
            )}

            {/* Section Demandes d'Assurance */}
            {interlocutor.insuranceRequests && interlocutor.insuranceRequests.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg border border-indigo-200 overflow-hidden">
                <div className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold flex items-center">
                      <span className="mr-2 text-lg">📋</span>
                      Demandes d'Assurance ({interlocutor.insuranceRequests.length})
                    </h3>
                    <button 
                      onClick={() => handleAddModule('insuranceRequests')}
                      className="bg-white text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded text-xs font-medium transition-colors"
                    >
                      + Ajouter
                    </button>
                  </div>
                        </div>
                <div className="p-2">
              <div className="space-y-2">
                    {interlocutor.insuranceRequests.map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-indigo-500 text-lg">📋</span>
                              <h4 className="text-lg font-medium text-gray-900">{request.type}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'Accepté' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {request.status}
                        </span>
                      </div>
                            <p className="text-gray-600 mb-2">{request.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>📅 {request.createdAt}</span>
                              <span>💰 N/A€</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span className="font-medium">📄 N°: {request.id}</span>
                              <span className="font-medium">👤 Chargé: {request.assignedTo || 'Non assigné'}</span>
                              <span className="font-medium">⚡ Priorité: {request.priority || 'Moyenne'}</span>
                            </div>
              </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleLinkModule('insuranceRequests', request.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Lier
                            </button>
                            <button 
                              onClick={() => handleUnlinkModule('insuranceRequests', request.id)}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Délier
                            </button>
                            <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                              Modifier
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                              Supprimer
                            </button>
                        </div>
                      </div>
                    </div>
                    ))}
                      </div>
                    </div>
              </div>
            )}

                        </div>
                      </div>
                    </div>
                 </main>
          </div>
        </div>

      {/* Modals */}
      {showLinkManager && selectedModule && interlocutor && (
        <ModuleLinkManager
          interlocutor={interlocutor}
          moduleType={selectedModule.type}
          moduleId={selectedModule.id}
          onSuccess={handleLinkSuccess}
          onCancel={handleLinkCancel}
        />
      )}

      {showUnlinkManager && selectedModule && interlocutor && (
        <ModuleUnlinkManager
          interlocutor={interlocutor}
          moduleType={selectedModule.type}
          moduleId={selectedModule.id}
          onSuccess={handleUnlinkSuccess}
          onCancel={handleLinkCancel}
        />
      )}

             {showEventForm && interlocutor && (
               <EventForm
                 interlocutorId={interlocutor.id}
                 onSuccess={handleEventCreated}
                 onCancel={handleLinkCancel}
               />
             )}

             {showAddForm && addFormType && interlocutor && (
               <ModuleAddForm
                 interlocutorId={interlocutor.id}
                 moduleType={addFormType}
                 onSuccess={handleAddSuccess}
                 onCancel={handleAddCancel}
               />
             )}

             {showDeleteModal && deleteItem && (
               <DeleteConfirmModal
                 isOpen={showDeleteModal}
                 onConfirm={handleDeleteConfirm}
                 onCancel={handleDeleteCancel}
                 title="Confirmer la suppression"
                 message="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
                 itemName={deleteItem.name}
                 isLoading={isDeleting}
               />
             )}

             {/* Formulaires Entreprise et Famille */}
             {showCompanyForm && (
               <CompanyForm
                 interlocutorId={interlocutor?.id || ''}
                 onSuccess={handleCompanySuccess}
                 onCancel={() => setShowCompanyForm(false)}
                 initialData={company || undefined}
               />
             )}

             {showFamilyForm && (
               <FamilyForm
                 interlocutorId={interlocutor?.id || ''}
                 onSuccess={handleFamilySuccess}
                 onCancel={() => setShowFamilyForm(false)}
                 initialData={family || undefined}
               />
             )}

             {/* Formulaire de modification de l'interlocuteur */}
             {showEditForm && interlocutor && (
               <InterlocutorEditForm
                 interlocutor={interlocutor}
                 onSuccess={handleInterlocutorEditSuccess}
                 onCancel={() => setShowEditForm(false)}
               />
             )}
           </ProtectedRoute>
  );
}