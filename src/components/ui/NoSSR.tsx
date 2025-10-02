'use client';

import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Composant pour désactiver le SSR sur certains éléments
 * Utilise dynamic import de Next.js pour éviter l'hydratation
 */
const NoSSR = ({ children, fallback = null }: NoSSRProps) => {
  return <>{children}</>;
};

// Export avec dynamic import pour désactiver le SSR
export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
  loading: () => null
});