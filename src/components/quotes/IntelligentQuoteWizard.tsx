'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { IntelligentQuoteService } from '@/lib/intelligentQuoteService';
import InterlocutorSelector from '@/components/InterlocutorSelector';
import VehicleSelector from '@/components/VehicleSelector';
import CompanySelector from '@/components/CompanySelector';
import { 
  IntelligentQuoteSession, 
  QuestionnaireStep, 
  Question, 
  InsuranceType,
  AIRecommendation 
} from '@/types/intelligentQuote';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Shield,
  Brain,
  Zap,
  Star,
  Users,
  Calculator,
  FileText,
  Send,
  X
} from 'lucide-react';

interface IntelligentQuoteWizardProps {
  sessionId?: string;
  interlocutorId?: string;
  onComplete?: (session: IntelligentQuoteSession) => void;
  onCancel?: () => void;
}

export default function IntelligentQuoteWizard({ 
  sessionId, 
  interlocutorId, 
  onComplete, 
  onCancel 
}: IntelligentQuoteWizardProps) {
  const [session, setSession] = useState<IntelligentQuoteSession | null>(null);
  const [steps, setSteps] = useState<QuestionnaireStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [eligibilityScore, setEligibilityScore] = useState<number>(0);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [selectedInterlocutor, setSelectedInterlocutor] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  useEffect(() => {
    initializeSession();
  }, [sessionId, interlocutorId]);

  useEffect(() => {
    if (session) {
      updateSteps();
    }
  }, [session?.id, updateSteps]); // Utiliser la fonction useCallback

  useEffect(() => {
    if (session) {
      analyzeInRealTime();
    }
  }, [session?.id, analyzeInRealTime]); // Utiliser la fonction useCallback

  const initializeSession = () => {
    let currentSession: IntelligentQuoteSession;
    
    if (sessionId) {
      const existing = IntelligentQuoteService.getSession(sessionId);
      if (existing) {
        currentSession = existing;
        // Charger les réponses existantes et l'interlocuteur
        const existingAnswers: Record<string, any> = {};
        // Extraire les données de l'interlocuteur si disponibles
        if (existing.sessionData.interlocutor.personalInfo.firstName) {
          existingAnswers.first_name = existing.sessionData.interlocutor.personalInfo.firstName;
          existingAnswers.last_name = existing.sessionData.interlocutor.personalInfo.lastName;
          existingAnswers.email = existing.sessionData.interlocutor.personalInfo.email;
          existingAnswers.phone = existing.sessionData.interlocutor.personalInfo.phone;
        }
        setAnswers(existingAnswers);
      } else {
        currentSession = IntelligentQuoteService.createSession(interlocutorId);
      }
    } else {
      currentSession = IntelligentQuoteService.createSession(interlocutorId || selectedInterlocutor?.id);
    }
    
    setSession(currentSession);
  };

  const updateSteps = useCallback(() => {
    if (!session) return;
    
    const insuranceType = answers.primary_type as InsuranceType || 'auto';
    
    // Éviter la mise à jour si le type d'assurance n'a pas changé
    if (session.insuranceType === insuranceType && steps.length > 0) {
      return;
    }
    
    const questionnaire = IntelligentQuoteService.getAdaptiveQuestionnaire(
      insuranceType, 
      session.sessionData
    );
    
    setSteps(questionnaire);
    
    // Mettre à jour la session seulement si nécessaire
    if (session.insuranceType !== insuranceType || session.totalSteps !== questionnaire.length) {
      const updatedSession = {
        ...session,
        totalSteps: questionnaire.length,
        progress: Math.round((currentStepIndex / questionnaire.length) * 100),
        insuranceType
      };
      
      setSession(updatedSession);
      IntelligentQuoteService.saveSession(updatedSession);
    }
  }, [session, answers.primary_type, steps.length, currentStepIndex]);

  const analyzeInRealTime = useCallback(() => {
    if (!session || Object.keys(answers).length === 0) return;
    
    try {
      // Mettre à jour les données de session avec les réponses
      const updatedSessionData = {
        ...session.sessionData,
        // Mapper les réponses de base vers la structure de données
        interlocutor: {
          ...session.sessionData.interlocutor,
          personalInfo: {
            ...session.sessionData.interlocutor.personalInfo,
            firstName: answers.first_name || session.sessionData.interlocutor.personalInfo.firstName,
            lastName: answers.last_name || session.sessionData.interlocutor.personalInfo.lastName,
            email: answers.email || session.sessionData.interlocutor.personalInfo.email,
            phone: answers.phone || session.sessionData.interlocutor.personalInfo.phone,
            dateOfBirth: answers.date_of_birth || session.sessionData.interlocutor.personalInfo.dateOfBirth,
          },
          address: {
            ...session.sessionData.interlocutor.address,
            street: answers.street || session.sessionData.interlocutor.address.street,
            city: answers.city || session.sessionData.interlocutor.address.city,
            postalCode: answers.postal_code || session.sessionData.interlocutor.address.postalCode,
          }
        },
        insuranceData: {
          ...session.sessionData.insuranceData,
          primaryType: answers.primary_type || session.sessionData.insuranceData.primaryType,
          needs: {
            ...session.sessionData.insuranceData.needs,
            budget: {
              ...session.sessionData.insuranceData.needs.budget,
              preferred: answers.budget_range || session.sessionData.insuranceData.needs.budget.preferred,
            },
            timeline: {
              ...session.sessionData.insuranceData.needs.timeline,
              urgency: answers.urgency || session.sessionData.insuranceData.needs.timeline.urgency,
            }
          }
        }
      };
      
      // Analyser l'éligibilité seulement si on a des données pertinentes
      if (answers.date_of_birth || answers.budget_range || answers.primary_type) {
        const eligibility = IntelligentQuoteService.analyzeEligibility(updatedSessionData);
        setEligibilityScore(eligibility.overallScore);
        
        // Générer des recommandations IA
        const aiRecommendations = IntelligentQuoteService.generateAIRecommendations(updatedSessionData);
        setRecommendations(aiRecommendations);
      }
    } catch (error) {
      console.error('Erreur analyse temps réel:', error);
    }
  }, [session, answers]);

  const handleAnswerChange = (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Supprimer l'erreur si elle existe
    if (errors[questionId]) {
      const newErrors = { ...errors };
      delete newErrors[questionId];
      setErrors(newErrors);
    }
  };

  const validateCurrentStep = (): boolean => {
    if (!steps[currentStepIndex]) return true;
    
    const currentStep = steps[currentStepIndex];
    const stepErrors: Record<string, string> = {};
    
    // Validation spéciale pour l'étape interlocuteur
    if (currentStepIndex === 0 && currentStep.id === 'interlocutor_basic') {
      if (!selectedInterlocutor && (!answers.first_name || !answers.last_name || !answers.email)) {
        stepErrors['interlocutor'] = 'Veuillez sélectionner un interlocuteur existant ou remplir les informations de base';
      }
    }
    
    currentStep.questions.forEach(question => {
      if (question.required && !answers[question.id]) {
        stepErrors[question.id] = 'Ce champ est requis';
      }
      
      if (question.validation && answers[question.id]) {
        const value = answers[question.id];
        const validation = question.validation;
        
        if (validation.min && value < validation.min) {
          stepErrors[question.id] = `Valeur minimale: ${validation.min}`;
        }
        
        if (validation.max && value > validation.max) {
          stepErrors[question.id] = `Valeur maximale: ${validation.max}`;
        }
        
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
          stepErrors[question.id] = validation.message || 'Format invalide';
        }
      }
    });
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = async () => {
    if (!session) return;
    
    setIsLoading(true);
    
    try {
      // Finaliser la session
      const completedSession = {
        ...session,
        status: 'completed' as const,
        progress: 100
      };
      
      IntelligentQuoteService.saveSession(completedSession);
      
      // Simuler l'analyse finale et génération de devis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onComplete?.(completedSession);
    } catch (error) {
      console.error('Erreur finalisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const value = answers[question.id];
    const error = errors[question.id];
    
    const baseClasses = `w-full p-3 border rounded-lg transition-colors ${
      error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    } focus:ring-2 focus:outline-none`;

    switch (question.type) {
      case 'text':
        return (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              className={baseClasses}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleAnswerChange(question.id, parseFloat(e.target.value) || 0)}
              placeholder={question.placeholder}
              min={question.validation?.min}
              max={question.validation?.max}
              className={baseClasses}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className={baseClasses}
            >
              <option value="">Sélectionnez une option</option>
              {question.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={question.id} className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {question.options?.map(option => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                    value === option.value 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="mt-1 mr-3 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{option.label}</span>
                      {option.recommended && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          Recommandé
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={question.id} className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {question.options?.map(option => (
                <label
                  key={option.value}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={(value || []).includes(option.value)}
                    onChange={(e) => {
                      const currentValues = value || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v: string) => v !== option.value);
                      handleAnswerChange(question.id, newValues);
                    }}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={value || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className={baseClasses}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'range':
        return (
          <div key={question.id} className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min={question.validation?.min || 0}
                max={question.validation?.max || 100}
                value={value || question.validation?.min || 0}
                onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{question.validation?.min || 0}€</span>
                <span className="font-medium text-blue-600">{value || question.validation?.min || 0}€</span>
                <span>{question.validation?.max || 100}€</span>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (!session || steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation du questionnaire intelligent...</p>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full">
      {/* Header avec progression */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <span>Assistant Devis Intelligent</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Questionnaire adaptatif avec analyse IA en temps réel
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Score d'éligibilité */}
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  eligibilityScore >= 80 ? 'text-green-600' : 
                  eligibilityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {eligibilityScore}%
                </div>
                <p className="text-sm text-gray-600">Score d'éligibilité</p>
              </div>
              
              {/* Bouton fermer */}
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Fermer"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Étape {currentStepIndex + 1} sur {steps.length}</span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Recommandations IA */}
        {recommendations.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 font-medium"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Insights IA ({recommendations.length})</span>
              <ArrowRight className={`h-4 w-4 transform transition-transform ${showAIInsights ? 'rotate-90' : ''}`} />
            </button>
            
            {showAIInsights && (
              <div className="mt-3 space-y-2">
                {recommendations.slice(0, 2).map(rec => (
                  <div key={rec.id} className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{rec.title}</h4>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                        {rec.potentialSavings && (
                          <p className="text-sm text-green-600 font-medium mt-1">
                            💰 Économie potentielle: {rec.potentialSavings}€/an
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {rec.confidence}% sûr
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenu de l'étape actuelle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentStep.title}
            </h2>
            {currentStep.description && (
              <p className="text-gray-600">{currentStep.description}</p>
            )}
          </div>

          <div className="space-y-6">
            {/* Sélection d'interlocuteur pour la première étape */}
            {currentStepIndex === 0 && currentStep.id === 'interlocutor_basic' && (
              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Client / Interlocuteur *
                </label>
                <InterlocutorSelector
                  selectedInterlocutor={selectedInterlocutor}
                  onSelect={(interlocutor) => {
                    setSelectedInterlocutor(interlocutor);
                    // Pré-remplir les champs avec les données de l'interlocuteur
                    const newAnswers = {
                      ...answers,
                      first_name: interlocutor.contactPerson?.split(' ')[0] || '',
                      last_name: interlocutor.contactPerson?.split(' ').slice(1).join(' ') || '',
                      email: interlocutor.email || '',
                      phone: interlocutor.phone || ''
                    };
                    setAnswers(newAnswers);
                  }}
                  onClear={() => {
                    setSelectedInterlocutor(null);
                    // Vider les champs pré-remplis
                    const newAnswers = { ...answers };
                    delete newAnswers.first_name;
                    delete newAnswers.last_name;
                    delete newAnswers.email;
                    delete newAnswers.phone;
                    setAnswers(newAnswers);
                  }}
                  placeholder="Rechercher un client existant ou créer un nouveau..."
                  required={true}
                  userRole="admin"
                />
                {errors['interlocutor'] && (
                  <p className="text-sm text-red-600">{errors['interlocutor']}</p>
                )}
              </div>
            )}

            {/* Sélection de véhicule pour les étapes véhicule */}
            {(currentStep.id === 'vehicle_info' || currentStep.id === 'auto_specific') && (
              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Véhicule à assurer *
                </label>
                <VehicleSelector
                  selectedVehicle={selectedVehicle}
                  onSelect={(vehicle) => {
                    setSelectedVehicle(vehicle);
                    // Pré-remplir les champs avec les données du véhicule
                    const newAnswers = {
                      ...answers,
                      vehicle_brand: vehicle.brand,
                      vehicle_model: vehicle.model,
                      vehicle_registration: vehicle.registration,
                      vehicle_power: vehicle.enginePower,
                      vehicle_fuel: vehicle.fuelType,
                      first_registration: vehicle.firstRegistrationDate,
                      vehicle_value: vehicle.currentArgusValue
                    };
                    setAnswers(newAnswers);
                  }}
                  onClear={() => {
                    setSelectedVehicle(null);
                    // Vider les champs pré-remplis
                    const newAnswers = { ...answers };
                    delete newAnswers.vehicle_brand;
                    delete newAnswers.vehicle_model;
                    delete newAnswers.vehicle_registration;
                    delete newAnswers.vehicle_power;
                    delete newAnswers.vehicle_fuel;
                    delete newAnswers.first_registration;
                    delete newAnswers.vehicle_value;
                    setAnswers(newAnswers);
                  }}
                  subscriberName={selectedInterlocutor?.contactPerson || answers.first_name + ' ' + answers.last_name}
                  subscriberSiret={selectedCompany?.siret}
                  placeholder="Rechercher par plaque d'immatriculation..."
                  required={true}
                  showTechnicalDetails={true}
                />
              </div>
            )}

            {/* Sélection d'entreprise pour les étapes entreprise */}
            {(currentStep.id === 'company_info' || currentStep.id === 'professional_info') && (
              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Entreprise (optionnel pour particuliers)
                </label>
                <CompanySelector
                  selectedCompany={selectedCompany}
                  onSelect={(company) => {
                    setSelectedCompany(company);
                    // Pré-remplir les champs avec les données de l'entreprise
                    const newAnswers = {
                      ...answers,
                      company_name: company.legalName,
                      company_siret: company.siret,
                      company_activity: company.mainActivity,
                      company_address: `${company.address.street}, ${company.address.postalCode} ${company.address.city}`,
                      legal_form: company.legalForm
                    };
                    setAnswers(newAnswers);
                  }}
                  onClear={() => {
                    setSelectedCompany(null);
                    // Vider les champs pré-remplis
                    const newAnswers = { ...answers };
                    delete newAnswers.company_name;
                    delete newAnswers.company_siret;
                    delete newAnswers.company_activity;
                    delete newAnswers.company_address;
                    delete newAnswers.legal_form;
                    setAnswers(newAnswers);
                  }}
                  subscriberName={selectedInterlocutor?.contactPerson || answers.first_name + ' ' + answers.last_name}
                  placeholder="Rechercher par SIRET, SIREN ou nom d'entreprise..."
                  required={false}
                  showDetails={true}
                  allowManualCreation={true}
                />
              </div>
            )}
            
            {currentStep.questions.map(question => renderQuestion(question))}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={currentStepIndex === 0 ? onCancel : handlePrevious}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{currentStepIndex === 0 ? 'Annuler' : 'Précédent'}</span>
          </button>

          <div className="flex items-center space-x-3">
            {/* Indicateur d'étapes */}
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index < currentStepIndex ? 'bg-green-500' :
                    index === currentStepIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyse en cours...</span>
                </>
              ) : currentStepIndex === steps.length - 1 ? (
                <>
                  <Calculator className="h-4 w-4" />
                  <span>Générer les devis</span>
                </>
              ) : (
                <>
                  <span>Suivant</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar avec informations contextuelles */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-green-900">Sécurisé</h3>
          </div>
          <p className="text-sm text-green-700">
            Vos données sont chiffrées et protégées selon les normes RGPD
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Instantané</h3>
          </div>
          <p className="text-sm text-blue-700">
            Devis générés en temps réel avec les meilleurs tarifs du marché
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-5 w-5 text-purple-600" />
            <h3 className="font-medium text-purple-900">Expert</h3>
          </div>
          <p className="text-sm text-purple-700">
            Conseils personnalisés basés sur 10+ ans d'expérience courtage
          </p>
        </div>
      </div>
    </div>
  );
}
