'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, ViewMode, TestMode } from '@/types';

interface MinimalAuthContextType {
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

const MinimalAuthContext = createContext<MinimalAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(MinimalAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a MinimalAuthProvider');
  }
  return context;
};

interface MinimalAuthProviderProps {
  children: ReactNode;
}

export const MinimalAuthProvider: React.FC<MinimalAuthProviderProps> = ({ children }) => {
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

  // Vérifier l'authentification au chargement
  React.useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('auth_token');
        const storedEmail = localStorage.getItem('user_email');
        
        if (storedToken && storedEmail) {
          // Créer un utilisateur par défaut
          const userData: User = {
            id: '1',
            email: storedEmail,
            firstName: 'Admin',
            lastName: 'DiddyHome',
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
          
          setUser(userData);
          setToken(storedToken);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Tentative de connexion:', email);
    
    if (email === 'lilwen.song@gmail.pro.com' && password === 'Reunion2025') {
      const userData: User = {
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
      
      const tokenValue = 'token_' + Date.now();
      
      console.log('✅ Connexion réussie:', userData.email);
      setUser(userData);
      setToken(tokenValue);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', tokenValue);
      }
      
      return true;
    }
    
    console.log('❌ Connexion échouée');
    return false;
  };

  const logout = () => {
    console.log('🚪 Déconnexion');
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

  const value: MinimalAuthContextType = {
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
    <MinimalAuthContext.Provider value={value}>
      {children}
    </MinimalAuthContext.Provider>
  );
};

