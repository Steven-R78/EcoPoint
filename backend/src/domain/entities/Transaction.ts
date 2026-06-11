import { BaseEntity } from './common';

export interface Transaction extends BaseEntity {
  userId: string;
  recyclingPointId: string;
  wasteCategoryId: string;
  quantityKg: number;
  pointsEarned: number;
}
