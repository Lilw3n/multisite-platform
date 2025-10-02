'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Truck,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Users,
  Shield,
  Building,
  ExternalLink
} from 'lucide-react';
import { VehicleService } from '@/lib/vehicleService';
import { CompanyService } from '@/lib/companyService';
import { VehicleTechnicalData, PlateRecognitionResult, VehicleValidationResult } from '@/types/vehicle';
import { CompanyData } from '@/types/company';

interface VehicleSelectorProps {
  selectedVehicle?: VehicleTechnicalData | null;
  onSelect: (vehicle: VehicleTechnicalData) => void;
  onClear?: () => void;
  subscriberName?: string;
  subscriberSiret?: string;
  placeholder?: string;
  required?: boolean;
  showTechnicalDetails?: boolean;
}

export default function VehicleSelector({
  selectedVehicle,
  onSelect,
  onClear,
  subscriberName = '',
  subscriberSiret,
  placeholder = "Rechercher par plaque, VIN, ou créer un véhicule...",
  required = false,
  showTechnicalDetails = true
}: VehicleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMethod, setSearchMethod] = useState<'plate' | 'vin' | 'manual' | 'sra' | 'gta'>('plate');
  const [vehicles, setVehicles] = useState<VehicleTechnicalData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [plateRecognition, setPlateRecognition] = useState<PlateRecognitionResult | null>(null);
  const [validation, setValidation] = useState<VehicleValidationResult | null>(null);
  const [ownerCompany, setOwnerCompany] = useState<CompanyData | null>(null);

  // Charger les véhicules existants
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    const allVehicles = VehicleService.getAllVehicles();
    setVehicles(allVehicles);
  };

  // Recherche de véhicule
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      let searchResult;

      switch (searchMethod) {
        case 'plate':
          // Reconnaissance de plaque
          const recognition = VehicleService.recognizePlate(searchTerm);
          setPlateRecognition(recognition);

          if (recognition.isValid) {
            searchResult = await VehicleService.searchVehicle({ registration: searchTerm });
          }
          break;

        case 'vin':
          searchResult = await VehicleService.searchVehicle({ vin: searchTerm });
          break;

        case 'sra':
          searchResult = await VehicleService.searchVehicle({ sraCode: searchTerm });
          break;

        case 'gta':
          searchResult = await VehicleService.searchVehicle({ gtaCode: searchTerm });
          break;
      }

      if (searchResult?.success && searchResult.data) {
        const vehicle = searchResult.data;
        
        // Validation du véhicule
        const validationResult = VehicleService.validateVehicle(vehicle);
        setValidation(validationResult);

        // Vérification propriété si souscripteur fourni
        if (subscriberName && vehicle.registrationCardOwner) {
          const ownershipVerification = VehicleService.verifyOwnership(
            subscriberName,
            vehicle.registrationCardOwner,
            subscriberSiret
          );
          
          vehicle.ownershipVerified = ownershipVerification.isMatch;
          vehicle.ownershipAlerts = ownershipVerification.alerts;
        }

        // Recherche entreprise propriétaire si SIRET
        if (vehicle.ownerSiret) {
          const companyResult = await CompanyService.searchCompany({ siret: vehicle.ownerSiret });
          if (companyResult.success && companyResult.data) {
            setOwnerCompany(companyResult.data);
          }
        }

        onSelect(vehicle);
        setIsOpen(false);
      } else {
        // Véhicule non trouvé, proposer création manuelle
        setShowCreateForm(true);
      }

    } catch (error) {
      console.error('Erreur recherche véhicule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVehicle = () => {
    setShowCreateForm(true);
    setIsOpen(false);
  };

  const handleVehicleCreated = (newVehicle: VehicleTechnicalData) => {
    VehicleService.saveVehicle(newVehicle);
    loadVehicles();
    onSelect(newVehicle);
    setShowCreateForm(false);
  };

  const renderVehicleCard = (vehicle: VehicleTechnicalData) => (
    <div
      key={vehicle.id}
      onClick={() => {
        onSelect(vehicle);
        setIsOpen(false);
      }}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {vehicle.usage === 'vtc' || vehicle.usage === 'taxi' ? (
              <Truck className="h-5 w-5 text-blue-600" />
            ) : (
              <Car className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {vehicle.brand} {vehicle.model}
              {vehicle.version && <span className="text-gray-500"> {vehicle.version}</span>}
            </h4>
            <p className="text-sm text-gray-600">{vehicle.registration}</p>
            {vehicle.finish && (
              <p className="text-xs text-gray-500">Finition: {vehicle.finish}</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1">
            {vehicle.registrationType === 'temporary' && (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            )}
            {vehicle.ownershipVerified ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          {vehicle.currentArgusValue && (
            <p className="text-sm font-medium text-gray-900">
              {vehicle.currentArgusValue.toLocaleString()} €
            </p>
          )}
        </div>
      </div>

      {showTechnicalDetails && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Gauge className="h-3 w-3" />
            <span>{vehicle.enginePower} CV</span>
          </div>
          <div className="flex items-center space-x-1">
            <Fuel className="h-3 w-3" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{vehicle.seats} places</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(vehicle.firstRegistrationDate).getFullYear()}</span>
          </div>
        </div>
      )}

      {vehicle.ownershipAlerts.length > 0 && (
        <div className="mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              {vehicle.ownershipAlerts.map((alert, index) => (
                <p key={index} className="text-xs text-yellow-800">{alert}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSearchInterface = () => (
    <div className="space-y-4">
      {/* Méthode de recherche */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Méthode de recherche
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[
            { value: 'plate', label: 'Plaque', icon: MapPin },
            { value: 'vin', label: 'VIN', icon: Info },
            { value: 'sra', label: 'SRA', icon: Shield },
            { value: 'gta', label: 'GTA', icon: Shield },
            { value: 'manual', label: 'Manuel', icon: Plus }
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSearchMethod(value as any)}
              className={`p-2 text-xs rounded-md border transition-colors ${
                searchMethod === value
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4 mx-auto mb-1" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Champ de recherche */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {searchMethod === 'plate' && 'Numéro d\'immatriculation'}
          {searchMethod === 'vin' && 'Numéro de châssis (VIN)'}
          {searchMethod === 'sra' && 'Code SRA'}
          {searchMethod === 'gta' && 'Code GTA'}
          {searchMethod === 'manual' && 'Recherche libre'}
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            placeholder={
              searchMethod === 'plate' ? 'AB-123-CD ou WW-456-WW' :
              searchMethod === 'vin' ? 'VF1234567890123456' :
              searchMethod === 'sra' ? 'E12' :
              searchMethod === 'gta' ? 'PE308HDI' :
              'Marque, modèle...'
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : <Search className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Résultat reconnaissance plaque */}
      {plateRecognition && (
        <div className={`p-3 rounded-md border-l-4 ${
          plateRecognition.isValid 
            ? 'bg-green-50 border-green-400' 
            : 'bg-red-50 border-red-400'
        }`}>
          <div className="flex items-start space-x-2">
            {plateRecognition.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-medium ${
                plateRecognition.isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {plateRecognition.isValid ? 'Plaque reconnue' : 'Plaque non reconnue'}
              </p>
              <p className="text-xs text-gray-600">
                Type: {plateRecognition.type} | Format: {plateRecognition.format}
                {plateRecognition.country && ` | Pays: ${plateRecognition.country}`}
                {plateRecognition.region && ` | Région: ${plateRecognition.region}`}
              </p>
              {plateRecognition.errors.length > 0 && (
                <ul className="mt-1 text-xs text-red-600">
                  {plateRecognition.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Sélecteur principal */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedVehicle ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Car className="h-5 w-5 text-gray-400" />
              <div>
                <span className="font-medium">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </span>
                <span className="text-gray-500 ml-2">
                  {selectedVehicle.registration}
                </span>
              </div>
            </div>
            {onClear && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3 text-gray-500">
            <Car className="h-5 w-5" />
            <span>{placeholder}</span>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            {renderSearchInterface()}
          </div>

          {/* Véhicules existants */}
          {vehicles.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Véhicules existants
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {vehicles.map(renderVehicleCard)}
              </div>
            </div>
          )}

          {/* Bouton créer nouveau */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleCreateVehicle}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              <Plus className="h-4 w-4" />
              <span>Créer un nouveau véhicule</span>
            </button>
          </div>
        </div>
      )}

      {/* Validation du véhicule sélectionné */}
      {selectedVehicle && validation && (
        <div className="mt-2">
          <div className={`p-3 rounded-md border-l-4 ${
            validation.isValid 
              ? 'bg-green-50 border-green-400' 
              : 'bg-yellow-50 border-yellow-400'
          }`}>
            <div className="flex items-start space-x-2">
              {validation.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium">
                  Score d'éligibilité: {validation.eligibilityScore}%
                </p>
                {validation.warnings.length > 0 && (
                  <ul className="mt-1 text-xs text-yellow-800">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                )}
                {validation.recommendations.length > 0 && (
                  <ul className="mt-1 text-xs text-blue-800">
                    {validation.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informations entreprise propriétaire */}
      {ownerCompany && (
        <div className="mt-2 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
          <div className="flex items-start space-x-2">
            <Building className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Propriétaire: {ownerCompany.legalName}
              </p>
              <p className="text-xs text-blue-600">
                SIRET: {ownerCompany.siret} | {ownerCompany.mainActivity}
              </p>
              {ownerCompany.legalRepresentatives[0] && (
                <p className="text-xs text-blue-600">
                  Représentant: {ownerCompany.legalRepresentatives[0].firstName} {ownerCompany.legalRepresentatives[0].lastName}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de véhicule */}
      {showCreateForm && (
        <VehicleCreateModal
          onSave={handleVehicleCreated}
          onCancel={() => setShowCreateForm(false)}
          initialData={{
            registration: searchTerm,
            searchMethod,
            subscriberName,
            subscriberSiret
          }}
        />
      )}
    </div>
  );
}

// Composant modal de création de véhicule (simplifié pour l'exemple)
function VehicleCreateModal({ 
  onSave, 
  onCancel, 
  initialData 
}: { 
  onSave: (vehicle: VehicleTechnicalData) => void;
  onCancel: () => void;
  initialData: any;
}) {
  const [formData, setFormData] = useState({
    registration: initialData.registration || '',
    brand: '',
    model: '',
    version: '',
    enginePower: '',
    fuelType: 'essence',
    seats: '5',
    firstRegistrationDate: '',
    ownerName: initialData.subscriberName || '',
    usage: 'personal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVehicle: VehicleTechnicalData = {
      id: `vh_${Date.now()}`,
      registration: formData.registration,
      registrationType: 'french',
      brand: formData.brand,
      model: formData.model,
      version: formData.version,
      enginePower: parseInt(formData.enginePower) || 0,
      fuelType: formData.fuelType as any,
      transmission: 'manual',
      seats: parseInt(formData.seats) || 5,
      doors: 5,
      weight: 1200,
      firstRegistrationDate: formData.firstRegistrationDate,
      ownershipStatus: 'owned',
      usage: formData.usage as any,
      registrationCardOwner: formData.ownerName,
      ownershipVerified: formData.ownerName === initialData.subscriberName,
      ownershipAlerts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'manual'
    };

    onSave(newVehicle);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Nouveau véhicule</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Immatriculation *
                </label>
                <input
                  type="text"
                  value={formData.registration}
                  onChange={(e) => setFormData(prev => ({ ...prev, registration: e.target.value.toUpperCase() }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marque *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Modèle *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Puissance (CV) *
                </label>
                <input
                  type="number"
                  value={formData.enginePower}
                  onChange={(e) => setFormData(prev => ({ ...prev, enginePower: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Carburant *
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="essence">Essence</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybride</option>
                  <option value="electric">Électrique</option>
                  <option value="gpl">GPL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date 1ère immatriculation *
                </label>
                <input
                  type="date"
                  value={formData.firstRegistrationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstRegistrationDate: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Propriétaire carte grise
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Créer le véhicule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
