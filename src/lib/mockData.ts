import { User, Interlocutor, FinancialTransaction, Task, Event, InsurancePeriod, Driver, Vehicle, Claim } from '@/types';

// Données fictives pour les interlocuteurs
export const mockInterlocutors: Interlocutor[] = [
  {
    id: '1',
    name: 'SARL Transport Express',
    type: 'company',
    email: 'contact@diddyhome.com',
    phone: '01 23 45 67 89',
    address: '123 Rue de la Logistique, 75001 Paris',
    siret: '12345678901234',
    vatNumber: 'FR12345678901',
    contactPerson: 'Jean Dupont',
    status: 'active',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-09-15'),
    notes: 'Client fidèle depuis 3 ans, excellent payeur',
    tags: ['transport', 'logistique', 'fidèle']
  },
  {
    id: '2',
    name: 'Restaurant Le Gourmet',
    type: 'company',
    email: 'contact@diddyhome.com',
    phone: '01 34 56 78 90',
    address: '45 Avenue des Champs, 69000 Lyon',
    siret: '23456789012345',
    vatNumber: 'FR23456789012',
    contactPerson: 'Marie Martin',
    status: 'active',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-09-20'),
    notes: 'Nouveau client, secteur restauration',
    tags: ['restauration', 'nouveau', 'lyon']
  },
  {
    id: '3',
    name: 'Pierre Durand',
    type: 'individual',
    email: 'contact@diddyhome.com',
    phone: '06 12 34 56 78',
    address: '78 Rue de la Paix, 13000 Marseille',
    siret: null,
    vatNumber: null,
    contactPerson: 'Pierre Durand',
    status: 'active',
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2024-09-25'),
    notes: 'Particulier, plusieurs véhicules',
    tags: ['particulier', 'multi-véhicules', 'marseille']
  },
  {
    id: '4',
    name: 'Clinique Saint-Pierre',
    type: 'company',
    email: 'contact@diddyhome.com',
    phone: '01 45 67 89 01',
    address: '12 Boulevard de la Santé, 31000 Toulouse',
    siret: '34567890123456',
    vatNumber: 'FR34567890123',
    contactPerson: 'Dr. Sophie Bernard',
    status: 'active',
    createdAt: new Date('2022-11-05'),
    updatedAt: new Date('2024-09-28'),
    notes: 'Établissement de santé, contrat groupe',
    tags: ['santé', 'groupe', 'toulouse']
  },
  {
    id: '5',
    name: 'Boulangerie Artisanale',
    type: 'company',
    email: 'contact@diddyhome.com',
    phone: '01 56 78 90 12',
    address: '9 Place du Marché, 44000 Nantes',
    siret: '45678901234567',
    vatNumber: 'FR45678901234',
    contactPerson: 'Michel Boulanger',
    status: 'inactive',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-08-30'),
    notes: 'Client suspendu temporairement',
    tags: ['artisanat', 'boulangerie', 'nantes', 'suspendu']
  }
];

// Données fictives pour les utilisateurs
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'lilwen.song@gmail.pro.com',
    password: 'Reunion2025',
    firstName: 'Lilwen',
    lastName: 'Song',
    phone: '01 00 00 00 01',
    isActive: true,
    lastLogin: new Date('2024-09-30T08:30:00'),
    createdAt: new Date('2023-01-01'),
    roles: [
      {
        id: '1',
        name: 'Administrateur',
        level: 0,
        permissions: ['all']
      }
    ]
  },
  {
    id: '2',
    email: 'contact@diddyhome.com',
    password: 'direction123',
    firstName: 'Marie',
    lastName: 'Direction',
    phone: '01 00 00 00 02',
    isActive: true,
    lastLogin: new Date('2024-09-30T09:15:00'),
    createdAt: new Date('2023-01-15'),
    roles: [
      {
        id: '2',
        name: 'Direction',
        level: 1,
        permissions: ['users:read', 'financial:read', 'reports:read']
      }
    ]
  },
  {
    id: '3',
    email: 'contact@diddyhome.com',
    password: 'commercial123',
    firstName: 'Jean',
    lastName: 'Commercial',
    phone: '01 00 00 00 03',
    isActive: true,
    lastLogin: new Date('2024-09-30T10:00:00'),
    createdAt: new Date('2023-02-01'),
    roles: [
      {
        id: '3',
        name: 'Commercial',
        level: 2,
        permissions: ['interlocutors:read', 'interlocutors:write', 'contracts:read']
      }
    ]
  },
  {
    id: '4',
    email: 'contact@diddyhome.com',
    password: 'comptable123',
    firstName: 'Sophie',
    lastName: 'Comptable',
    phone: '01 00 00 00 04',
    isActive: true,
    lastLogin: new Date('2024-09-30T11:30:00'),
    createdAt: new Date('2023-02-15'),
    roles: [
      {
        id: '4',
        name: 'Comptable',
        level: 2,
        permissions: ['financial:read', 'financial:write', 'reports:read']
      }
    ]
  },
  {
    id: '5',
    email: 'contact@diddyhome.com',
    password: 'agent123',
    firstName: 'Paul',
    lastName: 'Agent',
    phone: '01 00 00 00 05',
    isActive: true,
    lastLogin: new Date('2024-09-30T14:20:00'),
    createdAt: new Date('2023-03-01'),
    roles: [
      {
        id: '5',
        name: 'Agent',
        level: 3,
        permissions: ['interlocutors:read', 'contracts:read']
      }
    ]
  }
];

// Données fictives pour les véhicules
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    brand: 'Renault',
    model: 'Master',
    finish: 'L2H2 2.3 dCi 150',
    registration: 'AB-123-CD',
    sraCode: 'RENAULT_MASTER_L2H2',
    interlocutor: 'SARL Transport Express',
    firstRegistrationDate: new Date('2022-03-15'),
    acquisitionDate: new Date('2022-03-20'),
    energy: 'Diesel',
    power: '150 ch',
    co2: '185 g/km',
    value: 35000,
    status: 'active',
    createdAt: new Date('2022-03-20'),
    updatedAt: new Date('2024-09-15')
  },
  {
    id: '2',
    brand: 'Peugeot',
    model: 'Partner',
    finish: 'L1H1 1.6 BlueHDi 100',
    registration: 'EF-456-GH',
    sraCode: 'PEUGEOT_PARTNER_L1H1',
    interlocutor: 'Restaurant Le Gourmet',
    firstRegistrationDate: new Date('2023-01-10'),
    acquisitionDate: new Date('2023-01-15'),
    energy: 'Diesel',
    power: '100 ch',
    co2: '120 g/km',
    value: 25000,
    status: 'active',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-09-20')
  },
  {
    id: '3',
    brand: 'Citroën',
    model: 'Berlingo',
    finish: 'L1H1 1.5 BlueHDi 100',
    registration: 'IJ-789-KL',
    sraCode: 'CITROEN_BERLINGO_L1H1',
    interlocutor: 'Pierre Durand',
    firstRegistrationDate: new Date('2023-05-20'),
    acquisitionDate: new Date('2023-05-25'),
    energy: 'Diesel',
    power: '100 ch',
    co2: '125 g/km',
    value: 22000,
    status: 'active',
    createdAt: new Date('2023-05-25'),
    updatedAt: new Date('2024-09-25')
  },
  {
    id: '4',
    brand: 'Ford',
    model: 'Transit',
    finish: 'L2H2 2.0 EcoBlue 130',
    registration: 'MN-012-OP',
    sraCode: 'FORD_TRANSIT_L2H2',
    interlocutor: 'Clinique Saint-Pierre',
    firstRegistrationDate: new Date('2022-11-01'),
    acquisitionDate: new Date('2022-11-05'),
    energy: 'Diesel',
    power: '130 ch',
    co2: '165 g/km',
    value: 32000,
    status: 'active',
    createdAt: new Date('2022-11-05'),
    updatedAt: new Date('2024-09-28')
  },
  {
    id: '5',
    brand: 'Mercedes',
    model: 'Sprinter',
    finish: 'L2H2 2.1 CDI 163',
    registration: 'QR-345-ST',
    sraCode: 'MERCEDES_SPRINTER_L2H2',
    interlocutor: 'Boulangerie Artisanale',
    firstRegistrationDate: new Date('2023-08-10'),
    acquisitionDate: new Date('2023-08-15'),
    energy: 'Diesel',
    power: '163 ch',
    co2: '195 g/km',
    value: 45000,
    status: 'inactive',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-08-30')
  }
];

// Données fictives pour les conducteurs
export const mockDrivers: Driver[] = [
  {
    id: '1',
    firstName: 'Marc',
    lastName: 'Chauffeur',
    email: 'contact@diddyhome.com',
    phone: '06 11 22 33 44',
    licenseNumber: '1234567890',
    licenseDate: new Date('2018-05-15'),
    licenseType: 'B',
    status: 'active',
    interlocutor: 'SARL Transport Express',
    createdAt: new Date('2022-03-20'),
    updatedAt: new Date('2024-09-15')
  },
  {
    id: '2',
    firstName: 'Julie',
    lastName: 'Livreur',
    email: 'contact@diddyhome.com',
    phone: '06 22 33 44 55',
    licenseNumber: '2345678901',
    licenseDate: new Date('2020-08-20'),
    licenseType: 'B',
    status: 'active',
    interlocutor: 'Restaurant Le Gourmet',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-09-20')
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Durand',
    email: 'contact@diddyhome.com',
    phone: '06 12 34 56 78',
    licenseNumber: '3456789012',
    licenseDate: new Date('2015-12-10'),
    licenseType: 'B',
    status: 'active',
    interlocutor: 'Pierre Durand',
    createdAt: new Date('2023-05-25'),
    updatedAt: new Date('2024-09-25')
  },
  {
    id: '4',
    firstName: 'Dr. Sophie',
    lastName: 'Bernard',
    email: 'contact@diddyhome.com',
    phone: '06 33 44 55 66',
    licenseNumber: '4567890123',
    licenseDate: new Date('2010-03-25'),
    licenseType: 'B',
    status: 'active',
    interlocutor: 'Clinique Saint-Pierre',
    createdAt: new Date('2022-11-05'),
    updatedAt: new Date('2024-09-28')
  },
  {
    id: '5',
    firstName: 'Michel',
    lastName: 'Boulanger',
    email: 'contact@diddyhome.com',
    phone: '06 44 55 66 77',
    licenseNumber: '5678901234',
    licenseDate: new Date('2008-09-15'),
    licenseType: 'B',
    status: 'inactive',
    interlocutor: 'Boulangerie Artisanale',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-08-30')
  }
];

// Données fictives pour les périodes d'assurance
export const mockInsurancePeriods: InsurancePeriod[] = [
  {
    id: '1',
    insurer: 'AXA',
    contractNumber: 'AXA-2024-001',
    interlocutor: 'SARL Transport Express',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    premium: 2500,
    isActive: true,
    isResigned: false,
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-09-15')
  },
  {
    id: '2',
    insurer: 'Groupama',
    contractNumber: 'GRP-2024-002',
    interlocutor: 'Restaurant Le Gourmet',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2025-01-31'),
    premium: 1800,
    isActive: true,
    isResigned: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-09-20')
  },
  {
    id: '3',
    insurer: 'MACIF',
    contractNumber: 'MAC-2024-003',
    interlocutor: 'Pierre Durand',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2025-05-31'),
    premium: 1200,
    isActive: true,
    isResigned: false,
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-09-25')
  },
  {
    id: '4',
    insurer: 'Allianz',
    contractNumber: 'ALL-2024-004',
    interlocutor: 'Clinique Saint-Pierre',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    premium: 3200,
    isActive: true,
    isResigned: false,
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-09-28')
  },
  {
    id: '5',
    insurer: 'MAIF',
    contractNumber: 'MAI-2023-005',
    interlocutor: 'Boulangerie Artisanale',
    startDate: new Date('2023-08-01'),
    endDate: new Date('2024-07-31'),
    premium: 2000,
    isActive: false,
    isResigned: true,
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date('2024-08-30')
  }
];

// Données fictives pour les transactions financières
export const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: '1',
    type: 'receivable',
    amount: 2500,
    description: 'Prime d\'assurance AXA - SARL Transport Express',
    interlocutor: 'SARL Transport Express',
    dueDate: new Date('2024-01-15'),
    status: 'paid',
    paymentDate: new Date('2024-01-10'),
    reference: 'FAC-2024-001',
    category: 'Assurance',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '2',
    type: 'receivable',
    amount: 1800,
    description: 'Prime d\'assurance Groupama - Restaurant Le Gourmet',
    interlocutor: 'Restaurant Le Gourmet',
    dueDate: new Date('2024-02-15'),
    status: 'pending',
    paymentDate: null,
    reference: 'FAC-2024-002',
    category: 'Assurance',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-09-20')
  },
  {
    id: '3',
    type: 'receivable',
    amount: 1200,
    description: 'Prime d\'assurance MACIF - Pierre Durand',
    interlocutor: 'Pierre Durand',
    dueDate: new Date('2024-06-15'),
    status: 'overdue',
    paymentDate: null,
    reference: 'FAC-2024-003',
    category: 'Assurance',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-09-25')
  },
  {
    id: '4',
    type: 'debit',
    amount: 500,
    description: 'Commission courtier',
    interlocutor: 'Courtier Partenaire',
    dueDate: new Date('2024-10-15'),
    status: 'pending',
    paymentDate: null,
    reference: 'DEB-2024-001',
    category: 'Commission',
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-15')
  },
  {
    id: '5',
    type: 'receivable',
    amount: 3200,
    description: 'Prime d\'assurance Allianz - Clinique Saint-Pierre',
    interlocutor: 'Clinique Saint-Pierre',
    dueDate: new Date('2024-01-15'),
    status: 'paid',
    paymentDate: new Date('2024-01-12'),
    reference: 'FAC-2024-004',
    category: 'Assurance',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-12')
  }
];

// Données fictives pour les tâches
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Relancer SARL Transport Express',
    description: 'Appeler pour confirmer le renouvellement du contrat',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Jean Commercial',
    dueDate: new Date('2024-10-05'),
    createdAt: new Date('2024-09-25'),
    updatedAt: new Date('2024-09-25'),
    tags: ['relance', 'renouvellement']
  },
  {
    id: '2',
    title: 'Traiter sinistre Restaurant Le Gourmet',
    description: 'Déclaration de sinistre suite à collision',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Sophie Comptable',
    dueDate: new Date('2024-10-02'),
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-09-28'),
    tags: ['sinistre', 'urgent']
  },
  {
    id: '3',
    title: 'Mettre à jour données Pierre Durand',
    description: 'Vérifier et mettre à jour les informations personnelles',
    status: 'completed',
    priority: 'low',
    assignedTo: 'Paul Agent',
    dueDate: new Date('2024-09-30'),
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-25'),
    tags: ['mise-à-jour', 'données']
  },
  {
    id: '4',
    title: 'Préparer rapport mensuel',
    description: 'Générer le rapport d\'activité du mois de septembre',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Marie Direction',
    dueDate: new Date('2024-10-10'),
    createdAt: new Date('2024-09-28'),
    updatedAt: new Date('2024-09-28'),
    tags: ['rapport', 'mensuel']
  },
  {
    id: '5',
    title: 'Contacter Boulangerie Artisanale',
    description: 'Vérifier le statut du contrat suspendu',
    status: 'pending',
    priority: 'low',
    assignedTo: 'Jean Commercial',
    dueDate: new Date('2024-10-15'),
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-09-20'),
    tags: ['suspension', 'vérification']
  }
];

// Données fictives pour les événements
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Renouvellement contrat AXA',
    description: 'Contrat SARL Transport Express renouvelé automatiquement',
    type: 'contract_renewal',
    date: new Date('2024-01-01'),
    interlocutor: 'SARL Transport Express',
    status: 'completed',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Déclaration de sinistre',
    description: 'Collision mineure Restaurant Le Gourmet',
    type: 'claim',
    date: new Date('2024-09-20'),
    interlocutor: 'Restaurant Le Gourmet',
    status: 'in_progress',
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-09-28')
  },
  {
    id: '3',
    title: 'Nouveau contrat MACIF',
    description: 'Souscription Pierre Durand',
    type: 'new_contract',
    date: new Date('2024-06-01'),
    interlocutor: 'Pierre Durand',
    status: 'completed',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01')
  },
  {
    id: '4',
    title: 'Résiliation contrat MAIF',
    description: 'Résiliation Boulangerie Artisanale',
    type: 'contract_termination',
    date: new Date('2024-08-30'),
    interlocutor: 'Boulangerie Artisanale',
    status: 'completed',
    createdAt: new Date('2024-08-30'),
    updatedAt: new Date('2024-08-30')
  },
  {
    id: '5',
    title: 'Paiement reçu',
    description: 'Paiement prime Allianz Clinique Saint-Pierre',
    type: 'payment_received',
    date: new Date('2024-01-12'),
    interlocutor: 'Clinique Saint-Pierre',
    status: 'completed',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
];

// Données fictives pour les sinistres
export const mockClaims: Claim[] = [
  {
    id: '1',
    claimNumber: 'SIN-2024-001',
    interlocutor: 'Restaurant Le Gourmet',
    vehicle: 'EF-456-GH',
    description: 'Collision avec un autre véhicule en stationnement',
    incidentDate: new Date('2024-09-15'),
    reportDate: new Date('2024-09-16'),
    status: 'in_progress',
    estimatedAmount: 2500,
    finalAmount: null,
    insurer: 'Groupama',
    createdAt: new Date('2024-09-16'),
    updatedAt: new Date('2024-09-28')
  },
  {
    id: '2',
    claimNumber: 'SIN-2024-002',
    interlocutor: 'SARL Transport Express',
    vehicle: 'AB-123-CD',
    description: 'Vol de marchandises dans le véhicule',
    incidentDate: new Date('2024-08-20'),
    reportDate: new Date('2024-08-21'),
    status: 'closed',
    estimatedAmount: 5000,
    finalAmount: 4500,
    insurer: 'AXA',
    createdAt: new Date('2024-08-21'),
    updatedAt: new Date('2024-09-10')
  },
  {
    id: '3',
    claimNumber: 'SIN-2024-003',
    interlocutor: 'Pierre Durand',
    vehicle: 'IJ-789-KL',
    description: 'Dégâts des eaux suite à inondation',
    incidentDate: new Date('2024-07-10'),
    reportDate: new Date('2024-07-11'),
    status: 'closed',
    estimatedAmount: 3000,
    finalAmount: 2800,
    insurer: 'MACIF',
    createdAt: new Date('2024-07-11'),
    updatedAt: new Date('2024-08-15')
  }
];

// Fonctions utilitaires pour accéder aux données
export const getInterlocutorById = (id: string): Interlocutor | undefined => {
  return mockInterlocutors.find(interlocutor => interlocutor.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getVehicleById = (id: string): Vehicle | undefined => {
  return mockVehicles.find(vehicle => vehicle.id === id);
};

export const getDriverById = (id: string): Driver | undefined => {
  return mockDrivers.find(driver => driver.id === id);
};

export const getInsurancePeriodById = (id: string): InsurancePeriod | undefined => {
  return mockInsurancePeriods.find(period => period.id === id);
};

export const getFinancialTransactionById = (id: string): FinancialTransaction | undefined => {
  return mockFinancialTransactions.find(transaction => transaction.id === id);
};

export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find(task => task.id === id);
};

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

export const getClaimById = (id: string): Claim | undefined => {
  return mockClaims.find(claim => claim.id === id);
};
