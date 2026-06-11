import { BaseEntity } from './common';

export interface WasteCategory extends BaseEntity {
  name: string;
  description: string;
  pointsPerKg: number;
}
