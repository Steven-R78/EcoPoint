import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('medals')
export class Medal {
    @PrimaryGeneratedColumn()
    id_medal!: number;

    @Column({ type: 'varchar', length: 100 })
    name_medal!: string;

    @Column({ type: 'integer' })
    points_required!: number;

    @Column({ type: 'integer', default: 1 })
    status_medal!: number;
}
