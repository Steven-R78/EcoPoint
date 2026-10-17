import { useEffect, useState } from 'react';
import { GetMaterialsUseCase } from '../../../../domain/useCases/materials/GetMaterials';
import { GetPointByIdUseCase } from '../../../../domain/useCases/points/GetPointById';
import { CreatePointUseCase } from '../../../../domain/useCases/points/CreatePoint';
import { UpdatePointUseCase } from '../../../../domain/useCases/points/UpdatePoint';
import { Material } from '../../../../domain/entities/Material';

const PointFormViewModel = (pointId?: number) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(Boolean(pointId));
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    schedule: '',
    materialIds: [] as number[],
  });

  useEffect(() => {
    const boot = async () => {
      const materialsRes = await GetMaterialsUseCase();
      if (materialsRes.success) {
        setMaterials((materialsRes.data ?? []).filter((item: Material) => item.status !== 0));
      }
      if (!pointId) return;
      const found = await GetPointByIdUseCase(pointId);
      if (!found) {
        setErrorMessage('No se encontró el punto.');
        setLoading(false);
        return;
      }
      setValues({
        name: found.name,
        address: found.address ?? '',
        latitude: String(found.latitude ?? ''),
        longitude: String(found.longitude ?? ''),
        schedule: found.schedule ?? '',
        materialIds: found.materialIds.length
          ? found.materialIds
          : found.materialId
            ? [found.materialId]
            : [],
      });
      setLoading(false);
    };
    boot();
  }, [pointId]);

  const onChange = (property: string, value: string) => {
    setValues({ ...values, [property]: value });
    if (errorMessage) setErrorMessage('');
  };

  const toggleMaterial = (id: number) => {
    setValues((current) => ({
      ...current,
      materialIds: current.materialIds.includes(id)
        ? current.materialIds.filter((item) => item !== id)
        : [...current.materialIds, id],
    }));
  };

  const payload = () => ({
    name: values.name.trim(),
    address: values.address.trim(),
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    status: 1,
    materialIds: values.materialIds,
    materialId: values.materialIds[0] ?? null,
    schedule: values.schedule.trim() || null,
    photoUrl: null,
  });

  const isValid = () => {
    if (values.name.trim().length < 3) {
      setErrorMessage('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    if (Number.isNaN(Number(values.latitude)) || values.latitude.trim() === '') {
      setErrorMessage('La latitud es obligatoria');
      return false;
    }
    if (Number.isNaN(Number(values.longitude)) || values.longitude.trim() === '') {
      setErrorMessage('La longitud es obligatoria');
      return false;
    }
    return true;
  };

  const save = async () => {
    if (saving || !isValid()) return { ok: false };
    setSaving(true);
    const response = pointId
      ? await UpdatePointUseCase(pointId, payload())
      : await CreatePointUseCase(payload());
    setSaving(false);
    if (!response.success) {
      setErrorMessage(response.message);
      return { ok: false };
    }
    return { ok: true };
  };

  return { ...values, materials, errorMessage, loading, saving, onChange, toggleMaterial, save };
};

export default PointFormViewModel;
