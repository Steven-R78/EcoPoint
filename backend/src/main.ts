import express from 'express';
import { env } from './infrastructure/config/env';
import { dbPool } from './infrastructure/config/database';
import { AuthService } from './domain/services/AuthService';
import { TransactionPointsService } from './domain/services/TransactionPointsService';
import { PostgresUserRepository } from './infrastructure/persistence/PostgresUserRepository';
import { PostgresWasteCategoryRepository } from './infrastructure/persistence/PostgresWasteCategoryRepository';
import { PostgresRecyclingPointRepository } from './infrastructure/persistence/PostgresRecyclingPointRepository';
import { PostgresTransactionRepository } from './infrastructure/persistence/PostgresTransactionRepository';
import { PostgresRewardRepository } from './infrastructure/persistence/PostgresRewardRepository';
import { PostgresRatingRepository } from './infrastructure/persistence/PostgresRatingRepository';
import { UsersUseCase } from './application/use-cases/UsersUseCase';
import { WasteCategoriesUseCase } from './application/use-cases/WasteCategoriesUseCase';
import { RecyclingPointsUseCase } from './application/use-cases/RecyclingPointsUseCase';
import { TransactionsUseCase } from './application/use-cases/TransactionsUseCase';
import { RewardsUseCase } from './application/use-cases/RewardsUseCase';
import { RatingsUseCase } from './application/use-cases/RatingsUseCase';
import { UsersController } from './infrastructure/http/controllers/UsersController';
import { WasteCategoriesController } from './infrastructure/http/controllers/WasteCategoriesController';
import { RecyclingPointsController } from './infrastructure/http/controllers/RecyclingPointsController';
import { TransactionsController } from './infrastructure/http/controllers/TransactionsController';
import { RewardsController } from './infrastructure/http/controllers/RewardsController';
import { RatingsController } from './infrastructure/http/controllers/RatingsController';
import { usersRoutes } from './infrastructure/http/routes/usersRoutes';
import { wasteCategoriesRoutes } from './infrastructure/http/routes/wasteCategoriesRoutes';
import { recyclingPointsRoutes } from './infrastructure/http/routes/recyclingPointsRoutes';
import { transactionsRoutes } from './infrastructure/http/routes/transactionsRoutes';
import { rewardsRoutes } from './infrastructure/http/routes/rewardsRoutes';
import { ratingsRoutes } from './infrastructure/http/routes/ratingsRoutes';
import { errorHandler } from './infrastructure/http/middleware/errorHandler';

const app = express();
app.use(express.json());

const authService = new AuthService(env.jwtSecret, env.jwtExpiresIn);
const userRepository = new PostgresUserRepository(dbPool);
const wasteCategoryRepository = new PostgresWasteCategoryRepository(dbPool);
const recyclingPointRepository = new PostgresRecyclingPointRepository(dbPool);
const transactionRepository = new PostgresTransactionRepository(dbPool);
const rewardRepository = new PostgresRewardRepository(dbPool);
const ratingRepository = new PostgresRatingRepository(dbPool);

const usersController = new UsersController(new UsersUseCase(userRepository, authService));
const wasteCategoriesController = new WasteCategoriesController(new WasteCategoriesUseCase(wasteCategoryRepository));
const recyclingPointsController = new RecyclingPointsController(new RecyclingPointsUseCase(recyclingPointRepository));
const transactionsController = new TransactionsController(
  new TransactionsUseCase(transactionRepository, userRepository, wasteCategoryRepository, new TransactionPointsService()),
);
const rewardsController = new RewardsController(new RewardsUseCase(rewardRepository));
const ratingsController = new RatingsController(new RatingsUseCase(ratingRepository));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/users', usersRoutes(usersController, authService));
app.use('/api/waste-categories', wasteCategoriesRoutes(wasteCategoriesController));
app.use('/api/recycling-points', recyclingPointsRoutes(recyclingPointsController));
app.use('/api/transactions', transactionsRoutes(transactionsController));
app.use('/api/rewards', rewardsRoutes(rewardsController));
app.use('/api/ratings', ratingsRoutes(ratingsController));
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`EcoPoint backend ejecutándose en puerto ${env.port}`);
});
