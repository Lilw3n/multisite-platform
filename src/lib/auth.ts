import { User, Token } from '@/types';

// Base de données simulée simplifiée
const users: User[] = [
  {
    id: '1',
    email: 'admin@diddyhome.com',
    password: 'DiddyHome2025',
    firstName: 'Admin',
    lastName: 'DiddyHome',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
    ranks: [{
      id: '1',
      userId: '1',
      rankId: '1',
      siteId: 'default',
      assignedAt: new Date(),
      assignedBy: 'system',
      isActive: true,
      rank: {
        id: '1',
        name: 'Administrateur',
        level: 0,
        description: 'Administrateur système',
        capabilities: [],
        color: '#3B82F6',
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }],
    sites: [],
    tokens: []
  }
];

const tokens = new Map<string, Token>();

export class AuthService {
  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user || !user.isActive) {
      return null;
    }

    const token = this.generateToken();
    const tokenData: Token = {
      id: token,
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      permissions: ['*'], // Admin a tous les droits
      isActive: true,
      createdAt: new Date()
    };

    tokens.set(token, tokenData);
    user.tokens.push(tokenData);

    return { user, token };
  }

  static async logout(token: string): Promise<boolean> {
    const tokenData = tokens.get(token);
    if (tokenData) {
      tokenData.isActive = false;
      tokens.delete(token);
      return true;
    }
    return false;
  }

  static async validateToken(token: string): Promise<User | null> {
    const tokenData = tokens.get(token);
    
    if (!tokenData || !tokenData.isActive || tokenData.expiresAt < new Date()) {
      return null;
    }

    const user = users.find(u => u.id === tokenData.userId);
    return user || null;
  }

  static validateTokenSync(token: string): User | null {
    const tokenData = tokens.get(token);
    
    if (!tokenData || !tokenData.isActive || tokenData.expiresAt < new Date()) {
      return null;
    }

    const user = users.find(u => u.id === tokenData.userId);
    return user || null;
  }

  static async getUserById(userId: string): Promise<User | null> {
    return users.find(u => u.id === userId) || null;
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'ranks' | 'sites' | 'tokens'>): Promise<User> {
    const user: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ranks: [],
      sites: [],
      tokens: []
    };

    users.push(user);
    return user;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date()
    };

    return users[userIndex];
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    users[userIndex].isActive = false;
    return true;
  }

  static async getAllUsers(): Promise<User[]> {
    return users.filter(u => u.isActive);
  }

  private static generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
