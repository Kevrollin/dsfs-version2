import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Settings, UserPlus, GraduationCap } from 'lucide-react-native';
import Avatar from '../../components/Avatar';
import Button from '../../components/Common/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../constants/colors';

export default function ProfileScreen() {
  const { user, isStudentRegistered, registerAsStudent } = useAuthStore();

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Avatar
            source={user.avatar}
            size="xlarge"
            verified={user.isVerified}
            style={styles.profileAvatar}
          />
          
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          
          <Text style={styles.bio}>{user.bio}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Posts</Text>
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
            <View style={styles.studentBadgeContainer}>
              <GraduationCap size={20} color={colors.primary} />
              <Text style={styles.studentBadgeText}>Verified Student</Text>
            </View>
          )}
        </View>

        {/* Content Tabs */}
        <View style={styles.tabsSection}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Likes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Funded</Text>
          </TouchableOpacity>
        </View>

        {/* Coming Soon Placeholder */}
        <View style={styles.comingSoonSection}>
          <UserPlus size={48} color={colors.gray[300]} style={styles.comingSoonIcon} />
          <Text style={styles.comingSoonTitle}>Posts Coming Soon</Text>
          <Text style={styles.comingSoonText}>
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
    backgroundColor: colors.softwhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
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
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgray,
  },
  profileAvatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: colors.gray[700],
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
    color: colors.dark,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
  },
  actionButton: {
    width: '100%',
    marginBottom: 16,
  },
  studentBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softwhite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  studentBadgeText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  tabsSection: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgray,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.gray[500],
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
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
    color: colors.gray[600],
    marginBottom: 8,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 22,
  },
});