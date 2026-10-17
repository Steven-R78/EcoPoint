import { User } from '../entities/User';
import { ApiResponse } from '../../data/sources/remote/models/ApiResponse';

export interface AuthRepository {
  login(email: string, password: string): Promise<ApiResponse>;
  register(user: User): Promise<ApiResponse>;
}
