import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id_role!: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    name_role!: string;

    @Column({ type: 'integer', default: 1 })
    status_role!: number;
}
