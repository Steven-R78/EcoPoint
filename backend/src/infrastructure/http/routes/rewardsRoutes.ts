import { Router } from 'express';
import { RewardsController } from '../controllers/RewardsController';
import { schemas, validateBody } from '../middleware/validationMiddleware';

export const rewardsRoutes = (controller: RewardsController) => {
  const router = Router();

  router.post('/', validateBody(schemas.reward), controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.put('/:id', validateBody(schemas.rewardUpdate), controller.update);
  router.delete('/:id', controller.softDelete);

  return router;
};
