'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
  fallbackComponent?: React.ReactNode;
}

export default function RoleProtectedRoute({
  children,
  allowedRoles,
  redirectPath,
  fallbackComponent
}: RoleProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Vérifier si l'utilisateur est connecté
      if (!user) {
        router.push('/external/login');
        return;
      }

      // Récupérer le rôle depuis localStorage ou le contexte
      const userRole = typeof window !== 'undefined' 
        ? localStorage.getItem('user_role') 
        : null;

      // Vérifier si le rôle est autorisé
      if (!userRole || !allowedRoles.includes(userRole)) {
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          // Redirection par défaut selon le rôle
          switch (userRole) {
            case 'external':
              router.push('/dashboard/external/profile');
              break;
            case 'internal':
              router.push('/dashboard');
              break;
            case 'admin':
              router.push('/dashboard');
              break;
            default:
              router.push('/external/login');
          }
        }
        return;
      }

      setIsChecking(false);
    }
  }, [user, isLoading, router, allowedRoles, redirectPath]);

  // Affichage pendant le chargement
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Affichage du contenu protégé ou du fallback
  return <>{fallbackComponent || children}</>;
}

/**
 * Hook pour vérifier les permissions de rôle
 */
export function useRoleCheck(allowedRoles: string[]): {
  hasAccess: boolean;
  userRole: string | null;
  isLoading: boolean;
} {
  const { user, isLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      const role = typeof window !== 'undefined' 
        ? localStorage.getItem('user_role') 
        : null;
      
      setUserRole(role);
      setHasAccess(!!user && !!role && allowedRoles.includes(role));
    }
  }, [user, isLoading, allowedRoles]);

  return { hasAccess, userRole, isLoading };
}

/**
 * Composant d'accès refusé
 */
export function AccessDenied({ 
  userRole, 
  requiredRoles 
}: { 
  userRole: string | null; 
  requiredRoles: string[] 
}) {
  const router = useRouter();

  const handleGoBack = () => {
    switch (userRole) {
      case 'external':
        router.push('/dashboard/external/profile');
        break;
      case 'internal':
        router.push('/dashboard');
        break;
      case 'admin':
        router.push('/dashboard');
        break;
      default:
        router.push('/external');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Accès refusé
        </h1>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Votre rôle :</strong> {userRole || 'Non défini'}
          </p>
          <p className="text-sm text-yellow-800">
            <strong>Rôles requis :</strong> {requiredRoles.join(', ')}
          </p>
        </div>
        <button
          onClick={handleGoBack}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          Retour à mon espace
        </button>
      </div>
    </div>
  );
}
