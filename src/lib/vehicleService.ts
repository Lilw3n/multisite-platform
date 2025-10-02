// Service complet de gestion des véhicules avec reconnaissance de plaques

import { 
  VehicleTechnicalData, 
  VehicleSearchCriteria, 
  PlateRecognitionResult, 
  VehicleApiResponse,
  ArgusValuation,
  OwnershipVerification,
  VehicleValidationResult 
} from '@/types/vehicle';

export class VehicleService {
  private static readonly STORAGE_KEY = 'diddyhome_vehicles';
  
  // Patterns de reconnaissance des plaques d'immatriculation
  private static readonly PLATE_PATTERNS = {
    // Format français standard (AB-123-CD)
    french_standard: /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/,
    
    // Format français provisoire (WW-123-WW ou 123-WW-12)
    french_temporary: /^(WW-[0-9]{3}-WW|[0-9]{3}-WW-[0-9]{2})$/,
    
    // Ancien format français (123 ABC 12)
    french_old: /^[0-9]{1,4}\s[A-Z]{1,3}\s[0-9]{2}$/,
    
    // Format diplomatique (CMD 123 ou CD 123 12)
    diplomatic: /^(CMD|CD)\s[0-9]{3}(\s[0-9]{2})?$/,
    
    // Formats étrangers courants
    german: /^[A-Z]{1,3}-[A-Z]{1,2}\s[0-9]{1,4}[A-Z]?$/,
    belgian: /^[0-9]-[A-Z]{3}-[0-9]{3}$/,
    spanish: /^[0-9]{4}\s[A-Z]{3}$/,
    italian: /^[A-Z]{2}\s[0-9]{3}\s[A-Z]{2}$/,
  };

  // Base de données véhicules (simulation - à remplacer par vraie API)
  private static readonly MOCK_VEHICLE_DATABASE = new Map([
    ['AB-123-CD', {
      id: 'vh_001',
      registration: 'AB-123-CD',
      registrationType: 'french' as const,
      brand: 'Peugeot',
      model: '308',
      version: '1.6 BlueHDi',
      finish: 'Allure',
      enginePower: 120,
      enginePowerKw: 88,
      engineCapacity: 1560,
      fuelType: 'diesel' as const,
      transmission: 'manual' as const,
      seats: 5,
      doors: 5,
      weight: 1320,
      firstRegistrationDate: '2020-03-15',
      currentArgusValue: 18500,
      sraGroup: 'E12',
      sraClass: '12',
      gtaCode: 'PE308HDI',
      ownershipStatus: 'owned' as const,
      usage: 'personal' as const,
      ownershipVerified: true,
      ownershipAlerts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'api_siv' as const
    }],
    ['WW-456-WW', {
      id: 'vh_002',
      registration: 'WW-456-WW',
      registrationType: 'temporary' as const,
      brand: 'Renault',
      model: 'Clio',
      version: '1.0 TCe',
      finish: 'Zen',
      enginePower: 100,
      enginePowerKw: 74,
      engineCapacity: 999,
      fuelType: 'essence' as const,
      transmission: 'manual' as const,
      seats: 5,
      doors: 5,
      weight: 1050,
      firstRegistrationDate: '2024-01-10',
      currentArgusValue: 16800,
      sraGroup: 'D8',
      sraClass: '8',
      gtaCode: 'RECLIO100',
      ownershipStatus: 'owned' as const,
      usage: 'personal' as const,
      ownershipVerified: false,
      ownershipAlerts: ['Immatriculation provisoire - Demander immatriculation définitive'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'api_siv' as const
    }]
  ]);

  // Reconnaissance de plaque d'immatriculation
  static recognizePlate(plate: string): PlateRecognitionResult {
    const cleanPlate = plate.toUpperCase().trim();
    const result: PlateRecognitionResult = {
      registration: cleanPlate,
      isValid: false,
      type: 'french',
      format: 'unknown',
      errors: []
    };

    // Test format français standard
    if (this.PLATE_PATTERNS.french_standard.test(cleanPlate)) {
      result.isValid = true;
      result.type = 'french';
      result.format = 'standard';
      result.country = 'FR';
      
      // Extraction de la région (2 derniers chiffres)
      const regionCode = cleanPlate.slice(-2);
      result.region = this.getRegionFromCode(regionCode);
      
      return result;
    }

    // Test format français provisoire (WW)
    if (this.PLATE_PATTERNS.french_temporary.test(cleanPlate)) {
      result.isValid = true;
      result.type = 'temporary';
      result.format = 'provisional';
      result.country = 'FR';
      result.errors.push('Immatriculation provisoire - Prévoir demande d\'immatriculation définitive');
      
      return result;
    }

    // Test ancien format français
    if (this.PLATE_PATTERNS.french_old.test(cleanPlate)) {
      result.isValid = true;
      result.type = 'french';
      result.format = 'old_french';
      result.country = 'FR';
      
      return result;
    }

    // Test format diplomatique
    if (this.PLATE_PATTERNS.diplomatic.test(cleanPlate)) {
      result.isValid = true;
      result.type = 'diplomatic';
      result.format = 'diplomatic';
      result.country = 'FR';
      
      return result;
    }

    // Test formats étrangers
    const foreignFormats = [
      { pattern: this.PLATE_PATTERNS.german, country: 'DE', type: 'german' },
      { pattern: this.PLATE_PATTERNS.belgian, country: 'BE', type: 'belgian' },
      { pattern: this.PLATE_PATTERNS.spanish, country: 'ES', type: 'spanish' },
      { pattern: this.PLATE_PATTERNS.italian, country: 'IT', type: 'italian' }
    ];

    for (const format of foreignFormats) {
      if (format.pattern.test(cleanPlate)) {
        result.isValid = true;
        result.type = 'foreign';
        result.format = format.type;
        result.country = format.country;
        result.errors.push('Immatriculation étrangère - Vérifier éligibilité souscription');
        
        return result;
      }
    }

    // Aucun format reconnu
    result.errors.push('Format d\'immatriculation non reconnu');
    return result;
  }

  // Recherche de véhicule par différents critères
  static async searchVehicle(criteria: VehicleSearchCriteria): Promise<VehicleApiResponse> {
    try {
      // Simulation d'appel API - à remplacer par vraies APIs
      if (criteria.registration) {
        const vehicleData = this.MOCK_VEHICLE_DATABASE.get(criteria.registration);
        if (vehicleData) {
          return {
            success: true,
            data: vehicleData,
            source: 'siv'
          };
        }
      }

      // Recherche par VIN
      if (criteria.vin) {
        // Simulation recherche VIN
        return {
          success: false,
          error: 'VIN non trouvé dans la base de données',
          source: 'siv'
        };
      }

      // Recherche par codes SRA/GTA
      if (criteria.sraCode || criteria.gtaCode) {
        // Simulation recherche par codes
        return {
          success: false,
          error: 'Code SRA/GTA non trouvé',
          source: 'internal'
        };
      }

      return {
        success: false,
        error: 'Aucun critère de recherche valide fourni',
        source: 'internal'
      };

    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de la recherche: ${error}`,
        source: 'internal'
      };
    }
  }

  // Calcul de la valeur Argus avec ajustements
  static calculateArgusValue(
    baseValue: number, 
    mileage: number, 
    registrationDate: string,
    condition: 'excellent' | 'good' | 'average' | 'poor' = 'good'
  ): ArgusValuation {
    const registrationYear = new Date(registrationDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - registrationYear;

    // Ajustement kilométrage (référence: 15000 km/an)
    const expectedMileage = vehicleAge * 15000;
    const mileageDifference = mileage - expectedMileage;
    const mileageAdjustment = Math.max(-0.3, Math.min(0.1, -mileageDifference / 100000));

    // Ajustement état
    const conditionAdjustments = {
      excellent: 0.1,
      good: 0,
      average: -0.15,
      poor: -0.35
    };

    const conditionAdjustment = conditionAdjustments[condition];
    const totalAdjustment = 1 + mileageAdjustment + conditionAdjustment;
    const adjustedValue = Math.round(baseValue * totalAdjustment);

    return {
      vehicleId: '',
      baseValue,
      adjustedValue,
      mileageAdjustment: Math.round(baseValue * mileageAdjustment),
      conditionAdjustment: Math.round(baseValue * conditionAdjustment),
      marketTrend: 'stable',
      confidence: 85,
      lastUpdated: new Date().toISOString()
    };
  }

  // Vérification de propriété
  static verifyOwnership(
    subscriberName: string,
    cardOwnerName: string,
    subscriberSiret?: string
  ): OwnershipVerification {
    const result: OwnershipVerification = {
      vehicleId: '',
      subscriberName,
      cardOwnerName,
      isMatch: false,
      matchType: 'no_match',
      alerts: [],
      recommendations: []
    };

    // Correspondance exacte
    if (subscriberName.toLowerCase() === cardOwnerName.toLowerCase()) {
      result.isMatch = true;
      result.matchType = 'exact';
      return result;
    }

    // Vérification entreprise si SIRET fourni
    if (subscriberSiret) {
      // Simulation vérification SIRET (à remplacer par API Pappers/INSEE)
      const companyInfo = this.mockCompanyLookup(subscriberSiret);
      if (companyInfo && companyInfo.legalRepresentative === cardOwnerName) {
        result.isMatch = true;
        result.matchType = 'company_link';
        result.companyVerification = {
          subscriberSiret,
          isLinked: true,
          relationship: 'Représentant légal'
        };
        return result;
      }
    }

    // Pas de correspondance
    result.alerts.push('Propriétaire carte grise différent du souscripteur');
    result.recommendations.push('Vérifier le lien entre souscripteur et propriétaire');
    result.recommendations.push('Demander justificatifs de propriété ou d\'usage');

    return result;
  }

  // Validation complète d'un véhicule
  static validateVehicle(vehicleData: Partial<VehicleTechnicalData>): VehicleValidationResult {
    const result: VehicleValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      missingData: [],
      recommendations: [],
      eligibilityScore: 100
    };

    // Vérifications obligatoires
    if (!vehicleData.registration) {
      result.errors.push('Numéro d\'immatriculation requis');
      result.eligibilityScore -= 30;
    }

    if (!vehicleData.brand || !vehicleData.model) {
      result.errors.push('Marque et modèle requis');
      result.eligibilityScore -= 20;
    }

    if (!vehicleData.firstRegistrationDate) {
      result.errors.push('Date de première immatriculation requise');
      result.eligibilityScore -= 15;
    }

    // Vérifications recommandées
    if (!vehicleData.enginePower) {
      result.missingData.push('Puissance moteur');
      result.eligibilityScore -= 5;
    }

    if (!vehicleData.sraGroup) {
      result.warnings.push('Groupe SRA manquant - Impact sur tarification');
      result.eligibilityScore -= 10;
    }

    if (vehicleData.registrationType === 'temporary') {
      result.warnings.push('Immatriculation provisoire');
      result.recommendations.push('Prévoir demande d\'immatriculation définitive');
    }

    if (!vehicleData.ownershipVerified) {
      result.warnings.push('Propriété non vérifiée');
      result.recommendations.push('Vérifier correspondance propriétaire/souscripteur');
      result.eligibilityScore -= 15;
    }

    result.isValid = result.errors.length === 0;
    result.eligibilityScore = Math.max(0, result.eligibilityScore);

    return result;
  }

  // Utilitaires privés
  private static getRegionFromCode(code: string): string {
    const regions: Record<string, string> = {
      '01': 'Ain', '02': 'Aisne', '03': 'Allier', '04': 'Alpes-de-Haute-Provence',
      '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes', '07': 'Ardèche', '08': 'Ardennes',
      '09': 'Ariège', '10': 'Aube', '11': 'Aude', '12': 'Aveyron',
      '13': 'Bouches-du-Rhône', '14': 'Calvados', '15': 'Cantal', '16': 'Charente',
      '17': 'Charente-Maritime', '18': 'Cher', '19': 'Corrèze', '21': 'Côte-d\'Or',
      '22': 'Côtes-d\'Armor', '23': 'Creuse', '24': 'Dordogne', '25': 'Doubs',
      '26': 'Drôme', '27': 'Eure', '28': 'Eure-et-Loir', '29': 'Finistère',
      '30': 'Gard', '31': 'Haute-Garonne', '32': 'Gers', '33': 'Gironde',
      '34': 'Hérault', '35': 'Ille-et-Vilaine', '36': 'Indre', '37': 'Indre-et-Loire',
      '38': 'Isère', '39': 'Jura', '40': 'Landes', '41': 'Loir-et-Cher',
      '42': 'Loire', '43': 'Haute-Loire', '44': 'Loire-Atlantique', '45': 'Loiret',
      '46': 'Lot', '47': 'Lot-et-Garonne', '48': 'Lozère', '49': 'Maine-et-Loire',
      '50': 'Manche', '51': 'Marne', '52': 'Haute-Marne', '53': 'Mayenne',
      '54': 'Meurthe-et-Moselle', '55': 'Meuse', '56': 'Morbihan', '57': 'Moselle',
      '58': 'Nièvre', '59': 'Nord', '60': 'Oise', '61': 'Orne',
      '62': 'Pas-de-Calais', '63': 'Puy-de-Dôme', '64': 'Pyrénées-Atlantiques',
      '65': 'Hautes-Pyrénées', '66': 'Pyrénées-Orientales', '67': 'Bas-Rhin',
      '68': 'Haut-Rhin', '69': 'Rhône', '70': 'Haute-Saône', '71': 'Saône-et-Loire',
      '72': 'Sarthe', '73': 'Savoie', '74': 'Haute-Savoie', '75': 'Paris',
      '76': 'Seine-Maritime', '77': 'Seine-et-Marne', '78': 'Yvelines', '79': 'Deux-Sèvres',
      '80': 'Somme', '81': 'Tarn', '82': 'Tarn-et-Garonne', '83': 'Var',
      '84': 'Vaucluse', '85': 'Vendée', '86': 'Vienne', '87': 'Haute-Vienne',
      '88': 'Vosges', '89': 'Yonne', '90': 'Territoire de Belfort', '91': 'Essonne',
      '92': 'Hauts-de-Seine', '93': 'Seine-Saint-Denis', '94': 'Val-de-Marne', '95': 'Val-d\'Oise'
    };
    
    return regions[code] || `Département ${code}`;
  }

  private static mockCompanyLookup(siret: string): { legalRepresentative: string } | null {
    // Simulation lookup entreprise (à remplacer par API Pappers)
    const mockCompanies: Record<string, { legalRepresentative: string }> = {
      '12345678901234': { legalRepresentative: 'DUPONT Jean' },
      '98765432109876': { legalRepresentative: 'MARTIN Sophie' }
    };
    
    return mockCompanies[siret] || null;
  }

  // Méthodes de persistance
  static saveVehicle(vehicle: VehicleTechnicalData): void {
    const vehicles = this.getAllVehicles();
    const existingIndex = vehicles.findIndex(v => v.id === vehicle.id);
    
    if (existingIndex >= 0) {
      vehicles[existingIndex] = { ...vehicle, updatedAt: new Date().toISOString() };
    } else {
      vehicles.push(vehicle);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(vehicles));
  }

  static getAllVehicles(): VehicleTechnicalData[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getVehicleById(id: string): VehicleTechnicalData | null {
    const vehicles = this.getAllVehicles();
    return vehicles.find(v => v.id === id) || null;
  }

  static deleteVehicle(id: string): void {
    const vehicles = this.getAllVehicles();
    const filtered = vehicles.filter(v => v.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }
}
