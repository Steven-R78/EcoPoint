import { ResponseApiDelivery } from '../../data/sources/remote/models/ResponseApiDelivery';

export interface MaterialRepository {
  getAll(): Promise<ResponseApiDelivery>;
}
