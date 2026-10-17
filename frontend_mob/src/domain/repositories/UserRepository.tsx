import { User } from '../entities/User';
import { ApiResponse } from '../../data/sources/remote/models/ApiResponse';

export interface UserRepository {
  getAll(): Promise<ApiResponse>;
  getById(id: number): Promise<User | null>;
  create(user: Partial<User> & { password?: string }): Promise<ApiResponse>;
  update(id: number, user: Partial<User>): Promise<ApiResponse>;
  remove(id: number): Promise<ApiResponse>;
}
