import { Request, Response } from "express";
import { RoleApplication } from "../../application/RoleApplication";
import { Role } from "../../domain/Role";
import { loadRoleData } from "../util/role-validation";
import { loadUpdateRoleData } from "../util/role-update-validation";

export class RoleController {
    constructor(private app: RoleApplication) {}

    async createRole(req: Request, res: Response): Promise<Response> {
        try {
            const { name, status } = loadRoleData(req.body);
            const role: Omit<Role, "id"> = { name, status };
            const roleId = await this.app.createRole(role);
            return res.status(201).json({ message: "Rol creado con exito", roleId });
        } catch (error) {
            if (error instanceof Error) {
                const status = error.message.includes("registrado") ? 409 : 500;
                return res.status(status).json({ error: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateRole(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const data = loadUpdateRoleData(req.body);
            const updated = await this.app.updateRole(id, data);
            if (!updated) return res.status(404).json({ error: "Rol no encontrado o sin cambios" });
            return res.status(200).json({ message: "Rol actualizado con exito" });
        } catch (error) {
            if (error instanceof Error) return res.status(400).json({ error: error.message });
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getRoleById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const role = await this.app.getRoleById(id);
            if (!role) return res.status(404).json({ error: "Rol no encontrado" });
            return res.status(200).json(role);
        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getAllRoles(req: Request, res: Response): Promise<Response> {
        try {
            const roles = await this.app.getAllRoles();
            return res.status(200).json(roles);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener roles", error });
        }
    }

    async deleteRole(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const deleted = await this.app.deleteRole(id);
            if (!deleted) return res.status(404).json({ error: "Rol no encontrado" });
            return res.status(200).json({ message: "Rol eliminado con exito" });
        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}
