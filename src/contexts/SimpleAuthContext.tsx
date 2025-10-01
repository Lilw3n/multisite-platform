'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ViewMode, TestMode } from '@/types';

interface SimpleAuthContextType {
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

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
};

interface SimpleAuthProviderProps {
  children: ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
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
    console.log('🔍 SimpleAuthContext: useEffect déclenché');
    // Vérifier le token stocké au chargement
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      console.log('🔑 Token stocké:', storedToken ? 'présent' : 'absent');
      if (storedToken) {
        // Validation simple
        const userData = {
          id: '1',
          email: 'lilwen.song@gmail.pro.com',
          firstName: 'Lilwen',
          lastName: 'Song',
          isActive: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date(),
          ranks: [{
            id: '1',
            userId: '1',
            rankId: '1',
            siteId: 'default',
            assignedAt: new Date(),
            assignedBy: 'system',
            isActive: true,
            rank: {
              id: '1',
              name: 'Administrateur',
              level: 0,
              description: 'Administrateur système',
              capabilities: [],
              color: '#3B82F6',
              isSystem: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }],
          sites: [],
          tokens: []
        };
        console.log('👤 Utilisateur défini:', userData.email);
        setUser(userData);
        setToken(storedToken);
      }
    }
    // Toujours arrêter le chargement
    console.log('⏹️ Arrêt du chargement');
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === 'lilwen.song@gmail.pro.com' && password === 'Reunion2025') {
      const userData = {
        id: '1',
        email: 'lilwen.song@gmail.pro.com',
        firstName: 'Lilwen',
        lastName: 'Song',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date(),
        ranks: [{
          id: '1',
          userId: '1',
          rankId: '1',
          siteId: 'default',
          assignedAt: new Date(),
          assignedBy: 'system',
          isActive: true,
          rank: {
            id: '1',
            name: 'Administrateur',
            level: 0,
            description: 'Administrateur système',
            capabilities: [],
            color: '#3B82F6',
            isSystem: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }],
        sites: [],
        tokens: []
      };
      
      const token = 'simple-token-' + Date.now();
      setUser(userData);
      setToken(token);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
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

  const value: SimpleAuthContextType = {
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
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};
