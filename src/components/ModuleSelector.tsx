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
  CreditCard,
  UserCheck,
  Building,
  FileCheck,
  Briefcase,
  Package,
  Folder
} from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface ModuleOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  category: 'insurance' | 'vehicle' | 'person' | 'document' | 'project';
}

const moduleOptions: ModuleOption[] = [
  // Assurance
  {
    id: 'claim',
    name: 'Sinistre',
    description: 'Déclarer un nouveau sinistre',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    category: 'insurance'
  },
  {
    id: 'contract',
    name: 'Contrat',
    description: 'Créer un nouveau contrat d\'assurance',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    category: 'insurance'
  },
  {
    id: 'quote',
    name: 'Devis',
    description: 'Établir un nouveau devis',
    icon: FileCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    category: 'insurance'
  },
  {
    id: 'insurance-request',
    name: 'Demande d\'Assurance',
    description: 'Nouvelle demande d\'assurance',
    icon: Shield,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    category: 'insurance'
  },
  
  // Véhicules
  {
    id: 'vehicle',
    name: 'Véhicule',
    description: 'Ajouter un véhicule',
    icon: Car,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    category: 'vehicle'
  },
  {
    id: 'driver',
    name: 'Conducteur',
    description: 'Ajouter un conducteur',
    icon: UserCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    category: 'vehicle'
  },
  
  // Personnes
  {
    id: 'profile',
    name: 'Profil',
    description: 'Créer un profil détaillé',
    icon: User,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    category: 'person'
  },
  
  // Documents & Projets
  {
    id: 'event',
    name: 'Événement',
    description: 'Enregistrer un événement',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    category: 'document'
  },
  {
    id: 'project',
    name: 'Projet',
    description: 'Créer un nouveau projet',
    icon: Briefcase,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    category: 'project'
  },
  {
    id: 'product',
    name: 'Produit',
    description: 'Créer un nouveau produit/service',
    icon: Package,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    category: 'project'
  },
  {
    id: 'folder',
    name: 'Dossier',
    description: 'Créer un nouveau dossier pour organiser les modules',
    icon: Folder,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    category: 'project'
  }
];

interface ModuleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (moduleType: string) => void;
  title?: string;
}

export default function ModuleSelector({ 
  isOpen, 
  onClose, 
  onSelectModule, 
  title = "Ajouter un module" 
}: ModuleSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Tous', icon: Plus },
    { id: 'insurance', name: 'Assurance', icon: Shield },
    { id: 'vehicle', name: 'Véhicules', icon: Car },
    { id: 'person', name: 'Personnes', icon: User },
    { id: 'document', name: 'Documents', icon: FileText },
    { id: 'project', name: 'Projets', icon: Briefcase }
  ];

  const filteredModules = moduleOptions.filter(module => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleModuleSelect = (moduleId: string) => {
    console.log('ModuleSelector: handleModuleSelect appelé avec:', moduleId);
    onSelectModule(moduleId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      enableKeyboard={true}
    >
      <div className="space-y-6">
        {/* Recherche */}
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un module..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Catégories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Liste des modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {filteredModules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleSelect(module.id)}
              className={`p-4 rounded-lg border-2 border-transparent hover:border-blue-300 transition-all text-left group ${module.bgColor}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${module.bgColor}`}>
                  <module.icon className={`w-6 h-6 ${module.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-semibold ${module.color} group-hover:text-blue-700`}>
                    {module.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {module.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Message si aucun module trouvé */}
        {filteredModules.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun module trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {/* Statistiques */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{filteredModules.length} module(s) disponible(s)</span>
            <span>
              {selectedCategory === 'all' 
                ? 'Toutes catégories' 
                : categories.find(c => c.id === selectedCategory)?.name
              }
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Hook pour utiliser le sélecteur de module
export const useModuleSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const openSelector = () => setIsOpen(true);
  const closeSelector = () => setIsOpen(false);
  
  const handleModuleSelect = (moduleType: string) => {
    setSelectedModule(moduleType);
  };

  return {
    isOpen,
    selectedModule,
    openSelector,
    closeSelector,
    handleModuleSelect
  };
};
