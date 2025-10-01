'use client';

import React from 'react';
import { useMode } from '@/contexts/ModeContext';

export default function UnifiedHeader() {
  const { userRole, testMode, viewMode, user, setUserRole, setTestMode, setViewMode, logout } = useMode();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🚀 Plateforme Multisite</h1>
            <p className="text-gray-600">
              Mode Test {testMode ? 'Actif' : 'Inactif'} - 
              Vue: {viewMode === 'admin' ? 'Administrateur' : viewMode === 'internal' ? 'Interne' : 'Externe'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mode Admin Button */}
            <button
              onClick={() => setUserRole('admin')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                userRole === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👑 MODE ADMIN
            </button>
            
            {/* Mode Interne Button */}
            <button
              onClick={() => setUserRole('internal')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                userRole === 'internal'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👨‍💼 MODE INTERNE
            </button>
            
            {/* Mode Externe Button */}
            <button
              onClick={() => setUserRole('external')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                userRole === 'external'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🌐 MODE EXTERNE
            </button>
            
            {/* Test Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Mode Test:</span>
              <button
                onClick={() => setTestMode(!testMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  testMode ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    testMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {testMode ? 'ACTIF' : 'INACTIF'}
              </span>
            </div>

            {/* View Mode Dropdown (seulement pour admin en mode normal) */}
            {userRole === 'admin' && !testMode && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Vue:</span>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as 'admin' | 'internal' | 'external')}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="admin">👑 Administrateur</option>
                  <option value="internal">👨‍💼 Interne</option>
                  <option value="external">🌐 Externe</option>
                </select>
              </div>
            )}

            {/* User Info */}
            <span className="text-sm text-gray-600">
              Connecté en tant que: {user?.name}
            </span>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Test Mode Banner */}
      {testMode && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-500">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Mode Test Actif</strong> / Vous simulez la vue: {
                  viewMode === 'admin' ? 'Administrateur' : 
                  viewMode === 'internal' ? 'Utilisateur Interne' : 
                  'Utilisateur Externe'
                }
              </p>
              {viewMode === 'external' && (
                <p className="text-sm text-yellow-600 mt-1">
                  En mode externe, vous voyez votre fiche personnelle. Utilisez les boutons ci-dessus pour changer de mode.
                </p>
              )}
              {viewMode === 'internal' && (
                <p className="text-sm text-yellow-600 mt-1">
                  En mode interne, les modules Financier et Paramètres sont masqués.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
