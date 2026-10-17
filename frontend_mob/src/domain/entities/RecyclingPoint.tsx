export interface RecyclingPoint {
  id: number;
  materialId: number | null;
  materialIds: number[];
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: number;
  schedule?: string | null;
  photoUrl?: string | null;
  distanceKm?: number | null;
}
