import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Avatar from '../../components/Avatar';
import ProgressBar from '../../components/ProgressBar';
import FundButton from '../../components/FundButton';
import { useStudentStore } from '../../store/useStudentStore';
import { colors } from '../../constants/colors';

export default function ExploreScreen() {
  const { students, loading, fetchStudents, fundStudent } = useStudentStore();

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Students</Text>
        <Text style={styles.headerSubtitle}>Support the next generation of innovators</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {students.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentHeader}>
              <View style={styles.studentInfo}>
                <Avatar
                  source={student.avatar}
                  size="large"
                  verified={student.isVerified}
                />
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentUniversity}>{student.university}</Text>
                  <Text style={styles.studentCourse}>{student.course} • {student.year}</Text>
                  <Text style={styles.studentGPA}>GPA: {student.gpa}</Text>
                </View>
              </View>
              <FundButton
                onPress={() => handleFundStudent(student.id, student.name)}
                size="medium"
              />
            </View>

            <Text style={styles.studentBio}>{student.bio}</Text>

            <View style={styles.fundingSection}>
              <ProgressBar
                current={student.currentFunding}
                target={student.fundingGoal}
                showAmount={true}
              />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{student.supporters}</Text>
                <Text style={styles.statLabel}>Supporters</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>${student.totalFunded.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Funded</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{student.projects.length}</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
            </View>

            {student.achievements.length > 0 && (
              <View style={styles.achievementsSection}>
                <Text style={styles.achievementsTitle}>Key Achievements</Text>
                {student.achievements.slice(0, 2).map((achievement, index) => (
                  <Text key={index} style={styles.achievement}>• {achievement}</Text>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.gray[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  studentCard: {
    backgroundColor: 'white',
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
    color: colors.dark,
    marginBottom: 4,
  },
  studentUniversity: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  studentCourse: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 2,
  },
  studentGPA: {
    fontSize: 12,
    color: colors.gray[500],
    fontWeight: '500',
  },
  studentBio: {
    fontSize: 14,
    color: colors.gray[700],
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
    borderTopColor: colors.lightgray,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 4,
  },
  achievementsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.lightgray,
    paddingTop: 16,
  },
  achievementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  achievement: {
    fontSize: 13,
    color: colors.gray[600],
    lineHeight: 18,
    marginBottom: 4,
  },
});