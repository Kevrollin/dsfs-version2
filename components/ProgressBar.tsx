import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

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
  const percentage = Math.min((current / target) * 100, 100);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
      {showAmount && (
        <View style={styles.amountContainer}>
          <Text style={styles.currentAmount}>{formatCurrency(current)}</Text>
          <Text style={styles.targetAmount}>of {formatCurrency(target)}</Text>
        </View>
      )}
      <Text style={styles.percentage}>{Math.round(percentage)}% funded</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.lightgray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
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
    color: colors.dark,
  },
  targetAmount: {
    fontSize: 14,
    color: colors.gray[500],
  },
  percentage: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
});