export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface InternalUser extends BaseUser {
  type: 'internal';
  employeeId: string;
  department: string;
  position: string;
  permissions: string[];
  accessLevel: 'admin' | 'manager' | 'employee' | 'intern';
  salary?: number;
  hireDate: string;
  supervisor?: string;
  internalNotes?: string;
}

export interface ExternalUser extends BaseUser {
  type: 'external';
  userType: 'client' | 'prospect' | 'partner' | 'freelancer' | 'vendor';
  company?: string;
  industry?: string;
  website?: string;
  linkedinProfile?: string;
  referredBy?: string;
  leadSource: 'website' | 'social' | 'referral' | 'advertising' | 'direct';
  customerValue: 'low' | 'medium' | 'high' | 'vip';
  subscriptionPlan?: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionExpiry?: string;
  totalSpent: number;
  loyaltyPoints: number;
  preferredContact: 'email' | 'phone' | 'sms' | 'whatsapp';
  marketingConsent: boolean;
  tags: string[];
}

export type User = InternalUser | ExternalUser;

export interface UserSession {
  userId: string;
  userType: 'internal' | 'external';
  token: string;
  expiresAt: string;
  permissions: string[];
  lastActivity: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: any;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserPreferences {
  userId: string;
  language: 'fr' | 'en' | 'es' | 'de';
  timezone: string;
  currency: 'EUR' | 'USD' | 'GBP';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    showActivity: boolean;
    allowMessages: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}
