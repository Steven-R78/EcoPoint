import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoundedButton } from '../../components/RoundedButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { EyeIcon, LockIcon, MailIcon, RecycleMark } from '../../components/EcoIcons';
import { MyColors } from '../../theme/AppTheme';
import { RootStackParamList } from '../../navigator/types';
import { useRoleMode } from '../../hooks/RoleModeContext';
import useViewModel from './ViewModel';
import styles from './Styles';

interface Props extends NativeStackScreenProps<RootStackParamList, 'HomeScreen'> {}

export const HomeScreen = ({ navigation }: Props) => {
  const { email, password, errorMessage, user, loading, restoring, onChange, login } =
    useViewModel();
  const { refresh } = useRoleMode();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user?.session_token) {
      refresh().then(() => navigation.replace('CitizenScreen'));
    }
  }, [user]);

  if (restoring) {
    return (
      <SafeAreaView style={[styles.container, styles.restoring]}>
        <ActivityIndicator size="large" color={MyColors.primary} />
      </SafeAreaView>
    );
  }

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

          <Text style={styles.eyebrow}>BIENVENIDA DE NUEVO</Text>
          <Text style={styles.title}>Tu ciudad más limpia empieza aquí.</Text>
          <Text style={styles.subtitle}>
            Encuentra puntos de reciclaje y transforma tus hábitos.
          </Text>

          <View style={styles.card}>
            {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
            <CustomTextInput
              label="Correo electrónico"
              placeholder="tu@correo.com"
              keyboardType="email-address"
              property="email"
              onChangeText={onChange}
              value={email}
              autoComplete="email"
              returnKeyType="next"
              editable={!loading}
              leftIcon={<MailIcon />}
            />
            <CustomTextInput
              label="Contraseña"
              placeholder="Tu contraseña"
              property="password"
              onChangeText={onChange}
              value={password}
              secureTextEntry={!showPassword}
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={login}
              editable={!loading}
              leftIcon={<LockIcon />}
              rightIcon={<EyeIcon hidden={showPassword} />}
              onRightPress={() => setShowPassword((current) => !current)}
            />
            <TouchableOpacity
              style={styles.forgot}
              onPress={() =>
                Alert.alert(
                  'Recuperar contraseña',
                  'En esta versión restablécela con el administrador del punto.',
                )
              }
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <RoundedButton text="Iniciar sesión" onPress={login} loading={loading} pill />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Aún no tienes cuenta?</Text>
            <TouchableOpacity disabled={loading} onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={styles.link}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
