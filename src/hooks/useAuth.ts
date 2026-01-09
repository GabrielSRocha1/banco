import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useWalletStore } from '@/store/wallet.store';
import { useUIStore } from '@/store/ui.store';
import KeyManager from '@/blockchain/core/KeyManager';

// Mock do AuthService - em produção, fazer requisições reais
const mockAuthService = {
  login: async (cpf: string, password: string) => {
    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock de validação
    if (password.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }
    
    return {
      userId: cpf.replace(/\D/g, ''),
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        name: 'Usuário Mock',
        email: 'usuario@example.com',
      },
    };
  },
  
  registerWallet: async (userId: string, address: string, token: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser, setToken, logout: storeLogout } = useAuthStore();
  const { setWallet, clearWallet } = useWalletStore();
  const { showToast } = useUIStore();

  const login = async (cpf: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Autenticar no backend
      const { userId, token, user } = await mockAuthService.login(cpf, password);

      // 2. Verificar se wallet já existe
      const hasWallet = await KeyManager.hasWallet(userId);
      let walletAddress: string;

      if (hasWallet) {
        // Wallet existente - recuperar
        const wallet = await KeyManager.getWallet(userId, password);
        walletAddress = wallet.address;
      } else {
        // Primeira vez - criar wallet
        walletAddress = await KeyManager.createWallet(userId, password);

        // Registrar endereço no backend
        await mockAuthService.registerWallet(userId, walletAddress, token);

        showToast({
          type: 'success',
          message: 'Carteira criada com sucesso!',
          duration: 3000,
        });
      }

      // 3. Salvar estado
      setUser({
        userId,
        cpf,
        name: user.name,
        email: user.email,
      });
      setToken(token);
      setWallet({ address: walletAddress, userId });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message);
      
      showToast({
        type: 'error',
        message,
        duration: 4000,
      });

      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    storeLogout();
    clearWallet();
    
    showToast({
      type: 'info',
      message: 'Logout realizado com sucesso',
      duration: 2000,
    });
  };

  return {
    login,
    logout,
    isLoading,
    error,
  };
};