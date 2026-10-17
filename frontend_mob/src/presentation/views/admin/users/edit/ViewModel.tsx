import { useEffect, useState } from 'react';
import { GetUserByIdUseCase } from '../../../../../domain/useCases/users/GetUserById';
import { UpdateUserUseCase } from '../../../../../domain/useCases/users/UpdateUser';
import { User } from '../../../../../domain/entities/User';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EditUserViewModel = (userId: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    roleId: 2,
    status: 1,
  });

  useEffect(() => {
    const load = async () => {
      const found = await GetUserByIdUseCase(userId);
      setUser(found);
      if (found) {
        setValues({
          name: found.name ?? '',
          email: found.email ?? '',
          roleId: found.roleId ?? 2,
          status: found.status ?? 1,
        });
      } else {
        setErrorMessage('No se encontró el usuario.');
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  const onChange = (property: string, value: string | number) => {
    setValues({ ...values, [property]: value });
    if (errorMessage) setErrorMessage('');
  };

  const save = async () => {
    if (saving) return { ok: false };
    if (values.name.trim().length < 3) {
      setErrorMessage('El nombre debe tener al menos 3 caracteres');
      return { ok: false };
    }
    if (!EMAIL_REGEX.test(values.email.trim())) {
      setErrorMessage('Escribe un correo válido');
      return { ok: false };
    }
    setSaving(true);
    const response = await UpdateUserUseCase(userId, {
      name: values.name.trim(),
      email: values.email.trim(),
      roleId: values.roleId,
      status: values.status,
    });
    setSaving(false);
    if (!response.success) {
      setErrorMessage(response.message);
      return { ok: false };
    }
    return { ok: true };
  };

  return { ...values, user, errorMessage, loading, saving, onChange, save };
};

export default EditUserViewModel;
