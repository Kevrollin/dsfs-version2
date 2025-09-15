import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { colors } from '../constants/colors';

interface FundButtonProps {
  onPress: () => void;
  size?: 'small' | 'medium';
  style?: any;
}

export default function FundButton({
  onPress,
  size = 'medium',
  style,
}: FundButtonProps) {
  const isSmall = size === 'small';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSmall ? styles.smallButton : styles.mediumButton,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <DollarSign 
        size={isSmall ? 16 : 20} 
        color="white" 
        style={styles.icon}
      />
      <Text style={[styles.text, isSmall && styles.smallText]}>
        Fund
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mediumButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 12,
  },
});