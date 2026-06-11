import { NextFunction, Request, Response } from 'express';
import { RewardsUseCase } from '../../../application/use-cases/RewardsUseCase';
import { rewardDto } from '../../../application/dto/responseDto';

export class RewardsController {
  constructor(private readonly useCase: RewardsUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reward = await this.useCase.create(req.body);
      return res.status(201).json(rewardDto(reward));
    } catch (error) {
      return next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const rewards = await this.useCase.list();
      return res.json(rewards.map(rewardDto));
    } catch (error) {
      return next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reward = await this.useCase.getById(String(req.params.id));
      if (!reward) throw new Error('Recompensa no encontrada');
      return res.json(rewardDto(reward));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reward = await this.useCase.update(String(req.params.id), req.body);
      if (!reward) throw new Error('Recompensa no encontrada');
      return res.json(rewardDto(reward));
    } catch (error) {
      return next(error);
    }
  };

  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.useCase.softDelete(String(req.params.id));
      if (!deleted) throw new Error('Recompensa no encontrada');
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
