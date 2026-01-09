import { useEffect, useCallback } from 'react';
import { useWalletStore } from '@/store/wallet.store';
import BalanceService from '@/blockchain/services/BalanceService';

export const useBalance = (autoRefresh: boolean = true, intervalMs: number = 15000) => {
  const { address, updateBalance, updateTokens } = useWalletStore();

  const fetchBalance = useCallback(async () => {
    if (!address) return;

    try {
      const { totalBRL, tokens } = await BalanceService.getConsolidatedBalance(
        address
      );

      updateBalance(totalBRL);
      updateTokens(tokens);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }, [address, updateBalance, updateTokens]);

  useEffect(() => {
    if (!address || !autoRefresh) return;

    // Fetch immediately
    fetchBalance();

    // Setup polling
    const interval = setInterval(fetchBalance, intervalMs);

    // Cleanup
    return () => clearInterval(interval);
  }, [address, autoRefresh, intervalMs, fetchBalance]);

  return {
    refresh: fetchBalance,
  };
};