import { RecyclingPointRepository } from '../../domain/repositories/RecyclingPointRepository';

export class RecyclingPointsUseCase {
  constructor(private readonly repository: RecyclingPointRepository) {}

  create(data: {
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    openingHours: string;
  }) {
    return this.repository.create(data);
  }

  list() {
    return this.repository.list();
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  update(id: string, data: Partial<{ name: string; address: string; city: string; latitude: number; longitude: number; openingHours: string }>) {
    return this.repository.update(id, data);
  }

  softDelete(id: string) {
    return this.repository.softDelete(id);
  }
}
