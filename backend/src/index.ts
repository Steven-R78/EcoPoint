import app from './infraestructure/web/app'
import { ServerBootstrap } from './infraestructure/bootstrap/server.bootstrap';
import { connectToDatabase } from './infraestructure/config/data-base';

const serverBootstrap = new ServerBootstrap(app);

/**
 * Función tipo clásica
 */
async function startServer() {
    try {
        const instances = [
            connectToDatabase(), // Conexión a la base de datos
            serverBootstrap.initialize() // Inicialización del servidor
        ];
        await Promise.all(instances);
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

/**
 * Invocación de la funcion
 */

startServer();
