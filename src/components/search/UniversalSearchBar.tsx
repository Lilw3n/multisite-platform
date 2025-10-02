'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  TrendingUp, 
  Zap, 
  Settings,
  Phone,
  Mail,
  User,
  Building,
  Car,
  CreditCard,
  MapPin,
  Hash,
  Sparkles
} from 'lucide-react';
import { SearchOptions, SearchResult, SearchableType } from '@/types/universalSearch';
import UniversalSearchService from '@/lib/universalSearchService';
import PersonalDataSearchService from '@/lib/personalDataSearchService';

interface UniversalSearchBarProps {
  placeholder?: string;
  onSearch?: (results: SearchResult) => void;
  onItemSelect?: (item: any) => void;
  showFilters?: boolean;
  allowedTypes?: SearchableType[];
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'expanded';
}

export default function UniversalSearchBar({
  placeholder = "Rechercher par nom, téléphone, email, SIRET...",
  onSearch,
  onItemSelect,
  showFilters = true,
  allowedTypes,
  autoFocus = false,
  size = 'md',
  variant = 'default'
}: UniversalSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [useAI, setUseAI] = useState(true);
  const [searchType, setSearchType] = useState<'universal' | 'personal'>('universal');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Charger les recherches récentes
    loadRecentSearches();
    
    // Gestionnaire de clic extérieur
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowFiltersPanel(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [autoFocus]);

  const loadRecentSearches = () => {
    const preferences = UniversalSearchService.getPreferences();
    setRecentSearches(preferences.recentSearches.map(s => s.query).slice(0, 5));
  };

  const detectSearchType = (searchQuery: string): 'universal' | 'personal' => {
    const trimmed = searchQuery.trim();
    
    // Patterns pour données personnelles
    const personalPatterns = [
      /^[\+]?[\d\s\-\(\)\.]{8,}$/, // Téléphone
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email
      /^\d{14}$/, // SIRET
      /^\d{9}$/, // SIREN
      /^[A-Z]{2}[-\s]?\d{3}[-\s]?[A-Z]{2}$/i, // Plaque française
      /^\d{5}$/, // Code postal
      /^[A-Z]{2}\d{2}[A-Z0-9]+$/i // IBAN
    ];
    
    return personalPatterns.some(pattern => pattern.test(trimmed)) ? 'personal' : 'universal';
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const detectedType = detectSearchType(searchQuery);
      setSearchType(detectedType);
      
      const searchOptions: SearchOptions = {
        query: searchQuery,
        useAI,
        limit: 20,
        filters: allowedTypes ? { types: allowedTypes } : undefined
      };

      let searchResults: SearchResult;
      
      if (detectedType === 'personal') {
        // Recherche spécialisée pour données personnelles
        const items = UniversalSearchService.loadSearchIndex();
        const personalMatches = PersonalDataSearchService.smartSearch(items, searchQuery);
        
        searchResults = {
          items: personalMatches.map(match => ({
            ...match.item,
            searchScore: match.overallConfidence
          })),
          totalCount: personalMatches.length,
          hasMore: false,
          searchTime: 0,
          suggestions: PersonalDataSearchService.generatePersonalDataSuggestions(searchQuery, items)
        };
      } else {
        // Recherche universelle
        searchResults = await UniversalSearchService.search(searchOptions);
      }
      
      setResults(searchResults);
      setShowResults(true);
      onSearch?.(searchResults);
      
      // Sauvegarder dans les recherches récentes
      saveRecentSearch(searchQuery);
      
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const preferences = UniversalSearchService.getPreferences();
    const newSearch = {
      query: searchQuery,
      timestamp: new Date().toISOString(),
      resultCount: results?.totalCount || 0
    };
    
    // Ajouter en début et limiter à 10
    preferences.recentSearches = [
      newSearch,
      ...preferences.recentSearches.filter(s => s.query !== searchQuery)
    ].slice(0, 10);
    
    UniversalSearchService.savePreferences(preferences);
    loadRecentSearches();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce la recherche
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        performSearch(value);
        
        // Générer des suggestions
        const items = UniversalSearchService.loadSearchIndex();
        const personalSuggestions = PersonalDataSearchService.generatePersonalDataSuggestions(value, items);
        setSuggestions(personalSuggestions);
      } else {
        setResults(null);
        setShowResults(false);
        setSuggestions([]);
      }
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(query);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setShowFiltersPanel(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setShowResults(false);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const getSearchTypeIcon = () => {
    switch (searchType) {
      case 'personal':
        return <User className="w-4 h-4 text-blue-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  const getDataTypeIcon = (query: string) => {
    if (/^[\+]?[\d\s\-\(\)\.]{8,}$/.test(query)) return <Phone className="w-4 h-4" />;
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(query)) return <Mail className="w-4 h-4" />;
    if (/^\d{14}$/.test(query) || /^\d{9}$/.test(query)) return <Building className="w-4 h-4" />;
    if (/^[A-Z]{2}[-\s]?\d{3}[-\s]?[A-Z]{2}$/i.test(query)) return <Car className="w-4 h-4" />;
    if (/^\d{5}$/.test(query)) return <MapPin className="w-4 h-4" />;
    if (/^[A-Z]{2}\d{2}[A-Z0-9]+$/i.test(query)) return <CreditCard className="w-4 h-4" />;
    return <Hash className="w-4 h-4" />;
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const inputSizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-5 py-4'
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Barre de recherche principale */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            getSearchTypeIcon()
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className={`
            block w-full pl-10 pr-12 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${inputSizeClasses[size]} ${sizeClasses[size]}
            ${variant === 'compact' ? 'bg-gray-50' : 'bg-white'}
          `}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {showFilters && (
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`p-2 transition-colors ${
                showFiltersPanel ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Indicateur de type de recherche */}
      {query && (
        <div className="absolute top-full left-0 mt-1 flex items-center space-x-2 text-xs text-gray-500">
          {getDataTypeIcon(query)}
          <span>
            {searchType === 'personal' ? 'Recherche de données personnelles' : 'Recherche universelle'}
          </span>
          {useAI && <Sparkles className="w-3 h-3 text-purple-500" />}
        </div>
      )}

      {/* Résultats et suggestions */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {/* Suggestions rapides */}
          {!query && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Recherches récentes
              </h4>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(search)}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions de saisie */}
          {suggestions.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Suggestions
              </h4>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                  >
                    {getDataTypeIcon(suggestion)}
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Résultats de recherche */}
          {results && results.items.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {results.totalCount} résultat{results.totalCount > 1 ? 's' : ''}
                  {results.searchTime > 0 && (
                    <span className="ml-2 text-gray-400">({results.searchTime}ms)</span>
                  )}
                </h4>
                {useAI && (
                  <div className="flex items-center text-xs text-purple-600">
                    <Zap className="w-3 h-3 mr-1" />
                    IA activée
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {results.items.slice(0, 8).map((item, index) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => onItemSelect?.(item)}
                    className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {UniversalSearchService.getTypeLabel(item.type)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          {item.category && <span>📁 {item.category}</span>}
                          {item.status && <span>🔄 {item.status}</span>}
                          {item.searchScore && (
                            <span className="text-blue-600">
                              ⭐ {Math.round(item.searchScore * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {results.hasMore && (
                <div className="mt-3 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Voir tous les résultats ({results.totalCount})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Aucun résultat */}
          {results && results.items.length === 0 && (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-2">Aucun résultat trouvé</p>
              {results.suggestions && results.suggestions.length > 0 && (
                <div className="text-xs text-gray-400">
                  {results.suggestions.map((suggestion, index) => (
                    <p key={index}>{suggestion}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Options de recherche */}
          <div className="border-t border-gray-100 p-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Recherche IA avec synonymes</span>
              </label>
              
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Settings className="w-3 h-3" />
                <span>Filtres avancés</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
