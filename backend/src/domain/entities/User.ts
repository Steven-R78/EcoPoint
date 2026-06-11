import { BaseEntity } from './common';

export interface User extends BaseEntity {
  fullName: string;
  email: string;
  passwordHash: string;
  points: number;
}
