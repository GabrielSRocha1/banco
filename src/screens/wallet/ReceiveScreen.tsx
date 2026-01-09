import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import { useWalletStore } from '@/store/wallet.store';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { colors, spacing, typography } from '@/theme';
import { abbreviateAddress } from '@/utils/formatters/currency';

export const ReceiveScreen: React.FC = () => {
  const { address } = useWalletStore();
  const [showFullAddress, setShowFullAddress] = useState(false);

  const handleCopyAddress = () => {
    if (!address) return;

    Clipboard.setString(address);
    Alert.alert('Copiado!', 'Endereço copiado para a área de transferência');
  };

  const handleShare = async () => {
    if (!address) return;

    try {
      await Share.share({
        message: `Meu endereço de carteira:\n${address}`,
        title: 'Compartilhar endereço',
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  if (!address) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={80} color={colors.error} />
          <Text style={styles.errorTitle}>Endereço não encontrado</Text>
          <Text style={styles.errorSubtitle}>
            Não foi possível carregar seu endereço
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receber</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Escaneie o QR Code</Text>
        <Text style={styles.subtitle}>
          Ou compartilhe seu endereço para receber pagamentos
        </Text>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={address}
              size={250}
              backgroundColor={colors.surface}
              color={colors.text}
              logo={require('@/assets/logo.png')} // Opcional
              logoSize={50}
              logoBackgroundColor={colors.surface}
            />
          </View>
        </View>

        {/* Address Display */}
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Seu endereço</Text>
          <TouchableOpacity
            style={styles.addressBox}
            onPress={() => setShowFullAddress(!showFullAddress)}
            activeOpacity={0.7}
          >
            <Text style={styles.addressText} numberOfLines={showFullAddress ? undefined : 1}>
              {showFullAddress ? address : abbreviateAddress(address, 10, 10)}
            </Text>
            <Icon
              name={showFullAddress ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <PrimaryButton
            title="Copiar endereço"
            onPress={handleCopyAddress}
            style={styles.actionButton}
          />

          <PrimaryButton
            title="Compartilhar"
            variant="outline"
            onPress={handleShare}
            style={styles.actionButton}
          />
        </View>

        {/* Warning */}
        <View style={styles.warningContainer}>
          <Icon name="information-circle-outline" size={20} color={colors.warning} />
          <Text style={styles.warningText}>
            Envie apenas tokens compatíveis com Polygon para este endereço.
            Enviar outros tokens pode resultar em perda permanente.
          </Text>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  qrWrapper: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  addressContainer: {
    marginBottom: spacing.xl,
  },
  addressLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
    fontFamily: 'Courier',
  },
  actionsContainer: {
    marginBottom: spacing.xl,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '15',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  warningText: {
    ...typography.caption,
    color: colors.warning,
    flex: 1,
    marginLeft: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  errorSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});