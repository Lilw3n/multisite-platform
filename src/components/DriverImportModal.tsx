'use client';

import { useState, useRef } from 'react';
import { useGeminiImport, ImportedDriverData } from '@/lib/geminiImport';

interface DriverImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: ImportedDriverData) => void;
}

export default function DriverImportModal({ isOpen, onClose, onImport }: DriverImportModalProps) {
  const [importMethod, setImportMethod] = useState<'pdf' | 'drive'>('pdf');
  const [isLoading, setIsLoading] = useState(false);
  const [importedData, setImportedData] = useState<ImportedDriverData | null>(null);
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[]; warnings: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { extractFromPDF, extractFromDrive, validateData } = useGeminiImport();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setImportedData(null);
    setValidation(null);

    try {
      let data: ImportedDriverData;
      
      if (importMethod === 'pdf') {
        data = await extractFromPDF(file);
      } else {
        // Pour l'instant, on simule l'import depuis Drive
        throw new Error('Import depuis Google Drive non encore implémenté');
      }

      setImportedData(data);
      const validationResult = validateData(data);
      setValidation(validationResult);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (importedData && validation?.isValid) {
      onImport(importedData);
      onClose();
    }
  };

  const handleClose = () => {
    setImportedData(null);
    setValidation(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🤖 Import Automatique de Chauffeur
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Sélection de méthode */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Méthode d'import</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setImportMethod('pdf')}
                className={`px-4 py-2 rounded-lg border-2 ${
                  importMethod === 'pdf'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                📄 Upload PDF
              </button>
              <button
                onClick={() => setImportMethod('drive')}
                className={`px-4 py-2 rounded-lg border-2 ${
                  importMethod === 'drive'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700'
                }`}
                disabled
              >
                ☁️ Google Drive (Bientôt)
              </button>
            </div>
          </div>

          {/* Upload de fichier */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Sélection du fichier</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block"
              >
                <div className="text-4xl mb-4">📁</div>
                <p className="text-lg text-gray-600 mb-2">
                  Cliquez pour sélectionner un fichier PDF
                </p>
                <p className="text-sm text-gray-500">
                  ou glissez-déposez le fichier ici
                </p>
              </label>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Analyse du document en cours...</p>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="text-red-400 text-xl mr-3">⚠️</div>
                <div>
                  <h4 className="text-red-800 font-semibold">Erreur d'import</h4>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Aperçu des données */}
          {importedData && validation && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Aperçu des données extraites</h3>
              
              {/* Validation */}
              <div className="mb-4">
                {validation.isValid ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex">
                      <div className="text-green-400 text-xl mr-3">✅</div>
                      <div>
                        <h4 className="text-green-800 font-semibold">Données valides</h4>
                        <p className="text-green-700">Toutes les informations requises ont été extraites</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex">
                      <div className="text-red-400 text-xl mr-3">❌</div>
                      <div>
                        <h4 className="text-red-800 font-semibold">Données incomplètes</h4>
                        <ul className="text-red-700 list-disc list-inside">
                          {validation.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {validation.warnings.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                    <div className="flex">
                      <div className="text-yellow-400 text-xl mr-3">⚠️</div>
                      <div>
                        <h4 className="text-yellow-800 font-semibold">Avertissements</h4>
                        <ul className="text-yellow-700 list-disc list-inside">
                          {validation.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Données extraites */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Informations personnelles</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Nom :</span> {importedData.personalInfo.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Prénom :</span> {importedData.personalInfo.firstName}
                  </div>
                  <div>
                    <span className="font-medium">Email :</span> {importedData.personalInfo.email || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Téléphone :</span> {importedData.personalInfo.phone || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Permis :</span> {importedData.personalInfo.licenseNumber}
                  </div>
                  <div>
                    <span className="font-medium">Date permis :</span> {importedData.personalInfo.licenseObtainedDate}
                  </div>
                </div>

                <h4 className="font-semibold mb-3 mt-4">Périodes d'assurance ({importedData.insurancePeriods.length})</h4>
                <div className="space-y-2">
                  {importedData.insurancePeriods.map((period, index) => (
                    <div key={index} className="bg-white p-3 rounded border text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="font-medium">Période :</span> {period.startDate} - {period.endDate}</div>
                        <div><span className="font-medium">Compagnie :</span> {period.company}</div>
                        <div><span className="font-medium">Police :</span> {period.policyNumber}</div>
                        <div><span className="font-medium">Prime :</span> {period.premium}€</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="font-semibold mb-3 mt-4">Sinistres ({importedData.claims.length})</h4>
                <div className="space-y-2">
                  {importedData.claims.map((claim, index) => (
                    <div key={index} className="bg-white p-3 rounded border text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="font-medium">Date :</span> {claim.date}</div>
                        <div><span className="font-medium">Type :</span> {claim.type}</div>
                        <div><span className="font-medium">Montant :</span> {claim.amount}€</div>
                        <div><span className="font-medium">Responsabilité :</span> {claim.responsibility}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              onClick={handleImport}
              disabled={!importedData || !validation?.isValid}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Importer le chauffeur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}