import { Pool } from 'pg';
import { RatingRepository } from '../../domain/repositories/RatingRepository';
import { mapRating } from './mappers';

export class PostgresRatingRepository implements RatingRepository {
  constructor(private readonly pool: Pool) {}

  async create(data: { userId: string; recyclingPointId: string; score: number; comment: string }) {
    const result = await this.pool.query(
      'INSERT INTO ratings (user_id, recycling_point_id, score, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.userId, data.recyclingPointId, data.score, data.comment],
    );
    return mapRating(result.rows[0]);
  }

  async list() {
    const result = await this.pool.query('SELECT * FROM ratings WHERE deleted_at IS NULL ORDER BY created_at DESC');
    return result.rows.map(mapRating);
  }

  async getById(id: string) {
    const result = await this.pool.query('SELECT * FROM ratings WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0] ? mapRating(result.rows[0]) : null;
  }

  async findByUserAndPoint(userId: string, recyclingPointId: string) {
    const result = await this.pool.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND recycling_point_id = $2 AND deleted_at IS NULL',
      [userId, recyclingPointId],
    );
    return result.rows[0] ? mapRating(result.rows[0]) : null;
  }

  async update(id: string, data: Partial<{ score: number; comment: string }>) {
    const result = await this.pool.query(
      `UPDATE ratings
       SET score = COALESCE($2, score),
           comment = COALESCE($3, comment),
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, data.score ?? null, data.comment ?? null],
    );
    return result.rows[0] ? mapRating(result.rows[0]) : null;
  }

  async softDelete(id: string) {
    const result = await this.pool.query(
      'UPDATE ratings SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id],
    );
    return result.rowCount === 1;
  }
}
