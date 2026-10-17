import { useState } from 'react';
import { CreateUserUseCase } from '../../../../../domain/useCases/users/CreateUser';

export const DOCUMENT_TYPES = [
  'Cédula de ciudadanía',
  'Tarjeta de identidad',
  'Pasaporte',
  'Cédula de extranjería',
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateUserViewModel = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    documentType: 'Cédula de ciudadanía',
    documentNumber: '',
    password: '',
    roleId: 2,
    status: 1,
  });

  const onChange = (property: string, value: string | number) => {
    setValues({ ...values, [property]: value });
    if (errorMessage) setErrorMessage('');
  };

  const isValid = () => {
    if (values.name.trim().length < 3) {
      setErrorMessage('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    if (!EMAIL_REGEX.test(values.email.trim())) {
      setErrorMessage('Escribe un correo válido');
      return false;
    }
    if (values.documentNumber.trim() === '') {
      setErrorMessage('El número de documento es requerido');
      return false;
    }
    if (values.password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
      setErrorMessage('La contraseña debe tener letras y números');
      return false;
    }
    return true;
  };

  const create = async () => {
    if (loading || !isValid()) return { ok: false };
    setLoading(true);
    const response = await CreateUserUseCase({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      documentType: values.documentType,
      documentNumber: values.documentNumber.trim(),
      roleId: values.roleId,
      status: values.status,
    });
    setLoading(false);
    if (!response.success) {
      setErrorMessage(response.message);
      return { ok: false };
    }
    return { ok: true };
  };

  return { ...values, errorMessage, loading, onChange, create };
};

export default CreateUserViewModel;
