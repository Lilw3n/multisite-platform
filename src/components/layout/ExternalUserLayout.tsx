'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ExternalUserLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  selectedInterlocutor?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ExternalUserLayout({ 
  children, 
  title, 
  subtitle, 
  selectedInterlocutor 
}: ExternalUserLayoutProps) {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  const [viewMode, setViewMode] = useState('external');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      const testMode = localStorage.getItem('test_mode') === 'true';
      const view = localStorage.getItem('view_mode') || 'external';

      if (token && email && name) {
        setUser({ email, name });
        setIsTestMode(testMode);
        setViewMode(view);
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
      localStorage.removeItem('test_mode');
      localStorage.removeItem('view_mode');
    }
    router.push('/login');
  };

  const toggleTestMode = () => {
    const newTestMode = !isTestMode;
    setIsTestMode(newTestMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('test_mode', newTestMode.toString());
    }
  };

  const changeViewMode = (mode: string) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('view_mode', mode);
    }
    // Recharger la page pour appliquer le nouveau mode
    window.location.reload();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🚀 Plateforme Multisite</h1>
              <p className="text-gray-600">Mode Test - Utilisateur Externe</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Emergency Admin Button */}
              <button
                onClick={() => {
                  // Forcer le retour au mode admin
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('user_role', 'admin');
                    localStorage.setItem('test_mode', 'false');
                    localStorage.setItem('view_mode', 'admin');
                    window.location.href = '/dashboard';
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                title="🚨 BOUTON D'URGENCE - Revenir au mode Admin"
              >
                🚨 ADMIN
              </button>

              {/* Mode Admin Button */}
              <button
                onClick={() => changeViewMode('admin')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                👑 MODE ADMIN
              </button>
              
              {/* Test Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Mode Test:</span>
                <button
                  onClick={toggleTestMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isTestMode ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isTestMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {isTestMode ? 'ACTIF' : 'INACTIF'}
                </span>
              </div>

              {/* View Mode Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Vue:</span>
                <select
                  value={viewMode}
                  onChange={(e) => changeViewMode(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="external">🌐 Utilisateurs Externes</option>
                  <option value="admin">👑 Administrateur</option>
                </select>
              </div>

              {/* User Info */}
              <span className="text-sm text-gray-600">
                Connecté en tant que: {user.name}
              </span>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Test Mode Banner */}
      {isTestMode && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-500">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Mode Test Actif</strong> / Vous simulez la vue: {viewMode === 'external' ? 'Utilisateur Externe' : 'Administrateur'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex space-x-6">
          <button
            onClick={() => window.location.href = '/dashboard/external'}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            🏠 Accueil Externe
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/external/search'}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            🔍 Recherche
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/external/simulate'}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            🎭 Simulation
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/test'}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            ⚙️ Configuration
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            👑 Dashboard Admin
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {selectedInterlocutor ? (
          <div className="space-y-6">
            {/* Interlocutor Selection Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">👤</span>
                <div>
                  <h3 className="text-lg font-medium text-blue-900">
                    Fiche personnelle de {selectedInterlocutor.name}
                  </h3>
                  <p className="text-blue-700">{selectedInterlocutor.email}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            {children}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Page Title */}
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
            </div>

            {/* Main Content */}
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
