export interface RecyclingPoint {
    id: number;
    materialId: number | null;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    status: number;
}
