import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { getTheme } from '../../constants/themes';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  const getButtonStyle = () => {
    let baseStyle = [styles.button];
    
    if (variant === 'primary') {
      baseStyle.push({ backgroundColor: theme.primary });
    } else if (variant === 'secondary') {
      baseStyle.push({ backgroundColor: theme.gray[200] });
    } else if (variant === 'outline') {
      baseStyle.push({ backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.primary });
    }
    
    if (size === 'small') {
      baseStyle.push(styles.smallButton);
    } else if (size === 'large') {
      baseStyle.push(styles.largeButton);
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    let textStyle = [styles.buttonText];
    
    if (variant === 'primary') {
      textStyle.push({ color: '#FFFFFF' });
    } else if (variant === 'secondary') {
      textStyle.push({ color: theme.text });
    } else if (variant === 'outline') {
      textStyle.push({ color: theme.primary });
    }
    
    if (size === 'small') {
      textStyle.push(styles.smallText);
    } else if (size === 'large') {
      textStyle.push(styles.largeText);
    }
    
    return textStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
        color={variant === 'primary' ? '#FFFFFF' : theme.primary} 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabledButton: {
    opacity: 0.5,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
});