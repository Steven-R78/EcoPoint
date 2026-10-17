import React, { ReactNode } from 'react';
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MyColors } from '../theme/AppTheme';

interface Props {
  label: string;
  placeholder: string;
  value: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  property: string;
  onChangeText: (property: string, value: string) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  rightLabel?: string;
  onRightPress?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  autoComplete?: 'email' | 'password' | 'name' | 'off';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}

export const CustomTextInput = ({
  label,
  placeholder,
  value,
  keyboardType = 'default',
  secureTextEntry = false,
  property,
  onChangeText,
  leftIcon,
  rightIcon,
  rightLabel,
  onRightPress,
  returnKeyType,
  onSubmitEditing,
  autoComplete,
  autoCapitalize = 'none',
  editable = true,
}: Props) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeft : null,
            rightIcon || rightLabel ? styles.inputWithAction : null,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#C4CBC7"
          keyboardType={keyboardType}
          value={value}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onChangeText={(text) => onChangeText(property, text)}
        />
        {rightIcon || rightLabel ? (
          <TouchableOpacity style={styles.rightAction} onPress={onRightPress}>
            {rightIcon ?? <Text style={styles.rightLabel}>{rightLabel}</Text>}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  field: { position: 'relative', justifyContent: 'center' },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ECEFEF',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: MyColors.secondary,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  inputWithLeft: { paddingLeft: 44 },
  inputWithAction: { paddingRight: 48 },
  leftIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
    height: 52,
    justifyContent: 'center',
  },
  rightAction: {
    position: 'absolute',
    right: 12,
    height: 52,
    justifyContent: 'center',
  },
  rightLabel: { color: MyColors.primaryDark, fontWeight: '700', fontSize: 12 },
});
