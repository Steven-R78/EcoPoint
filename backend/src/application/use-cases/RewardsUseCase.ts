import { RewardRepository } from '../../domain/repositories/RewardRepository';

export class RewardsUseCase {
  constructor(private readonly repository: RewardRepository) {}

  create(data: { name: string; description: string; pointsCost: number; stock: number }) {
    if (data.pointsCost <= 0) {
      throw new Error('El costo en puntos debe ser mayor que cero');
    }

    return this.repository.create(data);
  }

  list() {
    return this.repository.list();
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  update(id: string, data: Partial<{ name: string; description: string; pointsCost: number; stock: number }>) {
    if (data.pointsCost !== undefined && data.pointsCost <= 0) {
      throw new Error('El costo en puntos debe ser mayor que cero');
    }

    return this.repository.update(id, data);
  }

  softDelete(id: string) {
    return this.repository.softDelete(id);
  }
}
