'use client';

import React, { useState, useEffect } from 'react';
import { Interlocutor, Claim, Vehicle, Driver, Contract, InsuranceRequest, Event } from '@/types/interlocutor';
import { InterlocutorService } from '@/lib/interlocutors';

interface ModuleLinkManagerProps {
  interlocutor: Interlocutor;
  moduleType: 'claims' | 'vehicles' | 'drivers' | 'contracts' | 'insuranceRequests' | 'events';
  moduleId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ModuleLinkManager({
  interlocutor,
  moduleType,
  moduleId,
  onSuccess,
  onCancel
}: ModuleLinkManagerProps) {
  const [targetInterlocutors, setTargetInterlocutors] = useState<Interlocutor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTargetInterlocutors();
  }, []);

  const loadTargetInterlocutors = async () => {
    try {
      const allInterlocutors = await InterlocutorService.getAllInterlocutors();
      // Exclure l'interlocuteur actuel de la liste des cibles
      const filtered = allInterlocutors.filter(i => i.id !== interlocutor.id);
      setTargetInterlocutors(filtered);
    } catch (err) {
      setError('Erreur lors du chargement des interlocuteurs');
    }
  };

  const filteredInterlocutors = targetInterlocutors.filter(i => 
    `${i.firstName} ${i.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.company && i.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getModuleName = () => {
    switch (moduleType) {
      case 'claims': return 'sinistre';
      case 'vehicles': return 'véhicule';
      case 'drivers': return 'conducteur';
      case 'contracts': return 'contrat';
      case 'insuranceRequests': return 'demande d\'assurance';
      case 'events': return 'événement';
      default: return 'module';
    }
  };

  const getModuleData = () => {
    switch (moduleType) {
      case 'claims':
        return interlocutor.claims.find(c => c.id === moduleId);
      case 'vehicles':
        return interlocutor.vehicles.find(v => v.id === moduleId);
      case 'drivers':
        return interlocutor.drivers.find(d => d.id === moduleId);
      case 'contracts':
        return interlocutor.contracts.find(c => c.id === moduleId);
      case 'insuranceRequests':
        return interlocutor.insuranceRequests.find(r => r.id === moduleId);
      case 'events':
        return interlocutor.events.find(e => e.id === moduleId);
      default:
        return null;
    }
  };

  const handleTransfer = async () => {
    if (!selectedTargetId) {
      setError('Veuillez sélectionner un interlocuteur cible');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let result;
      
      switch (moduleType) {
        case 'claims':
          result = await InterlocutorService.transferClaim(interlocutor.id, moduleId, selectedTargetId);
          break;
        case 'vehicles':
          result = await InterlocutorService.transferVehicle(interlocutor.id, moduleId, selectedTargetId);
          break;
        case 'drivers':
          result = await InterlocutorService.transferDriver(interlocutor.id, moduleId, selectedTargetId);
          break;
        case 'contracts':
          result = await InterlocutorService.transferContract(interlocutor.id, moduleId, selectedTargetId);
          break;
        case 'insuranceRequests':
          result = await InterlocutorService.transferInsuranceRequest(interlocutor.id, moduleId, selectedTargetId);
          break;
        case 'events':
          result = await InterlocutorService.transferEvent(interlocutor.id, moduleId, selectedTargetId);
          break;
        default:
          throw new Error('Type de module non supporté');
      }

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Erreur lors du transfert');
      }
    } catch (err) {
      setError('Une erreur est survenue lors du transfert');
    } finally {
      setIsLoading(false);
    }
  };

  const moduleData = getModuleData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Transférer le {getModuleName()}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
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

          {/* Informations du module à transférer */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Module à transférer :</h3>
            <div className="text-sm text-gray-600">
              {moduleData && (
                <div>
                  {moduleType === 'claims' && (
                    <div>
                      <p><strong>Type :</strong> {(moduleData as Claim).type}</p>
                      <p><strong>Date :</strong> {(moduleData as Claim).date}</p>
                      <p><strong>Montant :</strong> {(moduleData as Claim).amount}€</p>
                      <p><strong>Description :</strong> {(moduleData as Claim).description}</p>
                    </div>
                  )}
                  {moduleType === 'vehicles' && (
                    <div>
                      <p><strong>Immatriculation :</strong> {(moduleData as Vehicle).registration}</p>
                      <p><strong>Marque/Modèle :</strong> {(moduleData as Vehicle).brand} {(moduleData as Vehicle).model}</p>
                      <p><strong>Année :</strong> {(moduleData as Vehicle).year}</p>
                    </div>
                  )}
                  {moduleType === 'drivers' && (
                    <div>
                      <p><strong>Nom :</strong> {(moduleData as Driver).firstName} {(moduleData as Driver).lastName}</p>
                      <p><strong>Permis :</strong> {(moduleData as Driver).licenseNumber}</p>
                      <p><strong>Type :</strong> {(moduleData as Driver).licenseType}</p>
                    </div>
                  )}
                  {moduleType === 'contracts' && (
                    <div>
                      <p><strong>Type :</strong> {(moduleData as Contract).type}</p>
                      <p><strong>Assureur :</strong> {(moduleData as Contract).insurer}</p>
                      <p><strong>Prime :</strong> {(moduleData as Contract).premium}€</p>
                    </div>
                  )}
                  {moduleType === 'insuranceRequests' && (
                    <div>
                      <p><strong>Type :</strong> {(moduleData as InsuranceRequest).type}</p>
                      <p><strong>Statut :</strong> {(moduleData as InsuranceRequest).status}</p>
                      <p><strong>Description :</strong> {(moduleData as InsuranceRequest).description}</p>
                    </div>
                  )}
                  {moduleType === 'events' && (
                    <div>
                      <p><strong>Titre :</strong> {(moduleData as Event).title}</p>
                      <p><strong>Type :</strong> {(moduleData as Event).type}</p>
                      <p><strong>Date :</strong> {(moduleData as Event).date}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sélection de l'interlocuteur cible */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Sélectionner l'interlocuteur cible :</h3>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un interlocuteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
              {filteredInterlocutors.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aucun interlocuteur trouvé
                </div>
              ) : (
                filteredInterlocutors.map((target) => (
                  <div
                    key={target.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedTargetId === target.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedTargetId(target.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {target.firstName} {target.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">{target.email}</p>
                        {target.company && (
                          <p className="text-sm text-gray-500">{target.company}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            target.status === 'Actif' ? 'bg-green-100 text-green-800' :
                            target.status === 'Inactif' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {target.status}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            target.role === 'client' ? 'bg-blue-100 text-blue-800' :
                            target.role === 'prospect' ? 'bg-purple-100 text-purple-800' :
                            target.role === 'partenaire' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {target.role}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>📋 {target.contracts.length} contrat(s)</p>
                        <p>🚗 {target.vehicles.length} véhicule(s)</p>
                        <p>👨‍💼 {target.drivers.length} conducteur(s)</p>
                        <p>⚠️ {target.claims.length} sinistre(s)</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleTransfer}
              disabled={!selectedTargetId || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Transfert...' : `Transférer vers ${targetInterlocutors.find(t => t.id === selectedTargetId)?.firstName} ${targetInterlocutors.find(t => t.id === selectedTargetId)?.lastName}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
