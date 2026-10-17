import { PointRepositoryImpl } from '../../../data/repositories/PointRepository';

const { getAll } = new PointRepositoryImpl();

export const GetPointsUseCase = async () => {
  return await getAll();
};
