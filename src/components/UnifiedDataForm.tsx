'use client';

import React, { useState, useEffect } from 'react';
import { Interlocutor, Driver, Vehicle, Claim } from '@/types/interlocutor';

interface UnifiedDataFormProps {
  onSuccess: (data: {
    interlocutor: Interlocutor;
    drivers: Driver[];
    vehicles: Vehicle[];
    claims: Claim[];
  }) => void;
  onCancel: () => void;
  userRole: 'admin' | 'internal' | 'external';
}

export default function UnifiedDataForm({
  onSuccess,
  onCancel,
  userRole
}: UnifiedDataFormProps) {
  // État pour l'interlocuteur
  const [interlocutorData, setInterlocutorData] = useState({
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

  // État pour les conducteurs
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '',
      interlocutorId: '',
      firstName: '',
      lastName: '',
      licenseNumber: '',
      licenseType: 'B',
      status: 'Actif' as 'Actif' | 'En attente' | 'Expiré',
      createdAt: '',
      updatedAt: ''
    }
  ]);

  // État pour les véhicules
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '',
      interlocutorId: '',
      registration: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'Voiture particulière' as 'Voiture particulière' | 'Véhicule utilitaire' | 'Moto' | 'Camion' | 'Autre',
      status: 'Assuré' as 'Assuré' | 'En attente' | 'Expiré',
      createdAt: '',
      updatedAt: ''
    }
  ]);

  // État pour les sinistres
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: '',
      interlocutorId: '',
      vehicleId: '',
      driverId: '',
      type: 'materialRC100' as Claim['type'],
      date: '',
      amount: 0,
      description: '',
      responsible: true,
      percentage: 100,
      insurer: '',
      status: 'En cours' as 'En cours' | 'Résolu' | 'Refusé' | 'En attente',
      createdAt: '',
      updatedAt: ''
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'interlocutor' | 'drivers' | 'vehicles' | 'claims'>('interlocutor');

  // Options pour les selects
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

  const handleInterlocutorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInterlocutorData(prev => ({ ...prev, [name]: value }));
  };

  const handleDriverChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDrivers(prev => prev.map((driver, i) => 
      i === index ? { ...driver, [name]: value } : driver
    ));
  };

  const handleVehicleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicles(prev => prev.map((vehicle, i) => 
      i === index ? { ...vehicle, [name]: value } : vehicle
    ));
  };

  const handleClaimChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setClaims(prev => prev.map((claim, i) => 
      i === index ? { 
        ...claim, 
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' ? parseFloat(value) || 0 :
                name === 'percentage' ? parseInt(value) : value
      } : claim
    ));
  };

  const addDriver = () => {
    setDrivers(prev => [...prev, {
      id: '',
      interlocutorId: '',
      firstName: '',
      lastName: '',
      licenseNumber: '',
      licenseType: 'B',
      status: 'Actif' as 'Actif' | 'En attente' | 'Expiré',
      createdAt: '',
      updatedAt: ''
    }]);
  };

  const addVehicle = () => {
    setVehicles(prev => [...prev, {
      id: '',
      interlocutorId: '',
      registration: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'Voiture particulière' as 'Voiture particulière' | 'Véhicule utilitaire' | 'Moto' | 'Camion' | 'Autre',
      status: 'Assuré' as 'Assuré' | 'En attente' | 'Expiré',
      createdAt: '',
      updatedAt: ''
    }]);
  };

  const addClaim = () => {
    setClaims(prev => [...prev, {
      id: '',
      interlocutorId: '',
      vehicleId: '',
      driverId: '',
      type: 'materialRC100' as Claim['type'],
      date: '',
      amount: 0,
      description: '',
      responsible: true,
      percentage: 100,
      insurer: '',
      status: 'En cours' as 'En cours' | 'Résolu' | 'Refusé' | 'En attente',
      createdAt: '',
      updatedAt: ''
    }]);
  };

  const removeDriver = (index: number) => {
    if (drivers.length > 1) {
      setDrivers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeVehicle = (index: number) => {
    if (vehicles.length > 1) {
      setVehicles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeClaim = (index: number) => {
    if (claims.length > 1) {
      setClaims(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Créer l'interlocuteur
      const newInterlocutor: Interlocutor = {
        ...interlocutorData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0],
        contracts: [],
        insuranceRequests: [],
        claims: [],
        vehicles: [],
        drivers: [],
        events: []
      };

      // Mettre à jour les IDs des relations
      const updatedDrivers = drivers.map(driver => ({
        ...driver,
        id: driver.id || Date.now().toString() + Math.random(),
        interlocutorId: newInterlocutor.id,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }));

      const updatedVehicles = vehicles.map(vehicle => ({
        ...vehicle,
        id: vehicle.id || Date.now().toString() + Math.random(),
        interlocutorId: newInterlocutor.id,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }));

      const updatedClaims = claims.map(claim => ({
        ...claim,
        id: claim.id || Date.now().toString() + Math.random(),
        interlocutorId: newInterlocutor.id,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }));

      onSuccess({
        interlocutor: newInterlocutor,
        drivers: updatedDrivers,
        vehicles: updatedVehicles,
        claims: updatedClaims
      });
    } catch (err) {
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'interlocutor', label: '👤 Interlocuteur', count: 1 },
    { id: 'drivers', label: '🚗 Conducteurs', count: drivers.length },
    { id: 'vehicles', label: '🚙 Véhicules', count: vehicles.length },
    { id: 'claims', label: '⚠️ Sinistres', count: claims.length }
  ];

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Création de données fictives complètes
          </h2>
          <p className="text-gray-600 mt-1">
            Saisissez toutes les informations nécessaires pour créer un interlocuteur avec ses données associées
          </p>
        </div>
        
        {/* Navigation par onglets */}
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
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

      <form onSubmit={handleSubmit} className="p-6">
        {/* Onglet Interlocuteur */}
        {activeTab === 'interlocutor' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de l'interlocuteur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type d'interlocuteur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'interlocuteur
                </label>
                <select
                  name="type"
                  value={interlocutorData.type}
                  onChange={handleInterlocutorChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="user">👤 Utilisateur interne</option>
                  <option value="external">🌐 Interlocuteur externe</option>
                </select>
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={interlocutorData.firstName}
                  onChange={handleInterlocutorChange}
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
                  value={interlocutorData.lastName}
                  onChange={handleInterlocutorChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dupont"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={interlocutorData.email}
                  onChange={handleInterlocutorChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="jean.dupont@example.com"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={interlocutorData.phone}
                  onChange={handleInterlocutorChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0123456789"
                  required
                />
              </div>

              {/* Entreprise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  name="company"
                  value={interlocutorData.company}
                  onChange={handleInterlocutorChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom de l'entreprise"
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
                  value={interlocutorData.address}
                  onChange={handleInterlocutorChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Rue de la Paix, 75001 Paris"
                />
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  value={interlocutorData.status}
                  onChange={handleInterlocutorChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="En attente">En attente</option>
                </select>
              </div>

              {/* Rôle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  name="role"
                  value={interlocutorData.role}
                  onChange={handleInterlocutorChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="client">Client</option>
                  <option value="prospect">Prospect</option>
                  <option value="partenaire">Partenaire</option>
                  <option value="fournisseur">Fournisseur</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Conducteurs */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Conducteurs</h3>
              <button
                type="button"
                onClick={addDriver}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                + Ajouter un conducteur
              </button>
            </div>
            
            {drivers.map((driver, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">Conducteur {index + 1}</h4>
                  {drivers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDriver(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={driver.firstName}
                      onChange={(e) => handleDriverChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Jean"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={driver.lastName}
                      onChange={(e) => handleDriverChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dupont"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de permis *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={driver.licenseNumber}
                      onChange={(e) => handleDriverChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123456789"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de permis *
                    </label>
                    <select
                      name="licenseType"
                      value={driver.licenseType}
                      onChange={(e) => handleDriverChange(index, e)}
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      name="status"
                      value={driver.status}
                      onChange={(e) => handleDriverChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Actif">Actif</option>
                      <option value="En attente">En attente</option>
                      <option value="Expiré">Expiré</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Onglet Véhicules */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Véhicules</h3>
              <button
                type="button"
                onClick={addVehicle}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                + Ajouter un véhicule
              </button>
            </div>
            
            {vehicles.map((vehicle, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">Véhicule {index + 1}</h4>
                  {vehicles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVehicle(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Immatriculation *
                    </label>
                    <input
                      type="text"
                      name="registration"
                      value={vehicle.registration}
                      onChange={(e) => handleVehicleChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="AB-123-CD"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marque *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={vehicle.brand}
                      onChange={(e) => handleVehicleChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Peugeot, Renault, BMW..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modèle *
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={vehicle.model}
                      onChange={(e) => handleVehicleChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="308, Clio, X3..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={vehicle.year}
                      onChange={(e) => handleVehicleChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de véhicule
                    </label>
                    <select
                      name="type"
                      value={vehicle.type}
                      onChange={(e) => handleVehicleChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Voiture particulière">Voiture particulière</option>
                      <option value="Véhicule utilitaire">Véhicule utilitaire</option>
                      <option value="Moto">Moto</option>
                      <option value="Camion">Camion</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      name="status"
                      value={vehicle.status}
                      onChange={(e) => handleVehicleChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Assuré">Assuré</option>
                      <option value="En attente">En attente</option>
                      <option value="Expiré">Expiré</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Onglet Sinistres */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Sinistres</h3>
              <button
                type="button"
                onClick={addClaim}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                + Ajouter un sinistre
              </button>
            </div>
            
            {claims.map((claim, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">Sinistre {index + 1}</h4>
                  {claims.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeClaim(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date du sinistre *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={claim.date}
                      onChange={(e) => handleClaimChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de sinistre *
                    </label>
                    <select
                      name="type"
                      value={claim.type}
                      onChange={(e) => handleClaimChange(index, e)}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant (€) *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={claim.amount}
                      onChange={(e) => handleClaimChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assureur *
                    </label>
                    <input
                      type="text"
                      name="insurer"
                      value={claim.insurer}
                      onChange={(e) => handleClaimChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom de la compagnie d'assurance"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pourcentage de responsabilité
                    </label>
                    <select
                      name="percentage"
                      value={claim.percentage}
                      onChange={(e) => handleClaimChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>0%</option>
                      <option value={50}>50%</option>
                      <option value={100}>100%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      name="status"
                      value={claim.status}
                      onChange={(e) => handleClaimChange(index, e)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="En cours">En cours</option>
                      <option value="Résolu">Résolu</option>
                      <option value="Refusé">Refusé</option>
                      <option value="En attente">En attente</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description du sinistre *
                    </label>
                    <textarea
                      name="description"
                      value={claim.description}
                      onChange={(e) => handleClaimChange(index, e)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Décrivez les circonstances du sinistre..."
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="responsible"
                        checked={claim.responsible}
                        onChange={(e) => handleClaimChange(index, e)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Responsable du sinistre
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            Annuler
          </button>
          
          <div className="flex space-x-3">
            {activeTab !== 'interlocutor' && (
              <button
                type="button"
                onClick={() => {
                  const tabIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (tabIndex > 0) {
                    setActiveTab(tabs[tabIndex - 1].id as any);
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Précédent
              </button>
            )}
            
            {activeTab !== 'claims' && (
              <button
                type="button"
                onClick={() => {
                  const tabIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (tabIndex < tabs.length - 1) {
                    setActiveTab(tabs[tabIndex + 1].id as any);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Suivant
              </button>
            )}
            
            {activeTab === 'claims' && (
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Création...' : 'Créer toutes les données'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
