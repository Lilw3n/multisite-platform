'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ModeManagerProps {
  children: React.ReactNode;
}

export default function ModeManager({ children }: ModeManagerProps) {
  const [userRole, setUserRole] = useState<'admin' | 'internal' | 'external'>('admin');
  const [testMode, setTestMode] = useState(false);
  const [viewMode, setViewMode] = useState('admin');
  const [simulatedInterlocutor, setSimulatedInterlocutor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('user_role') as 'admin' | 'internal' | 'external' || 'admin';
      const test = localStorage.getItem('test_mode') === 'true';
      const view = localStorage.getItem('view_mode') || 'admin';
      const simulated = localStorage.getItem('simulated_interlocutor');
      
      setUserRole(role);
      setTestMode(test);
      setViewMode(view);
      if (simulated) {
        setSimulatedInterlocutor(JSON.parse(simulated));
      }
      setIsLoading(false);

      // Forcer la vue selon le rôle et le mode test
      enforceViewMode(role, test, view);
    }
  }, []);

  const enforceViewMode = (role: string, test: boolean, currentView: string) => {
    let forcedView = currentView;

    // En mode test, forcer la vue selon le rôle
    if (test) {
      switch (role) {
        case 'admin':
          forcedView = 'admin';
          break;
        case 'internal':
          forcedView = 'internal';
          break;
        case 'external':
          forcedView = 'external';
          break;
      }
    } else {
      // Mode normal : admin peut choisir, autres rôles sont forcés
      if (role !== 'admin') {
        forcedView = role;
      } else {
        // Si on est admin en mode normal, on peut garder la vue actuelle
        // sauf si c'est 'external' sans interlocuteur sélectionné
        if (currentView === 'external') {
          // Vérifier si on a un interlocuteur sélectionné
          const hasInterlocutor = typeof window !== 'undefined' && 
            window.location.pathname.includes('/external/') && 
            !window.location.pathname.endsWith('/external');
          
          if (!hasInterlocutor) {
            // Si on est en vue externe sans interlocuteur, revenir à admin
            forcedView = 'admin';
          }
        }
      }
    }

    // Si la vue a changé, la sauvegarder et recharger
    if (forcedView !== currentView) {
      localStorage.setItem('view_mode', forcedView);
      setViewMode(forcedView);
      window.location.reload();
    }
  };

  const handleRoleChange = (role: 'admin' | 'internal' | 'external') => {
    setUserRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_role', role);
    }
    
    // Forcer la vue selon le nouveau rôle
    enforceViewMode(role, testMode, viewMode);
  };

  const handleTestModeToggle = () => {
    const newTestMode = !testMode;
    setTestMode(newTestMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('test_mode', newTestMode.toString());
    }
    
    // Forcer la vue selon le mode test
    enforceViewMode(userRole, newTestMode, viewMode);
  };

  const handleViewModeChange = (mode: string) => {
    // Seul l'admin peut changer de vue en mode normal
    if (userRole === 'admin' && !testMode) {
      setViewMode(mode);
      if (typeof window !== 'undefined') {
        localStorage.setItem('view_mode', mode);
      }
      window.location.reload();
    }
  };

  // Fonction d'urgence pour revenir au mode admin
  const forceAdminMode = () => {
    setUserRole('admin');
    setTestMode(false);
    setViewMode('admin');
    setSimulatedInterlocutor(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_role', 'admin');
      localStorage.setItem('test_mode', 'false');
      localStorage.setItem('view_mode', 'admin');
      localStorage.removeItem('simulated_interlocutor');
    }
    window.location.reload();
  };

  // Fonction pour simuler un interlocuteur
  const simulateInterlocutor = (interlocutor: any) => {
    setSimulatedInterlocutor(interlocutor);
    setViewMode('external');
    if (typeof window !== 'undefined') {
      localStorage.setItem('simulated_interlocutor', JSON.stringify(interlocutor));
      localStorage.setItem('view_mode', 'external');
    }
    window.location.reload();
  };

  // Fonction pour arrêter la simulation
  const stopSimulation = () => {
    setSimulatedInterlocutor(null);
    setViewMode('admin');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('simulated_interlocutor');
      localStorage.setItem('view_mode', 'admin');
    }
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

  // Rediriger selon le mode
  if (viewMode === 'external') {
    // Rediriger vers la page de sélection d'interlocuteur
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/external')) {
      router.push('/dashboard/external');
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec contrôles de mode */}
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
                onClick={() => handleRoleChange('admin')}
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
                onClick={() => handleRoleChange('internal')}
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
                onClick={() => handleRoleChange('external')}
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
                  {testMode ? 'ACTIF' : 'INACTIF'}
                </span>
              </div>

              {/* View Mode Dropdown (seulement pour admin en mode normal) */}
              {userRole === 'admin' && !testMode && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Vue:</span>
                  <select
                    value={viewMode}
                    onChange={(e) => handleViewModeChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="admin">👑 Administrateur</option>
                    <option value="internal">👨‍💼 Interne</option>
                    <option value="external">🌐 Externe</option>
                  </select>
                </div>
              )}

              {/* Simulation d'interlocuteur */}
              {userRole === 'admin' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Simuler:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value === '') {
                        stopSimulation();
                      } else {
                        const interlocutor = JSON.parse(e.target.value);
                        simulateInterlocutor(interlocutor);
                      }
                    }}
                    value={simulatedInterlocutor ? JSON.stringify(simulatedInterlocutor) : ''}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="">Aucune simulation</option>
                    <option value='{"id":"1","name":"Jean Dupont","email":"jean.dupont@company.com","company":"Transport Dupont SARL"}'>Jean Dupont</option>
                    <option value='{"id":"2","name":"Marie Martin","email":"marie.martin@transport.fr","company":"Martin Transport"}'>Marie Martin</option>
                    <option value='{"id":"3","name":"Pierre Bernard","email":"pierre.bernard@logistics.com","company":"Bernard Logistics"}'>Pierre Bernard</option>
                  </select>
                </div>
              )}

              {/* Emergency Admin Button - Always visible */}
              <button
                onClick={forceAdminMode}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                title="🚨 BOUTON D'URGENCE - Revenir au mode Admin"
              >
                🚨 ADMIN
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_email');
                    localStorage.removeItem('user_name');
                    localStorage.removeItem('user_role');
                    localStorage.removeItem('test_mode');
                    localStorage.removeItem('view_mode');
                  }
                  router.push('/login');
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

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
              {simulatedInterlocutor && (
                <p className="text-sm text-yellow-600 mt-1">
                  <strong>Simulation d'interlocuteur:</strong> {simulatedInterlocutor.name} ({simulatedInterlocutor.email})
                </p>
              )}
              {viewMode === 'external' && (
                <p className="text-sm text-yellow-600 mt-1">
                  En mode externe, vous ne voyez que votre fiche personnelle. Utilisez la recherche d'interlocuteur.
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

      {/* Simulation Banner */}
      {simulatedInterlocutor && !testMode && (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-500">👤</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Simulation d'interlocuteur active:</strong> {simulatedInterlocutor.name} ({simulatedInterlocutor.email})
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Vous voyez l'interface comme la verrait {simulatedInterlocutor.name}. 
                <button 
                  onClick={stopSimulation}
                  className="ml-2 text-blue-800 underline hover:text-blue-900"
                >
                  Arrêter la simulation
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main>
        {children}
      </main>
    </div>
  );
}
