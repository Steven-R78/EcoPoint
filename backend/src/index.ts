import app from './app';
import { ServerBootstrap } from './bootstrap/server.bootstrap';

const serverBootstrap = new ServerBootstrap(app);

/**
 * Función tipo clásica
 */
async function startServer() {
    try {
        const instances = [serverBootstrap.initialize()];
        await Promise.all(instances);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Invocación de la funcion
 */

startServer();
