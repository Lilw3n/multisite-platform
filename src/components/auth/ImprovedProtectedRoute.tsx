'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PersistentAuthService } from '@/lib/persistentAuth';
import { User } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ImprovedProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
  allowGuest?: boolean;
  showLoading?: boolean;
}

export default function ImprovedProtectedRoute({
  children,
  requiredRoles = [],
  fallbackPath,
  allowGuest = false,
  showLoading = true
}: ImprovedProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Vérifier la session persistante
        const session = PersistentAuthService.getSession();
        
        if (session) {
          setUser(session.user);
          
          // Si aucun rôle requis, accès autorisé
          if (requiredRoles.length === 0) {
            setHasAccess(true);
            return;
          }
          
          // Vérifier les rôles
          const userRole = getUserRole(session.user);
          const hasRequiredRole = requiredRoles.includes(userRole);
          setHasAccess(hasRequiredRole);
          
          // Redirection si pas d'accès
          if (!hasRequiredRole) {
            const redirectPath = fallbackPath || getDefaultRedirectPath(userRole);
            router.push(redirectPath);
          }
        } else {
          // Pas de session active
          if (allowGuest) {
            setHasAccess(true);
          } else {
            // Redirection vers login
            const currentPath = window.location.pathname;
            const loginPath = currentPath.startsWith('/dashboard') ? '/login' : '/external/login';
            router.push(loginPath);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification:', error);
        if (!allowGuest) {
          router.push('/external/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRoles, fallbackPath, allowGuest, router]);

  // Fonction pour obtenir le rôle utilisateur
  const getUserRole = (user: User): string => {
    if (!user.ranks || user.ranks.length === 0) return 'external';
    
    const highestRank = user.ranks.reduce((highest, current) => 
      current.rank.level < highest.rank.level ? current : highest
    );

    switch (highestRank.rank.level) {
      case 0: return 'admin';
      case 1: case 2: case 3: return 'internal';
      default: return 'external';
    }
  };

  // Fonction pour obtenir le chemin de redirection par défaut
  const getDefaultRedirectPath = (userRole: string): string => {
    switch (userRole) {
      case 'admin':
      case 'internal':
        return '/dashboard';
      case 'external':
        return '/dashboard/external/profile';
      default:
        return '/external';
    }
  };

  // Affichage du loading
  if (isLoading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Affichage du contenu si accès autorisé
  if (hasAccess || allowGuest) {
    return <>{children}</>;
  }

  // Pas d'accès et pas de guest autorisé
  return null;
}

/**
 * Hook pour vérifier l'authentification
 */
export function useImprovedAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const session = PersistentAuthService.getSession();
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erreur auth hook:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Écouter les changements de session
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'diddyhome_session') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await PersistentAuthService.login(email, password);
      if (result) {
        setUser(result.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    PersistentAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout
  };
}
