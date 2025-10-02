/**
 * GESTIONNAIRE DE DONNÉES FICTIVES - À SUPPRIMER EN PRODUCTION
 * 
 * Ce fichier contient tous les utilitaires pour gérer les données de démonstration.
 * ⚠️ IMPORTANT : Supprimer ce fichier et toutes ses références avant la mise en production !
 * 
 * Commande pour trouver toutes les références :
 * grep -r "MOCK_DATA" src/
 * grep -r "mockDataManager" src/
 * grep -r "données fictives" src/
 */

export const MOCK_DATA_CONFIG = {
  // Flag pour activer/désactiver les données fictives
  ENABLE_MOCK_DATA: true,
  
  // Préfixes pour identifier les données fictives
  MOCK_ID_PREFIX: 'MOCK_',
  MOCK_EMAIL_DOMAIN: '@demo.diddyhome.com',
  
  // Marqueurs dans les commentaires
  MOCK_COMMENT_START: '/* === DONNÉES FICTIVES - DÉBUT === */',
  MOCK_COMMENT_END: '/* === DONNÉES FICTIVES - FIN === */',
  
  // Tags pour identifier les éléments fictifs
  MOCK_TAGS: {
    USER: '[DEMO-USER]',
    POST: '[DEMO-POST]',
    COMMUNITY: '[DEMO-COMMUNITY]',
    EVENT: '[DEMO-EVENT]',
    INTERLOCUTOR: '[DEMO-INTERLOCUTOR]',
    CONTRACT: '[DEMO-CONTRACT]',
    QUOTE: '[DEMO-QUOTE]'
  }
};

/**
 * Génère un ID fictif avec préfixe identifiable
 */
export const generateMockId = (type: string): string => {
  return `${MOCK_DATA_CONFIG.MOCK_ID_PREFIX}${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Génère un email fictif identifiable
 */
export const generateMockEmail = (name: string): string => {
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  return `${cleanName}${MOCK_DATA_CONFIG.MOCK_EMAIL_DOMAIN}`;
};

/**
 * Vérifie si un élément est fictif
 */
export const isMockData = (id: string): boolean => {
  return id.startsWith(MOCK_DATA_CONFIG.MOCK_ID_PREFIX);
};

/**
 * Nettoie toutes les données fictives d'un tableau
 */
export const removeMockData = <T extends { id: string }>(data: T[]): T[] => {
  return data.filter(item => !isMockData(item.id));
};

/**
 * Ajoute un marqueur de données fictives à un objet
 */
export const markAsMockData = <T>(data: T, type: keyof typeof MOCK_DATA_CONFIG.MOCK_TAGS): T & { _isMockData: boolean; _mockType: string } => {
  return {
    ...data,
    _isMockData: true,
    _mockType: MOCK_DATA_CONFIG.MOCK_TAGS[type]
  };
};

/**
 * Fonction utilitaire pour logger les données fictives en développement
 */
export const logMockDataWarning = (context: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`🚧 [MOCK DATA] ${context} - Données fictives utilisées. À supprimer en production !`);
  }
};

/**
 * Instructions pour supprimer toutes les données fictives
 */
export const CLEANUP_INSTRUCTIONS = `
🧹 INSTRUCTIONS DE NETTOYAGE POUR LA PRODUCTION :

1. Supprimer ce fichier : src/lib/mockDataManager.ts

2. Rechercher et supprimer toutes les références :
   - grep -r "MOCK_DATA" src/
   - grep -r "mockDataManager" src/
   - grep -r "données fictives" src/
   - grep -r "DEMO-" src/

3. Supprimer les fichiers de données fictives :
   - src/lib/mockData.ts (si existant)
   - Tous les fichiers contenant "mock" dans le nom

4. Nettoyer les services :
   - Remplacer les données fictives par de vrais appels API
   - Supprimer les fonctions generateMock*()
   - Supprimer les conditions if (ENABLE_MOCK_DATA)

5. Nettoyer les composants :
   - Supprimer les sections marquées /* === DONNÉES FICTIVES === */
   - Supprimer les props mockData
   - Supprimer les états de démonstration

6. Nettoyer la base de données :
   - Supprimer tous les enregistrements avec des IDs commençant par "MOCK_"
   - Supprimer tous les emails se terminant par "@demo.diddyhome.com"

7. Variables d'environnement :
   - Supprimer ENABLE_MOCK_DATA
   - Ajouter les vraies clés API

8. Tests :
   - Vérifier que l'application fonctionne sans données fictives
   - Tester tous les formulaires de création
   - Vérifier les pages vides (sans données)
`;

export default MOCK_DATA_CONFIG;
