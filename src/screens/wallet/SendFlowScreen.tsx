import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { SecurePasswordInput } from '@/components/inputs/SecurePasswordInput';
import { useWalletStore } from '@/store/wallet.store';
import { useAuthStore } from '@/store/auth.store';
import TransactionService from '@/blockchain/services/TransactionService';
import { colors, spacing, typography } from '@/theme';
import { formatBRL } from '@/utils/formatters/currency';
import { ethers } from 'ethers';

type Step = 'amount' | 'address' | 'confirm' | 'password' | 'processing' | 'success';

export const SendFlowScreen: React.FC = () => {
  const { balanceBRL } = useWalletStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [password, setPassword] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const amountNumber = parseFloat(amount.replace(',', '.')) || 0;
  const isAmountValid = amountNumber > 0 && amountNumber <= balanceBRL;
  const isAddressValid = ethers.isAddress(toAddress);

  const handleNext = () => {
    switch (step) {
      case 'amount':
        if (isAmountValid) setStep('address');
        break;
      case 'address':
        if (isAddressValid) setStep('confirm');
        break;
      case 'confirm':
        setStep('password');
        break;
    }
  };

  const handleSend = async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    setStep('processing');

    try {
      const result = await TransactionService.transfer({
        userId: user.userId,
        password,
        toAddress,
        amountInBRL: amountNumber,
      });

      if (result.success && result.txHash) {
        setTxHash(result.txHash);
        setStep('success');
      } else {
        Alert.alert('Erro', result.error || 'Transação falhou');
        setStep('password');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao processar transação');
      setStep('password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAmount('');
    setToAddress('');
    setPassword('');
    setTxHash('');
    setStep('amount');
  };

  const renderProgressBar = () => {
    const steps: Step[] = ['amount', 'address', 'confirm', 'password'];
    const currentIndex = steps.indexOf(step);

    return (
      <View style={styles.progressBar}>
        {steps.map((s, index) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              index <= currentIndex && styles.progressDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderAmountStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Quanto deseja enviar?</Text>

      <View style={styles.amountInputContainer}>
        <Text style={styles.currencySymbol}>R$</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0,00"
          placeholderTextColor={colors.textTertiary}
          autoFocus
        />
      </View>

      <View style={styles.balanceInfo}>
        <Text style={styles.balanceLabel}>Saldo disponível</Text>
        <Text style={styles.balanceValue}>{formatBRL(balanceBRL)}</Text>
      </View>

      <View style={styles.quickAmounts}>
        {[50, 100, 200, 500].map((value) => (
          <TouchableOpacity
            key={value}
            style={styles.quickAmountButton}
            onPress={() => setAmount(value.toString())}
          >
            <Text style={styles.quickAmountText}>R$ {value}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <PrimaryButton
        title="Continuar"
        onPress={handleNext}
        disabled={!isAmountValid}
        style={styles.continueButton}
      />
    </View>
  );

  const renderAddressStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Para quem deseja enviar?</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Endereço da carteira</Text>
        <TextInput
          style={styles.addressInput}
          value={toAddress}
          onChangeText={setToAddress}
          placeholder="0x..."
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {toAddress.length > 0 && !isAddressValid && (
          <Text style={styles.errorText}>Endereço inválido</Text>
        )}
      </View>

      <TouchableOpacity style={styles.scanButton}>
        <Icon name="qr-code-outline" size={24} color={colors.primary} />
        <Text style={styles.scanButtonText}>Escanear QR Code</Text>
      </TouchableOpacity>

      <PrimaryButton
        title="Continuar"
        onPress={handleNext}
        disabled={!isAddressValid}
        style={styles.continueButton}
      />
    </View>
  );

  const renderConfirmStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirme os detalhes</Text>

      <View style={styles.confirmCard}>
        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>Valor</Text>
          <Text style={styles.confirmValue}>{formatBRL(amountNumber)}</Text>
        </View>

        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>Taxa de rede</Text>
          <Text style={styles.confirmValue}>~R$ 0,50</Text>
        </View>

        <View style={styles.confirmDivider} />

        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabelBold}>Total</Text>
          <Text style={styles.confirmValueBold}>
            {formatBRL(amountNumber + 0.5)}
          </Text>
        </View>

        <View style={styles.confirmDivider} />

        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>Para</Text>
        </View>
        <Text style={styles.addressText} numberOfLines={1}>
          {toAddress}
        </Text>
      </View>

      <PrimaryButton
        title="Confirmar e enviar"
        onPress={handleNext}
        style={styles.continueButton}
      />
    </View>
  );

  const renderPasswordStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirme sua senha</Text>
      <Text style={styles.stepSubtitle}>
        Para sua segurança, precisamos confirmar sua identidade
      </Text>

      <SecurePasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        autoFocus
      />

      <PrimaryButton
        title="Enviar agora"
        onPress={handleSend}
        disabled={password.length < 6}
        isLoading={isLoading}
        style={styles.continueButton}
      />
    </View>
  );

  const renderProcessingStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.processingContainer}>
        <Icon name="hourglass-outline" size={80} color={colors.primary} />
        <Text style={styles.processingTitle}>Processando transação...</Text>
        <Text style={styles.processingSubtitle}>
          Aguarde enquanto sua transação é confirmada na blockchain
        </Text>
      </View>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.successContainer}>
        <Icon name="checkmark-circle" size={100} color={colors.success} />
        <Text style={styles.successTitle}>Transação enviada!</Text>
        <Text style={styles.successSubtitle}>
          Sua transação foi processada com sucesso
        </Text>

        <View style={styles.txHashContainer}>
          <Text style={styles.txHashLabel}>Hash da transação</Text>
          <Text style={styles.txHashValue} numberOfLines={1}>
            {txHash}
          </Text>
        </View>

        <PrimaryButton
          title="Nova transação"
          onPress={handleReset}
          style={styles.continueButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (step === 'amount') {
              // Navigate back
            } else if (step === 'processing' || step === 'success') {
              // Can't go back
            } else {
              setStep('amount');
            }
          }}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enviar</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      {step !== 'processing' && step !== 'success' && renderProgressBar()}

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'amount' && renderAmountStep()}
        {step === 'address' && renderAddressStep()}
        {step === 'confirm' && renderConfirmStep()}
        {step === 'password' && renderPasswordStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'success' && renderSuccessStep()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  currencySymbol: {
    ...typography.h1,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  amountInput: {
    ...typography.h1,
    color: colors.text,
    flex: 1,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  balanceValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  quickAmountButton: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    ...typography.caption,
    color: colors.text,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  addressInput: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    ...typography.body,
    color: colors.text,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  scanButtonText: {
    ...typography.bodyBold,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  confirmCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  confirmLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  confirmValue: {
    ...typography.body,
    color: colors.text,
  },
  confirmLabelBold: {
    ...typography.bodyBold,
    color: colors.text,
  },
  confirmValueBold: {
    ...typography.bodyBold,
    color: colors.text,
  },
  confirmDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  addressText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  processingTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  processingSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  successTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  txHashContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  txHashLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  txHashValue: {
    ...typography.caption,
    color: colors.text,
    fontFamily: 'Courier',
  },
  continueButton: {
    marginTop: 'auto',
  },
});