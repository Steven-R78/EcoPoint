import { Pool } from 'pg';
import { RewardRepository } from '../../domain/repositories/RewardRepository';
import { mapReward } from './mappers';

export class PostgresRewardRepository implements RewardRepository {
  constructor(private readonly pool: Pool) {}

  async create(data: { name: string; description: string; pointsCost: number; stock: number }) {
    const result = await this.pool.query(
      'INSERT INTO rewards (name, description, points_cost, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.name, data.description, data.pointsCost, data.stock],
    );
    return mapReward(result.rows[0]);
  }

  async list() {
    const result = await this.pool.query('SELECT * FROM rewards WHERE deleted_at IS NULL ORDER BY created_at DESC');
    return result.rows.map(mapReward);
  }

  async getById(id: string) {
    const result = await this.pool.query('SELECT * FROM rewards WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0] ? mapReward(result.rows[0]) : null;
  }

  async update(id: string, data: Partial<{ name: string; description: string; pointsCost: number; stock: number }>) {
    const result = await this.pool.query(
      `UPDATE rewards
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           points_cost = COALESCE($4, points_cost),
           stock = COALESCE($5, stock),
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, data.name ?? null, data.description ?? null, data.pointsCost ?? null, data.stock ?? null],
    );
    return result.rows[0] ? mapReward(result.rows[0]) : null;
  }

  async softDelete(id: string) {
    const result = await this.pool.query(
      'UPDATE rewards SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id],
    );
    return result.rowCount === 1;
  }
}
