import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { NavigationProp } from '@react-navigation/native';
import { MyColors } from '../../theme/AppTheme';
import { RootStackParamList } from '../../navigator/types';
import { useUserLocal } from '../../hooks/useUserLocal';
import { LockIcon, RecycleMark, SearchIcon, TargetIcon } from '../../components/EcoIcons';
import { RoundedButton } from '../../components/RoundedButton';
import useViewModel, { CHAPINERO } from './ViewModel';
import styles from './Styles';

interface Props {
  navigation: NavigationProp<RootStackParamList>;
  onOpenProfile: () => void;
  onOpenList: () => void;
  onAskingChange?: (asking: boolean) => void;
}

const initials = (name?: string) => {
  const parts = (name ?? 'Eco').trim().split(/\s+/);
  return `${parts[0]?.[0] ?? 'E'}${parts[1]?.[0] ?? ''}`.toUpperCase();
};

const formatDistance = (km?: number | null) => {
  if (km == null) return '';
  if (km < 0.1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace('.', ',')} km`;
};

const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#e8f5ee' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#e8f5ee' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#d7ebe0' }] },
  { featureType: 'water', stylers: [{ color: '#c5e8d4' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#cfe6d8' }] },
];

export const MapScreen = ({ navigation, onOpenProfile, onOpenList, onAskingChange }: Props) => {
  const {
    ui,
    asking,
    points,
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
  } = useViewModel();
  const { user } = useUserLocal();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    onAskingChange?.(ui === 'ask');
  }, [ui]);

  useEffect(() => {
    if (ui !== 'map') return;
    const coordinates = [
      ...(coords ? [coords] : []),
      ...points.slice(0, 8).map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      })),
    ];
    if (coordinates.length === 0) {
      mapRef.current?.animateToRegion(region as Region, 400);
      return;
    }
    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 160, right: 48, bottom: 210, left: 48 },
        animated: true,
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [ui, points.length, coords?.latitude, coords?.longitude]);

  if (ui === 'loading') {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator color={MyColors.primary} size="large" />
      </View>
    );
  }

  if (ui === 'ask') {
    return (
      <View style={styles.ask}>
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
            <View style={styles.heroInner}>
              <View style={styles.heroMid}>
                <View style={styles.heroDot} />
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.askKicker}>ENCUENTRA TU PUNTO</Text>
        <Text style={styles.askTitle}>Activa tu ubicación</Text>
        <Text style={styles.askText}>
          Te mostraremos los puntos de reciclaje más cercanos en Chapinero.
        </Text>

        <View style={styles.privacy}>
          <LockIcon />
          <Text style={styles.privacyText}>
            Tu privacidad es importante. Solo usamos tu ubicación para calcular distancias.
          </Text>
        </View>

        <View style={styles.askActions}>
          <RoundedButton text="Permitir" onPress={allowLocation} loading={asking} pill />
          <TouchableOpacity onPress={skipLocation} disabled={asking}>
            <Text style={styles.later}>Ahora no</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.loadingBox}>
        <Text style={styles.empty}>El mapa está disponible en iOS y Android.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={CHAPINERO}
        customMapStyle={MAP_STYLE}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {points.map((point) => (
          <Marker
            key={point.id}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            onPress={() =>
              navigation.navigate('PointDetailScreen', {
                pointId: point.id,
                distanceKm: point.distanceKm,
              })
            }
          >
            <View style={styles.pin}>
              <RecycleMark />
            </View>
          </Marker>
        ))}
        {coords ? (
          <Marker coordinate={coords} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.youWrap}>
              <View style={styles.youDot} />
              <Text style={styles.youLabel}>Tú estás aquí</Text>
            </View>
          </Marker>
        ) : null}
      </MapView>

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.head}>
          <View>
            <Text style={styles.kicker}>Explora Chapinero</Text>
            <Text style={styles.title}>Mapa de puntos</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={onOpenProfile}>
            <Text style={styles.avatarText}>{initials(user?.name)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.search}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en esta zona"
            placeholderTextColor="#C4CBC7"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
      </View>

      <TouchableOpacity
        style={styles.locate}
        onPress={() => mapRef.current?.animateToRegion(region as Region, 400)}
      >
        <TargetIcon color={MyColors.primary} />
      </TouchableOpacity>

      <View style={styles.sheet}>
        <View style={styles.sheetTop}>
          <View>
            <Text style={styles.sheetTitle}>Cerca de ti</Text>
            <Text style={styles.sheetCount}>
              {loadingPoints
                ? 'Cargando puntos...'
                : `${points.length} ${points.length === 1 ? 'punto encontrado' : 'puntos encontrados'}`}
            </Text>
          </View>
          <TouchableOpacity onPress={onOpenList}>
            <Text style={styles.sheetLink}>Ver lista</Text>
          </TouchableOpacity>
        </View>
        {nearest ? (
          <TouchableOpacity
            style={styles.nearCard}
            onPress={() =>
              navigation.navigate('PointDetailScreen', {
                pointId: nearest.id,
                distanceKm: nearest.distanceKm,
              })
            }
          >
            <View style={styles.nearPhoto}>
              {nearest.photoUrl ? (
                <Image source={{ uri: nearest.photoUrl }} style={styles.nearPhotoImg} />
              ) : (
                <RecycleMark light={false} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nearTitle}>{nearest.name}</Text>
              <View style={styles.nearTags}>
                {namesFor(nearest).map((tag) => (
                  <Text key={tag} style={styles.nearTag}>
                    {tag}
                  </Text>
                ))}
              </View>
            </View>
            <Text style={styles.nearDistance}>{formatDistance(nearest.distanceKm)}</Text>
          </TouchableOpacity>
        ) : (
          !loadingPoints && <Text style={styles.empty}>No hay puntos para mostrar en el mapa.</Text>
        )}
      </View>
    </View>
  );
};
