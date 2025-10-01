'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReceivablesPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('receivables');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState<string | null>(null);
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

  const receivables = [
    {
      id: 'CRE-2024-001',
      client: 'SARL Transport Express',
      amount: 2500,
      dueDate: '2024-02-15',
      status: 'En attente',
      type: 'Prime d\'assurance',
      createdAt: '2024-01-15',
      description: 'Prime trimestrielle assurance véhicules',
      linkedPayments: 0,
      remainingAmount: 2500
    },
    {
      id: 'CRE-2024-002',
      client: 'Auto-École Moderne',
      amount: 1200,
      dueDate: '2024-01-30',
      status: 'En retard',
      type: 'Franchise sinistre',
      createdAt: '2024-01-10',
      description: 'Franchise pour sinistre collision',
      linkedPayments: 0,
      remainingAmount: 1200
    },
    {
      id: 'CRE-2024-003',
      client: 'Garage Mécanique Plus',
      amount: 850,
      dueDate: '2024-02-01',
      status: 'Partiellement payée',
      type: 'Prime d\'assurance',
      createdAt: '2024-01-05',
      description: 'Prime mensuelle assurance',
      linkedPayments: 1,
      remainingAmount: 350
    },
    {
      id: 'CRE-2024-004',
      client: 'Taxi Services',
      amount: 3200,
      dueDate: '2024-01-20',
      status: 'Payée',
      type: 'Remboursement sinistre',
      createdAt: '2024-01-03',
      description: 'Remboursement partiel sinistre vol',
      linkedPayments: 1,
      remainingAmount: 0
    },
    {
      id: 'CRE-2024-005',
      client: 'Location Véhicules Pro',
      amount: 450,
      dueDate: '2024-01-01',
      status: 'En litige',
      type: 'Prime d\'assurance',
      createdAt: '2023-12-20',
      description: 'Prime assurance moto',
      linkedPayments: 0,
      remainingAmount: 450
    }
  ];

  const handleCreateReceivable = () => {
    setShowCreateModal(true);
    console.log('Créer une nouvelle créance');
  };

  const handleViewReceivable = (receivableId: string) => {
    setSelectedReceivable(receivableId);
    console.log(`Voir créance ${receivableId}`);
  };

  const handleEditReceivable = (receivableId: string) => {
    console.log(`Modifier créance ${receivableId}`);
    // Ici on ouvrirait un formulaire d'édition
  };

  const handleLinkToPayment = (receivableId: string) => {
    setShowLinkModal(true);
    setSelectedReceivable(receivableId);
    console.log(`Lier créance ${receivableId} à un paiement`);
  };

  const handleUnlinkFromPayment = (receivableId: string) => {
    console.log(`Délier créance ${receivableId} des paiements`);
    // Ici on délierait la créance des paiements
  };

  const handleSendReminder = (receivableId: string) => {
    console.log(`Envoyer relance pour créance ${receivableId}`);
    // Ici on enverrait une relance
  };

  const handleDeleteReceivable = (receivableId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette créance ?')) {
      console.log(`Supprimer créance ${receivableId}`);
      // Ici on supprimerait la créance
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            🚀 Plateforme Multisite
          </h2>
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeModule === item.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setActiveModule(item.id)}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  📊 Gestion des Créances
                </h1>
                <p className="text-sm text-gray-600">
                  Suivi et recouvrement des créances clients
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Admin Mode Indicator */}
                <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                  <span className="text-lg">👑</span>
                  <span className="text-sm font-medium text-purple-800">MODE ADMIN</span>
                </div>
                <span className="text-sm text-gray-700">
                  Connecté en tant que: <strong>{user?.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Créances</p>
                  <p className="text-2xl font-bold text-blue-600">{receivables.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Payées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {receivables.filter(r => r.status === 'Payée').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Retard</p>
                  <p className="text-2xl font-bold text-red-600">
                    {receivables.filter(r => r.status === 'En retard').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Montant Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {receivables.reduce((sum, r) => sum + r.remainingAmount, 0).toLocaleString()}€
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Créances Clients</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleCreateReceivable}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                + Nouvelle Créance
              </button>
              <button
                onClick={() => console.log('Exporter les créances')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                📊 Exporter
              </button>
              <button
                onClick={() => console.log('Envoyer relances groupées')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                📧 Relances
              </button>
            </div>
          </div>

          {/* Receivables Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Créance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Échéance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {receivables.map((receivable) => (
                    <tr key={receivable.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {receivable.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {receivable.createdAt}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {receivable.client}
                        </div>
                        <div className="text-sm text-gray-500">
                          {receivable.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receivable.amount.toLocaleString()}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {receivable.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          receivable.status === 'Payée' ? 'bg-green-100 text-green-800' :
                          receivable.status === 'En retard' ? 'bg-red-100 text-red-800' :
                          receivable.status === 'En litige' ? 'bg-orange-100 text-orange-800' :
                          receivable.status === 'Partiellement payée' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {receivable.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {receivable.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receivable.remainingAmount.toLocaleString()}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleViewReceivable(receivable.id)}
                            className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded text-xs bg-indigo-50 hover:bg-indigo-100"
                          >
                            Voir
                          </button>
                          <button 
                            onClick={() => handleEditReceivable(receivable.id)}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleLinkToPayment(receivable.id)}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs bg-green-50 hover:bg-green-100"
                          >
                            Lier
                          </button>
                          <button 
                            onClick={() => handleUnlinkFromPayment(receivable.id)}
                            className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded text-xs bg-orange-50 hover:bg-orange-100"
                          >
                            Délier
                          </button>
                          <button 
                            onClick={() => handleSendReminder(receivable.id)}
                            className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded text-xs bg-yellow-50 hover:bg-yellow-100"
                          >
                            Relancer
                          </button>
                          <button 
                            onClick={() => handleDeleteReceivable(receivable.id)}
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
              <h3 className="text-lg font-medium text-gray-900">🔗 Liaisons de Modules Créances</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">💳</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">LIÉ</span>
                  </div>
                  <h4 className="font-medium text-green-900">Créances ↔ Paiements</h4>
                  <p className="text-xs text-green-700 mb-2">Rapprochement automatique des paiements</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Délier créances-paiements')}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Délier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison créances-paiements')}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Configurer
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">🤝</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">LIÉ</span>
                  </div>
                  <h4 className="font-medium text-blue-900">Créances ↔ Interlocuteurs</h4>
                  <p className="text-xs text-blue-700 mb-2">Gestion automatique des créances clients</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Délier créances-interlocuteurs')}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Délier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison créances-interlocuteurs')}
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
                  <h4 className="font-medium text-yellow-900">Créances ↔ Notifications</h4>
                  <p className="text-xs text-yellow-700 mb-2">Alertes automatiques de relances</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Lier créances-notifications')}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Lier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison créances-notifications')}
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