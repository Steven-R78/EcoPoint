import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recycling_records')
export class RecyclingRecord {
    @PrimaryGeneratedColumn()
    id_record!: number;

    @Column({ type: 'integer' })
    user_id!: number;

    @Column({ type: 'integer' })
    point_id!: number;

    @Column({ type: 'integer', default: 0 })
    points_earned!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    recycled_at!: Date;

    @Column({ type: 'integer', default: 1 })
    status_record!: number;
}
