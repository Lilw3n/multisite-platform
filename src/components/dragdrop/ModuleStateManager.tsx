'use client';

import React, { useState, useCallback } from 'react';
import WorkingDragDropManager from './WorkingDragDropManager';
import ProfileModule from '@/components/ProfileModule';
import VehicleModuleForm from '@/components/vehicles/VehicleModuleForm';
import ProjectForm, { ProjectData } from '@/components/ProjectForm';
import Modal from '@/components/ui/Modal';

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

interface ModuleStateManagerProps {
  interlocutorId: string;
  initialModules?: ModuleItem[];
}

export default function ModuleStateManager({ 
  interlocutorId, 
  initialModules = [] 
}: ModuleStateManagerProps) {
  const [modules, setModules] = useState<ModuleItem[]>(initialModules);
  const [showProfileModule, setShowProfileModule] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [showVehicleModule, setShowVehicleModule] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [showProjectModule, setShowProjectModule] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const handleModulesUpdate = useCallback((newModules: ModuleItem[]) => {
    setModules(newModules);
    // Ici vous pouvez sauvegarder dans localStorage ou envoyer à l'API
    localStorage.setItem(`modules-${interlocutorId}`, JSON.stringify(newModules));
  }, [interlocutorId]);

  const handleModuleAdd = useCallback((moduleType: string, parentId?: string) => {
    if (moduleType === 'profile') {
      setShowProfileModule(true);
      return;
    }

    if (moduleType === 'vehicle') {
      setShowVehicleModule(true);
      return;
    }

    if (moduleType === 'project') {
      setShowProjectModule(true);
      return;
    }

    if (moduleType === 'folder') {
      // Créer un dossier directement
      const newFolder: ModuleItem = {
        id: `folder-${Date.now()}`,
        type: 'folder',
        name: `Nouveau Dossier`,
        status: 'Actif',
        details: 'Dossier créé pour organiser les modules',
        date: new Date().toLocaleDateString('fr-FR'),
        parentId: parentId,
        isFolder: true,
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
                children: [...(module.children || []), newFolder]
              };
            }
            if (module.children) {
              return { ...module, children: addToParent(module.children) };
            }
            return module;
          });
        };
        setModules(prev => addToParent(prev));
      } else {
        // Ajouter à la racine
        setModules(prev => [...prev, newFolder]);
      }
      return;
    }

    // Pour tous les autres types de modules, créer un module simple
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
      setModules(prev => addToParent(prev));
    } else {
      // Ajouter à la racine
      setModules(prev => [...prev, newModule]);
    }
  }, []);

  const handleModuleEdit = useCallback((moduleId: string) => {
    const module = findModuleById(modules, moduleId);
    if (module) {
      if (module.type === 'profile') {
        setEditingProfile(module);
        setShowProfileModule(true);
      } else if (module.type === 'vehicle') {
        setEditingVehicle(module);
        setShowVehicleModule(true);
      } else if (module.type === 'project') {
        setEditingProject(module);
        setShowProjectModule(true);
      } else {
        // Ouvrir le formulaire d'édition approprié
        console.log(`Édition du module: ${moduleId}`);
      }
    }
  }, [modules]);

  const handleModuleDelete = useCallback((moduleId: string) => {
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

    setModules(prev => deleteModule(prev));
  }, []);

  const handleModuleLink = useCallback((moduleId: string) => {
    console.log(`Liaison du module: ${moduleId}`);
    // Ici vous pouvez gérer la liaison du module
  }, []);

  const handleModuleUnlink = useCallback((moduleId: string) => {
    console.log(`Déliaison du module: ${moduleId}`);
    // Ici vous pouvez gérer la déliaison du module
  }, []);

  const handleProfileSave = useCallback((profileData: any) => {
    if (editingProfile) {
      // Mettre à jour le profil existant
      const updateModule = (moduleList: ModuleItem[]): ModuleItem[] => {
        return moduleList.map(module => {
          if (module.id === editingProfile.id) {
            return {
              ...module,
              name: `${profileData.personalInfo.firstName} ${profileData.personalInfo.lastName}`,
              details: profileData.personalDetails.bio || 'Profil utilisateur',
              status: 'Complété'
            };
          }
          if (module.children) {
            module.children = updateModule(module.children);
          }
          return module;
        });
      };
      setModules(prev => updateModule(prev));
    } else {
      // Créer un nouveau profil
      const newProfile: ModuleItem = {
        id: `profile-${Date.now()}`,
        type: 'profile',
        name: `${profileData.personalInfo.firstName} ${profileData.personalInfo.lastName}`,
        status: 'Complété',
        details: profileData.personalDetails.bio || 'Profil utilisateur',
        date: new Date().toLocaleDateString('fr-FR')
      };
      setModules(prev => [...prev, newProfile]);
    }
    
    setShowProfileModule(false);
    setEditingProfile(null);
  }, [editingProfile]);

  const handleProfileCancel = useCallback(() => {
    setShowProfileModule(false);
    setEditingProfile(null);
  }, []);

  const handleVehicleSave = useCallback((vehicleData: any) => {
    if (editingVehicle) {
      // Mettre à jour le véhicule existant
      const updateModule = (moduleList: ModuleItem[]): ModuleItem[] => {
        return moduleList.map(module => {
          if (module.id === editingVehicle.id) {
            return {
              ...module,
              name: `${vehicleData.brand} ${vehicleData.model} - ${vehicleData.registration}`,
              details: `Véhicule ${vehicleData.brand} ${vehicleData.model} (${vehicleData.registration})`,
              status: 'Complété'
            };
          }
          if (module.children) {
            module.children = updateModule(module.children);
          }
          return module;
        });
      };
      setModules(prev => updateModule(prev));
    } else {
      // Créer un nouveau véhicule
      const newVehicle: ModuleItem = {
        id: `vehicle-${Date.now()}`,
        type: 'vehicle',
        name: `${vehicleData.brand} ${vehicleData.model} - ${vehicleData.registration}`,
        status: 'Complété',
        details: `Véhicule ${vehicleData.brand} ${vehicleData.model} (${vehicleData.registration})`,
        date: new Date().toLocaleDateString('fr-FR'),
        isFolder: true,
        expanded: true,
        children: [],
        title: `${vehicleData.brand} ${vehicleData.model}`,
        description: `Véhicule ${vehicleData.registration}`,
        manager: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setModules(prev => [...prev, newVehicle]);
    }
    
    setShowVehicleModule(false);
    setEditingVehicle(null);
  }, [editingVehicle]);

  const handleVehicleCancel = useCallback(() => {
    setShowVehicleModule(false);
    setEditingVehicle(null);
  }, []);

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
            module.children = updateModule(module.children);
          }
          return module;
        });
      };
      setModules(prev => updateModule(prev));
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
      setModules(prev => [...prev, newProject]);
    }
    
    setShowProjectModule(false);
    setEditingProject(null);
  }, [editingProject]);

  const handleProjectCancel = useCallback(() => {
    setShowProjectModule(false);
    setEditingProject(null);
  }, []);

  return (
    <>
      <WorkingDragDropManager
        modules={modules}
        onModulesUpdate={handleModulesUpdate}
        onModuleAdd={handleModuleAdd}
        onModuleEdit={handleModuleEdit}
        onModuleDelete={handleModuleDelete}
        onModuleLink={handleModuleLink}
        onModuleUnlink={handleModuleUnlink}
      />

      {/* Module de profil */}
      {showProfileModule && (
        <Modal
          isOpen={showProfileModule}
          onClose={handleProfileCancel}
          title={editingProfile ? "Modifier le profil" : "Créer un profil"}
          size="xl"
          enableKeyboard={true}
        >
          <ProfileModule
            profile={editingProfile}
            onSave={handleProfileSave}
            onCancel={handleProfileCancel}
            isEditing={true}
          />
        </Modal>
      )}

      {/* Module de véhicule */}
      {showVehicleModule && (
        <Modal
          isOpen={showVehicleModule}
          onClose={handleVehicleCancel}
          title={editingVehicle ? "Modifier le véhicule" : "Créer un véhicule"}
          size="xl"
          enableKeyboard={true}
        >
          <VehicleModuleForm
            vehicle={editingVehicle}
            onSave={handleVehicleSave}
            onCancel={handleVehicleCancel}
            isEditing={!!editingVehicle}
          />
        </Modal>
      )}

      {/* Module de projet */}
      <ProjectForm
        isOpen={showProjectModule}
        onClose={handleProjectCancel}
        onSave={handleProjectSave}
        editingProject={editingProject}
      />
    </>
  );
}

// Fonctions utilitaires
function getModuleDisplayName(moduleType: string): string {
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
    folder: 'Dossier'
  };
  return names[moduleType] || moduleType;
}

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
