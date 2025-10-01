import { Rank, Capability, Permission, User, UserRank, Site } from '@/types';

// Rangs système prédéfinis
const systemRanks: Rank[] = [
  {
    id: 'rank-0',
    name: 'Administrateur',
    level: 0,
    description: 'Accès total et absolu au système',
    capabilities: [],
    color: '#dc2626',
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rank-1-1',
    name: 'Direction',
    level: 1,
    description: 'Direction et management de haut niveau',
    capabilities: [],
    color: '#7c3aed',
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rank-1-2',
    name: 'Management',
    level: 1,
    description: 'Management et supervision',
    capabilities: [],
    color: '#059669',
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rank-3-1',
    name: 'Utilisateur Interne',
    level: 3,
    description: 'Utilisateur interne de l\'organisation',
    capabilities: [],
    color: '#0891b2',
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rank-4-1',
    name: 'Utilisateur Externe',
    level: 4,
    description: 'Utilisateur externe ou client',
    capabilities: [],
    color: '#ea580c',
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Capacités système
const systemCapabilities: Capability[] = [
  {
    id: 'cap-admin',
    name: 'Administration Complète',
    description: 'Accès total à toutes les fonctionnalités',
    permissions: [
      {
        id: 'perm-admin-all',
        action: 'read',
        resource: '*'
      },
      {
        id: 'perm-admin-write',
        action: 'write',
        resource: '*'
      },
      {
        id: 'perm-admin-delete',
        action: 'delete',
        resource: '*'
      },
      {
        id: 'perm-admin-create',
        action: 'create',
        resource: '*'
      },
      {
        id: 'perm-admin-modify',
        action: 'modify',
        resource: '*'
      }
    ],
    modules: ['*']
  },
  {
    id: 'cap-management',
    name: 'Gestion',
    description: 'Gestion des utilisateurs et modules',
    permissions: [
      {
        id: 'perm-mgmt-users',
        action: 'read',
        resource: 'users'
      },
      {
        id: 'perm-mgmt-modules',
        action: 'write',
        resource: 'modules'
      }
    ],
    modules: ['project', 'contract', 'quote', 'event']
  },
  {
    id: 'cap-internal',
    name: 'Utilisateur Interne',
    description: 'Accès aux modules internes',
    permissions: [
      {
        id: 'perm-int-read',
        action: 'read',
        resource: 'modules'
      },
      {
        id: 'perm-int-write',
        action: 'write',
        resource: 'modules',
        conditions: [
          {
            field: 'createdBy',
            operator: 'equals',
            value: 'current_user'
          }
        ]
      }
    ],
    modules: ['project', 'contract', 'quote', 'event', 'task']
  },
  {
    id: 'cap-external',
    name: 'Utilisateur Externe',
    description: 'Accès limité aux modules clients',
    permissions: [
      {
        id: 'perm-ext-read',
        action: 'read',
        resource: 'modules',
        conditions: [
          {
            field: 'linkedTo',
            operator: 'contains',
            value: 'current_user'
          }
        ]
      }
    ],
    modules: ['contract', 'quote', 'document']
  }
];

// Assignation des capacités aux rangs
const rankCapabilities: { [rankId: string]: string[] } = {
  'rank-0': ['cap-admin'],
  'rank-1-1': ['cap-management', 'cap-internal'],
  'rank-1-2': ['cap-management', 'cap-internal'],
  'rank-3-1': ['cap-internal'],
  'rank-4-1': ['cap-external']
};

export class RoleService {
  static getSystemRanks(): Rank[] {
    return systemRanks.map(rank => ({
      ...rank,
      capabilities: this.getCapabilitiesForRank(rank.id)
    }));
  }

  static getCapabilitiesForRank(rankId: string): Capability[] {
    const capabilityIds = rankCapabilities[rankId] || [];
    return systemCapabilities.filter(cap => capabilityIds.includes(cap.id));
  }

  static async createRank(rankData: Omit<Rank, 'id' | 'createdAt' | 'updatedAt' | 'capabilities'>): Promise<Rank> {
    const rank: Rank = {
      ...rankData,
      id: this.generateId(),
      capabilities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // En production, sauvegarder en base de données
    return rank;
  }

  static async assignRankToUser(userId: string, rankId: string, siteId: string, assignedBy: string): Promise<UserRank> {
    const userRank: UserRank = {
      id: this.generateId(),
      userId,
      rankId,
      siteId,
      assignedAt: new Date(),
      assignedBy,
      isActive: true,
      rank: this.getSystemRanks().find(r => r.id === rankId)!
    };

    // En production, sauvegarder en base de données
    return userRank;
  }

  static async removeRankFromUser(userId: string, rankId: string, siteId: string): Promise<boolean> {
    // En production, marquer comme inactif en base de données
    return true;
  }

  static getUserRanks(user: User, siteId?: string): UserRank[] {
    if (siteId) {
      return user.ranks.filter(ur => ur.siteId === siteId && ur.isActive);
    }
    return user.ranks.filter(ur => ur.isActive);
  }

  static getUserHighestRank(user: User, siteId?: string): UserRank | null {
    const ranks = this.getUserRanks(user, siteId);
    if (ranks.length === 0) return null;

    return ranks.reduce((highest, current) => {
      const currentLevel = this.getSystemRanks().find(r => r.id === current.rankId)?.level || 999;
      const highestLevel = this.getSystemRanks().find(r => r.id === highest.rankId)?.level || 999;
      return currentLevel < highestLevel ? current : highest;
    });
  }

  static hasPermission(user: User, action: string, resource: string, siteId?: string): boolean {
    // L'admin (rang 0) a tous les droits
    const highestRank = this.getUserHighestRank(user, siteId);
    if (highestRank?.rank.level === 0) return true;

    const ranks = this.getUserRanks(user, siteId);
    const allCapabilities = ranks.flatMap(ur => this.getCapabilitiesForRank(ur.rankId));

    return allCapabilities.some(capability =>
      capability.permissions.some(permission =>
        permission.action === action &&
        (permission.resource === '*' || permission.resource === resource) &&
        this.evaluateConditions(permission.conditions || [], user)
      )
    );
  }

  static canAccessModule(user: User, moduleType: string, siteId?: string): boolean {
    const highestRank = this.getUserHighestRank(user, siteId);
    if (highestRank?.rank.level === 0) return true;

    const ranks = this.getUserRanks(user, siteId);
    const allCapabilities = ranks.flatMap(ur => this.getCapabilitiesForRank(ur.rankId));

    return allCapabilities.some(capability =>
      capability.modules.includes('*') || capability.modules.includes(moduleType)
    );
  }

  static canLinkModule(user: User, targetUser: User, siteId?: string): boolean {
    const userRank = this.getUserHighestRank(user, siteId);
    const targetRank = this.getUserHighestRank(targetUser, siteId);

    if (!userRank || !targetRank) return false;

    // Admin peut tout lier
    if (userRank.rank.level === 0) return true;

    // Même rang : liaison automatique
    if (userRank.rank.level === targetRank.rank.level) return true;

    // Rang inférieur : accès OK
    if (userRank.rank.level < targetRank.rank.level) return true;

    // Rang supérieur : nécessite des droits spécifiques ou token temporaire
    return this.hasPermission(user, 'link', 'modules', siteId);
  }

  static canViewElement(user: User, element: any, siteId?: string): boolean {
    const highestRank = this.getUserHighestRank(user, siteId);
    if (highestRank?.rank.level === 0) return true;

    // Logique de visibilité basée sur les rangs et les règles
    // À implémenter selon les besoins spécifiques
    return true;
  }

  private static evaluateConditions(conditions: any[], user: User): boolean {
    if (conditions.length === 0) return true;

    return conditions.every(condition => {
      switch (condition.field) {
        case 'createdBy':
          return condition.operator === 'equals' && condition.value === 'current_user' && user.id === user.id;
        default:
          return true;
      }
    });
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
