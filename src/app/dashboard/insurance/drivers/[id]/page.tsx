'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  licenseNumber: string;
  licenseObtainedDate: string;
  crmCoefficient: number;
  professionalExperience: number;
  totalExperience: number;
  experience12Months: number;
  experience36Months: number;
  experience60Months: number;
  suspensionOfLicense: boolean;
  insurerTermination: boolean;
  claims: Claim[];
  insurancePeriods: InsurancePeriod[];
  insuranceGaps: InsuranceGap[];
  status: 'Actif' | 'En attente' | 'Expiré';
  createdAt: string;
  updatedAt: string;
}

interface Claim {
  id: string;
  type: 'materialRC100' | 'materialRC50' | 'materialRC25' | 'materialRC0' | 'bodilyRC100' | 'bodilyRC50' | 'bodilyRC25' | 'bodilyRC0' | 'glassBreakage' | 'theft' | 'fire' | 'naturalDisaster';
  date: string;
  amount: number;
  description: string;
  responsible: boolean;
  percentage: number;
  insurer: string;
  alreadyImpacted: boolean;
  crmCoefficient: number;
  crmUpdateDate: string;
  countedInCalculation: boolean;
  driverType: 'VTC' | 'Particulier' | 'Professionnel';
}

interface InsurancePeriod {
  id: string;
  startDate: string;
  endDate: string;
  company: string;
  policyNumber: string;
  status: 'Actif' | 'En attente' | 'Expiré';
  premium: number;
  crmCoefficient: number;
  inProgress: boolean;
  terminated: boolean;
  terminationReason: 'amiable' | 'litige' | 'non_paiement' | null;
}

interface InsuranceGap {
  id: string;
  startDate: string;
  endDate: string;
  reason: 'non_renouvellement' | 'suspension' | 'exclusion' | 'autre';
  description: string;
  durationMonths: number;
}

export default function DriverDetailPage() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const params = useParams();
  const driverId = params.id as string;

  useEffect(() => {
    // Données personnalisées selon l'ID du chauffeur - CHAQUE PERSONNE A SES PROPRES DONNÉES UNIQUES
    const getDriverData = (id: string): Driver => {
      const driversData: Record<string, Driver> = {
        '1': {
          id: '1',
          firstName: 'Jean',
          lastName: 'DUPONT',
          email: 'jean.dupont@email.com',
          phone: '06 00 00 00 00',
          birthDate: '15/03/1985',
          licenseNumber: '123456789',
          licenseObtainedDate: '15/03/2003',
          crmCoefficient: 1.12,
          professionalExperience: 24,
          totalExperience: 264,
          experience12Months: 12,
          experience36Months: 36,
          experience60Months: 60,
          suspensionOfLicense: false,
          insurerTermination: false,
          claims: [
            {
              id: '1',
              type: 'materialRC100',
              date: '15/06/2023',
              amount: 2500,
              description: 'Collision avec un véhicule stationné',
              responsible: true,
              percentage: 100,
              insurer: 'AXA Assurance',
              alreadyImpacted: true,
              crmCoefficient: 1.12,
              crmUpdateDate: '01/07/2023',
              countedInCalculation: true,
              driverType: 'VTC'
            }
          ],
          insurancePeriods: [
            {
              id: '1',
              startDate: '01/01/2020',
              endDate: '31/12/2022',
              company: 'AXA Assurance',
              policyNumber: 'AXA-2020-001234',
              status: 'Expiré',
              premium: 850,
              crmCoefficient: 0.93,
              inProgress: false,
              terminated: true,
              terminationReason: 'amiable'
            }
          ],
          insuranceGaps: [],
          status: 'Actif',
          createdAt: '22/09/2025 14:46',
          updatedAt: '22/09/2025 14:46'
        },
        '2': {
          id: '2',
          firstName: 'Marie',
          lastName: 'MARTIN',
          email: 'marie.martin@email.com',
          phone: '06 11 11 11 11',
          birthDate: '22/07/1990',
          licenseNumber: '234567890',
          licenseObtainedDate: '10/05/2018',
          crmCoefficient: 0.93,
          professionalExperience: 12,
          totalExperience: 84,
          experience12Months: 12,
          experience36Months: 36,
          experience60Months: 60,
          suspensionOfLicense: false,
          insurerTermination: false,
          claims: [
            {
              id: '1',
              type: 'bodilyRC50',
              date: '22/08/2022',
              amount: 1200,
              description: 'Accident avec blessures légères',
              responsible: true,
              percentage: 50,
              insurer: 'Groupama',
              alreadyImpacted: true,
              crmCoefficient: 1.11,
              crmUpdateDate: '01/09/2022',
              countedInCalculation: true,
              driverType: 'VTC'
            }
          ],
          insurancePeriods: [
            {
              id: '1',
              startDate: '01/01/2021',
              endDate: '31/12/2024',
              company: 'Groupama',
              policyNumber: 'GRP-2021-005678',
              status: 'Actif',
              premium: 920,
              crmCoefficient: 1.12,
              inProgress: true,
              terminated: false,
              terminationReason: null
            }
          ],
          insuranceGaps: [],
          status: 'Actif',
          createdAt: '22/09/2025 14:46',
          updatedAt: '22/09/2025 14:46'
        },
        '3': {
          id: '3',
          firstName: 'Pierre',
          lastName: 'BERNARD',
          email: 'pierre.bernard@email.com',
          phone: '06 22 22 22 22',
          birthDate: '08/12/1988',
          licenseNumber: '345678901',
          licenseObtainedDate: '20/03/2016',
          crmCoefficient: 1.0,
          professionalExperience: 36,
          totalExperience: 108,
          experience12Months: 12,
          experience36Months: 36,
          experience60Months: 60,
          suspensionOfLicense: false,
          insurerTermination: false,
          claims: [],
          insurancePeriods: [
            {
              id: '1',
              startDate: '01/01/2025',
              endDate: '31/12/2025',
              company: 'MACIF',
              policyNumber: 'MAC-2025-009876',
              status: 'En attente',
              premium: 780,
              crmCoefficient: 1.11,
              inProgress: false,
              terminated: false,
              terminationReason: null
            }
          ],
          insuranceGaps: [],
          status: 'En attente',
          createdAt: '22/09/2025 14:46',
          updatedAt: '22/09/2025 14:46'
        },
        '4': {
          id: '4',
          firstName: 'Sophie',
          lastName: 'MOREAU',
          email: 'sophie.moreau@email.com',
          phone: '06 33 33 33 33',
          birthDate: '14/05/1982',
          licenseNumber: '456789012',
          licenseObtainedDate: '05/09/2012',
          crmCoefficient: 1.25,
          professionalExperience: 60,
          totalExperience: 156,
          experience12Months: 12,
          experience36Months: 36,
          experience60Months: 60,
          suspensionOfLicense: false,
          insurerTermination: false,
          claims: [
            {
              id: '1',
              type: 'materialRC100',
              date: '10/03/2023',
              amount: 1800,
              description: 'Collision arrière',
              responsible: true,
              percentage: 100,
              insurer: 'AXA Assurance',
              alreadyImpacted: true,
              crmCoefficient: 1.25,
              crmUpdateDate: '01/04/2023',
              countedInCalculation: true,
              driverType: 'VTC'
            },
            {
              id: '2',
              type: 'glassBreakage',
              date: '15/07/2022',
              amount: 400,
              description: 'Bris de glace latérale',
              responsible: false,
              percentage: 0,
              insurer: 'Groupama',
              alreadyImpacted: false,
              crmCoefficient: 0.93,
              crmUpdateDate: '01/01/2023',
              countedInCalculation: false,
              driverType: 'VTC'
            }
          ],
          insurancePeriods: [
            {
              id: '1',
              startDate: '01/01/2012',
              endDate: '31/12/2024',
              company: 'AXA Assurance',
              policyNumber: 'AXA-2012-001234',
              status: 'Actif',
              premium: 1200,
              crmCoefficient: 1.15,
              inProgress: true,
              terminated: false,
              terminationReason: null
            }
          ],
          insuranceGaps: [],
          status: 'Actif',
          createdAt: '22/09/2025 14:46',
          updatedAt: '22/09/2025 14:46'
        },
        '5': {
          id: '5',
          firstName: 'Lucas',
          lastName: 'PETIT',
          email: 'lucas.petit@email.com',
          phone: '06 44 44 44 44',
          birthDate: '03/11/1995',
          licenseNumber: '567890123',
          licenseObtainedDate: '31/12/2021',
          crmCoefficient: 1.0,
          professionalExperience: 0,
          totalExperience: 36,
          experience12Months: 0,
          experience36Months: 24,
          experience60Months: 36,
          suspensionOfLicense: true,
          insurerTermination: true,
          claims: [],
          insurancePeriods: [],
          insuranceGaps: [
            {
              id: 'gap1',
              startDate: '01/01/2024',
              endDate: '31/12/2024',
              reason: 'suspension',
              description: 'Suspension de permis pour infractions',
              durationMonths: 12
            }
          ],
          status: 'Expiré',
          createdAt: '22/09/2025 14:46',
          updatedAt: '22/09/2025 14:46'
        }
      };

      return driversData[id] || {
        id: id,
        firstName: 'Inconnu',
        lastName: 'Inconnu',
        email: 'donnees.manquantes@exemple.com',
        phone: 'Non renseigné',
        birthDate: '01/01/2000',
        licenseNumber: 'Non renseigné',
        licenseObtainedDate: '01/01/2000',
        crmCoefficient: 1.0,
        professionalExperience: 0,
        totalExperience: 0,
        experience12Months: 0,
        experience36Months: 0,
        experience60Months: 0,
        suspensionOfLicense: false,
        insurerTermination: false,
        claims: [],
        insurancePeriods: [],
        insuranceGaps: [],
        status: 'En attente',
        createdAt: '22/09/2025 14:46',
        updatedAt: '22/09/2025 14:46'
      };
    };

    const mockDriver = getDriverData(driverId);
    setDriver(mockDriver);
  }, [driverId]);

  const breadcrumb = [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Chauffeurs', href: '/dashboard/insurance/drivers' },
    { label: `${driver?.firstName} ${driver?.lastName}` }
  ];

  const actions = (
    <>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
        Modifier
      </button>
      <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium">
        Supprimer
      </button>
    </>
  );

  return (
    <Layout
      title="Détail chauffeur"
      subtitle="Informations complètes du conducteur"
      breadcrumb={breadcrumb}
      actions={actions}
    >
      {driver ? (
        <div className="space-y-6">
          {/* Driver Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {driver.firstName} {driver.lastName}
                </h2>
                <p className="text-gray-600 mt-1">Chauffeur {driver.status.toLowerCase()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    driver.status === 'Actif' ? 'bg-green-500' : 
                    driver.status === 'En attente' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{driver.status}</span>
                </div>
              </div>
            </div>
          </div>

              {/* Driver Details */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Prénom</label>
                        <p className="mt-1 text-sm text-gray-900">{driver.firstName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{driver.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                        <p className="mt-1 text-sm text-gray-900">{driver.birthDate}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                        <p className="mt-1 text-sm text-gray-900">{driver.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <p className="mt-1 text-sm text-gray-900">{driver.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Numéro de permis</label>
                        <p className="mt-1 text-sm text-gray-900">{driver.licenseNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date d'obtention du permis</label>
                        <p className="mt-1 text-sm text-gray-900">{driver.licenseObtainedDate}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CRM Coefficient</label>
                        <p className="mt-1 text-sm text-gray-900">{driver.crmCoefficient}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expérience professionnelle</label>
                        <p className="mt-1 text-sm text-gray-900">{driver.professionalExperience} mois</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Claims Section */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Antécédents - Sinistres ({driver.claims.length})</h3>
                </div>
                <div className="px-6 py-4">
                  {driver.claims.length > 0 ? (
                    <div className="space-y-4">
                      {driver.claims.map((claim) => (
                        <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Type de sinistre</label>
                              <p className="mt-1 text-sm text-gray-900">{claim.type}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Date</label>
                              <p className="mt-1 text-sm text-gray-900">{claim.date}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Montant</label>
                              <p className="mt-1 text-sm text-gray-900">{claim.amount}€</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Responsabilité</label>
                              <p className="mt-1 text-sm text-gray-900">{claim.percentage}%</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Assureur</label>
                              <p className="mt-1 text-sm text-gray-900">{claim.insurer}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Description</label>
                              <p className="mt-1 text-sm text-gray-900">{claim.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Aucun sinistre enregistré</p>
                  )}
                </div>
              </div>

              {/* Insurance Periods */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Périodes d'assurance ({driver.insurancePeriods.length})</h3>
                </div>
                <div className="px-6 py-4">
                  {driver.insurancePeriods.length > 0 ? (
                    <div className="space-y-4">
                      {driver.insurancePeriods.map((period) => (
                        <div key={period.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Compagnie</label>
                              <p className="mt-1 text-sm text-gray-900">{period.company}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Période</label>
                              <p className="mt-1 text-sm text-gray-900">{period.startDate} - {period.endDate}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Statut</label>
                              <p className="mt-1 text-sm text-gray-900">{period.status}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Prime</label>
                              <p className="mt-1 text-sm text-gray-900">{period.premium}€</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Aucune période d'assurance enregistrée</p>
                  )}
                </div>
              </div>

              {/* Insurance Gaps */}
              {driver.insuranceGaps.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Trous d'assurance ({driver.insuranceGaps.length})</h3>
                  </div>
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {driver.insuranceGaps.map((gap) => (
                        <div key={gap.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Période</label>
                              <p className="mt-1 text-sm text-gray-900">{gap.startDate} - {gap.endDate}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Raison</label>
                              <p className="mt-1 text-sm text-gray-900">{gap.reason}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Description</label>
                              <p className="mt-1 text-sm text-gray-900">{gap.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Chauffeur non trouvé</p>
        </div>
      )}
    </Layout>
  );
}