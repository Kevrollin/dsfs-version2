import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Settings, UserPlus, GraduationCap } from 'lucide-react-native';
import Avatar from '../../components/Avatar';
import Button from '../../components/Common/Button';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuthStore } from '../../store/useAuthStore';
import { useColorScheme } from '../../hooks/useColorScheme';
import { getTheme } from '../../constants/themes';

export default function ProfileScreen() {
  const { user, isStudentRegistered, registerAsStudent } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  const handleStudentAction = () => {
    if (!isStudentRegistered) {
      Alert.alert(
        'Student Registration',
        'Would you like to register as a student to receive funding?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Register',
            onPress: () => {
              registerAsStudent();
              Alert.alert('Success!', 'You are now registered as a student!');
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert('Coming Soon', 'Student dashboard will be available soon!');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <ThemeToggle style={styles.themeToggle} showLabel={false} />
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={[styles.profileSection, { backgroundColor: theme.surface }]}>
          <Avatar
            source={user.avatar}
            size="xlarge"
            verified={user.isVerified}
            style={styles.profileAvatar}
          />
          
          <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
          <Text style={[styles.username, { color: theme.textSecondary }]}>{user.username}</Text>
          
          <Text style={[styles.bio, { color: theme.textSecondary }]}>{user.bio}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.text }]}>{user.followers.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.text }]}>{user.following.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.text }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Posts</Text>
            </View>
          </View>

          {/* Student Action Button */}
          <Button
            title={
              isStudentRegistered
                ? 'Login to Student Dashboard'
                : 'Register as Student'
            }
            onPress={handleStudentAction}
            variant="primary"
            style={styles.actionButton}
          />

          {/* Student Badge */}
          {user.isStudent && (
            <View style={[styles.studentBadgeContainer, { backgroundColor: theme.surfaceSecondary }]}>
              <GraduationCap size={20} color={theme.primary} />
              <Text style={[styles.studentBadgeText, { color: theme.primary }]}>Verified Student</Text>
            </View>
          )}
        </View>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabsSection}>
          <TouchableOpacity style={[styles.tab, styles.activeTab, { backgroundColor: theme.surface, borderBottomColor: theme.primary }]}>
            <Text style={[styles.tabText, styles.activeTabText, { color: theme.primary }]}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, { backgroundColor: theme.surface }]}>
            <Text style={[styles.tabText, { color: theme.textTertiary }]}>Likes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, { backgroundColor: theme.surface }]}>
            <Text style={[styles.tabText, { color: theme.textTertiary }]}>Funded</Text>
          </TouchableOpacity>
        </View>

        {/* Coming Soon Placeholder */}
        <View style={styles.comingSoonSection}>
          <UserPlus size={48} color={theme.textTertiary} style={styles.comingSoonIcon} />
          <Text style={[styles.comingSoonTitle, { color: theme.textSecondary }]}>Posts Coming Soon</Text>
          <Text style={[styles.comingSoonText, { color: theme.textTertiary }]}>
            Your posts and activity will appear here once you start sharing content.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  themeToggle: {
    marginRight: 'auto',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  profileAvatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  actionButton: {
    width: '100%',
    marginBottom: 16,
  },
  studentBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  studentBadgeText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  tabsSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  comingSoonSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  comingSoonIcon: {
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});