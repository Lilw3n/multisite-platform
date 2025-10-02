'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ModeProvider } from '@/contexts/ModeContext';

interface ExternalLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout pour les pages externes avec AuthProvider optionnel
 * Permet aux pages externes d'utiliser useAuth sans erreur
 */
export default function ExternalLayout({ children }: ExternalLayoutProps) {
  return (
    <ModeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </AuthProvider>
    </ModeProvider>
  );
}
