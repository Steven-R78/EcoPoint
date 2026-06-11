import { Rating } from '../entities/Rating';

export interface RatingRepository {
  create(data: Omit<Rating, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Rating>;
  list(): Promise<Rating[]>;
  getById(id: string): Promise<Rating | null>;
  findByUserAndPoint(userId: string, recyclingPointId: string): Promise<Rating | null>;
  update(id: string, data: Partial<Pick<Rating, 'score' | 'comment'>>): Promise<Rating | null>;
  softDelete(id: string): Promise<boolean>;
}
