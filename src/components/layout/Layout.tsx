'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import ModeManager from './ModeManager';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  userRole?: 'admin' | 'internal' | 'external';
  testMode?: boolean;
}

export default function Layout({ 
  children, 
  title, 
  subtitle, 
  breadcrumb, 
  actions,
  userRole = 'admin',
  testMode = false
}: LayoutProps) {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'internal' | 'external'>('admin');
  const [currentTestMode, setCurrentTestMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      const role = localStorage.getItem('user_role') as 'admin' | 'internal' | 'external' || 'admin';
      const testMode = localStorage.getItem('test_mode') === 'true';

      if (token && email && name) {
        setUser({ email, name });
        setCurrentUserRole(role);
        setCurrentTestMode(testMode);
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
      localStorage.removeItem('user_role');
      localStorage.removeItem('test_mode');
    }
    router.push('/login');
  };

  // Utiliser le rôle et mode actuels ou ceux passés en props
  const effectiveRole = userRole !== 'admin' ? userRole : currentUserRole;
  const effectiveTestMode = testMode || currentTestMode;

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

  if (!user) {
    return null;
  }

  return (
    <ModeManager>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar 
          user={user} 
          onLogout={handleLogout} 
          userRole={effectiveRole}
          testMode={effectiveTestMode}
        />

        {/* Main Content */}
        <div className="ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  {subtitle && <p className="text-gray-600">{subtitle}</p>}
                </div>
                {actions && (
                  <div className="flex items-center space-x-3">
                    {actions}
                  </div>
                )}
              </div>
              
              {/* Breadcrumb */}
              {breadcrumb && breadcrumb.length > 0 && (
                <nav className="mt-4">
                  <ol className="flex items-center space-x-2 text-sm text-gray-500">
                    {breadcrumb.map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <li>/</li>}
                        <li>
                          {item.href ? (
                            <a href={item.href} className="hover:text-gray-700">
                              {item.label}
                            </a>
                          ) : (
                            <span className="text-gray-900 font-medium">{item.label}</span>
                          )}
                        </li>
                      </React.Fragment>
                    ))}
                  </ol>
                </nav>
              )}
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ModeManager>
  );
}
