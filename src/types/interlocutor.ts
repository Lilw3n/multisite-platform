export interface Interlocutor {
  id: string;
  type: 'user' | 'external';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  status: 'Actif' | 'Inactif' | 'En attente';
  role: 'client' | 'prospect' | 'partenaire' | 'fournisseur';
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  
  // Relations
  contracts: Contract[];
  insuranceRequests: InsuranceRequest[];
  claims: Claim[];
  vehicles: Vehicle[];
  drivers: Driver[];
  events: Event[];
  familyMembers: FamilyMember[];
  companyRelations: CompanyRelation[];
  
  // Informations spécifiques selon le type
  userAccount?: {
    userId: string;
    permissions: string[];
    lastLogin: string;
  };
  
  externalInfo?: {
    source: 'website' | 'phone' | 'email' | 'referral';
    notes: string;
    assignedTo: string;
  };
}

export interface Contract {
  id: string;
  interlocutorId: string;
  type: 'assurance' | 'transport' | 'maintenance' | 'autre';
  status: 'En cours' | 'Expiré' | 'Résilié' | 'En attente';
  startDate: string;
  endDate: string;
  premium: number;
  insurer: string;
  policyNumber: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceRequest {
  id: string;
  interlocutorId: string;
  type: 'devis' | 'souscription' | 'modification' | 'resiliation';
  status: 'En attente' | 'En cours' | 'Accepté' | 'Refusé' | 'Expiré';
  vehicleId?: string;
  driverId?: string;
  requestedDate: string;
  processedDate?: string;
  amount?: number;
  description: string;
  priority: 'Faible' | 'Moyenne' | 'Élevée' | 'Urgente';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  id: string;
  interlocutorId: string;
  vehicleId?: string;
  driverId?: string;
  type: 'materialRC100' | 'materialRC50' | 'materialRC25' | 'materialRC0' | 'bodilyRC100' | 'bodilyRC50' | 'bodilyRC25' | 'bodilyRC0' | 'glassBreakage' | 'theft' | 'fire' | 'naturalDisaster';
  date: string;
  amount: number;
  description: string;
  responsible: boolean;
  percentage: number;
  insurer: string;
  status: 'En cours' | 'Résolu' | 'Refusé' | 'En attente';
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  interlocutorId: string;
  registration: string;
  brand: string;
  model: string;
  year: number;
  type: 'Voiture particulière' | 'Véhicule utilitaire' | 'Moto' | 'Camion' | 'Autre';
  status: 'Assuré' | 'En attente' | 'Expiré';
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  interlocutorId: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseType: string;
  status: 'Actif' | 'En attente' | 'Expiré';
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  interlocutorId: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'document';
  title: string;
  description: string;
  date: string;
  time: string;
  participants: EventParticipant[];
  attachments: EventAttachment[];
  status: 'completed' | 'pending' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface EventParticipant {
  id: string;
  name: string;
  role: 'sender' | 'recipient' | 'attendee';
  email?: string;
}

export interface EventAttachment {
  id: string;
  name: string;
  type: 'document' | 'link' | 'image' | 'pdf';
  url?: string;
  size?: number;
}

export interface FamilyMember {
  id: string;
  interlocutorId: string;
  firstName: string;
  lastName: string;
  relationship: 'conjoint' | 'enfant' | 'parent' | 'frere' | 'soeur' | 'autre';
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  isBeneficiary: boolean;
  isEmergencyContact: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRelation {
  id: string;
  interlocutorId: string;
  companyName: string;
  role: 'salarie' | 'associe' | 'dirigeant' | 'actionnaire' | 'partenaire' | 'fournisseur' | 'client';
  position?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}