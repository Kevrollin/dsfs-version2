import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const authService = {
  // Token management
  setToken: async (token: string) => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },

  removeToken: async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // User data management
  setUserData: async (userData: any) => {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  },

  getUserData: async (): Promise<any | null> => {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  removeUserData: async () => {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  },

  // Authentication check
  isAuthenticated: async (): Promise<boolean> => {
    const token = await authService.getToken();
    return !!token;
  },

  // Logout
  logout: async () => {
    await authService.removeToken();
    await authService.removeUserData();
  },
};