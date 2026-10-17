import { UserRepositoryImpl } from '../../../data/repositories/UserRepository';

const { remove } = new UserRepositoryImpl();

export const DeleteUserUseCase = async (id: number) => {
  return await remove(id);
};
