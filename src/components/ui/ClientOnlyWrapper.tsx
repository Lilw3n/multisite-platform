'use client';

import React, { ReactNode } from 'react';
import { useClientOnly } from '@/hooks/useClientOnly';

interface ClientOnlyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper pour s'assurer qu'un composant ne s'affiche que côté client
 * Évite les erreurs d'hydratation
 */
export default function ClientOnlyWrapper({ children, fallback = null }: ClientOnlyWrapperProps) {
  const isClient = useClientOnly();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
