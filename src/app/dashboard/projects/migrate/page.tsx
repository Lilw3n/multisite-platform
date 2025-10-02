'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import ProjectItemMigration from '@/components/projects/ProjectItemMigration';

export default function ProjectMigrationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/projects"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Package className="w-6 h-6 mr-2 text-blue-500" />
                  Migration vers les Projets
                </h1>
                <p className="text-gray-600">
                  Organisez vos devis et contrats existants dans des projets structurés
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Comment migrer vos données ?
          </h2>
          <div className="space-y-2 text-blue-800">
            <p>• <strong>Étape 1:</strong> Sélectionnez les devis et contrats que vous souhaitez organiser</p>
            <p>• <strong>Étape 2:</strong> Choisissez un projet existant ou créez-en un nouveau</p>
            <p>• <strong>Étape 3:</strong> Lancez la migration - vos données seront automatiquement organisées</p>
            <p>• <strong>Avantages:</strong> Hiérarchie claire, glisser-déposer, suivi centralisé, collaboration</p>
          </div>
        </div>

        {/* Composant de migration */}
        <ProjectItemMigration />

        {/* Aide supplémentaire */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Besoin d'aide ?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Qu'est-ce qu'un projet ?</h4>
              <p className="text-gray-600 text-sm">
                Un projet est un conteneur qui regroupe tous les éléments liés à un client ou une affaire : 
                devis, contrats, documents, tâches, et communications. Il permet une organisation hiérarchique 
                avec des sous-projets.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Puis-je annuler une migration ?</h4>
              <p className="text-gray-600 text-sm">
                Les données migrées restent intactes. Vous pouvez toujours déplacer les éléments entre 
                projets ou les sortir d'un projet si nécessaire. La migration est réversible.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Organisation recommandée</h4>
              <p className="text-gray-600 text-sm">
                Nous recommandons de créer un projet par client principal, avec des sous-projets pour 
                chaque type d'assurance (auto, habitation, santé). Cela facilite la navigation et le suivi.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Fonctionnalités avancées</h4>
              <p className="text-gray-600 text-sm">
                Une fois organisés en projets, vous pourrez utiliser le glisser-déposer pour réorganiser, 
                ajouter des membres, définir des tags, et suivre l'avancement de chaque projet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
