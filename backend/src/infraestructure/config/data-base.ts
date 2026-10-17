import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { Material } from '../entities/Material';
import { RecyclingPoint } from '../entities/RecyclingPoint';
import { RecyclingRecord } from '../entities/RecyclingRecord';
import { Medal } from '../entities/Medal';
import { UserMedal } from '../entities/UserMedal';
import { AuthSession } from '../entities/AuthSession';
import { PointMaterial } from '../entities/PointMaterial';
import envs from './environment-vars';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: envs.DB_HOST,
    port: Number(envs.DB_PORT),
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [
        Role,
        User,
        AuthSession,
        Material,
        RecyclingPoint,
        PointMaterial,
        RecyclingRecord,
        Medal,
        UserMedal,
    ],
});

async function seedInitialData() {
    const roleRepo = AppDataSource.getRepository(Role);
    const roleCount = await roleRepo.count();
    if (roleCount === 0) {
        await roleRepo.save([
            { id_role: 1, name_role: 'admin', status_role: 1 },
            { id_role: 2, name_role: 'reciclador', status_role: 1 },
        ]);
        await AppDataSource.query(
            `SELECT setval(pg_get_serial_sequence('roles', 'id_role'), (SELECT MAX(id_role) FROM roles))`
        );
    }

    const materialRepo = AppDataSource.getRepository(Material);
    const defaultMaterials = [
        { name_material: 'Plastico', category_material: 'Envases' },
        { name_material: 'Papel y carton', category_material: 'Papel' },
        { name_material: 'Vidrio', category_material: 'Envases' },
        { name_material: 'Metal', category_material: 'Latas' },
        { name_material: 'Organicos', category_material: 'Organicos' },
        { name_material: 'RAEE', category_material: 'Electronicos' },
        { name_material: 'Carton', category_material: 'Papel' },
    ];
    for (const material of defaultMaterials) {
        const exists = await materialRepo.findOne({ where: { name_material: material.name_material } });
        if (!exists) {
            await materialRepo.save({ ...material, status_material: 1 });
        }
    }

    const medalRepo = AppDataSource.getRepository(Medal);
    if (await medalRepo.count() === 0) {
        await medalRepo.save([
            { name_medal: 'Primera reciclada', points_required: 50, status_medal: 1 },
            { name_medal: 'Reciclador activo', points_required: 200, status_medal: 1 },
            { name_medal: 'Heroe verde', points_required: 500, status_medal: 1 },
        ]);
    }
}

export const connectToDatabase = async () => {
    try {
        await AppDataSource.initialize();
        await seedInitialData();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}
