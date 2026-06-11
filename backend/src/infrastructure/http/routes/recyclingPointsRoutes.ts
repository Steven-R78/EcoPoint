import { Router } from 'express';
import { RecyclingPointsController } from '../controllers/RecyclingPointsController';
import { schemas, validateBody } from '../middleware/validationMiddleware';

export const recyclingPointsRoutes = (controller: RecyclingPointsController) => {
  const router = Router();

  router.post('/', validateBody(schemas.recyclingPoint), controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.put('/:id', validateBody(schemas.recyclingPointUpdate), controller.update);
  router.delete('/:id', controller.softDelete);

  return router;
};
