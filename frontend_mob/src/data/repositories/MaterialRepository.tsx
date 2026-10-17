import { AxiosError } from 'axios';
import { Material } from '../../domain/entities/Material';
import { MaterialRepository } from '../../domain/repositories/MaterialRepository';
import { ApiClient } from '../sources/remote/api/ApiClient';
import { ApiResponse } from '../sources/remote/models/ApiResponse';

export class MaterialRepositoryImpl implements MaterialRepository {
  async getAll(): Promise<ApiResponse> {
    try {
      const response = await ApiClient.get<Material[]>('/materials');
      return { success: true, message: 'OK', data: response.data };
    } catch (error) {
      const e = error as AxiosError<any>;
      return {
        success: false,
        message: e.response?.data?.error ?? e.message ?? 'No se pudieron cargar los materiales',
      };
    }
  }
}
