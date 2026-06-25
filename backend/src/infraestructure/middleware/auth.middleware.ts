import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import envs from '../config/environment-vars';

export type AuthRequest = Request & {
    user?: { userId: number; email: string };
};

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, envs.JWT_SECRET) as { userId: number; email: string };
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ error: 'Token invalido o expirado' });
    }
};
