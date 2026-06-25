import { Request, Response } from "express";
import { RecyclingPointApplication } from "../../application/RecyclingPointApplication";
import { RecyclingPoint } from "../../domain/RecyclingPoint";
import { loadRecyclingPointData } from "../util/recycling-point-validation";
import { loadUpdateRecyclingPointData } from "../util/recycling-point-update-validation";

export class RecyclingPointController {
    private app: RecyclingPointApplication;

    constructor(app: RecyclingPointApplication) {
        this.app = app;
    }

    async createPoint(req: Request, res: Response): Promise<Response> {
        try {
            const { materialId, name, address, latitude, longitude, status } = loadRecyclingPointData(req.body);

            const point: Omit<RecyclingPoint, "id"> = {
                materialId,
                name,
                address,
                latitude,
                longitude,
                status,
            };
            const pointId = await this.app.createPoint(point);

            return res.status(201).json({ message: "Punto de reciclaje creado con exito", pointId });
        } catch (error) {
            if (error instanceof Error) {
                const status = error.message.includes("Material") ? 400 : 500;
                return res.status(status).json({ error: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updatePoint(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID invalido" });
            }

            const dataLoad = loadUpdateRecyclingPointData(req.body);
            const updated = await this.app.updatePoint(id, dataLoad);

            if (!updated) {
                return res.status(404).json({ error: "Punto de reciclaje no encontrado o sin cambios" });
            }
            return res.status(200).json({ message: "Punto de reciclaje actualizado con exito" });
        } catch (error) {
            if (error instanceof Error) {
                const statusCode = error.message.includes("no encontrado") ? 404 : 400;
                return res.status(statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getPointById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const point = await this.app.getPointById(id);
            if (!point) return res.status(404).json({ error: "Punto de reciclaje no encontrado" });

            return res.status(200).json(point);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: "Error interno del servidor", details: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getAllPoints(req: Request, res: Response): Promise<Response> {
        try {
            const points = await this.app.getAllPoints();
            return res.status(200).json(points);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener puntos de reciclaje", error });
        }
    }

    async deletePoint(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID invalido" });
            }

            const deleted = await this.app.deletePoint(id);

            if (!deleted) {
                return res.status(404).json({ error: "Punto de reciclaje no encontrado" });
            }
            return res.status(200).json({ message: "Punto de reciclaje eliminado con exito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}
