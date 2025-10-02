// Types pour le système de gestion des véhicules ultra-complet

export interface VehicleTechnicalData {
  // Données de base
  id: string;
  registration: string;
  registrationType: 'french' | 'foreign' | 'temporary' | 'diplomatic';
  registrationCountry?: string;
  
  // Identification véhicule
  vin?: string; // Numéro de châssis
  brand: string;
  model: string;
  version?: string;
  finish?: string; // Finition (ex: "Confort", "Sport", "Luxury")
  
  // Données techniques
  enginePower: number; // Puissance en CV
  enginePowerKw?: number; // Puissance en kW
  engineCapacity?: number; // Cylindrée en cm³
  fuelType: 'essence' | 'diesel' | 'hybrid' | 'electric' | 'gpl' | 'ethanol' | 'hydrogen';
  transmission: 'manual' | 'automatic' | 'cvt';
  seats: number; // Nombre de places
  doors: number; // Nombre de portes
  weight: number; // Poids à vide en kg
  maxWeight?: number; // PTAC en kg
  
  // Dates importantes
  firstRegistrationDate: string;
  circulationDate?: string;
  lastTechnicalControl?: string;
  nextTechnicalControl?: string;
  
  // Données économiques
  purchasePrice?: number;
  currentArgusValue?: number;
  mileage?: number;
  estimatedValue?: number; // Valeur calculée
  
  // Codes spécialisés assurance
  sraGroup?: string; // Groupe SRA (Sécurité et Réparation Automobile)
  sraClass?: string; // Classe SRA
  gtaCode?: string; // Code GTA (Groupement Technique Automobile)
  
  // Propriété et usage
  ownershipStatus: 'owned' | 'leased' | 'borrowed' | 'company' | 'third_party';
  ownerName?: string;
  ownerSiret?: string; // Si propriétaire entreprise
  usage: 'personal' | 'professional' | 'vtc' | 'taxi' | 'delivery' | 'commercial';
  
  // Vérifications
  registrationCardOwner?: string;
  ownershipVerified: boolean;
  ownershipAlerts: string[];
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
  source: 'manual' | 'api_siv' | 'api_argus' | 'plate_recognition';
}

export interface VehicleSearchCriteria {
  registration?: string;
  vin?: string;
  brand?: string;
  model?: string;
  sraCode?: string;
  gtaCode?: string;
  ownerName?: string;
  siret?: string;
}

export interface PlateRecognitionResult {
  registration: string;
  isValid: boolean;
  type: 'french' | 'foreign' | 'temporary' | 'diplomatic';
  country?: string;
  region?: string;
  format: string;
  errors: string[];
}

export interface VehicleApiResponse {
  success: boolean;
  data?: VehicleTechnicalData;
  error?: string;
  source: 'siv' | 'argus' | 'internal';
}

export interface ArgusValuation {
  vehicleId: string;
  baseValue: number;
  adjustedValue: number;
  mileageAdjustment: number;
  conditionAdjustment: number;
  marketTrend: 'stable' | 'rising' | 'falling';
  confidence: number; // 0-100%
  lastUpdated: string;
}

export interface OwnershipVerification {
  vehicleId: string;
  subscriberName: string;
  cardOwnerName: string;
  isMatch: boolean;
  matchType: 'exact' | 'company_link' | 'family_link' | 'no_match';
  companyVerification?: {
    subscriberSiret?: string;
    ownerSiret?: string;
    isLinked: boolean;
    relationship?: string;
  };
  alerts: string[];
  recommendations: string[];
}

export interface VehicleFormData {
  // Recherche initiale
  searchMethod: 'plate' | 'vin' | 'manual' | 'sra' | 'gta';
  searchValue: string;
  
  // Données techniques (si saisie manuelle)
  technicalData?: Partial<VehicleTechnicalData>;
  
  // Propriété
  ownershipInfo: {
    cardOwnerName: string;
    subscriberName: string;
    ownershipType: string;
    siretNumber?: string;
  };
  
  // Usage prévu
  intendedUsage: string;
  annualMileage?: number;
  parkingType: 'garage' | 'covered' | 'street' | 'secured_parking';
}

export interface VehicleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingData: string[];
  recommendations: string[];
  eligibilityScore: number; // 0-100
}
