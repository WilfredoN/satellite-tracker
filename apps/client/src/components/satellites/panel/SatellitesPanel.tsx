import { useState } from 'react';

import type { ApiErrorShape } from '../../../services';
import { ISS_PLACEHOLDER } from '../../../services/mocks/placeholderSatellite';
import { useAuthStore } from '../../../store';
import type { Satellite } from '../../../types/satellite';
import { AddSatelliteDialog } from '../dialogs/AddSatelliteDialog';
import { useSatellites } from '../hooks/useSatellites';
import { SatelliteList } from '../list/SatelliteList';
import {
  SatellitesPanelError,
  SatellitesPanelHeader,
  SatellitesPanelLayout,
  SatellitesPanelLoading,
} from '.';

type DisplayRow =
  | { readonly type: 'satellite'; readonly satellite: Satellite; readonly isDeletable: boolean }
  | { readonly type: 'user'; readonly userId: string; readonly userName: string };

export const SatellitesPanel = () => {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const { satellites, isLoading, isFetching, error, addSatellite, refetch, isAuthorizing } =
    useSatellites(search);
  const user = useAuthStore((s) => s.user);

  const buildDisplayRows = (list: Satellite[]): DisplayRow[] => {
    const rows: DisplayRow[] = list.map((sat) => ({
      type: 'satellite' as const,
      satellite: sat,
      isDeletable: sat.id !== ISS_PLACEHOLDER.id,
    }));
    if (user) {
      rows.unshift({
        type: 'user' as const,
        userId: String(user.id),
        userName: user.login,
      });
    }
    return rows;
  };

  const handleAddClick = () => setAddOpen(true);

  return (
    <SatellitesPanelLayout>
      <SatellitesPanelHeader
        search={search}
        onSearchChange={setSearch}
        onAddClick={handleAddClick}
      />
      {isLoading || isFetching ? (
        <SatelliteList
          panel={<SatellitesPanelLoading />}
          rows={buildDisplayRows([ISS_PLACEHOLDER])}
        />
      ) : isAuthorizing ? (
        <SatelliteList
          panel={
            <SatellitesPanelError message={'AUTHORISING — awaiting login'} onRetry={refetch} />
          }
          rows={buildDisplayRows([ISS_PLACEHOLDER])}
        />
      ) : error ? (
        <SatelliteList
          panel={
            <SatellitesPanelError
              onRetry={refetch}
              message={String(
                (error as unknown as ApiErrorShape)?.message || 'SATELLITE DATA UNAVAILABLE',
              )}
            />
          }
          rows={buildDisplayRows([ISS_PLACEHOLDER])}
        />
      ) : (
        <SatelliteList rows={buildDisplayRows(satellites ?? [])} />
      )}
      <AddSatelliteDialog open={addOpen} onOpenChange={setAddOpen} onAdd={addSatellite} />
    </SatellitesPanelLayout>
  );
};
