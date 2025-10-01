'use client';

import { useState } from 'react';
import { Family } from '@/types';

interface FamilyFormProps {
  interlocutorId: string;
  onSuccess: (family: Family) => void;
  onCancel: () => void;
  initialData?: Partial<Family>;
}

export default function FamilyForm({ interlocutorId, onSuccess, onCancel, initialData }: FamilyFormProps) {
  const [formData, setFormData] = useState({
    spouse: {
      firstName: initialData?.spouse?.firstName || '',
      lastName: initialData?.spouse?.lastName || '',
      email: initialData?.spouse?.email || '',
      phone: initialData?.spouse?.phone || '',
      birthDate: initialData?.spouse?.birthDate ? initialData.spouse.birthDate.toISOString().split('T')[0] : '',
      profession: initialData?.spouse?.profession || '',
    },
    children: initialData?.children || [],
    emergencyContact: {
      firstName: initialData?.emergencyContact?.firstName || '',
      lastName: initialData?.emergencyContact?.lastName || '',
      relationship: initialData?.emergencyContact?.relationship || '',
      phone: initialData?.emergencyContact?.phone || '',
      email: initialData?.emergencyContact?.email || '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation contact d'urgence
    if (!formData.emergencyContact.firstName.trim()) {
      newErrors.emergencyContact_firstName = 'Le prénom du contact d\'urgence est requis';
    }
    if (!formData.emergencyContact.lastName.trim()) {
      newErrors.emergencyContact_lastName = 'Le nom du contact d\'urgence est requis';
    }
    if (!formData.emergencyContact.phone.trim()) {
      newErrors.emergencyContact_phone = 'Le téléphone du contact d\'urgence est requis';
    }

    // Validation email si fourni
    if (formData.emergencyContact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emergencyContact.email)) {
      newErrors.emergencyContact_email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const family: Family = {
      id: initialData?.id || `family_${Date.now()}`,
      interlocutorId,
      spouse: formData.spouse.firstName.trim() ? {
        firstName: formData.spouse.firstName.trim(),
        lastName: formData.spouse.lastName.trim(),
        email: formData.spouse.email.trim() || undefined,
        phone: formData.spouse.phone.trim() || undefined,
        birthDate: formData.spouse.birthDate ? new Date(formData.spouse.birthDate) : undefined,
        profession: formData.spouse.profession.trim() || undefined,
      } : undefined,
      children: formData.children,
      emergencyContact: {
        firstName: formData.emergencyContact.firstName.trim(),
        lastName: formData.emergencyContact.lastName.trim(),
        relationship: formData.emergencyContact.relationship.trim(),
        phone: formData.emergencyContact.phone.trim(),
        email: formData.emergencyContact.email.trim() || undefined,
      },
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSuccess(family);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('_');
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, {
        firstName: '',
        lastName: '',
        birthDate: new Date(),
        relationship: 'child' as const,
      }]
    }));
  };

  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const updateChild = (index: number, field: string, value: string | Date) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              👨‍👩‍👧‍👦 {initialData ? 'Modifier la famille' : 'Ajouter des informations familiales'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Conjoint(e) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conjoint(e)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="spouse_firstName"
                    value={formData.spouse.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Marie"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="spouse_lastName"
                    value={formData.spouse.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="spouse_email"
                    value={formData.spouse.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="marie.dupont@email.fr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="spouse_phone"
                    value={formData.spouse.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="spouse_birthDate"
                    value={formData.spouse.birthDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profession
                  </label>
                  <input
                    type="text"
                    name="spouse_profession"
                    value={formData.spouse.profession}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enseignante"
                  />
                </div>
              </div>
            </div>

            {/* Enfants */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Enfants</h3>
                <button
                  type="button"
                  onClick={addChild}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  + Ajouter un enfant
                </button>
              </div>

              {formData.children.map((child, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Enfant {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeChild(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={child.firstName}
                        onChange={(e) => updateChild(index, 'firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Jean"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={child.lastName}
                        onChange={(e) => updateChild(index, 'lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Dupont"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de naissance
                      </label>
                      <input
                        type="date"
                        value={child.birthDate.toISOString().split('T')[0]}
                        onChange={(e) => updateChild(index, 'birthDate', new Date(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lien de parenté
                      </label>
                      <select
                        value={child.relationship}
                        onChange={(e) => updateChild(index, 'relationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="child">Enfant</option>
                        <option value="stepchild">Beau-enfant</option>
                        <option value="adopted">Enfant adopté</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {formData.children.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Aucun enfant ajouté. Cliquez sur "Ajouter un enfant" pour commencer.
                </p>
              )}
            </div>

            {/* Contact d'urgence */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Contact d'urgence *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact_firstName"
                    value={formData.emergencyContact.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergencyContact_firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Pierre"
                  />
                  {errors.emergencyContact_firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.emergencyContact_firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact_lastName"
                    value={formData.emergencyContact.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergencyContact_lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Martin"
                  />
                  {errors.emergencyContact_lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.emergencyContact_lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien de parenté *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact_relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Frère, Sœur, Parent, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact_phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergencyContact_phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="06 12 34 56 78"
                  />
                  {errors.emergencyContact_phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.emergencyContact_phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="emergencyContact_email"
                    value={formData.emergencyContact.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergencyContact_email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="pierre.martin@email.fr"
                  />
                  {errors.emergencyContact_email && (
                    <p className="text-red-500 text-xs mt-1">{errors.emergencyContact_email}</p>
                  )}
                </div>
              </div>
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
                {initialData ? 'Modifier' : 'Ajouter'} les informations familiales
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
