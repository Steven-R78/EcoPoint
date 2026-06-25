import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserApplication } from '../../application/UserApplication';
import { loadLoginData } from '../util/auth-validation';
import envs from '../config/environment-vars';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
    constructor(private app: UserApplication) {}

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = loadLoginData(req.body);
            const user = await this.app.login(email, password);
            const token = jwt.sign(
                { userId: user.id, email: user.email, roleId: user.roleId },
                envs.JWT_SECRET,
                { expiresIn: '8h' }
            );
            return res.status(200).json({
                message: 'Login exitoso',
                token,
                user,
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async profile(req: AuthRequest, res: Response): Promise<Response> {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autorizado' });
            }
            const user = await this.app.getUserById(req.user.userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            const { password: _, ...safeUser } = user;
            return res.status(200).json(safeUser);
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
