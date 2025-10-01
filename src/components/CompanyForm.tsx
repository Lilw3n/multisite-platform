'use client';

import { useState } from 'react';
import { Company } from '@/types';

interface CompanyFormProps {
  interlocutorId: string;
  onSuccess: (company: Company) => void;
  onCancel: () => void;
  initialData?: Partial<Company>;
}

export default function CompanyForm({ interlocutorId, onSuccess, onCancel, initialData }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    siret: initialData?.siret || '',
    vatNumber: initialData?.vatNumber || '',
    legalForm: initialData?.legalForm || 'SARL',
    capital: initialData?.capital || 0,
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    activity: initialData?.activity || '',
    employees: initialData?.employees || 0,
    foundedDate: initialData?.foundedDate ? initialData.foundedDate.toISOString().split('T')[0] : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom de l\'entreprise est requis';
    if (!formData.siret.trim()) newErrors.siret = 'Le SIRET est requis';
    if (!formData.vatNumber.trim()) newErrors.vatNumber = 'Le numéro de TVA est requis';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.activity.trim()) newErrors.activity = 'L\'activité est requise';

    // Validation SIRET (14 chiffres)
    if (formData.siret && !/^\d{14}$/.test(formData.siret.replace(/\s/g, ''))) {
      newErrors.siret = 'Le SIRET doit contenir 14 chiffres';
    }

    // Validation email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const company: Company = {
      id: initialData?.id || `company_${Date.now()}`,
      interlocutorId,
      name: formData.name.trim(),
      siret: formData.siret.replace(/\s/g, ''),
      vatNumber: formData.vatNumber.trim(),
      legalForm: formData.legalForm,
      capital: formData.capital,
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      website: formData.website.trim() || undefined,
      activity: formData.activity.trim(),
      employees: formData.employees,
      foundedDate: new Date(formData.foundedDate),
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSuccess(company);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capital' || name === 'employees' ? Number(value) : value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🏢 {initialData ? 'Modifier l\'entreprise' : 'Ajouter une entreprise'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Martin Transport SARL"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forme juridique *
                </label>
                <select
                  name="legalForm"
                  value={formData.legalForm}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SARL">SARL</option>
                  <option value="SAS">SAS</option>
                  <option value="EURL">EURL</option>
                  <option value="SASU">SASU</option>
                  <option value="SA">SA</option>
                  <option value="SNC">SNC</option>
                  <option value="SCI">SCI</option>
                  <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                </select>
              </div>
            </div>

            {/* Identifiants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SIRET *
                </label>
                <input
                  type="text"
                  name="siret"
                  value={formData.siret}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.siret ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="12345678901234"
                />
                {errors.siret && <p className="text-red-500 text-xs mt-1">{errors.siret}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de TVA *
                </label>
                <input
                  type="text"
                  name="vatNumber"
                  value={formData.vatNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vatNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="FR12345678901"
                />
                {errors.vatNumber && <p className="text-red-500 text-xs mt-1">{errors.vatNumber}</p>}
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="01 23 45 67 89"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="contact@entreprise.fr"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123 Rue de la Logistique, 75001 Paris"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Activité et effectifs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activité *
                </label>
                <input
                  type="text"
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.activity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Transport de marchandises"
                />
                {errors.activity && <p className="text-red-500 text-xs mt-1">{errors.activity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre d'employés
                </label>
                <input
                  type="number"
                  name="employees"
                  value={formData.employees}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Capital et date de création */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capital social (€)
                </label>
                <input
                  type="number"
                  name="capital"
                  value={formData.capital}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de création
                </label>
                <input
                  type="date"
                  name="foundedDate"
                  value={formData.foundedDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Site web */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site web
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.entreprise.fr"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {initialData ? 'Modifier' : 'Ajouter'} l'entreprise
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
