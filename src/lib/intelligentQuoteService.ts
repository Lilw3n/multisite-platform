import { 
  IntelligentQuoteSession, 
  QuoteSessionData, 
  InsuranceType, 
  QuestionnaireStep, 
  AIRecommendation,
  EligibilityAnalysis,
  Question
} from '@/types/intelligentQuote';

export class IntelligentQuoteService {
  private static readonly STORAGE_KEY = 'intelligent_quotes';
  
  // Créer une nouvelle session de devis
  static createSession(interlocutorId?: string): IntelligentQuoteSession {
    const session: IntelligentQuoteSession = {
      id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      interlocutorId,
      sessionData: this.getInitialSessionData(),
      currentStep: 0,
      totalSteps: 0,
      progress: 0,
      recommendations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    this.saveSession(session);
    return session;
  }
  
  // Données initiales de session
  private static getInitialSessionData(): QuoteSessionData {
    return {
      interlocutor: {
        personalInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        },
        address: {
          street: '',
          city: '',
          postalCode: '',
          country: 'France',
          type: 'primary'
        }
      },
      insuranceData: {
        primaryType: 'auto',
        history: {
          claims: [],
          previousInsurers: []
        },
        needs: {
          budget: {
            min: 0,
            max: 0,
            preferred: 0
          },
          priorities: [],
          preferences: {
            deductible: 'medium',
            paymentFrequency: 'monthly',
            digitalServices: true,
            personalAgent: false
          },
          timeline: {
            urgency: 'flexible'
          }
        }
      },
      crmData: {
        leadSource: 'website',
        contactHistory: [],
        preferences: {
          communicationChannel: 'email',
          bestTimeToCall: '9h-18h',
          language: 'fr'
        },
        scoring: {
          interestLevel: 50,
          buyingProbability: 50,
          budgetFit: 50,
          urgency: 50
        },
        tags: [],
        notes: ''
      },
      results: {
        quotes: [],
        comparison: {
          cheapest: '',
          bestValue: '',
          mostComplete: '',
          recommended: ''
        },
        eligibilityAnalysis: {
          overallScore: 0,
          factors: [],
          recommendations: [],
          warnings: [],
          improvementSuggestions: []
        }
      }
    };
  }
  
  // Obtenir le questionnaire adaptatif selon le type d'assurance
  static getAdaptiveQuestionnaire(insuranceType: InsuranceType, sessionData: QuoteSessionData): QuestionnaireStep[] {
    const baseSteps = this.getBaseSteps();
    const specificSteps = this.getInsuranceSpecificSteps(insuranceType);
    const crmSteps = this.getCRMSteps();
    
    // Adapter selon les données existantes
    const adaptedSteps = this.adaptStepsToData(
      [...baseSteps, ...specificSteps, ...crmSteps],
      sessionData
    );
    
    return adaptedSteps;
  }
  
  // Étapes de base (communes à tous types)
  private static getBaseSteps(): QuestionnaireStep[] {
    return [
      {
        id: 'insurance_type',
        title: '🎯 Type d\'assurance',
        description: 'Quel type d\'assurance recherchez-vous ?',
        questions: [
          {
            id: 'primary_type',
            type: 'radio',
            label: 'Type d\'assurance principal',
            required: true,
            options: [
              { value: 'auto', label: '🚗 Assurance Auto', description: 'Véhicule personnel ou professionnel' },
              { value: 'moto', label: '🏍️ Assurance Moto', description: 'Deux-roues motorisé' },
              { value: 'home', label: '🏠 Assurance Habitation', description: 'Logement principal ou secondaire' },
              { value: 'health', label: '🏥 Assurance Santé', description: 'Mutuelle individuelle ou famille' },
              { value: 'life', label: '💰 Assurance Vie', description: 'Épargne et prévoyance' },
              { value: 'professional', label: '💼 Assurance Pro', description: 'Activité professionnelle' },
              { value: 'travel', label: '✈️ Assurance Voyage', description: 'Déplacements et voyages' }
            ]
          },
          {
            id: 'urgency',
            type: 'radio',
            label: 'Quand souhaitez-vous être couvert ?',
            required: true,
            options: [
              { value: 'immediate', label: '🚨 Immédiatement', description: 'Besoin urgent' },
              { value: 'within_week', label: '📅 Dans la semaine', description: 'Assez urgent' },
              { value: 'within_month', label: '🗓️ Dans le mois', description: 'Pas pressé' },
              { value: 'flexible', label: '⏰ Flexible', description: 'Je compare tranquillement' }
            ]
          }
        ]
      },
      
      {
        id: 'interlocutor_basic',
        title: '👤 Vos informations',
        description: 'Quelques informations pour personnaliser votre devis',
        questions: [
          {
            id: 'first_name',
            type: 'text',
            label: 'Prénom',
            required: true,
            placeholder: 'Jean'
          },
          {
            id: 'last_name',
            type: 'text',
            label: 'Nom',
            required: true,
            placeholder: 'Dupont'
          },
          {
            id: 'email',
            type: 'text',
            label: 'Email',
            required: true,
            placeholder: 'jean.dupont@email.com',
            validation: {
              pattern: '^[^@]+@[^@]+\\.[^@]+$',
              message: 'Email invalide'
            }
          },
          {
            id: 'phone',
            type: 'text',
            label: 'Téléphone',
            required: true,
            placeholder: '06 12 34 56 78'
          },
          {
            id: 'date_of_birth',
            type: 'date',
            label: 'Date de naissance',
            required: true
          }
        ]
      },
      
      {
        id: 'address',
        title: '📍 Votre adresse',
        description: 'Nécessaire pour calculer les risques et tarifs',
        questions: [
          {
            id: 'street',
            type: 'text',
            label: 'Adresse',
            required: true,
            placeholder: '123 Rue de la Paix'
          },
          {
            id: 'postal_code',
            type: 'text',
            label: 'Code postal',
            required: true,
            placeholder: '75001',
            validation: {
              pattern: '^[0-9]{5}$',
              message: 'Code postal invalide'
            }
          },
          {
            id: 'city',
            type: 'text',
            label: 'Ville',
            required: true,
            placeholder: 'Paris'
          }
        ]
      },
      
      {
        id: 'budget_preferences',
        title: '💰 Budget et préférences',
        description: 'Aidez-nous à trouver les meilleures offres pour vous',
        questions: [
          {
            id: 'budget_range',
            type: 'range',
            label: 'Budget mensuel souhaité (€)',
            required: true,
            validation: {
              min: 10,
              max: 500
            }
          },
          {
            id: 'payment_frequency',
            type: 'radio',
            label: 'Fréquence de paiement préférée',
            required: true,
            options: [
              { value: 'monthly', label: '📅 Mensuel', description: 'Paiement chaque mois' },
              { value: 'quarterly', label: '📊 Trimestriel', description: 'Paiement tous les 3 mois' },
              { value: 'annual', label: '📈 Annuel', description: 'Paiement une fois par an (souvent moins cher)' }
            ]
          },
          {
            id: 'digital_preference',
            type: 'checkbox',
            label: 'Préférences de service',
            required: false,
            options: [
              { value: 'digital_services', label: '📱 Services 100% digitaux' },
              { value: 'personal_agent', label: '👨‍💼 Agent personnel dédié' },
              { value: 'phone_support', label: '📞 Support téléphonique 24/7' },
              { value: 'mobile_app', label: '📲 Application mobile' }
            ]
          }
        ]
      }
    ];
  }
  
  // Étapes spécifiques par type d'assurance
  private static getInsuranceSpecificSteps(type: InsuranceType): QuestionnaireStep[] {
    switch (type) {
      case 'auto':
        return this.getAutoInsuranceSteps();
      case 'moto':
        return this.getMotoInsuranceSteps();
      case 'home':
        return this.getHomeInsuranceSteps();
      case 'health':
        return this.getHealthInsuranceSteps();
      case 'life':
        return this.getLifeInsuranceSteps();
      case 'professional':
        return this.getProfessionalInsuranceSteps();
      default:
        return [];
    }
  }
  
  // Étapes assurance auto
  private static getAutoInsuranceSteps(): QuestionnaireStep[] {
    return [
      {
        id: 'vehicle_info',
        title: '🚗 Votre véhicule',
        description: 'Informations sur le véhicule à assurer',
        questions: [
          {
            id: 'vehicle_brand',
            type: 'select',
            label: 'Marque du véhicule',
            required: true,
            options: [
              { value: 'renault', label: 'Renault' },
              { value: 'peugeot', label: 'Peugeot' },
              { value: 'citroen', label: 'Citroën' },
              { value: 'volkswagen', label: 'Volkswagen' },
              { value: 'bmw', label: 'BMW' },
              { value: 'mercedes', label: 'Mercedes' },
              { value: 'audi', label: 'Audi' },
              { value: 'toyota', label: 'Toyota' },
              { value: 'other', label: 'Autre' }
            ],
            aiSuggestions: true
          },
          {
            id: 'vehicle_model',
            type: 'text',
            label: 'Modèle',
            required: true,
            placeholder: 'Clio, 308, C3...',
            aiSuggestions: true
          },
          {
            id: 'vehicle_year',
            type: 'number',
            label: 'Année de mise en circulation',
            required: true,
            validation: {
              min: 1990,
              max: new Date().getFullYear() + 1
            }
          },
          {
            id: 'vehicle_engine',
            type: 'radio',
            label: 'Type de motorisation',
            required: true,
            options: [
              { value: 'petrol', label: '⛽ Essence' },
              { value: 'diesel', label: '🛢️ Diesel' },
              { value: 'electric', label: '🔋 Électrique' },
              { value: 'hybrid', label: '🔋⛽ Hybride' }
            ]
          },
          {
            id: 'vehicle_power',
            type: 'number',
            label: 'Puissance (CV)',
            required: true,
            validation: {
              min: 1,
              max: 1000
            }
          }
        ]
      },
      
      {
        id: 'vehicle_usage',
        title: '🛣️ Usage du véhicule',
        description: 'Comment utilisez-vous votre véhicule ?',
        questions: [
          {
            id: 'usage_type',
            type: 'radio',
            label: 'Type d\'usage principal',
            required: true,
            options: [
              { value: 'personal', label: '🏠 Personnel', description: 'Trajets quotidiens, loisirs' },
              { value: 'professional', label: '💼 Professionnel', description: 'Déplacements travail' },
              { value: 'mixed', label: '🔄 Mixte', description: 'Personnel + professionnel' }
            ]
          },
          {
            id: 'annual_mileage',
            type: 'select',
            label: 'Kilométrage annuel estimé',
            required: true,
            options: [
              { value: '5000', label: '< 5 000 km', description: 'Usage occasionnel' },
              { value: '10000', label: '5 000 - 10 000 km', description: 'Usage modéré' },
              { value: '15000', label: '10 000 - 15 000 km', description: 'Usage régulier' },
              { value: '20000', label: '15 000 - 20 000 km', description: 'Usage intensif' },
              { value: '25000', label: '> 20 000 km', description: 'Usage très intensif' }
            ]
          },
          {
            id: 'parking_type',
            type: 'radio',
            label: 'Où garez-vous votre véhicule la nuit ?',
            required: true,
            options: [
              { value: 'garage', label: '🏠 Garage fermé', description: 'Sécurisé' },
              { value: 'covered', label: '🏢 Parking couvert', description: 'Abri' },
              { value: 'street', label: '🛣️ Rue/parking ouvert', description: 'Non sécurisé' }
            ]
          }
        ]
      },
      
      {
        id: 'driver_profile',
        title: '👨‍💼 Profil conducteur',
        description: 'Informations sur le conducteur principal',
        questions: [
          {
            id: 'license_date',
            type: 'date',
            label: 'Date d\'obtention du permis',
            required: true
          },
          {
            id: 'license_type',
            type: 'select',
            label: 'Type de permis',
            required: true,
            options: [
              { value: 'B', label: 'Permis B (voiture)' },
              { value: 'A', label: 'Permis A (moto)' },
              { value: 'C', label: 'Permis C (poids lourd)' },
              { value: 'D', label: 'Permis D (transport en commun)' }
            ]
          },
          {
            id: 'accidents_3_years',
            type: 'number',
            label: 'Nombre d\'accidents responsables (3 dernières années)',
            required: true,
            validation: {
              min: 0,
              max: 10
            }
          },
          {
            id: 'violations_3_years',
            type: 'number',
            label: 'Nombre d\'infractions (3 dernières années)',
            required: true,
            validation: {
              min: 0,
              max: 20
            }
          }
        ]
      },
      
      {
        id: 'current_insurance',
        title: '📋 Assurance actuelle',
        description: 'Informations sur votre assurance actuelle (si vous en avez une)',
        questions: [
          {
            id: 'has_current_insurance',
            type: 'radio',
            label: 'Avez-vous actuellement une assurance auto ?',
            required: true,
            options: [
              { value: 'yes', label: '✅ Oui' },
              { value: 'no', label: '❌ Non (première assurance)' }
            ]
          },
          {
            id: 'current_insurer',
            type: 'text',
            label: 'Assureur actuel',
            required: false,
            placeholder: 'Nom de votre assureur',
            dependencies: [
              {
                questionId: 'has_current_insurance',
                condition: 'equals',
                value: 'yes',
                action: 'show'
              }
            ]
          },
          {
            id: 'current_premium',
            type: 'number',
            label: 'Prime annuelle actuelle (€)',
            required: false,
            dependencies: [
              {
                questionId: 'has_current_insurance',
                condition: 'equals',
                value: 'yes',
                action: 'show'
              }
            ]
          },
          {
            id: 'bonus_malus',
            type: 'number',
            label: 'Coefficient bonus/malus',
            required: false,
            placeholder: '0.50 (50% de bonus) ou 1.25 (25% de malus)',
            validation: {
              min: 0.5,
              max: 3.5
            },
            dependencies: [
              {
                questionId: 'has_current_insurance',
                condition: 'equals',
                value: 'yes',
                action: 'show'
              }
            ]
          }
        ]
      }
    ];
  }
  
  // Étapes assurance habitation
  private static getHomeInsuranceSteps(): QuestionnaireStep[] {
    return [
      {
        id: 'property_info',
        title: '🏠 Votre logement',
        description: 'Caractéristiques de votre logement',
        questions: [
          {
            id: 'property_type',
            type: 'radio',
            label: 'Type de logement',
            required: true,
            options: [
              { value: 'apartment', label: '🏢 Appartement' },
              { value: 'house', label: '🏠 Maison' },
              { value: 'studio', label: '🏠 Studio' },
              { value: 'loft', label: '🏭 Loft' }
            ]
          },
          {
            id: 'property_surface',
            type: 'number',
            label: 'Surface habitable (m²)',
            required: true,
            validation: {
              min: 10,
              max: 1000
            }
          },
          {
            id: 'property_rooms',
            type: 'number',
            label: 'Nombre de pièces',
            required: true,
            validation: {
              min: 1,
              max: 20
            }
          },
          {
            id: 'construction_year',
            type: 'number',
            label: 'Année de construction',
            required: true,
            validation: {
              min: 1800,
              max: new Date().getFullYear()
            }
          },
          {
            id: 'ownership_status',
            type: 'radio',
            label: 'Vous êtes',
            required: true,
            options: [
              { value: 'owner', label: '🏠 Propriétaire' },
              { value: 'tenant', label: '🔑 Locataire' }
            ]
          }
        ]
      }
    ];
  }
  
  // Étapes assurance santé
  private static getHealthInsuranceSteps(): QuestionnaireStep[] {
    return [
      {
        id: 'health_coverage',
        title: '🏥 Couverture santé',
        description: 'Quel type de couverture recherchez-vous ?',
        questions: [
          {
            id: 'coverage_type',
            type: 'radio',
            label: 'Type de couverture',
            required: true,
            options: [
              { value: 'individual', label: '👤 Individuelle' },
              { value: 'family', label: '👨‍👩‍👧‍👦 Famille' },
              { value: 'couple', label: '👫 Couple' }
            ]
          },
          {
            id: 'coverage_level',
            type: 'radio',
            label: 'Niveau de couverture souhaité',
            required: true,
            options: [
              { value: 'basic', label: '🥉 Essentiel', description: 'Couverture de base' },
              { value: 'comfort', label: '🥈 Confort', description: 'Bon équilibre prix/couverture' },
              { value: 'premium', label: '🥇 Premium', description: 'Couverture maximale' }
            ]
          }
        ]
      }
    ];
  }
  
  // Étapes assurance vie
  private static getLifeInsuranceSteps(): QuestionnaireStep[] {
    return [
      {
        id: 'life_objectives',
        title: '💰 Objectifs',
        description: 'Quels sont vos objectifs avec cette assurance vie ?',
        questions: [
          {
            id: 'main_objective',
            type: 'radio',
            label: 'Objectif principal',
            required: true,
            options: [
              { value: 'savings', label: '💰 Épargne', description: 'Faire fructifier mon argent' },
              { value: 'protection', label: '🛡️ Protection', description: 'Protéger ma famille' },
              { value: 'inheritance', label: '👨‍👩‍👧‍👦 Transmission', description: 'Préparer ma succession' },
              { value: 'retirement', label: '👴 Retraite', description: 'Compléter ma retraite' }
            ]
          },
          {
            id: 'investment_amount',
            type: 'number',
            label: 'Montant à investir (€)',
            required: true,
            validation: {
              min: 100,
              max: 1000000
            }
          }
        ]
      }
    ];
  }
  
  // Étapes assurance professionnelle
  private static getProfessionalInsuranceSteps(): QuestionnaireStep[] {
    return [
      {
        id: 'professional_activity',
        title: '💼 Votre activité',
        description: 'Informations sur votre activité professionnelle',
        questions: [
          {
            id: 'business_sector',
            type: 'select',
            label: 'Secteur d\'activité',
            required: true,
            options: [
              { value: 'vtc', label: '🚗 VTC/Taxi' },
              { value: 'consulting', label: '💼 Conseil' },
              { value: 'commerce', label: '🛒 Commerce' },
              { value: 'artisan', label: '🔨 Artisanat' },
              { value: 'liberal', label: '⚖️ Profession libérale' },
              { value: 'other', label: 'Autre' }
            ]
          },
          {
            id: 'annual_turnover',
            type: 'select',
            label: 'Chiffre d\'affaires annuel',
            required: true,
            options: [
              { value: '10000', label: '< 10 000 €' },
              { value: '50000', label: '10 000 - 50 000 €' },
              { value: '100000', label: '50 000 - 100 000 €' },
              { value: '200000', label: '100 000 - 200 000 €' },
              { value: '500000', label: '> 200 000 €' }
            ]
          }
        ]
      }
    ];
  }
  
  // Étapes assurance moto (similaire à auto)
  private static getMotoInsuranceSteps(): QuestionnaireStep[] {
    return [
      {
        id: 'moto_info',
        title: '🏍️ Votre moto',
        description: 'Informations sur votre deux-roues',
        questions: [
          {
            id: 'moto_type',
            type: 'radio',
            label: 'Type de deux-roues',
            required: true,
            options: [
              { value: 'scooter_50', label: '🛵 Scooter 50cc' },
              { value: 'scooter_125', label: '🛵 Scooter 125cc' },
              { value: 'moto_125', label: '🏍️ Moto 125cc' },
              { value: 'moto_plus', label: '🏍️ Moto > 125cc' }
            ]
          }
        ]
      }
    ];
  }
  
  // Étapes CRM
  private static getCRMSteps(): QuestionnaireStep[] {
    return [
      {
        id: 'lead_qualification',
        title: '🎯 Finalisation',
        description: 'Dernières informations pour personnaliser votre offre',
        questions: [
          {
            id: 'lead_source',
            type: 'select',
            label: 'Comment avez-vous connu DiddyHome ?',
            required: false,
            options: [
              { value: 'google', label: '🔍 Recherche Google' },
              { value: 'social', label: '📱 Réseaux sociaux' },
              { value: 'referral', label: '👥 Recommandation' },
              { value: 'advertising', label: '📺 Publicité' },
              { value: 'other', label: 'Autre' }
            ]
          },
          {
            id: 'communication_preference',
            type: 'radio',
            label: 'Comment préférez-vous être contacté ?',
            required: true,
            options: [
              { value: 'email', label: '📧 Email' },
              { value: 'phone', label: '📞 Téléphone' },
              { value: 'sms', label: '💬 SMS' },
              { value: 'whatsapp', label: '📱 WhatsApp' }
            ]
          },
          {
            id: 'best_time_to_call',
            type: 'select',
            label: 'Meilleur moment pour vous appeler',
            required: false,
            options: [
              { value: '9h-12h', label: '🌅 Matin (9h-12h)' },
              { value: '12h-14h', label: '🍽️ Midi (12h-14h)' },
              { value: '14h-18h', label: '☀️ Après-midi (14h-18h)' },
              { value: '18h-20h', label: '🌆 Soirée (18h-20h)' }
            ]
          },
          {
            id: 'additional_notes',
            type: 'text',
            label: 'Informations complémentaires',
            required: false,
            placeholder: 'Précisions, questions particulières...'
          }
        ]
      }
    ];
  }
  
  // Adapter les étapes selon les données existantes
  private static adaptStepsToData(steps: QuestionnaireStep[], sessionData: QuoteSessionData): QuestionnaireStep[] {
    // Logique d'adaptation intelligente
    // Masquer les questions déjà renseignées, suggérer des valeurs, etc.
    return steps;
  }
  
  // Analyser l'éligibilité en temps réel
  static analyzeEligibility(sessionData: QuoteSessionData): EligibilityAnalysis {
    const factors = [];
    let overallScore = 70; // Score de base
    
    // Analyser l'âge
    if (sessionData.interlocutor.personalInfo.dateOfBirth) {
      const age = this.calculateAge(sessionData.interlocutor.personalInfo.dateOfBirth);
      if (age >= 25 && age <= 65) {
        factors.push({
          name: 'Âge optimal',
          score: 85,
          weight: 0.2,
          impact: 'positive' as const,
          explanation: 'Votre âge est dans la tranche préférée des assureurs'
        });
        overallScore += 10;
      } else if (age < 25) {
        factors.push({
          name: 'Jeune conducteur',
          score: 45,
          weight: 0.2,
          impact: 'negative' as const,
          explanation: 'Les jeunes conducteurs paient généralement plus cher'
        });
        overallScore -= 15;
      }
    }
    
    // Analyser l'historique de conduite (pour auto)
    if (sessionData.insuranceData.primaryType === 'auto' && sessionData.insuranceData.autoData) {
      const accidents = sessionData.insuranceData.history.claims.length;
      if (accidents === 0) {
        factors.push({
          name: 'Aucun sinistre',
          score: 90,
          weight: 0.3,
          impact: 'positive' as const,
          explanation: 'Votre historique sans sinistre est un atout majeur'
        });
        overallScore += 15;
      } else if (accidents > 2) {
        factors.push({
          name: 'Historique de sinistres',
          score: 30,
          weight: 0.3,
          impact: 'negative' as const,
          explanation: 'Plusieurs sinistres peuvent augmenter votre prime'
        });
        overallScore -= 20;
      }
    }
    
    // Analyser le budget
    const budget = sessionData.insuranceData.needs.budget.preferred;
    if (budget > 0) {
      if (budget >= 50) {
        factors.push({
          name: 'Budget suffisant',
          score: 80,
          weight: 0.15,
          impact: 'positive' as const,
          explanation: 'Votre budget permet d\'accéder à de bonnes garanties'
        });
        overallScore += 5;
      } else {
        factors.push({
          name: 'Budget serré',
          score: 50,
          weight: 0.15,
          impact: 'neutral' as const,
          explanation: 'Budget limité, nous privilégierons les offres économiques'
        });
      }
    }
    
    // Générer des recommandations
    const recommendations = [];
    const warnings = [];
    const improvementSuggestions = [];
    
    if (overallScore < 60) {
      warnings.push('Votre profil présente quelques défis, mais nous avons des solutions adaptées');
      improvementSuggestions.push({
        action: 'Considérer une franchise plus élevée pour réduire la prime',
        impact: 15,
        difficulty: 'easy' as const
      });
    } else if (overallScore > 80) {
      recommendations.push('Excellent profil ! Vous devriez obtenir des tarifs préférentiels');
    }
    
    return {
      overallScore: Math.max(0, Math.min(100, overallScore)),
      factors,
      recommendations,
      warnings,
      improvementSuggestions
    };
  }
  
  // Générer des recommandations IA
  static generateAIRecommendations(sessionData: QuoteSessionData): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Recommandation basée sur le profil
    if (sessionData.insuranceData.primaryType === 'auto') {
      recommendations.push({
        id: 'auto_eco_tip',
        type: 'optimization',
        title: 'Optimisation tarifaire',
        description: 'Basé sur votre profil, une assurance au tiers étendu pourrait vous faire économiser 30%',
        confidence: 85,
        potentialSavings: 200,
        priority: 'high',
        reasoning: {
          factors: ['Véhicule de plus de 5 ans', 'Budget serré', 'Bon conducteur'],
          dataPoints: ['Âge du véhicule', 'Budget déclaré', 'Historique'],
          similarCases: 1247
        },
        nextSteps: [
          'Comparer les garanties au tiers étendu',
          'Vérifier les exclusions',
          'Négocier les franchises'
        ]
      });
    }
    
    // Recommandation cross-sell
    if (sessionData.insuranceData.primaryType === 'auto' && !sessionData.insuranceData.homeData) {
      recommendations.push({
        id: 'home_cross_sell',
        type: 'cross_sell',
        title: 'Assurance habitation complémentaire',
        description: 'En combinant auto + habitation, économisez jusqu\'à 15% sur les deux contrats',
        confidence: 75,
        potentialSavings: 150,
        potentialRevenue: 300,
        priority: 'medium',
        reasoning: {
          factors: ['Client auto sans habitation', 'Profil stable', 'Budget disponible'],
          dataPoints: ['Type de logement', 'Statut propriétaire/locataire'],
          similarCases: 892
        },
        nextSteps: [
          'Proposer un devis habitation',
          'Calculer la remise multi-contrats',
          'Présenter les avantages de la centralisation'
        ]
      });
    }
    
    return recommendations;
  }
  
  // Utilitaires
  private static calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
  
  // Sauvegarder une session
  static saveSession(session: IntelligentQuoteSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      const sessions = this.getAllSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      session.updatedAt = new Date().toISOString();
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Erreur sauvegarde session:', error);
    }
  }
  
  // Charger une session
  static getSession(sessionId: string): IntelligentQuoteSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }
  
  // Obtenir toutes les sessions
  static getAllSessions(): IntelligentQuoteSession[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur chargement sessions:', error);
      return [];
    }
  }
  
  // Supprimer une session
  static deleteSession(sessionId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const sessions = this.getAllSessions();
      const filtered = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Erreur suppression session:', error);
    }
  }
}
