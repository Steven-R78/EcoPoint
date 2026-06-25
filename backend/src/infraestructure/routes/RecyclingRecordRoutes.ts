import { Router } from "express";
import { RecyclingRecordApplication } from "../../application/RecyclingRecordApplication";
import { RecyclingRecordAdapter } from "../adapter/RecyclingRecordAdapter";
import { RecyclingRecordController } from "../controller/RecyclingRecordController";

const router = Router();
const adapter = new RecyclingRecordAdapter();
const app = new RecyclingRecordApplication(adapter);
const controller = new RecyclingRecordController(app);

router.post("/recycling-records", async (req, res) => {
    try { await controller.createRecord(req, res); }
    catch (error) { res.status(500).json({ message: "Error creando registro", error }); }
});

router.get("/recycling-records", async (req, res) => {
    try { await controller.getAllRecords(req, res); }
    catch (error) { res.status(500).json({ message: "Error obteniendo registros", error }); }
});

router.get("/recycling-records/user/:userId", async (req, res) => {
    try { await controller.getRecordsByUserId(req, res); }
    catch (error) { res.status(500).json({ message: "Error obteniendo registros del usuario", error }); }
});

router.get("/recycling-records/id/:id", async (req, res) => {
    try { await controller.getRecordById(req, res); }
    catch (error) { res.status(500).json({ message: "Error obteniendo registro", error }); }
});

router.put("/recycling-records/:id", async (req, res) => {
    try { await controller.updateRecord(req, res); }
    catch (error) { res.status(500).json({ message: "Error actualizando registro", error }); }
});

router.delete("/recycling-records/:id", async (req, res) => {
    try { await controller.deleteRecord(req, res); }
    catch (error) { res.status(500).json({ message: "Error eliminando registro", error }); }
});

export default router;
