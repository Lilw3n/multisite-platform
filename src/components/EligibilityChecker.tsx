'use client';

import React, { useState, useEffect } from 'react';
import { Interlocutor, Driver, Vehicle, Claim } from '@/types/interlocutor';
import { EligibilityService, EligibilityResult, EvaluationData } from '@/lib/eligibilityService';
import { useClientSide } from '@/hooks/useClientSide';

interface EligibilityCheckerProps {
  interlocutor: Interlocutor;
  drivers?: Driver[];
  vehicles?: Vehicle[];
  claims?: Claim[];
}

export default function EligibilityChecker({ 
  interlocutor, 
  drivers = [], 
  vehicles = [], 
  claims = [] 
}: EligibilityCheckerProps) {
  const isClient = useClientSide();
  const [eligibilityData, setEligibilityData] = useState<EvaluationData | null>(null);
  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Données de test pour la démonstration
  const [formData, setFormData] = useState({
    bonusMalus: 1.0,
    licenseDate: '2018-01-01',
    antecedentsMonths: 24,
    antecedentsType: 'VTC' as 'VTC' | 'Taxi' | 'Particulier'
  });

  useEffect(() => {
    if (interlocutor) {
      const evaluationData: EvaluationData = {
        interlocutor,
        driver: drivers[0], // Prendre le premier conducteur
        vehicle: vehicles[0], // Prendre le premier véhicule
        claims,
        bonusMalus: formData.bonusMalus,
        licenseDate: formData.licenseDate,
        antecedentsMonths: formData.antecedentsMonths,
        antecedentsType: formData.antecedentsType
      };
      setEligibilityData(evaluationData);
    }
  }, [interlocutor, drivers, vehicles, claims, formData]);

  const checkEligibility = async () => {
    if (!eligibilityData) return;
    
    setIsLoading(true);
    try {
      const report = EligibilityService.generateEligibilityReport(eligibilityData);
      setResults(report.results);
    } catch (error) {
      console.error('Erreur lors de la vérification d\'éligibilité:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEligibilityIcon = (eligible: boolean) => {
    return eligible ? '✅' : '❌';
  };

  // Ne pas rendre le composant côté serveur pour éviter les erreurs d'hydratation
  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-xl">🎯</span>
            Vérificateur d'Éligibilité Assurance
          </h3>
        </div>
        <div className="p-4">
          <div className="text-center py-8 text-gray-500">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-xl">🎯</span>
            Vérificateur d'Éligibilité Assurance
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            {showDetails ? 'Masquer' : 'Configurer'}
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Configuration des données */}
        {showDetails && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4">Données d'évaluation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonus-Malus
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="3.0"
                  value={formData.bonusMalus}
                  onChange={(e) => setFormData(prev => ({ ...prev, bonusMalus: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'obtention du permis
                </label>
                <input
                  type="date"
                  value={formData.licenseDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Antécédents (mois)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.antecedentsMonths}
                  onChange={(e) => setFormData(prev => ({ ...prev, antecedentsMonths: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'antécédents
                </label>
                <select
                  value={formData.antecedentsType}
                  onChange={(e) => setFormData(prev => ({ ...prev, antecedentsType: e.target.value as 'VTC' | 'Taxi' | 'Particulier' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="VTC">VTC</option>
                  <option value="Taxi">Taxi</option>
                  <option value="Particulier">Particulier</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bouton de vérification */}
        <div className="mb-4">
          <button
            onClick={checkEligibility}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-md font-medium flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Vérification en cours...
              </>
            ) : (
              <>
                <span className="mr-2">🔍</span>
                Vérifier l'éligibilité
              </>
            )}
          </button>
        </div>

        {/* Résultats */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Résultats d'éligibilité</h4>
              <p className="text-sm text-gray-600">
                {results.filter(r => r.eligible).length} produit(s) éligible(s) sur {results.length}
              </p>
            </div>

            {results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getEligibilityIcon(result.eligible)}</span>
                    <h5 className="text-lg font-medium text-gray-900">{result.product}</h5>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.score)}`}>
                    Score: {result.score}%
                  </div>
                </div>

                {/* Raisons */}
                <div className="space-y-2">
                  {result.reasons.map((reason, reasonIndex) => (
                    <div key={reasonIndex} className="text-sm text-gray-700">
                      {reason}
                    </div>
                  ))}
                </div>

                {/* Avertissements */}
                {result.warnings.length > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="text-sm text-yellow-800">
                      <strong>⚠️ Avertissements:</strong>
                      <ul className="mt-1 list-disc list-inside">
                        {result.warnings.map((warning, warningIndex) => (
                          <li key={warningIndex}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Informations manquantes */}
                {result.missingInfo.length > 0 && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                    <div className="text-sm text-red-800">
                      <strong>❌ Informations manquantes:</strong>
                      <ul className="mt-1 list-disc list-inside">
                        {result.missingInfo.map((info, infoIndex) => (
                          <li key={infoIndex}>{info}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message d'aide */}
        {results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-lg font-medium">Vérificateur d'éligibilité prêt</p>
            <p className="text-sm">Configurez les données et cliquez sur "Vérifier l'éligibilité"</p>
          </div>
        )}
      </div>
    </div>
  );
}
