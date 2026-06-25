import { RecyclingRecord } from "../RecyclingRecord";

export type CreateRecordResult = {
    recordId: number;
    totalPoints: number;
    newMedals: string[];
};

export interface RecyclingRecordPort {
    createRecord(record: Omit<RecyclingRecord, "id" | "recycledAt">): Promise<CreateRecordResult>;
    updateRecord(id: number, record: Partial<RecyclingRecord>): Promise<boolean>;
    deleteRecord(id: number): Promise<boolean>;
    getRecordById(id: number): Promise<RecyclingRecord | null>;
    getAllRecords(): Promise<RecyclingRecord[]>;
    getRecordsByUserId(userId: number): Promise<RecyclingRecord[]>;
    userExistsActive(userId: number): Promise<boolean>;
    pointExistsActive(pointId: number): Promise<boolean>;
}
