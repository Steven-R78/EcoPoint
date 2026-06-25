import { Repository } from "typeorm";
import { Medal as MedalDomain } from "../../domain/Medal";
import { Medal as MedalEntity } from "../entities/Medal";
import { MedalPort } from "../../domain/port/MedalPort";
import { AppDataSource } from "../config/data-base";

export class MedalAdapter implements MedalPort {
    private medalRepository: Repository<MedalEntity>;

    constructor() {
        this.medalRepository = AppDataSource.getRepository(MedalEntity);
    }

    private toDomain(entity: MedalEntity): MedalDomain {
        return {
            id: entity.id_medal,
            name: entity.name_medal,
            pointsRequired: entity.points_required,
            status: entity.status_medal,
        };
    }

    private toEntity(domain: Omit<MedalDomain, "id">): MedalEntity {
        const entity = new MedalEntity();
        entity.name_medal = domain.name;
        entity.points_required = domain.pointsRequired;
        entity.status_medal = domain.status;
        return entity;
    }

    async createMedal(medal: Omit<MedalDomain, "id">): Promise<number> {
        try {
            const saved = await this.medalRepository.save(this.toEntity(medal));
            return saved.id_medal;
        } catch (error) {
            console.error("Error creating medal:", error);
            throw new Error("Failed to create medal");
        }
    }

    async updateMedal(id: number, medal: Partial<MedalDomain>): Promise<boolean> {
        try {
            const existing = await this.medalRepository.findOne({ where: { id_medal: id } });
            if (!existing) return false;

            Object.assign(existing, {
                name_medal: medal.name ?? existing.name_medal,
                points_required: medal.pointsRequired ?? existing.points_required,
                status_medal: medal.status ?? existing.status_medal,
            });

            await this.medalRepository.save(existing);
            return true;
        } catch (error) {
            console.error("Error updating medal:", error);
            throw new Error("Failed to update medal");
        }
    }

    async deleteMedal(id: number): Promise<boolean> {
        try {
            const existing = await this.medalRepository.findOne({ where: { id_medal: id } });
            if (!existing) return false;
            Object.assign(existing, { status_medal: 0 });
            await this.medalRepository.save(existing);
            return true;
        } catch (error) {
            console.error("Error deleting medal:", error);
            throw new Error("Failed to delete medal");
        }
    }

    async getMedalById(id: number): Promise<MedalDomain | null> {
        const medal = await this.medalRepository.findOne({ where: { id_medal: id } });
        return medal ? this.toDomain(medal) : null;
    }

    async getMedalByName(name: string): Promise<MedalDomain | null> {
        const medal = await this.medalRepository.findOne({ where: { name_medal: name } });
        return medal ? this.toDomain(medal) : null;
    }

    async getAllMedals(): Promise<MedalDomain[]> {
        const medals = await this.medalRepository.find({ where: { status_medal: 1 } });
        return medals.map((m) => this.toDomain(m));
    }
}
