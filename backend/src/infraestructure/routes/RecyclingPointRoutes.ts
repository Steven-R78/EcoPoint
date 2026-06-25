import { Router } from "express";
import { RecyclingPointApplication } from "../../application/RecyclingPointApplication";
import { RecyclingPointAdapter } from "../adapter/RecyclingPointAdapter";
import { RecyclingPointController } from "../controller/RecyclingPointController";

const router = Router();

const pointAdapter = new RecyclingPointAdapter();
const pointApp = new RecyclingPointApplication(pointAdapter);
const pointController = new RecyclingPointController(pointApp);

router.post("/recycling-points", async (req, res) => {
    try {
        await pointController.createPoint(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creacion del punto de reciclaje", error });
    }
});

router.get("/recycling-points", async (req, res) => {
    try {
        await pointController.getAllPoints(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo los puntos de reciclaje", error });
    }
});

router.get("/recycling-points/id/:id", async (req, res) => {
    try {
        await pointController.getPointById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo el punto de reciclaje", error });
    }
});

router.put("/recycling-points/:id", async (req, res) => {
    try {
        await pointController.updatePoint(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando punto de reciclaje", error });
    }
});

router.delete("/recycling-points/:id", async (req, res) => {
    try {
        await pointController.deletePoint(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error eliminando punto de reciclaje", error });
    }
});

export default router;
