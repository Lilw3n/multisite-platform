'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ModuleSelector from '@/components/ModuleSelector';

interface TestDragDropProps {
  onModuleEdit: (moduleId: string) => void;
}

export default function TestDragDrop({ onModuleEdit }: TestDragDropProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const handleModuleSelect = (moduleType: string) => {
    console.log('🎯 TestDragDrop - handleModuleSelect appelé avec:', moduleType);
    console.log('🎯 TestDragDrop - onModuleEdit fonction:', typeof onModuleEdit);
    
    // Ouvrir le formulaire correspondant
    onModuleEdit(`new-${moduleType}`);
    setIsSelectorOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Test Modules</h2>
        <button
          onClick={() => {
            console.log('🎯 TestDragDrop - Bouton Ajouter cliqué');
            setIsSelectorOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Test du système</h3>
          <p className="text-gray-600 mb-4">Cliquez sur "Ajouter" pour tester</p>
        </div>
      </div>

      <ModuleSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelectModule={handleModuleSelect}
        title="Test - Ajouter un module"
      />
    </div>
  );
}
