import { BaseEntity } from './common';

export interface Rating extends BaseEntity {
  userId: string;
  recyclingPointId: string;
  score: number;
  comment: string;
}
