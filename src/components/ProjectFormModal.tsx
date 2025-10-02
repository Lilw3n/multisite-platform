'use client';

import React, { useState } from 'react';

interface ProjectFormValues {
  title: string;
  description: string;
  manager: string;
}

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => Promise<void> | void;
}

export default function ProjectFormModal({ isOpen, onClose, onSubmit }: ProjectFormModalProps) {
  const [values, setValues] = useState<ProjectFormValues>({ title: '', description: '', manager: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Créer un Projet</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom du projet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez le projet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
            <input
              type="text"
              name="manager"
              value={values.manager}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom du responsable"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" disabled={isSubmitting}>Annuler</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
