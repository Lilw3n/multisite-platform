'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc, Grid, List, Download, RefreshCw } from 'lucide-react';
import UniversalSearchBar from './UniversalSearchBar';
import { SearchResult, SearchableItem } from '@/types/universalSearch';
import UniversalSearchService from '@/lib/universalSearchService';

interface ModuleSearchIntegrationProps {
  moduleName: string;
  moduleType: 'claims' | 'contracts' | 'quotes' | 'vehicles' | 'drivers' | 'events' | 'interlocutors';
  data: any[];
  onItemSelect?: (item: any) => void;
  onDataFiltered?: (filteredData: any[]) => void;
  showAdvancedFilters?: boolean;
  allowExport?: boolean;
}

export default function ModuleSearchIntegration({
  moduleName,
  moduleType,
  data,
  onItemSelect,
  onDataFiltered,
  showAdvancedFilters = true,
  allowExport = false
}: ModuleSearchIntegrationProps) {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [filteredData, setFilteredData] = useState(data);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  // Convertir les données du module en format SearchableItem
  const convertToSearchableItems = (moduleData: any[]): SearchableItem[] => {
    return moduleData.map(item => {
      let searchableItem: SearchableItem;

      switch (moduleType) {
        case 'claims':
          searchableItem = {
            id: item.id,
            type: 'claim',
            title: `Sinistre ${item.type} - ${item.date}`,
            description: item.description,
            content: `Montant: ${item.amount}€, Responsable: ${item.responsible ? 'Oui' : 'Non'}`,
            keywords: [item.type, item.insurer, item.status],
            tags: [item.responsible ? 'responsable' : 'non-responsable', item.status.toLowerCase()],
            category: 'Sinistre',
            status: item.status,
            priority: item.amount > 5000 ? 'high' : item.amount > 1000 ? 'medium' : 'low',
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            metadata: {
              amount: item.amount,
              vehicleId: item.vehicleId,
              driverId: item.driverId,
              insurer: item.insurer,
              percentage: item.percentage
            }
          };
          break;

        case 'contracts':
          searchableItem = {
            id: item.id,
            type: 'contract',
            title: `Contrat ${item.type} - ${item.policyNumber}`,
            description: item.description,
            content: `Assureur: ${item.insurer}, Prime: ${item.premium}€`,
            keywords: [item.type, item.insurer, item.policyNumber],
            tags: [item.status.toLowerCase(), item.type.toLowerCase()],
            category: 'Contrat',
            status: item.status,
            priority: 'medium',
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            metadata: {
              insurer: item.insurer,
              policyNumber: item.policyNumber,
              premium: item.premium,
              startDate: item.startDate,
              endDate: item.endDate
            }
          };
          break;

        case 'vehicles':
          searchableItem = {
            id: item.id,
            type: 'vehicle',
            title: `${item.brand} ${item.model} - ${item.registration}`,
            description: `Véhicule ${item.type} de ${item.year}`,
            content: `Immatriculation: ${item.registration}, Statut: ${item.status}`,
            keywords: [item.brand, item.model, item.registration, item.type],
            tags: [item.status.toLowerCase(), item.brand.toLowerCase()],
            category: 'Véhicule',
            status: item.status,
            priority: 'medium',
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            metadata: {
              brand: item.brand,
              model: item.model,
              registration: item.registration,
              year: item.year,
              type: item.type
            }
          };
          break;

        case 'interlocutors':
          searchableItem = {
            id: item.id,
            type: 'interlocutor',
            title: `${item.firstName} ${item.lastName}`,
            description: `${item.role} - ${item.company || 'Particulier'}`,
            content: `Email: ${item.email}, Téléphone: ${item.phone}, Adresse: ${item.address}`,
            keywords: [item.firstName, item.lastName, item.email, item.phone, item.company].filter(Boolean),
            tags: [item.role.toLowerCase(), item.status.toLowerCase()],
            category: 'Interlocuteur',
            status: item.status,
            priority: item.role === 'client' ? 'high' : 'medium',
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            metadata: {
              firstName: item.firstName,
              lastName: item.lastName,
              email: item.email,
              phone: item.phone,
              company: item.company,
              address: item.address,
              role: item.role
            }
          };
          break;

        default:
          searchableItem = {
            id: item.id,
            type: 'other',
            title: item.title || item.name || `${moduleType} ${item.id}`,
            description: item.description || '',
            content: JSON.stringify(item),
            keywords: [],
            tags: [],
            category: moduleName,
            status: item.status || 'unknown',
            priority: 'medium',
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
            metadata: item
          };
      }

      return searchableItem;
    });
  };

  // Indexer les données du module
  useEffect(() => {
    const searchableItems = convertToSearchableItems(data);
    
    // Ajouter à l'index global
    searchableItems.forEach(item => {
      UniversalSearchService.addToIndex(item);
    });
    
    setFilteredData(data);
  }, [data, moduleType]);

  // Gérer les résultats de recherche
  const handleSearchResults = (results: SearchResult) => {
    setSearchResults(results);
    
    // Filtrer les données originales basées sur les résultats
    const resultIds = results.items.map(item => item.id);
    const filtered = data.filter(item => resultIds.includes(item.id));
    
    setFilteredData(filtered);
    onDataFiltered?.(filtered);
  };

  // Réinitialiser la recherche
  const resetSearch = () => {
    setSearchResults(null);
    setFilteredData(data);
    setActiveFilters({});
    onDataFiltered?.(data);
  };

  // Exporter les résultats
  const exportResults = () => {
    const dataToExport = searchResults ? 
      filteredData : 
      data;
    
    const csv = convertToCSV(dataToExport);
    downloadCSV(csv, `${moduleName}_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getModuleSpecificPlaceholder = (): string => {
    const placeholders = {
      claims: "Rechercher par type de sinistre, montant, date, assureur...",
      contracts: "Rechercher par numéro de police, assureur, type de contrat...",
      quotes: "Rechercher par client, type de devis, montant...",
      vehicles: "Rechercher par immatriculation, marque, modèle...",
      drivers: "Rechercher par nom, numéro de permis, téléphone...",
      events: "Rechercher par titre, participant, date, type...",
      interlocutors: "Rechercher par nom, téléphone, email, entreprise..."
    };
    
    return placeholders[moduleType] || "Rechercher dans les données...";
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-2xl">
            <UniversalSearchBar
              placeholder={getModuleSpecificPlaceholder()}
              onSearch={handleSearchResults}
              onItemSelect={onItemSelect}
              showFilters={showAdvancedFilters}
              allowedTypes={[moduleType as any]}
              size="md"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Contrôles de vue */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="title">Titre</option>
              <option value="status">Statut</option>
              <option value="priority">Priorité</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
            
            {/* Actions */}
            <button
              onClick={resetSearch}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Réinitialiser"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            {allowExport && (
              <button
                onClick={exportResults}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Exporter"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Résultats et statistiques */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>
            {filteredData.length} élément{filteredData.length > 1 ? 's' : ''} 
            {searchResults && ` sur ${data.length} total`}
          </span>
          
          {searchResults && searchResults.searchTime > 0 && (
            <span className="text-gray-400">
              ({searchResults.searchTime}ms)
            </span>
          )}
        </div>
        
        {searchResults && (
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">Recherche active</span>
            <button
              onClick={resetSearch}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Effacer
            </button>
          </div>
        )}
      </div>

      {/* Suggestions si aucun résultat */}
      {searchResults && filteredData.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Aucun résultat trouvé</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>Suggestions :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Vérifiez l'orthographe de votre recherche</li>
              <li>Essayez des termes plus généraux</li>
              <li>Utilisez des synonymes</li>
              <li>Recherchez par données personnelles (nom, téléphone, email)</li>
            </ul>
          </div>
          
          {searchResults.suggestions && searchResults.suggestions.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-yellow-800 mb-1">Suggestions automatiques :</p>
              <div className="space-y-1">
                {searchResults.suggestions.map((suggestion, index) => (
                  <p key={index} className="text-sm text-yellow-700">• {suggestion}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
