import { AxiosError } from 'axios';
import { Material } from '../../domain/entities/Material';
import { MaterialRepository } from '../../domain/repositories/MaterialRepository';
import { ApiDelivery } from '../sources/remote/api/ApiDelivery';
import { ResponseApiDelivery } from '../sources/remote/models/ResponseApiDelivery';

export class MaterialRepositoryImpl implements MaterialRepository {
  async getAll(): Promise<ResponseApiDelivery> {
    try {
      const response = await ApiDelivery.get<Material[]>('/materials');
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
