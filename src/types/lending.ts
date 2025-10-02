export interface LendingOffer {
  id: string;
  lenderId: string;
  lenderProfile: {
    name: string;
    avatar: string;
    rating: number;
    totalLoans: number;
    successRate: number;
    verified: boolean;
  };
  
  // Conditions du prêt
  amount: number;
  minAmount: number;
  maxAmount: number;
  currency: 'EUR' | 'USD' | 'GBP';
  
  // Durée et échéances
  duration: number; // en jours
  minDuration: number;
  maxDuration: number;
  
  // Taux d'intérêt
  interestRate: number; // taux annuel en %
  interestType: 'simple' | 'compound' | 'progressive';
  gracePeriod: number; // période de grâce en jours
  penaltyRate: number; // taux de pénalité après échéance
  maxPenaltyDuration: number; // durée max des pénalités
  
  // Conditions légales
  legalFramework: 'consumer' | 'commercial' | 'micro';
  maxLegalRate: number; // taux d'usure légal
  requiredDocuments: string[];
  creditCheckRequired: boolean;
  
  // Garanties et sécurité
  collateralRequired: boolean;
  collateralType?: 'vehicle' | 'property' | 'deposit' | 'guarantee';
  guaranteeRequired: boolean;
  insuranceRequired: boolean;
  
  // Modalités de remboursement
  repaymentType: 'lump_sum' | 'installments' | 'interest_only' | 'flexible';
  installmentFrequency?: 'weekly' | 'monthly' | 'quarterly';
  earlyRepaymentAllowed: boolean;
  earlyRepaymentPenalty?: number;
  
  // Statut et disponibilité
  status: 'active' | 'paused' | 'completed' | 'suspended';
  availableAmount: number;
  totalOffered: number;
  category: 'personal' | 'business' | 'emergency' | 'investment' | 'education';
  
  // Métadonnées
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface LendingRequest {
  id: string;
  borrowerId: string;
  borrowerProfile: {
    name: string;
    avatar: string;
    creditScore: number;
    totalBorrowed: number;
    repaymentRate: number;
    verified: boolean;
  };
  
  // Demande de prêt
  requestedAmount: number;
  currency: 'EUR' | 'USD' | 'GBP';
  purpose: string;
  category: 'personal' | 'business' | 'emergency' | 'investment' | 'education';
  
  // Conditions acceptées
  maxInterestRate: number;
  preferredDuration: number;
  maxDuration: number;
  acceptedRepaymentTypes: ('lump_sum' | 'installments' | 'interest_only' | 'flexible')[];
  
  // Documents et garanties
  providedDocuments: string[];
  collateralOffered?: {
    type: 'vehicle' | 'property' | 'deposit' | 'guarantee';
    value: number;
    description: string;
    verified: boolean;
  };
  
  // Statut
  status: 'pending' | 'approved' | 'rejected' | 'funded' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  
  // Métadonnées
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
}

export interface LoanContract {
  id: string;
  lenderId: string;
  borrowerId: string;
  offerId: string;
  requestId?: string;
  
  // Conditions finales négociées
  principal: number;
  interestRate: number;
  duration: number;
  gracePeriod: number;
  penaltyRate: number;
  maxPenaltyDuration: number;
  
  // Échéancier
  startDate: string;
  dueDate: string;
  gracePeriodEnd: string;
  penaltyPeriodEnd: string;
  
  // Remboursement
  repaymentSchedule: PaymentSchedule[];
  totalAmount: number;
  totalInterest: number;
  remainingAmount: number;
  
  // Statut légal
  legalStatus: 'draft' | 'signed' | 'active' | 'completed' | 'defaulted' | 'cancelled';
  signedAt?: string;
  digitalSignatures: {
    lender: boolean;
    borrower: boolean;
    witness?: boolean;
  };
  
  // Garanties
  collateral?: {
    type: string;
    value: number;
    description: string;
    documents: string[];
  };
  
  // Historique des paiements
  payments: LoanPayment[];
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
  notes: string[];
}

export interface PaymentSchedule {
  id: string;
  dueDate: string;
  amount: number;
  principal: number;
  interest: number;
  penalty?: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;
  paidDate?: string;
}

export interface LoanPayment {
  id: string;
  amount: number;
  principal: number;
  interest: number;
  penalty: number;
  paymentDate: string;
  paymentMethod: 'bank_transfer' | 'card' | 'crypto' | 'cash' | 'check';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
}

export interface LegalCompliance {
  country: string;
  maxInterestRate: number; // Taux d'usure légal
  maxLoanAmount: number;
  minBorrowerAge: number;
  requiredDisclosures: string[];
  coolingOffPeriod: number; // en heures
  mandatoryInsurance: boolean;
  creditCheckRequired: boolean;
  regulatoryFramework: 'EU_CCD' | 'FR_CODE_CONSO' | 'US_TILA' | 'UK_CCA';
}

export interface RiskAssessment {
  borrowerId: string;
  creditScore: number;
  incomeVerified: boolean;
  employmentStatus: 'employed' | 'self_employed' | 'unemployed' | 'retired' | 'student';
  debtToIncomeRatio: number;
  previousDefaults: number;
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  recommendedMaxAmount: number;
  recommendedMaxRate: number;
  additionalRequirements: string[];
}

export interface LendingPlatformFees {
  lenderFee: number; // % du montant prêté
  borrowerFee: number; // % du montant emprunté
  serviceFee: number; // frais de service mensuel
  lateFee: number; // frais de retard
  collectionFee: number; // frais de recouvrement
  insuranceFee?: number; // assurance optionnelle
}

export interface DisputeResolution {
  id: string;
  loanId: string;
  initiatedBy: 'lender' | 'borrower';
  type: 'payment_dispute' | 'contract_breach' | 'fraud' | 'other';
  status: 'open' | 'mediation' | 'arbitration' | 'resolved' | 'escalated';
  description: string;
  evidence: string[];
  mediatorId?: string;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}
