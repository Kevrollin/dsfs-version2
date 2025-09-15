import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MessageCircle, DollarSign, CircleCheck as CheckCircle } from 'lucide-react-native';
import Avatar from './Avatar';
import { useColorScheme } from '../hooks/useColorScheme';
import { getTheme } from '../constants/themes';

interface NotificationItemProps {
  notification: any;
  onPress?: () => void;
}

export default function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart size={20} color={theme.error} fill={theme.error} />;
      case 'comment':
        return <MessageCircle size={20} color={theme.primary} />;
      case 'funding':
        return <DollarSign size={20} color={theme.success} />;
      case 'verification':
        return <CheckCircle size={20} color={theme.primary} />;
      default:
        return <CheckCircle size={20} color={theme.textTertiary} />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        { backgroundColor: theme.surface, borderBottomColor: theme.border },
        !notification.isRead && { backgroundColor: theme.surfaceSecondary }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {notification.avatar ? (
          <Avatar source={notification.avatar} size="medium" />
        ) : (
          <View style={[styles.systemIcon, { backgroundColor: theme.gray[200] }]}>
            {getIcon()}
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[
          styles.message, 
          { color: notification.isRead ? theme.textSecondary : theme.text },
          !notification.isRead && { fontWeight: '500' }
        ]}>
          {notification.message}
        </Text>
        <Text style={[styles.timestamp, { color: theme.textTertiary }]}>{formatTime(notification.timestamp)}</Text>
      </View>
      
      {!notification.isRead && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  systemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});