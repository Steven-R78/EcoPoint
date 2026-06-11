import { Router } from 'express';
import { TransactionsController } from '../controllers/TransactionsController';
import { schemas, validateBody } from '../middleware/validationMiddleware';

export const transactionsRoutes = (controller: TransactionsController) => {
  const router = Router();

  router.post('/', validateBody(schemas.transaction), controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.put('/:id', validateBody(schemas.transactionUpdate), controller.update);
  router.delete('/:id', controller.softDelete);

  return router;
};
