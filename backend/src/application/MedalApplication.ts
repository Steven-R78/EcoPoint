import { Medal } from "../domain/Medal";
import { MedalPort } from "../domain/port/MedalPort";

export class MedalApplication {
    private port: MedalPort;

    constructor(port: MedalPort) {
        this.port = port;
    }

    async createMedal(medal: Omit<Medal, "id">): Promise<number> {
        const existing = await this.port.getMedalByName(medal.name);
        if (existing) {
            throw new Error("Esta medalla ya esta registrada");
        }
        return this.port.createMedal(medal);
    }

    async getMedalById(id: number): Promise<Medal | null> {
        return this.port.getMedalById(id);
    }

    async getAllMedals(): Promise<Medal[]> {
        return this.port.getAllMedals();
    }

    async updateMedal(id: number, medal: Partial<Medal>): Promise<boolean> {
        const existing = await this.port.getMedalById(id);
        if (!existing) {
            throw new Error("Medalla no encontrada");
        }
        if (medal.name) {
            const nameTaken = await this.port.getMedalByName(medal.name);
            if (nameTaken && nameTaken.id !== id) {
                throw new Error("Este nombre de medalla ya esta en uso");
            }
        }
        return this.port.updateMedal(id, medal);
    }

    async deleteMedal(id: number): Promise<boolean> {
        return this.port.deleteMedal(id);
    }
}
