'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

interface ExternalContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  servicesTitle: string;
  servicesDescription: string;
  services: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
  }>;
  whyChooseUsTitle: string;
  whyChooseUsDescription: string;
  whyChooseUs: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

export default function ExternalContentManagementPage() {
  const [content, setContent] = useState<ExternalContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const breadcrumb = [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Paramètres', href: '/dashboard/settings' },
    { label: 'Contenu Externe' }
  ];

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    if (typeof window !== 'undefined') {
      const savedContent = localStorage.getItem('external_homepage_content');
      if (savedContent) {
        setContent(JSON.parse(savedContent));
      } else {
        // Contenu par défaut
        setContent({
          heroTitle: "Bienvenue chez DiddyHome",
          heroSubtitle: "Votre partenaire de confiance pour l'assurance VTC et Taxi",
          heroDescription: "Nous vous accompagnons dans la gestion de votre assurance professionnelle avec des solutions adaptées à vos besoins et un service personnalisé.",
          servicesTitle: "Nos Services",
          servicesDescription: "Découvrez notre gamme complète de services d'assurance spécialisés dans le transport de personnes.",
          services: [
            {
              id: '1',
              title: 'Assurance VTC',
              description: 'Protection complète pour votre activité VTC',
              icon: '🚗',
              features: [
                'Garantie responsabilité civile',
                'Protection véhicule',
                'Assistance 24h/24',
                'Tarifs compétitifs'
              ]
            },
            {
              id: '2',
              title: 'Assurance Taxi',
              description: 'Solutions d\'assurance pour chauffeurs de taxi',
              icon: '🚕',
              features: [
                'Couverture professionnelle',
                'Protection passagers',
                'Garantie matériel',
                'Suivi personnalisé'
              ]
            },
            {
              id: '3',
              title: 'Conseil Personnalisé',
              description: 'Accompagnement sur mesure',
              icon: '🤝',
              features: [
                'Analyse de vos besoins',
                'Comparaison des offres',
                'Négociation des tarifs',
                'Suivi régulier'
              ]
            }
          ],
          whyChooseUsTitle: "Pourquoi nous choisir ?",
          whyChooseUsDescription: "Notre expertise et notre engagement font la différence.",
          whyChooseUs: [
            {
              id: '1',
              title: 'Expertise Reconnue',
              description: 'Plus de 10 ans d\'expérience dans l\'assurance VTC/Taxi',
              icon: '⭐'
            },
            {
              id: '2',
              title: 'Service Personnalisé',
              description: 'Un conseiller dédié pour vous accompagner',
              icon: '👤'
            },
            {
              id: '3',
              title: 'Tarifs Compétitifs',
              description: 'Les meilleures offres du marché négociées pour vous',
              icon: '💰'
            },
            {
              id: '4',
              title: 'Réactivité',
              description: 'Réponse rapide à vos demandes et questions',
              icon: '⚡'
            }
          ],
          ctaTitle: "Prêt à nous rejoindre ?",
          ctaDescription: "Contactez-nous dès aujourd'hui pour un devis personnalisé et gratuit.",
          ctaButtonText: "Demander un devis",
          contactInfo: {
            phone: '01 23 45 67 89',
            email: 'contact@diddyhome.com',
            address: '123 Rue de la Paix, 75001 Paris'
          }
        });
      }
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    setIsSaving(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('external_homepage_content', JSON.stringify(content));
        setMessage({ type: 'success', text: 'Contenu sauvegardé avec succès !' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le contenu ?')) {
      loadContent();
      setMessage({ type: 'success', text: 'Contenu réinitialisé' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePreview = () => {
    if (typeof window !== 'undefined') {
      window.open('/external', '_blank');
    }
  };

  const updateContent = (path: string, value: any) => {
    if (!content) return;

    const keys = path.split('.');
    const newContent = { ...content };
    let current: any = newContent;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setContent(newContent);
  };

  const addService = () => {
    if (!content) return;

    const newService = {
      id: Date.now().toString(),
      title: 'Nouveau Service',
      description: 'Description du service',
      icon: '🆕',
      features: ['Fonctionnalité 1', 'Fonctionnalité 2']
    };

    setContent({
      ...content,
      services: [...content.services, newService]
    });
  };

  const removeService = (id: string) => {
    if (!content) return;

    setContent({
      ...content,
      services: content.services.filter(s => s.id !== id)
    });
  };

  const addWhyChooseUs = () => {
    if (!content) return;

    const newItem = {
      id: Date.now().toString(),
      title: 'Nouvelle Raison',
      description: 'Description de la raison',
      icon: '🆕'
    };

    setContent({
      ...content,
      whyChooseUs: [...content.whyChooseUs, newItem]
    });
  };

  const removeWhyChooseUs = (id: string) => {
    if (!content) return;

    setContent({
      ...content,
      whyChooseUs: content.whyChooseUs.filter(item => item.id !== id)
    });
  };

  if (isLoading) {
    return (
      <Layout
        title="Gestion du Contenu Externe"
        subtitle="Personnalisez la page d'accueil des utilisateurs externes"
        breadcrumb={breadcrumb}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!content) {
    return (
      <Layout
        title="Gestion du Contenu Externe"
        subtitle="Personnalisez la page d'accueil des utilisateurs externes"
        breadcrumb={breadcrumb}
      >
        <div className="text-center py-12">
          <p className="text-gray-500">Erreur lors du chargement du contenu</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Gestion du Contenu Externe"
      subtitle="Personnalisez la page d'accueil des utilisateurs externes"
      breadcrumb={breadcrumb}
      actions={
        <div className="flex space-x-3">
          <button
            onClick={handlePreview}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            👁️ Aperçu
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            🔄 Réinitialiser
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {isSaving ? 'Sauvegarde...' : '💾 Sauvegarder'}
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Section Hero</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre principal</label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => updateContent('heroTitle', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
              <input
                type="text"
                value={content.heroSubtitle}
                onChange={(e) => updateContent('heroSubtitle', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={content.heroDescription}
                onChange={(e) => updateContent('heroDescription', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Section Services</h3>
            <button
              onClick={addService}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              + Ajouter un service
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la section</label>
                <input
                  type="text"
                  value={content.servicesTitle}
                  onChange={(e) => updateContent('servicesTitle', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description de la section</label>
                <input
                  type="text"
                  value={content.servicesDescription}
                  onChange={(e) => updateContent('servicesDescription', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {content.services.map((service, index) => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Service {index + 1}</h4>
                    <button
                      onClick={() => removeService(service.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const newServices = [...content.services];
                          newServices[index].title = e.target.value;
                          setContent({ ...content, services: newServices });
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
                      <input
                        type="text"
                        value={service.icon}
                        onChange={(e) => {
                          const newServices = [...content.services];
                          newServices[index].icon = e.target.value;
                          setContent({ ...content, services: newServices });
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...content.services];
                          newServices[index].description = e.target.value;
                          setContent({ ...content, services: newServices });
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={content.contactInfo.phone}
                onChange={(e) => updateContent('contactInfo.phone', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={content.contactInfo.email}
                onChange={(e) => updateContent('contactInfo.email', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                value={content.contactInfo.address}
                onChange={(e) => updateContent('contactInfo.address', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
