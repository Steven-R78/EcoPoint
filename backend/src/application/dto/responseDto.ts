import { Rating } from '../../domain/entities/Rating';
import { RecyclingPoint } from '../../domain/entities/RecyclingPoint';
import { Reward } from '../../domain/entities/Reward';
import { Transaction } from '../../domain/entities/Transaction';
import { User } from '../../domain/entities/User';
import { WasteCategory } from '../../domain/entities/WasteCategory';

export const userDto = (u: User) => ({
  id: u.id,
  fullName: u.fullName,
  email: u.email,
  points: u.points,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});

export const recyclingPointDto = (point: RecyclingPoint) => ({
  id: point.id,
  name: point.name,
  address: point.address,
  city: point.city,
  latitude: point.latitude,
  longitude: point.longitude,
  openingHours: point.openingHours,
  createdAt: point.createdAt,
  updatedAt: point.updatedAt,
});

export const transactionDto = (transaction: Transaction) => ({
  id: transaction.id,
  userId: transaction.userId,
  recyclingPointId: transaction.recyclingPointId,
  wasteCategoryId: transaction.wasteCategoryId,
  quantityKg: transaction.quantityKg,
  pointsEarned: transaction.pointsEarned,
  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

export const wasteCategoryDto = (category: WasteCategory) => ({
  id: category.id,
  name: category.name,
  description: category.description,
  pointsPerKg: category.pointsPerKg,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const rewardDto = (reward: Reward) => ({
  id: reward.id,
  name: reward.name,
  description: reward.description,
  pointsCost: reward.pointsCost,
  stock: reward.stock,
  createdAt: reward.createdAt,
  updatedAt: reward.updatedAt,
});

export const ratingDto = (rating: Rating) => ({
  id: rating.id,
  userId: rating.userId,
  recyclingPointId: rating.recyclingPointId,
  score: rating.score,
  comment: rating.comment,
  createdAt: rating.createdAt,
  updatedAt: rating.updatedAt,
});
