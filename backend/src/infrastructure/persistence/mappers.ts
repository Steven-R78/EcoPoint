import { Rating } from '../../domain/entities/Rating';
import { RecyclingPoint } from '../../domain/entities/RecyclingPoint';
import { Reward } from '../../domain/entities/Reward';
import { Transaction } from '../../domain/entities/Transaction';
import { User } from '../../domain/entities/User';
import { WasteCategory } from '../../domain/entities/WasteCategory';

const date = (value: string | Date | null): Date | null => (value ? new Date(value) : null);

export const mapUser = (row: any): User => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  passwordHash: row.password_hash,
  points: Number(row.points),
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  deletedAt: date(row.deleted_at),
});

export const mapWasteCategory = (row: any): WasteCategory => ({
  id: row.id,
  name: row.name,
  description: row.description,
  pointsPerKg: Number(row.points_per_kg),
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  deletedAt: date(row.deleted_at),
});

export const mapRecyclingPoint = (row: any): RecyclingPoint => ({
  id: row.id,
  name: row.name,
  address: row.address,
  city: row.city,
  latitude: Number(row.latitude),
  longitude: Number(row.longitude),
  openingHours: row.opening_hours,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  deletedAt: date(row.deleted_at),
});

export const mapTransaction = (row: any): Transaction => ({
  id: row.id,
  userId: row.user_id,
  recyclingPointId: row.recycling_point_id,
  wasteCategoryId: row.waste_category_id,
  quantityKg: Number(row.quantity_kg),
  pointsEarned: Number(row.points_earned),
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  deletedAt: date(row.deleted_at),
});

export const mapReward = (row: any): Reward => ({
  id: row.id,
  name: row.name,
  description: row.description,
  pointsCost: Number(row.points_cost),
  stock: Number(row.stock),
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  deletedAt: date(row.deleted_at),
});

export const mapRating = (row: any): Rating => ({
  id: row.id,
  userId: row.user_id,
  recyclingPointId: row.recycling_point_id,
  score: Number(row.score),
  comment: row.comment,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  deletedAt: date(row.deleted_at),
});
