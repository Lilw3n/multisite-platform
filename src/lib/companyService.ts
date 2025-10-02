// Service complet de gestion des entreprises avec intégration APIs

import { 
  CompanyData, 
  CompanySearchCriteria, 
  CompanyApiResponse,
  CompanyVerificationResult,
  CompanyLinkVerification,
  SiretValidation,
  CompanyInsuranceProfile
} from '@/types/company';

export class CompanyService {
  private static readonly STORAGE_KEY = 'diddyhome_companies';
  
  // Base de données entreprises mock (à remplacer par vraies APIs)
  private static readonly MOCK_COMPANIES = new Map([
    ['12345678901234', {
      id: 'comp_001',
      siret: '12345678901234',
      siren: '123456789',
      nic: '01234',
      legalName: 'TRANSPORT EXPRESS DUPONT SARL',
      commercialName: 'Express Dupont',
      legalForm: 'SARL',
      legalFormCode: '5498',
      mainActivity: 'Transport routier de fret interurbain',
      naf: '4941A',
      nafLabel: 'Transports routiers de fret interurbain',
      address: {
        street: '15 Rue Pierre Curie',
        postalCode: '54110',
        city: 'Varangéville',
        country: 'France'
      },
      legalRepresentatives: [{
        firstName: 'Jean',
        lastName: 'DUPONT',
        role: 'Gérant',
        birthDate: '1975-03-15'
      }],
      capital: 10000,
      capitalCurrency: 'EUR',
      employees: 5,
      creationDate: '2015-06-01',
      status: 'active' as const,
      isActive: true,
      source: 'pappers' as const,
      lastVerified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }],
    ['98765432109876', {
      id: 'comp_002',
      siret: '98765432109876',
      siren: '987654321',
      nic: '09876',
      legalName: 'VTC PREMIUM SERVICES SAS',
      commercialName: 'VTC Premium',
      legalForm: 'SAS',
      legalFormCode: '5710',
      mainActivity: 'Transport de voyageurs par taxis',
      naf: '4932Z',
      nafLabel: 'Transports de voyageurs par taxis',
      address: {
        street: '25 Avenue de la République',
        postalCode: '75011',
        city: 'Paris',
        country: 'France'
      },
      legalRepresentatives: [{
        firstName: 'Sophie',
        lastName: 'MARTIN',
        role: 'Présidente',
        birthDate: '1982-09-22'
      }],
      capital: 50000,
      capitalCurrency: 'EUR',
      employees: 12,
      creationDate: '2018-03-12',
      status: 'active' as const,
      isActive: true,
      source: 'pappers' as const,
      lastVerified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }]
  ]);

  // Validation SIRET/SIREN
  static validateSiret(siret: string): SiretValidation {
    const cleanSiret = siret.replace(/\s/g, '');
    const result: SiretValidation = {
      isValid: false,
      siret: cleanSiret,
      siren: '',
      nic: '',
      errors: [],
      checksum: false
    };

    // Vérification longueur
    if (cleanSiret.length !== 14) {
      result.errors.push('Le SIRET doit contenir exactement 14 chiffres');
      return result;
    }

    // Vérification format numérique
    if (!/^\d{14}$/.test(cleanSiret)) {
      result.errors.push('Le SIRET ne doit contenir que des chiffres');
      return result;
    }

    // Extraction SIREN et NIC
    result.siren = cleanSiret.substring(0, 9);
    result.nic = cleanSiret.substring(9, 14);

    // Validation checksum SIREN (algorithme de Luhn modifié)
    result.checksum = this.validateSirenChecksum(result.siren);
    if (!result.checksum) {
      result.errors.push('Numéro SIREN invalide (erreur de contrôle)');
      return result;
    }

    result.isValid = true;
    return result;
  }

  // Recherche d'entreprise par différents critères
  static async searchCompany(criteria: CompanySearchCriteria): Promise<CompanyApiResponse> {
    try {
      // Recherche par SIRET
      if (criteria.siret) {
        const validation = this.validateSiret(criteria.siret);
        if (!validation.isValid) {
          return {
            success: false,
            error: `SIRET invalide: ${validation.errors.join(', ')}`,
            source: 'pappers'
          };
        }

        const companyData = this.MOCK_COMPANIES.get(criteria.siret);
        if (companyData) {
          return {
            success: true,
            data: companyData,
            source: 'pappers'
          };
        }

        // Simulation appel API Pappers
        return await this.mockPappersApiCall(criteria.siret);
      }

      // Recherche par SIREN
      if (criteria.siren) {
        for (const [siret, company] of this.MOCK_COMPANIES) {
          if (company.siren === criteria.siren) {
            return {
              success: true,
              data: company,
              source: 'pappers'
            };
          }
        }
      }

      // Recherche par nom
      if (criteria.name) {
        for (const [siret, company] of this.MOCK_COMPANIES) {
          if (company.legalName.toLowerCase().includes(criteria.name.toLowerCase()) ||
              company.commercialName?.toLowerCase().includes(criteria.name.toLowerCase())) {
            return {
              success: true,
              data: company,
              source: 'pappers'
            };
          }
        }
      }

      return {
        success: false,
        error: 'Entreprise non trouvée',
        source: 'pappers'
      };

    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de la recherche: ${error}`,
        source: 'pappers'
      };
    }
  }

  // Vérification du lien entre une personne et une entreprise
  static verifyPersonCompanyLink(
    personName: string, 
    companyData: CompanyData
  ): CompanyLinkVerification {
    const result: CompanyLinkVerification = {
      subscriberName: personName,
      companyData,
      linkType: 'no_link',
      confidence: 0,
      evidence: [],
      warnings: []
    };

    const normalizedPersonName = this.normalizeName(personName);

    // Vérification représentant légal
    for (const representative of companyData.legalRepresentatives) {
      const repName = this.normalizeName(`${representative.firstName} ${representative.lastName}`);
      const similarity = this.calculateNameSimilarity(normalizedPersonName, repName);
      
      if (similarity > 0.8) {
        result.linkType = 'legal_representative';
        result.confidence = Math.round(similarity * 100);
        result.evidence.push(`Correspondance avec ${representative.role}: ${representative.firstName} ${representative.lastName}`);
        return result;
      }
    }

    // Vérification nom dans la dénomination sociale
    if (companyData.legalName.toLowerCase().includes(personName.toLowerCase().split(' ')[0])) {
      result.linkType = 'shareholder';
      result.confidence = 60;
      result.evidence.push('Nom présent dans la dénomination sociale');
      result.warnings.push('Vérifier le lien exact avec l\'entreprise');
    }

    return result;
  }

  // Vérification complète d'une entreprise
  static verifyCompany(companyData: Partial<CompanyData>): CompanyVerificationResult {
    const result: CompanyVerificationResult = {
      isValid: true,
      exists: false,
      isActive: false,
      matchScore: 0,
      verifiedFields: [],
      discrepancies: [],
      warnings: [],
      recommendations: []
    };

    // Vérifications de base
    if (!companyData.siret) {
      result.warnings.push('SIRET manquant');
      result.matchScore -= 30;
    } else {
      const validation = this.validateSiret(companyData.siret);
      if (validation.isValid) {
        result.verifiedFields.push('SIRET valide');
        result.matchScore += 20;
      } else {
        result.discrepancies.push('SIRET invalide');
        result.matchScore -= 20;
      }
    }

    if (!companyData.legalName) {
      result.warnings.push('Dénomination sociale manquante');
      result.matchScore -= 20;
    }

    if (companyData.status === 'active') {
      result.isActive = true;
      result.verifiedFields.push('Entreprise active');
      result.matchScore += 15;
    } else {
      result.warnings.push('Statut d\'entreprise à vérifier');
    }

    // Score final
    result.matchScore = Math.max(0, Math.min(100, result.matchScore + 50));
    result.isValid = result.discrepancies.length === 0;
    result.exists = result.matchScore > 30;

    return result;
  }

  // Génération du profil d'assurance d'une entreprise
  static generateInsuranceProfile(companyData: CompanyData): CompanyInsuranceProfile {
    const profile: CompanyInsuranceProfile = {
      companyId: companyData.id,
      activityRisk: this.assessActivityRisk(companyData.naf),
      sectorRisk: this.assessSectorRisk(companyData.mainActivity),
      sizeRisk: this.assessSizeRisk(companyData.employees || 0, companyData.turnover),
      recommendedInsurances: [],
      pricingFactors: {
        turnover: companyData.turnover,
        employees: companyData.employees,
        riskExposure: 5
      },
      lastAssessment: new Date().toISOString()
    };

    // Recommandations d'assurance selon l'activité
    if (companyData.naf.startsWith('49')) { // Transport
      profile.recommendedInsurances.push(
        { type: 'rc_pro', priority: 'essential', reason: 'Responsabilité civile professionnelle obligatoire' },
        { type: 'flotte', priority: 'essential', reason: 'Assurance flotte véhicules' },
        { type: 'transport', priority: 'recommended', reason: 'Assurance marchandises transportées' }
      );
    }

    if (companyData.employees && companyData.employees > 0) {
      profile.recommendedInsurances.push(
        { type: 'multirisque', priority: 'recommended', reason: 'Protection locaux et équipements' }
      );
    }

    return profile;
  }

  // Méthodes utilitaires privées
  private static validateSirenChecksum(siren: string): boolean {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = parseInt(siren[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  }

  private static async mockPappersApiCall(siret: string): Promise<CompanyApiResponse> {
    // Simulation d'appel API avec délai
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: false,
      error: 'Entreprise non trouvée dans la base Pappers',
      source: 'pappers'
    };
  }

  private static normalizeName(name: string): string {
    return name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z\s]/g, '')
      .trim();
  }

  private static calculateNameSimilarity(name1: string, name2: string): number {
    const words1 = name1.split(' ');
    const words2 = name2.split(' ');
    
    let matches = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1 === word2 || this.levenshteinDistance(word1, word2) <= 1) {
          matches++;
          break;
        }
      }
    }
    
    return matches / Math.max(words1.length, words2.length);
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private static assessActivityRisk(naf: string): 'low' | 'medium' | 'high' {
    const highRiskNaf = ['49', '43', '81', '95']; // Transport, Construction, Services bâtiment, Réparation
    const mediumRiskNaf = ['46', '47', '68', '77']; // Commerce, Immobilier, Location
    
    const nafPrefix = naf.substring(0, 2);
    if (highRiskNaf.includes(nafPrefix)) return 'high';
    if (mediumRiskNaf.includes(nafPrefix)) return 'medium';
    return 'low';
  }

  private static assessSectorRisk(activity: string): 'low' | 'medium' | 'high' {
    const highRiskKeywords = ['transport', 'construction', 'bâtiment', 'sécurité'];
    const mediumRiskKeywords = ['commerce', 'vente', 'réparation', 'maintenance'];
    
    const activityLower = activity.toLowerCase();
    if (highRiskKeywords.some(keyword => activityLower.includes(keyword))) return 'high';
    if (mediumRiskKeywords.some(keyword => activityLower.includes(keyword))) return 'medium';
    return 'low';
  }

  private static assessSizeRisk(employees: number, turnover?: number): 'low' | 'medium' | 'high' {
    if (employees > 50 || (turnover && turnover > 5000000)) return 'high';
    if (employees > 10 || (turnover && turnover > 1000000)) return 'medium';
    return 'low';
  }

  // Méthodes de persistance
  static saveCompany(company: CompanyData): void {
    const companies = this.getAllCompanies();
    const existingIndex = companies.findIndex(c => c.id === company.id);
    
    if (existingIndex >= 0) {
      companies[existingIndex] = { ...company, updatedAt: new Date().toISOString() };
    } else {
      companies.push(company);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(companies));
  }

  static getAllCompanies(): CompanyData[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getCompanyById(id: string): CompanyData | null {
    const companies = this.getAllCompanies();
    return companies.find(c => c.id === id) || null;
  }

  static getCompanyBySiret(siret: string): CompanyData | null {
    const companies = this.getAllCompanies();
    return companies.find(c => c.siret === siret) || null;
  }

  static deleteCompany(id: string): void {
    const companies = this.getAllCompanies();
    const filtered = companies.filter(c => c.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }
}
