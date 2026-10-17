import React, { createContext, useContext, useEffect, useState } from 'react';
import { GetUserLocalUseCase } from '../../domain/useCases/userLocal/GetUserLocal';
import { User } from '../../domain/entities/User';

type ViewMode = 'admin' | 'citizen';

type RoleModeContextValue = {
  user: User | null;
  isAdminUser: boolean;
  viewMode: ViewMode;
  isAdminMode: boolean;
  setViewMode: (mode: ViewMode) => void;
  refresh: () => Promise<void>;
};

const RoleModeContext = createContext<RoleModeContextValue | null>(null);

export const RoleModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('citizen');

  const refresh = async () => {
    const stored = await GetUserLocalUseCase();
    setUser((prev) => {
      if (stored?.roleId === 1 && !prev) {
        setViewMode('admin');
      } else if (stored?.roleId !== 1) {
        setViewMode('citizen');
      }
      return stored;
    });
  };

  useEffect(() => {
    const boot = async () => {
      const stored = await GetUserLocalUseCase();
      setUser(stored);
      setViewMode(stored?.roleId === 1 ? 'admin' : 'citizen');
    };
    boot();
  }, []);

  const isAdminUser = user?.roleId === 1;
  const isAdminMode = isAdminUser && viewMode === 'admin';

  return (
    <RoleModeContext.Provider
      value={{ user, isAdminUser, viewMode, isAdminMode, setViewMode, refresh }}
    >
      {children}
    </RoleModeContext.Provider>
  );
};

export const useRoleMode = () => {
  const value = useContext(RoleModeContext);
  if (!value) {
    return {
      user: null,
      isAdminUser: false,
      viewMode: 'citizen' as ViewMode,
      isAdminMode: false,
      setViewMode: (_mode: ViewMode) => undefined,
      refresh: async () => undefined,
    };
  }
  return value;
};
