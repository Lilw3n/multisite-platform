export type ProjectStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectType = 'insurance' | 'finance' | 'legal' | 'commercial' | 'technical' | 'other';

export interface ProjectMember {
  id: string;
  userId: string;
  userName: string;
  role: 'owner' | 'manager' | 'contributor' | 'viewer';
  joinedAt: string;
  permissions: string[];
}

export interface ProjectTag {
  id: string;
  name: string;
  color: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ProjectActivity {
  id: string;
  type: 'created' | 'updated' | 'moved' | 'deleted' | 'member_added' | 'member_removed' | 'file_added' | 'comment_added';
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ProjectItem {
  id: string;
  type: 'quote' | 'contract' | 'document' | 'task' | 'note';
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  dueDate?: string;
  metadata: Record<string, any>; // Données spécifiques au type d'item
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  
  // Hiérarchie
  parentId?: string; // ID du projet parent
  children: string[]; // IDs des projets enfants
  path: string[]; // Chemin complet depuis la racine
  level: number; // Niveau dans la hiérarchie (0 = racine)
  
  // Relations
  interlocutorId?: string; // Interlocuteur principal lié au projet
  clientId?: string; // Client si différent de l'interlocuteur
  
  // Métadonnées
  tags: ProjectTag[];
  members: ProjectMember[];
  
  // Contenu
  items: ProjectItem[]; // Devis, contrats, documents, etc.
  files: ProjectFile[];
  
  // Dates
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Statistiques
  totalItems: number;
  completedItems: number;
  totalFiles: number;
  totalSize: number; // Taille totale des fichiers en bytes
  
  // Activité
  activities: ProjectActivity[];
  lastActivity?: string;
  
  // Configuration
  settings: {
    isPrivate: boolean;
    allowComments: boolean;
    autoArchive: boolean;
    notifications: boolean;
  };
}

export interface ProjectTreeNode extends Project {
  children: ProjectTreeNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
}

export interface ProjectFilter {
  search?: string;
  status?: ProjectStatus[];
  type?: ProjectType[];
  priority?: ProjectPriority[];
  interlocutorId?: string;
  createdBy?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  hasItems?: boolean;
  hasFiles?: boolean;
}

export interface ProjectSort {
  field: 'name' | 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'totalItems' | 'lastActivity';
  direction: 'asc' | 'desc';
}

export interface DragDropOperation {
  sourceId: string;
  targetId: string;
  operation: 'move_into' | 'move_before' | 'move_after';
  sourceType: 'project' | 'item';
  targetType: 'project' | 'folder';
}

export interface ProjectStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalItems: number;
  totalFiles: number;
  totalSize: number;
  averageCompletionTime: number; // en jours
  projectsByType: Record<ProjectType, number>;
  projectsByStatus: Record<ProjectStatus, number>;
  recentActivity: ProjectActivity[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  structure: {
    folders: string[];
    defaultItems: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[];
    defaultTags: Omit<ProjectTag, 'id'>[];
  };
  settings: Project['settings'];
  createdAt: string;
  createdBy: string;
  isPublic: boolean;
  usageCount: number;
}

export interface ProjectExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'zip';
  includeFiles: boolean;
  includeActivities: boolean;
  includeChildren: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ProjectImportResult {
  success: boolean;
  projectsCreated: number;
  itemsCreated: number;
  filesUploaded: number;
  errors: string[];
  warnings: string[];
}

// Utilitaires pour la navigation dans l'arbre
export interface ProjectBreadcrumb {
  id: string;
  name: string;
  level: number;
}

export interface ProjectNavigation {
  currentProject?: Project;
  breadcrumbs: ProjectBreadcrumb[];
  siblings: Project[];
  parent?: Project;
  children: Project[];
}
