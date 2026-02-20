import { useAuthStore } from '../../../store';
import type { Satellite } from '../../../types/satellite';
import { SatelliteEntity } from './SatelliteEntity';
import { UserLocationEntity } from './UserLocationEntity';

type Props = { satellites: Satellite[] };

export const SatellitesLayer = ({ satellites }: Props) => {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      {satellites.map((satellite) => (
        <SatelliteEntity key={satellite.id} satellite={satellite} />
      ))}
      {user ? <UserLocationEntity user={user} /> : null}
    </>
  );
};
