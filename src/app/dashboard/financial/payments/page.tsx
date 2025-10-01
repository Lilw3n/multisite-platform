'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentsPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('payments');
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

  const payments = [
    {
      id: 'PAY-2024-001',
      date: '2024-01-15',
      amount: 2500,
      client: 'SARL Transport Express',
      type: 'Prime d\'assurance',
      method: 'Virement bancaire',
      status: 'Confirmé',
      reference: 'REF-INS-001',
      dueDate: '2024-01-10',
      paidDate: '2024-01-15'
    },
    {
      id: 'PAY-2024-002',
      date: '2024-01-12',
      amount: 1200,
      client: 'Auto-École Moderne',
      type: 'Franchise sinistre',
      method: 'Chèque',
      status: 'En attente',
      reference: 'REF-SIN-002',
      dueDate: '2024-01-08',
      paidDate: null
    },
    {
      id: 'PAY-2024-003',
      date: '2024-01-10',
      amount: 850,
      client: 'Garage Mécanique Plus',
      type: 'Prime d\'assurance',
      method: 'Carte bancaire',
      status: 'Confirmé',
      reference: 'REF-INS-003',
      dueDate: '2024-01-05',
      paidDate: '2024-01-10'
    },
    {
      id: 'PAY-2024-004',
      date: '2024-01-08',
      amount: 3200,
      client: 'Taxi Services',
      type: 'Remboursement sinistre',
      method: 'Virement bancaire',
      status: 'Confirmé',
      reference: 'REF-SIN-004',
      dueDate: '2024-01-03',
      paidDate: '2024-01-08'
    },
    {
      id: 'PAY-2024-005',
      date: '2024-01-05',
      amount: 450,
      client: 'Location Véhicules Pro',
      type: 'Prime d\'assurance',
      method: 'Prélèvement',
      status: 'Échec',
      reference: 'REF-INS-005',
      dueDate: '2024-01-01',
      paidDate: null
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
                  💳 Gestion des Paiements
                </h1>
                <p className="text-sm text-gray-600">
                  Suivi et gestion des paiements et transactions financières
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
                  <span className="text-2xl">💳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Paiements</p>
                  <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmés</p>
                  <p className="text-2xl font-bold text-green-600">
                    {payments.filter(p => p.status === 'Confirmé').length}
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
                    {payments.filter(p => p.status === 'En attente').length}
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
                    {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}€
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Liste des Paiements
                </h2>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  + Nouveau Paiement
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Paiement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Méthode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Référence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.client}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {payment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.amount.toLocaleString()}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'Confirmé' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'En attente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                        <Link
                          href={`/dashboard/financial/payments/${payment.id}`}
                          className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded text-xs bg-indigo-50 hover:bg-indigo-100"
                        >
                          Voir
                        </Link>
                          <button 
                            onClick={() => console.log(`Modifier paiement ${payment.id}`)}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => console.log(`Lier paiement ${payment.id} à une créance`)}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs bg-green-50 hover:bg-green-100"
                          >
                            Lier
                          </button>
                          <button 
                            onClick={() => console.log(`Délier paiement ${payment.id}`)}
                            className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded text-xs bg-orange-50 hover:bg-orange-100"
                          >
                            Délier
                          </button>
                          <button 
                            onClick={() => console.log(`Supprimer paiement ${payment.id}`)}
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
              <h3 className="text-lg font-medium text-gray-900">🔗 Liaisons de Modules Paiements</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">📊</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">LIÉ</span>
                  </div>
                  <h4 className="font-medium text-green-900">Paiements ↔ Créances</h4>
                  <p className="text-xs text-green-700 mb-2">Rapprochement automatique des paiements</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Délier paiements-créances')}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Délier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison paiements-créances')}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Configurer
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">🛡️</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">LIÉ</span>
                  </div>
                  <h4 className="font-medium text-blue-900">Paiements ↔ Assurance</h4>
                  <p className="text-xs text-blue-700 mb-2">Paiement automatique des primes</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Délier paiements-assurance')}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Délier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison paiements-assurance')}
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
                  <h4 className="font-medium text-yellow-900">Paiements ↔ Notifications</h4>
                  <p className="text-xs text-yellow-700 mb-2">Alertes de paiements en retard</p>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => console.log('Lier paiements-notifications')}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Lier
                    </button>
                    <button 
                      onClick={() => console.log('Configurer liaison paiements-notifications')}
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
                    <p className="text-sm font-medium text-gray-900">Paiement confirmé</p>
                    <p className="text-sm text-gray-500">SARL Transport Express - 2,500€ - Virement bancaire</p>
                    <p className="text-xs text-gray-400">Il y a 2 heures</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-lg">⏳</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Paiement en attente</p>
                    <p className="text-sm text-gray-500">Auto-École Moderne - 1,200€ - Chèque</p>
                    <p className="text-xs text-gray-400">Il y a 4 heures</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <span className="text-lg">❌</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Échec de paiement</p>
                    <p className="text-sm text-gray-500">Location Véhicules Pro - 450€ - Prélèvement</p>
                    <p className="text-xs text-gray-400">Il y a 1 jour</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-lg">💳</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Nouveau paiement reçu</p>
                    <p className="text-sm text-gray-500">Taxi Services - 3,200€ - Virement bancaire</p>
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