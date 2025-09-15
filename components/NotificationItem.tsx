import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MessageCircle, DollarSign, CircleCheck as CheckCircle } from 'lucide-react-native';
import Avatar from './Avatar';
import { colors } from '../constants/colors';

interface NotificationItemProps {
  notification: any;
  onPress?: () => void;
}

export default function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart size={20} color={colors.error} fill={colors.error} />;
      case 'comment':
        return <MessageCircle size={20} color={colors.primary} />;
      case 'funding':
        return <DollarSign size={20} color={colors.success} />;
      case 'verification':
        return <CheckCircle size={20} color={colors.primary} />;
      default:
        return <CheckCircle size={20} color={colors.gray[500]} />;
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
      style={[styles.container, !notification.isRead && styles.unreadContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {notification.avatar ? (
          <Avatar source={notification.avatar} size="medium" />
        ) : (
          <View style={styles.systemIcon}>
            {getIcon()}
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.message, !notification.isRead && styles.unreadMessage]}>
          {notification.message}
        </Text>
        <Text style={styles.timestamp}>{formatTime(notification.timestamp)}</Text>
      </View>
      
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgray,
  },
  unreadContainer: {
    backgroundColor: colors.softwhite,
  },
  iconContainer: {
    marginRight: 12,
  },
  systemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightgray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 18,
  },
  unreadMessage: {
    color: colors.dark,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
});