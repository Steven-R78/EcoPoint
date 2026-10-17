import { Entity, PrimaryColumn } from 'typeorm';

@Entity('point_materials')
export class PointMaterial {
    @PrimaryColumn({ type: 'integer' })
    point_id!: number;

    @PrimaryColumn({ type: 'integer' })
    material_id!: number;
}
