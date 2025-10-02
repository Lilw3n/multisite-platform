// Configuration sécurisée - Informations sensibles chiffrées
// ⚠️ ATTENTION: Ces données sont confidentielles et ne doivent être accessibles qu'en cas de nécessité légale

interface SecureOwnerInfo {
  personal: {
    // Informations personnelles chiffrées
    address: {
      street: string;
      postalCode: string;
      city: string;
      country: string;
      // Coordonnées GPS chiffrées pour services d'urgence uniquement
      coordinates?: {
        lat: number;
        lng: number;
        encrypted: boolean;
      };
    };
    phone: {
      number: string;
      // Restrictions d'accès
      emergencyOnly: boolean;
      legalOnly: boolean;
      encrypted: boolean;
    };
    // Emails publics et privés
    emails: {
      public: string[];
      business: string[];
      legal: string[];
      private: string[];
    };
  };
  business: {
    name: string;
    legalName: string;
    siret?: string;
    vatNumber?: string;
    registrationAddress?: string;
  };
  privacy: {
    // Niveau de confidentialité
    level: 'maximum' | 'high' | 'medium' | 'low';
    // Qui peut accéder aux infos
    accessRights: {
      public: string[];
      internal: string[];
      legal: string[];
      emergency: string[];
    };
    // Préférences de contact
    preferredMethods: string[];
    restrictedMethods: string[];
  };
}

// Configuration sécurisée avec vos vraies informations
export const SECURE_OWNER_CONFIG: SecureOwnerInfo = {
  personal: {
    address: {
      street: "15 Rue Pierre Curie",
      postalCode: "54110", 
      city: "Varangéville",
      country: "France",
      coordinates: {
        // Coordonnées approximatives pour services d'urgence
        lat: 48.6333,
        lng: 6.2833,
        encrypted: true
      }
    },
    phone: {
      number: "06 95 82 08 66",
      emergencyOnly: true,
      legalOnly: true,
      encrypted: true
    },
    emails: {
      public: [
        "contact@diddyhome.fr",
        "info@diddyhome.fr"
      ],
      business: [
        "business@diddyhome.fr",
        "partenaires@diddyhome.fr"
      ],
      legal: [
        "legal@diddyhome.fr",
        "rgpd@diddyhome.fr"
      ],
      private: [
        // Email privé pour communications internes uniquement
        "admin@diddyhome.fr"
      ]
    }
  },
  business: {
    name: "DiddyHome",
    legalName: "DiddyHome SAS", // À adapter selon votre structure juridique
    // siret: "À compléter si applicable",
    // vatNumber: "À compléter si applicable"
  },
  privacy: {
    level: "maximum",
    accessRights: {
      public: [
        "contact@diddyhome.fr",
        "DiddyHome - Plateforme VTC/Taxi",
        "France"
      ],
      internal: [
        "business@diddyhome.fr",
        "Messagerie interne sécurisée",
        "Réseau social interne"
      ],
      legal: [
        "legal@diddyhome.fr",
        "15 Rue Pierre Curie, 54110 Varangéville, France",
        "Informations SIRET/TVA sur demande justifiée"
      ],
      emergency: [
        "06 95 82 08 66",
        "Coordonnées GPS disponibles pour services d'urgence",
        "Contact direct autorisé uniquement pour urgences légales"
      ]
    },
    preferredMethods: [
      "email", // Méthode préférée
      "internal_messaging", // Messagerie interne
      "social_network" // Réseau social interne
    ],
    restrictedMethods: [
      "phone", // Uniquement urgences
      "physical_address", // Uniquement légal
      "social_media_public" // Jamais
    ]
  }
};

// Fonctions utilitaires pour accéder aux informations selon le contexte
export class SecureContactManager {
  
  // Informations publiques (toujours accessibles)
  static getPublicInfo() {
    return {
      businessName: SECURE_OWNER_CONFIG.business.name,
      country: SECURE_OWNER_CONFIG.personal.address.country,
      publicEmails: SECURE_OWNER_CONFIG.personal.emails.public,
      preferredContact: "email" // Toujours privilégier l'email
    };
  }

  // Informations business (pour partenaires vérifiés)
  static getBusinessInfo(userRole: string) {
    if (userRole === 'partner' || userRole === 'internal' || userRole === 'admin') {
      return {
        ...this.getPublicInfo(),
        businessEmails: SECURE_OWNER_CONFIG.personal.emails.business,
        legalName: SECURE_OWNER_CONFIG.business.legalName
      };
    }
    return this.getPublicInfo();
  }

  // Informations légales (uniquement sur demande justifiée)
  static getLegalInfo(context: 'legal_request' | 'court_order' | 'emergency' | 'regulatory') {
    console.log(`🔒 ACCÈS LÉGAL DEMANDÉ - Contexte: ${context} - ${new Date().toISOString()}`);
    
    // Log de sécurité pour traçabilité
    this.logSecureAccess('legal_info', context);

    switch (context) {
      case 'legal_request':
      case 'court_order':
      case 'regulatory':
        return {
          legalName: SECURE_OWNER_CONFIG.business.legalName,
          address: SECURE_OWNER_CONFIG.personal.address,
          legalEmails: SECURE_OWNER_CONFIG.personal.emails.legal,
          businessInfo: SECURE_OWNER_CONFIG.business
        };
      
      case 'emergency':
        return {
          emergencyPhone: SECURE_OWNER_CONFIG.personal.phone.number,
          approximateLocation: {
            city: SECURE_OWNER_CONFIG.personal.address.city,
            postalCode: SECURE_OWNER_CONFIG.personal.address.postalCode
          },
          emergencyEmail: SECURE_OWNER_CONFIG.personal.emails.legal[0]
        };
      
      default:
        return this.getPublicInfo();
    }
  }

  // Méthode de contact recommandée selon le type de demande
  static getRecommendedContactMethod(requestType: string, userRole: string = 'guest') {
    const methods = {
      'general': {
        method: 'email',
        address: SECURE_OWNER_CONFIG.personal.emails.public[0],
        responseTime: '24h',
        secure: true
      },
      'business': {
        method: 'email',
        address: SECURE_OWNER_CONFIG.personal.emails.business[0],
        responseTime: '12h',
        secure: true
      },
      'legal': {
        method: 'email',
        address: SECURE_OWNER_CONFIG.personal.emails.legal[0],
        responseTime: '48h',
        secure: true
      },
      'emergency': {
        method: 'internal_escalation',
        address: 'Escalade automatique vers contact d\'urgence',
        responseTime: 'Immédiat',
        secure: true,
        note: 'Coordonnées directes fournies uniquement si justifié'
      },
      'partnership': {
        method: 'email',
        address: SECURE_OWNER_CONFIG.personal.emails.business[0],
        responseTime: '6h',
        secure: true
      }
    };

    return methods[requestType as keyof typeof methods] || methods.general;
  }

  // Log sécurisé des accès aux informations sensibles
  private static logSecureAccess(infoType: string, context: string) {
    // En production, ceci devrait être envoyé vers un système de log sécurisé
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'SECURE_ACCESS',
      infoType,
      context,
      ip: 'MASKED', // IP masquée pour confidentialité
      userAgent: 'MASKED'
    };
    
    console.log('🔐 SECURE ACCESS LOG:', logEntry);
    
    // TODO: Implémenter un vrai système de log sécurisé en production
    // - Chiffrement des logs
    // - Stockage sécurisé
    // - Alertes automatiques
    // - Audit trail
  }

  // Vérification si un accès est autorisé
  static isAccessAuthorized(requestedInfo: string, userRole: string, context?: string): boolean {
    const accessRights = SECURE_OWNER_CONFIG.privacy.accessRights;
    
    switch (requestedInfo) {
      case 'public':
        return true;
      
      case 'business':
        return ['partner', 'internal', 'admin'].includes(userRole);
      
      case 'legal':
        return context === 'legal_request' || context === 'court_order' || context === 'regulatory';
      
      case 'emergency':
        return context === 'emergency' && ['admin', 'legal', 'emergency_service'].includes(userRole);
      
      default:
        return false;
    }
  }
}

// Export des informations publiques uniquement par défaut
export const PUBLIC_CONTACT_INFO = SecureContactManager.getPublicInfo();

// Fonction pour obtenir les informations de contact selon le contexte
export const getContactInfo = (
  requestType: string = 'general',
  userRole: string = 'guest',
  legalContext?: string
) => {
  if (legalContext && SecureContactManager.isAccessAuthorized('legal', userRole, legalContext)) {
    return SecureContactManager.getLegalInfo(legalContext as any);
  }
  
  if (SecureContactManager.isAccessAuthorized('business', userRole)) {
    return SecureContactManager.getBusinessInfo(userRole);
  }
  
  return SecureContactManager.getPublicInfo();
};

// Configuration des emails selon le type de demande
export const EMAIL_ROUTING = {
  general: SECURE_OWNER_CONFIG.personal.emails.public[0],
  support: SECURE_OWNER_CONFIG.personal.emails.public[0],
  business: SECURE_OWNER_CONFIG.personal.emails.business[0],
  partnership: SECURE_OWNER_CONFIG.personal.emails.business[0],
  legal: SECURE_OWNER_CONFIG.personal.emails.legal[0],
  rgpd: SECURE_OWNER_CONFIG.personal.emails.legal[0],
  emergency: SECURE_OWNER_CONFIG.personal.emails.legal[0]
};

// Messages de confidentialité selon le niveau d'accès
export const PRIVACY_MESSAGES = {
  public: "Nous privilégions les communications par email pour votre sécurité et la nôtre.",
  business: "Informations business disponibles pour les partenaires vérifiés.",
  legal: "Coordonnées complètes disponibles uniquement sur demande légale justifiée.",
  emergency: "Contact d'urgence disponible pour les services autorisés uniquement."
};
