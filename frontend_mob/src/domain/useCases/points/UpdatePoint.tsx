import { PointRepositoryImpl } from '../../../data/repositories/PointRepository';
import { RecyclingPoint } from '../../entities/RecyclingPoint';

const { update } = new PointRepositoryImpl();

export const UpdatePointUseCase = async (id: number, point: Partial<RecyclingPoint>) => {
  return await update(id, point);
};
