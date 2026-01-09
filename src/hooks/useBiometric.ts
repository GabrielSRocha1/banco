import { useState, useEffect } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const { available, biometryType: type } =
        await rnBiometrics.isSensorAvailable();

      setIsAvailable(available);
      setBiometryType(type);
    } catch (error) {
      console.error('Biometric check failed:', error);
      setIsAvailable(false);
      setBiometryType(null);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async (options?: {
    promptMessage?: string;
    cancelButtonText?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!isAvailable) {
      return {
        success: false,
        error: 'Biometria não disponível neste dispositivo',
      };
    }

    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: options?.promptMessage || 'Confirme sua identidade',
        cancelButtonText: options?.cancelButtonText || 'Cancelar',
      });

      return { success };
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return {
        success: false,
        error: 'Falha na autenticação biométrica',
      };
    }
  };

  const getBiometryName = (): string => {
    switch (biometryType) {
      case 'FaceID':
        return 'Face ID';
      case 'TouchID':
        return 'Touch ID';
      case 'Biometrics':
        return 'Biometria';
      default:
        return 'Biometria';
    }
  };

  return {
    isAvailable,
    biometryType,
    biometryName: getBiometryName(),
    isLoading,
    authenticate,
  };
};