import { PointRepositoryImpl } from '../../../data/repositories/PointRepository';

const { remove } = new PointRepositoryImpl();

export const DeletePointUseCase = async (id: number) => {
  return await remove(id);
};
