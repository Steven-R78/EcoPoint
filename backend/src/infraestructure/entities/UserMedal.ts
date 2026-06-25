import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_medals')
export class UserMedal {
    @PrimaryColumn({ type: 'integer' })
    user_id!: number;

    @PrimaryColumn({ type: 'integer' })
    medal_id!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    earned_at!: Date;
}
