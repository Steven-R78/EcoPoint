import { Repository } from "typeorm";
import { Role as RoleDomain } from "../../domain/Role";
import { Role as RoleEntity } from "../entities/Role";
import { RolePort } from "../../domain/port/RolePort";
import { AppDataSource } from "../config/data-base";

export class RoleAdapter implements RolePort {
    private roleRepository: Repository<RoleEntity>;

    constructor() {
        this.roleRepository = AppDataSource.getRepository(RoleEntity);
    }

    private toDomain(entity: RoleEntity): RoleDomain {
        return {
            id: entity.id_role,
            name: entity.name_role,
            status: entity.status_role,
        };
    }

    private toEntity(domain: Omit<RoleDomain, "id">): RoleEntity {
        const entity = new RoleEntity();
        entity.name_role = domain.name;
        entity.status_role = domain.status;
        return entity;
    }

    async createRole(role: Omit<RoleDomain, "id">): Promise<number> {
        try {
            const saved = await this.roleRepository.save(this.toEntity(role));
            return saved.id_role;
        } catch (error) {
            console.error("Error creating role:", error);
            throw new Error("Failed to create role");
        }
    }

    async updateRole(id: number, role: Partial<RoleDomain>): Promise<boolean> {
        try {
            const existing = await this.roleRepository.findOne({ where: { id_role: id } });
            if (!existing) return false;

            Object.assign(existing, {
                name_role: role.name ?? existing.name_role,
                status_role: role.status ?? existing.status_role,
            });

            await this.roleRepository.save(existing);
            return true;
        } catch (error) {
            console.error("Error updating role:", error);
            throw new Error("Failed to update role");
        }
    }

    async deleteRole(id: number): Promise<boolean> {
        try {
            const existing = await this.roleRepository.findOne({ where: { id_role: id } });
            if (!existing) return false;
            Object.assign(existing, { status_role: 0 });
            await this.roleRepository.save(existing);
            return true;
        } catch (error) {
            console.error("Error deleting role:", error);
            throw new Error("Failed to delete role");
        }
    }

    async getRoleById(id: number): Promise<RoleDomain | null> {
        const role = await this.roleRepository.findOne({ where: { id_role: id } });
        return role ? this.toDomain(role) : null;
    }

    async getRoleByName(name: string): Promise<RoleDomain | null> {
        const role = await this.roleRepository.findOne({ where: { name_role: name } });
        return role ? this.toDomain(role) : null;
    }

    async getAllRoles(): Promise<RoleDomain[]> {
        const roles = await this.roleRepository.find({ where: { status_role: 1 } });
        return roles.map((r) => this.toDomain(r));
    }
}
