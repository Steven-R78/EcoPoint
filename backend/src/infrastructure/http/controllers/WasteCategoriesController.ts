import { Request, Response, NextFunction } from 'express';
import { WasteCategoriesUseCase } from '../../../application/use-cases/WasteCategoriesUseCase';
import { wasteCategoryDto } from '../../../application/dto/responseDto';

export class WasteCategoriesController {
  constructor(private readonly useCase: WasteCategoriesUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.useCase.create(req.body.name, req.body.description, req.body.pointsPerKg);
      return res.status(201).json(wasteCategoryDto(category));
    } catch (error) {
      return next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.useCase.list();
      return res.json(categories.map(wasteCategoryDto));
    } catch (error) {
      return next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.useCase.getById(String(req.params.id));
      if (!category) throw new Error('Categoría no encontrada');
      return res.json(wasteCategoryDto(category));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.useCase.update(String(req.params.id), req.body);
      if (!category) throw new Error('Categoría no encontrada');
      return res.json(wasteCategoryDto(category));
    } catch (error) {
      return next(error);
    }
  };

  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.useCase.softDelete(String(req.params.id));
      if (!deleted) throw new Error('Categoría no encontrada');
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
