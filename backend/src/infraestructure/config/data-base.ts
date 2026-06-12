import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import envs from './environment-vars';

dotenv.config();
export const AppDataSource = new DataSource({
    type: 'postgres',
    port: Number(envs.DB_PORT),
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    schema: "users",
    synchronize: true,
    logging: true,
    entities: [User],
});

//conexion a base de datos
export const connectToDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}