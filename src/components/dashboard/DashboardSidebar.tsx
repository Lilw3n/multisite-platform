'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/MinimalAuthContext';
import { RoleService } from '@/lib/roles';
import {
  Home,
  Users,
  Building,
  Settings,
  BarChart3,
  Calendar,
  FileText,
  Shield,
  CreditCard,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Bot,
  Car,
  UserCheck,
  AlertTriangle,
  Landmark,
  Clock,
  PieChart,
  Download,
  Globe,
  MessageCircle,
  Video,
  ShoppingBag,
  Zap
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: MenuItem[];
  requiredRank?: number;
  requiredPermissions?: string[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard'
  },
  {
    id: 'ai-suggestions',
    label: 'Suggestions IA',
    icon: Bot,
    href: '/dashboard/ai-suggestions'
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: Users,
    children: [
      { id: 'users-list', label: 'Liste des utilisateurs', icon: Users, href: '/dashboard/users' },
      { id: 'users-roles', label: 'Gestion des rôles', icon: Shield, href: '/dashboard/users/roles' },
      { id: 'users-permissions', label: 'Permissions', icon: Settings, href: '/dashboard/users/permissions' }
    ],
    requiredRank: 0
  },
  {
    id: 'interlocutors',
    label: 'Interlocuteurs',
    icon: Building,
    children: [
      { id: 'interlocutors-list', label: 'Liste des interlocuteurs', icon: Building, href: '/dashboard/interlocutors' },
      { id: 'interlocutors-create', label: 'Nouvel interlocuteur', icon: Plus, href: '/dashboard/interlocutors/new' },
      { id: 'interlocutors-complete', label: 'Création complète', icon: UserCheck, href: '/dashboard/interlocutors/create-complete' }
    ]
  },
  {
    id: 'modules',
    label: 'Modules',
    icon: FileText,
    children: [
      { id: 'modules-list', label: 'Tous les modules', icon: FileText, href: '/dashboard/modules' },
      { id: 'modules-create', label: 'Créer un module', icon: Plus, href: '/dashboard/modules/new' },
      { id: 'modules-types', label: 'Types de modules', icon: Settings, href: '/dashboard/modules/types' }
    ]
  },
  {
    id: 'portfolio',
    label: 'Portefeuille',
    icon: FileText,
    children: [
      { id: 'quotes', label: 'Devis', icon: FileText, href: '/dashboard/quotes' },
      { id: 'contracts', label: 'Contrats', icon: Shield, href: '/dashboard/contracts' }
    ]
  },
  {
    id: 'financial',
    label: 'Gestion Financière',
    icon: CreditCard,
    children: [
      { id: 'financial-overview', label: 'Vue d\'ensemble', icon: BarChart3, href: '/dashboard/financial' },
      { id: 'financial-payments', label: 'Paiements', icon: CreditCard, href: '/dashboard/financial/payments' },
      { id: 'financial-receivables', label: 'Créances', icon: TrendingUp, href: '/dashboard/financial/receivables' },
      { id: 'financial-debits', label: 'Débits', icon: TrendingUp, href: '/dashboard/financial/debits' }
    ]
  },
  {
    id: 'statistics',
    label: 'Statistiques',
    icon: PieChart,
    children: [
      { id: 'stats-overview', label: 'Vue d\'ensemble', icon: BarChart3, href: '/dashboard/statistics' },
      { id: 'stats-reports', label: 'Rapports', icon: FileText, href: '/dashboard/statistics/reports' },
      { id: 'stats-export', label: 'Exports', icon: Download, href: '/dashboard/statistics/export' }
    ]
  },
  {
    id: 'calendar',
    label: 'Calendrier',
    icon: Calendar,
    href: '/dashboard/calendar'
  },
  {
    id: 'insurance',
    label: 'Assurance',
    icon: Shield,
    children: [
      { id: 'insurance-quotes', label: 'Devis', icon: FileText, href: '/dashboard/quotes' },
      { id: 'insurance-contracts', label: 'Contrats', icon: Shield, href: '/dashboard/contracts' },
      { id: 'insurance-claims', label: 'Sinistres', icon: AlertTriangle, href: '/dashboard/insurance/claims' },
      { id: 'insurance-periods', label: 'Périodes', icon: Clock, href: '/dashboard/insurance/periods' },
      { id: 'insurance-drivers', label: 'Conducteurs', icon: UserCheck, href: '/dashboard/insurance/drivers' },
      { id: 'insurance-vehicles', label: 'Véhicules', icon: Car, href: '/dashboard/insurance/vehicles' },
      { id: 'insurance-bank-details', label: 'Coordonnées bancaires', icon: Landmark, href: '/dashboard/insurance/bank-details' },
      { id: 'insurance-partners', label: 'Partenaires', icon: Building, href: '/dashboard/insurance/partners' }
    ]
  },
  {
    id: 'external',
    label: 'Externe',
    icon: Globe,
    children: [
      { id: 'external-overview', label: 'Vue d\'ensemble', icon: Globe, href: '/dashboard/external' },
      { id: 'external-profile', label: 'Profil', icon: Users, href: '/dashboard/external/profile' },
      { id: 'external-search', label: 'Recherche', icon: Search, href: '/dashboard/external/search' },
      { id: 'external-simulate', label: 'Simulation', icon: BarChart3, href: '/dashboard/external/simulate' }
    ]
  },
  {
    id: 'test',
    label: 'Test',
    icon: Settings,
    href: '/dashboard/test'
  },
  {
    id: 'social-hub',
    label: 'Hub Social',
    icon: Globe,
    children: [
      { id: 'social-main', label: 'Hub Principal', icon: Zap, href: '/external/social/hub' },
      { id: 'social-communities', label: 'Communautés', icon: MessageCircle, href: '/external/social' },
      { id: 'social-pro', label: 'Communauté Pro', icon: Car, href: '/external/social/hub/groups/VTC-Taxi' },
      { id: 'social-live', label: 'Live Streaming', icon: Video, href: '/external/social/hub#live' },
      { id: 'social-marketplace', label: 'Marketplace', icon: ShoppingBag, href: '/external/social/hub#marketplace' },
      { id: 'social-agency', label: 'Agence Créateurs', icon: Star, href: '/external/social/hub#agency' },
      { id: 'social-groups', label: 'Groupes Privés', icon: Users, href: '/external/social/hub#groups' },
      { id: 'social-deals', label: 'Bons Plans', icon: Zap, href: '/external/social/hub#deals' }
    ]
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    children: [
      { id: 'settings-general', label: 'Général', icon: Settings, href: '/dashboard/settings' },
      { id: 'settings-sites', label: 'Sites', icon: Building, href: '/dashboard/settings/sites' },
      { id: 'settings-modules', label: 'Modules', icon: FileText, href: '/dashboard/settings/modules' },
      { id: 'settings-external-content', label: 'Contenu Externe', icon: Globe, href: '/dashboard/settings/external-content' }
    ],
    requiredRank: 0
  }
];

export const DashboardSidebar: React.FC = () => {
  const { user, viewMode } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);

  if (!user) return null;

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const canAccessItem = (item: MenuItem): boolean => {
    if (!item.requiredRank && !item.requiredPermissions) return true;
    
    if (item.requiredRank !== undefined) {
      const highestRank = RoleService.getUserHighestRank(user);
      return highestRank ? highestRank.rank.level <= item.requiredRank : false;
    }

    if (item.requiredPermissions) {
      return item.requiredPermissions.some(permission =>
        RoleService.hasPermission(user, 'read', permission)
      );
    }

    return true;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (!canAccessItem(item)) return null;

    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = level * 16;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
            level > 0 ? 'ml-4' : ''
          } ${
            viewMode.type === 'admin' && item.id === 'dashboard'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.href) {
              // Navigation vers la page
              window.location.href = item.href;
            }
          }}
        >
          <div className="flex items-center">
            <item.icon className="h-4 w-4 mr-3" />
            <span>{item.label}</span>
          </div>
          {hasChildren && (
            <div className="ml-2">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="flex-1 text-sm border-0 bg-transparent focus:outline-none focus:ring-0"
            />
          </div>
          <Filter className="h-4 w-4 text-gray-400 ml-2" />
        </div>

        <nav className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>
      </div>
    </div>
  );
};
