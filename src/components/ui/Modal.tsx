'use client';

import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useModalKeyboard } from '@/hooks/useModalKeyboard';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  showConfirmButton?: boolean;
  confirmText?: string;
  confirmButtonClass?: string;
  enableKeyboard?: boolean;
  preventEnterOnTextarea?: boolean;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  showConfirmButton = false,
  confirmText = 'Confirmer',
  confirmButtonClass = 'bg-blue-600 hover:bg-blue-700 text-white',
  enableKeyboard = true,
  preventEnterOnTextarea = true,
  className = ''
}: ModalProps) {

  // Gestion des contrôles clavier
  useModalKeyboard({
    isOpen,
    onClose,
    onConfirm,
    enableEscape: enableKeyboard,
    enableEnter: enableKeyboard && !!onConfirm,
    preventEnterOnTextarea
  });

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                title="Fermer (Échap)"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {children}
          </div>
        </div>

        {/* Footer avec boutons */}
        {(showConfirmButton || onConfirm) && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            
            {onConfirm && (
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${confirmButtonClass}`}
                title="Confirmer (Entrée)"
              >
                {confirmText}
              </button>
            )}
          </div>
        )}

        {/* Indication des raccourcis clavier */}
        {enableKeyboard && (
          <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
            <span>Échap: Fermer</span>
            {onConfirm && <span className="ml-2">• Entrée: Confirmer</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Modal de confirmation avec boutons Annuler/Confirmer
 */
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'default'
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'warning' | 'success';
}) {
  
  const typeClasses = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      size="sm"
      confirmText={confirmText}
      confirmButtonClass={typeClasses[type]}
      showConfirmButton={true}
    >
      <div className="text-center py-4">
        <p className="text-gray-700 text-base">{message}</p>
      </div>
    </Modal>
  );
}

/**
 * Modal d'information simple (seulement bouton Fermer)
 */
export function InfoModal({
  isOpen,
  onClose,
  title = 'Information',
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      showCloseButton={true}
    >
      {children}
    </Modal>
  );
}
