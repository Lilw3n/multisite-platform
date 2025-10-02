// Types pour le système intelligent de dérogations sinistres

export interface DerogationRequest {
  id: string;
  interlocutorId: string;
  
  // Contexte de la demande
  context: {
    originalRequirement: InsuranceRequirement;
    currentSituation: ClientSituation;
    gap: RequirementGap;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    businessValue: number; // CA potentiel
  };
  
  // Analyse IA de la situation
  aiAnalysis: {
    humanFactors: HumanFactor[];
    legitimacyScore: number; // 0-100% légitimité de la demande
    riskAssessment: RiskAssessment;
    similarCases: SimilarCase[];
    recommendedApproach: DerogationStrategy;
  };
  
  // Propositions automatiques
  proposedDerogations: DerogationProposal[];
  
  // Suivi et statut
  status: DerogationStatus;
  insurerResponses: InsurerResponse[];
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface InsuranceRequirement {
  type: 'claims_history' | 'insurance_period' | 'vehicle_age' | 'driver_experience' | 'no_claims_bonus';
  description: string;
  standardValue: any;
  flexibility: InsurerFlexibility[];
  businessRules: string[];
}

export interface ClientSituation {
  // Situation actuelle
  actualValue: any;
  timeline: SituationTimeline[];
  
  // Contexte humain
  circumstances: Circumstance[];
  mitigatingFactors: MitigatingFactor[];
  
  // Historique
  previousInsurance: InsuranceHistory[];
  claimsHistory: DetailedClaim[];
  
  // Situation personnelle/professionnelle
  personalContext: PersonalContext;
}

export interface RequirementGap {
  shortfall: any;
  percentage: number;
  severity: 'minor' | 'moderate' | 'significant' | 'major';
  timeToCompliance: string; // "Dans 2 mois", "Jamais possible", etc.
  alternativeSolutions: string[];
}

export interface HumanFactor {
  type: 'life_event' | 'external_circumstances' | 'good_faith' | 'financial_hardship' | 'health_issue' | 'force_majeure';
  description: string;
  impact: 'low' | 'medium' | 'high';
  legitimacy: number; // 0-100%
  documentation: string[];
  verifiable: boolean;
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'very_high';
  riskFactors: RiskFactor[];
  mitigatingElements: MitigatingElement[];
  recommendedPremiumAdjustment: number; // % d'augmentation suggérée
  additionalConditions: string[];
}

export interface RiskFactor {
  factor: string;
  weight: number;
  description: string;
  quantified: boolean;
  value?: number;
}

export interface MitigatingElement {
  element: string;
  weight: number;
  description: string;
  reduces: string[]; // Quels risques cela réduit
}

export interface SimilarCase {
  id: string;
  situation: string;
  outcome: 'approved' | 'rejected' | 'conditional';
  insurer: string;
  conditions?: string[];
  similarity: number; // 0-100%
  lessons: string[];
}

export interface DerogationStrategy {
  approach: 'direct_request' | 'conditional_acceptance' | 'premium_adjustment' | 'staged_compliance' | 'alternative_coverage';
  reasoning: string;
  successProbability: number;
  timeline: string;
  requiredDocuments: string[];
  keyArguments: string[];
}

export interface DerogationProposal {
  id: string;
  insurer: InsurerProfile;
  
  // Proposition
  type: 'full_waiver' | 'conditional_acceptance' | 'premium_increase' | 'coverage_modification' | 'staged_compliance';
  description: string;
  conditions: DerogationCondition[];
  
  // Justification IA
  justification: {
    keyArguments: string[];
    humanFactors: string[];
    businessCase: string;
    riskMitigation: string[];
    precedents: string[];
  };
  
  // Prédictions
  successProbability: number;
  expectedTimeline: string;
  alternativeOptions: string[];
  
  // Suivi
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'conditional';
  submittedAt?: string;
  responseExpected?: string;
}

export interface DerogationCondition {
  type: 'premium_increase' | 'higher_deductible' | 'coverage_limitation' | 'monitoring_period' | 'additional_documentation';
  description: string;
  value?: any;
  duration?: string;
  mandatory: boolean;
}

export interface InsurerProfile {
  id: string;
  name: string;
  
  // Flexibilité par type de dérogation
  flexibility: {
    claimsHistory: FlexibilityLevel;
    insurancePeriod: FlexibilityLevel;
    vehicleAge: FlexibilityLevel;
    driverExperience: FlexibilityLevel;
    noClaimsBonus: FlexibilityLevel;
  };
  
  // Historique des dérogations
  derogationHistory: {
    totalRequests: number;
    approvalRate: number;
    averageResponseTime: number;
    commonConditions: string[];
    preferredApproaches: string[];
  };
  
  // Critères de décision
  decisionCriteria: {
    businessValueThreshold: number;
    riskTolerance: 'low' | 'medium' | 'high';
    humanFactorWeight: number;
    documentationRequirements: string[];
  };
  
  // Contact et processus
  contactInfo: {
    derogationContact: string;
    preferredChannel: 'email' | 'phone' | 'portal';
    responseTime: string;
    escalationPath: string[];
  };
}

export interface FlexibilityLevel {
  level: 'none' | 'limited' | 'moderate' | 'high' | 'very_high';
  conditions: string[];
  maxDeviation: any;
  typicalRequirements: string[];
  successFactors: string[];
}

export interface InsurerResponse {
  insurerId: string;
  proposalId: string;
  
  response: 'approved' | 'rejected' | 'conditional' | 'counter_proposal';
  decision: string;
  conditions?: DerogationCondition[];
  
  reasoning: string;
  contactPerson: string;
  responseDate: string;
  validUntil?: string;
  
  nextSteps: string[];
  appealPossible: boolean;
}

export type DerogationStatus = 
  | 'draft'
  | 'analyzing'
  | 'proposals_generated'
  | 'submitted_to_insurers'
  | 'under_review'
  | 'partially_approved'
  | 'fully_approved'
  | 'rejected'
  | 'expired'
  | 'withdrawn';

export interface Circumstance {
  type: 'vehicle_sale' | 'accident_non_responsible' | 'job_loss' | 'relocation' | 'health_issue' | 'family_emergency' | 'natural_disaster' | 'insurer_bankruptcy';
  description: string;
  date: string;
  impact: string;
  documentation: string[];
  verified: boolean;
}

export interface MitigatingFactor {
  factor: string;
  description: string;
  strength: 'weak' | 'moderate' | 'strong' | 'very_strong';
  relevance: number; // 0-100%
  supportingEvidence: string[];
}

export interface SituationTimeline {
  date: string;
  event: string;
  impact: string;
  category: 'positive' | 'negative' | 'neutral';
}

export interface InsuranceHistory {
  insurer: string;
  period: { start: string; end: string };
  reason_for_end: string;
  claims: number;
  premium: number;
  coverage: string;
}

export interface DetailedClaim {
  id: string;
  date: string;
  type: string;
  responsibility: 'responsible' | 'non_responsible' | 'partial' | 'disputed';
  amount: number;
  circumstances: string;
  resolution: string;
  impact_on_premium: number;
  lessons_learned: string[];
}

export interface PersonalContext {
  profession: string;
  income_stability: 'stable' | 'variable' | 'unstable';
  family_situation: string;
  health_status: 'good' | 'fair' | 'poor';
  financial_situation: 'comfortable' | 'tight' | 'difficult';
  reliability_indicators: string[];
}

// Scénarios prédéfinis pour l'IA
export interface DerogationScenario {
  id: string;
  name: string;
  description: string;
  
  // Conditions de déclenchement
  triggers: ScenarioTrigger[];
  
  // Stratégies recommandées
  strategies: DerogationStrategy[];
  
  // Arguments types
  commonArguments: string[];
  
  // Taux de succès historique
  successRate: number;
  
  // Exemples réels
  examples: ScenarioExample[];
}

export interface ScenarioTrigger {
  condition: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
  value: any;
  weight: number;
}

export interface ScenarioExample {
  situation: string;
  approach: string;
  outcome: string;
  lessons: string[];
  insurer: string;
  timeline: string;
}

// Analytics et reporting
export interface DerogationAnalytics {
  period: { start: string; end: string };
  
  overview: {
    totalRequests: number;
    approvalRate: number;
    averageResponseTime: number;
    businessValueSaved: number;
  };
  
  byScenario: Record<string, {
    requests: number;
    successRate: number;
    averageTimeline: string;
  }>;
  
  byInsurer: Record<string, {
    requests: number;
    approvalRate: number;
    averageResponseTime: number;
    preferredConditions: string[];
  }>;
  
  trends: {
    approvalRateTrend: number;
    complexityTrend: number;
    responseTimeTrend: number;
  };
  
  insights: {
    mostSuccessfulArguments: string[];
    commonRejectionReasons: string[];
    emergingPatterns: string[];
    recommendations: string[];
  };
}
