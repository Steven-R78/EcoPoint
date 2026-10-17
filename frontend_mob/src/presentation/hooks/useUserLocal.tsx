import { useEffect, useState } from 'react';
import { GetUserLocalUseCase } from '../../domain/useCases/userLocal/GetUserLocal';
import { User } from '../../domain/entities/User';

export const useUserLocal = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUserSession();
  }, []);

  const getUserSession = async () => {
    const u = await GetUserLocalUseCase();
    setUser(u);
  };

  return { user, getUserSession };
};
