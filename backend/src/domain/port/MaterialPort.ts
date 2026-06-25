import { Material } from "../Material";

export interface MaterialPort {
    createMaterial(material: Omit<Material, "id">): Promise<number>;
    updateMaterial(id: number, material: Partial<Material>): Promise<boolean>;
    deleteMaterial(id: number): Promise<boolean>;
    getMaterialById(id: number): Promise<Material | null>;
    getMaterialByName(name: string): Promise<Material | null>;
    getAllMaterials(): Promise<Material[]>;
}
