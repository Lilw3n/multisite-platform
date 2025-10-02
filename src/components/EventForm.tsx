'use client';

import React, { useEffect, useState } from 'react';
import { Event } from '@/types/interlocutor';
import { InterlocutorService } from '@/lib/interlocutors';
import { useAuth } from '@/contexts/MinimalAuthContext';

interface EventFormProps {
  interlocutorId: string;
  onSuccess: () => void;
  onCancel: () => void;
  existingEvent?: Event; // si présent, on est en mode édition
}

export default function EventForm({ interlocutorId, onSuccess, onCancel, existingEvent }: EventFormProps) {
  const { viewMode, user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'call',
    title: '',
    description: '',
    date: '',
    time: '',
    participants: [{ name: '', role: 'recipient' }],
    attachments: [{ name: '', type: 'document', url: '' }],
    urls: [{ title: '', url: '', type: 'link' }],
    status: 'pending',
    priority: 'medium',
    createdBy: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pré-remplir en mode édition
  useEffect(() => {
    if (existingEvent) {
      setFormData({
        type: existingEvent.type,
        title: existingEvent.title,
        description: existingEvent.description,
        date: existingEvent.date,
        time: existingEvent.time,
        participants: existingEvent.participants.map(p => ({ name: p.name, role: p.role })),
        attachments: existingEvent.attachments.map(a => ({ name: a.name, type: a.type, url: a.url || '' })),
        urls: existingEvent.urls?.map(u => ({ title: u.title, url: u.url, type: u.type })) || [{ title: '', url: '', type: 'link' }],
        status: existingEvent.status,
        priority: existingEvent.priority,
        createdBy: existingEvent.createdBy
      });
    }
  }, [existingEvent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipantChange = (index: number, field: 'name' | 'role', value: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { name: '', role: 'recipient' }]
    }));
  };

  const removeParticipant = (index: number) => {
    if (formData.participants.length > 1) {
      setFormData(prev => ({
        ...prev,
        participants: prev.participants.filter((_, i) => i !== index)
      }));
    }
  };

  const handleAttachmentChange = (index: number, field: 'name' | 'type', value: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.map((a, i) => 
        i === index ? { ...a, [field]: value } : a
      )
    }));
  };

  const addAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, { name: '', type: 'document' }]
    }));
  };

  const removeAttachment = (index: number) => {
    if (formData.attachments.length > 1) {
      setFormData(prev => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== index)
      }));
    }
  };

  const handleUrlChange = (index: number, field: 'title' | 'url' | 'type', value: string) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.map((u, i) => 
        i === index ? { ...u, [field]: value } : u
      )
    }));
  };

  const addUrl = () => {
    setFormData(prev => ({
      ...prev,
      urls: [...prev.urls, { title: '', url: '', type: 'link' }]
    }));
  };

  const removeUrl = (index: number) => {
    if (formData.urls.length > 1) {
      setFormData(prev => ({
        ...prev,
        urls: prev.urls.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Empêcher la création/modification depuis une interface externe
      if (viewMode.type === 'external') {
        setError('La création/modification d\'événement n\'est pas autorisée en interface externe.');
        return;
      }

      // Valider les données
      if (!formData.title.trim()) {
        setError('Le titre est requis');
        return;
      }

      if (!formData.description.trim()) {
        setError('La description est requise');
        return;
      }

      if (!formData.date) {
        setError('La date est requise');
        return;
      }

      if (!formData.time) {
        setError('L\'heure est requise');
        return;
      }

      // Filtrer les participants vides
      const validParticipants = formData.participants.filter(p => p.name.trim());
      if (validParticipants.length === 0) {
        setError('Au moins un participant est requis');
        return;
      }

      // Filtrer les pièces jointes vides
      const validAttachments = formData.attachments.filter(a => a.name.trim());
      
      // Filtrer les URLs valides
      const validUrls = formData.urls.filter(u => u.title.trim() && u.url.trim());

      const eventData: Omit<Event, 'id' | 'interlocutorId' | 'createdAt' | 'updatedAt'> = {
        type: formData.type as Event['type'],
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time,
        participants: validParticipants.map((p, index) => ({
          id: `p-${Date.now()}-${index}`,
          name: p.name.trim(),
          role: p.role as 'recipient' | 'sender'
        })),
        attachments: validAttachments.map((a, index) => ({
          id: `a-${Date.now()}-${index}`,
          name: a.name.trim(),
          type: a.type as 'document' | 'pdf' | 'link' | 'image' | 'video',
          url: a.url || undefined
        })),
        urls: validUrls.map((u, index) => ({
          id: `u-${Date.now()}-${index}`,
          title: u.title.trim(),
          url: u.url.trim(),
          type: u.type as 'link' | 'video' | 'pdf' | 'image'
        })),
        status: formData.status as Event['status'],
        priority: formData.priority as Event['priority'],
        createdBy: (viewMode.type === 'admin' || viewMode.type === 'internal')
          ? (formData.createdBy.trim() || `${user?.firstName || 'Utilisateur'} ${user?.lastName || ''}`.trim())
          : (existingEvent?.createdBy || 'Interlocuteur')
      };

      let result: { success: boolean; error?: string };
      if (existingEvent) {
        // Mise à jour
        const updateRes = await InterlocutorService.updateEvent(interlocutorId, existingEvent.id, eventData);
        result = { success: !!updateRes.success, error: updateRes.error };
      } else {
        // Création
        result = await InterlocutorService.createEvent(interlocutorId, eventData);
      }
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Erreur lors de la création de l\'événement');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la création de l\'événement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {existingEvent ? 'Modifier l\'événement' : 'Ajouter un Événement'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-500">❌</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type et Titre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'événement
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="call">Appel</option>
                  <option value="email">Email</option>
                  <option value="meeting">Réunion</option>
                  <option value="task">Tâche</option>
                  <option value="note">Note</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Titre de l'événement"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description de l'événement"
                required
              />
            </div>

            {/* Date et Heure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participants *
              </label>
              {formData.participants.map((participant, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={participant.name}
                    onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom du participant"
                  />
                  <select
                    value={participant.role}
                    onChange={(e) => handleParticipantChange(index, 'role', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recipient">Destinataire</option>
                    <option value="sender">Expéditeur</option>
                  </select>
                  {formData.participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addParticipant}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Ajouter un participant
              </button>
            </div>

            {/* Pièces jointes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pièces jointes
              </label>
              {formData.attachments.map((attachment, index) => (
                <div key={index} className="space-y-2 mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={attachment.name}
                      onChange={(e) => handleAttachmentChange(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du document"
                    />
                    <select
                      value={attachment.type}
                      onChange={(e) => handleAttachmentChange(index, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="document">Document</option>
                      <option value="pdf">PDF</option>
                      <option value="image">Image</option>
                      <option value="video">Vidéo</option>
                    </select>
                    {formData.attachments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={attachment.url || ''}
                    onChange={(e) => handleAttachmentChange(index, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL du fichier (optionnel)"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addAttachment}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Ajouter une pièce jointe
              </button>
            </div>

            {/* URLs et Liens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URLs et Liens
              </label>
              {formData.urls.map((url, index) => (
                <div key={index} className="space-y-2 mb-3 p-3 border border-gray-200 rounded-lg bg-blue-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={url.title}
                      onChange={(e) => handleUrlChange(index, 'title', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Titre du lien"
                    />
                    <select
                      value={url.type}
                      onChange={(e) => handleUrlChange(index, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="link">Lien web</option>
                      <option value="video">Vidéo</option>
                      <option value="pdf">PDF</option>
                      <option value="image">Image</option>
                    </select>
                    {formData.urls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUrl(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={url.url}
                    onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://exemple.com (optionnel)"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addUrl}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Ajouter une URL
              </button>
            </div>

            {/* Statut, Priorité et Créateur */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorité
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Créé par
                </label>
                <input
                  type="text"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du créateur"
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (existingEvent ? 'Enregistrement...' : 'Création...') : (existingEvent ? 'Enregistrer' : 'Créer l\'événement')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
