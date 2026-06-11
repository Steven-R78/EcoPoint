import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { WasteCategoryRepository } from '../../domain/repositories/WasteCategoryRepository';
import { TransactionPointsService } from '../../domain/services/TransactionPointsService';

export class TransactionsUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
    private readonly wasteCategoryRepository: WasteCategoryRepository,
    private readonly pointsService: TransactionPointsService,
  ) {}

  async create(data: {
    userId: string;
    recyclingPointId: string;
    wasteCategoryId: string;
    quantityKg: number;
  }) {
    const category = await this.wasteCategoryRepository.getById(data.wasteCategoryId);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }

    const pointsEarned = this.pointsService.calculatePoints(data.quantityKg, category.pointsPerKg);
    const transaction = await this.transactionRepository.create({ ...data, pointsEarned });
    await this.userRepository.adjustPoints(data.userId, pointsEarned);
    return transaction;
  }

  list() {
    return this.transactionRepository.list();
  }

  getById(id: string) {
    return this.transactionRepository.getById(id);
  }

  async update(
    id: string,
    data: Partial<{
      recyclingPointId: string;
      wasteCategoryId: string;
      quantityKg: number;
    }>,
  ) {
    const existing = await this.transactionRepository.getById(id);
    if (!existing) {
      return null;
    }

    let categoryId = data.wasteCategoryId ?? existing.wasteCategoryId;
    let quantityKg = data.quantityKg ?? existing.quantityKg;

    const category = await this.wasteCategoryRepository.getById(categoryId);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }

    const nextPoints = this.pointsService.calculatePoints(quantityKg, category.pointsPerKg);
    const updated = await this.transactionRepository.update(id, {
      recyclingPointId: data.recyclingPointId,
      wasteCategoryId: categoryId,
      quantityKg,
      pointsEarned: nextPoints,
    });

    if (updated) {
      await this.userRepository.adjustPoints(updated.userId, nextPoints - existing.pointsEarned);
    }

    return updated;
  }

  async softDelete(id: string) {
    const existing = await this.transactionRepository.getById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.transactionRepository.softDelete(id);
    if (deleted) {
      await this.userRepository.adjustPoints(existing.userId, -existing.pointsEarned);
    }

    return deleted;
  }
}
