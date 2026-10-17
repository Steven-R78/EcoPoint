import { RecyclingPoint } from '../entities/RecyclingPoint';
import { ApiResponse } from '../../data/sources/remote/models/ApiResponse';

export interface PointRepository {
  getAll(): Promise<ApiResponse>;
  getById(id: number): Promise<RecyclingPoint | null>;
  create(point: Omit<RecyclingPoint, 'id' | 'distanceKm'>): Promise<ApiResponse>;
  update(id: number, point: Partial<RecyclingPoint>): Promise<ApiResponse>;
  remove(id: number): Promise<ApiResponse>;
}
