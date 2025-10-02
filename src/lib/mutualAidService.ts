import {
  MutualAidRequest,
  MutualAidContribution,
  SolidarityGift,
  MutualAidCampaign,
  SolidarityChallenge,
  MutualAidCircle,
  SolidarityMetrics,
  AntiDiscriminationSystem,
  EmergencyResponse
} from '@/types/mutualAid';

class MutualAidService {
  private readonly STORAGE_KEYS = {
    REQUESTS: 'mutual_aid_requests',
    CONTRIBUTIONS: 'mutual_aid_contributions',
    CAMPAIGNS: 'mutual_aid_campaigns',
    CHALLENGES: 'solidarity_challenges',
    CIRCLES: 'mutual_aid_circles',
    METRICS: 'solidarity_metrics',
    GIFTS: 'solidarity_gifts',
    EMERGENCY: 'emergency_responses'
  };

  // === CADEAUX DE SOLIDARITÉ (comme TikTok) ===
  
  private readonly SOLIDARITY_GIFTS: SolidarityGift[] = [
    // Cadeaux basiques
    {
      id: 'heart',
      name: 'Cœur',
      emoji: '❤️',
      description: 'Un petit geste de soutien',
      value: 1,
      category: 'basic',
      animation: 'heartbeat',
      color: '#ff6b6b',
      rarity: 'common',
      realWorldValue: 0.10,
      impactDescription: '10 centimes pour l\'aide mutuelle',
      isActive: true
    },
    {
      id: 'hug',
      name: 'Câlin',
      emoji: '🤗',
      description: 'Soutien émotionnel',
      value: 2,
      category: 'basic',
      animation: 'warm_glow',
      color: '#ffd93d',
      rarity: 'common',
      realWorldValue: 0.25,
      impactDescription: '25 centimes de réconfort',
      isActive: true
    },
    {
      id: 'helping_hand',
      name: 'Main Tendue',
      emoji: '🤝',
      description: 'Offre d\'aide concrète',
      value: 5,
      category: 'premium',
      animation: 'handshake',
      color: '#4ecdc4',
      rarity: 'rare',
      realWorldValue: 1.00,
      impactDescription: '1€ d\'aide directe',
      isActive: true
    },
    {
      id: 'emergency_kit',
      name: 'Kit d\'Urgence',
      emoji: '🆘',
      description: 'Aide d\'urgence immédiate',
      value: 20,
      category: 'emergency',
      animation: 'emergency_flash',
      color: '#ff4757',
      rarity: 'epic',
      realWorldValue: 5.00,
      impactDescription: '5€ d\'aide d\'urgence',
      isActive: true
    },
    {
      id: 'golden_solidarity',
      name: 'Solidarité d\'Or',
      emoji: '🏆',
      description: 'Soutien exceptionnel',
      value: 100,
      category: 'special',
      animation: 'golden_rain',
      color: '#ffd700',
      rarity: 'legendary',
      realWorldValue: 25.00,
      impactDescription: '25€ de solidarité exceptionnelle',
      isActive: true
    },
    // Cadeaux saisonniers
    {
      id: 'christmas_gift',
      name: 'Cadeau de Noël',
      emoji: '🎁',
      description: 'Partage de Noël',
      value: 15,
      category: 'special',
      animation: 'christmas_sparkle',
      color: '#2ed573',
      rarity: 'rare',
      realWorldValue: 3.00,
      impactDescription: '3€ de magie de Noël',
      isActive: true,
      seasonalAvailability: {
        startDate: '2024-12-01',
        endDate: '2024-12-31'
      }
    }
  ];

  // === GESTION DES DEMANDES D'AIDE ===

  createMutualAidRequest(request: Omit<MutualAidRequest, 'id' | 'createdAt' | 'updatedAt' | 'currentAmount' | 'goalReached' | 'supporters' | 'totalSupporters' | 'averageContribution' | 'shares' | 'views'>): MutualAidRequest {
    // Système anti-discrimination
    const anonymizedRequest = this.applyAntiDiscrimination(request);
    
    const newRequest: MutualAidRequest = {
      ...anonymizedRequest,
      id: `aid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      currentAmount: 0,
      goalReached: false,
      supporters: [],
      totalSupporters: 0,
      averageContribution: 0,
      shares: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validation et modération automatique
    this.moderateRequest(newRequest);

    const requests = this.getMutualAidRequests();
    requests.push(newRequest);
    localStorage.setItem(this.STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

    // Notification d'urgence si critique
    if (newRequest.urgencyLevel === 'critical') {
      this.triggerEmergencyResponse(newRequest);
    }

    return newRequest;
  }

  getMutualAidRequests(filters?: {
    category?: string;
    urgencyLevel?: string;
    location?: string;
    maxAmount?: number;
    needsLocalHelp?: boolean;
    status?: string;
  }): MutualAidRequest[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.REQUESTS);
    let requests: MutualAidRequest[] = stored ? JSON.parse(stored) : this.generateMockRequests();

    if (filters) {
      requests = requests.filter(request => {
        if (filters.category && request.category !== filters.category) return false;
        if (filters.urgencyLevel && request.urgencyLevel !== filters.urgencyLevel) return false;
        if (filters.location && request.location?.city !== filters.location) return false;
        if (filters.maxAmount && request.targetAmount > filters.maxAmount) return false;
        if (filters.needsLocalHelp !== undefined && request.needsLocalHelp !== filters.needsLocalHelp) return false;
        if (filters.status && request.status !== filters.status) return false;
        return true;
      });
    }

    // Algorithme anti-discrimination pour l'ordre d'affichage
    return this.applyFairDistribution(requests);
  }

  // === SYSTÈME DE CADEAUX SOLIDAIRES ===

  sendSolidarityGift(
    giftId: string, 
    fromUserId: string, 
    toRequestId: string, 
    quantity: number = 1,
    message?: string
  ): MutualAidContribution {
    const gift = this.SOLIDARITY_GIFTS.find(g => g.id === giftId);
    if (!gift) {
      throw new Error('Cadeau introuvable');
    }

    const totalValue = gift.realWorldValue * quantity;
    const contribution: MutualAidContribution = {
      id: `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: toRequestId,
      contributorId: fromUserId,
      contributorProfile: {
        name: 'Donateur Anonyme', // Anonymisation par défaut
        avatar: gift.emoji,
        isAnonymous: true,
        mutualScore: 0
      },
      type: 'money',
      amount: totalValue,
      currency: 'EUR',
      message: message || `${gift.name} x${quantity} - ${gift.description}`,
      isPublic: true,
      allowsContact: false,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    // Enregistrer la contribution
    this.recordContribution(contribution);

    // Mettre à jour les métriques de solidarité
    this.updateSolidarityMetrics(fromUserId, 'given', totalValue);

    // Animation et effets visuels (à implémenter côté frontend)
    this.triggerGiftAnimation(gift, quantity, toRequestId);

    return contribution;
  }

  getSolidarityGifts(category?: string): SolidarityGift[] {
    let gifts = this.SOLIDARITY_GIFTS.filter(g => g.isActive);

    if (category) {
      gifts = gifts.filter(g => g.category === category);
    }

    // Filtrer par disponibilité saisonnière
    const now = new Date();
    gifts = gifts.filter(gift => {
      if (!gift.seasonalAvailability) return true;
      
      const start = new Date(gift.seasonalAvailability.startDate);
      const end = new Date(gift.seasonalAvailability.endDate);
      return now >= start && now <= end;
    });

    return gifts;
  }

  // === CERCLES D'ENTRAIDE ===

  createMutualAidCircle(circle: Omit<MutualAidCircle, 'id' | 'createdAt' | 'updatedAt' | 'totalFund' | 'availableFund' | 'requests' | 'distributions' | 'totalHelped' | 'averageResponseTime' | 'successRate'>): MutualAidCircle {
    const newCircle: MutualAidCircle = {
      ...circle,
      id: `circle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      totalFund: 0,
      availableFund: 0,
      requests: [],
      distributions: [],
      totalHelped: 0,
      averageResponseTime: 0,
      successRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const circles = this.getMutualAidCircles();
    circles.push(newCircle);
    localStorage.setItem(this.STORAGE_KEYS.CIRCLES, JSON.stringify(circles));

    return newCircle;
  }

  joinMutualAidCircle(circleId: string, userId: string): boolean {
    const circles = this.getMutualAidCircles();
    const circleIndex = circles.findIndex(c => c.id === circleId);
    
    if (circleIndex === -1) return false;
    
    const circle = circles[circleIndex];
    
    // Vérifications
    if (circle.members.includes(userId)) return false;
    if (circle.members.length >= circle.maxMembers) return false;
    if (circle.requiresInvitation) return false; // Nécessite logique d'invitation
    
    circle.members.push(userId);
    circle.updatedAt = new Date().toISOString();
    
    localStorage.setItem(this.STORAGE_KEYS.CIRCLES, JSON.stringify(circles));
    return true;
  }

  // === DÉFIS DE SOLIDARITÉ ===

  createSolidarityChallenge(challenge: Omit<SolidarityChallenge, 'id' | 'currentMetric' | 'participants' | 'completions' | 'shares' | 'views' | 'status'>): SolidarityChallenge {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + challenge.duration);

    const newChallenge: SolidarityChallenge = {
      ...challenge,
      id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      currentMetric: 0,
      participants: [],
      completions: [],
      shares: 0,
      views: 0,
      endDate: endDate.toISOString(),
      status: 'active'
    };

    const challenges = this.getSolidarityChallenges();
    challenges.push(newChallenge);
    localStorage.setItem(this.STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));

    return newChallenge;
  }

  participateInChallenge(challengeId: string, userId: string, contribution: number): boolean {
    const challenges = this.getSolidarityChallenges();
    const challengeIndex = challenges.findIndex(c => c.id === challengeId);
    
    if (challengeIndex === -1) return false;
    
    const challenge = challenges[challengeIndex];
    
    if (!challenge.participants.includes(userId)) {
      challenge.participants.push(userId);
    }
    
    challenge.currentMetric += contribution;
    
    // Vérifier si le défi est complété
    if (challenge.currentMetric >= challenge.targetMetric && !challenge.completions.includes(userId)) {
      challenge.completions.push(userId);
      this.awardChallengeReward(userId, challenge);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    return true;
  }

  // === SYSTÈME ANTI-DISCRIMINATION ===

  private applyAntiDiscrimination(request: any): any {
    const antiDiscrimination: AntiDiscriminationSystem = {
      enableAnonymousMode: true,
      hidePersonalInfo: true,
      useGenericAvatars: true,
      distributionAlgorithm: 'need_based',
      preventBias: true,
      discriminationReports: [],
      genderDistribution: {},
      ageDistribution: {},
      locationDistribution: {},
      wealthDistribution: {},
      balancingActions: [],
      diversityTargets: {}
    };

    if (request.userProfile.anonymousMode || antiDiscrimination.enableAnonymousMode) {
      // Anonymisation des données personnelles
      request.userProfile = {
        ...request.userProfile,
        name: this.generateAnonymousName(),
        avatar: this.getGenericAvatar(),
        age: undefined, // Masquer l'âge pour éviter la discrimination
        anonymousMode: true
      };
    }

    return request;
  }

  private applyFairDistribution(requests: MutualAidRequest[]): MutualAidRequest[] {
    // Algorithme de distribution équitable
    // Mélange aléatoire pour éviter les biais de position
    const shuffled = [...requests].sort(() => Math.random() - 0.5);
    
    // Prioriser les urgences critiques
    const critical = shuffled.filter(r => r.urgencyLevel === 'critical');
    const high = shuffled.filter(r => r.urgencyLevel === 'high');
    const medium = shuffled.filter(r => r.urgencyLevel === 'medium');
    const low = shuffled.filter(r => r.urgencyLevel === 'low');
    
    return [...critical, ...high, ...medium, ...low];
  }

  private generateAnonymousName(): string {
    const adjectives = ['Généreux', 'Solidaire', 'Bienveillant', 'Attentionné', 'Compatissant'];
    const nouns = ['Aidant', 'Soutien', 'Ami', 'Voisin', 'Citoyen'];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    
    return `${adj} ${noun} #${num}`;
  }

  private getGenericAvatar(): string {
    const avatars = ['🤝', '❤️', '🌟', '🤗', '💝', '🌈', '✨', '🕊️'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  // === RÉPONSE D'URGENCE ===

  private triggerEmergencyResponse(request: MutualAidRequest): void {
    const emergency: EmergencyResponse = {
      id: `emergency_${Date.now()}`,
      triggeredBy: request.id,
      emergencyType: 'social_crisis',
      severity: 'high',
      affectedArea: request.location?.city || 'Non spécifié',
      estimatedAffected: 1,
      autoActivated: true,
      responseTeam: [],
      emergencyFund: 1000, // Fonds d'urgence automatique
      coordinatorId: 'system',
      volunteers: [],
      resources: [],
      updates: [{
        timestamp: new Date().toISOString(),
        message: `Demande d'aide critique détectée: ${request.title}`,
        priority: 'critical'
      }],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const emergencies = this.getEmergencyResponses();
    emergencies.push(emergency);
    localStorage.setItem(this.STORAGE_KEYS.EMERGENCY, JSON.stringify(emergencies));

    // Notification push à tous les utilisateurs actifs
    this.broadcastEmergencyAlert(emergency);
  }

  // === MÉTRIQUES ET GAMIFICATION ===

  updateSolidarityMetrics(userId: string, action: 'given' | 'received', amount: number): void {
    const metricsKey = `${this.STORAGE_KEYS.METRICS}_${userId}`;
    const stored = localStorage.getItem(metricsKey);
    
    let metrics: SolidarityMetrics = stored ? JSON.parse(stored) : {
      userId,
      mutualScore: 100,
      givingScore: 0,
      receivingScore: 0,
      communityScore: 0,
      totalGiven: 0,
      totalReceived: 0,
      helpRatio: 1,
      requestsCreated: 0,
      requestsFulfilled: 0,
      contributionsMade: 0,
      averageContribution: 0,
      averageResponseTime: 0,
      activeStreak: 0,
      lastActivity: new Date().toISOString(),
      positiveRatings: 0,
      negativeRatings: 0,
      trustScore: 100,
      badges: [],
      achievements: [],
      level: 1,
      monthlyStats: []
    };

    if (action === 'given') {
      metrics.totalGiven += amount;
      metrics.contributionsMade += 1;
      metrics.givingScore += amount * 10;
      metrics.averageContribution = metrics.totalGiven / metrics.contributionsMade;
    } else {
      metrics.totalReceived += amount;
      metrics.receivingScore += amount * 5;
    }

    metrics.helpRatio = metrics.totalReceived > 0 ? metrics.totalGiven / metrics.totalReceived : metrics.totalGiven;
    metrics.mutualScore = Math.min(1000, metrics.givingScore + metrics.communityScore + metrics.trustScore);
    metrics.level = Math.floor(metrics.mutualScore / 100) + 1;

    // Attribution de badges
    this.checkAndAwardBadges(metrics);

    localStorage.setItem(metricsKey, JSON.stringify(metrics));
  }

  private checkAndAwardBadges(metrics: SolidarityMetrics): void {
    const newBadges: string[] = [];

    if (metrics.totalGiven >= 100 && !metrics.badges.includes('generous_heart')) {
      newBadges.push('generous_heart');
    }
    
    if (metrics.contributionsMade >= 50 && !metrics.badges.includes('super_helper')) {
      newBadges.push('super_helper');
    }
    
    if (metrics.helpRatio >= 2 && !metrics.badges.includes('giving_spirit')) {
      newBadges.push('giving_spirit');
    }

    metrics.badges.push(...newBadges);
  }

  // === MODÉRATION ET SÉCURITÉ ===

  private moderateRequest(request: MutualAidRequest): void {
    // Détection automatique de contenu inapproprié
    const suspiciousKeywords = ['arnaque', 'scam', 'fake', 'mensonge'];
    const content = `${request.title} ${request.description}`.toLowerCase();
    
    const hasSuspiciousContent = suspiciousKeywords.some(keyword => 
      content.includes(keyword)
    );

    if (hasSuspiciousContent) {
      request.status = 'cancelled';
      request.moderatorNotes = 'Contenu suspect détecté - Modération automatique';
    }

    // Vérification des montants excessifs
    if (request.targetAmount > 10000) {
      request.proofRequired = true;
      request.moderatorNotes = 'Montant élevé - Vérification requise';
    }
  }

  // === DONNÉES MOCK ET UTILITAIRES ===

  private generateMockRequests(): MutualAidRequest[] {
    return [
      {
        id: 'aid_1',
        userId: 'user_1',
        userProfile: {
          name: 'Famille Solidaire #123',
          avatar: '🤝',
          location: 'Paris, France',
          verificationLevel: 'verified',
          mutualScore: 750,
          helpGiven: 5,
          helpReceived: 2,
          anonymousMode: true
        },
        category: 'emergency',
        urgencyLevel: 'high',
        title: 'Aide alimentaire urgente',
        description: 'Famille avec enfants en difficulté temporaire suite à perte d\'emploi',
        targetAmount: 200,
        currency: 'EUR',
        currentAmount: 45,
        goalReached: false,
        isMonetary: true,
        acceptsPartialHelp: true,
        acceptsServices: true,
        acceptsGoods: true,
        needsLocalHelp: true,
        location: {
          city: 'Paris',
          region: 'Île-de-France',
          country: 'France',
          radius: 20
        },
        proofRequired: false,
        proofDocuments: [],
        verifiedByModerator: true,
        status: 'active',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        supporters: ['user_2', 'user_3'],
        totalSupporters: 2,
        averageContribution: 22.5,
        shares: 15,
        views: 234,
        tags: ['famille', 'urgence', 'alimentaire'],
        language: 'fr',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Méthodes publiques pour récupérer les données
  getMutualAidCircles(): MutualAidCircle[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.CIRCLES);
    return stored ? JSON.parse(stored) : [];
  }

  getSolidarityChallenges(): SolidarityChallenge[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.CHALLENGES);
    return stored ? JSON.parse(stored) : [];
  }

  getEmergencyResponses(): EmergencyResponse[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.EMERGENCY);
    return stored ? JSON.parse(stored) : [];
  }

  getSolidarityMetrics(userId: string): SolidarityMetrics | null {
    const stored = localStorage.getItem(`${this.STORAGE_KEYS.METRICS}_${userId}`);
    return stored ? JSON.parse(stored) : null;
  }

  recordContribution(contribution: MutualAidContribution): void {
    const contributions = this.getContributions();
    contributions.push(contribution);
    localStorage.setItem(this.STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(contributions));

    // Mettre à jour la demande d'aide
    this.updateRequestWithContribution(contribution);
  }

  private updateRequestWithContribution(contribution: MutualAidContribution): void {
    const requests = this.getMutualAidRequests();
    const requestIndex = requests.findIndex(r => r.id === contribution.requestId);
    
    if (requestIndex !== -1) {
      const request = requests[requestIndex];
      request.currentAmount += contribution.amount || 0;
      request.supporters.push(contribution.contributorId);
      request.totalSupporters = request.supporters.length;
      request.averageContribution = request.currentAmount / request.totalSupporters;
      request.goalReached = request.currentAmount >= request.targetAmount;
      request.updatedAt = new Date().toISOString();
      
      localStorage.setItem(this.STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    }
  }

  getContributions(): MutualAidContribution[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.CONTRIBUTIONS);
    return stored ? JSON.parse(stored) : [];
  }

  private triggerGiftAnimation(gift: SolidarityGift, quantity: number, requestId: string): void {
    // Logique d'animation côté frontend
    console.log(`🎁 Animation: ${gift.name} x${quantity} envoyé à ${requestId}`);
  }

  private awardChallengeReward(userId: string, challenge: SolidarityChallenge): void {
    // Attribution des récompenses de défi
    this.updateSolidarityMetrics(userId, 'given', challenge.points);
  }

  private broadcastEmergencyAlert(emergency: EmergencyResponse): void {
    // Diffusion d'alerte d'urgence
    console.log(`🚨 URGENCE: ${emergency.updates[0]?.message}`);
  }
}

export const mutualAidService = new MutualAidService();
export default mutualAidService;
