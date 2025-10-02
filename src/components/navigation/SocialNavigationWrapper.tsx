'use client';

import React, { useState } from 'react';
import SocialNavigationMenu, { SocialNavigationButton } from './SocialNavigationMenu';

interface SocialNavigationWrapperProps {
  children: React.ReactNode;
  showButton?: boolean;
}

export default function SocialNavigationWrapper({ 
  children, 
  showButton = true 
}: SocialNavigationWrapperProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {children}
      
      {/* Bouton flottant de navigation sociale */}
      {showButton && (
        <SocialNavigationButton onClick={handleOpenMenu} />
      )}
      
      {/* Menu de navigation sociale */}
      <SocialNavigationMenu 
        isOpen={isMenuOpen} 
        onClose={handleCloseMenu} 
      />
    </>
  );
}
