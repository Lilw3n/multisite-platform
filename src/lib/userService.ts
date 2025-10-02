import { User, InternalUser, ExternalUser, UserSession, UserActivity } from '@/types/user';

const USERS_STORAGE_KEY = 'diddyhome_users';
const SESSIONS_STORAGE_KEY = 'diddyhome_sessions';

// Utilisateurs par défaut
const defaultUsers: User[] = [
  // Utilisateurs internes
  {
    id: 'internal_1',
    type: 'internal',
    email: 'admin@diddyhome.com',
    firstName: 'Admin',
    lastName: 'DiddyHome',
    avatar: '👨‍💼',
    phone: '06 95 82 08 66',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2025-01-02',
    lastLogin: '2025-01-02 10:30',
    emailVerified: true,
    phoneVerified: true,
    employeeId: 'EMP001',
    department: 'Direction',
    position: 'CEO & Fondateur',
    permissions: ['*'],
    accessLevel: 'admin',
    hireDate: '2023-01-01',
    internalNotes: 'Fondateur et dirigeant principal'
  },
  {
    id: 'internal_2',
    type: 'internal',
    email: 'manager@diddyhome.com',
    firstName: 'Sophie',
    lastName: 'Manager',
    avatar: '👩‍💼',
    phone: '06 12 34 56 78',
    isActive: true,
    createdAt: '2023-02-15',
    updatedAt: '2025-01-02',
    lastLogin: '2025-01-02 09:15',
    emailVerified: true,
    phoneVerified: true,
    employeeId: 'EMP002',
    department: 'Commercial',
    position: 'Responsable Commercial',
    permissions: ['sales', 'clients', 'reports'],
    accessLevel: 'manager',
    hireDate: '2023-02-15',
    supervisor: 'internal_1'
  },
  // Utilisateurs externes
  {
    id: 'external_1',
    type: 'external',
    email: 'client.premium@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    avatar: '👨‍🚗',
    phone: '06 98 76 54 32',
    isActive: true,
    createdAt: '2024-03-10',
    updatedAt: '2025-01-02',
    lastLogin: '2025-01-02 14:20',
    emailVerified: true,
    phoneVerified: true,
    userType: 'client',
    company: 'Transport Dupont SARL',
    industry: 'Transport',
    website: 'www.transport-dupont.fr',
    referredBy: 'internal_2',
    leadSource: 'referral',
    customerValue: 'high',
    subscriptionPlan: 'premium',
    subscriptionExpiry: '2025-12-31',
    totalSpent: 15420,
    loyaltyPoints: 1542,
    preferredContact: 'email',
    marketingConsent: true,
    tags: ['VIP', 'Fidèle', 'Recommandeur']
  },
  {
    id: 'external_2',
    type: 'external',
    email: 'freelancer@example.com',
    firstName: 'Marie',
    lastName: 'Expert',
    avatar: '👩‍💻',
    phone: '07 11 22 33 44',
    isActive: true,
    createdAt: '2024-06-20',
    updatedAt: '2025-01-02',
    lastLogin: '2025-01-02 16:45',
    emailVerified: true,
    phoneVerified: false,
    userType: 'freelancer',
    company: 'Marie Expert Consulting',
    industry: 'Conseil',
    linkedinProfile: 'linkedin.com/in/marie-expert',
    leadSource: 'website',
    customerValue: 'medium',
    subscriptionPlan: 'basic',
    subscriptionExpiry: '2025-06-20',
    totalSpent: 2890,
    loyaltyPoints: 289,
    preferredContact: 'email',
    marketingConsent: true,
    tags: ['Expert', 'Consultant', 'Actif']
  }
];

export class UserService {
  
  /**
   * Récupérer tous les utilisateurs
   */
  static getAllUsers(): User[] {
    if (typeof window === 'undefined') {
      return defaultUsers;
    }

    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.length > 0 ? parsed : defaultUsers;
      }
      
      this.saveUsers(defaultUsers);
      return defaultUsers;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return defaultUsers;
    }
  }

  /**
   * Sauvegarder tous les utilisateurs
   */
  static saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
    }
  }

  /**
   * Récupérer un utilisateur par ID
   */
  static getUserById(id: string): User | null {
    const users = this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  /**
   * Récupérer un utilisateur par email
   */
  static getUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  /**
   * Récupérer les utilisateurs par type
   */
  static getUsersByType(type: 'internal' | 'external'): User[] {
    const users = this.getAllUsers();
    return users.filter(user => user.type === type);
  }

  /**
   * Récupérer les utilisateurs internes
   */
  static getInternalUsers(): InternalUser[] {
    return this.getUsersByType('internal') as InternalUser[];
  }

  /**
   * Récupérer les utilisateurs externes
   */
  static getExternalUsers(): ExternalUser[] {
    return this.getUsersByType('external') as ExternalUser[];
  }

  /**
   * Créer un nouvel utilisateur
   */
  static createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const users = this.getAllUsers();
    
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as User;

    users.push(newUser);
    this.saveUsers(users);
    
    return newUser;
  }

  /**
   * Mettre à jour un utilisateur
   */
  static updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getAllUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveUsers(users);
    return users[index];
  }

  /**
   * Supprimer un utilisateur
   */
  static deleteUser(id: string): boolean {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false;
    }

    this.saveUsers(filteredUsers);
    return true;
  }

  /**
   * Authentifier un utilisateur
   */
  static authenticateUser(email: string, password: string): { user: User; session: UserSession } | null {
    const user = this.getUserByEmail(email);
    
    if (!user || !user.isActive) {
      return null;
    }

    // Simulation de vérification du mot de passe
    const validPasswords: { [key: string]: string } = {
      'admin@diddyhome.com': 'DiddyHome2025',
      'manager@diddyhome.com': 'Manager2025',
      'client.premium@example.com': 'Client2025',
      'freelancer@example.com': 'Freelancer2025'
    };

    if (validPasswords[email] !== password) {
      return null;
    }

    // Créer une session
    const session: UserSession = {
      userId: user.id,
      userType: user.type,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      permissions: user.type === 'internal' ? (user as InternalUser).permissions : ['basic'],
      lastActivity: new Date().toISOString()
    };

    // Mettre à jour la dernière connexion
    this.updateUser(user.id, { lastLogin: new Date().toISOString() });

    return { user, session };
  }

  /**
   * Rechercher des utilisateurs
   */
  static searchUsers(query: string, type?: 'internal' | 'external'): User[] {
    let users = this.getAllUsers();
    
    if (type) {
      users = users.filter(user => user.type === type);
    }

    const lowercaseQuery = query.toLowerCase();
    
    return users.filter(user => 
      user.firstName.toLowerCase().includes(lowercaseQuery) ||
      user.lastName.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      (user.type === 'external' && (user as ExternalUser).company?.toLowerCase().includes(lowercaseQuery)) ||
      (user.type === 'internal' && (user as InternalUser).department.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Obtenir les statistiques des utilisateurs
   */
  static getUserStats(): {
    total: number;
    internal: number;
    external: number;
    active: number;
    inactive: number;
    verified: number;
    byType: { [key: string]: number };
  } {
    const users = this.getAllUsers();
    
    const stats = {
      total: users.length,
      internal: users.filter(u => u.type === 'internal').length,
      external: users.filter(u => u.type === 'external').length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      verified: users.filter(u => u.emailVerified).length,
      byType: {} as { [key: string]: number }
    };

    // Compter par sous-type
    users.forEach(user => {
      if (user.type === 'external') {
        const externalUser = user as ExternalUser;
        stats.byType[externalUser.userType] = (stats.byType[externalUser.userType] || 0) + 1;
      } else {
        const internalUser = user as InternalUser;
        stats.byType[internalUser.accessLevel] = (stats.byType[internalUser.accessLevel] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Enregistrer l'activité d'un utilisateur
   */
  static logUserActivity(userId: string, action: string, details: any): void {
    const activity: UserActivity = {
      id: this.generateId(),
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1', // Simulation
      userAgent: navigator?.userAgent || 'Unknown'
    };

    // Sauvegarder l'activité (simulation)
    console.log('User Activity:', activity);
  }

  /**
   * Vérifier les permissions d'un utilisateur
   */
  static hasPermission(userId: string, permission: string): boolean {
    const user = this.getUserById(userId);
    
    if (!user || !user.isActive) return false;
    
    if (user.type === 'internal') {
      const internalUser = user as InternalUser;
      return internalUser.permissions.includes('*') || internalUser.permissions.includes(permission);
    }
    
    // Permissions de base pour les utilisateurs externes
    const basicPermissions = ['profile', 'orders', 'support'];
    return basicPermissions.includes(permission);
  }

  /**
   * Générer un ID unique
   */
  private static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Générer un token de session
   */
  private static generateToken(): string {
    return 'token_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 16);
  }

  /**
   * Valider un token de session
   */
  static validateSession(token: string): UserSession | null {
    // Simulation de validation de session
    // Dans un vrai système, ceci serait stocké en base de données
    return null;
  }

  /**
   * Promouvoir un utilisateur externe en interne
   */
  static promoteToInternal(externalUserId: string, internalData: Omit<InternalUser, keyof ExternalUser>): InternalUser | null {
    const user = this.getUserById(externalUserId);
    
    if (!user || user.type !== 'external') return null;

    const externalUser = user as ExternalUser;
    
    // Créer le nouvel utilisateur interne
    const internalUser: InternalUser = {
      ...externalUser,
      type: 'internal',
      ...internalData,
      updatedAt: new Date().toISOString()
    };

    // Supprimer les propriétés spécifiques aux externes
    delete (internalUser as any).userType;
    delete (internalUser as any).company;
    delete (internalUser as any).industry;
    delete (internalUser as any).customerValue;
    delete (internalUser as any).subscriptionPlan;
    delete (internalUser as any).totalSpent;
    delete (internalUser as any).loyaltyPoints;

    // Mettre à jour dans le stockage
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === externalUserId);
    
    if (index !== -1) {
      users[index] = internalUser;
      this.saveUsers(users);
      return internalUser;
    }

    return null;
  }
}
