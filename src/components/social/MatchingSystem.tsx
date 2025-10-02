'use client';

import React, { useState, useEffect } from 'react';
import { Heart, X, Star, MapPin, Clock, Shield, Zap, TrendingUp, Users, Award, MessageCircle, Phone } from 'lucide-react';

interface MatchProfile {
  id: string;
  type: 'client' | 'professional';
  name: string;
  avatar: string;
  age?: number;
  location: {
    city: string;
    distance: number;
  };
  profession: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  premium: boolean;
  images: string[];
  bio: string;
  preferences: {
    serviceType: string[];
    budget: { min: number; max: number };
    availability: string[];
    workingRadius: number;
  };
  stats: {
    completedJobs?: number;
    responseTime?: string;
    successRate?: number;
    clientsSatisfied?: number;
    yearsExperience?: number;
  };
  badges: string[];
  lastActive: string;
  isOnline: boolean;
  matchScore: number;
  mutualConnections: number;
  commonInterests: string[];
}

interface MatchingSystemProps {
  userType: 'client' | 'professional';
  onMatch: (profileId: string, action: 'like' | 'pass') => void;
  onSuperLike: (profileId: string) => void;
  onMessage: (profileId: string) => void;
}

export default function MatchingSystem({ userType, onMatch, onSuperLike, onMessage }: MatchingSystemProps) {
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [lastMatch, setLastMatch] = useState<MatchProfile | null>(null);

  useEffect(() => {
    loadProfiles();
  }, [userType]);

  const loadProfiles = async () => {
    setIsLoading(true);
    
    // Données mockées pour le système de matching
    const mockProfiles: MatchProfile[] = userType === 'client' ? [
      // Profils de professionnels pour les clients
      {
        id: 'pro1',
        type: 'professional',
        name: 'Marie Expert VTC',
        avatar: '👩‍💼',
        age: 32,
        location: { city: 'Paris 15e', distance: 2.3 },
        profession: 'Courtier en Assurance VTC',
        specialties: ['Assurance VTC', 'Optimisation CRM', 'Conseil Fiscal'],
        rating: 4.9,
        reviewCount: 247,
        verified: true,
        premium: true,
        images: ['/pro-marie-1.jpg', '/pro-marie-2.jpg', '/pro-marie-office.jpg'],
        bio: '🚗 Spécialiste assurance VTC depuis 8 ans. J\'aide les chauffeurs à économiser jusqu\'à 40% sur leurs primes tout en optimisant leur couverture. Disponible 7j/7 pour mes clients. 📱',
        preferences: {
          serviceType: ['Assurance VTC', 'Assurance Taxi', 'Conseil'],
          budget: { min: 50, max: 500 },
          availability: ['Lun-Ven 8h-20h', 'Weekend sur RDV'],
          workingRadius: 25
        },
        stats: {
          completedJobs: 1247,
          responseTime: '< 2h',
          successRate: 98,
          clientsSatisfied: 1198,
          yearsExperience: 8
        },
        badges: ['Expert Certifié', 'Top Rated', 'Réponse Rapide', 'Premium'],
        lastActive: '2024-01-16T10:30:00Z',
        isOnline: true,
        matchScore: 96,
        mutualConnections: 12,
        commonInterests: ['VTC Premium', 'Optimisation Fiscale', 'Service Client']
      },
      {
        id: 'pro2',
        type: 'professional',
        name: 'Thomas Mécanicien Mobile',
        avatar: '🔧',
        age: 29,
        location: { city: 'Boulogne', distance: 5.7 },
        profession: 'Mécanicien Spécialisé VTC',
        specialties: ['Entretien VTC', 'Diagnostic', 'Réparation Express'],
        rating: 4.8,
        reviewCount: 189,
        verified: true,
        premium: false,
        images: ['/pro-thomas-1.jpg', '/pro-thomas-work.jpg'],
        bio: '🔧 Mécanicien mobile spécialisé VTC. Intervention à domicile ou sur votre lieu de travail. Diagnostic gratuit, devis transparent, garantie 6 mois. Urgences 24h/7j ! 🚨',
        preferences: {
          serviceType: ['Entretien', 'Réparation', 'Diagnostic'],
          budget: { min: 80, max: 400 },
          availability: ['Lun-Sam 7h-19h', 'Urgences 24h/7j'],
          workingRadius: 30
        },
        stats: {
          completedJobs: 456,
          responseTime: '< 1h',
          successRate: 95,
          clientsSatisfied: 433,
          yearsExperience: 6
        },
        badges: ['Service Mobile', 'Urgences 24h', 'Garantie 6 mois'],
        lastActive: '2024-01-16T09:15:00Z',
        isOnline: true,
        matchScore: 89,
        mutualConnections: 8,
        commonInterests: ['Entretien Préventif', 'Véhicules Premium']
      },
      {
        id: 'pro3',
        type: 'professional',
        name: 'Sophie Formation VTC',
        avatar: '🎓',
        age: 35,
        location: { city: 'Neuilly', distance: 8.2 },
        profession: 'Formatrice VTC Certifiée',
        specialties: ['Formation VTC', 'Préparation Examen', 'Business Coaching'],
        rating: 4.9,
        reviewCount: 312,
        verified: true,
        premium: true,
        images: ['/pro-sophie-1.jpg', '/pro-sophie-class.jpg', '/pro-sophie-cert.jpg'],
        bio: '🎓 Formatrice VTC certifiée avec 95% de taux de réussite. Formation complète : examen + création entreprise + marketing digital. Suivi personnalisé inclus ! 📈',
        preferences: {
          serviceType: ['Formation', 'Coaching', 'Préparation Examen'],
          budget: { min: 200, max: 1500 },
          availability: ['Lun-Ven 9h-18h', 'Formations weekend'],
          workingRadius: 50
        },
        stats: {
          completedJobs: 234,
          responseTime: '< 4h',
          successRate: 95,
          clientsSatisfied: 222,
          yearsExperience: 7
        },
        badges: ['Taux Réussite 95%', 'Centre Agréé', 'Suivi Personnalisé'],
        lastActive: '2024-01-16T08:45:00Z',
        isOnline: false,
        matchScore: 92,
        mutualConnections: 15,
        commonInterests: ['Formation Continue', 'Développement Business']
      }
    ] : [
      // Profils de clients pour les professionnels
      {
        id: 'client1',
        type: 'client',
        name: 'Jean Dupont',
        avatar: '👨',
        age: 38,
        location: { city: 'Paris 16e', distance: 3.1 },
        profession: 'Chauffeur VTC',
        specialties: ['VTC Premium', 'Courses Longues', 'Aéroports'],
        rating: 4.7,
        reviewCount: 89,
        verified: true,
        premium: false,
        images: ['/client-jean-1.jpg', '/client-jean-car.jpg'],
        bio: '🚗 Chauffeur VTC depuis 4 ans, spécialisé dans les courses premium et aéroports. Recherche partenaires fiables pour assurance, entretien et développement business. Sérieux et professionnel ! 💼',
        preferences: {
          serviceType: ['Assurance VTC', 'Entretien', 'Formation'],
          budget: { min: 100, max: 800 },
          availability: ['Lun-Dim 6h-22h'],
          workingRadius: 20
        },
        stats: {
          yearsExperience: 4,
          completedJobs: 2340
        },
        badges: ['VTC Expérimenté', 'Courses Premium', 'Client Sérieux'],
        lastActive: '2024-01-16T11:20:00Z',
        isOnline: true,
        matchScore: 94,
        mutualConnections: 6,
        commonInterests: ['Service Premium', 'Professionnalisme']
      },
      {
        id: 'client2',
        type: 'client',
        name: 'Fatima Transport',
        avatar: '👩',
        age: 31,
        location: { city: 'Clichy', distance: 7.8 },
        profession: 'Gérante Flotte VTC',
        specialties: ['Gestion Flotte', 'Recrutement', 'Optimisation'],
        rating: 4.8,
        reviewCount: 156,
        verified: true,
        premium: true,
        images: ['/client-fatima-1.jpg', '/client-fatima-fleet.jpg'],
        bio: '🚗🚗🚗 Gérante d\'une flotte de 12 véhicules VTC. Recherche partenaires pour assurance groupe, entretien flotte, et formation chauffeurs. Budget conséquent, relation long terme souhaitée ! 📈',
        preferences: {
          serviceType: ['Assurance Flotte', 'Entretien Flotte', 'Formation Équipe'],
          budget: { min: 500, max: 5000 },
          availability: ['Lun-Ven 8h-19h'],
          workingRadius: 40
        },
        stats: {
          yearsExperience: 6,
          completedJobs: 8900
        },
        badges: ['Gestion Flotte', 'Gros Volume', 'Paiement Rapide'],
        lastActive: '2024-01-16T10:05:00Z',
        isOnline: true,
        matchScore: 97,
        mutualConnections: 23,
        commonInterests: ['Gestion Flotte', 'Optimisation Coûts', 'Formation Équipe']
      }
    ];

    setProfiles(mockProfiles);
    setIsLoading(false);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentIndex];
    setSwipeDirection(direction);
    
    setTimeout(() => {
      if (direction === 'right') {
        onMatch(currentProfile.id, 'like');
        // Simuler un match (30% de chance)
        if (Math.random() > 0.7) {
          setLastMatch(currentProfile);
          setShowMatchModal(true);
        }
      } else {
        onMatch(currentProfile.id, 'pass');
      }
      
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const handleSuperLike = () => {
    if (currentIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentIndex];
    onSuperLike(currentProfile.id);
    setLastMatch(currentProfile);
    setShowMatchModal(true);
    setCurrentIndex(prev => prev + 1);
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'En ligne maintenant';
    if (diffInHours < 24) return `Actif il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Actif il y a ${diffInDays}j`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Recherche de profils compatibles...</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Plus de profils pour le moment !</h3>
        <p className="text-gray-600 mb-6">Revenez plus tard pour découvrir de nouveaux {userType === 'client' ? 'professionnels' : 'clients'}.</p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            loadProfiles();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Recharger les profils
        </button>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="max-w-md mx-auto">
      {/* Card */}
      <div className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 ${
        swipeDirection === 'left' ? '-translate-x-full rotate-12' : 
        swipeDirection === 'right' ? 'translate-x-full -rotate-12' : ''
      }`}>
        
        {/* Images */}
        <div className="relative h-96 bg-gradient-to-br from-blue-400 to-purple-500">
          {currentProfile.images.length > 0 ? (
            <img
              src={currentProfile.images[0]}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-6xl">
              {currentProfile.avatar}
            </div>
          )}
          
          {/* Online indicator */}
          {currentProfile.isOnline && (
            <div className="absolute top-4 right-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
          
          {/* Match score */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
            🎯 {currentProfile.matchScore}% compatible
          </div>
          
          {/* Premium badge */}
          {currentProfile.premium && (
            <div className="absolute top-12 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ⭐ Premium
            </div>
          )}
        </div>

        {/* Profile info */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{currentProfile.name}</h2>
                {currentProfile.age && (
                  <span className="text-xl text-gray-600">{currentProfile.age}</span>
                )}
                {currentProfile.verified && (
                  <Shield className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <p className="text-gray-600 font-medium">{currentProfile.profession}</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-bold">{currentProfile.rating}</span>
                <span className="text-gray-500 text-sm">({currentProfile.reviewCount})</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <MapPin className="w-3 h-3" />
                <span>{currentProfile.location.city} • {currentProfile.location.distance}km</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {currentProfile.bio}
          </p>

          {/* Specialties */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Spécialités</h4>
            <div className="flex flex-wrap gap-2">
              {currentProfile.specialties.map((specialty, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          {currentProfile.stats && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Statistiques</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {currentProfile.stats.completedJobs && (
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-600">{currentProfile.stats.completedJobs}</div>
                    <div className="text-gray-500">Missions réalisées</div>
                  </div>
                )}
                {currentProfile.stats.successRate && (
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-600">{currentProfile.stats.successRate}%</div>
                    <div className="text-gray-500">Taux de réussite</div>
                  </div>
                )}
                {currentProfile.stats.responseTime && (
                  <div className="text-center">
                    <div className="font-bold text-lg text-purple-600">{currentProfile.stats.responseTime}</div>
                    <div className="text-gray-500">Temps de réponse</div>
                  </div>
                )}
                {currentProfile.stats.yearsExperience && (
                  <div className="text-center">
                    <div className="font-bold text-lg text-orange-600">{currentProfile.stats.yearsExperience} ans</div>
                    <div className="text-gray-500">D'expérience</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Badges */}
          {currentProfile.badges.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Badges</h4>
              <div className="flex flex-wrap gap-2">
                {currentProfile.badges.map((badge, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mutual connections */}
          {currentProfile.mutualConnections > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentProfile.mutualConnections} connexions en commun
                </span>
              </div>
            </div>
          )}

          {/* Last active */}
          <div className="text-center text-gray-500 text-sm mb-6">
            {formatLastActive(currentProfile.lastActive)}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center space-x-6 mt-6">
        <button
          onClick={() => handleSwipe('left')}
          className="w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-colors shadow-lg"
        >
          <X className="w-6 h-6 text-gray-600 hover:text-red-500" />
        </button>
        
        <button
          onClick={handleSuperLike}
          className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
        >
          <Star className="w-5 h-5 text-white fill-current" />
        </button>
        
        <button
          onClick={() => handleSwipe('right')}
          className="w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-green-300 hover:bg-green-50 transition-colors shadow-lg"
        >
          <Heart className="w-6 h-6 text-gray-600 hover:text-green-500" />
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4 text-gray-500 text-sm">
        <p>← Passer • ⭐ Super Like • Liker →</p>
      </div>

      {/* Match Modal */}
      {showMatchModal && lastMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">C'est un match !</h3>
            <p className="text-gray-600 mb-6">
              Vous et {lastMatch.name} vous êtes likés mutuellement !
            </p>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl">
                {lastMatch.avatar}
              </div>
              <div className="text-2xl">💫</div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl">
                👤
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowMatchModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continuer
              </button>
              <button
                onClick={() => {
                  onMessage(lastMatch.id);
                  setShowMatchModal(false);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Envoyer un message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
