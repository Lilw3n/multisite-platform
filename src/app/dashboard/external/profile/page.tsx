'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ExternalUserLayout from '@/components/layout/ExternalUserLayout';

interface SimulatedInterlocutor {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'Actif' | 'Inactif';
  lastActivity: string;
  type: 'user' | 'external';
}

export default function InterlocutorProfilePage() {
  const [interlocutor, setInterlocutor] = useState<SimulatedInterlocutor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const simulated = localStorage.getItem('simulated_interlocutor');
      if (simulated) {
        setInterlocutor(JSON.parse(simulated));
      }
      setIsLoading(false);
    }
  }, []);

  const getStatusColor = (status: SimulatedInterlocutor['status']) => {
    return status === 'Actif' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!interlocutor) {
    return (
      <ExternalUserLayout
        title="Erreur de simulation"
        subtitle="Aucun interlocuteur simulé trouvé"
      >
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Aucune simulation active
            </h2>
            <p className="text-gray-600 mb-6">
              Vous devez sélectionner un interlocuteur pour voir cette page.
            </p>
            <Link
              href="/dashboard/external/simulate"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Choisir un interlocuteur
            </Link>
          </div>
        </div>
      </ExternalUserLayout>
    );
  }

  return (
    <ExternalUserLayout
      title="Mon Profil"
      subtitle={`Bienvenue ${interlocutor.name}`}
      selectedInterlocutor={interlocutor}
    >
      <div className="space-y-6">
        {/* Bannière de simulation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">🎭</span>
            <div>
              <h3 className="text-lg font-medium text-blue-900">
                Mode Simulation Actif
              </h3>
              <p className="text-blue-700">
                Vous voyez l'interface comme la verrait {interlocutor.name} ({interlocutor.email})
              </p>
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mes informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <p className="mt-1 text-sm text-gray-900">{interlocutor.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{interlocutor.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <p className="mt-1 text-sm text-gray-900">{interlocutor.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Entreprise</label>
              <p className="mt-1 text-sm text-gray-900">{interlocutor.company}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interlocutor.status)}`}>
                {interlocutor.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dernière activité</label>
              <p className="mt-1 text-sm text-gray-900">{interlocutor.lastActivity}</p>
            </div>
          </div>
        </div>

        {/* Mes contrats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mes contrats</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Assurance VTC</h4>
                  <p className="text-sm text-gray-600">AXA - POL-2024-001</p>
                  <p className="text-sm text-gray-600">
                    01/01/2024 - 31/12/2024 • 1,200€
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  En cours
                </span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Assurance RC Professionnelle</h4>
                  <p className="text-sm text-gray-600">Groupama - GRP-2024-002</p>
                  <p className="text-sm text-gray-600">
                    01/06/2024 - 31/05/2025 • 850€
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  En cours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mes véhicules */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mes véhicules</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Peugeot 308 SW</h4>
                  <p className="text-sm text-gray-600">AB-123-CD • 2020 • Diesel</p>
                  <p className="text-sm text-gray-600">
                    Valeur: 18,500€ • Puissance: 130 CV
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Assuré
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mes sinistres */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mes sinistres</h3>
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun sinistre enregistré</p>
            <p className="text-gray-400 text-sm mt-1">Vos sinistres apparaîtront ici s'il y en a</p>
          </div>
        </div>

        {/* Actions disponibles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Actions disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-sm font-medium">
              📊 Consulter mes statistiques
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-sm font-medium">
              📋 Télécharger mes documents
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md text-sm font-medium">
              💬 Contacter le support
            </button>
          </div>
        </div>

        {/* Boutons de navigation */}
        <div className="flex justify-between">
          <Link
            href="/dashboard/external/simulate"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium"
          >
            ← Changer d'interlocuteur
          </Link>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('simulated_interlocutor');
                localStorage.setItem('view_mode', 'admin');
                window.location.href = '/dashboard';
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium"
          >
            🚨 Arrêter la simulation
          </button>
        </div>
      </div>
    </ExternalUserLayout>
  );
}