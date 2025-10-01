'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Vehicle {
  id: string;
  registration: string;
  brand: string;
  model: string;
  firstRegistrationDate: string;
  acquisitionDate: string;
  energy: 'Essence' | 'Diesel' | 'Électrique' | 'Hybride' | 'GPL' | 'Autre';
  newPrice: number;
  argusValue: number;
  trim: string;
  sraCode: string;
  status: 'Actif' | 'En attente' | 'Expiré';
  createdAt: string;
  updatedAt: string;
}

interface AssociatedDriver {
  id: string;
  name: string;
  claimsCount: number;
  riskCreatedDate: string;
  status: 'Actif' | 'Inactif';
}

interface EligibilityStudy {
  id: string;
  insurer: string;
  product: string;
  studiedDate: string;
  criteria: number;
  maxCriteria: number;
  status: 'Éligible' | 'Non éligible' | 'En attente';
}

export default function VehicleDetailPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [associatedDrivers, setAssociatedDrivers] = useState<AssociatedDriver[]>([]);
  const [eligibilityStudies, setEligibilityStudies] = useState<EligibilityStudy[]>([]);
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');

      if (!token || !email) {
        router.push('/login');
        return;
      }

      setUser({ email, name: name || 'Utilisateur' });
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    // Mock data pour le véhicule
    const mockVehicle: Vehicle = {
      id: vehicleId,
      registration: 'GP-068-RT',
      brand: 'TESLA',
      model: 'MODEL Y',
      firstRegistrationDate: '21/06/2023',
      acquisitionDate: '15/06/2023',
      energy: 'Électrique',
      newPrice: 55000,
      argusValue: 48000,
      trim: 'Long Range',
      sraCode: 'TESLA-MY-2023',
      status: 'Actif',
      createdAt: '22/09/2025 14:46',
      updatedAt: '22/09/2025 14:46'
    };

    // Mock data pour les chauffeurs associés
    const mockDrivers: AssociatedDriver[] = [
      {
        id: '1',
        name: 'MBAYA Jean',
        claimsCount: 1,
        riskCreatedDate: '22/09/2025',
        status: 'Actif'
      }
    ];

    // Mock data pour les études d'éligibilité
    const mockStudies: EligibilityStudy[] = [
      {
        id: '1',
        insurer: 'Solly azar',
        product: 'Assurance VTC Solly Azar',
        studiedDate: '22/09/2025',
        criteria: 18,
        maxCriteria: 18,
        status: 'Éligible'
      },
      {
        id: '2',
        insurer: 'AXECE',
        product: 'AXECE VTC',
        studiedDate: '22/09/2025',
        criteria: 18,
        maxCriteria: 18,
        status: 'Éligible'
      }
    ];

    setVehicle(mockVehicle);
    setAssociatedDrivers(mockDrivers);
    setEligibilityStudies(mockStudies);
  }, [vehicleId]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
    }
    router.push('/login');
  };

  const navigationItems = [
    { id: 'dashboard', name: 'Tableau de bord', icon: '🏠', href: '/dashboard' },
    { id: 'vehicles', name: 'Véhicules', icon: '🚗', href: '/dashboard/insurance/vehicles' },
    { id: 'drivers', name: 'Chauffeurs', icon: '👨‍💼', href: '/dashboard/insurance/drivers' },
    { id: 'risks', name: 'Risques', icon: '⚠️', href: '/dashboard/insurance/risks' },
    { id: 'challenges', name: 'Challenges', icon: '🎯', href: '/dashboard/challenges' },
    { id: 'studies', name: 'Études', icon: '📊', href: '/dashboard/studies' },
    { id: 'help', name: 'Aide', icon: '❓', href: '/dashboard/help' },
    { id: 'admin', name: 'Administration', icon: '⚙️', href: '/dashboard/admin' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">🚀 Plateforme Multisite</h1>
        </div>
        <nav className="mt-8">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                item.id === 'vehicles'
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Détail véhicule</h1>
                <p className="text-gray-600">Informations complètes du véhicule</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Connecté en tant que {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="mt-4">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li><Link href="/dashboard" className="hover:text-gray-700">Accueil</Link></li>
                <li>/</li>
                <li><Link href="/dashboard/insurance/vehicles" className="hover:text-gray-700">Véhicules</Link></li>
                <li>/</li>
                <li className="text-gray-900 font-medium">{vehicle?.registration}</li>
              </ol>
            </nav>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {vehicle && (
            <div className="space-y-6">
              {/* Vehicle Header */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {vehicle.registration} {vehicle.brand} {vehicle.model} ({vehicle.firstRegistrationDate.split('/')[2]})
                    </h2>
                    <p className="text-gray-600 mt-1">Véhicule {vehicle.energy.toLowerCase()}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        vehicle.status === 'Actif' ? 'bg-green-500' : 
                        vehicle.status === 'En attente' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700">{vehicle.status}</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Modifier
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Informations du véhicule</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Colonne gauche */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Marque</label>
                        <p className="mt-1 text-sm text-gray-900">{vehicle.brand}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Puissance fiscale (CV)</label>
                        <p className="mt-1 text-sm text-gray-900">6</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Classe SRA</label>
                        <p className="mt-1 text-sm text-gray-900">-</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de création</label>
                        <p className="mt-1 text-sm text-gray-900">{vehicle.createdAt}</p>
                      </div>
                    </div>

                    {/* Colonne milieu */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Modèle</label>
                        <p className="mt-1 text-sm text-gray-900">{vehicle.model}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Énergie</label>
                        <p className="mt-1 text-sm text-gray-900">{vehicle.energy}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Code SRA</label>
                        <p className="mt-1 text-sm text-gray-900">{vehicle.sraCode || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dernière modification</label>
                        <p className="mt-1 text-sm text-gray-900">{vehicle.updatedAt}</p>
                      </div>
                    </div>

                    {/* Colonne droite */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de 1ère immatriculation</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {vehicle.firstRegistrationDate} ({Math.floor((new Date().getTime() - new Date(vehicle.firstRegistrationDate.split('/').reverse().join('-')).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} ans)
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date d'acquisition</label>
                        <p className="mt-1 text-sm text-gray-900">{vehicle.acquisitionDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Prix d'achat neuf</label>
                        <p className="mt-1 text-sm text-gray-900">{vehicle.newPrice.toLocaleString()}€</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Valeur Argus</label>
                        <p className="mt-1 text-sm text-gray-900">{vehicle.argusValue.toLocaleString()}€</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Finition</label>
                        <p className="mt-1 text-sm text-gray-900">{vehicle.trim}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Associated Drivers */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Risques associés ({associatedDrivers.length})
                    </h3>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                      + Associer un chauffeur
                    </button>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {associatedDrivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            driver.status === 'Actif' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">{driver.status}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{driver.name} ({driver.claimsCount} sinistre{driver.claimsCount > 1 ? 's' : ''})</p>
                          <p className="text-sm text-gray-600">Risque créé le {driver.riskCreatedDate}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Voir →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Studies */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Études d'éligibilité</h3>
                </div>
                <div className="px-6 py-4">
                  {eligibilityStudies.map((study) => (
                    <div key={study.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            study.status === 'Éligible' ? 'bg-green-500' : 
                            study.status === 'Non éligible' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">{study.status}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{study.insurer} - {study.product}</p>
                          <p className="text-sm text-gray-600">
                            Étudiée le {study.studiedDate} - Évaluation automatique: {study.criteria}/{study.maxCriteria} critères respectés
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
