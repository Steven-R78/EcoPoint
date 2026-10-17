import { ApiClient } from '../../../data/sources/remote/api/ApiClient';

export const GetRecordsByUserUseCase = async (userId: number) => {
  try {
    const response = await ApiClient.get(`/recycling-records/user/${userId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
};
