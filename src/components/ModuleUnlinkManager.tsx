'use client';

import React, { useState } from 'react';
import { Interlocutor } from '@/types/interlocutor';
import { InterlocutorService } from '@/lib/interlocutors';

interface ModuleUnlinkManagerProps {
  interlocutor: Interlocutor;
  moduleType: 'claims' | 'vehicles' | 'drivers' | 'contracts' | 'insuranceRequests' | 'events';
  moduleId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ModuleUnlinkManager({
  interlocutor,
  moduleType,
  moduleId,
  onSuccess,
  onCancel
}: ModuleUnlinkManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleUnlink = async () => {
    setIsLoading(true);
    setError('');

    try {
      let result;
      
      switch (moduleType) {
        case 'claims':
          result = await InterlocutorService.deleteClaim(interlocutor.id, moduleId);
          break;
        case 'vehicles':
          result = await InterlocutorService.deleteVehicle(interlocutor.id, moduleId);
          break;
        case 'drivers':
          result = await InterlocutorService.deleteDriver(interlocutor.id, moduleId);
          break;
        case 'contracts':
          result = await InterlocutorService.deleteContract(interlocutor.id, moduleId);
          break;
        case 'insuranceRequests':
          result = await InterlocutorService.deleteInsuranceRequest(interlocutor.id, moduleId);
          break;
        case 'events':
          result = await InterlocutorService.deleteEvent(interlocutor.id, moduleId);
          break;
        default:
          throw new Error('Type de module non supporté');
      }

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const moduleData = getModuleData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Délier le {getModuleName()}
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

          {/* Informations du module à délier */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Module à délier :</h3>
            <div className="text-sm text-gray-600">
              {moduleData && (
                <div>
                  {moduleType === 'events' && (
                    <div>
                      <p><strong>Titre :</strong> {(moduleData as any).title}</p>
                      <p><strong>Type :</strong> {(moduleData as any).type}</p>
                      <p><strong>Date :</strong> {(moduleData as any).date}</p>
                      <p><strong>Description :</strong> {(moduleData as any).description}</p>
                    </div>
                  )}
                  {moduleType === 'claims' && (
                    <div>
                      <p><strong>Type :</strong> {(moduleData as any).type}</p>
                      <p><strong>Date :</strong> {(moduleData as any).date}</p>
                      <p><strong>Montant :</strong> {(moduleData as any).amount}€</p>
                      <p><strong>Description :</strong> {(moduleData as any).description}</p>
                    </div>
                  )}
                  {moduleType === 'vehicles' && (
                    <div>
                      <p><strong>Immatriculation :</strong> {(moduleData as any).registration}</p>
                      <p><strong>Marque/Modèle :</strong> {(moduleData as any).brand} {(moduleData as any).model}</p>
                      <p><strong>Année :</strong> {(moduleData as any).year}</p>
                    </div>
                  )}
                  {moduleType === 'drivers' && (
                    <div>
                      <p><strong>Nom :</strong> {(moduleData as any).firstName} {(moduleData as any).lastName}</p>
                      <p><strong>Permis :</strong> {(moduleData as any).licenseNumber}</p>
                      <p><strong>Type :</strong> {(moduleData as any).licenseType}</p>
                    </div>
                  )}
                  {moduleType === 'contracts' && (
                    <div>
                      <p><strong>Type :</strong> {(moduleData as any).type}</p>
                      <p><strong>Assureur :</strong> {(moduleData as any).insurer}</p>
                      <p><strong>Prime :</strong> {(moduleData as any).premium}€</p>
                    </div>
                  )}
                  {moduleType === 'insuranceRequests' && (
                    <div>
                      <p><strong>Type :</strong> {(moduleData as any).type}</p>
                      <p><strong>Statut :</strong> {(moduleData as any).status}</p>
                      <p><strong>Description :</strong> {(moduleData as any).description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-500">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Cette action va supprimer définitivement ce {getModuleName()} de l'interlocuteur {interlocutor.firstName} {interlocutor.lastName}.
                </p>
              </div>
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
              onClick={handleUnlink}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Suppression...' : 'Délier définitivement'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
