import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MyColors } from '../theme/AppTheme';

interface Props {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  pill?: boolean;
}

export const RoundedButton = ({
  text,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  pill = false,
}: Props) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        pill && styles.pill,
        variant === 'danger' && styles.danger,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? MyColors.secondary : '#fff'} />
      ) : (
        <Text style={[styles.text, variant === 'ghost' && styles.ghostText]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: MyColors.primary,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: { borderRadius: 28 },
  danger: { backgroundColor: MyColors.danger },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.65 },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
  ghostText: { color: MyColors.secondary },
});
