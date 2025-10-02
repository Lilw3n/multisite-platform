export interface IntelligentQuoteSession {
  id: string;
  interlocutorId?: string;
  sessionData: QuoteSessionData;
  currentStep: number;
  totalSteps: number;
  progress: number; // 0-100
  insuranceType?: InsuranceType;
  eligibilityScore?: number;
  recommendations: AIRecommendation[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'in_progress' | 'completed' | 'converted';
}

export interface QuoteSessionData {
  // Données interlocuteur (nouvelles ou existantes)
  interlocutor: InterlocutorData;
  
  // Données spécifiques assurance
  insuranceData: InsuranceData;
  
  // Données CRM et historique
  crmData: CRMData;
  
  // Résultats et recommandations
  results: QuoteResults;
}

export interface InterlocutorData {
  // Informations de base
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    gender?: 'M' | 'F' | 'other';
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'pacs';
    profession?: string;
    income?: number;
  };
  
  // Adresse
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    type: 'primary' | 'secondary';
    ownershipStatus?: 'owner' | 'tenant' | 'family' | 'other';
    residenceDuration?: number; // en mois
  };
  
  // Entreprise (si professionnel)
  company?: {
    name: string;
    siret?: string;
    activity: string;
    legalForm: string;
    employees?: number;
    turnover?: number;
    creationDate?: string;
  };
  
  // Famille (si assurance famille/santé)
  family?: {
    spouse?: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      profession?: string;
    };
    children?: Array<{
      firstName: string;
      dateOfBirth: string;
      schoolLevel?: string;
    }>;
    dependents?: Array<{
      relationship: string;
      firstName: string;
      dateOfBirth: string;
    }>;
  };
}

export interface InsuranceData {
  // Type d'assurance principal
  primaryType: InsuranceType;
  
  // Données spécifiques par type
  autoData?: AutoInsuranceData;
  homeData?: HomeInsuranceData;
  healthData?: HealthInsuranceData;
  lifeData?: LifeInsuranceData;
  professionalData?: ProfessionalInsuranceData;
  
  // Antécédents et sinistres
  history: InsuranceHistory;
  
  // Besoins et préférences
  needs: InsuranceNeeds;
}

export interface AutoInsuranceData {
  vehicles: Array<{
    id: string;
    brand: string;
    model: string;
    year: number;
    engineType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
    power: number; // CV
    value: number;
    usage: 'personal' | 'professional' | 'mixed';
    annualMileage: number;
    parkingType: 'garage' | 'covered' | 'street';
    financingType: 'owned' | 'leased' | 'credit';
  }>;
  
  drivers: Array<{
    id: string;
    licenseDate: string;
    licenseType: string;
    experience: number; // années
    accidents: number;
    violations: number;
    suspensions: number;
  }>;
  
  currentInsurance?: {
    insurer: string;
    expiryDate: string;
    premium: number;
    bonusMalus: number;
    claims: number;
  };
}

export interface HomeInsuranceData {
  property: {
    type: 'apartment' | 'house' | 'studio' | 'loft' | 'other';
    surface: number; // m²
    rooms: number;
    floor?: number;
    constructionYear: number;
    heatingType: 'electric' | 'gas' | 'oil' | 'wood' | 'solar' | 'other';
    securityLevel: 'basic' | 'standard' | 'high' | 'premium';
    value: number;
    contentValue: number;
  };
  
  location: {
    riskZone: 'low' | 'medium' | 'high';
    floodRisk: boolean;
    earthquakeRisk: boolean;
    crimeRate: 'low' | 'medium' | 'high';
  };
  
  currentInsurance?: {
    insurer: string;
    expiryDate: string;
    premium: number;
    claims: number;
  };
}

export interface HealthInsuranceData {
  coverage: {
    type: 'individual' | 'family' | 'group';
    level: 'basic' | 'comfort' | 'premium';
    includeDental: boolean;
    includeOptics: boolean;
    includeAlternative: boolean;
  };
  
  healthStatus: {
    chronicDiseases: string[];
    medications: string[];
    hospitalizations: number;
    surgeries: string[];
    lifestyle: {
      smoking: boolean;
      alcohol: 'none' | 'moderate' | 'regular';
      sport: 'none' | 'occasional' | 'regular' | 'intensive';
    };
  };
  
  currentInsurance?: {
    insurer: string;
    expiryDate: string;
    premium: number;
    reimbursementRate: number;
  };
}

export interface LifeInsuranceData {
  objective: 'savings' | 'protection' | 'inheritance' | 'retirement' | 'mixed';
  amount: number;
  duration?: number; // années
  paymentFrequency: 'monthly' | 'quarterly' | 'annual' | 'single';
  
  beneficiaries: Array<{
    name: string;
    relationship: string;
    percentage: number;
  }>;
  
  riskProfile: 'conservative' | 'moderate' | 'dynamic' | 'aggressive';
  
  currentContracts?: Array<{
    insurer: string;
    amount: number;
    type: string;
  }>;
}

export interface ProfessionalInsuranceData {
  activity: {
    sector: string;
    specificActivity: string;
    riskLevel: 'low' | 'medium' | 'high' | 'very_high';
    turnover: number;
    employees: number;
  };
  
  coverage: {
    civilLiability: boolean;
    professionalLiability: boolean;
    legalProtection: boolean;
    cyberRisk: boolean;
    businessInterruption: boolean;
    equipment: boolean;
  };
  
  premises?: {
    surface: number;
    type: 'office' | 'workshop' | 'warehouse' | 'shop' | 'other';
    value: number;
    equipmentValue: number;
  };
}

export interface InsuranceHistory {
  claims: Array<{
    id: string;
    type: InsuranceType;
    date: string;
    amount: number;
    description: string;
    responsibility: number; // 0-100%
    status: 'open' | 'closed' | 'disputed';
  }>;
  
  previousInsurers: Array<{
    name: string;
    startDate: string;
    endDate: string;
    reason: 'expiry' | 'cancellation' | 'non_renewal' | 'other';
    premium: number;
    claims: number;
  }>;
  
  bonusMalus?: number;
  riskScore?: number;
}

export interface InsuranceNeeds {
  budget: {
    min: number;
    max: number;
    preferred: number;
  };
  
  priorities: Array<{
    coverage: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
  }>;
  
  preferences: {
    deductible: 'low' | 'medium' | 'high';
    paymentFrequency: 'monthly' | 'quarterly' | 'annual';
    digitalServices: boolean;
    personalAgent: boolean;
  };
  
  timeline: {
    urgency: 'immediate' | 'within_week' | 'within_month' | 'flexible';
    startDate?: string;
  };
}

export interface CRMData {
  leadSource: string;
  contactHistory: Array<{
    date: string;
    type: 'call' | 'email' | 'meeting' | 'quote' | 'other';
    notes: string;
    outcome: string;
  }>;
  
  preferences: {
    communicationChannel: 'phone' | 'email' | 'sms' | 'whatsapp';
    bestTimeToCall: string;
    language: string;
  };
  
  scoring: {
    interestLevel: number; // 0-100
    buyingProbability: number; // 0-100
    budgetFit: number; // 0-100
    urgency: number; // 0-100
  };
  
  tags: string[];
  notes: string;
}

export interface QuoteResults {
  quotes: Array<{
    id: string;
    insurer: string;
    product: string;
    premium: number;
    coverage: any;
    score: number; // 0-100 (adéquation besoins)
    advantages: string[];
    disadvantages: string[];
  }>;
  
  comparison: {
    cheapest: string;
    bestValue: string;
    mostComplete: string;
    recommended: string;
  };
  
  eligibilityAnalysis: EligibilityAnalysis;
}

export interface EligibilityAnalysis {
  overallScore: number; // 0-100
  
  factors: Array<{
    name: string;
    score: number;
    weight: number;
    impact: 'positive' | 'negative' | 'neutral';
    explanation: string;
  }>;
  
  recommendations: string[];
  warnings: string[];
  
  improvementSuggestions: Array<{
    action: string;
    impact: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}

export interface AIRecommendation {
  id: string;
  type: 'product' | 'insurer' | 'coverage' | 'optimization' | 'cross_sell';
  title: string;
  description: string;
  confidence: number; // 0-100
  potentialSavings?: number;
  potentialRevenue?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  reasoning: {
    factors: string[];
    dataPoints: string[];
    similarCases?: number;
  };
  
  nextSteps: string[];
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

export interface QuestionnaireStep {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  conditions?: StepCondition[];
  validation?: StepValidation;
}

export interface Question {
  id: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'date' | 'range' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: QuestionOption[];
  validation?: QuestionValidation;
  dependencies?: QuestionDependency[];
  aiSuggestions?: boolean;
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  recommended?: boolean;
}

export interface QuestionValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface QuestionDependency {
  questionId: string;
  condition: 'equals' | 'not_equals' | 'greater' | 'less' | 'contains';
  value: any;
  action: 'show' | 'hide' | 'require' | 'suggest';
}

export interface StepCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater' | 'less' | 'contains' | 'exists';
  value: any;
}

export interface StepValidation {
  required: string[];
  custom?: (data: any) => { valid: boolean; message?: string };
}
