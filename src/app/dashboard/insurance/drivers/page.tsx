'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseType: string;
  licenseValidUntil: string;
  status: 'Actif' | 'En attente' | 'Expiré';
  vehicles: string[];
  claims: number;
  experience: string;
  isLinked: boolean;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    // Mock data pour les chauffeurs - CHAQUE PERSONNE A SES PROPRES DONNÉES UNIQUES
    const mockDrivers: Driver[] = [
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '01 23 45 67 89',
        licenseNumber: '1234567890123456',
        licenseType: 'B',
        licenseValidUntil: '2025-12-31',
        status: 'Actif',
        vehicles: ['Peugeot 308 - AB-123-CD'],
        claims: 0,
        experience: '5 ans',
        isLinked: true
      },
      {
        id: '2',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@email.com',
        phone: '01 98 76 54 32',
        licenseNumber: '2345678901234567',
        licenseType: 'B',
        licenseValidUntil: '2024-06-15',
        status: 'Actif',
        vehicles: ['Renault Clio - EF-456-GH'],
        claims: 1,
        experience: '3 ans',
        isLinked: true
      },
      {
        id: '3',
        firstName: 'Pierre',
        lastName: 'Bernard',
        email: 'pierre.bernard@email.com',
        phone: '01 11 22 33 44',
        licenseNumber: '3456789012345678',
        licenseType: 'B+E',
        licenseValidUntil: '2026-03-20',
        status: 'En attente',
        vehicles: ['Citroën C3 - IJ-789-KL'],
        claims: 0,
        experience: '8 ans',
        isLinked: false
      },
      {
        id: '4',
        firstName: 'Sophie',
        lastName: 'Moreau',
        email: 'sophie.moreau@email.com',
        phone: '01 55 66 77 88',
        licenseNumber: '4567890123456789',
        licenseType: 'C',
        licenseValidUntil: '2025-09-10',
        status: 'Actif',
        vehicles: ['Ford Transit - MN-012-OP'],
        claims: 2,
        experience: '12 ans',
        isLinked: true
      },
      {
        id: '5',
        firstName: 'Lucas',
        lastName: 'Petit',
        email: 'lucas.petit@email.com',
        phone: '01 99 88 77 66',
        licenseNumber: '5678901234567890',
        licenseType: 'A',
        licenseValidUntil: '2023-12-31',
        status: 'Expiré',
        vehicles: ['Yamaha MT-07 - QR-345-ST'],
        claims: 0,
        experience: '2 ans',
        isLinked: false
      }
    ];

    setDrivers(mockDrivers);
  }, []);

  const handleLinkDriver = (driverId: string) => {
    setDrivers(drivers.map(driver => 
      driver.id === driverId 
        ? { ...driver, isLinked: true }
        : driver
    ));
  };

  const handleUnlinkDriver = (driverId: string) => {
    setDrivers(drivers.map(driver => 
      driver.id === driverId 
        ? { ...driver, isLinked: false }
        : driver
    ));
  };

  const handleDeleteDriver = (driverId: string) => {
    setDrivers(drivers.filter(driver => driver.id !== driverId));
  };

  const getStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expiré':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const breadcrumb = [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Conducteurs' }
  ];

  const actions = (
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
      + Ajouter un conducteur
    </button>
  );

  return (
    <Layout
      title="Liste des Conducteurs"
      subtitle="Gestion complète des conducteurs"
      breadcrumb={breadcrumb}
      actions={actions}
    >
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Conducteurs ({drivers.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CONDUCTEUR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PERMIS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TYPE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VALIDITÉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VÉHICULES
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SINISTRES
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{driver.email}</div>
                      <div className="text-sm text-gray-500">{driver.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{driver.licenseNumber}</div>
                      <div className="text-sm text-gray-500">{driver.experience}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {driver.licenseType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.licenseValidUntil}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.vehicles.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.claims}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <Link
                        href={`/dashboard/insurance/drivers/${driver.id}`}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100"
                      >
                        Voir
                      </Link>
                      <button className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs bg-green-50 hover:bg-green-100">
                        Modifier
                      </button>
                      {driver.isLinked ? (
                        <button
                          onClick={() => handleUnlinkDriver(driver.id)}
                          className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded text-xs bg-orange-50 hover:bg-orange-100"
                        >
                          Délier
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLinkDriver(driver.id)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs bg-blue-50 hover:bg-blue-100"
                        >
                          Lier
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteDriver(driver.id)}
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
    </Layout>
  );
}