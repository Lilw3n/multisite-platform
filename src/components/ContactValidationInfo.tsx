'use client';

import React from 'react';
import { Mail, Phone, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ContactValidationInfoProps {
  userRole: 'admin' | 'internal' | 'external';
  hasEmail: boolean;
  hasPhone: boolean;
  className?: string;
}

export default function ContactValidationInfo({ 
  userRole, 
  hasEmail, 
  hasPhone, 
  className = '' 
}: ContactValidationInfoProps) {
  const getValidationStatus = () => {
    if (userRole === 'external') {
      if (!hasEmail && !hasPhone) {
        return {
          type: 'error' as const,
          message: 'Au moins un email ou un téléphone est requis en mode externe',
          icon: AlertCircle,
          color: 'text-red-600 bg-red-50 border-red-200'
        };
      }
    }

    if (hasEmail && hasPhone) {
      return {
        type: 'success' as const,
        message: 'Email prioritaire, téléphone en complément',
        icon: CheckCircle,
        color: 'text-green-600 bg-green-50 border-green-200'
      };
    }

    if (hasEmail) {
      return {
        type: 'info' as const,
        message: 'Email utilisé comme identifiant principal',
        icon: Mail,
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      };
    }

    if (hasPhone) {
      return {
        type: 'info' as const,
        message: 'Téléphone utilisé comme identifiant principal',
        icon: Phone,
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      };
    }

    return {
      type: 'neutral' as const,
      message: 'Email et téléphone optionnels (email prioritaire si fourni)',
      icon: Info,
      color: 'text-gray-600 bg-gray-50 border-gray-200'
    };
  };

  const status = getValidationStatus();
  const Icon = status.icon;

  return (
    <div className={`p-3 rounded-lg border ${status.color} ${className}`}>
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 flex-shrink-0" />
        <p className="text-sm font-medium">{status.message}</p>
      </div>
      
      {/* Règles détaillées */}
      <div className="mt-2 text-xs space-y-1">
        <div className="flex items-center space-x-1">
          <span className="font-medium">Priorité:</span>
          <span>Email &gt; Téléphone &gt; Aucun</span>
        </div>
        
        {userRole === 'external' && (
          <div className="flex items-center space-x-1">
            <span className="font-medium">Mode externe:</span>
            <span>Au moins un contact requis</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <span className="font-medium">Unicité:</span>
          <span>
            {hasEmail && hasPhone ? 'Vérifiée sur l\'email' :
             hasEmail ? 'Vérifiée sur l\'email' :
             hasPhone ? 'Vérifiée sur le téléphone' :
             'Aucune vérification nécessaire'}
          </span>
        </div>
      </div>
    </div>
  );
}
