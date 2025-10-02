'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Shield, 
  DollarSign, 
  Car, 
  Home, 
  TrendingUp, 
  Bell, 
  Settings, 
  User, 
  Calendar, 
  MessageCircle, 
  Eye, 
  Plus,
  ArrowRight,
  Zap,
  Target,
  Award,
  Heart,
  Star
} from 'lucide-react';

interface MobileDashboardProps {
  userRole?: 'client' | 'internal' | 'admin';
}

export default function MobileDashboard({ userRole = 'client' }: MobileDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');

  // Stats rapides pour mobile
  const quickStats = [
    { 
      label: 'Devis', 
      value: '12', 
      change: '+3', 
      color: 'bg-blue-500', 
      icon: FileText,
      href: '/dashboard/quotes' 
    },
    { 
      label: 'Contrats', 
      value: '8', 
      change: '+2', 
      color: 'bg-green-500', 
      icon: Shield,
      href: '/dashboard/contracts' 
    },
    { 
      label: 'CA Mensuel', 
      value: '15.2K€', 
      change: '+12%', 
      color: 'bg-purple-500', 
      icon: DollarSign,
      href: '/dashboard/financial' 
    },
    { 
      label: 'Clients', 
      value: '45', 
      change: '+7', 
      color: 'bg-orange-500', 
      icon: Users,
      href: '/dashboard/interlocutors' 
    }
  ];

  // Actions rapides
  const quickActions = [
    { 
      label: 'Nouveau Devis', 
      icon: Plus, 
      color: 'bg-blue-600', 
      href: '/dashboard/quotes',
      description: 'Créer un devis rapidement'
    },
    { 
      label: 'Ajouter Client', 
      icon: User, 
      color: 'bg-green-600', 
      href: '/dashboard/interlocutors/new',
      description: 'Nouveau interlocuteur'
    },
    { 
      label: 'Live Stream', 
      icon: Zap, 
      color: 'bg-red-600', 
      href: '/external/social/hub/live/mobile',
      description: 'Démarrer un live'
    },
    { 
      label: 'Hub Social', 
      icon: MessageCircle, 
      color: 'bg-purple-600', 
      href: '/external/social/hub',
      description: 'Rejoindre la communauté'
    }
  ];

  // Activité récente
  const recentActivity = [
    {
      id: '1',
      type: 'quote',
      title: 'Nouveau devis créé',
      description: 'Devis #2024-001 pour Marie Dubois',
      time: '2h',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: '2',
      type: 'contract',
      title: 'Contrat signé',
      description: 'Contrat VTC Premium - Jean Martin',
      time: '4h',
      icon: Shield,
      color: 'text-green-600'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Paiement reçu',
      description: '1,250€ - Commission assurance',
      time: '6h',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      id: '4',
      type: 'social',
      title: 'Nouveau follower',
      description: 'Sophie_VTC a commencé à vous suivre',
      time: '8h',
      icon: Heart,
      color: 'text-pink-600'
    }
  ];

  // Notifications importantes
  const notifications = [
    {
      id: '1',
      type: 'urgent',
      title: 'Renouvellement contrat',
      message: '3 contrats arrivent à échéance ce mois',
      action: 'Voir les contrats',
      href: '/dashboard/contracts'
    },
    {
      id: '2',
      type: 'info',
      title: 'Nouvelle fonctionnalité',
      message: 'Le streaming mobile est maintenant disponible !',
      action: 'Essayer',
      href: '/external/social/hub/live/mobile'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header avec salutation */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Bonjour Diddy ! 👋</h1>
            <p className="opacity-90">Voici votre tableau de bord</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-2 bg-white bg-opacity-20 rounded-full">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            <Link href="/dashboard/settings" className="p-2 bg-white bg-opacity-20 rounded-full">
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                href={stat.href}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 hover:bg-opacity-20 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5 text-white" />
                  <span className="text-green-300 text-sm font-medium">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white text-sm opacity-75">{stat.label}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Notifications importantes */}
      {notifications.length > 0 && (
        <div className="px-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${
                  notification.type === 'urgent' ? 'border-red-500' : 'border-blue-500'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                <Link
                  href={notification.href}
                  className={`inline-flex items-center space-x-1 text-sm font-medium ${
                    notification.type === 'urgent' ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  <span>{notification.action}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activité récente */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
          <Link href="/dashboard/activity" className="text-blue-600 text-sm font-medium">
            Voir tout
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className={`flex items-center space-x-4 p-4 ${
                  index !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                </div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance du mois */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance du mois</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Objectifs</h3>
              <p className="text-sm text-gray-500">Janvier 2024</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-500">Atteint</div>
            </div>
          </div>

          {/* Barres de progression */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Chiffre d'affaires</span>
                <span className="font-medium">15.2K€ / 18K€</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Nouveaux clients</span>
                <span className="font-medium">7 / 8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Contrats signés</span>
                <span className="font-medium">8 / 10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/dashboard/analytics"
              className="flex items-center justify-center space-x-2 text-blue-600 font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Voir les analytics détaillés</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Raccourcis vers les modules */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Modules</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Assurance', icon: Shield, href: '/dashboard/insurance', color: 'bg-blue-500' },
            { label: 'Finance', icon: DollarSign, href: '/dashboard/financial', color: 'bg-green-500' },
            { label: 'Véhicules', icon: Car, href: '/dashboard/insurance/vehicles', color: 'bg-red-500' },
            { label: 'Chauffeurs', icon: Users, href: '/dashboard/insurance/drivers', color: 'bg-purple-500' },
            { label: 'Sinistres', icon: FileText, href: '/dashboard/insurance/claims', color: 'bg-orange-500' },
            { label: 'Paramètres', icon: Settings, href: '/dashboard/settings', color: 'bg-gray-500' }
          ].map((module, index) => {
            const Icon = module.icon;
            return (
              <Link
                key={index}
                href={module.href}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-center"
              >
                <div className={`w-10 h-10 ${module.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{module.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
