'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  User, 
  Car, 
  TrendingUp,
  TrendingDown,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  Settings,
  Filter,
  Search,
  BarChart3,
  Target
} from 'lucide-react';
import { IntelligentAlertsService } from '@/lib/intelligentAlertsService';
import { IntelligentAlert, EligibilityCalculationResult, ClaimAging } from '@/types/intelligentAlerts';

interface IntelligentAlertsPanelProps {
  interlocutorId?: string;
  showAll?: boolean;
  maxItems?: number;
}

export default function IntelligentAlertsPanel({
  interlocutorId,
  showAll = false,
  maxItems = 10
}: IntelligentAlertsPanelProps) {
  const [alerts, setAlerts] = useState<IntelligentAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<IntelligentAlert | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEligibilityDetails, setShowEligibilityDetails] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityCalculationResult | null>(null);

  useEffect(() => {
    loadAlerts();
    // Initialiser les conditions par défaut
    IntelligentAlertsService.initializeDefaultConditions();
  }, [interlocutorId]);

  const loadAlerts = () => {
    let allAlerts = showAll 
      ? IntelligentAlertsService.getAllAlerts()
      : interlocutorId 
        ? IntelligentAlertsService.getAlertsByInterlocutor(interlocutorId)
        : IntelligentAlertsService.getPendingAlerts();

    // Filtrage
    if (filterStatus !== 'all') {
      allAlerts = allAlerts.filter(alert => alert.status === filterStatus);
    }
    if (filterPriority !== 'all') {
      allAlerts = allAlerts.filter(alert => alert.priority === filterPriority);
    }
    if (searchTerm) {
      allAlerts = allAlerts.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri par priorité et date
    allAlerts.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setAlerts(allAlerts.slice(0, maxItems));
  };

  const handleTestEligibility = () => {
    // Données de test pour démonstration
    const testData = {
      id: 'test_interlocutor',
      driver: {
        age: 20, // Trop jeune
        experienceMonths: 35, // Pas assez d'expérience
        licenseDate: '2021-12-01',
        birthDate: '2004-01-15'
      },
      claims: [
        { id: '1', date: '2023-06-15', type: 'Collision', amount: 2500, interlocutorId: 'test' },
        { id: '2', date: '2023-01-10', type: 'Vol', amount: 8000, interlocutorId: 'test' },
        { id: '3', date: '2022-08-20', type: 'Bris de glace', amount: 300, interlocutorId: 'test' },
        { id: '4', date: '2022-03-05', type: 'Accident', amount: 4500, interlocutorId: 'test' }
      ]
    };

    const result = IntelligentAlertsService.calculateEligibility(testData, 'auto');
    setEligibilityResult(result);
    setShowEligibilityDetails(true);
    
    // Recharger les alertes pour voir les nouvelles
    setTimeout(() => loadAlerts(), 500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAlert = (alert: IntelligentAlert) => (
    <div
      key={alert.id}
      onClick={() => setSelectedAlert(alert)}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority)}`}>
            {alert.type === 'eligibility_pending' && <AlertTriangle className="h-5 w-5" />}
            {alert.type === 'condition_expiring' && <Clock className="h-5 w-5" />}
            {alert.type === 'follow_up_required' && <Phone className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{alert.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Créé: {formatDate(alert.createdAt)}</span>
              </span>
              {alert.expectedResolutionDate && (
                <span className="flex items-center space-x-1">
                  <Target className="h-3 w-3" />
                  <span>Résolution prévue: {formatDate(alert.expectedResolutionDate)}</span>
                </span>
              )}
            </div>

            {alert.gap && (
              <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                <p className="text-xs text-blue-800">
                  <strong>Écart:</strong> {typeof alert.gap === 'object' ? JSON.stringify(alert.gap) : alert.gap}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
            {alert.status}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPriorityColor(alert.priority)}`}>
            {alert.priority}
          </span>
        </div>
      </div>

      {alert.scheduledActions.length > 0 && (
        <div className="mt-3 border-t pt-3">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Actions programmées:</h5>
          <div className="space-y-1">
            {alert.scheduledActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center space-x-1">
                  {action.type === 'reminder' && <Bell className="h-3 w-3" />}
                  {action.type === 'recheck' && <Eye className="h-3 w-3" />}
                  <span>{action.type}</span>
                </span>
                <span>{formatDate(action.scheduledDate)}</span>
                {action.executed && <CheckCircle className="h-3 w-3 text-green-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderEligibilityDetails = () => {
    if (!eligibilityResult) return null;

    return (
      <div className="space-y-6">
        {/* Score global */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Résultat d'éligibilité</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${eligibilityResult.isEligible ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${eligibilityResult.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                {eligibilityResult.isEligible ? 'Éligible' : 'Non éligible'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{eligibilityResult.eligibilityScore}%</div>
              <div className="text-sm text-gray-500">Score d'éligibilité</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                eligibilityResult.riskLevel === 'low' ? 'text-green-600' :
                eligibilityResult.riskLevel === 'medium' ? 'text-yellow-600' :
                eligibilityResult.riskLevel === 'high' ? 'text-orange-600' : 'text-red-600'
              }`}>
                {eligibilityResult.riskLevel.toUpperCase()}
              </div>
              <div className="text-sm text-gray-500">Niveau de risque</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {eligibilityResult.claimsAnalysis.activeClaims}
              </div>
              <div className="text-sm text-gray-500">Sinistres actifs</div>
            </div>
          </div>
        </div>

        {/* Détail des conditions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Détail des conditions</h4>
          <div className="space-y-3">
            {eligibilityResult.conditionResults.map((condition, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  {condition.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <span className="font-medium">{condition.name}</span>
                    <div className="text-sm text-gray-600">
                      Valeur actuelle: {condition.currentValue} | Requis: {condition.requiredValue}
                      {condition.gap && ` | Écart: ${condition.gap}`}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  condition.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {condition.passed ? 'OK' : 'KO'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Analyse des sinistres */}
        {eligibilityResult.claimsAnalysis.totalClaims > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-4">Analyse des sinistres</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {eligibilityResult.claimsAnalysis.totalClaims}
                </div>
                <div className="text-sm text-gray-500">Total sinistres</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">
                  {eligibilityResult.claimsAnalysis.activeClaims}
                </div>
                <div className="text-sm text-gray-500">Actifs (36 mois)</div>
              </div>
            </div>
            {eligibilityResult.claimsAnalysis.nextExpirationDate && (
              <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">
                  <strong>Prochaine expiration:</strong> {formatDate(eligibilityResult.claimsAnalysis.nextExpirationDate)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Prédictions */}
        {eligibilityResult.predictions.willBecomeEligible && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-4">Prédictions d'éligibilité</h4>
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-green-600 font-medium">Éligibilité future prévue</span>
            </div>
            {eligibilityResult.predictions.estimatedEligibilityDate && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Date estimée:</strong> {formatDate(eligibilityResult.predictions.estimatedEligibilityDate)}
              </p>
            )}
            <p className="text-sm text-gray-600 mb-3">
              <strong>Confiance:</strong> {eligibilityResult.predictions.confidenceLevel}%
            </p>
            {eligibilityResult.predictions.keyFactors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Facteurs clés:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {eligibilityResult.predictions.keyFactors.map((factor, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Recommandations */}
        {eligibilityResult.actionRecommendations.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-4">Recommandations d'action</h4>
            <div className="space-y-3">
              {eligibilityResult.actionRecommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
                  <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">{rec.description}</p>
                    <p className="text-sm text-blue-700">Impact estimé: {rec.estimatedImpact}</p>
                    {rec.deadline && (
                      <p className="text-xs text-blue-600">Échéance: {formatDate(rec.deadline)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Alertes Intelligentes
          {alerts.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
              {alerts.length}
            </span>
          )}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTestEligibility}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            🧪 Test Éligibilité
          </button>
          <button
            onClick={() => setShowEligibilityDetails(!showEligibilityDetails)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
          >
            {showEligibilityDetails ? 'Masquer' : 'Détails'}
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">Tous statuts</option>
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolues</option>
          </select>
        </div>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">Toutes priorités</option>
          <option value="critical">Critique</option>
          <option value="high">Haute</option>
          <option value="medium">Moyenne</option>
          <option value="low">Basse</option>
        </select>
        <div className="flex-1">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans les alertes..."
              className="w-full pl-10 pr-4 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          onClick={loadAlerts}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Actualiser
        </button>
      </div>

      {/* Détails d'éligibilité */}
      {showEligibilityDetails && renderEligibilityDetails()}

      {/* Liste des alertes */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune alerte pour le moment</p>
            <p className="text-sm">Testez le système d'éligibilité pour générer des alertes</p>
          </div>
        ) : (
          alerts.map(renderAlert)
        )}
      </div>

      {/* Modal détail alerte */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Détail de l'alerte</h2>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedAlert.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedAlert.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Statut:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAlert.status)}`}>
                      {selectedAlert.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Priorité:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedAlert.priority)}`}>
                      {selectedAlert.priority}
                    </span>
                  </div>
                </div>

                {selectedAlert.currentValue && (
                  <div className="p-4 bg-gray-50 rounded">
                    <h4 className="font-medium text-gray-900 mb-2">Valeurs</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Actuelle:</span>
                        <span className="ml-2 font-medium">{selectedAlert.currentValue}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Requise:</span>
                        <span className="ml-2 font-medium">{selectedAlert.requiredValue}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Fermer
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Marquer comme traité
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
