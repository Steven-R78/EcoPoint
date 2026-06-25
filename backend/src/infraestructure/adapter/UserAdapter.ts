import { Repository } from "typeorm";
import { User, User as UserDomain } from "../../domain/User";
import { User as UserEntity } from "../entities/User";
import { UserPort } from "../../domain/port/UserPort";
import { AppDataSource } from "../config/data-base";

export class UserAdapter implements UserPort {

    private userRepository: Repository<UserEntity>

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    // Transformar UserEntity a UserDomain
    private toDomain(userEntity: UserEntity): UserDomain {
        return {
            id: userEntity.id_user,
            name: userEntity.name_user,
            email: userEntity.email_user,
            password: userEntity.password_user,
            status: userEntity.status_user,
            roleId: userEntity.role_id,
        }
    }

    private toEntity(userDomain: Omit<UserDomain, "id">): UserEntity {
        const userEntity = new UserEntity();
        userEntity.name_user = userDomain.name;
        userEntity.email_user = userDomain.email;
        userEntity.password_user = userDomain.password;
        userEntity.status_user = userDomain.status;
        userEntity.role_id = userDomain.roleId ?? 2;
        return userEntity;
    }

    async createUser(user: Omit<UserDomain, "id">): Promise<number> {
        try {
            const newUser = this.toEntity(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.id_user;
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    }

    async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { id_user: id } });
            if (!existingUser) return false;

            // Solo actualizamos los campos que se proporcionan
            Object.assign(existingUser, {
                name_user: user.name ?? existingUser.name_user,
                email_user: user.email ?? existingUser.email_user,
                password_user: user.password ?? existingUser.password_user,
                status_user: user.status ?? existingUser.status_user,
                role_id: user.roleId ?? existingUser.role_id,
            });

            await this.userRepository.save(existingUser);
            return true;
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Failed to update user");
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { id_user: id } });
            if (!existingUser) return false;
            // Actualiza solo el status a 0 baja
            Object.assign(existingUser, { status_user: 0 });
            await this.userRepository.save(existingUser);
            return true;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new Error("Failed to fetch user by ID");
        }
    }
    
    async getUserById(id: number): Promise<User | null> {
        try {
            const user = await this.userRepository.findOne({ where: { id_user: id } });
            return user ? this.toDomain(user) : null;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new Error("Failed to fetch user by ID");
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email_user: email } });
        if (!user) return null;

        return this.toDomain(user);
    }

    async getAllUsers(): Promise<User[]> {
        try {
            const users = await this.userRepository.find({ where : { status_user: 1 } }); // Solo usuarios activos
            return users.map(this.toDomain);
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw new Error("Failed to fetch all users");
        }
    }

}