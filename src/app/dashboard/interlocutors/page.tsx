'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Interlocutor } from '@/types/interlocutor';
import { InterlocutorService } from '@/lib/interlocutors';

export default function InterlocutorsPage() {
  const [interlocutors, setInterlocutors] = useState<Interlocutor[]>([]);
  const [filter, setFilter] = useState<'all' | 'user' | 'external'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Charger les interlocuteurs depuis le service
    const loadedInterlocutors = InterlocutorService.getAllInterlocutors();
    
    // Si aucun interlocuteur, utiliser des données mock
    const mockInterlocutors: Interlocutor[] = loadedInterlocutors.length > 0 ? loadedInterlocutors : [
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
        insuranceRequests: [
          {
            id: 'r1',
            interlocutorId: '1',
            type: 'devis',
            status: 'En cours',
            requestedDate: '2025-01-10',
            description: 'Demande de devis pour nouveau véhicule',
            priority: 'Moyenne',
            assignedTo: 'Marie Martin',
            createdAt: '2025-01-10',
            updatedAt: '2025-01-10'
          }
        ],
        claims: [],
        vehicles: [
          {
            id: 'v1',
            interlocutorId: '1',
            registration: 'AB-123-CD',
            brand: 'Peugeot',
            model: '308',
            year: 2022,
            type: 'Voiture particulière',
            status: 'Assuré',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        ],
        drivers: [
          {
            id: 'd1',
            interlocutorId: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
            licenseNumber: '123456789',
            licenseType: 'B',
            status: 'Actif',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        ],
        events: [],
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
        insuranceRequests: [
          {
            id: 'r2',
            interlocutorId: '2',
            type: 'souscription',
            status: 'En attente',
            requestedDate: '2025-01-12',
            description: 'Souscription assurance VTC',
            priority: 'Élevée',
            assignedTo: 'Pierre Bernard',
            createdAt: '2025-01-12',
            updatedAt: '2025-01-12'
          }
        ],
        claims: [],
        vehicles: [],
        drivers: [],
        events: [],
        externalInfo: {
          source: 'website',
          notes: 'Prospect intéressé par nos services',
          assignedTo: 'Pierre Bernard'
        }
      },
      {
        id: '3',
        type: 'user',
        firstName: 'Pierre',
        lastName: 'Bernard',
        email: 'pierre.bernard@logistics.com',
        phone: '01 11 22 33 44',
        company: 'Bernard Logistics',
        address: '789 Boulevard de la République, 13000 Marseille',
        status: 'Actif',
        role: 'client',
        createdAt: '2023-06-10',
        updatedAt: '2025-01-13',
        lastActivity: '2025-01-13',
        contracts: [
          {
            id: 'c2',
            interlocutorId: '3',
            type: 'assurance',
            status: 'En cours',
            startDate: '2023-06-01',
            endDate: '2024-05-31',
            premium: 1800,
            insurer: 'Groupama',
            policyNumber: 'GRP-2023-002',
            description: 'Assurance flotte',
            createdAt: '2023-06-01',
            updatedAt: '2023-06-01'
          }
        ],
        insuranceRequests: [],
        claims: [
          {
            id: 'cl1',
            interlocutorId: '3',
            type: 'materialRC50',
            date: '2024-08-15',
            amount: 1500,
            description: 'Collision avec un autre véhicule',
            responsible: true,
            percentage: 50,
            insurer: 'Groupama',
            status: 'Résolu',
            createdAt: '2024-08-15',
            updatedAt: '2024-09-15'
          }
        ],
        vehicles: [
          {
            id: 'v2',
            interlocutorId: '3',
            registration: 'EF-456-GH',
            brand: 'Renault',
            model: 'Master',
            year: 2021,
            type: 'Véhicule utilitaire',
            status: 'Assuré',
            createdAt: '2023-06-01',
            updatedAt: '2023-06-01'
          }
        ],
        drivers: [
          {
            id: 'd2',
            interlocutorId: '3',
            firstName: 'Pierre',
            lastName: 'Bernard',
            licenseNumber: '234567890',
            licenseType: 'C',
            status: 'Actif',
            createdAt: '2023-06-01',
            updatedAt: '2023-06-01'
          }
        ],
        events: [],
        userAccount: {
          userId: 'u2',
          permissions: ['read'],
          lastLogin: '2025-01-13'
        }
      },
      {
        id: '4',
        type: 'external',
        firstName: 'Sophie',
        lastName: 'Moreau',
        email: 'sophie.moreau@vtc.fr',
        phone: '01 55 66 77 88',
        company: 'Moreau VTC',
        address: '321 Rue de la Liberté, 31000 Toulouse',
        status: 'Inactif',
        role: 'client',
        createdAt: '2024-03-20',
        updatedAt: '2024-12-15',
        lastActivity: '2024-12-15',
        contracts: [
          {
            id: 'c3',
            interlocutorId: '4',
            type: 'assurance',
            status: 'Expiré',
            startDate: '2024-03-01',
            endDate: '2024-12-31',
            premium: 950,
            insurer: 'MACIF',
            policyNumber: 'MAC-2024-003',
            description: 'Assurance VTC',
            createdAt: '2024-03-01',
            updatedAt: '2024-03-01'
          }
        ],
        insuranceRequests: [],
        claims: [],
        vehicles: [],
        drivers: [],
        events: [],
        externalInfo: {
          source: 'phone',
          notes: 'Client historique, contrat non renouvelé',
          assignedTo: 'Lucas Petit'
        }
      }
    ];

    setInterlocutors(loadedInterlocutors.length > 0 ? loadedInterlocutors : mockInterlocutors);
  }, []);

  const filteredInterlocutors = interlocutors.filter(interlocutor => {
    const matchesFilter = filter === 'all' || interlocutor.type === filter;
    const matchesSearch = searchTerm === '' || 
      `${interlocutor.firstName} ${interlocutor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interlocutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (interlocutor.company && interlocutor.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
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

  const getRoleColor = (role: Interlocutor['role']) => {
    switch (role) {
      case 'client':
        return 'bg-blue-100 text-blue-800';
      case 'prospect':
        return 'bg-purple-100 text-purple-800';
      case 'partenaire':
        return 'bg-green-100 text-green-800';
      case 'fournisseur':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const breadcrumb = [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Interlocuteurs' }
  ];

  const actions = (
    <div className="flex space-x-3">
      <Link
        href="/dashboard/interlocutors/new"
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        + Ajouter un interlocuteur
      </Link>
      <Link
        href="/dashboard/interlocutors/create-complete"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        + Création complète
      </Link>
    </div>
  );

  return (
    <Layout
      title="Liste des Interlocuteurs"
      subtitle="Gestion des clients, prospects et utilisateurs"
      breadcrumb={breadcrumb}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par nom, email ou entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tous ({interlocutors.length})
              </button>
              <button
                onClick={() => setFilter('user')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Utilisateurs ({interlocutors.filter(i => i.type === 'user').length})
              </button>
              <button
                onClick={() => setFilter('external')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'external'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Externes ({interlocutors.filter(i => i.type === 'external').length})
              </button>
            </div>
          </div>
        </div>

        {/* Liste des interlocuteurs */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Interlocuteurs ({filteredInterlocutors.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredInterlocutors.map((interlocutor) => (
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(interlocutor.role)}`}>
                            {interlocutor.role}
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
                      <span>🚗 {interlocutor.vehicles.length} véhicule(s)</span>
                      <span>👨‍💼 {interlocutor.drivers.length} conducteur(s)</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/interlocutors/${interlocutor.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Voir la fiche
                      </Link>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Modifier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}