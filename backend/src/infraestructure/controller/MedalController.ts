import { Request, Response } from "express";
import { MedalApplication } from "../../application/MedalApplication";
import { Medal } from "../../domain/Medal";
import { loadMedalData } from "../util/medal-validation";
import { loadUpdateMedalData } from "../util/medal-update-validation";

export class MedalController {
    constructor(private app: MedalApplication) {}

    async createMedal(req: Request, res: Response): Promise<Response> {
        try {
            const { name, pointsRequired, status } = loadMedalData(req.body);
            const medal: Omit<Medal, "id"> = { name, pointsRequired, status };
            const medalId = await this.app.createMedal(medal);
            return res.status(201).json({ message: "Medalla creada con exito", medalId });
        } catch (error) {
            if (error instanceof Error) {
                const status = error.message.includes("registrada") ? 409 : 500;
                return res.status(status).json({ error: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateMedal(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const data = loadUpdateMedalData(req.body);
            const updated = await this.app.updateMedal(id, data);
            if (!updated) return res.status(404).json({ error: "Medalla no encontrada o sin cambios" });
            return res.status(200).json({ message: "Medalla actualizada con exito" });
        } catch (error) {
            if (error instanceof Error) return res.status(400).json({ error: error.message });
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getMedalById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const medal = await this.app.getMedalById(id);
            if (!medal) return res.status(404).json({ error: "Medalla no encontrada" });
            return res.status(200).json(medal);
        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getAllMedals(req: Request, res: Response): Promise<Response> {
        try {
            const medals = await this.app.getAllMedals();
            return res.status(200).json(medals);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener medallas", error });
        }
    }

    async deleteMedal(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const deleted = await this.app.deleteMedal(id);
            if (!deleted) return res.status(404).json({ error: "Medalla no encontrada" });
            return res.status(200).json({ message: "Medalla eliminada con exito" });
        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}
