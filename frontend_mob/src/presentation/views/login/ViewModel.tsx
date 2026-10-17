import { useEffect, useState } from 'react';
import { LoginAuthUseCase } from '../../../domain/useCases/auth/LoginAuth';
import { GetUserLocalUseCase } from '../../../domain/useCases/userLocal/GetUserLocal';
import { SaveUserUseCase } from '../../../domain/useCases/userLocal/SaveUserLocal';
import { User } from '../../../domain/entities/User';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginViewModel = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [values, setValues] = useState({ email: '', password: '' });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      const stored = await GetUserLocalUseCase();
      if (stored?.session_token) {
        setUser(stored);
      }
      setRestoring(false);
    };
    restoreSession();
  }, []);

  const onChange = (property: string, value: string) => {
    setValues({ ...values, [property]: value });
    if (errorMessage) setErrorMessage('');
  };

  const isValidForm = () => {
    const email = values.email.trim();
    if (email === '') {
      setErrorMessage('El correo es requerido');
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage('Escribe un correo válido');
      return false;
    }
    if (values.password === '') {
      setErrorMessage('La contraseña es requerida');
      return false;
    }
    return true;
  };

  const login = async () => {
    if (loading || !isValidForm()) return;
    setErrorMessage('');
    setLoading(true);
    const response = await LoginAuthUseCase(values.email.trim(), values.password);
    setLoading(false);
    if (!response.success) {
      const raw = response.message ?? '';
      setErrorMessage(
        raw.toLowerCase().includes('credencial')
          ? 'Correo o contraseña incorrectos'
          : raw,
      );
      return;
    }
    await SaveUserUseCase(response.data);
    setUser(response.data);
  };

  return { ...values, user, errorMessage, loading, restoring, onChange, login };
};

export default LoginViewModel;
