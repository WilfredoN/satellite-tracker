import { useEffect, useState, useMemo } from 'react';
import { useSatelliteStore, useAuthStore } from '../../../store';
import { getSatellitePosition, getUserPosition, parseTelemetry } from '../helpers/telemetry';
import type { SelectableTarget } from '../../../types/satellite';
type Position = { readonly lat: number; readonly lon: number; readonly alt: number };
const computePosition = (
  target: SelectableTarget | null,
  user: ReturnType<typeof useAuthStore.getState>['user'],
): Position | undefined => {
  if (!target) return undefined;
  if (target.type === 'user') {
    return user ? getUserPosition(user.latitude, user.longitude) : undefined;
  }
  return getSatellitePosition({ tle1: target.data.tle1, tle2: target.data.tle2 });
};
export const SatelliteDetails = () => {
  const selectedTarget = useSatelliteStore((state) => state.selectedTarget);
  const user = useAuthStore((s) => s.user);
  const initialPosition = useMemo(
    () => computePosition(selectedTarget, user),
    [selectedTarget, user],
  );
  const [position, setPosition] = useState<Position | undefined>(initialPosition);
  useEffect(() => {
    const updatePosition = () => {
      const newPos = computePosition(selectedTarget, user);
      setPosition(newPos);
    };
    updatePosition();
    const interval = setInterval(updatePosition, 3000);
    return () => clearInterval(interval);
  }, [selectedTarget, user]);
  if (!selectedTarget) {
    return (
      <div className="border-(--foreground) bg-(--panel-bg) shadow-(--glow) mt-2 flex h-48 items-center justify-center border-2">
        {' '}
        <span className="font-mono text-lg text-green-400 opacity-80">
          {' '}
          Select a satellite to view details{' '}
        </span>{' '}
      </div>
    );
  }
  const displayName =
    selectedTarget.type === 'satellite'
      ? selectedTarget.data.name
      : `User: ${selectedTarget.userName}`;
  const displayId =
    selectedTarget.type === 'satellite' ? selectedTarget.data.id : selectedTarget.userId;
  const telemetry =
    selectedTarget.type === 'satellite'
      ? parseTelemetry({ tle1: selectedTarget.data.tle1, tle2: selectedTarget.data.tle2 })
      : {
          eccentricity: undefined,
          perigee: undefined,
          meanAnomaly: undefined,
          meanMotion: undefined,
          speed: undefined,
        };
  return (
    <div className="border-(--foreground) bg-(--panel-bg) shadow-(--glow) mt-2 border-2 p-4 font-mono text-sm text-green-400">
      {' '}
      <div className="mb-2 text-center text-2xl font-bold">{displayName}</div>{' '}
      <div className="grid grid-cols-4 gap-x-4 gap-y-2">
        {' '}
        <div className="min-w-35">
          {' '}
          <span>ID: {displayId}</span>{' '}
        </div>{' '}
        <div className="min-w-35">
          {' '}
          <span>Eccentricity: {telemetry.eccentricity ?? 'N/A'}</span>{' '}
        </div>{' '}
        <div className="min-w-35">
          {' '}
          <span>Perigee: {telemetry.perigee ?? 'N/A'} km</span>{' '}
        </div>{' '}
        <div className="min-w-35">
          {' '}
          <span>Mean Anomaly: {telemetry.meanAnomaly ?? 'N/A'}°</span>{' '}
        </div>{' '}
        <div className="min-w-35">
          {' '}
          <span>Speed: {telemetry.speed ? telemetry.speed.toFixed(2) : 'N/A'} km/s</span>{' '}
        </div>{' '}
        <div className="min-w-35">
          {' '}
          <span>Latitude: {position ? position.lat.toFixed(4) : 'N/A'}°</span>{' '}
        </div>{' '}
        <div className="min-w-35">
          {' '}
          <span>Longitude: {position ? position.lon.toFixed(4) : 'N/A'}°</span>{' '}
        </div>{' '}
        <div className="min-w-35">
          {' '}
          <span>Altitude: {position ? position.alt.toFixed(0) : 'N/A'} m</span>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
};
