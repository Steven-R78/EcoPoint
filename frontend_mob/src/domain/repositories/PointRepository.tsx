import { RecyclingPoint } from '../entities/RecyclingPoint';
import { ResponseApiDelivery } from '../../data/sources/remote/models/ResponseApiDelivery';

export interface PointRepository {
  getAll(): Promise<ResponseApiDelivery>;
  getById(id: number): Promise<RecyclingPoint | null>;
  create(point: Omit<RecyclingPoint, 'id' | 'distanceKm'>): Promise<ResponseApiDelivery>;
  update(id: number, point: Partial<RecyclingPoint>): Promise<ResponseApiDelivery>;
  remove(id: number): Promise<ResponseApiDelivery>;
}
