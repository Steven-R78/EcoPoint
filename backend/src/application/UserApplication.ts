import { User } from "../domain/User";
import { UserPort } from "../domain/UserPort";

export class UserApplication {
    private port: UserPort;

    constructor(port: UserPort) {
        this.port = port;
    }

    async createUser(user: Omit<User, "id">): Promise<number> {
        // Validar datos de entrada, email no existe
        const existingUser = await this.port.getUserByEmail(user.email);
        if (existingUser) {
            throw new Error("Email already in use");
        }

        return this.port.createUser(user);
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.port.getUserById(id);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.port.getUserByEmail(email);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.port.getAllUsers();
    }

    async updateUser(id: number, user: Partial<User>): Promise<boolean> {
        const existingUser = await this.port.getUserById(id);
        if (!existingUser) {
            throw new Error("User not found");
        }
        if (user.email) {
            const emailTaken = await this.port.getUserByEmail(user.email);
            if (emailTaken && emailTaken.id !== id) {
                throw new Error("Email already in use");
            }
        }
        return await this.port.updateUser(id, user);
    }

    async deleteUser(id: number): Promise<boolean> {
        return await this.port.deleteUser(id);
    }
}