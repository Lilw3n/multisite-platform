'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InterlocutorForm from '@/components/InterlocutorForm';

export default function ExternalRegisterPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSuccess = (interlocutor: any) => {
    console.log('✅ Inscription réussie:', interlocutor);
    setIsRegistered(true);
    
    // Redirection automatique après 3 secondes
    setTimeout(() => {
      router.push('/external/login');
    }, 3000);
  };

  const handleCancel = () => {
    router.push('/external');
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Inscription réussie !
            </h1>
            <p className="text-gray-600 mb-6">
              Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-4">
              Redirection en cours...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/external" className="inline-block">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🏠 DiddyHome</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Créer votre compte
          </h2>
          <p className="text-gray-600">
            Rejoignez notre communauté et bénéficiez de nos services d'assurance
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-500">❌</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <InterlocutorForm
          userRole="external"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />

        <div className="text-center mt-8">
          <Link
            href="/external/login"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
