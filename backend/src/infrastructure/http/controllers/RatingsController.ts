import { NextFunction, Request, Response } from 'express';
import { RatingsUseCase } from '../../../application/use-cases/RatingsUseCase';
import { ratingDto } from '../../../application/dto/responseDto';

export class RatingsController {
  constructor(private readonly useCase: RatingsUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rating = await this.useCase.create(req.body);
      return res.status(201).json(ratingDto(rating));
    } catch (error) {
      return next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const ratings = await this.useCase.list();
      return res.json(ratings.map(ratingDto));
    } catch (error) {
      return next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rating = await this.useCase.getById(String(req.params.id));
      if (!rating) throw new Error('Valoración no encontrada');
      return res.json(ratingDto(rating));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rating = await this.useCase.update(String(req.params.id), req.body);
      if (!rating) throw new Error('Valoración no encontrada');
      return res.json(ratingDto(rating));
    } catch (error) {
      return next(error);
    }
  };

  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.useCase.softDelete(String(req.params.id));
      if (!deleted) throw new Error('Valoración no encontrada');
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
