// TODO: Replace with real API endpoints when backend is ready

export const API_BASE_URL = 'https://api.dsfs.com'; // Placeholder URL

export const apiClient = {
  // Authentication
  login: async (credentials: { username: string; password: string }) => {
    // TODO: Implement real login
    console.log('Mock login:', credentials);
    return { success: true, token: 'mock_token', user: {} };
  },

  signup: async (userData: any) => {
    // TODO: Implement real signup
    console.log('Mock signup:', userData);
    return { success: true, user: {} };
  },

  // Posts
  fetchPosts: async () => {
    // TODO: Implement real post fetching
    console.log('Mock fetch posts');
    return { success: true, posts: [] };
  },

  likePost: async (postId: string) => {
    // TODO: Implement real like functionality
    console.log('Mock like post:', postId);
    return { success: true };
  },

  // Students
  fetchStudents: async () => {
    // TODO: Implement real student fetching
    console.log('Mock fetch students');
    return { success: true, students: [] };
  },

  registerStudent: async (studentData: any) => {
    // TODO: Implement real student registration
    console.log('Mock student registration:', studentData);
    return { success: true, student: {} };
  },

  // Funding
  fundProject: async (projectId: string, amount: number) => {
    // TODO: Implement real funding
    console.log('Mock fund project:', projectId, amount);
    return { success: true, transaction: {} };
  },

  // Notifications
  fetchNotifications: async () => {
    // TODO: Implement real notification fetching
    console.log('Mock fetch notifications');
    return { success: true, notifications: [] };
  },
};