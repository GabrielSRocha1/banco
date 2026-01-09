import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWalletStore } from '@/store/wallet.store';
import BalanceService from '@/blockchain/services/BalanceService';
import { colors, spacing, typography } from '@/theme';
import { formatBRL } from '@/utils/formatters/currency';

interface TokenItemProps {
  symbol: string;
  balance: string;
  balanceBRL: number;
  onPress: () => void;
}

const TokenItem: React.FC<TokenItemProps> = ({
  symbol,
  balance,
  balanceBRL,
  onPress,
}) => {
  const getTokenIcon = (symbol: string) => {
    const icons: Record<string, string> = {
      MATIC: 'logo-polygon',
      USDC: 'logo-usd',
      USDT: 'logo-usd',
      DAI: 'logo-usd',
    };
    return icons[symbol] || 'ellipse-outline';
  };

  return (
    <TouchableOpacity style={styles.tokenItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.tokenLeft}>
        <View style={styles.tokenIcon}>
          <Icon name={getTokenIcon(symbol)} size={32} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.tokenSymbol}>{symbol}</Text>
          <Text style={styles.tokenBalance}>{parseFloat(balance).toFixed(4)}</Text>
        </View>
      </View>
      <View style={styles.tokenRight}>
        <Text style={styles.tokenValueBRL}>{formatBRL(balanceBRL)}</Text>
        <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
};

export const WalletScreen: React.FC = () => {
  const { address, tokens, updateTokens } = useWalletStore();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  useEffect(() => {
    if (address) {
      loadTokens();
    }
  }, [address]);

  const loadTokens = async () => {
    if (!address) return;

    try {
      const { tokens: fetchedTokens } = await BalanceService.getConsolidatedBalance(
        address
      );
      updateTokens(fetchedTokens);
    } catch (error) {
      console.error('Failed to load tokens:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTokens();
    setIsRefreshing(false);
  };

  const handleTokenPress = (symbol: string) => {
    console.log('Token pressed:', symbol);
    // TODO: Navegar para detalhes do token
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Carteira</Text>
        <TouchableOpacity>
          <Icon name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tokens List */}
      <FlatList
        data={tokens}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <TokenItem
            symbol={item.symbol}
            balance={item.balance}
            balanceBRL={item.balanceBRL}
            onPress={() => handleTokenPress(item.symbol)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="wallet-outline" size={80} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>Nenhum token encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Receba tokens para começar
            </Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  listContent: {
    padding: spacing.lg,
  },
  tokenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tokenIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tokenSymbol: {
    ...typography.bodyBold,
    color: colors.text,
  },
  tokenBalance: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tokenRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenValueBRL: {
    ...typography.bodyBold,
    color: colors.text,
    marginRight: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textTertiary,
  },
});