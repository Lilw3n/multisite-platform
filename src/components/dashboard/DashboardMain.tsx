'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/MinimalAuthContext';
import { DashboardStats } from './DashboardStats';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import {
  Activity,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface RecentActivity {
  id: string;
  type: 'user' | 'module' | 'payment' | 'task' | 'event';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
  user: string;
}

export const DashboardMain: React.FC = () => {
  const { user, testMode, viewMode } = useAuth();
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Charger les activités de manière sécurisée
    try {
      const activities = [
        {
          id: `fallback-user-${Date.now()}-1`,
          type: 'user' as const,
          title: 'Nouvel utilisateur créé',
          description: 'Marie Dubois a été ajoutée au système',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: 'success' as const,
          user: 'Admin'
        },
        {
          id: `fallback-module-${Date.now()}-2`,
          type: 'module' as const,
          title: 'Module mis à jour',
          description: 'Contrat #CT-2024-001 a été modifié',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: 'info' as const,
          user: 'Jean Martin'
        },
        {
          id: `fallback-payment-${Date.now()}-3`,
          type: 'payment' as const,
          title: 'Paiement reçu',
          description: '€2,500 reçu de Client ABC',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          status: 'success' as const,
          user: 'Système'
        },
        {
          id: `fallback-task-${Date.now()}-4`,
          type: 'task' as const,
          title: 'Tâche en retard',
          description: 'Relance facture #F-2024-045',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
          status: 'warning' as const,
          user: 'Système'
        },
        {
          id: `fallback-event-${Date.now()}-5`,
          type: 'event' as const,
          title: 'Événement programmé',
          description: 'Réunion client demain à 14h',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
          status: 'info' as const,
          user: 'Sophie Leroy'
        }
      ];
      setRecentActivities(activities);
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
    }
  }, []);

  if (!user) return null;

  // Utiliser les activités chargées
  const displayActivities = recentActivities;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'module':
        return <FileText className="h-4 w-4" />;
      case 'payment':
        return <TrendingUp className="h-4 w-4" />;
      case 'task':
        return <Clock className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Il y a ${days}j`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          {/* En-tête principal */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Principal
            </h1>
            <p className="mt-2 text-gray-600">
              Bienvenue sur votre plateforme multisite avec système de rôles hiérarchique
            </p>
            
            {/* Indicateurs de mode */}
            <div className="mt-4 flex space-x-4">
              {testMode.isActive && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <Activity className="h-4 w-4 mr-2" />
                  Mode Test Actif
                </div>
              )}
              {viewMode.isSimulated && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Users className="h-4 w-4 mr-2" />
                  Vue {viewMode.type}
                </div>
              )}
            </div>
          </div>

          {/* Statistiques */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Contenu principal en grille */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activités récentes */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Activités Récentes
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {displayActivities.map((activity) => (
                    <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {getTypeIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(activity.status)}
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Par {activity.user}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                    Voir toutes les activités
                  </button>
                </div>
              </div>
            </div>

            {/* Panneau latéral */}
            <div className="space-y-6">
              {/* Tâches urgentes */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Tâches Urgentes
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Relance facture #F-2024-045
                        </p>
                        <p className="text-xs text-gray-500">
                          En retard de 2 jours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Validation contrat #CT-2024-002
                        </p>
                        <p className="text-xs text-gray-500">
                          Échéance dans 1 jour
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Mise à jour module assurance
                        </p>
                        <p className="text-xs text-gray-500">
                          Terminée
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Actions Rapides
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200">
                      + Nouvel interlocuteur
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200">
                      + Créer un module
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200">
                      + Nouvelle tâche
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200">
                      📊 Générer un rapport
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
