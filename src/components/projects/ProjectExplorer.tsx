'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  Shield, 
  ChevronRight, 
  ChevronDown,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Move,
  Copy,
  Trash2,
  Edit,
  Eye,
  Star,
  Clock,
  Users,
  Tag,
  AlertCircle,
  CheckCircle,
  Pause,
  X
} from 'lucide-react';
import { ProjectTreeNode, Project, ProjectItem, DragDropOperation } from '@/types/project';
import { ProjectService } from '@/lib/projectService';

interface ProjectExplorerProps {
  onProjectSelect?: (project: Project) => void;
  onItemSelect?: (item: ProjectItem, project: Project) => void;
  selectedProjectId?: string;
  selectedItemId?: string;
  showItems?: boolean;
  allowDragDrop?: boolean;
  allowMultiSelect?: boolean;
  height?: string;
}

interface DragState {
  isDragging: boolean;
  draggedId: string | null;
  draggedType: 'project' | 'item' | null;
  dropTargetId: string | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
}

export default function ProjectExplorer({
  onProjectSelect,
  onItemSelect,
  selectedProjectId,
  selectedItemId,
  showItems = true,
  allowDragDrop = true,
  allowMultiSelect = false,
  height = '600px'
}: ProjectExplorerProps) {
  const [treeData, setTreeData] = useState<ProjectTreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    draggedType: null,
    dropTargetId: null,
    dropPosition: null
  });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    projectId: string;
    itemId?: string;
  } | null>(null);

  const explorerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      setSelectedNodes(new Set([selectedProjectId]));
      // Auto-expand parents of selected project
      expandToProject(selectedProjectId);
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const projects = await ProjectService.getProjectTree();
      setTreeData(projects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const expandToProject = async (projectId: string) => {
    const project = await ProjectService.getProject(projectId);
    if (project) {
      const newExpanded = new Set(expandedNodes);
      project.path.forEach(ancestorId => {
        newExpanded.add(ancestorId);
      });
      setExpandedNodes(newExpanded);
    }
  };

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeSelect = (project: Project, item?: ProjectItem) => {
    if (allowMultiSelect) {
      const newSelected = new Set(selectedNodes);
      const nodeId = item ? `${project.id}-${item.id}` : project.id;
      
      if (newSelected.has(nodeId)) {
        newSelected.delete(nodeId);
      } else {
        newSelected.add(nodeId);
      }
      setSelectedNodes(newSelected);
    } else {
      const nodeId = item ? `${project.id}-${item.id}` : project.id;
      setSelectedNodes(new Set([nodeId]));
    }

    if (item && onItemSelect) {
      onItemSelect(item, project);
    } else if (!item && onProjectSelect) {
      onProjectSelect(project);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string, type: 'project' | 'item') => {
    if (!allowDragDrop) return;
    
    setDragState({
      isDragging: true,
      draggedId: id,
      draggedType: type,
      dropTargetId: null,
      dropPosition: null
    });

    e.dataTransfer.setData('text/plain', JSON.stringify({ id, type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    if (!allowDragDrop || !dragState.isDragging) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    let position: 'before' | 'after' | 'inside';
    if (y < height * 0.25) {
      position = 'before';
    } else if (y > height * 0.75) {
      position = 'after';
    } else {
      position = 'inside';
    }

    setDragState(prev => ({
      ...prev,
      dropTargetId: targetId,
      dropPosition: position
    }));
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!allowDragDrop) return;
    
    // Only clear if we're leaving the entire component
    if (!explorerRef.current?.contains(e.relatedTarget as Node)) {
      setDragState(prev => ({
        ...prev,
        dropTargetId: null,
        dropPosition: null
      }));
    }
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    if (!allowDragDrop || !dragState.isDragging || !dragState.draggedId) return;
    
    e.preventDefault();
    
    const operation: DragDropOperation = {
      sourceId: dragState.draggedId,
      targetId,
      operation: dragState.dropPosition === 'inside' ? 'move_into' : 
                dragState.dropPosition === 'before' ? 'move_before' : 'move_after',
      sourceType: dragState.draggedType!,
      targetType: 'project'
    };

    try {
      if (dragState.draggedType === 'project') {
        await ProjectService.moveProject(operation.sourceId, operation.targetId, operation.operation);
        await loadProjects();
      }
      // TODO: Implement item moving logic
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
    }

    setDragState({
      isDragging: false,
      draggedId: null,
      draggedType: null,
      dropTargetId: null,
      dropPosition: null
    });
  };

  const handleContextMenu = (e: React.MouseEvent, projectId: string, itemId?: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      projectId,
      itemId
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const getProjectIcon = (project: Project, isExpanded: boolean) => {
    if (project.children.length > 0) {
      return isExpanded ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 text-blue-500" />;
    }
    return <Folder className="w-4 h-4 text-gray-500" />;
  };

  const getItemIcon = (item: ProjectItem) => {
    switch (item.type) {
      case 'quote':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'contract':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'document':
        return <File className="w-4 h-4 text-gray-500" />;
      case 'task':
        return <CheckCircle className="w-4 h-4 text-orange-500" />;
      case 'note':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-blue-500" />;
      case 'on_hold':
        return <Pause className="w-3 h-3 text-yellow-500" />;
      case 'cancelled':
        return <X className="w-3 h-3 text-red-500" />;
      case 'draft':
        return <Clock className="w-3 h-3 text-gray-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderProjectNode = (project: ProjectTreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(project.id);
    const isSelected = selectedNodes.has(project.id);
    const hasChildren = project.children.length > 0;
    const paddingLeft = level * 20 + 8;

    const isDragTarget = dragState.dropTargetId === project.id;
    const dropIndicatorClass = isDragTarget ? 
      dragState.dropPosition === 'before' ? 'border-t-2 border-blue-500' :
      dragState.dropPosition === 'after' ? 'border-b-2 border-blue-500' :
      'bg-blue-50 border border-blue-300' : '';

    return (
      <div key={project.id}>
        {/* Indicateur de drop "before" */}
        {isDragTarget && dragState.dropPosition === 'before' && (
          <div className="h-0.5 bg-blue-500 mx-2" />
        )}
        
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-50 cursor-pointer select-none ${
            isSelected ? 'bg-blue-100 text-blue-900' : ''
          } ${dropIndicatorClass}`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          draggable={allowDragDrop}
          onDragStart={(e) => handleDragStart(e, project.id, 'project')}
          onDragOver={(e) => handleDragOver(e, project.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, project.id)}
          onClick={() => handleNodeSelect(project)}
          onContextMenu={(e) => handleContextMenu(e, project.id)}
        >
          {/* Chevron d'expansion */}
          <div className="w-4 h-4 flex items-center justify-center mr-1">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(project.id);
                }}
                className="hover:bg-gray-200 rounded p-0.5"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
          </div>

          {/* Icône du projet */}
          <div className="mr-2">
            {getProjectIcon(project, isExpanded)}
          </div>

          {/* Nom du projet */}
          <div className="flex-1 flex items-center min-w-0">
            <span className="truncate font-medium text-sm">{project.name}</span>
            
            {/* Badges de statut et priorité */}
            <div className="flex items-center ml-2 space-x-1">
              {getStatusIcon(project.status)}
              <span className={`text-xs ${getPriorityColor(project.priority)}`}>
                {project.priority === 'urgent' ? '🔥' : 
                 project.priority === 'high' ? '⚡' : 
                 project.priority === 'medium' ? '📋' : '📝'}
              </span>
            </div>
          </div>

          {/* Compteurs */}
          <div className="flex items-center space-x-2 text-xs text-gray-500 ml-2">
            {project.totalItems > 0 && (
              <span className="flex items-center">
                <File className="w-3 h-3 mr-1" />
                {project.totalItems}
              </span>
            )}
            {project.members.length > 0 && (
              <span className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {project.members.length}
              </span>
            )}
          </div>
        </div>

        {/* Items du projet */}
        {showItems && isExpanded && project.items.length > 0 && (
          <div>
            {project.items.map(item => renderItemNode(item, project, level + 1))}
          </div>
        )}

        {/* Projets enfants */}
        {isExpanded && project.children.map(child => 
          renderProjectNode(child, level + 1)
        )}

        {/* Indicateur de drop "after" */}
        {isDragTarget && dragState.dropPosition === 'after' && (
          <div className="h-0.5 bg-blue-500 mx-2" />
        )}
      </div>
    );
  };

  const renderItemNode = (item: ProjectItem, project: Project, level: number) => {
    const nodeId = `${project.id}-${item.id}`;
    const isSelected = selectedNodes.has(nodeId);
    const paddingLeft = level * 20 + 8;

    return (
      <div
        key={item.id}
        className={`flex items-center py-1 px-2 hover:bg-gray-50 cursor-pointer select-none ${
          isSelected ? 'bg-green-100 text-green-900' : ''
        }`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        draggable={allowDragDrop}
        onDragStart={(e) => handleDragStart(e, item.id, 'item')}
        onClick={() => handleNodeSelect(project, item)}
        onContextMenu={(e) => handleContextMenu(e, project.id, item.id)}
      >
        {/* Espacement pour l'alignement */}
        <div className="w-4 h-4 mr-1" />

        {/* Icône de l'item */}
        <div className="mr-2">
          {getItemIcon(item)}
        </div>

        {/* Nom de l'item */}
        <div className="flex-1 flex items-center min-w-0">
          <span className="truncate text-sm">{item.title}</span>
          
          {/* Badge de statut */}
          <div className="ml-2">
            {getStatusIcon(item.status)}
          </div>
        </div>

        {/* Date de création */}
        <div className="text-xs text-gray-500 ml-2">
          {new Date(item.createdAt).toLocaleDateString('fr-FR')}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      {/* Barre de recherche */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher dans les projets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Arbre des projets */}
      <div 
        ref={explorerRef}
        className="overflow-auto"
        style={{ height: 'calc(100% - 60px)' }}
        onClick={closeContextMenu}
      >
        {treeData.length > 0 ? (
          <div className="py-2">
            {treeData.map(project => renderProjectNode(project))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Folder className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium mb-2">Aucun projet</p>
            <p className="text-sm text-center">
              Créez votre premier projet pour commencer à organiser vos devis et contrats.
            </p>
          </div>
        )}
      </div>

      {/* Menu contextuel */}
      {contextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeContextMenu}
          />
          <div
            className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-48"
            style={{ 
              left: contextMenu.x, 
              top: contextMenu.y,
              transform: 'translate(-50%, -10px)'
            }}
          >
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Voir les détails
            </button>
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </button>
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
              <Copy className="w-4 h-4 mr-2" />
              Dupliquer
            </button>
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
              <Move className="w-4 h-4 mr-2" />
              Déplacer
            </button>
            <hr className="my-1" />
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Ajouter aux favoris
            </button>
            <hr className="my-1" />
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-700 flex items-center">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
}
