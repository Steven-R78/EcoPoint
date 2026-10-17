import { UserRepositoryImpl } from '../../../data/repositories/UserRepository';
import { User } from '../../entities/User';

const { update } = new UserRepositoryImpl();

export const UpdateUserUseCase = async (id: number, user: Partial<User>) => {
  return await update(id, user);
};
