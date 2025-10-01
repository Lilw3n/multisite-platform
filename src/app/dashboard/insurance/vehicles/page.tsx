'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Vehicle {
  id: string;
  registration: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  type: 'Voiture particulière' | 'Véhicule utilitaire' | 'Moto' | 'Camion' | 'Autre';
  status: 'Assuré' | 'En attente' | 'Expiré';
  insurer: string;
  premium: number;
  validityEnd: string;
  driver: string;
  isLinked: boolean;
}

export default function VehiclesPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const router = useRouter();

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
    // Mock data pour les véhicules
    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        registration: 'AB-123-CD',
        brand: 'Peugeot',
        model: '308',
        year: 2022,
        vin: 'VF3XXXXX...',
        type: 'Voiture particulière',
        status: 'Assuré',
        insurer: 'AXA',
        premium: 1200,
        validityEnd: '2024-12-31',
        driver: 'Jean Dupont',
        isLinked: true
      },
      {
        id: '2',
        registration: 'EF-456-GH',
        brand: 'Renault',
        model: 'Clio',
        year: 2021,
        vin: 'VF1XXXXX...',
        type: 'Voiture particulière',
        status: 'Assuré',
        insurer: 'Groupama',
        premium: 950,
        validityEnd: '2024-11-15',
        driver: 'Marie Martin',
        isLinked: true
      },
      {
        id: '3',
        registration: 'IJ-789-KL',
        brand: 'Citroën',
        model: 'C3',
        year: 2023,
        vin: 'VF7XXXXX...',
        type: 'Voiture particulière',
        status: 'En attente',
        insurer: 'MACIF',
        premium: 1100,
        validityEnd: '2024-10-20',
        driver: 'Pierre Bernard',
        isLinked: false
      },
      {
        id: '4',
        registration: 'MN-012-OP',
        brand: 'Ford',
        model: 'Transit',
        year: 2020,
        vin: 'WF0XXXXX...',
        type: 'Véhicule utilitaire',
        status: 'Assuré',
        insurer: 'AXA',
        premium: 1800,
        validityEnd: '2024-09-30',
        driver: 'Sophie Moreau',
        isLinked: true
      },
      {
        id: '5',
        registration: 'QR-345-ST',
        brand: 'Yamaha',
        model: 'MT-07',
        year: 2023,
        vin: 'JYACXXXXX...',
        type: 'Moto',
        status: 'Expiré',
        insurer: 'Groupama',
        premium: 450,
        validityEnd: '2023-12-31',
        driver: 'Lucas Petit',
        isLinked: false
      }
    ];

    setVehicles(mockVehicles);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
    }
    router.push('/login');
  };

  const handleLinkVehicle = (vehicleId: string) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, isLinked: true }
        : vehicle
    ));
  };

  const handleUnlinkVehicle = (vehicleId: string) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, isLinked: false }
        : vehicle
    ));
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
  };

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'Assuré':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expiré':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Liste des Véhicules</h1>
                <p className="text-gray-600">Gestion complète de la flotte de véhicules</p>
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
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Véhicules ({vehicles.length})</h2>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  + Ajouter un véhicule
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      VÉHICULE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PLAQUE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ASSUREUR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRIME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      VALIDITÉ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CONDUCTEUR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.year} - {vehicle.vin}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {vehicle.registration}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.insurer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.premium}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.validityEnd}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.driver}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <Link
                            href={`/dashboard/insurance/vehicles/${vehicle.id}`}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100"
                          >
                            Voir
                          </Link>
                          <button className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100">
                            Modifier
                          </button>
                          {vehicle.isLinked ? (
                            <button
                              onClick={() => handleUnlinkVehicle(vehicle.id)}
                              className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded text-xs bg-orange-50 hover:bg-orange-100"
                            >
                              Délier
                            </button>
                          ) : (
                            <button
                              onClick={() => handleLinkVehicle(vehicle.id)}
                              className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs bg-green-50 hover:bg-green-100"
                            >
                              Lier
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded text-xs bg-red-50 hover:bg-red-100"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}