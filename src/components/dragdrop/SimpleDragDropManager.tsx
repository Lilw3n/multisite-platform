'use client';

import React, { useState, useCallback } from 'react';
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
  ArrowUp
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ModuleSelector from '@/components/ModuleSelector';

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

interface DragDropModuleManagerProps {
  modules: ModuleItem[];
  onModulesUpdate: (modules: ModuleItem[]) => void;
  onModuleEdit: (moduleId: string) => void;
  onModuleDelete: (moduleId: string) => void;
  onModuleLink: (moduleId: string) => void;
  onModuleUnlink: (moduleId: string) => void;
}

// Composant pour un module individuel
function ModuleItem({ 
  module, 
  index, 
  onMoveItem, 
  onToggleFolder, 
  onModuleEdit, 
  onModuleDelete, 
  onModuleLink, 
  onModuleUnlink,
  parentId 
}: {
  module: ModuleItem;
  index: number;
  onMoveItem: (dragIndex: number, hoverIndex: number, dragParentId?: string, hoverParentId?: string) => void;
  onToggleFolder: (folderId: string) => void;
  onModuleEdit: (moduleId: string) => void;
  onModuleDelete: (moduleId: string) => void;
  onModuleLink: (moduleId: string) => void;
  onModuleUnlink: (moduleId: string) => void;
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
      return parentId && item.parentId === parentId;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'claim': return AlertTriangle;
      case 'contract': return FileText;
      case 'vehicle': return Car;
      case 'driver': return User;
      case 'project': return Folder;
      case 'quote': return Calendar;
      case 'profile': return UserCheck;
      case 'product': return Briefcase;
      default: return FileText;
    }
  };

  const getModuleColors = (type: string) => {
    switch (type) {
      case 'claim': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' };
      case 'contract': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' };
      case 'vehicle': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' };
      case 'driver': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' };
      case 'project': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' };
      case 'quote': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' };
      case 'profile': return { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' };
      case 'product': return { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' };
    }
  };

  const IconComponent = getModuleIcon(module.type);
  const colors = getModuleColors(module.type);

  return (
    <div className="relative">
      {/* Zone de drop pour sortir du dossier parent */}
      {parentId && (
        <div
          ref={dropParent}
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
        ref={(node) => drag(drop(node))}
        className={`
          p-4 rounded-xl border-2 transition-all duration-200 cursor-move
          ${colors.bg} ${colors.border}
          ${isDragging ? 'opacity-50 scale-105 rotate-2' : ''}
          ${isOver && canDrop ? 'border-green-400 bg-green-100 scale-105' : ''}
          ${isOver && !canDrop ? 'border-red-400 bg-red-100' : ''}
          hover:shadow-xl hover:scale-102
          relative group
          transform-gpu
          min-h-[120px]
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
            <div className={`p-3 rounded-lg ${colors.bg} flex-shrink-0`}>
              <IconComponent className={`w-6 h-6 ${colors.text}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className={`font-bold text-lg ${colors.text} truncate`}>
                  {module.name}
                </h4>
                <span className={`px-3 py-1 text-sm rounded-full ${colors.bg} ${colors.text} border ${colors.border} font-medium`}>
                  {module.status}
                </span>
                {/* Bouton pour développer/réduire */}
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
              onClick={() => onModuleLink(module.id)}
              className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              title="Lier"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onModuleUnlink(module.id)}
              className="text-gray-400 hover:text-orange-600 transition-colors p-1"
              title="Délier"
            >
              <X className="w-4 h-4" />
            </button>
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
                <ModuleItem
                  module={child}
                  index={childIndex}
                  onMoveItem={onMoveItem}
                  onToggleFolder={onToggleFolder}
                  onModuleEdit={onModuleEdit}
                  onModuleDelete={onModuleDelete}
                  onModuleLink={onModuleLink}
                  onModuleUnlink={onModuleUnlink}
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
export default function SimpleDragDropManager({
  modules,
  onModulesUpdate,
  onModuleEdit,
  onModuleDelete,
  onModuleLink,
  onModuleUnlink
}: DragDropModuleManagerProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const getModuleDisplayName = (moduleType: string): string => {
    const names: Record<string, string> = {
      claim: 'Sinistre',
      contract: 'Contrat',
      vehicle: 'Véhicule',
      driver: 'Conducteur',
      project: 'Projet',
      quote: 'Devis',
      profile: 'Profil',
      product: 'Produit',
      folder: 'Dossier'
    };
    return names[moduleType] || moduleType;
  };

  const handleModuleSelect = (moduleType: string) => {
    console.log('🔧 handleModuleSelect appelé avec:', moduleType);
    console.log('🔧 onModuleEdit fonction:', typeof onModuleEdit);
    
    if (moduleType === 'folder') {
      const newFolder: ModuleItem = {
        id: `folder-${Date.now()}`,
        type: 'folder',
        name: 'Nouveau dossier',
        status: 'Dossier',
        details: 'Dossier créé pour organiser les modules',
        date: new Date().toLocaleDateString('fr-FR'),
        isFolder: true,
        expanded: true,
        children: [],
        title: 'Nouveau dossier',
        description: 'Dossier générique pour organiser les modules',
        manager: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('📁 Création d\'un nouveau dossier:', newFolder);
      onModulesUpdate([...modules, newFolder]);
    } else {
      // Pour les modules avec formulaire, on ouvre directement le formulaire
      // au lieu de créer un module vide
      if (['claim', 'contract', 'vehicle', 'driver', 'profile', 'event', 'quote', 'product'].includes(moduleType)) {
        console.log('📝 Ouverture du formulaire pour:', moduleType);
        // Ouvrir le formulaire correspondant
        onModuleEdit(`new-${moduleType}`);
      } else {
        console.log('📦 Création d\'un module vide pour:', moduleType);
        // Pour les autres modules, créer un module vide
        const newModule: ModuleItem = {
          id: `${moduleType}-${Date.now()}`,
          type: moduleType,
          name: `Nouveau ${getModuleDisplayName(moduleType)}`,
          status: 'Nouveau',
          details: `Module ${getModuleDisplayName(moduleType)} créé le ${new Date().toLocaleDateString('fr-FR')}`,
          date: new Date().toLocaleDateString('fr-FR'),
          isFolder: true,
          expanded: true,
          children: [],
          title: `Nouveau ${getModuleDisplayName(moduleType)}`,
          description: `Module ${getModuleDisplayName(moduleType)} - peut contenir d'autres modules`,
          manager: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        console.log('📦 Création d\'un nouveau module:', newModule);
        onModulesUpdate([...modules, newModule]);
      }
    }
    console.log('🔧 Fermeture du sélecteur');
    setIsSelectorOpen(false);
  };

  const moveItem = useCallback((dragIndex: number, hoverIndex: number, dragParentId?: string, hoverParentId?: string) => {
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
    const sourceItem = findModuleById(newModules, modules[dragIndex]?.id);
    if (!sourceItem) return;

    // Retirer l'élément de sa position actuelle
    const removedItem = removeModule(newModules, sourceItem.module.id);
    if (!removedItem) return;

    // Ajouter l'élément à sa nouvelle position
    if (hoverParentId && hoverParentId !== dragParentId) {
      addModule(newModules, removedItem, hoverParentId, 0);
    } else if (dragParentId && !hoverParentId) {
      addModule(newModules, removedItem, undefined, hoverIndex);
    } else if (!dragParentId && !hoverParentId) {
      addModule(newModules, removedItem, undefined, hoverIndex);
    } else {
      addModule(newModules, removedItem, dragParentId, hoverIndex);
    }
    
    onModulesUpdate(newModules);
  }, [modules, onModulesUpdate]);

  const toggleFolder = (folderId: string) => {
    const newModules = modules.map(module => {
      if (module.id === folderId) {
        return { ...module, expanded: !module.expanded };
      }
      return module;
    });
    onModulesUpdate(newModules);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Modules</h2>
            <p className="text-sm text-gray-600">
              Raccourcis : <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl+N</kbd> pour ajouter
            </p>
          </div>
          <button
            onClick={() => {
              console.log('Bouton Ajouter cliqué, ouverture du sélecteur');
              setIsSelectorOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter</span>
          </button>
        </div>

        {/* Zone de drop principale */}
        <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
          {modules.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun module</h3>
              <p className="text-gray-600 mb-4">Cliquez sur "Ajouter" pour créer votre premier module</p>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module, index) => (
                <ModuleItem
                  key={module.id}
                  module={module}
                  index={index}
                  onMoveItem={moveItem}
                  onToggleFolder={toggleFolder}
                  onModuleEdit={onModuleEdit}
                  onModuleDelete={onModuleDelete}
                  onModuleLink={onModuleLink}
                  onModuleUnlink={onModuleUnlink}
                  parentId={undefined}
                />
              ))}
            </div>
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
              <h4 className="font-medium mb-1">📁 Mettre dans un dossier :</h4>
              <ul className="space-y-1">
                <li>• Glissez un module sur un autre</li>
                <li>• Zone verte = "Déposer ici !"</li>
                <li>• Le module devient un sous-élément</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">⬆️ Sortir d'un dossier :</h4>
              <ul className="space-y-1">
                <li>• Glissez vers le haut du module</li>
                <li>• Zone bleue = "Sortir du dossier"</li>
                <li>• Ou cliquez sur le bouton ⬆️</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sélecteur de module */}
        <ModuleSelector
          isOpen={isSelectorOpen}
          onClose={() => setIsSelectorOpen(false)}
          onSelectModule={handleModuleSelect}
          title="Ajouter un module ou un dossier"
        />
      </div>
    </DndProvider>
  );
}
