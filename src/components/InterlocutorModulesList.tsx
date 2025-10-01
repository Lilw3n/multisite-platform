'use client';

import React, { useState } from 'react';
import { Interlocutor, Claim, Vehicle, Driver, Contract, InsuranceRequest, Event } from '@/types/interlocutor';
import ModuleLinkManager from './ModuleLinkManager';

interface InterlocutorModulesListProps {
  interlocutor: Interlocutor;
  onModuleTransferred: () => void;
}

export default function InterlocutorModulesList({
  interlocutor,
  onModuleTransferred
}: InterlocutorModulesListProps) {
  const [showLinkManager, setShowLinkManager] = useState(false);
  const [selectedModule, setSelectedModule] = useState<{
    type: 'claims' | 'vehicles' | 'drivers' | 'contracts' | 'insuranceRequests' | 'events';
    id: string;
  } | null>(null);

  const handleLinkModule = (moduleType: 'claims' | 'vehicles' | 'drivers' | 'contracts' | 'insuranceRequests' | 'events', moduleId: string) => {
    setSelectedModule({ type: moduleType, id: moduleId });
    setShowLinkManager(true);
  };

  const handleLinkSuccess = () => {
    setShowLinkManager(false);
    setSelectedModule(null);
    onModuleTransferred();
  };

  const handleLinkCancel = () => {
    setShowLinkManager(false);
    setSelectedModule(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'claims': return '⚠️';
      case 'vehicles': return '🚗';
      case 'drivers': return '👨‍💼';
      case 'contracts': return '📋';
      case 'insuranceRequests': return '📝';
      case 'events': return '📅';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
      case 'Assuré':
      case 'Résolu':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'Inactif':
      case 'Expiré':
      case 'Refusé':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'En attente':
      case 'En cours':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sinistres */}
      {interlocutor.claims.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">⚠️</span>
              Sinistres ({interlocutor.claims.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {interlocutor.claims.map((claim) => (
              <div key={claim.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-md font-medium text-gray-900">
                        {claim.type} - {claim.amount}€
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{claim.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 {formatDate(claim.date)}</span>
                      <span>🏢 {claim.insurer}</span>
                      <span>📊 {claim.percentage}% de responsabilité</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleLinkModule('claims', claim.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Lier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Véhicules */}
      {interlocutor.vehicles.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">🚗</span>
              Véhicules ({interlocutor.vehicles.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {interlocutor.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-md font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </h4>
                      <span className="text-sm text-gray-500">{vehicle.registration}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>🚙 {vehicle.type}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleLinkModule('vehicles', vehicle.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Lier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conducteurs */}
      {interlocutor.drivers.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">👨‍💼</span>
              Conducteurs ({interlocutor.drivers.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {interlocutor.drivers.map((driver) => (
              <div key={driver.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-md font-medium text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </h4>
                      <span className="text-sm text-gray-500">Permis {driver.licenseNumber}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                        {driver.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>🪪 {driver.licenseType}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleLinkModule('drivers', driver.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Lier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contrats */}
      {interlocutor.contracts.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">📋</span>
              Contrats ({interlocutor.contracts.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {interlocutor.contracts.map((contract) => (
              <div key={contract.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-md font-medium text-gray-900">
                        {contract.type} - {contract.premium}€
                      </h4>
                      <span className="text-sm text-gray-500">{contract.policyNumber}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{contract.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>🏢 {contract.insurer}</span>
                      <span>📅 {contract.startDate} - {contract.endDate}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleLinkModule('contracts', contract.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Lier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demandes d'assurance */}
      {interlocutor.insuranceRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">📝</span>
              Demandes d'assurance ({interlocutor.insuranceRequests.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {interlocutor.insuranceRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-md font-medium text-gray-900">
                        {request.type}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.priority === 'Urgente' ? 'bg-red-100 text-red-800' :
                        request.priority === 'Élevée' ? 'bg-orange-100 text-orange-800' :
                        request.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 {formatDate(request.requestedDate)}</span>
                      <span>👤 {request.assignedTo}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleLinkModule('insuranceRequests', request.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Lier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Événements */}
      {interlocutor.events.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="mr-2">📅</span>
              Événements et Suivi ({interlocutor.events.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {interlocutor.events.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-md font-medium text-gray-900">
                        {event.title}
                      </h4>
                      <span className="text-sm text-gray-500">{event.type}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 {formatDate(event.date)}</span>
                      <span>⏰ {event.time}</span>
                      <span>👥 {event.participants.length} participant(s)</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleLinkModule('events', event.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Lier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucun module */}
      {interlocutor.claims.length === 0 && 
       interlocutor.vehicles.length === 0 && 
       interlocutor.drivers.length === 0 && 
       interlocutor.contracts.length === 0 && 
       interlocutor.insuranceRequests.length === 0 && 
       interlocutor.events.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun module associé</h3>
          <p className="text-gray-500">Cet interlocuteur n'a pas encore de modules associés.</p>
        </div>
      )}

      {/* Modal de liaison */}
      {showLinkManager && selectedModule && (
        <ModuleLinkManager
          interlocutor={interlocutor}
          moduleType={selectedModule.type}
          moduleId={selectedModule.id}
          onSuccess={handleLinkSuccess}
          onCancel={handleLinkCancel}
        />
      )}
    </div>
  );
}
