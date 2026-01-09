import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import TransactionService from '@/blockchain/services/TransactionService';

interface SendParams {
  toAddress: string;
  amountBRL: number;
  password: string;
}

export const useTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const { showToast } = useUIStore();

  const send = async (params: SendParams) => {
    if (!user?.userId) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await TransactionService.transfer({
        userId: user.userId,
        password: params.password,
        toAddress: params.toAddress,
        amountInBRL: params.amountBRL,
      });

      if (result.success) {
        showToast({
          type: 'success',
          message: 'Transação enviada com sucesso!',
          duration: 3000,
        });

        return {
          success: true,
          txHash: result.txHash,
        };
      } else {
        const errorMessage = result.error || 'Transação falhou';
        setError(errorMessage);

        showToast({
          type: 'error',
          message: errorMessage,
          duration: 4000,
        });

        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);

      showToast({
        type: 'error',
        message,
        duration: 4000,
      });

      return {
        success: false,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionStatus = async (txHash: string) => {
    try {
      const status = await TransactionService.getTransactionStatus(txHash);
      return status;
    } catch (err) {
      console.error('Failed to get transaction status:', err);
      return { status: 'unknown' };
    }
  };

  return {
    send,
    getTransactionStatus,
    isLoading,
    error,
  };
};