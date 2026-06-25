import { Repository } from "typeorm";
import { RecyclingRecord as RecyclingRecordDomain } from "../../domain/RecyclingRecord";
import { RecyclingRecord as RecyclingRecordEntity } from "../entities/RecyclingRecord";
import { User } from "../entities/User";
import { RecyclingPoint } from "../entities/RecyclingPoint";
import { Medal } from "../entities/Medal";
import { UserMedal } from "../entities/UserMedal";
import { CreateRecordResult, RecyclingRecordPort } from "../../domain/port/RecyclingRecordPort";
import { AppDataSource } from "../config/data-base";

export class RecyclingRecordAdapter implements RecyclingRecordPort {
    private recordRepository: Repository<RecyclingRecordEntity>;
    private userRepository: Repository<User>;
    private pointRepository: Repository<RecyclingPoint>;
    private medalRepository: Repository<Medal>;
    private userMedalRepository: Repository<UserMedal>;

    constructor() {
        this.recordRepository = AppDataSource.getRepository(RecyclingRecordEntity);
        this.userRepository = AppDataSource.getRepository(User);
        this.pointRepository = AppDataSource.getRepository(RecyclingPoint);
        this.medalRepository = AppDataSource.getRepository(Medal);
        this.userMedalRepository = AppDataSource.getRepository(UserMedal);
    }

    private toDomain(entity: RecyclingRecordEntity): RecyclingRecordDomain {
        return {
            id: entity.id_record,
            userId: entity.user_id,
            pointId: entity.point_id,
            pointsEarned: entity.points_earned,
            recycledAt: entity.recycled_at,
            status: entity.status_record,
        };
    }

    private toEntity(domain: Omit<RecyclingRecordDomain, "id" | "recycledAt">): RecyclingRecordEntity {
        const entity = new RecyclingRecordEntity();
        entity.user_id = domain.userId;
        entity.point_id = domain.pointId;
        entity.points_earned = domain.pointsEarned;
        entity.status_record = domain.status;
        return entity;
    }

    async userExistsActive(userId: number): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { id_user: userId, status_user: 1 },
        });
        return user !== null;
    }

    async pointExistsActive(pointId: number): Promise<boolean> {
        const point = await this.pointRepository.findOne({
            where: { id_point: pointId, status_point: 1 },
        });
        return point !== null;
    }

    private async getUserTotalPoints(userId: number): Promise<number> {
        const records = await this.recordRepository.find({
            where: { user_id: userId, status_record: 1 },
        });
        return records.reduce((sum, record) => sum + record.points_earned, 0);
    }

    private async awardMedals(userId: number, totalPoints: number): Promise<string[]> {
        const medals = await this.medalRepository.find({ where: { status_medal: 1 } });
        const earnedNames: string[] = [];

        for (const medal of medals) {
            if (totalPoints < medal.points_required) continue;

            const alreadyHas = await this.userMedalRepository.findOne({
                where: { user_id: userId, medal_id: medal.id_medal },
            });
            if (alreadyHas) continue;

            const userMedal = new UserMedal();
            userMedal.user_id = userId;
            userMedal.medal_id = medal.id_medal;
            await this.userMedalRepository.save(userMedal);
            earnedNames.push(medal.name_medal);
        }

        return earnedNames;
    }

    async createRecord(record: Omit<RecyclingRecordDomain, "id" | "recycledAt">): Promise<CreateRecordResult> {
        try {
            const saved = await this.recordRepository.save(this.toEntity(record));
            const totalPoints = await this.getUserTotalPoints(record.userId);
            const newMedals = await this.awardMedals(record.userId, totalPoints);

            return {
                recordId: saved.id_record,
                totalPoints,
                newMedals,
            };
        } catch (error) {
            console.error("Error creating recycling record:", error);
            throw new Error("Failed to create recycling record");
        }
    }

    async updateRecord(id: number, record: Partial<RecyclingRecordDomain>): Promise<boolean> {
        try {
            const existing = await this.recordRepository.findOne({ where: { id_record: id } });
            if (!existing) return false;

            Object.assign(existing, {
                user_id: record.userId ?? existing.user_id,
                point_id: record.pointId ?? existing.point_id,
                points_earned: record.pointsEarned ?? existing.points_earned,
                status_record: record.status ?? existing.status_record,
            });

            await this.recordRepository.save(existing);
            return true;
        } catch (error) {
            console.error("Error updating recycling record:", error);
            throw new Error("Failed to update recycling record");
        }
    }

    async deleteRecord(id: number): Promise<boolean> {
        try {
            const existing = await this.recordRepository.findOne({ where: { id_record: id } });
            if (!existing) return false;
            Object.assign(existing, { status_record: 0 });
            await this.recordRepository.save(existing);
            return true;
        } catch (error) {
            console.error("Error deleting recycling record:", error);
            throw new Error("Failed to delete recycling record");
        }
    }

    async getRecordById(id: number): Promise<RecyclingRecordDomain | null> {
        const record = await this.recordRepository.findOne({ where: { id_record: id } });
        return record ? this.toDomain(record) : null;
    }

    async getAllRecords(): Promise<RecyclingRecordDomain[]> {
        const records = await this.recordRepository.find({ where: { status_record: 1 } });
        return records.map((r) => this.toDomain(r));
    }

    async getRecordsByUserId(userId: number): Promise<RecyclingRecordDomain[]> {
        const records = await this.recordRepository.find({
            where: { user_id: userId, status_record: 1 },
        });
        return records.map((r) => this.toDomain(r));
    }
}
