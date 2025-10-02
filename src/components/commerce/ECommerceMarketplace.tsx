'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MapPin, 
  Truck, 
  Shield, 
  CreditCard,
  Plus,
  Minus,
  Eye,
  Share2,
  MessageCircle,
  ThumbsUp,
  Award,
  Verified,
  Clock,
  Package,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Info,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Percent,
  Tag,
  Gift,
  Crown,
  Flame
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    totalSales: number;
    isVerified: boolean;
    responseTime: string;
    location: string;
  };
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  shipping: {
    free: boolean;
    cost: number;
    estimatedDays: string;
    methods: string[];
  };
  features: string[];
  specifications: { [key: string]: string };
  tags: string[];
  isSponsored: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFlashSale: boolean;
  flashSaleEnd?: string;
}

interface CartItem {
  productId: string;
  quantity: number;
  selectedVariant?: string;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  date: string;
  verified: boolean;
  helpful: number;
  variant?: string;
}

export default function ECommerceMarketplace() {
  const [activeView, setActiveView] = useState<'products' | 'product' | 'cart' | 'seller'>('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Produits mockés
    setProducts([
      {
        id: '1',
        title: 'Kit Assurance VTC Premium - Tout-en-un',
        description: 'Kit complet pour professionnels VTC incluant tous les documents légaux, formations et outils nécessaires pour démarrer votre activité en toute sérénité.',
        price: 299,
        originalPrice: 399,
        discount: 25,
        images: ['📋', '🚗', '📄', '💼'],
        category: 'Services Professionnels',
        subcategory: 'Assurance & Légal',
        seller: {
          id: 'seller1',
          name: 'DiddyHome Pro Services',
          avatar: '🏢',
          rating: 4.9,
          totalSales: 2847,
          isVerified: true,
          responseTime: '< 1h',
          location: 'France'
        },
        rating: 4.8,
        reviewCount: 324,
        stock: 50,
        sold: 1247,
        shipping: {
          free: true,
          cost: 0,
          estimatedDays: '1-2 jours',
          methods: ['Email instantané', 'Courrier suivi']
        },
        features: [
          'Contrat d\'assurance personnalisé',
          'Formation en ligne incluse',
          'Support juridique 24/7',
          'Mise à jour réglementaire gratuite'
        ],
        specifications: {
          'Type': 'Kit numérique + physique',
          'Validité': 'Illimitée',
          'Support': '24/7',
          'Mise à jour': 'Gratuite à vie'
        },
        tags: ['Bestseller', 'Premium', 'Complet'],
        isSponsored: true,
        isBestSeller: true,
        isNewArrival: false,
        isFlashSale: true,
        flashSaleEnd: '2025-01-03 23:59'
      },
      {
        id: '2',
        title: 'Formation Entrepreneur Digital - Masterclass',
        description: 'Formation complète pour devenir entrepreneur digital. 50h de contenu, mentorat personnalisé et accès à la communauté VIP.',
        price: 497,
        originalPrice: 697,
        discount: 29,
        images: ['🎓', '💻', '📚', '🎯'],
        category: 'Formation',
        subcategory: 'Entrepreneuriat',
        seller: {
          id: 'seller2',
          name: 'Marie Expert Coach',
          avatar: '👩‍🏫',
          rating: 4.9,
          totalSales: 1523,
          isVerified: true,
          responseTime: '< 30min',
          location: 'Paris, France'
        },
        rating: 4.9,
        reviewCount: 189,
        stock: 25,
        sold: 456,
        shipping: {
          free: true,
          cost: 0,
          estimatedDays: 'Accès immédiat',
          methods: ['Plateforme en ligne']
        },
        features: [
          '50h de vidéos HD',
          'Mentorat 1-to-1 inclus',
          'Communauté privée VIP',
          'Certificat de réussite'
        ],
        specifications: {
          'Durée': '50 heures',
          'Niveau': 'Débutant à avancé',
          'Accès': 'À vie',
          'Certificat': 'Inclus'
        },
        tags: ['Formation', 'Mentorat', 'Certifiant'],
        isSponsored: false,
        isBestSeller: true,
        isNewArrival: true,
        isFlashSale: false
      },
      {
        id: '3',
        title: 'Outil de Gestion Flotte VTC - Logiciel Pro',
        description: 'Logiciel professionnel de gestion de flotte VTC. Suivi temps réel, optimisation des trajets, facturation automatique.',
        price: 89,
        images: ['📱', '🚗', '📊', '⚡'],
        category: 'Logiciels',
        subcategory: 'Gestion',
        seller: {
          id: 'seller3',
          name: 'TechSolutions SARL',
          avatar: '💻',
          rating: 4.7,
          totalSales: 892,
          isVerified: true,
          responseTime: '< 2h',
          location: 'Lyon, France'
        },
        rating: 4.6,
        reviewCount: 156,
        stock: 100,
        sold: 234,
        shipping: {
          free: false,
          cost: 9.99,
          estimatedDays: 'Téléchargement immédiat',
          methods: ['Licence numérique']
        },
        features: [
          'Suivi GPS temps réel',
          'Facturation automatique',
          'Rapports détaillés',
          'Support technique inclus'
        ],
        specifications: {
          'Plateforme': 'Web + Mobile',
          'Utilisateurs': 'Illimité',
          'Stockage': '10GB inclus',
          'Support': 'Email + Chat'
        },
        tags: ['Logiciel', 'GPS', 'Professionnel'],
        isSponsored: false,
        isBestSeller: false,
        isNewArrival: false,
        isFlashSale: false
      },
      {
        id: '4',
        title: 'Pack Marketing Digital VTC - Templates Pro',
        description: 'Pack complet de templates marketing pour VTC : site web, flyers, cartes de visite, réseaux sociaux. Design professionnel.',
        price: 149,
        originalPrice: 199,
        discount: 25,
        images: ['🎨', '📱', '💳', '🌐'],
        category: 'Marketing',
        subcategory: 'Design',
        seller: {
          id: 'seller4',
          name: 'Creative Studio Pro',
          avatar: '🎨',
          rating: 4.8,
          totalSales: 1156,
          isVerified: true,
          responseTime: '< 1h',
          location: 'Marseille, France'
        },
        rating: 4.7,
        reviewCount: 98,
        stock: 75,
        sold: 345,
        shipping: {
          free: true,
          cost: 0,
          estimatedDays: 'Téléchargement immédiat',
          methods: ['Fichiers numériques']
        },
        features: [
          '50+ templates professionnels',
          'Formats multiples (PSD, AI, PDF)',
          'Personnalisation facile',
          'Licence commerciale incluse'
        ],
        specifications: {
          'Formats': 'PSD, AI, PDF, PNG',
          'Résolution': 'HD et Print',
          'Licence': 'Commerciale',
          'Mises à jour': '1 an gratuit'
        },
        tags: ['Design', 'Templates', 'Marketing'],
        isSponsored: false,
        isBestSeller: false,
        isNewArrival: true,
        isFlashSale: true,
        flashSaleEnd: '2025-01-05 12:00'
      }
    ]);

    // Charger le panier depuis localStorage
    const savedCart = localStorage.getItem('diddyhome_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    const existingItem = cart.find(item => item.productId === productId);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { productId, quantity }];
    }
    
    setCart(newCart);
    localStorage.setItem('diddyhome_cart', JSON.stringify(newCart));
  };

  const handleRemoveFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.productId !== productId);
    setCart(newCart);
    localStorage.setItem('diddyhome_cart', JSON.stringify(newCart));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    const newCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('diddyhome_cart', JSON.stringify(newCart));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.sold - a.sold;
      case 'newest':
        return new Date(b.id).getTime() - new Date(a.id).getTime();
      default:
        return 0;
    }
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  if (activeView === 'product' && selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => setActiveView('products')}
            className="hover:text-blue-600 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux produits</span>
          </button>
          <span>/</span>
          <span>{selectedProduct.category}</span>
          <span>/</span>
          <span className="text-gray-900">{selectedProduct.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Images */}
          <div>
            <div className="bg-gray-100 rounded-lg p-8 mb-4 text-center">
              <div className="text-6xl mb-4">{selectedProduct.images[0]}</div>
              <div className="flex justify-center space-x-2">
                {selectedProduct.images.map((img, index) => (
                  <div key={index} className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl cursor-pointer hover:bg-gray-300">
                    {img}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {selectedProduct.isBestSeller && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <Crown className="w-3 h-3" />
                  <span>Bestseller</span>
                </span>
              )}
              {selectedProduct.isFlashSale && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <Flame className="w-3 h-3" />
                  <span>Vente Flash</span>
                </span>
              )}
              {selectedProduct.isNewArrival && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Nouveau
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.title}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(selectedProduct.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="font-medium">{selectedProduct.rating}</span>
              </div>
              <span className="text-gray-500">({selectedProduct.reviewCount} avis)</span>
              <span className="text-gray-500">•</span>
              <span className="text-green-600 font-medium">{selectedProduct.sold} vendus</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">€{selectedProduct.price}</span>
                {selectedProduct.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">€{selectedProduct.originalPrice}</span>
                    <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                      -{selectedProduct.discount}%
                    </span>
                  </>
                )}
              </div>
              {selectedProduct.isFlashSale && selectedProduct.flashSaleEnd && (
                <div className="mt-2 text-red-600 text-sm flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Vente flash se termine le {selectedProduct.flashSaleEnd}</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Caractéristiques principales</h3>
              <ul className="space-y-2">
                {selectedProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">
                  {selectedProduct.shipping.free ? 'Livraison gratuite' : `Livraison €${selectedProduct.shipping.cost}`}
                </span>
              </div>
              <p className="text-sm text-green-700">
                Délai estimé: {selectedProduct.shipping.estimatedDays}
              </p>
            </div>

            {/* Stock */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  {selectedProduct.stock > 10 
                    ? 'En stock' 
                    : selectedProduct.stock > 0 
                    ? `Plus que ${selectedProduct.stock} en stock` 
                    : 'Rupture de stock'
                  }
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleAddToCart(selectedProduct.id)}
                  disabled={selectedProduct.stock === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Ajouter au panier</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                Acheter maintenant
              </button>
            </div>

            {/* Seller Info */}
            <div className="mt-8 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                  {selectedProduct.seller.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{selectedProduct.seller.name}</h4>
                    {selectedProduct.seller.isVerified && (
                      <Verified className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>⭐ {selectedProduct.seller.rating}</span>
                    <span>{selectedProduct.seller.totalSales} ventes</span>
                    <span>📍 {selectedProduct.seller.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Contacter le vendeur
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Voir la boutique
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Spécifications</h3>
            <div className="space-y-3">
              {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'cart') {
    const cartProducts = cart.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId)!
    })).filter(item => item.product);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panier ({getCartItemCount()})</h1>
          <button
            onClick={() => setActiveView('products')}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continuer les achats</span>
          </button>
        </div>

        {cartProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Votre panier est vide</h3>
            <p className="text-gray-500 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
            <button
              onClick={() => setActiveView('products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartProducts.map((item) => (
              <div key={item.productId} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {item.product.images[0]}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.product.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.product.seller.name}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-gray-900">€{item.product.price}</span>
                      {item.product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">€{item.product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="text-red-600 hover:text-red-700 text-sm mt-1"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">€{getCartTotal().toFixed(2)}</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                Procéder au paiement
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace DiddyHome</h1>
          <p className="text-gray-600">Découvrez des milliers de produits et services professionnels</p>
        </div>
        
        <button
          onClick={() => setActiveView('cart')}
          className="relative bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Panier</span>
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {getCartItemCount()}
            </span>
          )}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher des produits..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Toutes les catégories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="price_low">Prix croissant</option>
                  <option value="price_high">Prix décroissant</option>
                  <option value="rating">Mieux notés</option>
                  <option value="popular">Plus vendus</option>
                  <option value="newest">Plus récents</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Affichage</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {sortedProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
              viewMode === 'list' ? 'flex items-center space-x-6 p-6' : ''
            }`}
            onClick={() => {
              setSelectedProduct(product);
              setActiveView('product');
            }}
          >
            {/* Product Image */}
            <div className={`${viewMode === 'list' ? 'w-32 h-32' : 'h-48'} bg-gray-100 flex items-center justify-center relative`}>
              <div className="text-4xl">{product.images[0]}</div>
              
              {/* Badges */}
              <div className="absolute top-2 left-2 space-y-1">
                {product.isSponsored && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Sponsorisé
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>Bestseller</span>
                  </span>
                )}
              </div>

              {product.discount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className={`font-semibold text-gray-900 ${viewMode === 'list' ? 'text-lg' : 'text-sm'} line-clamp-2`}>
                  {product.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle wishlist
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Heart className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <span className={`font-bold text-gray-900 ${viewMode === 'list' ? 'text-lg' : 'text-sm'}`}>
                  €{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    €{product.originalPrice}
                  </span>
                )}
              </div>

              {product.shipping.free && (
                <div className="flex items-center space-x-1 text-xs text-green-600 mb-2">
                  <Truck className="w-3 h-3" />
                  <span>Livraison gratuite</span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
                    {product.seller.avatar}
                  </div>
                  <span>{product.seller.name}</span>
                  {product.seller.isVerified && (
                    <Verified className="w-3 h-3 text-blue-500" />
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product.id);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Ajouter au panier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
}
