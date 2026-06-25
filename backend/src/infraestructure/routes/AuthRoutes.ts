import { Router } from 'express';
import { UserAdapter } from '../adapter/UserAdapter';
import { UserApplication } from '../../application/UserApplication';
import { AuthController } from '../controller/AuthController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const userAdapter = new UserAdapter();
const userApp = new UserApplication(userAdapter);
const authController = new AuthController(userApp);

router.post('/login', async (req, res) => {
    try {
        await authController.login(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error en login', error });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        await authController.profile(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo perfil', error });
    }
});

export default router;
