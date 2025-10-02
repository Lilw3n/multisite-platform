export interface LeadAnalysisSession {
  id: string;
  interlocutorId?: string;
  sessionData: LeadSessionData;
  currentStep: number;
  totalSteps: number;
  progress: number; // 0-100
  insuranceType?: InsuranceType;
  feasibilityAnalysis: FeasibilityAnalysis;
  leadQualification: LeadQualification;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'in_progress' | 'analyzed' | 'qualified' | 'converted' | 'rejected';
}

export interface LeadSessionData {
  // Données client (recensement besoins)
  clientProfile: ClientProfile;
  
  // Besoins exprimés
  needs: ClientNeeds;
  
  // Contraintes et préférences
  constraints: ClientConstraints;
  
  // Historique et contexte
  context: ClientContext;
}

export interface ClientProfile {
  // Informations personnelles
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    age?: number;
    gender?: 'M' | 'F' | 'other';
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'pacs';
    profession?: string;
    income?: number;
    employmentStatus?: 'employee' | 'self_employed' | 'unemployed' | 'retired' | 'student';
  };
  
  // Situation géographique
  location: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    riskZone?: 'low' | 'medium' | 'high';
    ownershipStatus?: 'owner' | 'tenant' | 'family' | 'other';
  };
  
  // Situation familiale
  family?: {
    spouse?: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      profession?: string;
      income?: number;
    };
    children?: Array<{
      firstName: string;
      dateOfBirth: string;
      age: number;
      schoolLevel?: string;
    }>;
    dependents?: Array<{
      relationship: string;
      firstName: string;
      dateOfBirth: string;
      age: number;
    }>;
  };
  
  // Situation professionnelle (si applicable)
  professional?: {
    company: string;
    siret?: string;
    activity: string;
    legalForm: string;
    employees?: number;
    turnover?: number;
    creationDate?: string;
    riskLevel?: 'low' | 'medium' | 'high' | 'very_high';
  };
}

export interface ClientNeeds {
  // Type d'assurance principal
  primaryInsurance: InsuranceType;
  
  // Besoins spécifiques par type
  specificNeeds: {
    auto?: AutoNeeds;
    home?: HomeNeeds;
    health?: HealthNeeds;
    life?: LifeNeeds;
    professional?: ProfessionalNeeds;
  };
  
  // Niveau de couverture souhaité
  coverageLevel: 'basic' | 'standard' | 'premium' | 'custom';
  
  // Garanties prioritaires
  priorityGuarantees: string[];
  
  // Garanties optionnelles souhaitées
  optionalGuarantees: string[];
}

export interface AutoNeeds {
  vehicles: Array<{
    brand: string;
    model: string;
    year: number;
    value: number;
    usage: 'personal' | 'professional' | 'vtc' | 'taxi' | 'delivery';
    annualMileage: number;
    parkingType: 'garage' | 'covered' | 'street';
    financingType: 'owned' | 'leased' | 'credit';
  }>;
  
  drivers: Array<{
    licenseDate: string;
    experience: number;
    accidents: number;
    violations: number;
  }>;
  
  desiredGuarantees: string[];
}

export interface HomeNeeds {
  property: {
    type: 'apartment' | 'house' | 'studio' | 'loft' | 'other';
    surface: number;
    rooms: number;
    constructionYear: number;
    value: number;
    contentValue: number;
  };
  
  desiredGuarantees: string[];
  securityLevel: 'basic' | 'standard' | 'high' | 'premium';
}

export interface HealthNeeds {
  coverage: {
    type: 'individual' | 'family' | 'group';
    level: 'basic' | 'comfort' | 'premium';
    includeDental: boolean;
    includeOptics: boolean;
    includeAlternative: boolean;
  };
  
  specificNeeds: string[];
}

export interface LifeNeeds {
  objective: 'savings' | 'protection' | 'inheritance' | 'retirement' | 'mixed';
  amount: number;
  duration?: number;
  riskProfile: 'conservative' | 'moderate' | 'dynamic' | 'aggressive';
  
  beneficiaries: Array<{
    name: string;
    relationship: string;
    percentage: number;
  }>;
}

export interface ProfessionalNeeds {
  activity: {
    sector: string;
    specificActivity: string;
    riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  };
  
  desiredCoverage: string[];
  premises?: {
    surface: number;
    type: string;
    value: number;
    equipmentValue: number;
  };
}

export interface ClientConstraints {
  // Budget
  budget: {
    min: number;
    max: number;
    preferred: number;
    flexibility: 'strict' | 'moderate' | 'flexible';
  };
  
  // Timing
  timeline: {
    urgency: 'immediate' | 'within_week' | 'within_month' | 'flexible';
    startDate?: string;
    currentInsuranceExpiry?: string;
  };
  
  // Préférences
  preferences: {
    deductible: 'low' | 'medium' | 'high' | 'flexible';
    paymentFrequency: 'monthly' | 'quarterly' | 'annual' | 'flexible';
    digitalServices: boolean;
    personalAgent: boolean;
    communicationChannel: 'phone' | 'email' | 'sms' | 'whatsapp' | 'any';
  };
  
  // Exclusions
  exclusions: string[];
  
  // Contraintes spéciales
  specialConstraints: string[];
}

export interface ClientContext {
  // Source du lead
  leadSource: 'website' | 'social' | 'referral' | 'advertising' | 'cold_call' | 'other';
  
  // Historique assurance
  insuranceHistory: {
    currentInsurer?: string;
    yearsWithCurrentInsurer?: number;
    reasonForChange?: string;
    previousClaims: Array<{
      date: string;
      type: string;
      amount: number;
      responsibility: number;
    }>;
    bonusMalus?: number;
  };
  
  // Historique de contact
  contactHistory: Array<{
    date: string;
    type: 'call' | 'email' | 'meeting' | 'quote_request' | 'other';
    notes: string;
    outcome: string;
  }>;
  
  // Notes et observations
  notes: string;
  specialSituations: string[];
}

export interface FeasibilityAnalysis {
  // Score global de faisabilité
  overallFeasibility: number; // 0-100
  
  // Analyse par assureur (anonyme)
  insurerAnalysis: Array<{
    insurerId: string; // "ASSUREUR_A", "ASSUREUR_B", etc.
    insurerName: string; // "Partenaire Premium", "Solution Économique", etc.
    feasibilityScore: number; // 0-100
    acceptanceLevel: 'accepted' | 'conditional' | 'rejected' | 'needs_review';
    
    // Conditions respectées
    metConditions: Array<{
      condition: string;
      status: 'met' | 'not_met' | 'partially_met';
      impact: 'positive' | 'negative' | 'neutral';
      explanation: string;
    }>;
    
    // Obstacles identifiés
    obstacles: Array<{
      type: 'budget' | 'profile' | 'history' | 'location' | 'activity' | 'other';
      severity: 'minor' | 'major' | 'blocking';
      description: string;
      possibleSolutions: string[];
    }>;
    
    // Adaptations possibles
    adaptations: Array<{
      type: 'coverage' | 'deductible' | 'payment' | 'exclusion' | 'other';
      description: string;
      impact: string;
      costImpact?: number;
    }>;
    
    // Estimation tarifaire (fourchette)
    priceEstimate?: {
      min: number;
      max: number;
      confidence: number; // 0-100
      factors: string[];
    };
  }>;
  
  // Recommandations globales
  recommendations: Array<{
    type: 'profile_improvement' | 'budget_adjustment' | 'coverage_modification' | 'timing' | 'alternative';
    priority: 'high' | 'medium' | 'low';
    description: string;
    expectedImpact: string;
    actionRequired: string;
  }>;
  
  // Alertes importantes
  alerts: Array<{
    level: 'info' | 'warning' | 'error';
    message: string;
    impact: string;
  }>;
}

export interface LeadQualification {
  // Score de qualification global
  qualificationScore: number; // 0-100
  
  // Catégorie de lead
  leadCategory: 'hot' | 'warm' | 'cold' | 'unqualified';
  
  // Probabilité de conversion
  conversionProbability: number; // 0-100
  
  // Facteurs de qualification
  qualificationFactors: Array<{
    factor: string;
    score: number;
    weight: number;
    reasoning: string;
  }>;
  
  // Revenus potentiels
  revenueEstimate: {
    commission: number;
    confidence: number;
    timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  };
  
  // Actions recommandées
  recommendedActions: Array<{
    action: 'immediate_call' | 'email_follow_up' | 'schedule_meeting' | 'send_documentation' | 'nurture' | 'disqualify';
    priority: number; // 1-5
    timing: string;
    assignTo?: string;
    expectedOutcome: string;
  }>;
  
  // Objections probables
  anticipatedObjections: Array<{
    objection: string;
    probability: number;
    suggestedResponse: string;
  }>;
}

export interface TeamNotification {
  id: string;
  leadId: string;
  type: 'new_qualified_lead' | 'hot_lead' | 'urgent_follow_up' | 'conversion_opportunity';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  title: string;
  message: string;
  data: {
    clientName: string;
    insuranceType: string;
    qualificationScore: number;
    revenueEstimate: number;
    urgency: string;
    nextAction: string;
  };
  createdAt: string;
  readAt?: string;
  actionTakenAt?: string;
}

export interface SubscriptionConditions {
  insurerId: string;
  insurerDisplayName: string;
  conditions: {
    // Conditions d'âge
    age?: {
      min?: number;
      max?: number;
      restrictions?: string[];
    };
    
    // Conditions géographiques
    geography?: {
      acceptedZones: string[];
      excludedZones: string[];
      riskZoneRestrictions?: Record<string, string[]>;
    };
    
    // Conditions de profil
    profile?: {
      acceptedProfessions: string[];
      excludedProfessions: string[];
      incomeRequirements?: {
        min?: number;
        verification: boolean;
      };
    };
    
    // Conditions d'historique
    history?: {
      maxClaims: number;
      maxClaimsAmount: number;
      bonusMalusRequirements?: {
        min?: number;
        max?: number;
      };
      yearsWithoutClaims?: number;
    };
    
    // Conditions budgétaires
    budget?: {
      minPremium: number;
      maxPremium?: number;
      paymentFrequencyRestrictions?: string[];
    };
    
    // Conditions spécifiques par type d'assurance
    specificConditions?: Record<string, any>;
  };
  
  // Mandats et accords
  mandate: {
    hasMandate: boolean;
    mandateType: 'exclusive' | 'non_exclusive' | 'preferred';
    commissionRate: number;
    specialConditions?: string[];
  };
}

export type InsuranceType = 
  | 'auto'
  | 'moto'
  | 'home'
  | 'health'
  | 'life'
  | 'professional'
  | 'travel'
  | 'pet'
  | 'cyber'
  | 'legal';
