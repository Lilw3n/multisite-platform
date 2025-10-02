// Types principaux du système
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  ranks: UserRank[];
  sites: Site[];
  tokens: Token[];
}

export interface UserRank {
  id: string;
  userId: string;
  rankId: string;
  siteId: string;
  assignedAt: Date;
  assignedBy: string;
  isActive: boolean;
  rank: Rank;
}

export interface Rank {
  id: string;
  name: string;
  level: number; // 0 = Admin, plus élevé = moins prioritaire
  description: string;
  capabilities: Capability[];
  color: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  modules: string[]; // IDs des modules accessibles
}

export interface Permission {
  id: string;
  action: 'read' | 'write' | 'delete' | 'link' | 'unlink' | 'create' | 'modify';
  resource: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface Site {
  id: string;
  name: string;
  domain: string;
  description: string;
  parentSiteId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  interlocutors: Interlocutor[];
  modules: Module[];
  financialData: FinancialData;
}

export interface Interlocutor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  siteId: string;
  rankId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  linkedModules: Module[];
  financialData: InterlocutorFinancialData;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Module {
  id: string;
  name: string;
  type: ModuleType;
  description: string;
  siteId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isLinked: boolean;
  linkedTo: ModuleLink[];
  rules: ModuleRule[];
  data: any; // Données spécifiques au module
}

export type ModuleType = 
  | 'project' 
  | 'contract' 
  | 'quote' 
  | 'claim' 
  | 'event' 
  | 'document' 
  | 'task' 
  | 'financial'
  | 'insurance'
  | 'profile'
  | 'vehicle'
  | 'driver'
  | 'product'
  | 'custom';

export interface ModuleLink {
  id: string;
  moduleId: string;
  linkedToId: string;
  linkedToType: 'interlocutor' | 'module' | 'user';
  linkedAt: Date;
  linkedBy: string;
  isActive: boolean;
}

export interface ModuleRule {
  id: string;
  moduleId: string;
  type: 'rank_access' | 'visibility' | 'linking' | 'validation' | 'workflow';
  conditions: RuleCondition[];
  actions: RuleAction[];
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface RuleAction {
  type: 'allow' | 'deny' | 'require_approval' | 'send_notification';
  parameters: any;
}

export interface Token {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface FinancialData {
  siteId: string;
  payments: Payment[];
  receivables: Receivable[];
  debits: Debit[];
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
  lastUpdated: Date;
}

export interface InterlocutorFinancialData {
  interlocutorId: string;
  payments: Payment[];
  receivables: Receivable[];
  debits: Debit[];
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
  lastUpdated: Date;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  category: string;
  siteId: string;
  interlocutorId?: string;
  moduleId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  reference: string;
}

export interface Receivable {
  id: string;
  amount: number;
  currency: string;
  dueDate: Date;
  description: string;
  category: string;
  siteId: string;
  interlocutorId?: string;
  moduleId?: string;
  status: 'pending' | 'overdue' | 'paid' | 'cancelled';
  reminderSent: boolean;
  reminderCount: number;
  reference: string;
}

export interface Debit {
  id: string;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  category: string;
  siteId: string;
  interlocutorId?: string;
  moduleId?: string;
  status: 'pending' | 'paid' | 'cancelled';
  reference: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  senderId: string;
  recipientId: string;
  recipientType: 'user' | 'email' | 'group';
  createdAt: Date;
  dueDate?: Date;
  isExpirable: boolean;
  priority: 'critical' | 'high' | 'normal' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  linkedModules: string[];
  reminders: Reminder[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  senderId: string;
  recipientId: string;
  recipientType: 'user' | 'email' | 'group';
  createdAt: Date;
  eventDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
  linkedModules: string[];
  context: any;
}

export interface Reminder {
  id: string;
  taskId: string;
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
  type: 'email' | 'notification' | 'sms';
}

export interface InsuranceClaim {
  id: string;
  insurer: string;
  claimDate: Date;
  isAlreadyImpacted: boolean;
  crmCoefficient: number;
  crmUpdateDate: Date;
  countedInCalculation: boolean;
  responsibility: 'particular' | 'taxi' | 'vtc';
  responsibilityPercentage: number;
  calculationMethod: string;
  interlocutorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsurancePeriod {
  id: string;
  insurer: string;
  startDate: Date;
  endDate?: Date;
  documentDate?: Date;
  isActive: boolean;
  isResigned: boolean;
  resignationReason?: 'amicable' | 'unpaid' | 'false_declaration';
  interlocutorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  birthDate: Date;
  professionalExperience: number; // en mois
  totalExperience: number; // en mois
  licenseDate: Date;
  licenseNumber: string;
  status: 'active' | 'inactive' | 'suspended' | 'archived';
  isSuspended: boolean;
  isResigned: boolean;
  maxClaims: number;
  minCrm: number;
  maxCrm: number;
  minProExp: number;
  maxProExp: number;
  minTotalExp: number;
  maxTotalExp: number;
  riskCount: number;
  claims: InsuranceClaim[];
  periods: InsurancePeriod[];
  interlocutorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  registration: string;
  brand: string;
  model: string;
  firstRegistrationDate: Date;
  acquisitionDate: Date;
  energy: string;
  newPrice: number;
  argusValue: number;
  finish: string;
  sraCode: string;
  interlocutorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardConfig {
  id: string;
  userId: string;
  siteId: string;
  name: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: any;
  data: any;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
}

export interface TestMode {
  isActive: boolean;
  simulatedUserId?: string;
  simulatedRankId?: string;
  simulatedSiteId?: string;
  logs: TestLog[];
}

export interface TestLog {
  id: string;
  timestamp: Date;
  action: string;
  details: any;
  userId: string;
}

export interface Statistics {
  siteId?: string;
  totalUsers: number;
  totalInterlocutors: number;
  totalModules: number;
  totalTasks: number;
  totalEvents: number;
  totalRevenue: number;
  totalExpenses: number;
  activeUsers: number;
  pendingTasks: number;
  overdueReceivables: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface ViewMode {
  type: 'admin' | 'internal' | 'external';
  userId?: string;
  rankId?: string;
  siteId?: string;
  isSimulated: boolean;
}

// Types pour Entreprise et Famille
export interface Company {
  id: string;
  interlocutorId: string;
  name: string;
  siret: string;
  vatNumber: string;
  legalForm: string;
  capital: number;
  address: string;
  phone: string;
  email: string;
  website?: string;
  activity: string;
  employees: number;
  foundedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Family {
  id: string;
  interlocutorId: string;
  spouse?: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthDate?: Date;
    profession?: string;
  };
  children: Array<{
    firstName: string;
    lastName: string;
    birthDate: Date;
    relationship: 'child' | 'stepchild' | 'adopted';
  }>;
  emergencyContact: {
    firstName: string;
    lastName: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}