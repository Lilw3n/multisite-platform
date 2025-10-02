import { useEffect, useCallback } from 'react';

interface UseModalKeyboardOptions {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  enableEscape?: boolean;
  enableEnter?: boolean;
  preventEnterOnTextarea?: boolean;
}

/**
 * Hook pour gérer les contrôles clavier des modales
 * - Échap : fermer la modale
 * - Entrée : confirmer l'action (si onConfirm est fourni)
 */
export const useModalKeyboard = ({
  isOpen,
  onClose,
  onConfirm,
  enableEscape = true,
  enableEnter = true,
  preventEnterOnTextarea = true
}: UseModalKeyboardOptions) => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    // Échap pour fermer
    if (enableEscape && event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    // Entrée pour confirmer
    if (enableEnter && event.key === 'Enter' && onConfirm) {
      // Éviter la confirmation si on est dans un textarea ou si Shift est pressé
      const target = event.target as HTMLElement;
      const isTextarea = target.tagName === 'TEXTAREA';
      const isShiftPressed = event.shiftKey;
      
      if (preventEnterOnTextarea && (isTextarea || isShiftPressed)) {
        return;
      }

      // Éviter la confirmation si on est dans un champ de texte multiligne
      const isContentEditable = target.contentEditable === 'true';
      if (isContentEditable) {
        return;
      }

      event.preventDefault();
      onConfirm();
    }
  }, [isOpen, onClose, onConfirm, enableEscape, enableEnter, preventEnterOnTextarea]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      
      // Empêcher le scroll de la page quand la modale est ouverte
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleKeyDown]);

  return {
    // Fonction utilitaire pour ajouter les props aux éléments focusables
    getKeyboardProps: () => ({
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && enableEscape) {
          e.preventDefault();
          onClose();
        }
      }
    })
  };
};

/**
 * Hook simplifié pour les modales de confirmation
 */
export const useConfirmationModal = (
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void
) => {
  return useModalKeyboard({
    isOpen,
    onClose,
    onConfirm,
    enableEscape: true,
    enableEnter: true,
    preventEnterOnTextarea: true
  });
};

/**
 * Hook pour les modales d'information (seulement Échap pour fermer)
 */
export const useInfoModal = (
  isOpen: boolean,
  onClose: () => void
) => {
  return useModalKeyboard({
    isOpen,
    onClose,
    enableEscape: true,
    enableEnter: false
  });
};
