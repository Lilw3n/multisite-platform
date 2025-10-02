'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Plus, 
  Folder, 
  FolderOpen, 
  GripVertical, 
  Trash2, 
  Edit, 
  Eye, 
  X,
  Car, 
  User, 
  FileText, 
  Shield, 
  Calendar, 
  AlertTriangle, 
  UserCheck,
  Briefcase,
  ArrowUp,
  Save,
  MoreVertical
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ModuleSelector from '@/components/ModuleSelector';
import ProjectForm, { ProjectData } from '@/components/ProjectForm';

interface ModuleItem {
  id: string;
  type: string;
  name: string;
  status: string;
  details: string;
  date: string;
  cost?: string;
  insurer?: string;
  contractNumber?: string;
  assignedTo?: string;
  priority?: string;
  parentId?: string;
  children?: ModuleItem[];
  isFolder?: boolean;
  expanded?: boolean;
  title?: string;
  description?: string;
  manager?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DragItem {
  id: string;
  index: number;
  parentId?: string;
}

interface CompleteModuleManagerProps {
  interlocutorId: string;
  initialModules?: ModuleItem[];
  onModulesChange?: (modules: ModuleItem[]) => void;
}

// Composant pour un module individuel
function ModuleItemComponent({ 
  module, 
  index, 
  onMoveItem, 
  onToggleFolder, 
  onModuleEdit, 
  onModuleDelete, 
  onModuleAdd,
  parentId 
}: {
  module: ModuleItem;
  index: number;
  onMoveItem: (dragIndex: number, hoverIndex: number, dragParentId?: string, hoverParentId?: string) => void;
  onToggleFolder: (folderId: string) => void;
  onModuleEdit: (moduleId: string) => void;
  onModuleDelete: (moduleId: string) => void;
  onModuleAdd: (moduleType: string, parentId?: string) => void;
  parentId?: string;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'module',
    item: { id: module.id, index, parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'module',
    drop: (item: DragItem) => {
      if (item.id !== module.id) {
        onMoveItem(item.index, 0, item.parentId, module.id);
        return { success: true };
      }
    },
    canDrop: (item: DragItem) => {
      return item.id !== module.id;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Zone de drop pour sortir du dossier parent
  const [{ isOver: isOverParent, canDrop: canDropParent }, dropParent] = useDrop({
    accept: 'module',
    drop: (item: DragItem) => {
      if (item.parentId && item.parentId !== parentId) {
        onMoveItem(item.index, 0, item.parentId, undefined);
        return { success: true };
      }
    },
    canDrop: (item: DragItem) => {
      return Boolean(parentId && item.parentId === parentId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const getModuleIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      'claim': AlertTriangle,
      'vehicle': Car,
      'driver': UserCheck,
      'contract': FileText,
      'insurance-request': Shield,
      'profile': User,
      'event': Calendar,
      'project': Briefcase,
      'folder': Folder,
      'quote': FileText,
      'product': Briefcase
    };
    return icons[type] || FileText;
  };

  const getModuleColor = (type: string) => {
    const colors: Record<string, string> = {
      'claim': 'text-red-600 bg-red-50 border-red-200',
      'vehicle': 'text-blue-600 bg-blue-50 border-blue-200',
      'driver': 'text-green-600 bg-green-50 border-green-200',
      'contract': 'text-purple-600 bg-purple-50 border-purple-200',
      'insurance-request': 'text-indigo-600 bg-indigo-50 border-indigo-200',
      'profile': 'text-pink-600 bg-pink-50 border-pink-200',
      'event': 'text-orange-600 bg-orange-50 border-orange-200',
      'project': 'text-gray-600 bg-gray-50 border-gray-200',
      'folder': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'quote': 'text-cyan-600 bg-cyan-50 border-cyan-200',
      'product': 'text-emerald-600 bg-emerald-50 border-emerald-200'
    };
    return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const IconComponent = getModuleIcon(module.type);
  const colorClasses = getModuleColor(module.type);

  return (
    <div className="relative">
      {/* Zone de sortie du dossier parent */}
      {parentId && (
        <div
          ref={(node) => {
            if (node) dropParent(node);
          }}
          className={`
            absolute -top-2 -left-2 -right-2 h-4 rounded-t-lg transition-all duration-200 z-10
            ${isOverParent && canDropParent 
              ? 'bg-blue-500 border-2 border-blue-600' 
              : 'bg-transparent'
            }
          `}
        >
          {isOverParent && canDropParent && (
            <div className="text-center text-white text-xs font-bold py-1">
              ⬆️ Sortir du dossier
            </div>
          )}
        </div>
      )}

      <div
        ref={(node) => {
          if (node) {
            const dropRef = drop(node);
            const dragRef = drag(dropRef);
          }
        }}
        className={`
          p-4 rounded-xl border-2 transition-all duration-200 cursor-move
          ${colorClasses}
          ${isDragging ? 'opacity-50 scale-105 rotate-2' : ''}
          ${isOver && canDrop ? 'border-green-400 bg-green-100 scale-105' : ''}
          hover:shadow-lg
        `}
      >
        {/* Indicateur de zone de drop */}
        {isOver && canDrop && (
          <div className="absolute inset-0 border-2 border-dashed border-green-500 rounded-lg bg-green-50 bg-opacity-90 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="text-green-700 font-bold text-2xl mb-2">📁</div>
              <span className="text-green-700 font-bold text-base">Déposer ici !</span>
              <div className="text-green-600 text-sm mt-1">Le module sera placé à l'intérieur</div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          {/* Handle de drag */}
          <div className="text-gray-400 hover:text-gray-600">
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Icône et titre principal */}
          <div className="flex items-start space-x-3 mb-3 flex-1">
            <div className={`p-3 rounded-lg ${colorClasses.split(' ')[1]} flex-shrink-0`}>
              <IconComponent className={`w-6 h-6 ${colorClasses.split(' ')[0]}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className={`font-bold text-lg ${colorClasses.split(' ')[0]} truncate`}>
                  {module.name}
                </h4>
                <span className={`px-3 py-1 text-sm rounded-full ${colorClasses.split(' ')[1]} ${colorClasses.split(' ')[0]} border ${colorClasses.split(' ')[2]} font-medium`}>
                  {module.status}
                </span>
                {/* Bouton pour développer/réduire */}
                {module.isFolder && (
                  <button
                    onClick={() => onToggleFolder(module.id)}
                    className="text-gray-500 hover:text-blue-600 p-1 rounded transition-colors"
                    title={module.expanded ? "Réduire" : "Développer"}
                  >
                    {module.expanded ? (
                      <FolderOpen className="w-5 h-5" />
                    ) : (
                      <Folder className="w-5 h-5" />
                    )}
                  </button>
                )}
                {/* Indicateur du nombre d'éléments contenus */}
                {module.children && module.children.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {module.children.length} élément(s)
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 text-base mb-3 leading-relaxed">{module.details}</p>
              
              {/* Informations détaillées */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📅</span>
                  <span className="text-gray-700 font-medium">{module.date}</span>
                </div>
                {module.cost && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">💰</span>
                    <span className="text-gray-700 font-medium">{module.cost}</span>
                  </div>
                )}
                {module.insurer && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">🏢</span>
                    <span className="text-gray-700 font-medium">{module.insurer}</span>
                  </div>
                )}
                {module.contractNumber && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">📄</span>
                    <span className="text-gray-700 font-medium">{module.contractNumber}</span>
                  </div>
                )}
                {module.assignedTo && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">👤</span>
                    <span className="text-gray-700 font-medium">{module.assignedTo}</span>
                  </div>
                )}
                {module.manager && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">👨‍💼</span>
                    <span className="text-gray-700 font-medium">Gestionnaire: {module.manager}</span>
                  </div>
                )}
                {module.priority && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">⚡</span>
                    <span className="text-gray-700 font-medium">{module.priority}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            {/* Bouton pour sortir du dossier parent */}
            {parentId && (
              <button
                onClick={() => onMoveItem(index, 0, parentId, undefined)}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                title="Sortir du dossier parent"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => onModuleEdit(module.id)}
              className="text-gray-400 hover:text-green-600 transition-colors p-1"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onModuleDelete(module.id)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bouton d'ajout de module dans ce dossier */}
        {module.isFolder && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => onModuleAdd('project', module.id)}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un module</span>
            </button>
          </div>
        )}

        {/* Affichage des modules enfants */}
        {module.isFolder && module.expanded && module.children && module.children.length > 0 && (
          <div className="mt-6 ml-4 border-l-4 border-blue-200 pl-6 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-blue-600 font-medium text-sm">📁 Contenu du module :</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {module.children.length} élément(s)
              </span>
            </div>
            {module.children.map((child, childIndex) => (
              <div key={child.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <ModuleItemComponent
                  module={child}
                  index={childIndex}
                  onMoveItem={onMoveItem}
                  onToggleFolder={onToggleFolder}
                  onModuleEdit={onModuleEdit}
                  onModuleDelete={onModuleDelete}
                  onModuleAdd={onModuleAdd}
                  parentId={module.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant principal
export default function CompleteModuleManager({
  interlocutorId,
  initialModules = [],
  onModulesChange
}: CompleteModuleManagerProps) {
  const [modules, setModules] = useState<ModuleItem[]>(initialModules);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

  // Charger les modules depuis le localStorage
  useEffect(() => {
    const savedModules = localStorage.getItem(`modules-${interlocutorId}`);
    if (savedModules) {
      try {
        const parsedModules = JSON.parse(savedModules);
        setModules(parsedModules);
      } catch (error) {
        console.error('Erreur lors du chargement des modules:', error);
      }
    }
  }, [interlocutorId]);

  // Sauvegarder les modules
  const saveModules = useCallback((newModules: ModuleItem[]) => {
    setModules(newModules);
    localStorage.setItem(`modules-${interlocutorId}`, JSON.stringify(newModules));
    if (onModulesChange) {
      onModulesChange(newModules);
    }
  }, [interlocutorId, onModulesChange]);

  const handleModuleAdd = useCallback((moduleType: string, parentId?: string) => {
    console.log('➕ Ajouter module:', moduleType, 'dans:', parentId);

    if (moduleType === 'project') {
      setShowProjectForm(true);
      return;
    }

    const getModuleDisplayName = (type: string): string => {
      const names: Record<string, string> = {
        claim: 'Sinistre',
        contract: 'Contrat',
        quote: 'Devis',
        'insurance-request': 'Demande d\'Assurance',
        vehicle: 'Véhicule',
        driver: 'Conducteur',
        profile: 'Profil',
        event: 'Événement',
        project: 'Projet',
        product: 'Produit',
        folder: 'Dossier'
      };
      return names[type] || type;
    };

    const newModule: ModuleItem = {
      id: `${moduleType}-${Date.now()}`,
      type: moduleType,
      name: `Nouveau ${getModuleDisplayName(moduleType)}`,
      status: 'Nouveau',
      details: `Module ${getModuleDisplayName(moduleType)} créé le ${new Date().toLocaleDateString('fr-FR')}`,
      date: new Date().toLocaleDateString('fr-FR'),
      cost: moduleType === 'contract' ? '1000€' : undefined,
      insurer: moduleType === 'contract' ? 'AXA' : undefined,
      contractNumber: moduleType === 'contract' ? `POL-${Date.now()}` : undefined,
      parentId: parentId,
      isFolder: moduleType === 'project' || moduleType === 'vehicle' || moduleType === 'folder',
      expanded: true,
      children: []
    };

    if (parentId) {
      // Ajouter dans le dossier parent
      const addToParent = (moduleList: ModuleItem[]): ModuleItem[] => {
        return moduleList.map(module => {
          if (module.id === parentId) {
            return {
              ...module,
              children: [...(module.children || []), newModule]
            };
          }
          if (module.children) {
            return { ...module, children: addToParent(module.children) };
          }
          return module;
        });
      };
      saveModules(addToParent(modules));
    } else {
      // Ajouter à la racine
      saveModules([...modules, newModule]);
    }
  }, [modules, saveModules]);

  const handleModuleEdit = useCallback((moduleId: string) => {
    console.log('✏️ Modifier module:', moduleId);
    const module = findModuleById(modules, moduleId);
    if (module && module.type === 'project') {
      setEditingProject({
        id: module.id,
        title: module.title || module.name,
        description: module.description || module.details,
        manager: module.manager || ''
      });
      setShowProjectForm(true);
    } else {
      // Pour les autres types de modules, on pourrait ouvrir d'autres formulaires
      alert(`Modification du module ${moduleId} (Fonctionnalité en cours de développement)`);
    }
  }, [modules]);

  const handleModuleDelete = useCallback((moduleId: string) => {
    console.log('🗑️ Supprimer module:', moduleId);
    const deleteModule = (moduleList: ModuleItem[]): ModuleItem[] => {
      return moduleList.filter(module => {
        if (module.id === moduleId) {
          return false;
        }
        if (module.children) {
          module.children = deleteModule(module.children);
        }
        return true;
      });
    };
    saveModules(deleteModule(modules));
  }, [modules, saveModules]);

  const handleToggleFolder = useCallback((folderId: string) => {
    const toggleFolder = (moduleList: ModuleItem[]): ModuleItem[] => {
      return moduleList.map(module => {
        if (module.id === folderId) {
          return { ...module, expanded: !module.expanded };
        }
        if (module.children) {
          return { ...module, children: toggleFolder(module.children) };
        }
        return module;
      });
    };
    saveModules(toggleFolder(modules));
  }, [modules, saveModules]);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number, dragParentId?: string, hoverParentId?: string) => {
    console.log('🔄 Déplacer module:', { dragIndex, hoverIndex, dragParentId, hoverParentId });
    
    const newModules = [...modules];
    
    // Fonction pour trouver un module par ID dans la hiérarchie
    const findModuleById = (moduleList: ModuleItem[], id: string): { module: ModuleItem; parent: ModuleItem | null; index: number } | null => {
      for (let i = 0; i < moduleList.length; i++) {
        if (moduleList[i].id === id) {
          return { module: moduleList[i], parent: null, index: i };
        }
        if (moduleList[i].children) {
          const found = findModuleById(moduleList[i].children!, id);
          if (found) {
            return { ...found, parent: moduleList[i] };
          }
        }
      }
      return null;
    };

    // Fonction pour retirer un module de sa position actuelle
    const removeModule = (moduleList: ModuleItem[], id: string): ModuleItem | null => {
      for (let i = 0; i < moduleList.length; i++) {
        if (moduleList[i].id === id) {
          return moduleList.splice(i, 1)[0];
        }
        if (moduleList[i].children) {
          const removed = removeModule(moduleList[i].children!, id);
          if (removed) return removed;
        }
      }
      return null;
    };

    // Fonction pour ajouter un module à une position
    const addModule = (moduleList: ModuleItem[], module: ModuleItem, parentId?: string, index: number = 0) => {
      if (parentId) {
        const targetParent = findModuleById(moduleList, parentId);
        if (targetParent) {
          if (!targetParent.module.children) {
            targetParent.module.children = [];
          }
          targetParent.module.children.splice(index, 0, module);
          module.parentId = parentId;
        }
      } else {
        moduleList.splice(index, 0, module);
        module.parentId = undefined;
      }
    };

    // Trouver l'élément à déplacer
    const dragItem = findModuleById(newModules, dragParentId ? 
      (findModuleById(newModules, dragParentId)?.module.children?.[dragIndex]?.id || '') : 
      newModules[dragIndex]?.id || ''
    );

    if (!dragItem) {
      console.error('Élément à déplacer non trouvé');
      return;
    }

    // Retirer l'élément de sa position actuelle
    const removedItem = removeModule(newModules, dragItem.module.id);
    if (!removedItem) {
      console.error('Impossible de retirer l\'élément');
      return;
    }

    // Ajouter l'élément à sa nouvelle position
    addModule(newModules, removedItem, hoverParentId, hoverIndex);

    saveModules(newModules);
  }, [modules, saveModules]);

  const handleProjectSave = useCallback((projectData: ProjectData) => {
    if (editingProject) {
      // Mettre à jour le projet existant
      const updateModule = (moduleList: ModuleItem[]): ModuleItem[] => {
        return moduleList.map(module => {
          if (module.id === editingProject.id) {
            return {
              ...module,
              name: projectData.title,
              details: projectData.description,
              status: 'Actif',
              title: projectData.title,
              description: projectData.description,
              manager: projectData.manager
            };
          }
          if (module.children) {
            return { ...module, children: updateModule(module.children) };
          }
          return module;
        });
      };
      saveModules(updateModule(modules));
    } else {
      // Créer un nouveau projet
      const newProject: ModuleItem = {
        id: `project-${Date.now()}`,
        type: 'project',
        name: projectData.title,
        status: 'Actif',
        details: projectData.description,
        date: new Date().toLocaleDateString('fr-FR'),
        isFolder: true,
        expanded: true,
        children: [],
        title: projectData.title,
        description: projectData.description,
        manager: projectData.manager
      };
      saveModules([...modules, newProject]);
    }
    
    setShowProjectForm(false);
    setEditingProject(null);
  }, [editingProject, modules, saveModules]);

  const handleProjectCancel = useCallback(() => {
    setShowProjectForm(false);
    setEditingProject(null);
  }, []);

  const renderModules = (moduleList: ModuleItem[], parentId?: string) => {
    return moduleList.map((module, index) => (
      <div key={module.id}>
        <ModuleItemComponent
          module={module}
          index={index}
          onMoveItem={moveItem}
          onToggleFolder={handleToggleFolder}
          onModuleEdit={handleModuleEdit}
          onModuleDelete={handleModuleDelete}
          onModuleAdd={handleModuleAdd}
          parentId={parentId}
        />
      </div>
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {/* En-tête avec bouton d'ajout principal */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Organisation des Modules</h2>
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un module</span>
          </button>
        </div>

        {/* Liste des modules */}
        <div className="space-y-4">
          {modules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun module</h3>
              <p className="text-gray-600 mb-4">Commencez par ajouter votre premier module</p>
              <button
                onClick={() => setIsSelectorOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter un module
              </button>
            </div>
          ) : (
            renderModules(modules)
          )}
        </div>

        {/* Instructions d'utilisation */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2 flex items-center">
            <span className="text-lg mr-2">🎯</span>
            Comment utiliser le drag & drop
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
            <div>
              <h4 className="font-medium mb-2">Déplacer un module :</h4>
              <ul className="space-y-1">
                <li>• Glissez le module vers un autre module</li>
                <li>• Zone verte = "Placer à l'intérieur"</li>
                <li>• Zone bleue = "Sortir du dossier"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Organiser :</h4>
              <ul className="space-y-1">
                <li>• Créez des dossiers pour regrouper</li>
                <li>• Cliquez sur 📁 pour développer/réduire</li>
                <li>• Utilisez le bouton "+" dans chaque dossier</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sélecteur de module */}
        <ModuleSelector
          isOpen={isSelectorOpen}
          onClose={() => setIsSelectorOpen(false)}
          onSelectModule={(moduleType) => {
            handleModuleAdd(moduleType);
            setIsSelectorOpen(false);
          }}
          title="Ajouter un module"
        />

        {/* Formulaire de projet */}
        <ProjectForm
          isOpen={showProjectForm}
          onClose={handleProjectCancel}
          onSave={handleProjectSave}
          editingProject={editingProject}
        />
      </div>
    </DndProvider>
  );
}

// Fonction utilitaire pour trouver un module par ID
function findModuleById(modules: ModuleItem[], id: string): ModuleItem | null {
  for (const module of modules) {
    if (module.id === id) {
      return module;
    }
    if (module.children) {
      const found = findModuleById(module.children, id);
      if (found) return found;
    }
  }
  return null;
}
