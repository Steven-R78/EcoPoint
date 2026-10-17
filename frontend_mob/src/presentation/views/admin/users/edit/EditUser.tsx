import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomTextInput } from '../../../../components/CustomTextInput';
import { RoundedButton } from '../../../../components/RoundedButton';
import { ChevronIcon, PersonIcon } from '../../../../components/EcoIcons';
import { MyColors } from '../../../../theme/AppTheme';
import { RootStackParamList } from '../../../../navigator/types';
import useViewModel from './ViewModel';
import styles from '../../Styles';

interface Props extends NativeStackScreenProps<RootStackParamList, 'AdminEditUserScreen'> {}

type Picker = 'role' | 'status' | null;

const ROLE_OPTIONS = [
  { label: 'Ciudadano', value: 2 },
  { label: 'Administrador', value: 1 },
];

const STATUS_OPTIONS = [
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 0 },
];

export const AdminEditUserScreen = ({ navigation, route }: Props) => {
  const { name, email, roleId, status, user, errorMessage, loading, saving, onChange, save } =
    useViewModel(route.params.userId);
  const [picker, setPicker] = useState<Picker>(null);

  const submit = async () => {
    const result = await save();
    if (result.ok) navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.nav}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.back}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.navTitle}>Editar usuario</Text>
          </View>

          {loading && <ActivityIndicator color={MyColors.primary} />}

          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <PersonIcon color="#149653" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>{user?.name ?? 'Usuario'}</Text>
              <Text style={styles.bannerText}>Completa los datos de acceso y perfil.</Text>
            </View>
          </View>

          {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}

          <CustomTextInput
            label="Nombre completo"
            placeholder="Nombre y apellido"
            property="name"
            value={name}
            onChangeText={onChange}
            autoCapitalize="words"
            editable={!saving}
          />
          <CustomTextInput
            label="Correo electrónico"
            placeholder="usuario@correo.com"
            property="email"
            value={email}
            onChangeText={onChange}
            keyboardType="email-address"
            editable={!saving}
          />

          <View style={styles.selectWrap}>
            <Text style={styles.selectLabel}>Rol</Text>
            <TouchableOpacity style={styles.selectField} onPress={() => setPicker('role')} disabled={saving}>
              <Text style={styles.selectText}>
                {ROLE_OPTIONS.find((item) => item.value === roleId)?.label}
              </Text>
              <ChevronIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.selectWrap}>
            <Text style={styles.selectLabel}>Estado</Text>
            <TouchableOpacity style={styles.selectField} onPress={() => setPicker('status')} disabled={saving}>
              <Text style={styles.selectText}>
                {STATUS_OPTIONS.find((item) => item.value === status)?.label}
              </Text>
              <ChevronIcon />
            </TouchableOpacity>
          </View>

          <RoundedButton text="Guardar cambios" onPress={submit} loading={saving} pill />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={picker !== null} transparent animationType="fade" onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPicker(null)}>
          <Pressable style={styles.modalCard} onPress={() => undefined}>
            <Text style={styles.modalTitle}>{picker === 'role' ? 'Rol' : 'Estado'}</Text>
            {(picker === 'role' ? ROLE_OPTIONS : STATUS_OPTIONS).map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.option}
                onPress={() => {
                  onChange(picker === 'role' ? 'roleId' : 'status', item.value);
                  setPicker(null);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    item.value === (picker === 'role' ? roleId : status) && styles.optionActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
