import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import NotificationItem from '../../components/NotificationItem';
import { mockNotifications } from '../../mock/notifications.js';
import { useColorScheme } from '../../hooks/useColorScheme';
import { getTheme } from '../../constants/themes';

export default function NotificationsScreen() {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  const handleNotificationPress = (notification: any) => {
    console.log('Notification pressed:', notification.id);
    // TODO: Navigate to relevant screen based on notification type
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {mockNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onPress={() => handleNotificationPress(notification)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
});