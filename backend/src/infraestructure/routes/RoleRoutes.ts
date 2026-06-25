import { Router } from "express";
import { RoleApplication } from "../../application/RoleApplication";
import { RoleAdapter } from "../adapter/RoleAdapter";
import { RoleController } from "../controller/RoleController";

const router = Router();
const adapter = new RoleAdapter();
const app = new RoleApplication(adapter);
const controller = new RoleController(app);

router.post("/roles", async (req, res) => {
    try { await controller.createRole(req, res); }
    catch (error) { res.status(500).json({ message: "Error creando rol", error }); }
});

router.get("/roles", async (req, res) => {
    try { await controller.getAllRoles(req, res); }
    catch (error) { res.status(500).json({ message: "Error obteniendo roles", error }); }
});

router.get("/roles/id/:id", async (req, res) => {
    try { await controller.getRoleById(req, res); }
    catch (error) { res.status(500).json({ message: "Error obteniendo rol", error }); }
});

router.put("/roles/:id", async (req, res) => {
    try { await controller.updateRole(req, res); }
    catch (error) { res.status(500).json({ message: "Error actualizando rol", error }); }
});

router.delete("/roles/:id", async (req, res) => {
    try { await controller.deleteRole(req, res); }
    catch (error) { res.status(500).json({ message: "Error eliminando rol", error }); }
});

export default router;
