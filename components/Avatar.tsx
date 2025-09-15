import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

interface AvatarProps {
  source: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  verified?: boolean;
  style?: any;
}

export default function Avatar({
  source,
  size = 'medium',
  verified = false,
  style,
}: AvatarProps) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      case 'xlarge':
        return 100;
      default:
        return 48;
    }
  };

  const avatarSize = getSize();

  return (
    <View style={[styles.container, { width: avatarSize, height: avatarSize }, style]}>
      <Image
        source={{ uri: source }}
        style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
      />
      {verified && (
        <View style={styles.verifiedBadge}>
          <View style={styles.verifiedIcon} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 50,
    backgroundColor: colors.lightgray,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    backgroundColor: 'white',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.lightgray,
  },
  verifiedIcon: {
    width: 12,
    height: 12,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
});