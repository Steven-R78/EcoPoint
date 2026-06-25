import { Role } from "../Role";

export interface RolePort {
    createRole(role: Omit<Role, "id">): Promise<number>;
    updateRole(id: number, role: Partial<Role>): Promise<boolean>;
    deleteRole(id: number): Promise<boolean>;
    getRoleById(id: number): Promise<Role | null>;
    getRoleByName(name: string): Promise<Role | null>;
    getAllRoles(): Promise<Role[]>;
}
