import { ApiResponse } from '../../data/sources/remote/models/ApiResponse';

export interface MaterialRepository {
  getAll(): Promise<ApiResponse>;
}
