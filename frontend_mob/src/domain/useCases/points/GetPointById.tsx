import { PointRepositoryImpl } from '../../../data/repositories/PointRepository';

const { getById } = new PointRepositoryImpl();

export const GetPointByIdUseCase = async (id: number) => {
  return await getById(id);
};
