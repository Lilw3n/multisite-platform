'use client';

import React, { useState } from 'react';
import ModuleManager from '@/components/ModuleManager';
import { InterlocutorService } from '@/lib/interlocutors';

// Données de démonstration
const demoModules = [
  {
    id: 'claim-1',
    type: 'claim',
    name: 'materialRC100',
    status: 'En cours',
    details: 'Collision avec un autre véhicule sur l\'autoroute A1',
    date: '15/01/2024',
    cost: '2500€',
    insurer: 'AXA',
    priority: 'Responsable - 100% de responsabilité'
  },
  {
    id: 'vehicle-1',
    type: 'vehicle',
    name: 'Renault Trafic (2020)',
    status: 'Assuré',
    details: 'Plaque: AB-123-CD - Véhicule utilitaire',
    date: '01/01/2020',
    cost: '25000€'
  },
  {
    id: 'driver-1',
    type: 'driver',
    name: 'Jean Dupont',
    status: 'Actif',
    details: 'ID: 1234567890 - Catégorie: B',
    date: '15/06/2018'
  },
  {
    id: 'contract-1',
    type: 'contract',
    name: 'assurance',
    status: 'En cours',
    details: 'Contrat d\'assurance automobile',
    date: '01/01/2024',
    cost: '1200€',
    insurer: 'AXA',
    contractNumber: 'POL-2024-001'
  },
  {
    id: 'request-1',
    type: 'insurance-request',
    name: 'devis',
    status: 'En attente',
    details: 'Demande de devis pour assurance flotte de véhicules',
    date: '20/01/2024',
    assignedTo: 'Pierre Bernard',
    priority: 'Moyenne'
  }
];

export default function ModulesManagementPage() {
  const [selectedInterlocutor, setSelectedInterlocutor] = useState<string>('');
  const [interlocutors, setInterlocutors] = useState<any[]>([]);
  const [modules, setModules] = useState(demoModules);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    loadInterlocutors();
  }, []);

  const loadInterlocutors = async () => {
    try {
      setLoading(true);
      const data = await InterlocutorService.getAllInterlocutors();
      setInterlocutors(data);
    } catch (error) {
      console.error('Erreur lors du chargement des interlocuteurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleAdd = (moduleType: string) => {
    console.log(`Ajout d'un nouveau module de type: ${moduleType}`);
    
    // Créer un nouveau module de démonstration
    const newModule = {
      id: `${moduleType}-${Date.now()}`,
      type: moduleType,
      name: `Nouveau ${moduleType}`,
      status: 'Nouveau',
      details: `Module ${moduleType} créé le ${new Date().toLocaleDateString('fr-FR')}`,
      date: new Date().toLocaleDateString('fr-FR'),
      cost: moduleType === 'contract' ? '1000€' : undefined,
      insurer: moduleType === 'contract' ? 'AXA' : undefined
    };
    
    setModules(prev => [...prev, newModule]);
  };

  const handleModuleEdit = (moduleId: string) => {
    console.log(`Modification du module: ${moduleId}`);
    // Ici vous pouvez ouvrir un modal d'édition
  };

  const handleModuleDelete = (moduleId: string) => {
    console.log(`Suppression du module: ${moduleId}`);
    setModules(prev => prev.filter(module => module.id !== moduleId));
  };

  const handleModuleLink = (moduleId: string) => {
    console.log(`Liaison du module: ${moduleId}`);
    // Ici vous pouvez gérer la liaison du module
  };

  const handleModuleUnlink = (moduleId: string) => {
    console.log(`Déliaison du module: ${moduleId}`);
    // Ici vous pouvez gérer la déliaison du module
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestion des Modules</h1>
          <p className="text-gray-600">
            Gérez tous les modules associés aux interlocuteurs : sinistres, véhicules, conducteurs, contrats, etc.
          </p>
        </div>

        {/* Sélecteur d'interlocuteur */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sélectionner un interlocuteur</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedInterlocutor}
              onChange={(e) => setSelectedInterlocutor(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choisir un interlocuteur...</option>
              {interlocutors.map((interlocutor) => (
                <option key={interlocutor.id} value={interlocutor.id}>
                  {interlocutor.firstName} {interlocutor.lastName} ({interlocutor.email})
                </option>
              ))}
            </select>
            {selectedInterlocutor && (
              <button
                onClick={() => window.open(`/dashboard/interlocutors/${selectedInterlocutor}/modules`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Voir les modules
              </button>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sinistres</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {modules.filter(m => m.type === 'claim').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Véhicules</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {modules.filter(m => m.type === 'vehicle').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conducteurs</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {modules.filter(m => m.type === 'driver').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contrats</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {modules.filter(m => m.type === 'contract').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gestionnaire de modules */}
        <ModuleManager
          interlocutorId={selectedInterlocutor || 'demo'}
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
