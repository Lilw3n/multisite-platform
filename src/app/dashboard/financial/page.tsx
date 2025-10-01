'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FinancialPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('financial');
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

  const financialData = {
    totalRevenue: 125000,
    totalExpenses: 89000,
    netProfit: 36000,
    pendingReceivables: 15000,
    overdueReceivables: 7500
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
                  💰 Module Financier
                </h1>
                <p className="text-sm text-gray-600">
                  Gestion financière et comptabilité
                </p>
              </div>
              <div className="flex items-center space-x-4">
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
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
                  <p className="text-2xl font-bold text-green-600">
                    {financialData.totalRevenue.toLocaleString()}€
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">📉</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Dépenses Totales</p>
                  <p className="text-2xl font-bold text-red-600">
                    {financialData.totalExpenses.toLocaleString()}€
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bénéfice Net</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {financialData.netProfit.toLocaleString()}€
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⏰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Créances en Attente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {financialData.pendingReceivables.toLocaleString()}€
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/dashboard/financial/receivables" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-3xl">📊</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Créances</h3>
                  <p className="text-sm text-gray-600">Gestion des créances clients</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                {financialData.pendingReceivables.toLocaleString()}€ en attente
              </p>
            </Link>

            <Link href="/dashboard/financial/payments" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-3xl">💳</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Paiements</h3>
                  <p className="text-sm text-gray-600">Suivi des paiements</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                Historique des transactions
              </p>
            </Link>

            <Link href="/dashboard/financial/debits" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <span className="text-3xl">📉</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Débits</h3>
                  <p className="text-sm text-gray-600">Gestion des débits</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                {financialData.totalExpenses.toLocaleString()}€ de dépenses
              </p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}