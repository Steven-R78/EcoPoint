import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MyColors } from '../../../theme/AppTheme';
import { RootStackParamList } from '../../../navigator/types';
import { CameraTabIcon, MapTabIcon, PencilIcon, RecycleMark, TrashIcon } from '../../../components/EcoIcons';
import { ConfirmSheet } from '../../../components/ConfirmSheet';
import { useRoleMode } from '../../../hooks/RoleModeContext';
import { DeletePointUseCase } from '../../../../domain/useCases/points/DeletePoint';
import useViewModel from './ViewModel';
import styles from './Styles';

interface Props extends NativeStackScreenProps<RootStackParamList, 'PointDetailScreen'> {}

const formatDistance = (km?: number | null) => {
  if (km == null) return null;
  if (km < 0.1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace('.', ',')} km`;
};

export const PointDetailScreen = ({ navigation, route }: Props) => {
  const { point, loading, errorMessage, materialNames } = useViewModel(route.params.pointId);
  const { isAdminMode } = useRoleMode();
  const [photoError, setPhotoError] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const tags = materialNames();
  const distance = formatDistance(route.params.distanceKm);
  const hasPhoto = Boolean(point?.photoUrl) && !photoError;

  const openMaps = () => {
    if (!point) return;
    const { latitude, longitude, name } = point;
    const label = encodeURIComponent(name);
    const url =
      Platform.OS === 'ios'
        ? `maps:0,0?q=${label}@${latitude},${longitude}`
        : `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoWrap}>
        {hasPhoto ? (
          <Image
            source={{ uri: point?.photoUrl ?? undefined }}
            style={styles.photo}
            onError={() => setPhotoError(true)}
          />
        ) : (
          <View style={styles.photoFallback}>
            <RecycleMark />
          </View>
        )}
        <SafeAreaView edges={['top']} style={{ position: 'absolute', left: 0, right: 0 }}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.counter}>
          <Text style={styles.counterText}>{hasPhoto ? '1/1' : '0/0'}</Text>
        </View>
      </View>

      <ScrollView style={styles.sheet} showsVerticalScrollIndicator={false}>
        {loading && <ActivityIndicator style={styles.loader} color={MyColors.primary} />}
        {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
        {point && (
          <>
            <View style={styles.topRow}>
              <Text style={styles.kicker}>PUNTO ECOLÓGICO</Text>
              {distance ? (
                <View style={styles.distance}>
                  <Text style={styles.distanceText}>{distance}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.title}>{point.name}</Text>
            <View style={styles.addressRow}>
              <MapTabIcon color="#9CA3AF" />
              <Text style={styles.address}>{point.address || 'Sin dirección'}</Text>
            </View>

            <View style={styles.chips}>
              <View style={styles.chip}>
                <Text style={styles.chipLabel}>Coordenadas</Text>
                <Text style={styles.chipValue}>
                  {Number(point.latitude).toFixed(4)}, {Number(point.longitude).toFixed(4)}
                </Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipLabel}>Horario</Text>
                <Text style={styles.chipValue}>{point.schedule || 'Sin horario'}</Text>
              </View>
            </View>

            <Text style={styles.section}>Materiales que recibe</Text>
            <View style={styles.tags}>
              {tags.length === 0 ? (
                <Text style={styles.about}>Aún no hay materiales asociados.</Text>
              ) : (
                tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))
              )}
            </View>

            <Text style={styles.section}>Sobre este punto</Text>
            <Text style={styles.about}>
              Estación de reciclaje. Deposita los materiales limpios y secos según las etiquetas
              indicadas.
            </Text>

            <View style={styles.actions}>
              {isAdminMode ? (
                <>
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.navigate('AdminEditPointScreen', { pointId: point.id })}
                  >
                    <PencilIcon />
                    <Text style={styles.primaryText}>  Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => setShowDelete(true)}>
                    <TrashIcon color="#fff" />
                    <Text style={styles.deleteText}>  Eliminar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.primaryBtn} onPress={openMaps}>
                    <Text style={styles.primaryText}>Cómo llegar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() =>
                      navigation.navigate('CameraCaptureScreen', { pointId: point.id })
                    }
                  >
                    <CameraTabIcon color="#111827" />
                    <Text style={styles.secondaryText}>Tomar foto</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
      <ConfirmSheet
        visible={showDelete}
        title="¿Eliminar este punto?"
        message={`${point?.name ?? 'El punto'} se eliminará de forma permanente. Esta acción no se puede deshacer.`}
        onCancel={() => setShowDelete(false)}
        onConfirm={async () => {
          if (!point || deleting) return;
          setDeleting(true);
          const response = await DeletePointUseCase(point.id);
          setDeleting(false);
          setShowDelete(false);
          if (response.success) navigation.goBack();
        }}
        loading={deleting}
      />
    </View>
  );
};
