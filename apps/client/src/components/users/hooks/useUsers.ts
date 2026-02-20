import { useQuery } from '@tanstack/react-query';

import { usersService } from '../../../services';
import type { User } from '../../../types/users';

const USERS_QUERY_KEY = ['users'];

export const useUsers = () => {
  const {
    data: user,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const user = await usersService.getUser();
      if (user === null) {
        throw new Error('User not found');
      }
      return user;
    },
  });

  return {
    user,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
