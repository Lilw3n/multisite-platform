import { Task, Event } from '@/types';
import { mockTasks, mockEvents, getTaskById, getEventById } from './mockData';

export class TaskService {
  // Tâches
  static async getAllTasks(): Promise<Task[]> {
    return mockTasks;
  }

  static async getTaskById(id: string): Promise<Task | null> {
    return getTaskById(id) || null;
  }

  static async getTasksByStatus(status: 'pending' | 'in_progress' | 'completed'): Promise<Task[]> {
    return mockTasks.filter(task => task.status === status);
  }

  static async getTasksByPriority(priority: 'low' | 'medium' | 'high'): Promise<Task[]> {
    return mockTasks.filter(task => task.priority === priority);
  }

  static async getTasksByAssignee(assignee: string): Promise<Task[]> {
    return mockTasks.filter(task => task.assignedTo === assignee);
  }

  static async getOverdueTasks(): Promise<Task[]> {
    const now = new Date();
    return mockTasks.filter(task => 
      (task.status === 'pending' || task.status === 'in_progress') && 
      task.dueDate < now
    );
  }

  static async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockTasks.push(newTask);
    return newTask;
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return null;

    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };

    return mockTasks[taskIndex];
  }

  static async completeTask(id: string): Promise<Task | null> {
    return this.updateTask(id, {
      status: 'completed',
      updatedAt: new Date()
    });
  }

  static async deleteTask(id: string): Promise<boolean> {
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return false;

    mockTasks.splice(taskIndex, 1);
    return true;
  }

  // Événements
  static async getAllEvents(): Promise<Event[]> {
    return mockEvents;
  }

  static async getEventById(id: string): Promise<Event | null> {
    return getEventById(id) || null;
  }

  static async getEventsByType(type: string): Promise<Event[]> {
    return mockEvents.filter(event => event.type === type);
  }

  static async getEventsByInterlocutor(interlocutorId: string): Promise<Event[]> {
    return mockEvents.filter(event => 
      event.interlocutor === interlocutorId || 
      event.interlocutor.includes(interlocutorId)
    );
  }

  static async getRecentEvents(days: number = 30): Promise<Event[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return mockEvents.filter(event => event.date >= cutoffDate);
  }

  static async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const newEvent: Event = {
      ...eventData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockEvents.push(newEvent);
    return newEvent;
  }

  // Statistiques
  static async getTaskSummary(): Promise<{
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    overdueTasks: number;
    highPriorityTasks: number;
  }> {
    const totalTasks = mockTasks.length;
    const pendingTasks = mockTasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = mockTasks.filter(t => t.status === 'in_progress').length;
    const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
    const overdueTasks = (await this.getOverdueTasks()).length;
    const highPriorityTasks = mockTasks.filter(t => t.priority === 'high').length;

    return {
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      highPriorityTasks
    };
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
