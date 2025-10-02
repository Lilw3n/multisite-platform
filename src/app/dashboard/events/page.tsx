'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  Users, 
  Filter, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  ExternalLink,
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Activity,
  MessageCircle,
  CheckSquare,
  Square,
  Copy,
  X
} from 'lucide-react';
import { Event } from '@/types/interlocutor';
import { InterlocutorService } from '@/lib/interlocutors';
import { formatDateFR, formatDateTimeFR } from '@/lib/dateUtils';
import UniversalSearchBar from '@/components/search/UniversalSearchBar';
import { SearchResult } from '@/types/universalSearch';
import { ConfirmationModal } from '@/components/ui/Modal';

interface EventWithInterlocutor extends Event {
  interlocutorName: string;
  interlocutorId: string;
}

export default function GlobalEventsPage() {
  const [events, setEvents] = useState<EventWithInterlocutor[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithInterlocutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    dateRange: 'all',
    interlocutor: 'all'
  });
  const [sortBy, setSortBy] = useState<'eventDate' | 'createdAt' | 'title' | 'priority'>('eventDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // États pour la sélection multiple
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isProcessingBulkAction, setIsProcessingBulkAction] = useState(false);

  useEffect(() => {
    loadAllEvents();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [events, searchQuery, selectedFilters, sortBy, sortOrder]);

  const loadAllEvents = async () => {
    setIsLoading(true);
    try {
      const interlocutors = await InterlocutorService.getAllInterlocutors();
      const allEvents: EventWithInterlocutor[] = [];

      interlocutors.forEach(interlocutor => {
        if (interlocutor.events && interlocutor.events.length > 0) {
          interlocutor.events.forEach(event => {
            allEvents.push({
              ...event,
              interlocutorName: `${interlocutor.firstName} ${interlocutor.lastName}`,
              interlocutorId: interlocutor.id
            });
          });
        }
      });

      setEvents(allEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de sélection multiple
  const handleEventSelect = (eventId: string) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId);
    } else {
      newSelected.add(eventId);
    }
    setSelectedEvents(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedEvents.size === filteredEvents.length) {
      // Désélectionner tout
      setSelectedEvents(new Set());
      setShowBulkActions(false);
    } else {
      // Sélectionner tout
      const allIds = new Set(filteredEvents.map(event => event.id));
      setSelectedEvents(allIds);
      setShowBulkActions(true);
    }
  };

  const handleClearSelection = () => {
    setSelectedEvents(new Set());
    setShowBulkActions(false);
  };

  const handleBulkDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmBulkDelete = async () => {
    setIsProcessingBulkAction(true);
    try {
      // Grouper les événements par interlocuteur pour optimiser les suppressions
      const eventsByInterlocutor = new Map<string, string[]>();
      
      filteredEvents.forEach(event => {
        if (selectedEvents.has(event.id)) {
          if (!eventsByInterlocutor.has(event.interlocutorId)) {
            eventsByInterlocutor.set(event.interlocutorId, []);
          }
          eventsByInterlocutor.get(event.interlocutorId)!.push(event.id);
        }
      });

      // Supprimer les événements par interlocuteur
      for (const [interlocutorId, eventIds] of eventsByInterlocutor) {
        for (const eventId of eventIds) {
          await InterlocutorService.deleteEvent(interlocutorId, eventId);
        }
      }

      // Recharger les données
      await loadAllEvents();
      
      // Réinitialiser la sélection
      setSelectedEvents(new Set());
      setShowBulkActions(false);
      setShowDeleteConfirmation(false);
      
      alert(`${selectedEvents.size} événement(s) supprimé(s) avec succès`);
    } catch (error) {
      console.error('Erreur lors de la suppression en masse:', error);
      alert('Erreur lors de la suppression des événements');
    } finally {
      setIsProcessingBulkAction(false);
    }
  };

  const handleBulkDuplicate = async () => {
    setIsProcessingBulkAction(true);
    try {
      // Grouper les événements par interlocuteur
      const eventsByInterlocutor = new Map<string, EventWithInterlocutor[]>();
      
      filteredEvents.forEach(event => {
        if (selectedEvents.has(event.id)) {
          if (!eventsByInterlocutor.has(event.interlocutorId)) {
            eventsByInterlocutor.set(event.interlocutorId, []);
          }
          eventsByInterlocutor.get(event.interlocutorId)!.push(event);
        }
      });

      // Dupliquer les événements
      for (const [interlocutorId, eventsToClone] of eventsByInterlocutor) {
        for (const event of eventsToClone) {
          const duplicatedEvent = {
            ...event,
            id: `${event.id}_copy_${Date.now()}`,
            title: `${event.title} (Copie)`,
            createdAt: new Date().toISOString(),
            // Décaler la date de l'événement de 7 jours
            date: new Date(new Date(event.date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };
          
          await InterlocutorService.createEvent(interlocutorId, duplicatedEvent);
        }
      }

      // Recharger les données
      await loadAllEvents();
      
      // Réinitialiser la sélection
      setSelectedEvents(new Set());
      setShowBulkActions(false);
      
      alert(`${selectedEvents.size} événement(s) dupliqué(s) avec succès`);
    } catch (error) {
      console.error('Erreur lors de la duplication en masse:', error);
      alert('Erreur lors de la duplication des événements');
    } finally {
      setIsProcessingBulkAction(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...events];

    // Recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.interlocutorName.toLowerCase().includes(query) ||
        event.participants.some(p => p.name.toLowerCase().includes(query)) ||
        event.createdBy.toLowerCase().includes(query)
      );
    }

    // Filtres
    if (selectedFilters.type !== 'all') {
      filtered = filtered.filter(event => event.type === selectedFilters.type);
    }

    if (selectedFilters.status !== 'all') {
      filtered = filtered.filter(event => event.status === selectedFilters.status);
    }

    if (selectedFilters.priority !== 'all') {
      filtered = filtered.filter(event => event.priority === selectedFilters.priority);
    }

    if (selectedFilters.interlocutor !== 'all') {
      filtered = filtered.filter(event => event.interlocutorId === selectedFilters.interlocutor);
    }

    // Filtre par date
    if (selectedFilters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        
        switch (selectedFilters.dateRange) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return eventDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return eventDate >= monthAgo;
          case 'future':
            return eventDate > today;
          case 'past':
            return eventDate < today;
          default:
            return true;
        }
      });
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'eventDate':
          aValue = new Date(`${a.date} ${a.time}`).getTime();
          bValue = new Date(`${b.date} ${b.time}`).getTime();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const handleSearchResults = (results: SearchResult) => {
    // Filtrer les événements basés sur les résultats de recherche
    const resultIds = results.items.map(item => item.id);
    const searchFiltered = events.filter(event => resultIds.includes(event.id));
    setFilteredEvents(searchFiltered);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFilters({
      type: 'all',
      status: 'all',
      priority: 'all',
      dateRange: 'all',
      interlocutor: 'all'
    });
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '📧';
      case 'meeting': return '🤝';
      case 'task': return '✅';
      case 'note': return '📝';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUniqueInterlocutors = () => {
    const unique = new Map();
    events.forEach(event => {
      if (!unique.has(event.interlocutorId)) {
        unique.set(event.interlocutorId, event.interlocutorName);
      }
    });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-blue-500" />
                  Tous les Événements
                </h1>
                <p className="text-gray-600">
                  Vue globale de tous les événements de tous les interlocuteurs
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'calendar' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Calendrier
                </button>
              </div>
              
              <button
                onClick={loadAllEvents}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Événements</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => e.status === 'completed').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interlocuteurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getUniqueInterlocutors().length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Barre d'actions en masse */}
        {showBulkActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <CheckSquare className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">
                    {selectedEvents.size} événement(s) sélectionné(s)
                  </span>
                </div>
                
                <button
                  onClick={handleClearSelection}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Désélectionner tout
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBulkDuplicate}
                  disabled={isProcessingBulkAction}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Copy className="w-4 h-4" />
                  <span>Dupliquer</span>
                </button>
                
                <button
                  onClick={handleBulkDelete}
                  disabled={isProcessingBulkAction}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recherche et filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            {/* Barre de recherche */}
            <div>
              <UniversalSearchBar
                placeholder="Rechercher dans tous les événements..."
                onSearch={handleSearchResults}
                allowedTypes={['event']}
                showFilters={false}
                size="md"
              />
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={selectedFilters.type}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous</option>
                  <option value="call">Appel</option>
                  <option value="email">Email</option>
                  <option value="meeting">Réunion</option>
                  <option value="task">Tâche</option>
                  <option value="note">Note</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={selectedFilters.status}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous</option>
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select
                  value={selectedFilters.priority}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes</option>
                  <option value="high">Élevée</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Faible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
                <select
                  value={selectedFilters.dateRange}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="future">À venir</option>
                  <option value="past">Passés</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interlocuteur</label>
                <select
                  value={selectedFilters.interlocutor}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, interlocutor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous</option>
                  {getUniqueInterlocutors().map(interlocutor => (
                    <option key={interlocutor.id} value={interlocutor.id}>
                      {interlocutor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy as any);
                    setSortOrder(newSortOrder as any);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="eventDate-desc">Date événement ↓</option>
                  <option value="eventDate-asc">Date événement ↑</option>
                  <option value="createdAt-desc">Date création ↓</option>
                  <option value="createdAt-asc">Date création ↑</option>
                  <option value="title-asc">Titre A-Z</option>
                  <option value="title-desc">Titre Z-A</option>
                  <option value="priority-desc">Priorité ↓</option>
                  <option value="priority-asc">Priorité ↑</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} 
                {filteredEvents.length !== events.length && ` sur ${events.length} total`}
              </div>
              
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>

        {/* Liste des événements */}
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={`${event.interlocutorId}-${event.id}`} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Case à cocher */}
                  <div className="flex-shrink-0 pt-1">
                    <button
                      onClick={() => handleEventSelect(event.id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {selectedEvents.has(event.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <Link
                              href={`/dashboard/interlocutors/${event.interlocutorId}`}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {event.interlocutorName}
                            </Link>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateFR(event.date)} à {event.time}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Créé le {new Date(event.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status === 'pending' ? 'En attente' :
                           event.status === 'completed' ? 'Terminé' :
                           event.status === 'cancelled' ? 'Annulé' : event.status}
                        </span>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                          {event.priority === 'high' ? 'Élevée' :
                           event.priority === 'medium' ? 'Moyenne' :
                           event.priority === 'low' ? 'Faible' : event.priority}
                        </span>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="text-gray-700 mb-3">{event.description}</p>
                    )}
                    
                    {event.participants.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Participants:</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.participants.map((participant, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {participant.name} ({participant.role === 'sender' ? 'Expéditeur' : 'Destinataire'})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Créé par: {event.createdBy}
                      </div>
                      
                      <Link
                        href={`/dashboard/interlocutors/${event.interlocutorId}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <span>Voir le profil</span>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || Object.values(selectedFilters).some(f => f !== 'all')
                  ? 'Aucun événement ne correspond à vos critères de recherche.'
                  : 'Aucun événement n\'a été créé pour le moment.'
                }
              </p>
              
              {(searchQuery || Object.values(selectedFilters).some(f => f !== 'all')) && (
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
