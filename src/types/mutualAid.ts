export interface MutualAidRequest {
  id: string;
  userId: string;
  userProfile: {
    name: string;
    avatar: string;
    age?: number;
    location: string;
    verificationLevel: 'none' | 'basic' | 'verified' | 'premium';
    mutualScore: number; // Score de solidarité basé sur l'historique
    helpGiven: number; // Nombre d'aides données
    helpReceived: number; // Nombre d'aides reçues
    anonymousMode: boolean; // Mode anonyme pour éviter discrimination
  };

  // Type d'aide demandée
  category: 'emergency' | 'food' | 'housing' | 'transport' | 'medical' | 'education' | 'employment' | 'family' | 'mental_health' | 'other';
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Détails de la demande
  title: string;
  description: string;
  targetAmount: number;
  currency: 'EUR' | 'USD' | 'GBP';
  currentAmount: number;
  goalReached: boolean;
  
  // Modalités
  isMonetary: boolean; // Aide financière ou en nature
  acceptsPartialHelp: boolean;
  acceptsServices: boolean; // Accepte aide sous forme de services
  acceptsGoods: boolean; // Accepte aide sous forme de biens
  
  // Géolocalisation pour aide locale
  needsLocalHelp: boolean;
  location?: {
    city: string;
    region: string;
    country: string;
    coordinates?: { lat: number; lng: number };
    radius?: number; // Rayon d'aide en km
  };
  
  // Transparence et vérification
  proofRequired: boolean;
  proofDocuments: string[];
  verifiedByModerator: boolean;
  moderatorNotes?: string;
  
  // Statut et timing
  status: 'active' | 'funded' | 'expired' | 'cancelled' | 'completed';
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  // Engagement communautaire
  supporters: string[]; // IDs des supporters
  totalSupporters: number;
  averageContribution: number;
  shares: number;
  views: number;
  
  // Tags et recherche
  tags: string[];
  language: string;
}

export interface MutualAidContribution {
  id: string;
  requestId: string;
  contributorId: string;
  contributorProfile: {
    name: string;
    avatar: string;
    isAnonymous: boolean;
    mutualScore: number;
  };
  
  // Type de contribution
  type: 'money' | 'service' | 'goods' | 'time' | 'skill' | 'emotional_support';
  
  // Détails monétaires
  amount?: number;
  currency?: 'EUR' | 'USD' | 'GBP';
  
  // Détails non-monétaires
  serviceOffered?: string;
  goodsOffered?: string;
  timeOffered?: number; // en heures
  skillOffered?: string;
  
  // Message et engagement
  message?: string;
  isPublic: boolean;
  allowsContact: boolean;
  
  // Statut
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  createdAt: string;
  completedAt?: string;
  
  // Feedback
  rating?: number;
  feedback?: string;
}

export interface SolidarityGift {
  id: string;
  name: string;
  emoji: string;
  description: string;
  value: number; // Valeur en points de solidarité
  category: 'basic' | 'premium' | 'special' | 'emergency';
  
  // Effets visuels (comme TikTok)
  animation: string;
  sound?: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  
  // Impact solidaire
  realWorldValue: number; // Valeur réelle en euros
  impactDescription: string;
  
  // Disponibilité
  isActive: boolean;
  seasonalAvailability?: {
    startDate: string;
    endDate: string;
  };
}

export interface MutualAidCampaign {
  id: string;
  organizerId: string;
  organizerProfile: {
    name: string;
    avatar: string;
    type: 'individual' | 'association' | 'company' | 'government';
    verificationLevel: 'verified' | 'premium';
  };
  
  // Détails de la campagne
  title: string;
  description: string;
  category: 'disaster_relief' | 'community_project' | 'charity_drive' | 'awareness' | 'fundraising';
  
  // Objectifs
  targetAmount: number;
  currentAmount: number;
  targetParticipants: number;
  currentParticipants: number;
  
  // Timing
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  
  // Engagement
  participants: string[];
  contributions: MutualAidContribution[];
  updates: CampaignUpdate[];
  
  // Transparence
  budgetBreakdown: {
    category: string;
    amount: number;
    description: string;
  }[];
  
  // Résultats
  impactReport?: {
    peopleHelped: number;
    servicesProvided: string[];
    mediaUrls: string[];
    testimonials: string[];
  };
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  isImportant: boolean;
}

export interface SolidarityChallenge {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  
  // Défi
  challengeType: 'donation' | 'volunteer' | 'awareness' | 'skill_sharing' | 'time_giving';
  targetMetric: number;
  currentMetric: number;
  unit: string; // 'euros', 'hours', 'people', 'shares'
  
  // Gamification
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  points: number;
  badge?: string;
  
  // Participation
  participants: string[];
  completions: string[];
  
  // Timing
  duration: number; // en jours
  startDate: string;
  endDate: string;
  
  // Viralité
  hashtag: string;
  shares: number;
  views: number;
  
  status: 'active' | 'completed' | 'expired';
}

export interface MutualAidCircle {
  id: string;
  name: string;
  description: string;
  
  // Composition
  members: string[];
  maxMembers: number;
  adminIds: string[];
  
  // Règles du cercle
  contributionRules: {
    minimumMonthlyContribution: number;
    maximumRequestPerMonth: number;
    votingRequired: boolean;
    consensusThreshold: number; // % de votes positifs requis
  };
  
  // Fonds commun
  totalFund: number;
  monthlyContributions: number;
  availableFund: number;
  
  // Historique
  requests: string[]; // IDs des demandes du cercle
  distributions: {
    requestId: string;
    amount: number;
    date: string;
    votes: { userId: string; vote: 'yes' | 'no' | 'abstain' }[];
  }[];
  
  // Paramètres
  isPrivate: boolean;
  requiresInvitation: boolean;
  geographicRestriction?: string;
  
  // Statistiques
  totalHelped: number;
  averageResponseTime: number; // en heures
  successRate: number; // % de demandes acceptées
  
  createdAt: string;
  updatedAt: string;
}

export interface SolidarityMetrics {
  userId: string;
  
  // Scores de solidarité
  mutualScore: number; // Score global 0-1000
  givingScore: number; // Score de générosité
  receivingScore: number; // Score de réception équitable
  communityScore: number; // Score d'engagement communautaire
  
  // Statistiques d'aide
  totalGiven: number;
  totalReceived: number;
  helpRatio: number; // ratio donné/reçu
  
  // Engagement
  requestsCreated: number;
  requestsFulfilled: number;
  contributionsMade: number;
  averageContribution: number;
  
  // Temps et fréquence
  averageResponseTime: number;
  activeStreak: number; // jours consécutifs d'activité
  lastActivity: string;
  
  // Réputation
  positiveRatings: number;
  negativeRatings: number;
  trustScore: number;
  
  // Badges et récompenses
  badges: string[];
  achievements: string[];
  level: number;
  
  // Historique mensuel
  monthlyStats: {
    month: string;
    given: number;
    received: number;
    requests: number;
    contributions: number;
  }[];
}

export interface AntiDiscriminationSystem {
  // Anonymisation
  enableAnonymousMode: boolean;
  hidePersonalInfo: boolean;
  useGenericAvatars: boolean;
  
  // Algorithme équitable
  distributionAlgorithm: 'random' | 'need_based' | 'rotating' | 'balanced';
  preventBias: boolean;
  
  // Monitoring
  discriminationReports: {
    reportId: string;
    reportedUserId: string;
    reason: string;
    evidence: string[];
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    createdAt: string;
  }[];
  
  // Métriques d'équité
  genderDistribution: { [key: string]: number };
  ageDistribution: { [key: string]: number };
  locationDistribution: { [key: string]: number };
  wealthDistribution: { [key: string]: number };
  
  // Actions correctives
  balancingActions: string[];
  diversityTargets: { [key: string]: number };
}

export interface EmergencyResponse {
  id: string;
  triggeredBy: string;
  
  // Détails de l'urgence
  emergencyType: 'natural_disaster' | 'medical_emergency' | 'financial_crisis' | 'social_crisis' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedArea: string;
  estimatedAffected: number;
  
  // Réponse automatique
  autoActivated: boolean;
  responseTeam: string[];
  emergencyFund: number;
  
  // Coordination
  coordinatorId: string;
  volunteers: string[];
  resources: {
    type: string;
    quantity: number;
    location: string;
    contactId: string;
  }[];
  
  // Communication
  updates: {
    timestamp: string;
    message: string;
    priority: 'info' | 'warning' | 'critical';
  }[];
  
  // Statut
  status: 'active' | 'monitoring' | 'resolved' | 'escalated';
  createdAt: string;
  resolvedAt?: string;
}
