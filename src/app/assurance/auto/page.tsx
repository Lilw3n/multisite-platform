'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Car, 
  Shield, 
  Phone, 
  CheckCircle, 
  Star, 
  Calculator, 
  Users, 
  Award,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';

export default function AssuranceAutoPage() {
  const guarantees = [
    {
      name: 'Responsabilité Civile',
      description: 'Obligatoire - Dommages causés aux tiers',
      included: true,
      popular: true
    },
    {
      name: 'Défense Recours',
      description: 'Assistance juridique et défense de vos intérêts',
      included: true,
      popular: true
    },
    {
      name: 'Vol et Incendie',
      description: 'Protection contre le vol et les incendies',
      included: true,
      popular: false
    },
    {
      name: 'Bris de Glace',
      description: 'Réparation ou remplacement des vitres',
      included: true,
      popular: false
    },
    {
      name: 'Assistance 24h/24',
      description: 'Dépannage, remorquage, véhicule de remplacement',
      included: true,
      popular: true
    },
    {
      name: 'Tous Risques',
      description: 'Couverture maximale tous dommages',
      included: false,
      popular: true
    }
  ];

  const profiles = [
    {
      title: 'Conducteur Particulier',
      description: 'Usage personnel et trajets quotidiens',
      price: 'À partir de 29€/mois',
      features: ['Bonus/Malus optimisé', 'Conduite accompagnée', 'Garage assuré']
    },
    {
      title: 'Professionnel VTC/Taxi',
      description: 'Spécialement conçu pour les professionnels',
      price: 'À partir de 89€/mois',
      features: ['Couverture professionnelle', 'Véhicule de remplacement', 'Protection juridique pro'],
      popular: true
    },
    {
      title: 'Flotte d\'Entreprise',
      description: 'Solutions pour parcs de véhicules',
      price: 'Sur devis',
      features: ['Gestion centralisée', 'Tarifs dégressifs', 'Reporting détaillé']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Car className="h-12 w-12 text-blue-300" />
                <span className="text-2xl font-bold">Assurance Auto</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Votre Auto <span className="text-yellow-400">Protégée</span> au Meilleur Prix
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Des solutions d'assurance auto adaptées à tous les profils : particuliers, 
                professionnels VTC/Taxi, flottes d'entreprise. 
                <strong className="text-white"> Économisez jusqu'à 40% </strong> 
                avec notre comparateur IA.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/assurance/devis-intelligent?type=auto"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <Zap className="h-6 w-6" />
                  <span>Devis IA Gratuit</span>
                </Link>
                
                <Link 
                  href="tel:0695820866"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-4 rounded-full text-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Phone className="h-6 w-6" />
                  <span>06 95 82 08 66</span>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-center">Pourquoi nous choisir ?</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Comparaison de +20 assureurs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Devis personnalisé en 3 minutes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Accompagnement expert gratuit</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Gestion sinistres simplifiée</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profils */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solutions par Profil
            </h2>
            <p className="text-xl text-gray-600">
              Des offres spécialement conçues pour vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {profiles.map((profile, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg border-2 hover:shadow-2xl transition-all duration-300 ${
                profile.popular ? 'border-yellow-400' : 'border-gray-200'
              }`}>
                {profile.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-sm font-bold px-4 py-2 rounded-full">
                      ⭐ POPULAIRE
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{profile.title}</h3>
                  <p className="text-gray-600 mb-4">{profile.description}</p>
                  
                  <div className="text-2xl font-bold text-blue-600 mb-6">{profile.price}</div>
                  
                  <ul className="space-y-2 mb-8">
                    {profile.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href={`/assurance/devis-intelligent?type=auto&profile=${profile.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Obtenir un devis</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Garanties
            </h2>
            <p className="text-xl text-gray-600">
              Une protection complète pour tous vos déplacements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guarantees.map((guarantee, index) => (
              <div key={index} className={`bg-white rounded-xl p-6 shadow-lg border-2 ${
                guarantee.popular ? 'border-blue-200 bg-blue-50' : 'border-gray-100'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-900">{guarantee.name}</h3>
                  <div className="flex items-center space-x-2">
                    {guarantee.included && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {guarantee.popular && (
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spécialité VTC/Taxi */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Spécialiste <span className="text-yellow-400">VTC & Taxi</span>
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Fort de notre expertise dans le transport de personnes, nous proposons 
                des solutions d'assurance spécialement adaptées aux professionnels VTC et Taxi.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
                  <div className="text-purple-200">Chauffeurs assurés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">15 ans</div>
                  <div className="text-purple-200">D'expérience</div>
                </div>
              </div>
              
              <Link 
                href="/assurance/devis-intelligent?type=auto&profile=vtc"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
              >
                <Target className="h-6 w-6" />
                <span>Devis VTC/Taxi</span>
              </Link>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="font-bold text-lg mb-3">✅ Avantages VTC/Taxi</h4>
                <ul className="space-y-2 text-purple-100">
                  <li>• Couverture activité professionnelle</li>
                  <li>• Véhicule de remplacement garanti</li>
                  <li>• Protection juridique spécialisée</li>
                  <li>• Assistance 24h/24 prioritaire</li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="font-bold text-lg mb-3">💰 Tarifs Préférentiels</h4>
                <ul className="space-y-2 text-purple-100">
                  <li>• Remises flotte à partir de 3 véhicules</li>
                  <li>• Bonus fidélité progressif</li>
                  <li>• Paiement mensuel sans frais</li>
                  <li>• Pas de frais de dossier</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Prêt à économiser sur votre assurance auto ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Notre IA compare +20 assureurs pour vous proposer la meilleure offre en 3 minutes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/assurance/devis-intelligent?type=auto"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Calculator className="h-6 w-6" />
              <span>Devis Gratuit Immédiat</span>
            </Link>
            
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>06 95 82 08 66</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            ✅ Gratuit et sans engagement • ✅ Réponse immédiate • ✅ Accompagnement expert
          </div>
        </div>
      </section>
    </div>
  );
}
