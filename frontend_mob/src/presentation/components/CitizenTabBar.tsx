import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MyColors } from '../theme/AppTheme';
import { CameraTabIcon, ListTabIcon, MapTabIcon, PersonIcon } from './EcoIcons';
import { CitizenTab } from '../navigator/types';

interface Props {
  tab: CitizenTab;
  onChange: (tab: CitizenTab) => void;
  isAdminMode: boolean;
}

const Icon = ({ tab, color }: { tab: CitizenTab; color: string }) => {
  if (tab === 'points') return <ListTabIcon color={color} />;
  if (tab === 'map') return <MapTabIcon color={color} />;
  if (tab === 'users') return <PersonIcon color={color} />;
  if (tab === 'camera') return <CameraTabIcon color={color} />;
  return <PersonIcon color={color} />;
};

export const CitizenTabBar = ({ tab, onChange, isAdminMode }: Props) => {
  const items: { key: CitizenTab; label: string }[] = isAdminMode
    ? [
        { key: 'points', label: 'Puntos' },
        { key: 'users', label: 'Usuarios' },
        { key: 'camera', label: 'Cámara' },
        { key: 'profile', label: 'Perfil' },
      ]
    : [
        { key: 'points', label: 'Puntos' },
        { key: 'map', label: 'Mapa' },
        { key: 'camera', label: 'Cámara' },
        { key: 'profile', label: 'Perfil' },
      ];

  return (
    <View style={styles.bar}>
      {items.map((item) => {
        const active = item.key === tab;
        const color = active ? MyColors.primary : '#9CA3AF';
        return (
          <TouchableOpacity key={item.key} style={styles.item} onPress={() => onChange(item.key)}>
            <Icon tab={item.key} color={color} />
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 6,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 52 },
  label: { fontSize: 11, fontWeight: '600', marginTop: 4 },
});
