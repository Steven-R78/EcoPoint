import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

export const GetRecordsByUserUseCase = async (userId: number) => {
  try {
    const response = await ApiDelivery.get(`/recycling-records/user/${userId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
};
