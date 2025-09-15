import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import { getTheme } from '../constants/themes';

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
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

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
        style={[styles.avatar, { width: avatarSize, height: avatarSize, backgroundColor: theme.gray[200] }]}
      />
      {verified && (
        <View style={[styles.verifiedBadge, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.verifiedIcon, { backgroundColor: theme.primary }]} />
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
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  verifiedIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});