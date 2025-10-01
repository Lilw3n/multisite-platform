'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PeriodsPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('periods');
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

  const periods = [
    {
      id: '1',
      name: 'Période 2024 Q1',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'Active',
      contracts: 8,
      totalPremium: 12500,
      claims: 2,
      description: 'Premier trimestre 2024 - Période active'
    },
    {
      id: '2',
      name: 'Période 2024 Q2',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      status: 'En attente',
      contracts: 0,
      totalPremium: 0,
      claims: 0,
      description: 'Deuxième trimestre 2024 - En préparation'
    },
    {
      id: '3',
      name: 'Période 2023 Q4',
      startDate: '2023-10-01',
      endDate: '2023-12-31',
      status: 'Clôturée',
      contracts: 12,
      totalPremium: 18900,
      claims: 5,
      description: 'Quatrième trimestre 2023 - Clôturée'
    },
    {
      id: '4',
      name: 'Période 2023 Q3',
      startDate: '2023-07-01',
      endDate: '2023-09-30',
      status: 'Clôturée',
      contracts: 10,
      totalPremium: 15200,
      claims: 3,
      description: 'Troisième trimestre 2023 - Clôturée'
    }
  ];

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
                  📅 Gestion des Périodes d'Assurance
                </h1>
                <p className="text-sm text-gray-600">
                  Gestion des périodes contractuelles et échéances
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
                  <span className="text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Périodes</p>
                  <p className="text-2xl font-bold text-blue-600">{periods.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Actives</p>
                  <p className="text-2xl font-bold text-green-600">
                    {periods.filter(p => p.status === 'Active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {periods.filter(p => p.status === 'En attente').length}
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
                  <p className="text-sm font-medium text-gray-600">Primes Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {periods.reduce((sum, p) => sum + p.totalPremium, 0).toLocaleString()}€
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Periods Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Liste des Périodes
                </h2>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  + Nouvelle Période
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Période
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contrats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Primes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sinistres
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {periods.map((period) => (
                    <tr key={period.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {period.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {period.startDate} - {period.endDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          period.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : period.status === 'En attente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {period.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {period.contracts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {period.totalPremium.toLocaleString()}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {period.claims}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {period.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => console.log(`Voir période ${period.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded text-xs bg-indigo-50 hover:bg-indigo-100"
                          >
                            Voir
                          </button>
                          <button 
                            onClick={() => console.log(`Modifier période ${period.id}`)}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => console.log(`Lier période ${period.id} aux contrats`)}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs bg-green-50 hover:bg-green-100"
                          >
                            Lier
                          </button>
                          <button 
                            onClick={() => console.log(`Délier période ${period.id}`)}
                            className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded text-xs bg-orange-50 hover:bg-orange-100"
                          >
                            Délier
                          </button>
                          <button 
                            onClick={() => console.log(`Supprimer période ${period.id}`)}
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
              <h3 className="text-lg font-medium text-gray-900">🔗 Liaisons de Modules Périodes</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">🛡️</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">LIÉ</span>
                  </div>
                  <h4 className="font-medium text-green-900">Périodes ↔ Contrats</h4>
                  <p className="text-xs text-green-700 mb-2">Gestion automatique des échéances</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Délier périodes-contrats')}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Délier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison périodes-contrats')}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Configurer
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">🔔</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">LIÉ</span>
                  </div>
                  <h4 className="font-medium text-blue-900">Périodes ↔ Notifications</h4>
                  <p className="text-xs text-blue-700 mb-2">Alertes d'échéances et renouvellements</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Délier périodes-notifications')}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Délier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison périodes-notifications')}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Configurer
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">💰</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">EN ATTENTE</span>
                  </div>
                  <h4 className="font-medium text-yellow-900">Périodes ↔ Financier</h4>
                  <p className="text-xs text-yellow-700 mb-2">Calcul automatique des primes par période</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Lier périodes-financier')}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Lier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison périodes-financier')}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Configurer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Activité Récente</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-lg">✅</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Période activée</p>
                    <p className="text-sm text-gray-500">Période 2024 Q1 - 8 contrats actifs</p>
                    <p className="text-xs text-gray-400">Il y a 2 heures</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-lg">⏳</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Période en préparation</p>
                    <p className="text-sm text-gray-500">Période 2024 Q2 - En attente d'activation</p>
                    <p className="text-xs text-gray-400">Il y a 4 heures</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-lg">📊</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Rapport de période généré</p>
                    <p className="text-sm text-gray-500">Période 2023 Q4 - 12 contrats, 5 sinistres</p>
                    <p className="text-xs text-gray-400">Il y a 1 jour</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-lg">🔔</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Alerte d'échéance</p>
                    <p className="text-sm text-gray-500">3 contrats arrivent à échéance ce mois</p>
                    <p className="text-xs text-gray-400">Il y a 2 jours</p>
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