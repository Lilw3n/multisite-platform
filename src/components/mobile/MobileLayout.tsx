'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Video, 
  ShoppingBag, 
  User, 
  Search, 
  Bell, 
  Menu,
  X,
  Heart,
  Bookmark,
  Settings,
  LogOut,
  Zap,
  TrendingUp,
  Gift,
  Camera,
  Edit3,
  Globe
} from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigation principale mobile
  const bottomNavItems = [
    { 
      id: 'home', 
      label: 'Accueil', 
      icon: Home, 
      href: '/external',
      activePattern: /^\/external$/ 
    },
    { 
      id: 'social', 
      label: 'Social', 
      icon: Users, 
      href: '/external/social/hub',
      activePattern: /^\/external\/social/ 
    },
    { 
      id: 'live', 
      label: 'Live', 
      icon: Video, 
      href: '/external/social/hub/live/mobile',
      activePattern: /^\/external\/social\/hub\/live/ 
    },
    { 
      id: 'deals', 
      label: 'Deals', 
      icon: Gift, 
      href: '/external/social/hub#deals',
      activePattern: /deals/ 
    },
    { 
      id: 'profile', 
      label: 'Profil', 
      icon: User, 
      href: '/dashboard/external/profile',
      activePattern: /^\/dashboard/ 
    }
  ];

  // Menu hamburger complet
  const menuItems = [
    { 
      category: 'Principal',
      items: [
        { label: 'Accueil', icon: Home, href: '/external' },
        { label: 'Hub Social', icon: Globe, href: '/external/social/hub' },
        { label: 'Communautés', icon: Users, href: '/external/social' },
        { label: 'Blog', icon: Edit3, href: '/blog' }
      ]
    },
    { 
      category: 'Création',
      items: [
        { label: 'Live Mobile', icon: Camera, href: '/external/social/hub/live/mobile' },
        { label: 'Studio Stream', icon: Video, href: '/external/social/hub#live' },
        { label: 'Agence Créateurs', icon: Zap, href: '/external/social/hub#agency' }
      ]
    },
    { 
      category: 'Business',
      items: [
        { label: 'Marketplace', icon: ShoppingBag, href: '/external/social/hub#marketplace' },
        { label: 'Bons Plans', icon: Gift, href: '/external/social/hub#deals' },
        { label: 'Groupes Pro', icon: MessageCircle, href: '/external/social/hub/groups/VTC-Taxi' }
      ]
    },
    { 
      category: 'Compte',
      items: [
        { label: 'Mon Profil', icon: User, href: '/dashboard/external/profile' },
        { label: 'Mes Favoris', icon: Heart, href: '/dashboard/favorites' },
        { label: 'Sauvegardés', icon: Bookmark, href: '/dashboard/saved' },
        { label: 'Paramètres', icon: Settings, href: '/dashboard/settings' }
      ]
    }
  ];

  const isActive = (pattern: RegExp) => {
    return pattern.test(pathname);
  };

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header Mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Menu */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMenu(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <Link href="/external" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-bold text-gray-900">DiddyHome</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="pt-16">
        {children}
      </div>

      {/* Navigation Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 py-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.activePattern);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center py-2 px-1 transition-colors ${
                  active 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`h-6 w-6 mb-1 ${active ? 'text-blue-600' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
                {active && (
                  <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Menu Hamburger Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white w-80 max-w-full h-full overflow-y-auto">
            {/* Header Menu */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">DiddyHome</div>
                  <div className="text-sm text-gray-500">Menu principal</div>
                </div>
              </div>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="py-4">
              {menuItems.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-6">
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      {category.category}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {category.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={itemIndex}
                          href={item.href}
                          onClick={() => setShowMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <Icon className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700 font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Actions du bas */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <Link
                  href="/logout"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Déconnexion</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (pour créer du contenu) */}
      <Link
        href="/external/social/hub/live/mobile"
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
      >
        <Camera className="h-6 w-6 text-white" />
      </Link>

      {/* Quick Stats Bar (optionnel, pour engagement) */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>12.8K en ligne</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>+15% cette semaine</span>
            </div>
          </div>
          <div className="text-xs opacity-75">
            Rejoignez la communauté !
          </div>
        </div>
      </div>
    </div>
  );
}
