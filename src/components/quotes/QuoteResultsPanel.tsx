'use client';

import React, { useState } from 'react';
import { 
  QuoteResults, 
  AIRecommendation, 
  EligibilityAnalysis 
} from '@/types/intelligentQuote';
import { 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Target, 
  Award, 
  Zap,
  FileText,
  Download,
  Share2,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface QuoteResultsPanelProps {
  results: QuoteResults;
  recommendations: AIRecommendation[];
  eligibilityAnalysis: EligibilityAnalysis;
  onSelectQuote?: (quoteId: string) => void;
  onContactClient?: () => void;
  onScheduleMeeting?: () => void;
}

export default function QuoteResultsPanel({
  results,
  recommendations,
  eligibilityAnalysis,
  onSelectQuote,
  onContactClient,
  onScheduleMeeting
}: QuoteResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<'quotes' | 'analysis' | 'recommendations'>('quotes');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleQuoteSelect = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    onSelectQuote?.(quoteId);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header avec score global */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Résultats de votre analyse
            </h2>
            <p className="text-gray-600">
              {results.quotes.length} devis générés • Analyse IA complète
            </p>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${getScoreColor(eligibilityAnalysis.overallScore)}`}>
              {getScoreIcon(eligibilityAnalysis.overallScore)}
              <span className="text-2xl font-bold">{eligibilityAnalysis.overallScore}%</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Score d'éligibilité</p>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'quotes', label: 'Devis', icon: FileText, count: results.quotes.length },
            { id: 'analysis', label: 'Analyse', icon: TrendingUp, count: eligibilityAnalysis.factors.length },
            { id: 'recommendations', label: 'Recommandations', icon: Lightbulb, count: recommendations.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des tabs */}
      <div className="p-6">
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            {/* Comparaison rapide */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Le moins cher', key: 'cheapest', icon: DollarSign, color: 'green' },
                { label: 'Meilleur rapport', key: 'bestValue', icon: Award, color: 'blue' },
                { label: 'Plus complet', key: 'mostComplete', icon: Shield, color: 'purple' },
                { label: 'Recommandé IA', key: 'recommended', icon: Star, color: 'yellow' }
              ].map(item => {
                const quote = results.quotes.find(q => q.id === results.comparison[item.key as keyof typeof results.comparison]);
                return (
                  <div key={item.key} className={`p-4 rounded-lg border-2 ${
                    item.color === 'green' ? 'border-green-200 bg-green-50' :
                    item.color === 'blue' ? 'border-blue-200 bg-blue-50' :
                    item.color === 'purple' ? 'border-purple-200 bg-purple-50' :
                    'border-yellow-200 bg-yellow-50'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <item.icon className={`h-5 w-5 ${
                        item.color === 'green' ? 'text-green-600' :
                        item.color === 'blue' ? 'text-blue-600' :
                        item.color === 'purple' ? 'text-purple-600' :
                        'text-yellow-600'
                      }`} />
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    {quote && (
                      <div>
                        <p className="font-semibold text-gray-900">{quote.insurer}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(quote.premium)}/an</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Liste détaillée des devis */}
            <div className="space-y-4">
              {results.quotes.map(quote => (
                <div
                  key={quote.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedQuoteId === quote.id 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleQuoteSelect(quote.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{quote.insurer}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">{quote.score}/100</span>
                        </div>
                        {quote.id === results.comparison.recommended && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Recommandé IA
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{quote.product}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">✅ Avantages</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {quote.advantages.slice(0, 3).map((advantage, index) => (
                              <li key={index}>• {advantage}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-600 mb-2">⚠️ Points d'attention</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {quote.disadvantages.slice(0, 3).map((disadvantage, index) => (
                              <li key={index}>• {disadvantage}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatCurrency(quote.premium)}
                      </div>
                      <p className="text-sm text-gray-600">par an</p>
                      <p className="text-xs text-gray-500 mt-1">
                        soit {formatCurrency(quote.premium / 12)}/mois
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Score global */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${getScoreColor(eligibilityAnalysis.overallScore)}`}>
                  {getScoreIcon(eligibilityAnalysis.overallScore)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Score d'éligibilité: {eligibilityAnalysis.overallScore}%
                  </h3>
                  <p className="text-gray-600">
                    {eligibilityAnalysis.overallScore >= 80 
                      ? 'Excellent profil ! Vous devriez obtenir les meilleurs tarifs.'
                      : eligibilityAnalysis.overallScore >= 60
                      ? 'Bon profil avec quelques optimisations possibles.'
                      : 'Profil à améliorer, mais des solutions existent.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Facteurs d'analyse */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Facteurs d'analyse</h3>
              <div className="space-y-3">
                {eligibilityAnalysis.factors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          factor.impact === 'positive' ? 'bg-green-500' :
                          factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                        }`}></div>
                        <h4 className="font-medium text-gray-900">{factor.name}</h4>
                        <span className="text-sm text-gray-500">Poids: {Math.round(factor.weight * 100)}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{factor.explanation}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        factor.score >= 70 ? 'text-green-600' :
                        factor.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {factor.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions d'amélioration */}
            {eligibilityAnalysis.improvementSuggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestions d'amélioration</h3>
                <div className="space-y-3">
                  {eligibilityAnalysis.improvementSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{suggestion.action}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>Impact: +{suggestion.impact}%</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            suggestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            suggestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {suggestion.difficulty === 'easy' ? 'Facile' :
                             suggestion.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Avertissements */}
            {eligibilityAnalysis.warnings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Points d'attention</h3>
                <div className="space-y-2">
                  {eligibilityAnalysis.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <p className="text-gray-700">{warning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {recommendations.map(rec => (
              <div key={rec.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      rec.type === 'product' ? 'bg-blue-100 text-blue-600' :
                      rec.type === 'optimization' ? 'bg-green-100 text-green-600' :
                      rec.type === 'cross_sell' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                      <p className="text-gray-600 mt-1">{rec.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Confiance IA</div>
                    <div className="text-lg font-bold text-blue-600">{rec.confidence}%</div>
                  </div>
                </div>

                {/* Bénéfices */}
                {(rec.potentialSavings || rec.potentialRevenue) && (
                  <div className="flex space-x-4 mb-4">
                    {rec.potentialSavings && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">Économie: {formatCurrency(rec.potentialSavings)}</span>
                      </div>
                    )}
                    {rec.potentialRevenue && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">Revenus: {formatCurrency(rec.potentialRevenue)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Raisonnement */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Analyse IA</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Facteurs clés:</span>
                      <span className="ml-2">{rec.reasoning.factors.join(', ')}</span>
                    </div>
                    {rec.reasoning.similarCases && (
                      <div>
                        <span className="font-medium">Basé sur:</span>
                        <span className="ml-2">{rec.reasoning.similarCases} cas similaires</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prochaines étapes */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prochaines étapes</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {rec.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 font-bold">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Analyse générée le {new Date().toLocaleDateString('fr-FR')}</span>
          <span>•</span>
          <span>Valide 30 jours</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            <Download className="h-4 w-4" />
            <span>Télécharger PDF</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Partager</span>
          </button>
          
          <button 
            onClick={onContactClient}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>Contacter le client</span>
          </button>
          
          <button 
            onClick={onScheduleMeeting}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span>Planifier RDV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
