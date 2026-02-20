import type { User } from '../types/users';
import { API_URL } from '.';

export const usersService = {
  async getUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.user)) {
        return data.user[0] ?? null;
      }
      return data.user as User;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  },

  async getMe(): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      return data as User;
    } catch (error: unknown) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  },
};
