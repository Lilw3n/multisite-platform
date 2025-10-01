/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour éviter les problèmes d'hydratation
  reactStrictMode: true,
  // Désactiver les avertissements d'hydratation pour les éléments HTML
  onDemandEntries: {
    // période de conservation des pages en mémoire
    maxInactiveAge: 25 * 1000,
    // nombre de pages conservées simultanément
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
