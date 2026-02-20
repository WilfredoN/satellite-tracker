import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import type { ApiErrorShape } from '../../../services';
import { ISS_PLACEHOLDER } from '../../../services/mocks/placeholderSatellite';
import { satelliteService } from '../../../services/satelliteService';
import type { AddSatelliteData, Satellite } from '../../../types/satellite';

const SATELLITES_QUERY_KEY = ['satellites'];

export const useSatellites = (filter: string = '', usePlaceholder = true) => {
  const queryClient = useQueryClient();

  const {
    data: satellites = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<Satellite[]>({
    queryKey: [...SATELLITES_QUERY_KEY, filter.trim().toLowerCase() || 'all'],
    queryFn: satelliteService.getAll,
    select: (data) =>
      filter.trim()
        ? data.filter((satellite) =>
            satellite.name.toLowerCase().includes(filter.trim().toLowerCase()),
          )
        : data,
    placeholderData: usePlaceholder ? [ISS_PLACEHOLDER] : [],
    retry: 5,
    retryDelay: (attempt) => Math.min(2 ** attempt * 1000, 30000),
  });

  const addMutation = useMutation({
    mutationFn: satelliteService.add,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SATELLITES_QUERY_KEY }),
  });

  const removeMutation = useMutation({
    mutationFn: satelliteService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SATELLITES_QUERY_KEY }),
  });

  const addSatellite = useCallback(
    (data: AddSatelliteData) => {
      addMutation.mutate(data);
    },
    [addMutation],
  );

  const removeSatellite = useCallback(
    (id: string) => {
      removeMutation.mutate(id);
    },
    [removeMutation],
  );

  return {
    satellites,
    isLoading,
    isFetching,
    error,
    isAuthorizing: (error as unknown as ApiErrorShape)?.status === 401,
    addSatellite,
    addMutation,
    removeSatellite,
    refetch,
  };
};
