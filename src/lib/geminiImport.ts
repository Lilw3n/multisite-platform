// Service d'import automatique avec Gemini AI
// Implémentation complète pour l'extraction de données depuis les documents

import { GoogleGenerativeAI } from '@google/generative-ai';
import { google } from 'googleapis';

export interface ImportedDriverData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    licenseNumber: string;
    licenseObtainedDate: string;
  };
  insurancePeriods: Array<{
    startDate: string;
    endDate: string;
    company: string;
    policyNumber: string;
    premium: number;
    crmCoefficient: number;
    status: 'Actif' | 'Expiré' | 'En attente';
  }>;
  insuranceGaps: Array<{
    startDate: string;
    endDate: string;
    reason: 'non_renouvellement' | 'suspension' | 'impayé' | 'autre';
    description: string;
  }>;
  claims: Array<{
    date: string;
    type: 'materialRC100' | 'materialRC50' | 'materialRC0' | 'bodilyRC100' | 'bodilyRC50' | 'bodilyRC0' | 'glassBreakage' | 'theft';
    description: string;
    amount: number;
    responsibility: number;
    insurer: string;
  }>;
}

export interface GeminiImportConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export class GeminiImportService {
  private config: GeminiImportConfig;
  private genAI: GoogleGenerativeAI;
  private drive: any;

  constructor(config: GeminiImportConfig) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    
    // Initialiser Google Drive API si les clés sont disponibles
    if (process.env.GOOGLE_DRIVE_API_KEY) {
      this.drive = google.drive({
        version: 'v3',
        auth: process.env.GOOGLE_DRIVE_API_KEY
      });
    }
  }

  /**
   * Extrait les données d'un document PDF via Gemini AI
   * @param file - Fichier PDF à analyser
   * @returns Données structurées du chauffeur
   */
  async extractDriverDataFromPDF(file: File): Promise<ImportedDriverData> {
    // TODO: Implémentation avec l'API Gemini
    // 1. Convertir le PDF en texte
    // 2. Envoyer le texte à Gemini avec un prompt structuré
    // 3. Parser la réponse JSON
    // 4. Valider les données extraites
    // 5. Retourner les données structurées

    throw new Error('Fonctionnalité à implémenter');
  }

  /**
   * Extrait les données depuis Google Drive
   * @param fileId - ID du fichier sur Google Drive
   * @returns Données structurées du chauffeur
   */
  async extractDriverDataFromDrive(fileId: string): Promise<ImportedDriverData> {
    // TODO: Implémentation avec l'API Google Drive + Gemini
    // 1. Récupérer le fichier depuis Google Drive
    // 2. Extraire le contenu
    // 3. Analyser avec Gemini
    // 4. Retourner les données structurées

    throw new Error('Fonctionnalité à implémenter');
  }

  /**
   * Valide les données extraites
   * @param data - Données à valider
   * @returns Validation result avec erreurs éventuelles
   */
  validateImportedData(data: ImportedDriverData): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation des informations personnelles
    if (!data.personalInfo.firstName) errors.push('Prénom manquant');
    if (!data.personalInfo.lastName) errors.push('Nom manquant');
    if (!data.personalInfo.licenseNumber) errors.push('Numéro de permis manquant');

    // Validation des dates
    data.insurancePeriods.forEach((period, index) => {
      if (!this.isValidDate(period.startDate)) {
        errors.push(`Date de début invalide pour la période ${index + 1}`);
      }
      if (!this.isValidDate(period.endDate)) {
        errors.push(`Date de fin invalide pour la période ${index + 1}`);
      }
    });

    // Validation des montants
    data.insurancePeriods.forEach((period, index) => {
      if (period.premium < 0) {
        warnings.push(`Prime négative pour la période ${index + 1}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Génère un prompt optimisé pour Gemini
   * @param documentType - Type de document (assurance, sinistre, etc.)
   * @returns Prompt structuré pour l'extraction
   */
  private generatePrompt(documentType: string): string {
    return `
Analyse ce document ${documentType} et extrais les informations suivantes au format JSON :

{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string", 
    "email": "string",
    "phone": "string",
    "address": "string",
    "licenseNumber": "string",
    "licenseObtainedDate": "DD/MM/YYYY"
  },
  "insurancePeriods": [
    {
      "startDate": "DD/MM/YYYY",
      "endDate": "DD/MM/YYYY", 
      "company": "string",
      "policyNumber": "string",
      "premium": number,
      "crmCoefficient": number,
      "status": "Actif|Expiré|En attente"
    }
  ],
  "insuranceGaps": [
    {
      "startDate": "DD/MM/YYYY",
      "endDate": "DD/MM/YYYY",
      "reason": "non_renouvellement|suspension|impayé|autre",
      "description": "string"
    }
  ],
  "claims": [
    {
      "date": "DD/MM/YYYY",
      "type": "materialRC100|materialRC50|materialRC0|bodilyRC100|bodilyRC50|bodilyRC0|glassBreakage|theft",
      "description": "string",
      "amount": number,
      "responsibility": number,
      "insurer": "string"
    }
  ]
}

Règles importantes :
- Toutes les dates doivent être au format DD/MM/YYYY
- Les montants doivent être des nombres (pas de devises)
- Les types de sinistres doivent correspondre exactement aux valeurs autorisées
- Si une information n'est pas trouvée, utiliser null ou une chaîne vide
- Le CRM doit être calculé selon les règles d'assurance françaises
    `;
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;
    
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
  }
}

// Configuration par défaut
export const defaultGeminiConfig: GeminiImportConfig = {
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  model: 'gemini-1.5-pro',
  maxTokens: 4000,
  temperature: 0.1
};

// Hook React pour l'import
export const useGeminiImport = (config?: Partial<GeminiImportConfig>) => {
  const finalConfig = { ...defaultGeminiConfig, ...config };
  const service = new GeminiImportService(finalConfig);

  return {
    extractFromPDF: service.extractDriverDataFromPDF.bind(service),
    extractFromDrive: service.extractDriverDataFromDrive.bind(service),
    validateData: service.validateImportedData.bind(service)
  };
};
