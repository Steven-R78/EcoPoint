import React, { useState } from 'react';
import {
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
import { ChevronIcon, EyeIcon, PersonIcon } from '../../../../components/EcoIcons';
import { RootStackParamList } from '../../../../navigator/types';
import useViewModel, { DOCUMENT_TYPES } from './ViewModel';
import styles from '../../Styles';

interface Props extends NativeStackScreenProps<RootStackParamList, 'AdminCreateUserScreen'> {}

type Picker = 'document' | 'role' | 'status' | null;

const ROLE_OPTIONS = [
  { label: 'Ciudadano', value: 2 },
  { label: 'Administrador', value: 1 },
];

const STATUS_OPTIONS = [
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 0 },
];

export const AdminCreateUserScreen = ({ navigation }: Props) => {
  const {
    name,
    email,
    documentType,
    documentNumber,
    password,
    roleId,
    status,
    errorMessage,
    loading,
    onChange,
    create,
  } = useViewModel();
  const [showPassword, setShowPassword] = useState(false);
  const [picker, setPicker] = useState<Picker>(null);

  const submit = async () => {
    const result = await create();
    if (result.ok) navigation.goBack();
  };

  const pickerTitle =
    picker === 'document' ? 'Tipo de documento' : picker === 'role' ? 'Rol' : 'Estado';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.nav}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.back}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.navTitle}>Nuevo usuario</Text>
          </View>

          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <PersonIcon color="#149653" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Datos del usuario</Text>
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
            editable={!loading}
          />
          <CustomTextInput
            label="Correo electrónico"
            placeholder="usuario@correo.com"
            property="email"
            value={email}
            onChangeText={onChange}
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading}
          />

          <View style={styles.selectWrap}>
            <Text style={styles.selectLabel}>Tipo de documento</Text>
            <TouchableOpacity style={styles.selectField} onPress={() => setPicker('document')} disabled={loading}>
              <Text style={styles.selectText}>{documentType}</Text>
              <ChevronIcon />
            </TouchableOpacity>
          </View>

          <CustomTextInput
            label="Número de documento"
            placeholder="Ej. 1.023.456.789"
            property="documentNumber"
            value={documentNumber}
            onChangeText={onChange}
            keyboardType="numeric"
            editable={!loading}
          />
          <CustomTextInput
            label="Contraseña"
            placeholder="Mínimo 8 caracteres"
            property="password"
            value={password}
            onChangeText={onChange}
            secureTextEntry={!showPassword}
            editable={!loading}
            rightIcon={<EyeIcon hidden={showPassword} />}
            onRightPress={() => setShowPassword((current) => !current)}
          />

          <View style={styles.selectWrap}>
            <Text style={styles.selectLabel}>Rol</Text>
            <TouchableOpacity style={styles.selectField} onPress={() => setPicker('role')} disabled={loading}>
              <Text style={styles.selectText}>
                {ROLE_OPTIONS.find((item) => item.value === roleId)?.label}
              </Text>
              <ChevronIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.selectWrap}>
            <Text style={styles.selectLabel}>Estado</Text>
            <TouchableOpacity style={styles.selectField} onPress={() => setPicker('status')} disabled={loading}>
              <Text style={styles.selectText}>
                {STATUS_OPTIONS.find((item) => item.value === status)?.label}
              </Text>
              <ChevronIcon />
            </TouchableOpacity>
          </View>

          <RoundedButton text="Crear usuario" onPress={submit} loading={loading} pill />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={picker !== null} transparent animationType="fade" onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPicker(null)}>
          <Pressable style={styles.modalCard} onPress={() => undefined}>
            <Text style={styles.modalTitle}>{pickerTitle}</Text>
            {picker === 'document' &&
              DOCUMENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.option}
                  onPress={() => {
                    onChange('documentType', type);
                    setPicker(null);
                  }}
                >
                  <Text style={[styles.optionText, type === documentType && styles.optionActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            {picker === 'role' &&
              ROLE_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.option}
                  onPress={() => {
                    onChange('roleId', item.value);
                    setPicker(null);
                  }}
                >
                  <Text style={[styles.optionText, item.value === roleId && styles.optionActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            {picker === 'status' &&
              STATUS_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.option}
                  onPress={() => {
                    onChange('status', item.value);
                    setPicker(null);
                  }}
                >
                  <Text style={[styles.optionText, item.value === status && styles.optionActive]}>
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
