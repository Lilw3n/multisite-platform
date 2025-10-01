'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/MinimalAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRank?: number;
  requiredPermissions?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRank, 
  requiredPermissions 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Vérification des permissions si spécifiées
  if (requiredRank !== undefined && user) {
    // Logique de vérification des rangs à implémenter
    // Pour l'instant, on laisse passer
  }

  if (requiredPermissions && user) {
    // Logique de vérification des permissions à implémenter
    // Pour l'instant, on laisse passer
  }

  return <>{children}</>;
};
