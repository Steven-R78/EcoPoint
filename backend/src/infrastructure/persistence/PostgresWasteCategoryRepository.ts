import { Pool } from 'pg';
import { WasteCategoryRepository } from '../../domain/repositories/WasteCategoryRepository';
import { mapWasteCategory } from './mappers';

export class PostgresWasteCategoryRepository implements WasteCategoryRepository {
  constructor(private readonly pool: Pool) {}

  async create(data: { name: string; description: string; pointsPerKg: number }) {
    const result = await this.pool.query(
      'INSERT INTO waste_categories (name, description, points_per_kg) VALUES ($1, $2, $3) RETURNING *',
      [data.name, data.description, data.pointsPerKg],
    );
    return mapWasteCategory(result.rows[0]);
  }

  async list() {
    const result = await this.pool.query('SELECT * FROM waste_categories WHERE deleted_at IS NULL ORDER BY name');
    return result.rows.map(mapWasteCategory);
  }

  async getById(id: string) {
    const result = await this.pool.query('SELECT * FROM waste_categories WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0] ? mapWasteCategory(result.rows[0]) : null;
  }

  async update(id: string, data: { name?: string; description?: string; pointsPerKg?: number }) {
    const result = await this.pool.query(
      `UPDATE waste_categories
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           points_per_kg = COALESCE($4, points_per_kg),
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, data.name ?? null, data.description ?? null, data.pointsPerKg ?? null],
    );
    return result.rows[0] ? mapWasteCategory(result.rows[0]) : null;
  }

  async softDelete(id: string) {
    const result = await this.pool.query(
      'UPDATE waste_categories SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id],
    );
    return result.rowCount === 1;
  }
}
