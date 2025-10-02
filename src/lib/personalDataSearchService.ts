import { SearchableItem, SearchOptions, SearchResult } from '@/types/universalSearch';

interface PersonalDataSearchOptions {
  query: string;
  searchFields?: PersonalDataField[];
  exactMatch?: boolean;
  fuzzySearch?: boolean;
  phoneFormat?: 'any' | 'french' | 'international';
  emailDomain?: string;
  caseSensitive?: boolean;
}

type PersonalDataField = 
  | 'phone'
  | 'email' 
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'address'
  | 'postalCode'
  | 'city'
  | 'siret'
  | 'siren'
  | 'registration'
  | 'license'
  | 'iban'
  | 'all';

interface PersonalDataMatch {
  item: SearchableItem;
  matchedFields: Array<{
    field: PersonalDataField;
    value: string;
    confidence: number;
    position?: number;
  }>;
  overallConfidence: number;
}

class PersonalDataSearchService {
  
  // Normaliser un numéro de téléphone
  static normalizePhoneNumber(phone: string): string {
    // Supprimer tous les caractères non numériques sauf le +
    let normalized = phone.replace(/[^\d+]/g, '');
    
    // Gérer les formats français
    if (normalized.startsWith('0')) {
      normalized = '+33' + normalized.substring(1);
    } else if (normalized.startsWith('33') && !normalized.startsWith('+')) {
      normalized = '+' + normalized;
    } else if (!normalized.startsWith('+') && normalized.length === 10) {
      normalized = '+33' + normalized.substring(1);
    }
    
    return normalized;
  }

  // Normaliser une adresse email
  static normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  // Normaliser un nom/prénom
  static normalizeName(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^\w\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
      .trim();
  }

  // Normaliser une adresse
  static normalizeAddress(address: string): string {
    return address
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\b(rue|avenue|av|boulevard|bd|place|pl|impasse|imp|chemin|ch)\b/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Normaliser un SIRET/SIREN
  static normalizeSiret(siret: string): string {
    return siret.replace(/\s/g, '');
  }

  // Normaliser une plaque d'immatriculation
  static normalizeRegistration(registration: string): string {
    return registration
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
  }

  // Normaliser un IBAN
  static normalizeIban(iban: string): string {
    return iban
      .toUpperCase()
      .replace(/\s/g, '');
  }

  // Extraire les données personnelles d'un élément
  static extractPersonalData(item: SearchableItem): Record<PersonalDataField, string[]> {
    const data: Record<PersonalDataField, string[]> = {
      phone: [],
      email: [],
      firstName: [],
      lastName: [],
      fullName: [],
      address: [],
      postalCode: [],
      city: [],
      siret: [],
      siren: [],
      registration: [],
      license: [],
      iban: [],
      all: []
    };

    const allText = `${item.title} ${item.description || ''} ${item.content || ''}`;

    // Extraire les téléphones (formats français et internationaux)
    const phoneRegex = /(?:\+33|0)[1-9](?:[0-9]{8})|(?:\+\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
    const phones = allText.match(phoneRegex) || [];
    data.phone = phones.map(p => this.normalizePhoneNumber(p));

    // Extraire les emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = allText.match(emailRegex) || [];
    data.email = emails.map(e => this.normalizeEmail(e));

    // Extraire les SIRET (14 chiffres)
    const siretRegex = /\b\d{14}\b/g;
    const sirets = allText.match(siretRegex) || [];
    data.siret = sirets.map(s => this.normalizeSiret(s));

    // Extraire les SIREN (9 chiffres)
    const sirenRegex = /\b\d{9}\b/g;
    const sirens = allText.match(sirenRegex) || [];
    data.siren = sirens.map(s => this.normalizeSiret(s));

    // Extraire les plaques d'immatriculation françaises
    const registrationRegex = /\b[A-Z]{2}[-\s]?\d{3}[-\s]?[A-Z]{2}\b|\b\d{1,4}[-\s]?[A-Z]{1,3}[-\s]?\d{2}\b/g;
    const registrations = allText.match(registrationRegex) || [];
    data.registration = registrations.map(r => this.normalizeRegistration(r));

    // Extraire les codes postaux français
    const postalCodeRegex = /\b\d{5}\b/g;
    const postalCodes = allText.match(postalCodeRegex) || [];
    data.postalCode = postalCodes;

    // Extraire les IBAN
    const ibanRegex = /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}[A-Z0-9]{1,23}\b/g;
    const ibans = allText.match(ibanRegex) || [];
    data.iban = ibans.map(i => this.normalizeIban(i));

    // Extraire les noms depuis les métadonnées si disponibles
    if (item.metadata) {
      if (item.metadata.firstName) data.firstName.push(this.normalizeName(item.metadata.firstName));
      if (item.metadata.lastName) data.lastName.push(this.normalizeName(item.metadata.lastName));
      if (item.metadata.fullName) data.fullName.push(this.normalizeName(item.metadata.fullName));
      if (item.metadata.address) data.address.push(this.normalizeAddress(item.metadata.address));
      if (item.metadata.city) data.city.push(this.normalizeName(item.metadata.city));
    }

    // Extraire les noms depuis le titre (heuristique)
    if (item.type === 'interlocutor' || item.type === 'user') {
      const titleParts = item.title.split(' ');
      if (titleParts.length >= 2) {
        data.firstName.push(this.normalizeName(titleParts[0]));
        data.lastName.push(this.normalizeName(titleParts.slice(1).join(' ')));
        data.fullName.push(this.normalizeName(item.title));
      }
    }

    // Consolider dans 'all'
    Object.values(data).forEach(values => {
      data.all.push(...values);
    });

    return data;
  }

  // Calculer la similarité entre deux chaînes (distance de Levenshtein normalisée)
  static calculateSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;

    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return 1 - (matrix[len1][len2] / maxLen);
  }

  // Recherche par données personnelles
  static searchPersonalData(
    items: SearchableItem[], 
    options: PersonalDataSearchOptions
  ): PersonalDataMatch[] {
    const { query, searchFields = ['all'], exactMatch = false, fuzzySearch = true } = options;
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) return [];

    const matches: PersonalDataMatch[] = [];

    items.forEach(item => {
      const personalData = this.extractPersonalData(item);
      const matchedFields: PersonalDataMatch['matchedFields'] = [];
      let overallConfidence = 0;

      searchFields.forEach(field => {
        const fieldData = personalData[field] || [];
        
        fieldData.forEach(value => {
          let confidence = 0;
          let position = -1;

          if (exactMatch) {
            // Correspondance exacte
            if (field === 'phone') {
              const normalizedValue = this.normalizePhoneNumber(value);
              const normalizedQueryPhone = this.normalizePhoneNumber(normalizedQuery);
              if (normalizedValue === normalizedQueryPhone) {
                confidence = 1.0;
                position = 0;
              }
            } else if (field === 'email') {
              const normalizedValue = this.normalizeEmail(value);
              const normalizedQueryEmail = this.normalizeEmail(normalizedQuery);
              if (normalizedValue === normalizedQueryEmail) {
                confidence = 1.0;
                position = 0;
              }
            } else {
              const normalizedValue = this.normalizeName(value);
              const normalizedQueryName = this.normalizeName(normalizedQuery);
              if (normalizedValue === normalizedQueryName) {
                confidence = 1.0;
                position = 0;
              }
            }
          } else {
            // Recherche flexible
            if (field === 'phone') {
              const normalizedValue = this.normalizePhoneNumber(value);
              const normalizedQueryPhone = this.normalizePhoneNumber(normalizedQuery);
              
              if (normalizedValue.includes(normalizedQueryPhone) || normalizedQueryPhone.includes(normalizedValue)) {
                confidence = 0.9;
                position = normalizedValue.indexOf(normalizedQueryPhone);
              } else if (fuzzySearch) {
                confidence = this.calculateSimilarity(normalizedValue, normalizedQueryPhone);
                if (confidence < 0.7) confidence = 0;
              }
            } else if (field === 'email') {
              const normalizedValue = this.normalizeEmail(value);
              const normalizedQueryEmail = this.normalizeEmail(normalizedQuery);
              
              if (normalizedValue.includes(normalizedQueryEmail)) {
                confidence = 0.95;
                position = normalizedValue.indexOf(normalizedQueryEmail);
              } else if (fuzzySearch) {
                confidence = this.calculateSimilarity(normalizedValue, normalizedQueryEmail);
                if (confidence < 0.8) confidence = 0;
              }
            } else {
              const normalizedValue = this.normalizeName(value);
              const normalizedQueryName = this.normalizeName(normalizedQuery);
              
              if (normalizedValue.includes(normalizedQueryName)) {
                confidence = 0.9;
                position = normalizedValue.indexOf(normalizedQueryName);
              } else if (fuzzySearch) {
                confidence = this.calculateSimilarity(normalizedValue, normalizedQueryName);
                if (confidence < 0.6) confidence = 0;
              }
            }
          }

          if (confidence > 0) {
            matchedFields.push({
              field,
              value,
              confidence,
              position: position >= 0 ? position : undefined
            });
            overallConfidence = Math.max(overallConfidence, confidence);
          }
        });
      });

      if (matchedFields.length > 0) {
        matches.push({
          item,
          matchedFields,
          overallConfidence
        });
      }
    });

    // Trier par confiance décroissante
    return matches.sort((a, b) => b.overallConfidence - a.overallConfidence);
  }

  // Recherche intelligente multi-critères
  static smartSearch(
    items: SearchableItem[],
    query: string,
    options: Partial<PersonalDataSearchOptions> = {}
  ): PersonalDataMatch[] {
    const trimmedQuery = query.trim();
    
    // Détecter automatiquement le type de recherche
    let searchFields: PersonalDataField[] = ['all'];
    let searchOptions: PersonalDataSearchOptions = {
      query: trimmedQuery,
      exactMatch: false,
      fuzzySearch: true,
      ...options
    };

    // Détection automatique du type de données
    if (/^[\+]?[\d\s\-\(\)\.]{8,}$/.test(trimmedQuery)) {
      // Ressemble à un numéro de téléphone
      searchFields = ['phone'];
      searchOptions.exactMatch = false;
    } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedQuery)) {
      // Ressemble à un email
      searchFields = ['email'];
      searchOptions.exactMatch = true;
    } else if (/^\d{14}$/.test(trimmedQuery)) {
      // Ressemble à un SIRET
      searchFields = ['siret'];
      searchOptions.exactMatch = true;
    } else if (/^\d{9}$/.test(trimmedQuery)) {
      // Ressemble à un SIREN
      searchFields = ['siren'];
      searchOptions.exactMatch = true;
    } else if (/^[A-Z]{2}[-\s]?\d{3}[-\s]?[A-Z]{2}$|^\d{1,4}[-\s]?[A-Z]{1,3}[-\s]?\d{2}$/i.test(trimmedQuery)) {
      // Ressemble à une plaque d'immatriculation
      searchFields = ['registration'];
      searchOptions.exactMatch = false;
    } else if (/^\d{5}$/.test(trimmedQuery)) {
      // Ressemble à un code postal
      searchFields = ['postalCode'];
      searchOptions.exactMatch = true;
    } else if (/^[A-Z]{2}\d{2}[A-Z0-9]+$/i.test(trimmedQuery)) {
      // Ressemble à un IBAN
      searchFields = ['iban'];
      searchOptions.exactMatch = true;
    } else if (trimmedQuery.includes(' ')) {
      // Contient des espaces, probablement un nom complet
      searchFields = ['fullName', 'firstName', 'lastName'];
    } else {
      // Recherche générale sur les noms
      searchFields = ['firstName', 'lastName', 'fullName'];
    }

    searchOptions.searchFields = searchFields;
    
    return this.searchPersonalData(items, searchOptions);
  }

  // Suggestions de recherche basées sur les données personnelles
  static generatePersonalDataSuggestions(query: string, items: SearchableItem[]): string[] {
    const suggestions: string[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    if (normalizedQuery.length < 2) return suggestions;

    // Extraire toutes les données personnelles uniques
    const allData = new Set<string>();
    
    items.forEach(item => {
      const personalData = this.extractPersonalData(item);
      Object.values(personalData).forEach(values => {
        values.forEach(value => {
          if (value.toLowerCase().includes(normalizedQuery)) {
            allData.add(value);
          }
        });
      });
    });

    // Convertir en tableau et trier par pertinence
    const sortedSuggestions = Array.from(allData)
      .filter(data => data.toLowerCase().startsWith(normalizedQuery))
      .sort((a, b) => a.length - b.length)
      .slice(0, 5);

    suggestions.push(...sortedSuggestions);

    // Ajouter des suggestions de format si nécessaire
    if (/^\d+$/.test(normalizedQuery)) {
      if (normalizedQuery.length <= 10) {
        suggestions.push(`Rechercher le téléphone "${normalizedQuery}"`);
      }
      if (normalizedQuery.length === 5) {
        suggestions.push(`Rechercher le code postal "${normalizedQuery}"`);
      }
    }

    return suggestions;
  }

  // Valider un format de données personnelles
  static validatePersonalDataFormat(value: string, type: PersonalDataField): boolean {
    switch (type) {
      case 'phone':
        return /^[\+]?[\d\s\-\(\)\.]{8,}$/.test(value);
      case 'email':
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      case 'siret':
        return /^\d{14}$/.test(value.replace(/\s/g, ''));
      case 'siren':
        return /^\d{9}$/.test(value.replace(/\s/g, ''));
      case 'registration':
        return /^[A-Z]{2}[-\s]?\d{3}[-\s]?[A-Z]{2}$|^\d{1,4}[-\s]?[A-Z]{1,3}[-\s]?\d{2}$/i.test(value);
      case 'postalCode':
        return /^\d{5}$/.test(value);
      case 'iban':
        return /^[A-Z]{2}\d{2}[A-Z0-9]+$/i.test(value.replace(/\s/g, ''));
      default:
        return true;
    }
  }
}

export default PersonalDataSearchService;
