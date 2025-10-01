import { useState, useEffect } from 'react';

/**
 * Hook pour gérer l'hydratation côté client
 * Évite les erreurs d'hydratation en s'assurant que le composant
 * ne s'affiche qu'après le montage côté client
 */
export function useClientSide() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook pour accéder à localStorage de manière sécurisée
 * Évite les erreurs d'hydratation
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const isClient = useClientSide();

  useEffect(() => {
    if (isClient) {
      try {
        const item = localStorage.getItem(key);
        if (item !== null) {
          setValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
      }
    }
  }, [key, isClient]);

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      if (isClient) {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue] as const;
}
