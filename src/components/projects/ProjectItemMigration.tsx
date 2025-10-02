'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  FolderPlus, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Package,
  Move
} from 'lucide-react';
import { Project, ProjectItem } from '@/types/project';
import { ProjectService } from '@/lib/projectService';
import { Quote } from '@/types/quote';
import { Contract } from '@/types/contract';

interface OrphanItem {
  id: string;
  type: 'quote' | 'contract';
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  interlocutorId?: string;
  interlocutorName?: string;
  originalData: Quote | Contract;
}

interface MigrationResult {
  success: boolean;
  projectId: string;
  itemId: string;
  error?: string;
}

export default function ProjectItemMigration() {
  const [orphanItems, setOrphanItems] = useState<OrphanItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResults, setMigrationResults] = useState<MigrationResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Charger les projets existants
      const projectsData = await ProjectService.getAllProjects();
      setProjects(projectsData);

      // Simuler le chargement des devis et contrats orphelins
      // En réalité, ceci devrait venir des services Quote et Contract
      const mockOrphanItems: OrphanItem[] = [
        {
          id: 'quote-1',
          type: 'quote',
          title: 'Devis Auto - M. Martin',
          description: 'Devis assurance auto pour véhicule principal',
          status: 'pending',
          createdAt: '2024-01-15T10:00:00Z',
          interlocutorId: 'int-1',
          interlocutorName: 'Jean Martin',
          originalData: {} as Quote
        },
        {
          id: 'quote-2',
          type: 'quote',
          title: 'Devis Habitation - Mme Dubois',
          description: 'Devis assurance habitation',
          status: 'accepted',
          createdAt: '2024-01-20T14:30:00Z',
          interlocutorId: 'int-2',
          interlocutorName: 'Marie Dubois',
          originalData: {} as Quote
        },
        {
          id: 'contract-1',
          type: 'contract',
          title: 'Contrat Auto - M. Martin',
          description: 'Contrat d\'assurance auto validé',
          status: 'active',
          createdAt: '2024-02-01T09:00:00Z',
          interlocutorId: 'int-1',
          interlocutorName: 'Jean Martin',
          originalData: {} as Contract
        },
        {
          id: 'contract-2',
          type: 'contract',
          title: 'Contrat Santé - Famille Dupont',
          description: 'Contrat assurance santé famille',
          status: 'active',
          createdAt: '2024-02-15T11:15:00Z',
          interlocutorId: 'int-3',
          interlocutorName: 'Pierre Dupont',
          originalData: {} as Contract
        }
      ];

      setOrphanItems(mockOrphanItems);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = orphanItems.filter(item => {
    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.interlocutorName?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Filtre par statut
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    // Filtre par type
    if (typeFilter !== 'all' && item.type !== typeFilter) {
      return false;
    }

    return true;
  });

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleMigration = async () => {
    if (!selectedProject || selectedItems.size === 0) return;

    setIsMigrating(true);
    const results: MigrationResult[] = [];

    try {
      for (const itemId of selectedItems) {
        const orphanItem = orphanItems.find(item => item.id === itemId);
        if (!orphanItem) continue;

        try {
          // Convertir l'item orphelin en ProjectItem
          const projectItem: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'> = {
            type: orphanItem.type,
            title: orphanItem.title,
            description: orphanItem.description,
            status: orphanItem.status,
            createdBy: 'Migration automatique',
            metadata: {
              originalId: orphanItem.id,
              migratedAt: new Date().toISOString(),
              originalData: orphanItem.originalData
            }
          };

          // Ajouter l'item au projet
          const addedItem = await ProjectService.addItemToProject(selectedProject, projectItem);
          
          if (addedItem) {
            results.push({
              success: true,
              projectId: selectedProject,
              itemId: addedItem.id
            });
          } else {
            results.push({
              success: false,
              projectId: selectedProject,
              itemId: itemId,
              error: 'Échec de l\'ajout au projet'
            });
          }
        } catch (error) {
          results.push({
            success: false,
            projectId: selectedProject,
            itemId: itemId,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
          });
        }
      }

      setMigrationResults(results);
      
      // Supprimer les items migrés avec succès de la liste des orphelins
      const successfulMigrations = results.filter(r => r.success).map(r => r.itemId);
      setOrphanItems(prev => prev.filter(item => !successfulMigrations.includes(item.id)));
      setSelectedItems(new Set());

    } catch (error) {
      console.error('Erreur lors de la migration:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  const createNewProject = async () => {
    if (selectedItems.size === 0) return;

    // Déterminer le nom du projet basé sur les items sélectionnés
    const selectedItemsData = orphanItems.filter(item => selectedItems.has(item.id));
    const interlocutorNames = [...new Set(selectedItemsData.map(item => item.interlocutorName).filter(Boolean))];
    
    const projectName = interlocutorNames.length === 1 
      ? `Projet - ${interlocutorNames[0]}`
      : `Projet - Migration ${new Date().toLocaleDateString('fr-FR')}`;

    try {
      const newProject = await ProjectService.createProject({
        name: projectName,
        description: `Projet créé automatiquement lors de la migration de ${selectedItems.size} item(s)`,
        type: 'insurance',
        status: 'active',
        priority: 'medium',
        children: [],
        path: [],
        level: 0,
        tags: [
          {
            id: `tag-migration-${Date.now()}`,
            name: 'Migration',
            color: '#8B5CF6'
          }
        ],
        members: [
          {
            id: 'member-current',
            userId: 'current-user',
            userName: 'Utilisateur actuel',
            role: 'owner',
            joinedAt: new Date().toISOString(),
            permissions: ['read', 'write', 'delete', 'manage']
          }
        ],
        items: [],
        files: [],
        createdBy: 'Migration automatique',
        settings: {
          isPrivate: false,
          allowComments: true,
          autoArchive: false,
          notifications: true
        }
      });

      setSelectedProject(newProject.id);
      setProjects(prev => [...prev, newProject]);
      
      // Déclencher la migration vers le nouveau projet
      setTimeout(() => {
        handleMigration();
      }, 500);

    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
    }
  };

  const getItemIcon = (type: string) => {
    return type === 'quote' ? 
      <FileText className="w-4 h-4 text-green-500" /> : 
      <Shield className="w-4 h-4 text-blue-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'accepted': return 'bg-blue-100 text-blue-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-500" />
              Migration vers les Projets
            </h2>
            <p className="text-gray-600 mt-1">
              Organisez vos devis et contrats existants dans des projets structurés
            </p>
          </div>
          
          <button
            onClick={loadData}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-600">Devis orphelins</p>
                <p className="text-2xl font-bold text-blue-900">
                  {orphanItems.filter(item => item.type === 'quote').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-600">Contrats orphelins</p>
                <p className="text-2xl font-bold text-green-900">
                  {orphanItems.filter(item => item.type === 'contract').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <FolderPlus className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-600">Projets disponibles</p>
                <p className="text-2xl font-bold text-purple-900">{projects.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">Tous</option>
              <option value="quote">Devis</option>
              <option value="contract">Contrats</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">Tous</option>
              <option value="pending">En attente</option>
              <option value="accepted">Accepté</option>
              <option value="active">Actif</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Actions</label>
            <button
              onClick={handleSelectAll}
              className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              {selectedItems.size === filteredItems.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} sélectionné{selectedItems.size > 1 ? 's' : ''} 
            sur {filteredItems.length} affiché{filteredItems.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Liste des items */}
      <div className="max-h-96 overflow-y-auto">
        {filteredItems.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredItems.map(item => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleItemToggle(item.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {getItemIcon(item.type)}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>Créé le {new Date(item.createdAt).toLocaleDateString('fr-FR')}</span>
                          {item.interlocutorName && (
                            <span>Client: {item.interlocutorName}</span>
                          )}
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Aucun item à migrer</p>
            <p className="text-sm">
              {orphanItems.length === 0 
                ? 'Tous vos devis et contrats sont déjà organisés dans des projets !'
                : 'Aucun item ne correspond à vos critères de recherche.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Actions de migration */}
      {selectedItems.size > 0 && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projet de destination
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un projet existant...</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {'  '.repeat(project.level)}{project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={createNewProject}
                disabled={isMigrating}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Créer un nouveau projet
              </button>

              <button
                onClick={handleMigration}
                disabled={!selectedProject || isMigrating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {isMigrating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Migration...
                  </>
                ) : (
                  <>
                    <Move className="w-4 h-4 mr-2" />
                    Migrer vers le projet
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Résultats de migration */}
          {migrationResults.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-md border">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Résultats de la migration:</h4>
              <div className="space-y-1">
                {migrationResults.map((result, index) => (
                  <div key={index} className="flex items-center text-sm">
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={result.success ? 'text-green-700' : 'text-red-700'}>
                      {result.success 
                        ? `Item migré avec succès`
                        : `Échec: ${result.error}`
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
