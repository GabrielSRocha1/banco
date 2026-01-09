export const colors = {
  // Primary palette
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  
  // Secondary palette
  secondary: '#8B5CF6',
  secondaryDark: '#7C3AED',
  secondaryLight: '#A78BFA',
  
  // Status colors
  success: '#10B981',
  successLight: '#34D399',
  error: '#EF4444',
  errorLight: '#F87171',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  info: '#3B82F6',
  infoLight: '#60A5FA',
  
  // Neutral palette
  background: '#FAFBFC',
  surface: '#FFFFFF',
  surfaceHover: '#F3F4F6',
  surfacePressed: '#E5E7EB',
  
  // Text colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textDisabled: '#D1D5DB',
  textInverse: '#FFFFFF',
  
  // Border & dividers
  border: '#E5E7EB',
  borderFocus: '#6366F1',
  divider: '#F3F4F6',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Gradients
  gradientStart: '#6366F1',
  gradientEnd: '#8B5CF6',
} as const;

export type ColorKey = keyof typeof colors;