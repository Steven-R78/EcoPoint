import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { MyColors } from '../../../../theme/AppTheme';
import { RootStackParamList } from '../../../../navigator/types';
import { ClockIcon, LeafIcon, MailIcon, PencilIcon, PersonIcon, TrashIcon } from '../../../../components/EcoIcons';
import { ConfirmSheet } from '../../../../components/ConfirmSheet';
import { GetUserByIdUseCase } from '../../../../../domain/useCases/users/GetUserById';
import { GetRecordsByUserUseCase } from '../../../../../domain/useCases/records/GetRecordsByUser';
import { DeleteUserUseCase } from '../../../../../domain/useCases/users/DeleteUser';
import { useUserLocal } from '../../../../hooks/useUserLocal';
import { User } from '../../../../../domain/entities/User';
import styles from '../../Styles';

interface Props extends NativeStackScreenProps<RootStackParamList, 'UserDetailScreen'> {}

const initials = (name?: string) => {
  const parts = (name ?? 'U').trim().split(/\s+/);
  return `${parts[0]?.[0] ?? 'U'}${parts[1]?.[0] ?? ''}`.toUpperCase();
};

export const UserDetailScreen = ({ navigation, route }: Props) => {
  const { user: session } = useUserLocal();
  const [user, setUser] = useState<User | null>(null);
  const [aportes, setAportes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const load = async () => {
    setLoading(true);
    const found = await GetUserByIdUseCase(route.params.userId);
    setUser(found);
    if (found?.id) {
      const records = await GetRecordsByUserUseCase(found.id);
      setAportes(records.length);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [route.params.userId]),
  );

  const firstName = user?.name?.split(' ')[0] ?? 'este usuario';

  const remove = async () => {
    if (!user?.id || deleting) return;
    if (user.id === session?.id) {
      setShowDelete(false);
      setErrorMessage('No puedes eliminar tu propia cuenta.');
      return;
    }
    setDeleting(true);
    const response = await DeleteUserUseCase(user.id);
    setDeleting(false);
    setShowDelete(false);
    if (!response.success) {
      setErrorMessage(response.message);
      return;
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Detalle de usuario</Text>
        </View>

        {loading && <ActivityIndicator color={MyColors.primary} />}
        {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}

        {user && (
          <>
            <View style={styles.heroAvatar}>
              <Text style={[styles.avatarText, { fontSize: 28 }]}>{initials(user.name)}</Text>
            </View>
            <Text style={styles.heroName}>{user.name}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{user.roleId === 1 ? 'Administrador' : 'Ciudadano'}</Text>
              </View>
              <Text style={styles.meta}>ID {user.id}</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <MailIcon />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Correo electrónico</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <PersonIcon color="#149653" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Rol</Text>
                  <Text style={styles.infoValue}>{user.roleId === 1 ? 'Administrador' : 'Ciudadano'}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <ClockIcon color="#149653" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Estado</Text>
                  <Text style={styles.infoValue}>{user.status === 0 ? 'Inactivo' : 'Activo'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.impact}>
              <View style={styles.impactIcon}>
                <LeafIcon />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.impactTitle}>Impacto de {firstName}</Text>
                <Text style={styles.impactText}>
                  se registraron {aportes} {aportes === 1 ? 'aporte' : 'aportes'} de reciclaje
                </Text>
              </View>
              <Text style={styles.impactValue}>{aportes}</Text>
            </View>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate('AdminEditUserScreen', { userId: user.id ?? 0 })}
            >
              <PencilIcon />
              <Text style={styles.editText}>Editar usuario</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => setShowDelete(true)}>
              <TrashIcon />
              <Text style={styles.deleteText}>Eliminar usuario</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <ConfirmSheet
        visible={showDelete}
        title={`¿Eliminar a ${user?.name ?? 'este usuario'}?`}
        message="Se eliminará su cuenta y el acceso a EcoPoint. Esta acción no se puede deshacer."
        onCancel={() => setShowDelete(false)}
        onConfirm={remove}
        loading={deleting}
      />
    </SafeAreaView>
  );
};
