'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { InterlocutorService } from '@/lib/interlocutors';
import { Interlocutor } from '@/types/interlocutor';
import Layout from '@/components/layout/Layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar, 
  Edit3, 
  FileText, 
  Car, 
  Users, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function ExternalProfilePage() {
  const { user } = useAuth();
  const [interlocutor, setInterlocutor] = useState<Interlocutor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userEmail = typeof window !== 'undefined' 
          ? localStorage.getItem('user_email') 
          : null;

        if (!userEmail) {
          setError('Email utilisateur non trouvé');
          return;
        }

        // Rechercher l'interlocuteur par email
        const result = await InterlocutorService.searchInterlocutors(userEmail);
        
        if (result && result.length > 0) {
          // Prendre le premier interlocuteur correspondant
          setInterlocutor(result[0]);
        } else {
          setError('Profil utilisateur non trouvé');
        }
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        console.error('Erreur profil:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (isLoading) {
    return (
      <Layout title="Profil Utilisateur">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !interlocutor) {
    return (
      <Layout title="Profil Utilisateur">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-red-600 mb-4">
              {error || 'Impossible de charger votre profil'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'text-green-600 bg-green-100';
      case 'Inactif': return 'text-red-600 bg-red-100';
      case 'En attente': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  return (
    <Layout title="Profil Utilisateur">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        
        {/* En-tête du profil */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {interlocutor.firstName} {interlocutor.lastName}
                </h1>
                <p className="text-lg text-gray-600">{interlocutor.company || 'Particulier'}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(interlocutor.status)}`}>
                    {interlocutor.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Membre depuis le {formatDate(interlocutor.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Edit3 className="w-4 h-4" />
              <span>Modifier</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Informations personnelles */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Coordonnées */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Informations personnelles</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{interlocutor.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium">{interlocutor.phone}</p>
                  </div>
                </div>
                {interlocutor.company && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Entreprise</p>
                      <p className="font-medium">{interlocutor.company}</p>
                    </div>
                  </div>
                )}
                {interlocutor.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="font-medium">{interlocutor.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contrats d'assurance */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Mes contrats d'assurance</span>
              </h2>
              {interlocutor.contracts && interlocutor.contracts.length > 0 ? (
                <div className="space-y-4">
                  {interlocutor.contracts.map((contract, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{contract.type}</h3>
                          <p className="text-sm text-gray-600">{contract.insurer}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          contract.status === 'En cours' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {contract.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Police N° :</span>
                          <span className="ml-2 font-medium">{contract.policyNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Prime :</span>
                          <span className="ml-2 font-medium">{contract.premium}€</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Début :</span>
                          <span className="ml-2">{contract.startDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fin :</span>
                          <span className="ml-2">{contract.endDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun contrat d'assurance</p>
                </div>
              )}
            </div>

            {/* Véhicules */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Car className="w-5 h-5" />
                <span>Mes véhicules</span>
              </h2>
              {interlocutor.vehicles && interlocutor.vehicles.length > 0 ? (
                <div className="space-y-4">
                  {interlocutor.vehicles.map((vehicle, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{vehicle.brand} {vehicle.model}</h3>
                          <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.registration}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          vehicle.status === 'Assuré' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>Type : {vehicle.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun véhicule enregistré</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contrats actifs</span>
                  <span className="font-semibold text-green-600">
                    {interlocutor.contracts?.filter(c => c.status === 'En cours').length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Véhicules</span>
                  <span className="font-semibold text-blue-600">
                    {interlocutor.vehicles?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sinistres</span>
                  <span className="font-semibold text-orange-600">
                    {interlocutor.claims?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                  Demander un devis
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                  Déclarer un sinistre
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                  Ajouter un véhicule
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm">
                  Contacter un conseiller
                </button>
              </div>
            </div>

            {/* Dernière activité */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Activité récente</span>
              </h3>
              <div className="text-sm text-gray-600">
                <p>Dernière connexion :</p>
                <p className="font-medium">{formatDate(interlocutor.lastActivity)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}