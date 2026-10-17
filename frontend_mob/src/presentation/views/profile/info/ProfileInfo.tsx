import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RoundedButton } from '../../../components/RoundedButton';
import {
  ChevronIcon,
  MapTabIcon,
  PersonIcon,
  RecycleMark,
} from '../../../components/EcoIcons';
import { MyColors } from '../../../theme/AppTheme';
import { RootStackParamList } from '../../../navigator/types';
import { useRoleMode } from '../../../hooks/RoleModeContext';
import useViewModel from './ViewModel';
import styles from './Styles';

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

const initials = (name?: string) => {
  const parts = (name ?? 'Eco').trim().split(/\s+/);
  return `${parts[0]?.[0] ?? 'E'}${parts[1]?.[0] ?? ''}`.toUpperCase();
};

export const ProfileInfoScreen = ({ navigation }: Props) => {
  const { user, isAdmin, aportes, puntosVisitados, kilos, removeSession } = useViewModel();
  const { isAdminUser, isAdminMode, setViewMode, refresh } = useRoleMode();

  const logout = () => {
    Alert.alert('Cerrar sesión', '¿Quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          await removeSession();
          await refresh();
          navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.head}>
        <View>
          <Text style={styles.kicker}>Tu cuenta</Text>
          <Text style={styles.title}>Perfil</Text>
        </View>
        <RecycleMark light={false} />
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroBand}>
          <View style={styles.heroGlow} />
        </View>
        <View style={styles.heroBody}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user?.name)}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? 'Usuario'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {isAdmin ? 'Administrador' : 'Ciudadano'}
              {user?.id ? ` · ID ${user.id}` : ''}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{aportes}</Text>
          <Text style={styles.statLabel}>Aportes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{puntosVisitados}</Text>
          <Text style={styles.statLabel}>Puntos visitados</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{kilos}</Text>
          <Text style={styles.statLabel}>kg reciclados</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('PersonalInfoScreen')}
        >
          <View style={styles.rowIcon}>
            <PersonIcon color={MyColors.primaryDark} />
          </View>
          <View style={styles.rowCopy}>
            <Text style={styles.rowTitle}>Información personal</Text>
            <Text style={styles.rowSubtitle}>Nombre, correo y documento</Text>
          </View>
          <ChevronIcon />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            Alert.alert(
              'Ubicación',
              'Permisos y preferencias de GPS se usan en Cerca de mí y en el mapa.',
            )
          }
        >
          <View style={styles.rowIcon}>
            <MapTabIcon color={MyColors.primaryDark} />
          </View>
          <View style={styles.rowCopy}>
            <Text style={styles.rowTitle}>Ubicación</Text>
            <Text style={styles.rowSubtitle}>Permisos y preferencias</Text>
          </View>
          <ChevronIcon />
        </TouchableOpacity>

        {isAdminUser && (
          <TouchableOpacity
            style={styles.row}
            onPress={() => setViewMode(isAdminMode ? 'citizen' : 'admin')}
          >
            <View style={styles.rowIcon}>
              <PersonIcon color={MyColors.primaryDark} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>
                {isAdminMode ? 'Ir a vista ciudadano' : 'Vista de administración'}
              </Text>
              <Text style={styles.rowSubtitle}>
                {isAdminMode ? 'Puntos y mapa como usuario' : 'Usuarios y puntos'}
              </Text>
            </View>
            <ChevronIcon />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.logout}>
        <RoundedButton text="Cerrar sesión" variant="danger" onPress={logout} pill />
      </View>
      <Text style={styles.version}>EcoPoint Móvil · Versión 1.0</Text>
    </ScrollView>
  );
};
