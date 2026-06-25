import { Router } from "express";
import { MedalApplication } from "../../application/MedalApplication";
import { MedalAdapter } from "../adapter/MedalAdapter";
import { MedalController } from "../controller/MedalController";

const router = Router();
const adapter = new MedalAdapter();
const app = new MedalApplication(adapter);
const controller = new MedalController(app);

router.post("/medals", async (req, res) => {
    try { await controller.createMedal(req, res); }
    catch (error) { res.status(500).json({ message: "Error creando medalla", error }); }
});

router.get("/medals", async (req, res) => {
    try { await controller.getAllMedals(req, res); }
    catch (error) { res.status(500).json({ message: "Error obteniendo medallas", error }); }
});

router.get("/medals/id/:id", async (req, res) => {
    try { await controller.getMedalById(req, res); }
    catch (error) { res.status(500).json({ message: "Error obteniendo medalla", error }); }
});

router.put("/medals/:id", async (req, res) => {
    try { await controller.updateMedal(req, res); }
    catch (error) { res.status(500).json({ message: "Error actualizando medalla", error }); }
});

router.delete("/medals/:id", async (req, res) => {
    try { await controller.deleteMedal(req, res); }
    catch (error) { res.status(500).json({ message: "Error eliminando medalla", error }); }
});

export default router;
