import { User } from '../entities/User';

export interface UserRepository {
  create(data: Pick<User, 'fullName' | 'email' | 'passwordHash'>): Promise<User>;
  list(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  update(id: string, data: Partial<Pick<User, 'fullName' | 'email' | 'passwordHash'>>): Promise<User | null>;
  softDelete(id: string): Promise<boolean>;
  adjustPoints(id: string, delta: number): Promise<User | null>;
}
