'use client';

import React from 'react';
import { useAuth } from '@/contexts/MinimalAuthContext';
import { RoleService } from '@/lib/roles';
import { 
  User, 
  Settings, 
  LogOut, 
  TestTube, 
  Eye, 
  EyeOff,
  Crown,
  Users,
  Building
} from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { user, logout, viewMode, setViewMode, testMode, toggleTestMode } = useAuth();

  if (!user) return null;

  const highestRank = RoleService.getUserHighestRank(user);
  const isAdmin = highestRank?.rank.level === 0;

  const handleViewModeChange = (mode: 'admin' | 'internal' | 'external') => {
    setViewMode({
      type: mode,
      isSimulated: true,
      userId: mode !== 'admin' ? user.id : undefined,
      rankId: mode !== 'admin' ? highestRank?.rankId : undefined,
      siteId: user.sites[0]?.id
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Crown className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Plateforme Multisite
              </h1>
              <p className="text-sm text-gray-500">
                Système de Rôles Hiérarchique
              </p>
            </div>
          </div>

          {/* Informations utilisateur et contrôles */}
          <div className="flex items-center space-x-4">
            {/* Mode Test (Admin uniquement) */}
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTestMode}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    testMode.isActive
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Mode Test
                </button>
              </div>
            )}

            {/* Vues Multiples (Admin uniquement) */}
            {isAdmin && testMode.isActive && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Vues:</span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleViewModeChange('admin')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      viewMode.type === 'admin'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => handleViewModeChange('internal')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      viewMode.type === 'internal'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Interne
                  </button>
                  <button
                    onClick={() => handleViewModeChange('external')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      viewMode.type === 'external'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Externe
                  </button>
                </div>
              </div>
            )}

            {/* Informations utilisateur */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {highestRank?.rank.name || 'Aucun rang'}
                  </span>
                  {highestRank && (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: highestRank.rank.color + '20',
                        color: highestRank.rank.color
                      }}
                    >
                      Niveau {highestRank.rank.level}
                    </span>
                  )}
                </div>
              </div>

              {/* Avatar */}
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-600" />
              </div>

              {/* Menu déroulant */}
              <div className="relative">
                <button className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                  <Settings className="h-5 w-5" />
                </button>
              </div>

              {/* Bouton de déconnexion */}
              <button
                onClick={logout}
                className="flex items-center text-gray-400 hover:text-red-600 focus:outline-none transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
