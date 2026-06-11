import { BaseEntity } from './common';

export interface Reward extends BaseEntity {
  name: string;
  description: string;
  pointsCost: number;
  stock: number;
}
