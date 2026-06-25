import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth_sessions')
export class AuthSession {
    @PrimaryGeneratedColumn()
    id_session!: number;

    @Column({ type: 'integer' })
    user_id!: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    token!: string;

    @Column({ type: 'timestamp' })
    expires_at!: Date;

    @Column({ type: 'integer', default: 1 })
    status_session!: number;
}
