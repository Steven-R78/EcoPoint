import { Request, Response, NextFunction } from 'express';
import { UsersUseCase } from '../../../application/use-cases/UsersUseCase';
import { userDto } from '../../../application/dto/responseDto';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class UsersController {
  constructor(private readonly useCase: UsersUseCase) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.useCase.register(req.body.fullName, req.body.email, req.body.password);
      return res.status(201).json({ user: userDto(user), token });
    } catch (error) {
      return next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.useCase.login(req.body.email, req.body.password);
      return res.json({ user: userDto(user), token });
    } catch (error) {
      return next(error);
    }
  };

  profile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('Token inválido');
      }

      const user = await this.useCase.getById(req.user.id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return res.json(userDto(user));
    } catch (error) {
      return next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.useCase.list();
      return res.json(users.map(userDto));
    } catch (error) {
      return next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.useCase.getById(String(req.params.id));
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return res.json(userDto(user));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.useCase.update(String(req.params.id), req.body);
      if (!updated) {
        throw new Error('Usuario no encontrado');
      }
      return res.json(userDto(updated));
    } catch (error) {
      return next(error);
    }
  };

  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.useCase.softDelete(String(req.params.id));
      if (!deleted) {
        throw new Error('Usuario no encontrado');
      }
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
