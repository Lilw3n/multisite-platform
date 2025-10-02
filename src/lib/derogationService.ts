// Service intelligent de dérogations avec IA pour situations humaines

import {
  DerogationRequest,
  DerogationProposal,
  DerogationScenario,
  InsurerProfile,
  HumanFactor,
  RiskAssessment,
  SimilarCase,
  DerogationStrategy,
  ClientSituation,
  RequirementGap,
  InsuranceRequirement
} from '@/types/derogations';

export class DerogationService {
  private static readonly STORAGE_KEY = 'diddyhome_derogations';
  private static readonly SCENARIOS_KEY = 'diddyhome_derogation_scenarios';
  private static readonly INSURERS_KEY = 'diddyhome_insurer_profiles';

  // Scénarios prédéfinis avec IA
  static getDerogationScenarios(): DerogationScenario[] {
    return [
      {
        id: 'vehicle_sold_period_gap',
        name: 'Véhicule vendu - Interruption période',
        description: 'Client a vendu son véhicule et n\'a pas pu se réassurer immédiatement',
        triggers: [
          { condition: 'insurance_period_months', operator: 'less_than', value: 36, weight: 1.0 },
          { condition: 'vehicle_sold', operator: 'equals', value: true, weight: 0.8 },
          { condition: 'gap_months', operator: 'less_than', value: 6, weight: 0.6 }
        ],
        strategies: [
          {
            approach: 'conditional_acceptance',
            reasoning: 'Vente de véhicule = situation légitime, pas de risque accru',
            successProbability: 85,
            timeline: '5-10 jours',
            requiredDocuments: ['Certificat de vente', 'Preuve recherche nouveau véhicule'],
            keyArguments: [
              'Interruption volontaire et documentée',
              'Pas de sinistre responsable',
              'Démarche proactive de réassurance',
              'Situation temporaire et justifiée'
            ]
          }
        ],
        commonArguments: [
          'Le client a agi de bonne foi en vendant son véhicule',
          'L\'interruption est documentée et justifiée',
          'Aucun risque supplémentaire lié au comportement',
          'Démarche proactive pour se réassurer'
        ],
        successRate: 82,
        examples: [
          {
            situation: 'Client avec 35 mois au lieu de 36, véhicule vendu il y a 2 mois',
            approach: 'Demande directe avec certificat de vente',
            outcome: 'Accepté sans condition',
            lessons: ['Documentation claire = succès rapide'],
            insurer: 'Allianz',
            timeline: '7 jours'
          }
        ]
      },
      
      {
        id: 'non_responsible_accident_gap',
        name: 'Accident non responsable - Interruption forcée',
        description: 'Accident non responsable ayant causé une interruption d\'assurance',
        triggers: [
          { condition: 'insurance_period_months', operator: 'less_than', value: 36, weight: 1.0 },
          { condition: 'non_responsible_accident', operator: 'equals', value: true, weight: 0.9 },
          { condition: 'vehicle_total_loss', operator: 'equals', value: true, weight: 0.7 }
        ],
        strategies: [
          {
            approach: 'direct_request',
            reasoning: 'Situation subie, pas de responsabilité du client',
            successProbability: 90,
            timeline: '3-7 jours',
            requiredDocuments: ['Constat amiable', 'Rapport expertise', 'Courrier assureur adverse'],
            keyArguments: [
              'Accident subi, non provoqué',
              'Perte totale du véhicule',
              'Impossibilité de maintenir l\'assurance',
              'Recherche active de solution'
            ]
          }
        ],
        commonArguments: [
          'Le client est victime, pas responsable',
          'Situation de force majeure',
          'Impossibilité matérielle de continuer',
          'Bonne foi évidente'
        ],
        successRate: 88,
        examples: [
          {
            situation: 'Véhicule détruit par conducteur en fuite, 34 mois d\'assurance',
            approach: 'Dossier complet avec rapport police',
            outcome: 'Accepté immédiatement',
            lessons: ['Force majeure = acceptation quasi-automatique'],
            insurer: 'Groupama',
            timeline: '3 jours'
          }
        ]
      },

      {
        id: 'financial_hardship_temporary',
        name: 'Difficultés financières temporaires',
        description: 'Interruption due à des difficultés financières temporaires documentées',
        triggers: [
          { condition: 'insurance_period_months', operator: 'less_than', value: 36, weight: 1.0 },
          { condition: 'financial_hardship', operator: 'equals', value: true, weight: 0.8 },
          { condition: 'situation_resolved', operator: 'equals', value: true, weight: 0.6 }
        ],
        strategies: [
          {
            approach: 'premium_adjustment',
            reasoning: 'Situation humaine compréhensible avec résolution',
            successProbability: 70,
            timeline: '10-15 jours',
            requiredDocuments: ['Justificatifs difficultés', 'Preuve amélioration situation'],
            keyArguments: [
              'Situation temporaire et résolue',
              'Transparence du client',
              'Volonté de régulariser',
              'Stabilité retrouvée'
            ]
          }
        ],
        commonArguments: [
          'Difficultés temporaires et documentées',
          'Situation maintenant stabilisée',
          'Client transparent et de bonne foi',
          'Engagement à maintenir l\'assurance'
        ],
        successRate: 65,
        examples: [
          {
            situation: 'Perte emploi 6 mois, maintenant CDI, 33 mois d\'assurance',
            approach: 'Dossier avec contrat de travail et justificatifs',
            outcome: 'Accepté avec surprime 15%',
            lessons: ['Preuve stabilité = facteur clé'],
            insurer: 'MAIF',
            timeline: '12 jours'
          }
        ]
      },

      {
        id: 'young_driver_experience',
        name: 'Jeune conducteur - Expérience progressive',
        description: 'Jeune conducteur avec expérience progressive mais période courte',
        triggers: [
          { condition: 'driver_age', operator: 'less_than', value: 25, weight: 0.8 },
          { condition: 'insurance_period_months', operator: 'less_than', value: 36, weight: 1.0 },
          { condition: 'no_claims', operator: 'equals', value: true, weight: 0.7 }
        ],
        strategies: [
          {
            approach: 'staged_compliance',
            reasoning: 'Expérience progressive avec engagement futur',
            successProbability: 75,
            timeline: '7-12 jours',
            requiredDocuments: ['Relevé d\'information', 'Attestation conduite accompagnée'],
            keyArguments: [
              'Apprentissage progressif et encadré',
              'Aucun sinistre responsable',
              'Engagement long terme',
              'Formation complémentaire possible'
            ]
          }
        ],
        commonArguments: [
          'Formation progressive et encadrée',
          'Comportement exemplaire jusqu\'ici',
          'Engagement sur la durée',
          'Acceptation formation complémentaire'
        ],
        successRate: 72,
        examples: [
          {
            situation: '22 ans, 30 mois d\'assurance, conduite accompagnée',
            approach: 'Mise en avant formation et engagement',
            outcome: 'Accepté avec stage de conduite',
            lessons: ['Formation = argument fort'],
            insurer: 'Macif',
            timeline: '9 jours'
          }
        ]
      },

      {
        id: 'professional_relocation',
        name: 'Déménagement professionnel',
        description: 'Interruption due à déménagement professionnel avec changement d\'assureur imposé',
        triggers: [
          { condition: 'insurance_period_months', operator: 'less_than', value: 36, weight: 1.0 },
          { condition: 'professional_relocation', operator: 'equals', value: true, weight: 0.8 },
          { condition: 'insurer_unavailable_new_region', operator: 'equals', value: true, weight: 0.6 }
        ],
        strategies: [
          {
            approach: 'direct_request',
            reasoning: 'Contrainte géographique indépendante de la volonté',
            successProbability: 80,
            timeline: '5-8 jours',
            requiredDocuments: ['Contrat de travail', 'Justificatif déménagement', 'Courrier ancien assureur'],
            keyArguments: [
              'Déménagement professionnel obligatoire',
              'Impossibilité de continuer avec ancien assureur',
              'Recherche immédiate de nouvelle assurance',
              'Continuité professionnelle'
            ]
          }
        ],
        commonArguments: [
          'Contrainte professionnelle indépendante',
          'Impossibilité géographique documentée',
          'Démarche immédiate de réassurance',
          'Stabilité professionnelle'
        ],
        successRate: 78,
        examples: [
          {
            situation: 'Mutation Paris-Lyon, assureur régional, 34 mois',
            approach: 'Dossier avec ordre de mission',
            outcome: 'Accepté sans condition',
            lessons: ['Contrainte professionnelle = argument fort'],
            insurer: 'Generali',
            timeline: '6 jours'
          }
        ]
      }
    ];
  }

  // Profils d'assureurs avec leur flexibilité
  static getInsurerProfiles(): InsurerProfile[] {
    return [
      {
        id: 'allianz',
        name: 'Allianz France',
        flexibility: {
          claimsHistory: {
            level: 'moderate',
            conditions: ['Analyse cas par cas', 'Documentation complète'],
            maxDeviation: '1 sinistre supplémentaire',
            typicalRequirements: ['Justificatifs circonstances', 'Engagement prévention'],
            successFactors: ['Transparence', 'Documentation', 'Bonne foi']
          },
          insurancePeriod: {
            level: 'high',
            conditions: ['Justification interruption', 'Situation résolue'],
            maxDeviation: '6 mois manquants',
            typicalRequirements: ['Certificats', 'Preuves recherche'],
            successFactors: ['Légitimité interruption', 'Proactivité client']
          },
          vehicleAge: {
            level: 'limited',
            conditions: ['Expertise technique', 'Entretien documenté'],
            maxDeviation: '2 ans',
            typicalRequirements: ['Contrôle technique', 'Historique entretien'],
            successFactors: ['État véhicule', 'Maintenance régulière']
          },
          driverExperience: {
            level: 'moderate',
            conditions: ['Formation complémentaire', 'Supervision'],
            maxDeviation: '6 mois',
            typicalRequirements: ['Stage conduite', 'Parrainage'],
            successFactors: ['Formation', 'Encadrement', 'Motivation']
          },
          noClaimsBonus: {
            level: 'high',
            conditions: ['Justification interruption', 'Engagement futur'],
            maxDeviation: '12 mois',
            typicalRequirements: ['Relevé information', 'Attestations'],
            successFactors: ['Historique propre', 'Continuité future']
          }
        },
        derogationHistory: {
          totalRequests: 1250,
          approvalRate: 78,
          averageResponseTime: 7,
          commonConditions: ['Surprime 10-20%', 'Franchise majorée', 'Période probatoire'],
          preferredApproaches: ['Documentation complète', 'Justification détaillée', 'Engagement client']
        },
        decisionCriteria: {
          businessValueThreshold: 800,
          riskTolerance: 'medium',
          humanFactorWeight: 0.7,
          documentationRequirements: ['Justificatifs officiels', 'Attestations tiers', 'Preuves circonstances']
        },
        contactInfo: {
          derogationContact: 'derogations@allianz.fr',
          preferredChannel: 'email',
          responseTime: '5-10 jours',
          escalationPath: ['Souscripteur senior', 'Directeur régional', 'Direction technique']
        }
      },

      {
        id: 'groupama',
        name: 'Groupama',
        flexibility: {
          claimsHistory: {
            level: 'high',
            conditions: ['Contexte humain', 'Responsabilité analysée'],
            maxDeviation: '2 sinistres non responsables',
            typicalRequirements: ['Constats détaillés', 'Rapports expertise'],
            successFactors: ['Non-responsabilité', 'Circonstances', 'Transparence']
          },
          insurancePeriod: {
            level: 'very_high',
            conditions: ['Justification légitime', 'Bonne foi'],
            maxDeviation: '12 mois manquants',
            typicalRequirements: ['Certificats situation', 'Preuves recherche'],
            successFactors: ['Légitimité', 'Proactivité', 'Transparence']
          },
          vehicleAge: {
            level: 'moderate',
            conditions: ['État général', 'Entretien suivi'],
            maxDeviation: '3 ans',
            typicalRequirements: ['CT récent', 'Factures entretien'],
            successFactors: ['Maintenance', 'État général', 'Utilisation']
          },
          driverExperience: {
            level: 'high',
            conditions: ['Formation', 'Accompagnement'],
            maxDeviation: '12 mois',
            typicalRequirements: ['Attestation formation', 'Parrainage expérimenté'],
            successFactors: ['Formation qualité', 'Encadrement', 'Progression']
          },
          noClaimsBonus: {
            level: 'very_high',
            conditions: ['Situation documentée', 'Engagement'],
            maxDeviation: '18 mois',
            typicalRequirements: ['Relevés complets', 'Justificatifs'],
            successFactors: ['Historique', 'Justification', 'Engagement']
          }
        },
        derogationHistory: {
          totalRequests: 890,
          approvalRate: 85,
          averageResponseTime: 5,
          commonConditions: ['Surprime modérée', 'Suivi renforcé', 'Engagement écrit'],
          preferredApproaches: ['Approche humaine', 'Contexte détaillé', 'Solutions créatives']
        },
        decisionCriteria: {
          businessValueThreshold: 600,
          riskTolerance: 'high',
          humanFactorWeight: 0.8,
          documentationRequirements: ['Justificatifs situation', 'Attestations', 'Engagements écrits']
        },
        contactInfo: {
          derogationContact: 'souscription.speciale@groupama.fr',
          preferredChannel: 'phone',
          responseTime: '3-7 jours',
          escalationPath: ['Responsable souscription', 'Directeur technique', 'Comité dérogations']
        }
      },

      {
        id: 'maif',
        name: 'MAIF',
        flexibility: {
          claimsHistory: {
            level: 'high',
            conditions: ['Analyse comportementale', 'Prévention'],
            maxDeviation: '1 sinistre responsable supplémentaire',
            typicalRequirements: ['Stage prévention', 'Engagement formation'],
            successFactors: ['Démarche préventive', 'Formation', 'Engagement']
          },
          insurancePeriod: {
            level: 'high',
            conditions: ['Justification sociale', 'Situation stabilisée'],
            maxDeviation: '8 mois manquants',
            typicalRequirements: ['Justificatifs sociaux', 'Preuve stabilisation'],
            successFactors: ['Aspect social', 'Stabilisation', 'Transparence']
          },
          vehicleAge: {
            level: 'moderate',
            conditions: ['Sécurité prioritaire', 'Entretien rigoureux'],
            maxDeviation: '2 ans',
            typicalRequirements: ['CT détaillé', 'Carnet entretien'],
            successFactors: ['Sécurité', 'Entretien', 'Responsabilité']
          },
          driverExperience: {
            level: 'very_high',
            conditions: ['Formation MAIF', 'Accompagnement'],
            maxDeviation: '18 mois',
            typicalRequirements: ['Formation MAIF obligatoire', 'Suivi personnalisé'],
            successFactors: ['Formation MAIF', 'Accompagnement', 'Progression']
          },
          noClaimsBonus: {
            level: 'high',
            conditions: ['Justification sociale', 'Engagement mutualiste'],
            maxDeviation: '15 mois',
            typicalRequirements: ['Justificatifs', 'Adhésion valeurs'],
            successFactors: ['Valeurs mutualistes', 'Engagement', 'Solidarité']
          }
        },
        derogationHistory: {
          totalRequests: 650,
          approvalRate: 82,
          averageResponseTime: 8,
          commonConditions: ['Formation obligatoire', 'Suivi personnalisé', 'Engagement mutualiste'],
          preferredApproaches: ['Approche éducative', 'Accompagnement', 'Prévention']
        },
        decisionCriteria: {
          businessValueThreshold: 500,
          riskTolerance: 'medium',
          humanFactorWeight: 0.9,
          documentationRequirements: ['Justificatifs détaillés', 'Engagement formation', 'Adhésion valeurs']
        },
        contactInfo: {
          derogationContact: 'etude.speciale@maif.fr',
          preferredChannel: 'email',
          responseTime: '7-12 jours',
          escalationPath: ['Conseiller spécialisé', 'Responsable souscription', 'Commission dérogations']
        }
      }
    ];
  }

  // Analyse IA de la situation
  static analyzeClientSituation(situation: ClientSituation, requirement: InsuranceRequirement): {
    humanFactors: HumanFactor[];
    legitimacyScore: number;
    riskAssessment: RiskAssessment;
    recommendedStrategy: DerogationStrategy;
  } {
    const humanFactors: HumanFactor[] = [];
    let legitimacyScore = 50; // Base

    // Analyse des circonstances
    situation.circumstances.forEach(circumstance => {
      let factor: HumanFactor;
      
      switch (circumstance.type) {
        case 'vehicle_sale':
          factor = {
            type: 'life_event',
            description: 'Vente volontaire du véhicule avec documentation',
            impact: 'medium',
            legitimacy: 85,
            documentation: ['Certificat de vente', 'Preuve recherche nouveau véhicule'],
            verifiable: true
          };
          legitimacyScore += 20;
          break;
          
        case 'accident_non_responsible':
          factor = {
            type: 'external_circumstances',
            description: 'Accident subi, non provoqué par le client',
            impact: 'high',
            legitimacy: 95,
            documentation: ['Constat amiable', 'Rapport police', 'Expertise'],
            verifiable: true
          };
          legitimacyScore += 30;
          break;
          
        case 'job_loss':
          factor = {
            type: 'financial_hardship',
            description: 'Perte d\'emploi temporaire avec impact financier',
            impact: 'high',
            legitimacy: 75,
            documentation: ['Attestation Pôle Emploi', 'Nouveau contrat travail'],
            verifiable: true
          };
          legitimacyScore += 15;
          break;
          
        case 'relocation':
          factor = {
            type: 'life_event',
            description: 'Déménagement professionnel ou personnel',
            impact: 'medium',
            legitimacy: 80,
            documentation: ['Contrat travail', 'Justificatif déménagement'],
            verifiable: true
          };
          legitimacyScore += 18;
          break;
          
        default:
          factor = {
            type: 'external_circumstances',
            description: circumstance.description,
            impact: 'medium',
            legitimacy: 60,
            documentation: circumstance.documentation,
            verifiable: circumstance.verified
          };
          legitimacyScore += 10;
      }
      
      humanFactors.push(factor);
    });

    // Analyse des facteurs atténuants
    situation.mitigatingFactors.forEach(mitigating => {
      legitimacyScore += mitigating.relevance * 0.2;
    });

    // Évaluation des risques
    const riskAssessment: RiskAssessment = {
      overallRisk: legitimacyScore > 80 ? 'low' : legitimacyScore > 60 ? 'medium' : 'high',
      riskFactors: [
        {
          factor: 'Interruption période assurance',
          weight: 0.6,
          description: 'Période d\'assurance inférieure aux exigences',
          quantified: true,
          value: situation.actualValue
        }
      ],
      mitigatingElements: humanFactors.map(hf => ({
        element: hf.description,
        weight: hf.legitimacy / 100,
        description: `Facteur humain: ${hf.type}`,
        reduces: ['Risque comportemental', 'Risque moral']
      })),
      recommendedPremiumAdjustment: Math.max(0, (60 - legitimacyScore) * 0.5),
      additionalConditions: legitimacyScore < 70 ? ['Période probatoire 6 mois', 'Suivi renforcé'] : []
    };

    // Stratégie recommandée
    const recommendedStrategy: DerogationStrategy = {
      approach: legitimacyScore > 85 ? 'direct_request' : 
                legitimacyScore > 70 ? 'conditional_acceptance' : 'premium_adjustment',
      reasoning: `Score de légitimité: ${legitimacyScore}%. ${humanFactors.length} facteurs humains identifiés.`,
      successProbability: Math.min(95, legitimacyScore + 10),
      timeline: legitimacyScore > 80 ? '3-7 jours' : '7-14 jours',
      requiredDocuments: humanFactors.flatMap(hf => hf.documentation),
      keyArguments: humanFactors.map(hf => hf.description)
    };

    return {
      humanFactors,
      legitimacyScore: Math.min(100, legitimacyScore),
      riskAssessment,
      recommendedStrategy
    };
  }

  // Génération automatique de propositions de dérogation
  static generateDerogationProposals(
    situation: ClientSituation,
    requirement: InsuranceRequirement,
    gap: RequirementGap,
    analysis: any
  ): DerogationProposal[] {
    const insurers = this.getInsurerProfiles();
    const scenarios = this.getDerogationScenarios();
    const proposals: DerogationProposal[] = [];

    // Trouver le scénario le plus adapté
    const matchingScenario = this.findBestMatchingScenario(situation, scenarios);

    insurers.forEach(insurer => {
      // Évaluer la compatibilité avec cet assureur
      const compatibility = this.evaluateInsurerCompatibility(insurer, situation, requirement, gap);
      
      if (compatibility.score > 40) { // Seuil minimum
        const proposal: DerogationProposal = {
          id: `proposal_${Date.now()}_${insurer.id}`,
          insurer,
          type: this.determineProposalType(compatibility, analysis.legitimacyScore),
          description: this.generateProposalDescription(insurer, situation, matchingScenario),
          conditions: this.generateConditions(insurer, compatibility, analysis.riskAssessment),
          justification: {
            keyArguments: analysis.recommendedStrategy.keyArguments,
            humanFactors: analysis.humanFactors.map((hf: HumanFactor) => hf.description),
            businessCase: this.generateBusinessCase(situation, insurer),
            riskMitigation: this.generateRiskMitigation(analysis.riskAssessment, insurer),
            precedents: matchingScenario ? matchingScenario.examples.map(ex => ex.situation) : []
          },
          successProbability: Math.min(95, compatibility.score + analysis.legitimacyScore * 0.3),
          expectedTimeline: insurer.contactInfo.responseTime,
          alternativeOptions: this.generateAlternatives(insurer, situation),
          status: 'draft'
        };
        
        proposals.push(proposal);
      }
    });

    // Trier par probabilité de succès
    return proposals.sort((a, b) => b.successProbability - a.successProbability);
  }

  // Recherche de cas similaires
  static findSimilarCases(situation: ClientSituation, requirement: InsuranceRequirement): SimilarCase[] {
    // Simulation de cas similaires basés sur les scénarios
    const scenarios = this.getDerogationScenarios();
    const similarCases: SimilarCase[] = [];

    scenarios.forEach(scenario => {
      scenario.examples.forEach(example => {
        const similarity = this.calculateSimilarity(situation, example);
        if (similarity > 60) {
          similarCases.push({
            id: `case_${scenario.id}_${example.insurer}`,
            situation: example.situation,
            outcome: example.outcome as any,
            insurer: example.insurer,
            conditions: example.outcome === 'conditional' ? ['Conditions spéciales appliquées'] : undefined,
            similarity,
            lessons: example.lessons
          });
        }
      });
    });

    return similarCases.sort((a, b) => b.similarity - a.similarity);
  }

  // Méthodes utilitaires privées
  private static findBestMatchingScenario(situation: ClientSituation, scenarios: DerogationScenario[]): DerogationScenario | null {
    let bestMatch: { scenario: DerogationScenario; score: number } | null = null;

    scenarios.forEach(scenario => {
      let score = 0;
      scenario.triggers.forEach(trigger => {
        // Simulation de matching basé sur les triggers
        if (this.evaluateTrigger(trigger, situation)) {
          score += trigger.weight;
        }
      });

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { scenario, score };
      }
    });

    return bestMatch && bestMatch.score > 0.5 ? bestMatch.scenario : null;
  }

  private static evaluateTrigger(trigger: any, situation: ClientSituation): boolean {
    // Simulation d'évaluation des triggers
    switch (trigger.condition) {
      case 'insurance_period_months':
        return situation.actualValue < trigger.value;
      case 'vehicle_sold':
        return situation.circumstances.some(c => c.type === 'vehicle_sale');
      case 'non_responsible_accident':
        return situation.circumstances.some(c => c.type === 'accident_non_responsible');
      default:
        return false;
    }
  }

  private static evaluateInsurerCompatibility(
    insurer: InsurerProfile,
    situation: ClientSituation,
    requirement: InsuranceRequirement,
    gap: RequirementGap
  ): { score: number; factors: string[] } {
    let score = 50; // Base
    const factors: string[] = [];

    // Évaluer la flexibilité de l'assureur pour ce type de requirement
    const flexibility = insurer.flexibility.insurancePeriod; // Exemple
    
    switch (flexibility.level) {
      case 'very_high':
        score += 30;
        factors.push('Très haute flexibilité');
        break;
      case 'high':
        score += 20;
        factors.push('Haute flexibilité');
        break;
      case 'moderate':
        score += 10;
        factors.push('Flexibilité modérée');
        break;
      case 'limited':
        score += 5;
        factors.push('Flexibilité limitée');
        break;
      case 'none':
        score -= 20;
        factors.push('Aucune flexibilité');
        break;
    }

    // Facteur humain
    if (insurer.decisionCriteria.humanFactorWeight > 0.7) {
      score += 15;
      factors.push('Sensible aux facteurs humains');
    }

    // Historique de dérogations
    if (insurer.derogationHistory.approvalRate > 80) {
      score += 10;
      factors.push('Bon taux d\'approbation');
    }

    return { score: Math.min(100, score), factors };
  }

  private static determineProposalType(compatibility: any, legitimacyScore: number): any {
    if (legitimacyScore > 85 && compatibility.score > 80) {
      return 'full_waiver';
    } else if (legitimacyScore > 70) {
      return 'conditional_acceptance';
    } else if (legitimacyScore > 50) {
      return 'premium_increase';
    } else {
      return 'coverage_modification';
    }
  }

  private static generateProposalDescription(insurer: InsurerProfile, situation: ClientSituation, scenario: DerogationScenario | null): string {
    const circumstances = situation.circumstances.map(c => c.description).join(', ');
    const scenarioName = scenario ? scenario.name : 'Situation particulière';
    
    return `Demande de dérogation auprès de ${insurer.name} pour ${scenarioName}. Circonstances: ${circumstances}. Approche recommandée basée sur l'historique de flexibilité de l'assureur.`;
  }

  private static generateConditions(insurer: InsurerProfile, compatibility: any, riskAssessment: RiskAssessment): any[] {
    const conditions: any[] = [];

    if (riskAssessment.recommendedPremiumAdjustment > 0) {
      conditions.push({
        type: 'premium_increase',
        description: `Surprime de ${riskAssessment.recommendedPremiumAdjustment.toFixed(1)}%`,
        value: riskAssessment.recommendedPremiumAdjustment,
        duration: '12 mois',
        mandatory: true
      });
    }

    if (riskAssessment.additionalConditions.length > 0) {
      riskAssessment.additionalConditions.forEach(condition => {
        conditions.push({
          type: 'monitoring_period',
          description: condition,
          duration: '6 mois',
          mandatory: false
        });
      });
    }

    return conditions;
  }

  private static generateBusinessCase(situation: ClientSituation, insurer: InsurerProfile): string {
    const potentialValue = situation.personalContext?.income_stability === 'stable' ? 1200 : 800;
    return `Client avec potentiel de CA annuel de ${potentialValue}€. Profil ${situation.personalContext?.reliability_indicators?.join(', ') || 'standard'} avec engagement long terme.`;
  }

  private static generateRiskMitigation(riskAssessment: RiskAssessment, insurer: InsurerProfile): string[] {
    return [
      ...riskAssessment.mitigatingElements.map(me => me.description),
      `Suivi personnalisé selon processus ${insurer.name}`,
      'Documentation complète et vérifiable',
      'Engagement écrit du client'
    ];
  }

  private static generateAlternatives(insurer: InsurerProfile, situation: ClientSituation): string[] {
    return [
      'Attendre la régularisation naturelle de la situation',
      'Rechercher un assureur spécialisé',
      'Envisager une assurance temporaire',
      'Négocier des conditions particulières'
    ];
  }

  private static calculateSimilarity(situation: ClientSituation, example: any): number {
    // Simulation de calcul de similarité
    let similarity = 50;

    // Vérifier les circonstances similaires
    const exampleCircumstances = example.situation.toLowerCase();
    situation.circumstances.forEach(circumstance => {
      if (exampleCircumstances.includes(circumstance.type.replace('_', ' '))) {
        similarity += 20;
      }
    });

    return Math.min(100, similarity);
  }

  // Méthodes CRUD
  static saveDerogationRequest(request: DerogationRequest): void {
    const requests = this.getAllDerogationRequests();
    const existingIndex = requests.findIndex(r => r.id === request.id);
    
    if (existingIndex >= 0) {
      requests[existingIndex] = { ...request, updatedAt: new Date().toISOString() };
    } else {
      requests.push(request);
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(requests));
    }
  }

  static getAllDerogationRequests(): DerogationRequest[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getDerogationRequestById(id: string): DerogationRequest | null {
    const requests = this.getAllDerogationRequests();
    return requests.find(r => r.id === id) || null;
  }

  static getDerogationRequestsByInterlocutor(interlocutorId: string): DerogationRequest[] {
    const requests = this.getAllDerogationRequests();
    return requests.filter(r => r.interlocutorId === interlocutorId);
  }
}
