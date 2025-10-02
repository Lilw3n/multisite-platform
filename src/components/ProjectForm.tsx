'use client';

import React, { useState } from 'react';
import { Briefcase, User, Save, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: ProjectData) => void;
  editingProject?: ProjectData | null;
}

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  manager: string;
}

const mockUsers = [
  { id: 'user-1', name: 'Jean Dupont' },
  { id: 'user-2', name: 'Marie Martin' },
  { id: 'user-3', name: 'Pierre Bernard' },
  { id: 'user-4', name: 'Sophie Durand' }
];

export default function ProjectForm({
  isOpen,
  onClose,
  onSave,
  editingProject = null
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectData>({
    title: editingProject?.title || '',
    description: editingProject?.description || '',
    manager: editingProject?.manager || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Le titre est obligatoire';
    if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
    if (!formData.manager) newErrors.manager = 'Le gestionnaire est obligatoire';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: editingProject?.id || `project-${Date.now()}`
    });
    onClose();
  };

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProject ? "Modifier le projet" : "Nouveau projet"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Titre du projet"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Description du projet"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Gestionnaire */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gestionnaire *
          </label>
          <select
            value={formData.manager}
            onChange={(e) => handleInputChange('manager', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.manager ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionner un gestionnaire</option>
            {mockUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.manager && (
            <p className="mt-1 text-sm text-red-600">{errors.manager}</p>
          )}
        </div>

        {/* Aperçu */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Titre:</span>
            <span className="text-gray-600">{formData.title || 'Non défini'}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm mt-1">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Gestionnaire:</span>
            <span className="text-gray-600">
              {formData.manager ? mockUsers.find(u => u.id === formData.manager)?.name : 'Non défini'}
            </span>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <X className="w-4 h-4 mr-2 inline" />
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            {editingProject ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
