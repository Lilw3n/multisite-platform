'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InsurancePage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('insurance');
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

  const insuranceStats = {
    totalVehicles: 12,
    activePolicies: 8,
    pendingClaims: 2,
    totalCoverage: 2500000,
    monthlyPremium: 15000,
    claimsThisMonth: 1
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
                  🛡️ Module Assurance
                </h1>
                <p className="text-sm text-gray-600">
                  Gestion complète des assurances et des risques
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
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🚗</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Véhicules Assurés</p>
                  <p className="text-2xl font-bold text-blue-600">{insuranceStats.totalVehicles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Politiques Actives</p>
                  <p className="text-2xl font-bold text-green-600">{insuranceStats.activePolicies}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sinistres en Attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{insuranceStats.pendingClaims}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Couverture Totale</p>
                  <p className="text-2xl font-bold text-purple-600">{insuranceStats.totalCoverage.toLocaleString()}€</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Prime Mensuelle</p>
                  <p className="text-2xl font-bold text-indigo-600">{insuranceStats.monthlyPremium.toLocaleString()}€</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sinistres ce Mois</p>
                  <p className="text-2xl font-bold text-red-600">{insuranceStats.claimsThisMonth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Module Linking Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">🔗 Liaisons de Modules Assurance</h3>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                + Créer une Liaison
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">🚗</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">LIÉ</span>
                </div>
                <h4 className="font-medium text-blue-900">Véhicules ↔ Conducteurs</h4>
                <p className="text-xs text-blue-700">Synchronisation automatique des permis</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">⚠️</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">LIÉ</span>
                </div>
                <h4 className="font-medium text-green-900">Sinistres ↔ Véhicules</h4>
                <p className="text-xs text-green-700">Mise à jour automatique des polices</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">📅</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">EN ATTENTE</span>
                </div>
                <h4 className="font-medium text-yellow-900">Périodes ↔ Notifications</h4>
                <p className="text-xs text-yellow-700">Alertes d'échéances en cours</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">💰</span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">DÉLIÉ</span>
                </div>
                <h4 className="font-medium text-gray-900">Assurance ↔ Financier</h4>
                <p className="text-xs text-gray-700">Liaison désactivée</p>
              </div>
            </div>
          </div>

          {/* Insurance Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard/insurance/vehicles" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-3xl">🚗</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Gestion des Véhicules</h3>
                  <p className="text-sm text-gray-600">Assurance auto, moto, poids lourds</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Véhicules assurés:</span>
                  <span className="font-medium">{insuranceStats.totalVehicles}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Politiques actives:</span>
                  <span className="font-medium">{insuranceStats.activePolicies}</span>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/insurance/drivers" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-3xl">👨‍💼</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Conducteurs</h3>
                  <p className="text-sm text-gray-600">Gestion des permis et conducteurs</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Conducteurs actifs:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Permis valides:</span>
                  <span className="font-medium text-green-600">3</span>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/insurance/claims" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <span className="text-3xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sinistres</h3>
                  <p className="text-sm text-gray-600">Gestion des déclarations de sinistres</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">En attente:</span>
                  <span className="font-medium text-yellow-600">{insuranceStats.pendingClaims}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ce mois:</span>
                  <span className="font-medium">{insuranceStats.claimsThisMonth}</span>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/insurance/periods" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-3xl">📅</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Périodes d'Assurance</h3>
                  <p className="text-sm text-gray-600">Gestion des contrats et échéances</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contrats actifs:</span>
                  <span className="font-medium">{insuranceStats.activePolicies}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Échéances ce mois:</span>
                  <span className="font-medium text-orange-600">2</span>
                </div>
              </div>
            </Link>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <span className="text-3xl">📊</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Rapports & Statistiques</h3>
                  <p className="text-sm text-gray-600">Analyses et tableaux de bord</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rapports générés:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dernière MAJ:</span>
                  <span className="font-medium">Aujourd'hui</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <span className="text-3xl">⚙️</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
                  <p className="text-sm text-gray-600">Paramètres et tarifs assurance</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tarifs configurés:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assureurs:</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
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
                    <p className="text-sm font-medium text-gray-900">Nouveau contrat d'assurance créé</p>
                    <p className="text-sm text-gray-500">Peugeot 308 - Contrat #INS-2024-001</p>
                    <p className="text-xs text-gray-400">Il y a 2 heures</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-lg">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sinistre déclaré</p>
                    <p className="text-sm text-gray-500">Renault Clio - Sinistre #SIN-2024-002</p>
                    <p className="text-xs text-gray-400">Il y a 4 heures</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-lg">📋</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Paiement de prime reçu</p>
                    <p className="text-sm text-gray-500">1,200€ - Contrat #INS-2024-001</p>
                    <p className="text-xs text-gray-400">Il y a 1 jour</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <span className="text-lg">🚨</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Contrat expiré</p>
                    <p className="text-sm text-gray-500">Citroën C3 - Contrat #INS-2023-045</p>
                    <p className="text-xs text-gray-400">Il y a 3 jours</p>
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
