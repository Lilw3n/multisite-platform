export interface CollectiveFund {
  id: string;
  name: string;
  description: string;
  
  // Soldes et finances
  totalBalance: number;
  availableBalance: number;
  reservedBalance: number;
  currency: 'EUR' | 'USD' | 'GBP';
  
  // Sources de revenus
  revenueSources: FundRevenueSource[];
  monthlyIncome: number;
  projectedIncome: number;
  
  // Allocations automatiques
  allocations: FundAllocation[];
  
  // Historique financier
  transactions: FundTransaction[];
  monthlyReports: MonthlyFundReport[];
  
  // Paramètres de gestion
  adminIds: string[];
  autoAllocationEnabled: boolean;
  transparencyLevel: 'private' | 'partial' | 'full';
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
  lastDistribution: string;
}

export interface FundRevenueSource {
  id: string;
  name: string;
  type: 'solidarity_gifts' | 'platform_fees' | 'premium_subscriptions' | 'partnerships' | 'donations' | 'advertising' | 'services' | 'other';
  
  // Revenus
  currentMonthRevenue: number;
  totalRevenue: number;
  averageMonthlyRevenue: number;
  
  // Configuration
  isActive: boolean;
  automaticCollection: boolean;
  commissionRate?: number; // % prélevé sur les transactions
  
  // Détails
  description: string;
  lastCollection: string;
  nextProjectedCollection?: string;
}

export interface FundAllocation {
  id: string;
  name: string;
  category: 'insurance_subsidies' | 'admin_compensation' | 'project_funding' | 'emergency_fund' | 'platform_maintenance' | 'user_rewards' | 'charity' | 'reserves';
  
  // Allocation
  allocationType: 'percentage' | 'fixed_amount' | 'dynamic' | 'conditional';
  percentage?: number; // % du revenu total
  fixedAmount?: number; // Montant fixe mensuel
  priority: number; // 1 = priorité maximale
  
  // Conditions et règles
  conditions: AllocationCondition[];
  minAmount?: number;
  maxAmount?: number;
  
  // Bénéficiaires
  beneficiaries: FundBeneficiary[];
  distributionMethod: 'equal' | 'weighted' | 'need_based' | 'merit_based' | 'manual';
  
  // Statut
  isActive: boolean;
  autoDistribute: boolean;
  requiresApproval: boolean;
  
  // Historique
  totalDistributed: number;
  lastDistribution: string;
  distributionHistory: Distribution[];
}

export interface AllocationCondition {
  type: 'minimum_balance' | 'monthly_revenue' | 'user_activity' | 'project_milestone' | 'date_range' | 'custom';
  operator: 'greater_than' | 'less_than' | 'equals' | 'between';
  value: number | string;
  secondValue?: number; // Pour 'between'
  description: string;
}

export interface FundBeneficiary {
  id: string;
  type: 'user' | 'project' | 'organization' | 'system';
  name: string;
  
  // Poids et critères
  weight: number; // Pour distribution pondérée
  eligibilityCriteria: string[];
  
  // Limites
  maxMonthlyAmount?: number;
  maxTotalAmount?: number;
  
  // Statut
  isActive: boolean;
  verificationRequired: boolean;
  lastPayment?: string;
  totalReceived: number;
}

export interface Distribution {
  id: string;
  allocationId: string;
  beneficiaryId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected' | 'cancelled';
  
  // Métadonnées
  distributedBy: string;
  distributedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  
  // Communication publique
  publicDescription?: string; // Description pour les utilisateurs
  hideSource: boolean; // Masquer l'origine des fonds
}

export interface FundTransaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'allocation' | 'refund';
  category: string;
  
  // Montants
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  
  // Détails
  description: string;
  reference?: string;
  sourceId?: string; // ID de la source de revenu
  allocationId?: string; // ID de l'allocation
  beneficiaryId?: string;
  
  // Statut
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  
  // Métadonnées
  createdBy: string;
  createdAt: string;
  processedAt?: string;
  
  // Communication
  isPubliclyVisible: boolean;
  publicDescription?: string;
}

export interface InsuranceSubsidy {
  id: string;
  userId: string;
  userProfile: {
    name: string;
    avatar: string;
    mutualScore: number;
    contributionLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  };
  
  // Détails de l'assurance
  insuranceType: 'auto' | 'home' | 'health' | 'professional' | 'life' | 'travel';
  insuranceProvider: string;
  policyNumber?: string;
  
  // Subvention
  monthlyPremium: number;
  subsidyAmount: number;
  subsidyPercentage: number;
  maxSubsidyAmount: number;
  
  // Conditions d'éligibilité
  eligibilityScore: number;
  contributionHistory: number; // Contributions à la communauté
  mutualAidParticipation: number;
  
  // Statut
  status: 'active' | 'pending' | 'suspended' | 'expired';
  startDate: string;
  endDate?: string;
  renewalDate: string;
  
  // Paiements
  payments: SubsidyPayment[];
  totalPaid: number;
  nextPaymentDate: string;
  
  // Justificatifs
  proofDocuments: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  
  createdAt: string;
  updatedAt: string;
}

export interface SubsidyPayment {
  id: string;
  subsidyId: string;
  amount: number;
  paymentDate: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  notes?: string;
}

export interface ProjectFunding {
  id: string;
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  
  // Financement
  requestedAmount: number;
  approvedAmount: number;
  disbursedAmount: number;
  remainingAmount: number;
  
  // Catégorie et priorité
  category: 'community' | 'technology' | 'social' | 'environmental' | 'educational' | 'health' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Évaluation
  impactScore: number;
  communityVotes: number;
  adminApproval: boolean;
  
  // Jalons et conditions
  milestones: ProjectMilestone[];
  conditions: string[];
  
  // Statut
  status: 'submitted' | 'under_review' | 'approved' | 'funded' | 'in_progress' | 'completed' | 'cancelled';
  
  // Dates
  submittedAt: string;
  approvedAt?: string;
  startDate?: string;
  expectedCompletionDate?: string;
  completedAt?: string;
  
  // Rapports
  progressReports: ProjectReport[];
  finalReport?: ProjectReport;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completionDate?: string;
  fundingAmount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  proofRequired: boolean;
  proofDocuments: string[];
}

export interface ProjectReport {
  id: string;
  projectId: string;
  reportType: 'progress' | 'milestone' | 'final' | 'financial';
  title: string;
  content: string;
  attachments: string[];
  submittedAt: string;
  submittedBy: string;
}

export interface AdminCompensation {
  id: string;
  adminId: string;
  adminProfile: {
    name: string;
    role: string;
    level: 'junior' | 'senior' | 'lead' | 'executive';
  };
  
  // Compensation
  compensationType: 'salary' | 'commission' | 'bonus' | 'equity' | 'mixed';
  baseAmount: number;
  commissionRate?: number;
  bonusAmount?: number;
  
  // Calcul automatique
  activityScore: number;
  platformGrowth: number;
  userSatisfaction: number;
  revenueGenerated: number;
  
  // Paiements
  paymentFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  lastPayment: string;
  nextPayment: string;
  totalPaid: number;
  
  // Conditions
  performanceTargets: PerformanceTarget[];
  isActive: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceTarget {
  metric: string;
  target: number;
  current: number;
  weight: number; // Poids dans le calcul de la compensation
  achieved: boolean;
}

export interface MonthlyFundReport {
  month: string;
  year: number;
  
  // Revenus
  totalRevenue: number;
  revenueBySource: { [key: string]: number };
  revenueGrowth: number;
  
  // Dépenses
  totalExpenses: number;
  expensesByCategory: { [key: string]: number };
  
  // Allocations
  insuranceSubsidies: number;
  adminCompensation: number;
  projectFunding: number;
  emergencyFund: number;
  reserves: number;
  userRewards: number;
  
  // Métriques
  activeUsers: number;
  newUsers: number;
  retentionRate: number;
  engagementScore: number;
  
  // Soldes
  startingBalance: number;
  endingBalance: number;
  netChange: number;
  
  // Projections
  nextMonthProjection: number;
  quarterProjection: number;
  
  generatedAt: string;
}

export interface PublicFundCommunication {
  // Messages publics pour masquer la source des fonds
  subsidyMessages: {
    insurance: string[];
    projects: string[];
    rewards: string[];
    general: string[];
  };
  
  // Templates de communication
  templates: {
    insuranceSubsidy: string;
    projectFunding: string;
    userReward: string;
    generalBenefit: string;
  };
  
  // Niveau de transparence
  showTotalAmounts: boolean;
  showSourceBreakdown: boolean;
  showAdminCompensation: boolean;
  showDetailedReports: boolean;
}

export interface FundAnalytics {
  // Métriques financières
  totalFundsManaged: number;
  monthlyGrowthRate: number;
  averageUserBenefit: number;
  
  // Impact social
  usersHelped: number;
  insuranceCoverageImproved: number;
  projectsCompleted: number;
  communityEngagement: number;
  
  // Efficacité
  adminCostRatio: number; // % des fonds utilisés pour l'administration
  directBenefitRatio: number; // % des fonds allant directement aux utilisateurs
  returnOnInvestment: number;
  
  // Prédictions
  sustainabilityScore: number;
  growthProjection: number;
  riskAssessment: 'low' | 'medium' | 'high';
}
