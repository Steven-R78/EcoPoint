import { useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { GetPointsUseCase } from '../../../domain/useCases/points/GetPoints';
import { GetMaterialsUseCase } from '../../../domain/useCases/materials/GetMaterials';
import { RecyclingPoint } from '../../../domain/entities/RecyclingPoint';
import { Material } from '../../../domain/entities/Material';

export type PointFilter = 'near' | number | null;

const toRad = (value: number) => (value * Math.PI) / 180;

const distanceKm = (
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
) => {
  const R = 6371;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.latitude)) * Math.cos(toRad(to.latitude)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const PointsViewModel = () => {
  const [points, setPoints] = useState<RecyclingPoint[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<PointFilter>('near');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const withDistance = (list: RecyclingPoint[]): RecyclingPoint[] => {
    if (!coords) return list.map((point) => ({ ...point, distanceKm: null }));
    return list.map((point) => ({
      ...point,
      distanceKm: distanceKm(coords, point),
    }));
  };

  const load = async () => {
    setLoading(true);
    const [pointsRes, materialsRes] = await Promise.all([GetPointsUseCase(), GetMaterialsUseCase()]);
    if (!pointsRes.success) {
      setErrorMessage(pointsRes.message);
      setPoints([]);
    } else {
      setErrorMessage('');
      setPoints(pointsRes.data ?? []);
    }
    if (materialsRes.success) {
      setMaterials((materialsRes.data ?? []).filter((item: Material) => item.status !== 0));
    }
    setLoading(false);
  };

  const requestNear = async () => {
    setFilter('near');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setErrorMessage('Activa la ubicación para ordenar por cercanía.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setErrorMessage('');
    } catch {
      setErrorMessage('No se pudo leer la ubicación.');
    }
  };

  const materialName = (id: number) =>
    materials.find((material) => material.id === id)?.name ?? `Material ${id}`;

  const namesFor = (point: RecyclingPoint) => {
    const ids = point.materialIds.length ? point.materialIds : point.materialId ? [point.materialId] : [];
    return ids.map(materialName);
  };

  const visiblePoints = useMemo((): RecyclingPoint[] => {
    const text = query.trim().toLowerCase();
    let list = withDistance(points);

    if (typeof filter === 'number') {
      list = list.filter((point) => {
        const ids = point.materialIds.length ? point.materialIds : point.materialId ? [point.materialId] : [];
        return ids.includes(filter);
      });
    }

    if (text) {
      list = list.filter(
        (point) =>
          point.name.toLowerCase().includes(text) || point.address.toLowerCase().includes(text),
      );
    }

    if (filter === 'near' && coords) {
      list = [...list].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
    }

    return list;
  }, [points, query, filter, coords, materials]);

  return {
    points: visiblePoints,
    materials,
    query,
    filter,
    errorMessage,
    loading,
    setQuery,
    setFilter,
    requestNear,
    namesFor,
    load,
  };
};

export default PointsViewModel;
