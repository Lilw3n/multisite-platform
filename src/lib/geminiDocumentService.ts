import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface DocumentAnalysisResult {
  success: boolean;
  data?: {
    type: 'bank_details' | 'vehicle_info' | 'driver_info' | 'contract_info' | 'claim_info';
    extractedData: any;
    confidence: number;
    suggestions: string[];
  };
  error?: string;
}

export interface PendingUpdate {
  id: string;
  interlocutorId: string;
  documentUrl: string;
  documentType: string;
  extractedData: any;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  suggestedBy: string;
}

export class GeminiDocumentService {
  private static model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  /**
   * Analyse un document Google Drive et extrait les informations pertinentes
   */
  static async analyzeDocument(documentUrl: string, documentType: string): Promise<DocumentAnalysisResult> {
    try {
      // Récupérer le contenu du document depuis Google Drive
      const documentContent = await this.fetchDocumentFromDrive(documentUrl);
      
      if (!documentContent) {
        return {
          success: false,
          error: 'Impossible de récupérer le contenu du document'
        };
      }

      // Analyser le contenu avec Gemini
      const prompt = this.buildAnalysisPrompt(documentType, documentContent);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parser la réponse JSON de Gemini
      const analysisResult = JSON.parse(text);

      return {
        success: true,
        data: {
          type: analysisResult.type,
          extractedData: analysisResult.extractedData,
          confidence: analysisResult.confidence,
          suggestions: analysisResult.suggestions
        }
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse du document:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'analyse du document'
      };
    }
  }

  /**
   * Récupère le contenu d'un document Google Drive
   */
  private static async fetchDocumentFromDrive(documentUrl: string): Promise<string | null> {
    try {
      // Extraire l'ID du fichier depuis l'URL Google Drive
      const fileId = this.extractFileIdFromUrl(documentUrl);
      if (!fileId) {
        throw new Error('URL Google Drive invalide');
      }

      // Utiliser l'API Google Drive pour récupérer le contenu
      // Note: Dans un vrai projet, vous devriez utiliser l'API Google Drive avec authentification
      // Pour l'instant, on simule le contenu
      return this.simulateDocumentContent(fileId);
    } catch (error) {
      console.error('Erreur lors de la récupération du document:', error);
      return null;
    }
  }

  /**
   * Extrait l'ID du fichier depuis une URL Google Drive
   */
  private static extractFileIdFromUrl(url: string): string | null {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  }

  /**
   * Simule le contenu d'un document (à remplacer par l'API Google Drive réelle)
   */
  private static simulateDocumentContent(fileId: string): string {
    // Simulation de différents types de documents
    const mockDocuments = {
      '1uiEqMqx6V8gw2-mdUrwkm9EKa1Hfd_Xy': `
        COORDONNÉES BANCAIRES
        Titulaire: Jean Dupont
        IBAN: FR76 1234 5678 9012 3456 7890 123
        BIC: BNPAFRPPXXX
        Banque: BNP Paribas
        Type de compte: Compte courant
        Adresse: 123 Rue de la Paix, 75001 Paris
      `,
      '2uiEqMqx6V8gw2-mdUrwkm9EKa1Hfd_Xy': `
        INFORMATIONS VÉHICULE
        Marque: Renault
        Modèle: Trafic
        Immatriculation: AB-123-CD
        Année: 2020
        Puissance: 150 ch
        Type de carburant: Diesel
        Propriétaire: Jean Dupont
      `,
      '3uiEqMqx6V8gw2-mdUrwkm9EKa1Hfd_Xy': `
        PERMIS DE CONDUIRE
        Nom: Dupont
        Prénom: Jean
        Numéro: 1234567890
        Date de délivrance: 15/05/2018
        Date d'expiration: 15/05/2028
        Catégorie: B
        Adresse: 123 Rue de la Paix, 75001 Paris
      `
    };

    return mockDocuments[fileId] || 'Document non reconnu';
  }

  /**
   * Construit le prompt d'analyse pour Gemini
   */
  private static buildAnalysisPrompt(documentType: string, content: string): string {
    return `
    Analyse ce document et extrait les informations pertinentes au format JSON.
    
    Type de document: ${documentType}
    Contenu du document:
    ${content}
    
    Retourne un JSON avec cette structure:
    {
      "type": "bank_details" | "vehicle_info" | "driver_info" | "contract_info" | "claim_info",
      "extractedData": {
        // Données extraites selon le type
      },
      "confidence": 0.95, // Score de confiance entre 0 et 1
      "suggestions": [
        "Suggestion 1",
        "Suggestion 2"
      ]
    }
    
    Types de données à extraire selon le type:
    - bank_details: { accountHolder, iban, bic, bankName, accountType, address }
    - vehicle_info: { brand, model, registration, year, power, fuelType, owner }
    - driver_info: { firstName, lastName, licenseNumber, licenseDate, licenseExpiry, category, address }
    - contract_info: { contractNumber, product, amount, startDate, endDate, status }
    - claim_info: { claimNumber, date, description, amount, status, vehicle, driver }
    
    Sois précis et ne retourne que les informations que tu peux clairement identifier.
    `;
  }

  /**
   * Crée une suggestion de mise à jour pour validation manuelle
   */
  static async createPendingUpdate(
    interlocutorId: string,
    documentUrl: string,
    documentType: string,
    suggestedBy: string
  ): Promise<PendingUpdate> {
    const analysis = await this.analyzeDocument(documentUrl, documentType);
    
    if (!analysis.success || !analysis.data) {
      throw new Error('Impossible d\'analyser le document');
    }

    const pendingUpdate: PendingUpdate = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      interlocutorId,
      documentUrl,
      documentType,
      extractedData: analysis.data.extractedData,
      confidence: analysis.data.confidence,
      status: 'pending',
      createdAt: new Date(),
      suggestedBy
    };

    // Sauvegarder en base de données (simulation)
    await this.savePendingUpdate(pendingUpdate);

    return pendingUpdate;
  }

  /**
   * Sauvegarde une suggestion de mise à jour
   */
  private static async savePendingUpdate(update: PendingUpdate): Promise<void> {
    // Simulation de sauvegarde en base de données
    console.log('Sauvegarde de la suggestion:', update);
    
    // Dans un vrai projet, vous sauvegarderiez en base de données
    // await database.pendingUpdates.create(update);
  }

  /**
   * Récupère toutes les suggestions en attente
   */
  static async getPendingUpdates(interlocutorId?: string): Promise<PendingUpdate[]> {
    // Simulation de récupération depuis la base de données
    const mockUpdates: PendingUpdate[] = [
      {
        id: 'update_1',
        interlocutorId: '1',
        documentUrl: 'https://drive.google.com/file/d/1uiEqMqx6V8gw2-mdUrwkm9EKa1Hfd_Xy/view',
        documentType: 'bank_details',
        extractedData: {
          accountHolder: 'Jean Dupont',
          iban: 'FR76 1234 5678 9012 3456 7890 123',
          bic: 'BNPAFRPPXXX',
          bankName: 'BNP Paribas',
          accountType: 'Compte courant'
        },
        confidence: 0.95,
        status: 'pending',
        createdAt: new Date(),
        suggestedBy: 'Gemini AI'
      }
    ];

    return interlocutorId 
      ? mockUpdates.filter(u => u.interlocutorId === interlocutorId)
      : mockUpdates;
  }

  /**
   * Approuve une suggestion de mise à jour
   */
  static async approveUpdate(updateId: string): Promise<void> {
    console.log(`Approbation de la mise à jour ${updateId}`);
    // Logique d'approbation et de mise à jour des données
  }

  /**
   * Rejette une suggestion de mise à jour
   */
  static async rejectUpdate(updateId: string): Promise<void> {
    console.log(`Rejet de la mise à jour ${updateId}`);
    // Logique de rejet
  }
}
