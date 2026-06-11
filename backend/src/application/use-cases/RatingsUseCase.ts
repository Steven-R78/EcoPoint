import { RatingRepository } from '../../domain/repositories/RatingRepository';

export class RatingsUseCase {
  constructor(private readonly repository: RatingRepository) {}

  async create(data: { userId: string; recyclingPointId: string; score: number; comment: string }) {
    const previous = await this.repository.findByUserAndPoint(data.userId, data.recyclingPointId);
    if (previous) {
      throw new Error('El usuario ya valoró este punto de reciclaje');
    }

    return this.repository.create(data);
  }

  list() {
    return this.repository.list();
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  update(id: string, data: Partial<{ score: number; comment: string }>) {
    return this.repository.update(id, data);
  }

  softDelete(id: string) {
    return this.repository.softDelete(id);
  }
}
