import { Role } from "../domain/Role";
import { RolePort } from "../domain/port/RolePort";

export class RoleApplication {
    private port: RolePort;

    constructor(port: RolePort) {
        this.port = port;
    }

    async createRole(role: Omit<Role, "id">): Promise<number> {
        const existing = await this.port.getRoleByName(role.name);
        if (existing) {
            throw new Error("Este rol ya esta registrado");
        }
        return this.port.createRole(role);
    }

    async getRoleById(id: number): Promise<Role | null> {
        return this.port.getRoleById(id);
    }

    async getAllRoles(): Promise<Role[]> {
        return this.port.getAllRoles();
    }

    async updateRole(id: number, role: Partial<Role>): Promise<boolean> {
        const existing = await this.port.getRoleById(id);
        if (!existing) {
            throw new Error("Rol no encontrado");
        }
        if (role.name) {
            const nameTaken = await this.port.getRoleByName(role.name);
            if (nameTaken && nameTaken.id !== id) {
                throw new Error("Este nombre de rol ya esta en uso");
            }
        }
        return this.port.updateRole(id, role);
    }

    async deleteRole(id: number): Promise<boolean> {
        return this.port.deleteRole(id);
    }
}
