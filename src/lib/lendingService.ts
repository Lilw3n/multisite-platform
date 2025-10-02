import { 
  LendingOffer, 
  LendingRequest, 
  LoanContract, 
  PaymentSchedule, 
  LoanPayment,
  LegalCompliance,
  RiskAssessment,
  LendingPlatformFees,
  DisputeResolution
} from '@/types/lending';

class LendingService {
  private readonly STORAGE_KEYS = {
    OFFERS: 'lending_offers',
    REQUESTS: 'lending_requests',
    CONTRACTS: 'loan_contracts',
    PAYMENTS: 'loan_payments',
    DISPUTES: 'lending_disputes'
  };

  // Conformité légale par pays
  private readonly LEGAL_FRAMEWORKS: { [key: string]: LegalCompliance } = {
    'FR': {
      country: 'France',
      maxInterestRate: 20.0, // Taux d'usure légal français
      maxLoanAmount: 75000, // Crédit à la consommation
      minBorrowerAge: 18,
      requiredDisclosures: [
        'Taux Effectif Global (TEG)',
        'Coût total du crédit',
        'Droit de rétractation 14 jours',
        'Assurance facultative',
        'Conséquences du non-paiement'
      ],
      coolingOffPeriod: 336, // 14 jours en heures
      mandatoryInsurance: false,
      creditCheckRequired: true,
      regulatoryFramework: 'FR_CODE_CONSO'
    },
    'EU': {
      country: 'Union Européenne',
      maxInterestRate: 25.0,
      maxLoanAmount: 100000,
      minBorrowerAge: 18,
      requiredDisclosures: [
        'Annual Percentage Rate (APR)',
        'Total cost of credit',
        'Right of withdrawal',
        'Optional insurance',
        'Consequences of non-payment'
      ],
      coolingOffPeriod: 336,
      mandatoryInsurance: false,
      creditCheckRequired: true,
      regulatoryFramework: 'EU_CCD'
    }
  };

  // Frais de la plateforme
  private readonly PLATFORM_FEES: LendingPlatformFees = {
    lenderFee: 1.0, // 1% pour le prêteur
    borrowerFee: 2.0, // 2% pour l'emprunteur
    serviceFee: 5.0, // 5€ par mois
    lateFee: 25.0, // 25€ de frais de retard
    collectionFee: 50.0, // 50€ de frais de recouvrement
    insuranceFee: 0.5 // 0.5% optionnel
  };

  // === GESTION DES OFFRES DE PRÊT ===
  
  createLendingOffer(offer: Omit<LendingOffer, 'id' | 'createdAt' | 'updatedAt'>): LendingOffer {
    const newOffer: LendingOffer = {
      ...offer,
      id: `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validation légale
    this.validateLendingOffer(newOffer);

    const offers = this.getLendingOffers();
    offers.push(newOffer);
    localStorage.setItem(this.STORAGE_KEYS.OFFERS, JSON.stringify(offers));

    return newOffer;
  }

  getLendingOffers(filters?: {
    category?: string;
    minAmount?: number;
    maxAmount?: number;
    maxRate?: number;
    lenderId?: string;
  }): LendingOffer[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.OFFERS);
    let offers: LendingOffer[] = stored ? JSON.parse(stored) : this.generateMockOffers();

    if (filters) {
      offers = offers.filter(offer => {
        if (filters.category && offer.category !== filters.category) return false;
        if (filters.minAmount && offer.maxAmount < filters.minAmount) return false;
        if (filters.maxAmount && offer.minAmount > filters.maxAmount) return false;
        if (filters.maxRate && offer.interestRate > filters.maxRate) return false;
        if (filters.lenderId && offer.lenderId !== filters.lenderId) return false;
        return true;
      });
    }

    return offers.filter(offer => offer.status === 'active');
  }

  // === GESTION DES DEMANDES DE PRÊT ===

  createLendingRequest(request: Omit<LendingRequest, 'id' | 'createdAt' | 'updatedAt'>): LendingRequest {
    const newRequest: LendingRequest = {
      ...request,
      id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Évaluation des risques
    const riskAssessment = this.assessBorrowerRisk(request.borrowerId);
    if (riskAssessment.riskLevel === 'very_high') {
      throw new Error('Demande refusée : niveau de risque trop élevé');
    }

    const requests = this.getLendingRequests();
    requests.push(newRequest);
    localStorage.setItem(this.STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

    return newRequest;
  }

  getLendingRequests(filters?: {
    category?: string;
    minAmount?: number;
    maxAmount?: number;
    urgency?: string;
    borrowerId?: string;
  }): LendingRequest[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.REQUESTS);
    let requests: LendingRequest[] = stored ? JSON.parse(stored) : this.generateMockRequests();

    if (filters) {
      requests = requests.filter(request => {
        if (filters.category && request.category !== filters.category) return false;
        if (filters.minAmount && request.requestedAmount < filters.minAmount) return false;
        if (filters.maxAmount && request.requestedAmount > filters.maxAmount) return false;
        if (filters.urgency && request.urgency !== filters.urgency) return false;
        if (filters.borrowerId && request.borrowerId !== filters.borrowerId) return false;
        return true;
      });
    }

    return requests.filter(request => request.status === 'pending');
  }

  // === CRÉATION ET GESTION DES CONTRATS ===

  createLoanContract(
    offerId: string, 
    requestId: string, 
    negotiatedTerms?: Partial<LoanContract>
  ): LoanContract {
    const offer = this.getLendingOffers().find(o => o.id === offerId);
    const request = this.getLendingRequests().find(r => r.id === requestId);

    if (!offer || !request) {
      throw new Error('Offre ou demande introuvable');
    }

    // Validation de compatibilité
    if (request.requestedAmount > offer.maxAmount || request.requestedAmount < offer.minAmount) {
      throw new Error('Montant incompatible avec l\'offre');
    }

    if (request.maxInterestRate < offer.interestRate) {
      throw new Error('Taux d\'intérêt incompatible');
    }

    const principal = negotiatedTerms?.principal || request.requestedAmount;
    const interestRate = negotiatedTerms?.interestRate || offer.interestRate;
    const duration = negotiatedTerms?.duration || request.preferredDuration;

    // Validation légale
    const compliance = this.LEGAL_FRAMEWORKS['FR']; // Par défaut France
    if (interestRate > compliance.maxInterestRate) {
      throw new Error(`Taux d'intérêt supérieur au taux d'usure légal (${compliance.maxInterestRate}%)`);
    }

    const startDate = new Date();
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + duration);

    const gracePeriodEnd = new Date(dueDate);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + offer.gracePeriod);

    const penaltyPeriodEnd = new Date(gracePeriodEnd);
    penaltyPeriodEnd.setDate(penaltyPeriodEnd.getDate() + offer.maxPenaltyDuration);

    // Calcul de l'échéancier
    const repaymentSchedule = this.calculateRepaymentSchedule(
      principal,
      interestRate,
      duration,
      offer.repaymentType,
      offer.installmentFrequency
    );

    const totalInterest = repaymentSchedule.reduce((sum, payment) => sum + payment.interest, 0);
    const totalAmount = principal + totalInterest;

    const contract: LoanContract = {
      id: `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lenderId: offer.lenderId,
      borrowerId: request.borrowerId,
      offerId,
      requestId,
      principal,
      interestRate,
      duration,
      gracePeriod: offer.gracePeriod,
      penaltyRate: offer.penaltyRate,
      maxPenaltyDuration: offer.maxPenaltyDuration,
      startDate: startDate.toISOString(),
      dueDate: dueDate.toISOString(),
      gracePeriodEnd: gracePeriodEnd.toISOString(),
      penaltyPeriodEnd: penaltyPeriodEnd.toISOString(),
      repaymentSchedule,
      totalAmount,
      totalInterest,
      remainingAmount: totalAmount,
      legalStatus: 'draft',
      digitalSignatures: {
        lender: false,
        borrower: false
      },
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
      ...negotiatedTerms
    };

    const contracts = this.getLoanContracts();
    contracts.push(contract);
    localStorage.setItem(this.STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));

    return contract;
  }

  // === CALCUL DES ÉCHÉANCIERS ===

  calculateRepaymentSchedule(
    principal: number,
    annualRate: number,
    durationDays: number,
    repaymentType: string,
    frequency?: string
  ): PaymentSchedule[] {
    const schedule: PaymentSchedule[] = [];
    const monthlyRate = annualRate / 100 / 12;
    
    if (repaymentType === 'lump_sum') {
      // Remboursement en une fois
      const totalInterest = (principal * annualRate / 100 * durationDays) / 365;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + durationDays);

      schedule.push({
        id: `payment_1`,
        dueDate: dueDate.toISOString(),
        amount: principal + totalInterest,
        principal: principal,
        interest: totalInterest,
        status: 'pending'
      });
    } else if (repaymentType === 'installments') {
      // Remboursement par mensualités
      const numberOfPayments = Math.ceil(durationDays / 30);
      const monthlyPayment = this.calculateMonthlyPayment(principal, monthlyRate, numberOfPayments);

      for (let i = 1; i <= numberOfPayments; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);

        const remainingPrincipal = principal - (principal / numberOfPayments) * (i - 1);
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;

        schedule.push({
          id: `payment_${i}`,
          dueDate: dueDate.toISOString(),
          amount: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          status: 'pending'
        });
      }
    }

    return schedule;
  }

  private calculateMonthlyPayment(principal: number, monthlyRate: number, numberOfPayments: number): number {
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  // === ÉVALUATION DES RISQUES ===

  assessBorrowerRisk(borrowerId: string): RiskAssessment {
    // Simulation d'évaluation des risques
    const mockAssessment: RiskAssessment = {
      borrowerId,
      creditScore: Math.floor(Math.random() * 400) + 400, // 400-800
      incomeVerified: Math.random() > 0.3,
      employmentStatus: ['employed', 'self_employed', 'unemployed', 'retired', 'student'][Math.floor(Math.random() * 5)] as any,
      debtToIncomeRatio: Math.random() * 0.6, // 0-60%
      previousDefaults: Math.floor(Math.random() * 3),
      riskLevel: 'medium',
      recommendedMaxAmount: 10000,
      recommendedMaxRate: 15.0,
      additionalRequirements: []
    };

    // Calcul du niveau de risque
    let riskScore = 0;
    if (mockAssessment.creditScore < 500) riskScore += 3;
    else if (mockAssessment.creditScore < 650) riskScore += 2;
    else if (mockAssessment.creditScore < 750) riskScore += 1;

    if (!mockAssessment.incomeVerified) riskScore += 2;
    if (mockAssessment.employmentStatus === 'unemployed') riskScore += 3;
    if (mockAssessment.debtToIncomeRatio > 0.4) riskScore += 2;
    if (mockAssessment.previousDefaults > 0) riskScore += mockAssessment.previousDefaults;

    if (riskScore >= 8) mockAssessment.riskLevel = 'very_high';
    else if (riskScore >= 6) mockAssessment.riskLevel = 'high';
    else if (riskScore >= 4) mockAssessment.riskLevel = 'medium';
    else if (riskScore >= 2) mockAssessment.riskLevel = 'low';
    else mockAssessment.riskLevel = 'very_low';

    return mockAssessment;
  }

  // === VALIDATION LÉGALE ===

  private validateLendingOffer(offer: LendingOffer): void {
    const compliance = this.LEGAL_FRAMEWORKS['FR'];
    
    if (offer.interestRate > compliance.maxInterestRate) {
      throw new Error(`Taux d'intérêt supérieur au taux d'usure légal (${compliance.maxInterestRate}%)`);
    }

    if (offer.maxAmount > compliance.maxLoanAmount) {
      throw new Error(`Montant supérieur au maximum légal (${compliance.maxLoanAmount}€)`);
    }

    if (offer.penaltyRate > compliance.maxInterestRate * 1.5) {
      throw new Error('Taux de pénalité excessif');
    }
  }

  // === DONNÉES MOCK ===

  private generateMockOffers(): LendingOffer[] {
    return [
      {
        id: 'offer_1',
        lenderId: 'lender_1',
        lenderProfile: {
          name: 'Marie Dubois',
          avatar: '👩‍💼',
          rating: 4.8,
          totalLoans: 25,
          successRate: 96,
          verified: true
        },
        amount: 5000,
        minAmount: 1000,
        maxAmount: 10000,
        currency: 'EUR',
        duration: 365,
        minDuration: 90,
        maxDuration: 730,
        interestRate: 8.5,
        interestType: 'simple',
        gracePeriod: 7,
        penaltyRate: 12.0,
        maxPenaltyDuration: 90,
        legalFramework: 'consumer',
        maxLegalRate: 20.0,
        requiredDocuments: ['ID', 'Income proof'],
        creditCheckRequired: true,
        collateralRequired: false,
        guaranteeRequired: false,
        insuranceRequired: false,
        repaymentType: 'installments',
        installmentFrequency: 'monthly',
        earlyRepaymentAllowed: true,
        status: 'active',
        availableAmount: 5000,
        totalOffered: 10000,
        category: 'personal',
        title: 'Prêt personnel flexible',
        description: 'Prêt personnel avec conditions avantageuses',
        tags: ['personnel', 'flexible', 'taux avantageux'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private generateMockRequests(): LendingRequest[] {
    return [
      {
        id: 'request_1',
        borrowerId: 'borrower_1',
        borrowerProfile: {
          name: 'Jean Martin',
          avatar: '👨‍💻',
          creditScore: 720,
          totalBorrowed: 15000,
          repaymentRate: 98,
          verified: true
        },
        requestedAmount: 3000,
        currency: 'EUR',
        purpose: 'Rénovation appartement',
        category: 'personal',
        maxInterestRate: 10.0,
        preferredDuration: 180,
        maxDuration: 365,
        acceptedRepaymentTypes: ['installments', 'lump_sum'],
        providedDocuments: ['ID', 'Income proof', 'Bank statements'],
        status: 'pending',
        urgency: 'medium',
        title: 'Besoin de financement rénovation',
        description: 'Recherche financement pour rénovation salle de bain',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  getLoanContracts(userId?: string): LoanContract[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.CONTRACTS);
    let contracts: LoanContract[] = stored ? JSON.parse(stored) : [];

    if (userId) {
      contracts = contracts.filter(contract => 
        contract.lenderId === userId || contract.borrowerId === userId
      );
    }

    return contracts;
  }

  // === GESTION DES PAIEMENTS ===

  recordPayment(contractId: string, payment: Omit<LoanPayment, 'id'>): LoanPayment {
    const newPayment: LoanPayment = {
      ...payment,
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    const contracts = this.getLoanContracts();
    const contractIndex = contracts.findIndex(c => c.id === contractId);
    
    if (contractIndex === -1) {
      throw new Error('Contrat introuvable');
    }

    contracts[contractIndex].payments.push(newPayment);
    contracts[contractIndex].remainingAmount -= payment.principal;
    contracts[contractIndex].updatedAt = new Date().toISOString();

    localStorage.setItem(this.STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));

    return newPayment;
  }

  // === GESTION DES LITIGES ===

  createDispute(dispute: Omit<DisputeResolution, 'id' | 'createdAt'>): DisputeResolution {
    const newDispute: DisputeResolution = {
      ...dispute,
      id: `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    const disputes = this.getDisputes();
    disputes.push(newDispute);
    localStorage.setItem(this.STORAGE_KEYS.DISPUTES, JSON.stringify(disputes));

    return newDispute;
  }

  getDisputes(loanId?: string): DisputeResolution[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.DISPUTES);
    let disputes: DisputeResolution[] = stored ? JSON.parse(stored) : [];

    if (loanId) {
      disputes = disputes.filter(dispute => dispute.loanId === loanId);
    }

    return disputes;
  }

  // === CALCULS FINANCIERS ===

  calculateTotalCost(principal: number, rate: number, duration: number): {
    totalInterest: number;
    totalAmount: number;
    monthlyPayment: number;
    apr: number;
  } {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = Math.ceil(duration / 30);
    
    const monthlyPayment = this.calculateMonthlyPayment(principal, monthlyRate, numberOfPayments);
    const totalAmount = monthlyPayment * numberOfPayments;
    const totalInterest = totalAmount - principal;
    
    // Calcul du TEG (APR) incluant les frais
    const fees = principal * (this.PLATFORM_FEES.borrowerFee / 100);
    const apr = ((totalAmount + fees - principal) / principal) * (365 / duration) * 100;

    return {
      totalInterest,
      totalAmount,
      monthlyPayment,
      apr
    };
  }
}

export const lendingService = new LendingService();
export default lendingService;
