import { Pool } from 'pg';
import { RecyclingPointRepository } from '../../domain/repositories/RecyclingPointRepository';
import { mapRecyclingPoint } from './mappers';

export class PostgresRecyclingPointRepository implements RecyclingPointRepository {
  constructor(private readonly pool: Pool) {}

  async create(data: { name: string; address: string; city: string; latitude: number; longitude: number; openingHours: string }) {
    const result = await this.pool.query(
      `INSERT INTO recycling_points (name, address, city, latitude, longitude, opening_hours)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.name, data.address, data.city, data.latitude, data.longitude, data.openingHours],
    );
    return mapRecyclingPoint(result.rows[0]);
  }

  async list() {
    const result = await this.pool.query('SELECT * FROM recycling_points WHERE deleted_at IS NULL ORDER BY created_at DESC');
    return result.rows.map(mapRecyclingPoint);
  }

  async getById(id: string) {
    const result = await this.pool.query('SELECT * FROM recycling_points WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0] ? mapRecyclingPoint(result.rows[0]) : null;
  }

  async update(id: string, data: Partial<{ name: string; address: string; city: string; latitude: number; longitude: number; openingHours: string }>) {
    const result = await this.pool.query(
      `UPDATE recycling_points
       SET name = COALESCE($2, name),
           address = COALESCE($3, address),
           city = COALESCE($4, city),
           latitude = COALESCE($5, latitude),
           longitude = COALESCE($6, longitude),
           opening_hours = COALESCE($7, opening_hours),
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, data.name ?? null, data.address ?? null, data.city ?? null, data.latitude ?? null, data.longitude ?? null, data.openingHours ?? null],
    );
    return result.rows[0] ? mapRecyclingPoint(result.rows[0]) : null;
  }

  async softDelete(id: string) {
    const result = await this.pool.query(
      'UPDATE recycling_points SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id],
    );
    return result.rowCount === 1;
  }
}
