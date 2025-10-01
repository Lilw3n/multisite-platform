'use client';

import React from 'react';
import { mockUsers, mockInterlocutors } from '@/lib/mockData';

export const TestData: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test des Données</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Utilisateurs ({mockUsers.length})</h3>
        <div className="space-y-2">
          {mockUsers.map(user => (
            <div key={user.id} className="p-2 border rounded">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nom:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Mot de passe:</strong> {user.password}</p>
              <p><strong>Actif:</strong> {user.isActive ? 'Oui' : 'Non'}</p>
              <p><strong>Rôles:</strong> {user.roles.map(r => r.name).join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Interlocuteurs ({mockInterlocutors.length})</h3>
        <div className="space-y-2">
          {mockInterlocutors.map(interlocutor => (
            <div key={interlocutor.id} className="p-2 border rounded">
              <p><strong>Nom:</strong> {interlocutor.name}</p>
              <p><strong>Type:</strong> {interlocutor.type}</p>
              <p><strong>Email:</strong> {interlocutor.email}</p>
              <p><strong>Statut:</strong> {interlocutor.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
