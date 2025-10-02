'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/MinimalAuthContext';
import { Interlocutor, Claim, Vehicle, Driver } from '@/types/interlocutor';
import { InterlocutorService } from '@/lib/interlocutors';
import ModuleLinkManager from '@/components/ModuleLinkManager';
import ModuleUnlinkManager from '@/components/ModuleUnlinkManager';
import EventForm from '@/components/EventForm';
import ModuleAddForm from '@/components/ModuleAddForm';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import SmartEventsTimeline from '@/components/events/SmartEventsTimeline';
import { SmartEventsService } from '@/lib/smartEventsService';
import EligibilityChecker from '@/components/EligibilityChecker';
import CompanyForm from '@/components/CompanyForm';
import FamilyForm from '@/components/FamilyForm';
import InterlocutorEditForm from '@/components/InterlocutorEditForm';
import ClaimForm from '@/components/ClaimForm';
import VehicleForm from '@/components/VehicleForm';
import DriverForm from '@/components/DriverForm';
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
  
  // États pour les filtres d'événements
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [eventStatusFilter, setEventStatusFilter] = useState<string>('all');
  const [eventPriorityFilter, setEventPriorityFilter] = useState<string>('all');
  const [eventDateFilter, setEventDateFilter] = useState<string>('all');
  const [eventSortBy, setEventSortBy] = useState<string>('event_date'); // 'event_date' ou 'creation_date'
  const [eventSortOrder, setEventSortOrder] = useState<string>('desc'); // 'asc' ou 'desc'
  const [useAISearch, setUseAISearch] = useState(false); // Recherche IA activée
  
  // États pour les formulaires de modification
  const [showClaimEditForm, setShowClaimEditForm] = useState(false);
  const [showVehicleEditForm, setShowVehicleEditForm] = useState(false);
  const [showDriverEditForm, setShowDriverEditForm] = useState(false);
  const [showContractEditForm, setShowContractEditForm] = useState(false);
  const [showRequestEditForm, setShowRequestEditForm] = useState(false);
  const [showEventEditForm, setShowEventEditForm] = useState(false);
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editingContract, setEditingContract] = useState<any>(null);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);

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
    // Fermer tous les autres formulaires d'abord
    setShowEditForm(false);
    setShowCompanyForm(false);
    setShowFamilyForm(false);
    setShowClaimEditForm(false);
    setShowVehicleEditForm(false);
    setShowDriverEditForm(false);
    setShowContractEditForm(false);
    setShowRequestEditForm(false);
    setShowEventEditForm(false);
    setEditingClaim(null);
    setEditingVehicle(null);
    setEditingDriver(null);
    setEditingContract(null);
    setEditingRequest(null);
    setEditingEvent(null);

    switch (type) {
      case 'interlocutor':
        setShowEditForm(true);
        break;
      case 'company':
        setShowCompanyForm(true);
        break;
      case 'family':
        setShowFamilyForm(true);
        break;
      case 'sinistre':
        // Ouvrir le formulaire de modification de sinistre avec les données existantes
        const claim = interlocutor.claims.find(c => c.id === id);
        if (claim) {
          setEditingClaim(claim);
          setShowClaimEditForm(true);
        }
        break;
      case 'véhicule':
        // Ouvrir le formulaire de modification de véhicule avec les données existantes
        const vehicle = interlocutor.vehicles.find(v => v.id === id);
        if (vehicle) {
          setEditingVehicle(vehicle);
          setShowVehicleEditForm(true);
        }
        break;
      case 'conducteur':
        // Ouvrir le formulaire de modification de conducteur avec les données existantes
        const driver = interlocutor.drivers.find(d => d.id === id);
        if (driver) {
          setEditingDriver(driver);
          setShowDriverEditForm(true);
        }
        break;
      case 'contrat':
        // Ouvrir le formulaire de modification de contrat avec les données existantes
        const contract = interlocutor.contracts.find(c => c.id === id);
        if (contract) {
          setEditingContract(contract);
          setShowContractEditForm(true);
        }
        break;
      case 'demande':
        // Ouvrir le formulaire de modification de demande avec les données existantes
        const request = interlocutor.insuranceRequests.find(r => r.id === id);
        if (request) {
          setEditingRequest(request);
          setShowRequestEditForm(true);
        }
        break;
      case 'event':
        // Ouvrir le formulaire de modification d'événement avec les données existantes
        const event = interlocutor.events.find(e => e.id === id);
        if (event) {
          setEditingEvent(event);
          setShowEventEditForm(true);
        }
        break;
      default:
        alert(`Modification de ${type} ${id} - Fonctionnalité à implémenter`);
    }
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

  const handleClaimEditSuccess = (updatedClaim: Claim) => {
    if (interlocutor) {
      const updatedClaims = interlocutor.claims.map(c => c.id === updatedClaim.id ? updatedClaim : c);
      setInterlocutor({ ...interlocutor, claims: updatedClaims });
    }
    setShowClaimEditForm(false);
    setEditingClaim(null);
    console.log('Sinistre modifié:', updatedClaim);
  };

  const handleVehicleEditSuccess = (updatedVehicle: Vehicle) => {
    if (interlocutor) {
      const updatedVehicles = interlocutor.vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v);
      setInterlocutor({ ...interlocutor, vehicles: updatedVehicles });
    }
    setShowVehicleEditForm(false);
    setEditingVehicle(null);
    console.log('Véhicule modifié:', updatedVehicle);
  };

  const handleDriverEditSuccess = (updatedDriver: Driver) => {
    if (interlocutor) {
      const updatedDrivers = interlocutor.drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d);
      setInterlocutor({ ...interlocutor, drivers: updatedDrivers });
    }
    setShowDriverEditForm(false);
    setEditingDriver(null);
    console.log('Conducteur modifié:', updatedDriver);
  };

  const handleContractEditSuccess = (updatedContract: any) => {
    if (interlocutor) {
      const updatedContracts = interlocutor.contracts.map(c => c.id === updatedContract.id ? updatedContract : c);
      setInterlocutor({ ...interlocutor, contracts: updatedContracts });
    }
    setShowContractEditForm(false);
    setEditingContract(null);
    console.log('Contrat modifié:', updatedContract);
  };

  const handleRequestEditSuccess = (updatedRequest: any) => {
    if (interlocutor) {
      const updatedRequests = interlocutor.insuranceRequests.map(r => r.id === updatedRequest.id ? updatedRequest : r);
      setInterlocutor({ ...interlocutor, insuranceRequests: updatedRequests });
    }
    setShowRequestEditForm(false);
    setEditingRequest(null);
    console.log('Demande modifiée:', updatedRequest);
  };

  const handleEventEditSuccess = (updatedEvent: any) => {
    if (interlocutor) {
      const updatedEvents = interlocutor.events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
      setInterlocutor({ ...interlocutor, events: updatedEvents });
    }
    setShowEventEditForm(false);
    setEditingEvent(null);
    console.log('Événement modifié:', updatedEvent);
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

  // Fonction pour filtrer et trier les événements
  const filteredEvents = (() => {
    if (!interlocutor?.events) return [];

    // D'abord filtrer
    const filtered = interlocutor.events.filter(event => {
      // Filtre par recherche textuelle (IA ou classique)
      const matchesSearch = eventSearchQuery === '' || 
        (useAISearch ? aiSearch(eventSearchQuery, event) : 
         normalizeText(event.title).includes(normalizeText(eventSearchQuery)) ||
         normalizeText(event.description).includes(normalizeText(eventSearchQuery)) ||
         normalizeText(event.createdBy).includes(normalizeText(eventSearchQuery)) ||
         event.participants.some(p => normalizeText(p.name).includes(normalizeText(eventSearchQuery))));

      // Filtre par type
      const matchesType = eventTypeFilter === 'all' || event.type === eventTypeFilter;

      // Filtre par statut
      const matchesStatus = eventStatusFilter === 'all' || event.status === eventStatusFilter;

      // Filtre par priorité
      const matchesPriority = eventPriorityFilter === 'all' || event.priority === eventPriorityFilter;

      // Filtre par date
      const matchesDate = (() => {
        if (eventDateFilter === 'all') return true;
        
        const eventDate = new Date(event.date);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const thisWeek = new Date(today);
        thisWeek.setDate(thisWeek.getDate() - 7);
        const thisMonth = new Date(today);
        thisMonth.setMonth(thisMonth.getMonth() - 1);

        switch (eventDateFilter) {
          case 'today':
            return eventDate >= today;
          case 'yesterday':
            return eventDate >= yesterday && eventDate < today;
          case 'week':
            return eventDate >= thisWeek;
          case 'month':
            return eventDate >= thisMonth;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesDate;
    });

    // Ensuite trier
    return filtered.sort((a, b) => {
      let dateA: Date, dateB: Date;

      if (eventSortBy === 'event_date') {
        // Trier par date de l'événement (date choisie par le créateur)
        dateA = new Date(`${a.date} ${a.time || '00:00'}`);
        dateB = new Date(`${b.date} ${b.time || '00:00'}`);
      } else {
        // Trier par date de création
        dateA = new Date(a.createdAt);
        dateB = new Date(b.createdAt);
      }

      const comparison = dateA.getTime() - dateB.getTime();
      return eventSortOrder === 'asc' ? comparison : -comparison;
    });
  })();

  // Fonction pour normaliser le texte (enlever accents, casse, etc.)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^\w\s]/g, ' ') // Remplacer ponctuation par espaces
      .replace(/\s+/g, ' ') // Normaliser les espaces
      .trim();
  };

  // Fonction de recherche IA avec synonymes et contexte
  const aiSearch = (query: string, event: any): boolean => {
    const normalizedQuery = normalizeText(query);
    
    // Si la recherche contient des guillemets, recherche exacte
    if (query.includes('"')) {
      const exactQuery = query.replace(/"/g, '').toLowerCase();
      return event.title.toLowerCase().includes(exactQuery) ||
             event.description.toLowerCase().includes(exactQuery) ||
             event.createdBy.toLowerCase().includes(exactQuery);
    }

    // Dictionnaire de synonymes et contextes
    const synonyms: { [key: string]: string[] } = {
      'appel': ['telephone', 'tel', 'call', 'coup de fil', 'contact telephonique', 'conversation'],
      'telephone': ['appel', 'tel', 'call', 'coup de fil', 'contact telephonique'],
      'email': ['mail', 'courriel', 'message electronique', 'e-mail', 'courrier'],
      'mail': ['email', 'courriel', 'message electronique', 'e-mail', 'courrier'],
      'reunion': ['meeting', 'rendez-vous', 'rdv', 'entretien', 'rencontre', 'conference'],
      'meeting': ['reunion', 'rendez-vous', 'rdv', 'entretien', 'rencontre'],
      'rdv': ['rendez-vous', 'reunion', 'meeting', 'entretien', 'rencontre'],
      'tache': ['task', 'travail', 'action', 'todo', 'a faire', 'mission'],
      'task': ['tache', 'travail', 'action', 'todo', 'a faire', 'mission'],
      'note': ['memo', 'remarque', 'commentaire', 'observation', 'annotation'],
      'urgent': ['prioritaire', 'important', 'critique', 'presse', 'emergency'],
      'important': ['urgent', 'prioritaire', 'critique', 'essentiel', 'majeur'],
      'client': ['prospect', 'contact', 'interlocuteur', 'personne', 'individu'],
      'prospect': ['client', 'contact', 'lead', 'potentiel', 'futur client'],
      'assurance': ['police', 'contrat', 'couverture', 'protection', 'garantie'],
      'sinistre': ['accident', 'dommage', 'incident', 'probleme', 'reclamation'],
      'devis': ['estimation', 'proposition', 'offre', 'tarif', 'prix', 'cotation'],
      'contrat': ['accord', 'convention', 'engagement', 'police', 'document'],
      'paiement': ['reglement', 'versement', 'transaction', 'facture', 'somme'],
      'facture': ['paiement', 'reglement', 'note', 'addition', 'montant']
    };

    // Contextes thématiques
    const contexts: { [key: string]: string[] } = {
      'assurance': ['police', 'prime', 'franchise', 'garantie', 'couverture', 'sinistre', 'indemnisation'],
      'commercial': ['vente', 'prospect', 'client', 'devis', 'proposition', 'negociation', 'closing'],
      'administratif': ['document', 'papier', 'formulaire', 'dossier', 'procedure', 'validation'],
      'technique': ['probleme', 'bug', 'erreur', 'maintenance', 'reparation', 'support'],
      'financier': ['paiement', 'facture', 'reglement', 'comptabilite', 'budget', 'cout']
    };

    // Recherche dans le contenu de l'événement
    const eventContent = normalizeText(`${event.title} ${event.description} ${event.createdBy} ${event.participants?.map((p: any) => p.name).join(' ') || ''}`);
    
    // Recherche directe normalisée
    if (eventContent.includes(normalizedQuery)) {
      return true;
    }

    // Recherche par synonymes
    const queryWords = normalizedQuery.split(' ');
    for (const word of queryWords) {
      if (synonyms[word]) {
        for (const synonym of synonyms[word]) {
          if (eventContent.includes(normalizeText(synonym))) {
            return true;
          }
        }
      }
    }

    // Recherche contextuelle
    for (const [context, keywords] of Object.entries(contexts)) {
      if (normalizedQuery.includes(context)) {
        for (const keyword of keywords) {
          if (eventContent.includes(normalizeText(keyword))) {
            return true;
          }
        }
      }
    }

    return false;
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
                        {/* Affichage classique des événements - SYSTÈME ORIGINAL */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700">📝 Événements Classiques</h4>
                            <span className="text-xs text-gray-500">({filteredEvents.length} événements)</span>
                          </div>
                          
                          {/* Barre de recherche et filtres */}
                          <div className="mb-4 space-y-3 bg-gray-50 p-3 rounded-lg border">
                            {/* Recherche textuelle avec toggle IA */}
                            <div>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder={useAISearch ? 
                                    "🧠 Recherche IA: synonymes, contexte, \"guillemets pour exact\"..." : 
                                    "🔍 Recherche classique (sans accents): titre, description, créateur..."}
                                  value={eventSearchQuery}
                                  onChange={(e) => setEventSearchQuery(e.target.value)}
                                  className="w-full pl-8 pr-20 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="absolute left-2 top-2.5 text-gray-400">
                                  {useAISearch ? '🧠' : '🔍'}
                                </span>
                                <button
                                  onClick={() => setUseAISearch(!useAISearch)}
                                  className={`absolute right-2 top-1 px-2 py-1 text-xs rounded transition-colors ${
                                    useAISearch 
                                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                  title={useAISearch ? 'Recherche IA activée (synonymes, contexte)' : 'Recherche classique (cliquez pour IA)'}
                                >
                                  {useAISearch ? '🧠 IA' : '🔍 Normal'}
                                </button>
                              </div>
                              {useAISearch && (
                                <div className="mt-2 text-xs text-purple-600 bg-purple-50 p-2 rounded">
                                  💡 <strong>Recherche IA activée :</strong> Tapez "appel" pour trouver "téléphone", "réunion" pour "RDV", 
                                  "assurance" pour "police/garantie", ou utilisez des "guillemets" pour une recherche exacte.
                                </div>
                              )}
                            </div>
                            
                            {/* Filtres */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {/* Filtre par type */}
                              <select
                                value={eventTypeFilter}
                                onChange={(e) => setEventTypeFilter(e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="all">📋 Tous types</option>
                                <option value="call">📞 Appels</option>
                                <option value="email">📧 Emails</option>
                                <option value="meeting">🤝 Réunions</option>
                                <option value="task">✅ Tâches</option>
                                <option value="note">📝 Notes</option>
                              </select>
                              
                              {/* Filtre par statut */}
                              <select
                                value={eventStatusFilter}
                                onChange={(e) => setEventStatusFilter(e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="all">📊 Tous statuts</option>
                                <option value="pending">⏸ En attente</option>
                                <option value="completed">✓ Terminé</option>
                                <option value="cancelled">✗ Annulé</option>
                              </select>
                              
                              {/* Filtre par priorité */}
                              <select
                                value={eventPriorityFilter}
                                onChange={(e) => setEventPriorityFilter(e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="all">🎯 Toutes priorités</option>
                                <option value="high">🔴 Élevée</option>
                                <option value="medium">🟡 Moyenne</option>
                                <option value="low">🟢 Faible</option>
                              </select>
                              
                              {/* Filtre par date */}
                              <select
                                value={eventDateFilter}
                                onChange={(e) => setEventDateFilter(e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="all">📅 Toutes dates</option>
                                <option value="today">📅 Aujourd'hui</option>
                                <option value="yesterday">📅 Hier</option>
                                <option value="week">📅 Cette semaine</option>
                                <option value="month">📅 Ce mois</option>
                              </select>
                            </div>
                            
                            {/* Contrôles de tri */}
                            <div className="border-t pt-3 mt-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-600">📊 Tri des événements :</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {/* Trier par */}
                                <select
                                  value={eventSortBy}
                                  onChange={(e) => setEventSortBy(e.target.value)}
                                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="event_date">📅 Date événement (choisie)</option>
                                  <option value="creation_date">✏️ Date création</option>
                                </select>
                                
                                {/* Ordre */}
                                <select
                                  value={eventSortOrder}
                                  onChange={(e) => setEventSortOrder(e.target.value)}
                                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="desc">⬇️ Plus récent d'abord</option>
                                  <option value="asc">⬆️ Plus ancien d'abord</option>
                                </select>
                              </div>
                            </div>
                            
                            {/* Bouton reset filtres */}
                            {(eventSearchQuery || eventTypeFilter !== 'all' || eventStatusFilter !== 'all' || eventPriorityFilter !== 'all' || eventDateFilter !== 'all' || eventSortBy !== 'event_date' || eventSortOrder !== 'desc' || useAISearch) && (
                              <div className="flex justify-end">
                                <button
                                  onClick={() => {
                                    setEventSearchQuery('');
                                    setEventTypeFilter('all');
                                    setEventStatusFilter('all');
                                    setEventPriorityFilter('all');
                                    setEventDateFilter('all');
                                    setEventSortBy('event_date');
                                    setEventSortOrder('desc');
                                    setUseAISearch(false);
                                  }}
                                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition-colors"
                                >
                                  🔄 Réinitialiser tout
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            {filteredEvents.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">🔍</div>
                                <p className="text-sm">Aucun événement ne correspond aux filtres</p>
                                <p className="text-xs mt-1">Essayez de modifier vos critères de recherche</p>
                              </div>
                            ) : (
                              filteredEvents.map((event) => (
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
                                        <button 
                                          onClick={() => handleModifyModule('event', event.id)}
                                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium"
                                          title="Modifier"
                                        >
                                          Modifier
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteModule('events', event.id, event.title)}
                                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                                          title="Supprimer"
                                        >
                                          Supprimer
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Timeline intelligente des événements - SYSTÈME AMÉLIORÉ */}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">🧠 Timeline Intelligente (Nouveau)</h4>
                          <SmartEventsTimeline 
                            interlocutorId={interlocutor.id}
                            showAnalytics={false}
                            maxEvents={50}
                            autoRefresh={true}
                          />
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
                            <button 
                              onClick={() => handleModifyModule('contrat', contract.id)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
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
                            <button 
                              onClick={() => handleModifyModule('demande', request.id)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
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

             {/* Formulaires Entreprise et Famille - Modales superposées */}
             {showCompanyForm && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                   <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-semibold text-gray-900">
                         {company ? 'Modifier l\'entreprise' : 'Ajouter une entreprise'}
                       </h2>
                       <button
                         onClick={() => setShowCompanyForm(false)}
                         className="text-gray-400 hover:text-gray-600 text-2xl"
                       >
                         ×
                       </button>
                     </div>
                     <CompanyForm
                       interlocutorId={interlocutor?.id || ''}
                       onSuccess={handleCompanySuccess}
                       onCancel={() => setShowCompanyForm(false)}
                       initialData={company || undefined}
                     />
                   </div>
                 </div>
               </div>
             )}

             {showFamilyForm && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                   <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-semibold text-gray-900">
                         {family ? 'Modifier la famille' : 'Ajouter une famille'}
                       </h2>
                       <button
                         onClick={() => setShowFamilyForm(false)}
                         className="text-gray-400 hover:text-gray-600 text-2xl"
                       >
                         ×
                       </button>
                     </div>
                     <FamilyForm
                       interlocutorId={interlocutor?.id || ''}
                       onSuccess={handleFamilySuccess}
                       onCancel={() => setShowFamilyForm(false)}
                       initialData={family || undefined}
                     />
                   </div>
                 </div>
               </div>
             )}

             {/* Formulaire de modification de l'interlocuteur - Modal superposé */}
             {showEditForm && interlocutor && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                   <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-semibold text-gray-900">Modifier l'interlocuteur</h2>
                       <button
                         onClick={() => setShowEditForm(false)}
                         className="text-gray-400 hover:text-gray-600 text-2xl"
                       >
                         ×
                       </button>
                     </div>
                     <InterlocutorEditForm
                       interlocutor={interlocutor}
                       onSuccess={handleInterlocutorEditSuccess}
                       onCancel={() => setShowEditForm(false)}
                     />
                   </div>
                 </div>
               </div>
             )}

             {/* Formulaires de modification des modules - Modales superposées */}
             {showClaimEditForm && editingClaim && interlocutor && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                   <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-semibold text-gray-900">Modifier le sinistre</h2>
                       <button
                         onClick={() => {
                           setShowClaimEditForm(false);
                           setEditingClaim(null);
                         }}
                         className="text-gray-400 hover:text-gray-600 text-2xl"
                       >
                         ×
                       </button>
                     </div>
                     <ClaimForm
                       interlocutorId={interlocutor.id}
                       onSuccess={handleClaimEditSuccess}
                       onCancel={() => {
                         setShowClaimEditForm(false);
                         setEditingClaim(null);
                       }}
                       initialData={editingClaim}
                       isEditing={true}
                     />
                   </div>
                 </div>
               </div>
             )}

             {showVehicleEditForm && editingVehicle && interlocutor && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                   <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-semibold text-gray-900">Modifier le véhicule</h2>
                       <button
                         onClick={() => {
                           setShowVehicleEditForm(false);
                           setEditingVehicle(null);
                         }}
                         className="text-gray-400 hover:text-gray-600 text-2xl"
                       >
                         ×
                       </button>
                     </div>
                     <VehicleForm
                       interlocutorId={interlocutor.id}
                       onSuccess={handleVehicleEditSuccess}
                       onCancel={() => {
                         setShowVehicleEditForm(false);
                         setEditingVehicle(null);
                       }}
                       initialData={editingVehicle}
                       isEditing={true}
                     />
                   </div>
                 </div>
               </div>
             )}

             {showDriverEditForm && editingDriver && interlocutor && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                   <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-semibold text-gray-900">Modifier le conducteur</h2>
                       <button
                         onClick={() => {
                           setShowDriverEditForm(false);
                           setEditingDriver(null);
                         }}
                         className="text-gray-400 hover:text-gray-600 text-2xl"
                       >
                         ×
                       </button>
                     </div>
                     <DriverForm
                       interlocutorId={interlocutor.id}
                       onSuccess={handleDriverEditSuccess}
                       onCancel={() => {
                         setShowDriverEditForm(false);
                         setEditingDriver(null);
                       }}
                       initialData={editingDriver}
                       isEditing={true}
                     />
                   </div>
                 </div>
               </div>
             )}

             {/* Formulaires de modification des contrats, demandes et événements - Modales superposées */}
             {showContractEditForm && editingContract && interlocutor && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                   <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-semibold text-gray-900">Modifier le contrat</h2>
                       <button
                         onClick={() => {
                           setShowContractEditForm(false);
                           setEditingContract(null);
                         }}
                         className="text-gray-400 hover:text-gray-600 text-2xl"
                       >
                         ×
                       </button>
                     </div>
                     <div className="text-center py-8">
                       <p className="text-gray-600 mb-4">Formulaire de modification de contrat</p>
                       <p className="text-sm text-gray-500 mb-6">
                         Contrat: {editingContract.type} - {editingContract.insurer}
                       </p>
                       <div className="flex justify-center space-x-3">
                         <button
                           onClick={() => {
                             setShowContractEditForm(false);
                             setEditingContract(null);
                           }}
                           className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                         >
                           Annuler
                         </button>
                         <button
                           onClick={() => {
                             handleContractEditSuccess(editingContract);
                           }}
                           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                         >
                           Modifier
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {showRequestEditForm && editingRequest && interlocutor && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                   <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-semibold text-gray-900">Modifier la demande</h2>
                       <button
                         onClick={() => {
                           setShowRequestEditForm(false);
                           setEditingRequest(null);
                         }}
                         className="text-gray-400 hover:text-gray-600 text-2xl"
                       >
                         ×
                       </button>
                     </div>
                     <div className="text-center py-8">
                       <p className="text-gray-600 mb-4">Formulaire de modification de demande d'assurance</p>
                       <p className="text-sm text-gray-500 mb-6">
                         Demande: {editingRequest.type} - {editingRequest.description}
                       </p>
                       <div className="flex justify-center space-x-3">
                         <button
                           onClick={() => {
                             setShowRequestEditForm(false);
                             setEditingRequest(null);
                           }}
                           className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                         >
                           Annuler
                         </button>
                         <button
                           onClick={() => {
                             handleRequestEditSuccess(editingRequest);
                           }}
                           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                         >
                           Modifier
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             )}

            {/* Modal pour créer un nouvel événement */}
            {showEventForm && interlocutor && (
              <EventForm
                interlocutorId={interlocutor.id}
                onSuccess={() => {
                  setShowEventForm(false);
                  // Recharger les données de l'interlocuteur
                  const updatedInterlocutor = InterlocutorService.getInterlocutorById(interlocutor.id);
                  if (updatedInterlocutor) {
                    setInterlocutor(updatedInterlocutor);
                  }
                }}
                onCancel={() => {
                  setShowEventForm(false);
                }}
              />
            )}

            {/* Modal pour éditer un événement existant */}
            {showEventEditForm && editingEvent && interlocutor && (
              <EventForm
                interlocutorId={interlocutor.id}
                existingEvent={editingEvent}
                onSuccess={() => {
                  handleEventEditSuccess(editingEvent);
                  setShowEventEditForm(false);
                  setEditingEvent(null);
                }}
                onCancel={() => {
                  setShowEventEditForm(false);
                  setEditingEvent(null);
                }}
              />
            )}
           </ProtectedRoute>
  );
}