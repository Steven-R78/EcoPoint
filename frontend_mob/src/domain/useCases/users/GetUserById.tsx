import { UserRepositoryImpl } from '../../../data/repositories/UserRepository';

const { getById } = new UserRepositoryImpl();

export const GetUserByIdUseCase = async (id: number) => {
  return await getById(id);
};
