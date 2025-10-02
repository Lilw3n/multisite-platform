'use client';

import React, { useState } from 'react';
import { 
  Car, 
  User, 
  FileText, 
  CheckCircle, 
  XCircle,
  Save,
  X
} from 'lucide-react';
import { VehicleTechnicalData } from '@/types/vehicle';

interface VehicleModuleFormProps {
  vehicle?: Partial<VehicleTechnicalData>;
  onSave: (vehicle: VehicleTechnicalData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function VehicleModuleForm({ 
  vehicle, 
  onSave, 
  onCancel, 
  isEditing = false 
}: VehicleModuleFormProps) {
  const [formData, setFormData] = useState<Partial<VehicleTechnicalData>>({
    // Données de base
    id: vehicle?.id || '',
    registration: vehicle?.registration || '',
    registrationType: vehicle?.registrationType || 'french',
    registrationCountry: vehicle?.registrationCountry || 'France',
    
    // Identification véhicule
    vin: vehicle?.vin || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    version: vehicle?.version || '',
    finish: vehicle?.finish || '',
    
    // Données techniques
    enginePower: vehicle?.enginePower || 0,
    enginePowerKw: vehicle?.enginePowerKw || 0,
    engineCapacity: vehicle?.engineCapacity || 0,
    fuelType: vehicle?.fuelType || 'essence',
    transmission: vehicle?.transmission || 'manual',
    seats: vehicle?.seats || 5,
    doors: vehicle?.doors || 5,
    weight: vehicle?.weight || 0,
    maxWeight: vehicle?.maxWeight || 0,
    
    // Dates importantes
    firstRegistrationDate: vehicle?.firstRegistrationDate || '',
    circulationDate: vehicle?.circulationDate || '',
    lastTechnicalControl: vehicle?.lastTechnicalControl || '',
    nextTechnicalControl: vehicle?.nextTechnicalControl || '',
    
    // Données économiques
    purchasePrice: vehicle?.purchasePrice || 0,
    currentArgusValue: vehicle?.currentArgusValue || 0,
    mileage: vehicle?.mileage || 0,
    estimatedValue: vehicle?.estimatedValue || 0,
    
    // Codes spécialisés assurance
    sraGroup: vehicle?.sraGroup || '',
    sraClass: vehicle?.sraClass || '',
    gtaCode: vehicle?.gtaCode || '',
    
    // Propriété et usage
    ownershipStatus: vehicle?.ownershipStatus || 'owned',
    ownerName: vehicle?.ownerName || '',
    ownerSiret: vehicle?.ownerSiret || '',
    usage: vehicle?.usage || 'personal',
    
    // Propriétaires du véhicule
    proprietaire1: vehicle?.proprietaire1 || '',
    proprietaire2: vehicle?.proprietaire2 || '',
    
    // Documents et cartes grises
    documents: {
      bonCommande: vehicle?.documents?.bonCommande || false,
      contratLocation: vehicle?.documents?.contratLocation || false,
      carteGriseEtrangere: vehicle?.documents?.carteGriseEtrangere || false,
      carteGriseProvisoire: vehicle?.documents?.carteGriseProvisoire || false,
      carteGriseDefinitive: vehicle?.documents?.carteGriseDefinitive || false,
    },
    
    // Vérifications
    registrationCardOwner: vehicle?.registrationCardOwner || '',
    ownershipVerified: vehicle?.ownershipVerified || false,
    ownershipAlerts: vehicle?.ownershipAlerts || [],
    
    // Métadonnées
    createdAt: vehicle?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: vehicle?.source || 'manual'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentChange = (documentType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents!,
        [documentType]: checked
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as VehicleTechnicalData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isEditing ? 'Modifier le véhicule' : 'Nouveau véhicule'}
              </h2>
              <p className="text-blue-100">
                {formData.brand} {formData.model} - {formData.registration}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder</span>
            </button>
            <button
              onClick={onCancel}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Annuler</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Informations de base
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Immatriculation *</label>
                <input
                  type="text"
                  value={formData.registration}
                  onChange={(e) => handleInputChange('registration', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'immatriculation</label>
                <select
                  value={formData.registrationType}
                  onChange={(e) => handleInputChange('registrationType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="french">Française</option>
                  <option value="foreign">Étrangère</option>
                  <option value="temporary">Provisoire (WW)</option>
                  <option value="diplomatic">Diplomatique</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marque *</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modèle *</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Finition</label>
                <input
                  type="text"
                  value={formData.finish}
                  onChange={(e) => handleInputChange('finish', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Propriétaires du véhicule */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Propriétaires du véhicule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Propriétaire du véhicule 1</label>
                <input
                  type="text"
                  value={formData.proprietaire1}
                  onChange={(e) => handleInputChange('proprietaire1', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom du premier propriétaire"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Propriétaire du véhicule 2</label>
                <input
                  type="text"
                  value={formData.proprietaire2}
                  onChange={(e) => handleInputChange('proprietaire2', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom du second propriétaire"
                />
              </div>
            </div>
          </div>

          {/* Documents et cartes grises */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Documents et cartes grises
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="bonCommande"
                    checked={formData.documents?.bonCommande || false}
                    onChange={(e) => handleDocumentChange('bonCommande', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="bonCommande" className="text-sm font-medium text-gray-700">
                    Bon de commande
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="contratLocation"
                    checked={formData.documents?.contratLocation || false}
                    onChange={(e) => handleDocumentChange('contratLocation', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="contratLocation" className="text-sm font-medium text-gray-700">
                    Contrat de location
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="carteGriseEtrangere"
                    checked={formData.documents?.carteGriseEtrangere || false}
                    onChange={(e) => handleDocumentChange('carteGriseEtrangere', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="carteGriseEtrangere" className="text-sm font-medium text-gray-700">
                    Carte grise étrangère
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="carteGriseProvisoire"
                    checked={formData.documents?.carteGriseProvisoire || false}
                    onChange={(e) => handleDocumentChange('carteGriseProvisoire', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="carteGriseProvisoire" className="text-sm font-medium text-gray-700">
                    Carte grise provisoire
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="carteGriseDefinitive"
                    checked={formData.documents?.carteGriseDefinitive || false}
                    onChange={(e) => handleDocumentChange('carteGriseDefinitive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="carteGriseDefinitive" className="text-sm font-medium text-gray-700">
                    Carte grise définitive
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Données techniques */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Données techniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Puissance (CV) *</label>
                <input
                  type="number"
                  value={formData.enginePower}
                  onChange={(e) => handleInputChange('enginePower', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de carburant</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="essence">Essence</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybride</option>
                  <option value="electric">Électrique</option>
                  <option value="gpl">GPL</option>
                  <option value="ethanol">Éthanol</option>
                  <option value="hydrogen">Hydrogène</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="manual">Manuelle</option>
                  <option value="automatic">Automatique</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de places *</label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => handleInputChange('seats', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de portes</label>
                <input
                  type="number"
                  value={formData.doors}
                  onChange={(e) => handleInputChange('doors', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kilométrage</label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Codes assurance */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Codes assurance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Groupe SRA</label>
                <input
                  type="text"
                  value={formData.sraGroup}
                  onChange={(e) => handleInputChange('sraGroup', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Classe SRA</label>
                <input
                  type="text"
                  value={formData.sraClass}
                  onChange={(e) => handleInputChange('sraClass', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code GTA</label>
                <input
                  type="text"
                  value={formData.gtaCode}
                  onChange={(e) => handleInputChange('gtaCode', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
