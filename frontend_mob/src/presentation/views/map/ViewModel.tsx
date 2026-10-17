import { useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { GetPointsUseCase } from '../../../domain/useCases/points/GetPoints';
import { GetMaterialsUseCase } from '../../../domain/useCases/materials/GetMaterials';
import { RecyclingPoint } from '../../../domain/entities/RecyclingPoint';
import { Material } from '../../../domain/entities/Material';

export const CHAPINERO = {
  latitude: 4.651,
  longitude: -74.0565,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035,
};

export type MapUi = 'loading' | 'ask' | 'map';

const toRad = (value: number) => (value * Math.PI) / 180;

export const distanceKm = (
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

const MapViewModel = () => {
  const [ui, setUi] = useState<MapUi>('loading');
  const [points, setPoints] = useState<RecyclingPoint[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [query, setQuery] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [asking, setAsking] = useState(false);

  const loadPoints = async () => {
    setLoadingPoints(true);
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
    setLoadingPoints(false);
  };

  const readPosition = async () => {
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch {
      setErrorMessage('No se pudo leer la ubicación. Mostramos Chapinero.');
    }
  };

  useEffect(() => {
    const boot = async () => {
      await loadPoints();
      const permission = await Location.getForegroundPermissionsAsync();
      if (permission.status === 'granted') {
        setUi('map');
        await readPosition();
      } else {
        setUi('ask');
      }
    };
    boot();
  }, []);

  const allowLocation = async () => {
    if (asking) return;
    setAsking(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setErrorMessage('Sin permiso de ubicación. Aún puedes ver los puntos en el mapa.');
        setUi('map');
        return;
      }
      setErrorMessage('');
      setUi('map');
      await readPosition();
    } catch {
      setErrorMessage('No se pudo pedir el permiso de ubicación.');
      setUi('map');
    } finally {
      setAsking(false);
    }
  };

  const skipLocation = () => {
    setUi('map');
  };

  const namesFor = (point: RecyclingPoint) => {
    const ids = point.materialIds.length ? point.materialIds : point.materialId ? [point.materialId] : [];
    return ids.map((id) => materials.find((item) => item.id === id)?.name ?? `Material ${id}`);
  };

  const visiblePoints = useMemo((): RecyclingPoint[] => {
    const origin = coords ?? { latitude: CHAPINERO.latitude, longitude: CHAPINERO.longitude };
    const text = query.trim().toLowerCase();
    let list = points.map((point) => ({
      ...point,
      distanceKm: distanceKm(origin, point),
    }));
    if (text) {
      list = list.filter(
        (point) =>
          point.name.toLowerCase().includes(text) || point.address.toLowerCase().includes(text),
      );
    }
    return [...list].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
  }, [points, query, coords]);

  const nearest = visiblePoints[0] ?? null;

  const region = coords
    ? {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      }
    : CHAPINERO;

  return {
    ui,
    asking,
    points: visiblePoints,
    nearest,
    query,
    setQuery,
    coords,
    region,
    errorMessage,
    loadingPoints,
    namesFor,
    allowLocation,
    skipLocation,
    loadPoints,
  };
};

export default MapViewModel;
