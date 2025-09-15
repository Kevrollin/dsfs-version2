import { useColorScheme as useNativeColorScheme } from 'react-native';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

type ColorScheme = 'light' | 'dark';
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'app_theme_mode';

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  colorScheme: 'light',
  setMode: async (mode: ThemeMode) => {
    set({ mode });
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  },
  toggleTheme: () => {
    const currentMode = get().mode;
    const currentScheme = get().colorScheme;
    
    if (currentMode === 'system') {
      // If in system mode, switch to opposite of current system preference
      const newMode = currentScheme === 'light' ? 'dark' : 'light';
      get().setMode(newMode);
    } else {
      // If in manual mode, toggle between light and dark
      const newMode = currentMode === 'light' ? 'dark' : 'light';
      get().setMode(newMode);
    }
  },
}));

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme() || 'light';
  const { mode, colorScheme, setMode } = useThemeStore();

  useEffect(() => {
    // Load saved theme preference on app start
    const loadThemePreference = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
          setMode(savedMode as ThemeMode);
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  useEffect(() => {
    // Update color scheme based on mode and system preference
    const newColorScheme = mode === 'system' ? systemColorScheme : mode;
    useThemeStore.setState({ colorScheme: newColorScheme });
  }, [mode, systemColorScheme]);

  return {
    colorScheme,
    mode,
    isSystemMode: mode === 'system',
    systemColorScheme,
  };
}