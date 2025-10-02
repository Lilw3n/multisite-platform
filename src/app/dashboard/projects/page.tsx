'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  FolderPlus,
  BarChart3,
  Calendar,
  Users,
  FileText,
  ArrowLeft,
  Download,
  Upload,
  Settings,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Project, ProjectFilter, ProjectSort, ProjectStatistics } from '@/types/project';
import { ProjectService } from '@/lib/projectService';
import ProjectExplorer from '@/components/projects/ProjectExplorer';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [statistics, setStatistics] = useState<ProjectStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'tree' | 'list' | 'grid'>('tree');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filter, setFilter] = useState<ProjectFilter>({});
  const [sort, setSort] = useState<ProjectSort>({
    field: 'updatedAt',
    direction: 'desc'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [projects, filter, sort]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projectsData, statsData] = await Promise.all([
        ProjectService.getAllProjects(),
        ProjectService.getStatistics()
      ]);
      
      setProjects(projectsData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = async () => {
    try {
      const filtered = await ProjectService.getFilteredAndSortedProjects(filter, sort);
      setFilteredProjects(filtered);
    } catch (error) {
      console.error('Erreur lors du filtrage:', error);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleFilterChange = (newFilter: Partial<ProjectFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const handleSortChange = (newSort: ProjectSort) => {
    setSort(newSort);
  };

  const resetFilters = () => {
    setFilter({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'on_hold': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FolderPlus className="w-6 h-6 mr-2 text-blue-500" />
                  Gestion des Projets
                </h1>
                <p className="text-gray-600">
                  Organisez vos devis, contrats et documents dans des projets hiérarchiques
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('tree')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'tree' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Arbre
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grille
                </button>
              </div>
              
              <Link
                href="/dashboard/projects/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Projet</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques rapides */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projets</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalProjects}</p>
                </div>
                <FolderPlus className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projets Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.activeProjects}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Items Totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalItems}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temps Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.averageCompletionTime}j</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Explorateur de projets */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {viewMode === 'tree' ? 'Arbre des Projets' : 
                     viewMode === 'list' ? 'Liste des Projets' : 'Grille des Projets'}
                  </h2>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-2 rounded-md transition-colors ${
                        showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filtres */}
                {showFilters && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                        <input
                          type="text"
                          placeholder="Nom du projet..."
                          value={filter.search || ''}
                          onChange={(e) => handleFilterChange({ search: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select
                          value={filter.status?.[0] || ''}
                          onChange={(e) => handleFilterChange({ 
                            status: e.target.value ? [e.target.value as any] : undefined 
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">Tous</option>
                          <option value="draft">Brouillon</option>
                          <option value="active">Actif</option>
                          <option value="on_hold">En pause</option>
                          <option value="completed">Terminé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={filter.type?.[0] || ''}
                          onChange={(e) => handleFilterChange({ 
                            type: e.target.value ? [e.target.value as any] : undefined 
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">Tous</option>
                          <option value="insurance">Assurance</option>
                          <option value="finance">Finance</option>
                          <option value="legal">Juridique</option>
                          <option value="commercial">Commercial</option>
                          <option value="technical">Technique</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
                        <select
                          value={`${sort.field}-${sort.direction}`}
                          onChange={(e) => {
                            const [field, direction] = e.target.value.split('-');
                            handleSortChange({ field: field as any, direction: direction as any });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="updatedAt-desc">Dernière modification ↓</option>
                          <option value="updatedAt-asc">Dernière modification ↑</option>
                          <option value="createdAt-desc">Date création ↓</option>
                          <option value="createdAt-asc">Date création ↑</option>
                          <option value="name-asc">Nom A-Z</option>
                          <option value="name-desc">Nom Z-A</option>
                          <option value="priority-desc">Priorité ↓</option>
                          <option value="priority-asc">Priorité ↑</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-600">
                        {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} 
                        {filteredProjects.length !== projects.length && ` sur ${projects.length} total`}
                      </div>
                      
                      <button
                        onClick={resetFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Réinitialiser
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Contenu principal */}
              <div className="p-0">
                {viewMode === 'tree' ? (
                  <ProjectExplorer
                    onProjectSelect={handleProjectSelect}
                    selectedProjectId={selectedProject?.id}
                    height="600px"
                    allowDragDrop={true}
                    showItems={true}
                  />
                ) : viewMode === 'list' ? (
                  <div className="divide-y divide-gray-200">
                    {filteredProjects.map(project => (
                      <div 
                        key={project.id} 
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleProjectSelect(project)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                            {project.description && (
                              <p className="text-gray-600 mt-1">{project.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>{project.totalItems} items</span>
                              <span>{project.members.length} membres</span>
                              <span>Modifié le {new Date(project.updatedAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                              {project.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map(project => (
                      <div 
                        key={project.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleProjectSelect(project)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-900 truncate">{project.name}</h3>
                          <div className="flex items-center space-x-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                        
                        {project.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              {project.totalItems}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {project.members.length}
                            </span>
                          </div>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panneau de détails */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedProject ? 'Détails du Projet' : 'Actions Rapides'}
              </h3>
              
              {selectedProject ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedProject.name}</h4>
                    {selectedProject.description && (
                      <p className="text-gray-600 text-sm mt-1">{selectedProject.description}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Priorité:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedProject.priority)}`}>
                        {selectedProject.priority}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items:</span>
                      <span>{selectedProject.totalItems}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Membres:</span>
                      <span>{selectedProject.members.length}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href={`/dashboard/projects/${selectedProject.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      Voir les détails
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/dashboard/projects/new"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Projet
                  </Link>
                  
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer
                  </button>
                  
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
