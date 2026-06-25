import { UserApplication } from "../../application/UserApplication";
import { Request, Response } from "express";
import { loadUserData } from "../util/user-validation";
import { User } from "../../domain/User";
import { loadUpdateUserData } from "../util/user-update-validation";
import { loadEmail } from "../util/email-validation";

export class UserController {
    private app: UserApplication;

    constructor(app: UserApplication) {
        this.app = app;
    }

    private withoutPassword(user: User) {
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            // Validar datos de entrada
            const {name, email, password, status, roleId} = loadUserData(req.body)

            const user: Omit<User, "id"> = {name, email, password, status, roleId};
            const userId = await this.app.createUser(user);
            
            return res
                .status(201)
                .json({ message: "Usuario creado con exito", userId });
        } catch (error) {
            if (error instanceof Error) {
                const status = error.message.includes('email') ? 409 : 500;
                return res.status(status).json({ error: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor"})
        }
    }

    async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id)
            if(Number.isNaN(id)){
                return res.status(400).json({error: "ID invalido"})
            }

            const dataLoad = loadUpdateUserData(req.body)
            const updated = await this.app.updateUser(id, dataLoad)

            if (!updated) {
                return res
                    .status(404)
                    .json({ error: "Usuario no encontrado o sin cambios" })
            }
            return res
                .status(200)
                .json({ message: "Usuario actualizado con exito" })
        } catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message})
            }
            return res.status(500).json({ error: "Error interno del servidor" })
        }
    }

    async getUserById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id)
            if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalido" })
            
            const user = await this.app.getUserById(id)
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" })
            
            return res.status(200).json(this.withoutPassword(user));
        } catch(error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: "Error interno del servidor", details: error.message})
            }
            return res.status(500).json({ error: "Error interno del servidor" })
        }
    }

    async getUserByEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = loadEmail(req.params)

            const user = await this.app.getUserByEmail(email)

            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            return res.status(200).json(this.withoutPassword(user));
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message})
            }
            return res.status(500).json({
                error: "Error interno del servidor",
                details: error instanceof Error ? error.message : "Error desconocido"
            })
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.app.getAllUsers()
            return res.status(200).json(users.map((user) => this.withoutPassword(user)));
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener usuarios", error })
        }
    }

    async deleteUser(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id)
            if(Number.isNaN(id)){
                return res.status(400).json({error: "ID invalido"})
            }

            const deleted = await this.app.deleteUser(id)

            if (!deleted) {
                return res
                    .status(404)
                    .json({ error: "Usuario no encontrado" })
            }
            return res
                .status(200)
                .json({ message: "Usuario eliminado con exito" })
        } catch(error) {
            if (error instanceof Error) {
                return res.status(500).json({ 
                    error: "Error interno del servidor",
                    details: error.message,
                })
            }
            return res.status(500).json({ error: "Error interno del servidor" })
        }
    }
}

