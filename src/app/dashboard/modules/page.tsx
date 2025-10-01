'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ModuleLink {
  id: string;
  sourceModule: string;
  targetModule: string;
  linkType: 'data' | 'workflow' | 'notification' | 'permission';
  status: 'active' | 'inactive' | 'pending';
  description: string;
  createdAt: string;
  createdBy: string;
}

export default function ModulesPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('modules');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedModules, setSelectedModules] = useState<{source: string, target: string}>({source: '', target: ''});
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
    { id: 'modules', name: 'Modules', icon: '🔗', href: '/dashboard/modules' },
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

  const availableModules = [
    { id: 'users', name: 'Utilisateurs', icon: '👥', description: 'Gestion des utilisateurs et comptes' },
    { id: 'interlocutors', name: 'Interlocuteurs', icon: '🤝', description: 'Gestion des partenaires et clients' },
    { id: 'financial', name: 'Financier', icon: '💰', description: 'Gestion financière et comptable' },
    { id: 'insurance', name: 'Assurance', icon: '🛡️', description: 'Gestion des assurances et risques' },
    { id: 'vehicles', name: 'Véhicules', icon: '🚗', description: 'Gestion du parc automobile' },
    { id: 'drivers', name: 'Conducteurs', icon: '👨‍💼', description: 'Gestion des conducteurs' },
    { id: 'claims', name: 'Sinistres', icon: '⚠️', description: 'Gestion des sinistres' },
    { id: 'reports', name: 'Rapports', icon: '📊', description: 'Génération de rapports' },
    { id: 'notifications', name: 'Notifications', icon: '🔔', description: 'Système de notifications' },
    { id: 'workflow', name: 'Workflow', icon: '⚡', description: 'Gestion des processus métier' }
  ];

  const moduleLinks: ModuleLink[] = [
    {
      id: '1',
      sourceModule: 'users',
      targetModule: 'interlocutors',
      linkType: 'data',
      status: 'active',
      description: 'Synchronisation des données utilisateur avec les interlocuteurs',
      createdAt: '2024-01-10',
      createdBy: 'Lilwen Song'
    },
    {
      id: '2',
      sourceModule: 'interlocutors',
      targetModule: 'financial',
      linkType: 'workflow',
      status: 'active',
      description: 'Création automatique de factures lors de nouveaux contrats',
      createdAt: '2024-01-12',
      createdBy: 'Lilwen Song'
    },
    {
      id: '3',
      sourceModule: 'vehicles',
      targetModule: 'insurance',
      linkType: 'data',
      status: 'active',
      description: 'Mise à jour automatique des polices d\'assurance',
      createdAt: '2024-01-15',
      createdBy: 'Lilwen Song'
    },
    {
      id: '4',
      sourceModule: 'claims',
      targetModule: 'notifications',
      linkType: 'notification',
      status: 'active',
      description: 'Alertes automatiques lors de nouveaux sinistres',
      createdAt: '2024-01-18',
      createdBy: 'Lilwen Song'
    },
    {
      id: '5',
      sourceModule: 'drivers',
      targetModule: 'vehicles',
      linkType: 'permission',
      status: 'pending',
      description: 'Gestion des permissions de conduite par véhicule',
      createdAt: '2024-01-20',
      createdBy: 'Lilwen Song'
    },
    {
      id: '6',
      sourceModule: 'financial',
      targetModule: 'reports',
      linkType: 'data',
      status: 'inactive',
      description: 'Génération automatique de rapports financiers',
      createdAt: '2024-01-22',
      createdBy: 'Lilwen Song'
    }
  ];

  const handleCreateLink = () => {
    if (selectedModules.source && selectedModules.target) {
      const newLink: ModuleLink = {
        id: Date.now().toString(),
        sourceModule: selectedModules.source,
        targetModule: selectedModules.target,
        linkType: 'data',
        status: 'pending',
        description: `Liaison entre ${availableModules.find(m => m.id === selectedModules.source)?.name} et ${availableModules.find(m => m.id === selectedModules.target)?.name}`,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: user?.name || 'Utilisateur'
      };
      // Ici on ajouterait la logique pour sauvegarder la liaison
      console.log('Nouvelle liaison créée:', newLink);
      setShowLinkModal(false);
      setSelectedModules({source: '', target: ''});
    }
  };

  const handleToggleLink = (linkId: string, newStatus: 'active' | 'inactive') => {
    console.log(`Changement de statut pour la liaison ${linkId}: ${newStatus}`);
    // Ici on ajouterait la logique pour modifier le statut
  };

  const handleDeleteLink = (linkId: string) => {
    console.log(`Suppression de la liaison ${linkId}`);
    // Ici on ajouterait la logique pour supprimer la liaison
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
                  🔗 Gestion des Liaisons de Modules
                </h1>
                <p className="text-sm text-gray-600">
                  Système de liaison/déliaison des modules (Liable/Unliable)
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
                  <span className="text-2xl">🔗</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Liaisons</p>
                  <p className="text-2xl font-bold text-blue-600">{moduleLinks.length}</p>
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
                    {moduleLinks.filter(l => l.status === 'active').length}
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
                    {moduleLinks.filter(l => l.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Modules</p>
                  <p className="text-2xl font-bold text-purple-600">{availableModules.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Liaisons de Modules</h2>
            <button
              onClick={() => setShowLinkModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + Créer une Liaison
            </button>
          </div>

          {/* Module Links Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module Cible
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type de Liaison
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Créé le
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {moduleLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {availableModules.find(m => m.id === link.sourceModule)?.icon}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {availableModules.find(m => m.id === link.sourceModule)?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {availableModules.find(m => m.id === link.targetModule)?.icon}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {availableModules.find(m => m.id === link.targetModule)?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          link.linkType === 'data' ? 'bg-blue-100 text-blue-800' :
                          link.linkType === 'workflow' ? 'bg-green-100 text-green-800' :
                          link.linkType === 'notification' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {link.linkType === 'data' ? 'Données' :
                           link.linkType === 'workflow' ? 'Workflow' :
                           link.linkType === 'notification' ? 'Notification' : 'Permission'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          link.status === 'active' ? 'bg-green-100 text-green-800' :
                          link.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {link.status === 'active' ? 'Actif' :
                           link.status === 'pending' ? 'En attente' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {link.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleLink(link.id, link.status === 'active' ? 'inactive' : 'active')}
                            className={`px-2 py-1 rounded text-xs ${
                              link.status === 'active' 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {link.status === 'active' ? 'Délier' : 'Lier'}
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="px-2 py-1 rounded text-xs bg-red-100 text-red-700 hover:bg-red-200"
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

          {/* Module Grid */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Modules Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableModules.map((module) => (
                <div key={module.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{module.icon}</span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{module.name}</h4>
                      <p className="text-xs text-gray-500">{module.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Link Creation Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Créer une Liaison</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Source
                </label>
                <select
                  value={selectedModules.source}
                  onChange={(e) => setSelectedModules({...selectedModules, source: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Sélectionner un module</option>
                  {availableModules.map(module => (
                    <option key={module.id} value={module.id}>
                      {module.icon} {module.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Cible
                </label>
                <select
                  value={selectedModules.target}
                  onChange={(e) => setSelectedModules({...selectedModules, target: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Sélectionner un module</option>
                  {availableModules.filter(m => m.id !== selectedModules.source).map(module => (
                    <option key={module.id} value={module.id}>
                      {module.icon} {module.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateLink}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Créer la Liaison
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

