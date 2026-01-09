import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { validateCPF, formatCPF } from '@/utils/validators/cpf.validator';
import { colors, spacing, typography } from '@/theme';

interface CPFInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  label?: string;
  onValidChange: (cpf: string, isValid: boolean) => void;
  showValidation?: boolean;
}

export const CPFInput: React.FC<CPFInputProps> = ({
  label = 'CPF',
  onValidChange,
  showValidation = true,
  ...textInputProps
}) => {
  const [value, setValue] = useState('');
  const [formatted, setFormatted] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const handleChange = (text: string) => {
    // Remove caracteres não numéricos
    const numbers = text.replace(/\D/g, '');

    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);

    // Aplica formatação
    const formattedValue = formatCPF(limited);

    setValue(limited);
    setFormatted(formattedValue);

    // Valida se tiver 11 dígitos
    const isValid = limited.length === 11 && validateCPF(limited);
    onValidChange(limited, isValid);
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const isValid = value.length === 11 && validateCPF(value);
  const showError = isTouched && value.length > 0 && !isValid;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        {...textInputProps}
        style={[
          styles.input,
          showError && styles.inputError,
          textInputProps.style,
        ]}
        value={formatted}
        onChangeText={handleChange}
        onBlur={handleBlur}
        keyboardType="number-pad"
        maxLength={14}
        placeholder="000.000.000-00"
        placeholderTextColor={colors.textTertiary}
      />

      {showValidation && showError && (
        <Text style={styles.errorText}>CPF inválido</Text>
      )}

      {showValidation && isValid && isTouched && (
        <Text style={styles.successText}>✓ CPF válido</Text>
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
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    ...typography.body,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  successText: {
    ...typography.caption,
    color: colors.success,
    marginTop: spacing.xs,
  },
});