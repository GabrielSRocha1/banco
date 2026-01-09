import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, typography, shadows } from '@/theme';
import { formatBRL } from '@/utils/formatters/currency';

interface BalanceCardProps {
  balanceBRL: number;
  balanceUSD?: number;
  isVisible?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balanceBRL,
  balanceUSD,
  isVisible = true,
}) => {
  return (
    <View style={[styles.container, shadows.large]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <BlurView
          style={styles.blur}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor={colors.primary}
        />

        <View style={styles.content}>
          <Text style={styles.label}>Saldo disponível</Text>

          <Text style={styles.balance}>
            {isVisible ? formatBRL(balanceBRL) : 'R$ ••••••'}
          </Text>

          {balanceUSD !== undefined && isVisible && (
            <Text style={styles.usd}>≈ ${balanceUSD.toFixed(2)} USD</Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
  },
  gradient: {
    flex: 1,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
    color: colors.textInverse,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  balance: {
    ...typography.h1,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  usd: {
    ...typography.body,
    color: colors.textInverse,
    opacity: 0.8,
  },
}); 