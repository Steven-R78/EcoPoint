import { AxiosError } from 'axios';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { ApiClient } from '../sources/remote/api/ApiClient';
import { ApiResponse } from '../sources/remote/models/ApiResponse';

const toUser = (raw: any): User => ({
  id: raw.id,
  name: raw.name,
  email: raw.email,
  status: raw.status,
  roleId: raw.roleId,
  documentType: raw.documentType ?? null,
  documentNumber: raw.documentNumber ?? null,
});

const toError = (error: unknown, fallback: string): ApiResponse => {
  const e = error as AxiosError<any>;
  return {
    success: false,
    message: e.response?.data?.error ?? e.message ?? fallback,
  };
};

export class UserRepositoryImpl implements UserRepository {
  async getAll(): Promise<ApiResponse> {
    try {
      const response = await ApiClient.get('/users');
      const users = Array.isArray(response.data) ? response.data.map(toUser) : [];
      return { success: true, message: 'OK', data: users };
    } catch (error) {
      return toError(error, 'No se pudieron cargar los usuarios');
    }
  }

  async getById(id: number): Promise<User | null> {
    try {
      const response = await ApiClient.get(`/users/id/${id}`);
      return toUser(response.data);
    } catch {
      return null;
    }
  }

  async create(user: Partial<User> & { password?: string }): Promise<ApiResponse> {
    try {
      const response = await ApiClient.post('/users', {
        name: user.name,
        email: user.email,
        password: user.password,
        status: user.status ?? 1,
        roleId: user.roleId ?? 2,
        documentType: user.documentType ?? null,
        documentNumber: user.documentNumber ?? null,
      });
      return { success: true, message: response.data.message ?? 'Usuario creado', data: response.data };
    } catch (error) {
      return toError(error, 'No se pudo crear el usuario');
    }
  }

  async update(id: number, user: Partial<User>): Promise<ApiResponse> {
    try {
      const response = await ApiClient.put(`/users/${id}`, user);
      return { success: true, message: response.data.message ?? 'Usuario actualizado' };
    } catch (error) {
      return toError(error, 'No se pudo actualizar el usuario');
    }
  }

  async remove(id: number): Promise<ApiResponse> {
    try {
      const response = await ApiClient.delete(`/users/${id}`);
      return { success: true, message: response.data.message ?? 'Usuario eliminado' };
    } catch (error) {
      return toError(error, 'No se pudo eliminar el usuario');
    }
  }
}
