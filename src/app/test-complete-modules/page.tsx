'use client';

import React from 'react';
import CompleteModuleManager from '@/components/dragdrop/CompleteModuleManager';

export default function TestCompleteModulesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Système Complet d'Organisation des Modules
          </h1>
          <p className="text-gray-600 text-lg">
            Système de drag & drop complet avec gestion des projets, dossiers et hiérarchie
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Zone principale */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <CompleteModuleManager 
                interlocutorId="demo-user-123"
                initialModules={[
                  {
                    id: 'demo-project-1',
                    type: 'project',
                    name: 'Projet Démo Principal',
                    status: 'Actif',
                    details: 'Projet de démonstration pour tester le système complet',
                    date: new Date().toLocaleDateString('fr-FR'),
                    isFolder: true,
                    expanded: true,
                    children: [
                      {
                        id: 'demo-contract-1',
                        type: 'contract',
                        name: 'Contrat Auto',
                        status: 'En cours',
                        details: 'Contrat d\'assurance automobile',
                        date: new Date().toLocaleDateString('fr-FR'),
                        cost: '1200€',
                        insurer: 'AXA',
                        contractNumber: 'POL-2024-001',
                        isFolder: false,
                        expanded: false,
                        children: []
                      }
                    ],
                    title: 'Projet Démo Principal',
                    description: 'Projet de démonstration pour tester le système complet',
                    manager: 'user-1'
                  },
                  {
                    id: 'demo-folder-1',
                    type: 'folder',
                    name: 'Dossier Documents',
                    status: 'Actif',
                    details: 'Dossier pour organiser les documents',
                    date: new Date().toLocaleDateString('fr-FR'),
                    isFolder: true,
                    expanded: false,
                    children: []
                  }
                ]}
                onModulesChange={(modules) => {
                  console.log('📦 Modules mis à jour:', modules);
                }}
              />
            </div>
          </div>

          {/* Panneau d'information */}
          <div className="space-y-6">
            {/* Fonctionnalités */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                ✅ Fonctionnalités Implémentées
              </h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>Drag & Drop complet</strong>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>Hiérarchie de dossiers</strong>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>Module Projet avec gestionnaire</strong>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>Sauvegarde persistante</strong>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>Ajout de modules contextuel</strong>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>Édition des projets</strong>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>Suppression de modules</strong>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>Indicateurs visuels</strong>
                </li>
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">
                📋 Instructions d'Utilisation
              </h2>
              <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
                <li><strong>Ajouter un module :</strong> Cliquez sur "Ajouter un module"</li>
                <li><strong>Créer un projet :</strong> Sélectionnez "Projet" et remplissez le formulaire</li>
                <li><strong>Organiser :</strong> Glissez-déposez les modules entre dossiers</li>
                <li><strong>Développer/Réduire :</strong> Cliquez sur l'icône 📁</li>
                <li><strong>Ajouter dans un dossier :</strong> Utilisez le bouton "+" dans chaque dossier</li>
                <li><strong>Modifier :</strong> Cliquez sur l'icône ✏️</li>
                <li><strong>Supprimer :</strong> Cliquez sur l'icône 🗑️</li>
              </ol>
            </div>

            {/* Types de modules */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📦 Types de Modules
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-100 rounded mr-2"></span>
                  <span>Sinistre</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-100 rounded mr-2"></span>
                  <span>Véhicule</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-100 rounded mr-2"></span>
                  <span>Conducteur</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-purple-100 rounded mr-2"></span>
                  <span>Contrat</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-indigo-100 rounded mr-2"></span>
                  <span>Assurance</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-pink-100 rounded mr-2"></span>
                  <span>Profil</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-orange-100 rounded mr-2"></span>
                  <span>Événement</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-100 rounded mr-2"></span>
                  <span>Projet</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-100 rounded mr-2"></span>
                  <span>Dossier</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-cyan-100 rounded mr-2"></span>
                  <span>Devis</span>
                </div>
              </div>
            </div>

            {/* Statut */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-900 mb-2">
                🎉 Système Terminé
              </h2>
              <p className="text-sm text-green-800">
                Le système d'organisation des modules avec drag & drop est maintenant complet et fonctionnel !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
