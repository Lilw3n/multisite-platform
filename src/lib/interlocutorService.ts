import { Interlocutor } from '@/types';
import { mockInterlocutors, getInterlocutorById } from './mockData';

export class InterlocutorService {
  static async getAllInterlocutors(): Promise<Interlocutor[]> {
    return mockInterlocutors;
  }

  static async getInterlocutorById(id: string): Promise<Interlocutor | null> {
    return getInterlocutorById(id) || null;
  }

  static async createInterlocutor(interlocutorData: Omit<Interlocutor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Interlocutor> {
    const newInterlocutor: Interlocutor = {
      ...interlocutorData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockInterlocutors.push(newInterlocutor);
    return newInterlocutor;
  }

  static async updateInterlocutor(id: string, updates: Partial<Interlocutor>): Promise<Interlocutor | null> {
    const interlocutorIndex = mockInterlocutors.findIndex(i => i.id === id);
    if (interlocutorIndex === -1) return null;

    mockInterlocutors[interlocutorIndex] = {
      ...mockInterlocutors[interlocutorIndex],
      ...updates,
      updatedAt: new Date()
    };

    return mockInterlocutors[interlocutorIndex];
  }

  static async deleteInterlocutor(id: string): Promise<boolean> {
    const interlocutorIndex = mockInterlocutors.findIndex(i => i.id === id);
    if (interlocutorIndex === -1) return false;

    mockInterlocutors[interlocutorIndex].status = 'inactive';
    return true;
  }

  static async searchInterlocutors(query: string): Promise<Interlocutor[]> {
    const lowercaseQuery = query.toLowerCase();
    return mockInterlocutors.filter(interlocutor =>
      interlocutor.name.toLowerCase().includes(lowercaseQuery) ||
      interlocutor.email.toLowerCase().includes(lowercaseQuery) ||
      interlocutor.contactPerson.toLowerCase().includes(lowercaseQuery)
    );
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
