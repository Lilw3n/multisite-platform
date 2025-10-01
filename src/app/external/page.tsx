'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function ExternalHomePage() {
  const [content, setContent] = useState<ExternalContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger le contenu depuis le localStorage ou utiliser le contenu par défaut
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
  }, []);

  if (isLoading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🏠 DiddyHome</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/external/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Connexion
              </Link>
              <Link
                href="/external/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {content.heroTitle}
            </h1>
            <h2 className="text-xl md:text-2xl mb-6 text-blue-100">
              {content.heroSubtitle}
            </h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {content.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/external/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {content.ctaButtonText}
              </Link>
              <Link
                href="/external/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {content.servicesTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.servicesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.services.map((service) => (
              <div key={service.id} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {content.whyChooseUsTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.whyChooseUsDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.whyChooseUs.map((item) => (
              <div key={item.id} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content.ctaTitle}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {content.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/external/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {content.ctaButtonText}
            </Link>
            <Link
              href="/external/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl mb-2">📞</div>
              <h3 className="font-semibold mb-1">Téléphone</h3>
              <p>{content.contactInfo.phone}</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📧</div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p>{content.contactInfo.email}</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-semibold mb-1">Adresse</h3>
              <p>{content.contactInfo.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 DiddyHome. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
