import { useState } from 'react';
import {
  SatellitesPanelLayout,
  SatellitesPanelHeader,
  SatellitesPanelLoading,
  SatellitesPanelError,
} from '.';
import { SatelliteList } from '../list/SatelliteList';
import { useSatellites } from '../hooks/useSatellites';
import { AddSatelliteDialog } from '../dialogs/AddSatelliteDialog';
import { ISS_PLACEHOLDER } from '../../../services/mocks/placeholderSatellite';
import { useAuthStore } from '../../../store';
import type { Satellite } from '../../../types/satellite';

type DisplayRow =
  | { readonly type: 'satellite'; readonly satellite: Satellite; readonly isDeletable: boolean }
  | { readonly type: 'user'; readonly userId: string; readonly userName: string };

export const SatellitesPanel = () => {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const { satellites, isLoading, isFetching, error, addSatellite, refetch } = useSatellites(search);
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
      ) : error ? (
        <SatelliteList
          panel={<SatellitesPanelError onRetry={refetch} />}
          rows={buildDisplayRows([ISS_PLACEHOLDER])}
        />
      ) : (
        <SatelliteList rows={buildDisplayRows(satellites ?? [])} />
      )}
      <AddSatelliteDialog open={addOpen} onOpenChange={setAddOpen} onAdd={addSatellite} />
    </SatellitesPanelLayout>
  );
};
