'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ModeContextType {
  userRole: 'admin' | 'internal' | 'external';
  testMode: boolean;
  viewMode: 'admin' | 'internal' | 'external';
  user: { email: string; name: string } | null;
  isLoading: boolean;
  setUserRole: (role: 'admin' | 'internal' | 'external') => void;
  setTestMode: (mode: boolean) => void;
  setViewMode: (mode: 'admin' | 'internal' | 'external') => void;
  logout: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<'admin' | 'internal' | 'external'>('admin');
  const [testMode, setTestMode] = useState(false);
  const [viewMode, setViewMode] = useState<'admin' | 'internal' | 'external'>('admin');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      const role = localStorage.getItem('user_role') as 'admin' | 'internal' | 'external' || 'admin';
      const test = localStorage.getItem('test_mode') === 'true';
      const view = localStorage.getItem('view_mode') as 'admin' | 'internal' | 'external' || 'admin';

      if (token && email && name) {
        setUser({ email, name });
        setUserRole(role);
        setTestMode(test);
        setViewMode(view);
        setIsLoading(false);
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  const handleUserRoleChange = (role: 'admin' | 'internal' | 'external') => {
    setUserRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_role', role);
    }
    
    // Forcer la vue selon le rôle et le mode test
    let forcedView = role;
    if (testMode) {
      forcedView = role; // En mode test, la vue = le rôle
    } else if (role !== 'admin') {
      forcedView = role; // En mode normal, seul l'admin peut choisir
    }
    
    setViewMode(forcedView);
    if (typeof window !== 'undefined') {
      localStorage.setItem('view_mode', forcedView);
    }
    
    // Rediriger selon la vue
    redirectToView(forcedView);
  };

  const handleTestModeChange = (mode: boolean) => {
    setTestMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('test_mode', mode.toString());
    }
    
    // Forcer la vue selon le mode test
    let forcedView = userRole;
    if (mode) {
      forcedView = userRole; // En mode test, la vue = le rôle
    } else if (userRole !== 'admin') {
      forcedView = userRole; // En mode normal, seul l'admin peut choisir
    }
    
    setViewMode(forcedView);
    if (typeof window !== 'undefined') {
      localStorage.setItem('view_mode', forcedView);
    }
    
    // Rediriger selon la vue
    redirectToView(forcedView);
  };

  const handleViewModeChange = (mode: 'admin' | 'internal' | 'external') => {
    // Seul l'admin peut changer de vue en mode normal
    if (userRole === 'admin' && !testMode) {
      setViewMode(mode);
      if (typeof window !== 'undefined') {
        localStorage.setItem('view_mode', mode);
      }
      redirectToView(mode);
    }
  };

  const redirectToView = (mode: 'admin' | 'internal' | 'external') => {
    switch (mode) {
      case 'admin':
        router.push('/dashboard');
        break;
      case 'internal':
        router.push('/dashboard');
        break;
      case 'external':
        router.push('/dashboard/external/profile');
        break;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_role');
      localStorage.removeItem('test_mode');
      localStorage.removeItem('view_mode');
    }
    router.push('/login');
  };

  const value: ModeContextType = {
    userRole,
    testMode,
    viewMode,
    user,
    isLoading,
    setUserRole: handleUserRoleChange,
    setTestMode: handleTestModeChange,
    setViewMode: handleViewModeChange,
    logout
  };

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
