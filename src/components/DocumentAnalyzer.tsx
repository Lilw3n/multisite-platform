'use client';

import React, { useState } from 'react';
import { GeminiDocumentService, DocumentAnalysisResult } from '@/lib/geminiDocumentService';

interface DocumentAnalyzerProps {
  onAnalysisComplete: (result: DocumentAnalysisResult) => void;
  documentType: 'bank_details' | 'vehicle_info' | 'driver_info' | 'contract_info' | 'claim_info';
  className?: string;
}

export default function DocumentAnalyzer({ 
  onAnalysisComplete, 
  documentType, 
  className = '' 
}: DocumentAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAnalyze = async () => {
    if (!documentUrl.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await GeminiDocumentService.analyzeDocument(documentUrl, documentType);
      onAnalysisComplete(result);
      
      if (result.success) {
        setDocumentUrl('');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      onAnalysisComplete({
        success: false,
        error: 'Erreur lors de l\'analyse du document'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const types = {
      bank_details: 'Coordonnées bancaires',
      vehicle_info: 'Informations véhicule',
      driver_info: 'Informations conducteur',
      contract_info: 'Informations contrat',
      claim_info: 'Informations sinistre'
    };
    return types[type] || type;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <span className="text-lg">🤖</span>
          <span>Analyser un document {getDocumentTypeLabel(documentType)}</span>
        </button>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Analyse automatique de document
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL du document Google Drive
              </label>
              <input
                type="url"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isAnalyzing}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !documentUrl.trim()}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyse en cours...
                  </span>
                ) : (
                  'Analyser le document'
                )}
              </button>
              
              <button
                onClick={() => {
                  setShowForm(false);
                  setDocumentUrl('');
                }}
                disabled={isAnalyzing}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            <p>💡 L'IA va analyser le document et suggérer des mises à jour que vous pourrez valider.</p>
          </div>
        </div>
      )}
    </div>
  );
}
