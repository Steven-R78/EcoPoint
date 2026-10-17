import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MyColors } from '../../../theme/AppTheme';
import { RootStackParamList } from '../../../navigator/types';
import { GetUserLocalUseCase } from '../../../../domain/useCases/userLocal/GetUserLocal';
import { User } from '../../../../domain/entities/User';

interface Props extends NativeStackScreenProps<RootStackParamList, 'PersonalInfoScreen'> {}

export const PersonalInfoScreen = ({ navigation }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    GetUserLocalUseCase().then(setUser);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.kicker}>TU CUENTA</Text>
      <Text style={styles.title}>Información personal</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{user?.name ?? '—'}</Text>
        <Text style={styles.label}>Correo</Text>
        <Text style={styles.value}>{user?.email ?? '—'}</Text>
        <Text style={styles.label}>Documento</Text>
        <Text style={styles.value}>
          {user?.documentType
            ? `${user.documentType} ${user.documentNumber ?? ''}`.trim()
            : 'Sin documento'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MyColors.background, paddingHorizontal: 22, paddingTop: 8 },
  back: { color: '#6B7280', fontWeight: '600', marginBottom: 16 },
  kicker: { color: '#9CA3AF', fontWeight: '700', letterSpacing: 1, fontSize: 11 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginTop: 6, marginBottom: 18 },
  card: { backgroundColor: '#fff', borderRadius: 22, padding: 20 },
  label: { color: '#9CA3AF', fontSize: 12, marginTop: 12, fontWeight: '600' },
  value: { color: '#111827', fontSize: 16, fontWeight: '700', marginTop: 4 },
});
