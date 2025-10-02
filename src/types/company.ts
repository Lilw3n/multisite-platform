// Types pour le système de gestion des entreprises

export interface CompanyData {
  id: string;
  
  // Identifiants officiels
  siret: string;
  siren: string;
  nic?: string; // Numéro Interne de Classement
  rcs?: string; // Registre du Commerce et des Sociétés
  
  // Informations de base
  legalName: string; // Dénomination sociale
  commercialName?: string; // Nom commercial
  tradeName?: string; // Enseigne
  
  // Forme juridique
  legalForm: string; // SARL, SAS, EURL, etc.
  legalFormCode?: string; // Code forme juridique INSEE
  
  // Activité
  mainActivity: string; // Activité principale
  naf: string; // Code NAF/APE
  nafLabel: string; // Libellé NAF
  
  // Adresse du siège social
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Dirigeants
  legalRepresentatives: Array<{
    firstName: string;
    lastName: string;
    role: string; // Président, Gérant, etc.
    birthDate?: string;
    nationality?: string;
  }>;
  
  // Informations financières
  capital?: number;
  capitalCurrency?: string;
  turnover?: number;
  employees?: number;
  
  // Dates importantes
  creationDate: string;
  registrationDate?: string;
  lastUpdate?: string;
  
  // Statut
  status: 'active' | 'inactive' | 'dissolved' | 'liquidation';
  isActive: boolean;
  
  // Informations complémentaires
  website?: string;
  email?: string;
  phone?: string;
  
  // Scores et évaluations
  creditScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  
  // Métadonnées
  source: 'pappers' | 'insee' | 'societe_com' | 'manual';
  lastVerified: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySearchCriteria {
  siret?: string;
  siren?: string;
  name?: string;
  address?: string;
  naf?: string;
  postalCode?: string;
  city?: string;
}

export interface CompanyApiResponse {
  success: boolean;
  data?: CompanyData;
  error?: string;
  source: 'pappers' | 'insee' | 'societe_com';
}

export interface CompanyVerificationResult {
  isValid: boolean;
  exists: boolean;
  isActive: boolean;
  matchScore: number; // 0-100%
  verifiedFields: string[];
  discrepancies: string[];
  warnings: string[];
  recommendations: string[];
}

export interface CompanyLinkVerification {
  subscriberName: string;
  companyData: CompanyData;
  linkType: 'legal_representative' | 'employee' | 'shareholder' | 'no_link';
  confidence: number; // 0-100%
  evidence: string[];
  warnings: string[];
}

export interface CompanyFormData {
  // Recherche initiale
  searchMethod: 'siret' | 'siren' | 'name' | 'manual';
  searchValue: string;
  
  // Données manuelles (si pas trouvé en API)
  manualData?: {
    legalName: string;
    commercialName?: string;
    legalForm: string;
    mainActivity: string;
    address: {
      street: string;
      postalCode: string;
      city: string;
    };
    legalRepresentative: {
      firstName: string;
      lastName: string;
      role: string;
    };
  };
  
  // Vérifications
  subscriberLink?: {
    subscriberName: string;
    relationship: string;
    verified: boolean;
  };
}

export interface SiretValidation {
  isValid: boolean;
  siret: string;
  siren: string;
  nic: string;
  errors: string[];
  checksum: boolean;
}

export interface CompanyInsuranceProfile {
  companyId: string;
  
  // Profil de risque
  activityRisk: 'low' | 'medium' | 'high';
  sectorRisk: 'low' | 'medium' | 'high';
  sizeRisk: 'low' | 'medium' | 'high';
  
  // Besoins d'assurance identifiés
  recommendedInsurances: Array<{
    type: 'rc_pro' | 'multirisque' | 'cyber' | 'transport' | 'flotte';
    priority: 'essential' | 'recommended' | 'optional';
    reason: string;
  }>;
  
  // Facteurs de tarification
  pricingFactors: {
    turnover?: number;
    employees?: number;
    vehicles?: number;
    premises?: number;
    riskExposure: number; // 1-10
  };
  
  // Historique
  previousClaims?: Array<{
    date: string;
    type: string;
    amount: number;
  }>;
  
  lastAssessment: string;
}
