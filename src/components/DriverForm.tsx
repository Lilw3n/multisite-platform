'use client';

import React, { useState, useEffect } from 'react';
import { Driver } from '@/types/interlocutor';

interface DriverFormProps {
  interlocutorId: string;
  onSuccess: (driver: Driver) => void;
  onCancel: () => void;
  initialData?: Partial<Driver>;
  isEditing?: boolean;
}

export default function DriverForm({
  interlocutorId,
  onSuccess,
  onCancel,
  initialData,
  isEditing = false
}: DriverFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    licenseNumber: '',
    licenseType: 'B',
    status: 'Actif' as Driver['status']
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        licenseNumber: initialData.licenseNumber || '',
        licenseType: initialData.licenseType || 'B',
        status: initialData.status || 'Actif'
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const driverData = {
        ...formData,
        interlocutorId,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      // Simuler la sauvegarde
      const newDriver: Driver = {
        id: isEditing ? initialData!.id! : Date.now().toString(),
        ...driverData
      };

      onSuccess(newDriver);
    } catch (err) {
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const licenseTypes = [
    { value: 'A', label: 'A - Moto' },
    { value: 'A1', label: 'A1 - Moto légère' },
    { value: 'A2', label: 'A2 - Moto moyenne' },
    { value: 'B', label: 'B - Voiture' },
    { value: 'B1', label: 'B1 - Quadricycle lourd' },
    { value: 'C', label: 'C - Poids lourd' },
    { value: 'C1', label: 'C1 - Poids lourd léger' },
    { value: 'D', label: 'D - Transport en commun' },
    { value: 'D1', label: 'D1 - Transport en commun léger' },
    { value: 'BE', label: 'BE - Remorque' },
    { value: 'C1E', label: 'C1E - Poids lourd + remorque' },
    { value: 'CE', label: 'CE - Poids lourd + remorque' },
    { value: 'D1E', label: 'D1E - Transport en commun + remorque' },
    { value: 'DE', label: 'DE - Transport en commun + remorque' }
  ];

  const statusOptions = [
    { value: 'Actif', label: 'Actif' },
    { value: 'En attente', label: 'En attente' },
    { value: 'Expiré', label: 'Expiré' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier le conducteur' : 'Nouveau conducteur'}
        </h2>
        <p className="text-gray-600 mt-1">
          Saisissez les informations du conducteur
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              placeholder="Jean"
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
              placeholder="Dupont"
              required
            />
          </div>

          {/* Numéro de permis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de permis *
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123456789"
              required
            />
          </div>

          {/* Type de permis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de permis *
            </label>
            <select
              name="licenseType"
              value={formData.licenseType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {licenseTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
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
