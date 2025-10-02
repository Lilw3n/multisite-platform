'use client';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { User } from '@/types';

interface OptionalAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

/**
 * Hook d'authentification optionnel qui ne lance pas d'erreur
 * si utilisé en dehors d'un AuthProvider
 */
export function useOptionalAuth(): OptionalAuthResult {
  try {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
      // Pas dans un AuthProvider, retourner des valeurs par défaut
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null
      };
    }
    
    return {
      user: context.user,
      isAuthenticated: context.isAuthenticated,
      isLoading: context.isLoading,
      token: context.token
    };
  } catch (error) {
    // En cas d'erreur, retourner des valeurs sécurisées
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null
    };
  }
}

/**
 * Hook pour simuler un utilisateur connecté en mode démo
 * Utile pour les pages externes qui veulent montrer du contenu
 */
export function useDemoAuth(): OptionalAuthResult {
  const auth = useOptionalAuth();
  
  // Si pas d'utilisateur réel, créer un utilisateur démo
  if (!auth.user) {
    const demoUser: User = {
      id: 'demo-user',
      name: 'Utilisateur Démo',
      email: 'demo@diddyhome.fr',
      role: 'client',
      permissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      user: demoUser,
      isAuthenticated: false, // Pas vraiment authentifié
      isLoading: false,
      token: null
    };
  }
  
  return auth;
}

/**
 * Hook pour vérifier si on est dans un contexte d'authentification
 */
export function useHasAuthContext(): boolean {
  try {
    const context = useContext(AuthContext);
    return context !== undefined;
  } catch {
    return false;
  }
}
