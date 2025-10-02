'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Building } from 'lucide-react';
import { InterlocutorService } from '@/lib/interlocutors';
import { Interlocutor } from '@/types/interlocutor';
import InterlocutorForm from './InterlocutorForm';

interface InterlocutorSelectorProps {
  selectedInterlocutor?: Interlocutor | null;
  onSelect: (interlocutor: Interlocutor) => void;
  onClear?: () => void;
  placeholder?: string;
  required?: boolean;
  userRole?: 'admin' | 'internal' | 'external';
}

export default function InterlocutorSelector({
  selectedInterlocutor,
  onSelect,
  onClear,
  placeholder = "Rechercher ou créer un interlocuteur...",
  required = false,
  userRole = 'admin'
}: InterlocutorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [interlocutors, setInterlocutors] = useState<Interlocutor[]>([]);
  const [filteredInterlocutors, setFilteredInterlocutors] = useState<Interlocutor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Charger les interlocuteurs au montage
  useEffect(() => {
    loadInterlocutors();
  }, []);

  // Filtrer les interlocuteurs selon le terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInterlocutors(interlocutors);
    } else {
      const filtered = interlocutors.filter(interlocutor =>
        interlocutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interlocutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interlocutor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (interlocutor.company && interlocutor.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredInterlocutors(filtered);
    }
  }, [searchTerm, interlocutors]);

  const loadInterlocutors = async () => {
    setIsLoading(true);
    try {
      const data = await InterlocutorService.getAllInterlocutors();
      setInterlocutors(data.filter(i => i.status === 'Actif'));
    } catch (error) {
      console.error('Erreur lors du chargement des interlocuteurs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (interlocutor: Interlocutor) => {
    onSelect(interlocutor);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    setSearchTerm('');
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
    setIsOpen(false);
  };

  const handleCreateSuccess = (newInterlocutor: any) => {
    // Convertir le format du nouvel interlocuteur vers le format attendu
    const formattedInterlocutor: Interlocutor = {
      id: newInterlocutor.id,
      name: `${newInterlocutor.firstName} ${newInterlocutor.lastName}`,
      email: newInterlocutor.email,
      phone: newInterlocutor.phone,
      company: newInterlocutor.company,
      contactPerson: `${newInterlocutor.firstName} ${newInterlocutor.lastName}`,
      status: newInterlocutor.status === 'Actif' ? 'active' : 'inactive',
      type: newInterlocutor.role
    };
    
    setInterlocutors(prev => [...prev, formattedInterlocutor]);
    onSelect(formattedInterlocutor);
    setShowCreateForm(false);
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
  };

  const getInterlocutorIcon = (type: string) => {
    switch (type) {
      case 'client':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'prospect':
        return <Search className="h-4 w-4 text-yellow-500" />;
      case 'partenaire':
        return <Building className="h-4 w-4 text-green-500" />;
      case 'fournisseur':
        return <Building className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'client': return 'Client';
      case 'prospect': return 'Prospect';
      case 'partenaire': return 'Partenaire';
      case 'fournisseur': return 'Fournisseur';
      default: return type;
    }
  };

  return (
    <div className="relative">
      {/* Champ de sélection */}
      <div className="relative">
        <div
          className={`w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
            selectedInterlocutor ? 'bg-blue-50' : 'bg-white'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedInterlocutor ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getInterlocutorIcon(selectedInterlocutor.type)}
                <div>
                  <div className="font-medium text-gray-900">{selectedInterlocutor.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedInterlocutor.email} • {getTypeLabel(selectedInterlocutor.type)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {onClear && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">{placeholder}</span>
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Barre de recherche */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, email, entreprise..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Bouton créer nouveau */}
          <div className="p-2 border-b border-gray-200">
            <button
              type="button"
              onClick={handleCreateNew}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 rounded-md"
            >
              <Plus className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">
                Créer un nouvel interlocuteur
                {searchTerm && ` "${searchTerm}"`}
              </span>
            </button>
          </div>

          {/* Liste des interlocuteurs */}
          <div className="max-h-40 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                <span className="text-sm mt-2">Chargement...</span>
              </div>
            ) : filteredInterlocutors.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                <span className="text-sm">
                  {searchTerm ? 'Aucun interlocuteur trouvé' : 'Aucun interlocuteur disponible'}
                </span>
              </div>
            ) : (
              filteredInterlocutors.map((interlocutor) => (
                <button
                  key={interlocutor.id}
                  type="button"
                  onClick={() => handleSelect(interlocutor)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50"
                >
                  {getInterlocutorIcon(interlocutor.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {interlocutor.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {interlocutor.email}
                      {interlocutor.company && ` • ${interlocutor.company}`}
                    </div>
                    <div className="text-xs text-gray-400">
                      {getTypeLabel(interlocutor.type)}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal de création */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <InterlocutorForm
              userRole={userRole}
              onSuccess={handleCreateSuccess}
              onCancel={handleCreateCancel}
              initialData={searchTerm ? { 
                firstName: searchTerm.split(' ')[0] || '',
                lastName: searchTerm.split(' ').slice(1).join(' ') || ''
              } : undefined}
            />
          </div>
        </div>
      )}

      {/* Clic à l'extérieur pour fermer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
