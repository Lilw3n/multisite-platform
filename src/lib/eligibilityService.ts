import { Interlocutor, Driver, Vehicle, Claim } from '@/types/interlocutor';

// Types pour les critères d'éligibilité
export interface EligibilityCriteria {
  product: string;
  antecedentsRequired: string;
  antecedentsType: string;
  bonusRequired: string;
  ageRequired: string;
  licenseSeniority: string;
  maxClaims36Months: {
    bodily: { responsible: number; nonResponsible: number };
    material: { responsible: number; nonResponsible: number };
    parking: number;
    glassBreakage: number;
    theftFire: number;
    aggravatingCases: number;
  };
  responsibilityRules: string;
}

// Configuration des produits d'assurance
export const INSURANCE_PRODUCTS: EligibilityCriteria[] = [
  {
    product: 'Zéphir VTC Taxi',
    antecedentsRequired: '12 mois VTC, 0 mois pour Taxi',
    antecedentsType: 'VTC (Taxi sans exigence)',
    bonusRequired: '≤ 1.50',
    ageRequired: '25 à 65 ans',
    licenseSeniority: 'depuis > 5 ans',
    maxClaims36Months: {
      bodily: { responsible: 1, nonResponsible: 1 },
      material: { responsible: 3, nonResponsible: 3 },
      parking: 1,
      glassBreakage: 2,
      theftFire: 1,
      aggravatingCases: 0
    },
    responsibilityRules: 'Accepté si responsable ou non, hors cas aggravants'
  },
  {
    product: 'Solly Azar VTC',
    antecedentsRequired: '33 mois sur les 36 derniers mois',
    antecedentsType: 'Particuliers acceptés',
    bonusRequired: 'entre 0.85 et 0.50',
    ageRequired: '27 à 65 ans',
    licenseSeniority: 'depuis ≥ 5 ans',
    maxClaims36Months: {
      bodily: { responsible: 0, nonResponsible: 1 },
      material: { responsible: 2, nonResponsible: 3 },
      parking: 0,
      glassBreakage: 2,
      theftFire: 1,
      aggravatingCases: 0
    },
    responsibilityRules: 'Aucun corporel responsable accepté'
  },
  {
    product: '2M2A VTC Taxi',
    antecedentsRequired: '12 mois sans interruption en VTC',
    antecedentsType: 'VTC et plus récemment, Taxi',
    bonusRequired: 'entre 0.50 et 1.00',
    ageRequired: 'Non précisé (Permis 3 ans min)',
    licenseSeniority: 'depuis ≥ 3 ans (ou 2 ans conduite accompagnée)',
    maxClaims36Months: {
      bodily: { responsible: 0, nonResponsible: 0 },
      material: { responsible: 0, nonResponsible: 0 },
      parking: 0,
      glassBreakage: 0,
      theftFire: 0,
      aggravatingCases: 0
    },
    responsibilityRules: 'Corporel responsable interdit, aucun sinistre sur 12 derniers mois'
  },
  {
    product: 'Avace Assurance VTC',
    antecedentsRequired: '36 mois perso (débutant) ou 12 mois pro (expérimenté)',
    antecedentsType: 'Particuliers acceptés',
    bonusRequired: '1.50 (expérimentés) / 0.50 à 1.50 (débutants)',
    ageRequired: '> 25 ans et 1 jour',
    licenseSeniority: 'valide',
    maxClaims36Months: {
      bodily: { responsible: 0, nonResponsible: 0 },
      material: { responsible: 3, nonResponsible: 0 },
      parking: 0,
      glassBreakage: 0,
      theftFire: 0,
      aggravatingCases: 0
    },
    responsibilityRules: 'Max 2 sinistres 100% responsables'
  }
];

// Interface pour les résultats d'éligibilité
export interface EligibilityResult {
  product: string;
  eligible: boolean;
  score: number; // Score de 0 à 100
  reasons: string[];
  warnings: string[];
  missingInfo: string[];
}

// Interface pour les données d'évaluation
export interface EvaluationData {
  interlocutor: Interlocutor;
  driver?: Driver;
  vehicle?: Vehicle;
  claims?: Claim[];
  bonusMalus?: number;
  licenseDate?: string;
  antecedentsMonths?: number;
  antecedentsType?: 'VTC' | 'Taxi' | 'Particulier';
}

export class EligibilityService {
  /**
   * Évalue l'éligibilité d'un interlocuteur pour tous les produits
   */
  static evaluateEligibility(data: EvaluationData): EligibilityResult[] {
    return INSURANCE_PRODUCTS.map(product => 
      this.evaluateProductEligibility(data, product)
    );
  }

  /**
   * Évalue l'éligibilité pour un produit spécifique
   */
  private static evaluateProductEligibility(
    data: EvaluationData, 
    product: EligibilityCriteria
  ): EligibilityResult {
    const reasons: string[] = [];
    const warnings: string[] = [];
    const missingInfo: string[] = [];
    let score = 100;

    // Vérification de l'âge
    if (data.interlocutor && this.checkAge(data.interlocutor, product)) {
      reasons.push(`✅ Âge conforme (${product.ageRequired})`);
    } else {
      reasons.push(`❌ Âge non conforme (${product.ageRequired})`);
      score -= 30;
    }

    // Vérification de l'ancienneté du permis
    if (data.licenseDate && this.checkLicenseSeniority(data.licenseDate, product)) {
      reasons.push(`✅ Ancienneté permis conforme (${product.licenseSeniority})`);
    } else {
      reasons.push(`❌ Ancienneté permis non conforme (${product.licenseSeniority})`);
      missingInfo.push('Date d\'obtention du permis');
      score -= 25;
    }

    // Vérification du bonus-malus
    if (data.bonusMalus !== undefined && this.checkBonusMalus(data.bonusMalus, product)) {
      reasons.push(`✅ Bonus-malus conforme (${product.bonusRequired})`);
    } else {
      reasons.push(`❌ Bonus-malus non conforme (${product.bonusRequired})`);
      missingInfo.push('Coefficient bonus-malus');
      score -= 20;
    }

    // Vérification des antécédents
    if (data.antecedentsMonths !== undefined && data.antecedentsType) {
      if (this.checkAntecedents(data.antecedentsMonths, data.antecedentsType, product)) {
        reasons.push(`✅ Antécédents conformes (${product.antecedentsRequired})`);
      } else {
        reasons.push(`❌ Antécédents non conformes (${product.antecedentsRequired})`);
        score -= 15;
      }
    } else {
      missingInfo.push('Durée des antécédents d\'assurance');
      warnings.push('Impossible de vérifier les antécédents');
    }

    // Vérification de la sinistralité
    if (data.claims && this.checkClaims(data.claims, product)) {
      reasons.push(`✅ Sinistralité conforme`);
    } else if (data.claims) {
      reasons.push(`❌ Sinistralité non conforme`);
      score -= 20;
    } else {
      missingInfo.push('Historique des sinistres');
      warnings.push('Impossible de vérifier la sinistralité');
    }

    // Calcul de l'éligibilité finale
    const eligible = score >= 70 && missingInfo.length === 0;

    return {
      product: product.product,
      eligible,
      score: Math.max(0, score),
      reasons,
      warnings,
      missingInfo
    };
  }

  /**
   * Vérifie l'âge de l'interlocuteur
   */
  private static checkAge(interlocutor: Interlocutor, product: EligibilityCriteria): boolean {
    // Pour simplifier, on utilise la date de création comme date de naissance
    // Dans un vrai système, il faudrait avoir une vraie date de naissance
    const age = this.calculateAge(interlocutor.createdAt);
    
    if (product.ageRequired.includes('25 à 65')) {
      return age >= 25 && age <= 65;
    } else if (product.ageRequired.includes('27 à 65')) {
      return age >= 27 && age <= 65;
    } else if (product.ageRequired.includes('> 25')) {
      return age > 25;
    }
    
    return true; // Si pas de critère d'âge spécifique
  }

  /**
   * Calcule l'âge approximatif basé sur la date de création
   */
  private static calculateAge(createdAt: string): number {
    const birthYear = new Date(createdAt).getFullYear() - 30; // Approximation
    return new Date().getFullYear() - birthYear;
  }

  /**
   * Vérifie l'ancienneté du permis
   */
  private static checkLicenseSeniority(licenseDate: string, product: EligibilityCriteria): boolean {
    const licenseYear = new Date(licenseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const seniority = currentYear - licenseYear;

    if (product.licenseSeniority.includes('> 5 ans')) {
      return seniority > 5;
    } else if (product.licenseSeniority.includes('≥ 5 ans')) {
      return seniority >= 5;
    } else if (product.licenseSeniority.includes('≥ 3 ans')) {
      return seniority >= 3;
    }
    
    return true; // Si pas de critère spécifique
  }

  /**
   * Vérifie le bonus-malus
   */
  private static checkBonusMalus(bonusMalus: number, product: EligibilityCriteria): boolean {
    if (product.bonusRequired.includes('≤ 1.50')) {
      return bonusMalus <= 1.50;
    } else if (product.bonusRequired.includes('entre 0.85 et 0.50')) {
      return bonusMalus >= 0.50 && bonusMalus <= 0.85;
    } else if (product.bonusRequired.includes('entre 0.50 et 1.00')) {
      return bonusMalus >= 0.50 && bonusMalus <= 1.00;
    } else if (product.bonusRequired.includes('1.50')) {
      return bonusMalus <= 1.50;
    }
    
    return true;
  }

  /**
   * Vérifie les antécédents
   */
  private static checkAntecedents(
    months: number, 
    type: 'VTC' | 'Taxi' | 'Particulier', 
    product: EligibilityCriteria
  ): boolean {
    if (product.antecedentsRequired.includes('12 mois VTC')) {
      return months >= 12 && type === 'VTC';
    } else if (product.antecedentsRequired.includes('33 mois')) {
      return months >= 33;
    } else if (product.antecedentsRequired.includes('36 mois')) {
      return months >= 36;
    }
    
    return true;
  }

  /**
   * Vérifie la sinistralité
   */
  private static checkClaims(claims: Claim[], product: EligibilityCriteria): boolean {
    const last36Months = new Date();
    last36Months.setMonth(last36Months.getMonth() - 36);
    
    const recentClaims = claims.filter(claim => 
      new Date(claim.date) >= last36Months
    );

    const bodilyResponsible = recentClaims.filter(c => 
      c.type.includes('bodily') && c.responsible
    ).length;
    
    const bodilyNonResponsible = recentClaims.filter(c => 
      c.type.includes('bodily') && !c.responsible
    ).length;
    
    const materialResponsible = recentClaims.filter(c => 
      c.type.includes('material') && c.responsible
    ).length;
    
    const materialNonResponsible = recentClaims.filter(c => 
      c.type.includes('material') && !c.responsible
    ).length;

    const glassBreakage = recentClaims.filter(c => 
      c.type === 'glassBreakage'
    ).length;
    
    const theftFire = recentClaims.filter(c => 
      c.type === 'theft' || c.type === 'fire'
    ).length;

    // Vérification selon les critères du produit
    const maxBodilyResp = product.maxClaims36Months.bodily.responsible;
    const maxBodilyNonResp = product.maxClaims36Months.bodily.nonResponsible;
    const maxMaterialResp = product.maxClaims36Months.material.responsible;
    const maxMaterialNonResp = product.maxClaims36Months.material.nonResponsible;
    const maxGlass = product.maxClaims36Months.glassBreakage;
    const maxTheftFire = product.maxClaims36Months.theftFire;

    return (
      bodilyResponsible <= maxBodilyResp &&
      bodilyNonResponsible <= maxBodilyNonResp &&
      materialResponsible <= maxMaterialResp &&
      materialNonResponsible <= maxMaterialNonResp &&
      glassBreakage <= maxGlass &&
      theftFire <= maxTheftFire
    );
  }

  /**
   * Génère un rapport d'éligibilité détaillé
   */
  static generateEligibilityReport(data: EvaluationData): {
    results: EligibilityResult[];
    summary: {
      totalProducts: number;
      eligibleProducts: number;
      bestMatch: EligibilityResult | null;
      recommendations: string[];
    };
  } {
    const results = this.evaluateEligibility(data);
    const eligibleProducts = results.filter(r => r.eligible);
    const bestMatch = eligibleProducts.length > 0 
      ? eligibleProducts.reduce((best, current) => 
          current.score > best.score ? current : best
        )
      : null;

    const recommendations: string[] = [];
    
    if (eligibleProducts.length === 0) {
      recommendations.push('Aucun produit d\'assurance éligible trouvé');
      recommendations.push('Vérifiez les informations manquantes et les critères non conformes');
    } else if (eligibleProducts.length === 1) {
      recommendations.push(`Un seul produit éligible : ${bestMatch?.product}`);
    } else {
      recommendations.push(`${eligibleProducts.length} produits éligibles trouvés`);
      recommendations.push(`Meilleur match : ${bestMatch?.product} (score: ${bestMatch?.score}%)`);
    }

    return {
      results,
      summary: {
        totalProducts: results.length,
        eligibleProducts: eligibleProducts.length,
        bestMatch,
        recommendations
      }
    };
  }
}
