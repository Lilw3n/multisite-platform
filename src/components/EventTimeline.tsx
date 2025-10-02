'use client';

import React, { useState } from 'react';
import { Event, EventParticipant, EventAttachment } from '@/types/interlocutor';
import { getCurrentDateForInput, getCurrentTimeRoundedUp } from '@/lib/dateUtils';

interface EventTimelineProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onDuplicateEvent: (event: Event) => void;
  onLinkEvent: (event: Event) => void;
}

export default function EventTimeline({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onDuplicateEvent,
  onLinkEvent
}: EventTimelineProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'call' as const,
    title: '',
    description: '',
    date: getCurrentDateForInput(), // Date actuelle
    time: getCurrentTimeRoundedUp(), // Heure actuelle arrondie au quart d'heure supérieur
    participants: [] as EventParticipant[],
    attachments: [] as EventAttachment[],
    status: 'completed' as const,
    priority: 'medium' as const,
    createdBy: 'Admin System'
  });

  const getEventIcon = (type: Event['type']) => {
    const icons = {
      call: '📞',
      email: '📧',
      meeting: '📅',
      task: '✅',
      note: '📝',
      document: '📄'
    };
    return icons[type];
  };

  const getEventColor = (type: Event['type']) => {
    const colors = {
      call: 'bg-blue-100 text-blue-800',
      email: 'bg-green-100 text-green-800',
      meeting: 'bg-purple-100 text-purple-800',
      task: 'bg-orange-100 text-orange-800',
      note: 'bg-gray-100 text-gray-800',
      document: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type];
  };

  const getPriorityColor = (priority: Event['priority']) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(newEvent);
    setNewEvent({
      type: 'call',
      title: '',
      description: '',
      date: getCurrentDateForInput(), // Date actuelle
      time: getCurrentTimeRoundedUp(), // Heure actuelle arrondie
      participants: [],
      attachments: [],
      status: 'completed',
      priority: 'medium',
      createdBy: 'Admin System'
    });
    setShowAddForm(false);
  };

  const addParticipant = () => {
    setNewEvent(prev => ({
      ...prev,
      participants: [...prev.participants, {
        id: Date.now().toString(),
        name: '',
        role: 'attendee' as const,
        email: ''
      }]
    }));
  };

  const updateParticipant = (index: number, field: keyof EventParticipant, value: string) => {
    setNewEvent(prev => ({
      ...prev,
      participants: prev.participants.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const removeParticipant = (index: number) => {
    setNewEvent(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const addAttachment = () => {
    setNewEvent(prev => ({
      ...prev,
      attachments: [...prev.attachments, {
        id: Date.now().toString(),
        name: '',
        type: 'document' as const,
        url: ''
      }]
    }));
  };

  const updateAttachment = (index: number, field: keyof EventAttachment, value: string) => {
    setNewEvent(prev => ({
      ...prev,
      attachments: prev.attachments.map((a, i) => 
        i === index ? { ...a, [field]: value } : a
      )
    }));
  };

  const removeAttachment = (index: number) => {
    setNewEvent(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          📅 Événements et Suivi
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Ajouter Événement
        </button>
      </div>

      {/* Formulaire d'ajout d'événement */}
      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Nouvel événement</h4>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type d'événement</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as Event['type'] }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="call">📞 Appel</option>
                  <option value="email">📧 Email</option>
                  <option value="meeting">📅 Rendez-vous</option>
                  <option value="task">✅ Tâche</option>
                  <option value="note">📝 Note</option>
                  <option value="document">📄 Document</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Titre</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Heure</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Participants */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Participants</label>
                <button
                  type="button"
                  onClick={addParticipant}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Ajouter participant
                </button>
              </div>
              {newEvent.participants.map((participant, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nom"
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={participant.role}
                    onChange={(e) => updateParticipant(index, 'role', e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="sender">Expéditeur</option>
                    <option value="recipient">Destinataire</option>
                    <option value="attendee">Participant</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Pièces jointes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Pièces jointes</label>
                <button
                  type="button"
                  onClick={addAttachment}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Ajouter pièce jointe
                </button>
              </div>
              {newEvent.attachments.map((attachment, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nom du fichier"
                    value={attachment.name}
                    onChange={(e) => updateAttachment(index, 'name', e.target.value)}
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={attachment.type}
                    onChange={(e) => updateAttachment(index, 'type', e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="document">Document</option>
                    <option value="link">Lien</option>
                    <option value="image">Image</option>
                    <option value="pdf">PDF</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Ajouter l'événement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline des événements */}
      <div className="space-y-4">
        {events.length > 0 ? (
          events
            .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
            .map((event) => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  {/* Icône de l'événement */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>

                  {/* Contenu de l'événement */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        
                        {/* Participants */}
                        {event.participants.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {event.participants.map((participant) => (
                              <span
                                key={participant.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                👤 {participant.name} ({participant.role === 'sender' ? 'Expéditeur' : participant.role === 'recipient' ? 'Destinataire' : 'Participant'})
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Pièces jointes */}
                        {event.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {event.attachments.map((attachment) => (
                              <span
                                key={attachment.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {attachment.type === 'document' ? '📄' : 
                                 attachment.type === 'link' ? '🔗' : 
                                 attachment.type === 'image' ? '🖼️' : '📋'} {attachment.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Date et heure */}
                      <div className="text-right text-sm text-gray-500">
                        {event.date} {event.time}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => onEditEvent(event)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => onDuplicateEvent(event)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Dupliquer
                      </button>
                      <button
                        onClick={() => onLinkEvent(event)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Lier
                      </button>
                      <button
                        onClick={() => onDeleteEvent(event.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun événement enregistré</p>
            <p className="text-gray-400 text-sm mt-1">Cliquez sur "Ajouter Événement" pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
}
