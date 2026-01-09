import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { CPFInput } from '@/components/inputs/CPFInput';
import { SecurePasswordInput } from '@/components/inputs/SecurePasswordInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useAuth } from '@/hooks/useAuth';
import { useBiometric } from '@/hooks/useBiometric';
import { colors, spacing, typography } from '@/theme';

export const LoginScreen: React.FC = () => {
  const [cpf, setCPF] = useState('');
  const [isCPFValid, setIsCPFValid] = useState(false);
  const [password, setPassword] = useState('');

  const { login, isLoading } = useAuth();
  const { isAvailable: biometricAvailable, biometryName } = useBiometric();

  const canSubmit = isCPFValid && password.length >= 6 && !isLoading;

  const handleLogin = async () => {
    if (!canSubmit) return;

    const result = await login(cpf, password);
    
    if (result.success) {
      // Navegação será tratada pelo RootNavigator
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon name="wallet-outline" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.subtitle}>
              Faça login para acessar sua carteira
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <CPFInput
              label="CPF"
              onValidChange={(cpfValue, isValid) => {
                setCPF(cpfValue);
                setIsCPFValid(isValid);
              }}
            />

            <SecurePasswordInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <PrimaryButton
              title="Entrar"
              onPress={handleLogin}
              disabled={!canSubmit}
              isLoading={isLoading}
              style={styles.loginButton}
            />

            {biometricAvailable && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={() => {
                  // TODO: Implementar login biométrico
                }}
              >
                <Icon
                  name="finger-print-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.biometricText}>
                  Entrar com {biometryName}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity>
              <Text style={styles.footerLink}>Criar nova conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  biometricText: {
    ...typography.bodyBold,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
});