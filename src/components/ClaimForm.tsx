'use client';

import React, { useState, useEffect } from 'react';
import { Claim } from '@/types/interlocutor';

interface ClaimFormProps {
  interlocutorId: string;
  onSuccess: (claim: Claim) => void;
  onCancel: () => void;
  initialData?: Partial<Claim>;
  isEditing?: boolean;
}

export default function ClaimForm({
  interlocutorId,
  onSuccess,
  onCancel,
  initialData,
  isEditing = false
}: ClaimFormProps) {
  const [formData, setFormData] = useState({
    type: 'materialRC100' as Claim['type'],
    date: '',
    amount: '',
    description: '',
    responsible: true,
    percentage: 100,
    insurer: '',
    status: 'En cours' as Claim['status'],
    vehicleId: '',
    driverId: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'materialRC100',
        date: initialData.date || '',
        amount: initialData.amount?.toString() || '',
        description: initialData.description || '',
        responsible: initialData.responsible ?? true,
        percentage: initialData.percentage || 100,
        insurer: initialData.insurer || '',
        status: initialData.status || 'En cours',
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
      const claimData = {
        ...formData,
        amount: parseFloat(formData.amount),
        percentage: parseInt(formData.percentage.toString()),
        interlocutorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simuler la sauvegarde
      const newClaim: Claim = {
        id: isEditing ? initialData!.id! : Date.now().toString(),
        ...claimData
      };

      onSuccess(newClaim);
    } catch (err) {
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const claimTypes = [
    { value: 'materialRC100', label: 'Matériel RC 100%' },
    { value: 'materialRC50', label: 'Matériel RC 50%' },
    { value: 'materialRC0', label: 'Matériel RC 0%' },
    { value: 'bodilyRC100', label: 'Corporel RC 100%' },
    { value: 'bodilyRC50', label: 'Corporel RC 50%' },
    { value: 'bodilyRC0', label: 'Corporel RC 0%' },
    { value: 'glassBreakage', label: 'Bris de glace' },
    { value: 'theft', label: 'Vol' },
    { value: 'fire', label: 'Incendie' },
    { value: 'naturalDisaster', label: 'Catastrophe naturelle' }
  ];

  const statusOptions = [
    { value: 'En cours', label: 'En cours' },
    { value: 'Résolu', label: 'Résolu' },
    { value: 'Refusé', label: 'Refusé' },
    { value: 'En attente', label: 'En attente' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier le sinistre' : 'Nouveau sinistre'}
        </h2>
        <p className="text-gray-600 mt-1">
          Saisissez les informations du sinistre
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
          {/* Type de sinistre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de sinistre *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {claimTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date du sinistre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date du sinistre *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (€) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

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
              required
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
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Responsabilité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsabilité
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="responsible"
                  checked={formData.responsible}
                  onChange={() => setFormData(prev => ({ ...prev, responsible: true }))}
                  className="mr-2"
                />
                Responsable
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="responsible"
                  checked={!formData.responsible}
                  onChange={() => setFormData(prev => ({ ...prev, responsible: false }))}
                  className="mr-2"
                />
                Non responsable
              </label>
            </div>
          </div>

          {/* Pourcentage de responsabilité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pourcentage de responsabilité (%)
            </label>
            <input
              type="number"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description du sinistre *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Décrivez les circonstances du sinistre..."
            required
          />
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
