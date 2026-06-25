import { RecyclingRecord } from "../domain/RecyclingRecord";
import { CreateRecordResult, RecyclingRecordPort } from "../domain/port/RecyclingRecordPort";

export class RecyclingRecordApplication {
    private port: RecyclingRecordPort;

    constructor(port: RecyclingRecordPort) {
        this.port = port;
    }

    async createRecord(record: Omit<RecyclingRecord, "id" | "recycledAt">): Promise<CreateRecordResult> {
        const userActive = await this.port.userExistsActive(record.userId);
        if (!userActive) {
            throw new Error("Usuario no encontrado o inactivo");
        }

        const pointActive = await this.port.pointExistsActive(record.pointId);
        if (!pointActive) {
            throw new Error("Punto de reciclaje no encontrado o inactivo");
        }

        if (record.pointsEarned <= 0) {
            throw new Error("Los puntos ganados deben ser mayores a 0");
        }

        return this.port.createRecord(record);
    }

    async getRecordById(id: number): Promise<RecyclingRecord | null> {
        return this.port.getRecordById(id);
    }

    async getAllRecords(): Promise<RecyclingRecord[]> {
        return this.port.getAllRecords();
    }

    async getRecordsByUserId(userId: number): Promise<RecyclingRecord[]> {
        return this.port.getRecordsByUserId(userId);
    }

    async updateRecord(id: number, record: Partial<RecyclingRecord>): Promise<boolean> {
        const existing = await this.port.getRecordById(id);
        if (!existing) {
            throw new Error("Registro de reciclaje no encontrado");
        }
        return this.port.updateRecord(id, record);
    }

    async deleteRecord(id: number): Promise<boolean> {
        return this.port.deleteRecord(id);
    }
}
