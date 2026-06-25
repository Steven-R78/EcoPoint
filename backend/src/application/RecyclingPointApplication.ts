import { RecyclingPoint } from "../domain/RecyclingPoint";
import { RecyclingPointPort } from "../domain/port/RecyclingPointPort";

export class RecyclingPointApplication {
    private port: RecyclingPointPort;

    constructor(port: RecyclingPointPort) {
        this.port = port;
    }

    private async validateMaterial(materialId: number | null): Promise<void> {
        if (materialId === null) return;

        const exists = await this.port.materialExists(materialId);
        if (!exists) {
            throw new Error("Material no encontrado o inactivo");
        }
    }

    async createPoint(point: Omit<RecyclingPoint, "id">): Promise<number> {
        await this.validateMaterial(point.materialId);
        return this.port.createPoint(point);
    }

    async getPointById(id: number): Promise<RecyclingPoint | null> {
        return this.port.getPointById(id);
    }

    async getAllPoints(): Promise<RecyclingPoint[]> {
        return this.port.getAllPoints();
    }

    async updatePoint(id: number, point: Partial<RecyclingPoint>): Promise<boolean> {
        const existingPoint = await this.port.getPointById(id);
        if (!existingPoint) {
            throw new Error("Punto de reciclaje no encontrado");
        }

        if (point.materialId !== undefined) {
            await this.validateMaterial(point.materialId);
        }

        return this.port.updatePoint(id, point);
    }

    async deletePoint(id: number): Promise<boolean> {
        return this.port.deletePoint(id);
    }
}
