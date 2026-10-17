import { MaterialRepositoryImpl } from '../../../data/repositories/MaterialRepository';

const { getAll } = new MaterialRepositoryImpl();

export const GetMaterialsUseCase = async () => {
  return await getAll();
};
