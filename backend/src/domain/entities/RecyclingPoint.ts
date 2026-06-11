import { BaseEntity } from './common';

export interface RecyclingPoint extends BaseEntity {
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  openingHours: string;
}
