export interface Role {
  id: string;
  name: string;
  description: string;
  rank: number; // 0 = admin complet, 1+ = restrictions
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: 'dashboard' | 'users' | 'interlocutors' | 'financial' | 'insurance' | 'settings';
  action: 'read' | 'write' | 'delete' | 'admin';
  rank: number; // Rang minimum requis pour cette permission
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
  isActive: boolean;
}

// Rôles prédéfinis
export const PREDEFINED_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès complet à tous les modules',
    rank: 0,
    permissions: [],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'internal',
    name: 'Utilisateur Interne',
    description: 'Accès limité selon le mode test',
    rank: 1,
    permissions: [],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'external',
    name: 'Utilisateur Externe',
    description: 'Accès uniquement aux fiches personnelles',
    rank: 2,
    permissions: [],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// Permissions prédéfinies
export const PREDEFINED_PERMISSIONS: Permission[] = [
  // Dashboard
  { id: 'dashboard_read', name: 'Voir le tableau de bord', description: 'Accès au tableau de bord principal', module: 'dashboard', action: 'read', rank: 0 },
  
  // Utilisateurs
  { id: 'users_read', name: 'Voir les utilisateurs', description: 'Consulter la liste des utilisateurs', module: 'users', action: 'read', rank: 0 },
  { id: 'users_write', name: 'Modifier les utilisateurs', description: 'Créer et modifier les utilisateurs', module: 'users', action: 'write', rank: 0 },
  { id: 'users_delete', name: 'Supprimer les utilisateurs', description: 'Supprimer les utilisateurs', module: 'users', action: 'delete', rank: 0 },
  
  // Interlocuteurs
  { id: 'interlocutors_read', name: 'Voir les interlocuteurs', description: 'Consulter la liste des interlocuteurs', module: 'interlocutors', action: 'read', rank: 0 },
  { id: 'interlocutors_write', name: 'Modifier les interlocuteurs', description: 'Créer et modifier les interlocuteurs', module: 'interlocutors', action: 'write', rank: 0 },
  { id: 'interlocutors_delete', name: 'Supprimer les interlocuteurs', description: 'Supprimer les interlocuteurs', module: 'interlocutors', action: 'delete', rank: 0 },
  
  // Financier (rang 0 = admin uniquement)
  { id: 'financial_read', name: 'Voir le module financier', description: 'Consulter les données financières', module: 'financial', action: 'read', rank: 0 },
  { id: 'financial_write', name: 'Modifier les données financières', description: 'Créer et modifier les données financières', module: 'financial', action: 'write', rank: 0 },
  { id: 'financial_delete', name: 'Supprimer les données financières', description: 'Supprimer les données financières', module: 'financial', action: 'delete', rank: 0 },
  
  // Assurance
  { id: 'insurance_read', name: 'Voir le module assurance', description: 'Consulter les données d\'assurance', module: 'insurance', action: 'read', rank: 1 },
  { id: 'insurance_write', name: 'Modifier les données d\'assurance', description: 'Créer et modifier les données d\'assurance', module: 'insurance', action: 'write', rank: 1 },
  { id: 'insurance_delete', name: 'Supprimer les données d\'assurance', description: 'Supprimer les données d\'assurance', module: 'insurance', action: 'delete', rank: 1 },
  
  // Paramètres (rang 0 = admin uniquement)
  { id: 'settings_read', name: 'Voir les paramètres', description: 'Consulter les paramètres du système', module: 'settings', action: 'read', rank: 0 },
  { id: 'settings_write', name: 'Modifier les paramètres', description: 'Modifier les paramètres du système', module: 'settings', action: 'write', rank: 0 },
  { id: 'settings_delete', name: 'Supprimer les paramètres', description: 'Supprimer les paramètres du système', module: 'settings', action: 'delete', rank: 0 }
];

// Fonction pour obtenir les permissions selon le rôle et le mode
export function getPermissionsForRole(role: string, testMode: boolean = false): Permission[] {
  const roleData = PREDEFINED_ROLES.find(r => r.id === role);
  if (!roleData) return [];

  // Appliquer les restrictions selon le rôle
  switch (role) {
    case 'admin':
      return PREDEFINED_PERMISSIONS; // Admin garde tout
    case 'internal':
      // Interne : seulement dashboard, utilisateurs, interlocuteurs et assurance
      return PREDEFINED_PERMISSIONS.filter(p => 
        p.module === 'dashboard' || 
        p.module === 'users' || 
        p.module === 'interlocutors' || 
        p.module === 'insurance'
      );
    case 'external':
      // Externe : seulement interlocuteurs (pour sa fiche)
      return PREDEFINED_PERMISSIONS.filter(p => 
        p.module === 'interlocutors' && p.action === 'read'
      );
    default:
      return [];
  }
}

// Fonction pour vérifier si un utilisateur a une permission
export function hasPermission(
  userRole: string, 
  permission: string, 
  testMode: boolean = false
): boolean {
  const permissions = getPermissionsForRole(userRole, testMode);
  return permissions.some(p => p.id === permission);
}
