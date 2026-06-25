import { Request, Response } from "express";
import { RecyclingRecordApplication } from "../../application/RecyclingRecordApplication";
import { RecyclingRecord } from "../../domain/RecyclingRecord";
import { loadRecyclingRecordData } from "../util/recycling-record-validation";
import { loadUpdateRecyclingRecordData } from "../util/recycling-record-update-validation";

export class RecyclingRecordController {
    constructor(private app: RecyclingRecordApplication) {}

    async createRecord(req: Request, res: Response): Promise<Response> {
        try {
            const { userId, pointId, pointsEarned, status } = loadRecyclingRecordData(req.body);
            const record: Omit<RecyclingRecord, "id" | "recycledAt"> = {
                userId, pointId, pointsEarned, status,
            };
            const result = await this.app.createRecord(record);
            return res.status(201).json({
                message: "Registro de reciclaje creado con exito",
                ...result,
            });
        } catch (error) {
            if (error instanceof Error) {
                const status = error.message.includes("no encontrado") ? 400 : 500;
                return res.status(status).json({ error: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateRecord(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const data = loadUpdateRecyclingRecordData(req.body);
            const updated = await this.app.updateRecord(id, data);
            if (!updated) return res.status(404).json({ error: "Registro no encontrado o sin cambios" });
            return res.status(200).json({ message: "Registro actualizado con exito" });
        } catch (error) {
            if (error instanceof Error) return res.status(400).json({ error: error.message });
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getRecordById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const record = await this.app.getRecordById(id);
            if (!record) return res.status(404).json({ error: "Registro no encontrado" });
            return res.status(200).json(record);
        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getAllRecords(req: Request, res: Response): Promise<Response> {
        try {
            const records = await this.app.getAllRecords();
            return res.status(200).json(records);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener registros", error });
        }
    }

    async getRecordsByUserId(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number(req.params.userId);
            if (Number.isNaN(userId)) return res.status(400).json({ error: "ID de usuario invalido" });

            const records = await this.app.getRecordsByUserId(userId);
            return res.status(200).json(records);
        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteRecord(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" });

            const deleted = await this.app.deleteRecord(id);
            if (!deleted) return res.status(404).json({ error: "Registro no encontrado" });
            return res.status(200).json({ message: "Registro eliminado con exito" });
        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}
