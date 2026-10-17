import { useState } from 'react';
import { RegisterAuthUseCase } from '../../../domain/useCases/auth/RegisterAuth';

export const DOCUMENT_TYPES = [
  'Cédula de ciudadanía',
  'Tarjeta de identidad',
  'Pasaporte',
  'Cédula de extranjería',
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterViewModel = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    documentType: 'Cédula de ciudadanía',
    documentNumber: '',
  });

  const onChange = (property: string, value: string) => {
    setValues({ ...values, [property]: value });
    if (errorMessage) setErrorMessage('');
  };

  const isValidForm = () => {
    if (values.name.trim() === '') {
      setErrorMessage('El nombre es requerido');
      return false;
    }
    if (values.email.trim() === '') {
      setErrorMessage('El correo es requerido');
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
    if (values.password === '') {
      setErrorMessage('La contraseña es requerida');
      return false;
    }
    if (values.password !== values.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const register = async () => {
    if (loading || !isValidForm()) return;
    setErrorMessage('');
    setLoading(true);
    const response = await RegisterAuthUseCase({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      documentNumber: values.documentNumber.trim(),
    });
    setLoading(false);
    if (!response.success) {
      setErrorMessage(response.message);
      return;
    }
    setSuccessMessage('Cuenta creada. Inicia sesión.');
  };

  return { ...values, errorMessage, successMessage, loading, onChange, register };
};

export default RegisterViewModel;
