// Service ultra-innovant pour la gestion d'événements avec IA

import {
  SmartEvent,
  SmartEventFilter,
  EventAnalytics,
  EventParticipant,
  ExtractedEntity,
  AIRecommendation,
  PatternInsight,
  AnomalyInsight,
  PredictionInsight,
  OptimizationRecommendation,
  EventType,
  EventCategory,
  EventPriority,
  EventSentiment
} from '@/types/advancedEvents';

export class SmartEventsService {
  private static readonly STORAGE_KEY = 'diddyhome_smart_events';
  private static readonly FILTERS_KEY = 'diddyhome_event_filters';
  private static readonly ANALYTICS_KEY = 'diddyhome_event_analytics';

  // IA pour analyse de contenu
  private static readonly AI_KEYWORDS = {
    urgent: ['urgent', 'asap', 'immédiat', 'critique', 'emergency'],
    positive: ['excellent', 'parfait', 'super', 'génial', 'bravo', 'merci'],
    negative: ['problème', 'erreur', 'bug', 'défaut', 'plainte', 'insatisfait'],
    business: ['contrat', 'devis', 'facture', 'paiement', 'signature', 'accord'],
    technical: ['serveur', 'api', 'bug', 'erreur', 'maintenance', 'mise à jour']
  };

  // Génération d'événements de démonstration ultra-réalistes
  static generateDemoEvents(): SmartEvent[] {
    const now = new Date();
    const events: SmartEvent[] = [];

    // Événement 1: Email commercial avec IA complète
    events.push({
      id: `event_${Date.now()}_1`,
      title: "📧 Demande devis assurance flotte - URGENT",
      description: "Client VTC demande devis pour 5 véhicules avec historique sinistres",
      content: "Bonjour, je suis gérant d'une société VTC avec 5 véhicules. J'ai eu 2 sinistres l'année dernière mais je cherche une assurance plus compétitive. Pouvez-vous me faire un devis rapidement ? #VTC #Flotte #Urgent",
      
      timestamps: {
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2h
        scheduledAt: new Date('2025-09-15T14:30:00').toISOString(), // 15 septembre 2025 à 14h30
        lastModified: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
      },
      
      participants: {
        creator: {
          id: 'user_external_1',
          name: 'Marc TRANSPORT',
          email: 'marc@transport-express.fr',
          role: 'creator',
          type: 'external'
        },
        recipients: [{
          id: 'user_internal_1',
          name: 'Diddy (Vous)',
          email: 'diddy@diddyhome.fr',
          role: 'recipient',
          type: 'internal',
          responseStatus: 'pending'
        }],
        mentions: [],
        watchers: []
      },
      
      classification: {
        type: 'sales',
        subType: 'quote_request',
        category: 'email',
        priority: 'high',
        urgency: 'today',
        sentiment: 'neutral',
        businessImpact: 'high'
      },
      
      channels: {
        primary: {
          type: 'email',
          identifier: 'marc@transport-express.fr'
        },
        deliveryStatus: {
          'user_internal_1': {
            status: 'delivered',
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
          }
        }
      },
      
      enrichment: {
        hashtags: ['#VTC', '#Flotte', '#Urgent'],
        keywords: ['devis', 'assurance', 'flotte', 'véhicules', 'sinistres', 'compétitive'],
        entities: [
          { type: 'company', value: 'société VTC', confidence: 0.9, startIndex: 25, endIndex: 36 },
          { type: 'amount', value: '5 véhicules', confidence: 0.95, startIndex: 42, endIndex: 53 },
          { type: 'date', value: 'l\'année dernière', confidence: 0.8, startIndex: 75, endIndex: 90 }
        ],
        topics: ['assurance', 'VTC', 'flotte', 'devis'],
        language: 'fr',
        readingTime: 1
      },
      
      relationships: {
        childEvents: [],
        relatedEvents: [],
        triggers: []
      },
      
      tracking: {
        views: 1,
        interactions: 0,
        responses: [],
        engagement: {
          engagementScore: 85,
          timeToResponse: undefined
        },
        conversionEvents: []
      },
      
      aiInsights: {
        predictedOutcome: 'Forte probabilité de conversion (85%) - Client motivé avec besoin urgent',
        recommendedActions: [
          {
            id: 'rec_1',
            type: 'action',
            title: 'Répondre dans les 2h',
            description: 'Client exprime urgence, réponse rapide critique pour conversion',
            confidence: 0.92,
            priority: 'high',
            estimatedImpact: 'Augmente probabilité conversion de 35%'
          },
          {
            id: 'rec_2',
            type: 'follow_up',
            title: 'Préparer analyse sinistres',
            description: 'Demander détails des 2 sinistres pour tarification précise',
            confidence: 0.88,
            priority: 'medium',
            estimatedImpact: 'Évite surprises tarifaires'
          }
        ],
        similarEvents: [],
        riskScore: 25, // Faible risque
        opportunityScore: 85, // Forte opportunité
        nextBestAction: 'Appeler le client dans l\'heure pour montrer réactivité'
      },
      
      workflow: {
        status: 'in_progress',
        stage: 'qualification',
        nextSteps: [
          {
            id: 'step_1',
            name: 'Réponse initiale',
            description: 'Accuser réception et demander informations complémentaires',
            type: 'manual',
            status: 'pending',
            dueDate: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
            dependencies: [],
            estimatedDuration: 15
          }
        ],
        automationRules: []
      },
      
      attachments: [],
      
      system: {
        source: 'email_sync',
        version: 1,
        isArchived: false,
        isDeleted: false,
        permissions: {
          visibility: 'internal',
          canView: ['user_internal_1'],
          canEdit: ['user_internal_1'],
          canDelete: ['user_internal_1'],
          canShare: ['user_internal_1']
        },
        auditTrail: []
      }
    });

    // Événement 2: WhatsApp avec sentiment négatif
    events.push({
      id: `event_${Date.now()}_2`,
      title: "💬 Réclamation client - Problème sinistre",
      description: "Client mécontent du traitement de son dossier sinistre",
      content: "Bonjour, cela fait 3 semaines que j'attends le règlement de mon sinistre. C'est inadmissible ! Je vais changer d'assureur si ça continue. #Réclamation #Sinistre",
      
      timestamps: {
        createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(), // Il y a 45min
        scheduledAt: new Date('2025-09-15T09:00:00').toISOString(), // 15 septembre 2025 à 9h00
        lastModified: new Date(now.getTime() - 45 * 60 * 1000).toISOString()
      },
      
      participants: {
        creator: {
          id: 'user_client_2',
          name: 'Sophie MARTIN',
          phone: '+33695820866',
          role: 'creator',
          type: 'external'
        },
        recipients: [{
          id: 'user_internal_1',
          name: 'Diddy (Vous)',
          role: 'recipient',
          type: 'internal',
          responseStatus: 'pending'
        }],
        mentions: [],
        watchers: []
      },
      
      classification: {
        type: 'support',
        subType: 'complaint',
        category: 'whatsapp',
        priority: 'urgent',
        urgency: 'asap',
        sentiment: 'very_negative',
        businessImpact: 'high'
      },
      
      channels: {
        primary: {
          type: 'whatsapp',
          identifier: '+33695820866',
          platform: 'WhatsApp Business'
        },
        deliveryStatus: {
          'user_internal_1': {
            status: 'delivered',
            timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString()
          }
        }
      },
      
      enrichment: {
        hashtags: ['#Réclamation', '#Sinistre'],
        keywords: ['réclamation', 'sinistre', 'règlement', 'attends', 'inadmissible', 'changer'],
        entities: [
          { type: 'date', value: '3 semaines', confidence: 0.95, startIndex: 15, endIndex: 25 }
        ],
        topics: ['réclamation', 'sinistre', 'délai', 'mécontentement'],
        language: 'fr',
        readingTime: 1
      },
      
      relationships: {
        childEvents: [],
        relatedEvents: [],
        triggers: []
      },
      
      tracking: {
        views: 1,
        interactions: 0,
        responses: [],
        engagement: {
          engagementScore: 95, // Très engagé (négativement)
        },
        conversionEvents: []
      },
      
      aiInsights: {
        predictedOutcome: 'RISQUE ÉLEVÉ de perte client - Action immédiate requise',
        recommendedActions: [
          {
            id: 'rec_3',
            type: 'escalation',
            title: 'Escalade immédiate',
            description: 'Contacter le client par téléphone dans les 30 minutes',
            confidence: 0.98,
            priority: 'critical',
            estimatedImpact: 'Peut sauver la relation client'
          },
          {
            id: 'rec_4',
            type: 'action',
            title: 'Vérifier dossier sinistre',
            description: 'Identifier les blocages dans le traitement du dossier',
            confidence: 0.95,
            priority: 'urgent',
            estimatedImpact: 'Résolution rapide du problème'
          }
        ],
        similarEvents: [],
        riskScore: 90, // Risque très élevé
        opportunityScore: 15, // Faible opportunité
        nextBestAction: 'Appel téléphonique immédiat avec excuse et solution'
      },
      
      workflow: {
        status: 'in_progress',
        stage: 'escalation',
        nextSteps: [
          {
            id: 'step_2',
            name: 'Appel d\'urgence',
            description: 'Contacter le client immédiatement',
            type: 'manual',
            status: 'pending',
            dueDate: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
            dependencies: [],
            estimatedDuration: 20
          }
        ],
        automationRules: []
      },
      
      attachments: [],
      
      system: {
        source: 'whatsapp_api',
        version: 1,
        isArchived: false,
        isDeleted: false,
        permissions: {
          visibility: 'internal',
          canView: ['user_internal_1'],
          canEdit: ['user_internal_1'],
          canDelete: ['user_internal_1'],
          canShare: ['user_internal_1']
        },
        auditTrail: []
      }
    });

    // Événement 3: Réunion planifiée avec IA prédictive
    events.push({
      id: `event_${Date.now()}_3`,
      title: "🤝 RDV signature contrat - Prospect premium",
      description: "Rendez-vous de signature pour contrat flotte 15 véhicules",
      content: "Rendez-vous confirmé avec M. DUBOIS pour signature contrat assurance flotte 15 véhicules. CA potentiel: 45 000€/an. #Signature #Premium #Flotte",
      
      timestamps: {
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // Hier
        scheduledAt: new Date('2025-09-15T16:00:00').toISOString(), // 15 septembre 2025 à 16h00
        executedAt: new Date('2025-09-15T16:15:00').toISOString(), // Exécuté avec 15min de retard
        lastModified: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      },
      
      participants: {
        creator: {
          id: 'user_internal_1',
          name: 'Diddy (Vous)',
          role: 'creator',
          type: 'internal'
        },
        recipients: [{
          id: 'user_prospect_1',
          name: 'Jean DUBOIS',
          email: 'j.dubois@logistique-pro.fr',
          role: 'recipient',
          type: 'external',
          responseStatus: 'responded'
        }],
        mentions: [],
        watchers: []
      },
      
      classification: {
        type: 'sales',
        subType: 'contract_signing',
        category: 'meeting',
        priority: 'high',
        urgency: 'this_week',
        sentiment: 'positive',
        businessImpact: 'critical'
      },
      
      channels: {
        primary: {
          type: 'in_person',
          identifier: 'Bureau DiddyHome'
        },
        deliveryStatus: {}
      },
      
      enrichment: {
        hashtags: ['#Signature', '#Premium', '#Flotte'],
        keywords: ['signature', 'contrat', 'flotte', 'véhicules', 'premium'],
        entities: [
          { type: 'person', value: 'M. DUBOIS', confidence: 0.98, startIndex: 35, endIndex: 44 },
          { type: 'amount', value: '15 véhicules', confidence: 0.95, startIndex: 80, endIndex: 92 },
          { type: 'amount', value: '45 000€/an', confidence: 0.92, startIndex: 110, endIndex: 120 }
        ],
        topics: ['signature', 'contrat', 'flotte', 'véhicules'],
        language: 'fr',
        readingTime: 1
      },
      
      location: {
        address: '15 Rue Pierre Curie, 54110 Varangéville',
        timezone: 'Europe/Paris'
      },
      
      relationships: {
        childEvents: [],
        relatedEvents: [],
        triggers: []
      },
      
      tracking: {
        views: 3,
        interactions: 2,
        responses: [
          {
            id: 'resp_1',
            participantId: 'user_prospect_1',
            type: 'reply',
            content: 'Parfait, je confirme ma présence',
            timestamp: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(),
            sentiment: 'positive'
          }
        ],
        engagement: {
          engagementScore: 92,
          responseRate: 100,
          timeToResponse: 240 // 4h
        },
        conversionEvents: []
      },
      
      aiInsights: {
        predictedOutcome: 'Probabilité signature: 88% - Prospect très engagé',
        recommendedActions: [
          {
            id: 'rec_5',
            type: 'action',
            title: 'Préparer dossier complet',
            description: 'Rassembler tous les documents pour signature immédiate',
            confidence: 0.95,
            priority: 'high',
            estimatedImpact: 'Évite report de signature'
          },
          {
            id: 'rec_6',
            type: 'follow_up',
            title: 'Rappel 24h avant',
            description: 'Confirmer RDV et préparer questions complémentaires',
            confidence: 0.85,
            priority: 'medium',
            estimatedImpact: 'Assure présence et préparation'
          }
        ],
        similarEvents: [],
        riskScore: 15, // Faible risque
        opportunityScore: 95, // Très forte opportunité
        nextBestAction: 'Préparer proposition upselling (RC Pro, Cyber)'
      },
      
      workflow: {
        status: 'scheduled',
        stage: 'closing',
        nextSteps: [
          {
            id: 'step_3',
            name: 'Préparation dossier',
            description: 'Finaliser tous les documents contractuels',
            type: 'manual',
            status: 'in_progress',
            dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            dependencies: [],
            estimatedDuration: 60
          }
        ],
        automationRules: []
      },
      
      attachments: [
        {
          id: 'att_1',
          name: 'Contrat_Flotte_DUBOIS.pdf',
          type: 'document',
          url: '/documents/contrat_dubois.pdf',
          size: 2500000,
          mimeType: 'application/pdf'
        }
      ],
      
      system: {
        source: 'manual',
        version: 1,
        isArchived: false,
        isDeleted: false,
        permissions: {
          visibility: 'internal',
          canView: ['user_internal_1'],
          canEdit: ['user_internal_1'],
          canDelete: ['user_internal_1'],
          canShare: ['user_internal_1']
        },
        auditTrail: []
      }
    });

    // Événement 4: Appel téléphonique - date différente
    events.push({
      id: `event_${Date.now()}_4`,
      title: "📞 Appel de suivi - Devis auto",
      description: "Suivi téléphonique pour devis assurance auto particulier",
      content: "Appel de M. MARTIN pour discuter des options de son devis auto. Intéressé par la formule tous risques. #Auto #Suivi #Particulier",
      
      timestamps: {
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 3 jours
        scheduledAt: new Date('2025-09-16T10:30:00').toISOString(), // 16 septembre 2025 à 10h30
        lastModified: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      
      participants: {
        creator: {
          id: 'user_internal_1',
          name: 'Diddy (Vous)',
          role: 'creator',
          type: 'internal'
        },
        recipients: [{
          id: 'user_client_3',
          name: 'Pierre MARTIN',
          phone: '+33123456789',
          role: 'recipient',
          type: 'external',
          responseStatus: 'pending'
        }],
        mentions: [],
        watchers: []
      },
      
      classification: {
        type: 'sales',
        subType: 'follow_up',
        category: 'call',
        priority: 'normal',
        urgency: 'this_week',
        sentiment: 'positive',
        businessImpact: 'medium'
      },
      
      channels: {
        primary: {
          type: 'call',
          identifier: '+33123456789'
        },
        deliveryStatus: {}
      },
      
      enrichment: {
        hashtags: ['#Auto', '#Suivi', '#Particulier'],
        keywords: ['suivi', 'devis', 'auto', 'tous risques', 'particulier'],
        entities: [
          { type: 'person', value: 'M. MARTIN', confidence: 0.95, startIndex: 8, endIndex: 17 }
        ],
        topics: ['suivi', 'devis', 'auto', 'assurance'],
        language: 'fr',
        readingTime: 1
      },
      
      relationships: {
        childEvents: [],
        relatedEvents: [],
        triggers: []
      },
      
      tracking: {
        views: 2,
        interactions: 1,
        responses: [],
        engagement: {
          engagementScore: 70
        },
        conversionEvents: []
      },
      
      aiInsights: {
        predictedOutcome: 'Probabilité conversion moyenne (65%) - Client intéressé',
        recommendedActions: [
          {
            id: 'rec_7',
            type: 'action',
            title: 'Préparer comparatif formules',
            description: 'Présenter les différences entre formules pour faciliter choix',
            confidence: 0.80,
            priority: 'normal',
            estimatedImpact: 'Aide à la décision client'
          }
        ],
        similarEvents: [],
        riskScore: 30,
        opportunityScore: 65,
        nextBestAction: 'Envoyer comparatif par email avant l\'appel'
      },
      
      workflow: {
        status: 'scheduled',
        stage: 'follow_up',
        nextSteps: [],
        automationRules: []
      },
      
      attachments: [],
      
      system: {
        source: 'manual',
        version: 1,
        isArchived: false,
        isDeleted: false,
        permissions: {
          visibility: 'internal',
          canView: ['user_internal_1'],
          canEdit: ['user_internal_1'],
          canDelete: ['user_internal_1'],
          canShare: ['user_internal_1']
        },
        auditTrail: []
      }
    });

    // Événement 5: Email de relance - autre date
    events.push({
      id: `event_${Date.now()}_5`,
      title: "📧 Relance devis habitation",
      description: "Email de relance pour devis assurance habitation",
      content: "Relance client pour devis habitation envoyé il y a une semaine. Aucune réponse reçue. #Habitation #Relance #Email",
      
      timestamps: {
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // Il y a 1h
        scheduledAt: new Date('2025-09-14T11:00:00').toISOString(), // 14 septembre 2025 à 11h00
        executedAt: new Date('2025-09-14T11:05:00').toISOString(), // Exécuté à l'heure
        lastModified: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
      },
      
      participants: {
        creator: {
          id: 'user_internal_1',
          name: 'Diddy (Vous)',
          role: 'creator',
          type: 'internal'
        },
        recipients: [{
          id: 'user_client_4',
          name: 'Marie DUPUIS',
          email: 'marie.dupuis@email.fr',
          role: 'recipient',
          type: 'external',
          responseStatus: 'read'
        }],
        mentions: [],
        watchers: []
      },
      
      classification: {
        type: 'marketing',
        subType: 'follow_up',
        category: 'email',
        priority: 'low',
        urgency: 'can_wait',
        sentiment: 'neutral',
        businessImpact: 'low'
      },
      
      channels: {
        primary: {
          type: 'email',
          identifier: 'marie.dupuis@email.fr'
        },
        deliveryStatus: {
          'user_client_4': {
            status: 'read',
            timestamp: new Date('2025-09-14T11:30:00').toISOString()
          }
        }
      },
      
      enrichment: {
        hashtags: ['#Habitation', '#Relance', '#Email'],
        keywords: ['relance', 'devis', 'habitation', 'semaine'],
        entities: [],
        topics: ['relance', 'habitation', 'devis'],
        language: 'fr',
        readingTime: 1
      },
      
      relationships: {
        childEvents: [],
        relatedEvents: [],
        triggers: []
      },
      
      tracking: {
        views: 1,
        interactions: 1,
        responses: [],
        engagement: {
          engagementScore: 45,
          timeToResponse: 25 // 25 minutes pour lire
        },
        conversionEvents: []
      },
      
      aiInsights: {
        predictedOutcome: 'Faible probabilité conversion (30%) - Pas de réponse',
        recommendedActions: [
          {
            id: 'rec_8',
            type: 'action',
            title: 'Changer de canal',
            description: 'Essayer contact téléphonique au lieu d\'email',
            confidence: 0.75,
            priority: 'low',
            estimatedImpact: 'Peut relancer l\'intérêt'
          }
        ],
        similarEvents: [],
        riskScore: 60,
        opportunityScore: 30,
        nextBestAction: 'Attendre 3 jours puis appel téléphonique'
      },
      
      workflow: {
        status: 'completed',
        stage: 'follow_up',
        nextSteps: [],
        automationRules: []
      },
      
      attachments: [],
      
      system: {
        source: 'email_sync',
        version: 1,
        isArchived: false,
        isDeleted: false,
        permissions: {
          visibility: 'internal',
          canView: ['user_internal_1'],
          canEdit: ['user_internal_1'],
          canDelete: ['user_internal_1'],
          canShare: ['user_internal_1']
        },
        auditTrail: []
      }
    });

    return events;
  }

  // Analyse IA du contenu
  static analyzeEventContent(content: string): {
    sentiment: EventSentiment;
    priority: EventPriority;
    urgency: string;
    keywords: string[];
    entities: ExtractedEntity[];
    topics: string[];
  } {
    const lowerContent = content.toLowerCase();
    
    // Analyse sentiment
    let sentiment: EventSentiment = 'neutral';
    const positiveWords = this.AI_KEYWORDS.positive.filter(word => lowerContent.includes(word));
    const negativeWords = this.AI_KEYWORDS.negative.filter(word => lowerContent.includes(word));
    
    if (positiveWords.length > negativeWords.length) {
      sentiment = positiveWords.length > 2 ? 'very_positive' : 'positive';
    } else if (negativeWords.length > positiveWords.length) {
      sentiment = negativeWords.length > 2 ? 'very_negative' : 'negative';
    }
    
    // Analyse priorité
    let priority: EventPriority = 'normal';
    const urgentWords = this.AI_KEYWORDS.urgent.filter(word => lowerContent.includes(word));
    if (urgentWords.length > 0) priority = 'urgent';
    else if (lowerContent.includes('important')) priority = 'high';
    
    // Extraction entités simples
    const entities: ExtractedEntity[] = [];
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /\b(?:\+33|0)[1-9](?:[0-9]{8})\b/g;
    const amountRegex = /\b\d+(?:\s*(?:€|euros?|k€))\b/g;
    
    let match;
    while ((match = emailRegex.exec(content)) !== null) {
      entities.push({
        type: 'person',
        value: match[0],
        confidence: 0.8,
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
    
    // Extraction hashtags
    const hashtagRegex = /#[\w]+/g;
    const hashtags: string[] = [];
    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[0]);
    }
    
    // Mots-clés métier
    const keywords: string[] = [];
    Object.entries(this.AI_KEYWORDS).forEach(([category, words]) => {
      words.forEach(word => {
        if (lowerContent.includes(word)) {
          keywords.push(word);
        }
      });
    });
    
    return {
      sentiment,
      priority,
      urgency: urgentWords.length > 0 ? 'asap' : 'this_week',
      keywords: [...new Set(keywords)],
      entities,
      topics: [...new Set([...keywords, ...hashtags])]
    };
  }

  // Génération recommandations IA
  static generateAIRecommendations(event: SmartEvent): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Recommandations basées sur le sentiment
    if (event.classification.sentiment === 'very_negative') {
      recommendations.push({
        id: `rec_${Date.now()}_1`,
        type: 'escalation',
        title: 'Escalade immédiate requise',
        description: 'Sentiment très négatif détecté - Contact prioritaire nécessaire',
        confidence: 0.95,
        priority: 'critical',
        estimatedImpact: 'Évite perte client'
      });
    }
    
    // Recommandations basées sur l'urgence
    if (event.classification.urgency === 'asap') {
      recommendations.push({
        id: `rec_${Date.now()}_2`,
        type: 'action',
        title: 'Réponse dans l\'heure',
        description: 'Urgence détectée - Réponse rapide critique',
        confidence: 0.88,
        priority: 'urgent',
        estimatedImpact: 'Maintient satisfaction client'
      });
    }
    
    // Recommandations basées sur le contenu
    if (event.enrichment.keywords.includes('devis')) {
      recommendations.push({
        id: `rec_${Date.now()}_3`,
        type: 'follow_up',
        title: 'Préparer devis personnalisé',
        description: 'Demande de devis identifiée - Préparer proposition',
        confidence: 0.82,
        priority: 'high',
        estimatedImpact: 'Augmente taux conversion'
      });
    }
    
    return recommendations;
  }

  // Détection patterns et anomalies
  static detectPatterns(events: SmartEvent[]): PatternInsight[] {
    const patterns: PatternInsight[] = [];
    
    // Pattern temporel: pics d'activité
    const hourlyDistribution = events.reduce((acc, event) => {
      const hour = new Date(event.timestamps.createdAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const maxHour = Object.entries(hourlyDistribution)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (maxHour && hourlyDistribution[parseInt(maxHour[0])] > events.length * 0.3) {
      patterns.push({
        id: `pattern_${Date.now()}_1`,
        type: 'temporal',
        title: `Pic d'activité à ${maxHour[0]}h`,
        description: `${Math.round(maxHour[1] / events.length * 100)}% des événements se concentrent autour de ${maxHour[0]}h`,
        confidence: 0.85,
        impact: 'medium',
        evidence: [`${maxHour[1]} événements sur ${events.length} total`],
        actionable: true
      });
    }
    
    // Pattern sentiment: tendance négative
    const negativeEvents = events.filter(e => 
      e.classification.sentiment === 'negative' || 
      e.classification.sentiment === 'very_negative'
    );
    
    if (negativeEvents.length > events.length * 0.2) {
      patterns.push({
        id: `pattern_${Date.now()}_2`,
        type: 'behavioral',
        title: 'Tendance sentiment négatif',
        description: `${Math.round(negativeEvents.length / events.length * 100)}% des événements ont un sentiment négatif`,
        confidence: 0.78,
        impact: 'high',
        evidence: [`${negativeEvents.length} événements négatifs détectés`],
        actionable: true
      });
    }
    
    return patterns;
  }

  // Prédictions IA
  static generatePredictions(events: SmartEvent[]): PredictionInsight[] {
    const predictions: PredictionInsight[] = [];
    
    // Prédiction volume basée sur tendance
    const recentEvents = events.filter(e => 
      new Date(e.timestamps.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    
    const dailyAverage = recentEvents.length / 7;
    const predictedWeeklyVolume = Math.round(dailyAverage * 7 * 1.1); // +10% croissance
    
    predictions.push({
      id: `pred_${Date.now()}_1`,
      type: 'volume',
      horizon: 'short',
      prediction: {
        expectedEvents: predictedWeeklyVolume,
        confidence: 0.75,
        range: {
          min: Math.round(predictedWeeklyVolume * 0.8),
          max: Math.round(predictedWeeklyVolume * 1.2)
        }
      },
      confidence: 0.75,
      factors: ['tendance récente', 'saisonnalité', 'croissance business'],
      recommendations: ['Prévoir capacité supplémentaire', 'Optimiser processus réponse']
    });
    
    return predictions;
  }

  // Méthodes CRUD et utilitaires
  static saveEvent(event: SmartEvent): void {
    const events = this.getAllEvents();
    const existingIndex = events.findIndex(e => e.id === event.id);
    
    if (existingIndex >= 0) {
      events[existingIndex] = { 
        ...event, 
        timestamps: { 
          ...event.timestamps, 
          lastModified: new Date().toISOString() 
        },
        system: {
          ...event.system,
          version: event.system.version + 1
        }
      };
    } else {
      events.push(event);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
  }

  static getAllEvents(): SmartEvent[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Forcer la régénération des événements (pour test) - DÉSACTIVÉ
  static forceRegenerate(): void {
    // Désactivé pour éviter de perdre les événements
    // if (typeof window === 'undefined') return;
    // localStorage.removeItem(this.STORAGE_KEY);
  }

  static getEventById(id: string): SmartEvent | null {
    const events = this.getAllEvents();
    return events.find(e => e.id === id) || null;
  }

  static deleteEvent(id: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const events = this.getAllEvents();
      const filteredEvents = events.filter(e => e.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEvents));
      return true;
    } catch (error) {
      console.error('Erreur suppression événement:', error);
      return false;
    }
  }

  // Recherche et filtrage avancés
  static searchEvents(filter: Partial<SmartEventFilter>): SmartEvent[] {
    let events = this.getAllEvents();
    
    // Filtre temporel
    if (filter.timeFilter) {
      const now = new Date();
      let startDate: Date, endDate: Date;
      
      if (filter.timeFilter.type === 'relative' && filter.timeFilter.relative) {
        const { unit, value, direction } = filter.timeFilter.relative;
        if (direction === 'past') {
          endDate = now;
          startDate = new Date(now);
          switch (unit) {
            case 'hours': startDate.setHours(startDate.getHours() - value); break;
            case 'days': startDate.setDate(startDate.getDate() - value); break;
            case 'weeks': startDate.setDate(startDate.getDate() - value * 7); break;
            case 'months': startDate.setMonth(startDate.getMonth() - value); break;
            case 'years': startDate.setFullYear(startDate.getFullYear() - value); break;
          }
        }
      }
      
      if (startDate! && endDate!) {
        events = events.filter(e => {
          const eventDate = new Date(e.timestamps.createdAt);
          return eventDate >= startDate && eventDate <= endDate;
        });
      }
    }
    
    // Filtre participants
    if (filter.participantFilter) {
      if (filter.participantFilter.creators?.length) {
        events = events.filter(e => 
          filter.participantFilter!.creators!.includes(e.participants.creator.id)
        );
      }
      
      if (filter.participantFilter.recipients?.length) {
        events = events.filter(e => 
          e.participants.recipients.some(r => 
            filter.participantFilter!.recipients!.includes(r.id)
          )
        );
      }
    }
    
    // Filtre classification
    if (filter.classificationFilter) {
      if (filter.classificationFilter.types?.length) {
        events = events.filter(e => 
          filter.classificationFilter!.types!.includes(e.classification.type)
        );
      }
      
      if (filter.classificationFilter.categories?.length) {
        events = events.filter(e => 
          filter.classificationFilter!.categories!.includes(e.classification.category)
        );
      }
      
      if (filter.classificationFilter.priorities?.length) {
        events = events.filter(e => 
          filter.classificationFilter!.priorities!.includes(e.classification.priority)
        );
      }
      
      if (filter.classificationFilter.sentiments?.length) {
        events = events.filter(e => 
          filter.classificationFilter!.sentiments!.includes(e.classification.sentiment)
        );
      }
    }
    
    // Filtre contenu
    if (filter.contentFilter) {
      if (filter.contentFilter.keywords?.length) {
        events = events.filter(e => 
          filter.contentFilter!.keywords!.some(keyword => 
            e.enrichment.keywords.includes(keyword) ||
            e.title.toLowerCase().includes(keyword.toLowerCase()) ||
            e.content?.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      }
      
      if (filter.contentFilter.hashtags?.length) {
        events = events.filter(e => 
          filter.contentFilter!.hashtags!.some(hashtag => 
            e.enrichment.hashtags.includes(hashtag)
          )
        );
      }
    }
    
    // Tri
    if (filter.sorting) {
      events.sort((a, b) => {
        const { field, direction } = filter.sorting!.primary;
        let aValue: any, bValue: any;
        
        switch (field) {
          case 'createdAt':
            aValue = new Date(a.timestamps.createdAt).getTime();
            bValue = new Date(b.timestamps.createdAt).getTime();
            break;
          case 'scheduledAt':
            aValue = a.timestamps.scheduledAt ? new Date(a.timestamps.scheduledAt).getTime() : 0;
            bValue = b.timestamps.scheduledAt ? new Date(b.timestamps.scheduledAt).getTime() : 0;
            break;
          case 'executedAt':
            aValue = a.timestamps.executedAt ? new Date(a.timestamps.executedAt).getTime() : 0;
            bValue = b.timestamps.executedAt ? new Date(b.timestamps.executedAt).getTime() : 0;
            break;
          case 'priority':
            const priorityOrder = { low: 1, normal: 2, high: 3, urgent: 4, critical: 5 };
            aValue = priorityOrder[a.classification.priority];
            bValue = priorityOrder[b.classification.priority];
            break;
          case 'engagement':
            aValue = a.tracking.engagement.engagementScore;
            bValue = b.tracking.engagement.engagementScore;
            break;
          case 'riskScore':
            aValue = a.aiInsights.riskScore;
            bValue = b.aiInsights.riskScore;
            break;
          case 'opportunityScore':
            aValue = a.aiInsights.opportunityScore;
            bValue = b.aiInsights.opportunityScore;
            break;
          case 'views':
            aValue = a.tracking.views;
            bValue = b.tracking.views;
            break;
          case 'responseTime':
            aValue = a.tracking.engagement.timeToResponse || 999999;
            bValue = b.tracking.engagement.timeToResponse || 999999;
            break;
          default:
            aValue = 0;
            bValue = 0;
        }
        
        return direction === 'desc' ? bValue - aValue : aValue - bValue;
      });
    }
    
    return events;
  }

  // Recherche sémantique (simulation)
  static semanticSearch(query: string, events: SmartEvent[]): SmartEvent[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    
    return events
      .map(event => {
        let score = 0;
        const searchableText = [
          event.title,
          event.description || '',
          event.content || '',
          ...event.enrichment.keywords,
          ...event.enrichment.hashtags,
          ...event.enrichment.topics
        ].join(' ').toLowerCase();
        
        // Score basé sur correspondance mots-clés
        queryWords.forEach(word => {
          const occurrences = (searchableText.match(new RegExp(word, 'g')) || []).length;
          score += occurrences * 10;
          
          // Bonus pour correspondance exacte dans titre
          if (event.title.toLowerCase().includes(word)) {
            score += 20;
          }
          
          // Bonus pour correspondance dans hashtags
          if (event.enrichment.hashtags.some(tag => tag.toLowerCase().includes(word))) {
            score += 15;
          }
        });
        
        return { event, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ event }) => event);
  }

  // Analytics avancées
  static generateAnalytics(events: SmartEvent[], period: { start: string; end: string }): EventAnalytics {
    const filteredEvents = events.filter(e => {
      const eventDate = new Date(e.timestamps.createdAt);
      return eventDate >= new Date(period.start) && eventDate <= new Date(period.end);
    });
    
    // Métriques globales
    const totalEvents = filteredEvents.length;
    const activeEvents = filteredEvents.filter(e => e.workflow.status === 'in_progress').length;
    const completedEvents = filteredEvents.filter(e => e.workflow.status === 'completed').length;
    
    const responseTimes = filteredEvents
      .map(e => e.tracking.engagement.timeToResponse)
      .filter(t => t !== undefined) as number[];
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;
    
    const engagementScores = filteredEvents.map(e => e.tracking.engagement.engagementScore);
    const engagementRate = engagementScores.length > 0
      ? engagementScores.reduce((a, b) => a + b, 0) / engagementScores.length
      : 0;
    
    // Répartitions
    const byType = filteredEvents.reduce((acc, e) => {
      acc[e.classification.type] = (acc[e.classification.type] || 0) + 1;
      return acc;
    }, {} as Record<EventType, number>);
    
    const byCategory = filteredEvents.reduce((acc, e) => {
      acc[e.classification.category] = (acc[e.classification.category] || 0) + 1;
      return acc;
    }, {} as Record<EventCategory, number>);
    
    const bySentiment = filteredEvents.reduce((acc, e) => {
      acc[e.classification.sentiment] = (acc[e.classification.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<EventSentiment, number>);
    
    return {
      period,
      overview: {
        totalEvents,
        activeEvents,
        completedEvents,
        averageResponseTime,
        engagementRate,
        conversionRate: 0 // À calculer selon logique métier
      },
      trends: {
        eventVolume: [], // À implémenter avec données temporelles
        engagementTrend: [],
        responseTimeTrend: [],
        sentimentTrend: []
      },
      distributions: {
        byType,
        byCategory,
        byPriority: {} as any,
        bySentiment,
        byParticipant: {},
        byChannel: {}
      },
      topPerformers: {
        mostEngaging: filteredEvents
          .sort((a, b) => b.tracking.engagement.engagementScore - a.tracking.engagement.engagementScore)
          .slice(0, 5),
        fastestResponse: filteredEvents
          .filter(e => e.tracking.engagement.timeToResponse)
          .sort((a, b) => (a.tracking.engagement.timeToResponse || 0) - (b.tracking.engagement.timeToResponse || 0))
          .slice(0, 5),
        highestConversion: [],
        mostViewed: filteredEvents
          .sort((a, b) => b.tracking.views - a.tracking.views)
          .slice(0, 5)
      },
      aiInsights: {
        patterns: this.detectPatterns(filteredEvents),
        anomalies: [], // À implémenter
        predictions: this.generatePredictions(filteredEvents),
        recommendations: [] // À implémenter
      },
      comparisons: {
        previousPeriod: {
          totalEvents: { current: totalEvents, previous: 0, change: 0 },
          engagementRate: { current: engagementRate, previous: 0, change: 0 },
          responseTime: { current: averageResponseTime, previous: 0, change: 0 },
          conversionRate: { current: 0, previous: 0, change: 0 }
        },
        benchmark: {
          totalEvents: { current: totalEvents, previous: 0, change: 0 },
          engagementRate: { current: engagementRate, previous: 0, change: 0 },
          responseTime: { current: averageResponseTime, previous: 0, change: 0 },
          conversionRate: { current: 0, previous: 0, change: 0 }
        },
        goals: []
      }
    };
  }
}
