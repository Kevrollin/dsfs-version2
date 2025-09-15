import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Sun, Moon, Smartphone } from 'lucide-react-native';
import { useColorScheme, useThemeStore } from '../hooks/useColorScheme';
import { getTheme } from '../constants/themes';

interface ThemeToggleProps {
  style?: any;
  showLabel?: boolean;
}

export default function ThemeToggle({ style, showLabel = true }: ThemeToggleProps) {
  const { colorScheme, mode } = useColorScheme();
  const { toggleTheme } = useThemeStore();
  const theme = getTheme(colorScheme);

  const getIcon = () => {
    if (mode === 'system') {
      return <Smartphone size={20} color={theme.text} />;
    }
    return colorScheme === 'dark' ? 
      <Moon size={20} color={theme.text} /> : 
      <Sun size={20} color={theme.text} />;
  };

  const getLabel = () => {
    if (mode === 'system') {
      return `Auto (${colorScheme})`;
    }
    return colorScheme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        style
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {getLabel()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});