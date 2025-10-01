'use client';

import { useState, useEffect, ReactNode } from 'react';

interface HydrationBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const HydrationBoundary: React.FC<HydrationBoundaryProps> = ({ 
  children, 
  fallback = null 
}) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Délai pour s'assurer que le DOM est complètement chargé
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
