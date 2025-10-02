'use client';

import React, { useState, useEffect } from 'react';
import { Interlocutor } from '@/types/interlocutor';
import { InterlocutorService } from '@/lib/interlocutors';

interface InterlocutorFormProps {
  userRole: 'admin' | 'internal' | 'external';
  onSuccess: (interlocutor: Interlocutor) => void;
  onCancel: () => void;
  initialData?: Partial<Interlocutor>;
  isEditing?: boolean;
}

export default function InterlocutorForm({
  userRole,
  onSuccess,
  onCancel,
  initialData,
  isEditing = false
}: InterlocutorFormProps) {
  const [formData, setFormData] = useState({
    type: 'user' as 'user' | 'external',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    status: 'Actif' as 'Actif' | 'Inactif' | 'En attente',
    role: 'client' as 'client' | 'prospect' | 'partenaire' | 'fournisseur'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationMessages, setValidationMessages] = useState({
    email: '',
    phone: '',
    contact: ''
  });

  useEffect(() => {
    if (initialData) {
      const newFormData = {
        type: initialData.type || 'user',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        address: initialData.address || '',
        status: initialData.status || 'Actif',
        role: initialData.role || 'client'
      };
      setFormData(newFormData);
      
      // Initialiser la validation
      const messages = validateContactFields(newFormData.email, newFormData.phone);
      setValidationMessages(messages);
    }
  }, [initialData]);

  // Initialiser la validation au chargement
  useEffect(() => {
    const messages = validateContactFields(formData.email, formData.phone);
    setValidationMessages(messages);
  }, [userRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation côté client
    const hasEmail = formData.email && formData.email.trim() !== '';
    const hasPhone = formData.phone && formData.phone.trim() !== '';
    
    if (userRole === 'external' && !hasEmail && !hasPhone) {
      setError('En mode externe, vous devez fournir au moins un email ou un téléphone.');
      setIsLoading(false);
      return;
    }

    try {
      let result;
      
      if (isEditing && initialData?.id) {
        result = await InterlocutorService.updateInterlocutor(initialData.id, formData);
      } else {
        result = await InterlocutorService.createInterlocutor(formData, userRole);
      }

      if (result.success && result.interlocutor) {
        onSuccess(result.interlocutor);
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de validation des champs de contact
  const validateContactFields = (email: string, phone: string) => {
    const hasEmail = email && email.trim() !== '';
    const hasPhone = phone && phone.trim() !== '';
    
    const messages = {
      email: '',
      phone: '',
      contact: ''
    };

    if (userRole === 'external') {
      // Pour les externes, au moins un contact est requis
      if (!hasEmail && !hasPhone) {
        messages.contact = 'En mode externe, vous devez fournir au moins un email ou un téléphone.';
      }
    }

    // Messages d'aide selon la priorité
    if (hasEmail && hasPhone) {
      messages.email = 'Email prioritaire pour l\'identification';
      messages.phone = 'Téléphone en complément';
    } else if (hasEmail) {
      messages.email = 'Email utilisé comme identifiant principal';
      messages.phone = 'Téléphone optionnel';
    } else if (hasPhone) {
      messages.phone = 'Téléphone utilisé comme identifiant principal';
      messages.email = 'Email optionnel';
    } else {
      messages.email = 'Email optionnel (prioritaire si fourni)';
      messages.phone = 'Téléphone optionnel';
    }

    return messages;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
    // Validation en temps réel pour les champs de contact
    if (name === 'email' || name === 'phone') {
      const messages = validateContactFields(
        name === 'email' ? value : newFormData.email,
        name === 'phone' ? value : newFormData.phone
      );
      setValidationMessages(messages);
    }
  };

  const isExternalUser = userRole === 'external';
  const canEditType = !isExternalUser && !isEditing;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier l\'interlocuteur' : 'Créer un nouvel interlocuteur'}
        </h2>
        <p className="text-gray-600 mt-1">
          {isExternalUser 
            ? 'En mode externe, vous ne pouvez créer qu\'un seul interlocuteur avec un email ou téléphone unique.'
            : 'Remplissez les informations de l\'interlocuteur'
          }
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500">❌</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isExternalUser && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-500">ℹ️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Mode externe :</strong> Vous devez fournir au moins un email ou un téléphone. 
                L'email est prioritaire si les deux sont fournis. Vous ne pouvez créer qu'un seul interlocuteur.
              </p>
            </div>
          </div>
        </div>
      )}

      {validationMessages.contact && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500">❌</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {validationMessages.contact}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type d'interlocuteur */}
          {canEditType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'interlocuteur
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="user">👤 Utilisateur interne</option>
                <option value="external">🌐 Interlocuteur externe</option>
              </select>
            </div>
          )}

          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email {formData.email && formData.phone ? '(prioritaire)' : formData.email ? '(principal)' : ''}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {validationMessages.email && (
              <p className={`text-xs mt-1 ${
                validationMessages.email.includes('prioritaire') || validationMessages.email.includes('principal') 
                  ? 'text-blue-600' 
                  : 'text-gray-500'
              }`}>
                {validationMessages.email}
              </p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone {!formData.email && formData.phone ? '(principal)' : formData.phone ? '(complément)' : ''}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {validationMessages.phone && (
              <p className={`text-xs mt-1 ${
                validationMessages.phone.includes('principal') 
                  ? 'text-blue-600' 
                  : 'text-gray-500'
              }`}>
                {validationMessages.phone}
              </p>
            )}
          </div>

          {/* Entreprise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entreprise
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Actif">✅ Actif</option>
              <option value="Inactif">❌ Inactif</option>
              <option value="En attente">⏳ En attente</option>
            </select>
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="client">👤 Client</option>
              <option value="prospect">🔍 Prospect</option>
              <option value="partenaire">🤝 Partenaire</option>
              <option value="fournisseur">📦 Fournisseur</option>
            </select>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sauvegarde...' : (isEditing ? 'Modifier' : 'Créer')}
          </button>
        </div>
      </form>
    </div>
  );
}
