'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ViewMode, TestMode } from '@/types';
import { AuthService } from '@/lib/auth';
import { PersistentAuthService } from '@/lib/persistentAuth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  viewMode: ViewMode;
  testMode: TestMode;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setViewMode: (mode: ViewMode) => void;
  toggleTestMode: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>({
    type: 'admin',
    isSimulated: false
  });
  const [testMode, setTestMode] = useState<TestMode>({
    isActive: false,
    logs: []
  });

  useEffect(() => {
    // Vérifier la session persistante au chargement
    if (typeof window !== 'undefined') {
      try {
        const session = PersistentAuthService.getSession();
        if (session) {
          setUser(session.user);
          setToken(session.token);
        }
      } catch (error) {
        console.error('Session validation error:', error);
        PersistentAuthService.clearSession();
      }
      
      // Configurer l'extension automatique de session
      PersistentAuthService.setupAutoExtension();
    }
    
    // Toujours arrêter le chargement
    setIsLoading(false);
  }, []);


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await PersistentAuthService.login(email, password);
      
      if (result) {
        setUser(result.user);
        setToken(result.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    PersistentAuthService.logout();
    setUser(null);
    setToken(null);
    setViewMode({ type: 'admin', isSimulated: false });
    setTestMode({ isActive: false, logs: [] });
  };

  const toggleTestMode = () => {
    setTestMode(prev => ({
      ...prev,
      isActive: !prev.isActive,
      logs: prev.isActive ? [] : prev.logs
    }));
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    viewMode,
    testMode,
    login,
    logout,
    setViewMode,
    toggleTestMode,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
