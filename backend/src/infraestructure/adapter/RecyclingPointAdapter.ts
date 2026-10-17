import { In, Repository } from "typeorm";
import { RecyclingPoint as RecyclingPointDomain } from "../../domain/RecyclingPoint";
import { RecyclingPoint as RecyclingPointEntity } from "../entities/RecyclingPoint";
import { Material } from "../entities/Material";
import { PointMaterial } from "../entities/PointMaterial";
import { RecyclingPointPort } from "../../domain/port/RecyclingPointPort";
import { AppDataSource } from "../config/data-base";

export class RecyclingPointAdapter implements RecyclingPointPort {
    private pointRepository: Repository<RecyclingPointEntity>;
    private materialRepository: Repository<Material>;
    private pointMaterialRepository: Repository<PointMaterial>;

    constructor() {
        this.pointRepository = AppDataSource.getRepository(RecyclingPointEntity);
        this.materialRepository = AppDataSource.getRepository(Material);
        this.pointMaterialRepository = AppDataSource.getRepository(PointMaterial);
    }

    private toDomain(pointEntity: RecyclingPointEntity, materialIds: number[] = []): RecyclingPointDomain {
        return {
            id: pointEntity.id_point,
            materialId: pointEntity.material_id ?? materialIds[0] ?? null,
            materialIds,
            name: pointEntity.name_point,
            address: pointEntity.address_point ?? "",
            latitude: Number(pointEntity.latitude),
            longitude: Number(pointEntity.longitude),
            status: pointEntity.status_point,
            schedule: pointEntity.schedule_point ?? null,
            photoUrl: pointEntity.photo_url ?? null,
        };
    }

    private resolveMaterialIds(point: Pick<RecyclingPointDomain, "materialId" | "materialIds">): number[] {
        if (point.materialIds && point.materialIds.length > 0) {
            return [...new Set(point.materialIds)];
        }
        return point.materialId ? [point.materialId] : [];
    }

    private async replaceMaterials(pointId: number, materialIds: number[]): Promise<void> {
        await this.pointMaterialRepository.delete({ point_id: pointId });
        if (materialIds.length === 0) return;
        await this.pointMaterialRepository.save(
            materialIds.map((materialId) => {
                const row = new PointMaterial();
                row.point_id = pointId;
                row.material_id = materialId;
                return row;
            })
        );
    }

    private async materialIdsByPoint(pointIds: number[]): Promise<Map<number, number[]>> {
        const map = new Map<number, number[]>();
        if (pointIds.length === 0) return map;
        const rows = await this.pointMaterialRepository.find({
            where: { point_id: In(pointIds) },
        });
        for (const row of rows) {
            const current = map.get(row.point_id) ?? [];
            current.push(row.material_id);
            map.set(row.point_id, current);
        }
        return map;
    }

    async materialExists(materialId: number): Promise<boolean> {
        const material = await this.materialRepository.findOne({
            where: { id_material: materialId, status_material: 1 },
        });
        return material !== null;
    }

    async createPoint(point: Omit<RecyclingPointDomain, "id">): Promise<number> {
        try {
            const materialIds = this.resolveMaterialIds(point);
            const pointEntity = new RecyclingPointEntity();
            pointEntity.material_id = materialIds[0] ?? null;
            pointEntity.name_point = point.name;
            pointEntity.address_point = point.address;
            pointEntity.latitude = point.latitude;
            pointEntity.longitude = point.longitude;
            pointEntity.status_point = point.status;
            pointEntity.schedule_point = point.schedule ?? null;
            pointEntity.photo_url = point.photoUrl ?? null;
            const savedPoint = await this.pointRepository.save(pointEntity);
            await this.replaceMaterials(savedPoint.id_point, materialIds);
            return savedPoint.id_point;
        } catch (error) {
            console.error("Error creating recycling point:", error);
            throw new Error("Failed to create recycling point");
        }
    }

    async updatePoint(id: number, point: Partial<RecyclingPointDomain>): Promise<boolean> {
        try {
            const existingPoint = await this.pointRepository.findOne({ where: { id_point: id } });
            if (!existingPoint) return false;

            const materialIds = point.materialIds !== undefined || point.materialId !== undefined
                ? this.resolveMaterialIds({
                    materialId: point.materialId ?? null,
                    materialIds: point.materialIds ?? [],
                })
                : null;

            Object.assign(existingPoint, {
                material_id: materialIds ? (materialIds[0] ?? null) : existingPoint.material_id,
                name_point: point.name ?? existingPoint.name_point,
                address_point: point.address ?? existingPoint.address_point,
                latitude: point.latitude ?? existingPoint.latitude,
                longitude: point.longitude ?? existingPoint.longitude,
                status_point: point.status ?? existingPoint.status_point,
                schedule_point: point.schedule !== undefined ? point.schedule : existingPoint.schedule_point,
                photo_url: point.photoUrl !== undefined ? point.photoUrl : existingPoint.photo_url,
            });

            await this.pointRepository.save(existingPoint);
            if (materialIds) {
                await this.replaceMaterials(id, materialIds);
            }
            return true;
        } catch (error) {
            console.error("Error updating recycling point:", error);
            throw new Error("Failed to update recycling point");
        }
    }

    async deletePoint(id: number): Promise<boolean> {
        try {
            const existingPoint = await this.pointRepository.findOne({ where: { id_point: id } });
            if (!existingPoint) return false;

            Object.assign(existingPoint, { status_point: 0 });
            await this.pointRepository.save(existingPoint);
            return true;
        } catch (error) {
            console.error("Error deleting recycling point:", error);
            throw new Error("Failed to delete recycling point");
        }
    }

    async getPointById(id: number): Promise<RecyclingPointDomain | null> {
        try {
            const point = await this.pointRepository.findOne({ where: { id_point: id } });
            if (!point) return null;
            const ids = await this.materialIdsByPoint([id]);
            return this.toDomain(point, ids.get(id) ?? []);
        } catch (error) {
            console.error("Error fetching recycling point by ID:", error);
            throw new Error("Failed to fetch recycling point by ID");
        }
    }

    async getAllPoints(): Promise<RecyclingPointDomain[]> {
        try {
            const points = await this.pointRepository.find({ where: { status_point: 1 } });
            const ids = await this.materialIdsByPoint(points.map((point) => point.id_point));
            return points.map((point) => this.toDomain(point, ids.get(point.id_point) ?? []));
        } catch (error) {
            console.error("Error fetching all recycling points:", error);
            throw new Error("Failed to fetch all recycling points");
        }
    }
}
