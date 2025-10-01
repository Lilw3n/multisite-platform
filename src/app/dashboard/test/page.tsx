'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function TestModePage() {
  const [userRole, setUserRole] = useState<'admin' | 'internal' | 'external'>('admin');
  const [testMode, setTestMode] = useState(false);
  const [viewMode, setViewMode] = useState('admin');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('user_role') as 'admin' | 'internal' | 'external' || 'admin';
      const test = localStorage.getItem('test_mode') === 'true';
      const view = localStorage.getItem('view_mode') || 'admin';
      
      setUserRole(role);
      setTestMode(test);
      setViewMode(view);
    }
  }, []);

  const handleRoleChange = (role: 'admin' | 'internal' | 'external') => {
    setUserRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_role', role);
    }
    window.location.reload();
  };

  const handleTestModeToggle = () => {
    const newTestMode = !testMode;
    setTestMode(newTestMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('test_mode', newTestMode.toString());
    }
    window.location.reload();
  };

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('view_mode', mode);
    }
    window.location.reload();
  };

  const breadcrumb = [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Mode Test' }
  ];

  return (
    <Layout
      title="Mode Test"
      subtitle="Configuration des rôles et permissions"
      breadcrumb={breadcrumb}
    >
      <div className="space-y-6">
        {/* Bouton d'urgence */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-900">🚨 Bouton d'urgence</h3>
              <p className="text-sm text-red-700 mt-1">
                Si vous êtes coincé dans un mode, utilisez ce bouton pour revenir au mode administrateur normal.
              </p>
            </div>
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
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium flex items-center"
            >
              🚨 Retour Admin
            </button>
          </div>
        </div>

        {/* Configuration actuelle */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration actuelle</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">Rôle utilisateur</h4>
              <p className="text-sm text-gray-600 mt-1">{userRole}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">Mode test</h4>
              <p className="text-sm text-gray-600 mt-1">{testMode ? 'Actif' : 'Inactif'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">Mode de vue</h4>
              <p className="text-sm text-gray-600 mt-1">{viewMode}</p>
            </div>
          </div>
        </div>

        {/* Configuration des rôles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le rôle utilisateur</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleRoleChange('admin')}
              className={`p-4 rounded-lg border-2 ${
                userRole === 'admin' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">👑</div>
                <h4 className="font-medium text-gray-900">Administrateur</h4>
                <p className="text-sm text-gray-600 mt-1">Accès complet à tous les modules</p>
              </div>
            </button>
            
            <button
              onClick={() => handleRoleChange('internal')}
              className={`p-4 rounded-lg border-2 ${
                userRole === 'internal' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">👨‍💼</div>
                <h4 className="font-medium text-gray-900">Interne</h4>
                <p className="text-sm text-gray-600 mt-1">Accès limité selon le mode test</p>
              </div>
            </button>
            
            <button
              onClick={() => handleRoleChange('external')}
              className={`p-4 rounded-lg border-2 ${
                userRole === 'external' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🌐</div>
                <h4 className="font-medium text-gray-900">Externe</h4>
                <p className="text-sm text-gray-600 mt-1">Accès uniquement aux fiches personnelles</p>
              </div>
            </button>
          </div>
        </div>

        {/* Configuration du mode test */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mode test</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleTestModeToggle}
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
              Mode test {testMode ? 'actif' : 'inactif'}
            </span>
            <div className="text-sm text-gray-500">
              {testMode 
                ? 'Les sections Financier et Paramètres sont masquées pour les utilisateurs internes'
                : 'Toutes les sections sont visibles selon le rôle'
              }
            </div>
          </div>
        </div>

        {/* Configuration du mode de vue */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mode de vue</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleViewModeChange('admin')}
              className={`p-4 rounded-lg border-2 ${
                viewMode === 'admin' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">👑</div>
                <h4 className="font-medium text-gray-900">Administrateur</h4>
                <p className="text-sm text-gray-600 mt-1">Vue complète avec menu latéral</p>
              </div>
            </button>
            
            <button
              onClick={() => handleViewModeChange('external')}
              className={`p-4 rounded-lg border-2 ${
                viewMode === 'external' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🌐</div>
                <h4 className="font-medium text-gray-900">Utilisateur Externe</h4>
                <p className="text-sm text-gray-600 mt-1">Vue simplifiée sans menu latéral</p>
              </div>
            </button>
          </div>
        </div>

        {/* Liens de test */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pages de test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/insurance/drivers"
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">👨‍💼</div>
                <h4 className="font-medium text-gray-900">Liste des chauffeurs</h4>
                <p className="text-sm text-gray-600 mt-1">Voir la liste avec permissions</p>
              </div>
            </Link>
            
            <Link
              href="/dashboard/external"
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🌐</div>
                <h4 className="font-medium text-gray-900">Vue externe</h4>
                <p className="text-sm text-gray-600 mt-1">Sélection d'interlocuteur</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
