import { 
  SearchableItem, 
  SearchableType, 
  SearchFilter, 
  SearchOptions, 
  SearchResult, 
  SearchFacet,
  SearchSuggestion,
  SearchAnalytics,
  AISearchContext,
  SearchPreferences,
  SearchIndex
} from '@/types/universalSearch';

class UniversalSearchService {
  private static readonly STORAGE_KEY = 'universal_search_data';
  private static readonly PREFERENCES_KEY = 'search_preferences';
  private static readonly ANALYTICS_KEY = 'search_analytics';

  // Contexte IA pour la recherche sémantique
  private static aiContext: AISearchContext = {
    synonyms: {
      // Assurance
      'assurance': ['police', 'contrat', 'garantie', 'couverture', 'protection'],
      'sinistre': ['accident', 'dommage', 'incident', 'réclamation', 'claim'],
      'prime': ['cotisation', 'tarif', 'prix', 'coût', 'montant'],
      'devis': ['estimation', 'proposition', 'offre', 'tarification', 'quote'],
      
      // Transport
      'vtc': ['taxi', 'chauffeur', 'transport', 'véhicule', 'conducteur'],
      'véhicule': ['voiture', 'auto', 'automobile', 'car', 'vehicle'],
      'permis': ['licence', 'autorisation', 'certification', 'habilitation'],
      
      // Finance
      'paiement': ['règlement', 'versement', 'transaction', 'payment'],
      'facture': ['invoice', 'bill', 'note', 'créance'],
      'crédit': ['prêt', 'financement', 'emprunt', 'loan'],
      
      // CRM
      'client': ['interlocuteur', 'prospect', 'customer', 'contact'],
      'rendez-vous': ['rdv', 'meeting', 'réunion', 'appointment'],
      'suivi': ['tracking', 'monitoring', 'follow-up', 'surveillance'],
      
      // Technique
      'erreur': ['bug', 'problème', 'issue', 'dysfonctionnement'],
      'mise à jour': ['update', 'upgrade', 'actualisation', 'refresh'],
      'configuration': ['paramétrage', 'settings', 'config', 'setup']
    },
    
    contexts: {
      'assurance': ['police', 'garantie', 'sinistre', 'prime', 'franchise', 'malus', 'bonus'],
      'transport': ['vtc', 'taxi', 'chauffeur', 'course', 'trajet', 'kilomètre'],
      'finance': ['euro', 'paiement', 'facture', 'crédit', 'débit', 'solde'],
      'crm': ['client', 'prospect', 'lead', 'conversion', 'pipeline'],
      'technique': ['système', 'application', 'interface', 'base de données'],
      'juridique': ['contrat', 'clause', 'obligation', 'responsabilité', 'droit']
    },
    
    entityRecognition: true,
    sentimentAnalysis: true,
    intentDetection: true,
    autoCorrection: true
  };

  // Normaliser le texte (accents, casse, etc.)
  static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^\w\s]/g, ' ') // Remplacer la ponctuation par des espaces
      .replace(/\s+/g, ' ') // Normaliser les espaces
      .trim();
  }

  // Recherche IA avec synonymes et contextes
  static aiSearch(query: string, items: SearchableItem[]): SearchableItem[] {
    const normalizedQuery = this.normalizeText(query);
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 2);
    
    // Vérifier si c'est une recherche exacte (entre guillemets)
    const exactMatch = query.startsWith('"') && query.endsWith('"');
    if (exactMatch) {
      const exactQuery = query.slice(1, -1);
      return items.filter(item => 
        this.normalizeText(item.title).includes(this.normalizeText(exactQuery)) ||
        this.normalizeText(item.description || '').includes(this.normalizeText(exactQuery)) ||
        this.normalizeText(item.content || '').includes(this.normalizeText(exactQuery))
      );
    }

    // Recherche avec synonymes et contextes
    const expandedWords = new Set<string>();
    
    queryWords.forEach(word => {
      expandedWords.add(word);
      
      // Ajouter les synonymes
      Object.entries(this.aiContext.synonyms).forEach(([key, synonyms]) => {
        if (key.includes(word) || synonyms.some(syn => syn.includes(word))) {
          expandedWords.add(key);
          synonyms.forEach(syn => expandedWords.add(syn));
        }
      });
      
      // Ajouter les mots du contexte
      Object.entries(this.aiContext.contexts).forEach(([context, contextWords]) => {
        if (contextWords.some(cw => cw.includes(word))) {
          contextWords.forEach(cw => expandedWords.add(cw));
        }
      });
    });

    // Calculer le score de pertinence
    return items.map(item => {
      let score = 0;
      const itemText = this.normalizeText(
        `${item.title} ${item.description || ''} ${item.content || ''} ${item.keywords?.join(' ') || ''} ${item.tags?.join(' ') || ''}`
      );

      expandedWords.forEach(word => {
        if (itemText.includes(word)) {
          // Score plus élevé pour les correspondances dans le titre
          if (this.normalizeText(item.title).includes(word)) score += 10;
          // Score moyen pour les correspondances dans la description
          if (this.normalizeText(item.description || '').includes(word)) score += 5;
          // Score faible pour les correspondances dans le contenu
          if (this.normalizeText(item.content || '').includes(word)) score += 2;
          // Score pour les mots-clés et tags
          if (item.keywords?.some(k => this.normalizeText(k).includes(word))) score += 8;
          if (item.tags?.some(t => this.normalizeText(t).includes(word))) score += 6;
        }
      });

      return { ...item, searchScore: score };
    })
    .filter(item => (item.searchScore || 0) > 0)
    .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
  }

  // Recherche classique
  static classicSearch(query: string, items: SearchableItem[]): SearchableItem[] {
    const normalizedQuery = this.normalizeText(query);
    
    return items.filter(item => {
      const itemText = this.normalizeText(
        `${item.title} ${item.description || ''} ${item.content || ''} ${item.keywords?.join(' ') || ''} ${item.tags?.join(' ') || ''}`
      );
      
      return itemText.includes(normalizedQuery);
    });
  }

  // Recherche principale
  static async search(options: SearchOptions): Promise<SearchResult> {
    const startTime = Date.now();
    
    // Charger tous les éléments indexés
    const allItems = this.loadSearchIndex();
    
    // Appliquer les filtres
    let filteredItems = this.applyFilters(allItems, options.filters);
    
    // Effectuer la recherche
    let searchResults: SearchableItem[] = [];
    
    if (options.query.trim()) {
      if (options.useAI) {
        searchResults = this.aiSearch(options.query, filteredItems);
      } else {
        searchResults = this.classicSearch(options.query, filteredItems);
      }
    } else {
      searchResults = filteredItems;
    }

    // Trier les résultats
    searchResults = this.sortResults(searchResults, options.sortBy, options.sortOrder);
    
    // Pagination
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    const paginatedResults = searchResults.slice(offset, offset + limit);
    
    // Générer les facettes
    const facets = this.generateFacets(filteredItems);
    
    // Générer les suggestions
    const suggestions = this.generateSuggestions(options.query, searchResults.length);
    
    const searchTime = Date.now() - startTime;
    
    // Enregistrer l'analytics
    this.recordSearch(options.query, searchResults.length, searchTime);
    
    return {
      items: paginatedResults,
      totalCount: searchResults.length,
      hasMore: offset + limit < searchResults.length,
      searchTime,
      suggestions,
      facets,
      relatedSearches: this.getRelatedSearches(options.query)
    };
  }

  // Appliquer les filtres
  static applyFilters(items: SearchableItem[], filters?: SearchFilter): SearchableItem[] {
    if (!filters) return items;
    
    let filtered = [...items];
    
    if (filters.types?.length) {
      filtered = filtered.filter(item => filters.types!.includes(item.type));
    }
    
    if (filters.categories?.length) {
      filtered = filtered.filter(item => 
        item.category && filters.categories!.includes(item.category)
      );
    }
    
    if (filters.statuses?.length) {
      filtered = filtered.filter(item => 
        item.status && filters.statuses!.includes(item.status)
      );
    }
    
    if (filters.priorities?.length) {
      filtered = filtered.filter(item => 
        item.priority && filters.priorities!.includes(item.priority)
      );
    }
    
    if (filters.dateRange) {
      const { start, end, field = 'createdAt' } = filters.dateRange;
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item[field]);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    if (filters.creators?.length) {
      filtered = filtered.filter(item => 
        item.createdBy && filters.creators!.includes(item.createdBy)
      );
    }
    
    if (filters.assignees?.length) {
      filtered = filtered.filter(item => 
        item.assignedTo && filters.assignees!.includes(item.assignedTo)
      );
    }
    
    if (filters.tags?.length) {
      filtered = filtered.filter(item => 
        item.tags?.some(tag => filters.tags!.includes(tag))
      );
    }
    
    if (filters.keywords?.length) {
      filtered = filtered.filter(item => 
        item.keywords?.some(keyword => filters.keywords!.includes(keyword))
      );
    }
    
    return filtered;
  }

  // Trier les résultats
  static sortResults(
    items: SearchableItem[], 
    sortBy: SearchOptions['sortBy'] = 'relevance', 
    sortOrder: SearchOptions['sortOrder'] = 'desc'
  ): SearchableItem[] {
    return items.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy) {
        case 'relevance':
          aValue = a.searchScore || 0;
          bValue = b.searchScore || 0;
          break;
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  // Générer les facettes
  static generateFacets(items: SearchableItem[]): SearchFacet[] {
    const facets: SearchFacet[] = [];
    
    // Facette par type
    const typeCount: Record<string, number> = {};
    items.forEach(item => {
      typeCount[item.type] = (typeCount[item.type] || 0) + 1;
    });
    
    facets.push({
      field: 'type',
      label: 'Type',
      values: Object.entries(typeCount).map(([value, count]) => ({
        value,
        label: this.getTypeLabel(value as SearchableType),
        count
      })).sort((a, b) => b.count - a.count)
    });
    
    // Facette par catégorie
    const categoryCount: Record<string, number> = {};
    items.forEach(item => {
      if (item.category) {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      }
    });
    
    if (Object.keys(categoryCount).length > 0) {
      facets.push({
        field: 'category',
        label: 'Catégorie',
        values: Object.entries(categoryCount).map(([value, count]) => ({
          value,
          label: value,
          count
        })).sort((a, b) => b.count - a.count)
      });
    }
    
    // Facette par statut
    const statusCount: Record<string, number> = {};
    items.forEach(item => {
      if (item.status) {
        statusCount[item.status] = (statusCount[item.status] || 0) + 1;
      }
    });
    
    if (Object.keys(statusCount).length > 0) {
      facets.push({
        field: 'status',
        label: 'Statut',
        values: Object.entries(statusCount).map(([value, count]) => ({
          value,
          label: value,
          count
        })).sort((a, b) => b.count - a.count)
      });
    }
    
    return facets;
  }

  // Générer les suggestions
  static generateSuggestions(query: string, resultCount: number): string[] {
    const suggestions: string[] = [];
    
    if (resultCount === 0) {
      // Suggestions pour les recherches sans résultat
      const normalizedQuery = this.normalizeText(query);
      
      // Vérifier les synonymes
      Object.entries(this.aiContext.synonyms).forEach(([key, synonyms]) => {
        if (normalizedQuery.includes(key)) {
          synonyms.forEach(synonym => {
            suggestions.push(`Essayez "${synonym}" au lieu de "${key}"`);
          });
        }
      });
      
      // Suggestions génériques
      if (suggestions.length === 0) {
        suggestions.push(
          'Vérifiez l\'orthographe de votre recherche',
          'Essayez des mots-clés plus généraux',
          'Utilisez des synonymes',
          'Supprimez les filtres actifs'
        );
      }
    }
    
    return suggestions.slice(0, 3);
  }

  // Obtenir les recherches liées
  static getRelatedSearches(query: string): string[] {
    const normalizedQuery = this.normalizeText(query);
    const related: string[] = [];
    
    // Recherches basées sur les contextes
    Object.entries(this.aiContext.contexts).forEach(([context, words]) => {
      if (words.some(word => normalizedQuery.includes(word))) {
        words.forEach(word => {
          if (!normalizedQuery.includes(word)) {
            related.push(word);
          }
        });
      }
    });
    
    return related.slice(0, 5);
  }

  // Obtenir le label d'un type
  static getTypeLabel(type: SearchableType): string {
    const labels: Record<SearchableType, string> = {
      interlocutor: 'Interlocuteurs',
      event: 'Événements',
      contract: 'Contrats',
      quote: 'Devis',
      claim: 'Sinistres',
      vehicle: 'Véhicules',
      driver: 'Conducteurs',
      company: 'Entreprises',
      insurance_period: 'Périodes d\'assurance',
      bank_details: 'Coordonnées bancaires',
      social_content: 'Contenu social',
      social_network: 'Réseaux sociaux',
      blog_post: 'Articles de blog',
      user: 'Utilisateurs',
      notification: 'Notifications',
      task: 'Tâches',
      document: 'Documents',
      payment: 'Paiements',
      debit: 'Débits',
      receivable: 'Créances',
      module: 'Modules',
      role: 'Rôles',
      permission: 'Permissions',
      other: 'Autres'
    };
    
    return labels[type] || type;
  }

  // Charger l'index de recherche
  static loadSearchIndex(): SearchableItem[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Erreur lors du chargement de l\'index de recherche');
        }
      }
    }
    return this.generateMockSearchIndex();
  }

  // Sauvegarder l'index de recherche
  static saveSearchIndex(items: SearchableItem[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
  }

  // Ajouter un élément à l'index
  static addToIndex(item: SearchableItem): void {
    const index = this.loadSearchIndex();
    const existingIndex = index.findIndex(i => i.id === item.id && i.type === item.type);
    
    if (existingIndex !== -1) {
      index[existingIndex] = item;
    } else {
      index.push(item);
    }
    
    this.saveSearchIndex(index);
  }

  // Supprimer un élément de l'index
  static removeFromIndex(id: string, type: SearchableType): void {
    const index = this.loadSearchIndex();
    const filteredIndex = index.filter(item => !(item.id === id && item.type === type));
    this.saveSearchIndex(filteredIndex);
  }

  // Enregistrer une recherche pour les analytics
  static recordSearch(query: string, resultCount: number, searchTime: number): void {
    if (typeof window !== 'undefined') {
      const analytics = this.loadAnalytics();
      
      analytics.totalSearches++;
      
      // Ajouter à la liste des requêtes populaires
      const existingQuery = analytics.popularQueries.find(q => q.query === query);
      if (existingQuery) {
        existingQuery.count++;
        existingQuery.resultCount = resultCount;
      } else {
        analytics.popularQueries.push({ query, count: 1, resultCount });
      }
      
      // Trier par popularité
      analytics.popularQueries.sort((a, b) => b.count - a.count);
      analytics.popularQueries = analytics.popularQueries.slice(0, 100);
      
      // Ajouter aux requêtes sans résultat
      if (resultCount === 0 && !analytics.noResultQueries.includes(query)) {
        analytics.noResultQueries.push(query);
        analytics.noResultQueries = analytics.noResultQueries.slice(-50);
      }
      
      // Mettre à jour les moyennes
      analytics.averageResultCount = analytics.popularQueries.reduce((sum, q) => sum + q.resultCount, 0) / analytics.popularQueries.length;
      analytics.averageSearchTime = (analytics.averageSearchTime + searchTime) / 2;
      
      this.saveAnalytics(analytics);
    }
  }

  // Charger les analytics
  static loadAnalytics(): SearchAnalytics {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.ANALYTICS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Erreur lors du chargement des analytics de recherche');
        }
      }
    }
    
    return {
      totalSearches: 0,
      popularQueries: [],
      noResultQueries: [],
      averageResultCount: 0,
      averageSearchTime: 0,
      searchTrends: []
    };
  }

  // Sauvegarder les analytics
  static saveAnalytics(analytics: SearchAnalytics): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics));
    }
  }

  // Générer un index de recherche de démonstration
  static generateMockSearchIndex(): SearchableItem[] {
    return [
      {
        id: '1',
        type: 'interlocutor',
        title: 'Jean Dupont',
        description: 'Client VTC professionnel avec assurance complète',
        content: 'Chauffeur VTC expérimenté, 5 ans d\'expérience, véhicule Mercedes Classe E',
        keywords: ['vtc', 'chauffeur', 'professionnel', 'mercedes'],
        tags: ['client', 'actif', 'premium'],
        category: 'Client',
        status: 'Actif',
        priority: 'high',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        createdBy: 'Admin',
        url: '/dashboard/interlocutors/1'
      },
      {
        id: '2',
        type: 'contract',
        title: 'Contrat Assurance Auto VTC - Jean Dupont',
        description: 'Contrat d\'assurance automobile pour activité VTC',
        content: 'Police d\'assurance tous risques avec garantie professionnelle VTC',
        keywords: ['assurance', 'auto', 'vtc', 'tous risques'],
        tags: ['contrat', 'actif', 'vtc'],
        category: 'Assurance Auto',
        status: 'En cours',
        priority: 'high',
        createdAt: '2024-01-16T14:00:00Z',
        updatedAt: '2024-01-16T14:00:00Z',
        createdBy: 'Agent',
        url: '/dashboard/contracts/2'
      },
      {
        id: '3',
        type: 'event',
        title: 'Appel Commercial - Présentation produits',
        description: 'Présentation du nouveau produit d\'assurance auto avec démonstration',
        content: 'Rendez-vous téléphonique pour présenter les nouvelles garanties',
        keywords: ['appel', 'commercial', 'présentation', 'produit'],
        tags: ['commercial', 'terminé', 'succès'],
        category: 'Commercial',
        status: 'Terminé',
        priority: 'medium',
        createdAt: '2024-01-27T14:30:00Z',
        updatedAt: '2024-01-27T16:00:00Z',
        createdBy: 'Marie Martin',
        url: '/dashboard/interlocutors/1'
      },
      {
        id: '4',
        type: 'quote',
        title: 'Devis Assurance Flotte - Transport Express',
        description: 'Devis pour assurance flotte de 10 véhicules utilitaires',
        content: 'Demande de devis pour couverture complète flotte commerciale',
        keywords: ['devis', 'flotte', 'utilitaire', 'commercial'],
        tags: ['devis', 'en attente', 'flotte'],
        category: 'Assurance Flotte',
        status: 'En attente',
        priority: 'high',
        createdAt: '2024-01-20T09:00:00Z',
        updatedAt: '2024-01-22T11:00:00Z',
        createdBy: 'Commercial',
        url: '/dashboard/quotes/4'
      },
      {
        id: '5',
        type: 'claim',
        title: 'Sinistre Collision - Véhicule AB-123-CD',
        description: 'Collision avec un autre véhicule sur l\'autoroute A1',
        content: 'Accident responsable, dommages matériels importants, expertise en cours',
        keywords: ['sinistre', 'collision', 'autoroute', 'responsable'],
        tags: ['sinistre', 'en cours', 'matériel'],
        category: 'Sinistre Auto',
        status: 'En cours',
        priority: 'high',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-25T14:00:00Z',
        createdBy: 'Expert',
        url: '/dashboard/claims/5'
      }
    ];
  }

  // Obtenir les préférences de recherche
  static getPreferences(): SearchPreferences {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.PREFERENCES_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Erreur lors du chargement des préférences de recherche');
        }
      }
    }
    
    return {
      defaultSortBy: 'relevance',
      defaultSortOrder: 'desc',
      defaultLimit: 20,
      enableAI: true,
      enableFuzzy: true,
      enableSuggestions: true,
      savedFilters: [],
      recentSearches: []
    };
  }

  // Sauvegarder les préférences
  static savePreferences(preferences: SearchPreferences): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    }
  }
}

export default UniversalSearchService;
