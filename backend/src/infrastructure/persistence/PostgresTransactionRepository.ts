import { Pool } from 'pg';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { mapTransaction } from './mappers';

export class PostgresTransactionRepository implements TransactionRepository {
  constructor(private readonly pool: Pool) {}

  async create(data: { userId: string; recyclingPointId: string; wasteCategoryId: string; quantityKg: number; pointsEarned: number }) {
    const result = await this.pool.query(
      `INSERT INTO transactions (user_id, recycling_point_id, waste_category_id, quantity_kg, points_earned)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.userId, data.recyclingPointId, data.wasteCategoryId, data.quantityKg, data.pointsEarned],
    );
    return mapTransaction(result.rows[0]);
  }

  async list() {
    const result = await this.pool.query('SELECT * FROM transactions WHERE deleted_at IS NULL ORDER BY created_at DESC');
    return result.rows.map(mapTransaction);
  }

  async getById(id: string) {
    const result = await this.pool.query('SELECT * FROM transactions WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0] ? mapTransaction(result.rows[0]) : null;
  }

  async update(id: string, data: Partial<{ recyclingPointId: string; wasteCategoryId: string; quantityKg: number; pointsEarned: number }>) {
    const result = await this.pool.query(
      `UPDATE transactions
       SET recycling_point_id = COALESCE($2, recycling_point_id),
           waste_category_id = COALESCE($3, waste_category_id),
           quantity_kg = COALESCE($4, quantity_kg),
           points_earned = COALESCE($5, points_earned),
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, data.recyclingPointId ?? null, data.wasteCategoryId ?? null, data.quantityKg ?? null, data.pointsEarned ?? null],
    );
    return result.rows[0] ? mapTransaction(result.rows[0]) : null;
  }

  async softDelete(id: string) {
    const result = await this.pool.query(
      'UPDATE transactions SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id],
    );
    return result.rowCount === 1;
  }
}
