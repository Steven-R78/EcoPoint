import React, { useEffect, useState } from 'react';
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
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomTextInput } from '../../components/CustomTextInput';
import { RoundedButton } from '../../components/RoundedButton';
import {
  ChevronIcon,
  EyeIcon,
  LockIcon,
  MailIcon,
  PersonIcon,
  RecycleMark,
} from '../../components/EcoIcons';
import { RootStackParamList } from '../../navigator/types';
import useViewModel, { DOCUMENT_TYPES } from './ViewModel';
import styles from './Styles';

interface Props extends NativeStackScreenProps<RootStackParamList, 'RegisterScreen'> {}

export const RegisterScreen = ({ navigation }: Props) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    documentType,
    documentNumber,
    errorMessage,
    successMessage,
    loading,
    onChange,
    register,
  } = useViewModel();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTypes, setShowTypes] = useState(false);

  useEffect(() => {
    if (successMessage) {
      navigation.navigate('LoginScreen');
    }
  }, [successMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.blob} />
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandRow}>
            <View style={styles.logoWrap}>
              <RecycleMark />
            </View>
            <View style={styles.brandCopy}>
              <Text style={styles.brand}>EcoPoint</Text>
              <Text style={styles.slogan}>Recicla cerca de ti</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
            <Text style={styles.back}>← Volver</Text>
          </TouchableOpacity>

          <Text style={styles.eyebrow}>ÚNETE A ECOPOINT</Text>
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Empieza a reciclar cerca de ti.</Text>

          <View style={styles.card}>
            {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
            <CustomTextInput
              label="Nombre completo"
              placeholder="Ej. María López"
              property="name"
              onChangeText={onChange}
              value={name}
              autoComplete="name"
              autoCapitalize="words"
              editable={!loading}
              leftIcon={<PersonIcon />}
            />
            <CustomTextInput
              label="Correo electrónico"
              placeholder="tu@correo.com"
              keyboardType="email-address"
              property="email"
              onChangeText={onChange}
              value={email}
              autoComplete="email"
              editable={!loading}
              leftIcon={<MailIcon />}
            />

            <View style={styles.selectWrap}>
              <Text style={styles.selectLabel}>Tipo de documento</Text>
              <TouchableOpacity
                style={styles.selectField}
                onPress={() => setShowTypes(true)}
                disabled={loading}
              >
                <Text style={styles.selectText}>{documentType}</Text>
                <ChevronIcon />
              </TouchableOpacity>
            </View>

            <CustomTextInput
              label="Número de documento"
              placeholder="Ej. 1.023.456.789"
              keyboardType="numeric"
              property="documentNumber"
              onChangeText={onChange}
              value={documentNumber}
              editable={!loading}
            />
            <CustomTextInput
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              property="password"
              onChangeText={onChange}
              value={password}
              secureTextEntry={!showPassword}
              autoComplete="password"
              editable={!loading}
              leftIcon={<LockIcon />}
              rightIcon={<EyeIcon hidden={showPassword} />}
              onRightPress={() => setShowPassword((current) => !current)}
            />
            <CustomTextInput
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              property="confirmPassword"
              onChangeText={onChange}
              value={confirmPassword}
              secureTextEntry={!showConfirm}
              editable={!loading}
              leftIcon={<LockIcon />}
              rightIcon={<EyeIcon hidden={showConfirm} />}
              onRightPress={() => setShowConfirm((current) => !current)}
            />
            <RoundedButton text="Registrarme" onPress={register} loading={loading} pill />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity disabled={loading} onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.link}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showTypes} transparent animationType="fade" onRequestClose={() => setShowTypes(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowTypes(false)}>
          <Pressable style={styles.modalCard} onPress={() => undefined}>
            <Text style={styles.modalTitle}>Tipo de documento</Text>
            {DOCUMENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.option}
                onPress={() => {
                  onChange('documentType', type);
                  setShowTypes(false);
                }}
              >
                <Text style={[styles.optionText, type === documentType && styles.optionActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
