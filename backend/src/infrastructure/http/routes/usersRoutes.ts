import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';
import { authMiddleware } from '../middleware/authMiddleware';
import { schemas, validateBody } from '../middleware/validationMiddleware';
import { AuthService } from '../../../domain/services/AuthService';

export const usersRoutes = (controller: UsersController, authService: AuthService) => {
  const router = Router();

  router.post('/register', validateBody(schemas.registerUser), controller.register);
  router.post('/login', validateBody(schemas.loginUser), controller.login);
  router.get('/profile', authMiddleware(authService), controller.profile);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.put('/:id', validateBody(schemas.updateUser), controller.update);
  router.delete('/:id', controller.softDelete);

  return router;
};
