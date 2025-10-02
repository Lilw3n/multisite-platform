'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ExternalUserLayout from '@/components/layout/ExternalUserLayout';
import { Interlocutor } from '@/types/interlocutor';

export default function InterlocutorSearchPage() {
  const [interlocutors, setInterlocutors] = useState<Interlocutor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterlocutor, setSelectedInterlocutor] = useState<Interlocutor | null>(null);

  useEffect(() => {
    // Mock data pour la recherche d'interlocuteurs
    const mockInterlocutors: Interlocutor[] = [
      {
        id: '1',
        type: 'user',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@company.com',
        phone: '01 23 45 67 89',
        company: 'Transport Dupont SARL',
        address: '123 Rue de la Paix, 75001 Paris, France',
        status: 'Actif',
        role: 'client',
        createdAt: '2024-01-15',
        updatedAt: '2025-01-15',
        lastActivity: '2025-01-15',
        events: [],
        familyMembers: [],
        companyRelations: [],
        contracts: [
          {
            id: 'c1',
            interlocutorId: '1',
            type: 'assurance',
            status: 'En cours',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            premium: 1200,
            insurer: 'AXA',
            policyNumber: 'AXA-2024-001',
            description: 'Assurance VTC',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        ],
        insuranceRequests: [],
        claims: [],
        vehicles: [],
        drivers: [],
        userAccount: {
          userId: 'u1',
          permissions: ['read', 'write'],
          lastLogin: '2025-01-15'
        }
      },
      {
        id: '2',
        type: 'external',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@transport.fr',
        phone: '01 98 76 54 32',
        company: 'Martin Transport',
        address: '456 Avenue des Champs, 69000 Lyon',
        status: 'Actif',
        role: 'prospect',
        createdAt: '2024-02-15',
        updatedAt: '2025-01-14',
        lastActivity: '2025-01-14',
        contracts: [],
        insuranceRequests: [],
        claims: [],
        vehicles: [],
        drivers: [],
        events: [],
        familyMembers: [],
        companyRelations: [],
        externalInfo: {
          source: 'website',
          notes: 'Prospect intéressé par nos services',
          assignedTo: 'Pierre Bernard'
        }
      }
    ];

    setInterlocutors(mockInterlocutors);
  }, []);

  const filteredInterlocutors = interlocutors.filter(interlocutor => {
    if (searchTerm === '') return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      `${interlocutor.firstName} ${interlocutor.lastName}`.toLowerCase().includes(searchLower) ||
      interlocutor.email.toLowerCase().includes(searchLower) ||
      (interlocutor.company && interlocutor.company.toLowerCase().includes(searchLower)) ||
      interlocutor.phone.includes(searchTerm)
    );
  });

  const getStatusColor = (status: Interlocutor['status']) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Inactif':
        return 'bg-red-100 text-red-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedInterlocutor) {
    return (
      <ExternalUserLayout
        title="Fiche Interlocuteur"
        subtitle={`Informations de ${selectedInterlocutor.firstName} ${selectedInterlocutor.lastName}`}
        selectedInterlocutor={{
          id: selectedInterlocutor.id,
          name: `${selectedInterlocutor.firstName} ${selectedInterlocutor.lastName}`,
          email: selectedInterlocutor.email
        }}
      >
        <div className="space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInterlocutor.firstName} {selectedInterlocutor.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInterlocutor.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInterlocutor.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInterlocutor.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInterlocutor.status)}`}>
                  {selectedInterlocutor.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dernière activité</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInterlocutor.lastActivity}</p>
              </div>
            </div>
          </div>

          {/* Contrats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contrats ({selectedInterlocutor.contracts.length})</h3>
            {selectedInterlocutor.contracts.length > 0 ? (
              <div className="space-y-4">
                {selectedInterlocutor.contracts.map((contract) => (
                  <div key={contract.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{contract.description}</h4>
                        <p className="text-sm text-gray-600">{contract.insurer} - {contract.policyNumber}</p>
                        <p className="text-sm text-gray-600">
                          {contract.startDate} - {contract.endDate} • {contract.premium}€
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contract.status === 'En cours' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucun contrat enregistré</p>
            )}
          </div>

          {/* Demandes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Demandes ({selectedInterlocutor.insuranceRequests.length})</h3>
            {selectedInterlocutor.insuranceRequests.length > 0 ? (
              <div className="space-y-4">
                {selectedInterlocutor.insuranceRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{request.description}</h4>
                        <p className="text-sm text-gray-600">Type: {request.type} • Assigné à: {request.assignedTo}</p>
                        <p className="text-sm text-gray-600">Demandé le: {request.requestedDate}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune demande enregistrée</p>
            )}
          </div>

          {/* Bouton de retour */}
          <div className="text-center">
            <button
              onClick={() => setSelectedInterlocutor(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium"
            >
              ← Retour à la recherche
            </button>
          </div>
        </div>
      </ExternalUserLayout>
    );
  }

  return (
    <ExternalUserLayout
      title="Recherche d'interlocuteur"
      subtitle="Trouvez et consultez les fiches des interlocuteurs"
    >
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-500">ℹ️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                En mode utilisateur externe, vous pouvez rechercher et consulter les fiches des interlocuteurs.
                Utilisez la barre de recherche ci-dessous pour filtrer les résultats.
              </p>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par nom, email, entreprise ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSearchTerm('')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-md font-medium"
              >
                Effacer
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {filteredInterlocutors.length} interlocuteur(s) trouvé(s)
          </p>
        </div>

        {/* Liste des interlocuteurs */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Résultats de la recherche ({filteredInterlocutors.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredInterlocutors.length > 0 ? (
              filteredInterlocutors.map((interlocutor) => (
                <div key={interlocutor.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {interlocutor.firstName} {interlocutor.lastName}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interlocutor.status)}`}>
                              {interlocutor.status}
                            </span>
                            {interlocutor.type === 'user' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                👤 Utilisateur
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{interlocutor.email}</p>
                          {interlocutor.company && (
                            <p className="text-sm text-gray-500">{interlocutor.company}</p>
                          )}
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>📞 {interlocutor.phone}</span>
                            <span>📅 Dernière activité: {interlocutor.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Statistiques */}
                      <div className="mt-3 flex items-center space-x-6 text-sm text-gray-600">
                        <span>📋 {interlocutor.contracts.length} contrat(s)</span>
                        <span>📝 {interlocutor.insuranceRequests.length} demande(s)</span>
                        <span>⚠️ {interlocutor.claims.length} sinistre(s)</span>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => setSelectedInterlocutor(interlocutor)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Voir la fiche
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun interlocuteur trouvé</p>
                <p className="text-gray-400 text-sm mt-2">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ExternalUserLayout>
  );
}
