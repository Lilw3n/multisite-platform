// Types pour le système d'alertes intelligentes et suivi temporel

export interface EligibilityCondition {
  id: string;
  name: string;
  description: string;
  type: 'age' | 'experience' | 'claims' | 'period' | 'financial' | 'technical' | 'regulatory';
  
  // Critères de validation
  criteria: {
    field: string; // Champ à vérifier (ex: 'driver.age', 'claims.count')
    operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'in' | 'not_in' | 'between';
    value: any; // Valeur de référence
    timeframe?: number; // Période en mois (ex: 36 pour "36 derniers mois")
    unit?: 'days' | 'months' | 'years';
  };
  
  // Gestion temporelle
  temporal: {
    isTimeDependent: boolean;
    checkFrequency: 'daily' | 'weekly' | 'monthly'; // Fréquence de vérification
    anticipationDays: number; // Jours avant échéance pour alerter
  };
  
  // Actions si condition non respectée
  actions: {
    blockQuote: boolean;
    blockContract: boolean;
    requireApproval: boolean;
    createAlert: boolean;
    scheduleReminder: boolean;
  };
  
  // Messages
  messages: {
    failureMessage: string;
    alertMessage: string;
    reminderMessage: string;
    successMessage: string;
  };
  
  // Métadonnées
  insuranceTypes: string[]; // Types d'assurance concernés
  priority: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IntelligentAlert {
  id: string;
  
  // Référence
  interlocutorId: string;
  quoteId?: string;
  contractId?: string;
  
  // Type d'alerte
  type: 'eligibility_pending' | 'condition_expiring' | 'follow_up_required' | 'document_missing' | 'renewal_due';
  category: 'eligibility' | 'commercial' | 'administrative' | 'regulatory';
  
  // Condition liée
  conditionId: string;
  conditionName: string;
  
  // Détails de l'alerte
  title: string;
  description: string;
  currentValue: any; // Valeur actuelle
  requiredValue: any; // Valeur requise
  gap: any; // Écart (ex: "1 mois manquant")
  
  // Temporalité
  triggerDate: string; // Date de déclenchement
  expectedResolutionDate: string; // Date prévue de résolution
  actualResolutionDate?: string; // Date réelle de résolution
  
  // Statut
  status: 'pending' | 'in_progress' | 'resolved' | 'expired' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Actions programmées
  scheduledActions: Array<{
    id: string;
    type: 'reminder' | 'recheck' | 'escalation' | 'auto_resolve';
    scheduledDate: string;
    executed: boolean;
    executedDate?: string;
    result?: string;
  }>;
  
  // Suivi
  attempts: number;
  lastContactDate?: string;
  nextContactDate?: string;
  assignedTo?: string;
  
  // Résolution
  resolution?: {
    method: 'automatic' | 'manual' | 'condition_met' | 'override';
    resolvedBy?: string;
    resolvedAt: string;
    notes?: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface ClaimAging {
  claimId: string;
  interlocutorId: string;
  
  // Détails du sinistre
  claimDate: string;
  claimType: string;
  amount: number;
  description: string;
  
  // Vieillissement
  ageInMonths: number;
  ageInDays: number;
  isActive: boolean; // Actif dans les critères (< 36 mois par défaut)
  
  // Dates importantes
  expirationDate: string; // Date où le sinistre sort des critères
  daysUntilExpiration: number;
  
  // Impact sur éligibilité
  impactsEligibility: boolean;
  eligibilityWeight: number; // Poids dans le calcul d'éligibilité
  
  // Prédictions
  willExpireSoon: boolean; // Expire dans les 30 prochains jours
  willImproveEligibility: boolean; // Améliore l'éligibilité en expirant
  
  lastUpdated: string;
}

export interface EligibilityTracking {
  id: string;
  interlocutorId: string;
  
  // Snapshot actuel
  currentEligibility: {
    isEligible: boolean;
    score: number; // 0-100
    blockers: string[]; // Conditions bloquantes
    warnings: string[]; // Conditions limites
    
    // Détail par condition
    conditions: Array<{
      conditionId: string;
      name: string;
      status: 'passed' | 'failed' | 'warning';
      currentValue: any;
      requiredValue: any;
      gap?: any;
    }>;
  };
  
  // Évolution prédictive
  futureEligibility: Array<{
    date: string;
    predictedScore: number;
    predictedStatus: boolean;
    changesExpected: Array<{
      conditionId: string;
      changeType: 'improvement' | 'degradation';
      reason: string;
    }>;
  }>;
  
  // Historique
  eligibilityHistory: Array<{
    date: string;
    score: number;
    isEligible: boolean;
    trigger: string; // Ce qui a causé le changement
  }>;
  
  // Recommandations
  recommendations: Array<{
    type: 'wait' | 'action_required' | 'contact_client' | 'override_request';
    priority: 'low' | 'medium' | 'high';
    description: string;
    expectedImpact: string;
    deadline?: string;
  }>;
  
  lastCalculated: string;
  nextCalculation: string;
}

export interface SmartReminder {
  id: string;
  
  // Référence
  alertId: string;
  interlocutorId: string;
  
  // Type de relance
  type: 'eligibility_check' | 'document_request' | 'follow_up_call' | 'quote_renewal' | 'condition_recheck';
  method: 'email' | 'sms' | 'call' | 'notification' | 'task';
  
  // Contenu
  title: string;
  message: string;
  template?: string;
  
  // Programmation
  scheduledDate: string;
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  maxAttempts: number;
  currentAttempts: number;
  
  // Conditions d'arrêt
  stopConditions: Array<{
    type: 'condition_met' | 'max_attempts' | 'manual_stop' | 'date_passed';
    value?: any;
  }>;
  
  // Statut
  status: 'scheduled' | 'sent' | 'delivered' | 'failed' | 'stopped' | 'completed';
  
  // Résultats
  results: Array<{
    attemptDate: string;
    status: 'success' | 'failed' | 'bounced' | 'opened' | 'clicked';
    response?: string;
    notes?: string;
  }>;
  
  createdAt: string;
  updatedAt: string;
}

export interface AlertConfiguration {
  id: string;
  
  // Configuration générale
  enabled: boolean;
  checkFrequency: 'hourly' | 'daily' | 'weekly';
  
  // Conditions par type d'assurance
  insuranceTypeConfigs: Record<string, {
    claimsLookbackMonths: number; // 36 pour auto, 60 pour habitation, etc.
    maxClaimsAllowed: number;
    minExperienceMonths: number;
    minAge: number;
    maxAge: number;
  }>;
  
  // Alertes automatiques
  autoAlerts: {
    eligibilityChanges: boolean;
    conditionExpiring: boolean;
    documentExpiring: boolean;
    renewalDue: boolean;
  };
  
  // Relances automatiques
  autoReminders: {
    enabled: boolean;
    maxAttempts: number;
    intervalDays: number;
    escalationDays: number;
  };
  
  // Notifications
  notifications: {
    email: boolean;
    sms: boolean;
    dashboard: boolean;
    webhook?: string;
  };
  
  lastUpdated: string;
}

export interface EligibilityCalculationResult {
  interlocutorId: string;
  calculationDate: string;
  
  // Résultat global
  isEligible: boolean;
  eligibilityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  
  // Détail par condition
  conditionResults: Array<{
    conditionId: string;
    name: string;
    passed: boolean;
    currentValue: any;
    requiredValue: any;
    weight: number;
    impact: number; // Impact sur le score global
  }>;
  
  // Sinistres analysés
  claimsAnalysis: {
    totalClaims: number;
    activeClaims: number; // Dans la période de référence
    expiredClaims: number;
    nextExpirationDate?: string;
    impactOnEligibility: 'positive' | 'negative' | 'neutral';
  };
  
  // Prédictions
  predictions: {
    willBecomeEligible: boolean;
    estimatedEligibilityDate?: string;
    confidenceLevel: number; // 0-100%
    keyFactors: string[];
  };
  
  // Recommandations d'action
  actionRecommendations: Array<{
    type: 'wait' | 'contact' | 'request_documents' | 'schedule_review';
    priority: 'low' | 'medium' | 'high';
    description: string;
    estimatedImpact: string;
    deadline?: string;
  }>;
}
