import { NextFunction, Request, Response } from 'express';
import { TransactionsUseCase } from '../../../application/use-cases/TransactionsUseCase';
import { transactionDto } from '../../../application/dto/responseDto';

export class TransactionsController {
  constructor(private readonly useCase: TransactionsUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await this.useCase.create(req.body);
      return res.status(201).json(transactionDto(transaction));
    } catch (error) {
      return next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await this.useCase.list();
      return res.json(transactions.map(transactionDto));
    } catch (error) {
      return next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await this.useCase.getById(String(req.params.id));
      if (!transaction) throw new Error('Transacción no encontrada');
      return res.json(transactionDto(transaction));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await this.useCase.update(String(req.params.id), req.body);
      if (!transaction) throw new Error('Transacción no encontrada');
      return res.json(transactionDto(transaction));
    } catch (error) {
      return next(error);
    }
  };

  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.useCase.softDelete(String(req.params.id));
      if (!deleted) throw new Error('Transacción no encontrada');
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}
