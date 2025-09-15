import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import NotificationItem from '../../components/NotificationItem';
import { mockNotifications } from '../../mock/notifications.js';
import { colors } from '../../constants/colors';

export default function NotificationsScreen() {
  const handleNotificationPress = (notification: any) => {
    console.log('Notification pressed:', notification.id);
    // TODO: Navigate to relevant screen based on notification type
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
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
    backgroundColor: colors.softwhite,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgray,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark,
  },
  scrollView: {
    flex: 1,
  },
});