import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { usersService } from '../services/usersService';

export function useAuthInit() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setError = useAuthStore((s) => s.setError);

  useEffect(() => {
    setLoading(true);
    usersService
      .getMe()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        setError('Failed to fetch user');
        console.error(error);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [setUser, setLoading, setError]);
}
