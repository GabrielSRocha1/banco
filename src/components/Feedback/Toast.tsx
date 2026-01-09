import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUIStore } from '@/store/ui.store';
import { colors, spacing, typography } from '@/theme';

const { width } = Dimensions.get('window');

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useUIStore();

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onHide={hideToast}
        />
      ))}
    </View>
  );
};

interface ToastItemProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onHide: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onHide,
}) => {
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide
    const timer = setTimeout(() => {
      animateOut();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide(id);
    });
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: colors.success,
          icon: 'checkmark-circle',
        };
      case 'error':
        return {
          backgroundColor: colors.error,
          icon: 'close-circle',
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
          icon: 'warning',
        };
      case 'info':
        return {
          backgroundColor: colors.info,
          icon: 'information-circle',
        };
    }
  };

  const config = getToastConfig();

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: config.backgroundColor,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Icon name={config.icon} size={24} color={colors.textInverse} />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    maxWidth: width - 32,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    ...typography.body,
    color: colors.textInverse,
    marginLeft: spacing.sm,
    flex: 1,
  },
});