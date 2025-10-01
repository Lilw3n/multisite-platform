'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ExternalUserLayout from '@/components/layout/ExternalUserLayout';

interface Interlocutor {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'Actif' | 'Inactif';
  lastActivity: string;
  type: 'user' | 'external';
}

export default function InterlocutorSimulationPage() {
  const [interlocutors, setInterlocutors] = useState<Interlocutor[]>([]);
  const [selectedInterlocutor, setSelectedInterlocutor] = useState<Interlocutor | null>(null);

  useEffect(() => {
    // Mock data pour les interlocuteurs
    const mockInterlocutors: Interlocutor[] = [
      {
        id: '1',
        name: 'Jean Dupont',
        email: 'jean.dupont@company.com',
        company: 'Transport Dupont SARL',
        phone: '01 23 45 67 89',
        status: 'Actif',
        lastActivity: '2025-01-15',
        type: 'user'
      },
      {
        id: '2',
        name: 'Marie Martin',
        email: 'marie.martin@transport.fr',
        company: 'Martin Transport',
        phone: '01 98 76 54 32',
        status: 'Actif',
        lastActivity: '2025-01-14',
        type: 'external'
      },
      {
        id: '3',
        name: 'Pierre Bernard',
        email: 'pierre.bernard@logistics.com',
        company: 'Bernard Logistics',
        phone: '01 11 22 33 44',
        status: 'Inactif',
        lastActivity: '2025-01-10',
        type: 'external'
      },
      {
        id: '4',
        name: 'Sophie Moreau',
        email: 'sophie.moreau@vtc.fr',
        company: 'Moreau VTC',
        phone: '01 55 66 77 88',
        status: 'Actif',
        lastActivity: '2025-01-15',
        type: 'user'
      },
      {
        id: '5',
        name: 'Lucas Petit',
        email: 'lucas.petit@taxi.com',
        company: 'Petit Taxi',
        phone: '01 99 88 77 66',
        status: 'Actif',
        lastActivity: '2025-01-13',
        type: 'external'
      }
    ];

    setInterlocutors(mockInterlocutors);
  }, []);

  const handleSimulateInterlocutor = (interlocutor: Interlocutor) => {
    // Simuler l'interlocuteur en stockant ses données
    if (typeof window !== 'undefined') {
      localStorage.setItem('simulated_interlocutor', JSON.stringify(interlocutor));
      localStorage.setItem('view_mode', 'external');
      window.location.href = '/dashboard/external/profile';
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

        {/* Liste des interlocuteurs pour simulation */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Interlocuteurs disponibles pour simulation ({interlocutors.length})</h2>
            <p className="text-sm text-gray-600 mt-1">
              Cliquez sur "Simuler" pour voir l'interface comme cet interlocuteur
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {interlocutors.map((interlocutor) => (
              <div key={interlocutor.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium text-gray-900">{interlocutor.name}</h3>
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
                        <p className="text-sm text-gray-500">{interlocutor.company}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          📞 {interlocutor.phone} • 📅 Dernière activité: {interlocutor.lastActivity}
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
            ))}
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
                    <p className="text-sm text-gray-900">{selectedInterlocutor.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedInterlocutor.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                    <p className="text-sm text-gray-900">{selectedInterlocutor.company}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="text-sm text-gray-900">{selectedInterlocutor.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInterlocutor.status)}`}>
                      {selectedInterlocutor.status}
                    </span>
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



