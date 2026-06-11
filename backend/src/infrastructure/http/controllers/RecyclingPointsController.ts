import { NextFunction, Request, Response } from 'express';
import { RecyclingPointsUseCase } from '../../../application/use-cases/RecyclingPointsUseCase';
import { recyclingPointDto } from '../../../application/dto/responseDto';

export class RecyclingPointsController {
  constructor(private readonly useCase: RecyclingPointsUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const point = await this.useCase.create(req.body);
      return res.status(201).json(recyclingPointDto(point));
    } catch (error) {
      return next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const points = await this.useCase.list();
      return res.json(points.map(recyclingPointDto));
    } catch (error) {
      return next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const point = await this.useCase.getById(String(req.params.id));
      if (!point) throw new Error('Punto de reciclaje no encontrado');
      return res.json(recyclingPointDto(point));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const point = await this.useCase.update(String(req.params.id), req.body);
      if (!point) throw new Error('Punto de reciclaje no encontrado');
      return res.json(recyclingPointDto(point));
    } catch (error) {
      return next(error);
    }
  };

  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.useCase.softDelete(String(req.params.id));
      if (!deleted) throw new Error('Punto de reciclaje no encontrado');
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
