'use client';

import { useState, useEffect } from 'react';

interface Claim {
  id: string;
  date: string;
  type: 'materialRC100' | 'materialRC50' | 'materialRC0' | 'bodilyRC100' | 'bodilyRC50' | 'bodilyRC0' | 'glassBreakage' | 'theft';
  description: string;
  amount: number;
  responsibility: number;
  insurer: string;
  crmCoefficient: number;
  crmUpdateDate: string;
  countedInCalculation: boolean;
  driverType: 'Particulier' | 'Taxi' | 'VTC';
}

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (claim: Omit<Claim, 'id'>) => void;
  claim?: Claim | null;
  mode: 'add' | 'edit';
}

export default function ClaimModal({ isOpen, onClose, onSave, claim, mode }: ClaimModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    type: 'materialRC100' as Claim['type'],
    description: '',
    amount: 0,
    responsibility: 100,
    insurer: '',
    countedInCalculation: true,
    driverType: 'VTC' as Claim['driverType']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && claim) {
      setFormData({
        date: claim.date,
        type: claim.type,
        description: claim.description,
        amount: claim.amount,
        responsibility: claim.responsibility,
        insurer: claim.insurer,
        countedInCalculation: claim.countedInCalculation,
        driverType: claim.driverType
      });
    } else {
      setFormData({
        date: '',
        type: 'materialRC100',
        description: '',
        amount: 0,
        responsibility: 100,
        insurer: '',
        countedInCalculation: true,
        driverType: 'VTC'
      });
    }
    setErrors({});
  }, [mode, claim, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'La date est obligatoire';
    if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
    if (formData.amount <= 0) newErrors.amount = 'Le montant doit être positif';
    if (formData.responsibility < 0 || formData.responsibility > 100) {
      newErrors.responsibility = 'La responsabilité doit être entre 0 et 100%';
    }
    if (!formData.insurer.trim()) newErrors.insurer = 'L\'assureur est obligatoire';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Calculer le coefficient CRM automatiquement
    const crmCoefficient = calculateCRM(formData.type, formData.responsibility, formData.driverType);
    
    const claimData: Omit<Claim, 'id'> = {
      ...formData,
      crmCoefficient,
      crmUpdateDate: new Date().toLocaleDateString('fr-FR')
    };

    onSave(claimData);
    onClose();
  };

  const calculateCRM = (type: Claim['type'], responsibility: number, driverType: Claim['driverType']) => {
    if (driverType === 'VTC') {
      if (responsibility === 0) return 1.0; // Pas de multiplicateur
      if (responsibility === 50) return 1.125; // x1.125 pour 50%
      if (responsibility === 100) return 1.25; // x1.25 pour 100%
    }
    return 1.0; // Valeur par défaut
  };

  const getClaimTypeLabel = (type: Claim['type']) => {
    const labels = {
      materialRC100: 'Matériel RC 100%',
      materialRC50: 'Matériel RC 50%',
      materialRC0: 'Matériel RC 0%',
      bodilyRC100: 'Corporel RC 100%',
      bodilyRC50: 'Corporel RC 50%',
      bodilyRC0: 'Corporel RC 0%',
      glassBreakage: 'Bris de Glace',
      theft: 'Vol'
    };
    return labels[type];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'add' ? '➕ Ajouter un sinistre' : '✏️ Modifier le sinistre'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date du sinistre *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          {/* Type de sinistre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de sinistre *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Claim['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="materialRC100">Matériel RC 100%</option>
              <option value="materialRC50">Matériel RC 50%</option>
              <option value="materialRC0">Matériel RC 0%</option>
              <option value="bodilyRC100">Corporel RC 100%</option>
              <option value="bodilyRC50">Corporel RC 50%</option>
              <option value="bodilyRC0">Corporel RC 0%</option>
              <option value="glassBreakage">Bris de Glace</option>
              <option value="theft">Vol</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Décrivez les circonstances du sinistre..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Montant et Responsabilité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant (€) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                step="0.01"
              />
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsabilité (%) *
              </label>
              <select
                value={formData.responsibility}
                onChange={(e) => setFormData({ ...formData, responsibility: Number(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.responsibility ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={0}>0% (Non responsable)</option>
                <option value={50}>50% (Partiellement responsable)</option>
                <option value={100}>100% (Entièrement responsable)</option>
              </select>
              {errors.responsibility && <p className="mt-1 text-sm text-red-600">{errors.responsibility}</p>}
            </div>
          </div>

          {/* Assureur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assureur *
            </label>
            <input
              type="text"
              value={formData.insurer}
              onChange={(e) => setFormData({ ...formData, insurer: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.insurer ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nom de la compagnie d'assurance"
            />
            {errors.insurer && <p className="mt-1 text-sm text-red-600">{errors.insurer}</p>}
          </div>

          {/* Type de conducteur et Comptabilisation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de conducteur
              </label>
              <select
                value={formData.driverType}
                onChange={(e) => setFormData({ ...formData, driverType: e.target.value as Claim['driverType'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="VTC">VTC</option>
                <option value="Taxi">Taxi</option>
                <option value="Particulier">Particulier</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="countedInCalculation"
                checked={formData.countedInCalculation}
                onChange={(e) => setFormData({ ...formData, countedInCalculation: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="countedInCalculation" className="text-sm font-medium text-gray-700">
                Comptabilisé dans le calcul CRM
              </label>
            </div>
          </div>

          {/* Aperçu du coefficient CRM */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu du coefficient CRM</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {getClaimTypeLabel(formData.type)} - {formData.responsibility}% responsable
              </span>
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                calculateCRM(formData.type, formData.responsibility, formData.driverType) > 1 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                x{calculateCRM(formData.type, formData.responsibility, formData.driverType)}
              </span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {mode === 'add' ? 'Ajouter' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
