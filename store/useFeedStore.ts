import { create } from 'zustand';
import { mockPosts } from '../mock/posts.js';
import { mockUsers } from '../mock/users.js';

interface Post {
  id: string;
  userId: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  isFundable: boolean;
  fundingGoal: number;
  currentFunding: number;
  user?: any;
}

interface FeedState {
  posts: Post[];
  loading: boolean;
  refreshPosts: () => Promise<void>;
  likePost: (postId: string) => void;
  fundPost: (postId: string, amount: number) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: mockPosts.map(post => ({
    ...post,
    user: mockUsers.find(user => user.id === post.userId),
  })),
  loading: false,

  refreshPosts: async () => {
    set({ loading: true });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Replace with real API call
    const postsWithUsers = mockPosts.map(post => ({
      ...post,
      user: mockUsers.find(user => user.id === post.userId),
    }));
    
    set({ posts: postsWithUsers, loading: false });
  },

  likePost: (postId) => {
    const posts = get().posts;
    const updatedPosts = posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    set({ posts: updatedPosts });
  },

  fundPost: (postId, amount) => {
    const posts = get().posts;
    const updatedPosts = posts.map(post =>
      post.id === postId 
        ? { ...post, currentFunding: post.currentFunding + amount }
        : post
    );
    set({ posts: updatedPosts });
  },
}));