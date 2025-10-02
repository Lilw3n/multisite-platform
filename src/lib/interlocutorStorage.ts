import { Interlocutor } from '@/types/interlocutor';

const STORAGE_KEY = 'diddyhome_interlocutors';

// Données mockées par défaut
const defaultInterlocutors: Interlocutor[] = [
  {
    id: '1',
    type: 'user',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@company.com',
    phone: '01 23 45 67 89',
    company: 'Transport Dupont SARL',
    address: '123 Rue de la Paix, 75001 Paris',
    status: 'Actif',
    role: 'client',
    createdAt: '2024-01-15',
    updatedAt: '2025-01-15',
    lastActivity: '2025-01-15',
    contracts: [
      {
        id: 'c1',
        interlocutorId: '1',
        type: 'assurance',
        status: 'En cours',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        premium: 1200,
        insurer: 'AXA',
        policyNumber: 'AXA-2024-001',
        description: 'Assurance VTC',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ],
    insuranceRequests: [
      {
        id: 'r1',
        interlocutorId: '1',
        type: 'devis',
        status: 'En attente',
        vehicleType: 'VTC',
        coverage: 'Tous risques',
        requestDate: '2025-01-10',
        estimatedPremium: 1200,
        notes: 'Demande de devis pour véhicule VTC',
        createdAt: '2025-01-10',
        updatedAt: '2025-01-10'
      }
    ]
  },
  {
    id: '2',
    type: 'external',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@vtcpro.fr',
    phone: '06 12 34 56 78',
    company: 'VTC Pro Services',
    address: '456 Avenue des Champs, 69000 Lyon',
    status: 'Actif',
    role: 'professional',
    createdAt: '2024-02-20',
    updatedAt: '2025-01-14',
    lastActivity: '2025-01-14',
    contracts: [],
    insuranceRequests: [
      {
        id: 'r2',
        interlocutorId: '2',
        type: 'renouvellement',
        status: 'Traité',
        vehicleType: 'Taxi',
        coverage: 'Responsabilité civile',
        requestDate: '2024-12-15',
        estimatedPremium: 800,
        notes: 'Renouvellement contrat taxi',
        createdAt: '2024-12-15',
        updatedAt: '2024-12-20'
      }
    ]
  },
  {
    id: '3',
    type: 'user',
    firstName: 'Pierre',
    lastName: 'Durand',
    email: 'pierre.durand@email.com',
    phone: '07 89 12 34 56',
    company: 'Indépendant',
    address: '789 Rue du Commerce, 13000 Marseille',
    status: 'Inactif',
    role: 'client',
    createdAt: '2023-11-10',
    updatedAt: '2024-06-15',
    lastActivity: '2024-06-15',
    contracts: [],
    insuranceRequests: []
  }
];

/**
 * Service de gestion du stockage des interlocuteurs
 */
export class InterlocutorStorageService {
  
  /**
   * Récupérer tous les interlocuteurs
   */
  static getAllInterlocutors(): Interlocutor[] {
    if (typeof window === 'undefined') {
      return defaultInterlocutors;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Fusionner avec les données par défaut si nécessaire
        return parsed.length > 0 ? parsed : defaultInterlocutors;
      }
      
      // Première fois, sauvegarder les données par défaut
      this.saveInterlocutors(defaultInterlocutors);
      return defaultInterlocutors;
    } catch (error) {
      console.error('Erreur lors de la récupération des interlocuteurs:', error);
      return defaultInterlocutors;
    }
  }

  /**
   * Sauvegarder tous les interlocuteurs
   */
  static saveInterlocutors(interlocutors: Interlocutor[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(interlocutors));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des interlocuteurs:', error);
    }
  }

  /**
   * Ajouter un nouvel interlocuteur
   */
  static addInterlocutor(interlocutor: Omit<Interlocutor, 'id' | 'createdAt' | 'updatedAt'>): Interlocutor {
    const newInterlocutor: Interlocutor = {
      ...interlocutor,
      id: this.generateId(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      contracts: interlocutor.contracts || [],
      insuranceRequests: interlocutor.insuranceRequests || []
    };

    const interlocutors = this.getAllInterlocutors();
    interlocutors.push(newInterlocutor);
    this.saveInterlocutors(interlocutors);

    return newInterlocutor;
  }

  /**
   * Mettre à jour un interlocuteur
   */
  static updateInterlocutor(id: string, updates: Partial<Interlocutor>): Interlocutor | null {
    const interlocutors = this.getAllInterlocutors();
    const index = interlocutors.findIndex(i => i.id === id);
    
    if (index === -1) return null;

    interlocutors[index] = {
      ...interlocutors[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    this.saveInterlocutors(interlocutors);
    return interlocutors[index];
  }

  /**
   * Supprimer un interlocuteur
   */
  static deleteInterlocutor(id: string): boolean {
    const interlocutors = this.getAllInterlocutors();
    const filteredInterlocutors = interlocutors.filter(i => i.id !== id);
    
    if (filteredInterlocutors.length === interlocutors.length) {
      return false; // Aucun interlocuteur supprimé
    }

    this.saveInterlocutors(filteredInterlocutors);
    return true;
  }

  /**
   * Récupérer un interlocuteur par ID
   */
  static getInterlocutorById(id: string): Interlocutor | null {
    const interlocutors = this.getAllInterlocutors();
    return interlocutors.find(i => i.id === id) || null;
  }

  /**
   * Rechercher des interlocuteurs
   */
  static searchInterlocutors(query: string): Interlocutor[] {
    const interlocutors = this.getAllInterlocutors();
    const lowercaseQuery = query.toLowerCase();

    return interlocutors.filter(interlocutor => 
      interlocutor.firstName.toLowerCase().includes(lowercaseQuery) ||
      interlocutor.lastName.toLowerCase().includes(lowercaseQuery) ||
      interlocutor.email.toLowerCase().includes(lowercaseQuery) ||
      interlocutor.company?.toLowerCase().includes(lowercaseQuery) ||
      interlocutor.phone?.includes(query)
    );
  }

  /**
   * Filtrer les interlocuteurs par type
   */
  static getInterlocutorsByType(type: 'user' | 'external' | 'all'): Interlocutor[] {
    const interlocutors = this.getAllInterlocutors();
    
    if (type === 'all') return interlocutors;
    return interlocutors.filter(i => i.type === type);
  }

  /**
   * Générer un ID unique
   */
  private static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Réinitialiser le stockage (pour debug)
   */
  static resetStorage(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEY);
    this.saveInterlocutors(defaultInterlocutors);
  }

  /**
   * Exporter les données
   */
  static exportData(): string {
    const interlocutors = this.getAllInterlocutors();
    return JSON.stringify(interlocutors, null, 2);
  }

  /**
   * Importer des données
   */
  static importData(jsonData: string): boolean {
    try {
      const interlocutors = JSON.parse(jsonData);
      if (Array.isArray(interlocutors)) {
        this.saveInterlocutors(interlocutors);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }
}
