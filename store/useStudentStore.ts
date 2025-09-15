import { create } from 'zustand';
import { mockStudents } from '../mock/students.js';

interface StudentState {
  students: any[];
  loading: boolean;
  fetchStudents: () => Promise<void>;
  fundStudent: (studentId: string, amount: number) => void;
  registerStudent: (studentData: any) => void;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: mockStudents,
  loading: false,

  fetchStudents: async () => {
    set({ loading: true });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // TODO: Replace with real API call
    set({ students: mockStudents, loading: false });
  },

  fundStudent: (studentId, amount) => {
    const students = get().students;
    const updatedStudents = students.map(student =>
      student.id === studentId
        ? {
            ...student,
            currentFunding: student.currentFunding + amount,
            totalFunded: student.totalFunded + amount,
            supporters: student.supporters + 1,
          }
        : student
    );
    set({ students: updatedStudents });
  },

  registerStudent: (studentData) => {
    // TODO: Replace with real API call
    console.log('Student registered:', studentData);
  },
}));