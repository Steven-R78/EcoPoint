import { useMemo, useState } from 'react';
import { GetUsersUseCase } from '../../../../domain/useCases/users/GetUsers';
import { User } from '../../../../domain/entities/User';

const AdminUsersViewModel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const load = async () => {
    setLoading(true);
    const response = await GetUsersUseCase();
    if (!response.success) {
      setErrorMessage(response.message);
      setUsers([]);
    } else {
      setErrorMessage('');
      const list = (response.data ?? []) as User[];
      list.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'es'));
      setUsers(list);
    }
    setLoading(false);
  };

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return users;
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(text) || user.email?.toLowerCase().includes(text),
    );
  }, [users, query]);

  const ciudadanos = users.filter((user) => user.roleId !== 1).length;
  const admins = users.filter((user) => user.roleId === 1).length;

  return {
    users: visible,
    query,
    setQuery,
    loading,
    errorMessage,
    load,
    total: users.length,
    ciudadanos,
    admins,
  };
};

export default AdminUsersViewModel;
