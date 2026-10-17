import { PointRepositoryImpl } from '../../../data/repositories/PointRepository';
import { RecyclingPoint } from '../../entities/RecyclingPoint';

const { create } = new PointRepositoryImpl();

export const CreatePointUseCase = async (point: Omit<RecyclingPoint, 'id' | 'distanceKm'>) => {
  return await create(point);
};
