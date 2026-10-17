import { ApiClient } from '../../../data/sources/remote/api/ApiClient';
import { ApiResponse } from '../../../data/sources/remote/models/ApiResponse';
import { AxiosError } from 'axios';

export const CreateRecordUseCase = async (payload: {
  userId: number;
  pointId: number;
  pointsEarned?: number;
  photoUrl?: string | null;
}): Promise<ApiResponse> => {
  try {
    const response = await ApiClient.post('/recycling-records', {
      userId: payload.userId,
      pointId: payload.pointId,
      pointsEarned: payload.pointsEarned ?? 50,
      status: 1,
      photoUrl: payload.photoUrl ?? null,
    });
    return {
      success: true,
      message: response.data.message ?? 'Aporte registrado',
      data: response.data,
    };
  } catch (error) {
    const e = error as AxiosError<any>;
    return {
      success: false,
      message: e.response?.data?.error ?? e.message ?? 'No se pudo registrar el aporte',
    };
  }
};
