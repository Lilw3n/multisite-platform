import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MinimalAuthProvider as AuthProvider } from '@/contexts/MinimalAuthContext';
import { HydrationBoundary } from '@/components/ui/HydrationBoundary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import SocialNavigationWrapper from '@/components/navigation/SocialNavigationWrapper';
import MobileLayout from '@/components/mobile/MobileLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plateforme Multisite - Système de Rôles Hiérarchique',
  description: 'Système multisite complet avec authentification, gestion des rôles hiérarchiques, modules modulaires et dashboards personnalisés.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <HydrationBoundary fallback={<LoadingSpinner />}>
          <AuthProvider>
            <MobileLayout>
              <SocialNavigationWrapper>
                {children}
              </SocialNavigationWrapper>
            </MobileLayout>
          </AuthProvider>
        </HydrationBoundary>
      </body>
    </html>
  );
}
