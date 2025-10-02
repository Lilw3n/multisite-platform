// Service d'alertes intelligentes et suivi temporel

import {
  EligibilityCondition,
  IntelligentAlert,
  ClaimAging,
  EligibilityTracking,
  SmartReminder,
  AlertConfiguration,
  EligibilityCalculationResult
} from '@/types/intelligentAlerts';

export class IntelligentAlertsService {
  private static readonly STORAGE_KEYS = {
    conditions: 'diddyhome_eligibility_conditions',
    alerts: 'diddyhome_intelligent_alerts',
    tracking: 'diddyhome_eligibility_tracking',
    reminders: 'diddyhome_smart_reminders',
    config: 'diddyhome_alert_configuration'
  };

  // Configuration par défaut des conditions d'éligibilité
  private static readonly DEFAULT_CONDITIONS: EligibilityCondition[] = [
    {
      id: 'auto_experience_36_months',
      name: 'Expérience conduite 36 mois',
      description: 'Le conducteur doit avoir au moins 36 mois d\'expérience de conduite',
      type: 'experience',
      criteria: {
        field: 'driver.experienceMonths',
        operator: 'gte',
        value: 36,
        timeframe: 36,
        unit: 'months'
      },
      temporal: {
        isTimeDependent: true,
        checkFrequency: 'monthly',
        anticipationDays: 30
      },
      actions: {
        blockQuote: true,
        blockContract: true,
        requireApproval: false,
        createAlert: true,
        scheduleReminder: true
      },
      messages: {
        failureMessage: 'Expérience insuffisante: {currentValue} mois (requis: 36 mois)',
        alertMessage: 'Le conducteur aura 36 mois d\'expérience le {expectedDate}',
        reminderMessage: 'Recontacter le client - expérience suffisante atteinte',
        successMessage: 'Expérience de conduite suffisante'
      },
      insuranceTypes: ['auto', 'moto'],
      priority: 'high',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'auto_claims_max_3_in_36_months',
      name: 'Maximum 3 sinistres en 36 mois',
      description: 'Maximum 3 sinistres dans les 36 derniers mois pour l\'assurance auto',
      type: 'claims',
      criteria: {
        field: 'claims.count',
        operator: 'lte',
        value: 3,
        timeframe: 36,
        unit: 'months'
      },
      temporal: {
        isTimeDependent: true,
        checkFrequency: 'daily',
        anticipationDays: 7
      },
      actions: {
        blockQuote: true,
        blockContract: true,
        requireApproval: true,
        createAlert: true,
        scheduleReminder: true
      },
      messages: {
        failureMessage: 'Trop de sinistres: {currentValue} (maximum: 3 sur 36 mois)',
        alertMessage: 'Un sinistre va expirer le {expirationDate}, éligibilité possible',
        reminderMessage: 'Recontacter le client - nombre de sinistres acceptable',
        successMessage: 'Nombre de sinistres acceptable'
      },
      insuranceTypes: ['auto'],
      priority: 'critical',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'driver_min_age_21',
      name: 'Âge minimum 21 ans',
      description: 'Le conducteur principal doit avoir au moins 21 ans',
      type: 'age',
      criteria: {
        field: 'driver.age',
        operator: 'gte',
        value: 21,
        unit: 'years'
      },
      temporal: {
        isTimeDependent: true,
        checkFrequency: 'monthly',
        anticipationDays: 30
      },
      actions: {
        blockQuote: true,
        blockContract: true,
        requireApproval: false,
        createAlert: true,
        scheduleReminder: true
      },
      messages: {
        failureMessage: 'Âge insuffisant: {currentValue} ans (minimum: 21 ans)',
        alertMessage: 'Le conducteur aura 21 ans le {expectedDate}',
        reminderMessage: 'Recontacter le client - âge minimum atteint',
        successMessage: 'Âge du conducteur conforme'
      },
      insuranceTypes: ['auto', 'moto'],
      priority: 'high',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Initialisation des conditions par défaut
  static initializeDefaultConditions(): void {
    const existing = this.getAllConditions();
    if (existing.length === 0) {
      this.DEFAULT_CONDITIONS.forEach(condition => {
        this.saveCondition(condition);
      });
    }
  }

  // Calcul de l'éligibilité avec analyse temporelle
  static calculateEligibility(
    interlocutorData: any,
    insuranceType: string = 'auto'
  ): EligibilityCalculationResult {
    const conditions = this.getConditionsByInsuranceType(insuranceType);
    const result: EligibilityCalculationResult = {
      interlocutorId: interlocutorData.id,
      calculationDate: new Date().toISOString(),
      isEligible: true,
      eligibilityScore: 100,
      riskLevel: 'low',
      conditionResults: [],
      claimsAnalysis: {
        totalClaims: 0,
        activeClaims: 0,
        expiredClaims: 0,
        impactOnEligibility: 'neutral'
      },
      predictions: {
        willBecomeEligible: false,
        confidenceLevel: 0,
        keyFactors: []
      },
      actionRecommendations: []
    };

    let totalScore = 0;
    let maxScore = 0;

    // Analyse des sinistres avec vieillissement
    if (interlocutorData.claims) {
      const claimsAnalysis = this.analyzeClaimsAging(interlocutorData.claims, insuranceType);
      result.claimsAnalysis = {
        totalClaims: interlocutorData.claims.length,
        activeClaims: claimsAnalysis.activeClaims.length,
        expiredClaims: claimsAnalysis.expiredClaims.length,
        nextExpirationDate: claimsAnalysis.nextExpirationDate,
        impactOnEligibility: claimsAnalysis.activeClaims.length > 3 ? 'negative' : 'neutral'
      };
    }

    // Évaluation de chaque condition
    for (const condition of conditions) {
      const conditionResult = this.evaluateCondition(condition, interlocutorData);
      result.conditionResults.push(conditionResult);

      maxScore += conditionResult.weight;
      if (conditionResult.passed) {
        totalScore += conditionResult.weight;
      } else {
        result.isEligible = false;
        
        // Créer une alerte si nécessaire
        if (condition.actions.createAlert) {
          this.createIntelligentAlert(condition, interlocutorData, conditionResult);
        }
      }
    }

    // Calcul du score final
    result.eligibilityScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    
    // Détermination du niveau de risque
    if (result.eligibilityScore >= 80) result.riskLevel = 'low';
    else if (result.eligibilityScore >= 60) result.riskLevel = 'medium';
    else if (result.eligibilityScore >= 40) result.riskLevel = 'high';
    else result.riskLevel = 'very_high';

    // Prédictions d'éligibilité future
    result.predictions = this.predictFutureEligibility(interlocutorData, conditions);

    // Recommandations d'action
    result.actionRecommendations = this.generateActionRecommendations(result);

    return result;
  }

  // Analyse du vieillissement des sinistres
  static analyzeClaimsAging(claims: any[], insuranceType: string = 'auto'): {
    activeClaims: ClaimAging[];
    expiredClaims: ClaimAging[];
    nextExpirationDate?: string;
  } {
    const config = this.getInsuranceTypeConfig(insuranceType);
    const lookbackMonths = config.claimsLookbackMonths;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - lookbackMonths);

    const activeClaims: ClaimAging[] = [];
    const expiredClaims: ClaimAging[] = [];
    let nextExpirationDate: string | undefined;

    for (const claim of claims) {
      const claimDate = new Date(claim.date);
      const ageInMonths = this.getMonthsDifference(claimDate, new Date());
      const ageInDays = this.getDaysDifference(claimDate, new Date());
      
      const expirationDate = new Date(claimDate);
      expirationDate.setMonth(expirationDate.getMonth() + lookbackMonths);
      
      const daysUntilExpiration = this.getDaysDifference(new Date(), expirationDate);
      const isActive = ageInMonths < lookbackMonths;

      const claimAging: ClaimAging = {
        claimId: claim.id,
        interlocutorId: claim.interlocutorId,
        claimDate: claim.date,
        claimType: claim.type,
        amount: claim.amount,
        description: claim.description,
        ageInMonths,
        ageInDays,
        isActive,
        expirationDate: expirationDate.toISOString(),
        daysUntilExpiration,
        impactsEligibility: isActive,
        eligibilityWeight: isActive ? 1 : 0,
        willExpireSoon: daysUntilExpiration <= 30 && daysUntilExpiration > 0,
        willImproveEligibility: !isActive || daysUntilExpiration <= 30,
        lastUpdated: new Date().toISOString()
      };

      if (isActive) {
        activeClaims.push(claimAging);
      } else {
        expiredClaims.push(claimAging);
      }

      // Trouver la prochaine date d'expiration
      if (isActive && (!nextExpirationDate || expirationDate.toISOString() < nextExpirationDate)) {
        nextExpirationDate = expirationDate.toISOString();
      }
    }

    return { activeClaims, expiredClaims, nextExpirationDate };
  }

  // Création d'alerte intelligente
  static createIntelligentAlert(
    condition: EligibilityCondition,
    interlocutorData: any,
    conditionResult: any
  ): IntelligentAlert {
    const alert: IntelligentAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      interlocutorId: interlocutorData.id,
      type: 'eligibility_pending',
      category: 'eligibility',
      conditionId: condition.id,
      conditionName: condition.name,
      title: `Condition non respectée: ${condition.name}`,
      description: condition.messages.failureMessage
        .replace('{currentValue}', conditionResult.currentValue)
        .replace('{requiredValue}', conditionResult.requiredValue),
      currentValue: conditionResult.currentValue,
      requiredValue: conditionResult.requiredValue,
      gap: conditionResult.gap,
      triggerDate: new Date().toISOString(),
      expectedResolutionDate: this.calculateExpectedResolutionDate(condition, conditionResult),
      status: 'pending',
      priority: condition.priority,
      scheduledActions: [],
      attempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Programmer les actions automatiques
    if (condition.actions.scheduleReminder) {
      alert.scheduledActions.push({
        id: `action_${Date.now()}`,
        type: 'reminder',
        scheduledDate: alert.expectedResolutionDate,
        executed: false
      });
    }

    this.saveAlert(alert);
    return alert;
  }

  // Prédiction d'éligibilité future
  static predictFutureEligibility(interlocutorData: any, conditions: EligibilityCondition[]): {
    willBecomeEligible: boolean;
    estimatedEligibilityDate?: string;
    confidenceLevel: number;
    keyFactors: string[];
  } {
    const predictions = {
      willBecomeEligible: false,
      confidenceLevel: 0,
      keyFactors: [] as string[]
    };

    const futureChanges: Array<{ date: string; factor: string }> = [];

    // Analyser chaque condition temporelle
    for (const condition of conditions) {
      if (condition.temporal.isTimeDependent) {
        const futureDate = this.calculateWhenConditionWillBeMet(condition, interlocutorData);
        if (futureDate) {
          futureChanges.push({
            date: futureDate,
            factor: condition.name
          });
          predictions.keyFactors.push(condition.name);
        }
      }
    }

    if (futureChanges.length > 0) {
      predictions.willBecomeEligible = true;
      predictions.estimatedEligibilityDate = futureChanges
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date;
      predictions.confidenceLevel = Math.min(90, 60 + (futureChanges.length * 10));
    }

    return predictions;
  }

  // Calcul de la date de résolution attendue
  private static calculateExpectedResolutionDate(
    condition: EligibilityCondition,
    conditionResult: any
  ): string {
    const now = new Date();
    
    switch (condition.type) {
      case 'age':
        // Calculer quand la personne aura l'âge requis
        const birthDate = new Date(conditionResult.birthDate);
        const requiredAge = condition.criteria.value;
        const targetDate = new Date(birthDate);
        targetDate.setFullYear(birthDate.getFullYear() + requiredAge);
        return targetDate.toISOString();
        
      case 'experience':
        // Calculer quand l'expérience sera suffisante
        const licenseDate = new Date(conditionResult.licenseDate);
        const requiredMonths = condition.criteria.value;
        const experienceDate = new Date(licenseDate);
        experienceDate.setMonth(licenseDate.getMonth() + requiredMonths);
        return experienceDate.toISOString();
        
      case 'claims':
        // Calculer quand le sinistre le plus ancien expirera
        if (conditionResult.nextClaimExpiration) {
          return conditionResult.nextClaimExpiration;
        }
        break;
    }
    
    // Par défaut, dans 30 jours
    const defaultDate = new Date(now);
    defaultDate.setDate(defaultDate.getDate() + 30);
    return defaultDate.toISOString();
  }

  // Calcul de quand une condition sera respectée
  private static calculateWhenConditionWillBeMet(
    condition: EligibilityCondition,
    interlocutorData: any
  ): string | null {
    // Implémentation spécifique selon le type de condition
    // Retourne null si la condition ne peut pas être automatiquement respectée
    return null;
  }

  // Évaluation d'une condition
  private static evaluateCondition(condition: EligibilityCondition, data: any): any {
    const fieldValue = this.getNestedValue(data, condition.criteria.field);
    const requiredValue = condition.criteria.value;
    
    let passed = false;
    let gap = null;

    switch (condition.criteria.operator) {
      case 'gte':
        passed = fieldValue >= requiredValue;
        gap = passed ? 0 : requiredValue - fieldValue;
        break;
      case 'lte':
        passed = fieldValue <= requiredValue;
        gap = passed ? 0 : fieldValue - requiredValue;
        break;
      // Autres opérateurs...
    }

    return {
      conditionId: condition.id,
      name: condition.name,
      passed,
      currentValue: fieldValue,
      requiredValue,
      gap,
      weight: condition.priority === 'critical' ? 30 : condition.priority === 'high' ? 20 : 10,
      impact: passed ? 0 : (condition.priority === 'critical' ? -30 : condition.priority === 'high' ? -20 : -10)
    };
  }

  // Génération de recommandations d'action
  private static generateActionRecommendations(result: EligibilityCalculationResult): Array<{
    type: 'wait' | 'contact' | 'request_documents' | 'schedule_review';
    priority: 'low' | 'medium' | 'high';
    description: string;
    estimatedImpact: string;
    deadline?: string;
  }> {
    const recommendations = [];

    if (!result.isEligible && result.predictions.willBecomeEligible) {
      recommendations.push({
        type: 'wait' as const,
        priority: 'medium' as const,
        description: `Attendre jusqu'au ${result.predictions.estimatedEligibilityDate} - éligibilité prévue`,
        estimatedImpact: 'Éligibilité automatique',
        deadline: result.predictions.estimatedEligibilityDate
      });
    }

    if (result.claimsAnalysis.nextExpirationDate) {
      recommendations.push({
        type: 'schedule_review' as const,
        priority: 'high' as const,
        description: 'Programmer une révision après expiration du sinistre',
        estimatedImpact: 'Amélioration possible du score',
        deadline: result.claimsAnalysis.nextExpirationDate
      });
    }

    return recommendations;
  }

  // Utilitaires
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private static getMonthsDifference(date1: Date, date2: Date): number {
    return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
  }

  private static getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = date2.getTime() - date1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private static getInsuranceTypeConfig(insuranceType: string) {
    const configs = {
      auto: { claimsLookbackMonths: 36, maxClaimsAllowed: 3 },
      habitation: { claimsLookbackMonths: 60, maxClaimsAllowed: 2 },
      sante: { claimsLookbackMonths: 24, maxClaimsAllowed: 5 }
    };
    return configs[insuranceType as keyof typeof configs] || configs.auto;
  }

  // Méthodes CRUD
  static saveCondition(condition: EligibilityCondition): void {
    const conditions = this.getAllConditions();
    const existingIndex = conditions.findIndex(c => c.id === condition.id);
    
    if (existingIndex >= 0) {
      conditions[existingIndex] = { ...condition, updatedAt: new Date().toISOString() };
    } else {
      conditions.push(condition);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.conditions, JSON.stringify(conditions));
  }

  static getAllConditions(): EligibilityCondition[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEYS.conditions);
    return stored ? JSON.parse(stored) : [];
  }

  static getConditionsByInsuranceType(insuranceType: string): EligibilityCondition[] {
    return this.getAllConditions().filter(c => 
      c.isActive && c.insuranceTypes.includes(insuranceType)
    );
  }

  static saveAlert(alert: IntelligentAlert): void {
    const alerts = this.getAllAlerts();
    const existingIndex = alerts.findIndex(a => a.id === alert.id);
    
    if (existingIndex >= 0) {
      alerts[existingIndex] = { ...alert, updatedAt: new Date().toISOString() };
    } else {
      alerts.push(alert);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.alerts, JSON.stringify(alerts));
  }

  static getAllAlerts(): IntelligentAlert[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEYS.alerts);
    return stored ? JSON.parse(stored) : [];
  }

  static getAlertsByInterlocutor(interlocutorId: string): IntelligentAlert[] {
    return this.getAllAlerts().filter(a => a.interlocutorId === interlocutorId);
  }

  static getPendingAlerts(): IntelligentAlert[] {
    return this.getAllAlerts().filter(a => a.status === 'pending');
  }

  // Traitement automatique des alertes
  static processScheduledActions(): void {
    const alerts = this.getAllAlerts();
    const now = new Date();

    for (const alert of alerts) {
      for (const action of alert.scheduledActions) {
        if (!action.executed && new Date(action.scheduledDate) <= now) {
          this.executeScheduledAction(alert, action);
        }
      }
    }
  }

  private static executeScheduledAction(alert: IntelligentAlert, action: any): void {
    // Exécuter l'action programmée
    action.executed = true;
    action.executedDate = new Date().toISOString();
    
    switch (action.type) {
      case 'reminder':
        // Créer une relance
        this.createSmartReminder(alert);
        break;
      case 'recheck':
        // Revérifier l'éligibilité
        // TODO: Implémenter la revérification
        break;
    }
    
    this.saveAlert(alert);
  }

  private static createSmartReminder(alert: IntelligentAlert): SmartReminder {
    const reminder: SmartReminder = {
      id: `reminder_${Date.now()}`,
      alertId: alert.id,
      interlocutorId: alert.interlocutorId,
      type: 'eligibility_check',
      method: 'notification',
      title: `Relance: ${alert.title}`,
      message: `Il est temps de recontacter le client concernant: ${alert.description}`,
      scheduledDate: new Date().toISOString(),
      maxAttempts: 3,
      currentAttempts: 0,
      stopConditions: [
        { type: 'condition_met' },
        { type: 'max_attempts' }
      ],
      status: 'scheduled',
      results: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveReminder(reminder);
    return reminder;
  }

  static saveReminder(reminder: SmartReminder): void {
    const reminders = this.getAllReminders();
    const existingIndex = reminders.findIndex(r => r.id === reminder.id);
    
    if (existingIndex >= 0) {
      reminders[existingIndex] = { ...reminder, updatedAt: new Date().toISOString() };
    } else {
      reminders.push(reminder);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.reminders, JSON.stringify(reminders));
  }

  static getAllReminders(): SmartReminder[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEYS.reminders);
    return stored ? JSON.parse(stored) : [];
  }
}
