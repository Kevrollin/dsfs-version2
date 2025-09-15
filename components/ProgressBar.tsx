import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import { getTheme } from '../constants/themes';

interface ProgressBarProps {
  current: number;
  target: number;
  showAmount?: boolean;
  style?: any;
}

export default function ProgressBar({
  current,
  target,
  showAmount = true,
  style,
}: ProgressBarProps) {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);
  const percentage = Math.min((current / target) * 100, 100);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.progressTrack, { backgroundColor: theme.gray[200] }]}>
        <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: theme.primary }]} />
      </View>
      {showAmount && (
        <View style={styles.amountContainer}>
          <Text style={[styles.currentAmount, { color: theme.text }]}>{formatCurrency(current)}</Text>
          <Text style={[styles.targetAmount, { color: theme.textTertiary }]}>of {formatCurrency(target)}</Text>
        </View>
      )}
      <Text style={[styles.percentage, { color: theme.primary }]}>{Math.round(percentage)}% funded</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  currentAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  targetAmount: {
    fontSize: 14,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});