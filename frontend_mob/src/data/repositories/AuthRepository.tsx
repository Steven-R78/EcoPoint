import { AxiosError } from 'axios';
import { User } from '../../domain/entities/User';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { ApiDelivery, API_BASE_URL } from '../sources/remote/api/ApiDelivery';
import { ResponseApiDelivery } from '../sources/remote/models/ResponseApiDelivery';

const toError = (error: unknown): ResponseApiDelivery => {
  const e = error as AxiosError<any>;
  const data = e.response?.data;
  const isNetwork = !e.response && (e.code === 'ERR_NETWORK' || e.message === 'Network Error');
  return {
    success: false,
    message: isNetwork
      ? `No se alcanzó la API (${API_BASE_URL}). Misma Wi‑Fi, backend en 4000 y firewall de Windows.`
      : data?.error ?? data?.message ?? e.message ?? 'Error de conexión con la API',
    error: data,
  };
};

export class AuthRepositoryImpl implements AuthRepository {
  async register(user: User): Promise<ResponseApiDelivery> {
    try {
      const response = await ApiDelivery.post('/users', {
        name: user.name,
        email: user.email,
        password: user.password,
        status: 1,
        roleId: 2,
        documentType: user.documentType ?? null,
        documentNumber: user.documentNumber ?? null,
      });
      return {
        success: true,
        message: response.data.message ?? 'Usuario creado con exito',
        data: response.data,
      };
    } catch (error) {
      console.log('Error register: ' + JSON.stringify((error as AxiosError).response?.data));
      return toError(error);
    }
  }

  async login(email: string, password: string): Promise<ResponseApiDelivery> {
    try {
      const response = await ApiDelivery.post('/auth/login', { email, password });
      const { token, user, message } = response.data;
      return {
        success: true,
        message: message ?? 'Login exitoso',
        data: { ...user, session_token: token },
      };
    } catch (error) {
      console.log('Error login: ' + JSON.stringify((error as AxiosError).response?.data));
      return toError(error);
    }
  }
}
