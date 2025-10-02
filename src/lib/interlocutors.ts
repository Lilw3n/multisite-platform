import { Interlocutor, Event, Claim, Vehicle, Driver, Contract, InsuranceRequest, FamilyMember, CompanyRelation } from '@/types/interlocutor';

// Fonction pour charger les données depuis localStorage ou utiliser les données par défaut
const loadInterlocutors = (): Interlocutor[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('interlocutors_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Erreur lors du chargement des données sauvegardées, utilisation des données par défaut');
      }
    }
  }
  return getDefaultInterlocutors();
};

// Fonction pour sauvegarder les données dans localStorage
const saveInterlocutors = (data: Interlocutor[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('interlocutors_data', JSON.stringify(data));
  }
};

// Données par défaut
const getDefaultInterlocutors = (): Interlocutor[] => [
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
        id: 'contract-1',
        type: 'assurance',
        insurer: 'AXA',
        policyNumber: 'POL-2024-001',
        premium: 1200,
        startDate: '01/01/2024',
        endDate: '31/12/2024',
        status: 'En cours',
        description: 'Contrat d\'assurance auto pour véhicule utilitaire',
        interlocutorId: '1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    insuranceRequests: [
      {
        id: 'request-1',
        type: 'devis',
        description: 'Demande de devis pour assurance flotte de véhicules',
        status: 'En attente',
        requestedDate: '2024-01-20',
        priority: 'Moyenne',
        assignedTo: 'Pierre Bernard',
        interlocutorId: '1',
        createdAt: '2024-01-20T14:00:00Z',
        updatedAt: '2024-01-20T14:00:00Z'
      }
    ],
    claims: [
      {
        id: 'claim-1',
        type: 'materialRC100',
        date: '15/01/2024',
        amount: 2500,
        description: 'Collision avec un autre véhicule sur l\'autoroute A1',
        responsible: true,
        percentage: 100,
        insurer: 'AXA',
        status: 'En cours',
        vehicleId: 'vehicle-1',
        driverId: 'driver-1',
        interlocutorId: '1',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
    ],
    vehicles: [
      {
        id: 'vehicle-1',
        registration: 'AB-123-CD',
        brand: 'Renault',
        model: 'Trafic',
        year: 2020,
        type: 'Véhicule utilitaire',
        status: 'Assuré',
        interlocutorId: '1',
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-10T08:00:00Z'
      }
    ],
    drivers: [
      {
        id: 'driver-1',
        firstName: 'Jean',
        lastName: 'Dupont',
        licenseNumber: '1234567890',
        licenseType: 'B',
        status: 'Actif',
        interlocutorId: '1',
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-10T08:00:00Z'
      }
    ],
    events: [
      {
        id: 'e1',
        interlocutorId: '1',
        type: 'call',
        title: 'Appel Commercial',
        description: 'Présentation du nouveau produit d\'assurance auto avec démonstration des fonctionnalités avancées.',
        date: '2025-01-27',
        time: '14:30',
        participants: [
          { id: 'p1', name: 'Jean Dupont', role: 'recipient' },
          { id: 'p2', name: 'Marie Martin', role: 'sender' }
        ],
        attachments: [
          { id: 'a1', name: 'Lien Drive', type: 'link' },
          { id: 'a2', name: 'Document PDF', type: 'document' }
        ],
        status: 'completed',
        priority: 'Moyenne',
        createdAt: '2025-01-27',
        updatedAt: '2025-01-27',
        createdBy: 'Marie Martin'
      },
      {
        id: 'e2',
        interlocutorId: '1',
        type: 'email',
        title: 'Email de Suivi',
        description: 'Envoi du devis d\'assurance auto avec détails des garanties et tarifs.',
        date: '2025-01-26',
        time: '09:15',
        participants: [
          { id: 'p3', name: 'Jean Dupont', role: 'recipient' },
          { id: 'p4', name: 'Admin System', role: 'sender' }
        ],
        attachments: [
          { id: 'a3', name: 'Devis PDF', type: 'pdf' },
          { id: 'a4', name: 'Tableau Comparatif', type: 'document' }
        ],
        status: 'completed',
        priority: 'low',
        createdAt: '2025-01-26',
        updatedAt: '2025-01-26',
        createdBy: 'Admin System'
      }
    ],
    familyMembers: [],
    companyRelations: [],
    userAccount: {
      userId: 'u1',
      permissions: ['read', 'write'],
      lastLogin: '2025-01-15'
    }
  },
  {
    id: '2',
    type: 'external',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@transport.fr',
    phone: '01 98 76 54 32',
    company: 'Martin Transport',
    address: '456 Avenue des Champs, 75008 Paris',
    status: 'Actif',
    role: 'client',
    createdAt: '2024-02-01',
    updatedAt: '2025-01-15',
    lastActivity: '2025-01-14',
    contracts: [],
    insuranceRequests: [],
    claims: [],
    vehicles: [],
    drivers: [],
    events: [
      {
        id: 'evt-marie-1',
        interlocutorId: '2',
        type: 'meeting',
        title: 'Réunion Commerciale',
        description: 'Présentation des services d\'assurance pour flotte de véhicules',
        date: '2025-01-20',
        time: '10:00',
        participants: [
          { id: 'p5', name: 'Marie Martin', role: 'recipient' },
          { id: 'p6', name: 'Jean Dupont', role: 'sender' }
        ],
        attachments: [
          { id: 'a5', name: 'Présentation PDF', type: 'pdf' }
        ],
        status: 'completed',
        priority: 'high',
        createdAt: '2025-01-20',
        updatedAt: '2025-01-20',
        createdBy: 'Jean Dupont'
      }
    ],
    familyMembers: [],
    companyRelations: [],
    externalInfo: {
      source: 'website',
      notes: 'Prospect intéressé par nos services',
      assignedTo: 'Pierre Bernard'
    }
  }
];

// Initialiser les interlocuteurs avec les données chargées
let interlocutors: Interlocutor[] = loadInterlocutors();

// Compteur pour les créations externes par email/téléphone
const externalCreations = new Map<string, number>();

export class InterlocutorService {
  static async getAllInterlocutors(): Promise<Interlocutor[]> {
    return [...interlocutors];
  }

  static async getInterlocutorById(id: string): Promise<Interlocutor | null> {
    return interlocutors.find(i => i.id === id) || null;
  }

  static async createInterlocutor(
    interlocutorData: Omit<Interlocutor, 'id' | 'createdAt' | 'updatedAt' | 'contracts' | 'insuranceRequests' | 'claims' | 'vehicles' | 'drivers' | 'events'>,
    userRole: 'admin' | 'internal' | 'external'
  ): Promise<{ success: boolean; interlocutor?: Interlocutor; error?: string }> {
    
    // Validation conditionnelle des champs email et téléphone
    const hasEmail = interlocutorData.email && interlocutorData.email.trim() !== '';
    const hasPhone = interlocutorData.phone && interlocutorData.phone.trim() !== '';
    
    // Logique de priorité : Email > Téléphone > Aucun (facultatif)
    if (hasEmail || hasPhone) {
      // Si on a au moins un des deux, on doit valider l'unicité
      
      if (hasEmail) {
        // Email prioritaire : vérifier l'unicité de l'email
        const existingByEmail = interlocutors.find(i => i.email === interlocutorData.email);
        if (existingByEmail) {
          return {
            success: false,
            error: `Un interlocuteur avec l'email ${interlocutorData.email} existe déjà.`
          };
        }
      } else if (hasPhone) {
        // Pas d'email mais téléphone : vérifier l'unicité du téléphone
        const existingByPhone = interlocutors.find(i => i.phone === interlocutorData.phone);
        if (existingByPhone) {
          return {
            success: false,
            error: `Un interlocuteur avec le téléphone ${interlocutorData.phone} existe déjà.`
          };
        }
      }
    }
    // Si ni email ni téléphone, c'est autorisé (facultatif)
    
    // Vérifications spécifiques pour les utilisateurs externes
    if (userRole === 'external') {
      // Vérifier si l'utilisateur externe a déjà créé un interlocuteur
      const userIdentifier = hasEmail ? interlocutorData.email : (hasPhone ? interlocutorData.phone : null);
      
      if (userIdentifier && externalCreations.has(userIdentifier)) {
        return {
          success: false,
          error: 'En mode externe, vous ne pouvez créer qu\'un seul interlocuteur.'
        };
      }
      
      // Pour les externes, on exige au moins un moyen de contact
      if (!hasEmail && !hasPhone) {
        return {
          success: false,
          error: 'En mode externe, vous devez fournir au moins un email ou un téléphone.'
        };
      }
    }

    // Créer l'interlocuteur
    const newInterlocutor: Interlocutor = {
      ...interlocutorData,
      id: this.generateId(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      contracts: [],
      insuranceRequests: [],
      claims: [],
      vehicles: [],
      drivers: [],
      events: []
    };

    interlocutors.push(newInterlocutor);

    // Enregistrer la création pour les utilisateurs externes
    if (userRole === 'external') {
      const userIdentifier = hasEmail ? interlocutorData.email : (hasPhone ? interlocutorData.phone : null);
      if (userIdentifier) {
        externalCreations.set(userIdentifier, 1);
      }
    }

    return {
      success: true,
      interlocutor: newInterlocutor
    };
  }

  static async updateInterlocutor(
    id: string, 
    updates: Partial<Interlocutor>
  ): Promise<{ success: boolean; interlocutor?: Interlocutor; error?: string }> {
    const index = interlocutors.findIndex(i => i.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    interlocutors[index] = {
      ...interlocutors[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    return {
      success: true,
      interlocutor: interlocutors[index]
    };
  }

  static async deleteInterlocutor(id: string): Promise<{ success: boolean; error?: string }> {
    const index = interlocutors.findIndex(i => i.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    interlocutors.splice(index, 1);
    return { success: true };
  }

  static async addEvent(
    interlocutorId: string,
    event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; event?: Event; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const newEvent: Event = {
      ...event,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    interlocutor.events.push(newEvent);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];

    return {
      success: true,
      event: newEvent
    };
  }

  static async updateEvent(
    interlocutorId: string,
    eventId: string,
    updates: Partial<Event>
  ): Promise<{ success: boolean; event?: Event; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const eventIndex = interlocutor.events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return {
        success: false,
        error: 'Événement non trouvé'
      };
    }

    interlocutor.events[eventIndex] = {
      ...interlocutor.events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // CORRECTION: Sauvegarder les modifications dans localStorage
    saveInterlocutors(interlocutors);

    return {
      success: true,
      event: interlocutor.events[eventIndex]
    };
  }

  static async deleteEvent(
    interlocutorId: string,
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const eventIndex = interlocutor.events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return {
        success: false,
        error: 'Événement non trouvé'
      };
    }

    interlocutor.events.splice(eventIndex, 1);
    
    // CORRECTION: Sauvegarder les modifications dans localStorage
    saveInterlocutors(interlocutors);
    
    return { success: true };
  }

  static async duplicateEvent(
    interlocutorId: string,
    eventId: string
  ): Promise<{ success: boolean; event?: Event; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const originalEvent = interlocutor.events.find(e => e.id === eventId);
    
    if (!originalEvent) {
      return {
        success: false,
        error: 'Événement non trouvé'
      };
    }

    const duplicatedEvent: Event = {
      ...originalEvent,
      id: this.generateId(),
      title: `${originalEvent.title} (Copie)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    interlocutor.events.push(duplicatedEvent);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];

    return {
      success: true,
      event: duplicatedEvent
    };
  }


  static async transferEvent(
    sourceInterlocutorId: string,
    eventId: string,
    targetInterlocutorId: string
  ): Promise<{ success: boolean; error?: string }> {
    console.log('🔄 Transfert d\'événement:', { sourceInterlocutorId, eventId, targetInterlocutorId });
    
    const sourceInterlocutor = interlocutors.find(i => i.id === sourceInterlocutorId);
    const targetInterlocutor = interlocutors.find(i => i.id === targetInterlocutorId);
    
    if (!sourceInterlocutor || !targetInterlocutor) {
      console.error('❌ Interlocuteur non trouvé:', { sourceInterlocutorId, targetInterlocutorId });
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const eventIndex = sourceInterlocutor.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      console.error('❌ Événement non trouvé:', eventId);
      return {
        success: false,
        error: 'Événement non trouvé'
      };
    }

    const event = sourceInterlocutor.events[eventIndex];
    console.log('📅 Événement trouvé:', event);
    
    // Retirer l'événement de l'interlocuteur source
    sourceInterlocutor.events.splice(eventIndex, 1);
    sourceInterlocutor.updatedAt = new Date().toISOString().split('T')[0];
    console.log('✅ Événement retiré de la source');

    // Ajouter l'événement à l'interlocuteur cible
    const transferredEvent = {
      ...event,
      interlocutorId: targetInterlocutorId,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    targetInterlocutor.events.push(transferredEvent);
    targetInterlocutor.updatedAt = new Date().toISOString().split('T')[0];
    console.log('✅ Événement ajouté à la cible');

    console.log('🎉 Transfert d\'événement réussi');
    
    // Sauvegarder les modifications
    saveInterlocutors(interlocutors);
    
    return { success: true };
  }

  static async searchInterlocutors(
    query: string,
    filters?: {
      type?: 'user' | 'external';
      status?: 'Actif' | 'Inactif' | 'En attente';
      role?: 'client' | 'prospect' | 'partenaire' | 'fournisseur';
    }
  ): Promise<Interlocutor[]> {
    let results = [...interlocutors];

    // Filtrage par critères
    if (filters?.type) {
      results = results.filter(i => i.type === filters.type);
    }
    if (filters?.status) {
      results = results.filter(i => i.status === filters.status);
    }
    if (filters?.role) {
      results = results.filter(i => i.role === filters.role);
    }

    // Recherche textuelle
    if (query) {
      const searchQuery = query.toLowerCase();
      results = results.filter(i => 
        i.firstName.toLowerCase().includes(searchQuery) ||
        i.lastName.toLowerCase().includes(searchQuery) ||
        i.email.toLowerCase().includes(searchQuery) ||
        i.phone.includes(searchQuery) ||
        (i.company && i.company.toLowerCase().includes(searchQuery))
      );
    }

    return results;
  }

  static async getInterlocutorStats(): Promise<{
    total: number;
    byType: { user: number; external: number };
    byStatus: { actif: number; inactif: number; enAttente: number };
    byRole: { client: number; prospect: number; partenaire: number; fournisseur: number };
  }> {
    const total = interlocutors.length;
    const byType = {
      user: interlocutors.filter(i => i.type === 'user').length,
      external: interlocutors.filter(i => i.type === 'external').length
    };
    const byStatus = {
      actif: interlocutors.filter(i => i.status === 'Actif').length,
      inactif: interlocutors.filter(i => i.status === 'Inactif').length,
      enAttente: interlocutors.filter(i => i.status === 'En attente').length
    };
    const byRole = {
      client: interlocutors.filter(i => i.role === 'client').length,
      prospect: interlocutors.filter(i => i.role === 'prospect').length,
      partenaire: interlocutors.filter(i => i.role === 'partenaire').length,
      fournisseur: interlocutors.filter(i => i.role === 'fournisseur').length
    };

    return { total, byType, byStatus, byRole };
  }

  // Méthodes de transfert de modules entre interlocuteurs
  static async transferClaim(
    sourceInterlocutorId: string,
    claimId: string,
    targetInterlocutorId: string
  ): Promise<{ success: boolean; error?: string }> {
    console.log('🔄 Transfert de sinistre:', { sourceInterlocutorId, claimId, targetInterlocutorId });
    
    const sourceInterlocutor = interlocutors.find(i => i.id === sourceInterlocutorId);
    const targetInterlocutor = interlocutors.find(i => i.id === targetInterlocutorId);
    
    if (!sourceInterlocutor || !targetInterlocutor) {
      console.error('❌ Interlocuteur non trouvé:', { sourceInterlocutorId, targetInterlocutorId });
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const claimIndex = sourceInterlocutor.claims.findIndex(c => c.id === claimId);
    if (claimIndex === -1) {
      console.error('❌ Sinistre non trouvé:', claimId);
      return {
        success: false,
        error: 'Sinistre non trouvé'
      };
    }

    const claim = sourceInterlocutor.claims[claimIndex];
    console.log('📋 Sinistre trouvé:', claim);
    
    // Retirer le sinistre de l'interlocuteur source
    sourceInterlocutor.claims.splice(claimIndex, 1);
    sourceInterlocutor.updatedAt = new Date().toISOString().split('T')[0];
    console.log('✅ Sinistre retiré de la source');

    // Ajouter le sinistre à l'interlocuteur cible
    const transferredClaim = {
      ...claim,
      interlocutorId: targetInterlocutorId,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    targetInterlocutor.claims.push(transferredClaim);
    targetInterlocutor.updatedAt = new Date().toISOString().split('T')[0];
    console.log('✅ Sinistre ajouté à la cible');

    console.log('🎉 Transfert réussi');
    
    // Sauvegarder les modifications
    saveInterlocutors(interlocutors);
    
    return { success: true };
  }

  static async transferVehicle(
    sourceInterlocutorId: string,
    vehicleId: string,
    targetInterlocutorId: string
  ): Promise<{ success: boolean; error?: string }> {
    const sourceInterlocutor = interlocutors.find(i => i.id === sourceInterlocutorId);
    const targetInterlocutor = interlocutors.find(i => i.id === targetInterlocutorId);
    
    if (!sourceInterlocutor || !targetInterlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const vehicleIndex = sourceInterlocutor.vehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
      return {
        success: false,
        error: 'Véhicule non trouvé'
      };
    }

    const vehicle = sourceInterlocutor.vehicles[vehicleIndex];
    
    // Retirer le véhicule de l'interlocuteur source
    sourceInterlocutor.vehicles.splice(vehicleIndex, 1);
    sourceInterlocutor.updatedAt = new Date().toISOString().split('T')[0];

    // Ajouter le véhicule à l'interlocuteur cible
    const transferredVehicle = {
      ...vehicle,
      interlocutorId: targetInterlocutorId,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    targetInterlocutor.vehicles.push(transferredVehicle);
    targetInterlocutor.updatedAt = new Date().toISOString().split('T')[0];

    // Sauvegarder les modifications
    saveInterlocutors(interlocutors);

    return { success: true };
  }

  static async transferDriver(
    sourceInterlocutorId: string,
    driverId: string,
    targetInterlocutorId: string
  ): Promise<{ success: boolean; error?: string }> {
    const sourceInterlocutor = interlocutors.find(i => i.id === sourceInterlocutorId);
    const targetInterlocutor = interlocutors.find(i => i.id === targetInterlocutorId);
    
    if (!sourceInterlocutor || !targetInterlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const driverIndex = sourceInterlocutor.drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      return {
        success: false,
        error: 'Conducteur non trouvé'
      };
    }

    const driver = sourceInterlocutor.drivers[driverIndex];
    
    // Retirer le conducteur de l'interlocuteur source
    sourceInterlocutor.drivers.splice(driverIndex, 1);
    sourceInterlocutor.updatedAt = new Date().toISOString().split('T')[0];

    // Ajouter le conducteur à l'interlocuteur cible
    const transferredDriver = {
      ...driver,
      interlocutorId: targetInterlocutorId,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    targetInterlocutor.drivers.push(transferredDriver);
    targetInterlocutor.updatedAt = new Date().toISOString().split('T')[0];

    // Sauvegarder les modifications
    saveInterlocutors(interlocutors);

    return { success: true };
  }

  static async transferContract(
    sourceInterlocutorId: string,
    contractId: string,
    targetInterlocutorId: string
  ): Promise<{ success: boolean; error?: string }> {
    const sourceInterlocutor = interlocutors.find(i => i.id === sourceInterlocutorId);
    const targetInterlocutor = interlocutors.find(i => i.id === targetInterlocutorId);
    
    if (!sourceInterlocutor || !targetInterlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const contractIndex = sourceInterlocutor.contracts.findIndex(c => c.id === contractId);
    if (contractIndex === -1) {
      return {
        success: false,
        error: 'Contrat non trouvé'
      };
    }

    const contract = sourceInterlocutor.contracts[contractIndex];
    
    // Retirer le contrat de l'interlocuteur source
    sourceInterlocutor.contracts.splice(contractIndex, 1);
    sourceInterlocutor.updatedAt = new Date().toISOString().split('T')[0];

    // Ajouter le contrat à l'interlocuteur cible
    const transferredContract = {
      ...contract,
      interlocutorId: targetInterlocutorId,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    targetInterlocutor.contracts.push(transferredContract);
    targetInterlocutor.updatedAt = new Date().toISOString().split('T')[0];

    // Sauvegarder les modifications
    saveInterlocutors(interlocutors);

    return { success: true };
  }

  static async transferInsuranceRequest(
    sourceInterlocutorId: string,
    requestId: string,
    targetInterlocutorId: string
  ): Promise<{ success: boolean; error?: string }> {
    const sourceInterlocutor = interlocutors.find(i => i.id === sourceInterlocutorId);
    const targetInterlocutor = interlocutors.find(i => i.id === targetInterlocutorId);
    
    if (!sourceInterlocutor || !targetInterlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const requestIndex = sourceInterlocutor.insuranceRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      return {
        success: false,
        error: 'Demande d\'assurance non trouvée'
      };
    }

    const request = sourceInterlocutor.insuranceRequests[requestIndex];
    
    // Retirer la demande de l'interlocuteur source
    sourceInterlocutor.insuranceRequests.splice(requestIndex, 1);
    sourceInterlocutor.updatedAt = new Date().toISOString().split('T')[0];

    // Ajouter la demande à l'interlocuteur cible
    const transferredRequest = {
      ...request,
      interlocutorId: targetInterlocutorId,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    targetInterlocutor.insuranceRequests.push(transferredRequest);
    targetInterlocutor.updatedAt = new Date().toISOString().split('T')[0];

    return { success: true };
  }

  // Méthodes de suppression de modules
  static async deleteClaim(
    interlocutorId: string,
    claimId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const claimIndex = interlocutor.claims.findIndex(c => c.id === claimId);
    if (claimIndex === -1) {
      return {
        success: false,
        error: 'Sinistre non trouvé'
      };
    }

    interlocutor.claims.splice(claimIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];

    return { success: true };
  }

  static async deleteVehicle(
    interlocutorId: string,
    vehicleId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const vehicleIndex = interlocutor.vehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
      return {
        success: false,
        error: 'Véhicule non trouvé'
      };
    }

    interlocutor.vehicles.splice(vehicleIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];

    return { success: true };
  }

  static async deleteDriver(
    interlocutorId: string,
    driverId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const driverIndex = interlocutor.drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      return {
        success: false,
        error: 'Conducteur non trouvé'
      };
    }

    interlocutor.drivers.splice(driverIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];

    return { success: true };
  }

  static async deleteContract(
    interlocutorId: string,
    contractId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const contractIndex = interlocutor.contracts.findIndex(c => c.id === contractId);
    if (contractIndex === -1) {
      return {
        success: false,
        error: 'Contrat non trouvé'
      };
    }

    interlocutor.contracts.splice(contractIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];

    return { success: true };
  }

  static async deleteInsuranceRequest(
    interlocutorId: string,
    requestId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const requestIndex = interlocutor.insuranceRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      return {
        success: false,
        error: 'Demande d\'assurance non trouvée'
      };
    }

    interlocutor.insuranceRequests.splice(requestIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];

    return { success: true };
  }

  static async deleteEvent(
    interlocutorId: string,
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const eventIndex = interlocutor.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      return {
        success: false,
        error: 'Événement non trouvé'
      };
    }

    interlocutor.events.splice(eventIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];

    return { success: true };
  }

  static async createEvent(
    interlocutorId: string,
    eventData: Omit<Event, 'id' | 'interlocutorId' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; error?: string; event?: Event }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const newEvent: Event = {
      ...eventData,
      id: this.generateId(),
      interlocutorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    interlocutor.events.push(newEvent);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return { 
      success: true, 
      event: newEvent 
    };
  }

  static async createClaim(
    interlocutorId: string,
    claimData: Omit<Claim, 'id' | 'interlocutorId' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; error?: string; claim?: Claim }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);

    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const newClaim: Claim = {
      ...claimData,
      id: this.generateId(),
      interlocutorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!interlocutor.claims) interlocutor.claims = [];
    interlocutor.claims.push(newClaim);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return {
      success: true,
      claim: newClaim
    };
  }

  static async createVehicle(
    interlocutorId: string,
    vehicleData: Omit<Vehicle, 'id' | 'interlocutorId' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; error?: string; vehicle?: Vehicle }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);

    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const newVehicle: Vehicle = {
      ...vehicleData,
      id: this.generateId(),
      interlocutorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!interlocutor.vehicles) interlocutor.vehicles = [];
    interlocutor.vehicles.push(newVehicle);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return {
      success: true,
      vehicle: newVehicle
    };
  }

  static async createDriver(
    interlocutorId: string,
    driverData: Omit<Driver, 'id' | 'interlocutorId' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; error?: string; driver?: Driver }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);

    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const newDriver: Driver = {
      ...driverData,
      id: this.generateId(),
      interlocutorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!interlocutor.drivers) interlocutor.drivers = [];
    interlocutor.drivers.push(newDriver);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return {
      success: true,
      driver: newDriver
    };
  }

  static async createContract(
    interlocutorId: string,
    contractData: Omit<Contract, 'id' | 'interlocutorId' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; error?: string; contract?: Contract }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);

    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const newContract: Contract = {
      ...contractData,
      id: this.generateId(),
      interlocutorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!interlocutor.contracts) interlocutor.contracts = [];
    interlocutor.contracts.push(newContract);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return {
      success: true,
      contract: newContract
    };
  }

  static async createInsuranceRequest(
    interlocutorId: string,
    requestData: Omit<InsuranceRequest, 'id' | 'interlocutorId' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; error?: string; request?: InsuranceRequest }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);

    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const newRequest: InsuranceRequest = {
      ...requestData,
      id: this.generateId(),
      interlocutorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!interlocutor.insuranceRequests) interlocutor.insuranceRequests = [];
    interlocutor.insuranceRequests.push(newRequest);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return {
      success: true,
      request: newRequest
    };
  }

  static async deleteClaim(
    interlocutorId: string,
    claimId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    if (!interlocutor.claims) {
      return {
        success: false,
        error: 'Aucun sinistre trouvé'
      };
    }

    const claimIndex = interlocutor.claims.findIndex(c => c.id === claimId);
    if (claimIndex === -1) {
      return {
        success: false,
        error: 'Sinistre non trouvé'
      };
    }

    interlocutor.claims.splice(claimIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return { success: true };
  }

  static async deleteVehicle(
    interlocutorId: string,
    vehicleId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    if (!interlocutor.vehicles) {
      return {
        success: false,
        error: 'Aucun véhicule trouvé'
      };
    }

    const vehicleIndex = interlocutor.vehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
      return {
        success: false,
        error: 'Véhicule non trouvé'
      };
    }

    interlocutor.vehicles.splice(vehicleIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return { success: true };
  }

  static async deleteDriver(
    interlocutorId: string,
    driverId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    if (!interlocutor.drivers) {
      return {
        success: false,
        error: 'Aucun conducteur trouvé'
      };
    }

    const driverIndex = interlocutor.drivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      return {
        success: false,
        error: 'Conducteur non trouvé'
      };
    }

    interlocutor.drivers.splice(driverIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return { success: true };
  }

  // Méthodes pour les membres de famille
  static async createFamilyMember(
    interlocutorId: string,
    familyData: Omit<FamilyMember, 'id' | 'interlocutorId' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; error?: string; member?: FamilyMember }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);

    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const newMember: FamilyMember = {
      ...familyData,
      id: this.generateId(),
      interlocutorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!interlocutor.familyMembers) interlocutor.familyMembers = [];
    interlocutor.familyMembers.push(newMember);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return {
      success: true,
      member: newMember
    };
  }

  static async deleteFamilyMember(
    interlocutorId: string,
    memberId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    if (!interlocutor.familyMembers) {
      return {
        success: false,
        error: 'Aucun membre de famille trouvé'
      };
    }

    const memberIndex = interlocutor.familyMembers.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return {
        success: false,
        error: 'Membre de famille non trouvé'
      };
    }

    interlocutor.familyMembers.splice(memberIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return { success: true };
  }

  // Méthodes pour les relations d'entreprise
  static async createCompanyRelation(
    interlocutorId: string,
    companyData: Omit<CompanyRelation, 'id' | 'interlocutorId' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; error?: string; relation?: CompanyRelation }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);

    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    const newRelation: CompanyRelation = {
      ...companyData,
      id: this.generateId(),
      interlocutorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!interlocutor.companyRelations) interlocutor.companyRelations = [];
    interlocutor.companyRelations.push(newRelation);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return {
      success: true,
      relation: newRelation
    };
  }

  static async deleteCompanyRelation(
    interlocutorId: string,
    relationId: string
  ): Promise<{ success: boolean; error?: string }> {
    const interlocutor = interlocutors.find(i => i.id === interlocutorId);
    
    if (!interlocutor) {
      return {
        success: false,
        error: 'Interlocuteur non trouvé'
      };
    }

    if (!interlocutor.companyRelations) {
      return {
        success: false,
        error: 'Aucune relation d\'entreprise trouvée'
      };
    }

    const relationIndex = interlocutor.companyRelations.findIndex(r => r.id === relationId);
    if (relationIndex === -1) {
      return {
        success: false,
        error: 'Relation d\'entreprise non trouvée'
      };
    }

    interlocutor.companyRelations.splice(relationIndex, 1);
    interlocutor.updatedAt = new Date().toISOString().split('T')[0];
    saveInterlocutors(interlocutors);

    return { success: true };
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
