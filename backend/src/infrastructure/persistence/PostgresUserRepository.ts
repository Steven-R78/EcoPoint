import { Pool } from 'pg';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { mapUser } from './mappers';

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  async create(data: { fullName: string; email: string; passwordHash: string }) {
    const result = await this.pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.fullName, data.email, data.passwordHash],
    );

    return mapUser(result.rows[0]);
  }

  async list() {
    const result = await this.pool.query('SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC');
    return result.rows.map(mapUser);
  }

  async getById(id: string) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async getByEmail(email: string) {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async update(id: string, data: { fullName?: string; email?: string; passwordHash?: string }) {
    const result = await this.pool.query(
      `UPDATE users
       SET full_name = COALESCE($2, full_name),
           email = COALESCE($3, email),
           password_hash = COALESCE($4, password_hash),
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, data.fullName ?? null, data.email ?? null, data.passwordHash ?? null],
    );

    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async softDelete(id: string) {
    const result = await this.pool.query(
      'UPDATE users SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id],
    );
    return result.rowCount === 1;
  }

  async adjustPoints(id: string, delta: number) {
    const result = await this.pool.query(
      `UPDATE users
       SET points = GREATEST(0, points + $2),
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, delta],
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }
}
