import bcrypt from 'bcryptjs';
import { User } from "../domain/User";
import { UserPort } from "../domain/port/UserPort";

export type PublicUser = Omit<User, 'password'>;

export class UserApplication {
    private port: UserPort;

    constructor(port: UserPort) {
        this.port = port;
    }

    async createUser(user: Omit<User, "id">): Promise<number> {
        const existingUser = await this.port.getUserByEmail(user.email);
        if (existingUser) {
            throw new Error("Este email ya esta registrado");
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        return this.port.createUser({ ...user, password: hashedPassword });
    }

    async login(email: string, password: string): Promise<PublicUser> {
        const user = await this.port.getUserByEmail(email);
        if (!user || user.status !== 1) {
            throw new Error("Credenciales invalidas");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("Credenciales invalidas");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            roleId: user.roleId,
        };
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
                throw new Error("Este email ya esta en uso");
            }
        }

        const dataToUpdate = { ...user };
        if (user.password) {
            dataToUpdate.password = await bcrypt.hash(user.password, 10);
        }

        return await this.port.updateUser(id, dataToUpdate);
    }

    async deleteUser(id: number): Promise<boolean> {
        return await this.port.deleteUser(id);
    }
}