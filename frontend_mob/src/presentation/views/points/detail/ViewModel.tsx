import { useEffect, useState } from 'react';
import { GetPointByIdUseCase } from '../../../../domain/useCases/points/GetPointById';
import { GetMaterialsUseCase } from '../../../../domain/useCases/materials/GetMaterials';
import { RecyclingPoint } from '../../../../domain/entities/RecyclingPoint';
import { Material } from '../../../../domain/entities/Material';

const PointDetailViewModel = (pointId: number) => {
  const [point, setPoint] = useState<RecyclingPoint | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [found, materialsRes] = await Promise.all([
        GetPointByIdUseCase(pointId),
        GetMaterialsUseCase(),
      ]);
      if (!found) {
        setErrorMessage('No se encontró el punto.');
        setPoint(null);
      } else {
        setPoint(found);
        setErrorMessage('');
      }
      if (materialsRes.success) {
        setMaterials(materialsRes.data ?? []);
      }
      setLoading(false);
    };
    load();
  }, [pointId]);

  const materialNames = () => {
    if (!point) return [];
    const ids = point.materialIds.length ? point.materialIds : point.materialId ? [point.materialId] : [];
    return ids.map((id) => materials.find((material) => material.id === id)?.name ?? `Material ${id}`);
  };

  return { point, loading, errorMessage, materialNames };
};

export default PointDetailViewModel;
