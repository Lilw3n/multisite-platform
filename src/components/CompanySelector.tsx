'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Building, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  MapPin,
  Users,
  Calendar,
  ExternalLink,
  Shield,
  TrendingUp
} from 'lucide-react';
import { CompanyService } from '@/lib/companyService';
import { CompanyData, CompanyVerificationResult, CompanyLinkVerification } from '@/types/company';

interface CompanySelectorProps {
  selectedCompany?: CompanyData | null;
  onSelect: (company: CompanyData) => void;
  onClear?: () => void;
  subscriberName?: string;
  placeholder?: string;
  required?: boolean;
  showDetails?: boolean;
  allowManualCreation?: boolean;
}

export default function CompanySelector({
  selectedCompany,
  onSelect,
  onClear,
  subscriberName = '',
  placeholder = "Rechercher par SIRET, SIREN, ou nom d'entreprise...",
  required = false,
  showDetails = true,
  allowManualCreation = true
}: CompanySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMethod, setSearchMethod] = useState<'siret' | 'siren' | 'name' | 'manual'>('siret');
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [verification, setVerification] = useState<CompanyVerificationResult | null>(null);
  const [linkVerification, setLinkVerification] = useState<CompanyLinkVerification | null>(null);

  // Charger les entreprises existantes
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    const allCompanies = CompanyService.getAllCompanies();
    setCompanies(allCompanies);
  };

  // Recherche d'entreprise
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      let searchResult;

      switch (searchMethod) {
        case 'siret':
          searchResult = await CompanyService.searchCompany({ siret: searchTerm });
          break;
        case 'siren':
          searchResult = await CompanyService.searchCompany({ siren: searchTerm });
          break;
        case 'name':
          searchResult = await CompanyService.searchCompany({ name: searchTerm });
          break;
      }

      if (searchResult?.success && searchResult.data) {
        const company = searchResult.data;
        
        // Vérification de l'entreprise
        const verificationResult = CompanyService.verifyCompany(company);
        setVerification(verificationResult);

        // Vérification du lien avec le souscripteur
        if (subscriberName) {
          const linkResult = CompanyService.verifyPersonCompanyLink(subscriberName, company);
          setLinkVerification(linkResult);
        }

        onSelect(company);
        setIsOpen(false);
      } else {
        // Entreprise non trouvée, proposer création manuelle
        if (allowManualCreation) {
          setShowCreateForm(true);
        }
      }

    } catch (error) {
      console.error('Erreur recherche entreprise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCompany = () => {
    setShowCreateForm(true);
    setIsOpen(false);
  };

  const handleCompanyCreated = (newCompany: CompanyData) => {
    CompanyService.saveCompany(newCompany);
    loadCompanies();
    onSelect(newCompany);
    setShowCreateForm(false);
  };

  const renderCompanyCard = (company: CompanyData) => (
    <div
      key={company.id}
      onClick={() => {
        onSelect(company);
        setIsOpen(false);
      }}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {company.legalName}
            </h4>
            {company.commercialName && company.commercialName !== company.legalName && (
              <p className="text-sm text-gray-600">({company.commercialName})</p>
            )}
            <p className="text-xs text-gray-500">
              SIRET: {company.siret} | {company.legalForm}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1">
            {company.isActive ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
            {company.creditScore && company.creditScore > 70 && (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </div>
          <p className="text-xs text-gray-500">
            {company.status === 'active' ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{company.address.city} ({company.address.postalCode})</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{company.employees || 'N/A'} employés</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Créée en {new Date(company.creationDate).getFullYear()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>NAF: {company.naf}</span>
          </div>
        </div>
      )}

      {company.legalRepresentatives.length > 0 && (
        <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
          <p className="text-xs text-blue-800">
            <strong>Dirigeant:</strong> {company.legalRepresentatives[0].firstName} {company.legalRepresentatives[0].lastName}
            {company.legalRepresentatives[0].role && ` (${company.legalRepresentatives[0].role})`}
          </p>
        </div>
      )}
    </div>
  );

  const renderSearchInterface = () => (
    <div className="space-y-4">
      {/* Méthode de recherche */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Méthode de recherche
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 'siret', label: 'SIRET', icon: Shield },
            { value: 'siren', label: 'SIREN', icon: Shield },
            { value: 'name', label: 'Nom', icon: Search },
            { value: 'manual', label: 'Manuel', icon: Plus }
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSearchMethod(value as any)}
              className={`p-2 text-xs rounded-md border transition-colors ${
                searchMethod === value
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4 mx-auto mb-1" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Champ de recherche */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {searchMethod === 'siret' && 'Numéro SIRET (14 chiffres)'}
          {searchMethod === 'siren' && 'Numéro SIREN (9 chiffres)'}
          {searchMethod === 'name' && 'Nom de l\'entreprise'}
          {searchMethod === 'manual' && 'Recherche libre'}
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              searchMethod === 'siret' ? '12345678901234' :
              searchMethod === 'siren' ? '123456789' :
              searchMethod === 'name' ? 'TRANSPORT EXPRESS SARL' :
              'Nom, SIRET, SIREN...'
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : <Search className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Aide SIRET */}
      {searchMethod === 'siret' && (
        <div className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>SIRET:</strong> 14 chiffres (SIREN + NIC)
              </p>
              <p className="text-xs text-blue-600">
                Exemple: 12345678901234 (123456789 + 01234)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Sélecteur principal */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedCompany ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <span className="font-medium">
                  {selectedCompany.legalName}
                </span>
                <span className="text-gray-500 ml-2 text-sm">
                  {selectedCompany.siret}
                </span>
              </div>
            </div>
            {onClear && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3 text-gray-500">
            <Building className="h-5 w-5" />
            <span>{placeholder}</span>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            {renderSearchInterface()}
          </div>

          {/* Entreprises existantes */}
          {companies.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Entreprises existantes
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {companies.map(renderCompanyCard)}
              </div>
            </div>
          )}

          {/* Bouton créer nouveau */}
          {allowManualCreation && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleCreateCompany}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
              >
                <Plus className="h-4 w-4" />
                <span>Créer une nouvelle entreprise</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vérification de l'entreprise sélectionnée */}
      {selectedCompany && verification && (
        <div className="mt-2">
          <div className={`p-3 rounded-md border-l-4 ${
            verification.isValid 
              ? 'bg-green-50 border-green-400' 
              : 'bg-yellow-50 border-yellow-400'
          }`}>
            <div className="flex items-start space-x-2">
              {verification.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium">
                  Score de correspondance: {verification.matchScore}%
                </p>
                {verification.verifiedFields.length > 0 && (
                  <ul className="mt-1 text-xs text-green-800">
                    {verification.verifiedFields.map((field, index) => (
                      <li key={index}>✓ {field}</li>
                    ))}
                  </ul>
                )}
                {verification.warnings.length > 0 && (
                  <ul className="mt-1 text-xs text-yellow-800">
                    {verification.warnings.map((warning, index) => (
                      <li key={index}>⚠ {warning}</li>
                    ))}
                  </ul>
                )}
                {verification.discrepancies.length > 0 && (
                  <ul className="mt-1 text-xs text-red-800">
                    {verification.discrepancies.map((disc, index) => (
                      <li key={index}>✗ {disc}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vérification du lien souscripteur-entreprise */}
      {linkVerification && subscriberName && (
        <div className="mt-2">
          <div className={`p-3 rounded-md border-l-4 ${
            linkVerification.linkType !== 'no_link'
              ? 'bg-green-50 border-green-400' 
              : 'bg-yellow-50 border-yellow-400'
          }`}>
            <div className="flex items-start space-x-2">
              {linkVerification.linkType !== 'no_link' ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium">
                  Lien avec {subscriberName}: {linkVerification.confidence}% de confiance
                </p>
                <p className="text-xs text-gray-600">
                  Type: {linkVerification.linkType === 'legal_representative' ? 'Représentant légal' :
                         linkVerification.linkType === 'shareholder' ? 'Actionnaire potentiel' :
                         linkVerification.linkType === 'employee' ? 'Employé' : 'Aucun lien identifié'}
                </p>
                {linkVerification.evidence.length > 0 && (
                  <ul className="mt-1 text-xs text-green-800">
                    {linkVerification.evidence.map((evidence, index) => (
                      <li key={index}>• {evidence}</li>
                    ))}
                  </ul>
                )}
                {linkVerification.warnings.length > 0 && (
                  <ul className="mt-1 text-xs text-yellow-800">
                    {linkVerification.warnings.map((warning, index) => (
                      <li key={index}>⚠ {warning}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'entreprise */}
      {showCreateForm && (
        <CompanyCreateModal
          onSave={handleCompanyCreated}
          onCancel={() => setShowCreateForm(false)}
          initialData={{
            searchTerm,
            searchMethod,
            subscriberName
          }}
        />
      )}
    </div>
  );
}

// Composant modal de création d'entreprise (simplifié)
function CompanyCreateModal({ 
  onSave, 
  onCancel, 
  initialData 
}: { 
  onSave: (company: CompanyData) => void;
  onCancel: () => void;
  initialData: any;
}) {
  const [formData, setFormData] = useState({
    siret: initialData.searchMethod === 'siret' ? initialData.searchTerm : '',
    legalName: initialData.searchMethod === 'name' ? initialData.searchTerm : '',
    commercialName: '',
    legalForm: 'SARL',
    mainActivity: '',
    naf: '',
    street: '',
    postalCode: '',
    city: '',
    representativeFirstName: '',
    representativeLastName: '',
    representativeRole: 'Gérant'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCompany: CompanyData = {
      id: `comp_${Date.now()}`,
      siret: formData.siret,
      siren: formData.siret.substring(0, 9),
      legalName: formData.legalName,
      commercialName: formData.commercialName || undefined,
      legalForm: formData.legalForm,
      mainActivity: formData.mainActivity,
      naf: formData.naf,
      nafLabel: formData.mainActivity,
      address: {
        street: formData.street,
        postalCode: formData.postalCode,
        city: formData.city,
        country: 'France'
      },
      legalRepresentatives: [{
        firstName: formData.representativeFirstName,
        lastName: formData.representativeLastName,
        role: formData.representativeRole
      }],
      creationDate: new Date().toISOString(),
      status: 'active',
      isActive: true,
      source: 'manual',
      lastVerified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newCompany);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Nouvelle entreprise</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SIRET *
                </label>
                <input
                  type="text"
                  value={formData.siret}
                  onChange={(e) => setFormData(prev => ({ ...prev, siret: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345678901234"
                  maxLength={14}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Forme juridique *
                </label>
                <select
                  value={formData.legalForm}
                  onChange={(e) => setFormData(prev => ({ ...prev, legalForm: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="SARL">SARL</option>
                  <option value="SAS">SAS</option>
                  <option value="EURL">EURL</option>
                  <option value="SA">SA</option>
                  <option value="SNC">SNC</option>
                  <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Dénomination sociale *
                </label>
                <input
                  type="text"
                  value={formData.legalName}
                  onChange={(e) => setFormData(prev => ({ ...prev, legalName: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nom commercial
                </label>
                <input
                  type="text"
                  value={formData.commercialName}
                  onChange={(e) => setFormData(prev => ({ ...prev, commercialName: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Activité principale *
                </label>
                <input
                  type="text"
                  value={formData.mainActivity}
                  onChange={(e) => setFormData(prev => ({ ...prev, mainActivity: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code NAF
                </label>
                <input
                  type="text"
                  value={formData.naf}
                  onChange={(e) => setFormData(prev => ({ ...prev, naf: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="4941A"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Adresse du siège</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Représentant légal</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.representativeFirstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, representativeFirstName: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.representativeLastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, representativeLastName: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fonction *
                  </label>
                  <select
                    value={formData.representativeRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, representativeRole: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Gérant">Gérant</option>
                    <option value="Président">Président</option>
                    <option value="Directeur Général">Directeur Général</option>
                    <option value="Administrateur">Administrateur</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Créer l'entreprise
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
