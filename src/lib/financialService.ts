import { FinancialTransaction } from '@/types';
import { mockFinancialTransactions, getFinancialTransactionById } from './mockData';

export class FinancialService {
  static async getAllTransactions(): Promise<FinancialTransaction[]> {
    return mockFinancialTransactions;
  }

  static async getTransactionById(id: string): Promise<FinancialTransaction | null> {
    return getFinancialTransactionById(id) || null;
  }

  static async getTransactionsByType(type: 'receivable' | 'debit'): Promise<FinancialTransaction[]> {
    return mockFinancialTransactions.filter(transaction => transaction.type === type);
  }

  static async getTransactionsByStatus(status: 'pending' | 'paid' | 'overdue'): Promise<FinancialTransaction[]> {
    return mockFinancialTransactions.filter(transaction => transaction.status === status);
  }

  static async getTransactionsByInterlocutor(interlocutorId: string): Promise<FinancialTransaction[]> {
    return mockFinancialTransactions.filter(transaction => 
      transaction.interlocutor === interlocutorId || 
      transaction.interlocutor.includes(interlocutorId)
    );
  }

  static async createTransaction(transactionData: Omit<FinancialTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancialTransaction> {
    const newTransaction: FinancialTransaction = {
      ...transactionData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockFinancialTransactions.push(newTransaction);
    return newTransaction;
  }

  static async updateTransaction(id: string, updates: Partial<FinancialTransaction>): Promise<FinancialTransaction | null> {
    const transactionIndex = mockFinancialTransactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) return null;

    mockFinancialTransactions[transactionIndex] = {
      ...mockFinancialTransactions[transactionIndex],
      ...updates,
      updatedAt: new Date()
    };

    return mockFinancialTransactions[transactionIndex];
  }

  static async markAsPaid(id: string, paymentDate: Date): Promise<FinancialTransaction | null> {
    return this.updateTransaction(id, {
      status: 'paid',
      paymentDate
    });
  }

  static async getFinancialSummary(): Promise<{
    totalReceivables: number;
    totalDebits: number;
    pendingAmount: number;
    overdueAmount: number;
    paidAmount: number;
  }> {
    const receivables = mockFinancialTransactions.filter(t => t.type === 'receivable');
    const debits = mockFinancialTransactions.filter(t => t.type === 'debit');
    
    const totalReceivables = receivables.reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = debits.reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = receivables.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
    const overdueAmount = receivables.filter(t => t.status === 'overdue').reduce((sum, t) => sum + t.amount, 0);
    const paidAmount = receivables.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0);

    return {
      totalReceivables,
      totalDebits,
      pendingAmount,
      overdueAmount,
      paidAmount
    };
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
