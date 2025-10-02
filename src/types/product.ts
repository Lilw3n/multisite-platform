export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  type: ProductType;
  status: ProductStatus;
  price: number;
  currency: string;
  commission?: number; // Commission pour les apporteurs d'affaire
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Informations commerciales
  commercialInfo: {
    targetAudience: string[];
    salesChannels: string[];
    marketingMaterials: string[];
    trainingRequired: boolean;
    certificationNeeded: string[];
  };
  
  // Relations
  projects: string[]; // IDs des projets utilisant ce produit
  contracts: string[]; // IDs des contrats liés
  quotes: string[]; // IDs des devis liés
  partners: string[]; // IDs des partenaires qui vendent ce produit
  apporteursAffaire: string[]; // IDs des apporteurs d'affaire
}

export type ProductCategory = 
  | 'assurance-auto'
  | 'assurance-habitation'
  | 'assurance-sante'
  | 'assurance-vie'
  | 'assurance-professionnelle'
  | 'assurance-voyage'
  | 'assurance-entreprise'
  | 'autre';

export type ProductType = 
  | 'standard'
  | 'premium'
  | 'sur-mesure'
  | 'pack'
  | 'service';

export type ProductStatus = 
  | 'en-developpement'
  | 'actif'
  | 'suspendu'
  | 'archive'
  | 'en-test';

export interface ProductCommission {
  id: string;
  productId: string;
  partnerId: string;
  apporteurAffaireId?: string;
  commissionRate: number; // Pourcentage
  commissionAmount?: number; // Montant fixe
  minVolume?: number; // Volume minimum pour cette commission
  maxVolume?: number; // Volume maximum pour cette commission
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface ProductPricing {
  id: string;
  productId: string;
  basePrice: number;
  currency: string;
  pricingTiers: PricingTier[];
  discounts: ProductDiscount[];
  validFrom: string;
  validTo?: string;
}

export interface PricingTier {
  name: string;
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  description: string;
}

export interface ProductDiscount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  conditions: string[];
  validFrom: string;
  validTo?: string;
  isActive: boolean;
}
