import { User } from '@/types';

// Interface pour les données de session
interface SessionData {
  user: User;
  token: string;
  expiresAt: number;
  createdAt: number;
  lastActivity: number;
}

// Clé de stockage
const SESSION_KEY = 'diddyhome_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures
const ACTIVITY_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Service d'authentification persistante
 */
export class PersistentAuthService {
  
  /**
   * Créer une session utilisateur
   */
  static createSession(user: User, token: string): void {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const sessionData: SessionData = {
      user,
      token,
      expiresAt: now + SESSION_DURATION,
      createdAt: now,
      lastActivity: now
    };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_name', `${user.firstName} ${user.lastName}`);
      localStorage.setItem('user_role', this.getUserRole(user));
      localStorage.setItem('view_mode', this.getUserRole(user));
    } catch (error) {
      console.error('Erreur lors de la création de session:', error);
    }
  }

  /**
   * Récupérer la session active
   */
  static getSession(): SessionData | null {
    if (typeof window === 'undefined') return null;

    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (!sessionStr) return null;

      const session: SessionData = JSON.parse(sessionStr);
      const now = Date.now();

      // Vérifier l'expiration
      if (session.expiresAt < now) {
        this.clearSession();
        return null;
      }

      // Mettre à jour l'activité si nécessaire
      if (now - session.lastActivity > ACTIVITY_REFRESH_INTERVAL) {
        session.lastActivity = now;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }

      return session;
    } catch (error) {
      console.error('Erreur lors de la récupération de session:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Valider un token
   */
  static validateToken(token: string): User | null {
    const session = this.getSession();
    
    if (!session || session.token !== token) {
      return null;
    }

    return session.user;
  }

  /**
   * Étendre la session
   */
  static extendSession(): boolean {
    const session = this.getSession();
    if (!session) return false;

    const now = Date.now();
    session.expiresAt = now + SESSION_DURATION;
    session.lastActivity = now;

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'extension de session:', error);
      return false;
    }
  }

  /**
   * Supprimer la session
   */
  static clearSession(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_role');
      localStorage.removeItem('view_mode');
    } catch (error) {
      console.error('Erreur lors de la suppression de session:', error);
    }
  }

  /**
   * Vérifier si une session est active
   */
  static isSessionActive(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  static getCurrentUser(): User | null {
    const session = this.getSession();
    return session ? session.user : null;
  }

  /**
   * Obtenir le token actuel
   */
  static getCurrentToken(): string | null {
    const session = this.getSession();
    return session ? session.token : null;
  }

  /**
   * Connexion avec persistance
   */
  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    // Utilisateurs de test
    const testUsers: { [key: string]: User } = {
      'admin@diddyhome.com': {
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
        tokens: []
      },
      'internal@diddyhome.com': {
        id: '2',
        email: 'internal@diddyhome.com',
        password: 'Internal2025',
        firstName: 'Utilisateur',
        lastName: 'Interne',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date(),
        ranks: [{
          id: '2',
          userId: '2',
          rankId: '2',
          siteId: 'default',
          assignedAt: new Date(),
          assignedBy: 'system',
          isActive: true,
          rank: {
            id: '2',
            name: 'Utilisateur Interne',
            level: 3,
            description: 'Utilisateur interne',
            capabilities: [],
            color: '#10B981',
            isSystem: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }],
        tokens: []
      },
      'client@diddyhome.com': {
        id: '3',
        email: 'client@diddyhome.com',
        password: 'Client2025',
        firstName: 'Client',
        lastName: 'DiddyHome',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date(),
        ranks: [{
          id: '3',
          userId: '3',
          rankId: '3',
          siteId: 'default',
          assignedAt: new Date(),
          assignedBy: 'system',
          isActive: true,
          rank: {
            id: '3',
            name: 'Utilisateur Externe',
            level: 4,
            description: 'Utilisateur externe',
            capabilities: [],
            color: '#F59E0B',
            isSystem: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }],
        tokens: []
      }
    };

    const user = testUsers[email];
    if (!user || user.password !== password) {
      return null;
    }

    const token = this.generateToken();
    this.createSession(user, token);

    return { user, token };
  }

  /**
   * Déconnexion
   */
  static logout(): void {
    this.clearSession();
  }

  /**
   * Générer un token
   */
  private static generateToken(): string {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Obtenir le rôle utilisateur
   */
  private static getUserRole(user: User): string {
    if (!user.ranks || user.ranks.length === 0) return 'external';
    
    const highestRank = user.ranks.reduce((highest, current) => 
      current.rank.level < highest.rank.level ? current : highest
    );

    switch (highestRank.rank.level) {
      case 0: return 'admin';
      case 1: case 2: case 3: return 'internal';
      default: return 'external';
    }
  }

  /**
   * Auto-extension de session (à appeler périodiquement)
   */
  static setupAutoExtension(): void {
    if (typeof window === 'undefined') return;

    // Extension automatique toutes les 5 minutes si l'utilisateur est actif
    setInterval(() => {
      if (this.isSessionActive()) {
        this.extendSession();
      }
    }, ACTIVITY_REFRESH_INTERVAL);

    // Extension lors d'activité utilisateur
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    let lastActivity = Date.now();
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivity > ACTIVITY_REFRESH_INTERVAL) {
        this.extendSession();
        lastActivity = now;
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
  }

  /**
   * Vérifier la compatibilité localStorage
   */
  static isStorageAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
