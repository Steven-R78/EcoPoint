import { Repository } from "typeorm";
import { Material as MaterialDomain } from "../../domain/Material";
import { Material as MaterialEntity } from "../entities/Material";
import { MaterialPort } from "../../domain/port/MaterialPort";
import { AppDataSource } from "../config/data-base";

export class MaterialAdapter implements MaterialPort {
    private materialRepository: Repository<MaterialEntity>;

    constructor() {
        this.materialRepository = AppDataSource.getRepository(MaterialEntity);
    }

    private toDomain(entity: MaterialEntity): MaterialDomain {
        return {
            id: entity.id_material,
            name: entity.name_material,
            category: entity.category_material ?? "",
            status: entity.status_material,
        };
    }

    private toEntity(domain: Omit<MaterialDomain, "id">): MaterialEntity {
        const entity = new MaterialEntity();
        entity.name_material = domain.name;
        entity.category_material = domain.category;
        entity.status_material = domain.status;
        return entity;
    }

    async createMaterial(material: Omit<MaterialDomain, "id">): Promise<number> {
        try {
            const saved = await this.materialRepository.save(this.toEntity(material));
            return saved.id_material;
        } catch (error) {
            console.error("Error creating material:", error);
            throw new Error("Failed to create material");
        }
    }

    async updateMaterial(id: number, material: Partial<MaterialDomain>): Promise<boolean> {
        try {
            const existing = await this.materialRepository.findOne({ where: { id_material: id } });
            if (!existing) return false;

            Object.assign(existing, {
                name_material: material.name ?? existing.name_material,
                category_material: material.category ?? existing.category_material,
                status_material: material.status ?? existing.status_material,
            });

            await this.materialRepository.save(existing);
            return true;
        } catch (error) {
            console.error("Error updating material:", error);
            throw new Error("Failed to update material");
        }
    }

    async deleteMaterial(id: number): Promise<boolean> {
        try {
            const existing = await this.materialRepository.findOne({ where: { id_material: id } });
            if (!existing) return false;
            Object.assign(existing, { status_material: 0 });
            await this.materialRepository.save(existing);
            return true;
        } catch (error) {
            console.error("Error deleting material:", error);
            throw new Error("Failed to delete material");
        }
    }

    async getMaterialById(id: number): Promise<MaterialDomain | null> {
        const material = await this.materialRepository.findOne({ where: { id_material: id } });
        return material ? this.toDomain(material) : null;
    }

    async getMaterialByName(name: string): Promise<MaterialDomain | null> {
        const material = await this.materialRepository.findOne({ where: { name_material: name } });
        return material ? this.toDomain(material) : null;
    }

    async getAllMaterials(): Promise<MaterialDomain[]> {
        const materials = await this.materialRepository.find({ where: { status_material: 1 } });
        return materials.map((m) => this.toDomain(m));
    }
}
