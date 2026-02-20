import { useEffect } from 'react';

import type { ApiErrorShape } from '../services';
import { usersService } from '../services/usersService';
import { useAuthStore } from '../store/authStore';

export const useAuthInit = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setError = useAuthStore((s) => s.setError);
  const setAuthStatus = useAuthStore((s) => s.setAuthStatus);

  useEffect(() => {
    setLoading(true);
    setAuthStatus('authorizing');
    usersService
      .getMe()
      .then((user) => {
        setUser(user);
        setAuthStatus('authenticated');
      })
      .catch((error: unknown) => {
        if ((error as ApiErrorShape)?.status === 401) {
          setAuthStatus('unauthenticated');
          setUser(null);
        } else {
          setError('Failed to fetch user');
          console.error(error);
          setUser(null);
          setAuthStatus('idle');
        }
      })
      .finally(() => setLoading(false));
  }, [setUser, setLoading, setError, setAuthStatus]);
};
