'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import ModuleSelector from './ModuleSelector';

interface AddModuleButtonProps {
  onModuleSelect: (moduleType: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  showText?: boolean;
}

export default function AddModuleButton({ 
  onModuleSelect, 
  className = '',
  size = 'md',
  variant = 'primary',
  showText = true
}: AddModuleButtonProps) {
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);

  const handleModuleSelect = (moduleType: string) => {
    onModuleSelect(moduleType);
    setIsSelectorOpen(false);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <>
      <button
        onClick={() => setIsSelectorOpen(true)}
        className={`
          inline-flex items-center space-x-2 rounded-lg font-medium transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
      >
        <Plus className={iconSizes[size]} />
        {showText && <span>Ajouter</span>}
      </button>

      <ModuleSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelectModule={handleModuleSelect}
        title="Ajouter un module"
      />
    </>
  );
}

// Composant spécialisé pour les en-têtes de modules
export function ModuleHeaderAddButton({ onModuleSelect }: { onModuleSelect: (moduleType: string) => void }) {
  return (
    <AddModuleButton
      onModuleSelect={onModuleSelect}
      variant="outline"
      size="sm"
      className="ml-auto"
    />
  );
}

// Composant pour les boutons d'action rapide
export function QuickAddButton({ onModuleSelect }: { onModuleSelect: (moduleType: string) => void }) {
  return (
    <AddModuleButton
      onModuleSelect={onModuleSelect}
      variant="primary"
      size="lg"
      className="w-full justify-center"
    />
  );
}
