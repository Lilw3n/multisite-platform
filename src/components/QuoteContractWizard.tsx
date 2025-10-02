'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertTriangle, User, Car, Shield, CreditCard, FileText, Bot } from 'lucide-react';
import InterlocutorSelector from './InterlocutorSelector';
import { EligibilityService } from '@/lib/eligibilityService';

interface WizardProps {
  type: 'quote' | 'contract';
  onComplete: (data: any) => void;
  onCancel: () => void;
  userRole?: 'admin' | 'internal' | 'external';
}

interface WizardData {
  // Étape 1: Interlocuteur
  interlocutor: any | null;
  
  // Étape 2: Véhicule
  vehicle: {
    id?: string;
    registration: string;
    brand: string;
    model: string;
    year: number;
    energy: string;
    newPrice: number;
    argusValue: number;
    isExisting: boolean;
  } | null;
  
  // Étape 3: Conducteur
  driver: {
    id?: string;
    firstName: string;
    lastName: string;
    age: number;
    licenseDate: string;
    licenseNumber: string;
    professionalExperience: number;
    totalExperience: number;
    isExisting: boolean;
  } | null;
  
  // Étape 4: Antécédents et sinistralité
  claims: Array<{
    id?: string;
    date: string;
    type: string;
    amount: number;
    responsible: boolean;
    percentage: number;
    insurer: string;
    description: string;
  }>;
  
  // Étape 5: Périodes d'assurance
  insurancePeriods: Array<{
    id?: string;
    startDate: string;
    endDate: string;
    company: string;
    policyNumber: string;
    premium: number;
    crmCoefficient: number;
    status: string;
  }>;
  
  // Étape 6: Coordonnées bancaires
  bankDetails: {
    id?: string;
    accountHolder: string;
    iban: string;
    bic: string;
    bankName: string;
    accountType: string;
    isExisting: boolean;
  } | null;
  
  // Étape 7: Produit et tarification
  product: {
    name: string;
    coverage: string[];
    premium: number;
    frequency: 'Mensuel' | 'Trimestriel' | 'Annuel';
    formula: string;
  } | null;
}

const STEPS = [
  { id: 1, title: 'Interlocuteur', icon: User, description: 'Client ou prospect' },
  { id: 2, title: 'Véhicule', icon: Car, description: 'Informations du véhicule' },
  { id: 3, title: 'Conducteur', icon: User, description: 'Profil du conducteur' },
  { id: 4, title: 'Antécédents', icon: AlertTriangle, description: 'Sinistres et réclamations' },
  { id: 5, title: 'Assurance', icon: Shield, description: 'Périodes d\'assurance' },
  { id: 6, title: 'Coordonnées', icon: CreditCard, description: 'Informations bancaires' },
  { id: 7, title: 'Produit', icon: FileText, description: 'Sélection et tarification' }
];

export default function QuoteContractWizard({ type, onComplete, onCancel, userRole = 'admin' }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    interlocutor: null,
    vehicle: null,
    driver: null,
    claims: [],
    insurancePeriods: [],
    bankDetails: null,
    product: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [eligibilityResults, setEligibilityResults] = useState<any[]>([]);
  const [showDataReuse, setShowDataReuse] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);

  // Charger les données existantes quand un interlocuteur est sélectionné
  useEffect(() => {
    if (wizardData.interlocutor && currentStep > 1) {
      loadExistingData(wizardData.interlocutor.id);
    }
  }, [wizardData.interlocutor, currentStep]);

  const loadExistingData = async (interlocutorId: string) => {
    setIsLoading(true);
    try {
      // Simuler le chargement des données existantes
      const mockExistingData = {
        vehicles: [
          {
            id: '1',
            registration: 'AB-123-CD',
            brand: 'Renault',
            model: 'Trafic',
            year: 2020,
            energy: 'Diesel',
            newPrice: 35000,
            argusValue: 28000
          }
        ],
        drivers: [
          {
            id: '1',
            firstName: wizardData.interlocutor?.name?.split(' ')[0] || '',
            lastName: wizardData.interlocutor?.name?.split(' ').slice(1).join(' ') || '',
            age: 35,
            licenseDate: '2005-03-15',
            licenseNumber: '123456789',
            professionalExperience: 24,
            totalExperience: 180
          }
        ],
        claims: [
          {
            id: '1',
            date: '2023-06-15',
            type: 'materialRC50',
            amount: 1500,
            responsible: false,
            percentage: 50,
            insurer: 'AXA',
            description: 'Collision en stationnement'
          }
        ],
        insurancePeriods: [
          {
            id: '1',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            company: 'AXA',
            policyNumber: 'AX123456',
            premium: 1200,
            crmCoefficient: 0.95,
            status: 'Actif'
          }
        ],
        bankDetails: [
          {
            id: '1',
            accountHolder: wizardData.interlocutor?.name || '',
            iban: 'FR76 1234 5678 9012 3456 7890 123',
            bic: 'BNPAFRPPXXX',
            bankName: 'BNP Paribas',
            accountType: 'Compte courant'
          }
        ]
      };
      
      setExistingData(mockExistingData);
      setShowDataReuse(true);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReuseData = (dataType: string, item: any) => {
    switch (dataType) {
      case 'vehicle':
        setWizardData(prev => ({
          ...prev,
          vehicle: { ...item, isExisting: true }
        }));
        break;
      case 'driver':
        setWizardData(prev => ({
          ...prev,
          driver: { ...item, isExisting: true }
        }));
        break;
      case 'bankDetails':
        setWizardData(prev => ({
          ...prev,
          bankDetails: { ...item, isExisting: true }
        }));
        break;
      case 'claims':
        setWizardData(prev => ({
          ...prev,
          claims: [...prev.claims, item]
        }));
        break;
      case 'insurancePeriods':
        setWizardData(prev => ({
          ...prev,
          insurancePeriods: [...prev.insurancePeriods, item]
        }));
        break;
    }
    setShowDataReuse(false);
  };

  const runEligibilityCheck = async () => {
    if (!wizardData.driver || !wizardData.vehicle) return;

    setIsLoading(true);
    try {
      const evaluationData = {
        driver: wizardData.driver,
        vehicle: wizardData.vehicle,
        claims: wizardData.claims,
        insurancePeriods: wizardData.insurancePeriods
      };

      const results = await EligibilityService.evaluateEligibility(evaluationData);
      setEligibilityResults(results);
    } catch (error) {
      console.error('Erreur lors de l\'évaluation d\'éligibilité:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      
      // Lancer l'évaluation d'éligibilité à l'étape produit
      if (currentStep === 6) {
        runEligibilityCheck();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return wizardData.interlocutor !== null;
      case 2: return wizardData.vehicle !== null;
      case 3: return wizardData.driver !== null;
      case 4: return true; // Antécédents optionnels
      case 5: return true; // Périodes optionnelles
      case 6: return wizardData.bankDetails !== null;
      case 7: return wizardData.product !== null;
      default: return false;
    }
  };

  const handleComplete = () => {
    onComplete({
      type,
      data: wizardData,
      eligibilityResults
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionner le client
              </h3>
              <p className="text-gray-600">
                Choisissez un interlocuteur existant ou créez-en un nouveau
              </p>
            </div>
            <InterlocutorSelector
              selectedInterlocutor={wizardData.interlocutor}
              onSelect={(interlocutor) => setWizardData(prev => ({ ...prev, interlocutor }))}
              onClear={() => setWizardData(prev => ({ ...prev, interlocutor: null }))}
              userRole={userRole}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Informations du véhicule
              </h3>
              <p className="text-gray-600">
                Renseignez les détails du véhicule à assurer
              </p>
            </div>

            {/* Suggestion de réutilisation */}
            {existingData?.vehicles?.length > 0 && !wizardData.vehicle && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Bot className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900">
                      Véhicules existants trouvés
                    </h4>
                    <div className="mt-2 space-y-2">
                      {existingData.vehicles.map((vehicle: any) => (
                        <div key={vehicle.id} className="flex items-center justify-between bg-white rounded p-3">
                          <div>
                            <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                            <span className="text-gray-500 ml-2">({vehicle.registration})</span>
                          </div>
                          <button
                            onClick={() => handleReuseData('vehicle', vehicle)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Utiliser
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formulaire véhicule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Immatriculation *
                </label>
                <input
                  type="text"
                  value={wizardData.vehicle?.registration || ''}
                  onChange={(e) => setWizardData(prev => ({
                    ...prev,
                    vehicle: { ...prev.vehicle, registration: e.target.value, isExisting: false } as any
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AB-123-CD"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque *
                </label>
                <input
                  type="text"
                  value={wizardData.vehicle?.brand || ''}
                  onChange={(e) => setWizardData(prev => ({
                    ...prev,
                    vehicle: { ...prev.vehicle, brand: e.target.value, isExisting: false } as any
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Renault"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle *
                </label>
                <input
                  type="text"
                  value={wizardData.vehicle?.model || ''}
                  onChange={(e) => setWizardData(prev => ({
                    ...prev,
                    vehicle: { ...prev.vehicle, model: e.target.value, isExisting: false } as any
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Trafic"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année *
                </label>
                <input
                  type="number"
                  value={wizardData.vehicle?.year || ''}
                  onChange={(e) => setWizardData(prev => ({
                    ...prev,
                    vehicle: { ...prev.vehicle, year: parseInt(e.target.value), isExisting: false } as any
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Énergie *
                </label>
                <select
                  value={wizardData.vehicle?.energy || ''}
                  onChange={(e) => setWizardData(prev => ({
                    ...prev,
                    vehicle: { ...prev.vehicle, energy: e.target.value, isExisting: false } as any
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Électrique">Électrique</option>
                  <option value="Hybride">Hybride</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix neuf (€)
                </label>
                <input
                  type="number"
                  value={wizardData.vehicle?.newPrice || ''}
                  onChange={(e) => setWizardData(prev => ({
                    ...prev,
                    vehicle: { ...prev.vehicle, newPrice: parseInt(e.target.value), isExisting: false } as any
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="35000"
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélection du produit
              </h3>
              <p className="text-gray-600">
                Choisissez le produit d'assurance adapté
              </p>
            </div>

            {/* Résultats d'éligibilité */}
            {eligibilityResults.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Produits éligibles :</h4>
                {eligibilityResults.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      wizardData.product?.name === result.product
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setWizardData(prev => ({
                      ...prev,
                      product: {
                        name: result.product,
                        coverage: ['Responsabilité civile', 'Défense recours'],
                        premium: Math.round(Math.random() * 1000 + 500),
                        frequency: 'Mensuel',
                        formula: 'Standard'
                      }
                    }))}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{result.product}</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Éligibilité: {result.eligible ? '✅ Éligible' : '❌ Non éligible'}
                        </p>
                        {result.reasons && (
                          <p className="text-xs text-gray-500 mt-1">{result.reasons}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {Math.round(Math.random() * 1000 + 500)}€
                        </div>
                        <div className="text-sm text-gray-500">par mois</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Étape {currentStep} en cours de développement...</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {type === 'quote' ? 'Nouveau devis' : 'Nouveau contrat'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {STEPS.map((step) => (
                <div key={step.id} className="text-xs text-center" style={{ width: '80px' }}>
                  <div className="font-medium text-gray-900">{step.title}</div>
                  <div className="text-gray-500">{step.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Annuler
            </button>
            
            {currentStep === STEPS.length ? (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4 mr-2" />
                {type === 'quote' ? 'Créer le devis' : 'Créer le contrat'}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
