export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  status?: number;
  roleId?: number;
  documentType?: string | null;
  documentNumber?: string | null;
  session_token?: string;
}
