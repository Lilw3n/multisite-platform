'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PermissionsPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('permissions');
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
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

  const permissions = [
    {
      id: '1',
      name: 'users.create',
      description: 'Créer de nouveaux utilisateurs',
      category: 'Utilisateurs',
      level: 'high',
      roles: ['Administrateur', 'Gestionnaire'],
      isActive: true
    },
    {
      id: '2',
      name: 'users.read',
      description: 'Consulter les informations utilisateurs',
      category: 'Utilisateurs',
      level: 'medium',
      roles: ['Administrateur', 'Gestionnaire', 'Agent Commercial'],
      isActive: true
    },
    {
      id: '3',
      name: 'users.update',
      description: 'Modifier les informations utilisateurs',
      category: 'Utilisateurs',
      level: 'high',
      roles: ['Administrateur', 'Gestionnaire'],
      isActive: true
    },
    {
      id: '4',
      name: 'users.delete',
      description: 'Supprimer des utilisateurs',
      category: 'Utilisateurs',
      level: 'critical',
      roles: ['Administrateur'],
      isActive: true
    },
    {
      id: '5',
      name: 'financial.read',
      description: 'Consulter les données financières',
      category: 'Financier',
      level: 'high',
      roles: ['Administrateur', 'Gestionnaire', 'Comptable'],
      isActive: true
    },
    {
      id: '6',
      name: 'financial.manage',
      description: 'Gérer les opérations financières',
      category: 'Financier',
      level: 'critical',
      roles: ['Administrateur', 'Comptable'],
      isActive: true
    },
    {
      id: '7',
      name: 'insurance.manage',
      description: 'Gérer les contrats d\'assurance',
      category: 'Assurance',
      level: 'high',
      roles: ['Administrateur', 'Agent Assurance'],
      isActive: true
    },
    {
      id: '8',
      name: 'interlocutors.manage',
      description: 'Gérer les interlocuteurs',
      category: 'Interlocuteurs',
      level: 'medium',
      roles: ['Administrateur', 'Agent Commercial'],
      isActive: true
    }
  ];

  const handleViewPermission = (permissionId: string) => {
    setSelectedPermission(permissionId);
    setShowModal(true);
    console.log(`Voir permission ${permissionId}`);
  };

  const handleEditPermission = (permissionId: string) => {
    console.log(`Modifier permission ${permissionId}`);
    // Ici on ouvrirait un formulaire d'édition
  };

  const handleTogglePermission = (permissionId: string) => {
    console.log(`Activer/Désactiver permission ${permissionId}`);
    // Ici on basculerait l'état actif/inactif
  };

  const handleAssignToRole = (permissionId: string) => {
    console.log(`Assigner permission ${permissionId} à un rôle`);
    // Ici on ouvrirait un modal d'assignation
  };

  const handleDeletePermission = (permissionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette permission ?')) {
      console.log(`Supprimer permission ${permissionId}`);
      // Ici on supprimerait la permission
    }
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
                  ⚡ Gestion des Permissions
                </h1>
                <p className="text-sm text-gray-600">
                  Système de permissions granulaires pour le contrôle d'accès
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
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Permissions</p>
                  <p className="text-2xl font-bold text-blue-600">{permissions.length}</p>
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
                    {permissions.filter(p => p.isActive).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">🔴</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Critiques</p>
                  <p className="text-2xl font-bold text-red-600">
                    {permissions.filter(p => p.level === 'critical').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Catégories</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {[...new Set(permissions.map(p => p.category))].length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Liste des Permissions
                </h2>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  + Nouvelle Permission
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Niveau
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {permission.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {permission.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {permission.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          permission.level === 'critical' ? 'bg-red-100 text-red-800' :
                          permission.level === 'high' ? 'bg-orange-100 text-orange-800' :
                          permission.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {permission.level === 'critical' ? 'Critique' :
                           permission.level === 'high' ? 'Élevé' :
                           permission.level === 'medium' ? 'Moyen' : 'Faible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {permission.roles.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          permission.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {permission.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleViewPermission(permission.id)}
                            className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded text-xs bg-indigo-50 hover:bg-indigo-100"
                          >
                            Voir
                          </button>
                          <button 
                            onClick={() => handleEditPermission(permission.id)}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleTogglePermission(permission.id)}
                            className={`px-2 py-1 rounded text-xs ${
                              permission.isActive 
                                ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {permission.isActive ? 'Désactiver' : 'Activer'}
                          </button>
                          <button 
                            onClick={() => handleAssignToRole(permission.id)}
                            className="text-purple-600 hover:text-purple-900 px-2 py-1 rounded text-xs bg-purple-50 hover:bg-purple-100"
                          >
                            Assigner
                          </button>
                          <button 
                            onClick={() => handleDeletePermission(permission.id)}
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

          {/* Permission Details Modal */}
          {showModal && selectedPermission && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Détails de la Permission
                  </h3>
                  
                  {(() => {
                    const permission = permissions.find(p => p.id === selectedPermission);
                    if (!permission) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nom</label>
                          <p className="text-sm text-gray-900">{permission.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <p className="text-sm text-gray-900">{permission.description}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                          <p className="text-sm text-gray-900">{permission.category}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Niveau</label>
                          <p className="text-sm text-gray-900">{permission.level}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rôles associés</label>
                          <p className="text-sm text-gray-900">{permission.roles.join(', ')}</p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        handleEditPermission(selectedPermission);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}