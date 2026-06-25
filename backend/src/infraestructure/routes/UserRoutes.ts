import { Router } from "express";
import { UserApplication } from "../../application/UserApplication";
import { UserAdapter } from "../adapter/UserAdapter";
import { UserController } from "../controller/UserController";

const router = Router();

// Iniciar capas
const userAdapter = new UserAdapter();
const userApp = new UserApplication(userAdapter)
const userController = new UserController(userApp)

//definicion de rutas
router.post("/users", async (req,res) => {
    try {
        await userController.createUser(req,res)
    } catch (error) {
        res.status(500).json({ message: "Error en la creacion de usuario", error })
    }
});

router.get("/users", async (req,res) => {
    try {
        await userController.getAllUsers(req,res)
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo los datos", error })
    }
});

router.get("/users/email/:email", async (req,res) => {
    try {
        await userController.getUserByEmail(req,res)
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo al usuario", error })
    }
})

router.get("/users/id/:id", async (req,res) => {
    try {
        await userController.getUserById(req,res)
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo al usuario", error })
    }
})

router.put("/users/:id", async (req, res) => {
    try {
        await userController.updateUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando usuario", error });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        await userController.deleteUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error eliminando usuario", error });
    }
});

export default router;