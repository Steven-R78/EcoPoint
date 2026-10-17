import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView } from 'expo-camera';
import { MyColors } from '../../theme/AppTheme';
import { CameraTabIcon, LockIcon, RecycleMark } from '../../components/EcoIcons';
import { RoundedButton } from '../../components/RoundedButton';
import useViewModel from './ViewModel';
import styles from './Styles';

interface Props {
  pointId?: number;
  onClose: () => void;
  onAskingChange?: (asking: boolean) => void;
}

const FrameCorners = () => (
  <View style={styles.frame} pointerEvents="none">
    <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 }]} />
    <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 }]} />
    <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 }]} />
    <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 }]} />
  </View>
);

export const CameraScreen = ({ pointId, onClose, onAskingChange }: Props) => {
  const {
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
  } = useViewModel(pointId);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    onAskingChange?.(ui === 'ask' || ui === 'loading');
  }, [ui]);

  const shoot = async () => {
    if (capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) setCaptured(photo.uri);
    } finally {
      setCapturing(false);
    }
  };

  const usePhoto = async () => {
    const result = await confirmPhoto();
    if (!result.ok) return;
    Alert.alert('Aporte listo', 'Tu foto quedó registrada en EcoPoint.', [
      { text: 'OK', onPress: onClose },
    ]);
  };

  if (ui === 'loading') {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator color={MyColors.primary} size="large" />
      </View>
    );
  }

  if (ui === 'ask') {
    return (
      <SafeAreaView style={styles.ask} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.brandRow}>
          <View style={styles.logoWrap}>
            <RecycleMark />
          </View>
          <View style={styles.brandCopy}>
            <Text style={styles.brand}>EcoPoint</Text>
            <Text style={styles.slogan}>Recicla cerca de ti</Text>
          </View>
        </View>

        <View style={styles.heroStage}>
          <View style={styles.heroGlow} />
          <View style={[styles.orbit, { top: 18, right: 28 }]} />
          <View style={[styles.orbit, { width: 8, height: 8, bottom: 32, left: 22, opacity: 0.35 }]} />
          <View style={[styles.orbit, { width: 6, height: 6, top: 48, left: 36, opacity: 0.4 }]} />
          <View style={styles.heroCard}>
            <View style={{ transform: [{ scale: 2.1 }] }}>
              <CameraTabIcon color="#fff" />
            </View>
          </View>
        </View>

        <Text style={styles.askKicker}>CAPTURA TU APORTE</Text>
        <Text style={styles.askTitle}>Permite el acceso a tu cámara</Text>
        <Text style={styles.askText}>
          Toma una foto de tu reciclaje para registrar tu aporte a una ciudad más limpia.
        </Text>

        <View style={styles.privacy}>
          <LockIcon />
          <Text style={styles.privacyText}>
            Tu privacidad es importante. Solo usamos esta foto para registrar tu aporte.
          </Text>
        </View>
        {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}

        <View style={styles.askActions}>
          <RoundedButton text="Permitir" onPress={allowCamera} loading={asking} pill />
          <TouchableOpacity onPress={onClose} disabled={asking}>
            <Text style={styles.later}>Ahora no</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (photoUri) {
    return (
      <View style={styles.flex}>
        <Image source={{ uri: photoUri }} style={styles.previewImg} />
        <SafeAreaView edges={['top']} style={styles.previewTop} pointerEvents="box-none">
          <TouchableOpacity style={styles.roundBtn} onPress={onClose}>
            <Text style={styles.close}>×</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>Vista previa</Text>
          <View style={{ width: 40 }} />
        </SafeAreaView>
        <View style={styles.previewSheet}>
          <View style={styles.okRow}>
            <View style={styles.okIcon}>
              <View style={styles.okCheck} />
            </View>
            <Text style={styles.okTitle}>¡La foto quedó muy bien!</Text>
          </View>
          <Text style={styles.okText}>Confirma para registrar tu aporte.</Text>
          {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
          <RoundedButton text="Usar esta foto" onPress={usePhoto} loading={saving} pill />
          <TouchableOpacity onPress={retake} disabled={saving}>
            <Text style={styles.repeat}>↻  Repetir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        enableTorch={torch}
        flash={torch ? 'on' : 'off'}
      />
      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']} pointerEvents="box-none">
        <View style={styles.topBar} pointerEvents="box-none">
          <TouchableOpacity style={styles.roundBtn} onPress={onClose}>
            <Text style={styles.close}>×</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>Fotografía tu reciclaje</Text>
          <TouchableOpacity style={styles.roundBtn} onPress={toggleTorch}>
            <Text style={torch ? styles.flashOn : styles.flashOff}>⚡</Text>
          </TouchableOpacity>
        </View>

        <FrameCorners />

        <View>
          <Text style={styles.hint}>Ubica los materiales dentro del recuadro</Text>
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.thumb} onPress={pickFromGallery}>
              {galleryUri ? (
                <Image source={{ uri: galleryUri }} style={styles.thumbImg} />
              ) : (
                <CameraTabIcon color="#fff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.shutterOuter} onPress={shoot} disabled={capturing}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundBtn} onPress={toggleFacing}>
              <Text style={styles.flashOff}>↻</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
