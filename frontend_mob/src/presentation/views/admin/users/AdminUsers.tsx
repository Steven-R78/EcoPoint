import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyColors } from '../../../theme/AppTheme';
import { RootStackParamList } from '../../../navigator/types';
import { ChevronIcon, PlusIcon, SearchIcon } from '../../../components/EcoIcons';
import useViewModel from './ViewModel';
import styles from '../Styles';

interface Props {
  navigation: NavigationProp<RootStackParamList>;
  embedded?: boolean;
}

const initials = (name?: string) => {
  const parts = (name ?? 'U').trim().split(/\s+/);
  return `${parts[0]?.[0] ?? 'U'}${parts[1]?.[0] ?? ''}`.toUpperCase();
};

const roleLabel = (roleId?: number) => (roleId === 1 ? 'Autor' : 'Ciudadano');

export const AdminUsersScreen = ({ navigation, embedded = false }: Props) => {
  const { users, query, setQuery, loading, errorMessage, load, total, ciudadanos, admins } =
    useViewModel();

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  const openCreate = () => navigation.navigate('AdminCreateUserScreen');
  const Shell = embedded ? View : SafeAreaView;

  return (
    <Shell style={[styles.container, embedded && { paddingTop: 0 }]}>
      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={styles.kicker}>Administración</Text>
                <Text style={styles.title}>Usuarios</Text>
              </View>
              <TouchableOpacity style={styles.plusBtn} onPress={openCreate}>
                <PlusIcon />
              </TouchableOpacity>
            </View>

            <View style={styles.search}>
              <SearchIcon />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre o correo"
                placeholderTextColor="#C4CBC7"
                value={query}
                onChangeText={setQuery}
              />
            </View>

            <View style={styles.stats}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{total}</Text>
                <Text style={styles.statLabel}>Usuarios</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{ciudadanos}</Text>
                <Text style={styles.statLabel}>Ciudadanos</Text>
              </View>
              <View style={[styles.statCard, { marginRight: 0 }]}>
                <Text style={styles.statValue}>{admins}</Text>
                <Text style={styles.statLabel}>Admin</Text>
              </View>
            </View>

            <View style={styles.sectionRow}>
              <View>
                <Text style={styles.section}>Todos los usuarios</Text>
                <Text style={styles.sectionHint}>Ordenados por nombre</Text>
              </View>
              <TouchableOpacity onPress={openCreate}>
                <Text style={styles.newLink}>+ Nuevo usuario</Text>
              </TouchableOpacity>
            </View>
            {loading && <ActivityIndicator color={MyColors.primary} />}
            {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
          </View>
        }
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay usuarios.</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('UserDetailScreen', { userId: item.id ?? 0 })}
          >
            <View
              style={[
                styles.avatar,
                { backgroundColor: item.roleId === 1 ? '#1F2937' : MyColors.primary },
              ]}
            >
              <Text style={styles.avatarText}>{initials(item.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.email}</Text>
              <Text style={styles.role}>{roleLabel(item.roleId)}</Text>
            </View>
            <Text style={styles.idLabel}>ID {item.id}</Text>
            <ChevronIcon />
          </TouchableOpacity>
        )}
      />
    </Shell>
  );
};
