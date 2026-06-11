import { RecyclingPoint } from '../entities/RecyclingPoint';

export interface RecyclingPointRepository {
  create(data: Omit<RecyclingPoint, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<RecyclingPoint>;
  list(): Promise<RecyclingPoint[]>;
  getById(id: string): Promise<RecyclingPoint | null>;
  update(id: string, data: Partial<Omit<RecyclingPoint, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<RecyclingPoint | null>;
  softDelete(id: string): Promise<boolean>;
}
