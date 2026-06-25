import { RecyclingPoint } from "../RecyclingPoint";

export interface RecyclingPointPort {
    createPoint(point: Omit<RecyclingPoint, "id">): Promise<number>;
    updatePoint(id: number, point: Partial<RecyclingPoint>): Promise<boolean>;
    deletePoint(id: number): Promise<boolean>;
    getPointById(id: number): Promise<RecyclingPoint | null>;
    getAllPoints(): Promise<RecyclingPoint[]>;
    materialExists(materialId: number): Promise<boolean>;
}
