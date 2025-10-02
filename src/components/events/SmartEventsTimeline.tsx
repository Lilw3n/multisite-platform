'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Users, 
  MessageSquare, 
  Phone, 
  Mail, 
  Video,
  MapPin,
  Hash,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Heart,
  Share2,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Brain,
  Target,
  BarChart3,
  Settings,
  Star,
  Flag,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Lightbulb,
  Sparkles,
  Activity,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { SmartEventsService } from '@/lib/smartEventsService';
import { 
  SmartEvent, 
  SmartEventFilter, 
  EventAnalytics,
  EventType,
  EventCategory,
  EventPriority,
  EventSentiment,
  SortOption
} from '@/types/advancedEvents';

interface SmartEventsTimelineProps {
  interlocutorId?: string;
  showAnalytics?: boolean;
  maxEvents?: number;
  autoRefresh?: boolean;
}

export default function SmartEventsTimeline({
  interlocutorId,
  showAnalytics = true,
  maxEvents = 50,
  autoRefresh = true
}: SmartEventsTimelineProps) {
  const [events, setEvents] = useState<SmartEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SmartEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SmartEvent | null>(null);
  const [analytics, setAnalytics] = useState<EventAnalytics | null>(null);
  
  // États de filtrage ultra-avancés
  const [activeFilters, setActiveFilters] = useState<Partial<SmartEventFilter>>({
    sorting: {
      primary: { field: 'createdAt', direction: 'desc' }
    }
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [semanticSearch, setSemanticSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'cards' | 'analytics' | 'ai_insights'>('timeline');
  const [groupBy, setGroupBy] = useState<'none' | 'date' | 'type' | 'participant' | 'sentiment' | 'priority'>('date');
  
  // États UI avancés
  const [showFilters, setShowFilters] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(autoRefresh);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'all'>('week');

  useEffect(() => {
    loadEvents();
    if (autoUpdate) {
      const interval = setInterval(loadEvents, 30000); // Refresh toutes les 30s
      return () => clearInterval(interval);
    }
  }, [autoUpdate]);

  useEffect(() => {
    applyFilters();
  }, [events, activeFilters, searchQuery, selectedTags, timeRange]);

  // Fonction pour convertir les anciens événements au format SmartEvent
  const convertLegacyEventToSmartEvent = (oldEvent: any, interlocutorId: string): SmartEvent => {
    const now = new Date();
    
    return {
      id: oldEvent.id || `legacy_${Date.now()}_${Math.random()}`,
      title: oldEvent.title || 'Événement',
      description: oldEvent.description || '',
      content: oldEvent.description || '',
      
      timestamps: {
        createdAt: oldEvent.createdAt || now.toISOString(),
        scheduledAt: oldEvent.date ? `${oldEvent.date}T${oldEvent.time || '00:00'}:00` : undefined,
        executedAt: oldEvent.status === 'completed' ? oldEvent.createdAt : undefined,
        lastModified: oldEvent.createdAt || now.toISOString()
      },
      
      participants: {
        creator: {
          id: oldEvent.createdBy || 'user_internal_1',
          name: oldEvent.createdBy || 'Utilisateur',
          role: 'creator',
          type: 'internal'
        },
        recipients: oldEvent.participants?.map((p: any) => ({
          id: `participant_${p.name.replace(/\s+/g, '_')}`,
          name: p.name,
          role: p.role || 'recipient',
          type: 'external',
          responseStatus: 'pending'
        })) || [],
        mentions: [],
        watchers: []
      },
      
      classification: {
        type: oldEvent.type === 'call' ? 'communication' : 
              oldEvent.type === 'email' ? 'communication' : 
              oldEvent.type === 'meeting' ? 'sales' : 'communication',
        subType: oldEvent.type,
        category: oldEvent.type as any || 'note',
        priority: oldEvent.priority as any || 'normal',
        urgency: oldEvent.priority === 'high' ? 'today' : 'this_week',
        sentiment: 'neutral',
        businessImpact: oldEvent.priority === 'high' ? 'high' : 'medium'
      },
      
      channels: {
        primary: {
          type: oldEvent.type as any || 'note',
          identifier: oldEvent.type === 'email' ? 'email' : oldEvent.type === 'call' ? 'phone' : 'internal'
        },
        deliveryStatus: {}
      },
      
      enrichment: {
        hashtags: [],
        keywords: oldEvent.title ? oldEvent.title.toLowerCase().split(' ').filter(w => w.length > 3) : [],
        entities: [],
        topics: [oldEvent.type || 'general'],
        language: 'fr',
        readingTime: 1
      },
      
      relationships: {
        childEvents: [],
        relatedEvents: [],
        triggers: []
      },
      
      tracking: {
        views: 1,
        interactions: 0,
        responses: [],
        engagement: {
          engagementScore: 50
        },
        conversionEvents: []
      },
      
      aiInsights: {
        predictedOutcome: 'Événement legacy - analyse limitée',
        recommendedActions: [],
        similarEvents: [],
        riskScore: 20,
        opportunityScore: 50,
        nextBestAction: 'Analyser avec les nouveaux outils'
      },
      
      workflow: {
        status: oldEvent.status === 'completed' ? 'completed' : 
                oldEvent.status === 'pending' ? 'in_progress' : 'draft',
        stage: 'legacy',
        nextSteps: [],
        automationRules: []
      },
      
      attachments: oldEvent.attachments?.map((att: any) => ({
        id: att.id || `att_${Date.now()}`,
        name: att.name || 'Document',
        type: att.type || 'document',
        url: att.url || '#',
        size: att.size,
        mimeType: att.mimeType
      })) || [],
      
      system: {
        source: 'manual',
        version: 1,
        isArchived: false,
        isDeleted: false,
        permissions: {
          visibility: 'internal',
          canView: [interlocutorId],
          canEdit: [interlocutorId],
          canDelete: [interlocutorId],
          canShare: [interlocutorId]
        },
        auditTrail: []
      }
    };
  };

  const loadEvents = () => {
    // Charger les nouveaux événements SmartEvents (sans forcer la régénération)
    let smartEvents = SmartEventsService.getAllEvents();
    if (smartEvents.length === 0) {
      smartEvents = SmartEventsService.generateDemoEvents();
      smartEvents.forEach(event => SmartEventsService.saveEvent(event));
    }
    
    // Charger les anciens événements depuis l'interlocuteur si disponible
    let legacyEvents: SmartEvent[] = [];
    if (interlocutorId && typeof window !== 'undefined') {
      try {
        // Importer le service d'interlocuteurs pour récupérer les anciens événements
        const InterlocutorService = require('@/lib/interlocutors').InterlocutorService;
        const interlocutor = InterlocutorService.getInterlocutorById(interlocutorId);
        
        if (interlocutor && interlocutor.events) {
          // Convertir les anciens événements au format SmartEvent
          legacyEvents = interlocutor.events.map((oldEvent: any) => convertLegacyEventToSmartEvent(oldEvent, interlocutorId));
        }
      } catch (error) {
        console.warn('Impossible de charger les anciens événements:', error);
      }
    }
    
    // Fusionner tous les événements
    const allEvents = [...smartEvents, ...legacyEvents];
    setEvents(allEvents);
    
    // Générer analytics
    if (showAnalytics) {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const analyticsData = SmartEventsService.generateAnalytics(allEvents, {
        start: weekAgo.toISOString(),
        end: now.toISOString()
      });
      setAnalytics(analyticsData);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];
    
    // Filtre par interlocuteur
    if (interlocutorId) {
      filtered = filtered.filter(e => 
        e.participants.creator.id === interlocutorId ||
        e.participants.recipients.some(r => r.id === interlocutorId) ||
        e.participants.mentions.some(m => m.id === interlocutorId)
      );
    }
    
    // Filtre temporel
    if (timeRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (timeRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(e => new Date(e.timestamps.createdAt) >= cutoffDate);
    }
    
    // Recherche sémantique ou classique
    if (searchQuery) {
      if (semanticSearch) {
        filtered = SmartEventsService.semanticSearch(searchQuery, filtered);
      } else {
        const query = searchQuery.toLowerCase().trim();
        const queryWords = query.split(' ').filter(word => word.length > 1);
        
        filtered = filtered.filter(e => {
          // Recherche dans le titre
          const titleMatch = e.title.toLowerCase().includes(query);
          
          // Recherche dans la description
          const descriptionMatch = e.description?.toLowerCase().includes(query) || false;
          
          // Recherche dans le contenu
          const contentMatch = e.content?.toLowerCase().includes(query) || false;
          
          // Recherche dans les mots-clés
          const keywordMatch = e.enrichment.keywords.some(k => 
            k.toLowerCase().includes(query) || 
            queryWords.some(word => k.toLowerCase().includes(word))
          );
          
          // Recherche dans les hashtags
          const hashtagMatch = e.enrichment.hashtags.some(h => 
            h.toLowerCase().includes(query) ||
            h.toLowerCase().replace('#', '').includes(query.replace('#', ''))
          );
          
          // Recherche dans les participants
          const creatorMatch = e.participants.creator.name.toLowerCase().includes(query);
          const recipientMatch = e.participants.recipients.some(r => 
            r.name.toLowerCase().includes(query) ||
            r.email?.toLowerCase().includes(query) ||
            r.phone?.includes(query.replace(/\s+/g, ''))
          );
          
          // Recherche dans les topics
          const topicMatch = e.enrichment.topics.some(t => 
            t.toLowerCase().includes(query) ||
            queryWords.some(word => t.toLowerCase().includes(word))
          );
          
          // Recherche par type d'événement
          const typeMatch = e.classification.type.toLowerCase().includes(query) ||
                           e.classification.category.toLowerCase().includes(query) ||
                           e.classification.subType?.toLowerCase().includes(query);
          
          // Recherche par sentiment
          const sentimentMatch = e.classification.sentiment.toLowerCase().includes(query);
          
          // Recherche par priorité
          const priorityMatch = e.classification.priority.toLowerCase().includes(query);
          
          return titleMatch || descriptionMatch || contentMatch || keywordMatch || 
                 hashtagMatch || creatorMatch || recipientMatch || topicMatch || 
                 typeMatch || sentimentMatch || priorityMatch;
        });
      }
    }
    
    // Filtre par tags sélectionnés
    if (selectedTags.length > 0) {
      filtered = filtered.filter(e => 
        selectedTags.some(tag => 
          e.enrichment.hashtags.includes(tag) ||
          e.enrichment.keywords.includes(tag.replace('#', ''))
        )
      );
    }
    
    // Application des filtres avancés
    filtered = SmartEventsService.searchEvents({
      ...activeFilters,
      contentFilter: {
        ...activeFilters.contentFilter,
        hashtags: selectedTags.length > 0 ? selectedTags : undefined
      }
    });
    
    // Limitation du nombre d'événements
    if (maxEvents && filtered.length > maxEvents) {
      filtered = filtered.slice(0, maxEvents);
    }
    
    setFilteredEvents(filtered);
  };

  // Extraction des tags populaires
  const popularTags = useMemo(() => {
    const tagCounts = events.reduce((acc, event) => {
      [...event.enrichment.hashtags, ...event.enrichment.keywords].forEach(tag => {
        const normalizedTag = tag.startsWith('#') ? tag : `#${tag}`;
        acc[normalizedTag] = (acc[normalizedTag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }));
  }, [events]);

  // Groupement intelligent des événements
  const groupedEvents = useMemo(() => {
    if (groupBy === 'none') return { 'Tous les événements': filteredEvents };
    
    return filteredEvents.reduce((groups, event) => {
      let groupKey = '';
      
      switch (groupBy) {
        case 'date':
          groupKey = new Date(event.timestamps.createdAt).toLocaleDateString('fr-FR');
          break;
        case 'type':
          groupKey = event.classification.type;
          break;
        case 'participant':
          groupKey = event.participants.creator.name;
          break;
        case 'sentiment':
          groupKey = event.classification.sentiment;
          break;
        case 'priority':
          groupKey = event.classification.priority;
          break;
      }
      
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(event);
      return groups;
    }, {} as Record<string, SmartEvent[]>);
  }, [filteredEvents, groupBy]);

  const getEventIcon = (event: SmartEvent) => {
    switch (event.classification.category) {
      case 'email': return <Mail className="h-5 w-5" />;
      case 'sms': return <MessageSquare className="h-5 w-5" />;
      case 'whatsapp': return <Smartphone className="h-5 w-5" />;
      case 'call': return <Phone className="h-5 w-5" />;
      case 'meeting': return <Users className="h-5 w-5" />;
      case 'video_call': return <Video className="h-5 w-5" />;
      case 'in_person': return <MapPin className="h-5 w-5" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: EventPriority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'urgent': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'high': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'normal': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSentimentColor = (sentiment: EventSentiment) => {
    switch (sentiment) {
      case 'very_positive': return 'text-green-700 bg-green-100';
      case 'positive': return 'text-green-600 bg-green-50';
      case 'neutral': return 'text-gray-600 bg-gray-50';
      case 'negative': return 'text-red-600 bg-red-50';
      case 'very_negative': return 'text-red-700 bg-red-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEventCard = (event: SmartEvent) => (
    <div
      key={event.id}
      onClick={() => setSelectedEvent(event)}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* En-tête événement */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getPriorityColor(event.classification.priority)}`}>
            {getEventIcon(event)}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {event.title}
            </h4>
            <p className="text-sm text-gray-600">
              {event.participants.creator.name} → {event.participants.recipients.map(r => r.name).join(', ')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(event.classification.sentiment)}`}>
            {event.classification.sentiment}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(event.timestamps.createdAt)}
          </span>
        </div>
      </div>

      {/* Contenu */}
      {event.description && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {event.description}
        </p>
      )}

      {/* Tags et métadonnées */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {event.enrichment.hashtags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
          {event.enrichment.hashtags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{event.enrichment.hashtags.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{event.tracking.views}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>{event.tracking.engagement.engagementScore}%</span>
          </span>
          {event.aiInsights.riskScore > 50 && (
            <span className="flex items-center space-x-1 text-red-500">
              <AlertTriangle className="h-3 w-3" />
              <span>Risque</span>
            </span>
          )}
          {event.aiInsights.opportunityScore > 70 && (
            <span className="flex items-center space-x-1 text-green-500">
              <Target className="h-3 w-3" />
              <span>Opportunité</span>
            </span>
          )}
        </div>
      </div>

      {/* IA Insights */}
      {showAIInsights && event.aiInsights.recommendedActions.length > 0 && (
        <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded border-l-4 border-purple-400">
          <div className="flex items-start space-x-2">
            <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-purple-900">IA Recommande:</p>
              <p className="text-xs text-purple-700">
                {event.aiInsights.recommendedActions[0].title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Boutons d'action pour événements legacy */}
      {event.workflow.stage === 'legacy' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Actions:</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Logique pour lier l'événement à l'interlocuteur
                  if (interlocutorId) {
                    try {
                      const InterlocutorService = require('@/lib/interlocutors').InterlocutorService;
                      const interlocutor = InterlocutorService.getInterlocutorById(interlocutorId);
                      
                      if (interlocutor) {
                        // Ajouter l'événement à l'interlocuteur s'il n'existe pas déjà
                        const existingEvent = interlocutor.events?.find((e: any) => e.id === event.id);
                        if (!existingEvent) {
                          const legacyEvent = {
                            id: event.id,
                            title: event.title,
                            description: event.description,
                            type: event.classification.category,
                            date: event.timestamps.scheduledAt?.split('T')[0] || new Date().toISOString().split('T')[0],
                            time: event.timestamps.scheduledAt?.split('T')[1]?.substring(0, 5) || '00:00',
                            status: event.workflow.status === 'completed' ? 'completed' : 'pending',
                            priority: event.classification.priority,
                            participants: event.participants.recipients.map(r => ({ name: r.name, role: r.role })),
                            createdAt: event.timestamps.createdAt,
                            createdBy: event.participants.creator.name,
                            attachments: event.attachments
                          };
                          
                          const updatedInterlocutor = {
                            ...interlocutor,
                            events: [...(interlocutor.events || []), legacyEvent]
                          };
                          
                          InterlocutorService.updateInterlocutor(updatedInterlocutor);
                          alert('✅ Événement lié avec succès à l\'interlocuteur !');
                          window.location.reload();
                        } else {
                          alert('ℹ️ Cet événement est déjà lié à cet interlocuteur.');
                        }
                      }
                    } catch (error) {
                      console.error('Erreur liaison événement:', error);
                      alert('❌ Erreur lors de la liaison de l\'événement.');
                    }
                  }
                }}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                title="Lier à l'interlocuteur"
              >
                🔗 Lier
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Logique pour délier l'événement de l'interlocuteur
                  if (interlocutorId && confirm('Êtes-vous sûr de vouloir délier cet événement de l\'interlocuteur ?')) {
                    try {
                      const InterlocutorService = require('@/lib/interlocutors').InterlocutorService;
                      const interlocutor = InterlocutorService.getInterlocutorById(interlocutorId);
                      
                      if (interlocutor) {
                        // Supprimer l'événement de l'interlocuteur
                        const updatedInterlocutor = {
                          ...interlocutor,
                          events: (interlocutor.events || []).filter((e: any) => e.id !== event.id)
                        };
                        
                        InterlocutorService.updateInterlocutor(updatedInterlocutor);
                        alert('✅ Événement délié avec succès de l\'interlocuteur !');
                        window.location.reload();
                      }
                    } catch (error) {
                      console.error('Erreur déliaison événement:', error);
                      alert('❌ Erreur lors de la déliaison de l\'événement.');
                    }
                  }
                }}
                className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                title="Délier de l'interlocuteur"
              >
                🔓 Délier
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Logique pour modifier l'événement
                  console.log('Modifier événement:', event.id);
                }}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                title="Modifier l'événement"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Logique pour supprimer l'événement
                  if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cet événement ?')) {
                    try {
                      // Supprimer de SmartEventsService
                      SmartEventsService.deleteEvent(event.id);
                      
                      // Supprimer aussi de l'interlocuteur si lié
                      if (interlocutorId) {
                        const InterlocutorService = require('@/lib/interlocutors').InterlocutorService;
                        const interlocutor = InterlocutorService.getInterlocutorById(interlocutorId);
                        
                        if (interlocutor) {
                          const updatedInterlocutor = {
                            ...interlocutor,
                            events: (interlocutor.events || []).filter((e: any) => e.id !== event.id)
                          };
                          
                          InterlocutorService.updateInterlocutor(updatedInterlocutor);
                        }
                      }
                      
                      alert('✅ Événement supprimé avec succès !');
                      window.location.reload();
                    } catch (error) {
                      console.error('Erreur suppression événement:', error);
                      alert('❌ Erreur lors de la suppression de l\'événement.');
                    }
                  }
                }}
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                title="Supprimer définitivement"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderFiltersPanel = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Filtres Intelligents</h3>
        <button
          onClick={() => setActiveFilters({ sorting: { primary: { field: 'createdAt', direction: 'desc' } } })}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Réinitialiser
        </button>
      </div>

      {/* Recherche sémantique */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recherche {semanticSearch ? 'Sémantique' : 'Classique'}
        </label>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={semanticSearch ? "Recherche intelligente..." : "Mots-clés, hashtags, participants..."}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setSemanticSearch(!semanticSearch)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              semanticSearch 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            {semanticSearch ? <Brain className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Tags populaires */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags Populaires
        </label>
        <div className="flex flex-wrap gap-2">
          {popularTags.slice(0, 10).map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter(t => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {tag} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Période */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Période
        </label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
          <option value="all">Tout</option>
        </select>
      </div>

      {/* Tri */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trier par
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={activeFilters.sorting?.primary.field || 'createdAt'}
            onChange={(e) => setActiveFilters({
              ...activeFilters,
              sorting: {
                primary: {
                  field: e.target.value as any,
                  direction: activeFilters.sorting?.primary.direction || 'desc'
                }
              }
            })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Date création</option>
            <option value="scheduledAt">Date événement (choisie)</option>
            <option value="executedAt">Date exécution</option>
            <option value="priority">Priorité</option>
            <option value="engagement">Engagement</option>
            <option value="riskScore">Score risque</option>
            <option value="opportunityScore">Score opportunité</option>
            <option value="views">Nombre de vues</option>
            <option value="responseTime">Temps de réponse</option>
          </select>
          <button
            onClick={() => setActiveFilters({
              ...activeFilters,
              sorting: {
                primary: {
                  field: activeFilters.sorting?.primary.field || 'createdAt',
                  direction: activeFilters.sorting?.primary.direction === 'desc' ? 'asc' : 'desc'
                }
              }
            })}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center"
          >
            {activeFilters.sorting?.primary.direction === 'desc' ? 
              <SortDesc className="h-4 w-4" /> : 
              <SortAsc className="h-4 w-4" />
            }
          </button>
        </div>
      </div>

      {/* Groupement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grouper par
        </label>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">Aucun groupement</option>
          <option value="date">Date</option>
          <option value="type">Type</option>
          <option value="participant">Participant</option>
          <option value="sentiment">Sentiment</option>
          <option value="priority">Priorité</option>
        </select>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    if (!analytics) return null;

    return (
      <div className="space-y-6">
        {/* Métriques globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Événements</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.overview.totalEvents}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Moyen</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(analytics.overview.engagementRate)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps Réponse</p>
                <p className="text-2xl font-bold text-orange-600">{Math.round(analytics.overview.averageResponseTime)}min</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Événements Actifs</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.overview.activeEvents}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Insights IA */}
        {analytics.aiInsights.patterns.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium text-purple-900">Insights IA</h3>
            </div>
            <div className="space-y-3">
              {analytics.aiInsights.patterns.map(pattern => (
                <div key={pattern.id} className="flex items-start space-x-3">
                  <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">{pattern.title}</p>
                    <p className="text-sm text-purple-700">{pattern.description}</p>
                    <p className="text-xs text-purple-600">Confiance: {Math.round(pattern.confidence * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prédictions */}
        {analytics.aiInsights.predictions.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-green-900">Prédictions</h3>
            </div>
            <div className="space-y-3">
              {analytics.aiInsights.predictions.map(prediction => (
                <div key={prediction.id} className="flex items-start space-x-3">
                  <Target className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">
                      {prediction.type === 'volume' ? 'Volume prévu' : prediction.type}
                    </p>
                    <p className="text-sm text-green-700">
                      {typeof prediction.prediction === 'object' && prediction.prediction.expectedEvents
                        ? `${prediction.prediction.expectedEvents} événements attendus`
                        : 'Prédiction disponible'
                      }
                    </p>
                    <p className="text-xs text-green-600">Confiance: {Math.round(prediction.confidence * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Événements Intelligents
            {filteredEvents.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {filteredEvents.length}
              </span>
            )}
          </h2>
          
          {/* Modes d'affichage */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { mode: 'timeline', icon: Activity, label: 'Timeline' },
              { mode: 'cards', icon: BarChart3, label: 'Cartes' },
              { mode: 'analytics', icon: TrendingUp, label: 'Analytics' },
              { mode: 'ai_insights', icon: Brain, label: 'IA' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={label}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showAIInsights
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            <Brain className="h-4 w-4 mr-1" />
            IA
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtres
          </button>
          
          <button
            onClick={() => setAutoUpdate(!autoUpdate)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              autoUpdate
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            {autoUpdate ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          
          <button
            onClick={loadEvents}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Panneau de filtres */}
      {showFilters && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            {renderFiltersPanel()}
          </div>
          <div className="lg:col-span-3">
            {/* Contenu principal sera ici */}
          </div>
        </div>
      )}

      {/* Barre de recherche principale (toujours visible) */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Rechercher événements par mots-clés, hashtags, participants..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
          
          <button
            onClick={() => setSemanticSearch(!semanticSearch)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              semanticSearch 
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
            }`}
            title={semanticSearch ? 'Recherche IA activée' : 'Recherche classique'}
          >
            {semanticSearch ? (
              <>
                <Brain className="h-5 w-5 mr-2" />
                IA
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Classique
              </>
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Trier par:</label>
            <select
              value={activeFilters.sorting?.primary.field || 'createdAt'}
              onChange={(e) => setActiveFilters({
                ...activeFilters,
                sorting: {
                  primary: {
                    field: e.target.value as any,
                    direction: activeFilters.sorting?.primary.direction || 'desc'
                  }
                }
              })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">📅 Date création</option>
              <option value="scheduledAt">🗓️ Date événement</option>
              <option value="executedAt">✅ Date exécution</option>
              <option value="priority">🚨 Priorité</option>
              <option value="engagement">💬 Engagement</option>
              <option value="riskScore">⚠️ Score risque</option>
              <option value="opportunityScore">🎯 Opportunité</option>
            </select>
            
            <button
              onClick={() => setActiveFilters({
                ...activeFilters,
                sorting: {
                  primary: {
                    field: activeFilters.sorting?.primary.field || 'createdAt',
                    direction: activeFilters.sorting?.primary.direction === 'desc' ? 'asc' : 'desc'
                  }
                }
              })}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center"
              title={`Tri ${activeFilters.sorting?.primary.direction === 'desc' ? 'décroissant' : 'croissant'}`}
            >
              {activeFilters.sorting?.primary.direction === 'desc' ? 
                <SortDesc className="h-4 w-4" /> : 
                <SortAsc className="h-4 w-4" />
              }
            </button>
          </div>
        </div>
        
        {/* Tags populaires (toujours visibles) */}
        {popularTags.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags populaires:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTags.slice(0, 8).map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {tag} <span className="opacity-75">({count})</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Filtres rapides */}
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filtres rapides:</span>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">📅 Aujourd'hui</option>
            <option value="week">📅 Cette semaine</option>
            <option value="month">📅 Ce mois</option>
            <option value="quarter">📅 Ce trimestre</option>
            <option value="year">📅 Cette année</option>
            <option value="all">📅 Tout</option>
          </select>
          
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">🔄 Pas de groupement</option>
            <option value="date">📅 Grouper par date</option>
            <option value="type">📋 Grouper par type</option>
            <option value="participant">👥 Grouper par participant</option>
            <option value="sentiment">😊 Grouper par sentiment</option>
            <option value="priority">🚨 Grouper par priorité</option>
          </select>
          
          {(searchQuery || selectedTags.length > 0 || timeRange !== 'week') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
                setTimeRange('week');
                setActiveFilters({ sorting: { primary: { field: 'createdAt', direction: 'desc' } } });
              }}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
            >
              🗑️ Effacer filtres
            </button>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className={showFilters ? 'lg:col-span-3' : ''}>
        {viewMode === 'analytics' && renderAnalytics()}
        
        {viewMode === 'ai_insights' && analytics && (
          <div className="space-y-6">
            {renderAnalytics()}
            
            {/* Top performers */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Événements Performants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Plus Engageants</h4>
                  <div className="space-y-2">
                    {analytics.topPerformers.mostEngaging.slice(0, 3).map(event => (
                      <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900 truncate">{event.title}</span>
                        <span className="text-xs text-green-600 font-medium">
                          {event.tracking.engagement.engagementScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Plus Vus</h4>
                  <div className="space-y-2">
                    {analytics.topPerformers.mostViewed.slice(0, 3).map(event => (
                      <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900 truncate">{event.title}</span>
                        <span className="text-xs text-blue-600 font-medium">
                          {event.tracking.views} vues
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {(viewMode === 'timeline' || viewMode === 'cards') && (
          <div className="space-y-6">
            {Object.entries(groupedEvents).map(([groupName, groupEvents]) => (
              <div key={groupName}>
                {groupBy !== 'none' && (
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                    <span>{groupName}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {groupEvents.length}
                    </span>
                  </h3>
                )}
                
                <div className={viewMode === 'cards' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-4'
                }>
                  {groupEvents.map(renderEventCard)}
                </div>
              </div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun événement trouvé</p>
                <p className="text-sm">Ajustez vos filtres ou créez un nouvel événement</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal détail événement */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Détail de l'événement</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Contenu détaillé de l'événement */}
              <div className="space-y-6">
                {/* En-tête */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getPriorityColor(selectedEvent.classification.priority)}`}>
                      {getEventIcon(selectedEvent)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{selectedEvent.title}</h3>
                      <p className="text-gray-600">{selectedEvent.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedEvent.classification.priority)}`}>
                      {selectedEvent.classification.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(selectedEvent.classification.sentiment)}`}>
                      {selectedEvent.classification.sentiment}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                {selectedEvent.content && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Contenu</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.content}</p>
                  </div>
                )}

                {/* Participants */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Participants</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Créateur</p>
                      <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-900">{selectedEvent.participants.creator.name}</span>
                        <span className="text-xs text-blue-600">({selectedEvent.participants.creator.type})</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Destinataires</p>
                      <div className="space-y-1">
                        {selectedEvent.participants.recipients.map(recipient => (
                          <div key={recipient.id} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                            <User className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-900">{recipient.name}</span>
                            <span className="text-xs text-green-600">({recipient.responseStatus})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedEvent.tracking.views}</p>
                    <p className="text-sm text-blue-700">Vues</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedEvent.tracking.engagement.engagementScore}%</p>
                    <p className="text-sm text-green-700">Engagement</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{selectedEvent.aiInsights.riskScore}%</p>
                    <p className="text-sm text-red-700">Risque</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{selectedEvent.aiInsights.opportunityScore}%</p>
                    <p className="text-sm text-purple-700">Opportunité</p>
                  </div>
                </div>

                {/* Recommandations IA */}
                {selectedEvent.aiInsights.recommendedActions.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4">
                    <h4 className="font-medium text-purple-900 mb-3 flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>Recommandations IA</span>
                    </h4>
                    <div className="space-y-3">
                      {selectedEvent.aiInsights.recommendedActions.map(action => (
                        <div key={action.id} className="flex items-start space-x-3 p-3 bg-white rounded border">
                          <Target className="h-4 w-4 text-purple-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-purple-900">{action.title}</p>
                            <p className="text-sm text-purple-700">{action.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-purple-600">
                              <span>Confiance: {Math.round(action.confidence * 100)}%</span>
                              <span>Impact: {action.estimatedImpact}</span>
                              <span className={`px-2 py-1 rounded-full ${getPriorityColor(action.priority)}`}>
                                {action.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags et métadonnées */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tags et Métadonnées</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Hashtags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.enrichment.hashtags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Mots-clés</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.enrichment.keywords.map(keyword => (
                          <span key={keyword} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Sujets</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.enrichment.topics.map(topic => (
                          <span key={topic} className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Marquer comme traité
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
