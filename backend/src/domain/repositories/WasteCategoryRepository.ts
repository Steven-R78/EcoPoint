import { WasteCategory } from '../entities/WasteCategory';

export interface WasteCategoryRepository {
  create(data: Pick<WasteCategory, 'name' | 'description' | 'pointsPerKg'>): Promise<WasteCategory>;
  list(): Promise<WasteCategory[]>;
  getById(id: string): Promise<WasteCategory | null>;
  update(id: string, data: Partial<Pick<WasteCategory, 'name' | 'description' | 'pointsPerKg'>>): Promise<WasteCategory | null>;
  softDelete(id: string): Promise<boolean>;
}
