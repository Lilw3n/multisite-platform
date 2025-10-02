import { 
  Project, 
  ProjectTreeNode, 
  ProjectFilter, 
  ProjectSort, 
  ProjectItem, 
  ProjectActivity, 
  ProjectStatistics,
  ProjectTemplate,
  DragDropOperation,
  ProjectNavigation,
  ProjectBreadcrumb,
  ProjectStatus,
  ProjectType,
  ProjectPriority
} from '@/types/project';

class ProjectService {
  private static readonly STORAGE_KEY = 'diddyhome_projects';
  private static readonly TEMPLATES_KEY = 'diddyhome_project_templates';
  
  private static projects: Project[] = [];
  private static templates: ProjectTemplate[] = [];

  // Initialisation avec données de démonstration
  static {
    this.loadProjects();
    if (this.projects.length === 0) {
      this.initializeDemoData();
    }
  }

  private static loadProjects(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.projects = JSON.parse(saved);
      }
      
      const savedTemplates = localStorage.getItem(this.TEMPLATES_KEY);
      if (savedTemplates) {
        this.templates = JSON.parse(savedTemplates);
      }
    }
  }

  private static saveProjects(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.projects));
      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(this.templates));
    }
  }

  private static initializeDemoData(): void {
    const now = new Date().toISOString();
    
    // Projets de démonstration
    const demoProjects: Project[] = [
      {
        id: 'proj-1',
        name: 'Assurance Auto - Famille Dupont',
        description: 'Projet global pour la gestion des assurances de la famille Dupont',
        type: 'insurance',
        status: 'active',
        priority: 'high',
        parentId: undefined,
        children: ['proj-2', 'proj-3'],
        path: [],
        level: 0,
        interlocutorId: 'int-1',
        tags: [
          { id: 'tag-1', name: 'VIP', color: '#FFD700' },
          { id: 'tag-2', name: 'Famille', color: '#4CAF50' }
        ],
        members: [
          {
            id: 'member-1',
            userId: 'user-1',
            userName: 'Admin DiddyHome',
            role: 'owner',
            joinedAt: now,
            permissions: ['read', 'write', 'delete', 'manage']
          }
        ],
        items: [
          {
            id: 'item-1',
            type: 'quote',
            title: 'Devis Auto Principal',
            description: 'Devis pour véhicule principal famille Dupont',
            status: 'completed',
            createdAt: now,
            updatedAt: now,
            createdBy: 'Admin DiddyHome',
            metadata: {
              vehicleType: 'Citadine',
              coverage: 'Tous risques',
              amount: 850
            }
          }
        ],
        files: [],
        startDate: '2024-01-15',
        createdAt: now,
        updatedAt: now,
        createdBy: 'Admin DiddyHome',
        totalItems: 1,
        completedItems: 1,
        totalFiles: 0,
        totalSize: 0,
        activities: [
          {
            id: 'act-1',
            type: 'created',
            description: 'Projet créé',
            userId: 'user-1',
            userName: 'Admin DiddyHome',
            timestamp: now
          }
        ],
        lastActivity: now,
        settings: {
          isPrivate: false,
          allowComments: true,
          autoArchive: false,
          notifications: true
        }
      },
      {
        id: 'proj-2',
        name: 'Véhicule Principal',
        description: 'Assurance du véhicule principal',
        type: 'insurance',
        status: 'active',
        priority: 'medium',
        parentId: 'proj-1',
        children: [],
        path: ['proj-1'],
        level: 1,
        interlocutorId: 'int-1',
        tags: [
          { id: 'tag-3', name: 'Auto', color: '#2196F3' }
        ],
        members: [
          {
            id: 'member-2',
            userId: 'user-1',
            userName: 'Admin DiddyHome',
            role: 'owner',
            joinedAt: now,
            permissions: ['read', 'write', 'delete', 'manage']
          }
        ],
        items: [
          {
            id: 'item-2',
            type: 'contract',
            title: 'Contrat Auto Principal',
            description: 'Contrat d\'assurance auto validé',
            status: 'active',
            createdAt: now,
            updatedAt: now,
            createdBy: 'Admin DiddyHome',
            metadata: {
              contractNumber: 'AUTO-2024-001',
              startDate: '2024-02-01',
              endDate: '2025-02-01',
              premium: 850
            }
          }
        ],
        files: [],
        startDate: '2024-02-01',
        createdAt: now,
        updatedAt: now,
        createdBy: 'Admin DiddyHome',
        totalItems: 1,
        completedItems: 0,
        totalFiles: 0,
        totalSize: 0,
        activities: [],
        lastActivity: now,
        settings: {
          isPrivate: false,
          allowComments: true,
          autoArchive: false,
          notifications: true
        }
      },
      {
        id: 'proj-3',
        name: 'Véhicule Secondaire',
        description: 'Assurance du véhicule secondaire',
        type: 'insurance',
        status: 'draft',
        priority: 'low',
        parentId: 'proj-1',
        children: [],
        path: ['proj-1'],
        level: 1,
        interlocutorId: 'int-1',
        tags: [
          { id: 'tag-3', name: 'Auto', color: '#2196F3' }
        ],
        members: [
          {
            id: 'member-3',
            userId: 'user-1',
            userName: 'Admin DiddyHome',
            role: 'owner',
            joinedAt: now,
            permissions: ['read', 'write', 'delete', 'manage']
          }
        ],
        items: [],
        files: [],
        createdAt: now,
        updatedAt: now,
        createdBy: 'Admin DiddyHome',
        totalItems: 0,
        completedItems: 0,
        totalFiles: 0,
        totalSize: 0,
        activities: [],
        lastActivity: now,
        settings: {
          isPrivate: false,
          allowComments: true,
          autoArchive: false,
          notifications: true
        }
      }
    ];

    this.projects = demoProjects;
    this.saveProjects();
  }

  // CRUD Operations
  static async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'activities' | 'totalItems' | 'completedItems' | 'totalFiles' | 'totalSize' | 'lastActivity'>): Promise<Project> {
    const now = new Date().toISOString();
    const id = `proj-${Date.now()}`;
    
    // Calculer le path et level basés sur le parent
    let path: string[] = [];
    let level = 0;
    
    if (projectData.parentId) {
      const parent = this.projects.find(p => p.id === projectData.parentId);
      if (parent) {
        path = [...parent.path, parent.id];
        level = parent.level + 1;
        
        // Ajouter cet enfant au parent
        parent.children.push(id);
        parent.updatedAt = now;
      }
    }

    const newProject: Project = {
      ...projectData,
      id,
      path,
      level,
      createdAt: now,
      updatedAt: now,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'created',
          description: 'Projet créé',
          userId: 'current-user',
          userName: 'Utilisateur actuel',
          timestamp: now
        }
      ],
      totalItems: projectData.items?.length || 0,
      completedItems: projectData.items?.filter(item => item.status === 'completed').length || 0,
      totalFiles: projectData.files?.length || 0,
      totalSize: projectData.files?.reduce((sum, file) => sum + file.size, 0) || 0,
      lastActivity: now
    };

    this.projects.push(newProject);
    this.saveProjects();
    
    return newProject;
  }

  static async getProject(id: string): Promise<Project | null> {
    return this.projects.find(p => p.id === id) || null;
  }

  static async getAllProjects(): Promise<Project[]> {
    return [...this.projects];
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    const updatedProject = {
      ...this.projects[index],
      ...updates,
      updatedAt: now,
      lastActivity: now
    };

    // Recalculer les statistiques si nécessaire
    if (updates.items) {
      updatedProject.totalItems = updates.items.length;
      updatedProject.completedItems = updates.items.filter(item => item.status === 'completed').length;
    }

    if (updates.files) {
      updatedProject.totalFiles = updates.files.length;
      updatedProject.totalSize = updates.files.reduce((sum, file) => sum + file.size, 0);
    }

    // Ajouter une activité de mise à jour
    const activity: ProjectActivity = {
      id: `act-${Date.now()}`,
      type: 'updated',
      description: 'Projet mis à jour',
      userId: 'current-user',
      userName: 'Utilisateur actuel',
      timestamp: now,
      metadata: { updatedFields: Object.keys(updates) }
    };

    updatedProject.activities = [...updatedProject.activities, activity];

    this.projects[index] = updatedProject;
    this.saveProjects();
    
    return updatedProject;
  }

  static async deleteProject(id: string): Promise<boolean> {
    const project = this.projects.find(p => p.id === id);
    if (!project) return false;

    // Supprimer des enfants du parent
    if (project.parentId) {
      const parent = this.projects.find(p => p.id === project.parentId);
      if (parent) {
        parent.children = parent.children.filter(childId => childId !== id);
        parent.updatedAt = new Date().toISOString();
      }
    }

    // Supprimer récursivement tous les enfants
    const childrenToDelete = this.getDescendants(id);
    const allToDelete = [id, ...childrenToDelete.map(p => p.id)];

    this.projects = this.projects.filter(p => !allToDelete.includes(p.id));
    this.saveProjects();
    
    return true;
  }

  // Opérations hiérarchiques
  static async moveProject(sourceId: string, targetId: string, operation: DragDropOperation['operation']): Promise<boolean> {
    const source = this.projects.find(p => p.id === sourceId);
    const target = this.projects.find(p => p.id === targetId);
    
    if (!source || !target) return false;

    // Empêcher de déplacer un parent dans ses propres enfants
    if (this.isDescendant(targetId, sourceId)) return false;

    const now = new Date().toISOString();

    // Retirer du parent actuel
    if (source.parentId) {
      const oldParent = this.projects.find(p => p.id === source.parentId);
      if (oldParent) {
        oldParent.children = oldParent.children.filter(id => id !== sourceId);
        oldParent.updatedAt = now;
      }
    }

    // Déplacer selon l'opération
    switch (operation) {
      case 'move_into':
        source.parentId = targetId;
        source.path = [...target.path, target.id];
        source.level = target.level + 1;
        target.children.push(sourceId);
        target.updatedAt = now;
        break;
        
      case 'move_before':
      case 'move_after':
        source.parentId = target.parentId;
        source.path = [...target.path];
        source.level = target.level;
        
        if (target.parentId) {
          const newParent = this.projects.find(p => p.id === target.parentId);
          if (newParent) {
            const targetIndex = newParent.children.indexOf(targetId);
            const insertIndex = operation === 'move_before' ? targetIndex : targetIndex + 1;
            newParent.children.splice(insertIndex, 0, sourceId);
            newParent.updatedAt = now;
          }
        }
        break;
    }

    // Mettre à jour récursivement tous les descendants
    this.updateDescendantsPaths(sourceId);
    
    source.updatedAt = now;
    this.saveProjects();
    
    return true;
  }

  private static updateDescendantsPaths(projectId: string): void {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    const children = this.projects.filter(p => p.parentId === projectId);
    children.forEach(child => {
      child.path = [...project.path, project.id];
      child.level = project.level + 1;
      child.updatedAt = new Date().toISOString();
      
      // Récursion pour les petits-enfants
      this.updateDescendantsPaths(child.id);
    });
  }

  private static isDescendant(ancestorId: string, descendantId: string): boolean {
    const descendant = this.projects.find(p => p.id === descendantId);
    if (!descendant) return false;
    
    return descendant.path.includes(ancestorId);
  }

  private static getDescendants(projectId: string): Project[] {
    const descendants: Project[] = [];
    const directChildren = this.projects.filter(p => p.parentId === projectId);
    
    directChildren.forEach(child => {
      descendants.push(child);
      descendants.push(...this.getDescendants(child.id));
    });
    
    return descendants;
  }

  // Construction de l'arbre
  static async getProjectTree(filter?: ProjectFilter): Promise<ProjectTreeNode[]> {
    let filteredProjects = this.applyFilters([...this.projects], filter);
    
    // Construire l'arbre
    const rootProjects = filteredProjects.filter(p => !p.parentId);
    
    return rootProjects.map(project => this.buildTreeNode(project, filteredProjects));
  }

  private static buildTreeNode(project: Project, allProjects: Project[]): ProjectTreeNode {
    const children = allProjects
      .filter(p => p.parentId === project.id)
      .map(child => this.buildTreeNode(child, allProjects));

    return {
      ...project,
      children,
      isExpanded: false,
      isSelected: false
    };
  }

  // Filtrage et tri
  private static applyFilters(projects: Project[], filter?: ProjectFilter): Project[] {
    if (!filter) return projects;

    return projects.filter(project => {
      // Recherche textuelle
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        const matchesSearch = 
          project.name.toLowerCase().includes(searchTerm) ||
          project.description?.toLowerCase().includes(searchTerm) ||
          project.items.some(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description?.toLowerCase().includes(searchTerm)
          );
        if (!matchesSearch) return false;
      }

      // Filtres par statut
      if (filter.status && filter.status.length > 0) {
        if (!filter.status.includes(project.status)) return false;
      }

      // Filtres par type
      if (filter.type && filter.type.length > 0) {
        if (!filter.type.includes(project.type)) return false;
      }

      // Filtres par priorité
      if (filter.priority && filter.priority.length > 0) {
        if (!filter.priority.includes(project.priority)) return false;
      }

      // Filtre par interlocuteur
      if (filter.interlocutorId) {
        if (project.interlocutorId !== filter.interlocutorId) return false;
      }

      // Filtre par créateur
      if (filter.createdBy) {
        if (project.createdBy !== filter.createdBy) return false;
      }

      // Filtre par plage de dates
      if (filter.dateRange) {
        const projectDate = new Date(project.createdAt);
        const startDate = new Date(filter.dateRange.start);
        const endDate = new Date(filter.dateRange.end);
        if (projectDate < startDate || projectDate > endDate) return false;
      }

      // Filtre par tags
      if (filter.tags && filter.tags.length > 0) {
        const projectTagIds = project.tags.map(tag => tag.id);
        const hasMatchingTag = filter.tags.some(tagId => projectTagIds.includes(tagId));
        if (!hasMatchingTag) return false;
      }

      // Filtre par présence d'items
      if (filter.hasItems !== undefined) {
        const hasItems = project.items.length > 0;
        if (filter.hasItems !== hasItems) return false;
      }

      // Filtre par présence de fichiers
      if (filter.hasFiles !== undefined) {
        const hasFiles = project.files.length > 0;
        if (filter.hasFiles !== hasFiles) return false;
      }

      return true;
    });
  }

  static async getFilteredAndSortedProjects(filter?: ProjectFilter, sort?: ProjectSort): Promise<Project[]> {
    let projects = this.applyFilters([...this.projects], filter);
    
    if (sort) {
      projects.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sort.field) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'updatedAt':
            aValue = new Date(a.updatedAt).getTime();
            bValue = new Date(b.updatedAt).getTime();
            break;
          case 'priority':
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            aValue = priorityOrder[a.priority];
            bValue = priorityOrder[b.priority];
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'totalItems':
            aValue = a.totalItems;
            bValue = b.totalItems;
            break;
          case 'lastActivity':
            aValue = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
            bValue = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
            break;
          default:
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
        }

        if (sort.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return projects;
  }

  // Navigation
  static async getProjectNavigation(projectId: string): Promise<ProjectNavigation> {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      return {
        breadcrumbs: [],
        siblings: [],
        children: []
      };
    }

    // Construire les breadcrumbs
    const breadcrumbs: ProjectBreadcrumb[] = [];
    for (const ancestorId of project.path) {
      const ancestor = this.projects.find(p => p.id === ancestorId);
      if (ancestor) {
        breadcrumbs.push({
          id: ancestor.id,
          name: ancestor.name,
          level: ancestor.level
        });
      }
    }
    
    // Ajouter le projet actuel
    breadcrumbs.push({
      id: project.id,
      name: project.name,
      level: project.level
    });

    // Trouver les frères et sœurs
    const siblings = this.projects.filter(p => 
      p.parentId === project.parentId && p.id !== project.id
    );

    // Trouver le parent
    const parent = project.parentId ? 
      this.projects.find(p => p.id === project.parentId) : undefined;

    // Trouver les enfants
    const children = this.projects.filter(p => p.parentId === project.id);

    return {
      currentProject: project,
      breadcrumbs,
      siblings,
      parent,
      children
    };
  }

  // Statistiques
  static async getStatistics(): Promise<ProjectStatistics> {
    const projects = [...this.projects];
    
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    
    const totalItems = projects.reduce((sum, p) => sum + p.totalItems, 0);
    const totalFiles = projects.reduce((sum, p) => sum + p.totalFiles, 0);
    const totalSize = projects.reduce((sum, p) => sum + p.totalSize, 0);

    // Calculer le temps moyen de completion
    const completedProjectsWithDates = projects.filter(p => 
      p.status === 'completed' && p.startDate && p.endDate
    );
    
    let averageCompletionTime = 0;
    if (completedProjectsWithDates.length > 0) {
      const totalDays = completedProjectsWithDates.reduce((sum, p) => {
        const start = new Date(p.startDate!);
        const end = new Date(p.endDate!);
        return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }, 0);
      averageCompletionTime = Math.round(totalDays / completedProjectsWithDates.length);
    }

    // Statistiques par type
    const projectsByType: Record<ProjectType, number> = {
      insurance: 0,
      finance: 0,
      legal: 0,
      commercial: 0,
      technical: 0,
      other: 0
    };
    
    projects.forEach(p => {
      projectsByType[p.type]++;
    });

    // Statistiques par statut
    const projectsByStatus: Record<ProjectStatus, number> = {
      draft: 0,
      active: 0,
      on_hold: 0,
      completed: 0,
      cancelled: 0
    };
    
    projects.forEach(p => {
      projectsByStatus[p.status]++;
    });

    // Activité récente
    const allActivities = projects.flatMap(p => 
      p.activities.map(a => ({ ...a, projectId: p.id, projectName: p.name }))
    );
    
    const recentActivity = allActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalItems,
      totalFiles,
      totalSize,
      averageCompletionTime,
      projectsByType,
      projectsByStatus,
      recentActivity
    };
  }

  // Gestion des items dans les projets
  static async addItemToProject(projectId: string, item: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectItem | null> {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return null;

    const now = new Date().toISOString();
    const newItem: ProjectItem = {
      ...item,
      id: `item-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };

    project.items.push(newItem);
    project.totalItems++;
    if (newItem.status === 'completed') {
      project.completedItems++;
    }
    project.updatedAt = now;
    project.lastActivity = now;

    // Ajouter une activité
    const activity: ProjectActivity = {
      id: `act-${Date.now()}`,
      type: 'created',
      description: `Item "${newItem.title}" ajouté`,
      userId: 'current-user',
      userName: 'Utilisateur actuel',
      timestamp: now,
      metadata: { itemId: newItem.id, itemType: newItem.type }
    };

    project.activities.push(activity);
    this.saveProjects();

    return newItem;
  }

  static async removeItemFromProject(projectId: string, itemId: string): Promise<boolean> {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return false;

    const itemIndex = project.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;

    const removedItem = project.items[itemIndex];
    project.items.splice(itemIndex, 1);
    project.totalItems--;
    if (removedItem.status === 'completed') {
      project.completedItems--;
    }

    const now = new Date().toISOString();
    project.updatedAt = now;
    project.lastActivity = now;

    // Ajouter une activité
    const activity: ProjectActivity = {
      id: `act-${Date.now()}`,
      type: 'deleted',
      description: `Item "${removedItem.title}" supprimé`,
      userId: 'current-user',
      userName: 'Utilisateur actuel',
      timestamp: now,
      metadata: { itemId: removedItem.id, itemType: removedItem.type }
    };

    project.activities.push(activity);
    this.saveProjects();

    return true;
  }

  // Recherche avancée
  static async searchProjects(query: string): Promise<Project[]> {
    const searchTerm = query.toLowerCase();
    
    return this.projects.filter(project => {
      // Recherche dans le nom et la description
      const matchesBasic = 
        project.name.toLowerCase().includes(searchTerm) ||
        project.description?.toLowerCase().includes(searchTerm);

      // Recherche dans les items
      const matchesItems = project.items.some(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm)
      );

      // Recherche dans les tags
      const matchesTags = project.tags.some(tag =>
        tag.name.toLowerCase().includes(searchTerm)
      );

      // Recherche dans les membres
      const matchesMembers = project.members.some(member =>
        member.userName.toLowerCase().includes(searchTerm)
      );

      return matchesBasic || matchesItems || matchesTags || matchesMembers;
    });
  }
}

export { ProjectService };
