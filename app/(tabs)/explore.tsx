import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Avatar from '../../components/Avatar';
import ProgressBar from '../../components/ProgressBar';
import FundButton from '../../components/FundButton';
import { useStudentStore } from '../../store/useStudentStore';
import { useColorScheme } from '../../hooks/useColorScheme';
import { getTheme } from '../../constants/themes';

export default function ExploreScreen() {
  const { students, loading, fetchStudents, fundStudent } = useStudentStore();
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFundStudent = (studentId: string, studentName: string) => {
    Alert.alert(
      `Fund ${studentName}`,
      'Choose an amount to support this student:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: '$25',
          onPress: () => {
            fundStudent(studentId, 25);
            Alert.alert('Success!', `Thank you for supporting ${studentName}!`);
          },
        },
        {
          text: '$50',
          onPress: () => {
            fundStudent(studentId, 50);
            Alert.alert('Success!', `Thank you for supporting ${studentName}!`);
          },
        },
        {
          text: '$100',
          onPress: () => {
            fundStudent(studentId, 100);
            Alert.alert('Success!', `Thank you for supporting ${studentName}!`);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Discover Students</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Support the next generation of innovators</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {students.map((student) => (
          <View key={student.id} style={[styles.studentCard, { backgroundColor: theme.card }]}>
            <View style={styles.studentHeader}>
              <View style={styles.studentInfo}>
                <Avatar
                  source={student.avatar}
                  size="large"
                  verified={student.isVerified}
                />
                <View style={styles.studentDetails}>
                  <Text style={[styles.studentName, { color: theme.text }]}>{student.name}</Text>
                  <Text style={[styles.studentUniversity, { color: theme.primary }]}>{student.university}</Text>
                  <Text style={[styles.studentCourse, { color: theme.textSecondary }]}>{student.course} • {student.year}</Text>
                  <Text style={[styles.studentGPA, { color: theme.textTertiary }]}>GPA: {student.gpa}</Text>
                </View>
              </View>
              <FundButton
                onPress={() => handleFundStudent(student.id, student.name)}
                size="medium"
              />
            </View>

            <Text style={[styles.studentBio, { color: theme.textSecondary }]}>{student.bio}</Text>

            <View style={styles.fundingSection}>
              <ProgressBar
                current={student.currentFunding}
                target={student.fundingGoal}
                showAmount={true}
              />
            </View>

            <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text }]}>{student.supporters}</Text>
                <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Supporters</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text }]}>${student.totalFunded.toLocaleString()}</Text>
                <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Total Funded</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text }]}>{student.projects.length}</Text>
                <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Projects</Text>
              </View>
            </View>

            {student.achievements.length > 0 && (
              <View style={[styles.achievementsSection, { borderTopColor: theme.border }]}>
                <Text style={[styles.achievementsTitle, { color: theme.text }]}>Key Achievements</Text>
                {student.achievements.slice(0, 2).map((achievement, index) => (
                  <Text key={index} style={[styles.achievement, { color: theme.textSecondary }]}>• {achievement}</Text>
                ))}
              </View>
            )}
          </View>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  studentCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  studentInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 16,
  },
  studentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  studentUniversity: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  studentCourse: {
    fontSize: 14,
    marginBottom: 2,
  },
  studentGPA: {
    fontSize: 12,
    fontWeight: '500',
  },
  studentBio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  fundingSection: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  achievementsSection: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  achievementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  achievement: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
});