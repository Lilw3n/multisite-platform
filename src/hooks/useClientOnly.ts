import { useState, useEffect } from 'react';

/**
 * Hook pour s'assurer qu'un composant ne s'affiche que côté client
 * Évite les erreurs d'hydratation
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook pour gérer les valeurs qui changent entre serveur et client
 */
export function useIsomorphicValue<T>(serverValue: T, clientValue: T): T {
  const [value, setValue] = useState(serverValue);
  const isClient = useClientOnly();

  useEffect(() => {
    if (isClient) {
      setValue(clientValue);
    }
  }, [isClient, clientValue]);

  return value;
}

/**
 * Hook pour les timestamps stables
 */
export function useStableTimestamp() {
  const [timestamp] = useState(() => Date.now());
  return timestamp;
}

/**
 * Hook pour les IDs stables
 */
export function useStableId(prefix: string = 'id') {
  const [id] = useState(() => `${prefix}-${Math.random().toString(36).substr(2, 9)}`);
  return id;
}
