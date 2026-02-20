import { create } from 'zustand';

import type { User } from '../types/users';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  /**
   * 'idle' | 'authorizing' | 'unauthenticated' | 'authenticated'
   */
  authStatus: string;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthStatus: (status: string) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  authStatus: 'idle',
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setAuthStatus: (status) => set({ authStatus: status }),
  setError: (error) => set({ error }),
}));
