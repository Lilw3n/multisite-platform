'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ModuleManager from '@/components/ModuleManager';
import { InterlocutorService } from '@/lib/interlocutors';

interface ModuleItem {
  id: string;
  type: string;
  name: string;
  status: string;
  details: string;
  date: string;
  cost?: string;
  insurer?: string;
  contractNumber?: string;
  assignedTo?: string;
  priority?: string;
}

export default function InterlocutorModulesPage() {
  const params = useParams();
  const interlocutorId = params.id as string;
  const [interlocutor, setInterlocutor] = useState<any>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterlocutor();
  }, [interlocutorId]);

  const loadInterlocutor = async () => {
    try {
      setLoading(true);
      const data = await InterlocutorService.getInterlocutorById(interlocutorId);
      setInterlocutor(data);
      
      // Convertir les données de l'interlocuteur en modules
      const moduleData: ModuleItem[] = [];
      
      // Sinistres
      if (data.claims) {
        data.claims.forEach((claim: any) => {
          moduleData.push({
            id: claim.id,
            type: 'claim',
            name: claim.reference || 'Sinistre',
            status: claim.status,
            details: claim.description,
            date: claim.date,
            cost: claim.amount ? `${claim.amount}€` : undefined,
            insurer: claim.insurer,
            priority: claim.priority
          });
        });
      }
      
      // Véhicules
      if (data.vehicles) {
        data.vehicles.forEach((vehicle: any) => {
          moduleData.push({
            id: vehicle.id,
            type: 'vehicle',
            name: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
            status: vehicle.status,
            details: `Plaque: ${vehicle.licensePlate} - ${vehicle.type}`,
            date: vehicle.registrationDate,
            cost: vehicle.value ? `${vehicle.value}€` : undefined
          });
        });
      }
      
      // Conducteurs
      if (data.drivers) {
        data.drivers.forEach((driver: any) => {
          moduleData.push({
            id: driver.id,
            type: 'driver',
            name: `${driver.firstName} ${driver.lastName}`,
            status: driver.status,
            details: `ID: ${driver.licenseNumber} - Catégorie: ${driver.licenseCategory}`,
            date: driver.licenseIssueDate
          });
        });
      }
      
      // Contrats
      if (data.contracts) {
        data.contracts.forEach((contract: any) => {
          moduleData.push({
            id: contract.id,
            type: 'contract',
            name: contract.type,
            status: contract.status,
            details: contract.description,
            date: contract.startDate,
            cost: contract.premium ? `${contract.premium}€` : undefined,
            insurer: contract.insurer,
            contractNumber: contract.policyNumber
          });
        });
      }
      
      // Demandes d'assurance
      if (data.insuranceRequests) {
        data.insuranceRequests.forEach((request: any) => {
          moduleData.push({
            id: request.id,
            type: 'insurance-request',
            name: 'Demande d\'assurance',
            status: request.status,
            details: request.description,
            date: request.createdAt,
            assignedTo: request.assignedTo,
            priority: request.priority
          });
        });
      }
      
      // Événements
      if (data.events) {
        data.events.forEach((event: any) => {
          moduleData.push({
            id: event.id,
            type: 'event',
            name: event.title,
            status: event.status,
            details: event.description,
            date: event.date
          });
        });
      }
      
      setModules(moduleData);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'interlocuteur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleAdd = (moduleType: string) => {
    console.log(`Ajout d'un nouveau module de type: ${moduleType}`);
    // Ici vous pouvez rediriger vers le formulaire de création approprié
    // ou ouvrir un modal de création
  };

  const handleModuleEdit = (moduleId: string) => {
    console.log(`Modification du module: ${moduleId}`);
    // Ici vous pouvez rediriger vers le formulaire d'édition approprié
  };

  const handleModuleDelete = (moduleId: string) => {
    console.log(`Suppression du module: ${moduleId}`);
    // Ici vous pouvez confirmer la suppression et supprimer le module
  };

  const handleModuleLink = (moduleId: string) => {
    console.log(`Liaison du module: ${moduleId}`);
    // Ici vous pouvez gérer la liaison du module
  };

  const handleModuleUnlink = (moduleId: string) => {
    console.log(`Déliaison du module: ${moduleId}`);
    // Ici vous pouvez gérer la déliaison du module
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!interlocutor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interlocuteur non trouvé</h2>
          <p className="text-gray-600">L'interlocuteur demandé n'existe pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {interlocutor.firstName?.[0]}{interlocutor.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {interlocutor.firstName} {interlocutor.lastName}
              </h1>
              <p className="text-gray-600">{interlocutor.email}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Type:</span>
                <p className="font-medium">{interlocutor.type === 'user' ? 'Utilisateur interne' : 'Utilisateur externe'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Statut:</span>
                <p className="font-medium">{interlocutor.status}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Rôle:</span>
                <p className="font-medium">{interlocutor.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gestionnaire de modules */}
        <ModuleManager
          interlocutorId={interlocutorId}
          modules={modules}
          onModuleAdd={handleModuleAdd}
          onModuleEdit={handleModuleEdit}
          onModuleDelete={handleModuleDelete}
          onModuleLink={handleModuleLink}
          onModuleUnlink={handleModuleUnlink}
        />
      </div>
    </div>
  );
}
