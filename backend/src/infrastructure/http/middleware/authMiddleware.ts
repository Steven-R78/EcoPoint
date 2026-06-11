import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../../domain/services/AuthService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = (authService: AuthService) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new Error('Token de autenticación requerido'));
    }

    const token = authHeader.slice('Bearer '.length);

    try {
      const payload = authService.verifyToken(token);
      req.user = {
        id: payload.sub,
        email: payload.email,
      };
      return next();
    } catch {
      return next(new Error('Token inválido'));
    }
  };
};
