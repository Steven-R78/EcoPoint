export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    status: number;
    roleId: number;
    documentType: string | null;
    documentNumber: string | null;
}