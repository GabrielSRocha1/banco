import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '@/theme';

interface SecurePasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  showStrength?: boolean;
}

export const SecurePasswordInput: React.FC<SecurePasswordInputProps> = ({
  label = 'Senha',
  showStrength = false,
  value,
  onChangeText,
  ...textInputProps
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPasswordStrength = (password: string): {
    strength: 'weak' | 'medium' | 'strong';
    color: string;
    label: string;
  } => {
    if (!password || password.length === 0) {
      return { strength: 'weak', color: colors.textTertiary, label: '' };
    }

    if (password.length < 6) {
      return { strength: 'weak', color: colors.error, label: 'Fraca' };
    }

    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const criteriaCount = [hasNumber, hasLetter, hasSpecial].filter(Boolean).length;

    if (password.length >= 8 && criteriaCount >= 2) {
      return { strength: 'strong', color: colors.success, label: 'Forte' };
    }

    return { strength: 'medium', color: colors.warning, label: 'Média' };
  };

  const strength = showStrength && value ? getPasswordStrength(value as string) : null;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          {...textInputProps}
          style={[styles.input, textInputProps.style]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!isVisible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
          textContentType="password"
          placeholderTextColor={colors.textTertiary}
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setIsVisible(!isVisible)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon
            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {strength && (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthBar}>
            <View
              style={[
                styles.strengthFill,
                {
                  width:
                    strength.strength === 'weak'
                      ? '33%'
                      : strength.strength === 'medium'
                      ? '66%'
                      : '100%',
                  backgroundColor: strength.color,
                },
              ]}
            />
          </View>
          <Text style={[styles.strengthLabel, { color: strength.color }]}>
            {strength.label}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingRight: 48,
    backgroundColor: colors.surface,
    ...typography.body,
    color: colors.text,
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.md,
    top: 16,
  },
  strengthContainer: {
    marginTop: spacing.sm,
  },
  strengthBar: {
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});