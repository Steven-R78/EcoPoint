import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { RoundedButton } from '../../../components/RoundedButton';
import { CheckIcon, MapTabIcon } from '../../../components/EcoIcons';
import { MyColors } from '../../../theme/AppTheme';
import { RootStackParamList } from '../../../navigator/types';
import useViewModel from './ViewModel';
import styles from '../Styles';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  pointId?: number;
  title: string;
  submitLabel: string;
}

export const AdminPointFormScreen = ({ navigation, pointId, title, submitLabel }: Props) => {
  const {
    name,
    address,
    latitude,
    longitude,
    schedule,
    materialIds,
    materials,
    errorMessage,
    loading,
    saving,
    onChange,
    toggleMaterial,
    save,
  } = useViewModel(pointId);

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
            <Text style={styles.navTitle}>{title}</Text>
          </View>

          {loading && <ActivityIndicator color={MyColors.primary} />}

          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <MapTabIcon color="#149653" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>{name || 'Nuevo punto'}</Text>
              <Text style={styles.bannerText}>Completa la ubicación y los materiales.</Text>
            </View>
          </View>

          {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}

          <CustomTextInput
            label="Nombre del punto"
            placeholder="Parque El Virrey"
            property="name"
            value={name}
            onChangeText={onChange}
            autoCapitalize="words"
            editable={!saving}
          />
          <CustomTextInput
            label="Dirección"
            placeholder="Carrera 15 #88-10, Chapinero"
            property="address"
            value={address}
            onChangeText={onChange}
            autoCapitalize="sentences"
            editable={!saving}
          />

          <View style={styles.row2}>
            <View style={[styles.half, { marginRight: 8 }]}>
              <CustomTextInput
                label="Latitud"
                placeholder="4.6692"
                property="latitude"
                value={latitude}
                onChangeText={onChange}
                keyboardType="numbers-and-punctuation"
                editable={!saving}
              />
            </View>
            <View style={styles.half}>
              <CustomTextInput
                label="Longitud"
                placeholder="-74.0570"
                property="longitude"
                value={longitude}
                onChangeText={onChange}
                keyboardType="numbers-and-punctuation"
                editable={!saving}
              />
            </View>
          </View>

          <Text style={styles.selectLabel}>Materiales</Text>
          <View style={styles.materials}>
            {materials.map((material) => {
              const on = materialIds.includes(material.id);
              return (
                <TouchableOpacity
                  key={material.id}
                  style={[styles.material, on && styles.materialOn]}
                  onPress={() => toggleMaterial(material.id)}
                >
                  <View style={[styles.box, on && styles.boxOn]}>
                    {on ? <CheckIcon color="#fff" /> : null}
                  </View>
                  <Text style={styles.materialText} numberOfLines={1}>
                    {material.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <CustomTextInput
            label="Horario"
            placeholder="Lun-Dom · 6 a. m.-8 p. m."
            property="schedule"
            value={schedule}
            onChangeText={onChange}
            autoCapitalize="sentences"
            editable={!saving}
          />

          <RoundedButton text={submitLabel} onPress={submit} loading={saving} pill />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const AdminCreatePointScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) => (
  <AdminPointFormScreen navigation={navigation} title="Nuevo punto" submitLabel="Crear punto" />
);

export const AdminEditPointScreen = ({
  navigation,
  route,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: { params: { pointId: number } };
}) => (
  <AdminPointFormScreen
    navigation={navigation}
    pointId={route.params.pointId}
    title="Editar punto"
    submitLabel="Guardar cambios"
  />
);
