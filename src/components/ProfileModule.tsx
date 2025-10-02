'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Edit, 
  Save, 
  X,
  Camera,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Music,
  Gamepad2,
  Book,
  Coffee
} from 'lucide-react';

interface ProfileData {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    avatar?: string;
  };
  professionalInfo: {
    jobTitle: string;
    company: string;
    industry: string;
    experience: number;
    skills: string[];
    certifications: string[];
  };
  personalDetails: {
    bio: string;
    interests: string[];
    hobbies: string[];
    languages: string[];
    socialLinks: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      facebook?: string;
    };
  };
  preferences: {
    communication: 'email' | 'phone' | 'sms' | 'whatsapp';
    timezone: string;
    language: string;
    notifications: boolean;
  };
}

const defaultProfile: ProfileData = {
  id: '',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    avatar: ''
  },
  professionalInfo: {
    jobTitle: '',
    company: '',
    industry: '',
    experience: 0,
    skills: [],
    certifications: []
  },
  personalDetails: {
    bio: '',
    interests: [],
    hobbies: [],
    languages: ['Français'],
    socialLinks: {}
  },
  preferences: {
    communication: 'email',
    timezone: 'Europe/Paris',
    language: 'fr',
    notifications: true
  }
};

interface ProfileModuleProps {
  profile?: ProfileData;
  onSave: (profile: ProfileData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function ProfileModule({ 
  profile = defaultProfile, 
  onSave, 
  onCancel, 
  isEditing = true 
}: ProfileModuleProps) {
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'details' | 'preferences'>('personal');
  const [isEditingMode, setIsEditingMode] = useState(isEditing);

  const handleInputChange = (section: keyof ProfileData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayAdd = (section: keyof ProfileData, field: string, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...(prev[section] as any)[field], value.trim()]
        }
      }));
    }
  };

  const handleArrayRemove = (section: keyof ProfileData, field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section] as any)[field].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditingMode(false);
  };

  const tabs = [
    { id: 'personal', name: 'Personnel', icon: User },
    { id: 'professional', name: 'Professionnel', icon: Briefcase },
    { id: 'details', name: 'Détails', icon: Star },
    { id: 'preferences', name: 'Préférences', icon: Settings }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              {formData.personalInfo.avatar ? (
                <img 
                  src={formData.personalInfo.avatar} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {formData.personalInfo.firstName} {formData.personalInfo.lastName}
              </h2>
              <p className="text-blue-100">{formData.professionalInfo.jobTitle}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isEditingMode && (
              <button
                onClick={() => setIsEditingMode(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier</span>
              </button>
            )}
            {isEditingMode && (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
                <button
                  onClick={onCancel}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'personal' && (
          <PersonalInfoTab 
            data={formData.personalInfo} 
            onChange={(field, value) => handleInputChange('personalInfo', field, value)}
            isEditing={isEditingMode}
          />
        )}
        
        {activeTab === 'professional' && (
          <ProfessionalInfoTab 
            data={formData.professionalInfo} 
            onChange={(field, value) => handleInputChange('professionalInfo', field, value)}
            onArrayAdd={(field, value) => handleArrayAdd('professionalInfo', field, value)}
            onArrayRemove={(field, index) => handleArrayRemove('professionalInfo', field, index)}
            isEditing={isEditingMode}
          />
        )}
        
        {activeTab === 'details' && (
          <PersonalDetailsTab 
            data={formData.personalDetails} 
            onChange={(field, value) => handleInputChange('personalDetails', field, value)}
            onArrayAdd={(field, value) => handleArrayAdd('personalDetails', field, value)}
            onArrayRemove={(field, index) => handleArrayRemove('personalDetails', field, index)}
            isEditing={isEditingMode}
          />
        )}
        
        {activeTab === 'preferences' && (
          <PreferencesTab 
            data={formData.preferences} 
            onChange={(field, value) => handleInputChange('preferences', field, value)}
            isEditing={isEditingMode}
          />
        )}
      </div>
    </div>
  );
}

// Composants pour chaque onglet
function PersonalInfoTab({ data, onChange, isEditing }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
        <input
          type="text"
          value={data.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          disabled={!isEditing}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
        <input
          type="text"
          value={data.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          disabled={!isEditing}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            disabled={!isEditing}
            className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            disabled={!isEditing}
            className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            value={data.birthDate}
            onChange={(e) => onChange('birthDate', e.target.value)}
            disabled={!isEditing}
            className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
        <select
          value={data.country}
          onChange={(e) => onChange('country', e.target.value)}
          disabled={!isEditing}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        >
          <option value="France">France</option>
          <option value="Belgique">Belgique</option>
          <option value="Suisse">Suisse</option>
          <option value="Canada">Canada</option>
          <option value="Autre">Autre</option>
        </select>
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <textarea
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            disabled={!isEditing}
            rows={2}
            className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="Adresse complète"
          />
        </div>
      </div>
    </div>
  );
}

function ProfessionalInfoTab({ data, onChange, onArrayAdd, onArrayRemove, isEditing }: any) {
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
          <input
            type="text"
            value={data.jobTitle}
            onChange={(e) => onChange('jobTitle', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={data.company}
              onChange={(e) => onChange('company', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
          <input
            type="text"
            value={data.industry}
            onChange={(e) => onChange('industry', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Années d'expérience</label>
          <input
            type="number"
            value={data.experience}
            onChange={(e) => onChange('experience', parseInt(e.target.value) || 0)}
            disabled={!isEditing}
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Compétences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Compétences</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.skills.map((skill: string, index: number) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{skill}</span>
              {isEditing && (
                <button
                  onClick={() => onArrayRemove('skills', index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Ajouter une compétence"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onArrayAdd('skills', newSkill);
                  setNewSkill('');
                }
              }}
            />
            <button
              onClick={() => {
                onArrayAdd('skills', newSkill);
                setNewSkill('');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.certifications.map((cert: string, index: number) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
            >
              <Award className="w-3 h-3" />
              <span>{cert}</span>
              {isEditing && (
                <button
                  onClick={() => onArrayRemove('certifications', index)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Ajouter une certification"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onArrayAdd('certifications', newCertification);
                  setNewCertification('');
                }
              }}
            />
            <button
              onClick={() => {
                onArrayAdd('certifications', newCertification);
                setNewCertification('');
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PersonalDetailsTab({ data, onChange, onArrayAdd, onArrayRemove, isEditing }: any) {
  const [newInterest, setNewInterest] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const hobbyIcons = {
    'Musique': Music,
    'Gaming': Gamepad2,
    'Lecture': Book,
    'Café': Coffee,
    'Sport': Heart
  };

  return (
    <div className="space-y-6">
      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
        <textarea
          value={data.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="Parlez-nous de vous..."
        />
      </div>

      {/* Centres d'intérêt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Centres d'intérêt</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.interests.map((interest: string, index: number) => (
            <span
              key={index}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
            >
              <Star className="w-3 h-3" />
              <span>{interest}</span>
              {isEditing && (
                <button
                  onClick={() => onArrayRemove('interests', index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Ajouter un centre d'intérêt"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onArrayAdd('interests', newInterest);
                  setNewInterest('');
                }
              }}
            />
            <button
              onClick={() => {
                onArrayAdd('interests', newInterest);
                setNewInterest('');
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Hobbies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.hobbies.map((hobby: string, index: number) => {
            const IconComponent = hobbyIcons[hobby as keyof typeof hobbyIcons] || Heart;
            return (
              <span
                key={index}
                className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <IconComponent className="w-3 h-3" />
                <span>{hobby}</span>
                {isEditing && (
                  <button
                    onClick={() => onArrayRemove('hobbies', index)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            );
          })}
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              placeholder="Ajouter un hobby"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onArrayAdd('hobbies', newHobby);
                  setNewHobby('');
                }
              }}
            />
            <button
              onClick={() => {
                onArrayAdd('hobbies', newHobby);
                setNewHobby('');
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Langues */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Langues</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.languages.map((language: string, index: number) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
            >
              <GraduationCap className="w-3 h-3" />
              <span>{language}</span>
              {isEditing && (
                <button
                  onClick={() => onArrayRemove('languages', index)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Ajouter une langue"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onArrayAdd('languages', newLanguage);
                  setNewLanguage('');
                }
              }}
            />
            <button
              onClick={() => {
                onArrayAdd('languages', newLanguage);
                setNewLanguage('');
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Liens sociaux */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Réseaux sociaux</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">LinkedIn</label>
            <input
              type="url"
              value={data.socialLinks.linkedin || ''}
              onChange={(e) => onChange('socialLinks', { ...data.socialLinks, linkedin: e.target.value })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Twitter</label>
            <input
              type="url"
              value={data.socialLinks.twitter || ''}
              onChange={(e) => onChange('socialLinks', { ...data.socialLinks, twitter: e.target.value })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="https://twitter.com/..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Instagram</label>
            <input
              type="url"
              value={data.socialLinks.instagram || ''}
              onChange={(e) => onChange('socialLinks', { ...data.socialLinks, instagram: e.target.value })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Facebook</label>
            <input
              type="url"
              value={data.socialLinks.facebook || ''}
              onChange={(e) => onChange('socialLinks', { ...data.socialLinks, facebook: e.target.value })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferencesTab({ data, onChange, isEditing }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Communication préférée</label>
          <select
            value={data.communication}
            onChange={(e) => onChange('communication', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="email">Email</option>
            <option value="phone">Téléphone</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
          <select
            value={data.timezone}
            onChange={(e) => onChange('timezone', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="Europe/Paris">Europe/Paris (CET)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
          <select
            value={data.language}
            onChange={(e) => onChange('language', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            checked={data.notifications}
            onChange={(e) => onChange('notifications', e.target.checked)}
            disabled={!isEditing}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
          />
          <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
            Recevoir les notifications
          </label>
        </div>
      </div>
    </div>
  );
}
