import { Router } from 'express';
import { WasteCategoriesController } from '../controllers/WasteCategoriesController';
import { schemas, validateBody } from '../middleware/validationMiddleware';

export const wasteCategoriesRoutes = (controller: WasteCategoriesController) => {
  const router = Router();

  router.post('/', validateBody(schemas.wasteCategory), controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.put('/:id', validateBody(schemas.wasteCategoryUpdate), controller.update);
  router.delete('/:id', controller.softDelete);

  return router;
};
