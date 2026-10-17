import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { MyColors } from '../../theme/AppTheme';
import { RootStackParamList } from '../../navigator/types';
import { useUserLocal } from '../../hooks/useUserLocal';
import { useRoleMode } from '../../hooks/RoleModeContext';
import {
  ChevronIcon,
  FilterIcon,
  LeafIcon,
  RecycleMark,
  SearchIcon,
  TargetIcon,
} from '../../components/EcoIcons';
import useViewModel from './ViewModel';
import styles from './Styles';

const MARK_COLORS = ['#E8F8EE', '#FFF6E5', '#F3F4F6'];
const GREEN_TIP = 'Reciclar una botella de plástico puede encender un bombillo por 3 horas.';

interface Props {
  navigation: NavigationProp<RootStackParamList>;
  onOpenProfile: () => void;
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

export const PointsScreen = ({ navigation, onOpenProfile }: Props) => {
  const {
    points,
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
  } = useViewModel();
  const { user } = useUserLocal();
  const { isAdminMode } = useRoleMode();
  const [showFilters, setShowFilters] = useState(false);

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );
  const firstName = user?.name?.split(' ')[0] ?? 'Eco';
  const chips = materials.slice(0, 2);

  return (
    <View style={styles.container}>
      <FlatList
        data={points}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.head}>
              <View>
                <Text style={styles.hello}>Hola, {firstName}</Text>
                <Text style={styles.title}>¿Qué vas a reciclar hoy?</Text>
              </View>
              <TouchableOpacity style={styles.avatar} onPress={onOpenProfile}>
                <Text style={styles.avatarText}>{initials(user?.name)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.search}>
              <SearchIcon />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar punto o barrio"
                placeholderTextColor="#C4CBC7"
                value={query}
                onChangeText={setQuery}
              />
              <TouchableOpacity onPress={requestNear}>
                <TargetIcon />
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={chips}
              keyExtractor={(item) => String(item.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
              ListHeaderComponent={
                <TouchableOpacity
                  style={[styles.chip, filter === 'near' && styles.chipActive]}
                  onPress={requestNear}
                >
                  <Text style={[styles.chipText, filter === 'near' && styles.chipTextActive]}>
                    Cerca de mí
                  </Text>
                </TouchableOpacity>
              }
              ListFooterComponent={
                <TouchableOpacity style={styles.chipIcon} onPress={() => setShowFilters(true)}>
                  <FilterIcon />
                </TouchableOpacity>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.chip, filter === item.id && styles.chipActive]}
                  onPress={() => setFilter(item.id)}
                >
                  <Text style={[styles.chipText, filter === item.id && styles.chipTextActive]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.sectionRow}>
              <View>
                <Text style={styles.section}>Puntos cercanos</Text>
                <Text style={styles.count}>
                  {points.length} {points.length === 1 ? 'lugar disponible' : 'lugares disponibles'}
                </Text>
              </View>
              {isAdminMode ? (
                <TouchableOpacity onPress={() => navigation.navigate('AdminCreatePointScreen')}>
                  <Text style={styles.newLink}>+ Nuevo punto</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {loading && <ActivityIndicator color={MyColors.primary} />}
            {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
          </View>
        }
        ListEmptyComponent={!loading ? <Text style={styles.empty}>Aún no hay puntos registrados.</Text> : null}
        ListFooterComponent={
          <View style={styles.tip}>
            <View style={styles.tipIcon}>
              <LeafIcon />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>Dato verde</Text>
              <Text style={styles.tipText}>{GREEN_TIP}</Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const tags = namesFor(item);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('PointDetailScreen', {
                  pointId: item.id,
                  distanceKm: item.distanceKm,
                })
              }
            >
              <View style={[styles.mark, { backgroundColor: MARK_COLORS[index % MARK_COLORS.length] }]}>
                <RecycleMark light={false} />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.distance}>{formatDistance(item.distanceKm)}</Text>
                </View>
                <Text style={styles.cardMeta}>{item.address || 'Sin dirección'}</Text>
                {tags.length > 0 && (
                  <View style={styles.tags}>
                    {tags.map((tag) => (
                      <Text key={tag} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
              <ChevronIcon />
            </TouchableOpacity>
          );
        }}
      />

      <Modal visible={showFilters} transparent animationType="fade" onRequestClose={() => setShowFilters(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowFilters(false)}>
          <Pressable style={styles.modalCard} onPress={() => undefined}>
            <Text style={styles.modalTitle}>Filtrar por material</Text>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setFilter(null);
                setShowFilters(false);
              }}
            >
              <Text style={styles.optionText}>Todos</Text>
            </TouchableOpacity>
            {materials.map((material) => (
              <TouchableOpacity
                key={material.id}
                style={styles.option}
                onPress={() => {
                  setFilter(material.id);
                  setShowFilters(false);
                }}
              >
                <Text style={[styles.optionText, filter === material.id && styles.optionActive]}>
                  {material.name}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
