// Types pour le système d'événements ultra-innovant avec IA

export interface SmartEvent {
  id: string;
  
  // Métadonnées de base
  title: string;
  description?: string;
  content?: string;
  
  // Temporalité avancée
  timestamps: {
    createdAt: string;
    scheduledAt?: string; // Date prévue de l'événement
    executedAt?: string; // Date réelle d'exécution
    completedAt?: string;
    lastModified: string;
  };
  
  // Participants intelligents
  participants: {
    creator: EventParticipant;
    recipients: EventParticipant[];
    mentions: EventParticipant[]; // @mentions dans le contenu
    watchers: EventParticipant[]; // Observateurs
    assignees?: EventParticipant[]; // Responsables
  };
  
  // Classification automatique
  classification: {
    type: EventType;
    subType?: string;
    category: EventCategory;
    priority: EventPriority;
    urgency: EventUrgency;
    sentiment: EventSentiment; // Analyse sentiment IA
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
  };
  
  // Canaux de communication
  channels: {
    primary: CommunicationChannel;
    secondary?: CommunicationChannel[];
    deliveryStatus: Record<string, DeliveryStatus>;
  };
  
  // Contenu enrichi
  enrichment: {
    hashtags: string[];
    keywords: string[];
    entities: ExtractedEntity[]; // Entités extraites par IA
    topics: string[];
    language: string;
    readingTime?: number; // Temps de lecture estimé
  };
  
  // Géolocalisation
  location?: {
    coordinates?: { lat: number; lng: number };
    address?: string;
    timezone: string;
    detectedLocation?: string; // Lieu détecté dans le contenu
  };
  
  // Relations intelligentes
  relationships: {
    parentEvent?: string;
    childEvents: string[];
    relatedEvents: string[];
    triggeredBy?: string; // Événement déclencheur
    triggers: string[]; // Événements déclenchés
    duplicates: string[]; // Événements similaires détectés
  };
  
  // Suivi et métriques
  tracking: {
    views: number;
    interactions: number;
    responses: EventResponse[];
    engagement: EngagementMetrics;
    conversionEvents: string[]; // Événements de conversion liés
  };
  
  // IA et prédictions
  aiInsights: {
    predictedOutcome?: string;
    recommendedActions: AIRecommendation[];
    similarEvents: string[];
    riskScore: number; // 0-100
    opportunityScore: number; // 0-100
    nextBestAction?: string;
  };
  
  // Workflow et automatisation
  workflow: {
    status: WorkflowStatus;
    stage: string;
    nextSteps: WorkflowStep[];
    automationRules: AutomationRule[];
    approvals?: ApprovalRequest[];
  };
  
  // Attachements et médias
  attachments: EventAttachment[];
  
  // Métadonnées système
  system: {
    source: EventSource;
    version: number;
    isArchived: boolean;
    isDeleted: boolean;
    permissions: EventPermissions;
    auditTrail: AuditEntry[];
  };
}

export interface EventParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'creator' | 'recipient' | 'mention' | 'watcher' | 'assignee';
  type: 'internal' | 'external' | 'system';
  avatar?: string;
  lastSeen?: string;
  responseStatus?: 'pending' | 'read' | 'responded' | 'ignored';
}

export type EventType = 
  | 'communication' 
  | 'meeting' 
  | 'task' 
  | 'reminder' 
  | 'milestone' 
  | 'transaction' 
  | 'system' 
  | 'social' 
  | 'marketing'
  | 'support'
  | 'sales'
  | 'legal'
  | 'financial';

export type EventCategory = 
  | 'email' 
  | 'sms' 
  | 'whatsapp' 
  | 'call' 
  | 'meeting' 
  | 'note' 
  | 'document' 
  | 'crisp' 
  | 'social_media'
  | 'video_call'
  | 'in_person'
  | 'system_notification'
  | 'webhook'
  | 'api_call';

export type EventPriority = 'low' | 'normal' | 'high' | 'urgent' | 'critical';
export type EventUrgency = 'can_wait' | 'this_week' | 'today' | 'asap' | 'immediate';
export type EventSentiment = 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';

export interface CommunicationChannel {
  type: EventCategory;
  identifier: string; // email, phone, etc.
  platform?: string; // WhatsApp, Telegram, etc.
  metadata?: Record<string, any>;
}

export interface DeliveryStatus {
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'bounced';
  timestamp: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface ExtractedEntity {
  type: 'person' | 'company' | 'location' | 'date' | 'amount' | 'product' | 'contract' | 'vehicle';
  value: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
  linkedId?: string; // ID de l'entité dans le système
}

export interface EventResponse {
  id: string;
  participantId: string;
  type: 'reply' | 'reaction' | 'action' | 'forward' | 'archive';
  content?: string;
  timestamp: string;
  sentiment?: EventSentiment;
  metadata?: Record<string, any>;
}

export interface EngagementMetrics {
  openRate?: number;
  clickRate?: number;
  responseRate?: number;
  forwardRate?: number;
  timeToResponse?: number; // en minutes
  engagementScore: number; // 0-100
}

export interface AIRecommendation {
  id: string;
  type: 'action' | 'follow_up' | 'escalation' | 'automation' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  priority: EventPriority;
  estimatedImpact: string;
  suggestedDate?: string;
  requiredResources?: string[];
}

export type WorkflowStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'in_progress' 
  | 'waiting_response' 
  | 'completed' 
  | 'cancelled' 
  | 'failed';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'automatic' | 'approval' | 'notification';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';
  assignee?: string;
  dueDate?: string;
  dependencies: string[];
  estimatedDuration?: number; // en minutes
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isActive: boolean;
  executionCount: number;
  lastExecuted?: string;
}

export interface AutomationTrigger {
  type: 'time_based' | 'event_based' | 'condition_based' | 'manual';
  configuration: Record<string, any>;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface AutomationAction {
  type: 'send_notification' | 'create_task' | 'update_field' | 'call_webhook' | 'send_email';
  configuration: Record<string, any>;
  delay?: number; // délai en minutes
}

export interface ApprovalRequest {
  id: string;
  requesterId: string;
  approverId: string;
  type: 'content' | 'scheduling' | 'budget' | 'escalation';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedAt: string;
  respondedAt?: string;
  comments?: string;
}

export interface EventAttachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'link' | 'contact';
  url: string;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
  extractedText?: string; // Texte extrait par OCR
  metadata?: Record<string, any>;
}

export type EventSource = 
  | 'manual' 
  | 'email_sync' 
  | 'sms_gateway' 
  | 'whatsapp_api' 
  | 'crisp_webhook' 
  | 'calendar_sync' 
  | 'system_generated'
  | 'ai_generated'
  | 'imported';

export interface EventPermissions {
  visibility: 'public' | 'internal' | 'private' | 'restricted';
  canView: string[];
  canEdit: string[];
  canDelete: string[];
  canShare: string[];
}

export interface AuditEntry {
  id: string;
  action: 'created' | 'updated' | 'deleted' | 'viewed' | 'shared' | 'exported';
  userId: string;
  timestamp: string;
  changes?: Record<string, { from: any; to: any }>;
  metadata?: Record<string, any>;
}

// Filtres et recherche avancés
export interface SmartEventFilter {
  id: string;
  name: string;
  description?: string;
  
  // Filtres temporels intelligents
  timeFilter: {
    type: 'absolute' | 'relative' | 'smart';
    range?: { start: string; end: string };
    relative?: {
      unit: 'hours' | 'days' | 'weeks' | 'months' | 'years';
      value: number;
      direction: 'past' | 'future' | 'around';
    };
    smart?: {
      preset: 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'this_year' | 'last_year';
      businessHours?: boolean;
      excludeWeekends?: boolean;
    };
  };
  
  // Filtres participants
  participantFilter: {
    creators?: string[];
    recipients?: string[];
    mentions?: string[];
    participantTypes?: ('internal' | 'external' | 'system')[];
    responseStatus?: ('pending' | 'read' | 'responded' | 'ignored')[];
  };
  
  // Filtres classification
  classificationFilter: {
    types?: EventType[];
    categories?: EventCategory[];
    priorities?: EventPriority[];
    urgencies?: EventUrgency[];
    sentiments?: EventSentiment[];
    businessImpacts?: ('low' | 'medium' | 'high' | 'critical')[];
  };
  
  // Filtres contenu
  contentFilter: {
    keywords?: string[];
    hashtags?: string[];
    entities?: { type: string; values: string[] }[];
    topics?: string[];
    languages?: string[];
    hasAttachments?: boolean;
    attachmentTypes?: string[];
  };
  
  // Filtres métriques
  metricsFilter: {
    minViews?: number;
    maxViews?: number;
    minEngagement?: number;
    maxEngagement?: number;
    hasResponses?: boolean;
    responseTimeRange?: { min: number; max: number }; // en minutes
  };
  
  // Filtres IA
  aiFilter: {
    minRiskScore?: number;
    maxRiskScore?: number;
    minOpportunityScore?: number;
    maxOpportunityScore?: number;
    hasRecommendations?: boolean;
    recommendationTypes?: string[];
  };
  
  // Filtres workflow
  workflowFilter: {
    statuses?: WorkflowStatus[];
    stages?: string[];
    hasApprovals?: boolean;
    approvalStatuses?: ('pending' | 'approved' | 'rejected' | 'expired')[];
    hasAutomation?: boolean;
  };
  
  // Recherche sémantique
  semanticSearch?: {
    query: string;
    similarity: number; // seuil de similarité 0-1
    includeContent: boolean;
    includeMetadata: boolean;
    includeParticipants: boolean;
  };
  
  // Tri intelligent
  sorting: {
    primary: SortOption;
    secondary?: SortOption;
    tertiary?: SortOption;
  };
  
  // Métadonnées filtre
  isDefault: boolean;
  isShared: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
  lastUsed?: string;
}

export interface SortOption {
  field: 'createdAt' | 'scheduledAt' | 'executedAt' | 'priority' | 'urgency' | 'engagement' | 'riskScore' | 'opportunityScore' | 'responseTime' | 'views' | 'interactions';
  direction: 'asc' | 'desc';
  weight?: number; // pour tri composite
}

// Analytics et insights
export interface EventAnalytics {
  period: { start: string; end: string };
  
  // Métriques globales
  overview: {
    totalEvents: number;
    activeEvents: number;
    completedEvents: number;
    averageResponseTime: number;
    engagementRate: number;
    conversionRate: number;
  };
  
  // Tendances temporelles
  trends: {
    eventVolume: TimeSeriesData[];
    engagementTrend: TimeSeriesData[];
    responseTimeTrend: TimeSeriesData[];
    sentimentTrend: TimeSeriesData[];
  };
  
  // Répartitions
  distributions: {
    byType: Record<EventType, number>;
    byCategory: Record<EventCategory, number>;
    byPriority: Record<EventPriority, number>;
    bySentiment: Record<EventSentiment, number>;
    byParticipant: Record<string, number>;
    byChannel: Record<string, number>;
  };
  
  // Top performers
  topPerformers: {
    mostEngaging: SmartEvent[];
    fastestResponse: SmartEvent[];
    highestConversion: SmartEvent[];
    mostViewed: SmartEvent[];
  };
  
  // Insights IA
  aiInsights: {
    patterns: PatternInsight[];
    anomalies: AnomalyInsight[];
    predictions: PredictionInsight[];
    recommendations: OptimizationRecommendation[];
  };
  
  // Comparaisons
  comparisons: {
    previousPeriod: ComparisonMetrics;
    benchmark: ComparisonMetrics;
    goals: GoalProgress[];
  };
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface PatternInsight {
  id: string;
  type: 'temporal' | 'behavioral' | 'content' | 'channel';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  evidence: string[];
  actionable: boolean;
}

export interface AnomalyInsight {
  id: string;
  type: 'volume' | 'engagement' | 'response_time' | 'sentiment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  affectedEvents: string[];
  possibleCauses: string[];
  recommendedActions: string[];
}

export interface PredictionInsight {
  id: string;
  type: 'volume' | 'engagement' | 'conversion' | 'churn';
  horizon: 'short' | 'medium' | 'long'; // 1 semaine, 1 mois, 3 mois
  prediction: any;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export interface OptimizationRecommendation {
  id: string;
  category: 'timing' | 'content' | 'channel' | 'targeting' | 'workflow';
  title: string;
  description: string;
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  priority: number;
  implementation: string[];
}

export interface ComparisonMetrics {
  totalEvents: { current: number; previous: number; change: number };
  engagementRate: { current: number; previous: number; change: number };
  responseTime: { current: number; previous: number; change: number };
  conversionRate: { current: number; previous: number; change: number };
}

export interface GoalProgress {
  id: string;
  name: string;
  target: number;
  current: number;
  progress: number; // 0-100%
  status: 'on_track' | 'at_risk' | 'behind' | 'exceeded';
  deadline?: string;
}
