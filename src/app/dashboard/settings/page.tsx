'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('settings');
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
                  ⚙️ Paramètres du Système
                </h1>
                <p className="text-sm text-gray-600">
                  Configuration et administration
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔧 Paramètres Généraux
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    defaultValue="Plateforme Multisite"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    defaultValue="contact@multisite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Devise par défaut
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                    <option value="GBP">Livre Sterling (£)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔒 Sécurité
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Authentification à deux facteurs
                    </h4>
                    <p className="text-sm text-gray-500">
                      Ajouter une couche de sécurité supplémentaire
                    </p>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
                    Activer
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Sessions automatiques
                    </h4>
                    <p className="text-sm text-gray-500">
                      Déconnexion automatique après inactivité
                    </p>
                  </div>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm">
                    Configurer
                  </button>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Informations Système
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Version</span>
                  <span className="text-sm font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dernière mise à jour</span>
                  <span className="text-sm font-medium">15 Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Utilisateurs actifs</span>
                  <span className="text-sm font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Statut</span>
                  <span className="text-sm font-medium text-green-600">✅ Opérationnel</span>
                </div>
              </div>
            </div>

            {/* Backup & Maintenance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💾 Sauvegarde & Maintenance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Sauvegarde automatique
                    </h4>
                    <p className="text-sm text-gray-500">
                      Sauvegarde quotidienne à 2h00
                    </p>
                  </div>
                  <span className="text-sm text-green-600">✅ Activée</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Dernière sauvegarde
                    </h4>
                    <p className="text-sm text-gray-500">
                      15 Jan 2024 - 02:00
                    </p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                    Télécharger
                  </button>
                </div>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm">
                  🔧 Maintenance du système
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium">
              💾 Sauvegarder les paramètres
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}