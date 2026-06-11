import { WasteCategoryRepository } from '../../domain/repositories/WasteCategoryRepository';

export class WasteCategoriesUseCase {
  constructor(private readonly repository: WasteCategoryRepository) {}

  create(name: string, description: string, pointsPerKg: number) {
    return this.repository.create({ name, description, pointsPerKg });
  }

  list() {
    return this.repository.list();
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  update(id: string, data: { name?: string; description?: string; pointsPerKg?: number }) {
    return this.repository.update(id, data);
  }

  softDelete(id: string) {
    return this.repository.softDelete(id);
  }
}
