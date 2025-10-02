// Types pour la géolocalisation et gestion des pays

export interface GeolocationData {
  id: string;
  
  // Données IP
  ipAddress: string;
  ipVersion: 'v4' | 'v6';
  
  // Localisation
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2 (FR, DE, etc.)
  region?: string;
  regionCode?: string;
  city?: string;
  postalCode?: string;
  
  // Coordonnées
  latitude?: number;
  longitude?: number;
  accuracy?: number; // en mètres
  
  // Informations techniques
  timezone?: string;
  isp?: string;
  organization?: string;
  asn?: string;
  
  // Détection
  isVPN: boolean;
  isProxy: boolean;
  isTor: boolean;
  isMobile: boolean;
  
  // Conformité
  isEU: boolean;
  requiresGDPR: boolean;
  
  // Métadonnées
  source: 'ip_api' | 'browser_geolocation' | 'manual' | 'maxmind';
  confidence: number; // 0-100%
  detectedAt: string;
  lastUpdated: string;
}

export interface CountryRestrictions {
  countryCode: string;
  countryName: string;
  
  // Restrictions d'assurance
  insuranceRestrictions: {
    canSellInsurance: boolean;
    allowedTypes: InsuranceType[];
    restrictedTypes: InsuranceType[];
    requiresLocalLicense: boolean;
    requiresLocalPartner: boolean;
    minimumCapital?: number;
  };
  
  // Restrictions véhicules
  vehicleRestrictions: {
    acceptsForeignPlates: boolean;
    requiresLocalRegistration: boolean;
    temporaryAllowedDays?: number;
    requiresInternationalPermit: boolean;
  };
  
  // Conformité réglementaire
  compliance: {
    gdprApplies: boolean;
    dataRetentionDays: number;
    requiresExplicitConsent: boolean;
    allowsCookies: boolean;
    requiresDataProcessingAgreement: boolean;
  };
  
  // Restrictions commerciales
  commercialRestrictions: {
    canCreateAccount: boolean;
    canPurchaseOnline: boolean;
    requiresPhysicalPresence: boolean;
    allowedPaymentMethods: PaymentMethod[];
    taxRate?: number;
    currency: string;
  };
  
  // Messages et avertissements
  messages: {
    welcomeMessage?: string;
    restrictionWarning?: string;
    complianceNotice?: string;
    redirectUrl?: string;
  };
  
  // Métadonnées
  isActive: boolean;
  lastUpdated: string;
}

export interface UserGeolocationProfile {
  userId: string;
  
  // Localisation détectée
  detectedLocation: GeolocationData;
  
  // Localisation déclarée (si différente)
  declaredLocation?: {
    country: string;
    countryCode: string;
    city?: string;
    postalCode?: string;
    verified: boolean;
    verificationMethod?: 'document' | 'address' | 'phone' | 'bank';
  };
  
  // Historique des localisations
  locationHistory: Array<{
    location: GeolocationData;
    timestamp: string;
    sessionId?: string;
  }>;
  
  // Consentements
  consents: {
    geolocationConsent: boolean;
    dataProcessingConsent: boolean;
    marketingConsent: boolean;
    cookiesConsent: boolean;
    consentDate: string;
    consentVersion: string;
  };
  
  // Restrictions applicables
  applicableRestrictions: CountryRestrictions;
  
  // Statut de vérification
  verificationStatus: {
    locationVerified: boolean;
    identityVerified: boolean;
    addressVerified: boolean;
    documentsVerified: boolean;
    lastVerification?: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export type InsuranceType = 
  | 'auto' 
  | 'moto' 
  | 'habitation' 
  | 'sante' 
  | 'vie' 
  | 'prevoyance' 
  | 'rc_pro' 
  | 'multirisque' 
  | 'cyber' 
  | 'transport' 
  | 'flotte';

export type PaymentMethod = 
  | 'card' 
  | 'sepa' 
  | 'paypal' 
  | 'bank_transfer' 
  | 'crypto' 
  | 'cash';

export interface GeolocationApiResponse {
  success: boolean;
  data?: GeolocationData;
  error?: string;
  source: string;
}

export interface CountryValidationResult {
  isAllowed: boolean;
  restrictions: string[];
  warnings: string[];
  recommendations: string[];
  requiredActions: string[];
  allowedServices: string[];
  blockedServices: string[];
}

export interface GeolocationSettings {
  // APIs de géolocalisation
  enableIPGeolocation: boolean;
  enableBrowserGeolocation: boolean;
  primaryProvider: 'ip_api' | 'maxmind' | 'ipinfo' | 'ipstack';
  fallbackProviders: string[];
  
  // Précision et cache
  cacheLocationMinutes: number;
  requireHighAccuracy: boolean;
  maxLocationAge: number; // millisecondes
  
  // Conformité
  requireConsentForGeolocation: boolean;
  showLocationInUI: boolean;
  allowLocationOverride: boolean;
  
  // Restrictions
  enableCountryRestrictions: boolean;
  blockVPNUsers: boolean;
  blockProxyUsers: boolean;
  blockTorUsers: boolean;
  
  // Notifications
  notifyLocationChanges: boolean;
  notifyRestrictedAccess: boolean;
  
  lastUpdated: string;
}
