'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RolesPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('roles');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    level: 0,
    color: '#8B5CF6'
  });
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

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setEditForm({
      name: role.name,
      description: role.description,
      level: role.level,
      color: role.color
    });
    setShowEditModal(true);
  };

  const handleViewPermissions = (role: any) => {
    setSelectedRole(role);
    setShowPermissionsModal(true);
  };

  const handleSaveRole = () => {
    console.log('Sauvegarde du rôle:', editForm);
    // Ici on sauvegarderait les modifications
    setShowEditModal(false);
    setSelectedRole(null);
  };

  const handleAssignPermission = (permissionId: string) => {
    console.log(`Assigner permission ${permissionId} au rôle ${selectedRole?.name}`);
    // Ici on assignerait la permission au rôle
  };

  const handleRemovePermission = (permissionId: string) => {
    console.log(`Retirer permission ${permissionId} du rôle ${selectedRole?.name}`);
    // Ici on retirerait la permission du rôle
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

  const roles = [
    {
      id: '1',
      name: 'Administrateur',
      level: 0,
      description: 'Accès complet à toutes les fonctionnalités du système',
      color: '#8B5CF6',
      permissions: ['all'],
      usersCount: 1,
      isSystem: true,
      createdAt: '2023-01-01',
      capabilities: [
        'Gestion des utilisateurs',
        'Gestion des rôles et permissions',
        'Accès aux données financières',
        'Gestion des assurances',
        'Configuration système'
      ]
    },
    {
      id: '2',
      name: 'Gestionnaire',
      level: 1,
      description: 'Gestion des opérations quotidiennes et supervision',
      color: '#3B82F6',
      permissions: ['users.read', 'financial.read', 'insurance.read', 'reports.create'],
      usersCount: 2,
      isSystem: false,
      createdAt: '2023-01-15',
      capabilities: [
        'Lecture des données utilisateurs',
        'Accès aux rapports financiers',
        'Gestion des contrats d\'assurance',
        'Création de rapports'
      ]
    },
    {
      id: '3',
      name: 'Agent Commercial',
      level: 2,
      description: 'Gestion des clients et prospection commerciale',
      color: '#10B981',
      permissions: ['interlocutors.manage', 'contracts.create', 'reports.read'],
      usersCount: 3,
      isSystem: false,
      createdAt: '2023-02-01',
      capabilities: [
        'Gestion des interlocuteurs',
        'Création de contrats',
        'Lecture des rapports',
        'Suivi des prospects'
      ]
    },
    {
      id: '4',
      name: 'Agent Assurance',
      level: 2,
      description: 'Spécialisé dans la gestion des dossiers d\'assurance',
      color: '#F59E0B',
      permissions: ['insurance.manage', 'claims.process', 'vehicles.manage'],
      usersCount: 2,
      isSystem: false,
      createdAt: '2023-02-15',
      capabilities: [
        'Gestion des véhicules',
        'Traitement des sinistres',
        'Gestion des polices',
        'Suivi des échéances'
      ]
    },
    {
      id: '5',
      name: 'Comptable',
      level: 1,
      description: 'Gestion des aspects financiers et comptables',
      color: '#EF4444',
      permissions: ['financial.manage', 'payments.process', 'reports.financial', 'users.read'],
      usersCount: 1,
      isSystem: false,
      createdAt: '2023-03-01',
      capabilities: [
        'Gestion des paiements',
        'Suivi des créances',
        'Rapports financiers',
        'Réconciliation comptable',
        'Lecture des données utilisateurs',
        'Accès aux données financières sensibles'
      ]
    },
    {
      id: '6',
      name: 'Utilisateur Standard',
      level: 4,
      description: 'Accès limité aux fonctionnalités de base',
      color: '#6B7280',
      permissions: ['profile.read', 'dashboard.read'],
      usersCount: 5,
      isSystem: false,
      createdAt: '2023-03-15',
      capabilities: [
        'Consultation du profil',
        'Accès au dashboard',
        'Lecture des notifications'
      ]
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
                  🔐 Gestion des Rôles
                </h1>
                <p className="text-sm text-gray-600">
                  Système de rôles hiérarchique avec permissions granulaires
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
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">🔐</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Rôles</p>
                  <p className="text-2xl font-bold text-purple-600">{roles.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {roles.reduce((sum, role) => sum + role.usersCount, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Permissions Uniques</p>
                  <p className="text-2xl font-bold text-green-600">24</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">🏗️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rôles Système</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {roles.filter(r => r.isSystem).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: role.color }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  </div>
                  <span className="text-sm text-gray-500">Niveau {role.level}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Utilisateurs:</span>
                    <span className="font-medium">{role.usersCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className={`font-medium ${role.isSystem ? 'text-purple-600' : 'text-blue-600'}`}>
                      {role.isSystem ? 'Système' : 'Personnalisé'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Créé le:</span>
                    <span className="font-medium">{role.createdAt}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Capacités:</h4>
                  <div className="space-y-1">
                    {role.capabilities.slice(0, 3).map((capability, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        {capability}
                      </div>
                    ))}
                    {role.capabilities.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{role.capabilities.length - 3} autres...
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Modifier
                  </button>
                  <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Permissions
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Role Hierarchy */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Hiérarchie des Rôles</h3>
              <p className="text-sm text-gray-600 mt-1">
                Le comptable a été élevé au rang 1 pour ses responsabilités financières critiques
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {roles
                  .sort((a, b) => a.level - b.level)
                  .map((role, index) => (
                    <div key={role.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: role.color }}
                        >
                          {role.level}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {role.name}
                            {role.name === 'Comptable' && (
                              <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                RANG ÉLEVÉ
                              </span>
                            )}
                          </h4>
                          <span className="text-xs text-gray-500">{role.usersCount} utilisateur(s)</span>
                        </div>
                        <p className="text-sm text-gray-600">{role.description}</p>
                        {role.name === 'Comptable' && (
                          <p className="text-xs text-orange-600 mt-1">
                            ⚠️ Accès privilégié aux données financières sensibles
                          </p>
                        )}
                      </div>
                      {index < roles.length - 1 && (
                        <div className="flex-shrink-0">
                          <div className="w-px h-8 bg-gray-300"></div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Role Modal */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Modifier le rôle: {selectedRole.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du rôle</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                  <select
                    value={editForm.level}
                    onChange={(e) => setEditForm({...editForm, level: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value={0}>0 - Administrateur</option>
                    <option value={1}>1 - Direction/Management</option>
                    <option value={2}>2 - Agents spécialisés</option>
                    <option value={3}>3 - Utilisateurs internes</option>
                    <option value={4}>4 - Utilisateurs externes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                  <input
                    type="color"
                    value={editForm.color}
                    onChange={(e) => setEditForm({...editForm, color: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveRole}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Permissions du rôle: {selectedRole.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Permissions assignées</h4>
                  <div className="space-y-2">
                    {selectedRole.permissions.map((permission: string) => (
                      <div key={permission} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm text-green-800">{permission}</span>
                        <button
                          onClick={() => handleRemovePermission(permission)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Permissions disponibles</h4>
                  <div className="space-y-2">
                    {['users.create', 'users.read', 'users.update', 'users.delete', 'financial.read', 'financial.manage', 'insurance.manage', 'interlocutors.manage'].map((permission) => (
                      !selectedRole.permissions.includes(permission) && (
                        <div key={permission} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{permission}</span>
                          <button
                            onClick={() => handleAssignPermission(permission)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Assigner
                          </button>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPermissionsModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}