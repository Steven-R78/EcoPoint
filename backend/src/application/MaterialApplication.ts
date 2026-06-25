import { Material } from "../domain/Material";
import { MaterialPort } from "../domain/port/MaterialPort";

export class MaterialApplication {
    private port: MaterialPort;

    constructor(port: MaterialPort) {
        this.port = port;
    }

    async createMaterial(material: Omit<Material, "id">): Promise<number> {
        const existing = await this.port.getMaterialByName(material.name);
        if (existing) {
            throw new Error("Este material ya esta registrado");
        }
        return this.port.createMaterial(material);
    }

    async getMaterialById(id: number): Promise<Material | null> {
        return this.port.getMaterialById(id);
    }

    async getAllMaterials(): Promise<Material[]> {
        return this.port.getAllMaterials();
    }

    async updateMaterial(id: number, material: Partial<Material>): Promise<boolean> {
        const existing = await this.port.getMaterialById(id);
        if (!existing) {
            throw new Error("Material no encontrado");
        }
        if (material.name) {
            const nameTaken = await this.port.getMaterialByName(material.name);
            if (nameTaken && nameTaken.id !== id) {
                throw new Error("Este nombre de material ya esta en uso");
            }
        }
        return this.port.updateMaterial(id, material);
    }

    async deleteMaterial(id: number): Promise<boolean> {
        return this.port.deleteMaterial(id);
    }
}
