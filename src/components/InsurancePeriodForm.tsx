'use client';

import React, { useState, useEffect } from 'react';

interface InsurancePeriod {
  id: string;
  interlocutorId: string;
  vehicleId?: string;
  driverId?: string;
  insurer: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  premium: number;
  type: 'VTC' | 'Taxi' | 'Particulier' | 'Professionnel';
  status: 'Actif' | 'Expiré' | 'Résilié' | 'En attente';
  createdAt: string;
  updatedAt: string;
}

interface InsurancePeriodFormProps {
  interlocutorId: string;
  onSuccess: (period: InsurancePeriod) => void;
  onCancel: () => void;
  initialData?: Partial<InsurancePeriod>;
  isEditing?: boolean;
}

export default function InsurancePeriodForm({
  interlocutorId,
  onSuccess,
  onCancel,
  initialData,
  isEditing = false
}: InsurancePeriodFormProps) {
  const [formData, setFormData] = useState({
    insurer: '',
    policyNumber: '',
    startDate: '',
    endDate: '',
    premium: '',
    type: 'VTC' as InsurancePeriod['type'],
    status: 'Actif' as InsurancePeriod['status'],
    vehicleId: '',
    driverId: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        insurer: initialData.insurer || '',
        policyNumber: initialData.policyNumber || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        premium: initialData.premium?.toString() || '',
        type: initialData.type || 'VTC',
        status: initialData.status || 'Actif',
        vehicleId: initialData.vehicleId || '',
        driverId: initialData.driverId || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const periodData = {
        ...formData,
        premium: parseFloat(formData.premium),
        interlocutorId,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      // Simuler la sauvegarde
      const newPeriod: InsurancePeriod = {
        id: isEditing ? initialData!.id! : Date.now().toString(),
        ...periodData
      };

      onSuccess(newPeriod);
    } catch (err) {
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const typeOptions = [
    { value: 'VTC', label: 'VTC' },
    { value: 'Taxi', label: 'Taxi' },
    { value: 'Particulier', label: 'Particulier' },
    { value: 'Professionnel', label: 'Professionnel' }
  ];

  const statusOptions = [
    { value: 'Actif', label: 'Actif' },
    { value: 'Expiré', label: 'Expiré' },
    { value: 'Résilié', label: 'Résilié' },
    { value: 'En attente', label: 'En attente' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier la période d\'assurance' : 'Nouvelle période d\'assurance'}
        </h2>
        <p className="text-gray-600 mt-1">
          Saisissez les informations de la période d'assurance
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
          {/* Assureur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assureur *
            </label>
            <input
              type="text"
              name="insurer"
              value={formData.insurer}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="AXA, Groupama, Allianz..."
              required
            />
          </div>

          {/* Numéro de police */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de police *
            </label>
            <input
              type="text"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="POL-2024-001"
              required
            />
          </div>

          {/* Date de début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Date de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de fin *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Prime */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prime (€) *
            </label>
            <input
              type="number"
              name="premium"
              value={formData.premium}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Type d'assurance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'assurance *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {typeOptions.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
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
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* ID Véhicule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Véhicule
            </label>
            <input
              type="text"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optionnel"
            />
          </div>

          {/* ID Conducteur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Conducteur
            </label>
            <input
              type="text"
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optionnel"
            />
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
