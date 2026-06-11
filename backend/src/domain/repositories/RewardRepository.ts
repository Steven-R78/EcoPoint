import { Reward } from '../entities/Reward';

export interface RewardRepository {
  create(data: Pick<Reward, 'name' | 'description' | 'pointsCost' | 'stock'>): Promise<Reward>;
  list(): Promise<Reward[]>;
  getById(id: string): Promise<Reward | null>;
  update(id: string, data: Partial<Pick<Reward, 'name' | 'description' | 'pointsCost' | 'stock'>>): Promise<Reward | null>;
  softDelete(id: string): Promise<boolean>;
}
