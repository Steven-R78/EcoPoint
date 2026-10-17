import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TrashIcon } from './EcoIcons';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmSheet = ({
  visible,
  title,
  message,
  confirmText = 'Sí, eliminar',
  onConfirm,
  onCancel,
  loading = false,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <View style={styles.iconWrap}>
            <TrashIcon color="#E74C3C" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            style={styles.confirm}
            onPress={onConfirm}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmText}>{confirmText}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} disabled={loading}>
            <Text style={styles.cancel}>Cancelar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
  },
  confirm: {
    marginTop: 22,
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F07167',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cancel: { marginTop: 16, color: '#6B7280', fontWeight: '700', fontSize: 15 },
});
