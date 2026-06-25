import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('materials')
export class Material {
    @PrimaryGeneratedColumn()
    id_material!: number;

    @Column({ type: 'varchar', length: 100 })
    name_material!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    category_material!: string;

    @Column({ type: 'integer', default: 1 })
    status_material!: number;
}
