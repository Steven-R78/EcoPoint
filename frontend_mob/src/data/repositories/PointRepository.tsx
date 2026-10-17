import { AxiosError } from 'axios';
import { RecyclingPoint } from '../../domain/entities/RecyclingPoint';
import { PointRepository } from '../../domain/repositories/PointRepository';
import { ApiDelivery } from '../sources/remote/api/ApiDelivery';
import { ResponseApiDelivery } from '../sources/remote/models/ResponseApiDelivery';

const toPoint = (raw: any): RecyclingPoint => ({
  id: raw.id,
  materialId: raw.materialId ?? null,
  materialIds: raw.materialIds?.length ? raw.materialIds : raw.materialId ? [raw.materialId] : [],
  name: raw.name,
  address: raw.address ?? '',
  latitude: Number(raw.latitude),
  longitude: Number(raw.longitude),
  status: raw.status,
  schedule: raw.schedule ?? null,
  photoUrl: raw.photoUrl ?? null,
});

const toError = (error: unknown, fallback: string): ResponseApiDelivery => {
  const e = error as AxiosError<any>;
  return {
    success: false,
    message: e.response?.data?.error ?? e.message ?? fallback,
  };
};

const payload = (point: Partial<RecyclingPoint>) => ({
  name: point.name,
  address: point.address,
  latitude: point.latitude,
  longitude: point.longitude,
  status: point.status ?? 1,
  materialIds: point.materialIds ?? [],
  materialId: point.materialId ?? point.materialIds?.[0] ?? null,
  schedule: point.schedule ?? null,
  photoUrl: point.photoUrl ?? null,
});

export class PointRepositoryImpl implements PointRepository {
  async getAll(): Promise<ResponseApiDelivery> {
    try {
      const response = await ApiDelivery.get('/recycling-points');
      const points = Array.isArray(response.data) ? response.data.map(toPoint) : [];
      return { success: true, message: 'OK', data: points };
    } catch (error) {
      return toError(error, 'No se pudieron cargar los puntos');
    }
  }

  async getById(id: number): Promise<RecyclingPoint | null> {
    try {
      const response = await ApiDelivery.get(`/recycling-points/id/${id}`);
      return toPoint(response.data);
    } catch {
      return null;
    }
  }

  async create(point: Omit<RecyclingPoint, 'id' | 'distanceKm'>): Promise<ResponseApiDelivery> {
    try {
      const response = await ApiDelivery.post('/recycling-points', payload(point));
      return { success: true, message: response.data.message ?? 'Punto creado', data: response.data };
    } catch (error) {
      return toError(error, 'No se pudo crear el punto');
    }
  }

  async update(id: number, point: Partial<RecyclingPoint>): Promise<ResponseApiDelivery> {
    try {
      const response = await ApiDelivery.put(`/recycling-points/${id}`, payload(point));
      return { success: true, message: response.data.message ?? 'Punto actualizado' };
    } catch (error) {
      return toError(error, 'No se pudo actualizar el punto');
    }
  }

  async remove(id: number): Promise<ResponseApiDelivery> {
    try {
      const response = await ApiDelivery.delete(`/recycling-points/${id}`);
      return { success: true, message: response.data.message ?? 'Punto eliminado' };
    } catch (error) {
      return toError(error, 'No se pudo eliminar el punto');
    }
  }
}
