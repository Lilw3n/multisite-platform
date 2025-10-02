'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Car, 
  User, 
  FileText, 
  Shield, 
  Calendar, 
  AlertTriangle, 
  UserCheck,
  Briefcase,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import ModuleSelector from './ModuleSelector';
import ProfileModule from './ProfileModule';
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
}

interface ModuleManagerProps {
  interlocutorId: string;
  modules: ModuleItem[];
  onModuleAdd: (moduleType: string) => void;
  onModuleEdit: (moduleId: string) => void;
  onModuleDelete: (moduleId: string) => void;
  onModuleLink: (moduleId: string) => void;
  onModuleUnlink: (moduleId: string) => void;
}

const moduleIcons = {
  claim: AlertTriangle,
  contract: FileText,
  quote: FileText,
  'insurance-request': Shield,
  vehicle: Car,
  driver: UserCheck,
  profile: User,
  event: Calendar,
  project: Briefcase
};

const moduleColors = {
  claim: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  contract: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  quote: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  'insurance-request': { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  vehicle: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  driver: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  profile: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  event: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  project: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
};

export default function ModuleManager({
  interlocutorId,
  modules,
  onModuleAdd,
  onModuleEdit,
  onModuleDelete,
  onModuleLink,
  onModuleUnlink
}: ModuleManagerProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showProfileModule, setShowProfileModule] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);

  const handleModuleSelect = (moduleType: string) => {
    setSelectedModule(moduleType);
    setIsSelectorOpen(false);
    
    if (moduleType === 'profile') {
      setShowProfileModule(true);
    } else {
      onModuleAdd(moduleType);
    }
  };

  const handleProfileSave = (profileData: any) => {
    console.log('Saving profile:', profileData);
    // Ici vous pouvez sauvegarder le profil via votre service
    setShowProfileModule(false);
    setEditingProfile(null);
  };

  const handleProfileCancel = () => {
    setShowProfileModule(false);
    setEditingProfile(null);
  };

  // Grouper les modules par type
  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.type]) {
      acc[module.type] = [];
    }
    acc[module.type].push(module);
    return acc;
  }, {} as Record<string, ModuleItem[]>);

  const moduleTypes = [
    { id: 'claim', name: 'Sinistres', icon: AlertTriangle },
    { id: 'vehicle', name: 'Véhicules', icon: Car },
    { id: 'driver', name: 'Conducteurs', icon: UserCheck },
    { id: 'contract', name: 'Contrats', icon: FileText },
    { id: 'insurance-request', name: 'Demandes d\'Assurance', icon: Shield },
    { id: 'profile', name: 'Profils', icon: User },
    { id: 'event', name: 'Événements', icon: Calendar },
    { id: 'project', name: 'Projets', icon: Briefcase }
  ];

  return (
    <div className="space-y-6">
      {/* Bouton d'ajout principal */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Modules</h2>
        <button
          onClick={() => setIsSelectorOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un module</span>
        </button>
      </div>

      {/* Liste des modules groupés */}
      {moduleTypes.map((moduleType) => {
        const typeModules = groupedModules[moduleType.id] || [];
        const IconComponent = moduleIcons[moduleType.id as keyof typeof moduleIcons];
        const colors = moduleColors[moduleType.id as keyof typeof moduleColors];

        return (
          <div key={moduleType.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* En-tête du module */}
            <div className={`px-6 py-4 border-b ${colors.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <IconComponent className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${colors.text}`}>
                      {moduleType.name} ({typeModules.length})
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => handleModuleSelect(moduleType.id)}
                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            {/* Contenu du module */}
            <div className="p-6">
              {typeModules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <IconComponent className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucun {moduleType.name.toLowerCase()} trouvé</p>
                  <button
                    onClick={() => handleModuleSelect(moduleType.id)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Créer le premier {moduleType.name.toLowerCase()}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {typeModules.map((module) => (
                    <ModuleItemCard
                      key={module.id}
                      module={module}
                      onEdit={() => onModuleEdit(module.id)}
                      onDelete={() => onModuleDelete(module.id)}
                      onLink={() => onModuleLink(module.id)}
                      onUnlink={() => onModuleUnlink(module.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Sélecteur de module */}
      <ModuleSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelectModule={handleModuleSelect}
        title="Ajouter un module"
      />

      {/* Module de profil */}
      {showProfileModule && (
        <Modal
          isOpen={showProfileModule}
          onClose={handleProfileCancel}
          title="Créer un profil"
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
    </div>
  );
}

// Composant pour afficher un élément de module
function ModuleItemCard({ 
  module, 
  onEdit, 
  onDelete, 
  onLink, 
  onUnlink 
}: { 
  module: ModuleItem; 
  onEdit: () => void; 
  onDelete: () => void; 
  onLink: () => void; 
  onUnlink: () => void; 
}) {
  const colors = moduleColors[module.type as keyof typeof moduleColors] || moduleColors.project;

  return (
    <div className={`p-4 rounded-lg border ${colors.border} ${colors.bg} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className={`font-semibold ${colors.text}`}>{module.name}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
              {module.status}
            </span>
          </div>
          
          <p className="text-gray-700 text-sm mb-2">{module.details}</p>
          
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span>📅 {module.date}</span>
            {module.cost && <span>💰 {module.cost}</span>}
            {module.insurer && <span>🏢 {module.insurer}</span>}
            {module.contractNumber && <span>📄 {module.contractNumber}</span>}
            {module.assignedTo && <span>👤 {module.assignedTo}</span>}
            {module.priority && <span>⚡ {module.priority}</span>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onLink}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Lier"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onUnlink}
            className="text-gray-400 hover:text-orange-600 transition-colors"
            title="Délier"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-green-600 transition-colors"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
