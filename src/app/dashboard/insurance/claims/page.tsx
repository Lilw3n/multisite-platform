'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import ClaimForm from '@/components/ClaimForm';
import { Claim } from '@/types/interlocutor';

export default function ClaimsPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('claims');
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');

      if (token && email && name) {
        setUser({ email, name });
        setIsLoading(false);
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
    }
    router.push('/login');
  };

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', href: '/dashboard' },
    { id: 'users', name: 'Utilisateurs', icon: '👥', href: '/dashboard/users' },
    { id: 'roles', name: 'Rôles', icon: '🔐', href: '/dashboard/users/roles' },
    { id: 'permissions', name: 'Permissions', icon: '⚡', href: '/dashboard/users/permissions' },
    { id: 'interlocutors', name: 'Interlocuteurs', icon: '🤝', href: '/dashboard/interlocutors' },
    { id: 'financial', name: 'Financier', icon: '💰', href: '/dashboard/financial' },
    { id: 'receivables', name: 'Créances', icon: '📊', href: '/dashboard/financial/receivables' },
    { id: 'payments', name: 'Paiements', icon: '💳', href: '/dashboard/financial/payments' },
    { id: 'debits', name: 'Débits', icon: '📉', href: '/dashboard/financial/debits' },
    { id: 'insurance', name: 'Assurance', icon: '🛡️', href: '/dashboard/insurance' },
    { id: 'vehicles', name: 'Véhicules', icon: '🚗', href: '/dashboard/insurance/vehicles' },
    { id: 'drivers', name: 'Conducteurs', icon: '👨‍💼', href: '/dashboard/insurance/drivers' },
    { id: 'claims', name: 'Sinistres', icon: '⚠️', href: '/dashboard/insurance/claims' },
    { id: 'periods', name: 'Périodes', icon: '📅', href: '/dashboard/insurance/periods' },
    { id: 'settings', name: 'Paramètres', icon: '⚙️', href: '/dashboard/settings' },
  ];

  // Données de démonstration
  const mockClaims: Claim[] = [
    {
      id: 'SIN-2024-001',
      interlocutorId: '1',
      type: 'materialRC100',
      date: '2024-01-10',
      amount: 2500,
      description: 'Accident sur autoroute A1',
      responsible: true,
      percentage: 100,
      insurer: 'AXA',
      status: 'En cours',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    {
      id: 'SIN-2024-002',
      interlocutorId: '1',
      type: 'theft',
      date: '2024-01-08',
      amount: 0,
      description: 'Véhicule volé dans un parking',
      responsible: false,
      percentage: 0,
      insurer: 'Groupama',
      status: 'Résolu',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    }
  ];

  useEffect(() => {
    setClaims(mockClaims);
  }, []);

  const handleClaimSuccess = (claim: Claim) => {
    if (editingClaim) {
      setClaims(prev => prev.map(c => c.id === claim.id ? claim : c));
      setEditingClaim(null);
    } else {
      setClaims(prev => [...prev, claim]);
    }
    setShowClaimForm(false);
  };

  const handleEditClaim = (claim: Claim) => {
    setEditingClaim(claim);
    setShowClaimForm(true);
  };

  const handleCancelForm = () => {
    setShowClaimForm(false);
    setEditingClaim(null);
  };

  const handleDeleteClaim = (claimId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce sinistre ?')) {
      setClaims(prev => prev.filter(c => c.id !== claimId));
    }
  };

  const getClaimTypeLabel = (type: Claim['type']) => {
    const types = {
      materialRC100: 'Matériel RC 100%',
      materialRC50: 'Matériel RC 50%',
      materialRC25: 'Matériel RC 25%',
      materialRC0: 'Matériel RC 0%',
      bodilyRC100: 'Corporel RC 100%',
      bodilyRC50: 'Corporel RC 50%',
      bodilyRC25: 'Corporel RC 25%',
      bodilyRC0: 'Corporel RC 0%',
      glassBreakage: 'Bris de glace',
      theft: 'Vol',
      fire: 'Incendie',
      naturalDisaster: 'Catastrophe naturelle'
    };
    return types[type] || type;
  };

  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'Résolu':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'En attente':
        return 'bg-gray-100 text-gray-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-sm text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const breadcrumb = [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Assurance', href: '/dashboard/insurance' },
    { label: 'Sinistres' }
  ];

  const actions = (
    <button
      onClick={() => setShowClaimForm(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      + Nouveau sinistre
    </button>
  );

  if (showClaimForm) {
    return (
      <ClaimForm
        interlocutorId="1"
        onSuccess={handleClaimSuccess}
        onCancel={handleCancelForm}
        initialData={editingClaim || undefined}
        isEditing={!!editingClaim}
      />
    );
  }

  return (
    <Layout
      title="Gestion des Sinistres"
      subtitle="Suivi et gestion des sinistres d'assurance"
      breadcrumb={breadcrumb}
      actions={actions}
    >
      <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sinistres</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Cours</p>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Résolus</p>
                  <p className="text-2xl font-bold text-green-600">1</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <span className="text-2xl">⏸️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-gray-600">1</p>
                </div>
              </div>
            </div>
          </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sinistres</p>
                <p className="text-2xl font-bold text-gray-900">{claims.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Cours</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {claims.filter(c => c.status === 'En cours').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-green-600">
                  {claims.filter(c => c.status === 'Résolu').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <span className="text-2xl">⏸️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-600">
                  {claims.filter(c => c.status === 'En attente').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Liste des Sinistres
            </h2>
          </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      N° Sinistre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Véhicule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conducteur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {claim.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {claim.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {claim.vehicle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {claim.driver}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {claim.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          claim.status === 'Résolu' 
                            ? 'bg-green-100 text-green-800'
                            : claim.status === 'En cours'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {claim.amount > 0 ? `${claim.amount.toLocaleString()}€` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => console.log('Voir sinistre ' + claim.id)}
                            className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded text-xs bg-indigo-50 hover:bg-indigo-100"
                          >
                            Voir
                          </button>
                          <button 
                            onClick={() => console.log('Modifier sinistre ' + claim.id)}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => console.log('Lier sinistre ' + claim.id + ' au véhicule')}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs bg-green-50 hover:bg-green-100"
                          >
                            Lier
                          </button>
                          <button 
                            onClick={() => console.log('Délier sinistre ' + claim.id)}
                            className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded text-xs bg-orange-50 hover:bg-orange-100"
                          >
                            Délier
                          </button>
                          <button 
                            onClick={() => console.log('Supprimer sinistre ' + claim.id)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded text-xs bg-red-50 hover:bg-red-100"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Module Linking Section */}
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">🔗 Liaisons de Modules Sinistres</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">🚗</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">LIÉ</span>
                  </div>
                  <h4 className="font-medium text-green-900">Sinistres ↔ Véhicules</h4>
                  <p className="text-xs text-green-700 mb-2">Mise à jour automatique des polices</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Délier sinistres-véhicules')}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Délier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison sinistres-véhicules')}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Configurer
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">👨‍💼</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">LIÉ</span>
                  </div>
                  <h4 className="font-medium text-blue-900">Sinistres ↔ Conducteurs</h4>
                  <p className="text-xs text-blue-700 mb-2">Historique des sinistres par conducteur</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Délier sinistres-conducteurs')}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Délier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison sinistres-conducteurs')}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Configurer
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">🔔</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">EN ATTENTE</span>
                  </div>
                  <h4 className="font-medium text-yellow-900">Sinistres ↔ Notifications</h4>
                  <p className="text-xs text-yellow-700 mb-2">Alertes automatiques de nouveaux sinistres</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Lier sinistres-notifications')}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Lier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison sinistres-notifications')}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Configurer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}