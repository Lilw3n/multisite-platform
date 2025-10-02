export interface SearchableItem {
  id: string;
  type: SearchableType;
  title: string;
  description?: string;
  content?: string;
  keywords?: string[];
  tags?: string[];
  category?: string;
  subcategory?: string;
  status?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  assignedTo?: string;
  metadata?: Record<string, any>;
  url?: string;
  searchScore?: number;
}

export type SearchableType = 
  | 'interlocutor'
  | 'event'
  | 'contract'
  | 'quote'
  | 'claim'
  | 'vehicle'
  | 'driver'
  | 'company'
  | 'insurance_period'
  | 'bank_details'
  | 'social_content'
  | 'social_network'
  | 'blog_post'
  | 'user'
  | 'notification'
  | 'task'
  | 'document'
  | 'payment'
  | 'debit'
  | 'receivable'
  | 'module'
  | 'role'
  | 'permission'
  | 'other';

export interface SearchFilter {
  types?: SearchableType[];
  categories?: string[];
  statuses?: string[];
  priorities?: ('low' | 'medium' | 'high')[];
  dateRange?: {
    start: string;
    end: string;
    field?: 'createdAt' | 'updatedAt' | 'custom';
  };
  creators?: string[];
  assignees?: string[];
  tags?: string[];
  keywords?: string[];
  customFilters?: Record<string, any>;
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilter;
  sortBy?: 'relevance' | 'date' | 'title' | 'priority' | 'status' | 'custom';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  useAI?: boolean;
  exactMatch?: boolean;
  fuzzySearch?: boolean;
  includeArchived?: boolean;
}

export interface SearchResult {
  items: SearchableItem[];
  totalCount: number;
  hasMore: boolean;
  searchTime: number;
  suggestions?: string[];
  facets?: SearchFacet[];
  relatedSearches?: string[];
}

export interface SearchFacet {
  field: string;
  label: string;
  values: Array<{
    value: string;
    label: string;
    count: number;
    selected?: boolean;
  }>;
}

export interface SearchSuggestion {
  query: string;
  type: 'correction' | 'completion' | 'related';
  confidence: number;
}

export interface SearchAnalytics {
  totalSearches: number;
  popularQueries: Array<{
    query: string;
    count: number;
    resultCount: number;
  }>;
  noResultQueries: string[];
  averageResultCount: number;
  averageSearchTime: number;
  searchTrends: Array<{
    date: string;
    searches: number;
    successRate: number;
  }>;
}

export interface AISearchContext {
  synonyms: Record<string, string[]>;
  contexts: Record<string, string[]>;
  entityRecognition: boolean;
  sentimentAnalysis: boolean;
  intentDetection: boolean;
  autoCorrection: boolean;
}

export interface SearchPreferences {
  defaultSortBy: SearchOptions['sortBy'];
  defaultSortOrder: SearchOptions['sortOrder'];
  defaultLimit: number;
  enableAI: boolean;
  enableFuzzy: boolean;
  enableSuggestions: boolean;
  savedFilters: Array<{
    id: string;
    name: string;
    filters: SearchFilter;
    isDefault?: boolean;
  }>;
  recentSearches: Array<{
    query: string;
    timestamp: string;
    resultCount: number;
  }>;
}

export interface SearchIndex {
  id: string;
  type: SearchableType;
  title: string;
  titleNormalized: string;
  description?: string;
  descriptionNormalized?: string;
  content?: string;
  contentNormalized?: string;
  keywords: string[];
  keywordsNormalized: string[];
  tags: string[];
  tagsNormalized: string[];
  category?: string;
  categoryNormalized?: string;
  fullTextSearch: string;
  fullTextSearchNormalized: string;
  metadata: Record<string, any>;
  lastIndexed: string;
}
