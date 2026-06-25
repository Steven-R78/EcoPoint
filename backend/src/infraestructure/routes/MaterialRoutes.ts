import { Router } from "express";
import { MaterialApplication } from "../../application/MaterialApplication";
import { MaterialAdapter } from "../adapter/MaterialAdapter";
import { MaterialController } from "../controller/MaterialController";

const router = Router();
const adapter = new MaterialAdapter();
const app = new MaterialApplication(adapter);
const controller = new MaterialController(app);

router.post("/materials", async (req, res) => {
    try { await controller.createMaterial(req, res); }
    catch (error) { res.status(500).json({ message: "Error creando material", error }); }
});

router.get("/materials", async (req, res) => {
    try { await controller.getAllMaterials(req, res); }
    catch (error) { res.status(500).json({ message: "Error obteniendo materiales", error }); }
});

router.get("/materials/id/:id", async (req, res) => {
    try { await controller.getMaterialById(req, res); }
    catch (error) { res.status(500).json({ message: "Error obteniendo material", error }); }
});

router.put("/materials/:id", async (req, res) => {
    try { await controller.updateMaterial(req, res); }
    catch (error) { res.status(500).json({ message: "Error actualizando material", error }); }
});

router.delete("/materials/:id", async (req, res) => {
    try { await controller.deleteMaterial(req, res); }
    catch (error) { res.status(500).json({ message: "Error eliminando material", error }); }
});

export default router;
