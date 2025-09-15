export const lightTheme = {
  // Core Brand Colors
  primary: '#1DA1F2',
  accent: '#0A84FF',
  
  // Background Colors
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F9FA',
  
  // Text Colors
  text: '#121212',
  textSecondary: '#666666',
  textTertiary: '#888888',
  
  // Border Colors
  border: '#E1E4E8',
  borderLight: '#F0F0F0',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Gray Scale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Card & Modal
  card: '#FFFFFF',
  modal: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.4)',
  
  // Tab Bar
  tabBar: '#FFFFFF',
  tabBarBorder: '#E1E4E8',
  
  // Input
  input: '#FFFFFF',
  inputBorder: '#E1E4E8',
  placeholder: '#9CA3AF',
};

export const darkTheme = {
  // Core Brand Colors
  primary: '#1DA1F2',
  accent: '#0A84FF',
  
  // Background Colors
  background: '#000000',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  
  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  
  // Border Colors
  border: '#38383A',
  borderLight: '#48484A',
  
  // Status Colors
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  
  // Gray Scale
  gray: {
    50: '#1C1C1E',
    100: '#2C2C2E',
    200: '#3A3A3C',
    300: '#48484A',
    400: '#636366',
    500: '#8E8E93',
    600: '#AEAEB2',
    700: '#C7C7CC',
    800: '#D1D1D6',
    900: '#F2F2F7',
  },
  
  // Card & Modal
  card: '#1C1C1E',
  modal: '#1C1C1E',
  overlay: 'rgba(0, 0, 0, 0.6)',
  
  // Tab Bar
  tabBar: '#1C1C1E',
  tabBarBorder: '#38383A',
  
  // Input
  input: '#1C1C1E',
  inputBorder: '#38383A',
  placeholder: '#8E8E93',
};

export type Theme = typeof lightTheme;

export const getTheme = (colorScheme: 'light' | 'dark'): Theme => {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};