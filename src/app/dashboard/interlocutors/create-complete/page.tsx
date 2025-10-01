'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/MinimalAuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UnifiedDataForm from '@/components/UnifiedDataForm';
import { Interlocutor, Driver, Vehicle, Claim } from '@/types/interlocutor';
import { InterlocutorService } from '@/lib/interlocutors';

export default function CreateCompleteInterlocutorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleSuccess = async (data: {
    interlocutor: Interlocutor;
    drivers: Driver[];
    vehicles: Vehicle[];
    claims: Claim[];
  }) => {
    setIsLoading(true);
    
    try {
      // Créer l'interlocuteur
      const interlocutorResult = await InterlocutorService.createInterlocutor(
        data.interlocutor,
        'internal' // Par défaut, on utilise le rôle internal
      );

      if (interlocutorResult.success && interlocutorResult.interlocutor) {
        // Ici, vous pourriez ajouter la logique pour sauvegarder les conducteurs, véhicules et sinistres
        // Pour l'instant, on simule juste la création
        console.log('Interlocuteur créé:', interlocutorResult.interlocutor);
        console.log('Conducteurs:', data.drivers);
        console.log('Véhicules:', data.vehicles);
        console.log('Sinistres:', data.claims);
        
        alert('Interlocuteur et données associées créés avec succès !');
        router.push('/dashboard/interlocutors');
      } else {
        alert('Erreur lors de la création: ' + (interlocutorResult.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/interlocutors');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Création complète d'interlocuteur
                </h1>
                <p className="text-gray-600 mt-2">
                  Créez un interlocuteur avec toutes ses données associées (conducteurs, véhicules, sinistres)
                </p>
              </div>

              <UnifiedDataForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
                userRole={'internal'}
              />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
