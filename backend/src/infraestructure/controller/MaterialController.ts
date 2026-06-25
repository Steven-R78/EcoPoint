import { Request, Response } from "express";
import { MaterialApplication } from "../../application/MaterialApplication";
import { Material } from "../../domain/Material";
import { loadMaterialData } from "../util/material-validation";
import { loadUpdateMaterialData } from "../util/material-update-validation";

export class MaterialController {
    constructor(private app: MaterialApplication) {}

    async createMaterial(req: Request, res: Response): Promise<Response> {
        try {
            const { name, category, status } = loadMaterialData(req.body);
            const material: Omit<Material, "id"> = { name, category, status };
            const materialId = await this.app.createMaterial(material);
            return res.status(201).json({ message: "Material creado con exito", materialId });
        } catch (error) {
            if (error instanceof Error) {
                const status = error.message.includes("registrado") ? 409 : 500;
                return res.status(status).json({ error: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateMaterial(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const data = loadUpdateMaterialData(req.body);
            const updated = await this.app.updateMaterial(id, data);
            if (!updated) return res.status(404).json({ error: "Material no encontrado o sin cambios" });
            return res.status(200).json({ message: "Material actualizado con exito" });
        } catch (error) {
            if (error instanceof Error) return res.status(400).json({ error: error.message });
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getMaterialById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const material = await this.app.getMaterialById(id);
            if (!material) return res.status(404).json({ error: "Material no encontrado" });
            return res.status(200).json(material);
        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getAllMaterials(req: Request, res: Response): Promise<Response> {
        try {
            const materials = await this.app.getAllMaterials();
            return res.status(200).json(materials);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener materiales", error });
        }
    }

    async deleteMaterial(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const deleted = await this.app.deleteMaterial(id);
            if (!deleted) return res.status(404).json({ error: "Material no encontrado" });
            return res.status(200).json({ message: "Material eliminado con exito" });
        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}
