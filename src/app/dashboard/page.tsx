'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ModeManager from '@/components/layout/ModeManager';
import MobileDashboard from '@/components/mobile/MobileDashboard';

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'internal' | 'external'>('admin');
  const [testMode, setTestMode] = useState(false);
  const [viewMode, setViewMode] = useState('admin');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      const role = localStorage.getItem('user_role') as 'admin' | 'internal' | 'external' || 'admin';
      const test = localStorage.getItem('test_mode') === 'true';
      const view = localStorage.getItem('view_mode') || 'admin';
      
      if (token && email && name) {
        setUser({ email, name });
        setUserRole(role);
        setTestMode(test);
        setViewMode(view);
        setIsLoading(false);
      } else {
        router.push('/login');
      }

      // Détecter mobile
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_role');
      localStorage.removeItem('test_mode');
      localStorage.removeItem('view_mode');
    }
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Version mobile
  if (isMobile) {
    return <MobileDashboard userRole={userRole} />;
  }

  // En mode externe, rediriger vers la recherche d'interlocuteur
  if (viewMode === 'external') {
    router.push('/dashboard/external/search');
    return null;
  }

  // En mode interne, masquer certains modules (financier et paramètres)
  const showFinancial = userRole !== 'internal';
  const showSettings = userRole !== 'internal';

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', href: '/dashboard' },
    { id: 'users', name: 'Utilisateurs', icon: '👥', href: '/dashboard/users' },
    { id: 'interlocutors', name: 'Interlocuteurs', icon: '🤝', href: '/dashboard/interlocutors' },
    ...(showFinancial ? [
      { id: 'financial', name: 'Financier', icon: '💰', href: '/dashboard/financial' },
      { id: 'receivables', name: 'Créances', icon: '📊', href: '/dashboard/financial/receivables' },
      { id: 'payments', name: 'Paiements', icon: '💳', href: '/dashboard/financial/payments' },
      { id: 'debits', name: 'Débits', icon: '📉', href: '/dashboard/financial/debits' }
    ] : []),
    { id: 'insurance', name: 'Assurance', icon: '🛡️', href: '/dashboard/insurance' },
    { id: 'vehicles', name: 'Véhicules', icon: '🚗', href: '/dashboard/insurance/vehicles' },
    { id: 'drivers', name: 'Conducteurs', icon: '👨‍💼', href: '/dashboard/insurance/drivers' },
    { id: 'claims', name: 'Sinistres', icon: '⚠️', href: '/dashboard/insurance/claims' },
    { id: 'periods', name: 'Périodes', icon: '📅', href: '/dashboard/insurance/periods' },
    ...(showSettings ? [
      { id: 'settings', name: 'Paramètres', icon: '⚙️', href: '/dashboard/settings' },
      { id: 'roles', name: 'Rôles', icon: '🔒', href: '/dashboard/settings/roles' },
      { id: 'permissions', name: 'Permissions', icon: '⚡', href: '/dashboard/settings/permissions' }
    ] : [])
  ];

  return (
    <ModeManager>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              🏠 DiddyHome
            </h2>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    item.id === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard Principal</h1>
                  <p className="text-gray-600">Plateforme Multisite avec Système de Rôles Hiérarchique</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Connecté en tant que {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            <div className="space-y-6">
              {/* Welcome Message */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Bienvenue {user.name} !
                </h2>
                <p className="text-gray-600">
                  Vous êtes connecté avec succès en tant que {user.email}
                </p>
                {testMode && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <strong>Mode Test Actif</strong> - Vous simulez la vue: {
                        viewMode === 'admin' ? 'Administrateur' : 
                        viewMode === 'internal' ? 'Utilisateur Interne' : 
                        'Utilisateur Externe'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Utilisateurs</h3>
                      <p className="text-3xl font-bold text-blue-600">5</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Interlocuteurs</h3>
                      <p className="text-3xl font-bold text-green-600">12</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Revenus</h3>
                      <p className="text-3xl font-bold text-yellow-600">125K€</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Modules Disponibles</h3>
                  <div className="space-y-2">
                    {navigationItems.slice(1).map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Système de Rôles</h3>
                  <p className="text-gray-600 mb-4">
                    Gestion des permissions et des accès utilisateurs
                  </p>
                  <Link
                    href="/dashboard/test"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Configurer les modes
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ModeManager>
  );
}