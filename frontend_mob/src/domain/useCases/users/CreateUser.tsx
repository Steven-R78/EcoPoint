import { UserRepositoryImpl } from '../../../data/repositories/UserRepository';
import { User } from '../../entities/User';

const { create } = new UserRepositoryImpl();

export const CreateUserUseCase = async (user: Partial<User> & { password?: string }) => {
  return await create(user);
};
