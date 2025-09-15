export const colors = {
  // Core Brand Colors
  primary: '#1DA1F2', // Bright Blue
  accent: '#0A84FF',  // Navy-ish Blue
  dark: '#121212',
  softwhite: '#F8F9FA',
  lightgray: '#E1E4E8',
  white: '#FFFFFF',
  black: '#000000',

  // Extended Gray Scale
  gray: {
    100: '#F5F5F5',
    300: '#D0D0D0',
    500: '#888888',
    700: '#444444',
  },

  // Semantic Colors
  success: '#10B981', // Green
  warning: '#F59E0B',
  error: '#EF4444',   // Red

  // Gradients (arrays for linear-gradient usage)
  gradients: {
    primary: ['#1DA1F2', '#0A84FF'],     // Blue → Navy
    success: ['#10B981', '#1DA1F2'],     // Green → Blue
    danger: ['#EF4444', '#F59E0B'],      // Red → Orange
    dark: ['#121212', '#000000'],        // Dark Fade
  },
};

export type Colors = typeof colors; 

