import { Medal } from "../Medal";

export interface MedalPort {
    createMedal(medal: Omit<Medal, "id">): Promise<number>;
    updateMedal(id: number, medal: Partial<Medal>): Promise<boolean>;
    deleteMedal(id: number): Promise<boolean>;
    getMedalById(id: number): Promise<Medal | null>;
    getMedalByName(name: string): Promise<Medal | null>;
    getAllMedals(): Promise<Medal[]>;
}
