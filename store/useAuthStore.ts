import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isVerified: boolean;
  isStudent: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isStudentRegistered: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  registerAsStudent: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: {
    id: '1',
    username: 'current_user',
    name: 'Current User',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Welcome to DSFS!',
    followers: 0,
    following: 0,
    isVerified: false,
    isStudent: false,
  },
  isAuthenticated: true, // Mock authenticated state
  isStudentRegistered: false,

  login: async (username: string, password: string) => {
    // TODO: Replace with real authentication
    console.log('Mock login:', username, password);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    set({
      isAuthenticated: true,
      user: {
        id: '1',
        username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Welcome to DSFS!',
        followers: 0,
        following: 0,
        isVerified: false,
        isStudent: false,
      },
    });
    
    return true;
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isStudentRegistered: false,
    });
    AsyncStorage.removeItem('auth_token');
  },

  updateProfile: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: { ...currentUser, ...updates },
      });
    }
  },

  registerAsStudent: () => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        isStudentRegistered: true,
        user: { ...currentUser, isStudent: true },
      });
    }
  },
}));