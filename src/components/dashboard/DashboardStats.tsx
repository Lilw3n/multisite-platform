'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/MinimalAuthContext';
import { RoleService } from '@/lib/roles';
// Imports supprimés pour éviter les problèmes de chargement
import {
  Users,
  Building,
  FileText,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, subtitle }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className={`p-3 rounded-md ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">
            {title}
          </dt>
          <dd className="flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900">
              {value}
            </div>
            {trend && (
              <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-4 w-4 mr-1 ${
                  trend.isPositive ? 'rotate-0' : 'rotate-180'
                }`} />
                {Math.abs(trend.value)}%
              </div>
            )}
          </dd>
          {subtitle && (
            <dd className="text-sm text-gray-500">
              {subtitle}
            </dd>
          )}
        </dl>
      </div>
    </div>
  </div>
);

export const DashboardStats: React.FC = () => {
  const { user, viewMode } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterlocutors: 0,
    totalVehicles: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    activeUsers: 0,
    pendingTasks: 0,
    overdueReceivables: 0,
    completedTasks: 0
  });

  useEffect(() => {
    // Chargement simplifié des statistiques pour éviter les boucles infinies
    try {
      setStats({
        totalUsers: 5,
        totalInterlocutors: 5,
        totalVehicles: 12,
        totalRevenue: 125000,
        totalExpenses: 89000,
        activeUsers: 5,
        pendingTasks: 3,
        overdueReceivables: 7500,
        completedTasks: 2
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }, []);

  if (!user) return null;

  const highestRank = RoleService.getUserHighestRank(user);
  const isAdmin = highestRank?.rank.level === 0;

  const statsCards = [
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      trend: { value: 12, isPositive: true },
      subtitle: `${stats.activeUsers} actifs`
    },
    {
      title: 'Interlocuteurs',
      value: stats.totalInterlocutors,
      icon: Building,
      color: 'bg-green-500',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Véhicules',
      value: stats.totalVehicles,
      icon: FileText,
      color: 'bg-purple-500',
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'Revenus',
      value: `€${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      trend: { value: 5, isPositive: true }
    },
    {
      title: 'Dépenses',
      value: `€${stats.totalExpenses.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-red-500',
      trend: { value: 3, isPositive: false }
    },
    {
      title: 'Tâches en cours',
      value: stats.pendingTasks,
      icon: Clock,
      color: 'bg-orange-500',
      subtitle: `${stats.completedTasks} terminées`
    }
  ];

  // Cartes spécifiques à l'admin
  const adminStatsCards = [
    {
      title: 'Créances en retard',
      value: stats.overdueReceivables,
      icon: AlertCircle,
      color: 'bg-red-600',
      subtitle: 'Nécessitent une action'
    },
    {
      title: 'Bénéfice net',
      value: `€${(stats.totalRevenue - stats.totalExpenses).toLocaleString()}`,
      icon: CheckCircle,
      color: 'bg-green-600',
      trend: { value: 8, isPositive: true }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Titre de la section */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          Statistiques {viewMode.isSimulated ? `(${viewMode.type})` : ''}
        </h2>
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Statistiques admin supplémentaires */}
      {isAdmin && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">
            Statistiques Administrateur
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {adminStatsCards.map((stat, index) => (
              <StatCard key={`admin-${index}`} {...stat} />
            ))}
          </div>
        </div>
      )}

      {/* Alertes et notifications */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Notifications importantes
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>{stats.overdueReceivables} créances nécessitent une relance</li>
                <li>{stats.pendingTasks} tâches en attente de traitement</li>
                <li>3 modules nécessitent une validation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
