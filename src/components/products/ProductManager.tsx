'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Archive
} from 'lucide-react';
import { Product, ProductCategory, ProductType, ProductStatus } from '@/types/product';
import { ProductService } from '@/lib/productService';
import Modal from '@/components/ui/Modal';

interface ProductManagerProps {
  onProductSelect?: (product: Product) => void;
  showActions?: boolean;
  filterByPartner?: string;
  filterByApporteurAffaire?: string;
}

export default function ProductManager({ 
  onProductSelect, 
  showActions = true,
  filterByPartner,
  filterByApporteurAffaire 
}: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [filterByPartner, filterByApporteurAffaire]);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, selectedType, selectedStatus]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let data: Product[];
      
      if (filterByPartner) {
        data = await ProductService.getProductsByPartner(filterByPartner);
      } else if (filterByApporteurAffaire) {
        data = await ProductService.getProductsByApporteurAffaire(filterByApporteurAffaire);
      } else {
        data = await ProductService.getAllProducts();
      }
      
      setProducts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(product => product.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }

    setFilteredProducts(filtered);
  };

  const handleProductSelect = (product: Product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowCreateModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowCreateModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await ProductService.deleteProduct(productId);
        await loadProducts();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getStatusIcon = (status: ProductStatus) => {
    switch (status) {
      case 'actif':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'en-developpement':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'suspendu':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-gray-600" />;
      case 'en-test':
        return <Star className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'en-developpement':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspendu':
        return 'bg-red-100 text-red-800';
      case 'archive':
        return 'bg-gray-100 text-gray-800';
      case 'en-test':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: ProductType) => {
    switch (type) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'sur-mesure':
        return 'bg-orange-100 text-orange-800';
      case 'pack':
        return 'bg-green-100 text-green-800';
      case 'service':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Produits</h2>
          <p className="text-gray-600">{filteredProducts.length} produit(s) trouvé(s)</p>
        </div>
        
        {showActions && (
          <button
            onClick={handleCreateProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau produit</span>
          </button>
        )}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | 'all')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            {ProductService.getCategories().map(category => (
              <option key={category} value={category}>
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ProductType | 'all')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            {ProductService.getTypes().map(type => (
              <option key={type} value={type}>
                {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>

          {/* Statut */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ProductStatus | 'all')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            {ProductService.getStatuses().map(status => (
              <option key={status} value={status}>
                {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleProductSelect(product)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              </div>
              
              {showActions && (
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProduct(product);
                    }}
                    className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product.id);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {/* Statut et type */}
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(product.status)}`}>
                  {getStatusIcon(product.status)}
                  <span>{product.status.replace('-', ' ')}</span>
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(product.type)}`}>
                  {product.type.replace('-', ' ')}
                </span>
              </div>

              {/* Prix et commission */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-green-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">{product.price} {product.currency}</span>
                </div>
                {product.commission && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">{product.commission}%</span>
                  </div>
                )}
              </div>

              {/* Partenaires et apporteurs */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{product.partners.length} partenaire(s)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{product.apporteursAffaire.length} apporteur(s)</span>
                </div>
              </div>

              {/* Projets liés */}
              {product.projects.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{product.projects.length}</span> projet(s) lié(s)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun produit */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
          <p className="text-gray-600">
            {searchQuery || selectedCategory !== 'all' || selectedType !== 'all' || selectedStatus !== 'all'
              ? 'Essayez de modifier vos critères de recherche'
              : 'Commencez par créer votre premier produit'
            }
          </p>
        </div>
      )}

      {/* Modal de création/édition */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={editingProduct ? "Modifier le produit" : "Nouveau produit"}
          size="lg"
          enableKeyboard={true}
        >
          <ProductForm
            product={editingProduct}
            onSave={(product) => {
              setShowCreateModal(false);
              setEditingProduct(null);
              loadProducts();
            }}
            onCancel={() => {
              setShowCreateModal(false);
              setEditingProduct(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

// Composant de formulaire pour les produits
function ProductForm({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product: Product | null; 
  onSave: (product: Product) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'assurance-auto' as ProductCategory,
    type: product?.type || 'standard' as ProductType,
    status: product?.status || 'en-developpement' as ProductStatus,
    price: product?.price || 0,
    currency: product?.currency || 'EUR',
    commission: product?.commission || 0,
    isActive: product?.isActive ?? true,
    commercialInfo: {
      targetAudience: product?.commercialInfo.targetAudience || [],
      salesChannels: product?.commercialInfo.salesChannels || [],
      marketingMaterials: product?.commercialInfo.marketingMaterials || [],
      trainingRequired: product?.commercialInfo.trainingRequired || false,
      certificationNeeded: product?.commercialInfo.certificationNeeded || []
    }
  });

  const [newTargetAudience, setNewTargetAudience] = useState('');
  const [newSalesChannel, setNewSalesChannel] = useState('');
  const [newMarketingMaterial, setNewMarketingMaterial] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        projects: product?.projects || [],
        contracts: product?.contracts || [],
        quotes: product?.quotes || [],
        partners: product?.partners || [],
        apporteursAffaire: product?.apporteursAffaire || [],
        createdBy: 'admin' // En production, utiliser l'utilisateur connecté
      };

      if (product) {
        await ProductService.updateProduct(product.id, productData);
      } else {
        await ProductService.createProduct(productData);
      }
      
      onSave(productData as Product);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const addToArray = (field: string, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        commercialInfo: {
          ...prev.commercialInfo,
          [field]: [...(prev.commercialInfo as any)[field], value.trim()]
        }
      }));
      setter('');
    }
  };

  const removeFromArray = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      commercialInfo: {
        ...prev.commercialInfo,
        [field]: (prev.commercialInfo as any)[field].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {ProductService.getCategories().map(category => (
              <option key={category} value={category}>
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ProductType }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {ProductService.getTypes().map(type => (
              <option key={type} value={type}>
                {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProductStatus }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {ProductService.getStatuses().map(status => (
              <option key={status} value={status}>
                {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <select
              value={formData.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Commission (%)</label>
          <input
            type="number"
            value={formData.commission}
            onChange={(e) => setFormData(prev => ({ ...prev, commission: parseFloat(e.target.value) || 0 }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max="100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Informations commerciales */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations commerciales</h3>
        
        <div className="space-y-4">
          {/* Public cible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Public cible</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.commercialInfo.targetAudience.map((audience, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{audience}</span>
                  <button
                    type="button"
                    onClick={() => removeFromArray('targetAudience', index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTargetAudience}
                onChange={(e) => setNewTargetAudience(e.target.value)}
                placeholder="Ajouter un public cible"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => addToArray('targetAudience', newTargetAudience, setNewTargetAudience)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Canaux de vente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Canaux de vente</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.commercialInfo.salesChannels.map((channel, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{channel}</span>
                  <button
                    type="button"
                    onClick={() => removeFromArray('salesChannels', index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSalesChannel}
                onChange={(e) => setNewSalesChannel(e.target.value)}
                placeholder="Ajouter un canal de vente"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => addToArray('salesChannels', newSalesChannel, setNewSalesChannel)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {product ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}
