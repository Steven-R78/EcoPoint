import { User } from '../entities/User';
import { ResponseApiDelivery } from '../../data/sources/remote/models/ResponseApiDelivery';

export interface UserRepository {
  getAll(): Promise<ResponseApiDelivery>;
  getById(id: number): Promise<User | null>;
  create(user: Partial<User> & { password?: string }): Promise<ResponseApiDelivery>;
  update(id: number, user: Partial<User>): Promise<ResponseApiDelivery>;
  remove(id: number): Promise<ResponseApiDelivery>;
}
