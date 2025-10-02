import { 
  LeadAnalysisSession, 
  FeasibilityAnalysis, 
  LeadQualification,
  SubscriptionConditions,
  TeamNotification,
  ClientProfile,
  InsuranceType
} from '@/types/leadAnalysis';

export class LeadAnalysisService {
  private static readonly STORAGE_KEY = 'lead_analysis_sessions';
  private static readonly NOTIFICATIONS_KEY = 'team_notifications';
  
  // Conditions de souscription par assureur (anonymisées)
  private static readonly SUBSCRIPTION_CONDITIONS: SubscriptionConditions[] = [
    {
      insurerId: 'ASSUREUR_A',
      insurerDisplayName: 'Partenaire Premium',
      conditions: {
        age: { min: 25, max: 70 },
        geography: {
          acceptedZones: ['75', '92', '93', '94', '95', '77', '78', '91'],
          excludedZones: ['971', '972', '973', '974', '976']
        },
        profile: {
          acceptedProfessions: ['vtc', 'taxi', 'delivery', 'transport', 'logistics'],
          excludedProfessions: ['high_risk_sports', 'military'],
          incomeRequirements: { min: 20000, verification: true }
        },
        history: {
          maxClaims: 2,
          maxClaimsAmount: 10000,
          bonusMalusRequirements: { min: 0.5, max: 1.5 }
        },
        budget: {
          minPremium: 800,
          maxPremium: 5000
        }
      },
      mandate: {
        hasMandate: true,
        mandateType: 'preferred',
        commissionRate: 15
      }
    },
    {
      insurerId: 'ASSUREUR_B',
      insurerDisplayName: 'Solution Économique',
      conditions: {
        age: { min: 21, max: 75 },
        geography: {
          acceptedZones: ['all_france'],
          excludedZones: ['high_risk_zones']
        },
        profile: {
          acceptedProfessions: ['all'],
          excludedProfessions: ['very_high_risk'],
          incomeRequirements: { min: 15000, verification: false }
        },
        history: {
          maxClaims: 3,
          maxClaimsAmount: 15000,
          bonusMalusRequirements: { max: 2.0 }
        },
        budget: {
          minPremium: 400,
          maxPremium: 3000
        }
      },
      mandate: {
        hasMandate: true,
        mandateType: 'non_exclusive',
        commissionRate: 12
      }
    },
    {
      insurerId: 'ASSUREUR_C',
      insurerDisplayName: 'Spécialiste Professionnel',
      conditions: {
        age: { min: 23, max: 65 },
        geography: {
          acceptedZones: ['ile_de_france', 'major_cities'],
          excludedZones: []
        },
        profile: {
          acceptedProfessions: ['vtc', 'taxi', 'transport_pro'],
          excludedProfessions: [],
          incomeRequirements: { min: 30000, verification: true }
        },
        history: {
          maxClaims: 1,
          maxClaimsAmount: 5000,
          bonusMalusRequirements: { min: 0.5, max: 1.2 }
        },
        budget: {
          minPremium: 1200,
          maxPremium: 8000
        }
      },
      mandate: {
        hasMandate: true,
        mandateType: 'exclusive',
        commissionRate: 18
      }
    }
  ];

  // Analyser la faisabilité selon les conditions de souscription
  static analyzeFeasibility(session: LeadAnalysisSession): FeasibilityAnalysis {
    const profile = session.sessionData.clientProfile;
    const needs = session.sessionData.needs;
    const constraints = session.sessionData.constraints;
    const context = session.sessionData.context;
    
    const insurerAnalysis = this.SUBSCRIPTION_CONDITIONS.map(insurer => {
      const analysis = this.analyzeInsurerCompatibility(insurer, profile, needs, constraints, context);
      return analysis;
    });
    
    // Calculer le score global de faisabilité
    const overallFeasibility = this.calculateOverallFeasibility(insurerAnalysis);
    
    // Générer des recommandations
    const recommendations = this.generateRecommendations(insurerAnalysis, profile, constraints);
    
    // Générer des alertes
    const alerts = this.generateAlerts(insurerAnalysis, profile, constraints);
    
    return {
      overallFeasibility,
      insurerAnalysis,
      recommendations,
      alerts
    };
  }
  
  // Analyser la compatibilité avec un assureur spécifique
  private static analyzeInsurerCompatibility(
    insurer: SubscriptionConditions,
    profile: ClientProfile,
    needs: any,
    constraints: any,
    context: any
  ) {
    const metConditions = [];
    const obstacles = [];
    const adaptations = [];
    let feasibilityScore = 100;
    
    // Vérifier l'âge
    if (insurer.conditions.age && profile.personalInfo.age) {
      const age = profile.personalInfo.age;
      if (insurer.conditions.age.min && age < insurer.conditions.age.min) {
        obstacles.push({
          type: 'profile' as const,
          severity: 'blocking' as const,
          description: `Âge minimum requis: ${insurer.conditions.age.min} ans (actuel: ${age} ans)`,
          possibleSolutions: ['Attendre l\'âge requis', 'Rechercher un autre assureur']
        });
        feasibilityScore -= 50;
      } else if (insurer.conditions.age.max && age > insurer.conditions.age.max) {
        obstacles.push({
          type: 'profile' as const,
          severity: 'blocking' as const,
          description: `Âge maximum dépassé: ${insurer.conditions.age.max} ans (actuel: ${age} ans)`,
          possibleSolutions: ['Rechercher un assureur spécialisé seniors']
        });
        feasibilityScore -= 50;
      } else {
        metConditions.push({
          condition: 'Âge compatible',
          status: 'met' as const,
          impact: 'positive' as const,
          explanation: `Âge ${age} ans dans la fourchette acceptée`
        });
      }
    }
    
    // Vérifier la géographie
    if (insurer.conditions.geography && profile.location.postalCode) {
      const postalCode = profile.location.postalCode.substring(0, 2);
      const isAccepted = insurer.conditions.geography.acceptedZones.includes(postalCode) || 
                        insurer.conditions.geography.acceptedZones.includes('all_france');
      const isExcluded = insurer.conditions.geography.excludedZones.includes(postalCode);
      
      if (isExcluded || !isAccepted) {
        obstacles.push({
          type: 'location' as const,
          severity: 'major' as const,
          description: `Zone géographique non couverte: ${profile.location.city} (${postalCode})`,
          possibleSolutions: ['Vérifier avec un conseiller', 'Rechercher un assureur local']
        });
        feasibilityScore -= 30;
      } else {
        metConditions.push({
          condition: 'Zone géographique couverte',
          status: 'met' as const,
          impact: 'positive' as const,
          explanation: `Localisation ${profile.location.city} acceptée`
        });
      }
    }
    
    // Vérifier le budget
    if (insurer.conditions.budget && constraints.budget) {
      const clientBudget = constraints.budget.max;
      const minPremium = insurer.conditions.budget.minPremium;
      const maxPremium = insurer.conditions.budget.maxPremium;
      
      if (clientBudget < minPremium) {
        obstacles.push({
          type: 'budget' as const,
          severity: 'major' as const,
          description: `Budget insuffisant: minimum ${minPremium}€ requis (budget: ${clientBudget}€)`,
          possibleSolutions: [
            'Augmenter la franchise pour réduire la prime',
            'Réduire certaines garanties',
            'Paiement annuel pour réduction'
          ]
        });
        feasibilityScore -= 25;
        
        // Proposer des adaptations
        adaptations.push({
          type: 'deductible' as const,
          description: 'Franchise élevée pour réduire la prime',
          impact: 'Réduction estimée de 15-20% de la prime',
          costImpact: Math.round(minPremium * 0.15)
        });
      } else if (maxPremium && clientBudget > maxPremium) {
        // Budget élevé, pas un problème mais noter
        metConditions.push({
          condition: 'Budget confortable',
          status: 'met' as const,
          impact: 'positive' as const,
          explanation: `Budget ${clientBudget}€ permet toutes les options`
        });
      } else {
        metConditions.push({
          condition: 'Budget compatible',
          status: 'met' as const,
          impact: 'positive' as const,
          explanation: `Budget ${clientBudget}€ dans la fourchette acceptée`
        });
      }
    }
    
    // Vérifier l'historique
    if (insurer.conditions.history && context.insuranceHistory) {
      const claims = context.insuranceHistory.previousClaims || [];
      const maxClaims = insurer.conditions.history.maxClaims;
      
      if (claims.length > maxClaims) {
        obstacles.push({
          type: 'history' as const,
          severity: 'major' as const,
          description: `Trop de sinistres: ${claims.length} (maximum accepté: ${maxClaims})`,
          possibleSolutions: [
            'Attendre que les sinistres sortent de l\'historique',
            'Négocier avec l\'assureur',
            'Accepter une surprime'
          ]
        });
        feasibilityScore -= 20;
      } else {
        metConditions.push({
          condition: 'Historique acceptable',
          status: 'met' as const,
          impact: 'positive' as const,
          explanation: `${claims.length} sinistre(s) dans la limite acceptée`
        });
      }
    }
    
    // Déterminer le niveau d'acceptation
    let acceptanceLevel: 'accepted' | 'conditional' | 'rejected' | 'needs_review';
    if (feasibilityScore >= 80) {
      acceptanceLevel = 'accepted';
    } else if (feasibilityScore >= 60) {
      acceptanceLevel = 'conditional';
    } else if (feasibilityScore >= 40) {
      acceptanceLevel = 'needs_review';
    } else {
      acceptanceLevel = 'rejected';
    }
    
    // Estimation tarifaire si faisable
    let priceEstimate;
    if (feasibilityScore >= 60) {
      const basePremium = insurer.conditions.budget?.minPremium || 800;
      const riskMultiplier = this.calculateRiskMultiplier(profile, context);
      
      priceEstimate = {
        min: Math.round(basePremium * riskMultiplier * 0.9),
        max: Math.round(basePremium * riskMultiplier * 1.3),
        confidence: Math.min(feasibilityScore, 85),
        factors: ['Profil client', 'Historique', 'Zone géographique', 'Type de couverture']
      };
    }
    
    return {
      insurerId: insurer.insurerId,
      insurerName: insurer.insurerDisplayName,
      feasibilityScore,
      acceptanceLevel,
      metConditions,
      obstacles,
      adaptations,
      priceEstimate
    };
  }
  
  // Calculer le multiplicateur de risque
  private static calculateRiskMultiplier(profile: ClientProfile, context: any): number {
    let multiplier = 1.0;
    
    // Facteur âge
    const age = profile.personalInfo.age || 30;
    if (age < 25) multiplier += 0.3;
    else if (age > 65) multiplier += 0.2;
    else if (age >= 30 && age <= 50) multiplier -= 0.1;
    
    // Facteur historique
    const claims = context.insuranceHistory?.previousClaims?.length || 0;
    multiplier += claims * 0.15;
    
    // Facteur géographique (Paris = +10%, province = -5%)
    const postalCode = profile.location.postalCode?.substring(0, 2);
    if (postalCode === '75') multiplier += 0.1;
    else if (!['92', '93', '94', '95'].includes(postalCode || '')) multiplier -= 0.05;
    
    return Math.max(0.7, Math.min(2.5, multiplier));
  }
  
  // Calculer le score global de faisabilité
  private static calculateOverallFeasibility(insurerAnalysis: any[]): number {
    if (insurerAnalysis.length === 0) return 0;
    
    const acceptedCount = insurerAnalysis.filter(a => a.acceptanceLevel === 'accepted').length;
    const conditionalCount = insurerAnalysis.filter(a => a.acceptanceLevel === 'conditional').length;
    const reviewCount = insurerAnalysis.filter(a => a.acceptanceLevel === 'needs_review').length;
    
    if (acceptedCount > 0) return 85 + (acceptedCount * 5);
    if (conditionalCount > 0) return 65 + (conditionalCount * 5);
    if (reviewCount > 0) return 45 + (reviewCount * 5);
    
    return 25;
  }
  
  // Générer des recommandations
  private static generateRecommendations(insurerAnalysis: any[], profile: ClientProfile, constraints: any) {
    const recommendations = [];
    
    // Recommandations basées sur les obstacles communs
    const commonObstacles = this.findCommonObstacles(insurerAnalysis);
    
    commonObstacles.forEach(obstacle => {
      switch (obstacle.type) {
        case 'budget':
          recommendations.push({
            type: 'budget_adjustment' as const,
            priority: 'high' as const,
            description: 'Ajuster le budget ou optimiser les garanties',
            expectedImpact: 'Accès à plus d\'assureurs partenaires',
            actionRequired: 'Revoir les priorités de couverture ou augmenter le budget'
          });
          break;
          
        case 'history':
          recommendations.push({
            type: 'profile_improvement' as const,
            priority: 'medium' as const,
            description: 'Améliorer le profil de risque',
            expectedImpact: 'Meilleures conditions tarifaires',
            actionRequired: 'Attendre la sortie des sinistres de l\'historique'
          });
          break;
          
        case 'location':
          recommendations.push({
            type: 'alternative' as const,
            priority: 'medium' as const,
            description: 'Rechercher des assureurs spécialisés dans votre région',
            expectedImpact: 'Couverture adaptée à votre zone',
            actionRequired: 'Étude personnalisée avec nos conseillers'
          });
          break;
      }
    });
    
    // Recommandations générales
    if (insurerAnalysis.some(a => a.acceptanceLevel === 'accepted')) {
      recommendations.push({
        type: 'timing' as const,
        priority: 'high' as const,
        description: 'Profil éligible chez nos partenaires',
        expectedImpact: 'Souscription possible rapidement',
        actionRequired: 'Finaliser le dossier et choisir les garanties'
      });
    }
    
    return recommendations;
  }
  
  // Trouver les obstacles communs
  private static findCommonObstacles(insurerAnalysis: any[]) {
    const obstacleMap = new Map();
    
    insurerAnalysis.forEach(analysis => {
      analysis.obstacles.forEach((obstacle: any) => {
        const key = obstacle.type;
        if (obstacleMap.has(key)) {
          obstacleMap.set(key, obstacleMap.get(key) + 1);
        } else {
          obstacleMap.set(key, 1);
        }
      });
    });
    
    // Retourner les obstacles présents chez au moins 2 assureurs
    return Array.from(obstacleMap.entries())
      .filter(([_, count]) => count >= 2)
      .map(([type, _]) => ({ type }));
  }
  
  // Générer des alertes
  private static generateAlerts(insurerAnalysis: any[], profile: ClientProfile, constraints: any) {
    const alerts = [];
    
    // Alerte si aucun assureur n'accepte
    const acceptedCount = insurerAnalysis.filter(a => a.acceptanceLevel === 'accepted').length;
    if (acceptedCount === 0) {
      alerts.push({
        level: 'warning' as const,
        message: 'Aucun assureur partenaire ne peut accepter votre profil en l\'état',
        impact: 'Nécessite des adaptations ou recherche d\'alternatives'
      });
    }
    
    // Alerte budget
    const budgetObstacles = insurerAnalysis.filter(a => 
      a.obstacles.some((o: any) => o.type === 'budget')
    ).length;
    
    if (budgetObstacles >= 2) {
      alerts.push({
        level: 'info' as const,
        message: 'Budget serré par rapport aux tarifs du marché',
        impact: 'Options de couverture limitées'
      });
    }
    
    // Alerte profil à risque
    const historyObstacles = insurerAnalysis.filter(a => 
      a.obstacles.some((o: any) => o.type === 'history')
    ).length;
    
    if (historyObstacles >= 2) {
      alerts.push({
        level: 'warning' as const,
        message: 'Historique de sinistres impactant l\'acceptation',
        impact: 'Surprimes possibles ou garanties réduites'
      });
    }
    
    return alerts;
  }
  
  // Qualifier un lead
  static qualifyLead(session: LeadAnalysisSession, feasibilityAnalysis: FeasibilityAnalysis): LeadQualification {
    const profile = session.sessionData.clientProfile;
    const constraints = session.sessionData.constraints;
    
    // Calculer le score de qualification
    let qualificationScore = 50; // Base
    
    // Facteurs de qualification
    const qualificationFactors = [];
    
    // Faisabilité technique
    if (feasibilityAnalysis.overallFeasibility >= 80) {
      qualificationScore += 25;
      qualificationFactors.push({
        factor: 'Faisabilité technique excellente',
        score: 25,
        weight: 0.3,
        reasoning: 'Profil accepté par plusieurs assureurs'
      });
    } else if (feasibilityAnalysis.overallFeasibility >= 60) {
      qualificationScore += 15;
      qualificationFactors.push({
        factor: 'Faisabilité technique bonne',
        score: 15,
        weight: 0.3,
        reasoning: 'Profil accepté avec conditions'
      });
    }
    
    // Urgence
    if (constraints.timeline.urgency === 'immediate') {
      qualificationScore += 15;
      qualificationFactors.push({
        factor: 'Urgence élevée',
        score: 15,
        weight: 0.2,
        reasoning: 'Besoin immédiat de couverture'
      });
    }
    
    // Budget
    const hasRealisticBudget = feasibilityAnalysis.insurerAnalysis.some(a => 
      !a.obstacles.some((o: any) => o.type === 'budget')
    );
    
    if (hasRealisticBudget) {
      qualificationScore += 10;
      qualificationFactors.push({
        factor: 'Budget réaliste',
        score: 10,
        weight: 0.2,
        reasoning: 'Budget en adéquation avec les tarifs'
      });
    }
    
    // Déterminer la catégorie de lead
    let leadCategory: 'hot' | 'warm' | 'cold' | 'unqualified';
    if (qualificationScore >= 80) leadCategory = 'hot';
    else if (qualificationScore >= 60) leadCategory = 'warm';
    else if (qualificationScore >= 40) leadCategory = 'cold';
    else leadCategory = 'unqualified';
    
    // Probabilité de conversion
    const conversionProbability = Math.min(95, qualificationScore + 10);
    
    // Estimation des revenus
    const acceptedInsurers = feasibilityAnalysis.insurerAnalysis.filter(a => 
      a.acceptanceLevel === 'accepted' || a.acceptanceLevel === 'conditional'
    );
    
    const avgCommission = acceptedInsurers.length > 0 
      ? acceptedInsurers.reduce((sum, a) => {
          const insurer = this.SUBSCRIPTION_CONDITIONS.find(i => i.insurerId === a.insurerId);
          const premium = a.priceEstimate ? (a.priceEstimate.min + a.priceEstimate.max) / 2 : 1000;
          return sum + (premium * (insurer?.mandate.commissionRate || 10) / 100);
        }, 0) / acceptedInsurers.length
      : 0;
    
    const revenueEstimate = {
      commission: Math.round(avgCommission),
      confidence: Math.min(85, qualificationScore),
      timeframe: constraints.timeline.urgency === 'immediate' ? 'immediate' as const :
                 constraints.timeline.urgency === 'within_week' ? 'short_term' as const :
                 'medium_term' as const
    };
    
    // Actions recommandées
    const recommendedActions = this.generateRecommendedActions(leadCategory, feasibilityAnalysis, profile);
    
    // Objections anticipées
    const anticipatedObjections = this.generateAnticipatedObjections(feasibilityAnalysis, constraints);
    
    return {
      qualificationScore,
      leadCategory,
      conversionProbability,
      qualificationFactors,
      revenueEstimate,
      recommendedActions,
      anticipatedObjections
    };
  }
  
  // Générer les actions recommandées
  private static generateRecommendedActions(
    leadCategory: string, 
    feasibilityAnalysis: FeasibilityAnalysis, 
    profile: ClientProfile
  ) {
    const actions = [];
    
    switch (leadCategory) {
      case 'hot':
        actions.push({
          action: 'immediate_call' as const,
          priority: 1,
          timing: 'Dans les 2 heures',
          expectedOutcome: 'Prise de rendez-vous pour finalisation'
        });
        actions.push({
          action: 'send_documentation' as const,
          priority: 2,
          timing: 'Immédiatement',
          expectedOutcome: 'Préparation du client pour l\'entretien'
        });
        break;
        
      case 'warm':
        actions.push({
          action: 'schedule_meeting' as const,
          priority: 1,
          timing: 'Dans les 24 heures',
          expectedOutcome: 'Présentation personnalisée des solutions'
        });
        actions.push({
          action: 'email_follow_up' as const,
          priority: 2,
          timing: 'Dans les 4 heures',
          expectedOutcome: 'Maintenir l\'intérêt et préparer l\'entretien'
        });
        break;
        
      case 'cold':
        actions.push({
          action: 'email_follow_up' as const,
          priority: 1,
          timing: 'Dans les 48 heures',
          expectedOutcome: 'Éducation et nurturing du prospect'
        });
        actions.push({
          action: 'nurture' as const,
          priority: 2,
          timing: 'Campagne sur 2 semaines',
          expectedOutcome: 'Réchauffement progressif du lead'
        });
        break;
        
      default:
        actions.push({
          action: 'nurture' as const,
          priority: 1,
          timing: 'Campagne longue durée',
          expectedOutcome: 'Qualification future possible'
        });
    }
    
    return actions;
  }
  
  // Générer les objections anticipées
  private static generateAnticipatedObjections(feasibilityAnalysis: FeasibilityAnalysis, constraints: any) {
    const objections = [];
    
    // Objection prix
    const hasHighPrices = feasibilityAnalysis.insurerAnalysis.some(a => 
      a.priceEstimate && a.priceEstimate.min > constraints.budget.preferred
    );
    
    if (hasHighPrices) {
      objections.push({
        objection: 'C\'est trop cher par rapport à mon budget',
        probability: 70,
        suggestedResponse: 'Je comprends votre préoccupation. Regardons ensemble les options pour optimiser votre couverture selon votre budget.'
      });
    }
    
    // Objection comparaison
    objections.push({
      objection: 'Je veux comparer avec d\'autres devis',
      probability: 60,
      suggestedResponse: 'C\'est tout à fait normal. Nous travaillons déjà avec les meilleurs assureurs du marché pour vous proposer les meilleures conditions.'
    });
    
    // Objection timing
    if (constraints.timeline.urgency === 'flexible') {
      objections.push({
        objection: 'Je ne suis pas pressé, je vais réfléchir',
        probability: 50,
        suggestedResponse: 'Je comprends. Puis-je vous proposer de garder cette analyse et vous recontacter dans quelques semaines ?'
      });
    }
    
    return objections;
  }
  
  // Créer une notification pour l'équipe
  static createTeamNotification(session: LeadAnalysisSession, qualification: LeadQualification): TeamNotification {
    const profile = session.sessionData.clientProfile;
    
    let type: TeamNotification['type'];
    let priority: TeamNotification['priority'];
    
    switch (qualification.leadCategory) {
      case 'hot':
        type = 'hot_lead';
        priority = 'urgent';
        break;
      case 'warm':
        type = 'new_qualified_lead';
        priority = 'high';
        break;
      default:
        type = 'new_qualified_lead';
        priority = 'medium';
    }
    
    const notification: TeamNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      leadId: session.id,
      type,
      priority,
      title: `${qualification.leadCategory.toUpperCase()} Lead: ${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`,
      message: `Nouveau lead qualifié (${qualification.qualificationScore}%) - ${session.sessionData.needs.primaryInsurance}`,
      data: {
        clientName: `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`,
        insuranceType: session.sessionData.needs.primaryInsurance,
        qualificationScore: qualification.qualificationScore,
        revenueEstimate: qualification.revenueEstimate.commission,
        urgency: session.sessionData.constraints.timeline.urgency,
        nextAction: qualification.recommendedActions[0]?.action || 'email_follow_up'
      },
      createdAt: new Date().toISOString()
    };
    
    this.saveNotification(notification);
    return notification;
  }
  
  // Sauvegarder une session
  static saveSession(session: LeadAnalysisSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      const sessions = this.getAllSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      session.updatedAt = new Date().toISOString();
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Erreur sauvegarde session:', error);
    }
  }
  
  // Charger une session
  static getSession(sessionId: string): LeadAnalysisSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }
  
  // Obtenir toutes les sessions
  static getAllSessions(): LeadAnalysisSession[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur chargement sessions:', error);
      return [];
    }
  }
  
  // Sauvegarder une notification
  private static saveNotification(notification: TeamNotification): void {
    if (typeof window === 'undefined') return;
    
    try {
      const notifications = this.getNotifications();
      notifications.unshift(notification);
      
      // Garder seulement les 50 dernières notifications
      const limitedNotifications = notifications.slice(0, 50);
      
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(limitedNotifications));
      
      // Déclencher un événement pour notifier l'équipe
      window.dispatchEvent(new CustomEvent('newTeamNotification', { 
        detail: notification 
      }));
    } catch (error) {
      console.error('Erreur sauvegarde notification:', error);
    }
  }
  
  // Obtenir les notifications équipe
  static getNotifications(): TeamNotification[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
      return [];
    }
  }
  
  // Marquer une notification comme lue
  static markNotificationAsRead(notificationId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const notifications = this.getNotifications();
      const notification = notifications.find(n => n.id === notificationId);
      
      if (notification) {
        notification.readAt = new Date().toISOString();
        localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  }
}
