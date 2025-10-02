import { Product, ProductCategory, ProductType, ProductStatus, ProductCommission, ProductPricing } from '@/types/product';

// Données fictives pour les produits
const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Assurance Auto VTC/Taxi',
    description: 'Assurance automobile spécialisée pour les véhicules de transport avec chauffeur (VTC) et taxis',
    category: 'assurance-auto',
    type: 'premium',
    status: 'actif',
    price: 1200,
    currency: 'EUR',
    commission: 15,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin',
    commercialInfo: {
      targetAudience: ['VTC', 'Taxi', 'Transport professionnel'],
      salesChannels: ['Direct', 'Partenaires', 'Apporteurs d\'affaire'],
      marketingMaterials: ['Brochure VTC', 'Plaquette commerciale', 'Présentation PowerPoint'],
      trainingRequired: true,
      certificationNeeded: ['Formation assurance transport', 'Certification ORIAS']
    },
    projects: ['proj-1', 'proj-2'],
    contracts: ['contract-1', 'contract-2'],
    quotes: ['quote-1', 'quote-2'],
    partners: ['partner-1'],
    apporteursAffaire: ['apporteur-1']
  },
  {
    id: 'prod-2',
    name: 'Pack Assurance Entreprise',
    description: 'Pack complet d\'assurances pour les entreprises : RC, multirisque, cyber, etc.',
    category: 'assurance-entreprise',
    type: 'pack',
    status: 'actif',
    price: 2500,
    currency: 'EUR',
    commission: 12,
    isActive: true,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    createdBy: 'admin',
    commercialInfo: {
      targetAudience: ['PME', 'Startups', 'Entreprises établies'],
      salesChannels: ['Direct', 'Partenaires', 'Courtiers'],
      marketingMaterials: ['Catalogue entreprise', 'Calculateur en ligne', 'Études de cas'],
      trainingRequired: true,
      certificationNeeded: ['Formation assurance entreprise', 'Certification ORIAS']
    },
    projects: ['proj-3'],
    contracts: ['contract-3'],
    quotes: ['quote-3'],
    partners: ['partner-2'],
    apporteursAffaire: []
  },
  {
    id: 'prod-3',
    name: 'Assurance Santé Individuelle',
    description: 'Complémentaire santé individuelle avec garanties étendues',
    category: 'assurance-sante',
    type: 'standard',
    status: 'actif',
    price: 800,
    currency: 'EUR',
    commission: 8,
    isActive: true,
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    createdBy: 'admin',
    commercialInfo: {
      targetAudience: ['Particuliers', 'Familles', 'Professionnels libéraux'],
      salesChannels: ['Direct', 'Partenaires', 'Comparateurs'],
      marketingMaterials: ['Guide santé', 'Simulateur de cotisation', 'Témoignages clients'],
      trainingRequired: false,
      certificationNeeded: ['Certification ORIAS']
    },
    projects: ['proj-4'],
    contracts: ['contract-4'],
    quotes: ['quote-4'],
    partners: ['partner-3'],
    apporteursAffaire: ['apporteur-2']
  }
];

const mockCommissions: ProductCommission[] = [
  {
    id: 'comm-1',
    productId: 'prod-1',
    partnerId: 'partner-1',
    commissionRate: 15,
    minVolume: 0,
    maxVolume: 100000,
    startDate: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'comm-2',
    productId: 'prod-1',
    partnerId: 'partner-1',
    apporteurAffaireId: 'apporteur-1',
    commissionRate: 5,
    minVolume: 0,
    maxVolume: 50000,
    startDate: '2024-01-01T00:00:00Z',
    isActive: true
  }
];

const mockPricing: ProductPricing[] = [
  {
    id: 'pricing-1',
    productId: 'prod-1',
    basePrice: 1200,
    currency: 'EUR',
    pricingTiers: [
      {
        name: 'Débutant',
        minQuantity: 1,
        maxQuantity: 5,
        price: 1200,
        description: 'Pour les nouveaux VTC'
      },
      {
        name: 'Confirmé',
        minQuantity: 6,
        maxQuantity: 20,
        price: 1000,
        description: 'Réduction pour volume'
      },
      {
        name: 'Expert',
        minQuantity: 21,
        price: 800,
        description: 'Tarif préférentiel'
      }
    ],
    discounts: [
      {
        id: 'discount-1',
        name: 'Première année',
        type: 'percentage',
        value: 20,
        conditions: ['Nouveau client', 'Engagement 2 ans'],
        validFrom: '2024-01-01T00:00:00Z',
        validTo: '2024-12-31T23:59:59Z',
        isActive: true
      }
    ],
    validFrom: '2024-01-01T00:00:00Z'
  }
];

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...mockProducts];
  }

  static async getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.find(product => product.id === id) || null;
  }

  static async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockProducts.push(newProduct);
    return newProduct;
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockProducts.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return mockProducts[index];
  }

  static async deleteProduct(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockProducts.findIndex(product => product.id === id);
    if (index === -1) return false;
    
    mockProducts.splice(index, 1);
    return true;
  }

  static async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.filter(product => product.category === category);
  }

  static async getProductsByPartner(partnerId: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.filter(product => product.partners.includes(partnerId));
  }

  static async getProductsByApporteurAffaire(apporteurId: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.filter(product => product.apporteursAffaire.includes(apporteurId));
  }

  static async getCommissions(productId: string): Promise<ProductCommission[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockCommissions.filter(comm => comm.productId === productId);
  }

  static async getPricing(productId: string): Promise<ProductPricing | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockPricing.find(pricing => pricing.productId === productId) || null;
  }

  static async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const lowercaseQuery = query.toLowerCase();
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  static getCategories(): ProductCategory[] {
    return [
      'assurance-auto',
      'assurance-habitation', 
      'assurance-sante',
      'assurance-vie',
      'assurance-professionnelle',
      'assurance-voyage',
      'assurance-entreprise',
      'autre'
    ];
  }

  static getTypes(): ProductType[] {
    return ['standard', 'premium', 'sur-mesure', 'pack', 'service'];
  }

  static getStatuses(): ProductStatus[] {
    return ['en-developpement', 'actif', 'suspendu', 'archive', 'en-test'];
  }
}
