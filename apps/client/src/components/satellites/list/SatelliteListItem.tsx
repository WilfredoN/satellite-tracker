import { useShallow } from 'zustand/react/shallow';
import { useSatelliteStore } from '../../../store';
import type { Satellite } from '../../../types/satellite';

type DisplayRow =
  | { readonly type: 'satellite'; readonly satellite: Satellite; readonly isDeletable: boolean }
  | { readonly type: 'user'; readonly userId: string; readonly userName: string };

interface SatelliteListItemProps {
  row: DisplayRow;
  onDelete?: (id: string) => void;
}

export const SatelliteListItem = ({ row, onDelete }: SatelliteListItemProps) => {
  const { selectedTarget, selectTarget } = useSatelliteStore(
    useShallow((state) => ({
      selectedTarget: state.selectedTarget,
      selectTarget: state.selectTarget,
    })),
  );

  const isSelected = selectedTarget
    ? row.type === 'satellite'
      ? selectedTarget.type === 'satellite' && selectedTarget.data.id === row.satellite.id
      : selectedTarget.type === 'user' && selectedTarget.userId === row.userId
    : false;

  const handleClick = () => {
    if (row.type === 'satellite') {
      selectTarget({ type: 'satellite', data: row.satellite });
    } else {
      selectTarget({ type: 'user', userId: row.userId, userName: row.userName });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (row.type === 'satellite' && typeof onDelete === 'function') {
      onDelete(row.satellite.id);
    }
  };

  const displayName = row.type === 'satellite' ? row.satellite.name : `User: ${row.userName}`;
  const displayTle1 = row.type === 'satellite' ? row.satellite.tle1 : '';
  const displayTle2 = row.type === 'satellite' ? row.satellite.tle2 : '';
  const showDeleteButton =
    row.type === 'satellite' && row.isDeletable && typeof onDelete === 'function';

  return (
    <li
      className={[
        'border-(--foreground) group relative flex cursor-pointer flex-col border-2 px-3 py-2 transition-all',
        isSelected
          ? 'bg-(--foreground) text-(--background) shadow-(--glow)'
          : 'bg-(--input) hover:bg-(--foreground) hover:text-(--background) hover:shadow-(--glow)',
      ].join(' ')}
      onClick={handleClick}
    >
      <span className="text-base font-bold uppercase tracking-wide">&gt; {displayName}</span>
      <span
        className={
          'mt-1 font-mono text-xs opacity-80 ' +
          (isSelected ? 'opacity-100' : 'group-hover:opacity-100')
        }
      >
        TLE1: {displayTle1}
      </span>
      <span
        className={
          'font-mono text-xs opacity-80 ' + (isSelected ? 'opacity-100' : 'group-hover:opacity-100')
        }
      >
        TLE2: {displayTle2}
      </span>
      {showDeleteButton && (
        <button
          aria-label="Delete satellite"
          onClick={handleDelete}
          className="text-(--destructive) hover:text-(--foreground) absolute right-2 top-2 cursor-pointer text-xl font-bold focus:outline-none"
        >
          ×
        </button>
      )}
    </li>
  );
};
