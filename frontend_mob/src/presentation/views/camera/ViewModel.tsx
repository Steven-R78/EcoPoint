import { useEffect, useState } from 'react';
import { CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { GetUserLocalUseCase } from '../../../domain/useCases/userLocal/GetUserLocal';
import { GetPointsUseCase } from '../../../domain/useCases/points/GetPoints';
import { CreateRecordUseCase } from '../../../domain/useCases/records/CreateRecord';

export type CameraUi = 'loading' | 'ask' | 'camera';

const CameraViewModel = (pointId?: number) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [ui, setUi] = useState<CameraUi>('loading');
  const [asking, setAsking] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [torch, setTorch] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [galleryUri, setGalleryUri] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!permission) {
      setUi('loading');
      return;
    }
    setUi(permission.granted ? 'camera' : 'ask');
  }, [permission]);

  const allowCamera = async () => {
    if (asking) return;
    setAsking(true);
    const result = await requestPermission();
    setAsking(false);
    if (result.granted) {
      setErrorMessage('');
      setUi('camera');
    } else {
      setErrorMessage('Sin permiso de cámara no se puede registrar el aporte.');
    }
  };

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
    setTorch(false);
  };

  const toggleTorch = () => setTorch((current) => !current);

  const setCaptured = (uri: string) => {
    setPhotoUri(uri);
    setGalleryUri(uri);
    setErrorMessage('');
  };

  const retake = () => setPhotoUri(null);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setCaptured(result.assets[0].uri);
    }
  };

  const confirmPhoto = async () => {
    if (!photoUri || saving) return { ok: false };
    setSaving(true);
    const user = await GetUserLocalUseCase();
    let targetPointId = pointId ?? 0;
    if (!targetPointId) {
      const pointsRes = await GetPointsUseCase();
      targetPointId = pointsRes.data?.[0]?.id ?? 0;
    }
    if (!user?.id || !targetPointId) {
      setSaving(false);
      return { ok: true, skipped: true };
    }
    const photoUrl = photoUri.length <= 500 ? photoUri : `captura-${Date.now()}`;
    const response = await CreateRecordUseCase({
      userId: user.id,
      pointId: targetPointId,
      photoUrl,
    });
    setSaving(false);
    if (!response.success) {
      setErrorMessage(response.message);
      return { ok: false };
    }
    return { ok: true };
  };

  return {
    ui,
    asking,
    facing,
    torch,
    photoUri,
    galleryUri,
    capturing,
    saving,
    errorMessage,
    setCapturing,
    setCaptured,
    allowCamera,
    toggleFacing,
    toggleTorch,
    retake,
    pickFromGallery,
    confirmPhoto,
  };
};

export default CameraViewModel;
