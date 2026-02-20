import { useShallow } from 'zustand/react/shallow';

import { useSatelliteStore } from '../../../store';
import type { Satellite } from '../../../types/satellite';
import { useSatellites } from '../hooks/useSatellites';
import { NoSatellites } from './NoSatellites';
import { SatelliteListItem } from './SatelliteListItem';

type DisplayRow =
  | { readonly type: 'satellite'; readonly satellite: Satellite; readonly isDeletable: boolean }
  | { readonly type: 'user'; readonly userId: string; readonly userName: string };

type SatelliteListProps = {
  rows: DisplayRow[];
  panel?: React.ReactNode;
};

export const SatelliteList = ({ rows, panel }: SatelliteListProps) => {
  const { clearSelection } = useSatelliteStore(
    useShallow((state) => ({
      clearSelection: state.clearSelection,
    })),
  );

  const resetSelectionOnClick = (e: React.MouseEvent<HTMLUListElement>) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  const { removeSatellite } = useSatellites();

  const getRowKey = (row: DisplayRow): string =>
    row.type === 'satellite' ? row.satellite.id : `user-${row.userId}`;

  return (
    <ul className="flex-1 space-y-2 overflow-y-auto" onClick={resetSelectionOnClick}>
      {panel && <li>{panel}</li>}
      {rows.length === 0 ? (
        <NoSatellites />
      ) : (
        rows.map((row) => (
          <SatelliteListItem key={getRowKey(row)} row={row} onDelete={removeSatellite} />
        ))
      )}
    </ul>
  );
};
