import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  isLoading = false,
  variant = 'primary',
  disabled,
  style,
  ...touchableProps
}) => {
  const isDisabled = disabled || isLoading;

  const getButtonStyle = () => {
    if (isDisabled) {
      return styles.buttonDisabled;
    }

    switch (variant) {
      case 'secondary':
        return styles.buttonSecondary;
      case 'outline':
        return styles.buttonOutline;
      default:
        return styles.buttonPrimary;
    }
  };

  const getTextStyle = () => {
    if (isDisabled) {
      return styles.textDisabled;
    }

    switch (variant) {
      case 'outline':
        return styles.textOutline;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      {...touchableProps}
      style={[styles.button, getButtonStyle(), style]}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.textInverse}
        />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.surfacePressed,
  },
  text: {
    ...typography.bodyBold,
  },
  textPrimary: {
    color: colors.textInverse,
  },
  textOutline: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.textDisabled,
  },
});