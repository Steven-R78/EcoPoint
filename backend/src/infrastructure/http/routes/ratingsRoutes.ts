import { Router } from 'express';
import { RatingsController } from '../controllers/RatingsController';
import { schemas, validateBody } from '../middleware/validationMiddleware';

export const ratingsRoutes = (controller: RatingsController) => {
  const router = Router();

  router.post('/', validateBody(schemas.rating), controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.put('/:id', validateBody(schemas.ratingUpdate), controller.update);
  router.delete('/:id', controller.softDelete);

  return router;
};
