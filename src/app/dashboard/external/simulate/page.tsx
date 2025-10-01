'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ExternalUserLayout from '@/components/layout/ExternalUserLayout';
import { Interlocutor } from '@/types/interlocutor';
import { InterlocutorService } from '@/lib/interlocutors';
import { useClientSide } from '@/hooks/useClientSide';

export default function InterlocutorSimulationPage() {
  const isClient = useClientSide();
  const [interlocutors, setInterlocutors] = useState<Interlocutor[]>([]);
  const [filteredInterlocutors, setFilteredInterlocutors] = useState<Interlocutor[]>([]);
  const [selectedInterlocutor, setSelectedInterlocutor] = useState<Interlocutor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Charger les interlocuteurs depuis le service
    const loadInterlocutors = async () => {
      try {
        const allInterlocutors = await InterlocutorService.getAllInterlocutors();
        setInterlocutors(allInterlocutors);
      } catch (error) {
        console.error('Erreur lors du chargement des interlocuteurs:', error);
        // Fallback vers des données mockées en cas d'erreur
        const mockInterlocutors: Interlocutor[] = [
          {
            id: '1',
            type: 'user',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@company.com',
            phone: '01 23 45 67 89',
            company: 'Transport Dupont SARL',
            address: '123 Rue de la Paix, 75001 Paris',
            status: 'Actif',
            role: 'client',
            createdAt: '2024-01-15',
            updatedAt: '2025-01-15',
            lastActivity: '2025-01-15',
            contracts: [],
            insuranceRequests: [],
            claims: [],
            vehicles: [],
            drivers: [],
            events: [],
            familyMembers: [],
            companyRelations: [],
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
        setFilteredInterlocutors(mockInterlocutors);
      }
    };

    loadInterlocutors();
  }, []);

  // Filtrer les interlocuteurs en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredInterlocutors(interlocutors);
    } else {
      const filtered = interlocutors.filter(interlocutor => {
        const searchLower = searchTerm.toLowerCase();
        return (
          `${interlocutor.firstName} ${interlocutor.lastName}`.toLowerCase().includes(searchLower) ||
          interlocutor.email.toLowerCase().includes(searchLower) ||
          (interlocutor.company && interlocutor.company.toLowerCase().includes(searchLower)) ||
          interlocutor.phone.includes(searchTerm)
        );
      });
      setFilteredInterlocutors(filtered);
    }
  }, [searchTerm, interlocutors]);

  const handleSimulateInterlocutor = (interlocutor: Interlocutor) => {
    // Simuler l'interlocuteur en stockant ses données
    if (isClient) {
      localStorage.setItem('simulated_interlocutor', JSON.stringify(interlocutor));
      localStorage.setItem('view_mode', 'external');
      localStorage.setItem('simulation_mode', 'true');
      // Rediriger vers la fiche détaillée de l'interlocuteur
      window.location.href = `/dashboard/interlocutors/${interlocutor.id}`;
    }
  };

  const getStatusColor = (status: Interlocutor['status']) => {
    return status === 'Actif' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <ExternalUserLayout
      title="Simulation d'Interlocuteur"
      subtitle="Choisissez un interlocuteur pour voir l'interface comme il la verrait"
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
                <strong>Simulation d'interlocuteur :</strong> Sélectionnez un interlocuteur ci-dessous pour voir l'interface 
                exactement comme il la verrait. Vous pourrez naviguer dans son espace personnel et voir ses données.
              </p>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
          <div className="flex space-x-4">
            <Link
              href="/dashboard/external/search"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center"
            >
              🔍 Recherche avancée
            </Link>
            <Link
              href="/dashboard/test"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium flex items-center"
            >
              ⚙️ Configuration des modes
            </Link>
            <button
              onClick={() => {
                // Forcer le retour au mode admin
                if (typeof window !== 'undefined') {
                  localStorage.setItem('user_role', 'admin');
                  localStorage.setItem('test_mode', 'false');
                  localStorage.setItem('view_mode', 'admin');
                  localStorage.removeItem('simulated_interlocutor');
                  window.location.href = '/dashboard';
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium flex items-center"
              title="🚨 BOUTON D'URGENCE - Revenir au mode Admin"
            >
              🚨 Retour Admin
            </button>
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
            {filteredInterlocutors.length} interlocuteur(s) trouvé(s) sur {interlocutors.length}
          </p>
        </div>

        {/* Liste des interlocuteurs pour simulation */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Interlocuteurs disponibles pour simulation ({filteredInterlocutors.length})</h2>
            <p className="text-sm text-gray-600 mt-1">
              Cliquez sur "Simuler" pour voir l'interface comme cet interlocuteur
            </p>
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
                          <h3 className="text-lg font-medium text-gray-900">{interlocutor.firstName} {interlocutor.lastName}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interlocutor.status)}`}>
                            {interlocutor.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            interlocutor.type === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {interlocutor.type === 'user' ? '👤 Utilisateur' : '🌐 Externe'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{interlocutor.email}</p>
                        {interlocutor.company && (
                          <p className="text-sm text-gray-500">{interlocutor.company}</p>
                        )}
                        <div className="mt-2 text-sm text-gray-500">
                          📞 {interlocutor.phone} • 📅 Dernière activité: {interlocutor.lastActivity}
                        </div>
                        
                        {/* Statistiques */}
                        <div className="mt-3 flex items-center space-x-6 text-sm text-gray-600">
                          <span>📋 {interlocutor.contracts?.length || 0} contrat(s)</span>
                          <span>📝 {interlocutor.insuranceRequests?.length || 0} demande(s)</span>
                          <span>⚠️ {interlocutor.claims?.length || 0} sinistre(s)</span>
                          <span>🚗 {interlocutor.vehicles?.length || 0} véhicule(s)</span>
                          <span>👤 {interlocutor.drivers?.length || 0} conducteur(s)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4 space-x-2">
                    <button
                      onClick={() => handleSimulateInterlocutor(interlocutor)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      🎭 Simuler
                    </button>
                    <button
                      onClick={() => setSelectedInterlocutor(interlocutor)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      👁️ Voir détails
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

        {/* Modal de détails (si un interlocuteur est sélectionné) */}
        {selectedInterlocutor && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Détails de l'interlocuteur</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                    <p className="text-sm text-gray-900">{selectedInterlocutor.firstName} {selectedInterlocutor.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedInterlocutor.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                    <p className="text-sm text-gray-900">{selectedInterlocutor.company || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="text-sm text-gray-900">{selectedInterlocutor.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedInterlocutor.type === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedInterlocutor.type === 'user' ? '👤 Utilisateur' : '🌐 Externe'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInterlocutor.status)}`}>
                      {selectedInterlocutor.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statistiques</label>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">📋 {selectedInterlocutor.contracts?.length || 0} contrats</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">📝 {selectedInterlocutor.insuranceRequests?.length || 0} demandes</span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded">⚠️ {selectedInterlocutor.claims?.length || 0} sinistres</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">🚗 {selectedInterlocutor.vehicles?.length || 0} véhicules</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedInterlocutor(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    handleSimulateInterlocutor(selectedInterlocutor);
                    setSelectedInterlocutor(null);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  🎭 Simuler cet interlocuteur
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExternalUserLayout>
  );
}



