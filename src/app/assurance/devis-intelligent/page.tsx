'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LeadAnalysisService } from '@/lib/leadAnalysisService';
import { 
  LeadAnalysisSession, 
  FeasibilityAnalysis, 
  LeadQualification 
} from '@/types/leadAnalysis';
import { 
  Brain, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Phone, 
  Mail, 
  Calendar,
  ArrowLeft,
  Sparkles,
  Target,
  Award,
  Zap
} from 'lucide-react';

// Réutiliser le composant IntelligentQuoteWizard mais adapté pour les leads
import IntelligentQuoteWizard from '@/components/quotes/IntelligentQuoteWizard';

export default function DevisIntelligentPage() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'questionnaire' | 'results'>('intro');
  const [session, setSession] = useState<LeadAnalysisSession | null>(null);
  const [feasibilityAnalysis, setFeasibilityAnalysis] = useState<FeasibilityAnalysis | null>(null);
  const [leadQualification, setLeadQualification] = useState<LeadQualification | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleStartAnalysis = () => {
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = async (quoteSession: any) => {
    setIsAnalyzing(true);
    
    try {
      // Convertir la session de devis en session d'analyse de lead
      const leadSession: LeadAnalysisSession = {
        id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionData: {
          clientProfile: {
            personalInfo: {
              firstName: quoteSession.sessionData.interlocutor.personalInfo.firstName,
              lastName: quoteSession.sessionData.interlocutor.personalInfo.lastName,
              email: quoteSession.sessionData.interlocutor.personalInfo.email,
              phone: quoteSession.sessionData.interlocutor.personalInfo.phone,
              dateOfBirth: quoteSession.sessionData.interlocutor.personalInfo.dateOfBirth,
              age: quoteSession.sessionData.interlocutor.personalInfo.dateOfBirth 
                ? new Date().getFullYear() - new Date(quoteSession.sessionData.interlocutor.personalInfo.dateOfBirth).getFullYear()
                : undefined,
              profession: quoteSession.sessionData.interlocutor.personalInfo.profession,
              income: quoteSession.sessionData.interlocutor.personalInfo.income,
            },
            location: {
              street: quoteSession.sessionData.interlocutor.address.street,
              city: quoteSession.sessionData.interlocutor.address.city,
              postalCode: quoteSession.sessionData.interlocutor.address.postalCode,
              country: quoteSession.sessionData.interlocutor.address.country,
            }
          },
          needs: {
            primaryInsurance: quoteSession.sessionData.insuranceData.primaryType,
            specificNeeds: {},
            coverageLevel: 'standard',
            priorityGuarantees: [],
            optionalGuarantees: []
          },
          constraints: {
            budget: {
              min: quoteSession.sessionData.insuranceData.needs.budget.min,
              max: quoteSession.sessionData.insuranceData.needs.budget.max,
              preferred: quoteSession.sessionData.insuranceData.needs.budget.preferred,
              flexibility: 'moderate'
            },
            timeline: {
              urgency: quoteSession.sessionData.insuranceData.needs.timeline.urgency,
            },
            preferences: {
              deductible: quoteSession.sessionData.insuranceData.needs.preferences.deductible,
              paymentFrequency: quoteSession.sessionData.insuranceData.needs.preferences.paymentFrequency,
              digitalServices: quoteSession.sessionData.insuranceData.needs.preferences.digitalServices,
              personalAgent: quoteSession.sessionData.insuranceData.needs.preferences.personalAgent,
              communicationChannel: 'email'
            },
            exclusions: [],
            specialConstraints: []
          },
          context: {
            leadSource: 'website',
            insuranceHistory: {
              previousClaims: [],
            },
            contactHistory: [],
            notes: '',
            specialSituations: []
          }
        },
        currentStep: 0,
        totalSteps: 0,
        progress: 100,
        feasibilityAnalysis: {
          overallFeasibility: 0,
          insurerAnalysis: [],
          recommendations: [],
          alerts: []
        },
        leadQualification: {
          qualificationScore: 0,
          leadCategory: 'cold',
          conversionProbability: 0,
          qualificationFactors: [],
          revenueEstimate: {
            commission: 0,
            confidence: 0,
            timeframe: 'medium_term'
          },
          recommendedActions: [],
          anticipatedObjections: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'analyzed'
      };

      // Analyser la faisabilité
      const feasibility = LeadAnalysisService.analyzeFeasibility(leadSession);
      
      // Qualifier le lead
      const qualification = LeadAnalysisService.qualifyLead(leadSession, feasibility);
      
      // Créer une notification pour l'équipe
      const notification = LeadAnalysisService.createTeamNotification(leadSession, qualification);
      
      // Mettre à jour la session
      leadSession.feasibilityAnalysis = feasibility;
      leadSession.leadQualification = qualification;
      
      // Sauvegarder
      LeadAnalysisService.saveSession(leadSession);
      
      setSession(leadSession);
      setFeasibilityAnalysis(feasibility);
      setLeadQualification(qualification);
      setCurrentStep('results');
      
    } catch (error) {
      console.error('Erreur analyse lead:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBackToStart = () => {
    setCurrentStep('intro');
    setSession(null);
    setFeasibilityAnalysis(null);
    setLeadQualification(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6" />;
    if (score >= 60) return <AlertTriangle className="h-6 w-6" />;
    return <AlertTriangle className="h-6 w-6" />;
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-4 border-blue-300 border-t-white rounded-full animate-spin mx-auto"></div>
            <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Analyse IA en cours...</h2>
          <p className="text-xl text-blue-200 mb-4">
            Notre intelligence artificielle analyse votre profil
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-300">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span>Vérification des conditions de souscription</span>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Brain className="h-8 w-8 text-yellow-400" />
              <span className="text-xl font-semibold">Assistant IA DiddyHome</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Votre Analyse <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Intelligente</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Notre IA va analyser votre profil en temps réel pour déterminer votre éligibilité 
              et vous proposer les meilleures solutions d'assurance adaptées à vos besoins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Target className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Analyse Personnalisée</h3>
              <p className="text-blue-200">
                Questionnaire intelligent qui s'adapte à vos réponses pour une analyse précise
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Shield className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Éligibilité Instantanée</h3>
              <p className="text-blue-200">
                Vérification en temps réel de votre éligibilité auprès de nos assureurs partenaires
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Award className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Solutions Optimales</h3>
              <p className="text-blue-200">
                Recommandations personnalisées pour obtenir la meilleure couverture au meilleur prix
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartAnalysis}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-12 py-6 rounded-full text-xl transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-3 mx-auto"
            >
              <Zap className="h-8 w-8" />
              <span>Démarrer mon analyse gratuite</span>
            </button>
            
            <p className="text-blue-300 mt-6 text-sm">
              ✅ 100% Gratuit • ✅ Sans engagement • ✅ Résultat immédiat • ✅ Données sécurisées
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'questionnaire') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={handleBackToStart}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
          
          <IntelligentQuoteWizard
            onComplete={handleQuestionnaireComplete}
            onCancel={handleBackToStart}
          />
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && feasibilityAnalysis && leadQualification && session) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Résultats de votre analyse IA
                </h1>
                <p className="text-gray-600">
                  Analyse complète de votre profil et recommandations personnalisées
                </p>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full border-2 ${getScoreColor(feasibilityAnalysis.overallFeasibility)}`}>
                  {getScoreIcon(feasibilityAnalysis.overallFeasibility)}
                  <span className="text-3xl font-bold">{feasibilityAnalysis.overallFeasibility}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Score de faisabilité</p>
              </div>
            </div>
          </div>

          {/* Résultats par assureur */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analyse par nos partenaires assureurs</h2>
            
            <div className="space-y-6">
              {feasibilityAnalysis.insurerAnalysis.map((analysis, index) => (
                <div key={index} className={`border-2 rounded-xl p-6 ${
                  analysis.acceptanceLevel === 'accepted' ? 'border-green-200 bg-green-50' :
                  analysis.acceptanceLevel === 'conditional' ? 'border-yellow-200 bg-yellow-50' :
                  analysis.acceptanceLevel === 'needs_review' ? 'border-blue-200 bg-blue-50' :
                  'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{analysis.insurerName}</h3>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        analysis.acceptanceLevel === 'accepted' ? 'bg-green-100 text-green-800' :
                        analysis.acceptanceLevel === 'conditional' ? 'bg-yellow-100 text-yellow-800' :
                        analysis.acceptanceLevel === 'needs_review' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {analysis.acceptanceLevel === 'accepted' ? '✅ Accepté' :
                         analysis.acceptanceLevel === 'conditional' ? '⚠️ Conditionnel' :
                         analysis.acceptanceLevel === 'needs_review' ? '🔍 À étudier' :
                         '❌ Non éligible'}
                      </span>
                      <span className="text-lg font-bold text-gray-900">{analysis.feasibilityScore}%</span>
                    </div>
                  </div>
                  
                  {analysis.priceEstimate && (
                    <div className="mb-4 p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-2">Estimation tarifaire</h4>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-blue-600">
                          {analysis.priceEstimate.min}€ - {analysis.priceEstimate.max}€
                        </span>
                        <span className="text-sm text-gray-600">par an</span>
                        <span className="text-sm text-gray-500">
                          (Confiance: {analysis.priceEstimate.confidence}%)
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.metConditions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">✅ Conditions respectées</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {analysis.metConditions.slice(0, 3).map((condition, i) => (
                            <li key={i}>• {condition.condition}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.obstacles.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">⚠️ Points d'attention</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {analysis.obstacles.slice(0, 3).map((obstacle, i) => (
                            <li key={i}>• {obstacle.description}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommandations */}
          {feasibilityAnalysis.recommendations.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos recommandations</h2>
              
              <div className="space-y-4">
                {feasibilityAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{rec.description}</h4>
                      <p className="text-sm text-gray-600 mb-2">{rec.expectedImpact}</p>
                      <p className="text-sm text-blue-700 font-medium">{rec.actionRequired}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Qualification du lead */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Prochaines étapes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre profil</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Catégorie de profil</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      leadQualification.leadCategory === 'hot' ? 'bg-red-100 text-red-800' :
                      leadQualification.leadCategory === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {leadQualification.leadCategory === 'hot' ? '🔥 Prioritaire' :
                       leadQualification.leadCategory === 'warm' ? '⭐ Qualifié' :
                       '📋 Standard'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Probabilité de souscription</span>
                    <span className="font-bold text-green-600">{leadQualification.conversionProbability}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Commission estimée</span>
                    <span className="font-bold text-blue-600">{leadQualification.revenueEstimate.commission}€</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions recommandées</h3>
                <div className="space-y-3">
                  {leadQualification.recommendedActions.slice(0, 3).map((action, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {action.action === 'immediate_call' ? '📞 Appel immédiat' :
                           action.action === 'schedule_meeting' ? '📅 Rendez-vous' :
                           action.action === 'email_follow_up' ? '📧 Suivi email' :
                           action.action === 'send_documentation' ? '📄 Documentation' :
                           '📋 Suivi'}
                        </span>
                        <span className="text-sm text-gray-600">{action.timing}</span>
                      </div>
                      <p className="text-sm text-gray-700">{action.expectedOutcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg text-white p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Un conseiller va vous contacter</h2>
              <p className="text-blue-100 mb-6">
                Votre analyse a été transmise à notre équipe. Un expert va vous recontacter 
                dans les {leadQualification.leadCategory === 'hot' ? '2 heures' : '24 heures'} 
                pour finaliser votre dossier.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>06 95 82 08 66</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>contact@diddyhome.com</span>
                </div>
              </div>
              
              <button
                onClick={handleBackToStart}
                className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Nouvelle analyse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
