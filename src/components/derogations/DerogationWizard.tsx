'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Heart,
  Lightbulb,
  Target,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Minus,
  Eye,
  Download,
  Send,
  RefreshCw
} from 'lucide-react';

import { DerogationService } from '@/lib/derogationService';
import {
  DerogationRequest,
  DerogationProposal,
  ClientSituation,
  InsuranceRequirement,
  RequirementGap,
  HumanFactor,
  Circumstance,
  MitigatingFactor
} from '@/types/derogations';

interface DerogationWizardProps {
  interlocutorId: string;
  requirement: InsuranceRequirement;
  currentSituation: any;
  onComplete: (request: DerogationRequest) => void;
  onCancel: () => void;
}

export default function DerogationWizard({
  interlocutorId,
  requirement,
  currentSituation,
  onComplete,
  onCancel
}: DerogationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [clientSituation, setClientSituation] = useState<ClientSituation>({
    actualValue: currentSituation,
    timeline: [],
    circumstances: [],
    mitigatingFactors: [],
    previousInsurance: [],
    claimsHistory: [],
    personalContext: {
      profession: '',
      income_stability: 'stable',
      family_situation: '',
      health_status: 'good',
      financial_situation: 'comfortable',
      reliability_indicators: []
    }
  });
  
  const [gap, setGap] = useState<RequirementGap>({
    shortfall: requirement.standardValue - currentSituation,
    percentage: ((requirement.standardValue - currentSituation) / requirement.standardValue) * 100,
    severity: 'moderate',
    timeToCompliance: '',
    alternativeSolutions: []
  });

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [proposals, setProposals] = useState<DerogationProposal[]>([]);
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);

  const steps = [
    { id: 'situation', title: 'Situation Actuelle', icon: FileText },
    { id: 'circumstances', title: 'Circonstances', icon: Heart },
    { id: 'analysis', title: 'Analyse IA', icon: Brain },
    { id: 'proposals', title: 'Propositions', icon: Target },
    { id: 'review', title: 'Validation', icon: CheckCircle }
  ];

  useEffect(() => {
    if (currentStep === 2 && !aiAnalysis) {
      performAIAnalysis();
    }
  }, [currentStep]);

  const performAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis = DerogationService.analyzeClientSituation(clientSituation, requirement);
    setAiAnalysis(analysis);
    
    const generatedProposals = DerogationService.generateDerogationProposals(
      clientSituation,
      requirement,
      gap,
      analysis
    );
    setProposals(generatedProposals);
    
    setIsAnalyzing(false);
  };

  const addCircumstance = () => {
    const newCircumstance: Circumstance = {
      type: 'vehicle_sale',
      description: '',
      date: new Date().toISOString().split('T')[0],
      impact: '',
      documentation: [],
      verified: false
    };
    
    setClientSituation(prev => ({
      ...prev,
      circumstances: [...prev.circumstances, newCircumstance]
    }));
  };

  const updateCircumstance = (index: number, field: keyof Circumstance, value: any) => {
    setClientSituation(prev => ({
      ...prev,
      circumstances: prev.circumstances.map((c, i) => 
        i === index ? { ...c, [field]: value } : c
      )
    }));
  };

  const addMitigatingFactor = () => {
    const newFactor: MitigatingFactor = {
      factor: '',
      description: '',
      strength: 'moderate',
      relevance: 50,
      supportingEvidence: []
    };
    
    setClientSituation(prev => ({
      ...prev,
      mitigatingFactors: [...prev.mitigatingFactors, newFactor]
    }));
  };

  const updateMitigatingFactor = (index: number, field: keyof MitigatingFactor, value: any) => {
    setClientSituation(prev => ({
      ...prev,
      mitigatingFactors: prev.mitigatingFactors.map((f, i) => 
        i === index ? { ...f, [field]: value } : f
      )
    }));
  };

  const getStepIcon = (step: any, index: number) => {
    const Icon = step.icon;
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;
    
    return (
      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
        isActive ? 'bg-blue-600 text-white' :
        isCompleted ? 'bg-green-600 text-white' :
        'bg-gray-200 text-gray-600'
      }`}>
        {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </div>
    );
  };

  const renderSituationStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">📋 Exigence Standard</h3>
        <p className="text-blue-800">{requirement.description}</p>
        <p className="text-sm text-blue-600 mt-2">
          <strong>Valeur requise:</strong> {requirement.standardValue}
        </p>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-900 mb-2">⚠️ Situation Actuelle</h3>
        <p className="text-orange-800">
          <strong>Valeur actuelle:</strong> {currentSituation}
        </p>
        <p className="text-orange-800">
          <strong>Écart:</strong> {gap.shortfall} ({gap.percentage.toFixed(1)}%)
        </p>
        <p className="text-sm text-orange-600 mt-2">
          <strong>Sévérité:</strong> {gap.severity}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Temps estimé pour atteindre la conformité
        </label>
        <input
          type="text"
          value={gap.timeToCompliance}
          onChange={(e) => setGap(prev => ({ ...prev, timeToCompliance: e.target.value }))}
          placeholder="Ex: Dans 2 mois, Jamais possible, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-3">👤 Contexte Personnel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
            <input
              type="text"
              value={clientSituation.personalContext.profession}
              onChange={(e) => setClientSituation(prev => ({
                ...prev,
                personalContext: { ...prev.personalContext, profession: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stabilité revenus</label>
            <select
              value={clientSituation.personalContext.income_stability}
              onChange={(e) => setClientSituation(prev => ({
                ...prev,
                personalContext: { ...prev.personalContext, income_stability: e.target.value as any }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="stable">Stable</option>
              <option value="variable">Variable</option>
              <option value="unstable">Instable</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Situation familiale</label>
            <input
              type="text"
              value={clientSituation.personalContext.family_situation}
              onChange={(e) => setClientSituation(prev => ({
                ...prev,
                personalContext: { ...prev.personalContext, family_situation: e.target.value }
              }))}
              placeholder="Ex: Célibataire, Marié 2 enfants, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Situation financière</label>
            <select
              value={clientSituation.personalContext.financial_situation}
              onChange={(e) => setClientSituation(prev => ({
                ...prev,
                personalContext: { ...prev.personalContext, financial_situation: e.target.value as any }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="comfortable">Confortable</option>
              <option value="tight">Serrée</option>
              <option value="difficult">Difficile</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCircumstancesStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">🔍 Circonstances Particulières</h3>
        <button
          onClick={addCircumstance}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter</span>
        </button>
      </div>

      {clientSituation.circumstances.map((circumstance, index) => (
        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Circonstance #{index + 1}</h4>
            <button
              onClick={() => setClientSituation(prev => ({
                ...prev,
                circumstances: prev.circumstances.filter((_, i) => i !== index)
              }))}
              className="text-red-600 hover:text-red-700"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={circumstance.type}
                onChange={(e) => updateCircumstance(index, 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="vehicle_sale">🚗 Vente véhicule</option>
                <option value="accident_non_responsible">💥 Accident non responsable</option>
                <option value="job_loss">💼 Perte emploi</option>
                <option value="relocation">📦 Déménagement</option>
                <option value="health_issue">🏥 Problème santé</option>
                <option value="family_emergency">👨‍👩‍👧‍👦 Urgence familiale</option>
                <option value="natural_disaster">🌪️ Catastrophe naturelle</option>
                <option value="insurer_bankruptcy">🏢 Faillite assureur</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={circumstance.date}
                onChange={(e) => updateCircumstance(index, 'date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée</label>
            <textarea
              value={circumstance.description}
              onChange={(e) => updateCircumstance(index, 'description', e.target.value)}
              rows={3}
              placeholder="Décrivez précisément la situation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Impact sur la situation</label>
            <input
              type="text"
              value={circumstance.impact}
              onChange={(e) => updateCircumstance(index, 'impact', e.target.value)}
              placeholder="Ex: Impossibilité de maintenir l'assurance"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">💪 Facteurs Atténuants</h3>
          <button
            onClick={addMitigatingFactor}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter</span>
          </button>
        </div>

        {clientSituation.mitigatingFactors.map((factor, index) => (
          <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-green-900">Facteur #{index + 1}</h4>
              <button
                onClick={() => setClientSituation(prev => ({
                  ...prev,
                  mitigatingFactors: prev.mitigatingFactors.filter((_, i) => i !== index)
                }))}
                className="text-red-600 hover:text-red-700"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Facteur</label>
                <input
                  type="text"
                  value={factor.factor}
                  onChange={(e) => updateMitigatingFactor(index, 'factor', e.target.value)}
                  placeholder="Ex: Bon conducteur depuis 10 ans"
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Force</label>
                <select
                  value={factor.strength}
                  onChange={(e) => updateMitigatingFactor(index, 'strength', e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="weak">Faible</option>
                  <option value="moderate">Modérée</option>
                  <option value="strong">Forte</option>
                  <option value="very_strong">Très forte</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-green-700 mb-1">Description</label>
              <textarea
                value={factor.description}
                onChange={(e) => updateMitigatingFactor(index, 'description', e.target.value)}
                rows={2}
                placeholder="Expliquez comment cela atténue la situation..."
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-green-700 mb-1">
                Pertinence ({factor.relevance}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={factor.relevance}
                onChange={(e) => updateMitigatingFactor(index, 'relevance', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalysisStep = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">🧠 Analyse IA en cours...</h3>
          <p className="text-gray-600 text-center">
            Notre intelligence artificielle analyse votre situation et identifie les meilleures stratégies de dérogation
          </p>
        </div>
      );
    }

    if (!aiAnalysis) return null;

    return (
      <div className="space-y-6">
        {/* Score de légitimité */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-medium text-purple-900">Score de Légitimité IA</h3>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    aiAnalysis.legitimacyScore > 80 ? 'bg-green-500' :
                    aiAnalysis.legitimacyScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${aiAnalysis.legitimacyScore}%` }}
                ></div>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {aiAnalysis.legitimacyScore}%
            </div>
          </div>
          
          <p className="text-sm text-purple-700 mt-2">
            {aiAnalysis.legitimacyScore > 80 ? '🎯 Excellente légitimité - Forte probabilité d\'acceptation' :
             aiAnalysis.legitimacyScore > 60 ? '⚖️ Légitimité correcte - Négociation possible' :
             '⚠️ Légitimité faible - Conditions strictes nécessaires'}
          </p>
        </div>

        {/* Facteurs humains */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-medium text-green-900">Facteurs Humains Identifiés</h3>
          </div>
          
          <div className="space-y-3">
            {aiAnalysis.humanFactors.map((factor: HumanFactor, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded border">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  factor.legitimacy > 80 ? 'bg-green-500' :
                  factor.legitimacy > 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-green-900">{factor.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-green-700">
                    <span>Impact: {factor.impact}</span>
                    <span>Légitimité: {factor.legitimacy}%</span>
                    <span>Vérifiable: {factor.verifiable ? '✅' : '❌'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Évaluation des risques */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-medium text-orange-900">Évaluation des Risques</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-orange-700 mb-2">Risque Global</p>
              <div className={`px-3 py-2 rounded-full text-center font-medium ${
                aiAnalysis.riskAssessment.overallRisk === 'low' ? 'bg-green-100 text-green-800' :
                aiAnalysis.riskAssessment.overallRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {aiAnalysis.riskAssessment.overallRisk === 'low' ? '🟢 Faible' :
                 aiAnalysis.riskAssessment.overallRisk === 'medium' ? '🟡 Moyen' : '🔴 Élevé'}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-orange-700 mb-2">Surprime Recommandée</p>
              <div className="px-3 py-2 bg-white rounded border text-center font-medium">
                {aiAnalysis.riskAssessment.recommendedPremiumAdjustment.toFixed(1)}%
              </div>
            </div>
          </div>
          
          {aiAnalysis.riskAssessment.additionalConditions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-orange-700 mb-2">Conditions Supplémentaires</p>
              <ul className="space-y-1">
                {aiAnalysis.riskAssessment.additionalConditions.map((condition: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-orange-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Stratégie recommandée */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-medium text-blue-900">Stratégie Recommandée</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium text-blue-900">Approche: {aiAnalysis.recommendedStrategy.approach}</p>
              <p className="text-sm text-blue-700 mt-1">{aiAnalysis.recommendedStrategy.reasoning}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Probabilité de Succès</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${aiAnalysis.recommendedStrategy.successProbability}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {aiAnalysis.recommendedStrategy.successProbability}%
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Délai Estimé</p>
                <p className="text-sm text-blue-800">{aiAnalysis.recommendedStrategy.timeline}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-blue-700 mb-2">Arguments Clés</p>
              <ul className="space-y-1">
                {aiAnalysis.recommendedStrategy.keyArguments.map((argument: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-blue-800">
                    <Lightbulb className="h-4 w-4 mt-0.5 text-blue-600" />
                    <span>{argument}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProposalsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          🎯 Propositions de Dérogation Générées
        </h3>
        <p className="text-gray-600">
          {proposals.length} propositions personnalisées basées sur l'analyse IA
        </p>
      </div>

      <div className="space-y-4">
        {proposals.map((proposal, index) => (
          <div 
            key={proposal.id}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedProposals.includes(proposal.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              if (selectedProposals.includes(proposal.id)) {
                setSelectedProposals(prev => prev.filter(id => id !== proposal.id));
              } else {
                setSelectedProposals(prev => [...prev, proposal.id]);
              }
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedProposals.includes(proposal.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{proposal.insurer.name}</h4>
                  <p className="text-sm text-gray-600">{proposal.type}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  proposal.successProbability > 80 ? 'bg-green-100 text-green-800' :
                  proposal.successProbability > 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {proposal.successProbability}% succès
                </div>
                <p className="text-xs text-gray-500 mt-1">{proposal.expectedTimeline}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-4">{proposal.description}</p>
            
            {proposal.conditions.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Conditions:</p>
                <ul className="space-y-1">
                  {proposal.conditions.map((condition, condIndex) => (
                    <li key={condIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>{condition.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Arguments Clés:</p>
                  <ul className="space-y-1">
                    {proposal.justification.keyArguments.slice(0, 2).map((arg, argIndex) => (
                      <li key={argIndex} className="text-gray-600">• {arg}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700 mb-1">Facteurs Humains:</p>
                  <ul className="space-y-1">
                    {proposal.justification.humanFactors.slice(0, 2).map((factor, factorIndex) => (
                      <li key={factorIndex} className="text-gray-600">• {factor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedProposals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Sélectionnez au moins une proposition pour continuer</p>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          ✅ Validation de la Demande
        </h3>
        <p className="text-gray-600">
          Vérifiez les informations avant soumission
        </p>
      </div>

      {/* Résumé de la situation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">📋 Résumé de la Situation</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Exigence:</p>
            <p className="text-gray-600">{requirement.description}</p>
          </div>
          
          <div>
            <p className="font-medium text-gray-700">Écart:</p>
            <p className="text-gray-600">{gap.shortfall} ({gap.percentage.toFixed(1)}%)</p>
          </div>
          
          <div>
            <p className="font-medium text-gray-700">Circonstances:</p>
            <p className="text-gray-600">{clientSituation.circumstances.length} identifiées</p>
          </div>
          
          <div>
            <p className="font-medium text-gray-700">Score IA:</p>
            <p className="text-gray-600">{aiAnalysis?.legitimacyScore}% légitimité</p>
          </div>
        </div>
      </div>

      {/* Propositions sélectionnées */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-4">🎯 Propositions Sélectionnées</h4>
        
        <div className="space-y-3">
          {proposals
            .filter(p => selectedProposals.includes(p.id))
            .map((proposal, index) => (
              <div key={proposal.id} className="bg-white border border-blue-200 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-blue-900">{proposal.insurer.name}</h5>
                  <span className="text-sm text-blue-600">{proposal.successProbability}% succès</span>
                </div>
                <p className="text-sm text-blue-700">{proposal.description}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Actions finales */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-medium text-green-900 mb-4">🚀 Prochaines Étapes</h4>
        
        <ul className="space-y-2 text-sm text-green-800">
          <li className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Génération automatique des dossiers de dérogation</span>
          </li>
          <li className="flex items-center space-x-2">
            <Send className="h-4 w-4" />
            <span>Envoi aux assureurs sélectionnés</span>
          </li>
          <li className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Suivi automatique des réponses</span>
          </li>
          <li className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Notification des décisions</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Situation
        return gap.timeToCompliance.trim() !== '' && clientSituation.personalContext.profession.trim() !== '';
      case 1: // Circonstances
        return clientSituation.circumstances.length > 0;
      case 2: // Analyse
        return aiAnalysis !== null;
      case 3: // Propositions
        return selectedProposals.length > 0;
      case 4: // Review
        return true;
      default:
        return false;
    }
  };

  const handleComplete = () => {
    const request: DerogationRequest = {
      id: `derogation_${Date.now()}`,
      interlocutorId,
      context: {
        originalRequirement: requirement,
        currentSituation: clientSituation,
        gap,
        urgency: gap.severity === 'major' ? 'critical' : 
                gap.severity === 'significant' ? 'high' : 'medium',
        businessValue: 1000 // À calculer selon la logique métier
      },
      aiAnalysis: {
        humanFactors: aiAnalysis.humanFactors,
        legitimacyScore: aiAnalysis.legitimacyScore,
        riskAssessment: aiAnalysis.riskAssessment,
        similarCases: [],
        recommendedApproach: aiAnalysis.recommendedStrategy
      },
      proposedDerogations: proposals.filter(p => selectedProposals.includes(p.id)),
      status: 'proposals_generated',
      insurerResponses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current_user',
      priority: gap.severity === 'major' ? 'urgent' : 'normal'
    };

    DerogationService.saveDerogationRequest(request);
    onComplete(request);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              🧠 Assistant Dérogations Intelligent
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {getStepIcon(step, index)}
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-center">
            <h3 className="font-medium text-gray-900">{steps[currentStep].title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 0 && renderSituationStep()}
          {currentStep === 1 && renderCircumstancesStep()}
          {currentStep === 2 && renderAnalysisStep()}
          {currentStep === 3 && renderProposalsStep()}
          {currentStep === 4 && renderReviewStep()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Précédent</span>
          </button>

          <div className="text-sm text-gray-500">
            Étape {currentStep + 1} sur {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNext()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Suivant</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceedToNext()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              <span>Soumettre Demandes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
