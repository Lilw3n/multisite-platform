'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        console.log('✅ Utilisateur déjà connecté - redirection vers dashboard');
        router.push('/dashboard');
      } else {
        console.log('❌ Utilisateur non connecté - redirection vers login');
        router.push('/login');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-sm text-gray-600">Vérification de l'authentification...</p>
        <p className="mt-2 text-xs text-gray-500">Redirection en cours...</p>
      </div>
    </div>
  );
}
