'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Car, 
  Home, 
  Heart, 
  Briefcase, 
  Plane, 
  Calculator, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Award, 
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Zap,
  Target,
  Brain
} from 'lucide-react';

export default function AssurancePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const insuranceTypes = [
    {
      id: 'auto',
      title: 'Assurance Auto',
      icon: Car,
      description: 'Protection complète pour votre véhicule personnel ou professionnel',
      features: ['Responsabilité civile', 'Défense recours', 'Assistance 24/7', 'Vol et incendie'],
      startingPrice: 'À partir de 29€/mois',
      popular: true,
      color: 'from-blue-500 to-blue-600',
      href: '/assurance/auto'
    },
    {
      id: 'habitation',
      title: 'Assurance Habitation',
      icon: Home,
      description: 'Protégez votre logement et vos biens en toute sérénité',
      features: ['Incendie et dégâts des eaux', 'Vol et vandalisme', 'Responsabilité civile', 'Assistance dépannage'],
      startingPrice: 'À partir de 12€/mois',
      popular: false,
      color: 'from-green-500 to-green-600',
      href: '/assurance/habitation'
    },
    {
      id: 'sante',
      title: 'Assurance Santé',
      icon: Heart,
      description: 'Couverture santé adaptée à vos besoins et votre budget',
      features: ['Remboursements optimisés', 'Réseau de soins', 'Téléconsultation', 'Médecines douces'],
      startingPrice: 'À partir de 25€/mois',
      popular: false,
      color: 'from-red-500 to-pink-600',
      href: '/assurance/sante'
    },
    {
      id: 'professionnelle',
      title: 'Assurance Pro',
      icon: Briefcase,
      description: 'Solutions dédiées aux professionnels et entreprises',
      features: ['RC Professionnelle', 'Protection juridique', 'Cyber-risques', 'Perte d\'exploitation'],
      startingPrice: 'À partir de 35€/mois',
      popular: true,
      color: 'from-purple-500 to-purple-600',
      href: '/assurance/professionnelle'
    },
    {
      id: 'vie',
      title: 'Assurance Vie',
      icon: Shield,
      description: 'Épargne et protection pour vous et vos proches',
      features: ['Épargne défiscalisée', 'Capital garanti', 'Transmission optimisée', 'Rentes viagères'],
      startingPrice: 'À partir de 50€/mois',
      popular: false,
      color: 'from-yellow-500 to-orange-600',
      href: '/assurance/vie'
    },
    {
      id: 'voyage',
      title: 'Assurance Voyage',
      icon: Plane,
      description: 'Voyagez l\'esprit tranquille partout dans le monde',
      features: ['Frais médicaux', 'Rapatriement', 'Annulation voyage', 'Bagages'],
      startingPrice: 'À partir de 15€/voyage',
      popular: false,
      color: 'from-indigo-500 to-blue-600',
      href: '/assurance/voyage'
    }
  ];

  const advantages = [
    {
      icon: Brain,
      title: 'IA Personnalisée',
      description: 'Notre intelligence artificielle analyse votre profil pour vous proposer les meilleures solutions'
    },
    {
      icon: Calculator,
      title: 'Devis Instantané',
      description: 'Obtenez votre devis personnalisé en moins de 3 minutes avec notre questionnaire intelligent'
    },
    {
      icon: Users,
      title: 'Courtier Expert',
      description: '15+ ans d\'expérience dans l\'assurance pour vous accompagner dans vos choix'
    },
    {
      icon: Award,
      title: 'Meilleurs Tarifs',
      description: 'Nous négocions pour vous les meilleures conditions auprès de nos partenaires assureurs'
    },
    {
      icon: Phone,
      title: 'Support 7j/7',
      description: 'Une équipe dédiée pour répondre à toutes vos questions et gérer vos sinistres'
    },
    {
      icon: CheckCircle,
      title: '100% Digital',
      description: 'Souscription, gestion et sinistres entièrement dématérialisés pour plus de simplicité'
    }
  ];

  const testimonials = [
    {
      name: 'Marie L.',
      role: 'Chauffeur VTC',
      rating: 5,
      comment: 'Grâce à DiddyHome, j\'ai économisé 300€ sur mon assurance auto pro. Le service est top !',
      avatar: '👩‍💼'
    },
    {
      name: 'Pierre M.',
      role: 'Entrepreneur',
      rating: 5,
      comment: 'L\'IA a trouvé exactement ce qu\'il me fallait pour mon entreprise. Très impressionnant.',
      avatar: '👨‍💻'
    },
    {
      name: 'Sophie D.',
      role: 'Particulier',
      rating: 5,
      comment: 'Processus ultra-rapide et tarifs imbattables. Je recommande vivement !',
      avatar: '👩‍🦰'
    }
  ];

  const stats = [
    { value: '15,000+', label: 'Clients satisfaits' },
    { value: '98%', label: 'Taux de satisfaction' },
    { value: '24h', label: 'Délai de souscription' },
    { value: '30%', label: 'Économies moyennes' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              L'Assurance <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Intelligente</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Notre IA analyse votre profil en temps réel pour vous proposer les meilleures solutions d'assurance. 
              <strong className="text-white"> Économisez jusqu'à 40% </strong> sur vos contrats !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/assurance/devis-intelligent"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <Brain className="h-6 w-6" />
                <span>Devis IA Gratuit</span>
              </Link>
              
              <Link 
                href="#types-assurance"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-4 rounded-full text-lg transition-all flex items-center space-x-2"
              >
                <Calculator className="h-6 w-6" />
                <span>Découvrir nos offres</span>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                  <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Types d'assurance */}
      <section id="types-assurance" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Toutes vos assurances en un seul endroit
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des solutions sur-mesure pour chaque besoin, avec l'expertise d'un courtier et la puissance de l'IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insuranceTypes.map((type) => (
              <div key={type.id} className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {type.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      POPULAIRE
                    </span>
                  </div>
                )}
                
                <div className={`h-2 bg-gradient-to-r ${type.color}`}></div>
                
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${type.color} text-white mr-4`}>
                      <type.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{type.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{type.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{type.startingPrice}</div>
                      <div className="text-xs text-gray-500">Prix indicatif</div>
                    </div>
                    
                    <Link 
                      href={type.href}
                      className={`bg-gradient-to-r ${type.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all group-hover:scale-105 flex items-center space-x-2`}
                    >
                      <span>Devis</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir DiddyHome ?
            </h2>
            <p className="text-xl text-gray-600">
              L'innovation au service de votre protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-xl w-fit mb-6">
                  <advantage.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{advantage.title}</h3>
                <p className="text-gray-600 leading-relaxed">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez l'expérience de nos clients satisfaits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à économiser sur vos assurances ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Notre IA analyse votre profil gratuitement et vous propose les meilleures solutions en moins de 3 minutes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/assurance/devis-intelligent"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Zap className="h-6 w-6" />
              <span>Démarrer mon analyse IA</span>
            </Link>
            
            <div className="flex items-center space-x-4 text-blue-200">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>06 95 82 08 66</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>contact@diddyhome.com</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-blue-200">
            ✅ Gratuit et sans engagement • ✅ Réponse immédiate • ✅ Données sécurisées
          </div>
        </div>
      </section>
    </div>
  );
}
