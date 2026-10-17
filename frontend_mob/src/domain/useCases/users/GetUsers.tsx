import { UserRepositoryImpl } from '../../../data/repositories/UserRepository';

const { getAll } = new UserRepositoryImpl();

export const GetUsersUseCase = async () => {
  return await getAll();
};
