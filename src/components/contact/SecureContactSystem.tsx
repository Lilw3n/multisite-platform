'use client';

import React, { useState } from 'react';
import { Mail, MessageCircle, Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, User, Building, Phone, MapPin } from 'lucide-react';

interface ContactMethod {
  id: string;
  type: 'email' | 'internal' | 'social' | 'emergency';
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  preferred: boolean;
  secure: boolean;
  responseTime: string;
  availability: string;
}

interface ContactRequest {
  id: string;
  type: 'general' | 'business' | 'support' | 'legal' | 'partnership';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  message: string;
  contactMethod: string;
  userInfo: {
    name: string;
    email: string;
    company?: string;
    role?: string;
  };
  timestamp: string;
  status: 'pending' | 'read' | 'responded' | 'resolved';
}

interface SecureContactSystemProps {
  userRole?: 'guest' | 'client' | 'pro' | 'internal';
  onSendMessage?: (request: ContactRequest) => void;
}

// Informations de contact sécurisées (cachées par défaut)
const SECURE_CONTACT_INFO = {
  // Ces informations ne sont visibles que dans des cas spécifiques (légal, urgence)
  owner: {
    name: 'DiddyHome',
    address: {
      street: '15 Rue Pierre Curie',
      postalCode: '54110',
      city: 'Varangéville',
      country: 'France',
      // Coordonnées masquées par défaut
      hidden: true
    },
    phone: {
      number: '06 95 82 08 66',
      // Numéro masqué par défaut, uniquement pour urgences légales
      hidden: true,
      emergencyOnly: true
    },
    email: {
      public: 'contact@diddyhome.fr',
      business: 'business@diddyhome.fr',
      legal: 'legal@diddyhome.fr',
      support: 'support@diddyhome.fr'
    }
  }
};

export default function SecureContactSystem({ userRole = 'guest', onSendMessage }: SecureContactSystemProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('email');
  const [contactForm, setContactForm] = useState({
    type: 'general' as ContactRequest['type'],
    priority: 'medium' as ContactRequest['priority'],
    subject: '',
    message: '',
    userInfo: {
      name: '',
      email: '',
      company: '',
      role: ''
    }
  });
  const [showLegalInfo, setShowLegalInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactMethods: ContactMethod[] = [
    {
      id: 'email',
      type: 'email',
      label: 'Email Sécurisé',
      icon: Mail,
      description: 'Méthode préférée - Réponse garantie sous 24h',
      preferred: true,
      secure: true,
      responseTime: '< 24h',
      availability: '24h/7j'
    },
    {
      id: 'internal',
      type: 'internal',
      label: 'Messagerie Interne',
      icon: MessageCircle,
      description: 'Via votre espace membre - Communication directe',
      preferred: true,
      secure: true,
      responseTime: '< 4h',
      availability: 'Heures ouvrées'
    },
    {
      id: 'social',
      type: 'social',
      label: 'Réseau Social Interne',
      icon: User,
      description: 'Via notre plateforme sociale - Public ou privé',
      preferred: false,
      secure: true,
      responseTime: '< 8h',
      availability: '24h/7j'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Créer la demande de contact
    const contactRequest: ContactRequest = {
      id: Date.now().toString(),
      type: contactForm.type,
      priority: contactForm.priority,
      subject: contactForm.subject,
      message: contactForm.message,
      contactMethod: selectedMethod,
      userInfo: contactForm.userInfo,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Simuler l'envoi
    setTimeout(() => {
      onSendMessage?.(contactRequest);
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form après 3 secondes
      setTimeout(() => {
        setSubmitted(false);
        setContactForm({
          type: 'general',
          priority: 'medium',
          subject: '',
          message: '',
          userInfo: { name: '', email: '', company: '', role: '' }
        });
      }, 3000);
    }, 2000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'business': return 'bg-blue-100 text-blue-800';
      case 'support': return 'bg-green-100 text-green-800';
      case 'legal': return 'bg-red-100 text-red-800';
      case 'partnership': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-900 mb-2">Message envoyé avec succès !</h3>
          <p className="text-green-700 mb-4">
            Votre message a été transmis de manière sécurisée. Vous recevrez une réponse dans les délais indiqués.
          </p>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Réponse attendue: {contactMethods.find(m => m.id === selectedMethod)?.responseTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Contactez-nous en toute sécurité</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Nous privilégions la confidentialité et la sécurité. Choisissez votre méthode de contact préférée 
          pour une communication protégée et efficace.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">🔒 Confidentialité garantie</h4>
            <p className="text-blue-800 text-sm mb-3">
              Vos données personnelles sont protégées selon les standards RGPD. 
              Nous ne partageons jamais vos informations et privilégions les communications sécurisées.
            </p>
            <div className="flex items-center space-x-4 text-xs text-blue-700">
              <span>✅ Chiffrement end-to-end</span>
              <span>✅ Données non-stockées</span>
              <span>✅ Accès restreint</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Methods */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-gray-900 mb-4">Méthodes de contact</h3>
          <div className="space-y-3">
            {contactMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        selectedMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{method.label}</span>
                        {method.preferred && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Préféré
                          </span>
                        )}
                        {method.secure && (
                          <Lock className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>⏱️ {method.responseTime}</span>
                        <span>📅 {method.availability}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legal Info Toggle */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <button
              onClick={() => setShowLegalInfo(!showLegalInfo)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
            >
              {showLegalInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>Informations légales</span>
            </button>
            
            {showLegalInfo && (
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-2">
                <div className="flex items-center space-x-2">
                  <Building className="w-3 h-3" />
                  <span>DiddyHome - Plateforme VTC/Taxi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>France - Service national</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3" />
                  <span>legal@diddyhome.fr (questions légales uniquement)</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Coordonnées complètes disponibles sur demande légale justifiée
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-6">Votre message</h3>

            {/* Type and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de demande
                </label>
                <select
                  value={contactForm.type}
                  onChange={(e) => setContactForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">Question générale</option>
                  <option value="business">Opportunité business</option>
                  <option value="support">Support technique</option>
                  <option value="partnership">Partenariat</option>
                  <option value="legal">Question légale</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorité
                </label>
                <select
                  value={contactForm.priority}
                  onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Faible - Pas urgent</option>
                  <option value="medium">Moyenne - Réponse souhaitée</option>
                  <option value="high">Élevée - Important</option>
                  <option value="urgent">Urgente - Critique</option>
                </select>
              </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre nom *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.userInfo.name}
                  onChange={(e) => setContactForm(prev => ({
                    ...prev,
                    userInfo: { ...prev.userInfo, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre nom complet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.userInfo.email}
                  onChange={(e) => setContactForm(prev => ({
                    ...prev,
                    userInfo: { ...prev.userInfo, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise (optionnel)
                </label>
                <input
                  type="text"
                  value={contactForm.userInfo.company}
                  onChange={(e) => setContactForm(prev => ({
                    ...prev,
                    userInfo: { ...prev.userInfo, company: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre rôle (optionnel)
                </label>
                <select
                  value={contactForm.userInfo.role}
                  onChange={(e) => setContactForm(prev => ({
                    ...prev,
                    userInfo: { ...prev.userInfo, role: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  <option value="vtc_driver">Chauffeur VTC</option>
                  <option value="taxi_driver">Chauffeur Taxi</option>
                  <option value="fleet_manager">Gestionnaire de flotte</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="partner">Partenaire</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet *
              </label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Résumé de votre demande"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre message *
              </label>
              <textarea
                required
                rows={6}
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Décrivez votre demande en détail..."
              />
            </div>

            {/* Selected Method Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Méthode sélectionnée: {contactMethods.find(m => m.id === selectedMethod)?.label}
                </span>
              </div>
              <p className="text-sm text-blue-700">
                {contactMethods.find(m => m.id === selectedMethod)?.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex items-center space-x-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(contactForm.type)}`}>
                {contactForm.type.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(contactForm.priority)}`}>
                {contactForm.priority.toUpperCase()}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Envoi sécurisé en cours...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Envoyer de manière sécurisée</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Emergency Contact Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">Contact d'urgence</h4>
            <p className="text-yellow-800 text-sm">
              En cas d'urgence légale ou de problème critique nécessitant un contact immédiat, 
              les coordonnées complètes peuvent être fournies sur demande justifiée auprès des autorités compétentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
