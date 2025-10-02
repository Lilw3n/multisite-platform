'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPermissionsForRole, hasPermission } from '@/types/roles';

interface SidebarProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
  userRole?: 'admin' | 'internal' | 'external';
  testMode?: boolean;
}

export default function Sidebar({ user, onLogout, userRole = 'admin', testMode = false }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    financier: false,
    assurance: false,
    parametres: false
  });
  
  const pathname = usePathname();

  // Définir les permissions selon le rôle et le mode
  const permissions = {
    showDashboard: hasPermission(userRole, 'dashboard_read', testMode),
    showUsers: hasPermission(userRole, 'users_read', testMode),
    showInterlocutors: hasPermission(userRole, 'interlocutors_read', testMode),
    showFinancial: hasPermission(userRole, 'financial_read', testMode),
    showInsurance: hasPermission(userRole, 'insurance_read', testMode),
    showSettings: hasPermission(userRole, 'settings_read', testMode)
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigationItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '🏠', 
      href: '/dashboard',
      isActive: pathname === '/dashboard',
      show: permissions.showDashboard
    },
    { 
      id: 'utilisateurs', 
      name: 'Utilisateurs', 
      icon: '👥', 
      href: '/dashboard/users',
      isActive: pathname.startsWith('/dashboard/users'),
      show: permissions.showUsers
    },
    { 
      id: 'interlocuteurs', 
      name: 'Interlocuteurs', 
      icon: '🤝', 
      href: '/dashboard/interlocutors',
      isActive: pathname.startsWith('/dashboard/interlocutors'),
      show: permissions.showInterlocutors
    },
    { 
      id: 'ai-suggestions', 
      name: 'Suggestions IA', 
      icon: '🤖', 
      href: '/dashboard/ai-suggestions',
      isActive: pathname.startsWith('/dashboard/ai-suggestions'),
      show: permissions.showInsurance
    },
    {
      id: 'financier',
      name: 'Financier',
      icon: '💰',
      href: '#',
      isActive: pathname.startsWith('/dashboard/financial'),
      hasSubmenu: true,
      show: permissions.showFinancial,
      subItems: [
        { id: 'creances', name: 'Créances', icon: '📊', href: '/dashboard/financial/receivables' },
        { id: 'paiements', name: 'Paiements', icon: '💳', href: '/dashboard/financial/payments' },
        { id: 'debits', name: 'Débits', icon: '📉', href: '/dashboard/financial/debits' }
      ]
    },
    {
      id: 'assurance',
      name: 'Assurance',
      icon: '🛡️',
      href: '#',
      isActive: pathname.startsWith('/dashboard/insurance') || pathname.startsWith('/dashboard/quotes') || pathname.startsWith('/dashboard/contracts'),
      hasSubmenu: true,
      show: permissions.showInsurance,
      subItems: [
        { id: 'devis', name: 'Devis', icon: '📋', href: '/dashboard/quotes' },
        { id: 'contrats', name: 'Contrats', icon: '📄', href: '/dashboard/contracts' },
        { id: 'vehicules', name: 'Véhicules', icon: '🚗', href: '/dashboard/insurance/vehicles' },
        { id: 'conducteurs', name: 'Conducteurs', icon: '👨‍💼', href: '/dashboard/insurance/drivers' },
        { id: 'sinistres', name: 'Sinistres', icon: '⚠️', href: '/dashboard/insurance/claims' },
        { id: 'bancaire', name: 'Coordonnées bancaires', icon: '🏦', href: '/dashboard/insurance/bank-details' },
        { id: 'periodes', name: 'Périodes', icon: '📅', href: '/dashboard/insurance/periods' }
      ]
    },
    {
      id: 'parametres',
      name: 'Paramètres',
      icon: '⚙️',
      href: '#',
      isActive: pathname.startsWith('/dashboard/settings'),
      hasSubmenu: true,
      show: permissions.showSettings,
      subItems: [
        { id: 'roles', name: 'Rôles', icon: '🔒', href: '/dashboard/settings/roles' },
        { id: 'permissions', name: 'Permissions', icon: '⚡', href: '/dashboard/settings/permissions' },
        { id: 'external-content', name: 'Contenu Externe', icon: '🌐', href: '/dashboard/settings/external-content' }
      ]
    }
  ].filter(item => item.show);

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">🏠 DiddyHome</h1>
      </div>
      
      <nav className="mt-8">
        {navigationItems.map((item) => (
          <div key={item.id}>
            {item.hasSubmenu ? (
              <div>
                <button
                  onClick={() => toggleSection(item.id)}
                  className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium ${
                    item.isActive
                      ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </div>
                  <span className={`transform transition-transform ${
                    expandedSections[item.id] ? 'rotate-90' : ''
                  }`}>
                    ▶
                  </span>
                </button>
                
                {expandedSections[item.id] && item.subItems && (
                  <div className="ml-6">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={subItem.href}
                        className={`flex items-center px-6 py-2 text-sm font-medium ${
                          pathname === subItem.href
                            ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="mr-3 text-sm">{subItem.icon}</span>
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium ${
                  item.isActive
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
      
      {/* User info and logout */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-2">
          Connecté en tant que {user?.name || 'Utilisateur'}
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
