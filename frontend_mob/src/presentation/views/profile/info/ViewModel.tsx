import { useEffect, useState } from 'react';
import { RemoveUserLocalUseCase } from '../../../../domain/useCases/userLocal/RemoveUserLocal';
import { GetUserLocalUseCase } from '../../../../domain/useCases/userLocal/GetUserLocal';
import { GetRecordsByUserUseCase } from '../../../../domain/useCases/records/GetRecordsByUser';
import { User } from '../../../../domain/entities/User';

const ProfileInfoViewModel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [aportes, setAportes] = useState(0);
  const [puntosVisitados, setPuntosVisitados] = useState(0);
  const [kilos, setKilos] = useState(0);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const stored = await GetUserLocalUseCase();
    setUser(stored);
    if (!stored?.id) return;
    const records = await GetRecordsByUserUseCase(stored.id);
    setAportes(records.length);
    const uniquePoints = new Set(records.map((item: any) => item.pointId));
    setPuntosVisitados(uniquePoints.size);
    const total = records.reduce((sum: number, item: any) => sum + Number(item.pointsEarned ?? 0), 0);
    setKilos(total);
  };

  const removeSession = async () => {
    await RemoveUserLocalUseCase();
  };

  const isAdmin = user?.roleId === 1;

  return { user, isAdmin, aportes, puntosVisitados, kilos, removeSession };
};

export default ProfileInfoViewModel;
