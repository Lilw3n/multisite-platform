'use client';

import React, { ReactNode, useEffect, useState } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
  suppressHydrationWarning?: boolean;
}

/**
 * Composant pour gérer l'hydratation de manière sécurisée
 * Évite les erreurs de mismatch entre serveur et client
 */
export default function HydrationSafe({ 
  children, 
  fallback = null, 
  suppressHydrationWarning = true 
}: HydrationSafeProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Marquer comme hydraté après le premier render côté client
    setIsHydrated(true);
  }, []);

  // Pendant l'hydratation, afficher le fallback ou rien
  if (!isHydrated) {
    return <div suppressHydrationWarning={suppressHydrationWarning}>{fallback}</div>;
  }

  // Après hydratation, afficher le contenu réel
  return <div suppressHydrationWarning={suppressHydrationWarning}>{children}</div>;
}

/**
 * Hook pour détecter si on est côté client après hydratation
 */
export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Composant pour les valeurs qui changent entre serveur et client
 */
interface ClientValueProps<T> {
  serverValue: T;
  clientValue: T;
  render: (value: T) => ReactNode;
}

export function ClientValue<T>({ serverValue, clientValue, render }: ClientValueProps<T>) {
  const isHydrated = useIsHydrated();
  return <>{render(isHydrated ? clientValue : serverValue)}</>;
}

/**
 * Composant pour les timestamps sécurisés
 */
interface SafeTimestampProps {
  format?: (date: Date) => string;
  fallback?: string;
}

export function SafeTimestamp({ format, fallback = 'Chargement...' }: SafeTimestampProps) {
  const isHydrated = useIsHydrated();
  
  if (!isHydrated) {
    return <span>{fallback}</span>;
  }
  
  const now = new Date();
  const formatted = format ? format(now) : now.toLocaleString('fr-FR');
  
  return <span>{formatted}</span>;
}

/**
 * Composant pour les nombres aléatoires sécurisés
 */
interface SafeRandomProps {
  min?: number;
  max?: number;
  render: (value: number) => ReactNode;
  fallback?: ReactNode;
}

export function SafeRandom({ min = 0, max = 100, render, fallback = null }: SafeRandomProps) {
  const isHydrated = useIsHydrated();
  const [randomValue, setRandomValue] = useState<number | null>(null);
  
  useEffect(() => {
    if (isHydrated) {
      setRandomValue(Math.floor(Math.random() * (max - min + 1)) + min);
    }
  }, [isHydrated, min, max]);
  
  if (!isHydrated || randomValue === null) {
    return <>{fallback}</>;
  }
  
  return <>{render(randomValue)}</>;
}
