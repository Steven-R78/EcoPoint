import { Transaction } from '../entities/Transaction';

export interface TransactionRepository {
  create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Transaction>;
  list(): Promise<Transaction[]>;
  getById(id: string): Promise<Transaction | null>;
  update(id: string, data: Partial<Pick<Transaction, 'recyclingPointId' | 'wasteCategoryId' | 'quantityKg' | 'pointsEarned'>>): Promise<Transaction | null>;
  softDelete(id: string): Promise<boolean>;
}
