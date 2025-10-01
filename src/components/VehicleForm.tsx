'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle } from '@/types/interlocutor';

interface VehicleFormProps {
  interlocutorId: string;
  onSuccess: (vehicle: Vehicle) => void;
  onCancel: () => void;
  initialData?: Partial<Vehicle>;
  isEditing?: boolean;
}

export default function VehicleForm({
  interlocutorId,
  onSuccess,
  onCancel,
  initialData,
  isEditing = false
}: VehicleFormProps) {
  const [formData, setFormData] = useState({
    registration: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Voiture particulière' as Vehicle['type'],
    status: 'Assuré' as Vehicle['status']
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        registration: initialData.registration || '',
        brand: initialData.brand || '',
        model: initialData.model || '',
        year: initialData.year || new Date().getFullYear(),
        type: initialData.type || 'Voiture particulière',
        status: initialData.status || 'Assuré'
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const vehicleData = {
        ...formData,
        interlocutorId,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      // Simuler la sauvegarde
      const newVehicle: Vehicle = {
        id: isEditing ? initialData!.id! : Date.now().toString(),
        ...vehicleData
      };

      onSuccess(newVehicle);
    } catch (err) {
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const vehicleTypes = [
    { value: 'Voiture particulière', label: 'Voiture particulière' },
    { value: 'Véhicule utilitaire', label: 'Véhicule utilitaire' },
    { value: 'Moto', label: 'Moto' },
    { value: 'Camion', label: 'Camion' },
    { value: 'Autre', label: 'Autre' }
  ];

  const statusOptions = [
    { value: 'Assuré', label: 'Assuré' },
    { value: 'En attente', label: 'En attente' },
    { value: 'Expiré', label: 'Expiré' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier le véhicule' : 'Nouveau véhicule'}
        </h2>
        <p className="text-gray-600 mt-1">
          Saisissez les informations du véhicule
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
          {/* Immatriculation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Immatriculation *
            </label>
            <input
              type="text"
              name="registration"
              value={formData.registration}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="AB-123-CD"
              required
            />
          </div>

          {/* Marque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marque *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Peugeot, Renault, BMW..."
              required
            />
          </div>

          {/* Modèle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modèle *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="308, Clio, X3..."
              required
            />
          </div>

          {/* Année */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année *
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Type de véhicule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de véhicule *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {vehicleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut d'assurance
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
